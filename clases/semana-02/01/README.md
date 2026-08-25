# Clase 04 - Semana 02 - Verificación y validación: construir bien y construir lo correcto

- **Unidad:** 01 · Calidad y Testing de Software
- **Fecha:** Martes 25 de agosto de 2026
- **Duración:** 3 horas pedagógicas · 140 minutos (08:30 - 10:50)
- **Modalidad:** Presencial en Laboratorio PC
- **Docente:** Diego Obando
- **Marco de referencia:** ISO/IEC/IEEE 12207:2017 · procesos de verificación y validación

---

# Objetivos de la Clase

## Objetivo General

Al finalizar esta sesión, el estudiante será capaz de distinguir verificación de validación y de
aplicar ambas preguntas sobre un producto real, determinando en cada caso quién define la fuente de
verdad y qué evidencia permite responderla. Para ello, retomará los criterios de calidad formulados
en la clase anterior, analizará casos documentados en los que un sistema cumplió aquello que se le
había especificado y aun así produjo un resultado inaceptable, y construirá una trazabilidad
explícita entre necesidad, criterio, evidencia de verificación y evidencia de validación.

## Objetivos Específicos

1. **Distinguir verificación y validación como dos preguntas con fuentes de verdad distintas**,
   explicando que la primera se responde contra la especificación y la segunda contra la necesidad
   real del producto, y que ninguna de las dos sustituye a la otra.
2. **Delimitar el alcance de una suite de pruebas en verde**, identificando qué afirmaciones
   respalda y cuáles quedan fuera de su alcance, dado que una prueba solo puede ser tan correcta
   como la especificación desde la cual fue escrita.
3. **Diagnosticar casos documentados de falla de software**, clasificando en Ariane 5, Knight
   Capital y Therac-25 qué se verificó efectivamente, qué supuesto nunca se validó y en qué punto
   dejó de haber correspondencia entre lo probado y lo que estaba en operación.
4. **Construir una trazabilidad entre necesidad, criterio y evidencia** sobre el proyecto propio,
   detectando criterios sin fuente autorizada que los respalde y necesidades declaradas que
   todavía no tienen criterio ni evidencia asociada.
5. **Demostrar mediante un caso propio que una implementación puede aprobar todas sus pruebas y
   aun así entregar un resultado inaceptable** frente a la regla del producto, y fundamentar por
   qué ese hallazgo corresponde a la validación y no a un defecto de implementación.
6. **Auditar la clasificación de criterios propuesta por un agente de IA**, identificando en qué
   punto asume una fuente de verdad que nadie autorizó y qué decisión sigue dependiendo de una
   persona responsable del producto.

## Competencias Transversales

- **Rigor en el alcance de las afirmaciones:** sostener conclusiones proporcionales a la evidencia
  disponible y explicitar el supuesto sobre el que descansa cada resultado técnico.
- **Análisis de causa:** reconstruir una falla hasta la decisión, el supuesto o el contexto que la
  hizo posible, en lugar de detenerse en la línea de código que la manifestó.
- **Trazabilidad y comunicación técnica:** vincular cada criterio con su origen y con la evidencia
  que lo comprobaría, de modo que otra persona pueda revisar el razonamiento completo.
- **Criterio frente a la automatización:** usar un agente para ordenar y ampliar el análisis sin
  cederle la definición de la necesidad ni la autoridad sobre las reglas del producto.

---

# Mapa de la Clase

| Horario | Sección | Propósito |
|---------|---------|-----------|
| 08:30 - 08:40 | Encuadre | Retomar los tres criterios verificables definidos en la clase anterior y separar la pregunta que la evidencia actual sí responde de la que todavía no responde nadie. |
| 08:40 - 09:10 | Bloque 1 | Establecer la distinción entre verificación y validación, identificar la fuente de verdad de cada pregunta y explicar por qué una suite completa en verde deja la segunda pendiente. |
| 09:10 - 09:35 | Bloque 2 | Diagnosticar Ariane 5, Knight Capital y Therac-25 con una misma matriz: qué se verificó, qué supuesto no se validó y qué evidencia habría cambiado el desenlace. |
| 09:35 - 09:45 | Pausa | Descanso técnico. |
| 09:45 - 10:15 | Bloque 3 | Aplicar ambas preguntas al proyecto propio: construir la trazabilidad necesidad-criterio-evidencia y encontrar un caso que apruebe las pruebas y aun así incumpla la regla del producto. |
| 10:15 - 10:40 | Bloque 4 | Contrastar la clasificación propia con la de un agente, auditar dónde inventa la fuente de verdad y consolidar las decisiones en una ficha de verificación y validación. |
| 10:40 - 10:50 | Cierre | Formular qué quedó verificado, qué quedó validado y qué sigue sin respaldo, y conectar el resultado con la comparación entre software probado y software sin pruebas. |

---

# BLOQUE 1: Dos preguntas que no se responden con la misma evidencia

- **Duración:** 30 minutos
- **Objetivo del bloque:** distinguir verificación de validación como dos preguntas con fuentes de
  verdad distintas. Al finalizar, el estudiante debe poder explicar por qué una prueba en verde
  responde la primera y deja intacta la segunda, y reconocer que una prueba solo puede ser tan
  correcta como la expectativa desde la cual fue escrita.
- **Modalidad:** expositiva y conversada, con un ejercicio individual de clasificación sobre la
  evidencia producida en la clase anterior.
- **Ritmo sugerido:** 5 minutos para retomar los criterios priorizados, 8 para instalar la
  distinción y sus fuentes de verdad, 7 para el caso de la prueba que certifica un error, 7 para la
  matriz de los cuatro escenarios y 3 para sintetizar.

## Desarrollo

### 1.1 Los criterios ya existen; falta preguntar de dónde salieron

