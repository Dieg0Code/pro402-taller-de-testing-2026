# Clase 09 - Semana 03 - Probar todo es imposible: elegir los casos con método y escribir esa decisión como código

- **Unidad:** 02 · Desarrollo y Ejecución de Casos de Prueba
- **Fecha:** Miércoles 9 de septiembre de 2026
- **Duración:** 3 horas pedagógicas · 140 minutos (08:30 - 10:50)
- **Modalidad:** Presencial en Laboratorio PC
- **Docente:** Diego Obando
- **Marco de referencia:** ISO/IEC/IEEE 29119-4:2021 · técnicas de diseño de casos de prueba · ISO/IEC/IEEE 29119-3:2021 · base de prueba · `pytest`

---

# Objetivos de la Clase

## Objetivo General

Al finalizar esta sesión, el estudiante será capaz de justificar ante un tercero por qué probó los
casos que probó y, sobre todo, por qué no probó los demás. Para eso aplicará las tres técnicas
basadas en especificación que define ISO/IEC/IEEE 29119-4:2021 —partición de equivalencia, análisis
de valores límite y prueba con tabla de decisión—, entendiendo que permiten seleccionar y ampliar
una muestra con criterio, dejando por escrito qué representa y qué se decidió no recorrer.
Y escribirá esa decisión como código ejecutable sabiendo qué
hace cada parte de lo que escribe, de modo que pueda leer y evaluar una prueba redactada por otra
persona o generada por un agente, en vez de aceptarla porque termina en verde.
La autonomía técnica incluye poder escribir y corregir una prueba pequeña sin generación asistida:
el apoyo de una herramienta no debe sustituir la capacidad de programar y explicar el propio código.

## Objetivos Específicos

1. **Establecer por qué la elección de casos es obligatoria y no opcional**, calculando el tamaño
   real del espacio de entradas de una función pequeña y distinguiendo un dominio exhaustivamente
   comprobable de otro que exige una muestra. La pregunta deja de ser solo «cuántas pruebas tengo» y pasa a ser «qué
   representa esta muestra y qué dejé fuera».
2. **Aplicar partición de equivalencia** según la definen las cláusulas 3.28 y 3.29 de la norma,
   reconociendo que una partición afirma que un conjunto de valores *se espera* que reciba el mismo
   trato, que esa afirmación es refutable, y que su origen debe ser la especificación y nunca el
   código que se está probando.
3. **Derivar valores límite a partir de las particiones**, entendiendo por qué la norma define el
   análisis de valores límite como el examen de los bordes de una partición y no como una técnica
   independiente, y demostrando cómo copiar del código los límites y sus resultados esperados puede
   confirmar el defecto en lugar de encontrarlo.
4. **Construir una tabla de decisión** para reglas que se combinan entre sí, identificando
   condiciones y acciones, calculando la cantidad de reglas posibles y reduciéndolas mediante
   entradas indiferentes sin perder cobertura del comportamiento especificado.
5. **Escribir una tabla de casos como prueba ejecutable**, nombrando cada parte de lo que se escribe:
   qué es una aserción, qué diagnóstico agrega pytest al `assert` de Python, cómo se estructura
   una parametrización completa, cuándo corresponde una comparación tolerante y cómo se declara que
   lo esperado es un error.
6. **Leer una prueba escrita por otro** —persona o agente— y describir en voz alta su preparación, su
   ejecución y su afirmación, incluyendo el vocabulario equivalente de otros entornos, para poder
   decir qué verifica realmente y qué no verifica.

## Competencias Transversales

- **Justificar una omisión:** defender no solo lo que se hizo, sino lo que se decidió no hacer, que
  es la parte del trabajo que nadie ve y la primera que se pregunta cuando algo falla.
- **Tratar el propio criterio como refutable:** formular una partición sabiendo que es una hipótesis
  sobre el comportamiento del sistema, y aceptar la evidencia que la contradiga.
- **Alfabetización sintáctica:** no dar por buena una línea de código que no se sabe leer, aunque la
  haya escrito una herramienta que acierta casi siempre.
- **Autonomía técnica:** conservar la capacidad de escribir, anticipar y corregir código sin
  depender de la disponibilidad de un agente; fundamentar cada cambio en una regla y una ejecución.
- **Economía con argumento:** reducir el trabajo por un razonamiento explícito y no por cansancio,
  presupuesto o intuición, que son las tres razones habituales por las que una suite se detiene.

---

# Mapa de la Clase

| Horario | Sección | Propósito |
|---------|---------|-----------|
| 08:30 - 08:40 | Encuadre | Retomar la pregunta que quedó abierta: en la auditoría se probaron cuatro valores del borde porque «parecía sensato». Constatar que una intuición que acierta sigue sin ser un método, porque no se puede enseñar ni auditar. |
| 08:40 - 09:05 | Bloque 1 | Medir el espacio de entradas de una función pequeña y aceptar la consecuencia: toda suite es una muestra. Reformular la pregunta que se le hace a una suite de pruebas. |
| 09:05 - 09:35 | Bloque 2 | Partición de equivalencia como hipótesis sobre el comportamiento, y su expresión en código: la aserción y la parametrización explicadas parte por parte. |
| 09:35 - 09:45 | Pausa | Descanso técnico. |
| 09:45 - 10:10 | Bloque 3 | Valores límite derivados de las particiones, la diferencia entre tomarlos del requisito y tomarlos del código, y la comparación tolerante entre decimales. |
| 10:10 - 10:40 | Bloque 4 | Tablas de decisión para reglas que se combinan, el error esperado como expectativa ejecutable, y el vocabulario para leer cualquier prueba ajena. |
| 10:40 - 10:50 | Cierre | Consolidar las tres técnicas como un mismo argumento aplicado sobre tres ejes, y dejar planteado lo que ninguna de ellas puede responder. |

> Se trabaja sobre el mismo proyecto de reserva de laboratorio de la sesión anterior, entregado ya
> ejecutado y con sus salidas registradas. El dominio es conocido, sus dos defectos están
> identificados y el foco puede ponerse entero en el diseño de los casos y en la escritura de las
> pruebas.

## Punto de partida: conservar la capacidad de programar

Leer una función implica identificar qué recibe, seguir sus condiciones y explicar qué devuelve.
Leer una prueba añade otra responsabilidad: reconocer de dónde salió el resultado esperado y qué
haría fallar la comparación. La meta es poder escribir y corregir ambas cosas por cuenta propia.

El recorrido de trabajo es **leer → anticipar → ejecutar → explicar → escribir o corregir**.
La ejecución contrasta una predicción; no sustituye la necesidad de formularla. Los ejercicios
individuales permiten intentar primero una solución propia y después contrastarla con las pistas
y la evidencia esperada. Si se usa un agente como apoyo, cada línea incorporada debe poder
explicarse y modificarse sin volver a delegar esa decisión.

---

# BLOQUE 1: Por qué hay que elegir

- **Duración:** 25 minutos
- **Objetivo del bloque:** establecer que elegir qué probar no es una concesión a la falta de tiempo
  sino una consecuencia del tamaño del problema, y que por lo tanto toda suite de pruebas es una
  muestra. Al finalizar, el estudiante debe poder decir qué representa la muestra que escribió y qué
  dejó fuera, en lugar de informar cuántas pruebas tiene.
- **Modalidad:** trabajo individual, con registro escrito.
- **Ritmo sugerido:** 4 minutos para el encuadre, 8 para la medición, 7 para el corolario y 6 para la
  consecuencia y el ejercicio.

## Desarrollo

### 1.1 Una intuición que acertó, y por qué eso no basta

En la auditoría de la sesión anterior, el paso que encontró el defecto probó los bloques 1, 7, 8 y 9.
Esos cuatro y no otros. La razón que se dio en su momento fue que parecía sensato mirar los extremos
del rango, y el resultado le dio la razón: el bloque 8 estaba rechazado por el sistema aunque el
requisito lo declara válido.

La intuición funcionó. El problema es que una intuición que funciona sigue sin ser un método, y le
faltan exactamente tres cosas:

| Le falta | Qué significa en la práctica |
|----------|------------------------------|
| No se puede enseñar | «Mira los extremos» no le dice a nadie cuáles son los extremos de un correo electrónico, de una lista o de una fecha. |
| No se puede auditar | Nadie puede verificar que la intuición se aplicó completa, porque nunca se declaró hasta dónde llegaba. |
| No garantiza haber mirado lo que correspondía | Acertó esta vez. No hay nada en el procedimiento que explique por qué, ni que permita esperar que vuelva a acertar. |

Hay un segundo dato de esa misma sesión que conviene mirar de cerca. El proyecto llegó con cuatro
pruebas escritas por alguien que conocía bien el código, y las cuatro pasaban:

```python
def test_reserva_un_bloque_libre():
    assert puede_reservar(0, 3, tomado=False) is True


def test_no_reserva_un_bloque_tomado():
    assert puede_reservar(0, 3, tomado=True) is False


def test_respeta_el_maximo_semanal():
    assert puede_reservar(3, 3, tomado=False) is False


def test_cancela_con_anticipacion():
    ahora = datetime(2026, 9, 8, 8, 0)
    assert puede_cancelar(ahora + timedelta(hours=5), ahora) is True
```

```text
....                                                                     [100%]
4 passed in 0.04s
```

Tres de las cuatro pruebas ejercitan `puede_reservar()`, y las tres le pasan **el mismo bloque: 3**.
La cuarta no toca ese parámetro. Es decir: una suite de cuatro pruebas en verde que, en toda su vida,
probó un único valor de bloque de los ocho que el requisito declara. Los bloques 1, 2, 4, 5, 6, 7 y 8
nunca se ejecutaron, y el defecto estaba en el 8.

Nadie escribió esa suite de mala fe. Se escribió sin un criterio para elegir los valores, que es
exactamente el vacío que esta sesión viene a llenar.

### 1.2 Cuántas entradas acepta realmente una función de cuatro líneas

La función que esas tres pruebas ejercitan es esta:

```python
def puede_reservar(reservas_de_la_semana: int, bloque: int, tomado: bool) -> bool:
    if not bloque_valido(bloque):
        return False
    if tomado:
        return False
    return reservas_de_la_semana < MAX_POR_SEMANA
```

La pregunta obvia es cuántas entradas distintas puede recibir. Se mide en vez de estimarla: primero
cuánto cuesta una sola ejecución, y con ese dato cuánto tomaría recorrer el conjunto completo.

```text
costo medido de un caso: 435 nanosegundos

solo lo que el requisito declara                             64   27.8 microsegundos
si los enteros fueran de 32 bits     36,893,488,147,419,103,232   508,743 anios
los enteros de Python no tienen tope                     infinito              ---
```

Las tres filas dicen tres cosas distintas y conviene no mezclarlas:

1. **Lo que el requisito declara** son 8 bloques × 4 cantidades de reservas × 2 estados del bloque =
   64 combinaciones. Multiplicar el costo medido de una llamada por 64 estima unos 28 microsegundos,
   sin contar la generación de casos, la comparación ni el registro. Ese conjunto es abarcable.
2. **El tipo anotado** es otra cosa. `bloque: int` no expresa «del 1 al 8» ni valida el argumento
   durante la ejecución. Acotando artificialmente ambos enteros a 32 bits, el tiempo estimado ya
   ronda medio millón de años.
