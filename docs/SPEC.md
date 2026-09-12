# SUPERPROMPT — ARMARIO DIGITAL PERSONAL CON ESTILISTA Y PROBADOR VISUAL

Actúa como un equipo formado por un diseñador de producto, un especialista en interfaces y animación, un desarrollador full-stack y un ingeniero de IA aplicada a imagen y recomendaciones.

Diseña e implementa una aplicación web personal de armario digital. Debe organizar mis prendas reales, ayudarme a combinarlas y mostrar conjuntos sobre una persona o maniquí humano fotorrealista, con el objetivo de disponer de una vista 360° horizontal.

No quiero solamente una propuesta, una landing page, un mockup o una demo con botones decorativos: quiero una aplicación funcional. No presentes como terminadas las integraciones que no hayas conectado y probado.

Si ya existe un proyecto, examínalo y conserva lo que funcione antes de modificarlo. Si partes de cero, utiliza “Mi armario” como nombre provisional editable. Toda la interfaz debe estar en español.

## 1. PROPÓSITO Y LÍMITES

Es mi armario privado, no una tienda. Solo se trabaja con prendas y accesorios que yo haya incorporado. No añadas precios, compras, carrito, marcas inventadas, productos patrocinados ni recomendaciones para comprar ropa.

La experiencia principal es: entrar, elegir un uso, explorar mis prendas, seleccionar una, descubrir con qué combina, montar un conjunto, visualizarlo y guardarlo.

Mantén separadas tres cosas: el uso de una prenda, su categoría y los conjuntos guardados. Una camiseta pertenece a “Camisetas”; puede estar autorizada para “Casa”; y puede formar parte de varios conjuntos. No dupliques la prenda por aparecer en varios conjuntos o usos.

## 2. CUATRO USOS Y UNA QUINTA SECCIÓN

TRABAJO: prendas exclusivamente para trabajar en una tienda de muebles donde también reparto y monto muebles. Ninguna prenda de Trabajo puede tener simultáneamente otro uso. Aplica esta restricción en interfaz, servidor y base de datos. No interpretes trabajo como oficina, traje o americana. Tampoco deduzcas certificaciones de protección laboral a partir de fotografías.

SALIR: mi ropa buena para ciudad, paseos, comidas, cenas, citas, planes sociales y fiestas. Puedo elegir un estilo casual, arreglado o más festivo sin abandonar este uso.

CASA: ropa cómoda, vieja o gastada para sofá, cocina, jardín y tareas domésticas. Algunas prendas también pueden estar autorizadas para Dormir si yo lo indico.

DORMIR: pijamas y prendas que yo destine a dormir. No obligues a que exista un pijama comprado como juego completo; puedo combinar prendas sueltas.

CONJUNTOS: quinta sección principal para combinaciones guardadas. No es un quinto uso ni una categoría de prendas. Dentro de ella se puede filtrar por los cuatro usos anteriores.

Yo decido los usos al subir o editar una prenda. Nunca los asignes silenciosamente basándote en su aspecto. Fuera de Trabajo, permite usos compartidos únicamente cuando yo los autorice expresamente; especialmente Casa y Dormir.

## 3. DIRECCIÓN ARTÍSTICA

Quiero una aplicación sofisticada, inmersiva y personal: un armario con asistente de estilismo, no un comercio electrónico ni un panel administrativo.

Utiliza un fondo oscuro profundo, superficies ligeramente más claras, iluminación ambiental sutil, bordes delicados, tipografía legible y fotografías de prendas protagonistas. Combina un toque editorial de moda con una interfaz tecnológica discreta.

Define colores, espaciados, radios y sombras mediante tokens reutilizables. Propongo negro carbón para el fondo, gris grafito para paneles, blanco cálido para texto y acentos vinculados al uso activo. Evita que toda la interfaz sea una masa de degradados o neón.

Los títulos y botones deben tener contraste real. No acepto botones negros con texto invisible, textos diminutos, brillos que tapen información ni paneles translúcidos que dificulten leer.

Las tres referencias visuales representan: distribución interior en cuatro columnas, aspecto de un orbe energético y composición flotante de los accesos. Los colores del boceto de columnas son anotaciones explicativas, no una obligación de pintar cada panel de ese color. Si las imágenes no están adjuntas, esta descripción debe bastar para construir la composición.

