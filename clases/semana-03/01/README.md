# Clase 07 - Semana 03 - Lo que no está escrito no se puede probar: el ciclo de vida, la base de prueba y la documentación que la sostiene

- **Unidad:** 01 · Calidad y Testing de Software
- **Fecha:** Lunes 7 de septiembre de 2026
- **Duración:** 3 horas pedagógicas · 140 minutos (08:30 - 10:50)
- **Modalidad:** Presencial en Laboratorio PC
- **Docente:** Diego Obando
- **Marco de referencia:** ISO/IEC/IEEE 29119-2:2021 · procesos de prueba · ISO/IEC/IEEE 29119-3:2021 · documentación de pruebas · ISO/IEC 25010:2023 · características de calidad · Ley 21.719 · privacidad por diseño

---

# Objetivos de la Clase

## Objetivo General

Al finalizar esta sesión, el estudiante será capaz de ubicar cada tipo de prueba en la etapa del
ciclo de vida donde puede ejecutarse, reconociendo que lo que decide qué prueba es posible no es la
voluntad de quien prueba sino qué existe todavía: mientras no hay código, la única prueba disponible
es la comparación contra un documento. Sobre esa base nombrará el concepto que la clase anterior
dejó abierto sin nombre —la **base de prueba**— y ubicará la documentación que define
ISO/IEC/IEEE 29119-3:2021, no como un formulario que hay que llenar sino como el inventario de lo
que un proyecto necesita tener escrito para que sus pruebas signifiquen algo. Cerrará haciendo el
trabajo concreto que ese inventario exige: traducir una característica de calidad y una obligación
de protección de datos personales a criterios con umbral y método de medición, que es la forma que
toma un requisito cuando se escribe para poder probarlo.

## Objetivos Específicos

1. **Ubicar cada prueba en la etapa del ciclo de vida que la admite**, explicando en cada momento
   qué artefacto existe ya —requisito, diseño, código, componentes integrados, sistema desplegado— y
   qué prueba se vuelve posible por eso, hasta poder justificar por qué la revisión y la inspección
   son las únicas pruebas disponibles antes de que exista una sola línea ejecutable.
2. **Evaluar críticamente la curva de costo del defecto**, la cifra más repetida del oficio,
   siguiendo el rastro documental de la razón 1:10:100 hasta su origen, contrastándola con la
   formulación que sus autores sí publicaron y con el estudio de 171 proyectos que fue a buscar el
   efecto y no lo encontró, para sostener con un argumento propio por qué conviene escribir el
   requisito temprano cuando la justificación económica habitual no se sostiene.
3. **Nombrar la base de prueba de una prueba propia**, reconociendo la advertencia que el estándar
   incluye en su propia definición —que la base de prueba puede ser un entendimiento no documentado
   del comportamiento esperado— y explicando qué le ocurre a una revisión cuando esa es la única
   base disponible.
4. **Inventariar la documentación de pruebas del proyecto propio** contra el conjunto que define
   ISO/IEC/IEEE 29119-3:2021, identificando qué documentos ya existen bajo otro nombre, cuáles
   faltan y cuáles no corresponden, y justificando las omisiones mediante la conformidad adaptada
   que el propio estándar contempla.
5. **Traducir una característica de calidad de ISO/IEC 25010:2023 a un criterio verificable**,
   agregando el umbral y el método de medición que separan una aspiración de un requisito, y
   escribiendo la prueba que ese criterio hace posible.
6. **Convertir en requisitos escritos las obligaciones de finalidad, minimización y privacidad por
   diseño** de la Ley 21.719, y cerrar con ellas el hallazgo que la sesión anterior dejó abierto:
   escribir el requisito que faltaba sobre el tratamiento del dato personal, y la prueba que hasta
   ahora no podía existir porque no había nada contra qué compararla.

## Competencias Transversales

- **Escepticismo ante la cifra heredada:** preguntar por el origen de un número que todo el mundo
  repite, y distinguir entre una afirmación bien fundada y una que solo lleva mucho tiempo en
  circulación.
- **Traducción de lo abstracto a lo medible:** convertir una exigencia formulada como cualidad
  —seguro, usable, confiable, respetuoso de los datos— en una afirmación con umbral, método y
  resultado observable.
- **Documentación proporcional:** decidir qué se escribe y qué no en función de lo que el proyecto
  necesita demostrar, adaptando un estándar en lugar de abandonarlo o de copiarlo completo.
- **Anticipación:** asumir que las decisiones que hacen probable un producto se toman antes de
  escribir el código, y que dejarlas para después no las elimina, solo las vuelve caras.

---

# Mapa de la Clase

| Horario | Sección | Propósito |
|---------|---------|-----------|
| 08:30 - 08:40 | Encuadre | Retomar la pregunta con la que cerró la sesión anterior. El hallazgo que ninguna auditoría vio no se escapó por dificultad técnica: no había documento contra el cual compararlo. Queda por establecer dónde y cuándo se escribe ese documento. |
| 08:40 - 09:05 | Bloque 1 | Recorrer el ciclo de vida preguntando en cada etapa qué existe y qué prueba admite, y examinar la evidencia real detrás de la cifra que se usa para justificar probar temprano. |
| 09:05 - 09:35 | Bloque 2 | Nombrar la base de prueba, conocer el conjunto de documentos que define ISO/IEC/IEEE 29119-3 e inventariar cuáles de ellos ya existen en el proyecto propio bajo otro nombre. |
| 09:35 - 09:45 | Pausa | Descanso técnico. |
| 09:45 - 10:15 | Bloque 3 | Convertir una característica de calidad en un criterio con umbral y método de medición, y escribir la prueba que ese criterio hace posible. |
| 10:15 - 10:40 | Bloque 4 | Traducir finalidad, minimización y privacidad por diseño a requisitos escritos, y cerrar con ellos el hallazgo abierto de la sesión anterior. |
| 10:40 - 10:50 | Cierre | Consolidar qué documentos quedaron escritos, qué pruebas se volvieron posibles gracias a ellos, y qué afirmación puede sostenerse hoy sobre el proyecto que ayer no podía sostenerse. |

---

# BLOQUE 1: Cada etapa admite la prueba que su material permite

- **Duración:** 25 minutos
- **Objetivo del bloque:** establecer que la prueba disponible en cada momento no se elige por
  preferencia sino que la restringe el material que ya existe, y desmontar con fuentes la cifra que
  el oficio usa para justificar probar temprano, hasta dejar en su lugar un argumento que no depende
  de ningún número. Al finalizar, el estudiante debe poder explicar por qué un error en el requisito
  es invisible para todas las pruebas que vienen después.
- **Modalidad:** trabajo individual, con registro escrito sobre el propio repositorio.
- **Ritmo sugerido:** 5 minutos para el mapa de etapas, 6 para la auditoría de la cifra, 4 para lo
  que cambió con los agentes, 6 para la discusión abierta y 4 para el ejercicio.

## Desarrollo

### 1.1 Lo que existe decide lo que se puede probar

La clase anterior terminó con un hallazgo que ninguna auditoría vio. No se escapó por difícil: el
RUT completo estaba en la línea más corta del archivo. Se escapó porque **no había ningún documento
contra el cual compararlo**, y las tres auditorías hacían exactamente lo que se les pidió, que era
comparar el código contra lo escrito.

Eso no fue mala suerte. Fue una consecuencia de en qué etapa se hizo la pregunta.

Un producto de software atraviesa etapas, y en cada una existe un material distinto. La prueba que
puedes ejecutar en un momento dado no depende de tu voluntad ni de tu disciplina: depende de qué
hay construido. No puedes ejecutar una prueba unitaria antes de que exista la función, igual que no
puedes medir el tiempo de respuesta de un sistema que todavía no está desplegado.

| Etapa | Qué existe ya | Qué prueba admite | Contra qué se compara |
|---|---|---|---|
| Requisitos | Una descripción de lo que el producto debe hacer | Ninguna ejecutable. Solo lectura: ¿está completo, es consistente consigo mismo, es verificable? | El conocimiento del dominio y del usuario |
| Diseño | Una decisión de estructura: módulos, contratos, interfaces | Revisión del diseño | El requisito escrito |
| Código | Funciones, tipos y firmas escritas | Prueba estática —tipado, linter, revisión— y prueba unitaria | El requisito y los contratos del diseño |
| Integración | Componentes que se llaman entre sí | Prueba de integración | Los contratos de las interfaces |
| Sistema | El producto completo y desplegado | Prueba de sistema y extremo a extremo | El requisito, recorrido de punta a punta |
| Operación | El producto en uso, con usuarios reales | Validación, monitoreo, análisis de incidentes | La necesidad real, que puede no coincidir con el requisito |

Mira la última columna de arriba abajo. Hay un patrón: **lo que sirve de referencia en cada etapa es
el producto de la etapa anterior.** El código se prueba contra el diseño y el requisito; la
integración, contra los contratos que fijó el diseño; el sistema, contra el requisito completo.

De ahí sale la consecuencia más importante de este bloque, y no es económica sino lógica:

