-- Corrección incremental del inventario. Aplicar después de 001 y 002.
-- No borra datos. Revoca las RPC antiguas y añade operaciones idempotentes.
alter table wardrobe_garments add column if not exists creation_operation_id uuid;
create unique index if not exists wardrobe_garments_owner_creation_operation_key
  on wardrobe_garments(owner_id, creation_operation_id) where creation_operation_id is not null;

create or replace function wardrobe_validate_uses() returns trigger language plpgsql as $$
declare
  target_id uuid := coalesce(new.garment_id, old.garment_id);
  total_count integer;
  work_count integer;
begin
  -- La cascada de una prenda eliminada no debe impedir su borrado.
  if not exists (select 1 from wardrobe_garments g where g.id = target_id) then return null; end if;
  select count(*), count(*) filter (where gu.use = 'trabajo')
    into total_count, work_count from wardrobe_garment_uses gu where gu.garment_id = target_id;
  if total_count < 1 then raise exception 'Cada prenda existente requiere al menos un uso'; end if;
  if work_count > 0 and total_count > 1 then raise exception 'Trabajo es exclusivo'; end if;
  return null;
end $$;

create or replace function wardrobe_validate_front() returns trigger language plpgsql as $$
declare target_id uuid;
begin
  target_id := case when tg_table_name = 'wardrobe_garments' then coalesce(new.id, old.id) else coalesce(new.garment_id, old.garment_id) end;
  if not exists (select 1 from wardrobe_garments g where g.id = target_id) then return null; end if;
  if not exists (select 1 from wardrobe_images i where i.garment_id = target_id and i.side = 'frontal') then
    raise exception 'Cada prenda existente requiere una fotografía frontal';
  end if;
  return null;
end $$;
drop trigger if exists wardrobe_front_consistency on wardrobe_images;
create constraint trigger wardrobe_front_consistency after insert or update or delete on wardrobe_images
  deferrable initially deferred for each row execute function wardrobe_validate_front();
drop trigger if exists wardrobe_garment_front_consistency on wardrobe_garments;
create constraint trigger wardrobe_garment_front_consistency after insert or update on wardrobe_garments
  deferrable initially deferred for each row execute function wardrobe_validate_front();

revoke execute on function wardrobe_create(uuid,text,text,text[],text,text,text,text,bigint,text,bigint) from authenticated;
revoke execute on function wardrobe_update(uuid,text,text,text[],text,boolean,text,text,text,bigint,text,bigint) from authenticated;

create or replace function wardrobe_create(
  p_garment_id uuid, p_operation_id uuid, p_garment_title text, p_category_name text,
  p_garment_uses text[], p_garment_note text, p_front_path text, p_back_path text,
  p_front_type text, p_front_size bigint, p_back_type text, p_back_size bigint
) returns jsonb language plpgsql security invoker set search_path=public as $$
declare category_uuid uuid; selected_id uuid; requested_use text;
begin
  if auth.uid() is null then raise exception 'No autenticado'; end if;
  select g.id into selected_id from wardrobe_garments g
    where g.owner_id = auth.uid() and (g.id = p_garment_id or g.creation_operation_id = p_operation_id);
  if selected_id is not null then
    if selected_id <> p_garment_id then raise exception 'Operación ya usada'; end if;
  else
    if cardinality(p_garment_uses) < 1 or ('trabajo'=any(p_garment_uses) and cardinality(p_garment_uses)>1) then raise exception 'Usos inválidos'; end if;
    category_uuid := wardrobe_category(p_category_name);
    insert into wardrobe_garments(id,owner_id,title,category_id,note,creation_operation_id)
      values(p_garment_id,auth.uid(),trim(p_garment_title),category_uuid,p_garment_note,p_operation_id);
    foreach requested_use in array p_garment_uses loop
      insert into wardrobe_garment_uses(garment_id,use) values(p_garment_id,requested_use);
    end loop;
    insert into wardrobe_images(garment_id,owner_id,side,private_path,content_type,byte_size)
      values(p_garment_id,auth.uid(),'frontal',p_front_path,p_front_type,p_front_size);
    if p_back_path is not null then
      insert into wardrobe_images(garment_id,owner_id,side,private_path,content_type,byte_size)
        values(p_garment_id,auth.uid(),'trasera',p_back_path,p_back_type,p_back_size);
    end if;
    selected_id := p_garment_id;
  end if;
  return (select jsonb_build_object('id',g.id,'title',g.title,'category',c.name,
    'uses',(select jsonb_agg(gu.use) from wardrobe_garment_uses gu where gu.garment_id=g.id),
    'note',g.note,'favorite',g.favorite,'pinned',false,
    'images',(select jsonb_agg(jsonb_build_object('side',i.side,'reference',i.private_path) order by i.side) from wardrobe_images i where i.garment_id=g.id))
    from wardrobe_garments g join wardrobe_categories c on c.id=g.category_id
    where g.id=selected_id and g.owner_id=auth.uid());
