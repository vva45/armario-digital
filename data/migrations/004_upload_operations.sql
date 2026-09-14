-- Aplicar después de 003. Es también la transición para instalaciones donde 003
-- ya se aplicó: no renombra firmas, no borra datos y añade el registro operativo.
-- Si un entorno alcanzó una variante de 003 con `p_garment_id`, sustituimos la
-- función de forma explícita (sin CASCADE) y restauramos el permiso mínimo.
drop function if exists wardrobe_delete(uuid);
create function wardrobe_delete(garment_id uuid) returns text[] language plpgsql security invoker set search_path=public as $$
declare paths text[];
begin
  select array_agg(i.private_path) into paths from wardrobe_images i where i.garment_id=wardrobe_delete.garment_id and i.owner_id=auth.uid();
  delete from wardrobe_garments g where g.id=wardrobe_delete.garment_id and g.owner_id=auth.uid();
  if not found then raise exception 'Prenda no autorizada'; end if;
  return coalesce(paths,array[]::text[]);
end $$;
revoke all on function wardrobe_delete(uuid) from public,anon;
grant execute on function wardrobe_delete(uuid) to authenticated;

create table if not exists wardrobe_operations (
  id uuid not null,
  owner_id uuid not null references auth.users(id) on delete cascade,
  garment_id uuid not null,
  kind text not null check (kind in ('create','update')),
  manifest jsonb not null,
  state text not null default 'pending' check (state in ('pending','confirmed','cleaning')),
  result jsonb,
  created_at timestamptz not null default now(),
  primary key (owner_id,id)
);
alter table wardrobe_operations enable row level security;
revoke all on wardrobe_operations from public, anon;
grant select on wardrobe_operations to authenticated;
create policy operations_select on wardrobe_operations for select to authenticated using(owner_id=auth.uid());

create or replace function wardrobe_authorize_upload(p_operation_id uuid, p_garment_id uuid, p_images jsonb)
returns jsonb language plpgsql security invoker set search_path=public as $$
declare op wardrobe_operations%rowtype; selected_garment uuid := coalesce(p_garment_id,gen_random_uuid()); expected jsonb; item jsonb;
begin
  if auth.uid() is null then raise exception 'No autenticado'; end if;
  if jsonb_typeof(p_images)<>'array' or jsonb_array_length(p_images) not between 1 and 2 then raise exception 'Fotografías inválidas'; end if;
  if p_garment_id is not null and not exists(select 1 from wardrobe_garments g where g.id=p_garment_id and g.owner_id=auth.uid()) then raise exception 'Prenda no autorizada'; end if;
  for item in select * from jsonb_array_elements(p_images) loop
    if item->>'side' not in ('frontal','trasera') or item->>'type' not in ('image/jpeg','image/png','image/webp')
       or (item->>'size')::bigint not between 1 and 8388608 then raise exception 'Metadatos inválidos'; end if;
  end loop;
  if (select count(distinct x->>'side') from jsonb_array_elements(p_images) x) <> jsonb_array_length(p_images) then raise exception 'Lados duplicados'; end if;
  expected := (select jsonb_agg(jsonb_build_object('side',x->>'side','type',x->>'type','size',(x->>'size')::bigint) order by x->>'side') from jsonb_array_elements(p_images) x);
  insert into wardrobe_operations(id,owner_id,garment_id,kind,manifest)
    values(p_operation_id,auth.uid(),selected_garment,case when p_garment_id is null then 'create' else 'update' end,expected)
    on conflict(owner_id,id) do nothing;
  select * into op from wardrobe_operations where owner_id=auth.uid() and id=p_operation_id for update;
  if op.garment_id<>selected_garment and p_garment_id is not null or op.kind<>case when p_garment_id is null then 'create' else 'update' end or op.manifest<>expected or op.state<>'pending' then raise exception 'Operación incompatible'; end if;
  return jsonb_build_object('operation_id',op.id,'garment_id',op.garment_id,'images',
    (select jsonb_agg(x || jsonb_build_object('path',auth.uid()::text||'/'||op.garment_id::text||'/'||op.id::text||'/'||(x->>'side')) order by x->>'side') from jsonb_array_elements(op.manifest) x));
end $$;

create or replace function wardrobe_operation_status(p_operation_id uuid,p_garment_id uuid)
returns jsonb language sql security invoker set search_path=public stable as $$
  select jsonb_build_object('state',o.state,'result',o.result) from wardrobe_operations o
  where o.owner_id=auth.uid() and o.id=p_operation_id and o.garment_id=p_garment_id
$$;

create or replace function wardrobe_abandon_operation(p_operation_id uuid,p_garment_id uuid)
returns text[] language plpgsql security invoker set search_path=public as $$
declare op wardrobe_operations%rowtype; paths text[];
begin
  select * into op from wardrobe_operations where owner_id=auth.uid() and id=p_operation_id and garment_id=p_garment_id for update;
  if not found then raise exception 'Operación no autorizada'; end if;
  if op.state='confirmed' then return array[]::text[]; end if;
  update wardrobe_operations set state='cleaning' where owner_id=auth.uid() and id=p_operation_id;
  select coalesce(array_agg(auth.uid()::text||'/'||op.garment_id::text||'/'||op.id::text||'/'||(x->>'side')),array[]::text[]) into paths
    from jsonb_array_elements(op.manifest) x
    where not exists(select 1 from wardrobe_images i where i.owner_id=auth.uid() and i.private_path=auth.uid()::text||'/'||op.garment_id::text||'/'||op.id::text||'/'||(x->>'side'));
  return paths;
end $$;