La clase anterior terminó con tres criterios de calidad priorizados, cada uno con su evidencia
planificada y su vínculo con el brief de la iteración. Ese trabajo dejó el producto en una posición
mejor que la de la primera semana: ya no discutimos si el software «se ve bien», discutimos
condiciones observables.

Pero un criterio bien redactado admite todavía dos preguntas muy distintas, y solemos hacer solo
una:

```text
¿Implementamos el criterio tal como quedó definido?
¿Era ese el criterio correcto para este producto?
```

La primera pregunta se puede responder con las herramientas que ya usamos. La segunda no aparece en
ninguna salida de consola. Un producto puede pasar todos sus controles y seguir siendo inadecuado,
simplemente porque la expectativa contra la que lo comparamos no era la que correspondía.

Esas dos preguntas tienen nombre en la ingeniería de software, y no son intercambiables.

### 1.2 Verificación y validación: la fuente de verdad cambia

La formulación clásica se atribuye a Barry Boehm y sigue siendo la más clara:

> **Verificación:** ¿estamos construyendo bien el producto?
> **Validación:** ¿estamos construyendo el producto correcto?

La norma ISO/IEC/IEEE 12207:2017 las define como dos procesos separados del ciclo de vida:
verificar es confirmar que se cumplen los requisitos especificados; validar es confirmar que se
cumplen los requisitos para el uso previsto en el contexto real. La diferencia decisiva no está en
la técnica, sino en **contra qué se compara el resultado**.

| | Verificación | Validación |
|---|---|---|
| **Pregunta** | ¿El producto cumple lo especificado? | ¿Lo especificado responde a la necesidad? |
| **Fuente de verdad** | La especificación, el criterio, el contrato de la función | La necesidad real, la regla del negocio, la persona o norma que la autoriza |
| **Quién puede responderla** | El equipo técnico, con evidencia reproducible | Quien tiene autoridad sobre el producto: usuario, docente, reglamento, cliente |
| **Evidencia típica** | Pruebas automatizadas, análisis estático, revisión contra el criterio | Confrontación con el reglamento, uso real, revisión con la parte interesada |
| **Error que detecta** | La implementación no corresponde a lo definido | Lo definido no corresponde a lo que el producto debía lograr |

Conviene fijar una consecuencia incómoda: **la verificación es interna al proyecto y la validación
no lo es**. Podemos verificar solos, encerrados en el laboratorio, con el computador apagado del
resto del mundo. No podemos validar solos, porque la necesidad vive fuera del código y alguien
tiene que declararla.

### 1.3 Una prueba en verde puede certificar un error

En la Clase 02 escribimos pruebas sobre `nota_final()` y corregimos el defecto de redondeo hasta
dejar la suite en verde: la implementación calculaba mal y la prueba lo demostró. Ese ejercicio fue
verificación en estado puro, y funcionó exactamente como debía.

Miremos ahora otra prueba sobre la misma función, escrita con la misma disciplina:

```python
def test_promedio_de_tres_evaluaciones():
    assert nota_final([3.5, 3.5, 4.8]) == 3.9
```

La prueba es legible, tiene un nombre descriptivo, documenta un comportamiento y pasa. La
implementación la satisface. El linter no tiene nada que decir y el verificador de tipos tampoco.
Toda la maquinaria técnica está conforme.

La pregunta que ninguna de esas herramientas hace es: **¿quién autorizó que las tres evaluaciones
pesaran lo mismo?** La función calcula un promedio simple porque así se escribió, no porque alguien
lo haya decidido. Si el reglamento de evaluación establece una ponderación de 30 %, 30 % y 40 %,
esas mismas notas dan 4,0 y el estudiante aprueba, mientras nuestro sistema entrega 3,9 y lo
reprueba. La prueba en verde no protege de eso: lo deja fijo.

```text
Prueba en verde  →  la implementación corresponde a la expectativa escrita
                 →  NO dice nada sobre si la expectativa era correcta
```

Ese es el punto central del bloque: **una prueba es una especificación ejecutable**. Hereda todo lo
bueno y todo lo equivocado de la expectativa que la originó. Cuando la expectativa es incorrecta,
la suite en verde no protege el producto: lo blinda en su error y hace más costoso descubrirlo,
porque cualquier intento de corregirlo aparece como una prueba que se rompe.

Por eso un hallazgo de este tipo no se registra como defecto de implementación. Se registra como un
criterio que nunca fue validado contra su fuente.

### 1.4 Los cuatro escenarios posibles

Cruzar ambas preguntas produce cuatro situaciones distintas, y solo una de ellas es aceptable:

```text
                     VALIDACIÓN: el criterio era el correcto
                              SÍ                    NO
                    ┌──────────────────────┬──────────────────────┐
VERIFICACIÓN:   SÍ  │  Producto adecuado   │  Error correcto      │
el producto         │  y demostrable       │  ejecutado con       │
cumple el           │                      │  precisión           │
criterio        ────┼──────────────────────┼──────────────────────┤
                NO  │  Defecto clásico:    │  Doble fallo: nadie  │
                    │  se sabía qué hacer  │  definió bien y      │
                    │  y se hizo mal       │  nadie lo comprobó   │
                    └──────────────────────┴──────────────────────┘
```

Cada cuadrante se detecta de forma diferente:

1. **Verificado y validado.** El producto cumple un criterio que además responde a la necesidad.
   Es el único caso en que una conclusión positiva es proporcional a la evidencia.
2. **Verificado pero no validado.** El caso de la ponderación anterior. Las herramientas están todas en
   verde; el hallazgo aparece cuando alguien confronta el criterio con el reglamento, no cuando
   ejecuta la suite. Es el cuadrante más peligroso, porque **se parece al éxito**.