end $$;

create or replace function wardrobe_update(
  p_garment_id uuid, p_operation_id uuid default null, p_garment_title text default null,
  p_category_name text default null, p_garment_uses text[] default null, p_garment_note text default null,
  p_garment_favorite boolean default null, p_new_front_path text default null, p_new_back_path text default null,
  p_front_type text default null, p_front_size bigint default null, p_back_type text default null, p_back_size bigint default null
) returns jsonb language plpgsql security invoker set search_path=public as $$
declare category_uuid uuid; old_front text; old_back text; requested_use text;
begin
  if not exists(select 1 from wardrobe_garments g where g.id=p_garment_id and g.owner_id=auth.uid()) then raise exception 'Prenda no autorizada'; end if;
  if p_garment_uses is not null and (cardinality(p_garment_uses)<1 or ('trabajo'=any(p_garment_uses) and cardinality(p_garment_uses)>1)) then raise exception 'Usos inválidos'; end if;
  if p_category_name is not null then category_uuid:=wardrobe_category(p_category_name); end if;
  update wardrobe_garments g set title=coalesce(p_garment_title,g.title),category_id=coalesce(category_uuid,g.category_id),
    note=case when p_garment_note='__ARMARIO_NULL__' then null when p_garment_note is not null then p_garment_note else g.note end,
    favorite=coalesce(p_garment_favorite,g.favorite) where g.id=p_garment_id and g.owner_id=auth.uid();
  if p_garment_uses is not null then
    delete from wardrobe_garment_uses gu where gu.garment_id=p_garment_id;
    foreach requested_use in array p_garment_uses loop insert into wardrobe_garment_uses(garment_id,use) values(p_garment_id,requested_use); end loop;
  end if;
  if p_new_front_path is not null then
    select i.private_path into old_front from wardrobe_images i where i.garment_id=p_garment_id and i.side='frontal';
    update wardrobe_images i set private_path=p_new_front_path,content_type=p_front_type,byte_size=p_front_size where i.garment_id=p_garment_id and i.side='frontal';
  end if;
  if p_new_back_path is not null then
    select i.private_path into old_back from wardrobe_images i where i.garment_id=p_garment_id and i.side='trasera';
    insert into wardrobe_images(garment_id,owner_id,side,private_path,content_type,byte_size)
      values(p_garment_id,auth.uid(),'trasera',p_new_back_path,p_back_type,p_back_size)
      on conflict(garment_id,side) do update set private_path=excluded.private_path,content_type=excluded.content_type,byte_size=excluded.byte_size;
  end if;
  return jsonb_build_object('obsolete_paths',array_remove(array[old_front,old_back],null));
end $$;

create or replace function wardrobe_delete(p_garment_id uuid) returns text[] language plpgsql security invoker set search_path=public as $$
declare paths text[];
begin
  select array_agg(i.private_path) into paths from wardrobe_images i where i.garment_id=p_garment_id and i.owner_id=auth.uid();
  delete from wardrobe_garments g where g.id=p_garment_id and g.owner_id=auth.uid();
  if not found then raise exception 'Prenda no autorizada'; end if;
  return coalesce(paths,array[]::text[]);
end $$;

revoke all on function wardrobe_create(uuid,uuid,text,text,text[],text,text,text,text,bigint,text,bigint), wardrobe_update(uuid,uuid,text,text,text[],text,boolean,text,text,text,bigint,text,bigint), wardrobe_delete(uuid) from public, anon;
grant execute on function wardrobe_create(uuid,uuid,text,text,text[],text,text,text,text,bigint,text,bigint), wardrobe_update(uuid,uuid,text,text,text[],text,boolean,text,text,text,bigint,text,bigint), wardrobe_delete(uuid) to authenticated;
