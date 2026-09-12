# Armario digital personal con estilista y probador visual

> Especificación de producto de referencia. La interfaz será íntegramente en español.

## 1. Propósito y límites

Aplicación web privada para organizar prendas reales, combinarlas y mostrar conjuntos sobre una persona o maniquí humano fotorrealista, con el objetivo de ofrecer una vista 360° horizontal. No es una tienda, landing page, maqueta ni demo: no habrá precios, compras, carrito, marcas inventadas, patrocinios ni prendas ajenas al armario.

El recorrido principal es entrar, elegir un uso, explorar prendas, seleccionar una, descubrir con qué combina, montar y visualizar un conjunto y guardarlo. Uso, categoría y conjunto son conceptos independientes; una prenda no se duplica por pertenecer a varios conjuntos o usos. Si se parte de cero, el nombre provisional editable es **Mi armario**.

## 2. Cuatro usos y una quinta sección

- **Trabajo:** prendas exclusivas para trabajar en Mobles Puell (tienda, reparto y montaje de muebles). No pueden compartir otro uso. La restricción debe existir en interfaz, servidor y base de datos. No se interpretará como ropa de oficina ni se inferirán certificaciones laborales de una foto.
- **Salir:** ropa para ciudad, paseos, comidas, cenas, citas, planes sociales y fiestas; admite estilos casual, arreglado y festivo.
- **Casa:** ropa cómoda, vieja o gastada para sofá, cocina, jardín y tareas domésticas. Puede compartir Dormir si el propietario lo autoriza.
- **Dormir:** pijamas y prendas destinadas a dormir, incluidas piezas sueltas.
- **Conjuntos:** sección principal para combinaciones guardadas, filtrable por los cuatro usos. No es un uso ni una categoría.

El propietario decide usos al crear o editar. Nunca se asignan silenciosamente por apariencia. Excepto Trabajo, compartir usos requiere autorización expresa.

## 3. Dirección artística

Experiencia sofisticada, inmersiva y personal, con fondo carbón, paneles grafito, texto blanco cálido, iluminación ambiental discreta y acentos por uso. Fotografías protagonistas, toque editorial y tecnología discreta. Colores, espaciado, radios y sombras se definirán como tokens reutilizables. Se evitarán exceso de gradientes/neón, contraste insuficiente, texto diminuto, brillos que oculten información y transparencias ilegibles.

Las referencias visuales describen cuatro columnas interiores, orbes energéticos y accesos flotantes; los colores de columnas son anotaciones, no una obligación. La descripción basta si no se adjuntan imágenes.

## 4. Inicio con cinco orbes vivos

Cinco accesos circulares u orgánicos, no tarjetas rectangulares, forman una constelación equilibrada, pulsable y sin solapamientos. Conjuntos tiene la misma presencia funcional.

- Trabajo: perla, plata y azul acero; corrientes sobrias y prácticas, sin oficina corporativa ni herramientas caricaturescas.
- Salir: rojo, violeta y azul eléctrico; ciudad nocturna y fiesta elegante, sin estrobos.
- Casa: ámbar, naranja suave y dorado; remolinos lentos y acogedores, no fuego.
- Dormir: turquesa, azul nocturno y lavanda; niebla lenta y partículas discretas.
- Conjuntos: champán, blanco nacarado y violeta refinado; bandas que se unen, claramente distinto de Salir.

El nombre legible se situará preferiblemente fuera de la zona luminosa, con descripción opcional. Se usarán exactamente Trabajo, Salir, Casa, Dormir y Conjuntos (nunca “Exit”). Habrá flotación exterior y energía interior independientes, orientativamente 6–10 px y 8–14 s, desfasadas. Hover/foco intensifican halo y escala con suavidad. Se mantienen animados mientras sean visibles, se pausan fuera de pantalla o con pestaña oculta, respetan movimiento reducido con una versión estática cuidada y nunca reproducen sonido automáticamente.

## 5. Interior en escritorio

Orden: **Categorías | Mis prendas | Combina con… | Vista previa**.

- Categorías: columna estrecha (orientativamente 160–180 px), solo categorías no vacías del uso activo y cantidades reales. Favoritos es un filtro, no categoría.
- Mis prendas: cuadrícula de fotos, dos o tres por fila cuando haya espacio; selección visible sin cubrir la imagen.
- Combina con…: recomendaciones relacionadas con la base y agrupadas por función (inferiores, calzado, capas y accesorios), no una lista genérica.
- Vista previa: conjunto en construcción, acceso a fotos reales y visor realista, con espacio para cuerpo completo, zapatos y accesorios.

