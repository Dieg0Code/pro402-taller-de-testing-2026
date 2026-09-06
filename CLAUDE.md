# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Este repo usa la guía de agentes en **`AGENTS.md`**: es lo primero que se debe leer. Las
convenciones del framework están en `docs/estandares.md` y `docs/audiencias.md`, y las skills en
`.agent/skills/` (`clase-design`, `slides-aiep`, `infografias-aiep`, `evaluacion-design`,
`cohort-comms`, `reuniones-vcm`).

Este archivo no repite esas guías: agrega lo operativo que solo se descubre trabajando.

## Qué es este repo

No es una aplicación: es el material de un módulo docente de AIEP, y su código existe para
**generar artefactos**. La unidad de trabajo es la carpeta-clase (`clases/semana-NN/N/`), que
contiene su `README.md`, su deck en `ppt/`, y los complementos `infografia/` y `podcast/`.

La consecuencia arquitectónica que hay que tener siempre presente:

> **El `.pptx` es un artefacto, no una fuente.** Se regenera entero desde `ppt/source/<Deck>.js`.
> Nunca se edita el `.pptx`; se edita el `.js` y se vuelve a generar.

Y la jerarquía de verdad, que decide qué gana cuando dos documentos se contradicen:

```
docs/  >  cronograma/README.md  >  clases/.../README.md  >  el deck
```

El deck **deriva** del README de su clase; no inventa otra versión del contenido.

## Comandos

Generar un deck (escribe el `.pptx` en la carpeta `ppt/` de su clase):

```bash
node clases/semana-03/03/ppt/source/Clase-09-Elegir-Los-Casos.js
```

Validar integridad estructural del `.pptx` — obligatorio antes de cerrarlo:

```bash
dotnet run --project tools/pptx-validator -- clases/semana-03/03/ppt/Clase-09-Elegir-Los-Casos.pptx
```

(`docs/estandares.md` §7 dice `packages/pptx-validator`; en este repo la ruta real es `tools/`.)

Revisar el render, que es donde aparecen los errores que ningún validador ve:

```bash
soffice --headless --convert-to pdf <archivo>.pptx --outdir <dir>
```

…y **leer las páginas del PDF como imágenes**. Sin este paso no se cierra un deck.

Tocar `tools/slides-system` (TypeScript, `src/` compila a `dist/`) obliga a su propia suite:

```bash
cd tools/slides-system
npm run test:all        # typecheck + build + vitest + mojibake/cspell
npm run test -- <patrón> # un solo test con vitest
npm run build           # solo si se modificó src/ y el deck consume dist/
```

Los proyectos Python de demostración que acompañan una clase se ejecutan con `uv`:

```bash
uv run --with pytest pytest -q
uv run ruff check .
```

## Escribir un deck

El fuente se construye sobre `tools/slides-system`, nunca a mano. Detalles que cuestan tiempo si no
se saben de antemano:

- **`addCodePanel(slide, SH, opts)` y `addTerminalPanel(slide, SH, opts)`** reciben `SH`
  (`pptx.ShapeType`) como segundo argumento posicional. Pasarles solo `(slide, opts)` falla con
  «Missing/Invalid shape parameter».
- **Esos paneles dibujan una barra de título dentro del panel**, así que recortan la última línea si
  la altura se calcula solo por cantidad de líneas. Regla medida: `alto ≈ 0.86 + líneas × 0.22` a
  cuerpo 9,6–10,4. La línea que se pierde es siempre la que importa (el `assert`, el `42 passed`).
- **Ningún validador detecta ese recorte.** `validateSlide` encuentra solapes y desbordes; el
  validador .NET encuentra XML corrupto. El recorte solo aparece en el render.
- **Color siempre desde `TOKENS`**, nunca un hex suelto. En la práctica el token `guide` (`96A3B2`)
  no se usa: es un gris frío sobre papel cálido y proyectado parece un color que falló.
- El lienzo es 13.333 × 7.5 pulgadas; el margen del módulo es `M = 0.72`.
- Cada lámina termina en `validateSlide(slide, pptx)`.
- Si un patrón se repite entre decks, se migra a `slides-system`; no se copia local.

**Al parchear un `.js` de deck, usar un script de Python (`pathlib` + `str.replace` con `assert`),
no un heredoc de bash.** Los `\n` dentro de las cadenas JS se convierten en saltos literales y
rompen el archivo con `SyntaxError: Invalid or unexpected token`.

## Cosas que sorprenden

- **Las rúbricas están en `.gitignore`** (`**/rubrica_eval_*.md`): son instrumento interno y no se
  distribuyen. Las instrucciones de evaluación sí se versionan.
- Los previews de render (`**/ppt/rendered*/`) también están ignorados: son regenerables.
- `tools/pbip-validator` es para Power BI y no participa del flujo de clases.
- El material de cara al estudiante (`README.md` de una clase, deck) **no lleva rutas del repo,
  notas al docente ni comentarios meta**. Los ejercicios viven en el README, nunca en el deck.

---

Encontré configuración de OpenAI Codex (`~/.codex/config.toml`) y de Gemini CLI
(`~/.gemini/settings.json`). Si quieres importar lo que sea aprovechable —servidores MCP, comandos,
subagentes, skills, instrucciones— responde `/import` para ver el listado, y después
`/import --yes=<digest>` para aplicarlo.
