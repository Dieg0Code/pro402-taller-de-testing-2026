---
name: clase-design
description: Diseñar, estructurar y redactar clases y talleres en español para este repositorio. Usar cuando el docente necesite crear o mejorar README.md de clases, objetivos de aprendizaje, distribución horaria, bloques de contenido, ejercicios, preguntas guía, diagramas o cierres. El perfil por defecto es una clase técnica de 3 horas con 4 bloques (carrera de programación), pero el registro se adapta a la audiencia (ver docs/audiencias.md): un taller escolar no se diseña como una clase técnica. Alineada al cronograma del repo y desarrollada por secciones bajo demanda.
---

# Clase Design

Usar esta skill para convertir una entrada del cronograma en una clase clara, enseñable y coherente con el flujo de trabajo del docente.

## Audiencia primero

Antes de redactar, **declarar la audiencia objetivo** (ver `docs/audiencias.md`). Define el registro,
el nivel de tecnicismo, los ejemplos y hasta la duración:

- **Técnica** (default): alumnos de la carrera de programación. Aplica todo lo de abajo tal cual:
  sesión de 3 horas, 4 bloques, código, comandos, progresión técnica creciente.
- **Escolar**: estudiantes de liceo (talleres). Lenguaje cercano y motivador, analogías del mundo
  real en vez de jerga, foco en participación y en "yo puedo hacer esto"; la duración y la densidad
  técnica casi nunca son las de una clase de carrera.
- **Docente/no técnica**: si el material es para otros docentes o capacitación, bajar el tecnicismo
  y no asumir el stack del lector.

Todo lo que sigue (4 bloques, distribución horaria, progresión `lunes→miércoles`) es el **perfil
técnico por defecto**. Para audiencias no técnicas, conservar la estructura pedagógica (objetivos →
bloques → cierre) pero recalibrar duración, ejemplos y registro según la audiencia declarada.

## Flujo de trabajo

1. Leer el cronograma relevante y el `README.md` de la clase antes de proponer contenido.
2. **Declarar la audiencia objetivo** (ver `docs/audiencias.md`) y fijar registro y duración antes de redactar.
3. Si la clase toca flujo moderno de desarrollo, IA, agentes, herramientas, validación o criterios actuales del oficio, y el repo incluye `docs/paradigma_agentic_spec_driven_2026.pdf`, revisarlo como marco conceptual complementario (es opcional: no todos los repos lo traen).
4. Mantener un proceso incremental:
   - primero conversar objetivos y reparto en 4 bloques;
   - luego redactar solo la sección que el docente pida;
   - no completar la clase entera de una sola vez salvo que el docente lo solicite.
5. Respetar el horario real de la sesión. Para clases técnicas de 3 horas usar por defecto:
   - `10 min` objetivos y encuadre;
   - `35 min` bloque 1;
   - `35 min` bloque 2;
   - `10 min` pausa;
   - `35 min` bloque 3;
   - `35 min` bloque 4;
   - `20 min` cierre, preguntas o síntesis.
6. Ajustar tiempos solo si el contexto del archivo, la audiencia o el docente piden otra distribución.
7. Cuando ya estén redactados los objetivos y los 4 bloques, hacer una revisión global del `README.md` antes de empezar el PPT.
8. Cuando la clase ya esté estable en `README` y `PPT`, proponer materiales complementarios con NotebookLM:
   - una infografía;
   - y un podcast o resumen de audio.
9. Si esos materiales se generan, dejarlos organizados dentro de la carpeta de la clase como parte del paquete docente final.

## Estructura esperada de una clase

Cuando se redacte una clase completa, usar esta secuencia:

1. Título e información general.
2. Objetivos de la clase.
3. Mapa de la clase.
4. Bloque 1.
5. Bloque 2.
6. Bloque 3.
7. Bloque 4.
8. Cierre, tarea o siguiente paso si corresponde.

## Estructura esperada de carpeta por clase

Usar por defecto esta estructura:

```text
clases/semana-XX/YY/
├── README.md
├── ppt/
├── infografia/
└── podcast/
```

Sentido de cada parte:

