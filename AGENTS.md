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

## Densidad pedagógica y uso del espacio

- En materiales visuales, cada zona relevante del lienzo debe cumplir una función pedagógica:
  jerarquizar, relacionar, ejemplificar, orientar la atención o facilitar una explicación.
- No dejar grandes áreas vacías por resolver una diapositiva con una lista o dos cajas flotantes si
  ese espacio puede mostrar conexiones, contrastes, pasos, evidencia o una síntesis útil.
- Aprovechar el espacio no significa rellenarlo ni reducir márgenes. El aire también es funcional
  cuando mejora el foco y la lectura; la meta es evitar tanto el vacío accidental como la saturación.
- Antes de cerrar una pieza, preguntar: **¿el espacio disponible está ayudando a enseñar o solo está
  quedando sin usar?**

## Marca AIEP en presentaciones

- Mantener el logo AIEP completo en todas las diapositivas.
- Sobre fondos claros, usar el logo institucional a color con transparencia.
- Sobre fondos oscuros, usar la variante transparente con símbolo rojo y letras/bajada blancas;
  no resolver el contraste encerrando el logo en una caja o placa blanca.

## Código y microalineación en presentaciones

- El código es contenido principal: las funciones relevantes deben verse completas, incluido su
  `return`, con sintaxis legible y sin recortes de líneas esenciales.
- Las anotaciones deben señalar tokens o líneas precisas y conectarse por pasillos externos, sin
  tapar ni atravesar el código.
- Todo texto o número dentro de un círculo debe usar la misma caja de la figura, centrado horizontal
  y verticalmente; revisar también su centrado óptico en el render.

## Flujo típico de una unidad

`cronograma` → `README.md` de la unidad → `ppt/` (deck) → validar → `infografia/` + `podcast/`.
No cerrar un deck con overflow, mojibake o si PowerPoint intenta repararlo.
