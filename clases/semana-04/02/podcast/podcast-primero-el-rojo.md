# Podcast — Clase 11: Primero el rojo

- Audiencia: estudiantes técnicos de segundo año de PRO402.
- Propósito: establecer que el desarrollo guiado por pruebas no es una técnica de diseño de casos ni una medida de calidad, sino un orden de trabajo, y precisar qué evidencia produce ese orden que no puede obtenerse después.
- Formato: Conversación en profundidad de NotebookLM, 20 min 11 s.
- Generación: cuadro de personalización del Resumen de Audio.
- Fuente conceptual: README de la Clase 11; se cargó únicamente ese documento.
- Audio generado: `Por_qué_el_código_debe_fallar_primero.m4a`.

## Prompt final

```text
Genera un podcast educativo en español latinoamericano, de 15 a 18 minutos, dirigido a estudiantes técnicos de segundo año de programación y testing.

El episodio debe ser una conversación entre dos voces: una conduce y ordena las ideas; la otra plantea las interpretaciones habituales, detecta contradicciones y pide precisiones. El tono debe ser técnico, claro, sobrio y cercano. No incluyan ejercicios, tareas, instrucciones para el estudiante ni información que no aparezca en la fuente.

Título del episodio: "Primero el rojo"

Propósito central:
Explicar que el desarrollo guiado por pruebas no es una técnica para diseñar casos ni una medida de calidad, sino un orden de trabajo, y precisar exactamente qué evidencia produce ese orden que no se puede obtener después.

Recorrido del episodio:

1. Abran estableciendo qué es y qué no es TDD:
- No es la sesión de partición de equivalencia y valores límite; esa fue sobre cómo elegir los casos.
- No es la sesión de cobertura y mutantes; esa fue sobre cómo medir una suite ya escrita.
- Es un orden de operaciones: primero la expectativa, después el código.
- Aclaren desde el principio qué significa "suite" en este episodio: el conjunto de pruebas automatizadas que se ejecutan como una unidad.

2. Nombren con precisión la garantía específica que produce ese orden:
- La prueba puede fallar ante la ausencia del comportamiento, y consta que puede porque ese fallo se observó antes de que existiera el código.
- Contrasten con la sesión anterior, donde la misma pregunta —¿qué haría fallar esta prueba?— hubo que responderla después, alterando el código a propósito.
- Insistan en que la diferencia no es de rigor sino de momento: una queda registrada por construcción, la otra hay que reconstruirla.

3. Expliquen la distinción que ordena todo el primer bloque, entre dos rojos que no son lo mismo:
- Rojo por ausencia: la prueba no llega a ejecutarse porque falta el módulo o la función. La herramienta ni siquiera informa una prueba fallida, sino un error al recolectar.
- Rojo por comportamiento: la prueba sí corre, la comparación se ejecuta y el resultado observado no coincide con el esperado.
- Expliquen por qué solo el segundo demuestra que la comparación funciona y distingue un valor de otro.
- Aclaren que corregir un error de escritura o una dependencia ausente para alcanzar el rojo bueno no autoriza todavía a implementar la regla completa.

4. Presenten el criterio de tres condiciones para aceptar un rojo antes de pasar al verde:
- Que la prueba efectivamente se haya ejecutado y aparezca identificada como fallida.
- Que la causa sea la regla todavía no implementada, y no un error de escritura o de configuración.
- Que el mensaje sea comprensible: que otra persona pueda relacionar esa salida con el requisito.

5. Expliquen el verde mínimo como decisión deliberada, no como descuido:
- Presenten las tres estrategias que describe Kent Beck para llegar a verde, dejando claro que no son niveles de calidad sino formas de administrar riesgo: resolver con una constante, implementación obvia y triangulación.
- Relaten por qué en la primera vuelta se elige devolver una constante aunque la solución general ya se pueda imaginar: para que un segundo ejemplo obligue a reemplazarla y quede evidencia de la generalización.
- Aclaren que eso no engaña a nadie, porque el carácter provisional es explícito y el ejemplo siguiente lo deja en evidencia.

6. Expliquen qué autoriza un refactor, con sus cinco condiciones:
- Suite en verde antes de tocar la estructura.
- Sensibilidad conocida: la prueba relacionada fue observada en rojo por el motivo esperado.
- Conducta fija: se puede decir qué respuestas deben permanecer iguales.
- Un solo cambio estructural por vez.
- Ejecución de la suite después de cada cambio.
- Y la regla que más cuesta sostener: si la suite se pone roja durante un refactor, no se modifican las expectativas para recuperar el verde; se revisa o se revierte el último cambio.

7. Relaten las tres vueltas del ciclo como una secuencia, no como una lista:
- La primera vuelta fija el nombre de la operación, sus parámetros y el hecho de que la respuesta sea un sí o un no.
- La segunda introduce el límite exacto —ocupar el cupo completo— y eso rompe la constante y obliga a la regla general.
- La tercera introduce el límite inferior, el caso de cero personas, y corrige una generalización que había quedado incompleta.
- Cierren mostrando que la implementación final expresa las tres decisiones sin ramas y sin duplicación.

8. Expliquen el diseño emergente con la precisión que exige la fuente:
- El diseño emergió porque cada decisión se tomó cuando un ejemplo la volvió necesaria.
- Pero TDD no produce automáticamente un buen diseño: las pruebas aportan presión y retroalimentación, y el criterio técnico sigue siendo necesario para elegir nombres, ejemplos y límites.
- "Emergente" tampoco significa improvisado: cada cambio está respaldado por una decisión observable y una ejecución.

9. Señalen dónde aparece la cobertura en este método:
- Se mide recién cuando las vueltas terminaron.
- El resultado es alto, pero como consecuencia del recorrido, nunca como meta perseguida.
- Contrasten con la sesión anterior, donde el número era el punto de partida de la discusión.

10. Muestren que el ciclo no depende del lenguaje:
- Se repite una vuelta completa con otro lenguaje y otro ejecutor de pruebas.
- Cambia la sintaxis y cambia el comando; no cambia el orden ni cambia la garantía.
- Expliquen que también cambia la forma del mensaje de error, y que eso no altera lo que ese rojo demuestra.

11. Lleguen al caso que la industria vuelve cotidiano: una entrega donde la prueba y el código nacieron juntos.
- La suite llega verde. Ese verde demuestra que las pruebas y el código recibido son compatibles.
- No demuestra que las pruebas rechacen una implementación defectuosa: quien las escribió pudo redactar expectativas que describen su propio código, omitir un límite o no haber ejecutado lo que afirma.

12. Expliquen el procedimiento de auditoría, paso a paso:
- Fijar el criterio fuera del código, leyendo el requisito.
- Ejecutar la entrega sin modificarla y conservar el verde como línea base.
- Introducir una alteración dirigida en el código de producción, sin tocar las pruebas.
- Exigir el rojo correspondiente y comprobar que el mensaje coincide con lo alterado.
- Restaurar la implementación y volver a ejecutar.
- Relaten el resultado observado: dos pruebas reaccionaron y una permaneció en verde, porque la alteración no contradecía su caso. Subrayen que eso no es un defecto de esa prueba, sino el resultado esperado.

13. Sean muy precisos con lo que la auditoría recupera y lo que no:
- Sí se puede comprobar después que las pruebas reaccionan ante alteraciones concretas: eso es sensibilidad actual.
- No se puede comprobar después que la prueba existió antes que el código, si no quedó historial.
- No se puede comprobar después que la prueba influyó en el diseño.
- Y ninguna suite finita garantiza detectar cualquier defecto futuro.
- Formulen la conclusión con cuidado: el procedimiento reconstruye sensibilidad, pero no convierte el trabajo pasado en TDD.
- Mencionen qué haría falta para preservar esa secuencia en una entrega futura: artefactos trazables como commits separados, salidas de ejecución o un agente obligado a detenerse después del rojo.

14. Presenten el debate abierto como abierto, sin tomar partido:
- En 2014, David Heinemeier Hansson declaró muerto para su práctica el enfoque de escribir la prueba primero, pero no las pruebas automatizadas; su crítica apuntaba al uso dogmático y a diseños deformados para satisfacer el aislamiento.
- Kent Beck, Martin Fowler y Hansson discutieron públicamente esas diferencias.
- La conclusión útil no es un eslogan: el valor y el costo de TDD dependen del contexto, del tipo de sistema y de cómo se aplica.
- Los agentes no resuelven ese debate; cambian su escala, porque producen código y pruebas juntos muy rápido, y la velocidad no determina si las expectativas representan el requisito correcto.

15. Expliquen el sesgo concreto del agente en este método:
- Tiende a completar la regla general que infiere del dominio, y al hacerlo borra el paso de triangulación.
- Por eso la instrucción tiene que declarar el límite: hacer pasar únicamente esta prueba, sin agregar ramas, validaciones ni casos nuevos.
- Nombren cuándo TDD rinde especialmente con agentes: para convertir un requisito pequeño en una expectativa ejecutable antes de delegar, para limitar el cambio que hará el agente y para conservar una secuencia auditable.

Cierre:
Dejen claro que no todo código con pruebas es TDD, y que eso no es un reproche:
- Es legítimo escribir pruebas después, hacer pruebas exploratorias o verificar por integración y extremo a extremo.
- Lo imprescindible es nombrar correctamente la evidencia disponible y no atribuirle una garantía que el proceso no produjo.

Terminen con esta idea, expresada claramente:
"Una prueba que nunca se vio fallar no demostró que pueda fallar. Ese hecho pertenece al proceso, no al estado final del código, y por eso no se puede reconstruir después si nadie lo registró."

Conecten brevemente con la próxima clase:
Todo lo del episodio ocurrió sobre funciones aisladas, sin red, sin base de datos y sin estado compartido. El nivel que sigue pregunta otra cosa: qué evidencia demuestra que esas piezas funcionan cuando se conectan entre sí.

Indicaciones de producción:
- No lean fragmentos de código carácter por carácter ni deletreen nombres de función o de archivo; explíquenlos en lenguaje natural.
- Cuando aparezca un mensaje de error de la herramienta, no lo lean literal: digan qué significa en una frase.
- Eviten bromas, analogías infantiles y entusiasmo artificial.
- No traten el debate de 2014 como una polémica entre personas ni como anécdota: preséntenlo como una discusión técnica con una conclusión utilizable.
- No conviertan el episodio en una lista mecánica: construyan una secuencia, desde el primer rojo hasta el límite de lo que una auditoría puede recuperar.
- No inventen cifras, definiciones, ejemplos ni conclusiones ausentes de la fuente.
- No mencionen rutas de archivos, nombres de láminas, instrucciones docentes internas ni secciones de ejercicios.
```

## Notas de generación

- Se utilizó **Conversación en profundidad** con salida en español.
- NotebookLM produjo un audio de 20 min 11 s pese a la duración solicitada de 15 a 18 minutos. Es el mismo comportamiento observado en la Clase 10, donde se pidieron 12 a 15 minutos y el resultado fue de 17 min 11 s: la duración indicada funciona como orientación, no como límite.
- Se cargó únicamente el README de la clase para evitar referencias al deck o a rutas internas.
- Dos acotaciones resultaron necesarias y conviene conservarlas en episodios futuros. La primera pide no leer los mensajes de error literalmente, porque de otro modo el audio deletrea nombres de función y de archivo. La segunda acota el debate de 2014 a una discusión técnica; sin ella el episodio tiende a relatarlo como polémica entre personas y consume varios minutos sin aportar criterio.
- La distinción entre lo que la auditoría recupera —sensibilidad actual— y lo que no —el orden en que se escribieron prueba y código— se aisló en un paso propio del guion, porque es el punto de la clase que con mayor facilidad queda aplanado en una recomendación genérica.