3. **Validado pero no verificado.** El criterio era el correcto y la implementación no lo cumple.
   Es el defecto que ya sabemos perseguir: una prueba bien escrita lo expone.
4. **Ni verificado ni validado.** El producto hace algo que nadie definió y que nadie comprobó.
   Suele ser el estado real de las funcionalidades agregadas «rápido» y sin criterio escrito.

La lección profesional es que aumentar la cantidad de pruebas mueve el producto en un solo eje. Un
equipo puede subir su cobertura durante semanas sin acercarse un milímetro al eje vertical.

### 1.5 Ejercicio individual: asignar la pregunta correcta

Cada estudiante clasifica las siguientes situaciones según la pregunta que las detectaría:
**VER** si la detecta la verificación, **VAL** si la detecta la validación, **AMBAS** si requiere
las dos.

1. La función devuelve `4.0` donde el criterio escrito exige `3.9`.
2. La regla de ponderación la definió el equipo de desarrollo sin consultar el reglamento.
3. Una prueba compara un promedio con `==` entre números decimales y aprueba por casualidad.
4. El producto calcula bien la nota, pero el docente necesitaba además el detalle de cada
   evaluación para justificarla.
5. El proyecto declara una dependencia que el archivo de bloqueo no registra.
6. La herramienta acepta notas mayores a 7,0 porque nadie escribió el rango permitido.

La justificación de al menos dos casos debe completar esta estructura:

> Corresponde a ______ porque el resultado se compara contra ______, y quien puede declarar que es
> correcto es ______.

Una lectura razonada debería reconocer que los casos 1, 3 y 5 se resuelven contrastando el producto
con lo que ya está especificado; que los casos 2 y 4 exigen una fuente externa al equipo técnico; y
que el caso 6 pertenece a los dos ejes a la vez, porque falta el criterio y además falta la
comprobación.

## Punto de control

El bloque está completo cuando cada estudiante puede:

- enunciar ambas preguntas y nombrar la fuente de verdad de cada una;
- explicar por qué una suite completa en verde no valida el criterio que la originó;
- ubicar un hallazgo propio en uno de los cuatro cuadrantes y justificar la ubicación;
- y distinguir un defecto de implementación de un criterio nunca autorizado.

## Preguntas guía

1. **¿Por qué la verificación puede hacerse dentro del equipo y la validación no?**
   **Pista:** piensa dónde vive la especificación y dónde vive la necesidad.
2. **Si una prueba en verde puede estar equivocada, ¿qué la vuelve confiable?**
   **Pista:** no la herramienta que la ejecuta, sino el origen de la expectativa que afirma.
3. **¿Qué tendría que ocurrir para que corregir un error resulte más caro por tener pruebas?**
   **Pista:** considera qué pasa cuando la suite entera fija una regla que nunca fue autorizada.
4. **¿Por qué el cuadrante «verificado pero no validado» es el más difícil de detectar?**
   **Pista:** revisa qué señales entrega el proyecto en ese estado y a qué se parecen.

## Cierre del bloque

- **Idea clave:** verificar es comparar el producto con lo que se especificó; validar es comparar lo
  especificado con lo que el producto realmente necesitaba lograr. La segunda comparación nunca la
  entrega una herramienta.
- **Evidencia producida:** la clasificación individual de seis situaciones según la pregunta que las
  detecta, con dos justificaciones que identifican la fuente de verdad correspondiente.
- **Puente:** la distinción ya está instalada en un producto pequeño y controlado. El bloque
  siguiente la lleva a sistemas donde la respuesta equivocada costó vidas, cohetes y empresas
  completas, para comprobar que en cada caso la pregunta que faltaba puede señalarse con precisión.

### Fuentes técnicas del bloque