-- 003 introdujo p_operation_id, pero no lo hacía idempotente. Estas versiones
-- bloquean la fila operativa; una segunda petición devuelve exactamente result.
create or replace function wardrobe_create(
  p_garment_id uuid,p_operation_id uuid,p_garment_title text,p_category_name text,p_garment_uses text[],p_garment_note text,
  p_front_path text,p_back_path text,p_front_type text,p_front_size bigint,p_back_type text,p_back_size bigint
) returns jsonb language plpgsql security invoker set search_path=public as $$
declare op wardrobe_operations%rowtype; category_uuid uuid; requested_use text; answer jsonb;
begin
  select * into op from wardrobe_operations where owner_id=auth.uid() and id=p_operation_id and garment_id=p_garment_id and kind='create' for update;
  if not found or op.state='cleaning' then raise exception 'Operación no autorizada'; end if;
  if op.state='confirmed' then return op.result; end if;
  if cardinality(p_garment_uses)<1 or ('trabajo'=any(p_garment_uses) and cardinality(p_garment_uses)>1) then raise exception 'Usos inválidos'; end if;
  category_uuid:=wardrobe_category(p_category_name);
  insert into wardrobe_garments(id,owner_id,title,category_id,note,creation_operation_id) values(p_garment_id,auth.uid(),trim(p_garment_title),category_uuid,p_garment_note,p_operation_id);
  foreach requested_use in array p_garment_uses loop insert into wardrobe_garment_uses values(p_garment_id,requested_use); end loop;
  insert into wardrobe_images(garment_id,owner_id,side,private_path,content_type,byte_size) values(p_garment_id,auth.uid(),'frontal',p_front_path,p_front_type,p_front_size);
  if p_back_path is not null then insert into wardrobe_images(garment_id,owner_id,side,private_path,content_type,byte_size) values(p_garment_id,auth.uid(),'trasera',p_back_path,p_back_type,p_back_size); end if;
  select jsonb_build_object('id',g.id,'title',g.title,'category',c.name,'uses',(select jsonb_agg(u.use) from wardrobe_garment_uses u where u.garment_id=g.id),'note',g.note,'favorite',g.favorite,'pinned',false,'images',(select jsonb_agg(jsonb_build_object('side',i.side,'reference',i.private_path) order by i.side) from wardrobe_images i where i.garment_id=g.id)) into answer from wardrobe_garments g join wardrobe_categories c on c.id=g.category_id where g.id=p_garment_id;
  update wardrobe_operations set state='confirmed',result=answer where owner_id=auth.uid() and id=p_operation_id; return answer;
end $$;

create or replace function wardrobe_update(
 p_garment_id uuid,p_operation_id uuid default null,p_garment_title text default null,p_category_name text default null,p_garment_uses text[] default null,p_garment_note text default null,p_garment_favorite boolean default null,p_new_front_path text default null,p_new_back_path text default null,p_front_type text default null,p_front_size bigint default null,p_back_type text default null,p_back_size bigint default null
) returns jsonb language plpgsql security invoker set search_path=public as $$
declare op wardrobe_operations%rowtype; category_uuid uuid; old_front text; old_back text; requested_use text; answer jsonb;
begin
 if not exists(select 1 from wardrobe_garments g where g.id=p_garment_id and g.owner_id=auth.uid()) then raise exception 'Prenda no autorizada'; end if;
 if p_operation_id is not null then select * into op from wardrobe_operations where owner_id=auth.uid() and id=p_operation_id and garment_id=p_garment_id and kind='update' for update; if not found or op.state='cleaning' then raise exception 'Operación no autorizada'; end if; if op.state='confirmed' then return op.result; end if; end if;
 if p_garment_uses is not null and (cardinality(p_garment_uses)<1 or ('trabajo'=any(p_garment_uses) and cardinality(p_garment_uses)>1)) then raise exception 'Usos inválidos'; end if;
 if p_category_name is not null then category_uuid:=wardrobe_category(p_category_name); end if;
 update wardrobe_garments g set title=coalesce(p_garment_title,g.title),category_id=coalesce(category_uuid,g.category_id),note=case when p_garment_note='__ARMARIO_NULL__' then null when p_garment_note is not null then p_garment_note else g.note end,favorite=coalesce(p_garment_favorite,g.favorite) where g.id=p_garment_id;
 if p_garment_uses is not null then delete from wardrobe_garment_uses where garment_id=p_garment_id; foreach requested_use in array p_garment_uses loop insert into wardrobe_garment_uses values(p_garment_id,requested_use); end loop; end if;
 if p_new_front_path is not null then select private_path into old_front from wardrobe_images where garment_id=p_garment_id and side='frontal'; update wardrobe_images set private_path=p_new_front_path,content_type=p_front_type,byte_size=p_front_size where garment_id=p_garment_id and side='frontal'; end if;
 if p_new_back_path is not null then select private_path into old_back from wardrobe_images where garment_id=p_garment_id and side='trasera'; insert into wardrobe_images(garment_id,owner_id,side,private_path,content_type,byte_size) values(p_garment_id,auth.uid(),'trasera',p_new_back_path,p_back_type,p_back_size) on conflict(garment_id,side) do update set private_path=excluded.private_path,content_type=excluded.content_type,byte_size=excluded.byte_size; end if;
 answer:=jsonb_build_object('obsolete_paths',array_remove(array[old_front,old_back],null)); if p_operation_id is not null then update wardrobe_operations set state='confirmed',result=answer where owner_id=auth.uid() and id=p_operation_id; end if; return answer;
end $$;

revoke all on function wardrobe_authorize_upload(uuid,uuid,jsonb),wardrobe_operation_status(uuid,uuid),wardrobe_abandon_operation(uuid,uuid) from public,anon;
grant execute on function wardrobe_authorize_upload(uuid,uuid,jsonb),wardrobe_operation_status(uuid,uuid),wardrobe_abandon_operation(uuid,uuid) to authenticated;