3. **El dominio conceptual de los enteros** no tiene un tope fijo impuesto por `int`: Python usa
   precisión arbitraria. La fila «infinito» expresa ese modelo sin una cota declarada; una máquina
   real siempre tiene recursos finitos y no puede representar enteros de cualquier tamaño.

La cantidad de combinaciones de la segunda fila es fija bajo esa hipótesis de 32 bits. Lo que
depende de la máquina es el costo medido por caso y, con él, el tiempo estimado.

Y hay un caso peor en el mismo proyecto. `comprobante()` recibe tres cadenas de texto. Sin intentar
siquiera el caso general —acotando cada cadena a 40 caracteres tomados de un alfabeto de 40
símbolos, y el bloque a los 8 declarados— el conjunto de entradas posibles es un número de **194
cifras**. Ahí no hay hardware, presupuesto ni paciencia que alcance.

### 1.3 Un experimento incómodo: recorrer las 64 y ver qué pasa

Si el dominio declarado son solo 64 combinaciones y ejecutarlo se estima barato, la pregunta
honesta es por qué no se hace siempre eso. Conviene intentarlo antes de descartarlo.

Para comparar cada resultado con algo hay que escribir la regla **tal como está redactada en el
requisito**, sin mirar la implementación:

```python
def segun_el_requisito(reservas: int, bloque: int, tomado: bool) -> bool:
    """La regla tal como esta redactada, sin mirar la implementacion."""
    return 1 <= bloque <= 8 and not tomado and reservas < 3
```

Y se recorre el dominio completo comparando una contra otra:

```python
import itertools

desacuerdos = []
for reservas, bloque, tomado in itertools.product(range(4), range(1, 9), (False, True)):
    obtenido = puede_reservar(reservas, bloque, tomado)
    esperado = segun_el_requisito(reservas, bloque, tomado)
    if obtenido != esperado:
        desacuerdos.append((reservas, bloque, tomado, obtenido, esperado))
```

```text
combinaciones recorridas: 64
desacuerdos encontrados : 3

  reservas=0 bloque=8 tomado=False -> False, se esperaba True
  reservas=1 bloque=8 tomado=False -> False, se esperaba True
  reservas=2 bloque=8 tomado=False -> False, se esperaba True
```

Funcionó. El barrido exhaustivo del dominio declarado encuentra el defecto del bloque 8, tres veces,
en microsegundos, sin intuición de ningún tipo. Entonces, ¿por qué no es esa la respuesta del curso?

Por dos razones, y las dos importan:

- **Requiere un oráculo para cada caso.** El barrido no compara la función contra sí misma: la
  compara contra `segun_el_requisito()`, que es la regla leída del documento y escrita aparte. Sin
  esa segunda expresión de la regla, las 64 salidas no significan nada. El trabajo difícil no fue
  generar las entradas: fue saber qué debía salir.

  Conviene fijar el término, porque se va a usar el resto de la sesión. Toda prueba tiene cuatro
  partes: una **entrada**, el **programa** que se ejecuta, la **salida** que produce, y una cuarta
  que decide si esa salida es correcta. Esa cuarta parte recibe dos nombres según quién la mire.
  En la literatura de investigación se llama **oráculo de prueba**, y conseguir uno confiable se
  conoce desde hace décadas como *el problema del oráculo*. En la norma que rige la documentación
  de pruebas se llama **base de prueba**, definida en la cláusula 3.7 de ISO/IEC/IEEE 29119-3:2021
  como «información usada como base para diseñar e implementar los casos de prueba». Son el mismo
  objeto: aquello contra lo cual se compara. Lo decisivo es que **no puede salir del programa que
  se está probando**, porque entonces cualquier comportamiento se confirma a sí mismo. En el
  barrido de recién, el oráculo fue `segun_el_requisito()`.
- **No escala a cualquier ampliación del dominio.** El conjunto declarado es abarcable aquí porque
  los tres parámetros son acotados y discretos. Agregar otro booleano solo lo duplicaría, pero
  incorporar fechas con alta resolución o texto puede multiplicarlo enormemente; `comprobante()`
  ilustra ese crecimiento con tres cadenas. Además, las anotaciones de `puede_reservar()` no
  restringen las entradas a esas 64, y el defecto de
  `bloque_disponible()` que detectó el análisis de tipos vive justamente afuera del dominio
  declarado.

La conclusión no es que el barrido exhaustivo sea inútil. Es que solo sirve donde el dominio es
pequeño, discreto y está declarado, y que incluso ahí depende de tener escrito qué se espera. En
todos los demás casos hay que elegir.

### 1.4 El corolario que nadie cita como corolario

Una de las frases más conocidas del testing es de Edsger Dijkstra, en sus *Notes on Structured
Programming* de 1970:

> Program testing can be used to show the presence of bugs, but never to show their absence!

> El testing de programas puede usarse para mostrar la presencia de errores, pero nunca para mostrar
> su ausencia.

Se cita como una sentencia sobre la inutilidad del testing. Conviene ir al documento, porque el texto
original trae encima una etiqueta que las citas siempre eliminan:

> **Corollary of the first part of this section:**

Es un **corolario**. Un corolario es lo que se deduce de algo anterior. ¿De qué se deduce este? De un
cálculo que Dijkstra hace unas páginas antes, y que es exactamente el mismo cálculo que se acaba de
hacer en esta clase.

Dijkstra cuenta que en su universidad instalaron una máquina cuya documentación declaraba un circuito
para multiplicar dos enteros de 27 bits, y se pregunta cómo se comprueba que ese multiplicador es
correcto:

> The naive answer to this is: "Well, the number of different multiplications this multiplier is
> claimed to perform correctly is finite, viz. 2^54, so let us try them all." But, reasonable as this
> answer may seem, it is not, for although a single multiplication took only some tens of
> microseconds, the total time needed for this finite set of multiplications would add up to more
> than 10 000 years!

> La respuesta ingenua es: «Bueno, la cantidad de multiplicaciones distintas que este multiplicador
> dice ejecutar correctamente es finita, a saber 2^54, así que probémoslas todas». Pero, por
> razonable que parezca esa respuesta, no lo es, porque aunque una sola multiplicación tomaba apenas
> algunas decenas de microsegundos, el tiempo total necesario para ese conjunto finito de
> multiplicaciones sumaría más de 10 000 años.

Ese número se puede auditar, y conviene hacerlo:

```text
2^54 = 18,014,398,509,481,984 multiplicaciones
  a 10 microsegundos por multiplicacion ->      5,712 anios
  a 20 microsegundos por multiplicacion ->     11,425 anios
  a 30 microsegundos por multiplicacion ->     17,137 anios
  a 50 microsegundos por multiplicacion ->     28,562 anios
```

Con 20 o 30 microsegundos, el cálculo supera los 11.000 o los 17.000 años, respectivamente. Ambas
duraciones son compatibles con «algunas decenas» y sostienen «más de 10 000 años». Es la primera
afirmación heredada que este módulo audita y que sale intacta: la
aritmética de Dijkstra está bien hecha. Lo que no sobrevive a la auditoría no es el número, sino la
lectura que se hace de la frase.

Porque en el mismo párrafo, dos oraciones después, Dijkstra nombra la salida:

> As long as the multiplier is considered as a black box, the only thing we can do is "testing by
> sampling", i.e. offering to the multiplier a feasible amount of factor pairs and checking the
> result. But in view of the 10 000 years, it is clear that we can only test a negligeable fraction
> of the possible multiplications. Whole classes of in some sense "critical" multiplications may
> remain untested.

> Mientras el multiplicador se considere una caja negra, lo único que podemos hacer es «probar por
> muestreo», es decir, ofrecerle una cantidad factible de pares de factores y comprobar el resultado.
> Pero en vista de los 10 000 años, está claro que solo podemos probar una fracción despreciable de
> las multiplicaciones posibles. Clases enteras de multiplicaciones en algún sentido «críticas»
> pueden quedar sin probar.

Las dos expresiones que hacen falta para el resto de la sesión ya están ahí, escritas en 1970:
**probar por muestreo** y **clases**. Dijkstra no dijo que el testing fuera inútil; dijo que el
testing es un muestreo, y que el peligro del muestreo es que queden clases enteras sin representante.
Las técnicas de hoy son la respuesta a esa segunda mitad de la frase.

Queda una tensión abierta que no hay que disimular. La conclusión que Dijkstra saca es esta:

> A convincing demonstration of correctness being impossible as long as the mechanism is regarded as
> a black box, our only hope lies in not regarding the mechanism as a black box.

> Siendo imposible una demostración convincente de corrección mientras el mecanismo se considere una
> caja negra, nuestra única esperanza está en no considerarlo una caja negra.

Es decir: Dijkstra propone mirar hacia adentro. Las tres técnicas de esta sesión derivan sus casos
de la especificación, aunque se inspeccione código para analizar un fallo. Esa diferencia deja una
pregunta abierta: ¿qué evidencia adicional aporta conocer la estructura interna? La próxima sesión
retoma esa pregunta con caja negra y caja blanca.

*(Las traducciones son del original en inglés; los textos literales quedan arriba.)*

### 1.5 La pregunta que hay que hacerle a una suite

De todo lo anterior se sigue una sola cosa, y es el resultado del bloque:

```text
Cuando el dominio no se puede recorrer, la suite es una muestra que hay que justificar.
```

El barrido de las 64 combinaciones mostró la excepción: un dominio pequeño sí se puede recorrer.
Fuera de esos casos, la cantidad de pruebas por sí sola no explica la calidad de la selección.
La suite del proyecto tenía cuatro pruebas en verde y un único valor de bloque. Cuatrocientas
pruebas sobre ese mismo valor habrían seguido sin observar el bloque `8`.

La pregunta correcta es doble, y las dos mitades se responden por escrito:

| Pregunta | Qué exige responderla |
|----------|-----------------------|
| ¿Qué representa esta muestra? | Poder nombrar los grupos de entradas que la suite cubre, y señalar cuál prueba representa a cada grupo. |
| ¿Qué quedó fuera, y por qué? | Poder nombrar los grupos que se decidió no cubrir, con el argumento de esa decisión. |

Una suite que no puede responder la segunda pregunta no está incompleta: está sin justificar, que es
distinto y peor, porque nadie sabe dónde no se miró cuando aparece un problema.

Esto también explica por qué la norma define un caso de prueba como lo define. Según
ISO/IEC/IEEE 29119-4:2021, cláusula 3.49, un caso de prueba es un «conjunto de precondiciones,
entradas y **resultados esperados**». El resultado esperado no es un adorno del caso: es parte de su
definición. Ese requisito no obliga a usar literalmente `assert`: se puede comprobar una excepción
esperada o exigir que una operación termine sin errores. Lo que hace falta es declarar y comprobar
la expectativa pertinente. Ejecutar una función sin comprobar su resultado no demuestra que cumpla
su regla de negocio.

### 1.6 Qué cambia cuando las pruebas las escribe un agente

Supón que un agente genera quinientas pruebas en veinte segundos. Es un escenario ilustrativo de
producción rápida, no una medición de esta clase. Permite distinguir dos cambios.

Lo que cambia es el **costo de la muestra**. Escribir muchos casos dejó de ser caro, y eso permite
cubrir clases que antes se dejaban fuera por presupuesto y no por criterio. Es una mejora genuina.

