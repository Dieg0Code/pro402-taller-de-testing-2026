# Infografía — Clase 02: Tu primera evidencia

- Audiencia: estudiantes técnicos de PRO402.
- Propósito: sintetizar la progresión desde un entorno reproducible hasta una conclusión proporcional a la evidencia.
- Formato: vertical 2:3, equivalente a 1024 × 1536 px.
- Generación: GPT Image mediante la herramienta integrada de Codex.
- Fuente: `clases/semana-01/02/README.md`.
- Convención visual: VIBE AIEP · SIN LOGOS.

## Prompt inicial

```text
Use case: infographic-diagram

Create a polished educational infographic in Spanish for technical programming students.

FORMAT AND INTENT
- Extra-tall vertical educational poster, 2:3 aspect ratio, equivalent to 1024 × 1536 px, high visual polish.
- Dense but highly readable: use nearly all available canvas space for teaching, with consistent modest spacing. No huge empty gaps, but never cramped.
- Designed for WhatsApp viewing and classroom review.
- Audience: beginner technical students in PRO402 Taller de Testing y Calidad de Software.
- VIBE AIEP · SIN LOGOS.

VISUAL STYLE
- Warm paper background #F8F3EC.
- Navy #102A43 for title, structure, section numbers and line icons.
- Ink #243B53 and slate #52606D only for readable secondary text.
- Restrained red #D62027 for key arrows, failures and emphasis, around 10%.
- Soft blue #E6EEF7 and soft neutral #EDE6DA for selected card fills.
- White cards with thin #D8CFC4 borders, clean editorial grid, precise alignment, generous internal padding.
- Sophisticated contemporary information design: institutional and technical, but warm and energetic.
- Consistent thin line icons only: laptop/code, package/lock, magnifier, type brackets, test flask/check, warning triangle, human decision.
- No photography, no 3D, no gradients, no generic corporate people, no decorative filler.
- No logos, trademarks, badges or watermarks. Tool names may appear only as plain typography.
- Use bold condensed sans serif for headings and clean modern sans serif for body.
- Strong visual rhythm from top to bottom. All text large enough to read; no footnote-sized copy.

COMPOSITION
Build one continuous top-to-bottom evidence journey using six compact teaching zones. Use varied layouts—hero comparison, 2×2 matrix, red-to-green flow, decision strip, diagnostic mapping, final chain—while maintaining one coherent grid. Fill the poster thoughtfully to avoid a sparse feeling.

HEADER
“CLASE 02 · TU PRIMERA EVIDENCIA”
“Entorno reproducible + primer test”
“«En mi computador funciona»” → “¿Qué evidencia puedes mostrar?”

ZONE 1
“ENTORNO REPRODUCIBLE”
“pyproject.toml · dependencias y reglas”
“uv.lock · versiones exactas”
“.python-version · versión de Python”
“.venv · entorno aislado”
“REPRODUCIBLE ≠ CORRECTO”
“Permite repetir el entorno; todavía no prueba el comportamiento.”

ZONE 2
“CUATRO CONTROLES, CUATRO PREGUNTAS”
“uv” — “¿El entorno coincide?”
“Ruff” — “¿La estructura cumple las reglas?”
“Pyrefly” — “¿Los tipos respetan el contrato?”
“pytest” — “¿El comportamiento coincide con lo esperado?”
“No compiten. Se complementan.”

ZONE 3
“UNA PRUEBA ROJA PUEDE SER BUENA EVIDENCIA”
“ENTRADA” — “[3.8, 4.1, 3.95]”
“ESPERADO” — “4.0”
“OBTENIDO” — “3.9”
“1 failed · 1 passed”
“Decimal + ROUND_HALF_UP” → “2 passed”
“No debilites la expectativa. Corrige la implementación según la regla.”

ZONE 4
“EL AGENTE PROPONE · EL EQUIPO DECIDE”
“ACEPTAR” — “[5.5] → 5.5”
“MODIFICAR” — “Precisar caso o riesgo”
“POSPONER” — “[] → requiere decisión”
“RECHAZAR” — “Duplicados o datos fuera del contrato”
“Cada caso debe volver visible un riesgo nuevo.”

ZONE 5
“SABOTAJE CONTROLADO: PREDICE LA BARRERA”
“Dependencia sin actualizar lockfile” → “uv”
“import math sin uso” → “Ruff”
“list[str] con pruebas numéricas” → “Pyrefly”
“ROUND_DOWN cambia la regla” → “pytest”
“Dos controles pueden dar señales distintas: observan dimensiones distintas.”

ZONE 6
“CIERRE: CADENA DE EVIDENCIA”
“INTENCIÓN” → “ENTORNO” → “ANÁLISIS” → “PRUEBAS” → “CONCLUSIÓN PROPORCIONAL”
“uv lock --check”
“uv run ruff check .”
“uv run pyrefly check”
“uv run pytest -q”
“4 passed”
“TODO VERDE ≠ SOFTWARE PERFECTO”
“Solo demuestra lo que realmente verificamos.”
“Calidad es formular una expectativa, producir evidencia y no exagerar la conclusión.”

TEXT REQUIREMENTS
- Render every requested text verbatim, exactly once, in impeccable Spanish with correct accents, punctuation and symbols.
- Do not invent extra labels, fake code, dates, statistics or paragraphs.
- Preserve decimal points and exact technical names.
- Avoid text over illustrations and low-contrast gray text.
- Keep every numbered circle perfectly centered.
- Make the final output feel full, purposeful, pedagogical and elegant—not sparse, not saturated.
```

## Corrección aplicada

La primera generación deformó la etiqueta `ACEPTAR`. Se realizó una edición localizada:

```text
Use case: precise-object-edit

Correct one typographic defect only. Preserve the entire infographic exactly as it is.

In section 4, replace the malformed word “ACEPTAA” with exactly “ACEPTAR”. Render it in the same green uppercase typography, size, weight and position. Preserve “[5.5] → 5.5” directly beneath it.

Do not alter, reflow, translate, add or remove anything else. Keep Spanish accents perfect. No logos, trademarks or watermarks.
```