Una barra compacta permite volver a los orbes, cambiar uso sin volver al inicio, buscar, filtrar y añadir prenda. El layout es adaptable, sin anchos rígidos; cambia antes de empequeñecer tarjetas o preview. El visor puede ampliarse sin perder el conjunto.

## 6. Móvil y tableta

En móvil: pestañas **Armario**, **Recomendaciones** y **Preview**, con categorías mediante selector/panel. Se conservan selección, filtros y borrador al cambiar. Acciones táctiles cómodas y favoritos independientes del hover. En tableta se permiten dos paneles y preview ampliable. Sin scroll horizontal global ni controles pegados a bordes.

## 7. Subida: una prenda, una o dos fotos

Cada prenda requiere frontal y admite trasera opcional, en zonas inequívocas **Delantera** y **Trasera — opcional**, intercambiables; la principal guardada es siempre la frontal. Se admite cámara móvil, selector y arrastre. Los lotes pasan por una bandeja donde el usuario asocia traseras; nunca se emparejan archivos consecutivos por suposición.

Los posibles duplicados requieren confirmación; fotos parecidas no se borran automáticamente. Si una imagen contiene varias prendas, se pide separarlas/identificarlas. Se conserva fuente privada fiel y derivados optimizados, eliminando geolocalización innecesaria. El recorte de fondo es reversible y no altera logos, colores, estampados o silueta. Nunca se sustituye por una prenda genérica ni se inventa la trasera. Se permite corregir orientación/encuadre, y se validan formato/tamaño explicando errores sin perder el formulario.

## 8. Ficha y categorización

La ficha visible se limita a título, categoría y uso (por ejemplo, “Camisa azul de manga larga · Camisas · Salir” o “Camiseta cómoda · Camisetas · Casa · Dormir”). No muestra SKU, identificadores, precios, ficha técnica ni campos redundantes. Estrella y edición son controles. Notas opcionales (“Es fresca”, “Abriga mucho”, “Tejido grueso”) alimentan recomendaciones sin recargar tarjetas.

La IA puede proponer título/categoría corregibles; lo incierto queda sin confirmar y el dato manual prevalece. Se reutilizan categorías mediante normalización de singular/plural, mayúsculas, acentos y sinónimos. Una categoría nueva requiere que ninguna encaje y confirmación. Se contemplan, cuando existan, camisas, camisetas, blusas, sudaderas, punto, pantalones largos/cortos, faldas, vestidos, chaquetas, abrigos, calzado, cinturones y accesorios. No se muestran categorías vacías. Pijamas es categoría; Dormir, uso. Las categorías pueden renombrarse/fusionarse sin perder prendas.

## 9. Tarjetas y favoritos

Foto completa, proporcionada, sin deformación ni recortes importantes. En reposo se ve la frontal. Hover eleva ~4 px, escala ~1,015 y refuerza borde/sombra en ~200 ms. Si existe trasera, cruza suavemente; al salir vuelve al frontal. Sin trasera solo anima, sin huecos ni imágenes inventadas. Móvil/teclado ofrece **Ver detrás / Ver delante** solo si existe trasera, separado de seleccionar.

La estrella tiene objetivo táctil cómodo, estados claros, persistencia real y aumenta moderadamente el peso en recomendaciones. Pulsarla no selecciona la tarjeta. Favorito, selección y fijación son estados distintos.

## 10. Selección y conjunto provisional

Seleccionar cualquier tipo de prenda crea la base y muestra **Combinando con…** y su foto. Las recomendaciones complementan dentro del uso activo. Añadir una alternativa de la misma función sustituye la anterior. Se pueden fijar prendas, regenerar respetándolas, cambiar una pieza, quitar accesorios y guardar. Nunca se cambia una fijada en silencio.

Ante cambio de uso incompatible se explica el conflicto y se confirma antes de reiniciar; Trabajo jamás se reutiliza en otro uso. Explorar, hover y favoritos no generan visuales de pago: el conjunto de fotos reales se actualiza inmediatamente y **Generar vista IA** solicita explícitamente la simulación.

## 11. Recomendador

