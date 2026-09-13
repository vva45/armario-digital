# Plan de producto por etapas

Este plan traduce la [especificación](./SPEC.md) en entregas revisables. La base de interfaz y dominio del primer encargo está implementada; persistencia, autenticación y prendas reales siguen pendientes.

## Estado de acceso (13 de septiembre de 2026)

- Repositorio de trabajo local: `/workspace/armario-digital`.
- La identidad remota `vva45/armario-digital` **no se puede confirmar**: el clon no tiene ningún remoto configurado.
- Rama recibida: `work`. No existe una referencia local o remota llamada `setup/codex`.
- Se intentó consultar `setup/codex` directamente en GitHub, pero el proxy devolvió HTTP 403. No se afirma haber recuperado contenido no leído; se conservaron íntegros `docs/SPEC.md` y `docs/PLAN.md` locales y se crearon las instrucciones solicitadas.
- La especificación facilitada en la tarea queda conservada en `docs/SPEC.md` como referencia del proyecto.
- No se han activado despliegues, proveedores, credenciales ni servicios de pago.

## Etapa 0 — Preparación (completada)

**Alcance:** conservar requisitos, registrar limitaciones verificables y acordar fases antes de construir.

**Criterios de aceptación**

- [x] Especificación disponible en `docs/SPEC.md`.
- [x] Plan por etapas y criterios de aceptación disponibles.
- [x] Estado del repositorio, rama y remoto comprobado sin asumir identidades ausentes.
- [x] Ninguna integración, despliegue ni servicio de pago creado.

## Encargo 1 — Base ejecutable (implementado, verificación parcial)

- [x] Arquitectura Next.js App Router + React + TypeScript en la raíz.
- [x] Home española con cinco orbes animados, rutas reales, foco y movimiento reducido.
- [x] Pausa de movimiento fuera de vista o con pestaña oculta.
- [x] Interior adaptable: cuatro columnas en escritorio y tres vistas con categorías accesibles en móvil.
- [x] Estados honestos sin inventario ni backend ficticio.
- [x] Tipos de dominio y validación de usos con pruebas.
- [ ] Dependencias instaladas, lint, tipos y build: bloqueados por HTTP 403 del registro npm.
- [ ] Revisión visual y capturas: pendientes hasta disponer de dependencias y navegador ejecutable.

## Etapa 1 — Primera versión funcional del armario

**Objetivo:** un flujo privado real de inicio a inventario persistente; no una landing ni datos ficticios.

### 1A. Base, identidad y persistencia privada

- Crear la aplicación en español con stack/versiones verificados y tokens visuales.
- Configurar autenticación, esquema/migraciones y buckets privados.
- Modelar categorías, prendas, usos e imágenes frontal/trasera.
- Aplicar RLS por propietario y restricciones de Trabajo en cliente, servidor y base.
- Proporcionar `.env.example` sin secretos y estados manuales útiles cuando no haya IA.

**Aceptación:** una cuenta autenticada crea y recupera sus datos; otra no puede leerlos ni relacionarlos; Trabajo + otro uso se rechaza en las tres capas; ningún bucket es público y `localStorage` no es la fuente de verdad.

### 1B. Navegación adaptable y cinco orbes

- Implementar los cinco orbes con arte, movimiento, foco y nombres especificados.
- Pausar animaciones fuera de vista/pestaña y respetar movimiento reducido.
- Construir cuatro columnas en escritorio, dos paneles en tableta y pestañas en móvil.
- Mantener uso, categoría, filtros y selección al navegar.

**Estado:** interfaz base completada en este encargo; la persistencia de selección y filtros se abordará junto al inventario real.

**Aceptación:** escritorio y móvil no tienen scroll horizontal, todos los accesos funcionan con teclado/táctil, Conjuntos no se modela como uso y la UI está revisada visualmente en ambos tamaños.

### 1C. Inventario real: categorías, alta y edición

- Subir frontal obligatoria y trasera opcional mediante selector, arrastre y cámara compatible.
- Validar en servidor, quitar metadatos innecesarios, conservar fuente privada y generar derivados.
- Permitir intercambio frontal/trasera, orientación/encuadre, título, categoría, usos y notas.
- Normalizar/reutilizar categorías y requerir confirmación antes de crear una nueva.
- Implementar edición y disponibilidad sin perder el formulario ante errores.

