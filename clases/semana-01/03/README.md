# Clase 03 - Semana 01 - La calidad no es opinión: ISO/IEC 25010 aplicada

- **Unidad:** 01 · Calidad y Testing de Software
- **Fecha:** Miércoles 12 de agosto de 2026
- **Duración:** 3 horas pedagógicas · 140 minutos (08:30 - 10:50)
- **Modalidad:** Presencial en Laboratorio PC
- **Docente:** Diego Obando
- **Marco de referencia:** ISO/IEC 25010:2023 · Modelo de calidad del producto

---

# Objetivos de la Clase

## Objetivo General

Al finalizar esta sesión, el estudiante será capaz de evaluar la calidad de un producto de software
mediante las nueve características de ISO/IEC 25010:2023, relacionando necesidades y riesgos con
evidencias observables. Para ello, ampliará la mirada construida en la clase anterior —centrada en
un entorno reproducible, controles estáticos y cuatro pruebas en verde—, identificará qué aspectos
del producto todavía no han sido verificados y formulará criterios de calidad que puedan comprobarse
mediante pruebas, mediciones o revisión técnica.

## Objetivos Específicos

1. **Diferenciar corrección funcional y calidad del producto**, explicando por qué una suite de
   pruebas en verde demuestra comportamientos específicos, pero no permite concluir que el software
   sea seguro, confiable, eficiente, mantenible o apropiado para todos sus usuarios y contextos.
2. **Interpretar las nueve características del modelo ISO/IEC 25010:2023**, traduciendo cada una en
   preguntas concretas sobre adecuación funcional, eficiencia de desempeño, compatibilidad,
   capacidad de interacción, fiabilidad, seguridad, mantenibilidad, flexibilidad y seguridad
   operacional.
3. **Clasificar riesgos de un producto real mediante el modelo de calidad**, distinguiendo la
   característica afectada, el comportamiento o propiedad que debería observarse y el impacto que
   tendría no controlarlo.
4. **Relacionar controles técnicos con evidencia de calidad**, identificando qué respaldan
   parcialmente `uv`, Ruff, Pyrefly y pytest, y qué afirmaciones continúan sin evidencia después de
   ejecutar esas herramientas.
5. **Transformar expectativas vagas en criterios verificables**, formulando condiciones observables
   que indiquen qué se espera, bajo qué contexto y mediante qué prueba, medición o revisión podría
   comprobarse.
6. **Auditar propuestas de un agente de IA sobre riesgos y métricas**, aceptando solo aquellas que
   se deriven del producto y dejando explícitas las decisiones, restricciones o fuentes de verdad
   que todavía falten.

## Competencias Transversales

- **Pensamiento sistémico:** observar el producto más allá de una función aislada y reconocer que
  distintas características de calidad pueden interactuar, competir o exigir evidencias diferentes.
- **Análisis basado en riesgo:** priorizar características según usuarios, contexto, impacto y
  consecuencias, en vez de tratar todas las propiedades como una lista indiferenciada.
- **Comunicación técnica:** formular afirmaciones de calidad acotadas y respaldarlas con evidencia
  comprensible para otras personas del equipo.
- **Criterio frente a la automatización:** usar un agente para ampliar preguntas y alternativas sin
  delegarle la definición de necesidades, umbrales ni decisiones del producto.

---

# Mapa de la Clase

| Horario | Sección | Propósito |
|---------|---------|-----------|
| 08:30 - 08:40 | Encuadre | Retomar la ejecución final de la Clase 02 y enfrentar la pregunta central: si todos los controles quedaron en verde, ¿qué aspectos de la calidad todavía no podemos demostrar? |
| 08:40 - 09:10 | Bloque 1 | Diferenciar funcionamiento, evidencia y calidad del producto; introducir ISO/IEC 25010:2023 como un mapa para formular preguntas y descubrir riesgos relevantes. |
| 09:10 - 09:35 | Bloque 2 | Interpretar las nueve características mediante preguntas observables, ejemplos concretos y relaciones entre riesgo, requisito y evidencia posible. |
| 09:35 - 09:45 | Pausa | Descanso técnico. |
| 09:45 - 10:15 | Bloque 3 | Auditar el producto de cálculo de calificaciones usado en la semana, relacionando evidencia existente con características cubiertas parcialmente y vacíos que todavía requieren pruebas o mediciones. |
| 10:15 - 10:40 | Bloque 4 | Convertir expectativas vagas en criterios verificables y auditar riesgos o métricas sugeridos por un agente antes de incorporarlos a una ficha de calidad del producto. |
| 10:40 - 10:50 | Cierre | Presentar una conclusión proporcional a la evidencia, priorizar tres características del producto y conectar los criterios definidos con verificación y validación. |

---

# BLOQUE 1: Todo está en verde, pero la pregunta cambió

- **Duración:** 30 minutos
- **Objetivo del bloque:** diferenciar una ejecución correcta, una evidencia técnica y una
  afirmación de calidad del producto. Al finalizar, el estudiante debe poder explicar por qué los
  controles superados en la Clase 02 permiten sostener conclusiones útiles, pero todavía limitadas,
  y reconocer la necesidad de un modelo que ayude a formular las preguntas que faltan.
- **Modalidad:** expositiva y conversada, con análisis individual de la evidencia producida en la
  clase anterior.
- **Ritmo sugerido:** 5 minutos para recuperar la evidencia anterior, 8 para delimitar qué demuestra,
  7 para ampliar la mirada desde el código hacia el producto, 7 para el semáforo de evidencia y 3
  para sintetizar.

## Desarrollo

### 1.1 Volver al punto exacto donde terminamos

La clase anterior cerró con una batería de controles ejecutada sobre el proyecto:

```powershell
uv lock --check
uv run ruff check .
uv run pyrefly check
uv run pytest -q
```

La salida final mostró que el archivo de bloqueo estaba actualizado, Ruff y Pyrefly no informaban
hallazgos y pytest terminaba con cuatro pruebas aprobadas:

```text
....                                                                     [100%]
4 passed
```

Ese resultado es valioso. Ya no estamos diciendo solamente «parece funcionar» ni «a mí me dio
bien». Podemos mostrar archivos, comandos, casos ejecutados y resultados que otra persona puede
repetir. Sin embargo, la evidencia debe leerse con precisión:

- `uv lock --check` respalda que las dependencias declaradas y el lockfile no están desalineados;
- Ruff respalda que no encontró infracciones a las reglas de linting habilitadas;
- Pyrefly respalda que no encontró contradicciones dentro del análisis de tipos realizado;
- pytest respalda que la implementación satisfizo los cuatro ejemplos ejecutados.

Cada afirmación tiene un alcance explícito. Ninguno de esos resultados contiene las palabras
«perfecto», «seguro», «rápido», «fácil de usar» ni «correcto para todos los valores posibles».
Agregar esas conclusiones sería afirmar más de lo que la evidencia permite.