> Un error en el requisito **no puede ser detectado por ninguna prueba que venga después**, porque
> todas esas pruebas lo están usando como referencia. Una prueba en verde no dice que el requisito
> sea correcto; dice que el código coincide con él.

Esto ya lo vimos sin nombrarlo. En la Clase 04, una prueba en verde certificaba un error porque el
criterio contra el que comparaba estaba mal. En la Clase 06, tres auditorías coincidieron en un
punto ciego porque las tres usaban el mismo documento incompleto. Es el mismo fenómeno, y ahora
tiene lugar en el mapa: **está en la primera fila de la tabla**.

Fíjate además en la asimetría de la primera fila. Es la única etapa donde no hay nada que ejecutar,
y por lo tanto la única donde la prueba tiene que ser una lectura hecha por alguien. Ese es el
lugar exacto de lo que hicimos la clase pasada, y también el motivo por el que ninguna herramienta
podía reemplazarlo.

### 1.2 La cifra más repetida del oficio, y de dónde sale

Existe una respuesta estándar a la pregunta «¿por qué escribir bien el requisito desde el
principio?». La habrás escuchado o la vas a escuchar: *un defecto encontrado en producción cuesta
100 veces más que uno encontrado en la etapa de requisitos*. Suele venir acompañada de una curva
que sube de forma explosiva, y de la sigla de una institución respetable.

La afirmación es real y tiene una fuente citable. Barry Boehm y Victor Basili la publicaron en
*IEEE Computer* en enero de 2001, como el punto número uno de su lista de diez:

> "Finding and fixing a software problem after delivery is often 100 times more expensive than
> finding and fixing it during the requirements and design phase."

Hasta aquí, la cita que circula. Pero el párrafo no termina ahí, y lo que sigue casi nunca se
repite. Los propios autores explican que, respecto de la versión de 1987 de esa lista, **agregaron
la palabra «often»** —«a menudo»— para reflejar lo que habían aprendido después. Y a continuación
dan la cifra que nadie cita:

> "One insight shows the cost-escalation factor for small, noncritical software systems to be more
> like 5:1 than 100:1."

Cinco a uno, no cien a uno, para sistemas pequeños y no críticos. Que es la categoría en la que cae
tu proyecto, el mío, y la enorme mayoría del software que se escribe. Los autores agregan todavía un
segundo matiz: una buena arquitectura reduce el factor de escalamiento **incluso en sistemas grandes
y críticos**, porque confina las correcciones a módulos bien encapsulados.

O sea: la fuente que todo el mundo cita para defender el 100:1 dice, en el mismo párrafo, que en tu
caso es 5:1 y que la arquitectura lo baja más. La cifra no es falsa. Está **recortada**.

Y hay una versión peor, que es la que suele aparecer en presentaciones corporativas: una tabla que
atribuye la razón 1:10:100 a un «IBM Systems Sciences Institute». Cuando alguien siguió el rastro
documental de esa cita, encontró que el instituto **no publicó ninguna investigación con ese
resultado**: era un programa interno de capacitación de empleados, la referencia rastreable termina
en unas notas de curso de 1981 citadas por un libro de texto, y el conjunto de datos original nunca
apareció.

Falta el dato más incómodo. En 2016, un equipo formado por Tim Menzies, William Nichols, Forrest
Shull y Lucas Layman fue a buscar el efecto en datos contemporáneos: 171 proyectos de software
desarrollados en el mundo entre 2006 y 2014, el estudio más grande publicado sobre el tema. Su
conclusión es explícita:

> "We found no evidence for the delayed issue effect; i.e. the effort to resolve issues in a later
> phase was not consistently or substantially greater than when issues were resolved soon after
> their introduction."

Y sobre el estado de la evidencia, la frase que conviene recordar:

> "DIE is a commonly held, yet poorly documented belief."

Los autores detallan por qué: los trabajos que reportan el efecto o son del siglo pasado, o citan
trabajos anteriores sin aportar datos nuevos, o citan fuentes que ya no pueden confirmarse. Y
observan que el efecto se reportó por primera vez en **1976**, en la era de las tarjetas perforadas
y los entornos no interactivos, cuando cambiar una línea de código y volver a compilar era una
operación de horas.

Ahora, honestidad en las dos direcciones. Ese mismo estudio declara su propia limitación en la
primera página: los 171 proyectos usan una metodología específica, el Team Software Process, y dos
de los autores trabajan para la institución que la promueve. Ellos mismos lo escriben antes de
presentar los resultados. Un estudio que desmonta una creencia y publica al mismo tiempo el sesgo
de su propia muestra está haciendo el trabajo bien; leerlo sin ese matiz sería cometer el mismo
error que estamos criticando.

**Qué queda en pie.** No queda el 100:1 como ley. Queda un argumento distinto y más sólido, el que
ya dedujimos en 1.1: un error en el requisito es invisible para todas las pruebas posteriores.
No hay que creerle a ninguna cifra para aceptarlo; se sigue de la estructura de la tabla. Y ese
argumento, a diferencia del económico, no tiene excepciones por tamaño de proyecto.

### 1.3 Qué cambia cuando el código deja de ser lo caro

La curva clásica descansaba en un supuesto que casi nunca se enuncia: que **producir y reescribir
código es la parte cara**. Por eso un cambio de requisito costaba tanto — obligaba a rehacer meses
de trabajo humano. Ese supuesto es el que se movió.

Hoy una parte importante del código se escribe con asistencia de agentes, y se escribe rápido.
Generarlo dejó de ser el cuello de botella; en muchos casos, rehacerlo por completo es más barato
que discutir cómo parcharlo. Colin Eberhardt lo formula así:

> "Code is now cheap; we can create it quickly and throw it away just as fast."

Si el código se abarata, la justificación económica de la curva se debilita todavía más. Pero
—y esto es lo importante— **el argumento lógico se fortalece**. Porque un requisito equivocado ya no
produce código equivocado despacio y en poco volumen: lo produce rápido, en gran cantidad, con
pruebas que pasan y con tipos que validan.

Formulado como conviene recordarlo:

> Antes, un requisito equivocado costaba caro de corregir. Ahora se ejecuta más rápido.

Hay una segunda consecuencia. Si el código se abarata y el requisito no, entonces la proporción se
invierte: la parte del trabajo que consiste en **decidir qué es correcto** pasa a ser la fracción
más grande y la más difícil de delegar. Es la única etapa de la tabla que no se acelera sola,
porque no depende de escribir más rápido sino de saber qué se quiere.

### 1.4 La discusión que está abierta ahora mismo

Esto no es teoría cerrada. Es una discusión activa en la industria, y vale la pena que la conozcas
con las dos posiciones y sus datos, porque vas a trabajar dentro de ella.

**La posición A: desarrollo dirigido por especificación.** Si el agente escribe el código a partir
de lo que le dices, entonces lo que realmente estás produciendo es la especificación, y el código
es una salida. En septiembre de 2025 GitHub publicó una herramienta de código abierto para
formalizar ese flujo, con cuatro fases —especificar, planificar, dividir en tareas, implementar—.
Su argumento central:

> "AI makes specifications executable. When your spec turns into working code automatically, it
> determines what gets built."

**La posición B: eso reinventa la cascada.** En noviembre de 2025, Eberhardt aplicó ese flujo a una
funcionalidad real y midió el resultado. Sus números: el flujo completo produjo **2.577 líneas de
markdown para generar 689 líneas de código funcional**, y consumió 33,5 minutos de agente más
3,5 horas de revisión suya; su método iterativo habitual sobre la misma funcionalidad tomó 8 minutos
de agente y 15 minutos de revisión. Su objeción de fondo no es la lentitud, sino esta:

> "Code is law because it is formal language you can reason about. You can test it... Specifications
> ... lack this formality."

Es decir: el código se puede razonar y probar porque es lenguaje formal; una especificación en
prosa, no. Escribir más prosa no produce más certeza.

**Cómo se arbitra esto.** Con el mismo método de la clase pasada: buscando el hecho que separa a las
dos posiciones, en lugar de elegir a la que suena mejor. Y conviene anotar el límite de la evidencia
disponible: la posición B se apoya en un desarrollador experimentado, una funcionalidad, una
medición. Es un dato real y es poco dato. Decirlo es parte del oficio.

Lo que las dos posiciones **sí comparten** es más informativo que su desacuerdo: ninguna discute que
el artefacto caro dejó de ser el código. Discuten qué hacer con esa consecuencia. Y la objeción de
Eberhardt, mirada de cerca, no dice que la especificación sobre: dice que una especificación **que no
se puede probar** no sirve de mucho. Eso no es un argumento contra especificar. Es un argumento
sobre cómo hay que hacerlo, y es exactamente el trabajo de los bloques 2 y 3 de hoy.

**La versión mínima que ya se adoptó.** Mientras la discusión sigue, hay una convención que se
estandarizó rápido: un archivo `AGENTS.md` en la raíz del repositorio, descrito como *«un README
para agentes»*, donde se escriben el contexto y las instrucciones del proyecto —pasos de
construcción, comandos de prueba, convenciones, restricciones—. La especificación abierta se
formalizó en agosto de 2025 y quedó bajo la tutela de la Agentic AI Foundation, de la Linux
Foundation; hacia fines de 2025 la usaban más de 60.000 proyectos de código abierto y la soportaban
más de veinte herramientas.

