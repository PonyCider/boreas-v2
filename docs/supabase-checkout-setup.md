# Conectar Supabase al checkout de Boreas

El código ya usa Supabase como PostgreSQL administrado. No usa el SDK de Supabase ni expone claves al navegador. Pagos, contactos y webhooks se procesan en el servidor mediante Drizzle.

## 1. Copiar las dos conexiones

En Supabase abre tu proyecto y pulsa **Connect**.

Necesitas dos cadenas:

1. **Transaction pooler**, puerto `6543`: tráfico normal desde Vercel.
2. **Direct connection** o **Session pooler**, puerto `5432`: ejecutar migraciones.

Si la conexión directa falla por IPv6, usa Session pooler para la migración.

## 2. Configurar `.env.local`

Agrega:

```dotenv
SUPABASE_DATABASE_URL="postgresql://...:6543/postgres"
SUPABASE_DIRECT_URL="postgresql://...:5432/postgres"
RATE_LIMIT_SALT="una-cadena-aleatoria-de-al-menos-32-caracteres"
CRON_SECRET="otra-cadena-aleatoria-larga-y-distinta"
```

No uses `NEXT_PUBLIC_` en estas variables. No se deben enviar al navegador.

Puedes generar las dos cadenas aleatorias con:

```bash
openssl rand -base64 48
```

## 3. Crear las tablas

Desde la raíz del proyecto:

```bash
npm run db:migrate
```

Esto aplica `drizzle/0000_luxuriant_fat_cobra.sql` y crea:

- `checkout_orders`
- `webhook_events`
- `email_deliveries`
- `rate_limit_windows`

Las tablas tienen RLS habilitado y no conceden acceso a los roles públicos `anon` ni `authenticated`.

## 4. Configurar Vercel

En **Project → Settings → Environment Variables**, agrega para Production y Preview:

- `SUPABASE_DATABASE_URL`: Transaction pooler, puerto `6543`.
- `RATE_LIMIT_SALT`
- `CRON_SECRET`

`SUPABASE_DIRECT_URL` no es necesaria en el runtime de Vercel. Úsala localmente o en un flujo de migraciones protegido.

Después haz redeploy.

## 5. Prueba de Preview

1. Abre un paquete y envía el formulario.
2. Confirma que Mercado Pago abre normalmente.
3. En Supabase, revisa `checkout_orders`. Debe existir una fila con la referencia `BOR-...`.
4. Reintenta con la misma selección. Debe reutilizar la misma preferencia.
5. Envía una prueba de webhook desde Mercado Pago.
6. Revisa `webhook_events`, el estado de `checkout_orders` y `email_deliveries`.

No pruebes primero en Production.

## Operación

- Los correos fallidos se registran y Vercel Cron intenta reenviarlos diariamente.
- Los eventos repetidos de Mercado Pago son idempotentes.
- Las IP se guardan únicamente como HMAC; no se persiste la IP original.
- Los parámetros de retorno nunca determinan si un pago fue aprobado. El webhook de Mercado Pago es la fuente de verdad.

## Comandos

```bash
npm run db:generate  # genera una migración después de cambiar el esquema
npm run db:migrate   # aplica migraciones pendientes
npm run db:studio    # inspección local de la base de datos
```