La primera pregunta de la clase es, por tanto:

> Si todos los controles están en verde, ¿qué tendría que ocurrir para que el producto aun así
> fuera inadecuado para quien debe utilizarlo?

### 1.2 Tres niveles que no debemos confundir

En conversación cotidiana solemos resumir todo con la palabra «funciona». En un equipo de software
necesitamos separar al menos tres niveles:

1. **El programa se ejecuta:** inicia, procesa una entrada y produce alguna salida sin detenerse.
2. **Cumple una expectativa observada:** ante un caso definido, el resultado obtenido coincide con
   el resultado esperado.
3. **Posee calidad suficiente para su propósito:** además de entregar funciones correctas, responde
   a las necesidades relevantes de sus usuarios y otras partes interesadas dentro de un contexto
   concreto.

La función `nota_final()` ya alcanzó el segundo nivel para cuatro ejemplos. Eso no resuelve todavía
preguntas como estas:

- ¿Qué debe ocurrir si recibe una lista vacía?
- ¿Puede procesar un curso completo sin una demora inaceptable?
- ¿Evita revelar o modificar calificaciones sin autorización?
- ¿Una persona puede reconocer y corregir una entrada inválida?
- ¿Otro programador puede cambiar la regla de redondeo sin introducir un defecto silencioso?
- ¿Un resultado equivocado podría afectar una decisión académica importante?

Estas preguntas no invalidan las pruebas existentes. Muestran que **la calidad es más amplia que la
corrección funcional observada hasta ahora**.

```text
Ejecutar sin fallar
        ↓
Cumplir casos esperados
        ↓
Responder a necesidades y riesgos del producto
```

Los niveles se acumulan: no tiene sentido hablar de un producto confiable si ni siquiera puede
ejecutarse, pero ejecutar correctamente algunos casos tampoco basta para afirmar que el producto
es de calidad.

### 1.3 La calidad pertenece al producto en contexto

Hasta ahora trabajamos principalmente con una función. Para evaluar calidad debemos observarla como
parte de un producto: una herramienta que calcula calificaciones para una persona, usa datos, se
ejecuta en un entorno y puede influir en una decisión real.

La misma implementación puede ser suficiente en un contexto y completamente inadecuada en otro:

- como ejercicio personal, procesar cinco notas manuales puede ser suficiente;
- como herramienta de un docente, debe manejar errores sin entregar resultados engañosos;
- como componente de una plataforma institucional, también debe controlar accesos, conservar
  trazabilidad, integrarse con otros sistemas y responder bajo una carga mayor.

Por eso una afirmación profesional de calidad necesita responder cuatro elementos:

```text
¿Qué propiedad importa?
        +
¿Para quién y en qué contexto?
        +
¿Qué criterio debe cumplirse?
        +
¿Qué evidencia permitirá comprobarlo?
```

Decir «el sistema es rápido» expresa una impresión. Decir qué operación debe responder, bajo qué
carga y cómo se medirá comienza a convertir esa impresión en un criterio verificable. En este
bloque no fijaremos todavía los valores: primero necesitamos descubrir **qué propiedades merece la
pena observar**.

### 1.4 ISO/IEC 25010:2023 como mapa de preguntas

ISO/IEC 25010:2023 propone un modelo de calidad para productos de tecnologías de información y
comunicación. Su utilidad en esta clase no consiste en entregar un sello automático ni una nota
universal. Nos entrega un vocabulario compartido para:

- especificar qué propiedades necesita un producto;
- detectar aspectos importantes que una definición podría haber omitido;
- relacionar riesgos con objetivos de pruebas y mediciones;
- y evaluar la calidad sin depender únicamente de impresiones personales.

La edición vigente organiza la calidad del producto en nueve características:

```text
Adecuación funcional · Eficiencia de desempeño · Compatibilidad
Capacidad de interacción · Fiabilidad · Seguridad
Mantenibilidad · Flexibilidad · Seguridad operacional
```

En el Bloque 2 traduciremos cada nombre a preguntas observables. Por ahora importa comprender tres
reglas de uso del modelo:

1. **No es una lista para marcar todo como aprobado.** Una característica puede necesitar varias
   evidencias y seguir teniendo riesgos abiertos.
2. **No todas las características tienen la misma prioridad en todos los productos.** El contexto,
   los usuarios y las consecuencias determinan qué exige mayor atención.
3. **Una herramienta no equivale a una característica.** pytest puede aportar evidencia funcional,
   Ruff puede apoyar la mantenibilidad y Pyrefly puede reducir ciertas contradicciones, pero ninguna
   salida verde demuestra por sí sola una característica completa.

El modelo amplía la conversación desde «¿qué comando pasó?» hacia una pregunta más profesional:

> ¿Qué propiedad del producto necesitamos demostrar y qué evidencia sería proporcional al riesgo?

### 1.5 Ejercicio individual: semáforo de evidencia

A partir de la salida final de la Clase 02, y sin ejecutar comandos nuevos, cada afirmación se
clasifica según el respaldo disponible:

- **Verde:** la evidencia disponible respalda directamente la afirmación.
- **Amarillo:** existe evidencia relacionada, pero solo parcial.
- **Rojo:** los controles realizados no respaldan la afirmación.

### Afirmaciones para clasificar

1. «Las dependencias declaradas y el lockfile están alineados».
2. «La función satisface los cuatro ejemplos escritos en `test_notas.py`».
3. «La función calcula correctamente cualquier combinación posible de notas».
4. «El contrato analizado declara que la función recibe una lista de números».
5. «El producto protege adecuadamente las calificaciones».
6. «El código será fácil de modificar por cualquier integrante del equipo».

La justificación de al menos dos afirmaciones debe completar esta estructura:

> La clasificamos como ______ porque la evidencia ______ permite demostrar ______, pero no permite
> concluir ______.

Una lectura razonada debería reconocer que las afirmaciones 1 y 2 cuentan con respaldo directo;
la 4 posee evidencia acotada al contrato y al análisis realizado; la 6 puede relacionarse con
señales de estructura y tipos, pero requiere evidencia adicional; y las afirmaciones 3 y 5 exceden
claramente los controles ejecutados.

También se presenta un resumen automático deliberadamente exagerado:

> «Todas las herramientas terminaron en verde, por lo tanto el producto cumple los estándares de
> calidad y está listo para utilizarse».

El ejercicio final consiste en corregirlo en una sola oración sin perder lo que sí fue demostrado.
El propósito no es desconfiar de cualquier resumen generado por un agente, sino revisar si su
conclusión conserva el alcance real de la evidencia.

## Punto de control

El bloque está completo cuando cada estudiante puede:

