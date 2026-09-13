# Armario digital

Proyecto de aplicación web personal para organizar prendas y crear conjuntos con ropa real.

## Estado actual

Base ejecutable con Next.js App Router, React y TypeScript. Incluye la home de cinco orbes, las cuatro vistas iniciales del armario, la sección Conjuntos y reglas de dominio probadas. Supabase, autenticación, subida y persistencia continúan pendientes; la aplicación no exige credenciales.

## Instalación y ejecución

Requiere Node.js 20.9 o posterior (el desarrollo inicial se realizó con Node.js 24.15.0 y npm 11.4.2).

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`. Para producción: `npm run build && npm start`. Comprobaciones disponibles: `npm run typecheck`, `npm run lint` y `npm test`.

El despliegue en Vercel está identificado como Next.js y publica la salida `.next`; no debe configurarse `public` como directorio de salida, ya que esa carpeta solo está destinada a recursos estáticos.

La red del entorno de preparación devolvió HTTP 403 tanto para GitHub como para npm, por lo que no fue posible recuperar `setup/codex` ni generar `package-lock.json`. Ejecuta `npm install` con acceso al registro antes de considerar verificadas la instalación y la compilación.

## Privacidad

No subir a Git fotografías del armario, retratos, credenciales, archivos `.env` ni exportaciones personales. El almacenamiento de datos de la futura aplicación deberá ser privado y estar separado del código fuente.

## Trabajo

Revisar los cambios antes de fusionarlos. No desplegar en producción ni activar servicios de pago sin autorización.
