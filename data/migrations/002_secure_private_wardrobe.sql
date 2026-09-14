-- Corrección incremental de 001: ejecutar después de 001 sin borrar datos.
-- Requiere Supabase Auth y Storage. Todas las operaciones normales usan auth.uid().
create extension if not exists pgcrypto;
alter table wardrobe_categories alter column id set default gen_random_uuid();
alter table wardrobe_categories add constraint wardrobe_categories_owner_auth foreign key (owner_id) references auth.users(id) on delete cascade;
alter table wardrobe_categories add constraint wardrobe_categories_owner_id_id_key unique (owner_id, id);
alter table wardrobe_garments alter column id set default gen_random_uuid();
alter table wardrobe_garments add constraint wardrobe_garments_owner_auth foreign key (owner_id) references auth.users(id) on delete cascade;
alter table wardrobe_garments add constraint wardrobe_garments_owner_id_id_key unique (owner_id, id);
alter table wardrobe_garments add constraint wardrobe_garments_category_owner_fk foreign key (owner_id, category_id) references wardrobe_categories(owner_id, id);
alter table wardrobe_images alter column id set default gen_random_uuid();
alter table wardrobe_images add column if not exists owner_id uuid;
update wardrobe_images i set owner_id = g.owner_id from wardrobe_garments g where g.id = i.garment_id and i.owner_id is null;
alter table wardrobe_images alter column owner_id set not null;
alter table wardrobe_images add column if not exists content_type text;
alter table wardrobe_images add column if not exists byte_size bigint;
alter table wardrobe_images add constraint wardrobe_images_owner_auth foreign key (owner_id) references auth.users(id) on delete cascade;
alter table wardrobe_images add constraint wardrobe_images_garment_owner_fk foreign key (owner_id, garment_id) references wardrobe_garments(owner_id, id) on delete cascade;
alter table wardrobe_images add constraint wardrobe_images_path_owner check (private_path like owner_id::text || '/%');
alter table wardrobe_images add constraint wardrobe_images_size check (byte_size is null or byte_size between 1 and 8388608);
alter table wardrobe_images add constraint wardrobe_images_type check (content_type is null or content_type in ('image/jpeg','image/png','image/webp'));

create or replace function wardrobe_validate_uses() returns trigger language plpgsql as $$
declare target uuid := coalesce(new.garment_id, old.garment_id); total integer; work integer;
begin select count(*), count(*) filter (where use='trabajo') into total, work from wardrobe_garment_uses where garment_id=target;
  if tg_op='DELETE' then null; end if;
  if total < 1 then raise exception 'Cada prenda requiere al menos un uso'; end if;
  if work > 0 and total > 1 then raise exception 'Trabajo es exclusivo'; end if; return null;
end $$;
drop trigger if exists wardrobe_uses_consistency on wardrobe_garment_uses;
create constraint trigger wardrobe_uses_consistency after insert or update or delete on wardrobe_garment_uses deferrable initially deferred for each row execute function wardrobe_validate_uses();

alter table wardrobe_categories enable row level security;
alter table wardrobe_garments enable row level security;
alter table wardrobe_garment_uses enable row level security;
alter table wardrobe_images enable row level security;
revoke all on wardrobe_categories, wardrobe_garments, wardrobe_garment_uses, wardrobe_images from anon;
grant select, insert, update, delete on wardrobe_categories, wardrobe_garments, wardrobe_garment_uses, wardrobe_images to authenticated;

