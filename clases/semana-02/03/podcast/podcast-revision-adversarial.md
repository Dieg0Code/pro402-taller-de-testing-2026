# Podcast — Clase 06: La revisión como prueba

- Audiencia: estudiantes técnicos de PRO402 Taller de Testing y Calidad de Software.
- Propósito: reforzar la revisión de código como prueba estática, el montaje adversarial entre agentes y el arbitraje de hallazgos mediante pruebas ejecutables.
- Formato: Conversación en profundidad, duración aproximada de 15 a 18 minutos.
- Generación: NotebookLM, cuadro de personalización del Resumen de Audio.
- Fuente conceptual: `clases/semana-02/03/README.md`.
- Audio generado: `Evidencias_reales_frente_a_opiniones_en_código.m4a`.

## Prompt final

```text
Generen un podcast educativo en español neutro, de aproximadamente 15 a 18 minutos, dirigido a estudiantes técnicos de programación que están cursando PRO402 Taller de Testing y Calidad de Software.

El objetivo es explicar la Clase 06 de forma clara, progresiva y fácil de recordar. No se limiten a enumerar el README: conviértanlo en una conversación docente donde una persona conduce la explicación y la otra pregunta, cuestiona conclusiones apresuradas y resume las ideas difíciles.

Construyan el episodio alrededor de esta pregunta:

¿Qué separa una revisión de código que produce evidencia de una simple opinión sobre el código?

Recorrido obligatorio:

1. Expliquen por qué Pyrefly compara el código contra los tipos, Ruff contra patrones conocidos y una revisión contra el requisito. Usen el ejemplo del límite de asistencia: el requisito dice “mayor o igual a 70”, mientras el código usa “mayor que 70”.

2. Presenten la revisión como una prueba estática con método. Mencionen brevemente los cinco tipos definidos por IEEE 1028, pero concentren la explicación en la revisión técnica con criterios de inspección.

3. Utilicen Heartbleed para demostrar que “el código fue revisado” no significa que el defecto haya sido buscado con criterios claros. Expliquen los límites operativos del revisor: entre 200 y 400 líneas por revisión, un máximo aproximado de 60 minutos y una velocidad inferior a 500 líneas por hora.

4. Expliquen cómo construir una lista de comprobación que empiece donde terminan las herramientas. Desarrollen las cuatro preguntas de la clase: límites, casos vacíos, reglas del producto y tratamiento de datos personales.

5. Enseñen con claridad la diferencia entre:
- Defecto: existe una entrada concreta, la prueba puede escribirse y falla.
- Riesgo: existe una situación indeseable, pero falta definir la conducta esperada.
- Estilo: el cambio propuesto no modifica el comportamiento observable.

6. Expliquen el caso del redondeo y por qué un contraejemplo solo vale en el entorno declarado. Destaquen que una entrada puede comportarse de forma distinta en Python 3.10 y Python 3.12, y que el entorno reproducible forma parte de la evidencia.

7. Presenten la revisión adversarial con sus tres papeles:
- Autor: escribe el código usando el requisito.
- Auditor: recibe únicamente el código y el requisito, en una sesión nueva.
- Árbitro: el estudiante, que decide usando evidencia.

Aclaren por qué el auditor no debe recibir el razonamiento del autor.

8. Comparen los tres protocolos aplicados al mismo código. Destaquen que una pregunta orientada a confirmar puede encontrar un defecto y, al mismo tiempo, declarar correcto otro defecto sin haberlo probado. Expliquen que el protocolo cambia el veredicto.

9. Destaquen el punto ciego común: ninguno de los tres protocolos detectó el riesgo de incluir el RUT en el resumen porque el requisito no decía nada sobre privacidad o minimización de datos. La idea central es que un auditor automático encuentra bien contradicciones, pero no necesariamente los vacíos de lo que nunca se escribió.

10. Cierren explicando el arbitraje mediante pruebas escritas antes de corregir:
- A: la prueba falla; el defecto queda confirmado.
- B: la prueba pasa; esa evidencia no sostiene el hallazgo.
- C: la prueba no puede escribirse; falta una decisión de producto.

Durante la conversación, pronuncien los operadores y ejemplos de código en lenguaje natural. Por ejemplo, digan “mayor que setenta” y “mayor o igual que setenta”; no lean símbolos o fragmentos carácter por carácter.

Mantengan un tono técnico, cercano y exigente. Eviten bromas largas, introducciones genéricas, publicidad, frases motivacionales vacías y contenido que no aparezca en la fuente. Cuando mencionen cifras, versiones, herramientas o resultados, respétenlos exactamente.

Terminen con una síntesis memorable:

“Una revisión es tan buena como el documento que usa de referencia.”

Luego formulen tres preguntas breves para que el estudiante compruebe si entendió:
1. ¿Qué hallazgo encontró una persona que los auditores automáticos no detectaron?
2. ¿Qué ocurrió al convertir un hallazgo en una prueba antes de corregir?
3. ¿Qué riesgo quedó abierto porque faltaba una decisión de producto?
```

## Notas de generación

- Usar el formato **Conversación en profundidad**.
- Mantener el idioma de salida en español.
- Cargar únicamente el README de la clase para evitar que el audio enumere diapositivas.
- Si el audio transforma el episodio en una lista o lee el código carácter por carácter, regenerarlo con el mismo prompt.
