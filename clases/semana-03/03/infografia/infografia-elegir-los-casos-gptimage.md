# Infografía — Clase 09: Elegir los casos

- Audiencia: estudiantes técnicos de segundo año de PRO402.
- Fuente conceptual: `../README.md`.
- Referencias visuales revisadas: infografías de las clases 07 y 08.
- Generación: GPT Image integrado en Codex; imagen nueva.
- Marca: sin logo AIEP; otros logos están permitidos si aportan al contenido.
- Propósito: conectar selección de casos, lectura de sintaxis y autonomía técnica.
- Revisión visual: sin logos; particiones, límites, tabla de decisión, sintaxis y resultados contrastados con el README. Se conserva la decisión pendiente de cancelación a las dos horas.

## Prompt de generación

```text
Use case: infographic-diagram
Asset type: infografía educativa final en español para estudiantes técnicos de segundo año, Clase 09 de PRO402.
Primary request: Genera UNA infografía nueva, vertical muy larga, que continúe la familia visual de las dos referencias. Tema: elegir casos de prueba con método y escribir pruebas cuyo código podamos comprender por cuenta propia.
Referencias ya revisadas: infografías de las clases 07 y 08 del curso. Su familia visual usa papel marfil, títulos condensados navy, ilustración técnica dibujada con volumen sutil, diagramas, franjas numeradas y alta densidad pedagógica. Recrea ese lenguaje descrito, con una composición nueva; no copies los temas de las clases anteriores.

FORMATO Y ESTILO
Póster vertical extra alto, proporción aproximadamente 1:2.3, alta resolución y texto nítido. Estética editorial ilustrada y técnica: tinta dibujada, volumen sutil, papel marfil #F8F3EC, estructura navy #102A43, rojo #D62027 para fallos, teal y ocre para clasificar, verde para expectativas válidas. Títulos condensados fuertes, cuerpo sans serif claro; código monoespaciado. Secciones numeradas conectadas, diagramas grandes, ilustración humana funcional, ritmo variado, no seis cajas idénticas. El espacio debe enseñar: relaciones, fronteras y código, sin vacíos accidentales ni saturación. SIN LOGOS, SIN palabra AIEP, SIN marcas de agua. PRO402 es texto de curso.

COMPOSICIÓN Y TEXTO EXACTO
Distribuye el contenido en cabecera, cinco zonas y cierre. Todo el texto indicado entre comillas debe aparecer exactamente, sin comillas tipográficas añadidas. El código se reproduce literalmente con indentación, sin elipsis ni líneas cortadas. No agregues cifras ni ejemplos inventados.

CABECERA
"CLASE 09 · PRO402"
"ELEGIR LOS CASOS"
"Clases, límites y reglas. Después, código que puedas explicar."
Ilustración: estudiante ante una gran mesa de pruebas; un documento de requisito alimenta tres instrumentos de selección (clasificador, regla de medición y tablero de decisiones) que conducen a un terminal. No robot protagonista.
Franja de continuidad:
"Antes: auditar con evidencia. Ahora: justificar la muestra."

1 · AGRUPAR NO ES DEMOSTRAR
Título exacto: "1 · PARTICIÓN DE EQUIVALENCIA"
"Dominio: números enteros de bloque."
"Requisito: bloques del 1 al 8, incluidos."
Diagrama de tres bandejas conectadas a una recta, cada una con condición, representante y esperado:
"bloque < 1" / "-5 → False"
"1 ≤ bloque ≤ 8" / "4 → True"
"bloque > 8" / "12 → False"
Sello verde "3 passed" y alerta roja:
"El 4 pasa. Eso no demuestra que el 8 pase."
Nota corta con una pequeña matriz de entradas:
"Un dominio pequeño puede recorrerse: 8 × 4 × 2 = 64 casos."
"Al crecer el dominio, hay que elegir y declarar qué queda fuera."

2 · LOS BORDES
Título exacto: "2 · VALORES LÍMITE"
Recta de dos transiciones claramente separadas, 0 → 1 y 8 → 9; no dibujar 1 y 8 como enteros consecutivos, usar un tramo intermedio abreviado.
Etiquetas de valores y esperados:
"0: False" / "1: True" / "8: True" / "9: False"
"Dos valores: [0, 1, 8, 9]"
"Tres valores: [-1, 0, 1, 2, 7, 8, 9, 10]"
Nota: "Sobre las tres particiones enteras declaradas."
Mini panel de código titulado "EL DEFECTO HEREDADO", con función completa literal:
def bloque_valido(bloque):
    return 1 <= bloque < 8
Una anotación externa apunta exactamente al signo < anterior al 8, sin atravesar el código:
"El requisito incluye el 8; este código lo excluye."
Franja destacada:
"El esperado sale del requisito, no del defecto."

3 · COMBINACIONES
Título exacto: "3 · TABLA DE DECISIÓN"
"V: válido · L: libre · C: con cupo semanal"
"Cupo: menos de 3 reservas activas."
Tabla limpia, exacta, de 5 columnas y 5 filas más encabezado, sin cambios de orden:
Condición | R1 | R2 | R3 | R4
V         | F  | T  | T  | T
L         | —  | F  | T  | T
C         | —  | —  | F  | T
Permitir  | F  | F  | F  | T
"T = verdadero · F = falso"
"8 combinaciones → 4 reglas"
"—: no cambia el resultado; no significa desconocido."
Pequeño esquema funcional de tres llaves que habilitan una reserva solo cuando las tres están activadas.
"Representar reglas no verifica todas las entradas."

4 · SINTAXIS COMO CONTENIDO PRINCIPAL
Título exacto: "4 · LA TABLA SE VUELVE CÓDIGO"
Gran terminal ancho, con código Python completo, legible y sin truncar:
import pytest
from reservas import bloque_valido

@pytest.mark.parametrize(
    ("bloque", "esperado"),
    [(0, False), (1, True), (8, True), (9, False)],
)
def test_limites(bloque, esperado):
    obtenido = bloque_valido(bloque)
    assert obtenido is esperado

Fuera del código, tres anotaciones breves, conectadas por pasillos externos sin cruzar texto:
"parametrize: una ejecución por fila"
"obtenido: lo que devolvió la función"
"assert: exige el booleano esperado"
Resultado del código contra el defecto heredado:
"1 failed · 3 passed"
"El caso 8 exige True y recibe False."

5 · ELEGIR LA COMPROBACIÓN
Título exacto: "5 · NO TODA EXPECTATIVA ES IGUAL"
Dos áreas de lectura complementarias, con instrumentos de precisión y señal de excepción:
Izquierda:
"DECIMALES · approx"
Fragmento de código literal, con saltos de línea:
assert sum([0.1, 0.2]) == pytest.approx(
    0.3, rel=0, abs=1e-12
)
"Margen ilustrativo en horas, no regla del producto."
Derecha:
"EXCEPCIONES · raises"
"Contrato auxiliar: exigir_bloque(0) lanza ValueError."
Fragmento de código literal:
with pytest.raises(ValueError):
    exigir_bloque(0)
"Devolver False no es lanzar una excepción."
Debajo, una alerta con reloj y pregunta:
"Cancelar a las 2 h exactas sigue pendiente de decisión."

CIERRE OSCURO NAVY, SIN LOGO
"LA AUTONOMÍA SE PRACTICA"
"Leer → anticipar → ejecutar → explicar → escribir o corregir"
"Una IA puede ayudar. Tú debes poder reconstruir la prueba sin ella."
Última pregunta destacada:
"¿Qué representa tu muestra y qué dejaste fuera?"

RESTRICCIONES
No logos AIEP ni ninguna otra marca. No copiar los datos de las referencias.
No perder tildes, ñ, signos, indentación ni tokens de código.
La tabla debe tener exactamente los cuatro patrones F——, TF—, TTF, TTT y resultados F,F,F,T.
No confundir esperado con observado: 8 es válido según requisito y falla en la implementación heredada.
No declarar resuelta la cancelación a las dos horas. No añadir una promesa de ausencia de defectos.
Código completo, de tamaño legible; priorizar sus paneles sobre adornos.
Composición narrativa, ilustrada, expresiva y técnicamente clara, de la misma familia que las referencias.
```

