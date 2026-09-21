# Podcast — Clase 10: Recorrer no es verificar

- Audiencia: estudiantes técnicos de segundo año de PRO402.
- Propósito: explicar por qué una suite puede pasar y alcanzar cobertura total sin verificar correctamente el comportamiento del sistema.
- Formato: Conversación en profundidad de NotebookLM, 17 min 11 s.
- Generación: cuadro de personalización del Resumen de Audio.
- Fuente conceptual: README de la Clase 10; se cargó únicamente ese documento.
- Audio generado: `La_trampa_de_la_cobertura_total.m4a`.

## Prompt final

```text
Genera un podcast educativo en español latinoamericano, de 12 a 15 minutos, dirigido a estudiantes técnicos de segundo año de programación y testing.

El episodio debe ser una conversación dinámica entre dos voces: una conduce y ordena las ideas; la otra plantea interpretaciones comunes, detecta contradicciones y aporta ejemplos. El tono debe ser técnico, claro, sobrio y cercano. No incluyan ejercicios, tareas, instrucciones para el estudiante ni información que no aparezca en la fuente.

Título del episodio: “Recorrer no es verificar”

Propósito central:
Explicar por qué una suite puede terminar en verde, alcanzar el 100 % de cobertura y aun así no haber comprobado correctamente el comportamiento del sistema.

Recorrido del episodio:

1. Abran con la paradoja de las dos suites:
- Una tiene 88 % de cobertura y pruebas con aserciones.
- La otra tiene 100 % de cobertura, pero solo recorre el código.
- Aclaren que “estar en verde” significa únicamente que ninguna prueba falló.

2. Definan de forma sencilla:
- Suite: conjunto de pruebas ejecutadas juntas.
- Aserción: comparación entre el resultado obtenido y el resultado esperado.
- Cobertura: información sobre el código ejecutado, no un veredicto de calidad.

3. Expliquen la diferencia entre cobertura de sentencias y cobertura de ramas:
- Las sentencias indican qué instrucciones se ejecutaron.
- Las ramas indican qué caminos de decisión se recorrieron.
- La columna Missing permite localizar código no ejecutado.
- Destaquen que una condición sin else igualmente posee un camino verdadero y uno falso.

4. Relaten el experimento en que una prueba sin aserciones eleva la cobertura de 88 % a 100 %:
- La prueba llama funciones, pero no compara resultados.
- El porcentaje mejora sin que aumente la capacidad de detectar el defecto.
- Formulen con claridad la conclusión: la cobertura es necesaria, pero no suficiente.

5. Introduzcan las pruebas de mutación:
- Mutante: cambio pequeño y deliberado en el programa.
- Mutante matado: el cambio hace fallar alguna prueba.
- Mutante sobreviviente: la suite continúa en verde.
- Expliquen por qué matar un mutante demuestra poder de detección, pero no demuestra que el resultado esperado sea correcto.
- Destaquen el caso del cambio de “mayor que” a “mayor o igual”: una prueba puede ser muy sensible y, al mismo tiempo, estar defendiendo una regla que el requisito nunca decidió.

6. Expliquen los dobles de prueba:
- Dummy: llena un parámetro.
- Stub: devuelve una respuesta fija.
- Spy: registra llamadas.
- Mock: exige una interacción.
- Fake: implementación funcional simplificada.
- Muestren por qué se sustituye una dependencia externa y cuál es el riesgo de construir el doble desde una suposición.

7. Relaten el caso del servicio de correo:
- La dependencia real cambia de dos a tres argumentos.
- Los mocks escritos de memoria siguen aceptando la firma antigua.
- La suite informa seis pruebas aprobadas y 100 % de cobertura, aunque producción falla.
- Expliquen cómo create_autospec() deriva el doble de la firma real y detecta la incompatibilidad.
- Aclaren su límite: copiar la firma no protege frente a todos los cambios de conducta. Algunas pruebas con la dependencia real siguen siendo necesarias.

8. Presenten los tres criterios para auditar una suite generada por un agente:
- Procedencia del esperado: requisito, decisión declarada u otra fuente válida; no copiarlo silenciosamente del código.
- Mutante concreto: qué cambio de comportamiento debería hacer fallar la prueba.
- Doble derivado: comprobar que representa la dependencia que sustituye.

9. Expliquen las cuatro decisiones posibles:
- Aceptar: la prueba aporta evidencia defendible.
- Modificar: el caso sirve, pero su implementación debe corregirse.
- Posponer: el requisito no permite decidir todavía.
- Rechazar: la prueba recorre código, pero no distingue una salida correcta de una defectuosa.
- Subrayen que bajar la cobertura puede ser una decisión correcta si se elimina una prueba engañosa.

10. Incorporen el estudio de METR con cautela:
- 16 desarrolladores y 246 tareas reales.
- Con IA tardaron 19 % más.
- Antes esperaban trabajar 24 % más rápido.
- Después todavía creían haber trabajado 20 % más rápido.
- No presenten este resultado como una ley universal.
- Úsenlo para reforzar la idea de que la percepción de avance no reemplaza la medición.

Cierre:
Resuman las tres lecturas de una misma suite:
- Cobertura: qué se recorrió.
- Aserción: qué se comprobó.
- Procedencia del esperado: contra qué se comparó.

Terminen con esta idea, expresada claramente:
“Un número alto describe cuánto código se recorrió. Una aserción describe qué resultado se comprobó. La procedencia del esperado permite saber si esa comprobación defendía el requisito o solamente repetía el código.”

Conecten brevemente con la próxima clase:
El desarrollo guiado por pruebas invierte el orden: primero se expresa el comportamiento esperado y se observa el fallo; después se escribe el código mínimo para satisfacerlo.

Indicaciones de producción:
- No lean fragmentos largos de código carácter por carácter; explíquenlos en lenguaje natural.
- Pronuncien create_autospec como nombre de una función de Python y expliquen inmediatamente qué hace.
- Eviten bromas, analogías infantiles y entusiasmo artificial.
- No conviertan el episodio en una lista mecánica: construyan una investigación progresiva, desde el 100 % engañoso hasta una auditoría basada en evidencia.
- No inventen cifras, definiciones, ejemplos ni conclusiones ausentes de la fuente.
- No mencionen rutas de archivos, instrucciones docentes internas ni secciones de ejercicios.
```

## Notas de generación

- Se utilizó **Conversación en profundidad** con salida en español.
- NotebookLM produjo un audio de 17 min 11 s pese a la duración solicitada de 12 a 15 minutos.
- Se cargó únicamente el README de la clase para evitar referencias al deck o a rutas internas.
