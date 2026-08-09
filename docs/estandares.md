# Estándares del framework

Las convenciones detalladas que todo repo de curso/proyecto AIEP debe respetar. Salen de la
práctica real en `pro301` (el primero) y `geogreen` (la evolución), donde hoy viven repetidas en
cada `AGENTS.md`. Acá son la fuente única; cada repo las hereda vía `aiep-skills sync`.

---

## 1. Jerarquía de verdad

Cuando dos archivos se contradicen, gana el de más arriba:

1. **`docs/`** — documentos oficiales que comparte AIEP (programa, PEV/PL, planificaciones). Es
   input autoritativo: no se inventa ni se contradice.
2. **`cronograma/README.md`** — el marco del módulo/proyecto (fechas, foco, progresión).
3. **`clases/semana-XX/NN/README.md`** (o `talleres/NN/README.md`) — el desarrollo de la unidad.
4. **El deck / la infografía** — se **derivan** del README de la unidad; no crean una versión
   paralela del contenido.

No cambiar por cuenta propia fechas, evaluaciones, enfoque del módulo ni decisiones curriculares
grandes sin consultar. El agente desarrolla dentro del marco, no lo redefine.

---

## 2. Convenciones de nombres

### Decks
- Archivo: `<Tipo>-<NN>-<Tema-En-Guiones>.pptx` (PascalCase con guiones).
  - Clases: `Clase-25-IA-Productos-Web.pptx` — `NN` es el **número global de clase** del módulo
    (no el de la semana). La fuente vive en `source/<MismoNombre>.js` y genera ese `.pptx`.
  - Talleres: `Taller-01-Conciencia-Ambiental.pptx`.
  - Reuniones VcM: `<Proyecto>-<contexto>-<fecha>.pptx`, ej. `GeoGreen-socio-comunitario-2026-06-22.pptx`.

### Infografías
`infografia-<tema>[-<variante>][-<sufijo>].png`, en minúsculas con guiones. Sufijos con significado:
- `-gptimage` → generada con GPT Image (`gpt-image-1`). Distingue de las hechas a mano/vectoriales.
- `-<NNNN>w` → ancho en píxeles (ej. `-2160w`). Para variantes de resolución de un mismo arte.
- `-opcion-a` / `-opcion-b` → alternativas de diseño en revisión.
- `-detallada` / `-limpia` / `-abstracta` → grado de densidad/estilo.

### Documentos
- Los que comparte AIEP conservan su nombre oficial en `docs/` (ej. `PRO301-PL-PEV PED-2026-1.pdf`).

---

## 3. La carpeta-unidad (contrato)

Toda unidad de trabajo deja sus artefactos con esta forma estable (ver `estructura-repo.md`):

```
README.md            el contenido (deriva del cronograma)
ppt/
  <Deck>.pptx          el deck final
  source/
    <Deck>.js          la fuente PptxGenJS que lo regenera
    SOURCES.md         procedencia/licencia de imágenes (si usa imágenes externas)
    assets/            imágenes locales para reconstruir offline
infografia/  | infografias/   pieza(s) final(es) exportada(s)
podcast/             audio final (NotebookLM)
documentos/          (talleres) planificación docente en PDF/HTML
```

El deck final **siempre** debe poder regenerarse desde `source/`. Eso es lo que mantiene el repo
limpio y reproducible.

---

## 4. Boilerplate del deck (`source/*.js`)

Todo deck del framework se construye sobre `slides-system`, no a mano. Estructura base:

```js
const PptxGenJS = require(".../tools/slides-system/node_modules/pptxgenjs");
const slidesSystem = require(".../tools/slides-system");
const { theme, components, utils } = slidesSystem;
const { applyAiepTheme, TOKENS: C, TYPOGRAPHY } = theme;
const { validateSlide } = utils;

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE";          // formato 16:9
applyAiepTheme(pptx, { author, company: "AIEP Osorno", subject, title });
// SLIDE_W = 13.333, SLIDE_H = 7.5 (pulgadas)
```

- Color **siempre** desde `theme/tokens.js` (`TOKENS`), nunca hardcodeado suelto.
- Tipografía desde `TYPOGRAPHY`.
- Cada slide pasa por `validateSlide` (overflow/solapes).
- Componentes reutilizados desde `slides-system`; si un patrón se repite, se migra ahí, no se
  copia local.

---

## 5. Procedencia de imágenes (`SOURCES.md`)