- distinguir ejecución, cumplimiento de casos y calidad del producto;
- formular al menos una pregunta relevante que los cuatro controles anteriores no responden;
- clasificar una afirmación según la evidencia disponible y justificar su decisión;
- y explicar que ISO/IEC 25010:2023 funciona como un mapa para especificar y evaluar propiedades,
  no como una certificación automática.

## Preguntas guía

1. **¿Por qué `4 passed` no permite afirmar que `nota_final()` es correcta para cualquier entrada?**
   **Pista:** compara los valores realmente ejecutados con todas las entradas que todavía no tienen
   un caso representado.
2. **¿Qué información falta cuando alguien afirma simplemente que un producto «es de calidad»?**
   **Pista:** identifica la propiedad, el contexto, el criterio y la evidencia que deberían acompañar
   esa afirmación.
3. **¿Por qué una herramienta en verde no equivale a una característica de ISO/IEC 25010 cumplida?**
   **Pista:** observa el alcance específico del comando y compáralo con todas las propiedades que
   habría que evaluar dentro de una característica completa.

## Cierre del bloque

- **Idea clave:** los controles de la Clase 02 produjeron evidencia real, pero una conclusión de
  calidad solo es válida cuando conserva el alcance de esa evidencia y considera el contexto del
  producto.
- **Evidencia producida:** seis afirmaciones clasificadas según su respaldo y una conclusión
  exagerada reformulada de manera proporcional.
- **Puente:** ya sabemos por qué necesitamos ampliar las preguntas. En el siguiente bloque
  convertiremos las nueve características de ISO/IEC 25010:2023 en un mapa concreto de riesgos,
  requisitos y evidencias posibles.

### Fuentes técnicas del bloque

