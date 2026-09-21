# Clase 10 - Semana 04 - Recorrer no es verificar: cobertura, dobles de prueba y el verde que no significa nada

- **Unidad:** 02 · Desarrollo y Ejecución de Casos de Prueba
- **Fecha:** Lunes 21 de septiembre de 2026
- **Duración:** 3 horas pedagógicas · 140 minutos (08:30 - 10:50)
- **Modalidad:** Presencial en Laboratorio PC
- **Docente:** Diego Obando
- **Marco de referencia:** ISO/IEC/IEEE 29119-4:2021 · técnicas basadas en estructura y medidas de cobertura · `pytest` · `pytest-cov` y `coverage.py` · `unittest.mock` · taxonomía de dobles de prueba de Gerard Meszaros

---

# Objetivos de la Clase

## Objetivo General

Al finalizar esta sesión, el estudiante será capaz de decir qué mide exactamente un número de
cobertura y qué sigue sin saberse cuando ese número llega a 100 %. Para eso distinguirá las dos
preguntas que se le pueden hacer a una misma prueba —qué comportamiento especificado comprueba, que
es la mirada de caja negra, y qué partes del programa recorre al hacerlo, que es la mirada de caja
blanca— y usará las técnicas basadas en estructura de ISO/IEC/IEEE 29119-4:2021 para medir ese
recorrido sobre la suite que él mismo escribió en la sesión anterior.
Sobre esa medición comprobará el hecho central de la clase: la cobertura registra ejecución y no
verificación, de modo que una línea recorrida por una prueba que no afirma nada cuenta igual que
una línea recorrida por una prueba que sí afirma.
Después incorporará los dobles de prueba —el sustituto que ocupa el lugar de una dependencia real
durante la ejecución— sabiendo nombrarlos, elegir el que corresponde y reconocer el punto en que
el doble deja de aislar el comportamiento y pasa a reemplazarlo, que es el mecanismo por el cual
una suite puede llegar al 100 % comprobando únicamente los supuestos de quien la escribió.
Y aplicará las dos lecturas a los casos que produce un agente, que tiende a generar recorrido en
abundancia y afirmación en escasez.

## Objetivos Específicos

1. **Distinguir caja negra de caja blanca como dos fuentes de información y no como dos calidades
   de prueba**, reconociendo que una misma prueba puede mirarse de las dos maneras: la técnica con
   la que se eligió el caso determina qué puede afirmar sobre el comportamiento, y la estructura
   que recorre al ejecutarse determina qué parte del programa quedó observada. La sesión anterior
   trabajó solo el primer eje; hoy se agrega el segundo.
2. **Medir la cobertura de una suite propia y leer el informe línea por línea**, ejecutando la
   medición sobre el proyecto de reserva y nombrando con precisión qué significa cada columna del
   reporte, qué es una sentencia no cubierta, qué es una rama no cubierta y por qué el total
   agregado es la cifra menos informativa de todo el informe.
3. **Explicar la diferencia entre cobertura de sentencias y cobertura de ramas** sobre un caso donde
   la primera informa 100 % y la segunda no, entendiendo por qué una condición sin alternativa
   explícita deja un camino sin recorrer aunque no quede ninguna línea sin ejecutar, y por qué esa
   diferencia decide qué medida conviene exigir en un proyecto.
4. **Demostrar que la cobertura no mide verificación**, construyendo una prueba que ejecuta una
   función completa sin afirmar nada sobre su resultado y constatando que el informe la cuenta
   exactamente igual que a una prueba con aserción; y formular, a partir de ahí, la pregunta que sí
   discrimina: qué tendría que cambiar en el código para que esta prueba falle.
5. **Nombrar y elegir un doble de prueba** dentro de una taxonomía precisa —dummy, stub, spy, mock
   y fake—, justificando cuál corresponde según lo que se quiere aislar, y reconociendo el momento
   en que el doble deja de representar la conducta de la dependencia y pasa a codificar el supuesto
   del autor, con la consecuencia de que la prueba ya no puede fallar por la razón correcta.
6. **Auditar un conjunto de casos generado por un agente** con un procedimiento fijo y repetible:
   de dónde salió cada resultado esperado, qué haría fallar cada prueba, qué dependencias quedaron
   sustituidas sin declararlo y qué afirma realmente la suite completa más allá del porcentaje que
   informa.

## Competencias Transversales

- **Desconfiar de un indicador agregado:** un número único y alto es cómodo de reportar y fácil de
  alcanzar por vías que no mejoran nada; la competencia profesional consiste en preguntar qué se
  está contando antes de celebrar cuánto se contó.
- **Nombrar antes de usar:** trabajar con el vocabulario exacto de los dobles de prueba en lugar de
  llamar «mock» a cualquier sustituto, porque la palabra elegida es la que revela si la prueba
  verifica un resultado o verifica una interacción.
- **Sostener una distinción incómoda:** aceptar que verde no significa correcto, y que una suite
  puede estar simultáneamente completa según la métrica y vacía según la evidencia.
- **Autonomía técnica:** medir, leer y corregir la propia suite sin depender de que una herramienta
  interprete el informe; el porcentaje lo calcula la máquina, el juicio sobre qué significa no.
- **Auditar lo que uno mismo produjo:** aplicar al propio trabajo, y al del agente que lo asistió,
  el mismo escrutinio que se aplicaría al código de un tercero.

---

# Mapa de la Clase

| Horario | Sección | Propósito |
|---------|---------|-----------|
| 08:30 - 08:40 | Encuadre | Retomar la frase de Dijkstra que la sesión anterior dejó sin respuesta —que la única esperanza está en no tratar el mecanismo como una caja negra— y constatar que, con el defecto del bloque 8 ya corregido, la suite quedó en verde y pasar dejó de informar algo. Recordar que hoy cierra el plazo de envío de la primera evaluación parcial. |
| 08:40 - 09:10 | Bloque 1 | Caja negra y caja blanca como dos preguntas distintas sobre una misma prueba. Situar las técnicas ya trabajadas como basadas en especificación e incorporar la mirada estructural, midiendo por primera vez el recorrido real de la suite propia. |
| 09:10 - 09:35 | Bloque 2 | Qué cuenta exactamente la cobertura: sentencias y ramas, y la distancia entre ambas. La prueba que recorre todo el código y no afirma nada, y la pregunta que sustituye al porcentaje. |
| 09:35 - 09:45 | Pausa | Descanso técnico. |
| 09:45 - 10:15 | Bloque 3 | Dobles de prueba: para qué se sustituye una dependencia, cómo se llama cada sustituto y dónde está el límite. Reconstruir el mecanismo por el que una suite mockeada llega al 100 % comprobando solo sus propios supuestos. |
| 10:15 - 10:40 | Bloque 4 | Casos generados por un agente, auditados con las dos lecturas de la clase: qué recorre la suite que entregó, qué afirma, qué sustituyó sin avisar y qué parte del criterio sigue siendo del estudiante. |
| 10:40 - 10:50 | Cierre | Consolidar la diferencia entre recorrer y verificar, y dejar planteado lo que ninguna medición resuelve: decidir qué debe cumplir el código antes de escribirlo. |

> Se trabaja sobre el mismo proyecto de reserva de laboratorio de las dos sesiones anteriores, ahora
> con una dependencia externa incorporada: la confirmación de una reserva sale del sistema hacia un
> servicio que no está bajo su control. Esa dependencia es la que vuelve necesario un doble de
> prueba, y la que permite ver en qué momento el doble deja de ayudar. El dominio ya es conocido y
> la suite ya está escrita, así que el foco puede ponerse entero en medirla y en leer lo que la
> medición sí dice.

## Punto de partida: una medición no es un veredicto

Una herramienta de cobertura informa un hecho verificable: qué líneas y qué ramas se ejecutaron
mientras corrían las pruebas. Ese hecho es cierto y es útil. Lo que no informa es si al ejecutarlas
se comprobó algo, y esa segunda pregunta no tiene respuesta automática.

El recorrido de trabajo de la sesión es **medir → interpretar → refutar → decidir**. Se mide con la
herramienta, se interpreta qué dice exactamente el informe, se busca un caso que contradiga la
lectura cómoda del número, y recién entonces se decide qué prueba falta. Cada porcentaje que
aparezca en pantalla debe poder explicarse antes de usarse como argumento, y cada sustitución de
una dependencia debe poder justificarse antes de escribirla.

---

# BLOQUE 1: Dos preguntas sobre la misma prueba

- **Duración:** 30 minutos
- **Objetivo del bloque:** establecer qué separa realmente una prueba derivada de la especificación
  de una derivada de la estructura, que no es quién la escribe sino de qué modelo se obtuvo el caso,
  y medir por primera vez qué partes del programa ejecuta una suite. Al finalizar, el estudiante
  debe poder tomar cualquier prueba de su suite y decir de dónde salió su resultado esperado, y leer
  un informe de cobertura para nombrar el código que ninguna prueba ejecutó.
- **Modalidad:** exposición con medición en vivo sobre el proyecto, y registro escrito individual.
- **Ritmo sugerido:** 5 minutos para la cita de Dijkstra, 7 para el contraste con la norma y el
  glosario, 6 para la distinción por modelo de prueba, 8 para la medición y 4 para la consecuencia y
  el ejercicio.

## Desarrollo

### 1.1 La frase de Dijkstra que quedó sin respuesta

Dijkstra, después de demostrar que probar un multiplicador de 27 bits por fuerza bruta tomaría diez
mil años, escribió:

> A convincing demonstration of correctness being impossible as long as the mechanism is regarded as
> a black box, our only hope lies in not regarding the mechanism as a black box.

> Siendo imposible una demostración convincente de corrección mientras el mecanismo se considere una
> caja negra, nuestra única esperanza está en no considerarlo una caja negra.

*(Las citas en inglés aparecen primero en su texto original y debajo en traducción. El texto
literal es el que vale; la traducción está para leerlo.)*

Las tres técnicas de la sesión anterior —partición, valores límite y tabla de decisión— hacen
exactamente lo contrario de lo que Dijkstra recomienda: derivan sus casos del requisito y tratan el
programa como una caja cerrada. Funcionaron: encontraron el defecto del bloque 8. La frase, en
cambio, sigue en pie.

El proyecto llega con ese defecto corregido. `bloque_valido()` compara ahora con `<=` y la jornada
declarada del 1 al 8 quedó completa. La suite escrita en la sesión anterior —tres casos de
partición, cuatro de límites, cuatro reglas de la tabla de decisión y el caso del bloque 8— se
ejecuta así:

```bash
uv run pytest -q
```

```text
............                                                             [100%]
12 passed in 0.04s
```

Doce casos, doce en verde.

Antes de seguir conviene fijar dos palabras que van a trabajar sin parar durante toda la sesión. Una
**suite** es el conjunto completo de pruebas que se ejecutan juntas: esos doce casos son una suite.
Y una **aserción** es la línea de una prueba que compara lo obtenido con lo esperado y decide si
pasa o falla; en Python es la que empieza con `assert`. De ahí se sigue algo que parece obvio y no
lo es: una prueba **sin** aserción se ejecuta igual que las demás, pero no tiene con qué fallar.

Con eso dicho, una suite en verde deja de informar algo nuevo: pasa. La pregunta que sigue no es
cuántas pruebas hay ni si pasan, sino **qué partes del programa se ejecutaron mientras pasaban**.
Esa pregunta no se puede responder leyendo la suite: hay que medirla.

### 1.2 «Hay pruebas de caja negra y pruebas de caja blanca», contrastado con las fuentes

Casi todo el material de testing enseña una dicotomía, normalmente en una tabla de dos columnas, y
con frecuencia la acompaña de dos afirmaciones extra: que las de caja negra las hace el área de
pruebas y las de caja blanca el programador, y que son dos tipos de prueba. Conviene ir a las
fuentes antes de repetirlo.

**Primer hallazgo: los dos vocabularios nombran lo mismo.** El glosario de ISTQB —el organismo
internacional de certificación de testers, cuyo vocabulario es el de uso corriente en la industria—
define *black-box test technique* así:

> a procedure to derive and/or select test cases based on an analysis of the specification, either
> functional or non-functional, of a component or system without reference to its internal structure

