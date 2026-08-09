# Slides System

Sistema compartido para construir presentaciones del módulo con `PptxGenJS`.

## Objetivo

Evitar que cada clase copie helpers, estilos y componentes desde otro deck.

Este directorio concentra:

- tema AIEP;
- componentes reutilizables;
- utilidades de validación;
- helpers técnicos para código, UI y artefactos del mundo de desarrollo.

La base nueva vive en `src/` con TypeScript. La implementación JS actual se mantiene por compatibilidad mientras migramos las clases nuevas.

## Estructura

- `theme/`: tokens, tipografía y tema AIEP.
- `components/`: componentes visuales reutilizables.
- `utils/`: helpers de código, spacing y validación.
- `vendor/pptxgenjs_helpers/`: helpers compartidos de PptxGenJS.
- `src/`: capa TypeScript tipada para evolucionar la librería sin tocar los decks viejos.
- `tests/`: pruebas de geometría, contratos visuales y calidad textual.
- `scripts/`: chequeos auxiliares como mojibake.
- `dist/`: build generado para consumo futuro de decks nuevos.

## Componentes iniciales

- `primitives`: header, chip, pill, card, miniCard y statement.
- `code-panel`: snippet con resaltado de sintaxis.
- `terminal-panel`: terminal con prompts y salidas.
- `browser-mock`: maqueta de navegador.
- `form-mock`: maqueta de formulario con CTA centrado.
- `dom-tree`: árbol DOM integrado al lenguaje visual del deck.
- `frontend-panels`: responsive compare, reflow responsive, panel de decision de breakpoint, panel de dimensiones de calidad web, tablero de evidencias de auditoria, scorecards de auditoria, checklist inicial de accesibilidad, matriz de prioridad de hallazgos, panel de rubrica de evaluación, panel de suma y baja de puntos, flujo de trabajo de proyecto, comparación de calidad de prompt, tablero de variantes de componente, comparación de consistencia entre piezas, cascada CSS, inspector de cascada, escala de especificidad, token board, matriz de criterio para frameworks, box model, layout Flex/Grid y auditoria estilo Lighthouse.
- `app-panels`: JSON, request/response y árbol de componentes.
- `agentic-panels`: flujo de trabajo con agentes, mapa spec-driven y reparto entre apoyo del agente y validación humana.

## Dirección visual

El objetivo no es solo reutilizar helpers, sino construir artefactos técnicos con mejor presencia visual.

Los componentes del sistema deben sentirse:

- institucionales, pero no rígidos;
- técnicos, pero no fríos;
- editables en PowerPoint;
- y suficientemente refinados para que una slide no parezca un wireframe improvisado.

Si un componente nuevo resuelve una necesidad real del cronograma, debe entrar a la librería ya con buena jerarquía, espaciado, color y lectura visual, no como versión provisoria.

## Política de migración

- La semana 1 puede mantenerse en JavaScript.
- Desde las clases nuevas en adelante, preferir fuentes en TypeScript para el deck y consumo desde `dist/`.
- Si un patrón visual o artefacto técnico se repite, moverlo a `tools/slides-system/` antes de volver a copiarlo entre clases.

## Uso recomendado

1. Crear el deck local de una clase.
2. Importar componentes desde este sistema en vez de copiarlos manualmente.
3. Mantener el contenido en el `source/` de la clase y la lógica visual aquí.
4. Reusar `vendor/pptxgenjs_helpers` desde este directorio mientras migramos clases antiguas.
5. Para clases nuevas, preferir `src/` y build a `dist/`.

### Ejemplo mínimo

```js
const PptxGenJS = require("pptxgenjs");
const { theme, components, utils } = require("../../tools/slides-system");

const pptx = new PptxGenJS();
theme.applyAiepTheme(pptx, {
  title: "Clase piloto",
  subject: "Slides System",
});

const SH = pptx.ShapeType;
const slide = pptx.addSlide();
components.addHeader(slide, SH, pptx, "Título", "Subtítulo", "Bloque 1", {
  classLabel: "Clase piloto · Bloque 1",
});
components.addCodePanel(slide, SH, {
  x: 0.9,
  y: 2.4,
  w: 5.2,
  h: 3.2,
  title: "HTML",
  code: "<main>Hola</main>",
  lang: "html",
});
utils.validateSlide(slide, pptx);
```

## Calidad

- `npm run typecheck`: valida la capa TypeScript.
- `npm run build`: genera `dist/` con exports tipados.
- `npm run test`: ejecuta pruebas unitarias de componentes.
- `npm run test:text`: revisa mojibake y ortografía base en la capa nueva.
- `npm run test:all`: ejecuta el set completo.

Las pruebas actuales atacan fallos que ya vimos al construir clases:

- componentes web mal alineados;
- conectores que invaden el código;
- paneles que se salen de su contenedor;
- texto roto por encoding;
- y regresiones básicas de resaltado de sintaxis.

La suite también empieza a cubrir contratos visuales para los componentes nuevos de frontend y aplicación, de modo que responsive, request/response, árboles y auditorías no vuelvan a degradarse entre clases.

## Próximo paso recomendado

Usar la próxima clase nueva como piloto TypeScript para consumir `dist/` sin tocar retroactivamente la semana 1.