- [ISO/IEC 25010:2023 — modelo de calidad del producto](https://www.iso.org/standard/78176.html)
- Clase 02 — cadena de evidencia y alcance de los controles.

---

# BLOQUE 2: Nueve características para hacer mejores preguntas

- **Duración:** 25 minutos
- **Objetivo del bloque:** interpretar las nueve características de ISO/IEC 25010:2023 mediante
  preguntas observables y relacionarlas con riesgos, requisitos y evidencias posibles. Al finalizar,
  el estudiante debe poder clasificar un problema según la propiedad principalmente afectada,
  reconocer características secundarias y evitar asociar una herramienta completa con una sola
  dimensión de calidad.
- **Modalidad:** expositiva y conversada, con clasificación individual de situaciones técnicas.
- **Ritmo sugerido:** 3 minutos para instalar la cadena de análisis, 12 para recorrer las nueve
  características, 7 para clasificar situaciones y 3 para contrastar los criterios.

## Desarrollo

### 2.1 Del nombre abstracto a una cadena verificable

Una característica de calidad se vuelve útil cuando ayuda a pasar desde una preocupación general
hacia una evidencia concreta:

```text
Necesidad o contexto
        ↓
Riesgo si no se cumple
        ↓
Característica de calidad afectada
        ↓
Requisito o criterio observable
        ↓
Prueba, medición o revisión
```

Por ejemplo, «la aplicación debe ser rápida» todavía no indica qué observar. Si una persona necesita
consultar una calificación durante una atención presencial, el riesgo es que una demora interrumpa
la tarea. La característica relevante es eficiencia de desempeño. Después tendremos que definir
qué operación mediremos, bajo qué carga y qué tiempo consideraremos aceptable.

El modelo no entrega automáticamente esos valores. Ayuda a no olvidar la pregunta; el equipo debe
obtener el criterio desde usuarios, reglas del producto, acuerdos técnicos y consecuencias reales.

### 2.2 Lo que el producto hace y cómo responde

#### Adecuación funcional

Pregunta central: **¿el producto entrega las funciones correctas, completas y apropiadas para la
tarea que debe resolver?**

- **Riesgo:** `nota_final()` entrega `3.9` cuando la regla acordada exige `4.0`, o no contempla una
  operación necesaria del proceso.
- **Criterio posible:** para una entrada válida, el resultado debe respetar la regla explícita de
  cálculo y redondeo.
- **Evidencia posible:** pruebas de comportamiento, casos de aceptación, tablas de decisión y
  revisión contra requisitos.

Una función puede estar implementada sin errores de sintaxis y aun así ser funcionalmente
incorrecta. Las cuatro pruebas actuales aportan evidencia para cuatro ejemplos, no para toda la
característica.

#### Eficiencia de desempeño

Pregunta central: **¿el producto responde a tiempo y utiliza recursos razonables para la carga
esperada?**

- **Riesgo:** calcular resultados para miles de registros demora tanto que la tarea deja de ser
  viable, o consume memoria de forma desproporcionada.
- **Criterio posible:** una operación definida debe completarse dentro de un tiempo y una carga
  acordados, sin exceder los recursos disponibles.
- **Evidencia posible:** benchmarks, pruebas de carga, perfiles de CPU o memoria y mediciones
  repetidas bajo condiciones controladas.

«En mi computador fue rápido» presenta el mismo problema que «en mi computador funciona»: faltan
condiciones, medición y posibilidad de repetición.

#### Compatibilidad

Pregunta central: **¿el producto puede coexistir e intercambiar información correctamente con los
sistemas que forman parte de su entorno?**

- **Riesgo:** la herramienta calcula bien, pero no puede leer el formato acordado o entrega datos
  que otra plataforma interpreta de manera distinta.
- **Criterio posible:** importar y exportar información mediante un contrato definido, sin perder
  significado ni interferir con otros componentes del entorno.
- **Evidencia posible:** pruebas de integración, validación de contratos, ejecución en entornos
  compartidos y comparación de datos antes y después del intercambio.

Compatibilidad no significa que el producto «corra en mi equipo». Exige observar su relación con
otros productos, componentes o formatos.

### 2.3 Lo que ocurre durante el uso, los fallos y las amenazas

#### Capacidad de interacción

Pregunta central: **¿las personas pueden reconocer para qué sirve el producto, aprenderlo, operarlo
y evitar o corregir errores dentro de su contexto de uso?**

- **Riesgo:** ante una entrada inválida, la persona recibe `ValueError` sin comprender qué debe
  corregir, o la interfaz excluye a usuarios que necesitan otras formas de interacción.
- **Criterio posible:** comunicar el problema en lenguaje comprensible, conservar el trabajo útil y
  ofrecer una acción de recuperación perceptible y accesible.
- **Evidencia posible:** pruebas con usuarios, recorridos de tareas, revisión de accesibilidad,
  inspección de mensajes y observación de errores frecuentes.

Una interfaz atractiva puede fallar en interacción; una interfaz austera puede ser clara y eficaz.
La evaluación se centra en la relación entre personas, tareas y producto, no en gustos visuales.

#### Fiabilidad

Pregunta central: **¿el producto mantiene el servicio esperado, tolera condiciones adversas y se
recupera sin perder un estado válido?**

- **Riesgo:** una lista vacía detiene el proceso completo, una falla temporal deja datos
  inconsistentes o la recuperación repite una operación.
- **Criterio posible:** rechazar entradas inválidas de forma controlada y conservar o recuperar un
  estado consistente.
- **Evidencia posible:** pruebas de excepciones, inyección de fallos, reinicios controlados,
  observación de disponibilidad y comprobación de recuperación.

Un resultado incorrecto suele comenzar como un problema funcional. Se convierte también en un
problema de fiabilidad cuando el producto no mantiene el comportamiento esperado frente a fallos,
carga o condiciones adversas.

#### Seguridad

Pregunta central: **¿el producto protege información y operaciones frente a accesos, modificaciones
o acciones no autorizadas, y permite atribuir lo ocurrido?**

- **Riesgo:** una persona consulta o altera calificaciones sin autorización, o una modificación no
  deja trazabilidad suficiente para investigarla.
- **Criterio posible:** permitir cada operación solo a identidades autorizadas y registrar acciones
  sensibles con la información necesaria para su revisión.
- **Evidencia posible:** pruebas de autorización, revisión de configuración, análisis de amenazas,
  auditoría de registros y pruebas sobre integridad y confidencialidad.

Que una prueba funcional pase no demuestra que solo la persona correcta pueda ejecutar esa misma
operación.

#### Seguridad operacional

Pregunta central: **¿el producto evita estados capaces de causar daño inaceptable y reacciona de
forma segura cuando detecta una condición peligrosa?**

- **Riesgo:** un sistema médico aplica una dosis fuera del rango permitido o una máquina recibe una
  orden de movimiento mientras una protección está abierta.
- **Criterio posible:** bloquear la operación peligrosa, conservar un estado seguro y advertir la
  condición antes de continuar.
- **Evidencia posible:** análisis de peligros, pruebas de límites, simulación de fallos, verificación
  de interbloqueos y revisión de mecanismos de parada segura.

No todos los productos presentan el mismo nivel de riesgo operacional. En una herramienta de
calificaciones esta característica puede tener menor prioridad que en un dispositivo médico o un
sistema industrial. La prioridad depende del daño posible, no de completar una lista por obligación.

### 2.4 Lo que ocurre cuando el producto debe cambiar

#### Mantenibilidad

Pregunta central: **¿el equipo puede comprender, analizar, probar y modificar el producto sin
introducir un riesgo desproporcionado?**

- **Riesgo:** cambiar la regla de redondeo obliga a editar varias zonas, no existe una prueba que
  detecte una regresión o nadie logra localizar la causa de una falla.
- **Criterio posible:** mantener la regla en un lugar identificable, acompañada por pruebas que
  permitan modificarla y volver a verificarla.
- **Evidencia posible:** revisión de código, análisis estático, métricas estructurales, pruebas de
  regresión y observación del esfuerzo requerido para realizar un cambio controlado.

Ruff, Pyrefly y una suite clara pueden aportar evidencia parcial. No demuestran por sí solos que el
producto completo sea mantenible.

#### Flexibilidad

Pregunta central: **¿el producto puede adaptarse, escalarse, instalarse o reemplazarse cuando cambia
el entorno o la necesidad?**

- **Riesgo:** funciona para un curso pequeño, pero su diseño impide atender más volumen, cambiar de
  plataforma o sustituir un componente sin rehacer el producto.
- **Criterio posible:** ejecutar en los entornos declarados y admitir un cambio de escala o
  configuración sin modificar responsabilidades que no están relacionadas.
- **Evidencia posible:** pruebas en matrices de entorno, instalación reproducible, pruebas de
  escalabilidad, configuración externa y ejercicios de sustitución o migración.

Flexibilidad no significa anticipar cualquier futuro imaginable. Significa preparar el producto
para los cambios razonablemente esperables dentro de su contexto.

### 2.5 Una situación puede afectar varias características

Las características no son cajones aislados. Un mismo problema puede tocar varias, pero normalmente
hay una que explica mejor la preocupación inicial.

```text
Problema observado
        ↓
¿Qué necesidad incumple primero?  → característica principal
        ↓
¿Qué otras consecuencias produce? → características relacionadas
```

Ejemplo: la aplicación tarda ocho segundos en mostrar una calificación. Si el problema inicial es
la demora bajo una carga definida, la característica principal es eficiencia de desempeño. Si la
espera no se comunica y las personas repiten la operación porque creen que falló, también aparece
una preocupación de capacidad de interacción. Clasificar no consiste en encontrar una palabra
idéntica: consiste en comprender la necesidad y el impacto.

#### Ejercicio individual: característica principal, secundaria y evidencia

Se seleccionan dos situaciones y se completan tres decisiones para cada una:

1. característica principalmente afectada;
2. una característica secundaria posible, solo si puede justificarla;
3. una evidencia que permitiría investigar el problema.

Situaciones:

- El promedio `3.95` se informa como `3.9` aunque la regla exige `4.0`.
- Cargar 50.000 registros demora demasiado para completar la tarea dentro del horario disponible.
- El archivo exportado contiene los datos correctos, pero la plataforma receptora no puede leerlo.
- Una entrada vacía cierra la aplicación mostrando únicamente un mensaje técnico.
- Una cuenta sin permisos logra consultar las calificaciones de otro curso.
- Modificar el redondeo exige cambiar código repetido en cuatro archivos y no existen pruebas de
  regresión para tres de ellos.

Si se utiliza un agente para obtener una primera clasificación, la solicitud debe exigir que
exponga su razonamiento y la información faltante:

> Para cada situación, propone una característica principal de ISO/IEC 25010:2023 y, solo si se
> justifica, una secundaria. Explica qué necesidad o riesgo sustenta la clasificación. No inventes
> requisitos ni umbrales; si falta contexto, indícalo.

La propuesta del agente se contrasta con el análisis propio. No se acepta una clasificación solo
porque el agente nombró una característica válida: debe explicar por qué esa propiedad es la
primera que necesitamos observar.

## Punto de control

El bloque está completo cuando cada estudiante puede:

- formular una pregunta concreta para cada una de las nueve características;
- construir la secuencia riesgo, característica, criterio y evidencia;
- distinguir seguridad de la información y seguridad operacional;
- e identificar una característica principal sin negar que el mismo problema pueda producir
  efectos secundarios en otras dimensiones.

## Preguntas guía

1. **¿Por qué una prueba funcional no demuestra automáticamente fiabilidad o seguridad?**
   **Pista:** compara el resultado que observa la prueba con las condiciones adversas y los accesos
   que todavía no fueron ejecutados.
2. **¿Cómo distinguimos la característica principal cuando un problema parece pertenecer a varias?**
   **Pista:** comienza por la necesidad que se incumple primero y luego separa sus consecuencias.
3. **¿Por qué no todas las características deben tener la misma prioridad en todos los productos?**
   **Pista:** contrasta el daño posible y el contexto de una calculadora de práctica con los de un
   sistema médico o industrial.

## Cierre del bloque

- **Idea clave:** ISO/IEC 25010:2023 organiza la conversación, pero el contexto transforma cada
  característica en un riesgo, un criterio y una evidencia relevante para el producto.
- **Evidencia producida:** dos situaciones clasificadas individualmente con característica
  principal, relación secundaria justificada y una forma posible de investigación.
- **Puente:** conocemos el mapa completo. Después de la pausa lo aplicaremos al producto de cálculo
  de calificaciones para distinguir evidencia existente, cobertura parcial y vacíos todavía abiertos.

### Fuentes técnicas del bloque

- [ISO/IEC 25010:2023 — modelo de calidad del producto](https://www.iso.org/standard/78176.html)
- Programa oficial PRO402 — Taller de Testing y Calidad de Software.

---

# BLOQUE 3: Auditar sin inventar evidencia

- **Duración:** 30 minutos
- **Objetivo del bloque:** aplicar ISO/IEC 25010:2023 al producto de cálculo de calificaciones,
  distinguiendo evidencia directa, señales parciales, vacíos y decisiones todavía no definidas. Al
  finalizar, cada estudiante debe poder formular un hallazgo trazable desde un archivo o comando real y
  escribir una conclusión que no exceda el alcance de lo observado.
- **Modalidad:** laboratorio guiado, ejecución individual y revisión adversarial con apoyo de un
  agente.
- **Ritmo sugerido:** 5 minutos para fijar el alcance, 5 para inventariar evidencia, 8 para analizar
  tres características, 7 para contrastar los hallazgos con la línea base, 3 para la revisión del
  agente y 2 para formular la conclusión.

## Desarrollo

### 3.1 Antes de evaluar, fijar el alcance del producto

Una auditoría pierde valor cuando cambia silenciosamente el objeto evaluado. No auditaremos una
plataforma académica completa ni supondremos que ya existen usuarios, base de datos o interfaz.
Nuestro alcance real es el producto construido durante la semana:

```text
Producto: calculadora local de nota final
Usuario actual: estudiante o docente que ejecuta el proyecto en Python
Entrada declarada: list[float]
Salida declarada: float con un decimal
Regla conocida: promedio con redondeo ROUND_HALF_UP
Entorno: proyecto Python administrado con uv
Controles actuales: Ruff, Pyrefly y pytest
```

También dejamos visibles las decisiones que todavía no fueron definidas:

- qué debe ocurrir con una lista vacía;
- qué rangos de notas son válidos;
- cuántos datos debe procesar y en cuánto tiempo;
- con qué sistemas o formatos debería integrarse;
- si existirá una interfaz destinada a usuarios finales;
- y si manejará identidades, permisos o almacenamiento de calificaciones.

No definir esas decisiones en este momento es válido. Lo incorrecto sería inventarlas para poder
marcar una característica como cumplida.

Cada estudiante crea en la raíz de su proyecto el archivo `auditoria-calidad.md` y registra el
alcance:

```markdown
# Auditoría inicial de calidad

## Alcance

- Producto: calculadora local de nota final.
- Contexto: ejecución local en Python mediante uv.
- Regla conocida: promedio con un decimal y ROUND_HALF_UP.
- Fuera de alcance actual: interfaz, persistencia, autenticación e integración externa.
```

La sección «fuera de alcance» no elimina riesgos. Evita fingir que fueron evaluados con un producto
que todavía no contiene esas responsabilidades.

### 3.2 Inventariar primero; interpretar después

Antes de emitir una opinión, se identifican los artefactos disponibles:

```powershell
Get-ChildItem
Get-Content .\pyproject.toml
Get-Content .\notas.py
Get-Content .\test_notas.py
```

Después vuelve a producir la evidencia ejecutable:

```powershell
uv lock --check
uv run ruff check .
uv run pyrefly check
uv run pytest -q
```

En `auditoria-calidad.md` se registra el inventario sin interpretaciones amplias:

```markdown
## Evidencia disponible

- E1: `pyproject.toml` y `uv.lock` describen el entorno y sus dependencias.
- E2: `notas.py` contiene la regla de cálculo y redondeo.
- E3: `test_notas.py` contiene cuatro ejemplos de comportamiento.
- E4: `uv lock --check` finaliza correctamente.
- E5: Ruff no informa infracciones habilitadas.
- E6: Pyrefly no informa contradicciones en el análisis realizado.
- E7: pytest informa `4 passed`.
```

Asignar identificadores evita escribir «hay pruebas» de manera vaga. Un hallazgo puede referirse a
`E3` y `E7`, y otra persona sabrá qué revisar y qué volver a ejecutar.

### 3.3 Cuatro estados para hablar de evidencia, no de aprobación

La auditoría utilizará estos estados:

- **DIRECTA:** existe una evidencia que observa el criterio específico formulado.
- **PARCIAL:** existe una señal relacionada, pero no cubre el riesgo o criterio completo.
- **AUSENTE:** no encontramos una evidencia que permita investigar la afirmación.
- **POR DEFINIR:** falta contexto, una regla o un umbral antes de decidir qué debería comprobarse.

Estos estados califican la **evidencia disponible**, no declaran que una característica completa
«aprobó» o «falló».

```text
Característica completa aprobada  ✗
Evidencia directa para un criterio concreto  ✓
```

#### Ejemplo guiado 1: adecuación funcional

- **Riesgo:** informar `3.9` cuando la regla exige redondear `3.95` a `4.0`.
- **Criterio:** el caso `[3.8, 4.1, 3.95]` debe producir `4.0`.
- **Evidencia actual:** `E3` contiene la prueba y `E7` confirma que fue ejecutada con éxito.
- **Estado:** **DIRECTA** para ese criterio específico.
- **Vacío:** otros rangos, entradas inválidas y combinaciones no representadas siguen abiertos.

La evidencia es directa porque el criterio es acotado. No autoriza a escribir «adecuación funcional
completa».

#### Ejemplo guiado 2: mantenibilidad

- **Riesgo:** modificar la regla de redondeo e introducir una regresión difícil de localizar.
- **Criterio provisional:** la regla debe permanecer identificable y su cambio debe poder verificarse
  mediante pruebas y análisis estático.
- **Evidencia actual:** `E2` concentra la regla, `E3` contiene pruebas descriptivas y `E5` y `E6`
  aportan señales estructurales.
- **Estado:** **PARCIAL**.
- **Vacío:** todavía no hemos realizado un cambio controlado ni medido el impacto de modificarla.

Aquí sería exagerado usar **DIRECTA**: las herramientas ayudan, pero aún no observamos el producto
durante una modificación real.

### 3.4 Auditoría enfocada de las nueve características

Cada estudiante selecciona tres características: una asociada al valor o respuesta del producto,
una asociada al uso o la confianza y una asociada al cambio. Para cada característica completa la
siguiente estructura:

```markdown
## Hallazgos

### Característica: [nombre]

- Riesgo o pregunta:
- Criterio conocido o decisión faltante:
- Evidencia actual: [E1, E2...]
- Estado: [DIRECTA | PARCIAL | AUSENTE | POR DEFINIR]
- Evidencia que falta:
- Conclusión permitida:
```

La selección acotada permite profundizar el razonamiento sin completar nueve filas de manera
superficial. La línea base posterior permite contrastar los hallazgos con el modelo completo.

#### Línea base para contrastar los hallazgos

La clasificación puede variar si el estudiante formula un criterio diferente, pero debe conservar un
razonamiento equivalente a este:

- **Adecuación funcional:** evidencia directa para cuatro casos; cobertura parcial de la
  característica y reglas pendientes para entradas inválidas.
- **Eficiencia de desempeño:** evidencia ausente; tampoco se ha definido volumen ni tiempo
  aceptable.
- **Compatibilidad:** por definir; el alcance actual no declara sistemas ni formatos con los que
  deba intercambiar información.
- **Capacidad de interacción:** evidencia ausente para usuarios finales; ejecutar una función desde
  código no equivale a evaluar una interacción completa.
- **Fiabilidad:** evidencia parcial sobre casos válidos; faltan fallos, recuperación y tratamiento
  controlado de condiciones inválidas.
- **Seguridad:** por definir dentro del alcance local; no existen identidades, permisos ni datos
  persistidos que permitan probar autorización o confidencialidad.
- **Mantenibilidad:** evidencia parcial mediante estructura, tipos, pruebas y regla localizada;
  falta observar un cambio real.
- **Flexibilidad:** evidencia parcial para reconstruir el entorno; faltan entornos soportados,
  escala esperada y cambios de configuración.
- **Seguridad operacional:** por definir según el daño posible y el uso real; no existe evidencia
  para declarar que el riesgo sea inexistente.

«Por definir» no significa «no importa». Indica que primero necesitamos una conversación con la
fuente de verdad adecuada.

### 3.5 Pedir al agente que busque sobreafirmaciones

Solo después del primer análisis humano, el estudiante entrega al agente el alcance, el inventario y sus
tres hallazgos. La tarea del agente no es completar la auditoría ni asignar una nota:

> Revisa estos hallazgos como auditor adversarial. Para cada uno identifica: a) una conclusión más
> amplia que la evidencia citada; b) una característica mal asociada; o c) una decisión que el
> equipo está inventando porque falta contexto. No propongas funciones nuevas ni marques
> características como aprobadas. Si el razonamiento es proporcional, indica «sin observación» y
> explica por qué.

