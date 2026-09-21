# Infografía — Clase 10: Recorrer no es verificar

- Audiencia: estudiantes técnicos de segundo año de PRO402.
- Propósito: resumir la diferencia entre recorrer código y verificar resultados, conectando cobertura, mutación, dobles y auditoría de pruebas generadas.
- Fuente conceptual: `../README.md`.
- Referencias visuales revisadas: infografías de las clases 07, 08 y 09.
- Generación: GPT Image integrado en Codex; imagen nueva con dos correcciones dirigidas.
- Formato obtenido: PNG vertical extra largo de 846 × 1860 px.
- Marca: sin logos ni marcas de agua.

## Prompt de generación

```text
Use case: infographic-diagram
Asset type: infografía educativa final en español para estudiantes técnicos de segundo año, Clase 10 de PRO402.
Input images: imágenes 1, 2 y 3 son referencias visuales únicamente de las clases 07, 08 y 09. Conserva su familia editorial: póster muy alto, papel marfil claro, títulos navy condensados, ilustración técnica con tinta limpia y volumen sutil, secciones numeradas, diagramas conectados y alta densidad pedagógica. No copies su contenido ni sus logos.

Primary request: Genera UNA infografía nueva, vertical extra larga, que resuma la clase “Recorrer no es verificar”. Debe enseñar que cobertura, mutantes y dobles aportan evidencia diferente, pero no reemplazan una aserción cuyo resultado esperado proviene de una fuente válida.

FORMATO Y ESTILO
- Póster vertical extra alto, proporción aproximada 1:2.2, alta resolución, texto nítido.
- Fondo uniforme marfil muy claro #F8F3EC. Navy #102A43 dominante. Rojo #D62027 solo para defectos y alertas. Verde para evidencia que detecta; ocre/dorado para mediciones.
- Ilustración editorial técnica con líneas limpias, pequeños instrumentos, terminales y diagramas funcionales. Sombras cálidas pequeñas y definidas. Sin humo, neblina, halos, gradientes ruidosos ni fondo gris.
- Composición narrativa conectada por una ruta vertical roja o navy. Seis zonas de ritmo variado; no seis tarjetas idénticas.
- Títulos condensados fuertes, cuerpo sans serif claro, código monoespaciado.
- SIN LOGOS, SIN palabra AIEP, SIN marcas de agua, SIN marcas comerciales decorativas.
- No incluir ejercicios, tareas, preguntas para responder ni instrucciones al estudiante.
- Todo el texto visible debe estar en español correcto, con tildes y ñ. Usa únicamente el texto indicado. No inventes texto decorativo.

COMPOSICIÓN Y TEXTO EXACTO

CABECERA
Texto pequeño: “CLASE 10 · PRO402”
Título enorme: “RECORRER NO ES VERIFICAR”
Subtítulo: “Una suite puede pasar, cubrir el 100 % y seguir sin comprobar el resultado.”
Franja de continuidad: “Antes: elegir los casos. Ahora: demostrar qué se verificó.”
Ilustración: un recorrido de código atraviesa un medidor de cobertura, pero solo una aserción compara el resultado con un requisito escrito.

1 · VERDE NO SIGNIFICA VERIFICADO
Contraste visual entre dos suites:
“SUITE A”
“88 % de cobertura”
“12 pruebas con aserciones”
“SUITE B”
“100 % de cobertura”
“1 prueba sin aserción”
Resultado común: “Todas pasan”
Franja destacada: “En verde significa que ninguna prueba falló. No significa que el sistema esté correcto.”

2 · LA COBERTURA DESCRIBE EL RECORRIDO
Tres instrumentos conectados:
“SENTENCIAS” / “Qué líneas se ejecutaron”
“RAMAS” / “Qué caminos se tomaron”
“MISSING” / “Qué código no se ejecutó”
Mini diagrama de una condición con camino verdadero verde y camino falso rojo.
Franja exacta: “La cobertura es necesaria y no suficiente.”
Nota: “El porcentaje describe recorrido, no verificación.”

3 · CAMBIAR EL CÓDIGO MIDE PODER DE DETECCIÓN
Ilustrar un engranaje o interruptor donde “>” cambia a “>=”.
“MUTANTE” / “Cambio pequeño y deliberado”
“MATADO” / “La suite falla”
“SOBREVIVE” / “La suite sigue en verde”
Franja exacta: “Matar un mutante demuestra sensibilidad. No demuestra que el esperado sea correcto.”

4 · EL DOBLE OCUPA EL LUGAR DE LA DEPENDENCIA
“DUMMY · llena un parámetro”
“STUB · devuelve una respuesta”
“SPY · registra llamadas”
“MOCK · exige una interacción”
“FAKE · implementación funcional”
“Mock(return_value=True)” / “acepta cualquier firma”
“create_autospec(enviar_confirmacion, return_value=True)” / “copia la firma real”
Franja exacta: “El doble se deriva de la dependencia. No se escribe de memoria.”

5 · AUDITAR UNA SUITE GENERADA
“1 · PROCEDENCIA DEL ESPERADO” / “¿Requisito, decisión o código?”
“2 · MUTANTE CONCRETO” / “Qué cambio debería hacerla fallar”
“3 · DOBLE DERIVADO” / “Conectado a la dependencia real”
“ACEPTAR” / “MODIFICAR” / “POSPONER” / “RECHAZAR”
Franja exacta: “La decisión se defiende con evidencia ejecutable, no con una impresión.”

6 · MEDIR VENCE A LA SENSACIÓN
“19 % más tiempo medido”
“24 % más rápido: lo esperado antes”
“20 % más rápido: lo percibido después”
“16 desarrolladores · 246 tareas reales”
Franja exacta: “Sentirse más rápido no demuestra haber sido más rápido.”

CIERRE NAVY, LIMPIO Y SIN LOGO
“TRES LECTURAS DE UNA MISMA SUITE”
“Cobertura: qué se recorrió.”
“Aserción: qué se comprobó.”
“Esperado: contra qué se comparó.”
“RECORRER NO ES VERIFICAR”
“PRO402 · Taller de Testing y Calidad de Software”

RESTRICCIONES TÉCNICAS
- No incluir logos aunque aparezcan en las referencias.
- No agregar ejercicios, tareas, preguntas abiertas, llamados a la acción ni personajes robóticos.
- No inventar métricas, cifras, resultados o nombres.
- Mantener exactamente 88 %, 100 %, 19 %, 24 %, 20 %, 16 y 246.
- Escribir exactamente create_autospec y enviar_confirmacion, sin traducir ni deformar identificadores.
- Mantener código y etiquetas legibles, sin cortes.
- No confundir “matado” con “sobrevive”.
- No afirmar que cobertura, mutación o dobles garantizan calidad.
- Prioridad absoluta: ortografía española, tildes, ñ, signos y exactitud técnica.
- Salida completa, no recortada.
```

