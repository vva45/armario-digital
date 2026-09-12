# Armario digital

Aplicación web personal para organizar prendas reales, recomendar combinaciones y guardar conjuntos. No es una tienda online.

## Estado

Este cambio prepara la documentación del proyecto. Todavía no hay una aplicación ejecutable, `package.json`, dependencias que instalar, backend conectado ni despliegue. Tampoco se ha creado un entorno de Codex Cloud desde este repositorio.

## Documentación

- [Especificación completa](docs/SPEC.md): diseño, comportamiento y criterios de aceptación.
- [Instrucciones para el agente](AGENTS.md): reglas que deben acompañar cada tarea.
- [Plan de desarrollo](docs/PLAN.md): etapas pendientes y criterios de cierre.
- [Conexión con Codex Cloud](docs/CODEX_SETUP.md): paso que requiere la cuenta del propietario.

## Decisiones principales

Cuatro usos: Trabajo, Salir, Casa y Dormir. Conjuntos es una quinta sección, no otro uso. Trabajo es exclusivo. Fotografías frontal obligatoria y trasera opcional. Ficha visible sencilla: título, categoría y uso. Interfaz oscura con cinco orbes animados y cuatro paneles interiores en escritorio. El probador realista y su rotación horizontal deben implementarse y verificarse; no se darán por terminados con una fotografía plana giratoria.

## Privacidad

No subir fotografías de ropa, retratos, credenciales, `.env` ni exportaciones personales a Git. El almacenamiento de la aplicación será privado y separado del código. Esta documentación omite nombres personales y no incluye las imágenes de referencia de la conversación.

## Inicio del desarrollo

Leer `AGENTS.md`, `docs/SPEC.md` y `docs/PLAN.md`. Trabajar en una rama y entregar cambios para revisión. No fusionar, desplegar ni activar servicios de pago sin autorización. No ejecutar `npm install` mientras no exista un `package.json` real.