create policy categories_select on wardrobe_categories for select to authenticated using (owner_id=auth.uid());
create policy categories_insert on wardrobe_categories for insert to authenticated with check (owner_id=auth.uid());
create policy categories_update on wardrobe_categories for update to authenticated using (owner_id=auth.uid()) with check (owner_id=auth.uid());
create policy categories_delete on wardrobe_categories for delete to authenticated using (owner_id=auth.uid());
create policy garments_select on wardrobe_garments for select to authenticated using (owner_id=auth.uid());
create policy garments_insert on wardrobe_garments for insert to authenticated with check (owner_id=auth.uid());
create policy garments_update on wardrobe_garments for update to authenticated using (owner_id=auth.uid()) with check (owner_id=auth.uid());
create policy garments_delete on wardrobe_garments for delete to authenticated using (owner_id=auth.uid());
create policy uses_select on wardrobe_garment_uses for select to authenticated using (exists(select 1 from wardrobe_garments g where g.id=garment_id and g.owner_id=auth.uid()));
create policy uses_insert on wardrobe_garment_uses for insert to authenticated with check (exists(select 1 from wardrobe_garments g where g.id=garment_id and g.owner_id=auth.uid()));
create policy uses_update on wardrobe_garment_uses for update to authenticated using (exists(select 1 from wardrobe_garments g where g.id=garment_id and g.owner_id=auth.uid())) with check (exists(select 1 from wardrobe_garments g where g.id=garment_id and g.owner_id=auth.uid()));
create policy uses_delete on wardrobe_garment_uses for delete to authenticated using (exists(select 1 from wardrobe_garments g where g.id=garment_id and g.owner_id=auth.uid()));
create policy images_select on wardrobe_images for select to authenticated using (owner_id=auth.uid());
create policy images_insert on wardrobe_images for insert to authenticated with check (owner_id=auth.uid() and private_path like auth.uid()::text||'/%');
create policy images_update on wardrobe_images for update to authenticated using (owner_id=auth.uid()) with check (owner_id=auth.uid() and private_path like auth.uid()::text||'/%');
create policy images_delete on wardrobe_images for delete to authenticated using (owner_id=auth.uid());

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values ('wardrobe-private','wardrobe-private',false,8388608,array['image/jpeg','image/png','image/webp']) on conflict(id) do update set public=false,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
create policy wardrobe_storage_select on storage.objects for select to authenticated using (bucket_id='wardrobe-private' and (storage.foldername(name))[1]=auth.uid()::text);
create policy wardrobe_storage_insert on storage.objects for insert to authenticated with check (bucket_id='wardrobe-private' and (storage.foldername(name))[1]=auth.uid()::text);
create policy wardrobe_storage_update on storage.objects for update to authenticated using (bucket_id='wardrobe-private' and (storage.foldername(name))[1]=auth.uid()::text) with check (bucket_id='wardrobe-private' and (storage.foldername(name))[1]=auth.uid()::text);
create policy wardrobe_storage_delete on storage.objects for delete to authenticated using (bucket_id='wardrobe-private' and (storage.foldername(name))[1]=auth.uid()::text);

create or replace function wardrobe_category(category_name text) returns uuid language plpgsql security invoker set search_path=public as $$
declare category_id uuid; normalized text := lower(regexp_replace(translate(trim(category_name),'ÁÉÍÓÚÜÑáéíóúüñ','AEIOUUNaeiouun'),'\s+',' ','g'));
begin if normalized='' then raise exception 'Categoría vacía'; end if;
 insert into wardrobe_categories(owner_id,name,normalized_name) values(auth.uid(),trim(category_name),normalized) on conflict(owner_id,normalized_name) do update set name=wardrobe_categories.name returning id into category_id; return category_id; end $$;
create or replace function wardrobe_create(garment_id uuid, garment_title text, category_name text, garment_uses text[], garment_note text, front_path text, back_path text, front_type text, front_size bigint, back_type text, back_size bigint) returns jsonb language plpgsql security invoker set search_path=public as $$
declare cid uuid; u text;
begin if auth.uid() is null then raise exception 'No autenticado'; end if; if cardinality(garment_uses)<1 or ('trabajo'=any(garment_uses) and cardinality(garment_uses)>1) then raise exception 'Usos inválidos'; end if;
 cid:=wardrobe_category(category_name); insert into wardrobe_garments(id,owner_id,title,category_id,note) values(garment_id,auth.uid(),trim(garment_title),cid,garment_note);
 foreach u in array garment_uses loop insert into wardrobe_garment_uses values(garment_id,u); end loop;
 insert into wardrobe_images(garment_id,owner_id,side,private_path,content_type,byte_size) values(garment_id,auth.uid(),'frontal',front_path,front_type,front_size);
 if back_path is not null then insert into wardrobe_images(garment_id,owner_id,side,private_path,content_type,byte_size) values(garment_id,auth.uid(),'trasera',back_path,back_type,back_size); end if;
 return (select jsonb_build_object('id',g.id,'title',g.title,'category',c.name,'uses',(select jsonb_agg(gu.use) from wardrobe_garment_uses gu where gu.garment_id=g.id),'note',g.note,'favorite',g.favorite,'pinned',false,'images',(select jsonb_agg(jsonb_build_object('side',i.side,'reference',i.private_path) order by i.side) from wardrobe_images i where i.garment_id=g.id)) from wardrobe_garments g join wardrobe_categories c on c.id=g.category_id where g.id=garment_id); end $$;
