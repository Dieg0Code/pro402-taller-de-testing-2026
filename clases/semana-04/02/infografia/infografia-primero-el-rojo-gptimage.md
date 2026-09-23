# Infografía — Clase 11: Primero el rojo

- Audiencia: estudiantes técnicos de segundo año de PRO402.
- Propósito: resumir el orden TDD, la diferencia entre rojo técnico y rojo por comportamiento, el verde mínimo, la triangulación y la auditoría de una entrega agéntica.
- Fuente conceptual: `../README.md`.
- Referencia secundaria: `../ppt/Clase-11-Primero-El-Rojo.pptx`.
- Referencias visuales: infografías de las clases 08, 09 y 10; se usaron solo para conservar la familia editorial.
- Generación: GPT Image integrado en Codex; imagen nueva con una corrección dirigida del pie.
- Formato obtenido: PNG vertical extra largo de 846 × 1859 px.
- Marca: sin logos ni marcas de agua.

## Prompt de generación

```text
Use case: infographic-diagram
Asset type: infografía educativa final en español para estudiantes técnicos de segundo año, Clase 11 de PRO402.
Input images: imágenes 1, 2 y 3 son referencias visuales únicamente de las clases 10, 09 y 08. Conserva su familia editorial: póster muy alto, papel marfil claro, títulos navy condensados, ilustración técnica con tinta limpia y volumen sutil, secciones numeradas, diagramas conectados y alta densidad pedagógica. No copies sus contenidos.

PRIMARY REQUEST
Genera UNA infografía nueva, vertical extra larga, que resuma la clase “Primero el rojo”. Debe enseñar que TDD es un orden observable: una prueba expresa el siguiente comportamiento, falla por la razón esperada, el código cambia lo mínimo y solo entonces se revisa la estructura. También debe distinguir evidencia actual de historia del proceso cuando código y pruebas llegan juntos desde un agente.

FORMATO Y ESTILO
- Póster vertical extra alto, proporción aproximada 1:2.2, alta resolución, texto nítido.
- Fondo uniforme marfil muy claro #F8F3EC. Navy #102A43 dominante. Rojo #D62027 para rojo/fallo y alertas. Verde para pruebas aprobadas. Ocre/dorado para decisiones y fronteras.
- Ilustración editorial técnica, enérgica y humana, con líneas limpias, terminales, diagramas y pequeños instrumentos. Sombras cálidas pequeñas y definidas.
- Composición narrativa conectada por una ruta vertical rojo → verde → refactor. Seis zonas con ritmo variado; no seis tarjetas idénticas.
- Títulos condensados fuertes, cuerpo sans serif claro y código monoespaciado.
- SIN LOGOS, SIN palabra AIEP, SIN marcas de agua ni marcas comerciales decorativas.
- No incluir ejercicios, tareas, preguntas para responder ni instrucciones al estudiante.
- Todo el texto visible debe estar en español correcto, con tildes y ñ. Usa únicamente el texto indicado. No inventes texto decorativo.

COMPOSICIÓN Y TEXTO EXACTO

CABECERA
Texto pequeño: “CLASE 11 · PRO402”
Título enorme: “PRIMERO EL ROJO”
Subtítulo: “TDD es un orden: prueba → rojo esperado → verde mínimo → refactor.”
Franja de continuidad: “Antes: medir la evidencia. Ahora: observar cómo nace.”
Ilustración: estudiante técnico ante un terminal; una prueba escrita abre una ruta roja, luego verde, que termina en una estructura de código ordenada. No robot protagonista.

1 · TDD NO ES “TENER PRUEBAS”
Tres estaciones grandes conectadas:
“ROJO” / “La prueba del comportamiento faltante falla por la razón prevista.”
“VERDE” / “El menor cambio satisface el ejemplo actual.”
“REFACTOR” / “Mejora la estructura sin cambiar la respuesta observable.”
Franja exacta: “El orden produce evidencia que el estado final no conserva por sí solo.”

2 · NO TODO ROJO PRUEBA LO MISMO
Contraste visual entre dos terminales.
Terminal izquierda:
“ModuleNotFoundError”
“El archivo todavía no existe.”
Etiqueta roja: “La línea assert no se ejecutó.”
Terminal derecha:
“assert True is False”
“La prueba observó y comparó.”
Etiqueta verde o navy: “Rojo por comportamiento.”
Franja exacta: “Primero haz ejecutable la prueba. Después exige el rojo útil.”

3 · VERDE MÍNIMO, NO SOLUCIÓN FINAL
Caso visible:
“31 personas / capacidad 30 → False”
Panel de código exacto:
def cabe_en_sala(personas, capacidad):
    return False
Dos sellos:
“1 passed”
“Provisional”
Texto breve: “Satisface el único ejemplo actual.”
Franja exacta: “Código mínimo no significa código descuidado ni regla definitiva.”
Nota lateral: “Refactorizar es opcional si la estructura ya es clara.”

4 · TRES VUELTAS HACEN EMERGER LA REGLA
Esta es la zona visual principal. Mostrar tres estaciones conectadas y una recta numérica 0 · 1 · 30 · 31.
“1 · 31/30 → False”
“return False”
“2 · 30/30 → True”
“return personas <= capacidad”
“3 · 0/30 → False”
“return 1 <= personas <= capacidad”
En la recta: 0 rojo rechazado; 1 verde aceptado; 30 verde aceptado; 31 rojo rechazado.
Franja exacta: “Cada ejemplo contradice una versión todavía demasiado simple.”
Resultado final grande: “3 passed”

5 · COBERTURA Y SENSIBILIDAD NO SON LO MISMO
Medidor:
“100 % de cobertura”
“Todas las sentencias medidas se ejecutaron.”
Dos alteraciones controladas:
“1 <= personas < capacidad” / “falla 30/30”
“0 <= personas <= capacidad” / “falla 0/30”
Dos definiciones breves:
“COBERTURA · dónde se ejecutó”
“SENSIBILIDAD · qué decisión incorrecta produce rojo”
Franja exacta: “100 % ejecutado no significa 100 % correcto.”

6 · CÓDIGO Y PRUEBAS JUNTOS: AUDITAR SIN INVENTAR HISTORIA
Mostrar pytest y Vitest como dos herramientas equivalentes conectadas por el mismo ciclo; no usar logos.
“pytest · Python”
“Vitest · TypeScript”
“Cambia la sintaxis. No cambia la disciplina.”
Entrega de agente:
“3 passed”
“Código + pruebas recibidos juntos”
Alteración temporal:
“return true”
Resultado:
“2 failed · 1 passed”
Dos roles:
“AGENTE · edita, ejecuta y reporta”
“PERSONA · define el comportamiento y juzga la evidencia”
Franja exacta: “La auditoría recupera sensibilidad actual. No demuestra que hubo TDD.”

CIERRE NAVY, LIMPIO Y SIN LOGO
Título: “NOMBRA SOLO LO QUE LA EVIDENCIA PERMITE”
Cuatro líneas:
“Rojo esperado → detectó el comportamiento faltante.”
“Verde mínimo → satisfizo el ejemplo actual.”
“Refactor en verde → conservó los casos cubiertos.”
“Alteración en rojo → detectó ese defecto concreto.”
Remate enorme: “UNA PRUEBA QUE NUNCA FALLÓ NO DEMOSTRÓ QUE PUEDA FALLAR.”
Pie: “PRO402 · Taller de Testing y Calidad de Software”

RESTRICCIONES TÉCNICAS
- No incluir logos aunque aparezcan en las referencias.
- No agregar ejercicios, tareas, preguntas abiertas, llamados a la acción ni personajes robóticos.
- No inventar cifras, requisitos, resultados ni funciones.
- Mantener exactamente los casos 31/30 → False, 30/30 → True y 0/30 → False.
- En Python escribir exactamente cabe_en_sala, personas y capacidad.
- En la implementación final usar exactamente: return 1 <= personas <= capacidad
- No confundir cobertura con corrección.
- No afirmar que la auditoría posterior demuestra TDD.
- Código y etiquetas legibles, sin cortes ni elipsis.
- Prioridad absoluta: ortografía española, tildes, ñ, signos, operadores y exactitud técnica.
- Salida completa, no recortada.
```

