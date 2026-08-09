# El framework

`aiep-educator-skills` no es una colección de skills sueltas: es un **flujo de producción de
material docente AIEP** sobre un **sistema visual compartido**. La misma maquinaria sirve una clase
técnica, un taller escolar, una rúbrica, un mensaje de WhatsApp, una infografía o un deck de
reunión institucional. Lo que cambia entre contextos son tres ejes.

## Los tres ejes

1. **Audiencia** — a quién le hablo. Define el registro y el nivel de tecnicismo. Es el eje que más
   se nos escapaba. Ver `audiencias.md`.
2. **Formato** — en qué sale el material: README de clase, deck `.pptx`, infografía PNG, mensaje de
   chat, rúbrica, deck de reunión con sello institucional.
3. **Flujo** — en qué momento del trabajo estoy: diseñar el contenido → darle identidad visual →
   construir el artefacto → validar integridad → comunicar/entregar.

Una tarea concreta es un punto en esos tres ejes. "Infografía de cierre de la clase 9 para
alumnos" = formato infografía · audiencia técnica · flujo material complementario. "Deck para el
socio comunitario" = formato deck-VcM · audiencia externa · flujo construir+validar.

## El sustrato: estructura de repo compartida

Los tres ejes operan sobre un esqueleto de carpetas que **todo repo de curso/proyecto AIEP
comparte** (`docs/` · `cronograma/` · `clases/` ó `talleres/` con su carpeta-unidad). Ese patrón no
es decorativo: es el contrato que permite que las skills sepan dónde leer (el `README.md` de la
clase, el cronograma) y dónde escribir (el `ppt/`, la `infografia/`). Ver `estructura-repo.md`.

## El catálogo de skills

| Skill | Qué resuelve | Audiencias típicas |
|---|---|---|
| `clase-design` | Estructura y redacta la clase (README, 4 bloques, ejercicios, cierres) | Técnica, escolar |
| `slides-aiep` | Da identidad visual AIEP a un deck antes de construirlo | Todas |
| `infografias-aiep` | Genera infografías con GPT Image en estilo AIEP, sin logos | Todas |
| `evaluacion-design` | Diseña evaluaciones y rúbricas con política de IA | Técnica |
| `cohort-comms` | Mensajes breves y estratégicos a la cohorte | Técnica, escolar, apoderados |
| `reuniones-vcm` | Decks de Vinculación con el Medio: sello + fusión con base institucional | Directiva, docente, externa |

## El tooling compartido (`packages/`)

- **`slides-system`** — el motor visual: tema AIEP (`theme/tokens.js`), tipografía y la biblioteca
  de componentes PptxGenJS (paneles de código, terminal, browser-mock, árboles DOM, etc.). Todo
  deck del framework se construye reutilizando esto. Si un patrón visual aparece en varios
  contextos, se migra acá en vez de replicarse. La paleta de la app GeoGreen (`app/`) también
  espeja `theme/tokens.js`: el tema es la fuente de color del ecosistema, no solo de los decks.
- **`pptx-validator`** — chequea integridad de `.pptx` en Windows (que PowerPoint lo abra sin
  intentar repararlo). Quality-gate obligatorio antes de cerrar un deck.
- **`pbip-validator`** — chequea integridad de proyectos Power BI (`.pbip`).

## Cómo se relacionan skills y tooling

Las skills **deciden** (qué decir, cómo verse, a quién); el tooling **construye y valida**. Orden
típico de un deck:

1. `clase-design` / contenido fija el mensaje y la audiencia.
2. `slides-aiep` (o `reuniones-vcm`) fija la dirección visual.
3. `slides-system` aporta tema y componentes.
4. la skill `slides` (la built-in de construcción) genera el `.pptx`.
5. `pptx-validator` valida la integridad.
6. `infografias-aiep` o `cohort-comms` producen el material complementario y la comunicación.

## Distribución a los repos de curso

Este repo es la fuente de verdad. Cada repo de curso lo consume con `aiep-skills sync` (ver
`cli/`), que instala/actualiza `skills/` en su `.agent/skills/` y enlaza `slides-system`. Así un
arreglo en un componente o una mejora en una skill se propaga con un comando, sin el copy-paste que
hoy mantiene cuatro copias idénticas a mano.