## Revisión visual solicitada por el docente

Se sustituyó el acabado gris difuso por fondo marfil claro, contornos nítidos y franjas navy, usando las clases 07 y 08 como referencias visuales adjuntas. La restricción de marca excluye únicamente el logo AIEP; otros logos no están prohibidos.

### Prompt de ajuste de estilo (GPT Image)

```text
Use case: style-transfer
Edit target: Image 1, la infografía CLASE 09 · PRO402 / ELEGIR LOS CASOS.
Style reference images: Images 2 and 3, las infografías CLASE 07 y CLASE 08. Son referencias visuales únicamente; no incorporar sus contenidos.

Redibuja la imagen 1 con el acabado claro y nítido de las imágenes 2 y 3. La audiencia sigue siendo estudiantes técnicos de programación y testing. El usuario rechaza la capa gris azulada que parece humo, la iluminación sucia y los halos borrosos de la imagen 1. CORRIGE DECISIVAMENTE ese aspecto, no apliques solo un pequeño ajuste de contraste.

CAMBIO VISUAL PRINCIPAL:
- Fondo uniforme marfil muy claro #F8F3EC, casi blanco, igual de luminoso que las referencias 2 y 3.
- Nada de humo, neblina, manchas grises, viñeteado, veladuras azuladas, halos, bloom, grandes sombras difusas ni texturas de carbón.
- Trazos navy nítidos, ilustración editorial de línea limpia, color local sólido y sombras pequeñas de borde definido SOLO dentro de objetos.
- Volumen dibujado como referencia 2, no iluminación cinematográfica. Sin textura encima de letras ni paneles.
- Colores vivos y claramente separados, títulos navy oscuros, alertas rojas precisas, verde y teal limpios.
- Recupera barras de sección navy con texto blanco y paneles claros con bordes finos, como la referencia 2. Un solo número por encabezado, no duplicar numeral en recuadro y título.
- Mantén ritmo ilustrado y pedagógico, sin convertirlo en plantilla corporativa de cajas vacías. La ilustración debe ser limpia y definida, no lavada.
- Terminal de código con fondo navy liso y texto claro monoespaciado. Conectores de anotaciones por corredores externos que nunca atraviesen código.

INVARIANTES:
Conservar el tema, el título, las cinco secciones, la composición vertical extra alta, todo el contenido pedagógico, las cifras, la tabla exacta, el código y los resultados de la imagen 1. No traer estadísticas ni texto de las clases 07/08.
No incluir el logo AIEP ni la palabra AIEP. Otros logos técnicos no están prohibidos, pero no es necesario añadir ninguno: el cambio pedido es de estilo.
No inventar texto extra. Puedes eliminar las pequeñas frases decorativas manuscritas sobre el tazón, post-it y alrededor del estudiante del pie; conservar los mensajes pedagógicos centrales.
Prioridad absoluta a legibilidad de sintaxis, ortografía española y ausencia de velo gris.

VERIFICACIÓN DE CONTENIDO EXACTO:
Título: "CLASE 09 · PRO402" y "ELEGIR LOS CASOS".
Subtítulo: "Clases, límites y reglas. Después, código que puedas explicar."
1: particiones bloque < 1 con -5 → False; 1 ≤ bloque ≤ 8 con 4 → True; bloque > 8 con 12 → False. "3 passed". "El 4 pasa. Eso no demuestra que el 8 pase." Dominio pequeño 8 × 4 × 2 = 64 casos.
2: transiciones 0 → 1 y 8 → 9, con separación abreviada entre 1 y 8; esperados False, True, True, False.
"Dos valores: [0, 1, 8, 9]"
"Tres valores: [-1, 0, 1, 2, 7, 8, 9, 10]"
"Sobre las tres particiones enteras declaradas."
Función defectuosa completa, no arreglarla:
def bloque_valido(bloque):
    return 1 <= bloque < 8
"El requisito incluye el 8; este código lo excluye."
"El esperado sale del requisito, no del defecto."
3: tabla exacta
Condición | R1 | R2 | R3 | R4
V         | F  | T  | T  | T
L         | —  | F  | T  | T
C         | —  | —  | F  | T
Permitir  | F  | F  | F  | T
V válido, L libre, C con cupo semanal; cupo menos de 3 reservas activas.
"8 combinaciones → 4 reglas"
"—: no cambia el resultado; no significa desconocido."
"Representar reglas no verifica todas las entradas."
4: conservar completo y exactamente este código:
import pytest
from reservas import bloque_valido

@pytest.mark.parametrize(
    ("bloque", "esperado"),
    [(0, False), (1, True), (8, True), (9, False)],
)
def test_limites(bloque, esperado):
    obtenido = bloque_valido(bloque)
    assert obtenido is esperado
Anotaciones: parametrize una ejecución por fila; obtenido lo que devolvió la función; assert exige el booleano esperado.
Resultado "1 failed · 3 passed" y "El caso 8 exige True y recibe False."
5: comparación numérica:
assert sum([0.1, 0.2]) == pytest.approx(
    0.3, rel=0, abs=1e-12
)
"Margen ilustrativo en horas, no regla del producto."
Contrato auxiliar: exigir_bloque(0) lanza ValueError.
with pytest.raises(ValueError):
    exigir_bloque(0)
"Devolver False no es lanzar una excepción."
"Cancelar a las 2 h exactas sigue pendiente de decisión."
Pie navy liso:
"LA AUTONOMÍA SE PRACTICA"
"Leer → anticipar → ejecutar → explicar → escribir o corregir"
"Una IA puede ayudar. Tú debes poder reconstruir la prueba sin ella."
"¿Qué representa tu muestra y qué dejaste fuera?"

El resultado debe parecer hermano de las referencias claras 2 y 3, no de la imagen gris rechazada. Fondo claro liso de esquina a esquina excepto terminal y barras navy explícitas. Calidad editorial nítida para compartir en pantalla.
```

