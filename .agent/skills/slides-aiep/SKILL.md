---
name: slides-aiep
description: Aplicar identidad visual AIEP a presentaciones de este repositorio. Usar cuando haya que crear, rehacer o pulir decks PPT/PPTX con marca AIEP, paleta institucional, reglas de logo, patrones de diapositiva y control de ritmo. La densidad y el registro se ajustan a la audiencia (ver docs/audiencias.md): deck de clase (sesión larga, ≥60 slides) vs. deck institucional/reunión (~15-30, audiencia directiva/externa → ver reuniones-vcm). Complementa a slides, no la reemplaza.
---

# Slides AIEP

Usar esta skill para definir la dirección visual de una presentación antes de construirla o editarla con `slides`.

## Relación con otras skills

- `slides-aiep` decide cómo debe verse el deck.
- `tools/slides-system/` concentra tema, componentes y utilidades compartidas del repositorio para construir decks.
- `slides` construye, renderiza y valida el deck.
- Orden recomendado:
  1. aplicar `slides-aiep`;
  2. reutilizar `tools/slides-system/` si el deck pertenece a este repositorio;
  3. luego ejecutar `slides`.

## Flujo de trabajo

1. Revisar el `README.md` de la clase y el contexto del módulo, y **declarar la audiencia** (ver `docs/audiencias.md`): define el registro y el perfil de densidad del deck (clase larga vs. presentación institucional).
2. Si el deck pertenece a este repositorio, revisar `tools/slides-system/README.md` y preferir sus componentes compartidos antes de copiar helpers locales.
3. Leer `references/palette.md` para fijar color, contraste y proporciones `60 / 30 / 10`.
4. Leer `references/slide-patterns.md` para elegir layouts y ritmo visual según la función pedagógica de cada slide.
5. Usar los assets oficiales del directorio `assets/`.
6. Construir o ajustar el deck con `slides`.
7. Si se tocó `tools/slides-system/`, ejecutar `npm run test:all` en ese directorio y no cerrar mientras exista un fallo de tipos, build, pruebas o texto.
8. Si el deck nuevo depende de `dist/` o de fuentes TypeScript, ejecutar al menos `npm run build` en `tools/slides-system/` antes de regenerar el `.pptx`.
9. Antes de cerrar, leer `references/quality-gates.md` y comprobar cantidad de diapositivas, legibilidad, coherencia visual y validación operativa.

## Reglas visuales base

- El estilo debe sentirse institucional, técnico y sobrio, pero no frío ni clínico.
- Evitar estética de startup, gradientes ruidosos, colores fuera de marca o slides genéricas sin jerarquía.
- Usar geometría derivada del logo AIEP: barras verticales, módulos rectos, cortes limpios y bloques bien alineados.
- Mantener bastante aire, contraste alto, títulos cortos y una composición con carácter.
- La elegancia es un criterio de diseño, no un extra: si una slide se siente tosca, pesada o rígida, hay que rehacerla.
- Si un patrón visual o artefacto técnico aparece en varias clases, debe migrarse al sistema compartido en `tools/slides-system/` en vez de seguir replicándose dentro de cada `source/`.
- Diseñar cada slide alrededor de una idea principal.
- La distribución de los elementos debe acompañar lo que se está enseñando; el layout también explica.
- No usar el rojo como fondo dominante salvo casos puntuales de énfasis.
- El azul institucional sostiene estructura, aperturas, portadas y cierres.
- Una presentación AIEP puede ser formal sin verse burocrática: debe tener ritmo, tensión visual y una presencia clara.
- Alternar slides sobrias con slides más expresivas para evitar monotonía.
- Evitar slides resueltas solo como `2 o 3` cajas grandes con demasiado texto dentro; suelen verse pesadas y poco refinadas.
- Mantener una misma familia visual no significa repetir el mismo esqueleto de slide cambiando solo el texto.
- Si dos ideas cumplen funciones distintas dentro de la clase, su composición también debe diferenciarse.
- Repetir una misma distribución en cadena debilita la atención del estudiante y empobrece el lenguaje visual del deck.
- La consistencia debe venir de la paleta, la tipografía, los márgenes y el sistema gráfico; la composición puede y debe variar.
- No tratar un deck nuevo como clon del anterior: cada clase debe hablar con identidad propia dentro de la familia AIEP.
- No reutilizar por defecto la distribución de bloques, cards o recorridos de una clase previa si el nuevo contenido pide otra lógica visual.
- El lenguaje visual debe cambiar entre bloques y entre clases cuando cambia la función pedagógica: comparar, abrir, secuenciar, preguntar y cerrar no deberían heredar el mismo esqueleto.
- Si una slide de una clase nueva puede intercambiarse con una de otra clase sin que se note el cambio más allá del texto, el diseño quedó demasiado genérico.
- Si una slide representa componentes web como formularios, botones, inputs, menús, cards o modales, esos componentes deben verse plausibles y bien resueltos.
- No usar UI ficticia descuidada como simple decoración: alineación, espaciado, jerarquía, tamaño de controles y ubicación de acciones deben respetar convenciones básicas de interfaz.
- Si un componente sería importante dentro del módulo real, también debe estar bien construido en la diapositiva; una maqueta torpe enseña mal.
- Cuando una slide incluya código, el snippet debe verse como código real: tipografía monoespaciada, sintaxis coloreada y una presentación cercana a un editor.
- El código es ciudadano de primer orden: mostrar completas las funciones relevantes —incluido su `return`— y nunca recortar una línea necesaria para entender o ejecutar el ejemplo.
- Evitar bloques de código planos, monocromos o sin jerarquía visual; si el material pretende enseñar técnica, el snippet también debe comunicarla visualmente.
- Si una slide explica partes concretas de un snippet, la relación debe verse: usar conectores, subrayados, marcas o anotaciones que calcen con la zona del código que se está comentando.
- No dejar que las tarjetas explicativas “floten” al lado del código sin anclaje visual; si una observación depende de una línea o atributo puntual, esa dependencia debe leerse en la composición.
- No fingir precisión sobre tokens calculando posiciones horizontales a partir del ancho estimado de la fuente. Si el render no garantiza esa geometría, usar marcadores numerados en el gutter y repetir número + línea en una guía integrada de alto contraste.
- Cuando una guía por líneas resuelva la relación, preferir una sola superficie explicativa bien jerarquizada antes que varias cards flotantes unidas por recorridos largos.
- Esos conectores no deben ensuciar el snippet: idealmente salen desde el borde del panel de código y recorren pasillos externos, no atraviesan el bloque de texto ni pisan tokens importantes.
- Los conectores deben ser visualmente secundarios: la marca de color puede vivir en el punto de origen y destino, mientras la línea de recorrido puede ser más silenciosa para no competir con el código.
- Esta exigencia se extiende a otros artefactos técnicos: terminales, árboles de archivos, JSON, respuestas HTTP, paneles tipo DevTools o estructuras similares deben respetar la gramática visual de su herramienta de origen.
- Cuando existan componentes compartidos para esos artefactos, reutilizarlos y mejorarlos en `tools/slides-system/` antes de crear otra versión local para una clase puntual.
- Cuando texto o números vivan dentro de un círculo, el contenedor de texto debe usar exactamente la misma caja que la figura, con alineación horizontal y vertical al centro; comprobar también el centrado óptico en el render.