## 4. HOME CON CINCO ORBES VIVOS

La entrada debe mostrar cinco grandes accesos circulares u orgánicos, como pequeñas esferas de energía suspendidas. No los sustituyas por cinco tarjetas rectangulares con iconos dentro.

Organízalos como una constelación equilibrada, sin solapamientos ni movimientos que dificulten pulsarlos. El quinto orbe, Conjuntos, debe tener tanta presencia funcional como los demás, aunque no aparezca en el boceto original.

TRABAJO: blanco perlado, plata y azul acero; corrientes internas controladas y una presencia firme, práctica y sobria. Energía de trabajo real, no estética de oficina corporativa ni herramientas de dibujo animado.

SALIR: rojo, violeta y azul eléctrico, con reflejos que evoquen ciudad nocturna, luces de fiesta y citas. Más dinámico y expresivo, pero elegante, sin destellos estroboscópicos.

CASA: ámbar, naranja suave y dorado cálido; luz envolvente, remolinos lentos y sensación de hogar, sofá y comodidad. No una bola de fuego.

DORMIR: turquesa, azul nocturno y lavanda tenue; niebla suave, respiración visual lenta y partículas muy discretas. Debe transmitir descanso, no energía agresiva.

CONJUNTOS: champán, blanco nacarado y violeta refinado; bandas luminosas que se unen, evocando una colección de looks seleccionados. Debe ser claramente distinto de Salir.

Cada orbe tendrá un nombre legible, preferentemente fuera de la zona más luminosa, y una breve descripción opcional. Usa los nombres Trabajo, Salir, Casa, Dormir y Conjuntos; no utilices “Exit”, que podría confundirse con cerrar la aplicación.

Anima dos capas independientes: flotación exterior lenta y movimiento interior de la energía. Como punto de partida, desplazamientos de 6–10 px y ciclos de 8–14 segundos, desfasados entre orbes. En hover o foco, intensifica ligeramente el halo y aumenta suavemente la escala.

Deben permanecer animados mientras sean visibles, salvo preferencias de movimiento reducido. En ese caso conserva una composición estática igualmente cuidada. Pausa animaciones fuera de pantalla o con la pestaña oculta. No incluyas sonido automático.

## 5. INTERIOR: CUATRO COLUMNAS EN ESCRITORIO

Respeta esta distribución, de izquierda a derecha:

CATEGORÍAS | MIS PRENDAS | COMBINA CON… | VISTA PREVIA

Categorías: columna estrecha con las categorías disponibles para el uso activo y sus cantidades reales. Permite ver favoritos sin convertirlos en otra categoría de ropa.

Mis prendas: cuadrícula de fotografías de la categoría elegida. Debe aprovechar el espacio con dos o tres tarjetas por fila cuando su anchura lo permita. Resalta la prenda seleccionada sin tapar la imagen.

Combina con…: recomendaciones para esa prenda, agrupadas por función: pantalones, calzado, capas y accesorios que correspondan. No muestres otra lista genérica del armario sin relación con la selección.

Vista previa: panel con el conjunto en construcción, acceso a sus prendas reales y el visor realista. Dale anchura suficiente para apreciar cuerpo completo, zapatos y accesorios; no lo conviertas en una tira estrecha.

Por encima sitúa una barra compacta con volver a los orbes, uso activo, búsqueda, filtros y “Añadir prenda”. Mantén accesible el cambio de uso sin obligar a volver a la home.

Usa un layout adaptable, no anchuras rígidas que provoquen desbordamientos. Orientativamente: categorías alrededor de 160–180 px y el resto distribuido entre tres paneles amplios. Cambia de distribución antes de que las tarjetas o el preview resulten demasiado pequeños.

## 6. ADAPTACIÓN A MÓVIL Y TABLET

No reduzcas las cuatro columnas hasta hacerlas ilegibles. En móvil utiliza vistas o pestañas “Armario”, “Recomendaciones” y “Preview”, con categorías accesibles mediante un selector o panel desplegable.

