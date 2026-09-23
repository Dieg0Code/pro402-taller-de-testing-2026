# Infografía — Clase 12: La pieza sola no es el sistema

- Audiencia: estudiantes técnicos de segundo año de PRO402.
- Propósito: resumir qué comprueba una prueba de integración, cómo una fixture controla el estado y los datos, y dónde un doble deja de ser legítimo.
- Fuente conceptual: `../README.md`.
- Referencia secundaria: `../ppt/Clase-12-La-Pieza-Sola.pptx`.
- Referencias visuales: infografías de las clases 09, 10 y 11; se usaron solo para conservar la familia editorial.
- Generación: GPT Image integrado en Codex; imagen nueva.
- Formato obtenido: PNG vertical extra largo de 846 × 1859 px.
- Marca: sin logos ni marcas de agua.

## Prompt de generación

```text
Use case: infographic-diagram
Asset type: infografía educativa final en español para estudiantes técnicos de segundo año, Clase 12 de PRO402.
Input images: imágenes 1, 2 y 3 son referencias visuales únicamente de las clases 11, 10 y 09. Conserva su familia editorial: póster vertical extra largo, papel marfil claro, títulos navy condensados, ilustración técnica de tinta limpia con volumen sutil, secciones numeradas, diagramas conectados, terminales y alta densidad pedagógica. No copies sus contenidos.

PRIMARY REQUEST
Genera UNA infografía nueva, vertical extra larga, titulada “LA PIEZA SOLA NO ES EL SISTEMA”. Debe enseñar que una prueba de integración comprueba acuerdos entre piezas; que una fixture decide qué estado existe, lo entrega y lo elimina; que los datos de prueba deben ser mínimos; y que un doble deja de ser legítimo cuando sustituye exactamente la colaboración que la prueba dice observar.

FORMATO Y ESTILO
- Póster vertical extra alto, proporción aproximada 1:2.2, alta resolución, texto nítido.
- Fondo uniforme marfil muy claro #F8F3EC. Navy #102A43 dominante. Rojo #D62027 para fallos y contratos rotos. Verde para evidencia válida. Teal para aislamiento. Ocre/dorado para decisiones y datos.
- Ilustración editorial técnica, humana y enérgica, con líneas limpias, pequeñas sombras cálidas definidas, conectores, terminales, piezas mecánicas, API y base de datos dibujadas como componentes conectados.
- Composición narrativa conectada por una ruta vertical: “CONECTAR → OBSERVAR → AISLAR → BORRAR”.
- Seis zonas con ritmo variado; no seis tarjetas idénticas.
- Títulos condensados fuertes, cuerpo sans serif claro, código monoespaciado.
- SIN LOGOS, SIN palabra AIEP, SIN marcas de agua.
- No incluir ejercicios, tareas, preguntas abiertas ni instrucciones al estudiante.
- Todo el texto visible debe estar en español correcto, con tildes y ñ. Usa únicamente el texto indicado. No inventes texto decorativo.

COMPOSICIÓN Y TEXTO EXACTO

CABECERA
Texto pequeño: “CLASE 12 · PRO402”
Título enorme en dos líneas: “LA PIEZA SOLA” / “NO ES EL SISTEMA”
Subtítulo: “Integrar es comprobar los acuerdos entre piezas.”
Franja de continuidad: “Antes: probar una pieza. Ahora: probar la colaboración.”
Ilustración: estudiante técnico conectando tres módulos: “CLIENTE”, “API” y “BASE DE DATOS”. Entre los módulos hay conectores visibles titulados “CONTRATO”. No robot protagonista.
Ruta visual: “CONECTAR → OBSERVAR → AISLAR → BORRAR”

1 · EL DEFECTO VIVE ENTRE LAS PIEZAS
Diagrama grande:
“CLIENTE” → “CONTRATO HTTP” → “API” → “REGLA”
Tres hallazgos breves:
“422 · el campo no coincide”
“200 · debía ser 201 o 409”
“Rechazo + comprobante”
Franja exacta: “Cada pieza puede estar correcta y el acuerdo entre ellas puede fallar.”
Nota breve: “La prueba unitaria mira la pieza. La integración mira la interacción.”

2 · EL VERDE PUEDE DEPENDER DEL ORDEN
Tres ejecuciones conectadas como evidencia:
“Suite completa” / “3 passed”
“Prueba sola” / “1 failed”
“Orden invertido” / “2 failed”
Alerta roja: “LONELY TEST”
Texto: “La prueba heredaba el estado dejado por otra.”
Franja exacta: “Una prueba aislada debe pasar sola y acompañada.”

3 · LA FIXTURE DECIDE QUÉ MUNDO EXISTE
Mostrar una gran fixture en cuatro etapas, conectadas:
“PREPARA” / “estado conocido”
“ENTREGA” / “yield”
“PRUEBA” / “afirma”
“DESHACE” / “estado limpio”
Panel de código exacto y legible:
@pytest.fixture
def agenda_vacia():
    reservas.clear()
    yield reservas
    reservas.clear()
Cuatro etiquetas:
“qué prepara”
“qué entrega”
“qué deshace”
“alcance: function”
Franja exacta: “Function aísla por defecto. Ampliar el alcance cambia el riesgo.”

4 · DATOS MÍNIMOS Y BORRADO VERIFICABLE
Contraste visual entre dos registros:
Rojo, tachado:
“(2, RUT, nombre, correo)”
Verde:
“(2, None, None, None)”
Texto: “Misma prueba. Menos datos.”
Mostrar un archivo temporal “reservas-de-prueba.db” dentro de una carpeta “tmp_path”.
Panel de desmontaje exacto:
ruta.unlink(missing_ok=True)
assert not ruta.exists()
Resultado de control:
“4 passed, 4 errors”
“Las pruebas pasaron. El borrado falló.”
Franja exacta: “Cargar solo lo necesario limita el daño cuando algo queda atrás.”

5 · EL DOBLE NO PUEDE OCUPAR EL LUGAR QUE QUIERES OBSERVAR
Comparación lado a lado con el mismo defecto:
Columna izquierda:
“BASE REAL”
“1 failed · 3 passed”
“El defecto queda expuesto.”
Columna derecha:
“BASE SUSTITUIDA”
“1 passed”
“El defecto sigue invisible.”
Código del defecto, exacto:
bloque_tomado(conexion, solicitud.personas)
Debajo:
“Debía usar solicitud.bloque”
Regla destacada: “Sustituye lo que está al otro lado del límite. No sustituyas el límite que estás probando.”
Nota: “Un spy puede registrar la llamada. No prueba que la base responda bien.”

6 · TRES NIVELES, TRES AFIRMACIONES
Tres franjas conectadas y distintas:
“UNITARIA” / “La función decide correctamente.”
“INTEGRACIÓN REAL” / “Las piezas se entienden.”
“INTEGRACIÓN CON DOBLE” / “La pieza propia hace la llamada esperada.”
Alerta: “Ninguna afirma que una persona pueda usar el sistema completo.”
Franja exacta: “Cada nivel encuentra defectos que los otros no pueden ver.”

CIERRE NAVY, LIMPIO Y SIN LOGO
Título: “PROBAR EL ACUERDO”
Tres líneas:
“Conectar sin sustituir lo que quieres observar.”
“Aislar para que el resultado no dependa del orden.”
“Borrar y comprobar que los datos ya no existen.”
Remate enorme:
“UN SISTEMA ES SUS PIEZAS Y LOS ACUERDOS ENTRE ELLAS.”
Pie: “PRO402 · Taller de Testing y Calidad de Software”

RESTRICCIONES TÉCNICAS
- No incluir logos aunque aparezcan en las referencias.
- No agregar ejercicios, tareas, preguntas, llamados a la acción ni personajes robóticos.
- No inventar cifras, resultados, rutas, estados HTTP ni nombres.
- Mantener exactamente 422, 200, 201, 409; 3 passed, 1 failed, 2 failed; 4 passed, 4 errors; 1 failed · 3 passed; 1 passed.
- El código de la fixture debe usar exactamente @pytest.fixture, agenda_vacia, reservas.clear(), yield reservas.
- El desmontaje debe usar exactamente ruta.unlink(missing_ok=True) y assert not ruta.exists().
- Mantener exactamente solicitud.personas como defecto y solicitud.bloque como corrección.
- No confundir base real con base sustituida.
- No afirmar que tmp_path elimina automáticamente los archivos.
- Código, operadores y etiquetas legibles, sin cortes ni elipsis.
- Prioridad absoluta: ortografía española, tildes, ñ, exactitud técnica y salida completa sin recorte.
```

## Revisión final

- La composición conserva la identidad visual clara y técnica de las clases 09, 10 y 11.
- Los estados HTTP `422`, `200`, `201` y `409` mantienen su relación correcta.
- Las ejecuciones dependientes del orden aparecen como `3 passed`, `1 failed` y `2 failed`.
- La fixture conserva `@pytest.fixture`, `yield`, preparación, desmontaje y alcance `function`.
- El control de eliminación informa `4 passed, 4 errors` cuando el borrado falla.
- La comparación entre base real y sustituida conserva `1 failed · 3 passed` frente a `1 passed`.
- `solicitud.personas` aparece como defecto y `solicitud.bloque` como corrección.
- El pie está completo y la pieza no incluye logos, marcas de agua, ejercicios ni tareas.
