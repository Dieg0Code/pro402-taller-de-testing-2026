# INFOGRAFÍA AIEP — Verificación y validación

**Audiencia:** técnica — estudiantes de PRO402 Taller de Testing y Calidad de Software.  
**Propósito:** resumen visual completo de la Clase 04 para repaso en pantalla o WhatsApp.  
**Formato:** vertical largo 1024 × 1536 px, calidad alta. VIBE AIEP · SIN LOGOS.

## Prompt usado

Use case: scientific-educational
Asset type: infografía educativa vertical larga para estudiantes técnicos
Primary request: Diseña una infografía de resumen completo para la Clase 04 de PRO402 sobre verificación y validación. Debe enseñar de un vistazo la diferencia entre ambas preguntas, el límite de una suite en verde, los cuatro escenarios, tres fallas históricas, la trazabilidad y el límite de un agente de IA.

Scene/backdrop: lienzo vertical 1024x1536, fondo crema claro #F8F3EC.
Style/medium: infografía institucional técnica, limpia y sobria; tarjetas blancas con bordes finos #D8CFC4; estructura y títulos en navy #102A43; texto en #243B53; rojo #D62027 solo como acento; apoyos suaves #E6EEF7 y #EDE6DA. Íconos lineales coherentes, flechas limpias, diagramas precisos, secciones numeradas. Mucho aire, alta densidad pedagógica sin saturación. Tipografía sans serif condensada para títulos y sans serif muy legible para cuerpo.
Composition/framing: encabezado compacto y seis secciones claras apiladas. Aprovechar todo el alto con una retícula firme. Usar comparación en dos columnas, una cadena causal, una matriz 2x2, tres tarjetas de caso, un flujo horizontal y un cierre destacado.

Text (verbatim):

Encabezado:
"CLASE 04 · PRO402"
"VERIFICACIÓN Y VALIDACIÓN"
"Construir bien ≠ construir lo correcto"

Sección 1:
"1 · DOS PREGUNTAS, DOS FUENTES"
Tarjeta izquierda:
"VERIFICACIÓN"
"¿Cumple lo especificado?"
"Fuente: criterio o contrato"
"Evidencia: pruebas y análisis"
Tarjeta derecha:
"VALIDACIÓN"
"¿Responde a la necesidad real?"
"Fuente: reglamento, usuario o responsable"
"Evidencia: confrontación con la fuente"
Franja:
"Ninguna sustituye a la otra."

Sección 2:
"2 · TODO VERDE NO BASTA"
Cadena visual:
"3 passed" → "Cumple la expectativa escrita" → "¿La expectativa era correcta?"
Ejemplo:
"Notas: 3,5 · 3,5 · 4,8"
"Promedio simple: 3,9 · Promedio 30-30-40: 4,0"
Alerta:
"Una prueba en verde puede fijar una regla equivocada."

Sección 3:
"3 · LOS CUATRO ESCENARIOS"
Matriz 2x2 con eje horizontal "VALIDACIÓN" y eje vertical "VERIFICACIÓN".
Cuadrantes:
"SÍ + SÍ · Adecuado y demostrable"
"SÍ + NO · Error correcto: parece éxito"
"NO + SÍ · Defecto clásico"
"NO + NO · Doble fallo"

Sección 4:
"4 · TRES FALLAS, TRES VACÍOS"
Tarjeta 1:
"ARIANE 5"
"Supuesto heredado del Ariane 4"
"Faltó: integración con la trayectoria real"
Tarjeta 2:
"KNIGHT CAPITAL"
"1 de 8 servidores ejecutó otra versión"
"Faltó: verificar el despliegue completo"
Tarjeta 3:
"THERAC-25"
"El software quedó como única barrera"
"Faltó: analizar el riesgo del sistema"
Franja:
"Probar un componente no valida el contexto."

Sección 5:
"5 · TRAZABILIDAD"
Flujo con cinco pasos:
"NECESIDAD" → "FUENTE" → "CRITERIO" → "EVIDENCIA DE VERIFICACIÓN" → "EVIDENCIA DE VALIDACIÓN"
Estados breves:
"VERIFICADO"
"POR VALIDAR"
"SIN CRITERIO"
Dos alertas pequeñas:
"Criterio huérfano: tiene prueba, no tiene fuente."
"Necesidad sin criterio: todavía no se puede verificar."