Fíjate en qué contiene ese archivo según su propia especificación: **los comandos de prueba**. Los
agentes, al leerlo, intentan ejecutar esas verificaciones y corregir lo que falle. Es decir, ese
archivo es el lugar donde le escribes al agente contra qué debe comparar su trabajo. Es la primera
fila de nuestra tabla, hecha archivo. Y su ausencia es la explicación técnica de lo que pasó la
clase anterior.

### 1.5 Ejercicio

Sobre tu propio repositorio, en 4 minutos:

1. **Ubica tu proyecto en la tabla de 1.1.** ¿En qué etapa está la mayor parte de tu trabajo hoy?
   Anota, para esa etapa, qué prueba tienes efectivamente corriendo y cuál te falta.
2. **Nombra la referencia de tu última prueba.** Toma una prueba cualquiera de tu suite y responde
   en una línea: *«esta prueba compara mi código contra ___»*. Si la respuesta es «contra lo que yo
   entendí que había que hacer», escríbelo tal cual: es un resultado válido y es el punto de partida
   del próximo bloque.
3. **Busca un requisito no escrito.** Anota una regla que tu proyecto cumple hoy solo porque tú la
   tienes en la cabeza. Cualquier prueba que escribas es incapaz de detectar que esa regla esté mal,
   porque no la conoce.

## Preguntas guía

1. Una prueba unitaria en verde compara el código contra el requisito. Si el requisito está
   equivocado, ¿qué color muestra la prueba, y qué te dice eso sobre lo que una suite verde puede y
   no puede garantizar?
2. Boehm y Basili escribieron 100:1 y 5:1 en el mismo párrafo, y la industria repite solo el
   primero. ¿Por qué crees que sobrevivió esa mitad y no la otra? ¿Qué tendrías que exigirle a una
   cifra antes de usarla para justificar una decisión en tu trabajo?
3. Si generar código se volvió rápido y barato, ¿qué parte del trabajo se volvió proporcionalmente
   más cara? ¿Es esa parte algo que puedas delegar en un agente, y de qué depende tu respuesta?
4. Eberhardt sostiene que el código se puede razonar y probar porque es formal, y una especificación
   en prosa no. ¿Qué tendrías que agregarle a un requisito escrito en español para que se acerque a
   esa formalidad?

## Fuentes técnicas del bloque