Conserva la prenda seleccionada, filtros y conjunto provisional al cambiar de pestaña. Las acciones importantes deben ser cómodas de pulsar y la estrella de favoritos no puede depender de hover.

En tablet puedes mantener dos paneles y abrir el preview en un panel ampliable. En escritorio, permite ampliar el visor sin perder el conjunto. Evita scroll horizontal global y controles pegados a los bordes.

## 7. SUBIDA: UNA PRENDA, UNA O DOS FOTOS

Cada prenda admite una fotografía frontal obligatoria y una trasera opcional. No exijas la trasera cuando no aporte nada. Nunca generes una fotografía trasera artificial para completar su ficha.

Presenta dos zonas inequívocas: “Delantera” y “Trasera — opcional”. Permite intercambiarlas si las he colocado al revés. La imagen principal guardada siempre es la delantera.

Admite cámara del móvil, selección de archivos y arrastrar imágenes. Para cargas por lotes, ofrece una bandeja de revisión donde pueda asociar cada trasera a su prenda. No asumas que cada par de archivos consecutivos corresponde a una misma prenda.

Detecta posibles duplicados y pregunta antes de unirlos o descartarlos. No elimines automáticamente fotos parecidas. Si hay varias prendas distintas en una fotografía, pide separarlas o identificarlas antes de crear registros ambiguos.

Conserva una imagen fuente fiel y privada; genera versiones optimizadas aparte. Elimina metadatos de ubicación innecesarios. Un recorte de fondo debe ser reversible y no modificar logos, colores, estampados o siluetas. Nunca sustituyas la fotografía real por una prenda genérica.

Permite corregir orientación y encuadre. Valida archivos, tamaños y formatos; explica cualquier incompatibilidad sin perder el formulario.

## 8. FICHA SIMPLE Y CATEGORIZACIÓN

La información visible de cada prenda debe limitarse a:

Título: Camisa azul de manga larga.
Categoría: Camisas.
Uso: Salir.

Otro ejemplo válido sería “Camiseta cómoda”, categoría “Camisetas”, usos “Casa · Dormir”, cuando yo autorice ambos.

No muestres SKU, identificadores internos, precios, fichas técnicas, estampado como campo obligatorio ni subcategorías redundantes. La estrella y las acciones de edición son controles, no más campos informativos.

En la subida o edición añade un apartado opcional de notas: “Es fresca”, “Abriga mucho”, “Tejido grueso”, etc. Utiliza esa información para las recomendaciones sin convertir la tarjeta en una ficha enorme.

La IA debe proponer título y categoría a partir de las imágenes, y yo puedo corregirlos. Las propiedades que no se puedan determinar con seguridad deben quedar sin confirmar; mi información manual prevalece sobre la inferencia.

Reutiliza categorías existentes antes de proponer nuevas. Normaliza singular/plural, mayúsculas, acentos y sinónimos: “Camiseta”, “Camisetas” y “T-shirt” no deben crear tres categorías. Solo crea una nueva cuando realmente no encaje y tras confirmación.

Contempla camisas, camisetas, blusas, sudaderas, prendas de punto, pantalones largos y cortos, faldas, vestidos, chaquetas, abrigos, calzado, cinturones y accesorios cuando existan prendas de esos tipos. No llenes la navegación con categorías vacías innecesarias.

Distingue la categoría “Pijamas” del uso “Dormir”: una camiseta puede servir para dormir sin dejar de pertenecer a Camisetas. Permite renombrar o fusionar categorías sin perder sus prendas.

## 9. TARJETAS, HOVER Y FAVORITOS

Muestra la fotografía completa dentro de un marco proporcionado, sin deformarla ni recortar partes importantes. Todas las tarjetas deben mantener una estructura visual consistente.

En reposo, muestra siempre la delantera. Al pasar el ratón, eleva la tarjeta unos 4 px, aumenta su escala aproximadamente a 1,015 y refuerza delicadamente borde y sombra, con una transición de unos 200 ms.

Si existe trasera, combina esa animación con una transición suave de opacidad a la segunda fotografía. Al retirar el ratón, vuelve a la delantera. Si solo existe una foto, realiza únicamente la animación: nada de imágenes vacías o reversos inventados.

