# Estructura de un repo de curso/proyecto AIEP

Todo repo de trabajo en AIEP comparte el mismo esqueleto. No es casualidad: la estructura **encaja
con las skills** — cada carpeta-unidad tiene la forma que producen `clase-design` → `slides-aiep` +
`slides-system` → `infografias-aiep` → NotebookLM. Cuando una skill dice "leer el `README.md` de la
clase", asume este patrón.

## El esqueleto

```
docs/                  Documentos que comparte AIEP: la fuente oficial.
                       Planificaciones (PEV/PL), programa de la asignatura, marcos conceptuales.
                       Es input, no se inventa: las skills lo leen como contexto autoritativo.

cronograma/            La planificación en el tiempo, detallada.
                       README.md (el cronograma legible) + el PDF oficial (ej. 00_Cronograma.pdf).
                       Es la columna vertebral: clase-design, cohort-comms y evaluacion-design
                       arrancan leyendo esto.

clases/   ó  talleres/   El cuerpo del trabajo. La forma cambia según el tipo de repo:
```

### Variante clases (cursos regulares, ej. pro301)

```
clases/
  semana-09/
    01/                 una sesión (clase) dentro de la semana
      README.md            el contenido de la clase           → clase-design
      ppt/                 el deck (source/ + .pptx)           → slides-aiep + slides-system
      infografia/          material complementario             → infografias-aiep
      podcast/             resumen de audio                     → NotebookLM
    02/  03/  ...
```

### Variante talleres (proyectos, ej. geogreen)

```
talleres/
  01/
    README.md              planificación/contenido del taller
    documentos/            planificación docente (PDF/HTML)
    infografias/           láminas del taller                  → infografias-aiep
    ppt/                   el deck (source/ + .pptx)           → slides-aiep + slides-system
  02/  03/  ...
```

### Sólo en proyectos de Vinculación con el Medio (ej. geogreen)

```
reuniones/
  2026-06-22-socio-comunitario/
    *.pptx                 deck con sello "Vinculación con el Medio"   → reuniones-vcm
    build/                 armar-*.js + fusionar.py + agregar-video.py
    base/                  la base institucional (slides 1–5 de la directora)
```

## Infra del framework dentro del repo

```
.agent/skills/         las skills, sincronizadas desde aiep-educator-skills (aiep-skills sync)
tools/                 slides-system + validators (enlazados/sincronizados)
AGENTS.md / CLAUDE.md  guía del repo para los agentes
```

## Qué NO es parte del patrón

El framework cubre el **trabajo regular**: cursos (`clases/`) y proyectos (`talleres/` + `reuniones/`).
Quedan **fuera del patrón** los one-offs que no se repiten ni alimentan el flujo del módulo:

- **Clases particulares** (tutorías 1-a-1, ayudar a alguien con algo que estudia).
- **Eventos/charlas puntuales** (un taller suelto de Power BI + IA, una charla a 4° medio).

Estos no deben ensuciar la estructura estándar del repo de curso. Lo limpio es que vivan en **su
propio repo** (o, si tienen que estar acá, en una carpeta claramente marcada como fuera del flujo,
ej. `extras/`, sin asumir el contrato de carpeta-unidad). El `aiep-skills sync` instala el framework
igual; simplemente no andamia ni valida lo que está fuera del patrón.

## La carpeta-unidad como contrato

La unidad de trabajo (una sesión de clase o un taller) tiene una forma estable:
**`README.md` + `ppt/` + material complementario (`infografia/`, `podcast/`)**. Ese contrato es lo
que permite que las skills y el `aiep-skills` CLI sepan dónde leer y dónde escribir sin
configuración por repo. Mantener la forma es lo que mantiene el flujo reproducible de clase en
clase y de proyecto en proyecto.

El CLI (`cli/`) puede andamiar tanto un repo nuevo completo (`docs/ cronograma/ clases|talleres/`)
como una unidad nueva (`semana-XX/NN/` con su `README.md` + `ppt/` + carpetas de complementos).