El resultado se documenta mediante dos decisiones como mínimo:

```markdown
## Revisión del agente

- Observación aceptada: [qué detectó y cómo se corrigió].
- Observación rechazada: [qué propuso y por qué no corresponde al alcance o la evidencia].
```

Aceptar todo convertiría al agente en fuente de verdad. Rechazar todo eliminaría una segunda mirada
que puede detectar contradicciones. El criterio profesional consiste en revisar cada observación
contra archivos, comandos, alcance y reglas conocidas.

### 3.6 Cerrar con una conclusión proporcional

El artefacto termina con dos frases:

```markdown
## Conclusión provisional

Con la evidencia actual podemos afirmar que...

Todavía no podemos afirmar que...
```

Una conclusión adecuada podría ser:

> Con la evidencia actual podemos afirmar que el proyecto es reproducible bajo las condiciones
> declaradas y que `nota_final()` satisface cuatro casos de comportamiento, incluidos dos límites
> de redondeo. Todavía no podemos afirmar que el producto cubra todas las entradas, mantenga su
> desempeño bajo carga, interactúe correctamente con usuarios o proteja calificaciones.

La palabra «provisional» es importante: una auditoría representa el estado de la evidencia en un
momento. Cuando aparezcan nuevos requisitos, pruebas o mediciones, la conclusión debe actualizarse.