> un procedimiento para derivar y/o seleccionar casos de prueba a partir del análisis de la
> especificación, funcional o no funcional, de un componente o sistema, sin referencia a su
> estructura interna

Y registra como sinónimos *black-box test design technique* y **specification-based test technique**,
o sea «técnica basada en la especificación». No son dos clasificaciones distintas: «caja negra» y
«basada en especificación» son dos nombres del mismo grupo, y el segundo es el que usan los
documentos normativos.

**Segundo hallazgo: la clasificación no tiene dos categorías, tiene tres.** La cláusula 5 de
ISO/IEC/IEEE 29119-4:2021 se divide así:

| Cláusula | Familia (nombre de la norma) | En español | Qué contiene |
|----------|------------------------------|------------|--------------|
| 5.2 | *Specification-based test design techniques* | Basadas en la especificación | Partición de equivalencia, valores límite, tabla de decisión, transición de estados, testing combinatorio, metamórfico y otras: doce técnicas |
| 5.3 | *Structure-based test design techniques* | Basadas en la estructura | *Statement testing*, *branch testing*, *decision testing* y otras cuatro, hasta siete técnicas |
| 5.4 | *Experience-based test design techniques* | Basadas en la experiencia | *Error guessing*, es decir conjeturar dónde es probable que haya un error |

El programa de certificación de nivel Foundation de ISTQB clasifica igual, y nombra las tres
categorías como *black-box*, *white-box* y *experience-based*. La tercera familia **no tiene
color**, y ahí vive buena parte del trabajo real de prueba: la norma define *experience-based
testing* en su cláusula 3.33 como una

> class of test case design techniques based on using the experience of testers to generate test
> cases

> clase de técnicas de diseño de casos de prueba basadas en usar la experiencia de quienes prueban
> para generar los casos

Su nota menciona ataques de prueba, *tours* —recorridos deliberados del sistema con un foco
elegido— y taxonomías de error.

**Tercer hallazgo: la propia norma agrega una caja más, y no es ni negra ni blanca.** El Anexo E de
ISO/IEC/IEEE 29119-4:2021 se titula *Guidelines and examples for the application of grey-box test
design techniques*.

La conclusión no es que la dicotomía sea falsa. Es que es **incompleta**, y que el
recorte cae siempre en el mismo lugar: quien aprendió la tabla de dos columnas como la
clasificación completa tiene un hueco exactamente donde están las técnicas que dependen del criterio
de quien prueba. Y las dos afirmaciones extra no aparecen en ninguna de las dos fuentes: ni la norma
ni el glosario dicen quién ejecuta cada técnica, ni en qué etapa, ni las presentan como dos tipos de
prueba. Clasifican **procedimientos para derivar casos**.

### 1.3 La distinción que sí sobrevive: de qué modelo se derivó el caso

Si no es quién la escribe ni cuándo se ejecuta, ¿qué separa entonces una familia de la otra? La
norma lo responde con un término propio. La cláusula 3.54 define **test model**:

> representation of the test item, which allows the testing to be focused on particular
> characteristics or qualities
>
> EXAMPLE Requirements statements, equivalence partitions, state transition diagram, use case
> description, decision table, input syntax description, **source code**, control flow graph,
> parameters and values, classification tree, natural language.

> representación del elemento sometido a prueba, que permite enfocar la prueba en características o
> cualidades particulares
>
> EJEMPLO Enunciados de requisitos, particiones de equivalencia, diagrama de transición de estados,
> descripción de caso de uso, tabla de decisión, descripción de la sintaxis de entrada, **código
> fuente**, grafo de flujo de control, parámetros y valores, árbol de clasificación, lenguaje
> natural.

Un **modelo de prueba**, entonces, es simplemente *aquello que se mira para inventar los casos*. Y
esa lista resuelve la pregunta: en la misma enumeración conviven los enunciados de requisitos y el
código fuente, o sea que los dos son modelos de prueba igualmente legítimos. Lo que cambia entre las
familias es **cuál de los dos se usó para derivar el caso**.

Las definiciones lo confirman una por una. Antes hay que traducir un término que aparece en todas:
**test item** es el *elemento sometido a prueba*, que en esta sesión es siempre una función del
proyecto. Y *exercising* se traduce por *ejercitar*: hacer pasar la ejecución por algo.

| Técnica | Definición literal de la norma | Qué dice en español |
|---------|-------------------------------|---------------------|
| Partición de equivalencia (3.29) | «specification-based test case design technique based on exercising equivalence partitions» | Técnica basada en la **especificación**, que ejercita particiones de equivalencia |
| *Statement testing* (3.45) | «structure-based test case design technique based on exercising executable statements **in the source code** of the test item» | Técnica basada en la **estructura**, que ejercita las sentencias ejecutables **del código fuente** del elemento sometido a prueba |
| *Branch testing* (3.6) | «structure-based test case design technique based on exercising branches in the control flow of the test item» | Técnica basada en la **estructura**, que ejercita las ramas del flujo de control del elemento sometido a prueba |

Una familia mira el documento; la otra mira el código.

Y hay una consecuencia que la norma deja escrita casi al pasar. La cláusula 3.32 define el resultado
esperado como «observable predicted behaviour of the test item under specified conditions based on
its specification **or another source**». Ese «u otra fuente» es la puerta por la que entra el
problema que ya se vio en la sesión anterior: cuando los límites y sus esperados se copiaron de la
implementación, la prueba confirmó el defecto en lugar de encontrarlo. Derivar el **caso** del
código es legítimo y tiene una familia entera dedicada a ello. Derivar el **esperado** del código
es lo que anula la prueba.

El criterio completo cabe en una tabla:

| | Derivada de la especificación | Derivada de la estructura |
|---|---|---|
| Modelo de prueba | El requisito, la tabla de decisión, el diagrama de estados | El código fuente, el grafo de flujo de control |
| Qué puede afirmar | Que el comportamiento exigido ocurre | Que ese camino del programa se ejecutó |
| Qué no puede detectar | Código que el requisito no menciona y que nadie recorrió | Un requisito que el código nunca implementó, porque no hay estructura que lo represente |
| De dónde debe salir el esperado | Del requisito | Del requisito, también |

La última fila es la que más cuesta y la que menos se dice: **una prueba estructural sigue
necesitando un esperado de origen externo.** El código dice qué caminos existen; no dice cuál es el
resultado correcto de recorrerlos.

### 1.4 Primera medición: qué recorrió la suite en verde

Para trabajar sobre la estructura hace falta poder decir cuánta de ella se ejercitó. La norma dedica
a eso una cláusula completa: la 6, *Test coverage measurement*, con una subcláusula por técnica. La
6.3.1 es *Statement testing coverage*, y es la que mide `pytest-cov`.

```bash
uv add --dev pytest pytest-cov
uv run pytest --cov=reservas --cov-report=term-missing -q
```

Cada parte de esos dos comandos hace algo concreto:

| Parte | Qué hace |
|-------|----------|
| `uv add --dev` | Instala un paquete y lo registra como dependencia **de desarrollo**: hace falta para probar el proyecto, no para que el proyecto funcione. Así no viaja al sistema en producción. |
| `pytest-cov` | El complemento que conecta `pytest` con `coverage.py`, la herramienta que mide. |
| `--cov=reservas` | Qué módulo medir. Sin esto mediría también las bibliotecas ajenas, y el número no diría nada del proyecto. |
| `--cov-report=term-missing` | Qué informe imprimir: en el terminal, **incluyendo la lista de líneas no cubiertas**. Sin `term-missing` solo aparece el porcentaje. |
| `-q` | Modo silencioso: acorta la salida de pytest para que el informe se lea sin ruido. |

Ejecución con Python 3.12.12, pytest 9.1.1, pytest-cov 7.1.0 y coverage 7.16.1. Salida literal; se
omiten los separadores y el encabezado de la sección:

```text
Name          Stmts   Miss  Cover   Missing
-------------------------------------------
reservas.py      17      2    88%   22, 26
-------------------------------------------
TOTAL            17      2    88%
12 passed in 0.20s
```

El informe se lee columna por columna, y ninguna significa exactamente lo que sugiere a primera
vista:

| Columna | Qué cuenta exactamente |
|---------|------------------------|
| `Stmts` | Sentencias ejecutables del archivo: 17. No son las 26 líneas del archivo; las líneas en blanco y las definiciones sin cuerpo ejecutado no se cuentan igual. |
| `Miss` | Sentencias que **ninguna** de las 12 pruebas ejecutó: 2. |
| `Cover` | El cociente: 15 de 17, redondeado a 88 %. |
| `Missing` | Los números de línea de esas dos sentencias: 22 y 26. Es la única columna con la que se puede hacer algo. |

Y esos dos números tienen nombre propio en el archivo:

```python
21  def puede_cancelar(inicio_bloque: datetime, ahora: datetime) -> bool:
22      return inicio_bloque - ahora > ANTICIPACION_CANCELACION
23
24
25  def comprobante(nombre: str, rut: str, correo: str, bloque: int) -> str:
26      return f"{nombre} | {rut} | {correo} | bloque {bloque}"
```

Las dos sentencias no ejecutadas son **los cuerpos completos de dos de las cuatro funciones del
proyecto**. La suite que se defendió con tres técnicas y quedó en verde nunca llamó a
`puede_cancelar()` ni a `comprobante()`. Y `comprobante()` no es una función cualquiera: es
justamente la que la auditoría marcó como hallazgo por exponer el RUT completo.

Ochenta y ocho por ciento suena bien. Dos de cuatro funciones sin una sola ejecución, no. Son la
misma medición.

De ahí sale el uso correcto de la herramienta, que Martin Fowler resumió en dos frases publicadas el
17 de abril de 2012:

> Test coverage is a useful tool for finding untested parts of a codebase.

> La cobertura de pruebas es una herramienta útil para encontrar las partes de un código que no
> están probadas.

> Test coverage is of little use as a numeric statement of how good your tests are.

> La cobertura de pruebas sirve de poco como afirmación numérica sobre qué tan buenas son tus
> pruebas.

La columna útil es `Missing`, no `Cover`. El porcentaje es un subproducto; la lista de líneas es el
hallazgo.

Queda una precisión de vocabulario, porque el uso corriente recortó la palabra. «Cobertura» no
significa «porcentaje de líneas ejecutadas». La cláusula 6.2 de la norma define medidas de cobertura
para las técnicas **basadas en especificación**: *equivalence partition coverage*, *boundary value
analysis coverage*, *decision table testing coverage*, una por cada técnica. Cuando en la sesión
anterior se dijo que la tabla tenía representación de las tres clases de bloque, se estaba
informando cobertura de particiones de equivalencia sin usar la palabra. La cifra que entrega la
herramienta es **una** medida de cobertura entre las que define la norma, y es la que menos sabe del
requisito.

### 1.5 Lo que cambia cuando el caso lo deriva un agente

Con la distinción por modelo de prueba ya establecida, la consecuencia para el flujo de trabajo
actual se deduce sola. Cuando a un agente se le abre un archivo y se le pide «escribe las pruebas de
esto», el modelo de prueba que recibe es **el código fuente**. Según la taxonomía de la norma está
derivando casos de forma estructural, aunque después bautice la prueba
`test_valida_el_bloque_del_requisito`. Y su resultado esperado sale de «another source» en el
sentido de la cláusula 3.32: la implementación que tiene a la vista.

El reparto de trabajo que se sigue de eso es concreto:

- **Lo que hace bien:** enumerar caminos del código, alcanzar sentencias que ninguna prueba recorrió,
  proponer nombres y reducir el trabajo mecánico de escribir la parametrización.
- **Lo que no conviene delegar:** el resultado esperado, siempre que el único modelo que el agente
  tuvo delante haya sido el código.
- **El error frecuente:** una prueba que pasa el primer día y que no puede fallar nunca, porque
  afirma lo que el código ya hace. Sube la cobertura y no agrega evidencia.

La forma de evitarlo es la misma que usa la industria, y conviene mirarla con sus números. En
febrero de 2024, un equipo de Meta publicó la descripción de **TestGen-LLM**, una herramienta que
usa modelos de lenguaje para mejorar pruebas unitarias ya escritas por personas. Lo que declara su
resumen, literal:

