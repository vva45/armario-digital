# Conexión privada con Supabase

## Configuración externa necesaria

1. Crea o elige **un proyecto autorizado por su propietario**. Este repositorio no crea proyectos ni aplica cambios remotos.
2. Copia `.env.example` a `.env.local` y completa la URL y la clave **publicable**. Nunca uses `service_role` en variables `NEXT_PUBLIC_`.
3. En producción configura las mismas dos variables en Vercel, por entorno, sin pegarlas en Git ni logs.

## Migraciones y almacenamiento

Para una instalación nueva aplica, en orden, `001_private_wardrobe.sql`, `002_secure_private_wardrobe.sql` y `003_inventory_blockers.sql`. Si 001 y 002 ya se aplicaron, aplica únicamente 003: es una corrección incremental que no borra datos. No apliques 001 y 002 de nuevo ni ejecutes ninguna migración sin revisar primero el estado del proyecto autorizado.

La tercera migración permite la cascada al borrar una prenda, pero conserva comprobaciones diferidas que impiden dejar una prenda existente sin usos o sin frontal. También mantiene la exclusividad de Trabajo, permite reemplazar usos dentro de una misma transacción y sustituye las RPC por firmas sin ambigüedad entre parámetros y columnas.

La ruta permanente guardada es `<auth.uid()>/<prenda>/<operación>/<lado>`; el servidor decide la ruta y emite una autorización limitada para subir cada archivo directamente al bucket privado. Los binarios no atraviesan la función de Vercel: así el límite de cuerpo de las Functions no contradice el límite de 8 MiB por fotografía configurado en Storage. El navegador nunca recibe `service_role` y no puede elegir una ruta de otro propietario.

Tras la subida, el servidor vuelve a comprobar existencia, propietario/ruta, tamaño, tipo y firma binaria antes de confirmar la fila. El identificador de operación hace idempotente el alta: si se pierde la respuesta, el mismo formulario confirma o recupera la misma prenda, sin crear otra. Solo las subidas no confirmadas se intentan limpiar. Una firma de lectura fallida después del commit devuelve “guardada, visualización pendiente” y jamás borra fotos referenciadas. Las incidencias de limpieza son recuperables y se registran sin rutas privadas, URLs firmadas ni credenciales.

Referencias revisadas: [límite de cuerpo de Vercel Functions](https://vercel.com/docs/functions/limitations#request-body-size) y [subidas firmadas de Supabase Storage](https://supabase.com/docs/reference/javascript/storage-from-createsigneduploadurl). La aplicación genera URLs firmadas de 15 minutos solo al leer. Los formatos admitidos son JPEG, PNG y WebP.

## Autenticación y primera cuenta

En Authentication desactiva el registro público en la configuración del proyecto. Crea o invita la primera cuenta desde el panel protegido de Supabase (Authentication → Users); no añadas su contraseña al repositorio. Configura como URL del sitio la URL de la aplicación y permite `/restablecer` como redirect de recuperación. El acceso usa email/contraseña y la recuperación oficial; la sesión se conserva en cookies `HttpOnly`, se valida contra Auth en servidor y se renueva con el refresh token.

## Verificación después de conectar

1. Entra con la cuenta invitada y añade una prenda frontal y otra frontal/trasera.
2. Recarga, edita título/usos/nota, cambia favorito y sustituye una foto.
3. Abre otra sesión del mismo usuario y confirma que aparecen las mismas prendas.
4. Prueba con otra cuenta y sin sesión: tablas, RPC y rutas del bucket deben denegar datos ajenos.
5. Comprueba Casa + Dormir sin duplicado y el rechazo de Trabajo combinado.
6. Elimina una prenda y confirma que sus filas y objetos autorizados desaparecen.
7. Simula una respuesta perdida al confirmar un alta y repítela con el mismo formulario: debe conservar un solo ID y las mismas rutas.
8. Fuerza un fallo de firma de lectura y otro de limpieza: la prenda confirmada debe permanecer, con una incidencia recuperable.

## Estado de este entorno

El adaptador HTTP real, autenticación, migraciones, RLS y almacenamiento están implementados. No había configuración Supabase remota autorizada ni CLI local disponible, por lo que el recorrido extremo a extremo sigue **pendiente de conexión y comprobación**; no se han creado datos simulados ni se ha afirmado persistencia sin probarla.