En móvil y con teclado, ofrece un control explícito “Ver detrás / Ver delante” solo cuando exista segunda imagen. No hagas que el mismo toque seleccione la prenda y cambie de foto de forma confusa.

Incluye una estrella en una esquina, con área de pulsación cómoda y estados claros. Activarla significa “esta prenda me gusta mucho”. Guarda la preferencia de verdad y úsala para dar algo más de peso a esa prenda en recomendaciones, sin convertirla en obligatoria.

Pulsar la estrella no debe seleccionar accidentalmente la tarjeta. Diferencia favorito, selección actual y prenda fijada: son tres estados distintos.

## 10. SELECCIÓN Y CONSTRUCCIÓN DEL CONJUNTO

Seleccionar una prenda la convierte en la prenda base. Muestra claramente “Combinando con…” y su fotografía. Puede ser una camiseta, pantalón, calzado u otro elemento, no solo una parte superior.

Las recomendaciones deben actualizarse para complementar esa base dentro del uso activo. Elegir un pantalón recomendado lo añade al conjunto; elegir otro pantalón alternativo lo sustituye, en lugar de poner ambos a la vez.

Permite fijar prendas para conservarlas al regenerar, cambiar únicamente una pieza, quitar accesorios y guardar la combinación. No cambies silenciosamente una pieza fijada.

Si cambiar de uso hace incompatible el conjunto provisional, explica el conflicto y pide confirmación antes de reiniciarlo. No reutilices prendas de Trabajo en otro uso.

Separa las recomendaciones del render: explorar, hacer hover o marcar favoritos no debe disparar una generación visual de pago. Actualiza inmediatamente la composición de prendas reales y utiliza un botón “Generar vista IA” para solicitar la simulación.

## 11. GENERADOR: REGLAS Y PREFERENCIAS

Permite generar conjuntos por uso, clima, estilo y prendas fijadas. Para el clima, empieza con selección manual: frío, fresco, templado y cálido. No solicites ubicación ni añadas una API meteorológica por defecto.

Prioriza reglas obligatorias antes de criterios estéticos. Todas las piezas deben existir en mi armario, pertenecerme, estar disponibles y admitir el uso elegido. Respeta las fijaciones y evita combinaciones físicamente incoherentes.

Después valora colores, proporciones, capas, formalidad, notas de abrigo, favoritos y variedad. Puedes manejar metadatos visuales internos editables, pero no muestres una ficha recargada ni presentes una preferencia estética como verdad universal.

No apliques reglas simplistas como “todo debe ser del mismo color” o “negro combina siempre”. Si la información es insuficiente, propón alternativas prudentes y explica la incertidumbre brevemente.

Ofrece hasta tres propuestas diferenciadas cuando el armario lo permita. Si solo existe una combinación válida, muestra una; no inventes variedad. Cambiar solo el orden de los accesorios no cuenta como un conjunto nuevo.

Añade una explicación breve y específica basada en las prendas seleccionadas. No inventes información sobre su tejido, marca o comodidad.

## 12. QUÉ SIGNIFICA UN CONJUNTO COMPLETO

Para Salir o Trabajo, normalmente será parte superior, inferior y calzado, o una prenda de cuerpo completo más calzado. Añade capas y accesorios cuando sean apropiados y existan.

Para Casa y Dormir, adapta los requisitos: no añadas zapatos de calle, corbata, cinturón o reloj solo por rellenar espacios. No fuerces accesorios ni ropa interior que no haya incorporado y seleccionado.

Respeta la lógica de capas y evita duplicados incompatibles. Un cinturón o una corbata son opcionales, no una obligación en cada propuesta.

Si falta una pieza necesaria, muestra qué falta y conserva la combinación como borrador incompleto. No dibujes calzado o accesorios inventados y luego presentes ese look como compuesto exclusivamente por mi armario.

Incluye un control discreto de disponibilidad, por ejemplo disponible/no disponible. Las prendas no disponibles no deben entrar en nuevas propuestas, aunque sigan apareciendo en conjuntos guardados con el aviso correspondiente.

## 13. CONJUNTOS GUARDADOS