Lo que no cambia es la **representatividad de la muestra**. Quinientos casos extraídos de la misma
región del espacio de entradas siguen siendo una región. La suite del proyecto es la demostración a
escala pequeña: cuatro pruebas, un valor. Nada impide que sean cuatrocientas pruebas y un valor.

Y hay un problema específico que aparece aquí. Las magnitudes que un agente puede optimizar de forma
directa —la cantidad de pruebas, la cantidad de líneas ejercitadas— son precisamente las que no dicen
nada sobre qué clases quedaron sin representante. Se puede subir cualquiera de las dos sin agregar
una sola clase nueva. Esa es la trampa completa de la próxima sesión.

De ahí sale la regla operativa del bloque:

```text
Antes de pedir pruebas, se decide y se escribe la particion.
Despues se pide que la completen, y se revisa contra la particion escrita.
```

El orden importa. Pedir primero y ordenar después significa aceptar la muestra que otro eligió, sin
haber decidido nunca cuál era la muestra correcta.

## Ejercicio del bloque

Sobre `puede_cancelar()`, que decide si una reserva se puede cancelar:

```python
def puede_cancelar(inicio_bloque: datetime, ahora: datetime) -> bool:
    return inicio_bloque - ahora > ANTICIPACION_CANCELACION
```

Responde por escrito, en tres líneas:

1. ¿Cuántas entradas distintas acepta esta función según su firma? No es una pregunta retórica:
   argumenta el tamaño del conjunto a partir de los tipos que recibe.
2. La suite entregada la prueba una sola vez, con cinco horas de anticipación. Nombra dos grupos de
   entradas que esa única prueba no representa.
3. El requisito dice «hasta 2 horas antes». Escribe la entrada exacta que pondría a prueba esa frase,
   y di qué esperas que ocurra.

La tercera respuesta es el material con el que se abre el bloque de valores límite.

**Pista:** para fechas sin zona horaria, `datetime` tiene un rango de años y una resolución finitos;
el conjunto de pares es enorme, pero no infinito. Cinco horas no representa ni una hora ni la
igualdad exacta con dos horas.

**Evidencia esperada:** una justificación del tamaño del dominio temporal bajo el alcance elegido,
dos clases de anticipación omitidas por la prueba heredada y una entrada con dos horas exactas.
En ese último caso se debe registrar el esperado como pendiente de aclaración, porque el requisito
todavía no decide si incluye la igualdad.

## Preguntas guía

1. El barrido de las 64 combinaciones encontró el defecto sin ninguna técnica de diseño. Si eso
   funciona, ¿qué es exactamente lo que impide usarlo siempre, y cuál de esos dos impedimentos
   seguiría existiendo aunque las máquinas fueran mil veces más rápidas?

   **Pista:** distingue el costo de recorrer entradas del trabajo de establecer sus esperados.

2. Dijkstra advirtió que el riesgo del muestreo es que queden «clases enteras» sin probar. En la
   suite del proyecto, que probó siempre el bloque 3, ¿qué clase quedó sin representante, y por qué
   el resultado en verde no lo delataba?

   **Pista:** piensa en números fuera de la jornada. Dentro de la clase válida también puede quedar
   sin ejecutar un miembro defectuoso, como el `8`.

3. Un agente puede multiplicar por cien la cantidad de pruebas de un proyecto en un minuto. ¿Qué
   tendría que entregarle el estudiante para que esas pruebas cubran clases nuevas en vez de repetir
   la que ya estaba cubierta?

   **Pista:** los representantes necesitan una clasificación y expectativas derivadas del requisito.

## Fuentes técnicas del bloque

