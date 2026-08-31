# INFOGRAFÍA AIEP — Pruebas estáticas y auditoría

**Audiencia:** técnica — estudiantes de PRO402 Taller de Testing y Calidad de Software.
**Propósito:** resumen visual completo de la Clase 05 para repaso en pantalla o WhatsApp.
**Formato:** vertical largo 1024 × 1536 px, calidad alta. VIBE AIEP · SIN LOGOS.

## Referencia visual

Usar `clases/semana-02/01/infografia/infografia-verificacion-y-validacion-gptimage.png` únicamente
como referencia de familia visual: escala de ilustraciones, barras navy, números de sección,
diagramas conectados, densidad pedagógica y ritmo vertical. No copiar su contenido ni añadir logos.

## Prompt usado

Use case: scientific-educational

Asset type: infografía educativa vertical larga para estudiantes técnicos

Primary request: Diseña una infografía de resumen completo para la Clase 05 de PRO402 sobre pruebas
estáticas, Pyrefly, Ruff y auditoría de correcciones propuestas por agentes. Debe enseñar de un
vistazo qué pueden demostrar las barreras estáticas, qué defectos detecta cada una, cuál es su límite
y cómo distinguir una corrección real de un diagnóstico silenciado.

Input images: Image 1 es referencia de estilo y composición solamente. Conserva su carácter
ilustrado, técnico y pedagógico; no la edites ni copies su contenido.

Scene/backdrop: lienzo vertical 1024x1536, fondo crema claro #F8F3EC.

Style/medium: infografía institucional ilustrada, técnica y enérgica; estética vectorial dibujada a
mano con volumen sutil, no dashboard minimalista. Tarjetas blancas con bordes finos #D8CFC4;
estructura y títulos en navy #102A43; texto en #243B53; rojo #D62027 solo como acento. Usar verde
para evidencia aprobada, naranja para advertencias, teal para análisis estático y morado para
ejecución dinámica. Íconos grandes, expresivos y coherentes; flechas limpias; diagramas conectados;
secciones numeradas con barras navy. Mucho aire, pero sin grandes espacios vacíos. Alta densidad
pedagógica sin saturación. Tipografía sans serif condensada para títulos y sans serif muy legible
para cuerpo.

Composition/framing: encabezado visual fuerte y seis secciones apiladas. Aprovechar todo el alto con
una retícula firme y variada. Usar una comparación antes/después, una bifurcación estática/dinámica,
un flujo de tipos, una secuencia visual de zip(), un tablero verde-verde-rojo y tres caminos A/B/C.
Sustituir cajas uniformes por ilustraciones, conectores y relaciones visuales.

Text (verbatim):

Encabezado:
"CLASE 05 · PRO402"
"ANTES DE EJECUTAR NADA"
"Dos barreras estáticas. Un límite común."

Sección 1:
"1 · MEDIR EL CAMBIO"
"Compara el proyecto consigo mismo"
"ANTES" → "ADOPTA PRUEBAS" → "DESPUÉS"
Cuatro indicadores breves:
"Defectos por tamaño"
"Tiempo de reparación"
"Cambios que fallan"
"Pruebas frente a código"
Franja:
"Evidencia ≠ atribución"

Sección 2:
"2 · DOS FORMAS DE PROBAR"
Tarjeta izquierda:
"ESTÁTICA"
"Lee el código sin ejecutarlo"
"Pyrefly · Ruff · revisión"
Tarjeta derecha:
"DINÁMICA"
"Ejecuta y observa resultados"
"pytest"
Franja:
"Se complementan. No se sustituyen."

Sección 3:
"3 · PYREFLY REVISA CONTRATOS"
Flujo visual:
"registro.get(alumno)" → "list[float] | None" → "nota_final(list[float])"
Dos estados:
"SIN TIPOS · 0 errores"
"CON TIPOS · 1 contradicción visible"
Alerta:
"Anotar no crea el defecto: lo revela."

Sección 4:
"4 · RUFF REVISA PATRONES"
Ejemplo visual:
"NOTAS · 6,0 · 5,0 · 4,0"
"PESOS · 0,5 · 0,5"
"zip() ignora el 4,0"
"Resultado: 5,5"
Dos sellos:
"B905 · activar familia B"
"strict=True · falla en voz alta"
Franja:
"La configuración decide qué ve el linter."

Sección 5:
"5 · EL TECHO DE LAS DOS"
Tablero de tres resultados:
"PYREFLY · VERDE"
"RUFF · VERDE"
"PYTEST · ROJO"
Ejemplo central:
"3,95" → "round()" → "3,9"
"El producto exige 4,0"
Franja:
"Los tipos y el estilo no conocen la regla del producto."

Sección 6:
"6 · EL AGENTE: ARREGLAR O TAPAR"
Tres caminos:
"A · SILENCIAR"
"El aviso se va. El defecto queda."
"B · COMPLACER"
"[] desplaza el fallo a una división por cero."
"C · DECIDIR Y PROBAR"
"KeyError explícito + prueba en verde"
Franja:
"Muestra qué caso concreto dejó de fallar."

Pie de cierre destacado:
"Verde estático demuestra consistencia; no demuestra que el producto haga lo que necesita."

Visual storytelling: En el encabezado, representar código protegido por dos barreras o escáneres
antes de un botón de ejecución. En la sección 1, usar una línea de tiempo antes/después con
instrumentos de medición. En la sección 2, contraponer una lupa sobre código con un matraz o botón
de ejecución. En la sección 3, mostrar el valor None como una bifurcación roja que choca con un
contrato. En la sección 4, ilustrar tres notas y dos pesos como pares de una cremallera, dejando el
4,0 fuera. En la sección 5, usar dos luces verdes y una roja junto a una balanza 3,9 frente a 4,0.
En la sección 6, mostrar una cabeza de agente que abre tres rutas A/B/C y una persona auditora con
lupa comprobando una prueba. Las ilustraciones deben enseñar, no decorar.

Constraints: mantener exactamente el texto indicado, con español correcto, tildes, signos, números
y nombres de herramientas legibles. El código de curso PRO402 es texto, no un logotipo. No agregar
fechas, cifras, marcas, slogans ni contenido no solicitado. No usar logotipos, isotipos ni la palabra
AIEP como marca visual. No incluir el logo de AIEP ni imitarlo. Sin fotografías, sin robots 3D, sin
marcas de agua.

Avoid: errores ortográficos, palabras inventadas, texto cortado, letras deformadas, párrafos largos,
fondos oscuros, rojo dominante, gradientes ruidosos, estética de startup, dashboard de tarjetas
uniformes, cajas flotantes sin relación, espacios vacíos accidentales, saturación.