### Primera corrección de sintaxis (GPT Image)

```text
Edit this infographic with ONLY TWO precise text corrections. Preserve all other pixels/layout/text/illustrations/colors as closely as possible. Keep the clean light ivory background, crisp ink style, navy section bars, and no AIEP logo.
1. In section 4, the decorator line has a misspelled library name. Replace that entire line with EXACTLY:
@pytest.mark.parametrize(
The first word after @ must be pytest, spelled p-y-t-e-s-t. Not psites. Keep all other code unchanged.
2. In section 5, DECIMALES · approx, remove the duplicate closing parenthesis on the numeric arguments line. The three lines must read EXACTLY:
assert sum([0.1, 0.2]) == pytest.approx(
    0.3, rel=0, abs=1e-12
)
There must be NO closing parenthesis after 1e-12 on the second line. The only closing parenthesis for approx is on the third line.
Do not rewrite any other text, do not restyle, do not reintroduce haze, gray shadows, smoke or any logos. Output the full corrected infographic at the same aspect ratio, not a crop.
```

### Corrección final de sintaxis (GPT Image)

```text
Correct the code in this infographic. Preserve the clean ivory background, navy headings, illustrations, table, Spanish teaching text and composition. No AIEP logo. This is a technical teaching poster: identifiers and punctuation must be exact.
REBUILD the contents of the two code areas below as fresh typesetting, not imitation of the previous malformed letters.

SECTION 4 main code panel: typeset this EXACT code in a clean monospaced font. Python identifiers must not be translated into Spanish. The decorator identifier is "parametrize", ending in "ize", NOT "ice".
import pytest
from reservas import bloque_valido

@pytest.mark.parametrize(
    ("bloque", "esperado"),
    [(0, False), (1, True), (8, True), (9, False)],
)
def test_limites(bloque, esperado):
    obtenido = bloque_valido(bloque)
    assert obtenido is esperado

SECTION 5 left code panel: replace ALL existing code in that panel with these EXACT TWO LINES, with no third line and no stray closing parenthesis:
esperado = pytest.approx(0.3, rel=0, abs=1e-12)
assert sum([0.1, 0.2]) == esperado
If needed widen the left code panel by a few pixels or slightly reduce its monospaced font to fit. Do not change its caption about illustrative margin in hours.

Everything else must remain unchanged. Output the complete infographic, not cropped code.
```

Revisión final: tabla, valores límite, decorador `pytest.mark.parametrize`, comparación `approx` y bloque `raises` revisados visualmente. PNG final sin logo AIEP. La versión inicial permanece recuperable en el directorio de imágenes generadas de Codex.