- [Edsger W. Dijkstra — *Notes on Structured Programming* (EWD249), 2.ª edición, abril de 1970, sección «On the reliability of mechanisms»](https://www.cs.utexas.edu/~EWD/transcriptions/EWD02xx/EWD249/EWD249.html) — el cálculo del multiplicador de 27 bits y sus 2^54 casos, la expresión «testing by sampling», la advertencia sobre las clases enteras que quedan sin probar, la etiqueta «Corollary of the first part of this section» que encabeza la frase célebre, y la conclusión sobre no tratar el mecanismo como una caja negra.
- [ISO/IEC/IEEE 29119-4:2021](https://www.iso.org/standard/79430.html) — la cláusula 3.49, que define un caso de prueba como un conjunto de precondiciones, entradas y resultados esperados.
- Ejecuciones registradas para esta clase sobre el proyecto de reserva de laboratorio, con Python 3.12.12: la medición del costo por caso, el tamaño de los tres dominios, el barrido exhaustivo de las 64 combinaciones declaradas con sus tres desacuerdos, y la ejecución de la suite entregada.

---

# BLOQUE 2: Partición de equivalencia — de una hipótesis a una aserción ejecutable

- **Duración:** 30 minutos.
- **Objetivo del bloque:** construir una partición desde el requisito, justificar sus representantes
  y convertir su tabla de resultados esperados en una prueba parametrizada, explicando qué hace cada
  parte del código y qué permite concluir su ejecución.
- **Modalidad:** trabajo individual, con lectura de código y registro escrito.
- **Ritmo sugerido:** 7 minutos para construir la partición, 7 para desarmar una aserción, 7 para
  escribir y leer la parametrización, 4 para contrastar los resultados y 5 para el ejercicio.

## Desarrollo

### 2.1 Agrupar por lo que se espera, antes de mirar lo que ocurre

Para elegir una muestra hace falta un argumento que permita tratar varios valores como
representantes de un mismo comportamiento. ISO/IEC/IEEE 29119-4:2021, cláusula 3.28, define
*equivalence partition* —también llamada *equivalence class*— así:

> class of inputs or outputs that are expected to be treated similarly by the test item

> Clase de entradas o salidas que se espera que el elemento de prueba trate de forma similar.

*(Traducción del original en inglés.)*

La cláusula 3.29 sitúa la técnica entre las basadas en especificación. La palabra decisiva de la
definición es **«se espera»**: agrupar valores formula una hipótesis sobre el comportamiento debido;
ejecutar algunos representantes permite buscar evidencia que la contradiga. La norma no promete que
un representante que pasa demuestre que todos los demás pasan.

Se aplica al requisito del laboratorio: **la jornada se divide en bloques numerados del 1 al 8**.
La pregunta acotada es si un número pertenece a esa jornada. Se prueba `bloque_valido(bloque)`, cuyo
contrato devuelve un booleano; todavía no intervienen la ocupación ni las reservas semanales.

Se declara como dominio de este análisis el de los **números enteros de bloque**. Dentro de él:

| Clase | Condición de pertenencia | Tratamiento esperado | Representante elegido |
|-------|-------------------------|----------------------|-----------------------|
| Antes de la jornada | `bloque < 1` | `False`: no pertenece a la jornada | `-5` |
| Dentro de la jornada | `1 <= bloque <= 8` | `True`: pertenece a la jornada | `4` |
| Después de la jornada | `bloque > 8` | `False`: no pertenece a la jornada | `12` |

La tabla se puede revisar sin ejecutar el programa. Todo entero pertenece a una de las tres clases;
ninguno pertenece a dos. Esas dos propiedades permiten detectar huecos y solapamientos en la
partición. Por ejemplo, escribir `bloque < 1` y `1 < bloque <= 8` dejaría al `1` sin clase.

Las dos clases externas esperan el mismo resultado y aun así se mantienen separadas. El motivo es
que rechazar por debajo y rechazar por encima son restricciones distintas: una puede estar bien
implementada y la otra no. Dividir más finamente es una decisión de diseño que se justifica por lo
que interesa verificar; no hay una única partición útil para toda pregunta sobre una función.

**Una entrada inválida puede formar parte de una prueba correcta.** Para `-5`, la prueba pasa si
recibe `False`. «Válido o inválido» describe aquí la entrada respecto del requisito; «pasa o falla»
describe la comparación entre el resultado obtenido y el esperado.

El alcance también deja cosas fuera: cadenas, `None`, decimales y booleanos usados como números de
bloque. La anotación `bloque: int` no valida entradas durante la ejecución. Esta tabla no resuelve
cómo deben rechazarse esos otros tipos; haría falta declarar ese contrato y probarlo aparte.

#### Qué representa la suite heredada

Las tres llamadas heredadas a `puede_reservar()` usan el bloque `3`. **Respecto del parámetro
`bloque`**, las tres representan la clase «dentro de la jornada». Respecto de los otros parámetros
sí hay diferencias: una comprueba un bloque ocupado y otra el máximo semanal. No son tres pruebas
idénticas; lo que falta es diversidad en una dimensión concreta.

Al revisar una suite importa decir **qué parámetro o regla se está clasificando**. Contar tres
pruebas no permite inferir tres clases de bloque, ni cubrir tres clases de bloque permite afirmar
que se cubrieron todas las combinaciones de reservas y ocupación.

### 2.2 Una fila se convierte en prueba: qué afirma un `assert`

La fila central de la tabla contiene una entrada, `4`, y una expectativa, `True`. Antes de convertir
las tres filas en código, se escribe solo esa. En un módulo de pruebas que importa la función del
laboratorio:

```python
from reservas import bloque_valido


def test_un_bloque_de_la_jornada_es_valido() -> None:
    bloque = 4
    esperado = True

    obtenido = bloque_valido(bloque)

    assert obtenido is esperado
```

El nombre `test_...` permite que pytest descubra la función dentro de un archivo de pruebas, como
`test_particiones.py`. `-> None` expresa que la prueba no devuelve un resultado para que pytest lo
califique. La comprobación ocurre en su cuerpo.

Hay tres operaciones, aunque todavía quepan en pocas líneas:

| Operación | Código | Qué aporta |
|-----------|--------|------------|
| Preparar | `bloque = 4` y `esperado = True` | Declara el caso. El esperado viene del requisito. |
| Ejecutar | `obtenido = bloque_valido(bloque)` | Consulta el comportamiento real. |
| Afirmar | `assert obtenido is esperado` | Exige que el comportamiento observado coincida con la expectativa. |

Una **aserción** es una afirmación comprobable que se exige verdadera en ese punto de la ejecución.
En Python, `assert expresion` evalúa la expresión: si resulta verdadera, continúa; si resulta falsa,
lanza `AssertionError`. No devuelve una nota ni corrige la función.

En este caso, `is` exige que el resultado sea el booleano esperado. Se usa porque el contrato pide
`True` o `False`, y cada uno es un objeto único de Python. Para comparar valores generales —números,
textos, listas— se usa normalmente `==`; `is` compara identidad y no debe reemplazar a `==` por
costumbre. La diferencia importa: `1 == True` es verdadero, pero `1 is True` es falso.

Tres expresiones parecidas exigen cosas distintas:

| Aserción | Qué acepta | Riesgo al usarla aquí |
|----------|------------|----------------------|
| `assert obtenido` | Cualquier valor que Python considere verdadero | También aceptaría `1` o una cadena no vacía. Además, no sirve para filas cuyo resultado esperado es `False`. |
| `assert obtenido == esperado` | Un valor igual al esperado | Si el esperado es `True`, también aceptaría el entero `1`. |
| `assert obtenido is esperado` | El mismo booleano que se declaró como esperado | Es apropiada para este contrato booleano; no es la comparación general para cualquier resultado. |

En los dos últimos casos se separan **obtenido** y **esperado** porque tienen orígenes distintos.
Escribir `esperado = bloque_valido(bloque)` y comparar después la función consigo misma eliminaría
la referencia externa. Para esta función determinista, el defecto quedaría copiado a ambos lados.

#### Qué agrega pytest al `assert` de Python

El lenguaje de la aserción sigue siendo Python. Pytest descubre y ejecuta las pruebas, registra sus
fallos y, por defecto, reescribe las aserciones de los módulos de pruebas que recoge para enriquecer
el diagnóstico. Así puede mostrar valores intermedios, como `assert False is True`, al fallar.
No decide si el esperado era correcto: eso depende de quien escribió el caso.

También importa distinguir una comparación de una aserción:

```python
def test_sin_comprobacion() -> None:
    obtenido = bloque_valido(8)
    obtenido is True
```

La última línea calcula `False` y lo descarta. No lanza una excepción. Si la llamada termina
normalmente, pytest puede marcar esa prueba como pasada aunque no se haya exigido la expectativa.
Cambiarla por `assert obtenido is True` convierte la discrepancia en un fallo observable.

`assert` es útil en pruebas; no debe ser la única validación de entradas del sistema productivo:
Python puede omitir sus aserciones al ejecutarse con optimización (`-O`).

### 2.3 Las tres filas, una función: leer `parametrize` parte por parte

Las tres clases requieren la misma operación y la misma forma de comparación. Lo que cambia son
los datos. **Parametrizar** consiste en ejecutar una misma prueba con conjuntos distintos de
argumentos. La tabla se expresa directamente así:

```python
import pytest

from reservas import bloque_valido


@pytest.mark.parametrize(
    ("bloque", "esperado"),
    [
        (-5, False),
        (4, True),
        (12, False),
    ],
    ids=["antes-jornada", "dentro-jornada", "despues-jornada"],
)
def test_validez_por_particion(bloque: int, esperado: bool) -> None:
    obtenido = bloque_valido(bloque)
    assert obtenido is esperado
```

La sintaxis se lee de afuera hacia adentro:

| Pieza | Lectura concreta |
|-------|------------------|
| `import pytest` | Hace disponible la herramienta usada para declarar los casos. El `assert` no necesita ese import. |
| `@pytest.mark.parametrize(...)` | Es un **decorador**: se coloca sobre la definición de una función y, aquí, le asocia los casos que pytest debe ejecutar. |
| `("bloque", "esperado")` | Son los **nombres** de los argumentos que recibirá la función de prueba. Son cadenas, no valores de entrada. También se pueden escribir como `"bloque,esperado"`. |
| `[(-5, False), (4, True), (12, False)]` | Es la lista de casos. Cada tupla contiene los valores de una fila, en el orden de los nombres. |
| `(4, True)` | En esa ejecución, `bloque` recibe `4` y `esperado` recibe `True`. No son dos pruebas separadas. |
| `ids=[...]` | Asigna una etiqueta legible a cada fila, en el mismo orden. Identifica el caso en la salida; no cambia lo que se comprueba. |
| `def test_validez_por_particion(bloque: int, esperado: bool)` | Declara dónde recibe la prueba los dos valores. Los nombres deben coincidir con los declarados arriba. |
| El cuerpo de la función | Ejecuta el sistema y afirma el esperado para la fila que recibió. |

En este ejemplo, tres tuplas producen **tres casos ejecutados**. Pytest entrega los argumentos;
no hay que escribir tres llamadas manuales a la función de prueba. Los nombres y la lista definen
el emparejamiento: pytest no inventa representantes, no calcula el resultado esperado y no genera
automáticamente todas las combinaciones de los valores listados.

La prueba parametrizada reemplaza a la prueba individual anterior. Para observar qué casos se
recogen y cómo se ejecutan, sobre el módulo que contiene esta parametrización:

```bash
uv run pytest test_particiones.py --collect-only -q
uv run pytest test_particiones.py -v --tb=short
```

`--collect-only` enumera los casos sin ejecutar sus cuerpos; `-q` reduce la salida; `-v` muestra cada
caso con su identificador; `--tb=short` abrevia la traza si ocurre un fallo. Son opciones de lectura
del resultado, no cambios en el criterio de aceptación.

Ejecución sobre la función heredada, con Python 3.12.12 y pytest 9.1.1. Fragmentos literales de la
salida; se omiten el encabezado, las barras de progreso y los separadores:

```text
collecting ... collected 3 items
```

```text
3 passed in 0.03s
```

Los tres casos pasan. La tabla ahora tiene representación de las tres clases de bloque y una
aserción por ejecución. **El defecto del bloque 8 sigue presente.** El representante de la clase
válida fue `4`: que ese valor pase no dice qué habría ocurrido con `8`.

#### Una etiqueta permite volver al caso exacto

Los identificadores también sirven para seleccionar pruebas. Con esta tabla, el siguiente comando
ejecuta solo la fila central:

```bash
uv run pytest test_particiones.py -v --tb=short -k dentro-jornada
```

`-k` filtra por nombres o identificadores que coincidan con su expresión. Aquí se selecciona un
caso y se dejan fuera los otros dos. La etiqueta debe describir el caso, no su resultado observado:
`dentro-jornada` sigue siendo un buen nombre incluso cuando la implementación rechaza ese bloque.

### 2.4 Tres clases cubiertas, un defecto sin detectar

Se modifica **solo** la fila central de la parametrización:

```python
(8, True),
```

`8` pertenece a la misma clase que `4` según el requisito. No cambian la cantidad de casos, las
etiquetas, la función de prueba ni el resultado esperado. Al ejecutar otra vez, dos casos pasan y
uno falla. Fragmentos literales del diagnóstico; se omiten encabezados y separadores:

```text
test_particiones.py:17: in test_validez_por_particion
    assert obtenido is esperado
E   assert False is True
```

```text
FAILED test_particiones.py::test_validez_por_particion[dentro-jornada] - assert False is True
```

La salida se puede leer sin adivinar:

- `test_particiones.py` identifica el módulo de pruebas y `:17` la línea de la aserción en este ejemplo.
- `test_validez_por_particion` identifica la función de prueba.
- `[dentro-jornada]` identifica la fila. En esta ejecución, sus argumentos son `8` y `True`.
- `False is True` muestra la comparación fallida: **obtenido** a la izquierda y **esperado** a la
  derecha porque así se escribió la aserción, no porque pytest imponga ese orden.

Un fallo localiza una discrepancia; atribuirla al sistema todavía requiere contrastar la expectativa
con el requisito. Aquí el requisito incluye el `8`, por lo que esperar `True` está justificado.

| Qué se mantuvo | Qué cambió |
|----------------|------------|
| Tres clases, tres casos y tres aserciones | El representante de la clase válida: `4` → `8` |
| La expectativa: ambos pertenecen a la jornada | La observación: `4` se acepta y `8` se rechaza |
| El requisito que define la partición | La evidencia disponible sobre la implementación |

La hipótesis de que la implementación trata de forma similar a esos dos miembros queda refutada.
**La pertenencia del `8` a la clase válida no cambia.** Reclasificarlo como inválido o cambiar su
esperado a `False` para recuperar el verde haría que el defecto pasara a definir el requisito.

Esto precisa la promesa de la técnica: cubrir clases declaradas hace visible el argumento de la
muestra, pero no garantiza uniformidad real dentro de cada clase. Elegir representantes necesita
criterio adicional. El bloque `8` tiene una característica que el `4` no tiene: está exactamente
donde termina la clase válida. Esa es la entrada al análisis de valores límite.

#### Cuando la parametrización la escribe un agente

La tarea delegable es convertir la tabla acordada en código. Un encargo acotado puede ser:

```text
Convierte estas tres filas en una prueba parametrizada de bloque_valido:
antes-jornada: -5, False
dentro-jornada: 4, True
despues-jornada: 12, False

Usa esos resultados esperados y conserva la correspondencia entre filas e ids.
La funcion debe devolver un bool: comprueba el booleano exacto.
Si encuentras una contradiccion con el requisito, informala antes de cambiar casos.
```

La revisión humana comprueba la correspondencia **requisito → clase → representante → esperado →
aserción**. Un agente puede ayudar a proponer clases omitidas, pero cada propuesta debe justificar
qué comportamiento distinto representa. Agregar `2`, `3`, `5` y `6` amplía la muestra dentro de la
clase válida; no agrega cuatro clases nuevas. Modificar el esperado para que coincida con el código
es un error diferente: cambia el criterio que la prueba debía preservar.

## Ejercicio del bloque

El requisito permite como máximo tres reservas activas por semana. Se mantiene fijo `bloque=4` y
`tomado=False` para estudiar únicamente el parámetro `reservas_de_la_semana`.

1. Escribe dos clases sobre los estados declarados `0`, `1`, `2` y `3`: antes de alcanzar el máximo
   y con el máximo alcanzado. Elige un representante por clase y justifica su esperado. Anota por
   separado qué falta decidir para una cantidad negativa; no inventes su tratamiento.
2. Convierte tus dos filas en una prueba con `@pytest.mark.parametrize`, argumentos `reservas` y
   `esperado`, e identificadores que describan las clases. Usa la llamada
   `puede_reservar(reservas, 4, tomado=False)` y una aserción del booleano esperado.
3. Examina esta propuesta de prueba y explica por qué no cumple la tarea:

   ```python
   def test_el_maximo_impide_reservar() -> None:
       obtenido = puede_reservar(3, 4, tomado=False)
       obtenido is False
   ```

**Pista:** alcanzar el máximo es un estado permitido del estudiante; lo que debe rechazarse es una
reserva adicional. En la tercera consigna, revisa qué ocurriría si la función devolviera `True`.

**Evidencia esperada:** una tabla de dos clases con sus representantes y resultados, una prueba que
permita identificar cada fila en la salida y una explicación del error de la propuesta. Con `1` y
`3` como representantes, se esperan `True` y `False`, respectivamente. La propuesta calcula una
comparación y la descarta: necesita `assert obtenido is False` para fallar ante el resultado
incorrecto. El tratamiento de cantidades negativas queda registrado como contrato pendiente.

## Preguntas guía

1. `4` y `8` pertenecen a la misma clase según el requisito, pero la función devuelve valores
   diferentes. ¿Qué se debe revisar: el requisito, la clasificación o la implementación? Justifica
   la respuesta con la referencia disponible.

   **Pista:** la jornada incluye los bloques del 1 al 8; observar un rechazo no modifica esa regla.

2. ¿Qué diferencia hay entre escribir `obtenido is esperado` y `assert obtenido is esperado`?
   ¿Qué agrega pytest cuando falla la segunda?

   **Pista:** separa calcular una expresión, exigir que sea verdadera y mostrar el diagnóstico.

3. Una parametrización tiene tres filas y otra treinta, todas dentro de las mismas tres clases.
   ¿Qué aumentó y qué sigue sin estar demostrado, aunque las treinta pasen?

   **Pista:** distingue cantidad de casos, clases representadas y comportamiento de los miembros que
   no se ejecutaron.

## Fuentes técnicas del bloque

- [ISO/IEC/IEEE 29119-4:2021, vista previa de la publicación final](https://cdn.standards.iteh.ai/samples/79430/6c93dfe4a05b46a8895e04dfd74ddd24/ISO-IEC-IEEE-29119-4-2021.pdf) — cláusulas 3.28 y 3.29, página numerada 4: definición de clase de equivalencia y técnica basada en especificación. La interpretación como hipótesis y la elección de tres clases se desarrollan aquí sobre el requisito del laboratorio.
- [Python — La sentencia `assert`](https://docs.python.org/3/reference/simple_stmts.html#the-assert-statement) — evaluación de la expresión, `AssertionError` y omisión de aserciones con optimización.
- [pytest — Aserciones y diagnóstico de fallos](https://docs.pytest.org/en/stable/how-to/assert.html) — uso de `assert` de Python y reescritura de aserciones para mostrar información del fallo.
- [pytest — Parametrización de funciones de prueba](https://docs.pytest.org/en/stable/how-to/parametrize.html) — declaración de nombres y conjuntos de argumentos mediante `pytest.mark.parametrize`.
- [pytest — Identificadores de casos parametrizados](https://docs.pytest.org/en/stable/example/parametrize.html#different-options-for-test-ids) — `ids`, inspección con `--collect-only` y selección con `-k`.
- Ejecuciones de este bloque con Python 3.12.12 y pytest 9.1.1 sobre las funciones reproducidas del laboratorio: tres representantes en verde y sustitución del representante válido por `8`, con dos casos que pasan y uno que falla. Los fragmentos de diagnóstico son recortes literales; los tiempos de ejecución no forman parte del criterio.

---

# BLOQUE 3: Valores límite — dónde cambia la regla y cuánto error admite una comparación

- **Duración:** 25 minutos.
- **Objetivo del bloque:** derivar casos de los bordes de las particiones, conservar un resultado
  esperado independiente del código y distinguir un límite exacto del negocio de una comparación
  numérica que necesita tolerancia explícita.
- **Modalidad:** trabajo individual, con lectura de pruebas y registro de expectativas.
- **Ritmo sugerido:** 6 minutos para derivar los límites, 6 para comparar las dos suites, 4 para
  analizar el umbral temporal, 6 para la comparación tolerante y 3 para el ejercicio de comprobación.

## Desarrollo

### 3.1 Los límites pertenecen a una partición y a un dominio

Quedaron dos preguntas abiertas. El bloque `8` pertenece a la clase válida, pero el programa lo
rechaza. Y el requisito de cancelación dice «hasta 2 horas antes», sin resolver qué ocurre en las dos
horas exactas. En ambos casos interesa el lugar donde cambia el comportamiento esperado; en el
segundo, además, falta decidir a qué lado pertenece la igualdad.

ISO/IEC/IEEE 29119-4:2021, cláusula 3.3, define el análisis de valores límite como una técnica basada
en especificación que ejercita los límites de las particiones de equivalencia. Por eso el orden
de trabajo es **declarar el dominio → particionar → identificar límites → elegir casos**.
«Probar cerca del máximo» queda incompleto si nadie ha dicho máximo de qué, incluido o excluido,
y con qué separación entre valores.

En la validación de bloques, el dominio estudiado es entero. El anterior a `1` es `0`; el siguiente
a `8` es `9`. Las tres clases declaradas producen dos transiciones:

| Transición | Último valor de la clase izquierda | Primer valor de la clase derecha | Cambio esperado |
|------------|-----------------------------------|-----------------------------------|-----------------|
| Antes de la jornada → dentro | `0` | `1` | `False` → `True` |
| Dentro de la jornada → después | `8` | `9` | `True` → `False` |

Los cuatro valores límite son `0`, `1`, `8` y `9`. Los extremos exteriores pertenecen a clases
inválidas, pero también son límites de esas clases. Los enteros de bloque no tienen un mínimo ni un
máximo global declarado; aquí se estudian las transiciones de la jornada, no extremos de memoria.

#### Dos variantes, con el criterio escrito

El syllabus ISTQB CTFL v4.0.1, sección 4.2.2, distingue dos variantes. Se usa su nomenclatura para
hacer explícita la selección; no se atribuye esa clasificación a la definición breve de ISO:

- **Dos valores:** ejercitar cada valor límite y su vecino inmediato en la partición adyacente.
- **Tres valores:** ejercitar cada valor límite y sus dos vecinos inmediatos.

Aplicado a **las tres particiones enteras de este ejemplo**, la derivación es:

| Valor límite | Dos valores: límite y vecino de la otra clase | Tres valores: anterior, límite y siguiente |
|--------------|----------------------------------------------|-------------------------------------------|
| `0` | `0, 1` | `-1, 0, 1` |
| `1` | `1, 0` | `0, 1, 2` |
| `8` | `8, 9` | `7, 8, 9` |
| `9` | `9, 8` | `8, 9, 10` |

Al eliminar duplicados, quedan cuatro casos para la primera variante y ocho para la segunda:

```text
2 valores: [0, 1, 8, 9]
3 valores: [-1, 0, 1, 2, 7, 8, 9, 10]
```

La segunda añade vecinos que permanecen dentro de sus clases. Probar solo `0, 1, 2, 7, 8, 9`
sería otra selección útil, centrada en los extremos del intervalo válido, pero no completaría la
variante de tres valores sobre los cuatro límites que se declararon aquí: faltarían `-1` y `10`.

No hace falta creer que más casos siempre significan mejores pruebas. Se puede mostrar qué error
adicional interesa detectar. Considera esta implementación defectuosa alternativa:

```python
def bloque_valido_solo_extremos(bloque: int) -> bool:
    return bloque in (1, 8)
```

Acepta el primero y el último, pero rechaza todos los interiores. Los cuatro casos `0, 1, 8, 9`
coinciden con el requisito y no la delatan. Al ampliar con los vecinos, `2` y `7` revelan el defecto.
Comparación ejecutada contra `1 <= bloque <= 8`:

```text
2 valores, desacuerdos: []
3 valores, desacuerdos: [2, 7]
```

El resultado justifica esta ampliación frente a este error concreto. No demuestra que los ocho
casos detecten cualquier defecto posible dentro del intervalo.

### 3.2 Un borde correcto con un esperado incorrecto también deja la suite en verde

La función heredada contiene este cuerpo completo:

```python
BLOQUE_MIN = 1
BLOQUE_MAX = 8


def bloque_valido(bloque: int) -> bool:
    return BLOQUE_MIN <= bloque < BLOQUE_MAX
```

Leyendo solo esa implementación, la clase aceptada sería del `1` al `7`, y el `8` sería el primer
rechazado por arriba. Una suite que copia **esa clasificación y sus expectativas** puede verse así:

```python
import pytest

from reservas import bloque_valido


@pytest.mark.parametrize(
    ("bloque", "esperado"),
    [(0, False), (1, True), (7, True), (8, False)],
    ids=["antes", "primero", "ultimo", "despues"],
)
def test_limites_copiados(bloque: int, esperado: bool) -> None:
    assert bloque_valido(bloque) is esperado
```

En cambio, la jornada declarada del `1` al `8` produce esta prueba:

```python
import pytest

from reservas import bloque_valido


@pytest.mark.parametrize(
    ("bloque", "esperado"),
    [(0, False), (1, True), (8, True), (9, False)],
    ids=["antes", "primero", "ultimo", "despues"],
)
def test_limites_del_requisito(bloque: int, esperado: bool) -> None:
    assert bloque_valido(bloque) is esperado
```

Se ejecutaron por separado sobre la misma función, con Python 3.12.12 y pytest 9.1.1:

```bash
uv run pytest test_desde_codigo.py -q --tb=short
uv run pytest test_desde_requisito.py -q --tb=short
```

Fragmentos literales de las salidas; se omiten las barras de progreso y los separadores. Primera
suite:

```text
4 passed in 0.02s
```

Segunda suite:

```text
test_desde_requisito.py:12: in test_limites_del_requisito
    assert bloque_valido(bloque) is esperado
E   assert False is True
E    +  where False = bloque_valido(8)
```

```text
1 failed, 3 passed in 0.10s
```

Ambas tienen cuatro casos y aserciones correctas en su sintaxis. La diferencia está en lo que
afirman: **las dos ejecutan el `8`**, pero una exige `False` y la otra `True`. El defecto sobrevive
en la primera porque el oráculo copió la interpretación del código.

Esto evita una conclusión demasiado amplia: mirar el código no impide encontrar defectos. Si se
conservaran los valores de la primera suite pero se corrigiera el esperado del `8` desde el
requisito, también fallaría. El problema es permitir que la implementación determine aquello contra
lo que se la juzga.

#### ¿Los defectos se concentran en los bordes?

Los bordes son candidatos razonables porque un operador estricto, un extremo desplazado o una
condición omitida cambian qué clase recibe un valor. El defecto del laboratorio muestra ese
mecanismo. Convertirlo en «la mayoría de los defectos está en los bordes» exigiría otra evidencia:
una población de programas, una definición de defecto y una medición de su distribución.

Hay investigación empírica, pero conviene conservar su alcance. Roper, Wood y Miller (1997)
compararon lectura de código, pruebas funcionales con partición y valores límite, y pruebas
estructurales. Participaron 47 estudiantes sobre programas pequeños en C. El resumen publicado por
la universidad informa eficacia individual ampliamente similar, dependencia del programa y sus
defectos, y mayor eficacia al combinar técnicas. Ese estudio no aísla el efecto de valores límite
respecto de partición ni mide una proporción universal de defectos situados en bordes.

La consecuencia para esta clase es acotada: se eligen los bordes por los errores que permiten
exponer y se conserva la combinación con otros casos. Una demostración preparada con un error de
límite sirve para entender el mecanismo; no estima su frecuencia en el software real.

### 3.3 «Justo antes» necesita una unidad; «justo en» necesita una decisión

La regla de cancelación no usa bloques enteros como entrada: compara dos instantes. El análisis
se expresa sobre la **anticipación**, calculada como `inicio_bloque - ahora`.

| Anticipación | Expectativa con el requisito disponible |
|--------------|----------------------------------------|
| Menor que dos horas | No cancelar: `False` |
| Exactamente dos horas | Pendiente: declarar si el umbral es inclusivo |
| Mayor que dos horas | Cancelar: `True` |

El tipo `timedelta` tiene resolución de un microsegundo. Para observar el umbral con esa resolución
se toma un instante fijo y se cambia solo la anticipación:

```python
from datetime import datetime, timedelta

from reservas import puede_cancelar

ahora = datetime(2026, 9, 9, 8, 0)
umbral = timedelta(hours=2)
paso = timedelta(microseconds=1)

for etiqueta, anticipacion in [
    ("un microsegundo menos", umbral - paso),
    ("exactamente dos horas", umbral),
    ("un microsegundo mas", umbral + paso),
]:
    print(etiqueta, anticipacion, puede_cancelar(ahora + anticipacion, ahora))
```

Salida literal:

```text
un microsegundo menos 1:59:59.999999 False
exactamente dos horas 2:00:00 False
un microsegundo mas 2:00:00.000001 True
```

Esta es una **observación**, no una prueba de conformidad del caso central. El `False` de las dos
horas exactas sigue sin resolver qué debería devolver. Se pueden automatizar los dos casos con
expectativa definida y registrar aparte el tercero; no corresponde inventar su esperado ni marcar
el hueco como resuelto porque la ejecución terminó.

Aquí se emplean fechas fijas sin zona horaria para aislar la comparación local. No se prueba el
reloj real, la conversión entre zonas ni cambios de horario. Si el contrato de entrada admitiera
solo minutos completos, el vecino pertinente para ese contrato sería un minuto antes o después.
**La resolución de un tipo y la precisión admitida por el producto son decisiones distintas.**

Tampoco existe un «anterior» inmediato en los números reales: entre dos siempre hay otro. En una
prueba numérica hay que declarar la representación y el paso elegido. Usar `limite - 1` por reflejo
puede significar un bloque, un segundo o una hora; sin unidad, el caso no está bien definido.

### 3.4 `pytest.approx`: una tolerancia es parte del criterio, no un arreglo del fallo

Para un número de bloque, la pertenencia es exacta. Para una duración calculada mediante operaciones
con `float`, la representación puede introducir una diferencia pequeña aunque el cálculo siga el
modelo esperado. No toda cantidad decimal se representa exactamente en binario.

Como ejemplo numérico auxiliar del laboratorio, se suman dos duraciones expresadas en horas,
`0.1` y `0.2`. Este cálculo ilustra la aritmética; no cambia la regla de cancelación:

```python
obtenido = sum([0.1, 0.2])
esperado = 0.3

print("obtenido:", repr(obtenido))
print("igualdad exacta:", obtenido == esperado)
print("error absoluto:", abs(obtenido - esperado))
```

Salida literal:

```text
obtenido: 0.30000000000000004
igualdad exacta: False
error absoluto: 5.551115123125783e-17
```

La diferencia no justifica aceptar cualquier resultado cercano a simple vista. Se declara un
criterio numérico para **este ejemplo**: error absoluto máximo de `1e-12` horas y sin tolerancia
relativa. Es un margen ilustrativo, muy superior al error de representación observado y muy inferior
a una diferencia de `0.01` horas. No es una precisión de producto deducida del requisito del
laboratorio ni una recomendación universal.

La prueba completa de esa comparación es:

```python
import pytest


def test_suma_de_duraciones() -> None:
    obtenido = sum([0.1, 0.2])
    esperado = 0.3

    assert obtenido == pytest.approx(esperado, rel=0, abs=1e-12)
```

| Pieza | Qué significa en este caso |
|-------|---------------------------|
| `esperado` | El valor de referencia: `0.3` horas. |
| `pytest.approx(...)` | Construye una comparación con tolerancia; no redondea ni modifica `obtenido`. |
| `abs=1e-12` | Tolera hasta `0.000000000001` horas de diferencia absoluta. El argumento `abs` no es una llamada a la función `abs()`. |
| `rel=0` | Desactiva el margen proporcional al esperado. |
| `==` | Compara el obtenido con ese criterio. Aquí `is` compararía identidad de objetos y sería incorrecto. |

La tolerancia **absoluta** tiene la unidad del resultado. La **relativa** es una fracción del
esperado: `rel=1e-6` permite una parte por millón. Con ambas configuradas, pytest acepta si se
satisface cualquiera; no exige las dos a la vez. Si solo se indica `abs`, no aplica su tolerancia
relativa predeterminada. Se escribe `rel=0` aquí para hacer visible la elección.

También se comprueba la sensibilidad del criterio usando un resultado deliberadamente incorrecto:

```python
import pytest

esperado = 0.3
print("0.31 con tolerancia 1e-12:", 0.31 == pytest.approx(esperado, rel=0, abs=1e-12))
print("0.31 con tolerancia 0.02:", 0.31 == pytest.approx(esperado, rel=0, abs=0.02))
```

```text
0.31 con tolerancia 1e-12: False
0.31 con tolerancia 0.02: True
```

Ampliar el margen cambió qué resultados se aceptan. La prueba puede ponerse verde porque mejoró la
implementación o porque se debilitó su exigencia; el color no permite distinguir las dos cosas.

**`approx` no decide si dos horas exactas permiten cancelar.** Esa es una regla de inclusión del
umbral. En la función del laboratorio se comparan `timedelta` y se comprueba un booleano; no hace
falta convertirlos a horas decimales ni suavizar su decisión. Del mismo modo, un contrato de
cantidades exactas puede requerir enteros en una unidad mínima o aritmética decimal, en vez de una
comparación tolerante de `float`.

Un agente puede escribir los casos vecinos y las llamadas a `approx`. Antes de aceptar el resultado
se revisan tres cosas: **de dónde salió el límite, de dónde salió el esperado y de dónde salió la
tolerancia**. Ninguna se justifica únicamente porque la suite pase. Si propone aumentar `abs` o
`rel`, debe explicar qué error numérico admite el modelo y mostrar un resultado incorrecto que la
prueba siga rechazando.

## Ejercicio del bloque

Trabaja sobre las clases enteras de bloque ya declaradas: antes de `1`, del `1` al `8`, después de
`8`. La siguiente función acepta solo los extremos de la jornada:

```python
def bloque_valido_solo_extremos(bloque: int) -> bool:
    return bloque in (1, 8)
```

1. Escribe dos filas de una parametrización que revelen el defecto, con el booleano esperado y una
   etiqueta por fila. Justifica por qué los casos `0`, `1`, `8` y `9` no lo detectan.
2. Un agente propone aceptar `0.31` horas como aproximación de `0.3` usando `abs=0.02`. Decide si
   ese cambio conserva el criterio numérico declarado en este bloque y explica por qué.
3. Registra qué falta para convertir la observación de cancelación a las dos horas exactas en una
   prueba con resultado esperado. No decidas el requisito por tu cuenta.

**Pista:** `2` y `7` son vecinos interiores de los límites válidos. Para la tolerancia, compara el
margen propuesto con el que se declaró antes de ejecutar. Para la cancelación, separa observado de
esperado.

**Evidencia esperada:** filas como `(2, True)` y `(7, True)`, con etiquetas que identifiquen los
vecinos interiores; ambas contradicen el `False` de la función. Una explicación de que `0.02`
debilita el criterio de `1e-12` horas y admite el resultado incorrecto. Y una anotación de contrato
pendiente: definir si la igualdad con dos horas permite cancelar antes de asignar `True` o `False`.

## Preguntas guía

1. Las dos suites de límites ejecutan el bloque `8`, pero solo una falla. ¿Qué demuestra eso sobre
   la diferencia entre elegir una entrada y decidir su resultado esperado?

   **Pista:** compara la tupla del `8` en ambas listas; la discrepancia no está en la sintaxis.

2. ¿Qué información hace falta para escribir «justo antes del límite» cuando el parámetro deja de
   ser un bloque entero y pasa a ser un instante o una duración?

   **Pista:** identifica dominio, unidad, resolución y pertenencia del límite a una clase.

3. ¿Por qué sería correcto tolerar una pequeña diferencia al sumar duraciones con `float`, pero
   incorrecto usar esa tolerancia para decidir la inclusión de las dos horas de cancelación?

   **Pista:** un caso trata sobre error numérico y el otro sobre una decisión del requisito.

La elección de valores ya tiene un argumento y una forma de comprobarse. Falta combinar reglas:
un bloque válido puede estar ocupado, y un estudiante puede haber alcanzado su máximo semanal.
Probar los bordes de cada parámetro por separado no explica qué debe ocurrir cuando esas condiciones
coinciden. Esa pregunta se organiza con una tabla de decisión.

## Fuentes técnicas del bloque

- [ISO/IEC/IEEE 29119-4:2021, vista previa de la publicación final](https://cdn.standards.iteh.ai/samples/79430/6c93dfe4a05b46a8895e04dfd74ddd24/ISO-IEC-IEEE-29119-4-2021.pdf) — cláusula 3.3, página numerada 1: análisis de valores límite basado en los bordes de las particiones de equivalencia.
- [ISTQB — CTFL Syllabus v4.0.1](https://istqb.org/wp-content/uploads/2024/11/ISTQB_CTFL_Syllabus_v4.0.1.pdf) — sección 4.2.2, página 40: variantes de dos y tres valores. La tabla de los bloques es una aplicación desarrollada sobre las tres particiones de este laboratorio.
- [Roper, Wood y Miller — *An Empirical Evaluation of Defect Detection Techniques* (1997)](https://pureportal.strath.ac.uk/en/publications/an-empirical-evaluation-of-defect-detection-techniques/) — resumen de los autores en el portal de University of Strathclyde: diseño, participantes y conclusiones del estudio; se conserva la limitación de que la técnica funcional combina partición y valores límite.
- [Python — `timedelta.resolution`](https://docs.python.org/3/library/datetime.html#datetime.timedelta.resolution) — resolución de un microsegundo para diferencias temporales.
- [Python — Aritmética de punto flotante: problemas y limitaciones](https://docs.python.org/3/tutorial/floatingpoint.html) — representación binaria de fracciones decimales y diferencias entre valores matemáticos y representados.
- [pytest — Referencia de `pytest.approx`](https://docs.pytest.org/en/stable/reference/reference.html#pytest-approx) — parámetros `abs` y `rel`, comparación con tolerancia y combinación de ambos márgenes.
- Ejecuciones con Python 3.12.12 y pytest 9.1.1: comparación de las dos suites de límites sobre la función heredada, sensibilidad de las variantes ante una función que acepta solo extremos, observación temporal con paso de un microsegundo y comparación numérica con dos tolerancias. Las salidas incluidas son fragmentos literales de esas ejecuciones.

---

# BLOQUE 4: Tablas de decisión — combinar reglas y leer lo que la prueba exige

- **Duración:** 30 minutos.
- **Objetivo del bloque:** construir y reducir una tabla de decisión conservando su significado,
  convertir sus reglas en pruebas, comprobar una excepción esperada y explicar qué verifica una
  prueba ajena a partir de su preparación, ejecución y afirmación.
- **Modalidad:** trabajo individual, con lectura de tablas y auditoría de código.
- **Ritmo sugerido:** 8 minutos para construir y reducir la tabla, 6 para ejecutarla, 8 para
  comprender `raises`, 4 para el vocabulario entre entornos y 4 para el ejercicio.

## Desarrollo

### 4.1 Tres condiciones no son tres pruebas

Un bloque puede pertenecer a la jornada y estar ocupado. Un estudiante puede encontrar un bloque
libre y haber alcanzado su máximo semanal. La decisión de permitir una reserva depende de que las
reglas se cumplan **juntas**.

Una **tabla de decisión** organiza condiciones y resultados esperados. Cada columna expresa una
regla: una combinación de condiciones y lo que debe ocurrir cuando se cumple. ISO/IEC/IEEE
29119-4:2021 distingue la tabla, la regla y la técnica de prueba en sus cláusulas 3.22 a 3.24;
ISTQB CTFL desarrolla su construcción y reducción en la sección 4.2.3.

Para el laboratorio se definen tres condiciones, leídas desde el requisito:

| Condición | Pregunta | Cómo se interpreta |
|-----------|----------|--------------------|
| **V: bloque válido** | ¿Pertenece a la jornada? | El entero está entre `1` y `8`, incluidos. |
| **L: bloque libre** | ¿Está disponible para reservar? | El argumento `tomado` es `False`. |
| **C: cupo semanal** | ¿Puede agregar una reserva sin superar el máximo? | Tiene menos de tres reservas activas. Se consideran los estados declarados `0`, `1`, `2` y `3`. |

Las condiciones se expresan en positivo para facilitar la lectura. En particular, **L no es el
argumento `tomado`: es su negación**. Traducir una tabla a código exige conservar esa diferencia.

Con tres condiciones booleanas hay `2 × 2 × 2 = 8` combinaciones de verdad. La tabla completa es:

| Condición / resultado | T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 |
|-----------------------|----|----|----|----|----|----|----|----|
| V: bloque válido | T | T | T | T | F | F | F | F |
| L: bloque libre | T | T | F | F | T | T | F | F |
| C: cupo semanal | T | F | T | F | T | F | T | F |
| **Permitir reserva** | **T** | **F** | **F** | **F** | **F** | **F** | **F** | **F** |

`T` significa verdadero y `F`, falso. La última fila es el booleano que se espera de
`puede_reservar()`. Solo T1 permite reservar: las tres condiciones se cumplen.

Esta tabla modela entradas de la función. Un número fuera de la jornada no identifica un bloque
real cuya ocupación deba consultarse, pero la función igualmente puede recibir ese número junto
con cualquiera de los dos valores de `tomado`; ambos deben terminar en rechazo. No se están
afirmando ocho situaciones físicas distintas del laboratorio.

#### Reducir exige demostrar qué dejó de importar

Si V es falsa, cambiar L o C no cambia el rechazo. Las cuatro columnas T5 a T8 se pueden agrupar.
Si V es verdadera y L es falsa, C tampoco cambia el resultado: T3 y T4 se agrupan. Queda:

| Condición / resultado | R1 | R2 | R3 | R4 |
|-----------------------|----|----|----|----|
| V: bloque válido | F | T | T | T |
| L: bloque libre | — | F | T | T |
| C: cupo semanal | — | — | F | T |
| **Permitir reserva** | **F** | **F** | **F** | **T** |
| Columnas representadas | T5–T8 | T3–T4 | T2 | T1 |
| Cantidad de combinaciones | 4 | 2 | 1 | 1 |

El signo **— significa que ambos valores conducen al mismo resultado en esa regla**. No significa
desconocido, sin especificar ni «no se probó». Por eso no serviría para esconder la decisión
pendiente de cancelación a las dos horas: allí todavía no se sabe cuál es el resultado correcto.

Se revisa la reducción expandiendo sus condiciones indiferentes. Para cada combinación original
debe existir una regla reducida que produzca el mismo resultado. Esta tabla además es disjunta:
cada combinación coincide con exactamente una columna. Comprobación ejecutada sobre las ocho:

```text
combinaciones: 8
combinaciones por regla: {'R1': 4, 'R2': 2, 'R3': 1, 'R4': 1}
huecos: 0; solapamientos: 0; desacuerdos con la tabla completa: 0
```

No se eliminaron requisitos; se comprimió su representación. Eso no demuestra que ejecutar un
solo caso por columna compruebe todas sus combinaciones en la implementación. **La equivalencia
entre tablas es una propiedad del modelo; la conformidad del programa requiere evidencia aparte.**

Tampoco se exige que el código evalúe las condiciones en el orden de las filas. La tabla declara
resultados. Si el contrato exigiera además un mensaje distinto por cada motivo de rechazo, habría
que añadir esas salidas y volver a revisar si las columnas se pueden agrupar.

### 4.2 De una columna lógica a una fila ejecutable

Para ejecutar las cuatro reglas reducidas se eligen representantes concretos:

| Regla | Reservas activas | Bloque | `tomado` | Esperado | Qué representa |
|-------|------------------|--------|----------|----------|----------------|
| R1 | `1` | `0` | `False` | `False` | Fuera de la jornada. |
| R2 | `1` | `4` | `True` | `False` | Dentro, pero ocupado. |
| R3 | `3` | `4` | `False` | `False` | Dentro y libre, sin cupo semanal. |
| R4 | `1` | `4` | `False` | `True` | Las tres condiciones permiten reservar. |

En R1 se fijaron reservas y ocupación aunque la tabla diga —: **la función necesita argumentos
concretos para ejecutarse**. Lo indiferente es su efecto esperado sobre esa decisión, no la
necesidad de proporcionar un valor.

La traducción usa la misma parametrización del Bloque 2, ahora con cuatro nombres:

```python
import pytest

from reservas import puede_reservar


@pytest.mark.parametrize(
    ("reservas", "bloque", "tomado", "esperado"),
    [
        (1, 0, False, False),
        (1, 4, True, False),
        (3, 4, False, False),
        (1, 4, False, True),
    ],
    ids=["R1-fuera-jornada", "R2-ocupado", "R3-sin-cupo", "R4-permitida"],
)
def test_reglas_de_reserva(
    reservas: int, bloque: int, tomado: bool, esperado: bool
) -> None:
    obtenido = puede_reservar(reservas, bloque, tomado)
    assert obtenido is esperado
```

Los cuatro representantes pasan sobre la implementación heredada. Para hacer visible lo que no
cubren, se agrega un caso de R4 con un representante del límite:

```python
def test_regla_permitida_incluye_el_bloque_8() -> None:
    assert puede_reservar(1, 8, tomado=False) is True
```

Ejecución sobre el mismo módulo, con ambos fragmentos:

```bash
uv run pytest test_decisiones.py -q --tb=short
```

Recortes literales; se omiten el encabezado y los separadores:

```text
E   assert False is True
E    +  where False = puede_reservar(1, 8, tomado=False)
```

```text
1 failed, 4 passed in 0.10s
```

El quinto caso no descubre una quinta regla: comprueba R4 con un valor que la implementación trata
mal. Las técnicas se complementan: la tabla selecciona una combinación de condiciones, la partición
identifica sus clases y el análisis de límites ayuda a elegir un representante sensible al defecto.

Por eso «cuatro reglas representadas» no equivale a «todas las entradas verificadas». Entre lo que
queda fuera están otras elecciones de valores dentro de las clases, cantidades de reservas fuera
de los estados declarados, tipos inesperados y efectos concurrentes. La función booleana tampoco
demuestra que una reserva llegue a guardarse correctamente: decide si se permite.

### 4.3 Cuando lo esperado es que la función lance una excepción

La función heredada devuelve `False` cuando rechaza una reserva. **Devolver un booleano y lanzar
una excepción son contratos distintos.** No corresponde envolver esa función en `raises` solo
porque el caso use una entrada inválida.

Para estudiar una excepción se define una función auxiliar con un contrato explícito: recibe un
número entero de bloque, devuelve ese mismo número si está entre `1` y `8`, y fuera de ese rango
lanza `ValueError` con el mensaje `bloque fuera de jornada`. El tratamiento de otros tipos queda
fuera de este ejemplo. Es una función nueva para ejercitar ese contrato, no una modificación de
`puede_reservar()`:

```python
def exigir_bloque(bloque: int) -> int:
    if not 1 <= bloque <= 8:
        raise ValueError("bloque fuera de jornada")
    return bloque
```

`raise` interrumpe la ejecución normal y lanza la excepción. En ese recorrido no se alcanza el
`return`. La prueba debe exigir precisamente ese desenlace:

```python
import pytest

from validacion import exigir_bloque


@pytest.mark.parametrize("bloque", [0, 9], ids=["antes", "despues"])
def test_rechaza_bloques_fuera_de_jornada(bloque: int) -> None:
    with pytest.raises(ValueError, match="^bloque fuera de jornada$"):
        exigir_bloque(bloque)
```

| Pieza | Qué hace |
|-------|----------|
| `with` | Delimita un bloque cuya entrada y salida administra un gestor de contexto. Aquí ese gestor es `pytest.raises(...)`. |
| `pytest.raises(ValueError, ...)` | Exige que el bloque lance `ValueError` o una subclase; si no ocurre, la prueba falla. |
| La llamada indentada | Es la operación vigilada. Debe ejecutarse dentro del `with`. |
| `match=...` | Comprueba el mensaje mediante una expresión regular. `^` y `$` delimitan el texto esperado en este ejemplo. |
| Salir del `with` | Si ocurrió la excepción esperada y el mensaje coincide, la prueba continúa después del bloque. |

Si aparece otro tipo de excepción, la prueba falla. Si aparece `ValueError` con otro mensaje,
también falla esta expectativa. Se comprueba el mensaje porque forma parte del contrato auxiliar;
en otros casos puede ser suficiente el tipo o un fragmento estable del mensaje.

Aunque no haya una sentencia `assert`, **sí hay una comprobación**: el gestor exige la excepción.
Esto permite leer pruebas por lo que afirman, no contando cuántas veces aparece una palabra.

Ejecución de los dos casos con Python 3.12.12 y pytest 9.1.1:

```bash
uv run pytest test_errores.py -q --tb=short
```

```text
2 passed in 0.01s
```

También se verificó la sensibilidad de la prueba en una copia aislada: al sustituir el `raise`
por `return bloque`, ambos casos fallaron. Fragmentos literales:

```text
E   Failed: DID NOT RAISE ValueError
```

```text
2 failed in 0.09s
```

El fallo dice «no lanzó `ValueError`». No dice que devolver un valor sea siempre incorrecto: es
incorrecto para esa entrada **según este contrato**. La copia se restituyó después del experimento.

Hay otra consecuencia de la interrupción: una comprobación colocada después de la llamada, pero
todavía indentada dentro del `with`, no se ejecuta si la llamada lanza la excepción esperada.
Para inspeccionar la excepción capturada se puede usar `as error` y consultar `error.value`
después del bloque. La preparación de datos debe quedar fuera: conviene que el `with` encierre
solo la operación cuyo error se quiere comprobar.

### 4.4 Leer una prueba ajena: preparación, ejecución y afirmación

Una prueba se puede leer en tres preguntas, independientemente de quién la escribió:

| Parte | Pregunta de lectura | En la prueba de reserva |
|-------|---------------------|-------------------------|
| **Preparar** (*Arrange*) | ¿Qué datos y estado se fijaron? | La fila entrega reservas, bloque, ocupación y esperado. |
| **Ejecutar** (*Act*) | ¿Qué operación del sistema se puso a prueba? | La llamada a `puede_reservar()`. |
| **Afirmar** (*Assert*) | ¿Qué discrepancia haría fallar la prueba? | Que el booleano obtenido no sea el esperado. |

Las partes son responsabilidades, no necesariamente tres párrafos de código. En la prueba con
`raises`, la expectativa se declara **antes** de ejecutar la operación vigilada. En sistemas que
crean archivos, datos o conexiones puede haber además limpieza posterior; estos ejemplos puros no
necesitan esa fase.

El vocabulario cambia entre herramientas, pero se puede reconocer la misma exigencia de un
booleano verdadero. Los fragmentos suponen que `obtenido` contiene ese booleano y que la biblioteca
correspondiente está importada o habilitada:

| Entorno | Fragmento | Cómo se lee |
|---------|-----------|-------------|
| Python / pytest | `assert obtenido is True` | Exige el booleano `True`. |
| TypeScript / Vitest | `expect(obtenido).toBe(true)` | `expect` recibe el obtenido; `toBe` aplica la comparación. |
| Java / AssertJ | `assertThat(obtenido).isTrue()` | `assertThat` inicia la afirmación; `isTrue` exige verdadero. |
| JavaScript / Chai, estilo `should` habilitado | `obtenido.should.equal(true)` | Encadena la expectativa mediante `should`. |

`expect`, `assertThat` y `should` no son palabras universales del lenguaje ni significan «ejecutar
un test». Son entradas a APIs de aserciones. El método que sigue —a menudo llamado *matcher*—
determina qué comparación se realiza. En Vitest, `toBe` usa `Object.is`; para comparar por
estructura dos objetos diferentes se dispone de `toEqual`. Las formas de comparación no se
intercambian solo porque sus nombres suenen parecidos.

Con excepciones cambia también quién ejecuta la operación. En un fragmento síncrono de Vitest:

```typescript
expect(() => exigirBloque(9)).toThrow(Error);
```

`() => exigirBloque(9)` entrega una función para que la aserción pueda llamarla y observar su error.
`expect(exigirBloque(9))` la ejecutaría antes de que el comprobador pudiera capturarlo. Se usa
`Error` como ejemplo de tipo en JavaScript; no es una traducción automática del `ValueError` de
Python ni verifica el mensaje del contrato anterior.

#### Una prueba verde que captura su propio fracaso

Este código parece comprobar el bloque `8`, pero su exigencia real es otra:

```python
import pytest

from reservas import puede_reservar


def test_que_oculta_el_defecto() -> None:
    with pytest.raises(Exception):
        assert puede_reservar(1, 8, tomado=False) is True
```

Sobre la implementación defectuosa, se ejecutó y dio:

```text
1 passed in 0.01s
```

La función devuelve `False`; el `assert` lanza `AssertionError`. Como `AssertionError` es una
subclase de `Exception`, el `raises` lo acepta y marca la prueba como pasada. **La prueba exigía
que se produjera alguna excepción, incluida la de su propia aserción.**

La corrección es conservar la aserción booleana y quitar el `raises`: el contrato de
`puede_reservar()` no exige una excepción. Así vuelve a aparecer el fallo del bloque `8`.
Comprender esta diferencia permite auditar una prueba generada por un agente aunque esté bien
formateada, tenga un nombre convincente y termine en verde.

## Ejercicio del bloque

1. Expande R2 de la tabla reducida en sus dos combinaciones completas. Elige entradas concretas
   para ambas y escribe sus resultados esperados. Indica por qué `tomado` debe ser `True`.
2. Explica el recorrido de `test_que_oculta_el_defecto()` en tres pasos y escribe su corrección.
   Nombra qué lanza la excepción: la función del sistema o la aserción.
3. Un agente cambia `False` por `True` en el esperado de una fila de rechazo porque la prueba
   fallaba. Escribe qué referencia necesitaría justificar ese cambio y qué evidencia faltaría si
   solo mostrara una nueva ejecución en verde.

**Pista:** R2 tiene V verdadera y L falsa; C puede ser verdadera o falsa. Para el código engañoso,
sigue el tipo de excepción desde el lugar donde se lanza hasta quien lo captura.

**Evidencia esperada:** T3 y T4, por ejemplo `(reservas=1, bloque=4, tomado=True)` y
`(reservas=3, bloque=4, tomado=True)`, ambas con `False` esperado. Una explicación de que el
`AssertionError` nace del `assert` y es capturado por `raises(Exception)`. La prueba corregida
exige `True` para la reserva permitida del bloque `8` sin envolverla en `raises`. Para cambiar un
esperado se necesita una modificación o aclaración justificada del requisito, no conformidad con
la salida actual de la implementación.

## Preguntas guía

1. ¿Qué permite reemplazar dos valores de una condición por — y por qué ese símbolo no resuelve
   el caso de cancelación a las dos horas exactas?

   **Pista:** distingue resultado invariable de resultado todavía desconocido.

2. ¿Por qué una prueba sin `assert` puede comprobar correctamente una excepción, mientras otra
   que sí contiene `assert` puede esconder el defecto?

   **Pista:** localiza qué se exige, qué excepción se lanza y quién la captura.

3. ¿Qué falta verificar después de afirmar que una suite representa las cuatro reglas reducidas?

   **Pista:** distingue reglas del modelo, representantes concretos, límites y efectos del sistema
   que la función booleana no observa.

## Fuentes técnicas del bloque

- [ISO/IEC/IEEE 29119-4:2021, vista previa de la publicación final](https://cdn.standards.iteh.ai/samples/79430/6c93dfe4a05b46a8895e04dfd74ddd24/ISO-IEC-IEEE-29119-4-2021.pdf) — cláusulas 3.22 a 3.24: regla, tabla de decisión y técnica de prueba.
- [ISTQB — CTFL Syllabus v4.0.1](https://istqb.org/wp-content/uploads/2024/11/ISTQB_CTFL_Syllabus_v4.0.1.pdf) — sección 4.2.3, página 41: condiciones, resultados, reglas completas y reducción de tablas.
- [pytest — Excepciones esperadas](https://docs.pytest.org/en/stable/how-to/assert.html#assertions-about-expected-exceptions) — `pytest.raises`, subclases, captura de la excepción y comprobación de mensajes.
- [pytest — Anatomía de una prueba](https://docs.pytest.org/en/stable/explanation/anatomy.html) — preparación, acción, afirmación y limpieza cuando corresponde.
- [Vitest — `expect`](https://vitest.dev/api/expect.html) — `toBe`, `toEqual` y `toThrow`; este último recibe una función para observar una excepción síncrona.
- [AssertJ — Aserciones para Java](https://assertj.github.io/doc/) y [Chai — Estilos `expect` y `should`](https://www.chaijs.com/api/bdd/) — vocabulario de aserciones en otros entornos.
- Ejecuciones con Python 3.12.12 y pytest 9.1.1: expansión de las cuatro reglas a ocho combinaciones; pruebas de reserva y su complemento del bloque `8`; excepción esperada y su desaparición controlada; prueba engañosa que captura su propio `AssertionError`. Los fragmentos en TypeScript, Java y Chai son ejemplos de lectura contrastados con su documentación; las ejecuciones registradas corresponden a Python.

---

# Cierre: justificar la muestra y poder leer su evidencia

- **Duración:** 10 minutos.
- **Propósito:** conectar las técnicas de selección con las comprobaciones ejecutables y formular
  una conclusión que no exceda lo probado.
- **Ritmo sugerido:** 3 minutos para la síntesis, 4 para el ticket de salida y 3 para la afirmación
  final y la pregunta que abre la próxima sesión.

## 1. Tres técnicas, tres preguntas que se complementan

| Técnica | Pregunta que responde | Producto del laboratorio | Lo que no garantiza |
|---------|----------------------|--------------------------|---------------------|
| Partición de equivalencia | ¿Qué valores se espera que reciban un trato similar? | Tres clases de bloque con representantes y expectativas. | Que todos los miembros se comporten como el representante. |
| Valores límite | ¿Qué ocurre donde cambia la pertenencia a una clase? | Casos a ambos lados de la jornada y observación del umbral de cancelación. | Que el interior no tenga defectos ni que un umbral ambiguo se resuelva solo. |
| Tabla de decisión | ¿Qué debe ocurrir cuando coinciden varias condiciones? | Ocho combinaciones de V, L y C representadas mediante cuatro reglas. | Que ejecutar un representante por regla compruebe todas las entradas o todos los efectos. |

Las tres parten de una expectativa externa a la implementación. Una tabla bien escrita puede
orientar tanto a una persona como a un agente; su valor está en que permita reconstruir por qué se
eligió un caso y qué resultado se exigió.

La sintaxis convierte esa decisión en evidencia ejecutable:

| Decisión de prueba | Cómo se expresa |
|--------------------|-----------------|
| Exigir un booleano exacto | `assert obtenido is esperado` |
| Repetir la comprobación para filas distintas | `@pytest.mark.parametrize(...)` |
| Admitir un error numérico justificado | `assert obtenido == pytest.approx(...)` con tolerancias declaradas |
| Exigir una excepción del sistema | `with pytest.raises(...)` alrededor de la operación pertinente |

Ninguna de esas formas reemplaza la lectura del contrato. Una aserción puede estar perfectamente
escrita y exigir lo equivocado; una excepción puede estar correctamente capturada y venir del lugar
equivocado. Saber leer pruebas consiste en poder explicar ambos lados de la comparación y qué
comportamiento haría fallar el caso.

## 2. La afirmación que se puede sostener

El procedimiento de auditoría permitió afirmar:

```text
La comparacion se hizo con un procedimiento declarado,
y su resultado puede repetirlo alguien que no estuvo.
```

El diseño de casos agrega una justificación de la selección:

```text
Los casos elegidos tienen un argumento: representan clases, limites y reglas.
Cada expectativa tiene una referencia, y las omisiones estan declaradas.
```

Lo que todavía no permite afirmar:

```text
El sistema funciona para todas las entradas y no tiene mas defectos.
```

En el laboratorio quedó evidencia concreta de ese límite: representantes en verde que omiten el
bloque `8`, un esperado copiado del código que normaliza su rechazo y una prueba que captura su
propio fallo. La reserva del `8` continúa fallando contra el requisito; las dos horas exactas de
cancelación continúan pendientes de decisión. Concluir la clase no convierte esos asuntos en
resueltos.

## 3. Ticket de salida

Responde individualmente sobre el laboratorio, sin asumir otro proyecto:

1. Elige el caso `puede_reservar(1, 8, tomado=False)`. Identifica su clase de bloque, el límite que
   representa, la regla de decisión que le corresponde y la expectativa que debe exigirse.
2. Explica por qué `pytest.raises(Exception)` alrededor de su aserción no demuestra que se permita
   reservar y escribe la comprobación apropiada.
3. Declara una omisión de las pruebas de hoy y qué información o evidencia haría falta para
   abordarla. Separa una decisión de requisito pendiente de una ejecución pendiente.

**Criterio de comprobación:** la primera respuesta debe conectar clase válida, extremo superior,
R4 y `True`. La segunda debe conservar una aserción booleana sin capturar su `AssertionError`.
La tercera debe nombrar algo concreto: por ejemplo, resolver la inclusión de las dos horas antes
de fijar su esperado, o comprobar la persistencia real de la reserva con otra prueba.

## 4. Próxima sesión: qué se aprende mirando dentro

Las técnicas basadas en especificación organizan lo que el sistema debe hacer. Falta relacionar
esas pruebas con lo que efectivamente recorren dentro del programa: decisiones, ramas y código
ejecutado. Esa es la comparación entre caja negra y caja blanca.

La cobertura permitirá observar parte de ese recorrido, pero habrá que preguntar qué se comprobó
al recorrerlo. También aparecerán los dobles de prueba: sustitutos de dependencias que ayudan a
aislar un comportamiento y pueden dejar fuera justamente la interacción que interesaba verificar.
Para leer esa evidencia harán falta las dos capacidades ejercitadas hoy: justificar el caso y
entender su afirmación.

## Mensaje final

La autonomía se conserva practicando también la escritura: tomar una regla, elegir una entrada y
redactar una prueba pequeña sin generación asistida. Después se puede contrastar y ampliar con
herramientas. Poder explicar, reconstruir y corregir ese código mantiene disponible el conocimiento
aunque cambien las herramientas o dejen de estar disponibles.

> Elegir casos es decidir qué evidencia se va a buscar y qué quedará fuera. Escribir una prueba es
> volver esa decisión comprobable. Un agente puede ayudar en ambas tareas; el criterio se conserva
> cuando se puede explicar de dónde salió cada esperado, qué haría fallar la prueba y qué no se
> podrá concluir aunque termine en verde.

---