## Punto de control

El bloque está completo cuando cada estudiante puede mostrar:

- `auditoria-calidad.md` con un alcance explícito;
- siete evidencias identificadas y trazables;
- tres características analizadas con estado justificado;
- una observación del agente aceptada y otra rechazada con fundamento;
- y una conclusión que distinga lo demostrado de lo que todavía permanece abierto.

## Preguntas guía

1. **¿Por qué «POR DEFINIR» es distinto de «AUSENTE»?**
   **Pista:** distingue entre no tener una prueba para un criterio conocido y no conocer todavía el
   criterio correcto.
2. **¿Cuándo podemos marcar una evidencia como DIRECTA sin declarar aprobada toda la característica?**
   **Pista:** reduce la afirmación a un criterio específico y revisa si el artefacto realmente lo
   observa.
3. **¿Qué aporta una revisión adversarial del agente si el equipo ya completó la auditoría?**
   **Pista:** busca contradicciones, asociaciones débiles y conclusiones más amplias que los archivos
   o comandos citados.

## Cierre del bloque

- **Idea clave:** auditar no consiste en llenar nueve casillas, sino en vincular cada conclusión con
  un alcance, un criterio y una evidencia que otra persona pueda revisar.
- **Evidencia producida:** un `auditoria-calidad.md` inicial con inventario, tres hallazgos, revisión
  adversarial y conclusión provisional.
- **Puente:** la auditoría hizo visibles varios vacíos. En el Bloque 4 seleccionaremos los más
  relevantes y los convertiremos en criterios verificables, sin permitir que el agente invente las
  reglas o los umbrales del producto.

### Fuentes técnicas del bloque