## Primera corrección: ejemplos derivados de la clase

```text
Edita la infografía conservando composición, colores y textos no mencionados.

1. Sustituye el código genérico superior por:
def bloque_valido(bloque):
    return 1 <= bloque <= 8

El documento REQUISITO debe decir: “Bloques del 1 al 8, incluidos.”

2. En la sección 2 sustituye el if/else genérico por:
if bloque_valido(bloque):
    estado = "confirmada"

Etiquetas:
“verdadero: ejecuta el bloque”
“falso: omite el bloque”
No debe existir una cláusula else.

3. En la sección 5 reemplaza la pregunta por:
“Fuente: requisito, decisión o código”

4. En la sección 6 cambia la leyenda del 19 % por:
“más tiempo medido al usar IA”
```

## Corrección final: mutante real de la clase

```text
Edita únicamente los dos paneles oscuros de la sección 3.

Panel izquierdo:
ORIGINAL
>
excluye la igualdad

Panel derecho:
MUTANTE M1
>=
incluye la igualdad

Conserva el engranaje, la flecha, las tarjetas MUTANTE / MATADO / SOBREVIVE y todos los demás elementos sin cambios.
```

## Revisión final

- El contenido coincide con la clase y no incorpora ejemplos externos.
- Las cifras 88 %, 100 %, 19 %, 24 %, 20 %, 16 y 246 están correctas.
- `create_autospec` y `enviar_confirmacion` aparecen con la grafía correcta.
- La mutación `>` → `>=` conserva el sentido técnico.
- No hay logo, marca de agua, ejercicio ni tarea para el estudiante.
- PNG archivado junto a este prompt.
