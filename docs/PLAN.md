# Plan de desarrollo

Este plan no sustituye la especificación ni autoriza tareas por sí mismo. El propietario debe iniciar cada encargo de desarrollo. El estado actual es preparación documental, no una web terminada.

## Etapa 0 — Preparación

- Especificación e instrucciones conservadas en el repositorio.
- Rama de preparación `setup/codex` para revisión, sin fusionar automáticamente.
- Pendiente: crear o seleccionar el entorno de Codex Cloud en la cuenta del propietario y autorizar este repositorio.
- No se han instalado dependencias: todavía no hay `package.json`.

## Etapa 1 — Base funcional del armario

Crear una base Next.js/React/TypeScript de acuerdo con versiones verificadas. Implementar home con cinco orbes, navegación adaptable, categorías, carga frontal/trasera, edición y favoritos. Preparar e integrar persistencia privada, autenticación y almacenamiento con autorización del propietario; no crear servicios de pago ni inventar credenciales.

Cierre: build y comprobaciones ejecutados, experiencia revisada en escritorio y móvil, y flujo real subir/guardar/recuperar probado. Si falta backend o credenciales, entregar los cambios y explicar el bloqueo; no dar la persistencia por completada.

## Etapa 2 — Conjuntos y recomendaciones

Implementar usos, disponibilidad, favoritos, prendas fijadas, complementos, reglas de combinación y conjuntos guardados. Validar referencias y pertenencia en servidor. Integrar análisis de imágenes solo mediante un proveedor comprobado y autorizado; mantener edición manual funcional.

Cierre: probar exclusividad de Trabajo, Casa/Dormir compartidos, armario insuficiente, sustituciones, guardado y cambios posteriores de prendas.

## Etapa 3 — Probador realista

Investigar su viabilidad técnica y costes temprano, sin activar pagos. Hacer una prueba con prendas autorizadas antes de considerar resuelto el pipeline. Separar imagen frontal, recurso multivista y modelo 3D. Integrar trabajos persistentes, caché, fallos, privacidad y aviso de simulación orientativa.

Cierre: fidelidad evaluada, misma persona y conjunto en los ángulos, giro horizontal real y ninguna presentación engañosa. No declarar cerrado el 360° por disponer únicamente de un visor.

## Etapa 4 — Consolidación

Exportación y borrado de datos, pruebas de acceso entre cuentas, accesibilidad, rendimiento, revisión visual y documentación de instalación/despliegue. Publicación únicamente tras autorización expresa.

## Registro de pruebas actual

No hay pruebas de aplicación, lint o build ejecutados porque aún no existe código de aplicación. La preparación documental y la creación del entorno remoto son estados distintos.