create or replace function wardrobe_list(requested_use text) returns setof jsonb language sql security invoker set search_path=public stable as $$ select jsonb_build_object('id',g.id,'title',g.title,'category',c.name,'uses',(select jsonb_agg(u.use) from wardrobe_garment_uses u where u.garment_id=g.id),'note',g.note,'favorite',g.favorite,'pinned',false,'images',(select jsonb_agg(jsonb_build_object('side',i.side,'reference',i.private_path) order by i.side) from wardrobe_images i where i.garment_id=g.id)) from wardrobe_garments g join wardrobe_categories c on c.id=g.category_id where g.owner_id=auth.uid() and exists(select 1 from wardrobe_garment_uses u where u.garment_id=g.id and u.use=requested_use) order by g.created_at desc $$;
create or replace function wardrobe_update(garment_id uuid, garment_title text default null, category_name text default null, garment_uses text[] default null, garment_note text default null, garment_favorite boolean default null, new_front_path text default null, new_back_path text default null, front_type text default null, front_size bigint default null, back_type text default null, back_size bigint default null) returns jsonb language plpgsql security invoker set search_path=public as $$
declare cid uuid; old_front text; old_back text; u text;
begin if not exists(select 1 from wardrobe_garments where id=garment_id and owner_id=auth.uid()) then raise exception 'Prenda no autorizada'; end if;
 if garment_uses is not null and (cardinality(garment_uses)<1 or ('trabajo'=any(garment_uses) and cardinality(garment_uses)>1)) then raise exception 'Usos inválidos'; end if;
 if category_name is not null then cid:=wardrobe_category(category_name); end if;
 update wardrobe_garments set title=coalesce(garment_title,title),category_id=coalesce(cid,category_id),note=case when garment_note='__ARMARIO_NULL__' then null when garment_note is not null then garment_note else note end,favorite=coalesce(garment_favorite,favorite) where id=garment_id and owner_id=auth.uid();
 if garment_uses is not null then delete from wardrobe_garment_uses where wardrobe_garment_uses.garment_id=wardrobe_update.garment_id; foreach u in array garment_uses loop insert into wardrobe_garment_uses values(garment_id,u); end loop; end if;
 if new_front_path is not null then select private_path into old_front from wardrobe_images where wardrobe_images.garment_id=wardrobe_update.garment_id and side='frontal'; update wardrobe_images set private_path=new_front_path,content_type=front_type,byte_size=front_size where wardrobe_images.garment_id=wardrobe_update.garment_id and side='frontal'; end if;
 if new_back_path is not null then select private_path into old_back from wardrobe_images where wardrobe_images.garment_id=wardrobe_update.garment_id and side='trasera'; insert into wardrobe_images(garment_id,owner_id,side,private_path,content_type,byte_size) values(garment_id,auth.uid(),'trasera',new_back_path,back_type,back_size) on conflict(garment_id,side) do update set private_path=excluded.private_path,content_type=excluded.content_type,byte_size=excluded.byte_size; end if;
 return jsonb_build_object('obsolete_paths',array_remove(array[old_front,old_back],null)); end $$;
create or replace function wardrobe_delete(garment_id uuid) returns text[] language plpgsql security invoker set search_path=public as $$ declare paths text[]; begin select array_agg(private_path) into paths from wardrobe_images where wardrobe_images.garment_id=wardrobe_delete.garment_id and owner_id=auth.uid(); delete from wardrobe_garments where id=garment_id and owner_id=auth.uid(); if not found then raise exception 'Prenda no autorizada'; end if; return coalesce(paths,array[]::text[]); end $$;

revoke all on function wardrobe_category(text), wardrobe_create(uuid,text,text,text[],text,text,text,text,bigint,text,bigint), wardrobe_list(text), wardrobe_update(uuid,text,text,text[],text,boolean,text,text,text,bigint,text,bigint), wardrobe_delete(uuid) from public, anon;
grant execute on function wardrobe_category(text), wardrobe_create(uuid,text,text,text[],text,text,text,text,bigint,text,bigint), wardrobe_list(text), wardrobe_update(uuid,text,text,text[],text,boolean,text,text,text,bigint,text,bigint), wardrobe_delete(uuid) to authenticated;