- `README.md`: fuente pedagógica principal de la clase.
- `ppt/`: deck final, editable y fuente de construcción.
- `infografia/`: pieza visual final de apoyo para estudiantes.
- `podcast/`: audio final o resumen conversado de apoyo para estudiantes.

Reglas prácticas:

- `ppt/` debe seguir las reglas habituales del repo: dejar solo `.pptx`, `.js` editable y `source/`.
- `infografia/` debe contener la versión final exportada de la infografía.
- `podcast/` debe contener el audio final exportado.
- No usar estas carpetas para acumular borradores descartados o archivos auxiliares innecesarios.

Cuando una clase ya esté cerrada en `README` y `PPT`, asumir por defecto que puede completarse con `infografia/` y `podcast/` para reforzar repaso, síntesis y circulación del material.

Regla visual para esos complementos:

- el `PPT` del repo sí debe respetar identidad AIEP de forma estricta;
- la `infografia/` generada con NotebookLM puede tomar una estética más libre si la herramienta no sigue el prompt con precisión;
- en esas piezas complementarias, priorizar claridad, tono técnico, utilidad pedagógica y seriedad por sobre coincidencia exacta con el sistema visual del deck.
- si NotebookLM ofrece estilos de carrusel, elegirlos con criterio:
  - `Instructivo` por defecto;
  - `Editorial` para clases fundacionales o conceptuales;
  - `Científico` para clases más estructurales o técnicas;
  - `Profesional` para piezas más sobrias;
  - `Cuadrícula bento` para clases modulares;
  - evitar por defecto estilos como `Kawaii`, `Anime`, `Arcilla`, `Ladrillos` o `Boceto`.

## Reglas de diseño pedagógico

- Escribir en español correcto, con tildes y `ñ`.
- Mantener tono docente, claro e institucional; evitar humo, promesas grandilocuentes o frases marketineras.
- Formular objetivos medibles y realistas para el tiempo disponible.
- Diseñar cada bloque con propósito explícito, transición clara y una comprobación breve de comprensión.
- Incluir preguntas guía y momentos de participación, no solo exposición.
- Usar ejemplos, analogías o errores comunes cuando ayuden, pero sin forzarlos en cada sección.
- Para clases conceptuales, preferir diagramas, casos y recorridos mentales antes que código innecesario.
- Para clases prácticas, mostrar progresión de simple a aplicado y dejar tiempo real de trabajo.

## Criterios de contenido para este repo

- Alinear cada clase con `cronograma/README.md`.
- Priorizar fundamentos transferibles sobre herramientas de moda.
- Tratar PHP y Bootstrap como legado o contexto institucional solo cuando el cronograma o el docente lo requieran.
- Favorecer frontend moderno, accesibilidad, APIs, datos, agentes e IA aplicada según el enfoque actualizado del módulo.
- No reintroducir contenidos viejos del curso si ya fueron reemplazados en el cronograma.
- Respetar progresión temporal de profundidad técnica: `lunes` más marco e intuición, `martes` más herramientas y primeras operaciones técnicas, `miércoles` más código, comandos, inspección, debugging y lectura técnica concreta.
- Si la clase cae al final de la semana, aumentar de forma visible la densidad técnica del material sin perder claridad pedagógica.
- En clases de miércoles, procurar que aparezcan más fragmentos de código, más estructuras reales, más comandos o más análisis técnico que en lunes y martes, salvo que el cronograma indique otra intención.
- A medida que avanzan las semanas, aumentar gradualmente la exigencia técnica del material: un día equivalente de una semana posterior no debería quedarse al nivel técnico de una semana inicial si el cronograma ya avanzó.
- Usar la progresión del módulo para que, con el paso de las semanas, crezcan la lectura de código, la interpretación de estructuras reales, la inspección, el debugging y el trabajo con comandos o herramientas concretas.
- Integrar IA y agentes como metodología transversal cuando el contenido lo permita: no como adorno, sino como parte del flujo moderno de trabajo técnico.
- Cuando un concepto técnico sea duro o abstracto, procurar mostrar también cómo un agente podría ayudar a explorarlo, generarlo, explicarlo o revisarlo, y qué parte sigue dependiendo del criterio humano.
- Evitar presentar la IA como reemplazo del aprendizaje. La idea pedagógica correcta es: entender primero, usar apoyo inteligente, verificar después.
- Cuando la clase tenga piezas técnicas duras, no dejar la integración con agentes como comentario decorativo: debe aparecer un puente concreto entre concepto, ayuda posible del agente y validación humana obligatoria.
- Usar como patrón mínimo: qué podría hacer bien un agente, qué no conviene delegar y qué error frecuente aparece cuando se usa sin criterio.
- Cuando sea pertinente, enmarcar esa integración con la lógica de `agentic engineering + spec-driven development`: intención explícita, restricciones, contexto, tareas pequeñas, validación y supervisión.
- No reducir la conversación a “prompts”. Dar más peso a especificación, contexto, gobernanza, herramientas, pruebas y revisión.

