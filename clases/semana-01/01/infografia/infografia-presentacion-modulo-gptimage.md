# Infografía — Presentación del módulo PRO402

- Audiencia: estudiantes técnicos de programación.
- Propósito: primera infografía del módulo; presentación, introducción y mapa visual del recorrido.
- Formato: vertical 2:3, equivalente a 1024 × 1536 px.
- Generación: GPT Image mediante la herramienta integrada de Codex.
- Fuentes: documentos oficiales de `docs/`, `cronograma/README.md` y `clases/semana-01/01/README.md`.
- Convención visual: VIBE AIEP · SIN LOGOS.

## Prompt inicial

```text
Use case: infographic-diagram
Asset type: infografía educativa vertical de presentación del módulo PRO402, destinada a estudiantes técnicos de programación.

Primary request: crea una infografía vertical 2:3, altamente pulida, clara y contemporánea, que presente el módulo “Taller de Testing y Calidad de Software” como el oficio de demostrar con evidencia que el código funciona. Debe funcionar como primera infografía del módulo, introducción y mapa visual de ocho semanas.

Scene/backdrop: fondo crema hueso #F8F3EC, limpio y luminoso.

Style/medium: diseño editorial vectorial, institucional AIEP sin logotipo. Tarjetas blancas con bordes finos #D8CFC4, títulos y estructura en navy #102A43, texto en #243B53, acentos rojos #D62027 usados con moderación. Íconos lineales coherentes: lupa sobre código, escudo con check, repositorio Git, matraz de pruebas, pipeline. Nada fotográfico, nada 3D, sin gradientes ruidosos.

Composition/framing: póster vertical con mucho aire y jerarquía nítida. Encabezado potente; debajo, una gran idea central visual “código → pruebas → evidencia”; luego módulos breves conectados por una línea vertical roja que sugiera progreso. Tipografía sans serif moderna, grande y muy legible. No usar texto diminuto.

Text (render verbatim in Spanish, exactly once, with correct accents):
“PRO402 · TALLER DE TESTING”
“¿CÓMO SABES QUE FUNCIONA?”
“No basta con decir que funciona. Hay que demostrarlo.”
“8 semanas · 24 sesiones · 3 evaluaciones”
“1 · CAMBIA LA PREGUNTA”
“Parecer correcto ≠ estar probado”
“2 · CONSTRUYE CRITERIO”
“Calidad · verificación · validación”
“3 · PRODUCE EVIDENCIA”
“Casos de prueba · automatización · integración continua”
“UN PROYECTO · TRES ENTREGAS”
“Cada versión del mismo sistema será más confiable.”
“PYTHON · PYTEST · VITEST · PLAYWRIGHT · GITHUB ACTIONS”
“IA CON CRITERIO”
“El agente propone. Tú verificas.”
“META FINAL”
“Pipeline en verde + evidencia reproducible”
“10 AGO → 30 SEP 2026”
“FUNCIONA, Y AQUÍ ESTÁ LA EVIDENCIA.”

Constraints: español impecable, conservar tildes y signos; todos los textos deben ser claramente legibles; usar solamente los textos indicados, sin inventar párrafos ni etiquetas; orden visual lógico de arriba hacia abajo; paleta 60% claros, 30% navy, 10% rojo; sin logos, marcas gráficas, escudos institucionales ni marcas de agua.

Avoid: estética corporativa gris, plantilla genérica, exceso de texto, ilustración infantil, neón, colores fuera de paleta, fotografías de stock, sombras pesadas, fondos oscuros dominantes, logos, texto deformado o inventado.
```

## Corrección aplicada

La primera generación dejó cinco filas vacías y utilizó logotipos de herramientas. Se realizó una segunda pasada sobre esa imagen con estas instrucciones:

```text
Use case: precise-object-edit
Input images: Image 1 is the infographic edit target.

Primary request: correct only the layout defects in Image 1 while preserving its successful overall design, palette, typography, header, visual hierarchy and all existing Spanish copy.

Required edits:
1. Delete completely the empty numbered timeline rows 4, 5, 6, 7 and 8, including their red circles, vertical line segments, icons and blank cards. The numbered sequence must end at “3 · PRODUCE EVIDENCIA”.
2. Close the resulting empty space cleanly. Move the three lower cards —“UN PROYECTO · TRES ENTREGAS”, the tools card, and “IA CON CRITERIO”— upward so the layout flows naturally after section 3, with balanced whitespace.
3. In the tools card, remove every colorful product or brand logo. Replace them with a single simple neutral navy line icon suggesting a developer toolkit, or use typography only.
4. Keep the exact tools text: “PYTHON · PYTEST · VITEST · PLAYWRIGHT · GITHUB ACTIONS”.
5. Preserve all other content exactly.

Constraints: change only the defects listed; preserve the vertical 2:3 poster format, cream background, navy structure, restrained red accent, white cards, thin borders and line-icon style. Spanish spelling and accents must remain perfect. No logos, trademarks, watermarks, extra text or blank placeholder rows.
```