Genera por uso, clima manual (frío, fresco, templado, cálido), estilo y fijaciones; no solicita ubicación ni añade clima externo por defecto. Primero cumple propiedad, disponibilidad, uso y coherencia física; luego colores, proporciones, capas, formalidad, notas, favoritos y variedad. Los metadatos visuales internos son editables y no se presentan como verdades universales.

Ofrece hasta tres propuestas realmente distintas cuando el inventario lo permita; si solo hay una válida, solo una. Explica brevemente usando datos reales, sin inventar tejido, marca o comodidad. Si hay incertidumbre, la expresa.

## 12. Conjunto completo

Salir/Trabajo suelen requerir superior + inferior + calzado, o cuerpo completo + calzado, y capas/accesorios cuando proceda y existan. Casa/Dormir no fuerzan zapatos de calle, corbata, cinturón, reloj, ropa interior ni accesorios. Se respeta la lógica de capas. Si falta una pieza, se informa y conserva un borrador incompleto sin inventar nada.

Cada prenda puede estar disponible/no disponible. Las no disponibles no entran en propuestas nuevas, pero permanecen en conjuntos guardados con aviso.

## 13. Conjuntos guardados

Se guardan propuestas automáticas o manuales con nombre editable, uso, referencias a prendas concretas y preview si existe. Pueden abrirse, editarse, duplicarse, eliminarse y marcarse favoritos (independientes de prendas). Se referencian originales y se versiona la composición asociada a cada render.

Si una prenda se elimina, cambia de uso o disponibilidad, se advierte y ofrece sustitución. Un conjunto inválido no aparenta validez. Al cambiar composición, el render anterior queda desactualizado.

## 14. Probador realista

Objetivo: prendas reales sobre persona/maniquí humano fotorrealista, de cuerpo completo, pose natural, estudio limpio, luz estable y proporciones coherentes; no collage, silueta ni muñeco de colores aproximados. Debe preservar color, mangas, corte, estampado, logos, calzado y accesorios, sin añadir o sustituir ropa. Las fotos reales siempre están consultables y aparece: **“Simulación orientativa: no garantiza talla, ajuste ni caída exacta”**.

## 15. Rotación 360° horizontal

Objetivo: modelo coherente observable alrededor del cuerpo. Arrastre solo horizontal. Se prioriza 3D con geometría/texturas de calidad; visor y generación fiel son problemas separados que deben integrarse y probarse.

Una secuencia alternativa se denomina **Vista multivista IA**, cubre toda la vuelta manteniendo persona/prendas/detalles y requiere aprobación para reemplazar el objetivo 3D. Está prohibido fingir 360° rotando una foto con CSS, reflejando frontal, usando dos caras, personas distintas o vídeo ajeno al conjunto.

Los detalles ocultos estimados se declaran; una trasera ayuda pero no garantiza reconstrucción. Incluye arrastre, giro accesible, volver al frente y ampliar. Con OrbitControls, `minPolarAngle` y `maxPolarAngle` son iguales y la órbita horizontal completa; cuerpo y zapatos permanecen encuadrados. Si no hay pipeline real, se muestra honestamente el estado. Una frontal es provisional, nunca “360°”. Solo se completa tras una prueba extremo a extremo.

## 16. Avatar opcional

Por defecto, persona/maniquí realista neutro. Subir una foto propia será voluntario y posterior; se explicarán finalidad y proveedor antes del envío, y se podrá borrar avatar y resultados. No se prometen medidas exactas ni se modifica el cuerpo para favorecer la ropa. El avatar se conserva entre conjuntos/ángulos y las aproximaciones se identifican.

## 17. IA e integraciones verificadas

Módulos separados: análisis, recomendaciones y generación visual. El análisis devuelve estructura validada. El recomendador solo devuelve IDs autorizados y el servidor revalida. Siempre existe clasificación manual y motor de reglas; sin proveedor no se llama IA.

Antes de elegir servicios se revisa documentación oficial, formatos, múltiples prendas, accesorios, frontal/trasera y salida 3D/multivista. Un generador de imágenes no equivale a malla 3D. No se inventan endpoints, SDK, credenciales, capacidades o éxitos, ni se llama terminada una interfaz sin implementación.

Generaciones como tareas persistentes: pendiente, procesando, completada y fallida; timeout, reintentos limitados y deduplicación, sin porcentajes ficticios. Resultados cacheados por composición, versión de imágenes, avatar y configuración; una tarea antigua no pisa otra selección. No se contratan servicios ni activan gastos sin permiso; se documentan dependencias y límites.

