# INFOGRAFÍA — La revisión como prueba

**Audiencia:** técnica — estudiantes de PRO402 Taller de Testing y Calidad de Software.
**Propósito:** resumen visual completo de la Clase 06 para repaso en pantalla o WhatsApp.
**Formato solicitado:** vertical largo 1024 × 1536 px, calidad alta. Familia visual AIEP, sin logos.
**Salida final:** 864 × 1821 px, proporción vertical larga coherente con la infografía de referencia.

## Referencia visual

Usar `clases/semana-02/02/infografia/infografia-pruebas-estaticas-y-auditoria-gptimage.png`
únicamente como referencia de familia visual: gran ilustración conceptual en el encabezado, barras
navy numeradas, diagramas conectados, densidad pedagógica, ritmo vertical y acabado ilustrado. No
copiar su contenido ni añadir logos.

## Prompt usado

Use case: scientific-educational

Asset type: infografía educativa vertical larga para estudiantes técnicos

Primary request: Diseña una infografía de resumen completo para la Clase 06 de PRO402 sobre la
revisión de código como prueba estática, la revisión adversarial entre agentes y el arbitraje de
hallazgos mediante pruebas ejecutables. Debe enseñar de un vistazo qué agrega una revisión frente a
Pyrefly y Ruff, qué método necesita para no convertirse en opinión, cómo separar autor, auditor y
árbitro, y cómo decidir con evidencia antes de corregir.

Input images: Image 1 es referencia de estilo y composición solamente. Conserva su carácter
ilustrado, técnico, pedagógico y de alta densidad visual; no la edites ni copies su contenido.

Scene/backdrop: lienzo vertical 1024 × 1536, fondo crema claro #F8F3EC.

Style/medium: infografía institucional ilustrada, técnica y enérgica; estética vectorial dibujada a
mano con volumen sutil, no dashboard minimalista. Tarjetas blancas con bordes finos #D8CFC4;
estructura y títulos en navy #102A43; texto en #243B53; rojo #D62027 solo como acento. Usar verde
para evidencia confirmada, naranja para riesgos, teal para revisión y morado para agentes. Íconos
grandes, expresivos y coherentes; flechas limpias; diagramas conectados; secciones numeradas con
barras navy. Mucho aire funcional, pero sin grandes espacios vacíos. Alta densidad pedagógica sin
saturación. Tipografía sans serif condensada para títulos y sans serif muy legible para cuerpo.

Composition/framing: encabezado visual fuerte y seis secciones apiladas. Aprovechar todo el alto con
una retícula firme y variada. Usar una comparación código/requisito, un velocímetro de revisión, una
clasificación en tres caminos, un flujo triangular autor-auditor-árbitro, una matriz de protocolos y
un embudo de pruebas A/B/C. Sustituir cajas uniformes por ilustraciones, conectores y relaciones
visuales.

Text (verbatim):

Encabezado:
"CLASE 06 · PRO402"
"LA REVISIÓN COMO PRUEBA"
"Leer no basta: hay que comparar, registrar y probar."

Sección 1:
"1 · COMPARAR, NO OPINAR"
Flujo central:
"CÓDIGO" + "REQUISITO" → "HALLAZGO"
Tres comparaciones breves:
"Pyrefly → tipos declarados"
"Ruff → patrones conocidos"
"Revisión → conducta esperada"
Franja:
"Revisar es leer el código contra lo que debía hacer."

Sección 2:
"2 · MÉTODO Y ATENCIÓN"
Caso breve:
"HEARTBLEED"
"El código fue revisado. El defecto sobrevivió."
Tres límites operativos:
"200–400 líneas por revisión"
"≤ 60 minutos por sesión"
"< 500 líneas por hora"
Franja:
"Pequeña, lenta y con criterios."

