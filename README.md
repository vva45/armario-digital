# Armario digital

Aplicación privada en Next.js para guardar prendas reales con Supabase. La home aprobada conserva sus cinco orbes; el inventario requiere autenticación y ofrece alta, edición, favoritos, filtros, fotografías privadas y borrado.

## Desarrollo

```bash
npm install
cp .env.example .env.local
npm run dev
```

Consulta [la guía de conexión](docs/CONEXION_SUPABASE.md). Sin las dos variables públicas la interfaz muestra **Conexión pendiente**; sin sesión muestra **Inicia sesión**. No se usan datos temporales como si estuvieran guardados.

## Estado

- **Implementado:** adaptador Supabase HTTP, sesiones servidor, flujo de acceso/recuperación, inventario persistente, migración incremental con RLS y bucket privado.
- **Probado en este entorno:** pruebas unitarias, lint, tipos y build según la entrega.
- **Pendiente:** aplicar migraciones y verificar el flujo completo contra un proyecto Supabase autorizado. No se conectó ni modificó ningún proveedor remoto.