## Corrección final del pie

```text
Use case: precise-object-edit
Asset type: corrección final de una infografía educativa vertical.
Image 1 is the edit target.

Edit ONLY the bottom closing navy band and its immediate bottom margin. Preserve every other pixel, section, illustration, title, code panel, number, operator, color and Spanish text as closely as possible.

Required correction:
- The small footer line at the bottom is partially cropped/covered. Re-typeset it fully and exactly as:
“PRO402 · Taller de Testing y Calidad de Software”
- Place that complete footer centered inside the navy closing band with sufficient clear padding above and below.
- Remove the irregular dark smudge and broken/cropped navy stroke along the lower edge.
- Finish the poster with one clean straight navy lower edge followed by a small uniform ivory safe margin.
- Keep the large closing headline exactly:
“UNA PRUEBA QUE NUNCA FALLÓ NO DEMOSTRÓ QUE PUEDA FALLAR.”

Invariants:
- Do not crop the image.
- Do not change the aspect ratio.
- Do not rewrite, translate, add or remove any other content.
- Preserve all six numbered sections and the existing composition.
- Preserve the exact code identifiers and operators.
- No logos, no word AIEP, no watermark.
- Output the complete full-height infographic.
```

## Revisión final

- Los casos 31/30, 30/30 y 0/30 conservan sus valores esperados correctos.
- Las implementaciones `return False`, `return personas <= capacidad` y `return 1 <= personas <= capacidad` mantienen sus operadores.
- Las alteraciones controladas fallan en 30/30 y 0/30, respectivamente.
- La auditoría posterior se presenta como sensibilidad actual, no como prueba retrospectiva de TDD.
- El pie está completo, legible y dentro del área segura.
- No hay logos, marcas de agua, ejercicios ni tareas.