## 18. Arquitectura y persistencia

Se conserva el stack existente. Desde cero, la propuesta es Next.js + React + TypeScript, estilos coherentes (Tailwind o CSS modular), Supabase para autenticación/datos/archivos y Three.js cuando exista un recurso 3D compatible. Las versiones se verifican antes de instalar.

Separar UI, combinaciones, persistencia y adaptadores IA. Componentes previstos: `OrbNavigation`, `WardrobeLayout`, `GarmentCard`, `UploadGarmentDialog`, `RecommendationPanel`, `OutfitBuilder`, `OutfitPreview` y `SavedOutfits`. Modelar categorías, prendas, usos, imágenes frontal/trasera, conjuntos/piezas, avatar y trabajos de generación. Los IDs internos nunca parecen códigos comerciales.

Los datos se persisten y recuperan en dispositivos autenticados; `localStorage` no es la única base. Un fallo nunca muestra falso “Guardado”.

## 19. Privacidad y seguridad

Privado por defecto. Autenticación y autorización limitan prendas, conjuntos y fotos al propietario. Supabase usa RLS por propietario para lectura/escritura y valida referencias cruzadas. Buckets privados con acceso autenticado o URL firmada breve y políticas correctas; nunca hacerlos públicos como arreglo.

Claves de IA/privilegiadas solo en servidor, nunca `NEXT_PUBLIC_`. `.env.example` no contiene secretos. Validación servidor de archivos/entradas, límites de solicitudes y logs sin fotos, claves o URLs privadas. Exportación y borrado incluyen datos e imágenes, y los temporales se protegen.

## 20. Rendimiento, estados y accesibilidad

Miniaturas progresivas, precarga razonable de traseras y visor optimizado; auras fluidas. Estados útiles para vacío, categoría/búsqueda sin resultados, sin complementos, carga, imagen fallida, IA no configurada y generación fallida. No hay ropa ficticia en datos reales; fixtures solo aisladas.

Controles semánticos, teclado, foco visible, nombres accesibles, objetivos táctiles, movimiento reducido y sin destellos. Nada esencial depende del hover.

## 21. Pruebas de aceptación mínimas

A. Una prenda frontal y otra frontal/trasera: principal, hover y control táctil correctos.  
B. Trabajo + otro uso se rechaza en interfaz y servidor.  
C. Casa + Dormir muestra una sola prenda en ambos ámbitos.  
D. Sinónimos reutilizan categoría sin duplicados.  
E. Favorito persiste tras recarga y no selecciona la tarjeta.  
F. Base fijada y cambio de complementos respetan uso, disponibilidad y fijaciones.  
G. Armario insuficiente explica faltantes sin inventar.  
H. Conjunto recuperable en otro dispositivo con iguales referencias/preferencias.  
I. Cambio/borrado de una prenda advierte y no presenta render antiguo como actual.  
J. API fallida/no configurada no da falso éxito; flujo manual sigue usable.  
K. Visor ofrece ángulos coherentes, sin giro vertical ni foto plana disfrazada.  
L. Acceso no autorizado a datos/archivos se rechaza; revisar móvil, teclado y movimiento reducido.

## 22. Entrega y forma de trabajo

Revisar entorno y planificar brevemente. Implementar por etapas verificables, priorizando subir, guardar, clasificar, seleccionar, combinar, visualizar y recuperar; no detenerse en una home vistosa. Entregar código ejecutable, estructura, migraciones/RLS/storage, `.env.example`, instalación y pruebas.

Separar explícitamente lo implementado y probado, implementado no probado y dependencias ausentes. No afirmar comprobaciones no ejecutadas. No publicar, cambiar dominios, fusionar ni activar servicios de pago sin autorización. No sustituir silenciosamente el probador. La prioridad es la ropa, usos y datos reales del propietario; ninguna animación sustituye funcionalidad.

## Referencias oficiales para verificar la implementación

- [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase Storage privado](https://supabase.com/docs/guides/storage/buckets/fundamentals)
- [Variables de entorno de Next.js](https://nextjs.org/docs/app/guides/environment-variables)
- [OrbitControls de Three.js](https://threejs.org/docs/pages/OrbitControls.html)
- [Ejemplo de probador que devuelve imágenes, no malla 3D](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/capabilities/generate-virtual-try-on-images)