Sección 6:
"6 · EL AGENTE AYUDA, NO AUTORIZA"
"Ordena · compara · propone preguntas"
"Si falta respaldo: FUENTE NO DISPONIBLE"
"Aceptar · reformular · posponer · rechazar"
Franja final:
"El agente puede clasificar. La autoridad sobre la regla sigue siendo humana."

Pie de cierre destacado:
"Un sistema puede hacer exactamente lo pedido y aun así estar equivocado."

Constraints: mantener exactamente el texto indicado, con español correcto, tildes, signos y números legibles. Priorizar jerarquía y comprensión. El código de curso PRO402 es texto, no un logotipo. No agregar fechas, cifras, marcas, slogans ni contenido no solicitado. No usar logotipos, isotipos ni la palabra AIEP como marca visual. No incluir el logo de AIEP ni imitarlo. Sin fotografías, sin personas, sin robots 3D, sin marcas de agua.
Avoid: errores ortográficos, palabras inventadas, texto cortado, letras deformadas, párrafos largos, fondo oscuro, rojo dominante, gradientes ruidosos, estética de startup, cajas flotantes sin relación, espacios vacíos accidentales, saturación.

## Iteración 2 — rediseño ilustrado

**Motivo:** la primera salida resultó demasiado minimalista y cercana a un dashboard. Se usaron como referencias visuales las tres infografías de la Semana 01, conservando la regla vigente de no incluir logos.

**Imágenes de entrada:**

- `infografia-verificacion-y-validacion-gptimage.png`: objetivo de edición y fuente del contenido.
- `infografia-presentacion-modulo-gptimage.png`: referencia de escala de ilustraciones, flechas y ritmo vertical.
- `infografia-primera-evidencia-gptimage.png`: referencia de diagramas conectados y color funcional.
- `infografia-calidad-no-es-opinion-gptimage.png`: referencia de densidad pedagógica, barras navy y variedad visual.

**Prompt de rediseño:**

> Rediseña por completo la infografía objetivo porque quedó demasiado minimalista y parecida a un dashboard de tarjetas. Consérvala como infografía vertical larga y mantén exactamente el contenido, idioma, cifras, nombres y seis secciones del prompt base. Hazla consistente con la familia visual de las tres referencias: ilustrada, enérgica, técnica y pedagógica, con imágenes conceptuales grandes que enseñan y no solo decoran.
>
> Crea una cabecera visual con portapapeles/código bajo una lupa para VERIFICACIÓN, y una diana o brújula junto a personas y reglamento para VALIDACIÓN, separadas por un gran símbolo ≠ rojo. Usa franjas navy y números circulares para las seis secciones. Mantén navy y rojo como anclas y agrega verde para evidencia aprobada, naranja para advertencias, teal para fuentes/contexto y morado para validación.
>
> Convierte “3 passed” y el ejemplo 3,9 frente a 4,0 en una secuencia visual con matraz, lupa y balanza. Presenta los cuatro escenarios como matriz 2×2 coloreada, destacando “SÍ + NO” en naranja. Ilustra los tres casos con un cohete Ariane 5 y su trayectoria, ocho servidores con uno distinto para Knight Capital y una máquina Therac-25 con la barrera rota. Convierte la trazabilidad en un recorrido conectado con íconos grandes y estados visibles. Cierra con una cabeza de IA que ordena documentos, el sello “FUENTE NO DISPONIBLE” y una persona responsable con documento o balanza.
>
> Sustituye varias cajas uniformes por diagramas, conectores, flechas y escenas. No dejes grandes espacios vacíos. No copies logos, isotipos, nombres institucionales ni marcas visibles en las referencias. VIBE AIEP · SIN LOGOS.

## Corrección final localizada

**Prompt de corrección:**

> Conserva absolutamente toda la composición, ilustraciones, colores, proporciones, textos y diagramas sin rediseñarlos. Haz únicamente estas dos correcciones localizadas: (1) en la sección “1 · DOS PREGUNTAS, DOS FUENTES”, corrige el encabezado morado “VALIDACION” para que diga exactamente “VALIDACIÓN”, con tilde en la Ó; (2) en la sección “6 · EL AGENTE AYUDA, NO AUTORIZA”, conserva el sello inclinado “FUENTE NO DISPONIBLE” y la línea “Si falta respaldo:”, pero elimina la repetición roja horizontal de “FUENTE NO DISPONIBLE”. No cambies ninguna otra palabra, número, tilde, icono, flecha, color, tamaño, ilustración ni posición. No añadas logos, marcas, isotipos ni marcas de agua.