## Diseño de bloques

Cada bloque debe incluir, cuando aplique:

- nombre del bloque;
- duración;
- objetivo del bloque;
- desarrollo en 2 a 4 subapartados;
- preguntas de activación, chequeo o discusión;
- puente hacia el bloque siguiente.
- una huella metodológica de IA/agentes cuando el tema la soporte de forma natural.

Patrón recomendado para las 4 secciones:

1. Bloque 1: contexto, motivación y marco conceptual.
2. Bloque 2: núcleo del tema o recorrido guiado.
3. Bloque 3: aplicación, análisis o práctica intermedia.
4. Bloque 4: integración, reflexión, caso final o actividad de cierre.

Cuando sea natural, la integración con IA/agentes puede aparecer como:

- ejemplo de uso responsable;
- contraste entre “pedirle todo al agente” vs “trabajar con criterio”;
- o una microsección de flujo moderno asociada al contenido técnico del bloque.

Cuando el bloque trate temas especialmente técnicos, esa integración conviene aterrizarla en formatos más concretos, por ejemplo:

- “el agente puede proponer una primera versión, pero tú debes inspeccionarla”;
- “el agente puede sugerir comandos, pero debes leer el estado real y validar el resultado”;
- “el agente puede generar HTML o CSS, pero semántica, accesibilidad, cascada y layout deben verificarse”;
- “el agente puede ayudar a explicar un error, pero el diagnóstico final depende de DevTools, consola, logs o pruebas”.

Usar ejemplos como estos según el tema:

- fundamentos web: ayuda a narrar el recorrido técnico, pero no reemplaza comprensión de URL, DNS, HTTP y cliente-servidor;
- HTML semántico: ayuda a bosquejar estructura, pero la revisión de semántica y accesibilidad es humana;
- CSS: ayuda a generar o refactorizar reglas, pero especificidad, responsive y consistencia deben inspeccionarse;
- Git/DevTools: ayuda a proponer pasos o hipótesis, pero historial, estado y debugging deben leerse técnicamente;
- APIs/datos/seguridad: ayuda a bosquejar contratos o validaciones, pero exposición, errores y seguridad no deben delegarse ciegamente.
- trabajo más avanzado del módulo: el estudiante debe aprender a transformar intención en `spec`, `plan`, `tasks` y validación supervisada, no solo a pedir código suelto.

## Progresión por día de semana

Cuando una semana tenga clases en `lunes`, `martes` y `miércoles`, usar por defecto esta progresión:

1. `Lunes`
   Priorizar fundamentos, vocabulario, mapa general, intuición correcta y primeras distinciones.
2. `Martes`
   Empezar a bajar el contenido a herramientas, recorridos operativos, ejemplos guiados, primeras estructuras y primeros comandos.
3. `Miércoles`
   Aumentar claramente la densidad técnica con más código, más comandos, más lectura de estructura real, más inspección en navegador, más análisis de errores y más contacto con piezas concretas del trabajo del desarrollador.

Esta regla no exige convertir toda clase de miércoles en laboratorio duro, pero sí evita que la semana cierre sin suficiente contacto con material técnicamente más exigente.

## Progresión entre semanas

Además de la progresión interna de cada semana, debe existir una progresión acumulativa entre semanas consecutivas.

Eso significa que:

- el `lunes` de una semana posterior puede seguir introduciendo un tema nuevo, pero no debería volver al mismo nivel de suavidad técnica del `lunes` inicial del curso;
- el `martes` y el `miércoles` de semanas posteriores deben mostrar una relación más directa con código, comandos, inspección, análisis técnico o integración real;
- si el módulo ya avanzó, el diseño de la clase debe asumir que el estudiante tolera mejor material más concreto y menos mediado.

