-- Pega esto en Supabase Dashboard → SQL Editor → Run

create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  nombre      text not null,
  especialidad text not null,
  whatsapp    text not null,
  google_maps text,
  status      text not null default 'nuevo'
    check (status in ('nuevo', 'contactado', 'cerrado', 'descartado'))
);

-- Solo el backend puede leer/escribir (ANON_KEY no tiene acceso por defecto)
alter table public.leads enable row level security;

-- Permite insertar desde el server action con ANON_KEY
-- (el server action corre en tu servidor, no en el browser del usuario)
create policy "server_can_insert"
  on public.leads
  for insert
  with check (true);

-- Solo tú ves los leads desde el Dashboard (service_role bypasses RLS)
-- No hay política de SELECT para anon → el form no puede leer leads ajenos