Sección 3:
"3 · CLASIFICAR EL HALLAZGO"
Tres caminos:
"DEFECTO"
"La prueba puede escribirse y falla."
"RIESGO"
"Falta decidir la conducta esperada."
"ESTILO"
"No cambia el comportamiento."
Cuatro preguntas de la lista:
"Límite · Vacío · Regla de producto · Dato personal"
Franja:
"Sin una entrada concreta, solo hay una sospecha."

Sección 4:
"4 · REVISIÓN ADVERSARIAL"
Triángulo de roles:
"AUTOR"
"Escribe con el requisito."
"AUDITOR"
"Recibe código + requisito."
"ÁRBITRO"
"Decide con evidencia."
Alerta junto al auditor:
"Sesión nueva · Sin el razonamiento del autor"
Franja:
"La independencia se consigue separando el contexto."

Sección 5:
"5 · EL PROTOCOLO CAMBIA EL VEREDICTO"
Matriz breve:
"MISMO CÓDIGO · TRES PREGUNTAS"
Flujo del dato no detectado:
"resumen(...)" → "incluye el RUT"
"P1 · Confirmación → 1 defecto + 1 absolución falsa"
"P2 · Cambio → 2 defectos con entrada concreta"
"P3 · Requisito → 2 defectos + 1 riesgo"
Punto ciego destacado:
"RUT EN RESUMEN · 0 DE 3 LO VIERON"
Franja:
"El auditor encuentra contradicciones; no completa lo que falta escribir."

Sección 6:
"6 · ARBITRAR EJECUTANDO"
Regla central:
"Escribe la prueba ANTES de corregir."
Flujo central:
"asistencia > 70" → "pytest"
Tres desenlaces:
"A · FALLA → defecto confirmado"
"B · PASA → esa evidencia no sostiene el hallazgo"
"C · NO SE PUEDE ESCRIBIR → falta una decisión de producto"
Resultado final:
"Corrige A · Investiga o retira B · Documenta C"

Pie de cierre destacado:
"Una revisión es tan buena como el documento que usa de referencia."

Visual storytelling: En el encabezado, mostrar a una estudiante técnica comparando en dos monitores
un fragmento de código y un documento de requisitos, con una lupa que revela una diferencia. En la
sección 1, representar Pyrefly y Ruff como dos escáneres que terminan antes de una tercera lupa
humana conectada al requisito. En la sección 2, incluir un pequeño corazón-candado agrietado como
metáfora de Heartbleed y tres instrumentos: regla de líneas, reloj y velocímetro. En la sección 3,
usar una pregunta que se bifurca en rutas verde, naranja y gris hacia defecto, riesgo y estilo. En
la sección 4, mostrar dos agentes separados por una pared de contexto y a la estudiante como árbitra
en el vértice inferior; ningún robot 3D, solo personajes vectoriales sobrios. En la sección 5, usar
tres portapapeles de auditoría apuntando al mismo panel breve «resumen(...) incluye el RUT» y una
línea roja que atraviesa los tres para señalar el punto ciego. No inventar una función ni agregar
código. En la sección 6, mostrar el hallazgo «asistencia > 70» entrando a un tubo de ensayo o terminal
de pytest y saliendo por tres caminos A/B/C. Las ilustraciones deben enseñar, no decorar.

Constraints: mantener exactamente el texto indicado, con español correcto, tildes, signos, flechas,
números y nombres de herramientas legibles. El código de curso PRO402 es texto, no un logotipo. No
agregar fechas, cifras, marcas, slogans ni contenido no solicitado. No usar logotipos, isotipos ni
la palabra AIEP como marca visual. No incluir el logo de AIEP ni imitarlo. Sin fotografías, sin
robots 3D, sin marcas de agua.

Avoid: errores ortográficos, palabras inventadas, texto cortado, letras deformadas, párrafos largos,
fondos oscuros, rojo dominante, gradientes ruidosos, estética de startup, dashboard de tarjetas
uniformes, cajas flotantes sin relación, espacios vacíos accidentales, saturación.