En diseño de clase, esto se traduce en aumentar gradualmente:

- snippets y ejemplos de código;
- comandos y secuencias de trabajo;
- lectura de estructuras o archivos reales;
- análisis de errores o casos menos idealizados;
- y ejercicios donde el estudiante tenga que interpretar técnicamente antes de actuar.

La progresión debe ser gradual y enseñable, no brusca. El objetivo no es volver la clase arbitrariamente difícil, sino más cercana al trabajo técnico real a medida que el curso madura.

## Cuándo leer recursos adicionales

Leer solo el archivo que haga falta:

- `assets/readme-template.md`: cuando haya que escribir una clase completa desde cero.
- `references/emotional-hooks.md`: cuando el docente pida una apertura potente o un problema disparador.
- `references/analogies-bank.md`: cuando un concepto abstracto necesite analogía.
- `references/socratic-questions.md`: cuando falten preguntas para guiar la conversación.
- `references/common-errors.md`: cuando convenga incorporar un error común o debugging pedagógico.
- `references/exercise-levels.md`: cuando se diseñen ejercicios diferenciados por nivel.
- `references/mermaid-patterns.md`: cuando se necesiten diagramas Mermaid.
- `references/code-examples.md`: solo cuando la clase realmente necesite código.
- `docs/paradigma_agentic_spec_driven_2026.pdf` (si el repo lo incluye): cuando haga falta actualizar el enfoque del módulo respecto de IA, agentes, `AGENTS.md`, skills, contexto, validación o trabajo moderno.

Si un recurso trae ejemplos desactualizados, adaptar el lenguaje y la tecnología al cronograma vigente antes de usarlo.

## Convenciones de salida

- Si el docente pide solo objetivos, escribir solo objetivos.
- Si pide solo un bloque, escribir solo ese bloque.
- Si pide revisar, priorizar claridad pedagógica, secuencia, tiempo y alineación con el cronograma.
- Mantener consistencia con la estructura que ya exista en el `README.md` de la clase, salvo que el docente pida refactorizarla.
- Si el docente pide materiales complementarios, definir:
  - objetivo del artefacto;
  - formato recomendado;
  - y prompt base reutilizable.

## Revisión global antes del PPT

Cuando una clase ya tiene objetivos y sus 4 bloques redactados, no pasarla de inmediato a presentación. Hacer primero una lectura completa del `README.md` como una sesión unificada.

Ese repaso debe revisar, cuando aplique:

- coherencia entre título, objetivos, bloques y cierre;
- progresión interna entre bloque 1, 2, 3 y 4;
- alineación con el día del cronograma y con la progresión técnica semanal y acumulativa;
- presencia de puentes claros entre bloques;
- ausencia de repeticiones o solapamientos innecesarios;
- existencia de un cierre de clase real, no solo del cierre del último bloque;
- claridad pedagógica del recorrido completo;
- presencia o ausencia justificada de la metodología de IA/agentes dentro de la clase;
- si el tema era técnicamente duro, presencia de una integración explícita y concreta entre contenido, apoyo del agente y validación humana;
- ortografía, tildes, `ñ`, puntuación y redacción general;
- y ausencia de párrafos cortados, ideas a medio cerrar o mojibake.

Si el README todavía se siente fragmentado, desigual o incompleto, corregirlo antes de pasar al PPT.

## Checklist mínimo antes de cerrar una entrega

- Los objetivos son observables o evaluables.
- La distribución calza con la duración real.
- Los 4 bloques se distinguen entre sí y no repiten contenido.
- La clase conecta con el día del cronograma y prepara la siguiente.
- El texto quedó en español correcto.
- El README fue revisado completo antes de convertirse en PPT.
- La clase tiene cierre general además del cierre de cada bloque, cuando corresponda.
- Si corresponde, ya existe propuesta de infografía y podcast alineada con la clase final.
- Si la clase incluye conceptos técnicos exigentes, la metodología de IA/agentes ya quedó integrada de forma concreta y no solo mencionada al pasar.