- [Barry Boehm y Victor R. Basili — *Software Defect Reduction Top 10 List*, IEEE Computer, enero de 2001, pp. 135-137](https://www.cs.umd.edu/projects/SoftEng/ESEG/papers/82.78.pdf) — el punto uno, la palabra «often» agregada respecto de la lista de 1987, el factor 5:1 para sistemas pequeños y no críticos, y el efecto de la arquitectura sobre el factor de escalamiento.
- [Tim Menzies, William Nichols, Forrest Shull y Lucas Layman — *Are Delayed Issues Harder to Resolve? Revisiting Cost-to-Fix of Defects throughout the Lifecycle*, arXiv:1609.04886 (2016)](https://arxiv.org/pdf/1609.04886) — los 171 proyectos entre 2006 y 2014, la ausencia de evidencia del efecto, el primer reporte de 1976 y la declaración de limitaciones de la propia muestra.
- [El rastro documental del «IBM Systems Sciences Institute»](https://gist.github.com/Morendil/ebfa32d10528af04e2ccb8995e3cb4a7) — la búsqueda de la fuente primaria de la razón 1:10:100 y su resultado.
- [ISO/IEC/IEEE 29119-2:2021](https://www.iso.org/standard/79428.html) — procesos de prueba en los niveles organizacional, de gestión y dinámico, aplicables a cualquier modelo de ciclo de vida.
- [Den Delimarsky — *Spec-driven development with AI*, GitHub Blog, 2 de septiembre de 2025](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/) — la especificación como fuente de verdad y las cuatro fases del flujo.
- [Colin Eberhardt — *Putting Spec Kit Through Its Paces: Radical Idea or Reinvented Waterfall?*, Scott Logic, 26 de noviembre de 2025](https://blog.scottlogic.com/2025/11/26/putting-spec-kit-through-its-paces-radical-idea-or-reinvented-waterfall.html) — la medición de 2.577 líneas de markdown frente a 689 de código, los tiempos comparados y la objeción sobre la formalidad.
- [AGENTS.md](https://agents.md/) — la especificación abierta, su contenido recomendado incluidos los comandos de prueba, su adopción y su tutela bajo la Agentic AI Foundation.

---

# BLOQUE 2: El documento que faltaba tiene nombre

- **Duración:** 30 minutos
- **Objetivo del bloque:** nombrar el concepto que la clase anterior dejó sin nombre, comprobar
  experimentalmente qué le ocurre a una suite de pruebas cuando ese concepto no existe, y ubicar el
  conjunto de documentos que la norma define para sostenerlo. Al finalizar, el estudiante debe poder
  responder, para cualquier prueba de su proyecto, de dónde saca esa prueba su noción de lo
  correcto.
- **Modalidad:** trabajo individual, con inventario escrito sobre el propio repositorio.
- **Ritmo sugerido:** 4 minutos para el concepto, 8 para el experimento, 5 para las fuentes de
  autoridad, 5 para el conjunto de documentos, 4 para el inventario y 4 para el ejercicio.

## Desarrollo

### 2.1 La base de prueba

Toda prueba tiene cuatro partes. Una **entrada**, el **programa** que se prueba, la **salida** que el
programa produce, y una cuarta parte que decide si esa salida es correcta. Las tres primeras son
fáciles de montar. La cuarta es el problema.

Esa cuarta parte tiene dos nombres, según desde dónde se la mire. En la literatura de investigación
se llama **oráculo de prueba**, y el problema de conseguir uno confiable se conoce desde hace
décadas como el *problema del oráculo*. En la norma que rige la documentación de pruebas se llama
**base de prueba** (*test basis*), y su definición es esta:

> "information used as the basis for designing and implementing test cases"
>
> — ISO/IEC/IEEE 29119-3:2021, cláusula 3.7

Traducido: la información que se usa como base para diseñar e implementar los casos de prueba. Es
decir, **contra qué compara** la prueba. Es exactamente la última columna de la tabla del Bloque 1,
y es el nombre técnico de lo que le faltaba a nuestra revisión del martes.

Ahora, la parte importante. La norma no se limita a definirlo: incluye una advertencia dentro de su
propia definición.

> "The test basis can take the form of documentation, such as a requirements specification, design
> specification, or module specification, **but can also be an undocumented understanding of the
> required behaviour**."
>
> — ISO/IEC/IEEE 29119-3:2021, nota 1 de la cláusula 3.7

La base de prueba puede ser un entendimiento **no documentado** del comportamiento requerido. La
norma reconoce que en la práctica, muchas veces, lo que hay contra qué comparar es lo que alguien
tiene en la cabeza. No lo prohíbe. Lo nombra, para que sepas cuándo estás en ese caso.

Y estar en ese caso tiene consecuencias medibles. Vamos a medirlas.

### 2.2 El experimento: dos suites para el mismo código

Tomamos el proyecto de la clase anterior, ya corregido: la regla de asistencia arreglada, el
redondeo hecho sobre decimales exactos, el caso de lista vacía cubierto. Quedó un solo hallazgo
abierto, el que ninguna auditoría vio:

```python
def resumen(alumno: str, rut: str, notas: list[float], asistencia: float) -> str:
    return f"{alumno} ({rut}): {nota_final(notas)} - {estado(notas, asistencia)}"
```

El RUT completo aparece en la salida. Nadie lo marcó, porque ningún documento decía que no
correspondía.

Le pedimos a un agente que escribiera la suite de pruebas de ese módulo, con exactamente la misma
instrucción, en dos montajes que se diferencian en una sola cosa: qué documentos hay en la carpeta.

```bash
# Protocolo A - la carpeta contiene solo el codigo
claude -p "Escribe pruebas unitarias con pytest para todas las funciones de
src/curso.py. Cubre tambien resumen(). Devuelve solo el archivo de pruebas
completo, sin explicaciones." --allowed-tools "Read,Glob,Grep"

# Protocolo B - la misma carpeta, mas REQUISITOS.md
```

**Protocolo A. El agente declaró de dónde sacaba su criterio.** Esto es lo primero que escribió,
en el docstring del archivo, sin que se lo pidiéramos:

```python
"""Pruebas de src/curso.py.

REQUISITOS.md no esta en el repositorio, asi que estas pruebas fijan el
comportamiento observable del codigo actual, no la regla declarada.
"""
```

Es una declaración correcta y honesta. Anota qué dice exactamente: estas pruebas fijan **el
comportamiento del código**, no la regla. Dicho de otro modo, la base de prueba es el propio
programa que se está probando.

Y aun habiéndolo declarado, escribió esto:

```python
def test_formato_aprobado(self):
    assert (
        resumen("Ana Perez", "12.345.678-9", [4.0, 5.0], 90)
        == "Ana Perez (12.345.678-9): 4.5 - aprobado"
    )
```

El RUT completo en la salida acaba de convertirse en **comportamiento esperado**, escrito, con
nombre de prueba y en verde. Resultado de la ejecución:

```text
..........................................            [100%]
42 passed in 0.11s
```

Cuarenta y dos pruebas, ninguna falla. Y hay una razón estructural para que sea así: cuando la base
de prueba es el código mismo, la suite **no puede** estar en desacuerdo con el código. Está copiando
sus respuestas. Una suite que no puede fallar sobre el código actual no está probando que sea
correcto; está tomándole una fotografía.

**Protocolo B. Con el requisito en la carpeta.** La misma instrucción, con `REQUISITOS.md` presente:

```text
FAILED tests/test_curso.py::TestEstado::test_tabla_de_decision[notas1-70-reprobado]
1 failed, 42 passed in 0.19s
```

Apareció una prueba en rojo. El caso es este:

```python
([4.0, 3.9], 70, "reprobado"),
```

Y resulta que **la prueba está equivocada y el código tiene razón**. El promedio crudo de 4,0 y 3,9
es 3,95; el agente le aplicó a ese 3,95 el umbral de 4,0 y concluyó reprobado. Pero `REQUISITOS.md`
dice, en su propia línea, que la nota final se informa redondeando 0,05 hacia arriba y que *3,95 se
informa 4,0*. El agente leyó las dos reglas y no las compuso: aplicó el umbral antes de redondear.

```text
nota_final([4.0, 3.9]) = 4.0
promedio crudo         = 3.95
estado([4.0, 3.9], 70) = aprobado
```

Vale la pena detenerse, porque la lectura fácil de este resultado es la equivocada. La conclusión no
es que el protocolo B sea peor. Es esta: **el protocolo B fue el único capaz de producir un rojo.**
Poder equivocarse es el precio de poder tener razón. El protocolo A no se equivocó ni una vez, y esa
es precisamente su falla: no tenía cómo disentir del código.

**Lo que ninguno de los dos hizo.** Ninguno marcó el RUT. Los dos lo afirmaron como salida correcta.
El protocolo B tenía el requisito a la vista y tampoco lo vio, porque `REQUISITOS.md` no dice nada
sobre datos personales. Un oráculo derivado de la especificación hereda **los huecos** de la
especificación.

**La demostración final.** Apliquemos ahora la corrección que corresponde: que el listado informe
solo el dígito verificador, que es lo único que se necesita para leerlo.

```python
def enmascarar_rut(rut: str) -> str:
    """Informa solo el digito verificador."""
    return f"...-{rut.rsplit('-', 1)[-1]}" if "-" in rut else "..."
```

Y volvamos a correr la suite del protocolo A, la que estaba en verde:

```text
FAILED tests/test_curso.py::TestResumen::test_formato_aprobado
FAILED tests/test_curso.py::TestResumen::test_formato_reprobado_por_nota
FAILED tests/test_curso.py::TestResumen::test_formato_reprobado_por_asistencia
FAILED tests/test_curso.py::TestResumen::test_muestra_siempre_un_decimal
FAILED tests/test_curso.py::TestResumen::test_usa_la_nota_redondeada_half_up
FAILED tests/test_curso.py::TestResumen::test_es_consistente_con_nota_final_y_estado[notas0-90]
FAILED tests/test_curso.py::TestResumen::test_es_consistente_con_nota_final_y_estado[notas1-100]
FAILED tests/test_curso.py::TestResumen::test_es_consistente_con_nota_final_y_estado[notas2-10]
FAILED tests/test_curso.py::TestResumen::test_es_consistente_con_nota_final_y_estado[notas3-70]
FAILED tests/test_curso.py::TestResumen::test_acepta_nombre_y_rut_vacios
10 failed, 32 passed in 0.27s
```

Diez pruebas en rojo por hacer lo correcto.

Y ahora ponte en el lugar de quien llega mañana a este repositorio, hace ese cambio y ve diez
pruebas caerse. La conclusión natural, la que cualquiera sacaría, es que **el cambio está mal**.
Revertir es lo razonable cuando la suite dice que rompiste algo.

> Una suite cuya base de prueba es el código no protege al producto. Protege al defecto.

### 2.3 Siete lugares de donde puede salir un veredicto

Lo que acabamos de ver tiene nombre y tiene investigación reciente detrás. En 2026, una revisión
sistemática de literatura sobre oráculos de prueba escritos por modelos de lenguaje —aceptada para
publicación en *IEEE Access*— revisó 2.436 registros, seleccionó 54 estudios y los extendió por
búsqueda de citas hasta 83. Su observación de partida es la que acabamos de comprobar a mano:

> "Two oracles can look identical and rest on different ground: one assertion encodes a written
> specification, another only what the model learned in training."

Dos oráculos pueden verse idénticos y descansar sobre suelo distinto. Nuestros dos protocolos
produjeron archivos de pruebas casi indistinguibles a simple vista; uno de ellos era una fotografía
del código.

El trabajo propone clasificar cualquier oráculo por su **fuente de autoridad**: a qué apuntarías si
alguien discute su veredicto. Distingue siete:

| Fuente de autoridad | Contra qué compara | Qué pasa si el código tiene el defecto |
|---|---|---|
| Derivada de la implementación | El comportamiento actual del código | Lo consagra como correcto. Es nuestro protocolo A |
| Derivada de la especificación | Una regla escrita | Lo detecta, si la regla lo cubre. Es nuestro protocolo B |
| Diferencial contra referencia | Una segunda implementación | Lo detecta solo si la otra no comparte el defecto |
| Regresión desde la versión previa | La salida de la versión anterior | Lo consagra si el defecto ya venía de antes |
| Obtenida de una persona | La respuesta que dio alguien | Depende de lo que esa persona sepa |
| Paramétrica del modelo | Lo que el modelo aprendió en su entrenamiento | Depende de algo que no puedes inspeccionar |
| Intrínseca implícita | Que no lance excepción, que el tipo calce | No lo detecta: no es un criterio de corrección |

El hallazgo de esa revisión sobre el estado actual de la práctica:

> "Just over half of the corpus reaches a verdict with no specification at all."

Poco más de la mitad de los sistemas revisados emiten su veredicto sin especificación alguna. Y la
recomendación con la que cierran es directamente aplicable a tu proyecto de hoy:

> "The first question to ask of any LLM oracle is therefore what one would point to in defending its
> verdict."

La primera pregunta que hay que hacerle a un oráculo es a qué apuntarías para defender su veredicto.
Esa pregunta es, palabra por palabra, «¿cuál es tu base de prueba?».

### 2.4 Los documentos que la norma define

Si la base de prueba importa tanto, la pregunta obvia es dónde se escribe. Esa es exactamente la
parte 3 de la norma ISO/IEC/IEEE 29119, cuyo alcance declarado es:

> "This document specifies software test documentation templates that can be used for any
> organization, project or testing activity. It describes the test documentation that is an output
> of the processes specified in ISO/IEC/IEEE 29119-2."

Los documentos están organizados en tres niveles, que corresponden a los tres niveles de proceso que
define la parte 2:

**Nivel organizacional** — lo que vale para toda la organización, no para un proyecto:

- Política de pruebas (6.2): qué se prueba y por qué, en general.
- Prácticas organizacionales de prueba (6.3): cómo se prueba aquí.

**Nivel de gestión** — lo que vale para este proyecto:

- Plan de pruebas (7.2): alcance, contexto, supuestos, riesgos, estrategia, actividades y calendario.
- Reporte de estado (7.3): cómo va, contra lo planificado.
- Reporte de término (7.4): qué se probó, qué desviaciones hubo, qué riesgos quedaron abiertos.

**Nivel dinámico** — lo que vale para cada prueba concreta:

- Especificación del modelo de prueba (8.2) y de los casos (8.3).
- Especificación del procedimiento (8.4): en qué orden se ejecutan.
- Requisitos de datos de prueba (8.5) y de ambiente (8.6), con sus reportes de disponibilidad (8.7 y 8.8).
- Resultados reales y resultado de la prueba (8.9).
- Registro de ejecución (8.10).
- Reporte de incidentes (8.11).

Antes de que esto parezca una montaña de papeleo, dos cosas que la propia norma dice.

La primera, sobre la forma:

> "The test documentation described in this document can be on paper or in electronic form (e.g.
> records in test tools, spreadsheets, mind maps, white board photos)."

Registros en herramientas, planillas, mapas mentales, **fotos de una pizarra**. La norma no exige
documentos con carátula; exige que la información exista y se pueda encontrar.

La segunda, sobre cuánto hay que aplicar. La cláusula 4 distingue dos formas de cumplir: conformidad
**completa** y conformidad **adaptada**. La adaptada consiste en declarar qué partes se aplican y
cuáles no, y por qué. Es decir, el estándar contempla explícitamente que lo recortes, siempre que
digas qué recortaste. Omitir con criterio declarado es conformidad; omitir en silencio, no.

### 2.5 Lo que ya tienes escrito, sin saber cómo se llama

Aquí está el giro que hace útil todo lo anterior: **la mayoría de esos documentos ya existen en tu
proyecto**, con otro nombre y en otro formato.

| Documento de la norma | Qué es, en tu repositorio, hoy |
|---|---|
| Especificación de casos de prueba (8.3) | Cada función `test_*` de tu suite |
| Especificación del procedimiento (8.4) | El comando `pytest` y la configuración de tu `pyproject.toml` |
| Requisitos de ambiente (8.6) | Tu archivo de dependencias y la versión de Python que fijaste |
| Registro de ejecución (8.10) | La salida de `pytest`, y el historial de tu integración continua |
| Reporte de incidentes (8.11) | Tus *issues*, o el registro de hallazgos de la clase anterior |
| Prácticas organizacionales (6.3) | Tus convenciones de proyecto, incluido lo que le declaras a un agente |
| **Base de prueba** | **Aquí es donde probablemente tengas el hueco** |

La suite existe, el procedimiento existe, el registro existe. Lo que suele faltar es aquello contra
lo cual todo eso compara. Y sin eso, como acabamos de medir, la suite puede estar completa,
documentada, automatizada, en verde — y estar defendiendo un defecto.

### 2.6 Ejercicio

Sobre tu propio repositorio, en 4 minutos:

1. **Clasifica tres pruebas tuyas por su fuente de autoridad**, usando la tabla de 2.3. Escribe al
   lado de cada una cuál de las siete es. Si más de una cae en «derivada de la implementación»,
   márcalo: no es un error, es un dato sobre tu suite.
2. **Levanta el inventario de 2.5.** Recorre la tabla y anota, para cada fila, dónde está ese
   documento en tu proyecto o que no está. No lo escribas todavía; solo constata.
3. **Escribe la única línea que falta.** Elige la regla de negocio más importante de tu proyecto
   —la que, si se rompiera, haría inútil el producto— y escríbela en un archivo, con esta forma:
   *«el sistema debe ___ cuando ___»*. Esa línea es tu base de prueba, y a partir de ahora tus
   pruebas tienen contra qué compararse.

## Preguntas guía

1. El protocolo A no falló ninguna prueba y el protocolo B falló una. ¿Cuál de las dos suites
   preferirías tener en tu proyecto, y qué te dice tu respuesta sobre lo que significa una suite
   completamente verde?
2. El agente del protocolo A declaró en el docstring que sus pruebas fijaban el comportamiento del
   código y no la regla. ¿Sirve de algo esa declaración, si igual escribió la aserción que consagra
   la fuga? ¿Qué te permite hacer a ti que no podrías hacer sin ella?
3. Diez pruebas se pusieron en rojo al enmascarar el RUT. ¿Cómo distingues, frente a una suite en
   rojo, si lo que está mal es tu cambio o son las pruebas? ¿Qué información necesitas para
   decidirlo, y dónde debería estar guardada?
4. La norma acepta como documentación válida la foto de una pizarra, y permite omitir partes
   declarando cuáles. Si eso es así, ¿qué es exactamente lo que la norma no te deja hacer?

## Fuentes técnicas del bloque

- [ISO/IEC/IEEE 29119-3:2021 — *Test documentation*, segunda edición, octubre de 2021](https://www.iso.org/standard/79429.html) — la definición de base de prueba y su nota 1 (cláusula 3.7), el alcance, el conjunto completo de documentos de las cláusulas 6, 7 y 8, la forma admitida de la documentación y las dos modalidades de conformidad de la cláusula 4.
- [ISO/IEC/IEEE 29119-2:2021 — *Test processes*](https://www.iso.org/standard/79428.html) — los tres niveles de proceso —organizacional, de gestión y dinámico— que dan estructura a los documentos de la parte 3.
- [Ali Hassaan Mughal y Muhammad Bilal — *LLM-Based Test Oracles: Source-of-Authority Taxonomy: A Systematic Literature Review*, aceptado en IEEE Access, DOI 10.1109/ACCESS.2026.3729738 (arXiv:2607.05031)](https://arxiv.org/abs/2607.05031) — las cuatro partes de una prueba, la taxonomía de siete fuentes de autoridad, la revisión PRISMA de 2.436 registros a 54 estudios más 29 por búsqueda de citas, y la proporción del corpus que emite veredicto sin especificación.
- [Earl T. Barr, Mark Harman, Phil McMinn, Muzammil Shahbaz y Shin Yoo — *The Oracle Problem in Software Testing: A Survey*, IEEE Transactions on Software Engineering 41(5), 2015, pp. 507-525](https://coinse.github.io/publications/pdfs/Barr2015qd.pdf) — el problema del oráculo antes de los modelos de lenguaje, y las técnicas clásicas para obtener uno.
- Ejecuciones registradas para esta clase, sobre Python 3.12.12: las dos suites generadas por los protocolos A y B con `claude -p` y herramientas restringidas a lectura, sus resultados `42 passed` y `1 failed, 42 passed`, la verificación aritmética del caso `[4.0, 3.9]`, y el resultado `10 failed, 32 passed` de la suite del protocolo A tras enmascarar el RUT.

---

# BLOQUE 3: Del nombre de la calidad al umbral que se puede probar

- **Duración:** 30 minutos
- **Objetivo del bloque:** ejecutar la traducción que llena la fila vacía del inventario anterior:
  pasar de una característica de calidad, que no se puede probar, a un criterio con magnitud, método
  y umbral, que sí. Al finalizar, el estudiante debe tener escrito un criterio propio y la prueba que
  ese criterio hace posible, y debe poder distinguir un umbral decidido de uno inventado.
- **Modalidad:** trabajo individual sobre el proyecto propio.
- **Ritmo sugerido:** 5 minutos para el problema de la característica, 7 para la traducción, 7 para
  el experimento, 6 para la regla de arbitraje y 5 para el ejercicio.

## Desarrollo

### 3.1 «El sistema debe ser seguro» no es un requisito

En la Clase 03 usamos ISO/IEC 25010:2023 como mapa de preguntas: nueve características que sirven
para no olvidar dimensiones de la calidad. Ese uso sigue siendo válido, pero hoy le falta un paso.

Toma la característica **Seguridad** y escribe con ella la frase que se escribe siempre:

```text
El sistema debe ser seguro.
```

Intenta ahora probarla. ¿Cuál es la entrada? ¿Cuál es la salida esperada? ¿Qué tendría que ocurrir
para que esa afirmación quedara en rojo? No hay respuesta, y no porque falte esfuerzo: la frase no
tiene la forma de algo que pueda fallar. Es una aspiración.

Lo mismo pasa con «el sistema debe ser rápido», «debe ser fácil de usar», «debe ser mantenible». Son
nombres de propiedades deseables, y ningún nombre se puede ejecutar.

Esto no es una crítica al modelo, porque el modelo dice exactamente para qué sirve. Su alcance
enumera las actividades que se benefician de usarlo, y dos de ellas son las de hoy:

> "— validating the comprehensiveness of requirements definition;
> — identifying acceptance criteria for a product and/or an information system;"
>
> — ISO/IEC 25010:2023, cláusula 1

Validar que la definición de requisitos esté **completa**, e identificar **criterios de aceptación**.
El modelo no es la lista de lo que hay que probar: es la lista de preguntas que hay que hacerle a tu
definición de requisitos para descubrir qué le falta. Y la norma agrega, en una nota del mismo
alcance, que el uso del modelo para medición está explicado en su Anexo C.

Nuestro trabajo, entonces, es el paso intermedio: de la característica al criterio.

### 3.2 Las tres piezas de un criterio

Un criterio verificable necesita tres cosas, y si le falta una, no se puede probar:

1. **Una magnitud observable.** Algo que se pueda contar, medir o detectar en la salida del sistema.
   No «la seguridad», sino «la cantidad de RUT completos que aparecen en el listado».
2. **Un método de medición.** Cómo se obtiene esa magnitud, de forma que dos personas distintas
   obtengan el mismo número. No «revisar que no se filtre», sino «buscar el patrón de RUT en la
   cadena devuelta».
3. **Un umbral.** El valor que separa aceptable de inaceptable, con su dirección. No «pocos», sino
   «cero».

Hagamos la traducción completa, paso a paso, sobre el hallazgo que arrastramos desde el martes.

| Pieza | Contenido |
|---|---|
| Característica | Seguridad |
| Subcaracterística | Confidencialidad |
| Pregunta que abre | ¿Qué dato de este producto no debería poder leerse en su salida? |
| Magnitud | Cantidad de RUT completos presentes en la cadena que devuelve `resumen()` |
| Método | Buscar el patrón `\d{1,2}\.\d{3}\.\d{3}-[\dkK]` en la cadena devuelta |
| Umbral | Cero |
| **Criterio** | **`resumen()` no informa el RUT completo en ninguna salida** |

Esa última fila ya tiene la forma de algo que puede fallar. Y por lo tanto ya se puede escribir:

```python
"""Criterio S1: confidencialidad. El listado no informa el RUT completo."""

import re

from src.curso import resumen

RUT_COMPLETO = re.compile(r"\d{1,2}\.\d{3}\.\d{3}-[\dkK]")


def test_el_resumen_no_informa_el_rut_completo():
    salida = resumen("Ana Perez", "12.345.678-9", [4.0, 5.0], 90)
    assert RUT_COMPLETO.search(salida) is None, f"RUT completo en la salida: {salida}"
```

Ejecutada contra el código tal como está:

```text
E       AssertionError: RUT completo en la salida: Ana Perez (12.345.678-9): 4.5 - aprobado
E       assert <re.Match object; span=(11, 23), match='12.345.678-9'> is None
1 failed in 0.11s
```

Y contra el código con el enmascaramiento aplicado:

```text
1 passed in 0.02s
```

Detente un segundo en lo que acaba de pasar. Ese hallazgo lleva dos sesiones abierto. Sobrevivió a
tres auditorías con dos herramientas distintas y a dos generaciones de suite completa. Nada de eso
cambió el código. Lo que lo cerró fue **escribir el criterio**: una frase con magnitud, método y
umbral. La prueba se escribió sola después.

> Mientras el hallazgo fue una observación, no pasó nada. Cuando se volvió un criterio, se volvió
> una prueba en rojo, y un rojo hay que atenderlo.

### 3.3 El experimento: pedirle los criterios al agente

Le pedimos a un agente exactamente este trabajo de traducción, sobre la misma carpeta del bloque
anterior —el código más `REQUISITOS.md`—, con la instrucción de convertir la característica
Seguridad de ISO/IEC 25010 en criterios de aceptación verificables, con umbral concreto y método de
medición.

El resultado obliga a corregir lo que veníamos diciendo. **Encontró el RUT.** Su primer criterio, el
que puso arriba de la tabla, fue este:

```text
S1 | Confidencialidad | resumen() no expone el RUT completo: lo enmascara en toda
   | salida y log | Umbral: 0 RUT completos | Metodo: assert rut not in resumen(...)
```

El mismo hallazgo que tres auditorías no vieron el martes, y que las dos suites generadas en el
bloque anterior consagraron como comportamiento correcto, apareció de inmediato. Y también listó,
sin que se lo preguntáramos, las brechas actuales del proyecto contra sus propios criterios.

**Por qué esta vez sí.** No porque el agente fuera mejor ni el modelo más nuevo. Porque **cambió la
pregunta**. Todas las consultas anteriores eran variantes de «compara este código contra lo que está
escrito», y el RUT no estaba escrito en ninguna parte, así que la comparación no podía producirlo.
Esta consulta pregunta otra cosa: «qué debería ser verdad de este producto en materia de seguridad».
Esa pregunta tiene una fuente de autoridad **externa al proyecto**: el modelo de calidad. Y el
modelo trae la palabra *confidencialidad*, que ningún documento del repositorio contenía.

Dicho con el vocabulario del bloque anterior: **ISO/IEC 25010 funcionó como base de prueba**. Aportó
el criterio que faltaba porque es, literalmente, para lo que la norma dice que sirve — validar que
la definición de requisitos esté completa.

**Ahora la otra mitad.** El mismo agente produjo también estos dos criterios:

```text
S5 | Responsabilidad | Cada cierre genera un registro con timestamp, rut enmascarado,
   | nota final, estado y usuario que ejecuto | Umbral: 100% de las llamadas
S6 | No repudio | El registro es de solo anexado (append-only) y lleva hash
   | encadenado del registro previo | Umbral: 0 registros modificables
```

Están bien formulados. Tienen magnitud, método y umbral. Y **nadie los pidió**. Un registro de
auditoría con hash encadenado es una técnica real y seria, usada donde alguien puede tener incentivo
para alterar el historial. Para el cálculo de cierre de una asignatura, es ingeniería que ninguna
persona con autoridad sobre este producto decidió.

Eso también tiene nombre en la taxonomía del bloque anterior: es un oráculo **paramétrico del
modelo**. Su autoridad es lo que el modelo aprendió en su entrenamiento, no lo que alguien decidió
para este producto. Y se ve idéntico a los demás: la misma tabla, el mismo formato, el mismo tono de
seguridad.

### 3.4 Cómo se separa un criterio de una sugerencia

Necesitamos una regla, porque los siete criterios de esa tabla se ven exactamente igual y no valen
lo mismo. La regla es esta:

> Un criterio es legítimo cuando puedes señalar **quién fijó el umbral**.

Y hay solo tres respuestas válidas:

1. **Lo fija una norma o una ley externa.** No es negociable ni es tuyo. El umbral cero de RUT
   expuestos entra aquí, y por eso es el más sólido de los siete: no depende de nuestra opinión
   sobre cuánto importa.
2. **Lo decidió una persona con autoridad sobre el producto.** El 4,0 de aprobación y el 70 % de
   asistencia entran aquí: alguien los decidió, y quedaron escritos.
3. **Se deduce de la propia característica.** Confidencialidad significa que el dato no se expone;
   el umbral cero se sigue del significado, no de una preferencia.

Si un criterio no cae en ninguna de las tres, no es un criterio: es una sugerencia bien redactada.
Puede ser una buena idea, y puede convertirse en criterio el día que alguien la decida y la escriba.
Hoy no lo es.

Apliquemos la regla a la tabla que produjo el agente:

| Criterio | ¿Quién fijó el umbral? | Veredicto |
|---|---|---|
| S1 · RUT no expuesto | La ley de protección de datos | Criterio. Y prioritario |
| S2 · Notas fuera de 1,0 a 7,0 rechazadas | Nadie todavía. El rango es del dominio, pero no está escrito | Sugerencia que hay que ascender: falta decidirlo y escribirlo |
| S3 · No mutar la lista recibida | Se deduce de la función: calcular no es modificar | Criterio |
| S5 · Registro de auditoría por llamada | Nadie | Sugerencia |
| S6 · Cadena de hashes en el registro | Nadie | Sugerencia |

Fíjate en S2, que es el caso más interesante. Una nota de 9,0 no tiene sentido en el producto, y el
código hoy la acepta sin decir nada. No es una invención del agente: es un hueco real del requisito.
Pero tampoco es todavía un criterio, porque nadie escribió cuál es el rango válido. Ese es
exactamente el estado que la Clase 06 llamó *hallazgo que no puede escribirse como prueba*: no falta
código, falta una decisión.

Y esa es la forma productiva de usar un agente en esta etapa. No para que decida los umbrales
—no puede, porque no son datos técnicos sino decisiones de producto— sino para que **produzca la
lista de decisiones pendientes**. Convertir cada sugerencia en criterio, o descartarla, es trabajo
tuyo, y es el trabajo que el Bloque 1 identificó como el que no se abarata.

### 3.5 Ejercicio

Sobre tu propio repositorio, en 5 minutos:

1. **Elige una característica** de ISO/IEC 25010 que importe en tu producto y que hoy no tengas
   cubierta por ninguna prueba.
2. **Completa la tabla de 3.2** para ella: característica, subcaracterística, pregunta, magnitud,
   método, umbral y criterio. Si te atascas, es casi siempre en el umbral, y casi siempre porque
   nadie lo decidió: anótalo como decisión pendiente y elige otra.
3. **Escribe la prueba** que ese criterio hace posible, y ejecútala **antes** de tocar el código.
   Registra el color que dio. Si salió roja, tienes un defecto con evidencia. Si salió verde,
   acabas de documentar una propiedad que tu producto ya cumplía y que nadie estaba protegiendo.
4. **Clasifica tu criterio** con la regla de 3.4: ¿quién fijó ese umbral? Escribe la respuesta al
   lado. Si la respuesta es «yo, recién», está bien — pero que quede escrito que fuiste tú.

## Preguntas guía

1. El hallazgo del RUT sobrevivió a tres auditorías y a dos suites completas, y cayó apenas se
   escribió el criterio. ¿Qué tenía el criterio que no tenían las auditorías?
2. El agente encontró la fuga cuando le preguntamos por la característica de calidad, y no cuando le
   pedimos revisar o probar el código. ¿Qué dice eso sobre la relación entre la pregunta que haces y
   lo que un auditor automático puede encontrar?
3. S5 y S6 están perfectamente formulados, con magnitud, método y umbral, y aun así los descartamos.
   ¿Qué distingue a un criterio bien escrito de un criterio que corresponde? ¿Podrías haber notado
   la diferencia solo mirando la tabla?
4. En S2 el código acepta una nota de 9,0. No es un defecto, porque ningún requisito lo prohíbe, y
   tampoco está bien. ¿Qué habría que hacer para sacarlo de ese estado, y quién tiene que hacerlo?

## Fuentes técnicas del bloque

- [ISO/IEC 25010:2023 — *Product quality model*, segunda edición](https://www.iso.org/standard/78176.html) — las nueve características, el alcance que declara la validación de completitud de los requisitos y la identificación de criterios de aceptación entre los usos del modelo, y la nota que remite al Anexo C para su uso en medición. Esta edición incorpora *seguridad operacional* como característica y agrega *resistencia* entre las subcaracterísticas de seguridad.
- [ISO/IEC 25002:2024 — *Quality model overview and usage*](https://www.iso.org/standard/78175.html) — el marco que relaciona los modelos de calidad con la medición, la definición de requisitos y la evaluación.
- [ISO/IEC/IEEE 29119-3:2021](https://www.iso.org/standard/79429.html) — la base de prueba (cláusula 3.7), aquí en el rol que cumple el modelo de calidad.
- Ejecuciones registradas para esta clase, sobre Python 3.12.12: la consulta de traducción de la característica Seguridad a criterios de aceptación con `claude -p` y herramientas restringidas a lectura, y la prueba del criterio S1 ejecutada sobre las dos versiones del módulo, con resultados `1 failed` y `1 passed`.

---

# BLOQUE 4: La finalidad se escribe antes que el código

- **Duración:** 25 minutos
- **Objetivo del bloque:** identificar quién fijó el umbral del criterio que quedó abierto, y
  comprobar que la exigencia legal se ubica en la primera fila de la tabla del Bloque 1. Al
  finalizar, el estudiante debe tener escrito en su proyecto el requisito que faltaba sobre el
  tratamiento de un dato personal, y haber comprobado que ese documento cambia el resultado de una
  auditoría.
- **Modalidad:** trabajo individual sobre el proyecto propio.
- **Ritmo sugerido:** 3 minutos para la definición legal, 5 para los dos principios, 4 para el deber
  desde el diseño, 5 para escribir el requisito, 4 para la comprobación y 4 para el ejercicio.

## Desarrollo

### 4.1 El dato que la ley nombra por su nombre

Todo el arco de estas dos sesiones gira alrededor de una línea de código que informa un RUT. Antes
de decidir nada, conviene saber si estamos frente a un dato personal o no, y esa pregunta no se
responde por criterio propio. La Ley 21.719 la responde en su definición:

> "f) Dato personal: cualquier información vinculada o referida a una persona natural identificada o
> identificable. Se considerará identificable toda persona cuya identidad pueda determinarse, directa
> o indirectamente, en particular mediante uno o más identificadores, tales como el nombre, **el
> número de cédula de identidad**, el análisis de elementos propios de la identidad física,
> fisiológica, genética, psíquica, económica, cultural o social de dicha persona."

El número de cédula de identidad está nombrado en la definición. No hay que interpretar nada ni
argumentar el caso: el RUT es un dato personal según el texto expreso de la ley.

Esto merece una observación sobre el método. En la Clase 06 dijimos que el hallazgo del RUT no lo vio
nadie porque no había documento contra el cual compararlo. Era cierto respecto del repositorio.
Pero el documento existía; estaba fuera del proyecto, y nadie lo había traído adentro. Ese
movimiento —traer una norma externa a la base de prueba del proyecto— es el trabajo de este bloque.

### 4.2 Los dos principios que resuelven el caso

La ley fija ocho principios que rigen todo tratamiento de datos personales. Dos de ellos deciden
nuestro caso, y los dos están en el mismo artículo:

> **"Artículo 3º.- Principios.** El tratamiento de los datos personales se rige por los siguientes
> principios: [...]
>
> b) **Principio de finalidad.** Los datos personales deben ser recolectados con fines específicos,
> explícitos y lícitos. El tratamiento de los datos personales debe limitarse al cumplimiento de
> estos fines.
>
> c) **Principio de proporcionalidad.** Los datos personales que se traten deben limitarse
> estrictamente a aquéllos que resulten necesarios, adecuados y pertinentes en relación con los
> fines del tratamiento."

Fíjate en el orden que impone la redacción, porque es el corazón de la clase. La proporcionalidad no
se puede evaluar sola: dice «necesarios en relación con **los fines**». Es decir, **primero hay que
tener una finalidad declarada**, y solo después se puede juzgar si un dato es necesario o sobra.

Aplicado al listado de cierre, en dos preguntas:

1. **¿Cuál es la finalidad?** Informar quién aprueba y quién reprueba la asignatura. Específica,
   explícita y lícita.
2. **¿El RUT completo es necesario para esa finalidad?** No. El listado identifica al estudiante por
   su nombre; el RUT no aporta nada al propósito declarado.

Con esas dos respuestas, el caso está resuelto por el principio de proporcionalidad, y no por una
opinión sobre cuánto importa la privacidad.

Y aquí queda cerrada la pregunta que dejamos abierta en el Bloque 3. Recuerda la regla: un criterio
es legítimo cuando puedes señalar quién fijó el umbral. El umbral **cero RUT completos en la salida**
no lo fijamos nosotros, ni lo propuso un agente: se sigue del artículo 3 letra c) aplicado a una
finalidad que sí decidimos nosotros. Primera categoría de las tres: lo fija una norma externa.

### 4.3 El artículo que lo pone antes del código

Falta saber cuándo debía hacerse este trabajo. La ley también lo dice, y su respuesta coincide
exactamente con la primera fila de la tabla del Bloque 1:

> **"Artículo 14 quáter.- Deber de protección desde el diseño y por defecto.** Con la finalidad de
> cumplir los principios y los derechos de los titulares establecidos en esta ley, el responsable
> debe aplicar medidas técnicas y organizativas adecuadas **desde el diseño con anterioridad y
> durante el tratamiento** de los datos personales. [...]
>
> Asimismo, el responsable de datos deberá aplicar medidas técnicas y organizativas para garantizar
> que, **por defecto, sólo sean objeto de tratamiento los datos personales específicos y
> estrictamente necesarios** para dicha actividad. Para ello, se tendrá en consideración el número
> de datos personales recogidos, la extensión del tratamiento, el plazo de conservación y su
> accesibilidad."

Dos cosas que subrayar.

La primera: **«con anterioridad y durante»**. La ley no exige revisar la privacidad al final, cuando
el sistema ya trata datos. Exige aplicar las medidas antes de que el tratamiento empiece. En la
tabla del Bloque 1, eso es la etapa de requisitos: la única donde no hay nada que ejecutar y la
única prueba posible es leer un documento. La ley ubica su exigencia justo ahí.

La segunda: el inciso final —«por defecto, sólo... estrictamente necesarios»— es un criterio de
aceptación redactado por el legislador. Tiene magnitud, tiene dirección y tiene umbral, en el
sentido exacto del Bloque 3.

> Esto es lo que significa «privacidad por diseño» de forma operativa: la pregunta sobre el RUT tenía
> que responderse cuando se definió el producto, no tres semanas después, mientras alguien revisaba
> código.

### 4.4 El requisito que faltaba, escrito

Ahora se puede escribir. Nota que el requisito empieza por la finalidad, porque sin ella la regla no
se puede justificar ni evaluar:

```markdown
## Datos personales en el listado

Finalidad del listado de cierre: informar quien aprueba y quien reprueba la asignatura.

El RUT identifica al estudiante y no es necesario para esa finalidad. El listado
identifica al estudiante por su nombre, e informa del RUT solo el digito
verificador. Ninguna salida del sistema, incluidos los registros de ejecucion,
puede contener el RUT completo.
```

Son cuatro líneas y llevaban dos sesiones sin existir. Repasa lo que aportan cada una: la primera
declara la finalidad, que es lo que permite aplicar la proporcionalidad; la segunda hace el juicio
de necesidad de forma explícita; la tercera fija el comportamiento observable; la cuarta extiende el
alcance a los registros, que es donde los datos se filtran con más frecuencia.

La guía de protección de datos del módulo resume este recorrido en un patrón de cinco pasos:

```text
PRINCIPIO  →  REQUISITO  →  COMPORTAMIENTO  →  PRUEBA  →  EVIDENCIA
```

Que en nuestro caso queda así, completo:

| Paso | Contenido |
|---|---|
| Principio | Proporcionalidad. Artículo 3, letra c) |
| Requisito | El listado informa solo el dígito verificador del RUT |
| Comportamiento | `resumen()` devuelve una cadena sin el RUT completo |
| Prueba | `test_el_resumen_no_informa_el_rut_completo` |
| Evidencia | La salida de la suite, con esa prueba en verde y fechada |

Es el mismo recorrido del Bloque 3 —característica, criterio, prueba— con un paso más al principio y
uno más al final. El paso inicial es el que hace que el umbral no sea tuyo. El paso final es el que
te permite demostrarlo, que es la obligación que la ley llama responsabilidad.

### 4.5 La comprobación: la misma auditoría, con el documento

Queda por verificar que este trabajo sirve de algo. Volvimos a montar la revisión de la clase
anterior sobre el **mismo código sin corregir**, cambiando una sola cosa: `REQUISITOS.md` ahora
contiene esas cuatro líneas.

```bash
claude -p "Revisa src/curso.py contra REQUISITOS.md y reporta las diferencias entre
lo que el codigo hace y lo que el requisito dice. Se breve."
--allowed-tools "Read,Glob,Grep"
```

Lo primero que reportó, literal:

```text
## Diferencia con el requisito

**resumen() expone el RUT completo** (src/curso.py:24).

El requisito es explicito: el listado identifica por nombre e informa "solo el
digito verificador", y "ninguna salida del sistema... puede contener el RUT
completo". El codigo interpola {rut} tal cual, asi que resumen("Ana",
"12.345.678-5", ...) produce Ana (12.345.678-5): 4.0 - aprobado.
```

El mismo hallazgo que sobrevivió a tres auditorías, dos suites generadas y dos sesiones de clase,
apareció de inmediato y en primer lugar. No cambió la herramienta, no cambió el código, no cambió la
pregunta. Cambió que existía el documento.

Y hay una última cosa que conviene notar, porque es la parte que se suele omitir cuando se cuenta
esta clase de historia. La misma revisión agregó dos observaciones que antes no podía hacer:

```text
...lo que ademas implica extraer el DV del formato de entrada (no esta definido
como llega el RUT: con puntos/guion o sin ellos).

No hay logging en el modulo, asi que no hay una segunda via de fuga del RUT
- pero tampoco hay nada que impida que un llamador registre el RUT que recibe.
```

Escribir el requisito no cerró el tema: abrió dos preguntas nuevas y más precisas. En qué formato
llega el RUT, y qué pasa con quien llama a la función. Así es como funciona, y es una buena señal.
Un requisito escrito no elimina la incertidumbre; la convierte en preguntas que se pueden responder.

### 4.6 Ejercicio

Sobre tu propio repositorio, en 4 minutos:

1. **Inventaria los datos personales de tu proyecto.** Recorre tus modelos, tus formularios y tus
   salidas, y anota cada campo que identifique o pueda identificar a una persona. Usa la definición
   de 4.1 como referencia: nombre, cédula de identidad, correo, teléfono, dirección, y cualquier dato
   que combinado con otro permita llegar a alguien.
2. **Declara la finalidad de cada uno.** Para cada campo, escribe en una línea para qué existe.
   Si no puedes responderlo, no elimines el campo todavía: anótalo como decisión pendiente, porque
   ese es precisamente el estado que la ley te obliga a resolver.
3. **Aplica la proporcionalidad.** Con la finalidad escrita, revisa cuáles de esos campos no son
   necesarios para ella. Elige uno y escribe el requisito, siguiendo la forma de 4.4: finalidad,
   juicio de necesidad, comportamiento observable, alcance.
4. **Cierra el patrón de cinco pasos** para ese caso: escribe la prueba, ejecútala antes de corregir
   y guarda su salida. Esa salida es la evidencia.

## Preguntas guía

1. El principio de proporcionalidad dice «necesarios en relación con los fines». ¿Por qué es
   imposible aplicar ese principio en un proyecto que no ha declarado sus finalidades, y qué te
   obliga a hacer eso antes de escribir código?
2. El artículo 14 quáter exige medidas «con anterioridad y durante» el tratamiento. Si tu proyecto ya
   está escrito y funcionando, ¿qué significa cumplir esa exigencia hoy, y en qué se diferencia de
   haberla cumplido desde el principio?
3. La misma auditoría, sobre el mismo código, encontró el defecto solo cuando existía el documento.
   ¿Qué implicancia tiene eso sobre cuánto puedes confiar en un informe de auditoría que no declara
   contra qué comparó?
4. Escribir el requisito abrió dos preguntas nuevas: el formato de entrada del RUT y lo que haga
   quien llame a la función. ¿Es eso un problema del requisito o una propiedad de haberlo escrito?

## Fuentes técnicas del bloque

- [Ley 21.719, que regula la protección y el tratamiento de los datos personales y crea la Agencia de Protección de Datos Personales — Diario Oficial de la República de Chile, núm. 44.023, viernes 13 de diciembre de 2024, CVE 2583630](https://www.diariooficial.interior.gob.cl/publicaciones/2024/12/13/44023/01/2583630.pdf) — la definición de dato personal con el número de cédula de identidad entre los identificadores, el artículo 3º con los principios de finalidad y proporcionalidad, y el artículo 14 quáter sobre el deber de protección desde el diseño y por defecto. La ley entra en vigencia el 1 de diciembre de 2026.
- Guía de protección de datos del módulo, en [`docs/ley-21719/`](../../../docs/ley-21719/Guia-Maestra-Ley-21719-Proteccion-Datos-Chile-2026.pdf) — los ocho principios, el patrón de trabajo de cinco pasos y la regla de minimización con lo que se prueba en cada caso.
- Ejecuciones registradas para esta clase, sobre Python 3.12.12: la revisión del módulo sin corregir contra el `REQUISITOS.md` ampliado, con `claude -p` y herramientas restringidas a lectura, y su salida literal.

---

# Cierre de la Sesión

## 1. Lo que queda en tu proyecto

Al terminar la sesión, en tu proyecto debe existir:

- la ubicación de tu trabajo en la tabla de etapas, con la prueba que tienes y la que te falta
  anotadas;
- la clasificación de tres pruebas tuyas según su fuente de autoridad, y el nombre de aquello contra
  lo que compara cada una;
- el inventario de documentos de prueba: cuáles ya existen en tu repositorio bajo otro nombre y
  cuáles no están;
- un criterio escrito con sus tres piezas —magnitud, método y umbral— derivado de una característica
  de calidad, y la prueba que ese criterio hizo posible, con el color que dio antes de tocar el
  código;
- el registro de quién fijó ese umbral: una norma, una persona con autoridad sobre el producto, o la
  característica misma;
- el inventario de datos personales de tu proyecto, con la finalidad declarada de cada uno;
- y el requisito que faltaba, escrito, con su prueba y la salida guardada como evidencia.

## 2. Lo que podemos afirmar hoy

La Clase 06 terminó con esta afirmación:

```text
El codigo fue comparado contra el requisito escrito,
y las diferencias que aparecieron estan corregidas o registradas.
```

Hoy la afirmación avanza un nivel, porque dejó de tratarse del código:

```text
El requisito fue comparado contra un modelo de calidad y contra la ley,
y lo que faltaba esta escrito y tiene una prueba que lo vigila.
```

Y lo que sigue sin poder afirmarse:

```text
El requisito esta completo.
```

Esa frase no tiene prueba posible, y ahora sabemos exactamente por qué. Es la primera fila de la
tabla del Bloque 1: un error o un vacío en el requisito es invisible para todo lo que viene después,
porque todo lo que viene después lo usa como referencia. La completitud de un requisito no se
demuestra ejecutando nada.

Lo que sí se puede hacer —y es lo que hicimos hoy— es **traerle referencias externas**. El modelo de
calidad aportó la palabra *confidencialidad*, que el repositorio no tenía. La ley aportó el umbral,
que no era nuestro. Cada fuente externa que incorporas achica el hueco. Ninguna lo cierra.

## 3. Ticket de salida

Antes de salir, responde en una línea cada una:

1. ¿Contra qué compara la prueba más importante de tu proyecto, y quién escribió eso?
2. ¿Qué criterio escribiste hoy, y quién fijó su umbral?
3. ¿Qué dato personal trata tu proyecto sin que exista una finalidad escrita que lo justifique?

## 4. Próxima clase: buscar lo que todavía no sabemos que falta

Hoy se usaron dos fuentes externas para encontrar huecos en un requisito, y las dos funcionaron.
Eso deja una pregunta incómoda: si dos referencias encontraron cosas que dos sesiones de revisión no
vieron, **¿cuántas quedan?**

La próxima sesión es un taller integrador sobre el método completo: cómo se conduce una auditoría de
verificación y validación de principio a fin, qué se mira en cada paso, en qué orden, y qué
evidencia tiene que quedar registrada al terminar. Se apoya en todo lo que el módulo ya dejó
disponible: el tipado y el linter de la Clase 05, la revisión con método de la Clase 06, y los
criterios y la base de prueba de hoy.

## Mensaje final

> El hallazgo que abrió estas dos sesiones estaba a la vista, en la línea más corta del archivo.
> Sobrevivió a tres auditorías con dos herramientas distintas y a dos suites de pruebas completas
> generadas sobre él. Ninguna de esas barreras falló por incompetencia: todas hicieron
> correctamente lo único que podían hacer, que era comparar el código contra lo que estaba escrito.
> Lo que finalmente lo encontró no fue una herramienta mejor ni un modelo más nuevo. Fueron cuatro
> líneas de texto que alguien tuvo que sentarse a escribir, decidiendo para qué existe cada dato.
> Ese trabajo no lo acelera ningún agente, porque no consiste en escribir más rápido: consiste en
> saber qué se quiere.

### Fuentes técnicas del cierre

- [ISO/IEC/IEEE 29119-3:2021](https://www.iso.org/standard/79429.html) — la base de prueba y el conjunto de documentación de pruebas.
- [ISO/IEC 25010:2023](https://www.iso.org/standard/78176.html) — el modelo de calidad como instrumento para validar la completitud de la definición de requisitos.
- [Ley 21.719 — Diario Oficial núm. 44.023, 13 de diciembre de 2024](https://www.diariooficial.interior.gob.cl/publicaciones/2024/12/13/44023/01/2583630.pdf) — principios de finalidad y proporcionalidad, y deber de protección desde el diseño y por defecto.
- Ejecuciones registradas para esta clase, sobre Python 3.12.12: las dos suites generadas por los protocolos A y B, la prueba del criterio de confidencialidad en sus dos versiones, y la revisión final contra el requisito ampliado.
