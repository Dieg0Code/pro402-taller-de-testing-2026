# Patrones de Diapositiva

## Patrones obligatorios

- `Portada institucional`
  Debe incluir el logo AIEP completo en la esquina superior derecha, un título fuerte, subtítulo breve y una composición sobria.

- `Apertura de bloque`
  Debe marcar cambio de tema con azul institucional, acento rojo y preferentemente el `mark` de AIEP.

- `Slide conceptual`
  Ideal para definir una idea, una distinción o un principio. Una idea principal por slide.

- `Comparación en 2 columnas`
  Usar para diferencias, antes/después, conceptos relacionados o decisiones técnicas.

- `Grid de 3 cards`
  Usar cuando haya tres piezas equivalentes o un trio conceptual claro.

- `Grid de 4 cards`
  Usar solo si el contenido respira bien. Si se ve apretado, dividir en dos slides.

- `Flujo o proceso`
  Ideal para recorridos, secuencias, request/response, despliegue o pasos de trabajo.

- `Caso breve`
  Presenta una situación concreta y aterrizada. Debe verse distinta de una slide puramente conceptual.

- `Checklist`
  Útil para cierres parciales, hábitos, validaciones o pasos mínimos.

- `Recapitulación`
  Resume una parte del bloque o conecta varias ideas antes de avanzar.

- `Cierre con preguntas`
  Termina un bloque o la clase con síntesis y apertura a discusión.

## Reglas de composición

- Diseñar alrededor de una idea principal por slide.
- Usar máximo dos focos visuales fuertes por slide.
- Mantener márgenes amplios y consistentes.
- Evitar párrafos largos dentro de cajas pequeñas.
- Si una slide se ve apretada, dividirla.
- Priorizar títulos cortos, jerarquía clara y bloques alineados.
- Reutilizar barras verticales, módulos y divisores inspirados en el logo AIEP.
- No convertir todas las slides en dashboards neutros o grillas idénticas.
- Combinar orden institucional con una composición más viva: contraste de masas, asimetría controlada, cambios de escala y slides de respiro.
- Los fondos claros deben sentirse cálidos; si el resultado se ve clínico, falta personalidad visual.
- Evitar slides construidas solo con `2 o 3` tarjetas grandes de texto corrido; esa solución tiende a verse tosca.
- Cuando una idea pueda fragmentarse mejor, preferir `4+` piezas más ligeras, una composición escalonada o una combinación de bloque principal con apoyos menores.
- La composición debe responder a la función de la idea: comparar, secuenciar, resumir, tensionar, abrir o cerrar no deberían verse igual.
- Coherencia no significa clonación: el deck debe sentirse parte de una misma familia, pero no como una plantilla repetida.
- No encadenar slides cuyo único cambio sea el texto dentro del mismo esqueleto visual.
- La variedad no se limita a una sola clase: un deck nuevo no debería heredar mecánicamente la retícula del deck anterior.
- La identidad AIEP debe venir del sistema visual compartido, no de reciclar la misma distribución de componentes en todas las presentaciones.

## Relación entre contenido y composición

- Una idea central o declaración fuerte pide una composición con jerarquía clara, masas grandes y poco ruido.
- Una comparación pide contraste visible entre lados, no solo dos cajas equivalentes por costumbre.
- Un proceso o recorrido pide dirección, secuencia y lectura progresiva.
- Un conjunto de funciones, ejemplos o categorías pide fragmentación en varias piezas más ligeras.
- Una slide de preguntas debe abrir conversación y respirar; no debe parecer una slide de definiciones reciclada.
- Una síntesis o cierre debe reordenar lo visto y preparar el paso siguiente, no repetir la misma retícula del desarrollo.
- Si el contenido cambia de propósito, la distribución también debería cambiar para que el estudiante sienta ese giro.
- Si cambia la clase, el bloque o la intención didáctica, revisar primero si la composición anterior todavía tiene sentido antes de reutilizarla.
- El layout debe reforzar la explicación del contenido concreto de esa clase, no solo mantener continuidad estética con el deck pasado.
- Cuando una slide incluya maquetas de interfaz o componentes web, la composición también debe respetar lógica de UI real: alineación, agrupación, jerarquía y posición esperable de acciones primarias.
- Cuando una slide muestre código o artefactos técnicos, la composición debe acercarse a su medio real: editor para código, terminal para comandos, árbol para archivos, panel para DevTools, etc.
- Si ese artefacto ya existe como componente compartido en `tools/slides-system/`, reutilizarlo en vez de dibujarlo otra vez desde cero dentro de la clase.
- Cuando una slide combine snippet más explicación lateral, la composición debe anclar la explicación al fragmento correspondiente mediante conectores, subrayados o marcas de lectura.
- Si una tarjeta describe una línea, atributo o bloque específico, el estudiante debería poder encontrarlo visualmente sin adivinar.
- Priorizar conectores ortogonales y rutas externas al panel de código; el recorrido debe ayudar a leer, no competir con el snippet.
- Dar más protagonismo al punto de origen y al destino que al trayecto: el color fuerte puede vivir en las marcas de anclaje, mientras la línea de recorrido debe ser más silenciosa.

## Anti-patrones

- Reutilizar la misma distribución de cajas en cuatro o cinco slides seguidas cambiando solo títulos y colores.
- Resolver todo como dos columnas o cuatro cards aunque la idea no lo necesite.
- Diseñar primero una retícula fija y forzar todo el contenido a entrar allí.
- Hacer que apertura, desarrollo, preguntas y cierre se distingan solo por el texto y no por la composición.
- Tratar el layout como decoración y no como parte del mensaje pedagógico.
- Repetir entre clases el mismo mapa visual de cards, paneles o flujos aunque el contenido trate otra familia de ideas.
- Conservar una slide porque “ya funciona” si su distribución no aporta nada específico a la explicación nueva.
- Duplicar componentes técnicos dentro de cada `source/` cuando ya existe o debería existir una versión compartida en `tools/slides-system/`.

## Reglas de ritmo visual

- Alternar slides densas con slides de respiro.
- Abrir cada bloque con una slide más gráfica y menos cargada.
- Intercalar comparaciones, procesos, casos y recapitulaciones para evitar monotonía.
- No encadenar demasiadas slides idénticas en estructura.
- Insertar algunas slides con gesto visual fuerte: portada, apertura de bloque, una declaración conceptual y un cierre memorable.
- Como regla práctica, después de `2` slides con un mismo esqueleto base debe aparecer una variación clara de composición, escala o dirección.
- Si una slide puede intercambiar su contenido con la anterior sin que el layout pierda sentido, probablemente el diseño es demasiado genérico.