Si un deck usa imágenes externas, guardarlas en `source/assets/` y registrar su origen en
`SOURCES.md` con una tabla **archivo local | fuente (URL) | autor / licencia**. Dos razones:
reconstruir el deck sin red, y dejar la licencia trazable. Los recortes locales se anotan como
"Recorte local de X · mismo origen y licencia".

---

## 6. Idioma y tono

- Todo material visible para la audiencia en **español correcto**: tildes, `ñ`, redacción cuidada.
- Tono **docente, técnico, claro y sobrio**. Profesional, no burocrático ni artificial.
- **Cero meta**: nada de "aquí pondremos", "esta versión del deck", "conviene explicar". El texto
  le habla a la audiencia, no comenta el proceso de armado.
- El registro concreto lo fija la **audiencia** (ver `audiencias.md`): técnico con alumnos,
  claro y sin jerga con directiva/externos.

---

## 7. Flujo de validación de un deck

No basta con generar el `.pptx`. Antes de cerrar:

1. Si el deck depende de `slides-system`, confirmar que la base esté al día.
2. Si se tocó `slides-system`, `npm run test:all` y corregir antes de volver al deck.
3. Si usa TypeScript/`dist/`, `npm run build` antes de regenerar.
4. Regenerar el deck desde su fuente.
5. Validar: overflow, render visual, **PowerPoint abre sin reparar**, y validación estructural
   `.NET` (`dotnet run --project packages/pptx-validator -- "archivo.pptx"`).
6. Corregir solapes, cortes, conectores mal resueltos, mojibake, ortografía o errores de
   integridad XML.

**No cerrar** si: el build falla, la suite de `slides-system` falla tras tocarla, hay overflow o
composiciones rotas, PowerPoint intenta reparar, o el texto quedó con errores de español/encoding.

---

## 8. Materiales complementarios (NotebookLM)

Cuando el `README` y el `PPT` ya estén estables (no antes), preparar dos complementos:
- **infografía** — mapa visual rápido; puede ser más libre que el deck, manteniendo tono técnico y
  seriedad.
- **podcast / resumen de audio** — repaso, prelectura o refuerzo conversado.

El **PPT** respeta identidad AIEP de forma estricta; la infografía de NotebookLM tiene más libertad
visual. (Distinto de `infografias-aiep`, que sí aplica el estilo AIEP estricto vía GPT Image.)

---

## 9. Limpieza y entregables

- En `ppt/` dejar **solo** el `.pptx` final + el `.js` + `source/`. Nada de renders temporales,
  montages, ni versiones `v2`/`v3`. El final se regenera desde la fuente.
- En `infografia/` y `podcast/`, solo la pieza final exportada; no acumular borradores.
- **Entregables externos** (para mandar a AIEP/aliados): RAR con `LEEME.pdf` y **solo formatos
  abribles** (PDF + PNG + PPTX); sin `.md`/`.tex`/`.html`/fuentes. Van en `entregables/`,
  **gitignored** (GitHub se queja con binarios grandes).

---

## 10. `.gitignore` estándar

Ignorar siempre: `**/node_modules/`, `**/.venv/`, `**/__pycache__/`, `**/*.pyc`, `**/bin/`,
`**/obj/`, `**/dist/`, `**/ppt/rendered*/`, `**/ppt/montage*.png`, `*.bak`, ruido de SO
(`.DS_Store`, `Thumbs.db`, `~$*`), entregables (`*.rar`, `/entregables/`).
En proyectos con hardware/secretos también: `.pio/`, `.env*`, `*.token`, `*.key`.

---

## 11. Guía de agentes por repo (`AGENTS.md` / `CLAUDE.md`)

Cada repo lleva su `AGENTS.md` (Codex) y `CLAUDE.md` (Claude) con: propósito, público objetivo,
estructura, jerarquía de verdad, reglas de contenido y flujo de validación. La mayoría de esas
reglas son **estándar del framework** (este documento); el `AGENTS.md` del repo solo agrega lo
específico del módulo/proyecto.

`aiep-skills init` genera de entrada un `README.md` (para el docente), un `AGENTS.md` y un
`CLAUDE.md` base, en español neutro, que **referencian** estos estándares y `docs/audiencias.md` en
vez de repetirlos. Así un docente o un agente que llega frío al repo tiene contexto suficiente para
trabajar sin leer el framework entero.