> In an evaluation on Reels and Stories products for Instagram, 75% of TestGen-LLM's test cases
> built correctly, 57% passed reliably, and 25% increased coverage. During Meta's Instagram and
> Facebook test-a-thons, it improved 11.5% of all classes to which it was applied, with 73% of its
> recommendations being accepted for production deployment by Meta software engineers.

> En una evaluación sobre los productos Reels y Stories de Instagram, el 75 % de los casos de
> prueba de TestGen-LLM compiló correctamente, el 57 % pasó de forma fiable y el 25 % aumentó la
> cobertura. Durante las jornadas de prueba de Instagram y Facebook en Meta, mejoró el 11,5 % de
> todas las clases a las que se aplicó, y el 73 % de sus recomendaciones fue aceptado por los
> ingenieros de software de Meta para desplegarlo en producción.

Hay dos lecturas y las dos importan. La primera: de todo lo que el modelo generó, **una cuarta parte
aumentó la cobertura**; tres de cada cuatro pruebas generadas no agregaron recorrido, en una empresa
con esas capacidades y sobre sus propios productos. La segunda, y es la decisiva: el diseño de la
herramienta no consiste en confiar en el modelo, sino en **filtrarlo**. Los autores describen
TestGen-LLM como una herramienta que «verifies that its generated test classes successfully clear a
set of filters that assure measurable improvement over the original test suite». El criterio que
decide qué pruebas sobreviven es externo al agente y está escrito por el equipo.

Los límites de esta evidencia hay que decirlos: es una empresa, sobre sus propios sistemas, con sus
propios filtros, y el artículo relata un despliegue, no un experimento controlado con un grupo de
comparación. No establece qué tan bien escribe pruebas un agente en general. Establece otra cosa,
que sí es transferible: un equipo que trabaja a esa escala decidió que el paso imprescindible no era
generar, sino **medir cada prueba generada contra la suite que ya existía**. Es el mismo movimiento
que hace `--cov-report=term-missing` sobre el proyecto de reserva.

Ese filtro, eso sí, contesta solo a medias, porque su criterio de supervivencia es justamente el
aumento de cobertura: si una prueba entra en la suite por recorrer una línea nueva, ¿alcanza eso
para afirmar que verifica algo?

## Ejercicio del bloque

Sobre el proyecto propio, el mismo que se entrega como evaluación. Ejecuta la medición:

```bash
uv add --dev pytest-cov
uv run pytest --cov=<tu_modulo> --cov-report=term-missing -q
```

Responde por escrito, en cuatro líneas:

1. Anota el porcentaje y después ignóralo. Copia la columna `Missing` completa.
2. Para cada línea de esa columna decide cuál de estas tres cosas es: un comportamiento que nadie
   probó, código que el requisito no pide y que sobra, o una rama de error que sí debería tener una
   prueba. Las tres se arreglan distinto.
3. Elige dos pruebas cualesquiera de tu suite y clasifícalas por su **procedencia**: ¿el valor
   esperado salió del requisito o de leer la implementación? Si salió de la implementación, escribe
   qué defecto no podría detectar esa prueba.
4. Escribe la línea de `Missing` que te parezca más grave y explica en una frase por qué esa y no
   otra.

**Pista:** la columna `Stmts` cuenta sentencias ejecutables, no líneas del archivo, así que el
denominador casi nunca coincide con el largo del archivo. Si el cuerpo completo de una función
aparece en `Missing`, es señal de que ninguna prueba la llamó, no de que la llamó y falló.

**Evidencia esperada:** la lista literal de líneas no cubiertas, una clasificación por línea con su
criterio, dos pruebas con su procedencia declarada y una justificación de prioridad que no sea «es
la que falta para llegar a 100».

## Preguntas guía

1. La suite del proyecto de reserva informa 88 % y deja dos funciones completas sin ejecutar. Si
   mañana alguien agrega una tercera función sin pruebas, ¿el porcentaje sube, baja o se queda
   igual, y qué dice eso sobre usarlo como indicador de avance?

   **Pista:** piensa por separado en qué le pasa al numerador y qué le pasa al denominador cuando
   entra código nuevo no cubierto.

2. La norma clasifica las técnicas según el modelo de prueba del que se deriva el caso, y en su
   lista de modelos aparecen tanto el requisito como el código fuente. Si una misma prueba —mismas
   entradas, mismo `assert`— se pudo haber derivado de cualquiera de los dos, ¿cómo se distingue
   después cuál fue, y por qué importa saberlo?

   **Pista:** el archivo de pruebas no guarda esa información. Revisa qué queda escrito sobre el
   origen del esperado y qué se pierde.

3. Meta reporta que el 25 % de las pruebas generadas aumentó la cobertura, y usa ese aumento como
   filtro para aceptarlas. ¿Qué clase de prueba inútil pasa ese filtro sin problemas?

   **Pista:** una prueba puede ejecutar una línea nueva sin comprobar nada sobre lo que esa línea
   produce.

## Fuentes técnicas del bloque

