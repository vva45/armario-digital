# Instrucciones del proyecto

## Antes de trabajar

Lee `docs/SPEC.md` y `docs/PLAN.md`. La especificación define el producto completo; la tarea más reciente del usuario define qué etapa está autorizada. Preparar o conectar el repositorio no autoriza a construir toda la aplicación.

El estado inicial contiene únicamente documentación, sin `package.json` ni aplicación. No afirmes haber instalado, compilado o probado código que todavía no existe. Si se autoriza el desarrollo, verifica el entorno y la documentación oficial vigente antes de elegir versiones.

## Reglas del producto

- Interfaz y explicaciones al usuario en español. Armario personal, no comercio electrónico.
- Trabajo, Salir, Casa y Dormir son usos. Conjuntos es una sección de combinaciones guardadas.
- Trabajo es exclusivo; exigirlo también en servidor y base de datos. Otros usos compartidos solo con autorización del usuario.
- Nunca inventar prendas. Mantener la foto frontal como principal y admitir trasera opcional.
- Ficha visible: título, categoría y uso; nada de SKU o identificadores comerciales visibles.
- Categorías normalizadas, editables y sin duplicados por sinónimos.
- Estrella de favorito, selección actual y prenda fijada son estados distintos.
- Cinco orbes animados y layout interior de cuatro paneles; adaptación móvil y movimiento reducido.
- Persistencia privada y recuperable entre dispositivos, no solo localStorage.
- No activar generaciones de pago por hover o navegación. No simular integraciones como si funcionasen.
- Un visor que gira no demuestra generación 3D. No llamar 360° a una fotografía plana giratoria. La multivista necesita identificación honesta y aprobación si sustituye el objetivo 3D.

## Seguridad y alcance

No guardar fotos privadas, retratos, nombres personales, secretos, `.env` ni exportaciones en Git. No publicar imágenes de referencia de la conversación sin permiso. Nunca incluir claves privilegiadas en el cliente.

No activar gastos, aprovisionar servicios, publicar en producción, cambiar dominios, fusionar ramas ni hacer force-push sin autorización. Revisar el estado y los cambios de Git antes de cada escritura. No sobrescribir trabajo ajeno.

## Implementación y comprobaciones

Cuando se autorice la etapa de desarrollo, usar el stack acordado en la especificación; conservar dependencias y lockfile coherentes. Separar interfaz, dominio, persistencia y proveedores de IA. Las pruebas deben cubrir especialmente autorización, exclusividad de Trabajo, referencias válidas y ausencia de prendas inventadas.

Ejecutar solo comandos de comprobación que existan en el proyecto. Comprobar escritorio y móvil cuando haya interfaz. Informar por separado de lo probado, lo no probado y los bloqueos reales. Actualizar el plan sin marcar funcionalidades incompletas como terminadas.

## Code Review Rules

Rechazar credenciales expuestas, accesos entre propietarios, pérdida silenciosa de datos, prendas fuera del uso autorizado, controles sin funcionalidad y previews antiguos presentados como actuales. Las fotos privadas no pertenecen al repositorio, aunque este cambie de visibilidad.
