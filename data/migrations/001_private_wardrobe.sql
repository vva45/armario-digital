-- Esquema de referencia para una base PostgreSQL privada con autenticación.
-- No se ejecuta automáticamente ni contiene credenciales.
create table wardrobe_categories (
  id uuid primary key,
  owner_id uuid not null,
  name text not null,
  normalized_name text not null,
  unique (owner_id, normalized_name)
);

create table wardrobe_garments (
  id uuid primary key,
  owner_id uuid not null,
  title text not null check (length(trim(title)) > 0),
  category_id uuid not null references wardrobe_categories(id),
  note text,
  favorite boolean not null default false,
  created_at timestamptz not null default now()
);

create table wardrobe_garment_uses (
  garment_id uuid not null references wardrobe_garments(id) on delete cascade,
  use text not null check (use in ('trabajo', 'salir', 'casa', 'dormir')),
  primary key (garment_id, use)
);

create table wardrobe_images (
  id uuid primary key,
  garment_id uuid not null references wardrobe_garments(id) on delete cascade,
  side text not null check (side in ('frontal', 'trasera')),
  private_path text not null,
  unique (garment_id, side)
);

-- El proveedor aprobado deberá habilitar RLS y políticas owner_id = usuario
-- autenticado antes de conectar este esquema a la aplicación.