La quinta sección debe permitir guardar conjuntos creados automáticamente o montados a mano. Cada conjunto tendrá un nombre editable, uso, prendas concretas y su preview asociado cuando exista.

Permite abrir, editar, duplicar, eliminar y marcar un conjunto como favorito. Los favoritos de conjuntos son independientes de las estrellas de prendas.

Guarda referencias a las prendas originales, no copias que multipliquen el armario. Conserva una versión de la composición a la que corresponde cada render.

Si una prenda se elimina, cambia de uso o deja de estar disponible, muestra el problema y ofrece sustituirla. No mantengas el conjunto como válido sin avisar. Si cambia la composición, marca el render anterior como desactualizado hasta generar uno nuevo.

## 14. PROBADOR REALISTA: OBJETIVO VISUAL

Quiero ver mis prendas sobre una persona o maniquí humano fotorrealista de cuerpo completo. No acepto como resultado final un collage, una silueta dibujada ni un muñeco genérico con colores aproximados.

Usa una pose natural, fondo de estudio limpio, iluminación estable y proporciones coherentes. Prioriza conservar color, longitud de mangas, corte, estampado, logos, calzado y accesorios identificativos.

La simulación debe corresponder a la composición seleccionada. No añadas ropa para embellecerla, ni sustituyas unas zapatillas por otras parecidas.

Conserva siempre una forma de consultar las fotografías reales junto al resultado. Presenta el aviso: “Simulación orientativa: no garantiza talla, ajuste ni caída exacta”. La fotografía de la prenda sigue siendo la referencia del armario.

## 15. ROTACIÓN 360° HORIZONTAL SIN TRUCOS

El objetivo es un modelo coherente del conjunto vestido que pueda observarse alrededor del cuerpo. Arrastrar a izquierda o derecha debe cambiar el ángulo horizontal; no debe inclinar la cámara verticalmente.

Prioriza una representación tridimensional con geometría y texturas coherentes si el proveedor o pipeline elegido puede producirla con calidad suficiente. Un visor 3D no resuelve por sí mismo la generación fiel de la persona vestida: son dos problemas separados que debes integrar y comprobar.

Si propones una alternativa con una secuencia multivista de imágenes generadas, identifica claramente que es una “Vista multivista IA”, no una malla 3D. Debe cubrir la vuelta completa y mantener la misma persona, prendas y detalles entre ángulos. Solicita aprobación antes de sustituir el objetivo 3D por esta alternativa.

Está prohibido simular el 360° girando una fotografía plana con CSS, reflejando la vista frontal, usando solo dos caras o cambiando entre personas diferentes. Tampoco un vídeo independiente que no corresponda al conjunto seleccionado cumple el requisito.

Con una sola fotografía de una prenda, los detalles ocultos no están documentados. Si se estiman laterales o espalda, indícalo sin afirmar fidelidad exacta. Una fotografía trasera debe utilizarse como referencia adicional cuando exista; no garantiza por sí sola una reconstrucción exacta.

Incluye arrastre, controles de giro accesibles, volver al frente y ampliar. Si usas OrbitControls, fija minPolarAngle y maxPolarAngle al mismo valor y permite la órbita horizontal completa. Mantén cuerpo y zapatos dentro del encuadre.

Si todavía no existe una integración real para producir el recurso 360°, muestra honestamente su estado y lo que falta. Una imagen frontal puede ser una vista provisional, nunca una entrega falsamente etiquetada como 360°. No declares completado este requisito hasta probarlo de extremo a extremo.

## 16. AVATAR PERSONAL OPCIONAL

Por defecto, utiliza una persona o maniquí humano realista neutro. Más adelante podré subir voluntariamente una fotografía mía para personalizar la representación.

No obligues a aportar mi imagen para organizar el armario. Explica para qué se usará y qué proveedor la procesará antes del envío. Permite retirar la imagen y borrar el avatar y los resultados asociados.

No deduzcas ni prometas medidas corporales exactas a partir de una foto. No adelgaces, aumentes la musculatura ni cambies el cuerpo para hacer que la ropa parezca sentar mejor.

Conserva el avatar elegido entre conjuntos y ángulos. Si falta información para una representación fiel, identifícala como aproximación.

