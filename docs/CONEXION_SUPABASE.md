# Conexión privada con Supabase

## Configuración externa necesaria

1. Crea o elige **un proyecto autorizado por su propietario**. Este repositorio no crea proyectos ni aplica cambios remotos.
2. Copia `.env.example` a `.env.local` y completa la URL y la clave **publicable**. Nunca uses `service_role` en variables `NEXT_PUBLIC_`.
3. En producción configura las mismas dos variables en Vercel, por entorno, sin pegarlas en Git ni logs.

## Migraciones y almacenamiento

Aplica en orden `data/migrations/001_private_wardrobe.sql` y `data/migrations/002_secure_private_wardrobe.sql` mediante el editor SQL o CLI oficial. Si `001` ya existe, aplica únicamente `002`: corrige el esquema de forma incremental, activa RLS, crea políticas por propietario, funciones transaccionales y el bucket privado `wardrobe-private`. No hagas público el bucket.

La ruta permanente guardada es `<auth.uid()>/<prenda>/<archivo>`; la aplicación genera URLs firmadas de 15 minutos solo al leer. El límite es 8 MiB y los formatos admitidos son JPEG, PNG y WebP.

## Autenticación y primera cuenta

En Authentication desactiva el registro público en la configuración del proyecto. Crea o invita la primera cuenta desde el panel protegido de Supabase (Authentication → Users); no añadas su contraseña al repositorio. Configura como URL del sitio la URL de la aplicación y permite `/restablecer` como redirect de recuperación. El acceso usa email/contraseña y la recuperación oficial; la sesión se conserva en cookies `HttpOnly`, se valida contra Auth en servidor y se renueva con el refresh token.

## Verificación después de conectar

1. Entra con la cuenta invitada y añade una prenda frontal y otra frontal/trasera.
2. Recarga, edita título/usos/nota, cambia favorito y sustituye una foto.
3. Abre otra sesión del mismo usuario y confirma que aparecen las mismas prendas.
4. Prueba con otra cuenta y sin sesión: tablas, RPC y rutas del bucket deben denegar datos ajenos.
5. Comprueba Casa + Dormir sin duplicado y el rechazo de Trabajo combinado.
6. Elimina una prenda y confirma que sus filas y objetos autorizados desaparecen.

## Estado de este entorno

El adaptador HTTP real, autenticación, migraciones, RLS y almacenamiento están implementados. No había configuración Supabase remota autorizada ni CLI local disponible, por lo que el recorrido extremo a extremo sigue **pendiente de conexión y comprobación**; no se han creado datos simulados ni se ha afirmado persistencia sin probarla.
