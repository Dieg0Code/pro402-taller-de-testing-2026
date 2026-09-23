# Podcast — Clase 12: La pieza sola no es el sistema

- Audiencia: estudiantes técnicos de segundo año de PRO402.
- Propósito: explicar por qué dos piezas verificadas por separado pueden componer un sistema que falla, por qué el resultado de una prueba puede depender de qué otras pruebas corrieron antes, y por qué los datos que una prueba carga y borra son una decisión técnica y legal a la vez.
- Formato: Conversación en profundidad de NotebookLM, 20 min 52 s.
- Generación: cuadro de personalización del Resumen de Audio.
- Fuente conceptual: README de la Clase 12; se cargó únicamente ese documento.
- Audio generado: `Por_qué_todo_falla_con_test_impecables.m4a`.

## Prompt final

```text
Genera un podcast educativo en español latinoamericano, de 15 a 18 minutos, dirigido a estudiantes técnicos de segundo año de programación y testing.

El episodio debe ser una conversación entre dos voces: una conduce y ordena las ideas; la otra plantea las interpretaciones habituales, detecta contradicciones y pide precisiones. El tono debe ser técnico, claro, sobrio y cercano. No incluyan ejercicios, tareas, instrucciones para el estudiante ni información que no aparezca en la fuente.

Título del episodio: "La pieza sola no es el sistema"

Propósito central:
Explicar por qué dos piezas verificadas por separado pueden componer un sistema que falla, por qué el resultado de una prueba puede depender de qué otras pruebas corrieron antes, y por qué los datos que una prueba carga y borra son una decisión técnica y legal a la vez.

Recorrido del episodio:

1. Abran con la paradoja del punto de partida:
- Dieciséis pruebas unitarias en verde sobre funciones verificadas.
- Se conecta la primera pieza con una interfaz HTTP y el sistema rechaza todas las solicitudes.
- Aclaren desde el principio qué significa "verificada" aquí: que sus casos salieron del requisito y que se la vio fallar antes de existir.

2. Definan de forma sencilla, antes de usarlas:
- Integrar: hacer que dos piezas trabajen juntas sin reemplazar ninguna por un sustituto.
- Prueba de integración: la que ejecuta esa colaboración real y afirma algo sobre su resultado.
- Contrato: el acuerdo sobre la forma de lo que entra y lo que sale entre dos piezas que se comunican.
- Subrayen que el contrato no vive dentro de ninguna de las dos piezas.

3. Desmonten la frase heredada "una prueba de integración es una prueba más grande":
- Según el programa de estudios de ISTQB, los niveles se distinguen por objeto de prueba, objetivos, base de prueba, defectos y fallos, y enfoque y responsabilidades.
- En esa lista de cinco atributos no aparece el tamaño.
- Destaquen "defectos y fallos": cada nivel existe porque encuentra una clase de defecto que los otros no encuentran.

4. Relaten los tres defectos del primer bloque, en orden, como una investigación:
- Primero: la especificación dice que el campo se llama correo_electronico y la API declara correo. El sistema responde 422 y la función verificada nunca llega a ejecutarse.
- Segundo: corregido el nombre, la función corre y decide bien, pero una reserva creada se informa con 200 en lugar de 201 y un rechazo con 200 en lugar de 409.
- Tercero, el más serio: el sistema rechaza la reserva y le entrega igual un comprobante al usuario. Las dos funciones que produjeron esa respuesta son correctas por separado; el defecto está en que alguien las compuso sin decidir qué pasa cuando la primera dice que no.
- Cierren el bloque nombrando la propiedad común: ninguno es un error de lógica dentro de una función.

5. Pasen al problema del aislamiento con el experimento de las tres ejecuciones:
- Las tres pruebas en el orden del archivo: 3 passed.
- Solo la tercera: 1 failed.
- La tercera y la primera, en ese orden: 2 failed.
- Mismo código, sin cambiar una línea.
- Expliquen la causa: una lista que vive en el módulo y sobrevive a cada prueba.
- Formulen la conclusión con claridad: ese 3 passed no era un resultado sobre el sistema, era un resultado sobre el orden.

6. Traigan el diagnóstico clásico de Gerard Meszaros:
- Pruebas que interactúan: las pruebas dependen unas de otras de alguna manera.
- Prueba solitaria: puede ejecutarse como parte de una suite, pero no por sí sola, porque depende de algo que creó otra prueba.
- Cualquier cosa que sobreviva a la duración de la prueba puede provocar interacciones.
- Fixture fresco como remedio: se construye para la prueba y se desmonta al terminar, para empezar y terminar con la pizarra limpia.

7. Expliquen la fixture y sus cuatro decisiones:
- Qué prepara antes de la prueba.
- Qué entrega a la prueba, con yield en lugar de return.
- Qué deshace después: todo lo que va detrás del yield.
- Con qué alcance, y por qué el valor por defecto aísla cada prueba.
- Relaten el experimento del alcance: cambiando una sola palabra, la fixture deja de aislar y la suite completa sigue informando verde. Un alcance mal elegido no se manifiesta como error, sino como un verde que volvió a depender del orden.

8. Introduzcan la segunda mitad de la clase: qué datos pueden existir dentro de una prueba.
- Al pasar de una lista en memoria a una base de datos en un archivo, lo que una prueba escribe queda escrito.
- Citen la idea central de la guía de protección de datos: un ambiente no productivo sigue siendo tratamiento de datos, y la etiqueta test no reduce el daño posible ni reemplaza los controles.
- Aclaren la diferencia entre datos sintéticos, seudonimizar y anonimizar, y por qué solo la primera saca el problema del medio.

9. Expliquen el principio de proporcionalidad de la Ley 21.719:
- Aclaren que la ley chilena no usa la palabra minimización, que viene del vocabulario europeo: usa proporcionalidad.
- Son dos obligaciones en un mismo párrafo: limitar los datos a los necesarios en relación con los fines, y conservarlos solo el tiempo necesario, tras lo cual deben ser suprimidos o anonimizados.
- Muestren cómo esas dos obligaciones caen sobre las dos mitades de una fixture: lo que carga antes del yield, y lo que deshace después.
- Insistan en el orden: primero la finalidad declarada, después el juicio sobre si un dato sobra.

10. Relaten la demostración de la proporcionalidad:
- Dos versiones de la misma fixture, una con el nombre, el RUT y el correo, otra solo con el dato necesario.
- Las dos producen el mismo resultado de ejecución.
- Escriben cosas distintas en el archivo.
- La prueba de que esos campos no eran necesarios es que al quitarlos no cambió nada.
- Aclaren que esto no prohíbe los datos personales en una prueba: obliga a poder nombrar la finalidad de cada campo que se carga.

11. Expliquen la eliminación verificable:
- La herramienta entrega un directorio temporal único por prueba, y eso resuelve el aislamiento.
- Pero conserva a propósito los directorios de las últimas tres ejecuciones, para poder depurar.
- Por eso el borrado explícito y su comprobación no son redundantes.
- Relaten el caso en que alguien deja comentada la línea del borrado: las cuatro pruebas pasan y la ejecución informa además cuatro errores.
- Expliquen la distinción entre una prueba que falla y un fallo en la preparación o el desmontaje.
- Cierren con el hallazgo: el borrado falló de verdad y lo que quedó guardado en el disco fueron campos vacíos, no el nombre y el RUT de una persona. Eso no fue suerte: la proporcionalidad no impide el incidente, decide su tamaño.

12. Cierren el recorrido técnico con el límite del doble de prueba:
- Recuerden brevemente qué es un doble y nombren los cinco tipos.
- El criterio: se sustituye lo que está al otro lado del límite que se está probando; no se sustituye el código propio que está en ese límite, porque entonces ese código no se ejecuta.
- Mencionen que Martin Fowler distingue pruebas de integración estrechas y amplias, y que en las estrechas el doble va en el servicio separado, no en el código que habla con él.
- Relaten la demostración: un argumento equivocado en una línea, un descuido de copiar y pegar que ningún analizador estático marca. Con la base de datos real la prueba falla; con la base sustituida, la misma comprobación pasa en verde y el defecto sigue ahí.
- Expliquen por qué la herramienta que construye el doble respetando la firma del original no ayudó: verifica cuántos argumentos se pasan y de qué tipo, no cuál valor.
- Agreguen el detalle que indica el remedio: el doble sí registró la llamada equivocada, y la prueba no miró ese registro porque su única aserción era sobre el código de estado.

13. Reúnan la dimensión de los agentes, que atraviesa toda la clase:
- Cuando se le pide una prueba, el agente lee el código y escribe la prueba contra lo que el código hace; si la API responde 200, la prueba afirma 200.
- Cuando se le pide "arregla las pruebas que fallan", tiende a adaptar la aserción al resultado observado, o a oficializar el orden.
- Cuando se le piden "datos de prueba realistas", produce exactamente lo que hay que evitar: un RUT con dígito verificador válido puede ser el de una persona real.
- Cuando se le pide "una prueba de integración", suele devolver una prueba con la dependencia sustituida, que es una unitaria con otro nombre.
- Expliquen la causa común: el agente optimiza contra la señal que recibe, y esa señal suele ser "la suite en verde".
- Señalen la forma de trabajo que sí rinde: nombrar el límite en la instrucción, en vez de pedir un resultado.

Cierre:
Resuman qué puede afirmar y qué no cada uno de los tres niveles:
- Unitario: que una función decide lo correcto, aislada del resto; no que alguien la llame ni que la llamen bien.
- Integración con la dependencia real: que dos piezas se entienden; no que el sistema sirva para lo que fue construido.
- Integración con la dependencia sustituida: que la pieza propia hace las llamadas esperadas; nada sobre la dependencia sustituida.

Terminen con esta idea, expresada claramente:
"Un sistema no es la suma de sus piezas, sino de sus piezas y de los acuerdos entre ellas. Los acuerdos no viven dentro de ningún archivo, y por eso ninguna prueba que mire un archivo solo puede comprobarlos."

Conecten brevemente con la próxima clase:
Todo lo del episodio se comprobó enviando solicitudes desde un programa. Nadie abrió el sistema y lo usó. El nivel que sigue es el del navegador, donde el objeto de prueba es el sistema completo tal como lo encuentra una persona.

Indicaciones de producción:
- No lean fragmentos de código carácter por carácter ni deletreen nombres de archivo; explíquenlos en lenguaje natural.
- Cuando mencionen una función o una herramienta por su nombre, expliquen de inmediato qué hace, en una frase.
- Lean los códigos de estado como números con significado: 201 es "se creó algo nuevo", 409 es "choca con el estado actual", 422 es "el cuerpo no tiene la forma esperada".
- Eviten bromas, analogías infantiles y entusiasmo artificial.
- No conviertan el episodio en una lista mecánica: construyan una investigación progresiva, desde la suite en verde hasta el criterio para decidir qué se sustituye.
- Traten el tema legal como lo que es en esta clase: una propiedad verificable del código, no una exposición jurídica. No citen números de artículo de forma insistente.
- No inventen cifras, definiciones, ejemplos ni conclusiones ausentes de la fuente.
- No mencionen rutas de archivos, nombres de láminas, instrucciones docentes internas ni secciones de ejercicios.
```

## Notas de generación

- Se utilizó **Conversación en profundidad** con salida en español.
- NotebookLM produjo un audio de 20 min 52 s pese a la duración solicitada de 15 a 18 minutos, en línea con lo observado en las clases 10 y 11: la duración indicada orienta el desarrollo, pero no lo limita.
- Se cargó únicamente el README de la clase para evitar referencias al deck o a rutas internas.
- Tres acotaciones resultaron necesarias por la naturaleza del material. La primera pide no deletrear nombres de archivo ni de función, porque esta clase incorpora varios con guiones bajos que suenan mal leídos carácter por carácter. La segunda fija cómo leer los códigos de estado HTTP, para que el episodio los trate como números con significado y no como cifras sueltas. La tercera acota el tratamiento de la Ley 21.719 a lo que es en la clase —una propiedad verificable del código— porque sin esa indicación el episodio deriva hacia una exposición jurídica que consume varios minutos.
- La dimensión de los agentes aparece cuatro veces en el README, una por bloque. En el guion se agrupó en un solo paso, porque repartida produce un episodio que repite el mismo argumento cuatro veces; reunida se lee como un patrón único con cuatro manifestaciones, que es lo que efectivamente es.