## 17. IA REAL E INTEGRACIONES VERIFICADAS

Separa tres módulos: análisis de prendas, recomendaciones y generación visual. No necesitan utilizar el mismo proveedor.

El análisis debe devolver información estructurada validada. El recomendador solo puede seleccionar identificadores internos del armario autorizado. Verifica sus resultados en servidor antes de mostrarlos, aunque el proveedor haya devuelto una respuesta aparentemente correcta.

Implementa un motor básico de recomendaciones por reglas como respaldo funcional. Si no hay análisis visual configurado, permite clasificación manual y no presentes ese modo como reconocimiento por IA.

Antes de seleccionar servicios, comprueba su documentación oficial vigente, formatos, compatibilidad con múltiples prendas, accesorios, imágenes frontal/trasera y resultados multivista o 3D. No presupongas que un servicio de probador que devuelve imágenes también genera modelos 3D.

No inventes endpoints, SDK, credenciales, capacidades o respuestas de éxito. Una interfaz de proveedor sin implementación no cuenta como integración terminada.

Las generaciones deben ejecutarse como tareas persistentes con estados reales: pendiente, procesando, completada y fallida. Añade tiempos de espera, reintentos limitados y prevención de solicitudes duplicadas. No dibujes porcentajes ficticios cuando el proveedor no informa del progreso.

Guarda y reutiliza resultados para la misma composición, versión de imágenes, avatar y configuración. Un resultado antiguo no debe sobrescribir otro conjunto que el usuario haya seleccionado mientras se generaba.

No contrates servicios ni habilites gastos sin autorización. Explica las dependencias y permite establecer límites de generación. Nunca prometas que estas operaciones serán gratuitas o instantáneas.

## 18. ARQUITECTURA Y PERSISTENCIA

Respeta el stack existente cuando sea razonable. Si partes de cero, propongo Next.js con React y TypeScript, un sistema de estilos coherente con Tailwind CSS o CSS modular, Supabase para autenticación/base de datos/archivos y Three.js para el visor cuando exista un recurso 3D compatible.

Verifica versiones y documentación actuales antes de instalar dependencias. No cambies toda una aplicación existente únicamente para adoptar esta propuesta.

Separa componentes visuales, lógica de combinaciones, persistencia y adaptadores de IA. Evita un único componente gigante. Prevé piezas como OrbNavigation, WardrobeLayout, GarmentCard, UploadGarmentDialog, RecommendationPanel, OutfitBuilder, OutfitPreview y SavedOutfits.

Modela categorías, prendas, usos autorizados, imágenes con su rol frontal/trasero, conjuntos, piezas del conjunto, avatar y trabajos de generación. Los identificadores internos son necesarios para relacionar registros, pero nunca deben mostrarse como códigos comerciales.

Guarda todo de verdad y permite recuperar el mismo armario desde móvil y ordenador al iniciar sesión. No utilices localStorage como única base de datos. Una actualización fallida no debe mostrar un aviso falso de “Guardado”.

## 19. PRIVACIDAD Y SEGURIDAD

El armario es privado por defecto. Configura autenticación y autorización para que únicamente su propietario acceda a sus prendas, conjuntos y fotografías.

En Supabase, utiliza políticas RLS por propietario para lectura y escritura; no confíes solo en ocultar pantallas o filtrar datos en el navegador. Comprueba también las referencias entre registros para impedir asociar prendas de otra cuenta.

Guarda las imágenes en buckets privados. Sirve recursos mediante acceso autenticado o URLs firmadas de duración limitada y políticas de almacenamiento correctas. No conviertas el bucket en público para resolver un error de carga.

Mantén claves de IA y credenciales privilegiadas exclusivamente en servidor. En Next.js, no las coloques en variables NEXT_PUBLIC_, que se exponen al navegador. Entrega .env.example sin secretos.

Valida archivos y entradas en servidor, limita solicitudes y evita registrar fotos, claves o URLs privadas en logs innecesarios. Ofrece borrado y exportación del armario con sus imágenes y datos; protege también los archivos temporales de exportación.

## 20. RENDIMIENTO Y ESTADOS DE INTERFAZ