## Reglas de logo

- Portada: usar el logo completo en la esquina superior derecha con margen generoso.
- Aperturas de bloque: usar el logo completo en tamaño contenido.
- Slides internas: incluir el logo AIEP completo en todas las diapositivas. Este es el estándar vigente; no reemplazarlo por el `mark` ni omitirlo aunque existan otros motivos geométricos de marca.
- En fondos claros, usar la versión institucional a color con transparencia real.
- En fondos oscuros, usar la variante transparente con símbolo rojo y letras/bajada blancas. No encerrar el logo en una placa o caja blanca para resolver contraste.
- No deformar, recolorear arbitrariamente ni estirar el logo; el cambio claro/oscuro debe provenir de variantes institucionales preparadas para cada fondo.
- No poner el logo sobre fondos con bajo contraste.

## Reglas de contenido visible

- El texto de las diapositivas debe hablarle al estudiante, no comentar el proceso de armado del deck.
- Evitar frases meta como `esta versión del deck`, `se desarrollará después`, `aquí pondremos` o cualquier comentario de producción.
- Si una slide muestra el mapa de la clase, debe presentarlo como recorrido de aprendizaje, no como nota técnica sobre el archivo.

## Regla de densidad y ritmo

La densidad depende del **perfil de deck** (ver `references/quality-gates.md`):

- **Deck de clase** (audiencia técnica/escolar, 3 horas): al menos `60` diapositivas, objetivo `60 a 75`.
- **Deck institucional / reunión** (audiencia directiva, docentes, socio comunitario): mucho más corto, `15 a 30`. La regla de `≥60` **no aplica**; usar la skill `reuniones-vcm`.
- Si un deck de clase queda corto, expandir con ejemplos, comparaciones, errores comunes, mini casos, recapitulaciones y transiciones.
- No inflar el deck con texto repetido ni slides vacías.
- Tampoco expandir repitiendo la misma estructura visual una y otra vez: más slides deben traducirse en mejor ritmo, no en más monotonía.

## Cuándo leer recursos adicionales

- `references/palette.md`: siempre, al iniciar un deck nuevo o rehacer uno existente.
- `references/slide-patterns.md`: cuando haya que decidir layouts, aperturas, comparaciones, cards o cierres.
- `references/quality-gates.md`: al expandir el deck y antes de renderizar la versión final.
- `tools/slides-system/README.md`: cuando el deck pertenezca a este repositorio y haga falta decidir si conviene reutilizar un componente o extraer uno nuevo.

## Assets disponibles

- `assets/logo-aiep.svg`: logo principal, ideal para portadas y exportes de alta calidad.
- `assets/logo-aiep.png`: logo principal en PNG.
- `assets/logo-aiep-mark.png`: símbolo simplificado para aperturas de bloque y detalle interno.

## Checklist mínimo antes de cerrar

- La portada usa logo AIEP y respeta márgenes.
- La paleta respeta la proporción `60 / 30 / 10`.
- El rojo aparece como acento, no como ruido.
- El deck se siente AIEP incluso sin leer el logo en cada slide.
- Hay consistencia entre portada, aperturas de bloque y slides internas.
- La cantidad de diapositivas calza con la duración real de la clase.
- El resultado final quedó legible, sin overflow y con ritmo visual.
- Si se tocó `tools/slides-system/`, `npm run test:all` pasó completo.
- Si el deck depende del build compartido, `npm run build` quedó verde antes de generar el `.pptx`.
- PowerPoint abre el archivo sin intentar repararlo.