- [ISO/IEC/IEEE 29119-4:2021, *Software and systems engineering — Software testing — Part 4: Test techniques*](https://www.iso.org/standard/79430.html) — la estructura de la cláusula 5 en tres familias (5.2 basadas en especificación, 5.3 basadas en estructura, 5.4 basadas en experiencia), la cláusula 6 de medición de cobertura con sus subcláusulas 6.2 y 6.3, el Anexo E informativo sobre técnicas de caja gris, y las definiciones 3.6 *branch testing*, 3.29 *equivalence partitioning*, 3.32 *expected result*, 3.33 *experience-based testing*, 3.45 *statement testing* y 3.54 *test model*. Las citas literales se tomaron del [borrador final público ISO/IEC/IEEE/FDIS 29119-4](https://cdn.standards.iteh.ai/samples/79430/a312e8620f53478f9ce24510787382ab/ISO-IEC-IEEE-FDIS-29119-4.pdf), porque la edición publicada es de pago; la numeración de cláusulas citada es la de ese documento.
- [Glosario de ISTQB — *black-box test technique*](https://glossary.istqb.org/) — la definición y el registro de *specification-based test technique* como sinónimo.
- [ISTQB Foundation Level, sección 4.1 — *Test Techniques Overview*](https://astqb.org/4-1-test-techniques-overview/) — las tres categorías de técnicas y el emparejamiento de *black-box* con *specification-based* y de *white-box* con *structure-based*.
- [Martin Fowler — *Test Coverage*, 17 de abril de 2012](https://martinfowler.com/bliki/TestCoverage.html) — las dos frases sobre para qué sirve la cobertura y para qué no.
- [Edsger W. Dijkstra — *Notes on Structured Programming* (EWD249), 1970](https://www.cs.utexas.edu/~EWD/transcriptions/EWD02xx/EWD249/EWD249.html) — la conclusión sobre no considerar el mecanismo una caja negra, que esta sesión retoma.
- [Nadia Alshahwan et al. (Meta) — *Automated Unit Test Improvement using Large Language Models at Meta*, arXiv:2402.09171, 14 de febrero de 2024](https://arxiv.org/abs/2402.09171) — las cifras de 75 %, 57 %, 25 %, 11,5 % y 73 %, y la descripción de la cadena de filtros que exige mejora medible sobre la suite original.
- Ejecuciones registradas para esta clase sobre el proyecto de reserva de laboratorio, con Python 3.12.12, pytest 9.1.1, pytest-cov 7.1.0 y coverage 7.16.1: la suite de 12 casos en verde y el informe de cobertura de sentencias con sus dos líneas no ejecutadas.

---

# BLOQUE 2: El 100 % que no verifica nada

- **Duración:** 25 minutos
- **Objetivo del bloque:** separar lo que la cobertura registra —que una sentencia o una rama se
  ejecutó— de lo que nadie mide por ella: que alguien haya comprobado el resultado. Al finalizar, el
  estudiante debe poder explicar por qué una función puede tener 100 % de sentencias y menos de
  100 % de ramas, reconocer una prueba que recorre sin afirmar, y reemplazar la pregunta por el
  porcentaje por otra que sí discrimina.
- **Modalidad:** exposición con ejecución en vivo, incluida una modificación deliberada del código.
- **Ritmo sugerido:** 6 minutos para sentencias frente a ramas, 7 para la prueba sin aserciones, 5
  para la mutación, 5 para lo que midieron los estudios y 2 para el ejercicio.

## Desarrollo

### 2.1 Dos maneras de contar el recorrido: sentencias y ramas

La norma define por separado las dos técnicas estructurales más usadas, y la diferencia está en la
unidad que cada una cuenta. El *statement testing* (3.45) se basa en «exercising executable
statements in the source code»; el *branch testing* (3.6), en «exercising branches in the control
flow». Una cuenta líneas de código ejecutadas; la otra, caminos tomados.

Que no son lo mismo se ve mejor sobre una función que registra el estado de una reserva:

```python
1  from reservas import puede_reservar
2
3
4  def registrar_reserva(reservas_de_la_semana: int, bloque: int, tomado: bool) -> str:
5      estado = "rechazada"
6      if puede_reservar(reservas_de_la_semana, bloque, tomado):
7          estado = "confirmada"
8      return estado
```

Con una sola prueba, la de una reserva válida:

```python
def test_una_reserva_valida_queda_confirmada() -> None:
    assert registrar_reserva(1, 4, tomado=False) == "confirmada"
```

Medida como sentencias:

```text
Name          Stmts   Miss  Cover   Missing
-------------------------------------------
registro.py       6      0   100%
-------------------------------------------
TOTAL             6      0   100%
1 passed in 0.12s
```

Cien por ciento, y la columna `Missing` vacía: no quedó una sola línea sin ejecutar. La misma
prueba, midiendo ramas con `--cov-branch`:

```text
Name          Stmts   Miss Branch BrPart  Cover   Missing
---------------------------------------------------------
registro.py       6      0      2      1    88%   6->8
---------------------------------------------------------
TOTAL             6      0      2      1    88%
1 passed in 0.10s
```

Aparecen dos columnas nuevas y una notación que hay que saber leer:

| Elemento | Qué significa |
|----------|---------------|
| `Branch` | Cantidad de aristas de decisión del archivo: 2. El `if` de la línea 6 puede seguir por dos caminos. |
| `BrPart` | Decisiones recorridas **por un solo lado**: 1. El `if` se evaluó, pero solo en uno de sus dos resultados. |
| `6->8` | La arista que no se tomó, escrita como origen y destino: de la línea 6 a la línea 8. Es el caso en que la condición es falsa y la ejecución salta el 7. |
| `88%` | El cociente sobre el total combinado de sentencias y aristas. |

La lectura importante es que **ninguna línea aparece como no cubierta y sin embargo hay un camino
que nunca se recorrió**. La reserva rechazada —el `estado` que se queda en `"rechazada"`— no fue
probada nunca, y la medida de sentencias no tenía manera de decirlo: la línea 5 se ejecuta siempre,
venga la condición verdadera o falsa. Un `if` sin `else` es el caso donde las dos medidas se
separan, y es también el más frecuente en código real.

De ahí sale la primera regla práctica: **medir ramas y no solo sentencias**. Y de ahí sale también
la reacción natural, que conviene anticipar: si ramas es más estricto que sentencias, bastaría con
exigir 100 % de ramas. El resto del bloque es la razón por la que eso tampoco alcanza.

### 2.2 Una prueba sin una sola aserción llega al 100 %

La suite de doce casos del proyecto de reserva cubre 15 de 17 sentencias, y deja fuera los cuerpos
de `puede_cancelar()` y `comprobante()`. Se agrega una sola prueba más, escrita así:

```python
from datetime import datetime

from reservas import bloque_valido, comprobante, puede_cancelar, puede_reservar


def test_recorre_sin_afirmar() -> None:
    bloque_valido(4)
    puede_reservar(1, 0, tomado=False)
    puede_reservar(1, 4, tomado=True)
    puede_reservar(1, 4, tomado=False)
    puede_cancelar(datetime(2026, 9, 21, 14, 0), datetime(2026, 9, 21, 8, 0))
    comprobante("Ana Perez", "12.345.678-9", "ana.perez@correo.cl", 3)
```

Seis llamadas y **ni un solo `assert`**. La función no compara nada, no espera nada y no puede
fallar: termina y pytest la cuenta como pasada. Antes y después de agregarla, sobre el mismo código:

```text
Name          Stmts   Miss  Cover   Missing
-------------------------------------------
reservas.py      17      2    88%   22, 26
-------------------------------------------
TOTAL            17      2    88%
12 passed in 0.09s
```

```text
Name          Stmts   Miss  Cover   Missing
-------------------------------------------
reservas.py      17      0   100%
-------------------------------------------
TOTAL            17      0   100%
13 passed in 0.10s
```

Del 88 % al 100 % con una prueba que no comprueba nada. La columna `Missing` quedó vacía y el
proyecto ahora exhibe cobertura total.

Hay una versión más incómoda del mismo experimento. Se reintroduce en `bloque_valido()` el defecto
que la sesión anterior encontró y corrigió —volver a comparar con `<` en lugar de `<=`, con lo cual
el bloque 8 vuelve a ser irreservable— y se ejecuta **solo esa prueba sin aserciones**, midiendo las
dos cosas:

```text
Name          Stmts   Miss  Cover   Missing
-------------------------------------------
reservas.py      17      0   100%
-------------------------------------------
TOTAL            17      0   100%
1 passed in 0.10s
```

```text
Name          Stmts   Miss Branch BrPart  Cover   Missing
---------------------------------------------------------
reservas.py      17      0      4      0   100%
---------------------------------------------------------
TOTAL            17      0      4      0   100%
1 passed in 0.11s
```

Cien por ciento de sentencias. Cien por ciento de ramas, cuatro de cuatro, `BrPart` en cero. Suite
en verde. Y un octavo de la jornada del laboratorio inutilizable por un defecto que sigue ahí.

Eso responde la objeción del apartado anterior: exigir cobertura de ramas es mejor que exigir
cobertura de sentencias, y **tampoco es suficiente**. Ninguna de las dos medidas mira las
aserciones, porque ninguna de las dos fue diseñada para eso. Miden ejecución.

La formulación precisa, entonces, no es que el 100 % no pruebe nada. Prueba exactamente un hecho, y
es un hecho útil: no quedó código que ninguna prueba alcance. Lo que no prueba es que alguien haya
comprobado el resultado de alcanzarlo. La cobertura es **necesaria y no suficiente**: sirve para
descartar el olvido, no para acreditar la verificación.

### 2.3 La pregunta que sí discrimina: qué cambio haría fallar la prueba

Con el mismo defecto reintroducido, se ejecuta ahora la suite de doce casos con aserciones:

```text
FAILED test_reservas.py::test_limites_del_requisito[ultimo] - assert False is True
FAILED test_reservas.py::test_regla_permitida_incluye_el_bloque_8 - assert False is True
2 failed, 10 passed in 0.19s
```

Esa última parte de cada línea confunde la primera vez que se ve. `assert False is True` no es una
frase absurda: es pytest mostrando **la comparación que hizo con los valores ya reemplazados**. La
prueba decía `assert bloque_valido(8) is esperado`; al ejecutarse, `bloque_valido(8)` devolvió
`False` y `esperado` valía `True`, así que la línea quedó como `assert False is True`, que es falsa
y por eso falla. Y `[ultimo]` entre corchetes es la etiqueta de la fila que falló dentro de una
prueba con varios casos.

De paso, el operador `is` no es lo mismo que `==`: compara si son **el mismo objeto**, no si valen
lo mismo. Con `True` y `False` se usa a propósito, porque obliga a que el resultado sea exactamente
el booleano y no algo que Python trataría como equivalente —el número `1`, una lista vacía— y que
dejaría pasar la prueba sin que la función devuelva lo que debía.

Dos pruebas caen y nombran el caso exacto. Las dos suites recorren el mismo código; una detecta el
defecto y la otra no. Lo que las separa no es el porcentaje: es la aserción.

Ese experimento tiene nombre propio en la disciplina. Modificar el programa a propósito para ver si
la suite lo nota se llama **prueba de mutación**: cada modificación deliberada es un **mutante**, un
mutante que hace fallar alguna prueba está **matado**, y uno que deja la suite en verde
**sobrevive**. El cambio de `<=` a `<` es un mutante: la suite con aserciones lo mata, la suite sin
aserciones lo deja sobrevivir con cobertura perfecta.

De ahí sale la pregunta que reemplaza al porcentaje, y que se le puede hacer a cualquier prueba en
diez segundos:

> **¿Qué tendría que cambiar en el código para que esta prueba falle?**

Si la respuesta es «nada», la prueba no verifica: recorre. Si la respuesta es «cualquier cosa, es
muy frágil», tampoco sirve, pero por el motivo contrario. Y si la respuesta se puede nombrar con
precisión —«que el límite superior se excluya», «que el comprobante deje de traer el bloque»—
entonces la prueba tiene un defecto asociado y se sabe cuál.

### 2.4 Lo que midieron los estudios, y qué dicen exactamente

La frase «el 100 % de cobertura no prueba nada» circula como sentencia de taller, pero hay dos
estudios que la miden en serio, y conviene citar lo que dicen y no lo que se les atribuye.

El primero es de Laura Inozemtseva y Reid Holmes, de la Universidad de Waterloo, presentado en
ICSE 2014. Su método: generaron **31 000 suites de prueba sobre cinco sistemas Java reales** —Apache
POI, Closure Compiler, HSQLDB, JFreeChart y Joda Time—, de hasta 724 000 líneas de código; midieron
tres coberturas de exigencia creciente —de sentencias, de decisiones y de **condición modificada**,
esta última la más estricta de las tres, que exige demostrar que cada condición suelta dentro de un
`if` compuesto puede cambiar el resultado por sí sola—; y evaluaron la eficacia de cada suite con
prueba de mutación, el mismo procedimiento del apartado anterior pero automatizado. La conclusión de
su resumen, literal:

> Our results suggest that coverage, while useful for identifying under-tested parts of a program,
> should not be used as a quality target because it is not a good indicator of test suite
> effectiveness.

> Nuestros resultados sugieren que la cobertura, si bien es útil para identificar las partes de un
> programa que están poco probadas, no debería usarse como meta de calidad, porque no es un buen
> indicador de la eficacia de una suite de pruebas.

Dos precisiones de ese trabajo importan mucho. La primera: la correlación entre cobertura y eficacia
**existe** mientras no se controle el tamaño de la suite, y cae a un rango «de baja a moderada»
cuando sí se controla. Es decir, buena parte de lo que parecía mérito de la cobertura era mérito de
tener más pruebas. La segunda responde otra vez a la tentación de subir el estándar: los autores
informan que «the type of coverage used had little influence on the strength of the relationship»,
y sus tablas lo muestran con números casi idénticos entre sentencias, decisiones y condición
modificada —0,75, 0,76 y 0,77 en Apache POI, por ejemplo—.

Conviene fijar qué es ese número antes de seguir, porque el siguiente hay que leerlo bien. Una
**correlación** mide si dos cantidades suben y bajan juntas, y se expresa en una escala que va de
**−1 a 1**. Un valor cercano a 1 significa que cuando una sube la otra sube; cercano a 0, que no
tienen relación apreciable; y **negativo**, que cuando una sube la otra baja. No dice que una cosa
cause la otra: solo que se mueven juntas.

Con esa escala a la vista, hay un caso en ese estudio que vale por sí solo. En HSQLDB la correlación
no fue baja: fue **negativa, −0,35**. Es decir, las suites con más cobertura detectaban
proporcionalmente *menos* defectos. La explicación que dan los autores es literalmente el
experimento del apartado 2.2, encontrado en un sistema real:

> the suites with higher coverage contain test cases that run a lot of code but do not kill many
> mutants in that code

> las suites con mayor cobertura contienen casos de prueba que ejecutan mucho código pero no matan
> muchos mutantes en ese código

El segundo estudio es el complemento necesario, porque el primero dice qué **no** indica eficacia y
no dice qué sí. Yucheng Zhang y Ali Mesbah, de la Universidad de Columbia Británica, publicaron en
FSE 2015 un trabajo sobre 6 700 suites compuestas a partir de 24 000 aserciones de cinco proyectos
Java reales. Lo que encontraron:

> We find that the number of assertions in a test suite strongly correlates with its effectiveness,
> and this factor directly influences the relationship between test suite size and effectiveness.
> Our results also indicate that assertion coverage is strongly correlated with effectiveness

> Encontramos que la cantidad de aserciones de una suite de pruebas se correlaciona fuertemente
> con su eficacia, y que ese factor influye directamente en la relación entre el tamaño de la
> suite y su eficacia. Nuestros resultados también indican que la cobertura de aserciones está
> fuertemente correlacionada con la eficacia.

Y la frase de su introducción que resume el bloque completo en nueve palabras:

> coverage without checking for correctness is meaningless

> la cobertura, sin comprobar que el resultado sea correcto, no significa nada

Los límites de esta evidencia hay que declararlos: los dos estudios trabajan sobre proyectos Java de
código abierto, con suites compuestas artificialmente a partir de las suites reales de esos
proyectos, y usan mutación como aproximación a los defectos verdaderos —un mutante es un defecto
plausible, no un defecto que haya ocurrido—. Nada de eso invalida el hallazgo, pero acota qué se
puede afirmar: no que la cobertura sea inútil, sino que no sirve como meta de calidad, y que el
recuento de aserciones se comporta mucho mejor como indicador.

### 2.5 Auditar una prueba generada: contar aserciones, no porcentajes

De esos dos resultados sale un procedimiento concreto para revisar pruebas que no se escribieron a
mano, que es la situación habitual cuando un agente produce la suite.

- **Lo que hace bien un agente:** alcanzar código no recorrido. Es la tarea en la que la medición de
  cobertura le da retroalimentación directa, y es real: `Missing` baja.
- **Lo que no conviene delegar:** la aserción. Es la única parte de la prueba que decide si el
  resultado es correcto, y es la que el estudio de Zhang y Mesbah identifica como el factor que sí
  se correlaciona con detectar defectos.
- **El error frecuente, en dos formas:** la prueba que llama y no afirma, como la del apartado 2.2;
  y la que afirma una tautología —comparar el resultado contra una segunda llamada a la misma
  función, o contra el valor que el código produce— que es la versión disfrazada de lo mismo.

El puente práctico es pedirle al agente el mutante, no solo la prueba: «para cada prueba que
propongas, dime qué cambio en el código la haría fallar». Una respuesta precisa es verificable en el
acto —se aplica el cambio y se corre la suite—, y una respuesta vaga es la señal de que la prueba
recorre sin comprobar. La pregunta del apartado 2.3 funciona igual de bien como criterio de revisión
que como criterio de escritura.

## Ejercicio del bloque

Sobre el proyecto propio, en tres pasos:

1. Vuelve a medir con ramas activadas y compara los dos números:

   ```bash
   uv run pytest --cov=<tu_modulo> --cov-report=term-missing -q
   uv run pytest --cov=<tu_modulo> --cov-branch --cov-report=term-missing -q
   ```

   Anota una arista que aparezca en `Missing` con la notación `origen->destino` y escribe en palabras
   qué situación del sistema es ese camino.
2. Elige la prueba más importante de tu suite y aplícale la pregunta: **¿qué cambio en el código la
   haría fallar?** Escribe el cambio exacto, aplícalo, ejecuta y registra si la prueba falló. Si no
   falló, la prueba está recorriendo sin verificar y hay que arreglar la aserción. Deja el código
   como estaba al terminar.
3. Cuenta las aserciones de tu suite y divídelas por la cantidad de pruebas. Si hay pruebas con cero
   aserciones, nómbralas.

**Pista:** una arista no cubierta no es una línea sin ejecutar, así que no la busques en el código
como un hueco: búscala como una condición que siempre se evaluó igual. Y para el paso 2, el mutante
más barato suele ser cambiar un operador de comparación, invertir un booleano o correr un límite en
uno.

**Evidencia esperada:** una arista no cubierta traducida a una situación del sistema, un mutante
escrito y aplicado con el resultado real de la ejecución, y el recuento de aserciones por prueba con
las pruebas sin aserciones identificadas por nombre.

## Preguntas guía

1. Una prueba sin aserciones subió el proyecto de 88 % a 100 % y dejó el defecto del bloque 8 vivo.
   Si en lugar de una prueba sin aserciones se hubiera agregado una con una aserción tautológica
   —comparar el resultado de la función contra el resultado de llamarla otra vez—, ¿qué cambiaría en
   el informe de cobertura y qué cambiaría en la capacidad de detectar el defecto?

   **Pista:** piensa por separado en qué mide la herramienta y en qué tendría que pasar para que esa
   comparación diera falso.

2. El estudio de Waterloo encontró en HSQLDB una correlación negativa entre cobertura y eficacia, y
   lo explicó por suites que ejecutan mucho código sin matar mutantes. ¿Qué tendría que estar
   ocurriendo en un proyecto para que subir la cobertura empeore de verdad su capacidad de detectar
   defectos?

   **Pista:** el numerador y el denominador de la eficacia normalizada se mueven distinto. Una suite
   puede crecer en código recorrido más rápido de lo que crece en comprobaciones.

3. Si el recuento de aserciones se correlaciona con la eficacia mucho mejor que la cobertura, ¿por
   qué sería igual de mala idea fijar «cantidad de aserciones» como meta obligatoria del proyecto?

   **Pista:** repasa por qué el porcentaje de cobertura falla como meta y comprueba si el mismo
   razonamiento se aplica a cualquier número que alguien pueda subir a voluntad.

## Fuentes técnicas del bloque

- [ISO/IEC/IEEE 29119-4:2021](https://www.iso.org/standard/79430.html) — las definiciones 3.45 *statement testing* y 3.6 *branch testing*, que fijan la diferencia entre contar sentencias ejecutadas y contar caminos tomados, y la cláusula 6.3 con sus medidas de cobertura estructural. Citas tomadas del [borrador final público ISO/IEC/IEEE/FDIS 29119-4](https://cdn.standards.iteh.ai/samples/79430/a312e8620f53478f9ce24510787382ab/ISO-IEC-IEEE-FDIS-29119-4.pdf).
- [Laura Inozemtseva y Reid Holmes — *Coverage Is Not Strongly Correlated with Test Suite Effectiveness*, ICSE 2014](https://www.cs.ubc.ca/~rtholmes/papers/icse_2014_inozemtseva.pdf) — las 31 000 suites sobre cinco sistemas Java de hasta 724 000 líneas, la mutación como medida de eficacia, la conclusión sobre no usar la cobertura como meta de calidad, la caída de la correlación al controlar el tamaño de la suite, la equivalencia entre tipos de cobertura (0,75 / 0,76 / 0,77 en Apache POI) y la correlación negativa de −0,35 en HSQLDB con su explicación.
- [Yucheng Zhang y Ali Mesbah — *Assertions Are Strongly Correlated with Test Suite Effectiveness*, FSE 2015](https://people.ece.ubc.ca/amesbah/resources/papers/fse15.pdf) — las 6 700 suites compuestas con 24 000 aserciones de cinco proyectos Java, la correlación fuerte entre cantidad de aserciones y eficacia, la de la cobertura de aserciones, y la frase «coverage without checking for correctness is meaningless».
- Ejecuciones registradas para esta clase sobre el proyecto de reserva de laboratorio, con Python 3.12.12, pytest 9.1.1, pytest-cov 7.1.0 y coverage 7.16.1: el contraste de 100 % de sentencias contra 88 % de ramas con la arista `6->8`, el paso de 88 % a 100 % al agregar una prueba sin aserciones, la cobertura total de sentencias y de ramas con el defecto del bloque 8 reintroducido, y las dos pruebas que fallan cuando la suite con aserciones se ejecuta contra ese mismo código.

---

# BLOQUE 3: El sustituto que ocupa el lugar de la dependencia

- **Duración:** 30 minutos
- **Objetivo del bloque:** establecer por qué una prueba necesita sustituir una dependencia que no
  controla, nombrar con precisión los cinco tipos de sustituto y ubicar el punto exacto en que el
  sustituto deja de representar a la dependencia y empieza a representar lo que su autor supone de
  ella. Al finalizar, el estudiante debe poder elegir el doble que corresponde a lo que quiere
  comprobar, y explicar qué defecto de producción su suite no podría detectar por haberlo usado.
- **Modalidad:** exposición con ejecución en vivo, incluida una modificación del servicio externo.
- **Ritmo sugerido:** 5 minutos para el problema de la dependencia real, 9 para los cinco tipos, 10
  para la suite al 100 % que no verifica nada, 4 para la discusión abierta y 2 para el ejercicio.

## Desarrollo

### 3.1 Por qué hay que sustituir algo

El sistema de reserva ya no termina en sí mismo: cuando una reserva queda aceptada, el comprobante
sale hacia el servicio de correo institucional, que no es parte del proyecto.

```python
import urllib.request

SERVICIO = "https://notificaciones.laboratorio.aiep.cl/envios"


def enviar_confirmacion(correo: str, cuerpo: str) -> bool:
    """Entrega el comprobante al servicio de correo institucional."""
    peticion = urllib.request.Request(
        SERVICIO,
        data=cuerpo.encode("utf-8"),
        headers={"X-Destinatario": correo},
    )
    with urllib.request.urlopen(peticion, timeout=5) as respuesta:
        return respuesta.status == 202
```

Tres detalles de esa función importan para lo que sigue. `urlopen()` es la llamada que efectivamente
sale a la red. `timeout=5` es la cantidad de segundos que espera antes de rendirse. Y `202` no es un
número arbitrario: es un **código de estado HTTP**, el que un servidor usa para responder «recibido,
lo voy a procesar». Por eso la función devuelve `True` solo cuando el servicio contestó exactamente
ese código. Nada de eso está bajo control del proyecto: depende de una máquina ajena.

La función que decide y notifica recibe ese envío como un parámetro con valor por omisión, que es lo
que después permitirá reemplazarlo:

```python
def confirmar_reserva(
    reservas_de_la_semana: int,
    bloque: int,
    tomado: bool,
    nombre: str,
    rut: str,
    correo: str,
    enviar: Callable[[str, str], bool] = enviar_confirmacion,
) -> str:
    if not puede_reservar(reservas_de_la_semana, bloque, tomado):
        return "rechazada"
    cuerpo = comprobante(nombre, rut, correo, bloque)
    if enviar(correo, cuerpo):
        return "confirmada"
    return "pendiente"
```

Esa firma tiene una pieza que no había aparecido antes en el módulo y conviene leerla entera, porque
es el mecanismo del que depende el resto de la sesión:

| Pieza | Lectura concreta |
|-------|------------------|
| `enviar` | Un parámetro más, como `bloque` o `correo`. Pero lo que recibe no es un dato: es **una función**. |
| `Callable[[str, str], bool]` | La anotación de tipo de ese parámetro. Se lee «algo que se puede llamar, que recibe dos cadenas de texto y devuelve un booleano». Los corchetes de adentro son la lista de lo que recibe; lo que va después de la coma es lo que devuelve. |
| `= enviar_confirmacion` | El **valor por omisión**: si quien llama no pasa nada, se usa el servicio real. Por eso el sistema en funcionamiento no cambia y quien lo usa ni se entera de que ese parámetro existe. |
| `enviar(correo, cuerpo)` | La llamada. `confirmar_reserva()` no sabe cuál función le tocó ni le importa: la llama y mira lo que devuelve. |

La última fila es el mecanismo completo: **como la función a llamar entra por un parámetro, una
prueba puede pasarle otra en su lugar.** Eso se llama **inyección de dependencia**, y es lo que hace
posible todo lo que viene. Sin ella no habría por dónde meter un sustituto.

Escribir la prueba evidente —una reserva válida queda confirmada— y ejecutarla sin tocar nada da
esto:

```text
notificaciones.py:13: in enviar_confirmacion
    with urllib.request.urlopen(peticion, timeout=5) as respuesta:
E   urllib.error.URLError: <urlopen error [Errno 11001] getaddrinfo failed>
FAILED test_confirmacion_real.py::test_una_reserva_valida_queda_confirmada
1 failed in 0.68s
```

La prueba falló, y conviene leer con cuidado **por qué**. No falló porque `confirmar_reserva()` esté
mal: falló porque no se pudo resolver el nombre del servidor. El rojo no habla del código que se
quería probar. Y si el servicio existiera, sería peor: cada ejecución de la suite mandaría correos
reales a direcciones reales, tardaría lo que tarde la red, y el resultado cambiaría según si el
servicio está arriba.

De ahí sale la razón para sustituir, que son cuatro problemas distintos y conviene no confundirlos:

| Problema | Qué le hace a la prueba |
|----------|------------------------|
| La dependencia no está disponible | La prueba falla por una causa ajena al código bajo prueba. |
| La dependencia es lenta | La suite deja de poder ejecutarse a cada cambio. |
| La dependencia tiene efectos reales | Probar manda correos, cobra dinero o escribe en producción. |
| La dependencia no es controlable | No se puede provocar a voluntad el caso de fallo que se quiere probar. |

El cuarto es el menos obvio y el más importante para esta clase: aunque el servicio funcionara
perfecto, seguiría siendo imposible probar qué hace el sistema cuando el envío falla, porque nadie
puede hacer fallar el correo institucional a pedido.

### 3.2 Los cinco tipos, y por qué la palabra importa

El término general es **doble de prueba**, y la taxonomía viene del libro *xUnit Test Patterns* de
Gerard Meszaros (2007). Martin Fowler, que la difundió en *Mocks Aren't Stubs*, la resume así:

> **Dummy** objects are passed around but never actually used. Usually they are just used to fill
> parameter lists. **Fake** objects actually have working implementations, but usually take some
> shortcut which makes them not suitable for production. **Stubs** provide canned answers to calls
> made during the test. **Spies** are stubs that also record some information based on how they were
> called. **Mocks** are objects pre-programmed with expectations.

> Los objetos **dummy** se pasan de un lado a otro pero nunca se usan realmente. Por lo general
> solo sirven para llenar listas de parámetros. Los objetos **fake** sí tienen implementaciones
> que funcionan, pero normalmente toman algún atajo que los vuelve inadecuados para producción.
> Los **stubs** entregan respuestas prefabricadas a las llamadas hechas durante la prueba. Los
> **spies** son stubs que además registran alguna información sobre cómo fueron llamados. Los
> **mocks** son objetos preprogramados con expectativas.

En el proyecto, los cinco se escriben sobre la misma dependencia. Antes de leerlos hay que fijar dos
cosas que se repiten en todos.

La primera son los datos del estudiante, que son siempre los mismos y se declaran una vez arriba del
archivo para no repetirlos en cada prueba:

```python
DATOS = ("Ana Perez", "12.345.678-9", "ana.perez@correo.cl")
```

Cuando después aparezca `*DATOS` dentro de una llamada, ese asterisco significa **«desarma esta
tupla y entrega sus tres elementos como tres argumentos separados»**. Es decir, escribir
`confirmar_reserva(1, 4, False, *DATOS, enviar=algo)` es exactamente lo mismo que escribir
`confirmar_reserva(1, 4, False, "Ana Perez", "12.345.678-9", "ana.perez@correo.cl", enviar=algo)`.
El asterisco ahorra la repetición, no cambia nada.

La segunda son los tres números sueltos del principio, que siguen el orden de la firma. Conviene
traducir una llamada completa a una frase, porque después van a pasar muy rápido:

| La llamada | Qué está preguntando |
|------------|---------------------|
| `confirmar_reserva(1, 4, False, *DATOS, ...)` | Ana, que ya tiene **1** reserva esta semana, pide el bloque **4**, que **no** está tomado. ¿Qué pasa? |
| `confirmar_reserva(3, 4, False, *DATOS, ...)` | Ana, que ya tiene **3** reservas —el máximo—, pide el bloque 4 libre. Debe rechazarse por cupo. |
| `confirmar_reserva(1, 4, True, *DATOS, ...)` | Ana pide el bloque 4, pero **ya está tomado** por otra persona. Debe rechazarse. |

Con eso a la vista, los cinco tipos. Un **dummy** se pasa cuando el parámetro tiene que existir y no
va a usarse: si la reserva se rechaza por cupo, el envío nunca llega a ocurrir.

```python
def test_dummy_una_reserva_rechazada_no_notifica() -> None:
    dummy = None
    assert confirmar_reserva(3, 4, False, *DATOS, enviar=dummy) == "rechazada"
```

Que `None` no explote es la comprobación: prueba que por ese camino no se notifica. Un **stub**
devuelve una respuesta fija, y hacen falta dos para cubrir los dos desenlaces:

```python
def test_stub_envio_exitoso() -> None:
    def stub_envio_ok(correo: str, cuerpo: str) -> bool:
        return True

    assert confirmar_reserva(1, 4, False, *DATOS, enviar=stub_envio_ok) == "confirmada"


def test_stub_envio_rechazado() -> None:
    def stub_envio_falla(correo: str, cuerpo: str) -> bool:
        return False

    assert confirmar_reserva(1, 4, False, *DATOS, enviar=stub_envio_falla) == "pendiente"
```

Un **spy** es un stub que además anota cómo lo llamaron, y eso permite afirmar sobre lo que salió del
sistema:

```python
def test_spy_el_comprobante_viaja_al_correo_del_estudiante() -> None:
    llamadas: list[tuple[str, str]] = []

    def spy_envio(correo: str, cuerpo: str) -> bool:
        llamadas.append((correo, cuerpo))
        return True

    confirmar_reserva(1, 4, False, *DATOS, enviar=spy_envio)

    assert len(llamadas) == 1
    destinatario, cuerpo = llamadas[0]
    assert destinatario == "ana.perez@correo.cl"
    assert "bloque 4" in cuerpo
```

Un **mock** viene programado con la expectativa y falla si la interacción no ocurre como se declaró.
La biblioteca estándar de Python lo trae en `unittest.mock`:

```python
def test_mock_se_notifica_exactamente_una_vez() -> None:
    mock_envio = Mock(return_value=True)

    confirmar_reserva(1, 4, False, *DATOS, enviar=mock_envio)

    mock_envio.assert_called_once_with(
        "ana.perez@correo.cl", "Ana Perez | 12.345.678-9 | ana.perez@correo.cl | bloque 4"
    )
```

Aquí hay tres cosas nuevas, y las tres vienen de `unittest.mock`, que es parte de Python y no se
instala:

| Pieza | Qué hace |
|-------|----------|
| `Mock()` | Fabrica un objeto que acepta cualquier llamada sin quejarse y anota todas las que recibe. |
| `return_value=True` | Le dice qué devolver cuando lo llamen. Sin esto devolvería otro objeto `Mock`, no un booleano. |
| `assert_called_once_with(...)` | **La aserción de esta prueba.** Falla si el objeto no fue llamado, si fue llamado más de una vez, o si los argumentos no fueron exactamente esos dos. |

Nótese dónde quedó la aserción: **no compara lo que devolvió `confirmar_reserva()`**. De hecho esta
prueba ignora el resultado de la función. Lo que comprueba es que la notificación salió, una sola
vez, con ese destinatario y ese texto exacto. Esa es la diferencia entre un mock y todo lo anterior,
y el apartado siguiente le pone nombre.

Y un **fake** es una implementación que de verdad funciona, pero que no serviría en el sistema real:
una bandeja de salida guardada en memoria.

```python
class BandejaEnMemoria:
    def __init__(self) -> None:
        self.enviados: list[tuple[str, str]] = []

    def enviar(self, correo: str, cuerpo: str) -> bool:
        if "@" not in correo:
            return False
        self.enviados.append((correo, cuerpo))
        return True
```

Ese fragmento introduce sintaxis nueva, así que se lee pieza por pieza:

| Pieza | Qué es |
|-------|--------|
| `class BandejaEnMemoria:` | Declara una **clase**: un molde que junta datos y las funciones que operan sobre esos datos. Escribir `BandejaEnMemoria()` fabrica un objeto a partir del molde. |
| `def __init__(self)` | El método que Python ejecuta **al fabricar** el objeto. Sirve para dejarlo en su estado inicial. Los dos guiones bajos a cada lado indican que el nombre es especial para Python, no elegido por quien programa. |
| `self` | El objeto que se está fabricando o usando, recibido como primer parámetro. `self.enviados` es «la lista de enviados **de este** objeto», distinta para cada bandeja que se fabrique. |
| `list[tuple[str, str]]` | La anotación de tipo: una lista cuyos elementos son pares de dos cadenas de texto. Aquí, cada par es un envío: destinatario y cuerpo. |
| `.append(...)` | Agrega un elemento al final de la lista. |
| `"@" not in correo` | Comprueba que la dirección no contenga arroba, como validación mínima de una dirección de correo. |

Es un fake y no un stub porque **tiene comportamiento propio**: acepta o rechaza según lo que
recibe, y guarda lo aceptado. No serviría en el sistema real porque los correos no llegan a ninguna
parte y se pierden apenas termina el programa, que es exactamente el atajo que Fowler describe.

Los seis casos pasan:

```text
test_dobles.py::test_dummy_una_reserva_rechazada_no_notifica PASSED
test_dobles.py::test_stub_envio_exitoso PASSED
test_dobles.py::test_stub_envio_rechazado PASSED
test_dobles.py::test_spy_el_comprobante_viaja_al_correo_del_estudiante PASSED
test_dobles.py::test_mock_se_notifica_exactamente_una_vez PASSED
test_dobles.py::test_fake_la_bandeja_rechaza_una_direccion_invalida PASSED
6 passed in 0.15s
```

La distinción que sostiene toda la taxonomía es la que Fowler formula así:

> With state verification we do this by asserts against the warehouse's state. Mocks use **behavior
> verification**, where we instead check to see if the order made the correct calls on the warehouse.

> Con la verificación de estado hacemos esto mediante aserciones contra el estado del almacén. Los
> mocks usan **verificación de comportamiento**, donde en cambio comprobamos si el pedido hizo las
> llamadas correctas sobre el almacén.

Dicho en términos del proyecto: el stub sirve para comprobar **qué devolvió** `confirmar_reserva()`;
el mock sirve para comprobar **que llamó** al envío. Son dos preguntas distintas, y de ahí que llamar
«mock» a los cinco borre información. Cuando alguien dice «mockeé el correo», no se sabe si su prueba
verifica el estado que produjo el sistema o la conversación que el sistema tuvo con su dependencia.

| Tipo | Qué aporta | Cuándo corresponde |
|------|-----------|--------------------|
| Dummy | Nada; ocupa el lugar | El parámetro es obligatorio y ese camino no lo usa |
| Stub | Una respuesta fija | Se quiere provocar un desenlace concreto y afirmar sobre el resultado |
| Spy | Respuesta fija más registro | Además del resultado, interesa qué salió hacia la dependencia |
| Mock | Expectativa que se verifica sola | Lo que se quiere probar **es** la interacción, no el valor devuelto |
| Fake | Una implementación real y liviana | Se necesita comportamiento, no una respuesta fija |

### 3.3 Una suite al 100 % que no verifica nada

Con los seis casos anteriores, la cobertura de la función que confirma queda así:

```text
Name              Stmts   Miss Branch BrPart  Cover   Missing
-------------------------------------------------------------
confirmacion.py      10      0      4      0   100%
-------------------------------------------------------------
TOTAL                10      0      4      0   100%
6 passed in 0.21s
```

Cien por ciento de sentencias, cien por ciento de ramas, cuatro de cuatro, nada parcial. Según todo
lo que se midió en el bloque anterior, esta suite está completa: no hay línea sin ejecutar ni arista
sin recorrer, y cada prueba tiene aserciones de verdad.

Ahora ocurre algo que ocurre todo el tiempo en un proyecto real: el equipo que mantiene el servicio
de correo publica una versión nueva. Ya no recibe destinatario y cuerpo, sino destinatario, asunto y
cuerpo. El servicio queda impecable:

```python
def enviar_confirmacion(destinatario: str, asunto: str, cuerpo: str) -> bool:
    """Entrega el comprobante al servicio de correo institucional."""
    peticion = urllib.request.Request(
        SERVICIO,
        data=cuerpo.encode("utf-8"),
        headers={"X-Destinatario": destinatario, "X-Asunto": asunto},
    )
    with urllib.request.urlopen(peticion, timeout=5) as respuesta:
        return respuesta.status == 202
```

`confirmar_reserva()` sigue llamando con dos argumentos, porque nadie lo actualizó. Se ejecuta la
suite completa sobre ese estado:

```text
Name              Stmts   Miss Branch BrPart  Cover   Missing
-------------------------------------------------------------
confirmacion.py      10      0      4      0   100%
-------------------------------------------------------------
TOTAL                10      0      4      0   100%
6 passed in 0.20s
```

Seis en verde. Cien por ciento en las dos medidas. Y el sistema está roto:

```text
TypeError: enviar_confirmacion() missing 1 required positional argument: 'cuerpo'
```

Ese es el mecanismo completo, y no tiene nada de sutil: **los dobles no están conectados a la
dependencia que sustituyen.** Cada uno de los cinco recibe dos argumentos porque su autor decidió
que la dependencia recibía dos argumentos. Cuando eso deja de ser cierto, los dobles siguen
aceptándolo, y la suite informa que todo está perfecto porque, dentro del mundo que la suite
construyó, todo está perfecto. El 100 % es real; lo que se cubrió al 100 % es el supuesto del autor,
no el sistema.

En el vocabulario del bloque anterior: el cambio de firma es un mutante, y esta suite lo deja
**sobrevivir** con cobertura total.

Hay una defensa concreta, y está en la misma biblioteca estándar. `Mock()` suelto acepta cualquier
llamada; `create_autospec()` construye el doble **a partir de la función real** y rechaza lo que la
función real rechazaría:

```python
def test_mock_suelto_acepta_cualquier_llamada() -> None:
    mock_envio = Mock(return_value=True)
    assert confirmar_reserva(1, 4, False, *DATOS, enviar=mock_envio) == "confirmada"


def test_doble_con_autospec_exige_la_firma_real() -> None:
    doble = create_autospec(enviar_confirmacion, return_value=True)
    assert confirmar_reserva(1, 4, False, *DATOS, enviar=doble) == "confirmada"
```

Los dos contra el servicio ya cambiado:

```text
.F                                                                       [100%]
E   TypeError: missing a required argument: 'cuerpo'
FAILED test_autospec.py::test_doble_con_autospec_exige_la_firma_real
1 failed, 1 passed in 0.09s
```

Mismo código, mismo cambio, mismo caso de prueba. El doble suelto pasa; el doble atado a la firma
real falla y avisa antes de producción. La regla que se sigue de esto es corta: **un doble debe
derivarse de la dependencia, no escribirse de memoria.**

Y queda una limitación que `autospec` no resuelve, y hay que decirla. Atar el doble a la firma
protege de un cambio de firma, no de un cambio de **conducta**. Si el servicio real empezara a lanzar
una excepción en lugar de devolver `False`, los dos stubs seguirían devolviendo booleanos, la rama
`"pendiente"` seguiría cubierta, y el caso que de verdad ocurre en producción seguiría sin probarse.
Por eso el doble nunca reemplaza a la prueba que habla con la dependencia de verdad: la reduce a unas
pocas, pero no a cero.

### 3.4 Una discusión que sigue abierta

Cuánto sustituir no es un asunto resuelto, y presentarlo como resuelto sería falso. Fowler describe
dos posiciones con nombre propio:

> The **classical TDD** style is to use real objects if possible and a double if it's awkward to use
> the real thing. A **mockist TDD** practitioner, however, will always use a mock for any object with
> interesting behavior.

> El estilo **clásico** de TDD consiste en usar objetos reales cuando se puede, y un doble cuando
> usar la cosa real resulta incómodo. Quien practica el TDD **mockista**, en cambio, siempre usará
> un mock para cualquier objeto que tenga comportamiento interesante.

Y declara la suya sin presentarla como la correcta:

> Personally I've always been a old fashioned classic TDDer and thus far I don't see any reason to
> change.

> Personalmente siempre he sido un practicante clásico de TDD, a la antigua, y hasta ahora no veo
> ninguna razón para cambiar.

Los argumentos de cada lado son reales. Quien sustituye todo obtiene pruebas rápidas, aisladas y que
señalan con precisión la unidad que falló; a cambio, su suite queda acoplada a **cómo** está hecho el
código y se rompe cuando se refactoriza sin cambiar el comportamiento, además de exponerse al
problema del apartado anterior. Quien sustituye lo mínimo obtiene pruebas que verifican la
integración de verdad; a cambio son más lentas, fallan por causas ajenas y localizan peor el
defecto.

Lo que no está en discusión es el criterio para decidir caso a caso: sustituir cuando la dependencia
impide provocar el caso que interesa, y no sustituir cuando lo que se quiere verificar es justamente
que dos piezas se entienden.

### 3.5 Lo que cambia cuando el doble lo escribe un agente

Un agente escribe dobles muy rápido, y el riesgo del apartado 3.3 se multiplica por una razón
concreta: el agente construye el doble a partir del **código que tiene en el contexto**. Si se le
pidió una prueba para `confirmar_reserva()` y solo se le mostró ese archivo, va a inventar la forma
de `enviar` a partir de cómo se la llama ahí. El doble va a calzar perfecto con esa línea que la
llama y no va a tener ninguna relación con la dependencia real, que el agente nunca vio.

- **Lo que hace bien:** producir los cinco tipos con la sintaxis correcta, y sobre todo cubrir la
  rama de fallo, que es la que más se olvida a mano porque hay que inventarse cómo provocarla.
- **Lo que no conviene delegar:** la forma y la conducta de la dependencia. Ese dato no está en el
  archivo que se está probando; está en la dependencia, y hay que dárselo.
- **El error frecuente:** un `Mock()` suelto para todo, con `return_value` elegido por lo que hace
  falta para que la prueba pase. Es verde, es 100 %, y no está atado a nada.

La práctica que lo corrige es de una línea: pedir el doble **derivado** de la dependencia —con
`create_autospec()` o con la firma real a la vista— y revisar que el `return_value` corresponda a
algo que la dependencia realmente devuelve. Si el agente no tuvo delante el código de la dependencia,
su doble es una suposición con sintaxis correcta.

## Ejercicio del bloque

Sobre el proyecto propio, que a esta altura casi siempre tiene al menos una dependencia que no
controla: una base de datos, una API, el reloj del sistema o el sistema de archivos.

1. Nombra esa dependencia y di cuál de los cuatro problemas del apartado 3.1 es el que te obliga a
   sustituirla. Si no es ninguno, no la sustituyas.
2. Escribe **dos** dobles para ella: uno que provoque el caso exitoso y otro que provoque el caso de
   fallo. Declara de qué tipo es cada uno usando los nombres de la tabla, y justifica por qué ese y
   no otro.
3. Aplícale a tu doble la prueba del apartado 3.3: cambia la firma de la dependencia real —un
   parámetro más— y ejecuta la suite. Si sigue en verde, reescribe el doble con `create_autospec()` y
   vuelve a ejecutar. Deja la firma como estaba al terminar.
4. Escribe en una línea un cambio de **conducta** de esa dependencia que tu suite no detectaría ni
   con `autospec`, y qué prueba haría falta para cubrirlo.

**Pista:** si tu dependencia es el reloj, el problema del apartado 3.1 es el cuarto y no el segundo:
`datetime.now()` es rapidísimo, pero no se puede pedir que sea el 18 de septiembre. Y para el punto
4, piensa en qué devuelve la dependencia cuando algo va mal: `None`, una excepción, una cadena vacía
o un código de error no son lo mismo.

**Evidencia esperada:** la dependencia identificada con su motivo de sustitución, dos dobles
tipificados con su justificación, el resultado literal de la suite antes y después del cambio de
firma en ambas versiones del doble, y un cambio de conducta nombrado con la prueba que lo cubriría.

## Preguntas guía

1. El `test_dummy` pasa `None` como dependencia y la prueba queda en verde. Si mañana alguien mueve
   la notificación antes de la comprobación del cupo, ¿qué pasaría con esa prueba, y por qué eso la
   convierte en una prueba útil y no en un descuido?

   **Pista:** piensa qué ocurre al intentar llamar a `None`, y quién se enteraría.

2. La suite con dobles llegó al 100 % de sentencias y de ramas y no detectó que la dependencia había
   cambiado de firma. ¿Habría servido subir la exigencia de cobertura, agregar más pruebas con dobles
   o medir cobertura de condición modificada?

   **Pista:** las tres alternativas miden lo mismo dentro del mundo que la suite construyó. Revisa
   qué parte del sistema quedó fuera de ese mundo.

3. Un mock verifica que el sistema llamó a su dependencia de una forma exacta. ¿En qué situación esa
   verificación se vuelve un estorbo que hay que borrar en cada refactorización, y cómo se distingue
   de la situación en que verificar la llamada es justamente lo que hay que probar?

   **Pista:** compara una llamada que el requisito exige —que el comprobante se envíe— con una que es
   solo una decisión de implementación, como en cuántos pasos se arma el cuerpo del mensaje.

## Fuentes técnicas del bloque

- [Martin Fowler — *Mocks Aren't Stubs*, 2 de enero de 2007 (primera versión, 8 de julio de 2004)](https://martinfowler.com/articles/mocksArentStubs.html) — la taxonomía de los cinco dobles con sus definiciones, la distinción entre verificación de estado y verificación de comportamiento, la descripción de las posiciones clásica y *mockist*, y la posición declarada del autor.
- Gerard Meszaros — *xUnit Test Patterns: Refactoring Test Code*, Addison-Wesley, 2007 — origen del término «doble de prueba» y de la taxonomía; las definiciones citadas en este bloque son las que Fowler recoge de ese trabajo.
- [Documentación de `unittest.mock` de la biblioteca estándar de Python](https://docs.python.org/3/library/unittest.mock.html) — `Mock`, `return_value`, `assert_called_once_with` y `create_autospec`, que construye el doble a partir de la firma del objeto real.
- Ejecuciones registradas para esta clase sobre el proyecto de reserva de laboratorio, con Python 3.12.12, pytest 9.1.1, pytest-cov 7.1.0 y coverage 7.16.1: el fallo por resolución de nombre al usar el servicio real, los seis casos de los cinco tipos de doble en verde, la cobertura de 100 % en sentencias y ramas de la función que confirma, esa misma cobertura y ese mismo verde después de cambiar la firma del servicio, el `TypeError` que el sistema produce en ese estado, y el contraste entre el `Mock()` suelto que pasa y el doble con `create_autospec()` que falla.

---

# BLOQUE 4: Auditar una suite que uno no escribió

- **Duración:** 25 minutos
- **Objetivo del bloque:** aplicar a una suite entregada y en verde los tres criterios construidos
  durante la sesión —de dónde salió el esperado, qué mutante detecta, de qué se derivó el doble— y
  resolver cada prueba con una de cuatro decisiones justificadas. Al finalizar, el estudiante debe
  poder recibir pruebas que no escribió, decir cuáles incorpora y cuáles no, y sostener cada una de
  esas decisiones con evidencia de ejecución.
- **Modalidad:** trabajo en parejas sobre una suite entregada, con auditoría colectiva y registro.
- **Ritmo sugerido:** 3 minutos para leer la suite, 4 para el contexto de la solicitud, 9 para los
  tres criterios, 5 para las cuatro decisiones y 4 para la evidencia sobre productividad.

## Desarrollo

### 4.1 La suite que llega, y lo que informa de sí misma

Llega para revisión esta suite, escrita sobre el proyecto de reserva. Reproduce los tres problemas
que aparecen con más frecuencia cuando se pide «escribe las pruebas de este proyecto» sin entregar
nada más que el código:

```python
from datetime import datetime, timedelta
from unittest.mock import Mock

from confirmacion import confirmar_reserva
from reservas import comprobante, puede_cancelar, puede_reservar

DATOS = ("Ana Perez", "12.345.678-9", "ana.perez@correo.cl")


def test_cancelar_con_exactamente_dos_horas_no_se_permite() -> None:
    ahora = datetime(2026, 9, 21, 8, 0)
    inicio = ahora + timedelta(hours=2)
    assert puede_cancelar(inicio, ahora) is False


def test_comprobante_identifica_al_estudiante() -> None:
    assert "Ana Perez" in comprobante(*DATOS, 4)


def test_confirmacion_exitosa() -> None:
    envio = Mock(return_value=True)
    assert confirmar_reserva(1, 4, False, *DATOS, enviar=envio) == "confirmada"


def test_no_se_reserva_un_bloque_ocupado() -> None:
    assert puede_reservar(1, 4, tomado=True) is False
```

Lo primero es mirar lo que la suite informa de sí misma:

```text
....                                                                     [100%]
4 passed in 0.09s
```

```text
Name              Stmts   Miss Branch BrPart  Cover   Missing
-------------------------------------------------------------
confirmacion.py      10      2      4      2    71%   17, 21
reservas.py          17      1      4      1    90%   15
-------------------------------------------------------------
TOTAL                27      3      8      3    83%
4 passed in 0.21s
```

Cuatro nombres descriptivos, cuatro aserciones reales, ninguna prueba vacía, 83 % de cobertura. En
una revisión por lectura, esto se aprueba.

Y la columna `Missing` ya dice algo antes de aplicar ningún criterio. Las tres líneas sin cubrir son
`return "rechazada"`, `return "pendiente"` y el `return False` del bloque fuera de jornada: **las
tres son formas de decir que no**. La suite probó que el sistema acepta; casi no probó que rechace,
que es donde viven los requisitos que protegen al laboratorio.

### 4.2 Dar el contexto antes de pedir

Buena parte de lo que va a aparecer en la auditoría no es culpa de quien generó las pruebas, sino de
lo que se le entregó. Un encargo que solo adjunta el archivo a probar produce exactamente esta
suite, y de forma predecible: sin el requisito, el esperado sale del código; sin la dependencia, el
doble se inventa; sin las reglas de rechazo, se prueba el camino feliz.

El encargo acotado incluye lo que el código no contiene:

> Escribe pruebas para `confirmar_reserva()`. El requisito dice: la jornada tiene ocho bloques del 1
> al 8; un estudiante puede tener hasta 3 reservas por semana; una reserva se cancela hasta 2 horas
> antes del inicio. Adjunto el requisito completo, el módulo `reservas.py` y la firma real de
> `enviar_confirmacion()`, que es la dependencia externa. Para cada prueba indica de dónde sale el
> resultado esperado y qué cambio en el código la haría fallar. Si el requisito no decide un caso,
> marca la prueba como «requiere decisión» en vez de elegir por tu cuenta. Los dobles deben
> derivarse de la firma real de la dependencia.

Tres de esas instrucciones son las que evitan los tres defectos que siguen: declarar la procedencia
del esperado, nombrar el mutante y derivar el doble. La cuarta —marcar lo que el requisito no
decide— es la que impide que una ambigüedad quede resuelta en silencio.

### 4.3 Los tres criterios, aplicados uno por uno

**Criterio 1: ¿de dónde salió el resultado esperado?**

El requisito dice «hasta 2 horas antes». No dice si las dos horas exactas entran o quedan fuera; esa
ambigüedad quedó registrada como pendiente en la sesión anterior y sigue sin resolverse. El código
resuelve con una comparación estricta:

```python
return inicio_bloque - ahora > ANTICIPACION_CANCELACION
```

Y la primera prueba afirma `is False` para las dos horas exactas. Ese esperado no salió del
requisito, porque el requisito no lo dice: salió de leer el operador. La prueba convirtió una
decisión pendiente en un hecho verificado.

**Criterio 2: ¿qué cambio en el código haría fallar cada prueba?**

Se aplican tres mutantes, uno por vez, sobre el proyecto restaurado entre cada uno:

```text
MATADO     M1  puede_cancelar: '>' pasa a '>='  (incluir la igualdad en el limite)
            -> 1 failed, 3 passed in 0.09s
SOBREVIVE  M2  comprobante: se deja de incluir el correo en el texto
            -> 4 passed in 0.08s
SOBREVIVE  M3  enviar_confirmacion: el servicio agrega un parametro
            -> 4 passed in 0.08s
```

Los tres resultados se leen distinto, y el primero al revés de lo que parece.

**M1 fue matado, y eso es el problema, no la solución.** La prueba sí tiene poder de detección; lo
que detecta es cualquier intento de cambiar la decisión que el código tomó. Si mañana la
coordinación del laboratorio resuelve que dos horas exactas sí permiten cancelar —una de las dos
respuestas posibles a una pregunta abierta—, esta prueba se pone en rojo y va a parecer que la
corrección rompió algo. Una prueba con el esperado tomado del código no es débil: es un candado
sobre el comportamiento actual.

**M2 sobrevive** porque `"Ana Perez" in comprobante(...)` es verdadero para casi cualquier
implementación. La prueba pasa si el comprobante pierde el correo, si cambia de orden, y también si
sigue exponiendo el RUT completo, que es el hallazgo que la auditoría del módulo ya había registrado.
Cubre la línea y no comprueba el requisito.

**M3 sobrevive** por lo del bloque anterior: `Mock(return_value=True)` no está atado a la firma real,
así que acepta la llamada de dos argumentos aunque el servicio ya pida tres.

**Criterio 3: ¿de qué se derivó el doble?**

De nada. `Mock(return_value=True)` es una suposición con sintaxis correcta: alguien decidió que el
envío devuelve `True` y que recibe dos argumentos. Reescrito como `create_autospec(enviar_confirmacion,
return_value=True)`, el doble queda atado a la dependencia y M3 deja de sobrevivir.

### 4.4 Cuatro decisiones, y ninguna es «lo dejo por si acaso»

Auditar no termina en el hallazgo: termina en una decisión registrada por cada prueba. Las cuatro
posibles son las mismas que se usaron para auditar casos propuestos al comienzo del módulo, ahora
sobre código ejecutable:

| Prueba | Decisión | Fundamento |
|--------|----------|-----------|
| `test_no_se_reserva_un_bloque_ocupado` | **Aceptar** | El esperado sale del requisito, la aserción es específica y mata el mutante correspondiente. |
| `test_confirmacion_exitosa` | **Modificar** | El caso es correcto y el doble no. Se reescribe con `create_autospec()` sobre la firma real. |
| `test_cancelar_con_exactamente_dos_horas_no_se_permite` | **Posponer** | El requisito no decide el caso. Se marca como pendiente de aclaración y no se incorpora hasta que la coordinación resuelva. |
| `test_comprobante_identifica_al_estudiante` | **Rechazar** | No distingue una implementación correcta de una defectuosa; deja pasar incluso el defecto de confidencialidad ya identificado. |

La decisión que más cuesta es la tercera, porque la prueba está bien escrita y pasa. Posponerla no
es dudar de la prueba: es negarse a que una herramienta resuelva por el equipo una pregunta que el
equipo no ha respondido. Y la cuarta es la que más cuesta defender ante alguien que mira el
porcentaje, porque rechazarla **baja** la cobertura.

### 4.5 Qué dice la evidencia sobre trabajar así

Queda una afirmación heredada que conviene mirar con datos, porque sostiene buena parte de las
decisiones de un equipo: que usar un agente para escribir pruebas es, sin más, más rápido.

En julio de 2025, METR publicó un **ensayo controlado aleatorizado** sobre este punto. El nombre
describe el método y es el que se usa para probar medicamentos: a cada tarea se le asigna **al
azar** si se puede usar IA o no, en vez de dejar que la persona elija. Eso importa porque si cada
uno eligiera, usaría la IA justo en las tareas donde cree que le conviene, y después sería imposible
saber si el resultado vino de la herramienta o de la elección.

Su diseño: 16 desarrolladores experimentados, con años de contribución a repositorios grandes
—«averaging 22k+ stars and 1M+ lines of code», es decir con más de 22 000 marcas de interés público
en GitHub y más de un millón de líneas de código—, resolviendo 246 tareas reales de sus propios
proyectos. El resultado:

> When developers are allowed to use AI tools, they take 19% longer to complete issues—a significant
> slowdown that goes against developer beliefs and expert forecasts.

> Cuando se permite a los desarrolladores usar herramientas de IA, tardan un 19 % más en resolver
> las tareas: una desaceleración significativa que contradice las creencias de los propios
> desarrolladores y los pronósticos de los expertos.

Y el dato que importa para esta clase no es el 19 %, sino el que viene al lado:

> expected AI to speed them up by 24%, and even after experiencing the slowdown, they still believed
> AI had sped them up by 20%.

> esperaban que la IA los acelerara un 24 % y, aun después de haber experimentado la
> desaceleración, seguían creyendo que la IA los había acelerado un 20 %.

Midieron más lento y sintieron más rápido, **después** de haber vivido la experiencia. Esa brecha
entre la sensación y la medición es la misma de toda la sesión: una suite en verde con 83 % produce
la sensación de un trabajo terminado, y hasta que no se aplican los tres criterios no se sabe qué
hay debajo.

Los propios autores acotan qué se puede concluir, y hay que respetarlo: dicen explícitamente que su
estudio **no** demuestra que la IA no acelere a la mayoría de los desarrolladores, que sus 16
participantes no representan a toda la población, que no descartan mejoras futuras ni formas más
efectivas de uso, y que sus desarrolladores usaron la herramienta unas decenas de horas cuando
podría haber efectos de aprendizaje que aparecen recién después de varios cientos. Es un resultado
sólido sobre un grupo concreto, no una ley general.

Lo que sí es transferible: la percepción propia de productividad no es un instrumento de medición
confiable, ni siquiera con experiencia. Por eso la decisión sobre una prueba se toma con un mutante
ejecutado y no con la impresión de que la suite se ve bien.

## Ejercicio del bloque

En parejas, e intercambiando proyectos: cada pareja le pide a un agente pruebas para el proyecto de
la otra, usando un encargo escrito por ustedes.

1. Redacten el encargo. Debe incluir el requisito, la dependencia externa si la hay, y las cuatro
   instrucciones del apartado 4.2. Guarden el texto: es parte de la entrega.
2. Ejecuten la suite recibida y registren las dos salidas literales: el resultado de la suite y el
   informe de cobertura con `--cov-branch`.
3. Apliquen los tres criterios a cada prueba. Para el criterio del mutante, escriban y ejecuten al
   menos **dos** mutantes por proyecto, y anoten si fueron matados o sobrevivieron.
4. Resuelvan cada prueba con una de las cuatro decisiones y escriban el fundamento en una línea. Al
   menos una decisión tiene que ser distinta de «aceptar»; si todas fueron aceptadas, la auditoría no
   buscó lo suficiente.

**Pista:** el mutante más revelador no es el que rompe todo, sino el que cambia el comportamiento sin
romper la forma: invertir una comparación, quitar un campo de una salida o cambiar el valor que se
devuelve ante un error. Y si una prueba se resiste a que le encuentres un mutante, probablemente su
esperado salió del código.

**Evidencia esperada:** el encargo escrito, las dos salidas literales de la suite recibida, una tabla
con las cuatro decisiones y su fundamento, y el resultado de ejecución de cada mutante con su
veredicto de matado o sobrevivido.

## Preguntas guía

1. Rechazar `test_comprobante_identifica_al_estudiante` baja la cobertura del proyecto. Si el jefe
   del equipo mide el avance por el porcentaje, ¿cómo se defiende esa decisión con lo visto hoy, y
   qué evidencia concreta se lleva a esa conversación?

   **Pista:** la defensa no es una opinión sobre la prueba. Es un mutante ejecutado y su resultado.

2. La decisión de posponer deja una prueba escrita, correcta y sin incorporar, y deja el caso de las
   dos horas exactas sin cubrir. ¿Qué queda registrado mientras tanto, y por qué eso es mejor que
   aceptar la prueba o que borrarla?

   **Pista:** repasa qué es una base de prueba y de dónde debe salir un esperado. La pregunta abierta
   no es del código, es del requisito, y alguien tiene que responderla.

3. El estudio de METR midió que los desarrolladores se sintieron más rápidos después de haber sido
   más lentos. ¿Qué parte del trabajo de hoy está diseñada específicamente para no depender de esa
   sensación, y qué pasaría con la auditoría si se reemplazara por «me parece que esta prueba está
   bien»?

   **Pista:** los tres criterios producen una salida de ejecución. Pregúntate cuál de ellos podría
   responderse sin correr nada.

## Fuentes técnicas del bloque

- [METR — *Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity*, 10 de julio de 2025](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/) — el diseño del ensayo controlado aleatorizado con 16 desarrolladores y 246 tareas sobre sus propios repositorios, el resultado del 19 % más lento, la brecha con el 24 % esperado y el 20 % percibido después, y la lista de afirmaciones que los autores declaran explícitamente no respaldadas por su estudio. [Artículo completo en arXiv:2507.09089](https://arxiv.org/abs/2507.09089).
- [ISO/IEC/IEEE 29119-4:2021](https://www.iso.org/standard/79430.html) — la cláusula 3.32, que exige que el resultado esperado se derive de la especificación o de otra fuente declarada, base del primer criterio de auditoría.
- [Documentación de `unittest.mock`](https://docs.python.org/3/library/unittest.mock.html) — `create_autospec()` como forma de derivar el doble de la dependencia real.
- Ejecuciones registradas para esta clase sobre el proyecto de reserva de laboratorio, con Python 3.12.12, pytest 9.1.1, pytest-cov 7.1.0 y coverage 7.16.1: los cuatro casos de la suite entregada en verde, su informe de cobertura de 83 % con las tres líneas de rechazo sin cubrir, y el resultado de los tres mutantes aplicados uno por vez con el proyecto restaurado entre cada ejecución.

---

# Cierre: recorrer, verificar y sustituir

## 1. Tres medidas de una misma pregunta

La sesión midió tres cosas distintas sobre el mismo proyecto, y las tres respondían a la misma
pregunta desde ángulos que no se reemplazan entre sí.

| Qué se midió | Qué informa | Qué no puede informar |
|--------------|-------------|----------------------|
| Cobertura de sentencias y de ramas | Qué código se ejecutó y qué caminos se tomaron | Si alguien comprobó el resultado de ejecutarlo |
| El mutante | Si la suite reacciona a un cambio de comportamiento | Si el comportamiento que defiende es el correcto |
| La procedencia del esperado | Contra qué se está comparando | Nada más; pero sin ella las otras dos pierden sentido |

La tercera es la que ordena a las otras dos. Un mutante matado por una prueba cuyo esperado salió del
código confirma la implementación, no el requisito. Y un 100 % de cobertura sobre dobles que nadie
derivó de su dependencia describe un sistema que no existe.

## 2. La afirmación que se puede sostener

Al terminar la sesión anterior, la afirmación defendible era sobre la muestra: qué casos se eligieron
y por qué. Hoy se le agrega una segunda, y las dos juntas son lo que se le pide a un profesional:

> Esta suite ejecuta estas partes del sistema —y puedo mostrar cuáles no—, comprueba estos
> comportamientos con esperados que salieron del requisito, y detecta estos cambios concretos, que
> puedo demostrar aplicándolos.

Lo que ya no se puede afirmar, y conviene decirlo en voz alta: que un porcentaje alto signifique que
el sistema funciona, y que una suite en verde signifique que alguien verificó algo.

## 3. Ticket de salida

En tres líneas, antes de salir:

1. El número de cobertura de tu proyecto y la línea de `Missing` que vas a atacar primero.
2. Un mutante que escribiste, con el resultado real: matado o sobrevivió.
3. Una dependencia de tu proyecto que hoy sustituirías, con el tipo de doble que le corresponde.

## 4. Próxima sesión: escribir la prueba antes que el código

Todo lo de hoy se midió **después**: el código ya estaba escrito y se fue a averiguar qué comprobaba
la suite. Ese orden es el que obliga a preguntar «¿qué haría fallar esta prueba?», porque una prueba
que nació en verde nunca demostró que pudiera ponerse en rojo.

La próxima sesión invierte el orden. En desarrollo guiado por pruebas, la prueba se escribe primero y
por eso **empieza fallando**: la pregunta del mutante queda respondida por construcción, porque se
vio el rojo antes de que existiera el código que lo apaga. Se hará el ciclo completo sobre el
proyecto y se traducirá a Vitest, para comprobar que el ciclo no depende del lenguaje.

## Mensaje final

La cobertura, el mutante y el doble son instrumentos, y los tres se pueden satisfacer sin verificar
nada: se llega al 100 % sin una aserción, se mata un mutante defendiendo un defecto y se sustituye
una dependencia por una suposición. Ninguno de los tres falla por error de la herramienta; fallan
cuando nadie decide qué se está comprobando.

> Un número alto describe cuánto se recorrió. Una aserción describe qué se comprobó. La procedencia
> del esperado describe contra qué. Un agente puede producir las tres cosas en segundos; sigue siendo
> tuyo decidir si lo que quedó escrito comprueba el requisito o solo repite el código.