Carga progresivamente miniaturas, precarga la trasera de forma razonable y optimiza el visor sin cargar recursos enormes en todas las pantallas. Las auras no deben impedir navegar con fluidez.

Ofrece estados cuidados para armario vacío, categoría sin prendas, búsqueda sin resultados, prenda sin complementos, carga pendiente, imagen fallida, IA sin configurar y generación fallida. Cada estado debe indicar una acción útil.

No llenes mi armario con ropa ficticia para que parezca terminado. Las pruebas pueden utilizar fixtures aisladas, nunca mezcladas con los datos reales.

Utiliza controles semánticos, navegación con teclado, foco visible, nombres accesibles para iconos y objetivos táctiles cómodos. Respeta movimiento reducido y evita destellos rápidos. No ocultes funciones esenciales detrás del hover.

## 21. PRUEBAS DE ACEPTACIÓN

Comprueba, como mínimo, estos escenarios:

A. Subir una prenda con una foto y otra con frontal/trasera: principal correcta, hover correcto y alternativa táctil funcional.
B. Intentar asignar Trabajo y otro uso: operación rechazada tanto desde interfaz como desde servidor.
C. Autorizar Casa y Dormir: una sola prenda aparece en ambos ámbitos sin duplicarse.
D. Reconocer sinónimos de categoría: se reutiliza la existente y no se crean duplicados.
E. Marcar favoritos y recargar: persisten y la estrella no selecciona accidentalmente la prenda.
F. Seleccionar una base, fijarla y cambiar complementos: se respetan uso, disponibilidad y fijaciones.
G. Tener un armario insuficiente: se explican faltantes sin inventar prendas ni completar con accesorios ajenos.
H. Guardar un conjunto y abrirlo desde otro dispositivo: se recuperan las mismas referencias y preferencias.
I. Cambiar o borrar una prenda de un look guardado: aparece la advertencia y no se presenta un render antiguo como actual.
J. Fallar la API o carecer de configuración: no aparece un falso éxito y el armario manual sigue siendo utilizable.
K. Probar el visor: ángulos distintos y coherentes, sin giro vertical ni fotografía plana disfrazada de 360°.
L. Intentar acceder sin autorización a datos o archivos: el acceso es rechazado. Revisa también móvil, teclado y movimiento reducido.

## 22. ENTREGA Y FORMA DE TRABAJO

Empieza revisando el entorno y define un plan breve. Implementa por etapas comprobables sin detenerte tras una home vistosa. Prioriza el flujo completo: subir, guardar, clasificar, seleccionar, combinar, visualizar y recuperar.

Entrega código ejecutable, estructura clara, migraciones, políticas de acceso, configuración de almacenamiento, .env.example, instrucciones de instalación y conexión, y pruebas relevantes.

Distingue expresamente lo implementado y probado, lo implementado pero no probado y lo que dependa de credenciales, servicios o recursos todavía ausentes. No afirmes que el build o las pruebas han pasado si no los ejecutaste.

No me devuelvas únicamente consejos o una lista de tecnologías. Trabaja sobre los archivos disponibles. Pregunta solo por bloqueos reales que no puedas resolver con esta especificación; no me vuelvas a pedir decisiones de diseño que ya están definidas.

No publiques en producción, cambies dominios ni actives servicios de pago sin autorización. No sustituyas silenciosamente el probador realista por una solución más fácil.

La prioridad final es una aplicación que use MI ropa, respete MIS usos, conserve MIS datos y tenga la experiencia visual descrita. Ninguna animación compensa una recomendación inventada; ninguna maqueta bonita sustituye una función que no existe.

FIN DEL PROMPT.

## REFERENCIAS OFICIALES PARA VERIFICAR LA IMPLEMENTACIÓN
- Supabase RLS: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase Storage privado: https://supabase.com/docs/guides/storage/buckets/fundamentals
- Variables de entorno Next.js: https://nextjs.org/docs/app/guides/environment-variables
- OrbitControls de Three.js: https://threejs.org/docs/pages/OrbitControls.html
- Ejemplo de probador virtual que devuelve imágenes, no una malla 3D: https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/capabilities/generate-virtual-try-on-images