**Aceptación:** escenarios A–D de la especificación pasan con archivos de prueba aislados; Casa + Dormir comparte un registro; no se genera contenido ficticio ni traseras; cantidades provienen de datos persistidos.

### 1D. Tarjetas y favoritos persistentes

- Mostrar frontal completa; transición a trasera solo cuando exista.
- Añadir control explícito accesible para teclado/táctil.
- Separar interacción de favorito, selección y vista trasera.
- Persistir favoritos privados en servidor.

**Aceptación:** escenario E pasa tras recarga; pulsar estrella no selecciona; movimiento reducido conserva funcionalidad; la UI se revisa visualmente en escritorio y móvil.

### Salida de etapa 1

Se ejecutarán lint, tipos, pruebas unitarias/integración, build, pruebas RLS y pruebas end-to-end disponibles. El informe separará aprobado, no probado por limitación del entorno y pendiente. No se declararán incluidos recomendaciones, conjuntos funcionales ni probador.

## Etapa 2 — Recomendaciones y constructor de conjuntos

- Motor determinista de reglas con uso, disponibilidad, roles, clima manual, notas y favoritos.
- Base, alternativas por función, fijaciones, faltantes y hasta tres propuestas genuinas.
- Validación servidor de todos los IDs y explicaciones basadas solo en datos existentes.

**Aceptación:** escenarios F y G; ninguna pieza inventada, no autorizada o no disponible; Trabajo aislado; cambiar una alternativa sustituye su rol y las fijaciones sobreviven a regenerar.

## Etapa 3 — Conjuntos guardados

- Guardar, abrir, editar, duplicar, borrar y marcar favorito.
- Versionar composiciones y asociar renders sin copiar prendas.
- Detectar prendas eliminadas, incompatibles o no disponibles y renders obsoletos.

**Aceptación:** escenarios H e I en dos sesiones/dispositivos; las referencias siguen siendo privadas y los renders desactualizados nunca parecen vigentes.

## Etapa 4 — Análisis y preview realista

- Adaptador opcional de análisis estructurado con revisión manual.
- Trabajos persistentes de generación con deduplicación, timeout, reintento limitado y caché versionada.
- Preview fotorrealista explícitamente orientativo, junto a fotos reales.
- Claves solo servidor, límites configurables y cero gasto sin aprobación.

**Aceptación:** escenario J; fallo/no configuración conserva todo el flujo manual y nunca produce falso éxito. Una integración solo se marcará completa después de probar proveedor, persistencia y recuperación extremo a extremo.

## Investigación temprana del 360° (en paralelo, sin fingir integración)

Antes de cerrar arquitectura del preview se realizará una prueba técnica separada:

1. Revisar documentación oficial vigente y licencias de proveedores candidatos.
2. Diferenciar salida de imagen/multivista de geometría 3D texturizada.
3. Probar fidelidad con frontal, frontal+trasera, capas, zapatos, accesorios y detalles ocultos.
4. Medir coherencia angular, identidad, latencia, coste, privacidad, borrado y formatos.
5. Verificar un visor local con órbita solo horizontal únicamente si existe un recurso 3D real.
6. Presentar resultados, riesgos y costes para aprobación; una multivista requerirá aprobación explícita como alternativa.

**Criterio de decisión:** no se activa proveedor de pago ni se etiqueta nada “360°” hasta que el escenario K pase extremo a extremo con un conjunto seleccionado. Una imagen frontal, rotación CSS, espejo, dos caras o personas distintas se rechazan.

## Etapa 5 — 360°/multivista aprobada y avatar opcional

- Integrar el pipeline aprobado y controles accesibles (arrastre, giro, frente, ampliar).
- Mantener encuadre de cuerpo completo, consistencia y aviso sobre detalles estimados.
- Añadir avatar voluntario con consentimiento de proveedor y borrado completo.

**Aceptación:** escenario K, caché ligada a composición/versión/avatar y privacidad verificada; si la investigación no demuestra viabilidad, la funcionalidad permanece declarada pendiente, no simulada.

## Etapa 6 — Robustez, exportación y preparación de entrega

- Borrado/exportación protegidos, límites, temporales privados y observabilidad sin datos sensibles.
- Rendimiento, fallos de imagen, vacíos, accesibilidad, teclado y movimiento reducido.
- Matriz final de requisitos y pruebas de seguridad.

**Aceptación:** escenario L, todos los estados críticos tienen acción útil y el informe distingue probado, no probado y dependencias externas. Publicar o fusionar seguirá requiriendo autorización explícita.
