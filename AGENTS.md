# Guía para agentes — pro402-taller-de-testing-2026

Módulo de clases de AIEP. Aquí se produce material docente (contenido, decks, infografías,
evaluaciones, comunicación) con las skills instaladas en `.agent/skills/`. El idioma es español
neutro, con tildes y ñ.

## Antes de producir cualquier cosa

1. **Declarar la audiencia** y leer `docs/audiencias.md`. El registro cambia: a los alumnos
   técnicos se les habla con código y jerga; a directiva, otros docentes o externos, claro y sin
   tecnicismo.
2. Respetar la **jerarquía de verdad**: `docs/` (oficial AIEP) > `cronograma/README.md` >
   `clases/.../README.md` > el deck. El deck DERIVA del README; no inventa otra versión.
3. Leer `docs/estandares.md` para nombres, estructura de la carpeta-unidad, idioma/tono y el flujo
   de validación.

## Las skills (`.agent/skills/`)

- `clase-design` — estructurar y redactar la unidad (README, bloques, ejercicios, cierre).
- `slides-aiep` — identidad visual del deck (paleta, logo, densidad según audiencia).
- `infografias-aiep` — infografías estilo AIEP con GPT Image (brief + revisión; sin API).
- `evaluacion-design` — evaluaciones y rúbricas.
- `cohort-comms` — mensajes a la cohorte (WhatsApp).

## Tooling (`tools/`)

- `slides-system` — tema + componentes PptxGenJS. Construir los decks reutilizándolo, no a mano.
- `pptx-validator` (.NET) — integridad del `.pptx`. Antes de cerrar un deck:
  `dotnet run --project tools/pptx-validator -- archivo.pptx`.

## Flujo típico de una unidad

`cronograma` → `README.md` de la unidad → `ppt/` (deck) → validar → `infografia/` + `podcast/`.
No cerrar un deck con overflow, mojibake o si PowerPoint intenta repararlo.
