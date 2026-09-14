# Conexión privada con Supabase

## Configuración externa necesaria

1. Crea o elige **un proyecto autorizado por su propietario**. Este repositorio no crea proyectos ni aplica cambios remotos.
2. Copia `.env.example` a `.env.local` y completa la URL y la clave **publicable**. Nunca uses `service_role` en variables `NEXT_PUBLIC_`.
3. En producción configura las mismas dos variables en Vercel, por entorno, sin pegarlas en Git ni logs.

## Migraciones y almacenamiento

Para una instalación nueva aplica, en orden, `001_private_wardrobe.sql`, `002_secure_private_wardrobe.sql`, `003_inventory_blockers.sql`, `004_upload_operations.sql` y `005_secure_operation_transitions.sql`. La versión corregida de 003 conserva el parámetro `garment_id` de 002, porque PostgreSQL no permite renombrar un parámetro de entrada mediante `CREATE OR REPLACE FUNCTION`; la ruta DELETE envía esa misma clave.

Para un entorno existente, consulta primero su tabla de historial y las firmas de `pg_proc`: no deduzcas que una migración se aplicó solo porque esté en Git. Si tiene 001–002, aplica 003, 004 y 005. Si ya tiene 003, aplica 004 y 005; si ya tiene 004, aplica únicamente 005. La 004 sustituye `wardrobe_delete(uuid)` de forma explícita, sin `CASCADE`, restaura `EXECUTE` solo a `authenticated` y sirve tanto si quedó el nombre antiguo como si se había aplicado una variante con `p_garment_id`. Ninguna migración se aplicó remotamente durante este encargo.

La tercera migración permite la cascada al borrar una prenda, pero conserva comprobaciones diferidas que impiden dejar una prenda existente sin usos o sin frontal. La cuarta registra cada autorización con propietario, prenda, manifiesto y estado. Sus RPC bloquean la operación al confirmar o abandonarla: los reintentos concurrentes recuperan el mismo resultado y una limpieza reservada no puede competir con una confirmación.

La ruta permanente guardada es `<auth.uid()>/<prenda>/<operación>/<lado>`; el servidor decide la ruta y emite una autorización limitada para subir cada archivo directamente al bucket privado. Los binarios no atraviesan la función de Vercel: así el límite de cuerpo de las Functions no contradice el límite de 8 MiB por fotografía configurado en Storage. El navegador nunca recibe `service_role` y no puede elegir una ruta de otro propietario.

Tras la subida, el servidor vuelve a comprobar existencia, propietario/ruta, tamaño, tipo y firma binaria antes de confirmar la fila. El identificador de operación hace idempotentes alta y sustitución: si se pierde la respuesta, el servidor consulta el registro y recupera el resultado; si tampoco puede consultarlo, responde 202 recuperable y conserva los objetos. Las subidas parciales se abandonan mediante la misma operación, y Storage solo recibe las rutas devueltas por la reserva atómica del servidor. Una firma de lectura fallida después del commit devuelve “guardada, visualización pendiente” y jamás borra fotos referenciadas. Las incidencias de limpieza son recuperables y se registran sin rutas privadas, URLs firmadas ni credenciales.

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

El adaptador HTTP real, autenticación, migraciones, RLS y almacenamiento están implementados. En este entorno no hay `psql`, Supabase CLI ni Docker, ni configuración Supabase remota autorizada. Por ello **no se ejecutó la secuencia SQL ni se probó el inventario de extremo a extremo**. Queda pendiente, en un proyecto de pruebas autorizado: ejecutar 001→005 desde cero; probar la transición desde 001→002 y desde una 003 ya registrada; verificar firmas RPC en PostgREST; y probar alta, edición, sustitución, eliminación, dos cuentas normales, concurrencia, corte de red y fotografías de prueba. Las pruebas automatizadas locales usan respuestas HTTP controladas y no afirman persistencia real.

## Corrección 005 y contrato HTTP de Storage

Las instalaciones nuevas deben aplicar ahora `001` → `002` → `003` → `004` → `005`. Si `004` ya está registrada, aplica únicamente `005_secure_operation_transitions.sql`; no repitas archivos ni reinicies la base. La corrección mantiene RLS y el permiso de tabla de `wardrobe_operations` limitado a `SELECT`. Solo las RPC que deben insertar, bloquear o cambiar la operación usan `SECURITY DEFINER`; derivan siempre el propietario de `auth.uid()`, bloquean la fila de esa identidad y validan ruta, lado, tipo y tamaño contra el manifiesto antes de confirmar. `EXECUTE` sigue revocado para `public` y `anon`.

El endpoint HTTP de Storage que crea una subida firmada devuelve `url`; el token está en el parámetro `token` de esa URL, no se exige un campo JSON `token` inventado. El servidor resuelve rutas relativas contra la URL configurada, exige el mismo origen y comprueba exactamente la ruta privada autorizada antes de entregarla al navegador.

La RPC `wardrobe_storage_summary` suma únicamente `byte_size` de fotografías confirmadas de `auth.uid()`. Por eso la interfaz la denomina estimación del armario y no cuota oficial del proyecto.

## Proyecto remoto y coste comprobados en este encargo

No hay remoto Git configurado, CLI de Supabase, `psql`, Docker ni variables de Supabase/Vercel disponibles en este entorno. En consecuencia no se identificó organización o proyecto, no se pudo comprobar su plan/coste y **no se creó, conectó ni modificó ningún recurso remoto**. Tampoco se ejecutaron migraciones o pruebas con cuentas reales.

**Única acción para desbloquear la conexión:** el propietario debe crear o elegir en el panel de Supabase un proyecto de pruebas confirmado como **Free** (nombre propuesto `armario-digital-pruebas`, región de la Unión Europea disponible, sin extras ni tarjeta) y configurar localmente, sin publicarlas en el chat, `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` obtenidas en **Project Settings → API**. Con esa autorización concreta se podrá identificar el proyecto, revisar el historial y aplicar la secuencia sin tocar producción.

En Vercel, cuando ese proyecto sea autorizado, las dos variables públicas se añaden solo a **Development** y/o **Preview** del proyecto de pruebas que se indique; Production queda intacto. Después hace falta un despliegue nuevo de ese ámbito. Esta guía no afirma que esas variables ni un redeploy se hayan aplicado.