- [ISO/IEC/IEEE 12207:2017 — procesos de verificación y validación del ciclo de vida](https://www.iso.org/standard/63712.html)
- Boehm, B. (1979 · 1981). *Guidelines for Verifying and Validating Software Requirements* y
  *Software Engineering Economics* — origen y difusión de la formulación de ambas preguntas.
- Clase 02 — la prueba como expectativa ejecutable.
- Clase 03 — criterios verificables y trazabilidad al brief.

---

# BLOQUE 2: Tres desastres, tres preguntas que faltaron

- **Duración:** 25 minutos
- **Objetivo del bloque:** aplicar la distinción del bloque anterior a sistemas reales, usando una
  misma matriz de diagnóstico. Al finalizar, el estudiante debe poder señalar en cada caso qué se
  verificó efectivamente, qué supuesto nunca se validó y qué evidencia concreta habría cambiado el
  desenlace.
- **Modalidad:** análisis guiado de casos documentados, con clasificación individual en la matriz.
- **Ritmo sugerido:** 4 minutos para instalar la matriz, 6 por cada caso y 3 para la síntesis
  comparada.

## Desarrollo

### 2.1 Una misma matriz para leer cualquier falla

Estos tres casos ya aparecieron en la primera clase para mostrar la distancia entre un defecto y
una falla. Ahora los volvemos a mirar con otra herramienta: en cada uno hubo trabajo técnico serio,
gente competente y pruebas realizadas. Lo que faltó fue una pregunta específica, y esa pregunta se
puede nombrar.

Cada caso se analiza con las mismas cinco columnas:

```text
1. Qué se especificó
2. Qué se verificó de verdad
3. Qué supuesto nunca se validó
4. Dónde se rompió la correspondencia
5. Qué evidencia lo habría revelado antes
```

La columna 4 introduce un matiz que el bloque anterior no cubría. No basta con verificar y validar:
hay que asegurar que **lo que se verificó sea lo mismo que está operando**. Cuando el artefacto
probado y el artefacto en producción dejan de ser el mismo, toda la evidencia acumulada deja de
aplicar.

### 2.2 Ariane 5, vuelo 501: la verificación fue correcta para otro cohete

El 4 de junio de 1996 el sistema de referencia inercial falló a los 37 segundos del despegue y el
cohete se destruyó a los 39. Ese sistema ejecutaba una conversión de un número decimal de 64 bits a un entero con signo
de 16 bits que se desbordó, y el resultado erróneo fue interpretado por la computadora de vuelo
como dato de trayectoria.

Los detalles que importan para nuestra matriz:

- el módulo provenía del Ariane 4 y **cumplía su especificación**, verificada durante años de vuelos
  exitosos;
- la protección contra desborde se había omitido deliberadamente en esa variable, respaldada por un
  análisis que demostraba que el desborde era imposible: ese análisis usaba datos de trayectoria
  **del Ariane 4**;
- el cálculo que provocó el desborde correspondía a una función de alineamiento que ya no tenía
  utilidad operativa después del despegue, y seguía activa por una exigencia del cohete anterior;
- el sistema redundante falló primero y de forma idéntica, porque ejecutaba **el mismo software con
  los mismos datos**.

| Columna | Ariane 5 |
|---|---|
| Se especificó | El comportamiento del sistema inercial en el perfil de vuelo del Ariane 4 |
| Se verificó | Que la implementación cumpliera esa especificación |
| No se validó | Que el perfil de vuelo del Ariane 5 estuviera dentro de los supuestos heredados |
| Correspondencia | Intacta: el software probado era el que voló, en un vehículo distinto |
| Evidencia faltante | Una prueba de integración alimentada con la trayectoria real del Ariane 5 |

La redundancia no ayudó porque duplicaba el componente, no el supuesto. **Dos ejecuciones del mismo
error no son dos evidencias.**

### 2.3 Knight Capital: lo verificado no fue lo que se desplegó

El 1 de agosto de 2012, una firma de trading desplegó código nuevo en sus servidores de ejecución.
La actualización se copió manualmente y no llegó a uno de los ocho. En ese servidor un indicador
reutilizado activó código antiguo, inactivo desde hacía años, que ya no contaba con el control de
posiciones que se le había quitado tiempo atrás. En unos 45 minutos la empresa perdió alrededor de
440 millones de dólares y dejó de ser viable.

Los detalles que importan:

- el código nuevo pudo haber sido verificado de forma impecable: **eso es irrelevante para el
  servidor que no lo recibió**;
- el indicador reutilizado había cambiado de significado; la especificación vigente y la
  especificación del código antiguo eran incompatibles y convivían en el mismo sistema;
- durante la apertura del mercado el sistema emitió decenas de mensajes de error que mencionaban el
  componente antiguo, sin que existiera un mecanismo que los tratara como una alerta que detuviera
  la operación.

| Columna | Knight Capital |
|---|---|
| Se especificó | El comportamiento del nuevo componente de ejecución de órdenes |
| Se verificó | Ese componente, en un entorno donde sí estaba instalado |
| No se validó | Que reutilizar un indicador antiguo fuera seguro con código muerto todavía presente |
| Correspondencia | **Rota**: siete servidores ejecutaban lo verificado y uno ejecutaba otra cosa |
| Evidencia faltante | Una comprobación automática de que los ocho nodos ejecutan la misma versión |

Este caso muestra que el despliegue es parte del alcance de las pruebas. Una suite perfecta sobre
un artefacto que no está corriendo no demuestra absolutamente nada sobre el sistema real.

### 2.4 Therac-25: el criterio correcto nunca fue el que se programó

Entre 1985 y 1987, esta máquina de radioterapia provocó al menos seis sobredosis masivas
documentadas, con varias muertes. La causa inmediata más conocida fue una condición de carrera: si
el operador corregía la pantalla con suficiente rapidez, el equipo quedaba en un estado inconsistente
y aplicaba una dosis cientos de veces superior a la indicada.

Los detalles que importan:

- los modelos anteriores incluían **enclavamientos mecánicos** que impedían físicamente esa
  combinación; en el Therac-25 se eliminaron y la seguridad quedó delegada al software;
- ese software se consideró confiable porque venía de los modelos previos, donde **nunca había sido
  la única barrera**: el hardware había estado ocultando sus defectos durante años;
- el análisis de riesgos asignó al fallo de software una probabilidad arbitrariamente baja, sin
  evidencia que la respaldara;
- los mensajes de error eran códigos crípticos que aparecían con frecuencia, de modo que el
  operador aprendió a continuar la operación en lugar de detenerla.

| Columna | Therac-25 |
|---|---|
| Se especificó | Que el equipo aplicara la dosis indicada en pantalla |
| Se verificó | El comportamiento del software en las secuencias de uso previstas |
| No se validó | Que el software solo bastara como barrera de seguridad sin respaldo físico |
| Correspondencia | Intacta: operaba el software que se había probado |
| Evidencia faltante | Un análisis de riesgos del sistema completo y pruebas sobre secuencias de operación rápidas y no previstas |

El criterio programado era «aplicar lo que el operador indicó». El criterio necesario era «no
aplicar nunca una dosis capaz de dañar al paciente». La distancia entre ambos no es un error de
programación: es un criterio que nadie validó frente a la necesidad real.

### 2.5 Ejercicio individual: ubicar los tres casos

Cada estudiante completa dos tareas breves:

1. Ubicar los tres casos en la matriz de cuatro cuadrantes del bloque anterior y justificar cada
   ubicación en una línea.
2. Responder cuál de los tres se habría evitado agregando más pruebas unitarias al componente
   defectuoso, y explicar por qué.

La segunda pregunta admite una respuesta incómoda: en ninguno de los tres el problema estaba dentro
del componente aislado. Ariane 5 necesitaba una prueba de integración con datos reales del vehículo
nuevo, Knight Capital una comprobación de que todos los nodos ejecutaran la versión verificada, y
Therac-25 un análisis de riesgos del sistema completo, incluida la interacción con el operador.

Vale la pena hacer una comprobación adicional: al pedirle a un agente la causa de cualquiera de
estos accidentes, la respuesta suele detenerse en la línea técnica —el desborde, el indicador
reutilizado, la condición de carrera—, que es exactamente la parte que ya estaba verificada. El
supuesto que nadie validó rara vez aparece solo, porque no está escrito en el código.

## Punto de control

El bloque está completo cuando cada estudiante puede:

- explicar por qué el software del Ariane 5 era correcto y provocó igualmente la pérdida;
- señalar en qué momento exacto Knight Capital dejó de tener evidencia válida sobre su sistema;
- identificar cuál era el criterio necesario en Therac-25 y en qué se diferenciaba del programado;
- y nombrar, para un caso a elección, la evidencia concreta que faltaba.

## Preguntas guía

1. **¿Por qué la redundancia del Ariane 5 no funcionó como protección?**
   **Pista:** revisa qué se duplicó y qué no se duplicó.
2. **¿Qué hace que un despliegue parcial invalide la evidencia acumulada?**
   **Pista:** pregúntate sobre qué artefacto se ejecutaron las pruebas y cuál estaba operando.
3. **¿Qué significa que el hardware del Therac-20 estuviera «ocultando» defectos de software?**
   **Pista:** un defecto sin barrera que lo contenga no es un defecto nuevo, es uno que se vuelve
   visible.
4. **¿Qué tienen en común el código heredado del Ariane 5 y el código antiguo de Knight Capital?**
   **Pista:** ambos habían sido correctos bajo supuestos que ya no se cumplían.

## Cierre del bloque

- **Idea clave:** en los tres casos hubo trabajo técnico verificado. Lo que faltó fue confrontar un
  supuesto con la realidad del contexto nuevo, o asegurar que lo verificado fuera efectivamente lo
  que estaba operando.
- **Evidencia producida:** los tres casos ubicados en la matriz de cuadrantes, con una justificación
  por caso, y una respuesta fundamentada sobre el límite de las pruebas unitarias.
- **Puente:** ninguno de estos sistemas se parece al proyecto propio en tamaño, pero los tres
  comparten su estructura de error. El bloque siguiente busca esos mismos vacíos en el producto en
  el que trabajamos, con la ventaja de poder corregirlos.

### Fuentes técnicas del bloque

- [Informe de la comisión de investigación del vuelo Ariane 5 501 (Lions, 1996)](https://www-users.cse.umn.edu/~arnold/disasters/ariane5rep.html)
- [Orden administrativa de la SEC sobre Knight Capital (2013)](https://www.sec.gov/litigation/admin/2013/34-70694.pdf)
- Leveson, N. y Turner, C. (1993). *An Investigation of the Therac-25 Accidents*. IEEE Computer.

---

# BLOQUE 3: El mismo vacío, en nuestro propio proyecto

- **Duración:** 30 minutos
- **Objetivo del bloque:** construir la trazabilidad entre necesidad, criterio y evidencia sobre el
  proyecto propio, y demostrar con un caso concreto que la suite puede aprobar mientras el producto
  incumple la regla que debía respetar. Al finalizar, el estudiante debe tener identificado al menos
  un criterio sin fuente autorizada y registrado como hallazgo de validación.
- **Modalidad:** trabajo individual en el computador, con ejecución de comandos y registro escrito.
- **Ritmo sugerido:** 5 minutos para recuperar los criterios, 8 para construir la tabla, 5 para
  reconocer las dos patologías, 9 para el trabajo con código y 3 para registrar el hallazgo.

## Desarrollo

### 3.1 Preguntarle a nuestros criterios de dónde salieron

Los tres criterios priorizados de la clase anterior están redactados de forma observable. Esa era
la exigencia entonces. Ahora agregamos una segunda exigencia, más difícil de cumplir: cada criterio
debe poder nombrar **la fuente que lo autoriza**.

Para cada uno de los tres, se responde por escrito:

```text
¿Qué necesidad expresa este criterio?
¿Quién declaró esa necesidad?
¿Dónde está registrada esa declaración?
```

La tercera pregunta es la que suele quedar en blanco. Cuando el origen de un criterio es «lo
decidimos nosotros porque parecía razonable», el criterio no está mal: está **sin validar**, que es
un estado distinto y perfectamente legítimo mientras quede registrado como tal.

### 3.2 La tabla de trazabilidad

La trazabilidad conecta cada necesidad con las dos evidencias que le corresponden. Para el producto
de cálculo de calificaciones, una fila completa se ve así:

| Necesidad | Fuente | Criterio observable | Evidencia de verificación | Evidencia de validación | Estado |
|---|---|---|---|---|---|
| La calificación final refleja el rendimiento según la regla vigente | Reglamento de evaluación | El promedio se calcula con la ponderación que declara el reglamento | Prueba automatizada sobre casos que cruzan el umbral de aprobación | Confrontación del criterio con el texto del reglamento | POR VALIDAR |
| Una entrada inválida no produce una calificación engañosa | Brief de la iteración | Ante una lista vacía, la función informa el error en lugar de devolver un número | Prueba que espera el error declarado | Confirmación de que informar el error es el comportamiento esperado por quien usa la herramienta | VERIFICADO |

Las dos columnas de evidencia no son intercambiables ni se cubren entre sí:

- la **evidencia de verificación** es reproducible por el equipo y vive dentro del proyecto;
- la **evidencia de validación** es una confrontación con algo externo: un documento, una norma o
  una persona con autoridad sobre el producto.

Cuando la columna de validación queda vacía, el criterio no deja de ser útil. Deja de ser una
conclusión y pasa a ser una hipótesis de trabajo, y el proyecto debe mostrarlo.

### 3.3 Dos patologías que la tabla deja a la vista

Al completar las filas aparecen dos problemas de forma recurrente:

1. **Criterio huérfano:** existe el criterio, existe la prueba, no existe la fuente. Es el caso de
   Therac-25 en miniatura: se programó y se verificó un criterio que nadie autorizó. Se marca
   `POR VALIDAR` y se registra la pregunta pendiente.
2. **Necesidad sin criterio:** la necesidad está declarada en el brief, pero ninguna fila la traduce
   en algo observable. No hay nada que verificar porque nunca se definió qué se esperaba. Se marca
   `SIN CRITERIO` y se registra qué falta decidir.

Ambos estados son hallazgos legítimos. Un proyecto profesional no es el que no los tiene, sino el
que puede mostrarlos con precisión en lugar de descubrirlos en producción.

### 3.4 El caso que aprueba las pruebas y aun así está mal

Trabajamos el criterio del promedio con casos que cruzan el umbral de aprobación, que es donde toda
regla de cálculo revela su definición real. La prueba se escribe con parametrización y con una
comparación tolerante entre decimales, no con igualdad exacta:

```python
import pytest

from notas import nota_final


@pytest.mark.parametrize(
    ("notas", "esperado"),
    [
        ([3.5, 3.5, 4.8], 3.9),
        ([4.5, 4.5, 3.0], 4.0),
        ([4.0, 4.0, 3.0], 3.7),
    ],
)
def test_promedio_segun_criterio_vigente(notas, esperado):
    assert nota_final(notas) == pytest.approx(esperado)
```

Se ejecuta como siempre:

```powershell
uv run pytest -q
```

Y sobre la implementación actual termina en verde:

```text
...                                                                      [100%]
3 passed
```

Ese resultado responde la pregunta de verificación y ninguna otra. El problema aparece al comparar
el criterio vigente —promedio simple— con una ponderación de 30 %, 30 % y 40 % sobre las mismas
notas:

| Notas de las tres evaluaciones | Promedio simple | Promedio ponderado 30-30-40 | Consecuencia |
|---|---|---|---|
| 3,5 · 3,5 · 4,8 | 3,9 | 4,0 | Reprueba con una regla y aprueba con la otra |
| 4,5 · 4,5 · 3,0 | 4,0 | 3,9 | Aprueba con una regla y reprueba con la otra |
| 4,0 · 4,0 · 3,0 | 3,7 | 3,6 | Las dos reglas coinciden en la decisión |

Las dos primeras filas deciden la aprobación de un estudiante, y ninguna prueba puede elegir entre
ellas: la elección pertenece al reglamento. La suite seguirá en verde mientras el criterio no
autorizado siga escrito ahí, y cualquier corrección aparecerá primero como una prueba que se rompe.

Cada estudiante repite este análisis en su propio proyecto:

1. elige uno de sus tres criterios;
2. escribe la prueba que lo verifica tal como está redactado;
3. construye la tabla de valores en el límite;
4. y formula la pregunta que ninguna prueba puede responder por sí sola.

### 3.5 Registrar el hallazgo con el vocabulario correcto

Un criterio sin fuente no se anota como defecto, porque el programa hace exactamente lo que se le
pidió. Se anota con esta estructura:

```text
Hallazgo de validación V-01
Criterio afectado: ..............................................
Fuente declarada: ninguna
Pregunta pendiente: ¿qué ponderación establece el reglamento vigente?
Quién puede responderla: ........................................
Riesgo si la respuesta es distinta: .............................
Estado: POR VALIDAR
```

La distinción entre `Hallazgo de validación` y `Defecto` no es burocrática. Cambia quién debe
actuar: un defecto se corrige en el código, un hallazgo de validación se resuelve consultando a
quien tiene autoridad sobre la regla. Confundirlos lleva a corregir código que no estaba mal, o a
esperar una decisión que nadie tiene que tomar.

## Punto de control

El bloque está completo cuando cada estudiante tiene:

- los tres criterios con su fuente identificada o explícitamente marcada como ausente;
- al menos dos filas completas de la tabla de trazabilidad;
- una prueba ejecutándose sobre uno de sus criterios, con casos que cruzan el umbral de decisión;
- y un hallazgo de validación registrado con su pregunta pendiente y su responsable posible.

## Preguntas guía

1. **¿Por qué un criterio sin fuente no es lo mismo que un criterio incorrecto?**
   **Pista:** uno puede estar bien y el otro puede estar mal; lo que falta en ambos casos es el
   respaldo que permita saberlo.
2. **¿Qué cambia cuando comparamos decimales con `==` en lugar de una comparación tolerante?**
   **Pista:** piensa en qué está afirmando realmente la prueba y con qué precisión.
3. **¿Por qué los valores en el límite revelan la definición real de una regla?**
   **Pista:** en el centro del rango casi cualquier implementación coincide.
4. **¿Qué haces si la fuente que debería validar un criterio no existe todavía?**
   **Pista:** registrar el estado y la pregunta es una respuesta profesional; inventar la regla no
   lo es.

## Cierre del bloque

- **Idea clave:** la trazabilidad convierte una lista de criterios en un mapa que muestra, para cada
  uno, si fue comprobado, si fue autorizado y qué falta para poder afirmarlo.
- **Evidencia producida:** la tabla de trazabilidad iniciada, una prueba sobre valores en el límite
  y al menos un hallazgo de validación registrado con su pregunta pendiente.
- **Puente:** este análisis se hizo con criterio propio y tomó tiempo. El bloque siguiente lo
  contrasta con la clasificación que propone un agente, para descubrir en qué punto una herramienta
  que ordena muy bien la información empieza a inventar la autoridad que no tiene.

### Fuentes técnicas del bloque

- [Documentación de `pytest.approx` — comparación tolerante entre decimales](https://docs.pytest.org/en/stable/reference/reference.html#pytest-approx)
- [Documentación de `@pytest.mark.parametrize`](https://docs.pytest.org/en/stable/how-to/parametrize.html)
- Clase 03 — criterios priorizados y evidencia planificada.

---

# BLOQUE 4: El agente clasifica bien y declara autoridad que no tiene

- **Duración:** 25 minutos
- **Objetivo del bloque:** contrastar la clasificación propia con la que produce un agente de IA y
  auditar sus propuestas. Al finalizar, el estudiante debe poder identificar el punto exacto en que
  el agente pasa de ordenar información a declarar una fuente de verdad que nadie autorizó, y dejar
  sus decisiones registradas en una ficha de verificación y validación.
- **Modalidad:** trabajo individual con un agente, seguido de auditoría escrita de cada propuesta.
- **Ritmo sugerido:** 6 minutos para preparar el contexto, 6 para contrastar la clasificación, 9
  para auditar las propuestas y 4 para consolidar la ficha.

## Desarrollo

### 4.1 Entregar contexto y límites antes de pedir la clasificación

Un agente clasifica mucho mejor cuando recibe el material real y las restricciones explícitas. La
petición incluye qué se entrega, qué se pide y, sobre todo, qué no está autorizado a decidir:

```text
Contexto: producto de cálculo de calificaciones. Te entrego tres criterios de calidad
y el brief de la iteración.

Tarea: clasifica cada criterio como VERIFICACIÓN o VALIDACIÓN e indica qué evidencia
permitiría responder la pregunta correspondiente.

Restricciones:
- Para cada criterio debes declarar la fuente que lo autoriza.
- Si esa fuente no aparece en el material entregado, escribe FUENTE NO DISPONIBLE.
- No propongas umbrales, rangos ni reglas que no estén en el material.
- No asumas normativas, convenciones del sector ni prácticas habituales.

Salida: una tabla con criterio, clasificación, fuente, evidencia sugerida.
```

Las tres restricciones del medio son las importantes. Sin ellas, el agente completa los espacios
vacíos, porque completar espacios vacíos es exactamente lo que hace bien.

### 4.2 Dónde ayuda y dónde deja de ser confiable

Con contexto suficiente, un agente resulta útil para:

- ordenar criterios dispersos en una estructura comparable;
- detectar criterios redactados sin condición observable;
- proponer preguntas de validación que el equipo no había formulado;
- y señalar necesidades del brief que ninguna fila del proyecto recoge.

Todo eso es trabajo de ordenamiento y ampliación, y ahí conviene aprovecharlo. El límite aparece en
una sola columna:

> Un agente puede ayudar a verificar contra una especificación disponible.
> No puede validar una necesidad, porque la validación exige una autoridad sobre el producto y esa
> autoridad no está en el texto que el modelo procesa.

Cuando le falta la fuente, el agente rara vez responde «no lo sé». Produce una frase con forma de
respaldo: «según la práctica habitual», «por convención en sistemas académicos», «de acuerdo con la
normativa vigente». Ninguna de esas expresiones nombra un documento, una versión ni una persona
responsable. Ese es el punto exacto en que hay que detenerse.

### 4.3 Auditoría de la propuesta

La siguiente tabla corresponde a una respuesta como las que produce un agente ante esta tarea. Cada
fila se audita marcándola como **ACEPTAR**, **REFORMULAR**, **POSPONER** o **RECHAZAR**, con una
línea de justificación:

| # | Criterio propuesto | Clasificación del agente | Fuente que declara |
|---|---|---|---|
| 1 | Las tres evaluaciones pesan lo mismo en el promedio | Verificación | Convención estándar en sistemas académicos |
| 2 | Ante una lista vacía, la función informa el error | Verificación | Contrato declarado de la función |
| 3 | El cálculo responde en menos de 200 ms | Verificación | Buenas prácticas de rendimiento |
| 4 | Las notas registradas están entre 1,0 y 7,0 | Validación | Escala de calificaciones vigente |

Una auditoría razonada debería reconocer que:

- la fila 2 se sostiene, porque la fuente está dentro del material entregado y es verificable;
- la fila 1 es un criterio huérfano disfrazado: la clasificación es correcta, pero la fuente
  declarada no existe como documento y debía haber sido `FUENTE NO DISPONIBLE`;
- la fila 3 introduce un umbral que nadie pidió; el número es inventado y, además, decidir cuánto
  puede demorar el cálculo es una pregunta de validación, no de verificación;
- la fila 4 apunta a una fuente externa que sí existe, pero sigue requiriendo confirmación de que
  aplica a este producto y en esta escala; corresponde reformularla nombrando el documento exacto.

El patrón que conviene retener: **el agente acierta con frecuencia en la clasificación y falla en la
columna de la fuente**. Clasificar es una tarea de estructura y ahí es fuerte; declarar autoridad es
una tarea de contexto institucional y ahí solo puede simular.

### 4.4 Consolidar la ficha de verificación y validación

Cada estudiante cierra el trabajo de la sesión en un documento propio, `verificacion-validacion.md`,
que contiene:

1. la tabla de trazabilidad con al menos tres filas;
2. la clasificación de cada criterio con su fuente, o la marca explícita de fuente ausente;
3. un hallazgo de validación registrado con su pregunta pendiente y su responsable posible;
4. una propuesta del agente aceptada y otra rechazada, cada una con su justificación;
5. y las preguntas que quedaron abiertas para quien tenga autoridad sobre el producto.

La ficha no cierra el tema. Deja constancia de qué se comprobó, qué se decidió y qué sigue
esperando una respuesta que el equipo técnico no puede darse a sí mismo.

## Punto de control

El bloque está completo cuando cada estudiante puede:

- redactar una petición que incluya restricciones sobre fuentes y umbrales;
- distinguir una fuente verificable de una frase con forma de respaldo;
- justificar por escrito una propuesta aceptada y una rechazada;
- y presentar su ficha con las cinco secciones completas.

## Preguntas guía

1. **¿Por qué detectar un criterio sin fuente no autoriza a inventarle una?**
   **Pista:** revisa quién tiene la potestad de declarar la regla del producto.
2. **¿Qué diferencia una fuente verificable de «según la práctica habitual»?**
   **Pista:** una se puede abrir, citar y fechar; la otra no se puede contradecir porque no dice
   nada concreto.
3. **¿Por qué un umbral inventado es más peligroso que una respuesta vacía?**
   **Pista:** un número específico se copia a la prueba y desde ahí se vuelve la especificación.
4. **¿En qué parte de este bloque el criterio humano fue insustituible?**
   **Pista:** compara la columna que el agente resolvió bien con la que tuviste que resolver tú.

## Cierre del bloque

- **Idea clave:** un agente ordena, amplía y clasifica; la autoridad sobre la necesidad sigue siendo
  humana. El riesgo no es que se equivoque de categoría, sino que rellene la fuente con una frase
  que suena a respaldo.
- **Evidencia producida:** la ficha `verificacion-validacion.md` con trazabilidad, clasificación,
  hallazgo registrado y auditoría de dos propuestas del agente.
- **Puente:** con la ficha en mano ya podemos afirmar algo acotado sobre el producto. El cierre reúne
  lo verificado, lo validado y lo pendiente en una sola conclusión proporcional a la evidencia.

### Fuentes técnicas del bloque

- Clase 02 — auditoría de casos propuestos por un agente.
- Clase 03 — decisiones aceptadas y rechazadas sobre observaciones automáticas.

---

# CIERRE DE LA CLASE: Qué está comprobado y qué está solo decidido

- **Duración:** 10 minutos
- **Propósito:** reunir la distinción, los casos y la ficha en una conclusión proporcional, y
  preparar la comparación entre software con pruebas y software sin ellas.

## 1. El recorrido de la sesión

La clase comenzó con tres criterios bien redactados y terminó sabiendo cuáles de ellos podemos
sostener. El recorrido fue:

```text
Criterios observables
        ↓
Dos preguntas con fuentes de verdad distintas
        ↓
Tres fallas históricas y la pregunta que faltó en cada una
        ↓
Trazabilidad necesidad - criterio - evidencia
        ↓
Hallazgos de validación registrados
        ↓
Conclusión proporcional
```

La verificación no perdió importancia en este recorrido. Cambió de estatus: dejó de ser la única
pregunta y pasó a ser una de dos, con la ventaja de que ahora sabemos cuál de las dos responde cada
herramienta que ejecutamos.

## 2. Evidencia mínima de salida

Como evidencia de salida, cada estudiante conserva en su proyecto:

- la ficha `verificacion-validacion.md` con sus cinco secciones;
- la tabla de trazabilidad con al menos tres filas y sus estados;
- una prueba parametrizada sobre casos que cruzan el umbral de decisión, ejecutándose;
- al menos un hallazgo de validación con su pregunta pendiente y su responsable posible;
- y la auditoría de dos propuestas del agente, con justificación escrita.

## 3. Lo que podemos afirmar hoy

Una conclusión compartida y proporcional es:

> El proyecto cumple los criterios que tiene escritos y esa correspondencia está demostrada con
> pruebas ejecutables. De esos criterios, algunos tienen una fuente que los autoriza y otros
> quedaron registrados como decisiones del equipo todavía sin validar. El producto, por lo tanto,
> está verificado en su alcance actual y validado solo parcialmente.

También queda explícito lo que no podemos afirmar:

- que los criterios escritos sean los correctos para el producto;
- que una suite en verde compense la ausencia de una fuente autorizada;
- que el comportamiento probado en nuestro computador sea el que estaría operando en otro contexto;
- ni que la clasificación de un agente reemplace la decisión de quien tiene autoridad sobre la regla.

## 4. Ticket de salida

Cada estudiante completa estas cuatro frases en una línea:

1. **Verificar es comparar el producto con…**
2. **Validar es comparar la especificación con…**
3. **Una prueba en verde puede estar equivocada cuando…**
4. **Marcamos un criterio como POR VALIDAR cuando…**

Las respuestas deben conservar el vocabulario de la clase: especificación, necesidad, fuente,
correspondencia y evidencia.

## 5. Próxima clase: software con pruebas y software sin pruebas

Hoy trabajamos sobre un producto pequeño y con criterios recién escritos. La próxima sesión amplía
la mirada a repositorios reales y ya maduros, para comparar qué diferencia observable existe entre
un proyecto que sostiene una suite de pruebas y uno que no la tiene: cobertura, historial de
defectos, ritmo de cambios y capacidad de modificar el código sin romperlo.

La pregunta que llevaremos: si las pruebas no garantizan que los criterios sean correctos, ¿qué es
exactamente lo que sí cambian en la vida de un proyecto?

## Mensaje final

> Un sistema puede hacer exactamente lo que le pedimos y aun así estar equivocado. La diferencia
> entre un equipo que descubre eso a tiempo y uno que lo descubre en producción no es la cantidad de
> pruebas: es haberse preguntado, además, de dónde salió cada expectativa que esas pruebas
> defienden.

### Fuentes técnicas del cierre

- [ISO/IEC/IEEE 12207:2017 — procesos de verificación y validación del ciclo de vida](https://www.iso.org/standard/63712.html)
- Continuidad del módulo — software probado, cobertura e historial de defectos.

---
