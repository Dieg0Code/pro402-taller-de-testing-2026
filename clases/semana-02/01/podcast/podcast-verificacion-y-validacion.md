# Podcast — Clase 04: Verificación y validación

- Audiencia: estudiantes técnicos de PRO402, segundo año de Analista Programador.
- Propósito: reforzar la distinción entre verificación y validación mediante el caso del promedio no autorizado y las tres fallas históricas, para repaso previo o posterior a la sesión.
- Formato: Resumen de Audio conversado entre dos conductores, duración larga.
- Generación: NotebookLM, cuadro de personalización del Resumen de Audio.
- Fuente conceptual: `clases/semana-02/01/README.md` (cargar solo el README; el deck hace que el audio enumere láminas en vez de conversar).
- Título sugerido del archivo: `La_regla_que_nadie_autorizo.m4a`

## Prompt final

```text
Audiencia: estudiantes de segundo año de Analista Programador. Ya saben programar
bien; lo nuevo para ellos es el testing. Háblales como colegas, no como principiantes.

Idioma: español neutro de Chile, técnico y directo. Sin chistes forzados, sin
entusiasmo publicitario, sin "hoy vamos a hablar de".

Arranca en frío con el caso concreto, no con una introducción general: una prueba
impecable, escrita con toda la disciplina, que pasa en verde y aun así hace que el
sistema repruebe a un estudiante que debía aprobar. Recién después de que ese
problema esté instalado, nombren la distinción entre verificación y validación.

Recorrido de la conversación:
1. Una prueba en verde demuestra que el producto cumple lo que la prueba afirma, y
   nada más. Hereda todo lo equivocado de la expectativa que la originó.
2. Verificar es comparar el producto con la especificación. Validar es comparar la
   especificación con la necesidad real. La segunda comparación exige una autoridad
   externa al equipo: no hay comando que la ejecute.
3. El ejemplo del promedio: la función calcula un promedio simple porque así se
   escribió, no porque alguien lo decidiera. Con una ponderación de 30, 30 y 40 las
   mismas notas dan otra calificación, y en el umbral eso decide la aprobación.
4. Los tres casos históricos, cada uno con la pregunta que faltó: Ariane 5 verificado
   contra el perfil de vuelo de un cohete anterior; Knight Capital, donde lo verificado
   no era lo que estaba operando en los ocho servidores; Therac-25, donde el criterio
   programado era "aplicar lo que el operador indicó" y el criterio necesario era
   "no dañar nunca al paciente".
5. Por qué ninguno de los tres se evitaba con más pruebas unitarias.
6. Los cuatro escenarios al cruzar ambas preguntas, y por qué "verificado pero no
   validado" es el más peligroso: se parece al éxito.
7. Qué hace bien un agente de IA en esto (ordenar, clasificar, ampliar preguntas) y
   dónde falla: rellena la columna de la fuente con frases que tienen forma de
   respaldo — "según la práctica habitual", "de acuerdo con la normativa vigente" —
   sin nombrar documento, versión ni responsable.
8. Cierre con la conclusión proporcional: un producto puede estar verificado en su
   alcance actual y validado solo parcialmente, y decirlo así es más profesional que
   decir que funciona bien.

Conserven el vocabulario exacto de la fuente: especificación, necesidad, fuente,
correspondencia, evidencia, criterio huérfano, por validar.

Prohibido:
- Inventar cifras, fechas o casos que no estén en la fuente.
- Leer ejercicios, actividades, horarios, duraciones de bloques o puntos de control.
- Decir "según el documento", "el material indica" o referirse a la clase como archivo.
- Mencionar nombres de archivos, rutas o herramientas de producción.
- Cerrar con un resumen genérico tipo "en definitiva, el testing es importante".

Que se note que los dos conductores discrepan en algo y lo resuelven razonando: por
ejemplo, si vale la pena escribir criterios que todavía no tienen fuente. La respuesta
a la que deberían llegar es que sí, siempre que queden marcados como tales.
```

## Notas de generación

- Elegir la duración más larga disponible: el recorrido tiene ocho puntos y en formato
  corto se pierden los casos históricos.
- Si el audio abre con una bienvenida genérica, volver a generarlo insistiendo en la
  instrucción del arranque en frío; es la que más suele desobedecer.
- El audio final exportado se guarda en esta misma carpeta.