- [ISO/IEC 25010:2023 — modelo de calidad del producto](https://www.iso.org/standard/78176.html)
- [pytest — uso y selección de pruebas](https://docs.pytest.org/en/stable/how-to/usage.html)
- Clase 02 — proyecto y evidencia técnica inicial.

---

# BLOQUE 4: De un vacío a un criterio verificable

- **Duración:** 25 minutos
- **Objetivo del bloque:** priorizar riesgos descubiertos en la auditoría y convertir necesidades
  explícitas en criterios de calidad trazables y verificables. Al finalizar, cada estudiante debe
  completar una ficha con tres objetivos de calidad, justificar su prioridad y decidir qué
  propuestas del agente acepta, modifica, posterga o rechaza.
- **Modalidad:** especificación guiada, trabajo individual y autorrevisión mediante criterios
  explícitos.
- **Ritmo sugerido:** 4 minutos para leer el brief y priorizar, 6 para redactar criterios, 5 para
  solicitar alternativas al agente, 6 para auditarlas y 4 para completar y revisar la ficha final.

## Desarrollo

### 4.1 Un vacío no se convierte solo en requisito

La auditoría dejó preguntas abiertas, pero todavía no conocemos automáticamente sus respuestas. El
equipo técnico puede detectar que `[]` no está cubierto; no puede decidir por cuenta propia si debe
devolver `0.0`, `None` o un error.

El siguiente brief acotado funciona como fuente de verdad para la iteración:

```text
BRIEF DEL PRODUCTO · ITERACIÓN 1

1. La función se utilizará localmente para calcular el promedio de un curso.
2. Recibirá entre 1 y 60 notas numéricas, cada una dentro del rango 1.0 a 7.0.
3. El resultado tendrá un decimal y utilizará ROUND_HALF_UP.
4. Una lista vacía o una nota fuera del rango debe producir un ValueError controlado.
5. El mensaje debe indicar qué condición no se cumplió.
6. Esta iteración no incluye interfaz, archivos, red, usuarios, permisos ni persistencia.
7. Cada cambio en la regla debe conservar Ruff, Pyrefly y pytest en verde y quedar expresado por
   una prueba descriptiva.
```

Estas decisiones actualizan el alcance de la auditoría. Ahora podemos transformar algunos estados
**POR DEFINIR** en criterios concretos. Otros temas —como integración, autenticación o experiencia
de una interfaz— permanecen fuera de esta iteración y no deben aparecer disfrazados como requisitos
actuales.

#### Priorizar sin fingir precisión matemática

Cada estudiante selecciona tres riesgos mediante estas preguntas:

1. ¿El brief confirma que esta propiedad forma parte de la iteración?
2. ¿Qué consecuencia tendría incumplirla para el cálculo o para quien lo utiliza?
3. ¿La evidencia actual permite detectarla o existe un vacío relevante?

Para este producto, adecuación funcional y fiabilidad deberían aparecer entre las prioridades: el
brief define valores válidos y exige errores controlados. Mantenibilidad también resulta pertinente
porque el brief establece una condición explícita para futuros cambios. No es obligatorio priorizar
seguridad o compatibilidad cuando la iteración excluye identidades, persistencia e integración.

Priorizar significa dirigir primero la evidencia hacia los riesgos actuales. No significa afirmar
que las demás características carecen de valor para siempre.

### 4.2 Anatomía de un criterio verificable

Un criterio útil debe indicar suficiente contexto para que otra persona pueda decidir si se
cumplió:

```text
Identificador
    +
Característica y fuente
    +
Condición o entrada
    +
Comportamiento esperado
    +
Evidencia planificada
```

Comparamos una frase vaga con una especificación comprobable:

```text
VAGO
«La función debe ser confiable».

VERIFICABLE
QR-01 · Fiabilidad · Brief, reglas 2, 4 y 5
Dada una lista vacía, al ejecutar nota_final([]),
se debe producir ValueError con un mensaje que indique
que se requiere al menos una nota.
Evidencia planificada: prueba automatizada con pytest.
```

El criterio no describe todavía cómo implementar la validación. Separa la expectativa de la
solución técnica y permite evaluar distintas implementaciones con la misma prueba.

#### Tres criterios de referencia

Estos ejemplos permiten calibrar la redacción; cada criterio elaborado debe relacionarse con los
hallazgos propios:

```text
QF-01 · Adecuación funcional · Brief, reglas 2 y 3
Dada una lista de 1 a 60 notas dentro del rango 1.0 a 7.0,
nota_final() debe devolver el promedio con un decimal y ROUND_HALF_UP.
Evidencia: pruebas de particiones, límites y redondeo con pytest.
```

```text
QR-02 · Fiabilidad · Brief, reglas 2, 4 y 5
Dada una lista que contiene al menos una nota menor que 1.0 o mayor que 7.0,
nota_final() debe producir ValueError e identificar el rango permitido.
Evidencia: pruebas automatizadas para el límite inferior y superior.
```

```text
QM-01 · Mantenibilidad · Brief, regla 7
Todo cambio en la regla de cálculo debe incluir o actualizar una prueba descriptiva
y conservar en verde Ruff, Pyrefly y la suite completa de pytest.
Evidencia: diff del cambio y registro de los tres controles.
```

QF-01 todavía es amplio para una sola prueba. Su evidencia planificada exige varios casos. Un
criterio puede necesitar más de una evidencia; lo importante es que cada una contribuya a una
afirmación explícita.

### 4.3 Pedir alternativas al agente sin entregarle las decisiones

Cada estudiante comparte con el agente solo el brief, sus tres riesgos priorizados y el formato de
criterio. La solicitud restringe la tarea:

> A partir exclusivamente del brief, propón dos criterios candidatos para cada riesgo priorizado.
> Para cada uno incluye identificador, característica ISO/IEC 25010:2023, reglas del brief que lo
> originan, condición, comportamiento esperado y evidencia planificada. No inventes umbrales,
> interfaces ni responsabilidades fuera de alcance. Si una expectativa no puede derivarse del
> brief, marca «requiere decisión».

El agente puede ayudar a producir alternativas y detectar combinaciones que el equipo omitió. No
puede decidir que `0.0` sea una respuesta válida, ampliar el rango de notas ni agregar autenticación
porque «sería una buena práctica».

Una respuesta extensa tampoco es automáticamente mejor. El estudiante debe buscar criterios que cubran
un riesgo diferente, no variaciones superficiales de la misma frase.

### 4.4 Auditar: aceptar, modificar, postergar o rechazar

Cada criterio candidato recibe una decisión:

- **Aceptar:** se deriva del brief, es observable y propone una evidencia coherente.
- **Modificar:** el riesgo es válido, pero falta precisión o la evidencia no observa realmente el
  comportamiento.
- **Postergar:** descubre una decisión legítima que no está definida o pertenece a otra iteración.
- **Rechazar:** inventa una regla, contradice el alcance, repite otro criterio o no explica qué
  riesgo cubre.

Antes de aceptar, se aplican cinco controles:

1. **Trazabilidad:** ¿qué regla del brief origina el criterio?
2. **Observabilidad:** ¿podemos distinguir un resultado aprobado de uno rechazado?
3. **Condiciones:** ¿la entrada, contexto o estado relevante están explícitos?
4. **Evidencia:** ¿la prueba o revisión propuesta observa la propiedad declarada?
5. **Alcance:** ¿evita agregar decisiones o responsabilidades no solicitadas?

Ejemplos de auditoría:

- «El promedio debe calcularse correctamente»: **modificar**, porque no declara entradas, regla de
  redondeo ni evidencia.
- «La lista vacía devuelve `0.0`»: **rechazar**, porque contradice la regla 4 del brief.
- «Solo un docente autenticado puede calcular»: **postergar**, porque autenticación está fuera de
  esta iteración.
- «Una nota `7.1` produce `ValueError` e informa el rango permitido»: **aceptar**, porque se deriva
  de las reglas 2, 4 y 5 y puede convertirse en una prueba concreta.

### 4.5 Completar la ficha de calidad priorizada

Cada estudiante agrega al final de `auditoria-calidad.md`:

```markdown
## Ficha de calidad priorizada

### [ID] · [Característica]

- Fuente: [reglas del brief].
- Riesgo:
- Condición:
- Comportamiento esperado:
- Evidencia planificada:
- Estado: [ACEPTADO | REQUIERE DECISIÓN].

## Decisiones sobre propuestas del agente

- Aceptada:
- Modificada:
- Postergada o rechazada:
```

La ficha debe contener tres criterios aceptados y al menos una propuesta modificada, postergada o
rechazada. Una segunda lectura individual utiliza estas preguntas de control:

- ¿puedo localizar la fuente de cada criterio?;
- ¿sé exactamente qué tendría que observar?;
- ¿la evidencia propuesta podría contradecir la afirmación si el producto falla?;
- ¿aparece alguna decisión que el brief nunca entregó?

Si una pregunta no puede responderse, el criterio vuelve a edición. El objetivo no es producir una
ficha perfecta, sino dejar requisitos más verificables que las opiniones iniciales.

## Punto de control

El bloque está completo cuando cada estudiante puede mostrar:

- tres riesgos priorizados mediante contexto, impacto y vacío de evidencia;
- tres criterios aceptados y trazables al brief;
- una evidencia planificada para cada criterio;
- decisiones justificadas sobre propuestas del agente;
- y una autorrevisión incorporada antes de cerrar la ficha.

## Preguntas guía

1. **¿Por qué detectar un riesgo no nos autoriza a decidir automáticamente el comportamiento correcto?**
   **Pista:** separa el hallazgo técnico de la fuente que define la necesidad o regla del producto.
2. **¿Qué diferencia a un criterio verificable de una recomendación general de calidad?**
   **Pista:** busca condición, comportamiento esperado, fuente y una evidencia capaz de aprobarlo o
   contradecirlo.
3. **¿Cuándo conviene postergar una propuesta del agente en vez de rechazarla?**
   **Pista:** distingue una idea incompatible con el alcance de una pregunta válida que todavía
   necesita una decisión autorizada.

## Cierre del bloque

- **Idea clave:** la calidad comienza a ser verificable cuando una necesidad autorizada se convierte
  en un criterio observable y una evidencia planificada.
- **Evidencia producida:** una ficha con tres objetivos de calidad priorizados, trazabilidad al brief,
  evidencia planificada y decisiones auditadas sobre las propuestas del agente.
- **Puente:** contamos con un modelo, una auditoría y criterios verificables. El cierre de la clase
  reunirá esas piezas y distinguirá el siguiente problema profesional: comprobar que construimos de
  acuerdo con la especificación y confirmar que esa especificación representa la necesidad correcta.

### Fuentes técnicas del bloque

- [ISO/IEC 25010:2023 — modelo de calidad del producto](https://www.iso.org/standard/78176.html)
- Clase 02 — pruebas como expectativas ejecutables.

---

# CIERRE DE LA CLASE: De «funciona» a «esto podemos demostrar»

- **Duración:** 10 minutos
- **Propósito:** reunir el modelo de calidad, la auditoría y los criterios priorizados para formular
  una conclusión proporcional a la evidencia y preparar la distinción entre verificación y
  validación.

## 1. El recorrido de la sesión

La clase comenzó con cuatro pruebas en verde y una pregunta abierta. El recorrido completo fue:

```text
Resultado técnico
        ↓
Alcance de la evidencia
        ↓
Nueve características de calidad
        ↓
Riesgos y vacíos del producto
        ↓
Criterios trazables y verificables
        ↓
Conclusión proporcional
```

ISO/IEC 25010:2023 no reemplazó los controles de la Clase 02. Les dio contexto. Ahora podemos
explicar qué pregunta ayuda a responder cada evidencia y qué dimensiones todavía requieren reglas,
pruebas, mediciones o revisión.

## 2. Evidencia mínima de salida

Como evidencia de salida, cada estudiante conserva en su proyecto:

- `auditoria-calidad.md` con alcance y decisiones fuera de alcance;
- el inventario `E1` a `E7`;
- tres hallazgos vinculados a características de ISO/IEC 25010:2023;
- una observación del agente aceptada y otra rechazada;
- tres criterios priorizados y trazables al brief;
- y una conclusión provisional que diferencie lo demostrado de lo pendiente.

El archivo no certifica la calidad del producto. Documenta qué observamos, qué decidimos y qué
evidencia tendría que producirse a continuación.

## 3. Lo que podemos afirmar hoy

Una conclusión compartida y proporcional es:

> El proyecto puede reconstruirse bajo las condiciones declaradas y `nota_final()` satisface los
> cuatro ejemplos ejecutados. La auditoría identificó evidencia funcional y señales parciales de
> mantenibilidad, además de vacíos y decisiones pendientes en otras características. El brief de la
> iteración permitió priorizar criterios funcionales, de fiabilidad y mantenibilidad, pero esos
> nuevos criterios todavía necesitan implementarse y verificarse.

También dejamos explícito lo que no podemos afirmar:

- que las nueve características estén aprobadas;
- que el producto cubra cualquier entrada o contexto imaginable;
- que una salida verde de una herramienta certifique la calidad completa;
- o que los criterios propuestos por un agente sean correctos sin trazabilidad y revisión humana.

## 4. Ticket de salida

Cada estudiante completa estas cuatro frases en una línea:

1. **Una prueba en verde demuestra…**
2. **Una característica de ISO/IEC 25010 me ayuda a preguntar…**
3. **Marcamos un hallazgo como POR DEFINIR cuando…**
4. **Un criterio se vuelve verificable cuando…**

Las respuestas deben conservar el vocabulario central de la clase: alcance, contexto, riesgo,
criterio y evidencia.

## 5. Próxima clase: verificar y validar no son lo mismo

La ficha final abre dos preguntas diferentes:

```text
VERIFICACIÓN
¿El producto fue construido de acuerdo con los criterios especificados?

VALIDACIÓN
¿Esos criterios y el producto resultante responden a la necesidad real?
```

En la próxima sesión estudiaremos esta distinción mediante casos donde un sistema cumplió su
especificación y aun así produjo un resultado inaceptable, o donde una implementación defectuosa no
cumplió lo que se había definido correctamente.

Los criterios creados hoy servirán como puente: podremos preguntar tanto si fueron implementados de
manera correcta como si eran las expectativas correctas para el producto.

## Mensaje final

> La calidad no aparece cuando reunimos más adjetivos. Aparece cuando una necesidad se convierte en
> un criterio, el criterio se confronta con evidencia y la conclusión respeta lo que esa evidencia
> realmente permite demostrar.

### Fuentes técnicas del cierre

- [ISO/IEC 25010:2023 — modelo de calidad del producto](https://www.iso.org/standard/78176.html)
- Continuidad del módulo — verificación, validación y evidencia.

---
