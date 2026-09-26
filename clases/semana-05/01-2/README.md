# Clase 15 - Semana 05 - Funciona, pero ¿cuánto aguanta, a quién deja entrar y para quién sirve?: pruebas no funcionales de rendimiento, seguridad, accesibilidad y portabilidad

- **Unidad:** 02 · Desarrollo y Ejecución de Casos de Prueba
- **Fecha:** Lunes 28 de septiembre de 2026 · segundo bloque
- **Duración:** 3 horas pedagógicas · 135 minutos (11:00 - 13:15)
- **Modalidad:** Presencial en Laboratorio de Redes
- **Docente:** Diego Obando
- **Marco de referencia:** ISO/IEC 25010:2023 · las características de calidad que no son la adecuación funcional: eficiencia de desempeño, seguridad, capacidad de interacción y flexibilidad · Locust · pruebas de carga, estrés y escalabilidad · OWASP Top 10:2025 · `bandit` y `pip-audit` como análisis automático de seguridad · WCAG 2.2 y `axe-core` sobre Playwright · Ley 21.719 · deber de seguridad (artículo 14 quinquies) y deber de reportar las vulneraciones (artículo 14 sexies) · el agente como auditor no funcional

---

# Objetivos de la Clase

## Objetivo General

Al finalizar esta sesión, el estudiante será capaz de probar lo que un sistema hace **además** de
cumplir sus funciones: cuánto tarda, cuánto aguanta, a quién deja entrar, a quién deja afuera y en
qué entornos sigue funcionando. Todas las pruebas del módulo hasta aquí, incluidas las de extremo a
extremo de esta mañana, comprueban **qué** hace el sistema: que una reserva válida se acepte, que
una inválida se rechace, que la pantalla diga lo que pasó. A esas pruebas se las llama
**funcionales**. Una **prueba no funcional** comprueba **cómo** lo hace: si responde a tiempo con
cien personas reservando a la vez, si deja que alguien actúe en nombre de otra persona, si alguien
que navega con el teclado o con un **lector de pantalla** —el programa que lee en voz alta lo que
aparece en la pantalla— puede completar la reserva, si funciona en
otro navegador o con otra versión de Python. Un sistema puede aprobar todas sus pruebas funcionales
y fallar en cualquiera de esas preguntas.
La norma que el módulo usa para clasificar la calidad del producto, ISO/IEC 25010:2023, le da nombre
a cada una de esas preguntas, y el estudiante las ubicará en ella: la **eficiencia de desempeño**, la
**seguridad**, la **capacidad de interacción** y la **flexibilidad**. Esa ubicación no es un trámite:
la revisión de 2023 movió varias piezas respecto de la versión anterior, y quien escribe un
requisito no funcional necesita saber en qué característica cae para saber contra qué medirlo.
La sesión recorre cuatro de esas preguntas, cada una con su herramienta y cada una ejecutada sobre el
mismo proyecto de reserva de laboratorio. El rendimiento se mide con una **prueba de carga**, que
simula muchas personas usando el sistema a la vez y registra cuánto tarda en responder. La seguridad
se prueba desde dos lados: con pruebas escritas en las que actúa alguien que intenta lo que no debería, y
con herramientas que revisan el código y sus dependencias en busca de debilidades conocidas. La
accesibilidad se revisa con una herramienta que recorre la interfaz contra las pautas
internacionales, y se discute lo que ninguna herramienta puede revisar por sí sola. La portabilidad se
comprueba ejecutando la misma **suite** —el conjunto de pruebas que se ejecutan juntas con un
comando— en otros navegadores y en otra versión del lenguaje.
Lo que une las cuatro es la lección con que cerró la sesión de esta mañana: **una observación sin
umbral no se puede cumplir ni incumplir**. «El sistema es rápido», «el sistema es seguro» y «el
sistema es accesible» tienen el mismo problema que «la interfaz confunde». Cada prueba de la sesión
parte por fijar la magnitud, el método y el umbral **antes** de medir, porque un número sin umbral
no aprueba ni reprueba nada. Y como la seguridad de un sistema que guarda RUT y correos no es solo
una cualidad técnica, la sesión vuelve a la Ley 21.719: qué le exige a quien trata datos personales
cuando una prueba de seguridad revela que esos datos quedaron expuestos.
La sesión cierra con un agente al que se le pide una auditoría no funcional del proyecto. Sus
afirmaciones se tratan como todo hallazgo en este módulo: se verifican ejecutándolas antes de
creerlas, y las que sobreviven se convierten en requisitos con umbral.

## Objetivos Específicos

1. **Distinguir una prueba funcional de una no funcional por lo que comprueba**, qué hace el sistema
   o cómo lo hace, y ubicar cada prueba no funcional de la sesión en su característica de ISO/IEC
   25010:2023, reconociendo los cambios de la revisión de 2023 que afectan dónde cae cada una.
2. **Diseñar y ejecutar una prueba de carga con Locust** sobre la API del proyecto, declarando el
   umbral antes de medir, leyendo los tiempos de respuesta en **percentiles** —el tiempo que no supera
   un porcentaje dado de las respuestas—, y distinguiendo una prueba
   de carga de una de estrés y de una de escalabilidad por la pregunta que responde cada una, y
   reconocer un defecto que solo aparece cuando varias personas usan el sistema al mismo tiempo.
3. **Escribir pruebas de seguridad sobre el proyecto**, en las que actúa alguien que intenta hacer lo
   que no debería —una inyección, una suplantación—, y usar `bandit` y `pip-audit` para revisar el
   código y sus dependencias, verificando si cada hallazgo es explotable antes de creerlo,
   clasificándolo contra el OWASP Top 10:2025, la lista de los diez riesgos de seguridad más
   importantes en aplicaciones web, y relacionándolo con los deberes de seguridad y de
   reporte de la Ley 21.719.
4. **Ejecutar una revisión automática de accesibilidad con `axe-core` sobre Playwright** contra las
   pautas WCAG 2.2, las pautas internacionales de accesibilidad para la web, interpretar sus resultados y nombrar qué parte de la accesibilidad de una
   interfaz ninguna herramienta automática puede comprobar.
5. **Comprobar la portabilidad del sistema** ejecutando la misma suite en tres motores de navegador —Chromium, Firefox y WebKit— y
   en dos versiones de Python, y explicar por qué ISO/IEC 25010:2023 trata hoy esa pregunta dentro de
   la flexibilidad.
6. **Evaluar la auditoría no funcional que entrega un agente**, verificando cada afirmación con una
   ejecución, y convertir las que se confirman en requisitos no funcionales con magnitud, método y
   umbral.

## Competencias Transversales

- **Declarar el umbral antes de medir:** un número medido sin umbral acordado se puede leer como bueno
  o como malo según convenga; fijarlo antes es lo que vuelve honesta una medición.
- **Probar solo lo que se tiene autorización para probar:** una prueba de carga o un análisis de
  seguridad contra un sistema ajeno no es una prueba, es un ataque. Todo lo de esta sesión se ejecuta
  contra el propio proyecto, en la propia máquina.
- **Reconocer que la seguridad de los datos es una obligación, no una preferencia:** cuando un sistema
  guarda datos personales, una prueba de seguridad en rojo puede ser el comienzo de un deber legal.
- **Recordar a quién deja afuera una interfaz:** la accesibilidad no se revisa pensando en quien
  prueba, sino en quien usa el sistema de una forma distinta.
- **Tratar la auditoría de un agente como una lista de hipótesis:** una afirmación sobre rendimiento o
  seguridad vale lo que vale la ejecución que la respalda.

---

# Mapa de la Clase

| Horario | Sección | Propósito |
|---------|---------|-----------|
| 11:00 - 11:10 | Encuadre | Constatar que todo lo probado hasta la mañana comprueba qué hace el sistema, y plantear la pregunta de la sesión: cómo lo hace. Separar las pruebas funcionales de las no funcionales y ubicar las segundas en las características de ISO/IEC 25010:2023. |
| 11:10 - 11:40 | Bloque 1 | Cuánto aguanta. Una prueba de carga con Locust sobre la API, con el umbral fijado antes de medir; los tiempos de respuesta leídos en percentiles; la diferencia entre carga, estrés y escalabilidad; y lo que la carga en verde no miró: dos personas con el mismo bloque. |
| 11:40 - 12:10 | Bloque 2 | A quién deja entrar. Una prueba de inyección que pasa y una de suplantación que falla: cualquiera puede gastar la cuota de otra persona con su RUT. Revisión automática del código y las dependencias con `bandit` y `pip-audit`, verificando si cada hallazgo es explotable; los hallazgos contra el OWASP Top 10:2025; y lo que exige la Ley 21.719 a quien trata datos personales. |
| 12:10 - 12:20 | Pausa | Descanso técnico. |
| 12:20 - 12:45 | Bloque 3 | Para quién sirve y dónde corre. Revisión automática de accesibilidad con `axe-core` contra WCAG 2.2, que pasa con la página vacía y falla con un bloque tomado; lo que la herramienta no puede ver; y la misma suite ejecutada en tres navegadores y dos versiones de Python. |
| 12:45 - 13:05 | Bloque 4 | Un requisito sin umbral no se prueba. La auditoría no funcional de un agente, verificada afirmación por afirmación: confirmados, refutados, no reproducidos y dependientes del requisito. Una corrección de la mañana que dejó un defecto nuevo, convertido en prueba con magnitud, método y umbral. |
| 13:05 - 13:15 | Cierre | Consolidar qué se puede afirmar ahora sobre el sistema además de que funciona, y dejar planteado lo que la sesión de mañana tiene que decidir: cuánto de todo esto vale la pena probar y con qué prioridad. |

> Se trabaja sobre el mismo proyecto de reserva de laboratorio de la sesión de esta mañana, con su
> API, su interfaz y sus dos suites: la de `pytest`, que ejecuta las pruebas de Python, y la de
> Playwright, que ejecuta las de extremo a extremo. La sesión agrega herramientas, no reescribe el
> sistema. **Todas las pruebas de carga y de seguridad se ejecutan contra el propio proyecto,
> corriendo en la propia máquina.** El Laboratorio de Redes comparte una red con otros equipos, y
> apuntar una prueba de carga o un análisis de seguridad a un sistema que no es propio, aunque sea
> el de un compañero, queda fuera de la sesión.

> **Vocabulario que la sesión usa desde el primer minuto.** Una **API** es la puerta por la que otros
> programas usan el sistema; la de este proyecto recibe las reservas y responde el estado de los
> bloques. Una **prueba de extremo a extremo** recorre el sistema completo por la pantalla, como lo
> haría una persona. `pytest` es la herramienta que ejecuta las pruebas de Python, y **Playwright** la
> que ejecuta las de extremo a extremo manejando un navegador real. **SQL** es el lenguaje con que se
> consultan y modifican las bases de datos, y **SQLite** la base de datos del proyecto, que vive en
> un solo archivo. Un **agente** es un programa basado en un modelo de lenguaje que, a partir de un
> pedido escrito, lee archivos y realiza tareas. **ISTQB** es la organización internacional que
> define el programa de certificación de quienes prueban software, y su programa de nivel inicial es
> una de las dos fuentes de referencia del módulo; la otra son las normas ISO.

## Punto de partida: qué hace el sistema y cómo lo hace

El programa de ISTQB separa las pruebas en tipos según lo que evalúan, y los dos primeros ordenan
esta sesión:

> "Functional testing evaluates the functions that a component or system should perform. The
> functions are "what" the test object should do. […] Non-functional testing evaluates attributes
> other than functional characteristics of a component or system. Non-functional testing is the
> testing of "how well the system behaves"."
>
> — ISTQB Certified Tester Foundation Level Syllabus v4.0.1, sección 2.2.2

En español: *la prueba funcional evalúa las funciones que un componente o sistema debe cumplir; las
funciones son «qué» debe hacer el objeto de prueba. La prueba no funcional evalúa atributos distintos
de las características funcionales; es la prueba de «qué tan bien se comporta el sistema».* El
**objeto de prueba** es lo que se está probando; aquí, el sistema de reservas.

Todas las pruebas del módulo hasta esta mañana son funcionales: comprueban que una reserva válida se
acepte, que una inválida se rechace, que la pantalla diga lo que pasó. Esta sesión mide el otro lado.
La misma sección del programa remite a ISO/IEC 25010:2023 para clasificar las características no
funcionales, y las enumera así: eficiencia de desempeño, compatibilidad, capacidad de interacción,
fiabilidad, seguridad, mantenibilidad, flexibilidad y protección. Con la adecuación funcional, que es
la que comprueban las pruebas funcionales, son las nueve características del modelo.

La revisión de 2023 cambió varios nombres, y el prólogo de la norma los enumera. Dos de esos cambios
importan hoy:

> "Usability and portability have been replaced with interaction capability and flexibility
> respectively. Inclusivity and self-descriptiveness, resistance, and scalability have been added as
> subcharacteristics of interaction capability, security, and flexibility respectively."
>
> — ISO/IEC 25010:2023, prólogo

En español: *la usabilidad y la portabilidad fueron reemplazadas por la capacidad de interacción y la
flexibilidad, respectivamente. La inclusividad y la autodescriptividad, la resistencia y la
escalabilidad se agregaron como subcaracterísticas de la capacidad de interacción, la seguridad y la
flexibilidad, respectivamente.* Quien busque «portabilidad» o «escalabilidad» en la norma vigente las
encuentra dentro de la **flexibilidad**, no donde estaban antes.

El recorrido de la sesión es **medir → atacar → incluir → exigir**. Se mide cuánto aguanta el
sistema, se prueba a quién deja entrar, se revisa a quién deja afuera y en qué entornos corre, y se
exige que cada afirmación tenga un umbral. La regla es la misma que cerró la sesión de esta mañana:
«el sistema es rápido» no se puede cumplir ni incumplir hasta que dice cuánto, medido cómo y contra
qué límite.

---

# BLOQUE 1: Cuánto aguanta

- **Duración:** 30 minutos
- **Objetivo del bloque:** medir el comportamiento del sistema con muchas personas usándolo a la vez,
  fijando el umbral antes de medir, y distinguir una prueba de carga de una de estrés y de una de
  escalabilidad. Al finalizar, el estudiante debe poder escribir y ejecutar una prueba de carga con
  Locust, leer sus resultados en percentiles, y explicar por qué una prueba de carga en verde no
  garantiza que el sistema haya hecho bien lo que hizo.
- **Modalidad:** exposición con ejecución en vivo sobre el proyecto, y registro escrito individual.
- **Ritmo sugerido:** 4 minutos para la característica y el umbral, 7 para la prueba de carga, 5 para
  el estrés, 8 para lo que la carga no miró, y 6 para la prueba que lo captura y su corrección.

## Desarrollo

### 1.1 El umbral se fija antes de medir

La característica de ISO/IEC 25010:2023 que corresponde a «cuánto aguanta» es la eficiencia de
desempeño:

> "performance efficiency: capability of a product to perform its functions within specified time and
> throughput parameters and be efficient in the use of resources under specified conditions"
>
> — ISO/IEC 25010:2023, cláusula 3.2

En español: *eficiencia de desempeño: capacidad de un producto de cumplir sus funciones dentro de
parámetros especificados de tiempo y de rendimiento, y de usar los recursos de forma eficiente, en
condiciones especificadas.* Dos de sus subcaracterísticas son las que se miden hoy. El **comportamiento
temporal** (3.2.1) pide que el tiempo de respuesta y el rendimiento cumplan los requisitos. La
**capacidad** (3.2.3) pide cumplir los límites máximos de un parámetro del producto, y su nota
enumera como ejemplo *la cantidad de usuarios concurrentes*, es decir, que usan el sistema al mismo
tiempo.

Las dos definiciones dicen «especificados» y «los requisitos». La norma no dice cuánto es rápido:
exige que alguien lo haya dicho. Por eso, antes de medir, se escribe el criterio con sus tres piezas:

| Pieza | Valor para esta sesión |
|---|---|
| **Magnitud** | Tiempo de respuesta de la API y proporción de solicitudes fallidas |
| **Método** | Prueba de carga con 100 usuarios simulados durante 40 segundos, sobre la API corriendo en la propia máquina |
| **Umbral** | El percentil 95 del tiempo de respuesta no supera 300 milisegundos, y ninguna solicitud falla |

El **percentil 95**, escrito **p95**, es el tiempo que no supera el 95 % de las solicitudes: si el p95
es 48 milisegundos, 95 de cada 100 respuestas llegaron en 48 milisegundos o menos, y las 5 restantes
tardaron más. Se usa en lugar del promedio porque el promedio esconde a los que esperaron mucho: diez
respuestas de 5 milisegundos y una de 2 segundos promedian 186 milisegundos, un número que no le pasó
a nadie. El **p50**, o mediana, es el tiempo que no supera la mitad de las solicitudes, y el
**p99** el que no supera el 99 %: el de los casos más lentos.

Fijar el umbral **antes** no es un detalle de orden. Un número medido sin umbral acordado se puede
leer como bueno o como malo según convenga; fijado antes, la medición aprueba o reprueba sola.

### 1.2 Una prueba de carga con Locust

Una **prueba de carga** simula a muchas personas usando el sistema a la vez y registra cómo responde.
Locust es una herramienta de Python para escribirlas: cada persona simulada es un **usuario** de
Locust, que repite unas tareas con una pausa entre ellas.

```python
import random

from locust import HttpUser, between, task


class PersonaQueReserva(HttpUser):
    wait_time = between(1, 3)

    @task(4)
    def mirar_bloques(self):
        self.client.get("/bloques")

    @task(1)
    def intentar_reservar(self):
        n = random.randint(1, 10_000_000)
        datos = {
            "nombre": "Persona de prueba",
            "rut": f"{n}-{n % 10}",
            "correo_electronico": f"persona{n}@ejemplo.cl",
            "bloque": random.randint(1, 8),
            "personas": random.randint(1, 30),
        }
        with self.client.post("/reservas", json=datos, catch_response=True) as respuesta:
            if respuesta.status_code in (201, 409):
                respuesta.success()
```

| Pieza | Qué hace |
|---|---|
| `HttpUser` | La clase base de un usuario simulado que habla con el sistema por HTTP, el protocolo con que un navegador o un programa envía solicitudes a una API y recibe sus respuestas. |
| `wait_time = between(1, 3)` | Entre una tarea y la siguiente, el usuario espera entre 1 y 3 segundos al azar, como una persona que lee antes de actuar. |
| `@task(4)` y `@task(1)` | Marcan las tareas y su peso: cada usuario mira los bloques cuatro veces por cada intento de reserva. |
| `self.client` | El cliente con que el usuario envía las solicitudes; Locust mide el tiempo de cada una. |
| `catch_response=True` | Permite decidir qué cuenta como falla. Con solo ocho bloques, la mayoría de los intentos terminan en `409`, y un rechazo por bloque tomado es la respuesta correcta, no una falla. |

El nombre, el RUT y el correo se inventan en cada intento a partir de un número al azar, `n`. Así cada
intento es de una persona distinta, y no choca con el límite de tres reservas por semana por RUT. Los
datos son sintéticos: no son de nadie.

La API se arranca en la propia máquina con **uvicorn**, el servidor que la pone a recibir solicitudes,
y la prueba se ejecuta sin interfaz gráfica:

```bash
uv run uvicorn api:app --host 127.0.0.1 --port 8000
uv run locust --headless -u 100 -r 20 -t 40s --host http://127.0.0.1:8000
```

`-u 100` es la cantidad de usuarios simulados, `-r 20` cuántos se agregan por segundo hasta llegar a
ese número, y `-t 40s` la duración. Al terminar, Locust informa por cada ruta la cantidad de
solicitudes, las fallas y los percentiles. Estos son los resultados de cuatro tandas, del informe
agregado de cada una:

| Usuarios | Solicitudes | Fallas | p50 | p95 | p99 | Solicitudes por segundo |
|---|---|---|---|---|---|---|
| 10 | 197 | 0 | 5 ms | 32 ms | 64 ms | 5,0 |
| 50 | 971 | 0 | 5 ms | 26 ms | 100 ms | 24,5 |
| **100** | **1.912** | **0** | **5 ms** | **48 ms** | **76 ms** | **48,4** |
| 200 | 3.556 | 0 | 6 ms | 47 ms | 81 ms | 89,9 |

Con 100 usuarios, el p95 es 48 milisegundos y no hay fallas: el criterio se cumple con holgura. Las
solicitudes por segundo crecen a la par con los usuarios porque cada uno espera entre 1 y 3 segundos
entre tareas: cien usuarios así producen unas 50 solicitudes por segundo.

### 1.3 Carga, estrés y escalabilidad

Las tres pruebas usan la misma herramienta y responden preguntas distintas. El glosario de ISTQB las
define así:

> "load testing: A type of performance testing conducted to evaluate the behavior of a component or
> system under varying loads, usually between anticipated conditions of low, typical, and peak usage."
>
> "stress testing: A type of performance testing conducted to evaluate a system or component at or
> beyond the limits of its anticipated or specified workloads, or with reduced availability of
> resources such as access to memory or servers."
>
> — ISTQB Standard Glossary of Terms Used in Software Testing, versión 3.7

En español: *prueba de carga: prueba de desempeño que evalúa el comportamiento bajo cargas variables,
normalmente entre las condiciones previstas de uso bajo, típico y máximo. Prueba de estrés: prueba de
desempeño que evalúa el sistema en los límites de la carga prevista o más allá de ellos, o con menos
recursos disponibles.* La carga pregunta si el sistema cumple **en las condiciones previstas**; el
estrés pregunta **dónde deja de cumplir y cómo falla**. La **escalabilidad**, que el mismo glosario
define como el grado en que un sistema puede ajustarse a una capacidad que cambia, pregunta otra cosa:
si al darle más recursos —más procesos, más máquinas— aguanta proporcionalmente más.

Una prueba de estrés sobre el mismo sistema, subiendo los usuarios más allá de lo previsto:

| Usuarios | Solicitudes | Fallas | p50 | p95 | p99 | Solicitudes por segundo |
|---|---|---|---|---|---|---|
| 500 | 10.689 | 0 | 11 ms | 160 ms | 330 ms | 238,8 |
| 1.000 | 14.789 | 0 | 420 ms | 1.600 ms | 2.800 ms | 319,2 |
| 2.000 | 13.730 | 252 (1,84 %) | 1.200 ms | 3.300 ms | 23.000 ms | 302,4 |

El punto de quiebre está entre 500 y 1.000 usuarios: con 500, el p95 todavía cumple el umbral; con
1.000, lo supera cinco veces. La señal más clara es la última columna. De 500 a 1.000 usuarios las
solicitudes por segundo casi no crecen, y de 1.000 a 2.000 bajan: el sistema llegó a su **capacidad**,
alrededor de 300 solicitudes por segundo en esta máquina, y lo que sobra se convierte en espera. Con
2.000 usuarios la espera se vuelve falla: 252 conexiones se cortaron antes de recibir respuesta.

Esa cifra vale para esta máquina y esta ejecución, y hay que decirlo con la misma claridad que el
resultado. Locust y la API corrieron en el mismo computador, compitiendo por los mismos cuatro núcleos;
en un servidor real el punto de quiebre estaría en otro lugar. Una prueba de estrés no entrega «el»
límite del sistema: entrega el límite **en unas condiciones declaradas**, y por eso las condiciones
son parte del resultado.

### 1.4 Lo que la prueba de carga no miró

Después de cada tanda de la sección 1.2 se revisó la base de datos, contando las reservas guardadas
por bloque. Tras la tanda de 50 usuarios, el bloque 4 tenía **dos** reservas. Tras la de 100, el
bloque 1 tenía **dos**. El sistema permite una reserva por bloque, y la API rechaza con `409` una
reserva de un bloque tomado. Aun así, dos personas quedaron con el mismo bloque.

Locust informó **cero fallas** en esas dos tandas. No es un error de la herramienta: una prueba de
carga mide cuánto tarda una respuesta y si llegó, no si lo que el sistema hizo fue correcto. Las dos
respuestas fueron `201`, rápidas y bien formadas; que no debieran haber sido las dos `201` es algo
que ninguna medición de tiempo puede ver.

Para comprobar la sospecha sin depender del azar de una prueba de carga, un programa pequeño envía
veinte reservas **del mismo bloque al mismo tiempo**, cada una de una persona distinta, y cuenta
cuántas quedaron guardadas. Diez ejecuciones, partiendo cada vez de la base vacía:

```text
reservas guardadas del bloque 3: 1
reservas guardadas del bloque 3: 3
reservas guardadas del bloque 3: 2
reservas guardadas del bloque 3: 2
reservas guardadas del bloque 3: 5
reservas guardadas del bloque 3: 3
reservas guardadas del bloque 3: 9
reservas guardadas del bloque 3: 1
reservas guardadas del bloque 3: 2
reservas guardadas del bloque 3: 7
```

Ocho de diez veces el sistema aceptó más de una reserva del mismo bloque, y una vez aceptó nueve. Con
solo **dos** solicitudes simultáneas en lugar de veinte, ocurrió una vez en diez.

La causa está en el orden de los pasos de `crear_reserva`:

```python
tomado = almacen.bloque_tomado(conexion, solicitud.bloque)
# ... validaciones ...
almacen.guardar(conexion, bloque=solicitud.bloque, ...)
```

Primero **pregunta** si el bloque está tomado, y después **escribe** la reserva. Entre la pregunta y la
escritura hay un instante. Si dos solicitudes llegan juntas, las dos preguntan antes de que cualquiera
escriba, las dos reciben «libre», y las dos escriben. A este defecto se le llama **condición de
carrera**: el resultado depende de qué solicitud llega primero a cada paso, algo que nadie controla.

La suite de `pytest`, con sus 20 pruebas, nunca lo vio, porque todas envían una solicitud a la vez.
Es un defecto **funcional** —el sistema hace algo que no debe— que solo aparece bajo una condición
**no funcional**: varias personas al mismo tiempo, justo el parámetro que la nota de la capacidad en
ISO/IEC 25010:2023 pone de ejemplo.

### 1.5 La prueba que lo captura, y la corrección

La prueba envía veinte reservas simultáneas del bloque 4 y afirma que el sistema aceptó exactamente
una:

```python
import sqlite3
from contextlib import closing
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from fastapi.testclient import TestClient

from api import app

PERSONAS = 20


def reservar_bloque_4(i: int) -> int:
    solicitud = {
        "nombre": f"Persona {i}",
        "rut": f"{10_000_000 + i}-{i % 10}",
        "correo_electronico": f"persona{i}@ejemplo.cl",
        "bloque": 4,
        "personas": 5,
    }
    return TestClient(app).post("/reservas", json=solicitud).status_code


def test_reservas_simultaneas_del_mismo_bloque_aceptan_una_sola(
    base_de_datos_de_prueba: Path,
) -> None:
    with ThreadPoolExecutor(max_workers=PERSONAS) as grupo:
        codigos = list(grupo.map(reservar_bloque_4, range(PERSONAS)))

    with closing(sqlite3.connect(base_de_datos_de_prueba)) as conexion:
        guardadas = conexion.execute(
            "SELECT COUNT(*) FROM reservas WHERE bloque = 4"
        ).fetchone()[0]

    assert codigos.count(201) == 1
    assert guardadas == 1
```

| Pieza | Qué hace |
|---|---|
| `TestClient(app)` | El **cliente de pruebas** de FastAPI: un programa que envía solicitudes a la API como lo haría la página, sin levantar un servidor. Cada hilo crea el suyo. |
| `base_de_datos_de_prueba` | Una **fixture**: una preparación que `pytest` ejecuta antes de la prueba y le entrega como argumento. Esta crea una base vacía en una carpeta temporal, con el bloque 2 ya tomado, y la borra al terminar. |
| `ThreadPoolExecutor(max_workers=PERSONAS)` | Crea veinte **hilos**, partes del programa que corren al mismo tiempo; cada uno envía una reserva. |
| `grupo.map(reservar_bloque_4, range(PERSONAS))` | Llama a `reservar_bloque_4` con 0, 1, 2… hasta 19, repartiendo las llamadas entre los hilos, y reúne los códigos de respuesta. |
| `closing(sqlite3.connect(...))` | Abre la base para contar y la cierra al terminar. Sin cerrarla, Windows no deja que la fixture borre el archivo de la base al final de la prueba. |
| `codigos.count(201) == 1` | Afirma que, de las veinte respuestas, exactamente una fue una reserva aceptada. |

Ejecutada contra el sistema tal como está:

```text
E       assert 4 == 1
FAILED test_concurrencia.py::test_reservas_simultaneas_del_mismo_bloque_aceptan_una_sola - assert 4 == 1
1 failed, 1 warning in 0.86s
```

Repetida diez veces, falló las diez, aceptando entre 3 y 9 reservas del mismo bloque. El aviso de la
última línea no es del proyecto: viene de dos bibliotecas que usa FastAPI, Starlette y AnyIO, y avisa
que una de ellas cambió el nombre de una pieza interna.

La corrección consiste en que la pregunta y la escritura ocurran como **una sola operación** que nadie
pueda interrumpir. En una base de datos eso se llama una **transacción**, y SQLite ofrece una forma de
abrirla que reserva de inmediato el derecho a escribir. Es una línea al comienzo de `crear_reserva`:

```python
conexion = almacen.conectar()
try:
    conexion.execute("BEGIN IMMEDIATE")
    tomado = almacen.bloque_tomado(conexion, solicitud.bloque)
```

La documentación de SQLite describe lo que hace:

> "IMMEDIATE causes the database connection to start a new write immediately, without waiting for a
> write statement. The BEGIN IMMEDIATE might fail with SQLITE_BUSY if another write transaction is
> already active on another database connection."
>
> — SQLite, documentación de `BEGIN TRANSACTION`

En español: *IMMEDIATE hace que la conexión empiece una escritura de inmediato, sin esperar a que
aparezca una instrucción de escritura. Puede fallar con SQLITE_BUSY si otra conexión ya tiene una
escritura en curso.* En la práctica, la segunda solicitud **espera su turno**: la conexión de Python a
SQLite reintenta durante un plazo de 5 segundos antes de rendirse. Cuando le toca, la primera ya
escribió, y la pregunta «¿está tomado?» recibe la respuesta verdadera.

Con la corrección, la misma prueba diez veces pasó las diez, y la suite completa:

```text
21 passed, 1 warning in 0.96s
```

El programa de las veinte reservas simultáneas guardó exactamente una en las diez ejecuciones, y las
pruebas de carga repetidas con 100, 500 y 1.000 usuarios no dejaron ningún bloque con dos reservas.

Queda una pregunta honesta: ¿cuesta tiempo que las escrituras esperen su turno? La primera tanda con
la corrección dio un p95 de 200 milisegundos para las reservas, contra 11 sin ella, y parecía un costo
claro. Se repitió tres veces cada versión con 100 usuarios, y el p95 de las reservas fue 14, 9 y 7
milisegundos sin la corrección, y 160, 19 y 17 con ella. La mediana fue la misma en las seis
ejecuciones: 3 o 4 milisegundos. Con estos datos **no se puede afirmar** un costo: una ejecución
aislada no distingue un efecto de la variación normal entre ejecuciones. Es la misma lección que la
sesión de esta mañana sacó de la prueba inestable, ahora aplicada a una medición: un resultado se cree
cuando se repite.

## Ejercicio del bloque

Sobre el proyecto propio, el mismo que se entrega como evaluación, corriendo en tu propia máquina.

1. **Escribe el criterio antes de medir.** Elige una ruta de tu API y escribe magnitud, método y
   umbral. El umbral tiene que estar escrito antes de ejecutar la prueba.
2. **Escribe y ejecuta una prueba de carga con Locust** sobre esa ruta, con al menos dos cantidades de
   usuarios. Anota el p50, el p95 y las fallas de cada tanda.
3. **Busca el punto de quiebre** subiendo los usuarios hasta que el p95 supere tu umbral o aparezcan
   fallas. Anota las condiciones: qué máquina, qué más corría en ella.
4. **Revisa lo que la carga no mira.** Si tu sistema tiene alguna regla del tipo «solo uno», «como
   máximo tres» o «no puede repetirse», envía solicitudes simultáneas que la desafíen y cuenta lo que
   quedó guardado.

**Pista:** si tu API no tiene ninguna regla que pueda romperse con solicitudes simultáneas, busca
cualquier lugar donde el código primero pregunte algo a la base de datos y después escriba según la
respuesta. Ese es el patrón de una condición de carrera.

**Evidencia esperada:** el criterio escrito antes de medir, dos tandas de carga con sus percentiles,
el punto de quiebre con sus condiciones, y el resultado de las solicitudes simultáneas.

## Preguntas guía

1. La prueba de carga con 100 usuarios dio cero fallas y un p95 de 48 milisegundos, y en esa misma
   tanda dos personas quedaron con el mismo bloque. ¿La prueba de carga estaba mal hecha?

   **Pista:** revisa qué mide Locust de cada respuesta y qué no puede saber de ella. Pregúntate qué
   tendría que haberle dicho alguien a la herramienta para que la doble reserva contara como falla.

2. Con 1.000 usuarios, el p95 fue 1.600 milisegundos en esta máquina. Un compañero propone escribir en
   el informe que «el sistema soporta hasta 500 usuarios». ¿Qué le falta a esa frase?

   **Pista:** mira dónde corrieron Locust y la API durante la prueba. Pregúntate si el número sería el
   mismo en el servidor donde el sistema va a funcionar.

3. La primera medición con la corrección mostró que las reservas tardaban más, y las siguientes no.
   ¿Qué habría pasado si se hubiera informado solo la primera?

   **Pista:** compara las seis ejecuciones repetidas. Pregúntate qué habría decidido alguien que leyó
   un solo número.

## Fuentes técnicas del bloque

- [ISTQB Certified Tester Foundation Level Syllabus v4.0.1](https://astqb.org/assets/documents/ISTQB_CTFL_Syllabus_v4.0.1.pdf) — sección 2.2.2, citada literalmente: la prueba funcional como el «qué» y la no funcional como el «qué tan bien», y la lista de características no funcionales según ISO/IEC 25010.
- [ISO/IEC 25010:2023, vista previa de la publicación](https://cdn.standards.iteh.ai/samples/78176/13ff8ea97048443f99318920757df124/ISO-IEC-25010-2023.pdf) — el prólogo con los cambios respecto de la edición de 2011, citado literalmente; la eficiencia de desempeño (3.2), el comportamiento temporal (3.2.1) y la capacidad (3.2.3) con su nota sobre los usuarios concurrentes.
- [ISTQB Standard Glossary of Terms Used in Software Testing, versión 3.7](https://www.ctqb.org/en/downloads/istqb.html?file=files%2Fcontent%2Fctqb%2Fdownloads%2Fistqb%2FGlossary-terms-version-3.7.pdf&cid=33119) — las definiciones de prueba de carga, de estrés y de escalabilidad, citadas literalmente.
- [Locust — documentación](https://docs.locust.io/en/stable/) — la clase `HttpUser`, las tareas con peso, `wait_time` y `catch_response`, y la ejecución sin interfaz con `--headless`.
- [SQLite — `BEGIN TRANSACTION`](https://www.sqlite.org/lang_transaction.html) — el comportamiento de `BEGIN IMMEDIATE`, citado literalmente.
- [Python — módulo `sqlite3`](https://docs.python.org/3/library/sqlite3.html) — el plazo de espera por omisión de 5 segundos de `sqlite3.connect` cuando la base está ocupada.
- Ejecuciones registradas para esta clase sobre el proyecto de reserva de laboratorio, con Python 3.13.11, FastAPI 0.141.1, uvicorn 0.53.0, Locust 2.46.6 y pytest 9.1.1, con Locust y la API en el mismo computador de cuatro núcleos: las tandas de carga de 10, 50, 100 y 200 usuarios y las de estrés de 500, 1.000 y 2.000 usuarios, con su informe agregado; las reservas duplicadas encontradas tras las tandas de 50 y 100 usuarios; las diez ejecuciones de veinte reservas simultáneas y las diez de dos; la prueba de concurrencia en rojo diez de diez antes de la corrección y en verde diez de diez después; la suite completa en `21 passed`; y las tres repeticiones de cada versión con 100 usuarios.

---

# BLOQUE 2: A quién deja entrar

- **Duración:** 30 minutos
- **Objetivo del bloque:** probar la seguridad del sistema desde dos lados —pruebas escritas que
  afirman lo que el sistema no debe permitir, y herramientas que revisan el código y sus dependencias
  en busca de debilidades conocidas— y decidir qué hacer con lo que cada lado encuentra. Al finalizar,
  el estudiante debe poder escribir una prueba de seguridad sobre su API, ejecutar `bandit` y
  `pip-audit` e interpretar sus resultados sin creerles a ciegas, clasificar cada hallazgo contra el
  OWASP Top 10, y explicar qué le exige la Ley 21.719 a quien trata datos personales.
- **Modalidad:** exposición con ejecución en vivo sobre el proyecto, y registro escrito individual.
- **Ritmo sugerido:** 4 minutos para la característica y la lista de OWASP, 8 para las dos pruebas de
  seguridad, 7 para `bandit` y la verificación de su hallazgo, 5 para `pip-audit`, y 6 para la ley.

## Desarrollo

### 2.1 La seguridad en la norma, en la industria y en la ley

En ISO/IEC 25010:2023 la **seguridad** es una de las nueve características de calidad. Sus
subcaracterísticas son la confidencialidad, la integridad, el no repudio, la responsabilidad y la
autenticidad, y la revisión de 2023 agregó una sexta, la **resistencia**, según el prólogo citado en
el punto de partida. Dos de ellas ordenan este bloque: la **confidencialidad**, que los datos solo
los vea quien está autorizado, y la **autenticidad**, que el sistema pueda comprobar que alguien es
quien dice ser.

La norma nombra las características; no dice qué falla con más frecuencia. Eso lo hace el **OWASP Top
10**, la lista que publica la fundación OWASP con las diez categorías de riesgo más importantes en
aplicaciones web, construida con datos de aplicaciones reales. Su edición vigente es la de 2025:

| Código | Categoría |
|---|---|
| A01:2025 | Control de acceso defectuoso (*Broken Access Control*) |
| A02:2025 | Configuración de seguridad incorrecta |
| A03:2025 | Fallas en la cadena de suministro de software |
| A04:2025 | Fallas criptográficas |
| A05:2025 | Inyección (*Injection*) |
| A06:2025 | Diseño inseguro |
| A07:2025 | Fallas de autenticación (*Authentication Failures*) |
| A08:2025 | Fallas de integridad del software o de los datos |
| A09:2025 | Fallas de registro y alerta de seguridad |
| A10:2025 | Manejo incorrecto de condiciones excepcionales |

Y como el sistema guarda RUT y correos, la seguridad es también una obligación legal. La Ley 21.719
la establece como uno de sus principios:

> «f) Principio de seguridad. En el tratamiento de los datos personales, el responsable debe
> garantizar estándares adecuados de seguridad, protegiéndolos contra el tratamiento no autorizado o
> ilícito, y contra su pérdida, filtración, daño accidental o destrucción.»
>
> — Ley 21.719, artículo 3°, letra f

El **responsable** es quien decide para qué y cómo se tratan los datos; aquí, la institución que opera
el sistema de reservas.

### 2.2 Lo que una prueba de seguridad afirma

Una prueba de seguridad se escribe igual que cualquier otra: prepara, actúa y afirma. Lo que cambia es
**quién actúa**. En una prueba funcional actúa una persona que usa el sistema como corresponde; en una
de seguridad actúa alguien que intenta hacer lo que no debería poder hacer. Estas dos pruebas usan el
cliente de pruebas y la fixture del bloque 1:

```python
def test_un_nombre_con_codigo_sql_se_guarda_como_texto(base_de_datos_de_prueba: Path) -> None:
    nombre = "x'); DROP TABLE reservas; --"

    respuesta = cliente.post("/reservas", json=ANA | {"nombre": nombre, "bloque": 4})

    assert respuesta.status_code == 201
    with closing(sqlite3.connect(base_de_datos_de_prueba)) as conexion:
        guardado = conexion.execute("SELECT nombre FROM reservas WHERE bloque = 4").fetchone()
    assert guardado == (nombre,)


def test_otra_persona_no_puede_agotar_la_cuota_de_ana(base_de_datos_de_prueba: Path) -> None:
    otra_persona = ANA | {"nombre": "Otra persona", "correo_electronico": "otra@ejemplo.cl"}
    for bloque in (1, 3, 5):
        cliente.post("/reservas", json=otra_persona | {"bloque": bloque})

    respuesta = cliente.post("/reservas", json=ANA | {"bloque": 7})

    assert respuesta.status_code == 201
```

`ANA` es un diccionario con el nombre, el RUT `11.111.111-1`, el correo y la cantidad de personas de
Ana, y `ANA | {...}` crea una copia con algunos campos reemplazados.

La primera prueba intenta una **inyección**: escribe en el nombre un texto que, si el sistema lo
pegara dentro de una instrucción SQL, cerraría la instrucción y agregaría otra que borra la tabla de
reservas. Afirma que el sistema lo trata como lo que es, un nombre raro, y lo guarda tal cual. La
segunda intenta una **suplantación**: otra persona hace tres reservas usando el RUT de Ana —el sistema
permite tres por semana a cada RUT— y después Ana intenta reservar.

```text
E       assert 409 == 201
FAILED test_seguridad.py::test_otra_persona_no_puede_agotar_la_cuota_de_ana - assert 409 == 201
1 failed, 1 passed, 1 warning in 1.06s
```

La inyección no prospera: el nombre quedó guardado como texto, y la tabla sigue ahí. La suplantación
sí: **Ana no puede reservar, porque alguien gastó su cuota con su RUT**. La API acepta cualquier RUT
sin comprobar que quien lo escribe sea su dueño. Es una falla de **autenticidad** en ISO/IEC
25010:2023, y cae en la categoría **A07:2025, fallas de autenticación**: el sistema reconoce como
legítimo a alguien que no lo es.

Esta prueba no se arregla con una línea, como la condición de carrera del bloque anterior. Para que el
sistema sepa quién es quién, alguien tiene que decidir **cómo** se identifican las personas —con la
cuenta institucional, con un código enviado al correo, con otro mecanismo—, y esa es una decisión de
requisito, no de código. Mientras se toma, la prueba queda en rojo, y ese rojo informa: dice
exactamente qué puede hacer hoy cualquiera con el RUT de otra persona.

### 2.3 Una herramienta que revisa el código: `bandit`

`bandit` es un **analizador estático de seguridad** para Python: lee el código sin ejecutarlo y
señala patrones que suelen ser inseguros. Sobre los cuatro archivos de la aplicación:

```bash
uv run --with bandit bandit api.py almacen.py reservas.py sala.py
```

```text
>> Issue: [B608:hardcoded_sql_expressions] Possible SQL injection vector through string-based query construction.
   Severity: Medium   Confidence: Medium
   CWE: CWE-89 (https://cwe.mitre.org/data/definitions/89.html)
   Location: .\almacen.py:26:10
25	    conexion.execute(
26	        f"INSERT INTO reservas ({columnas}) VALUES ({marcas})", tuple(campos.values())
27	    )
```

En español: *posible vía de inyección SQL por construir la consulta a partir de texto; severidad
media, confianza media.* **CWE-89** es el identificador de ese tipo de debilidad en el catálogo común
de debilidades de software. Y la línea señalada es real: `guardar` arma la instrucción `INSERT`
pegando dentro del texto los nombres de las columnas.

Un hallazgo de una herramienta es una hipótesis, igual que el de un agente. Para saber si es
explotable hay que mirar **de dónde viene** lo que se pega en el texto:

- Los **valores** —el nombre, el RUT— no se pegan: viajan aparte, en `tuple(campos.values())`, y en la
  instrucción solo aparece un signo `?` por cada uno. Es lo que la prueba de inyección de 2.2 acaba de
  confirmar: el nombre con código SQL quedó guardado como texto.
- Los **nombres de las columnas** sí se pegan, pero salen de los argumentos con que el propio código
  llama a `guardar` —`bloque=`, `rut=`, `nombre=`, `correo_electronico=`—, no de lo que envía una
  persona. Se intentó igual: una solicitud con un campo extra llamado `bloque) VALUES (1); --`. La
  API respondió `201`, guardó la reserva normal y descartó el campo extra, porque la validación de la
  solicitud solo acepta los cinco campos declarados.

El veredicto: **no es explotable hoy**. Pero `bandit` señaló un diseño frágil. Si alguien, mañana,
llamara a `guardar` con nombres de campos que vienen de una solicitud, la inyección pasaría a ser
real. Hay dos salidas honestas: reescribir `guardar` con las columnas fijas, o marcar la línea como
revisada, con un comentario `# nosec B608` que diga **por qué** es segura. Lo que no es honesto es
silenciarla sin explicación: la próxima persona que la lea no sabrá si alguien la revisó.

### 2.4 Una herramienta que revisa las dependencias: `pip-audit`

El proyecto usa código que no escribió: FastAPI, Pydantic, uvicorn y las bibliotecas de las que ellas
dependen. Si una de esas piezas tiene una vulnerabilidad conocida, el sistema la hereda. Es la
categoría **A03:2025, fallas en la cadena de suministro de software**. `pip-audit` compara cada
dependencia y su versión contra una base pública de vulnerabilidades conocidas:

```bash
uv export --no-dev --format requirements-txt --no-hashes -o req-prod.txt
uv run --with pip-audit pip-audit -r req-prod.txt
```

El primer comando escribe la lista exacta de dependencias de producción con sus versiones; el segundo
la audita.

```text
No known vulnerabilities found
```

*No se encontraron vulnerabilidades conocidas.* La frase dice exactamente lo que dice: ninguna de esas
versiones tiene, **hoy**, una vulnerabilidad registrada. Para ver cómo se ve un hallazgo, la misma
auditoría sobre una versión antigua de FastAPI, la 0.65.1:

```text
Found 21 known vulnerabilities in 2 packages
Name      Version ID              Fix Versions
--------- ------- --------------- ------------
fastapi   0.65.1  PYSEC-2021-100  0.65.2
fastapi   0.65.1  PYSEC-2021-100  0.65.2
fastapi   0.65.1  PYSEC-2024-38   0.109.1
starlette 0.14.2  PYSEC-2023-48   0.25.0
```

Cada fila es una vulnerabilidad conocida: el paquete, la versión instalada, el identificador de la
vulnerabilidad y la primera versión que la corrige. Algunas aparecen dos veces porque la base las
registra con más de un identificador. Dieciocho de las veintiuna están en Starlette, que FastAPI
trae consigo: el proyecto nunca la pidió y la hereda igual.

Que la auditoría del proyecto esté en verde hoy no dice nada de mañana. Una vulnerabilidad nueva se
publica sobre una versión que ya estaba instalada, sin que nadie toque el proyecto. Por eso esta
prueba no se ejecuta una vez: se ejecuta cada vez que cambia algo, y también cuando no cambia nada. Es
una de las razones por las que existe la **integración continua**, la práctica de ejecutar las pruebas
automáticamente cada vez que alguien sube un cambio, el tema de la sesión de mañana a las
11:00.

### 2.5 Cuando una prueba de seguridad está en rojo

La prueba de suplantación está en rojo en la máquina de quien desarrolla, con datos inventados. Nadie
fue afectado todavía. Ese es el mejor momento para encontrar una falla de seguridad, y el motivo por
el que se prueba. La ley describe lo que corresponde cuando el mismo defecto llega a funcionar en el
sistema real. Primero, el deber de prevenir:

> «Artículo 14 quinquies.- Deber de adoptar medidas de seguridad. El responsable de datos debe adoptar
> las medidas necesarias para resguardar el cumplimiento del principio de seguridad establecido en
> esta ley, considerando el estado actual de la técnica y los costos de aplicación, junto con la
> naturaleza, alcance, contexto y fines del tratamiento, así como la probabilidad de los riesgos y la
> gravedad de sus efectos en relación con el tipo de datos tratados.»

Y después, el deber de reportar si algo falla:

> «Artículo 14 sexies.- Deber de reportar las vulneraciones a las medidas de seguridad. El
> responsable deberá reportar a la Agencia, por los medios más expeditos posibles y sin dilaciones
> indebidas, las vulneraciones a las medidas de seguridad que ocasionen la destrucción, filtración,
> pérdida o alteración accidental o ilícita de los datos personales que trate o la comunicación o
> acceso no autorizados a dichos datos, cuando exista un riesgo razonable para los derechos y
> libertades de los titulares.»

La **Agencia** es la Agencia de Protección de Datos Personales que crea la ley, y los **titulares**
son las personas a quienes pertenecen los datos. El mismo artículo exige registrar cada comunicación:
qué pasó, sus efectos, qué datos y cuántas personas afectó, y qué se hizo. Y la ley califica como
infracción **grave**, en su artículo 34 ter letra j, *vulnerar o infringir las obligaciones de
seguridad en el tratamiento de los datos personales establecidas en el artículo 14 quinquies*.

Para quien prueba, esto tiene una traducción práctica. El artículo 14 quinquies pide medidas acordes
con «el estado actual de la técnica»: una prueba de seguridad que existe, se ejecuta y queda
registrada es evidencia de que esas medidas se buscaron. Y una prueba en rojo que se conoce y se deja
así, sin decisión y sin registro, es evidencia de lo contrario.

## Ejercicio del bloque

Sobre el proyecto propio, en tu propia máquina.

1. **Escribe una prueba de seguridad** en la que actúe alguien que intenta hacer lo que no debería:
   usar un dato de otra persona, enviar un texto que parezca código, pedir algo que no le corresponde.
   Ejecútala y anota el resultado literal.
2. **Ejecuta `bandit`** sobre el código de tu aplicación. Por cada hallazgo, decide si es explotable
   mirando de dónde viene lo que señala, y escribe el veredicto en una línea.
3. **Ejecuta `pip-audit`** sobre las dependencias de producción y anota el resultado literal.
4. **Clasifica** cada hallazgo confirmado en una categoría del OWASP Top 10:2025.

**Pista:** para decidir si un hallazgo de `bandit` es explotable, sigue el dato hacia atrás hasta su
origen. Si en algún punto del camino lo escribe una persona, el hallazgo es serio; si todo el camino
está escrito en tu código, probablemente no lo es hoy.

**Evidencia esperada:** una prueba de seguridad con su resultado, los hallazgos de `bandit` con su
veredicto, la salida de `pip-audit`, y la clasificación en el OWASP Top 10:2025.

## Preguntas guía

1. `bandit` señaló una posible inyección SQL y la prueba de inyección pasó. Un compañero propone
   agregar `# nosec` a la línea y seguir. ¿Qué le falta a esa decisión?

   **Pista:** revisa qué parte de la instrucción sí se arma pegando texto. Pregúntate qué necesitaría
   saber la próxima persona que lea esa línea.

2. `pip-audit` informó que no hay vulnerabilidades conocidas. ¿Se puede escribir en el informe que las
   dependencias del proyecto son seguras?

   **Pista:** relee la frase exacta de la herramienta. Pregúntate qué pasa con esa frase el día que se
   publique una vulnerabilidad nueva sobre una versión que ya está instalada.

3. La prueba de suplantación está en rojo y la corrección exige decidir cómo se identifican las
   personas. ¿Qué debería pasar con esa prueba mientras nadie decide?

   **Pista:** compara este rojo con el de la prueba inestable de la mañana. Pregúntate cuál informa algo
   sobre el sistema, y qué dice el artículo 14 quinquies sobre las medidas que se conocen y no se
   toman.

## Fuentes técnicas del bloque

- [ISO/IEC 25010:2023, vista previa de la publicación](https://cdn.standards.iteh.ai/samples/78176/13ff8ea97048443f99318920757df124/ISO-IEC-25010-2023.pdf) — el prólogo, que agrega la resistencia como subcaracterística de la seguridad.
- [OWASP Top 10:2025](https://top10.owasp.org/2025) — las diez categorías de la edición vigente, con sus códigos y nombres.
- [Ley 21.719](https://www.bcn.cl/leychile/navegar?idNorma=1209601) — artículo 3°, letra f, el principio de seguridad; artículo 14 quinquies, el deber de adoptar medidas de seguridad; artículo 14 sexies, el deber de reportar las vulneraciones; y artículo 34 ter, letra j, la infracción grave; citados literalmente.
- [Bandit — documentación](https://bandit.readthedocs.io/) — el analizador estático de seguridad para Python y su prueba B608 sobre consultas SQL construidas a partir de texto.
- [CWE-89](https://cwe.mitre.org/data/definitions/89.html) — la debilidad de inyección SQL en el catálogo común de debilidades.
- [pip-audit](https://github.com/pypa/pip-audit) — la auditoría de dependencias de Python contra bases públicas de vulnerabilidades conocidas.
- Ejecuciones registradas para esta clase sobre el proyecto de reserva de laboratorio, con Python 3.13.11, bandit 1.9.4 y pip-audit 2.10.1: las dos pruebas de seguridad, con la inyección en verde y la suplantación en rojo; el hallazgo B608 de `bandit` y los dos intentos de explotarlo por la API, sin éxito; la auditoría de las dependencias de producción sin vulnerabilidades conocidas; y la auditoría de FastAPI 0.65.1 con 21 vulnerabilidades conocidas en 2 paquetes.

---

# BLOQUE 3: Para quién sirve y dónde corre

- **Duración:** 25 minutos
- **Objetivo del bloque:** revisar la accesibilidad de la interfaz con una herramienta automática
  contra las pautas WCAG 2.2, reconocer qué parte de la accesibilidad esa herramienta no puede ver, y
  comprobar que el sistema funciona igual en otros navegadores y en otra versión de Python. Al
  finalizar, el estudiante debe poder escribir una prueba de accesibilidad con `axe-core` sobre
  Playwright, elegir el estado de la página que conviene revisar, y ejecutar su suite en más de un
  entorno.
- **Modalidad:** exposición con ejecución en vivo sobre el proyecto, y registro escrito individual.
- **Ritmo sugerido:** 4 minutos para las pautas, 8 para la revisión automática y su hallazgo, 6 para lo
  que la herramienta no ve, y 7 para la portabilidad.

## Desarrollo

### 3.1 La accesibilidad, en la norma y en las pautas

Una interfaz **accesible** es una que pueden usar personas que no ven la pantalla, que la ven con
poco contraste o ampliada, que no usan un mouse, o que la recorren con un **lector de pantalla**, el
programa que lee en voz alta lo que aparece. ISO/IEC 25010:2023 dividió la antigua accesibilidad en
dos subcaracterísticas de la capacidad de interacción, según su prólogo: la **inclusividad**, que la
puedan usar personas diversas, y la **asistencia al usuario**, que la persona reciba ayuda para
usarla.

La norma dice qué característica está en juego. Cómo se comprueba lo dicen las **WCAG**, las pautas de
accesibilidad para el contenido web que publica el W3C, el consorcio que define los estándares de la
web. Su versión 2.2 organiza la accesibilidad en **criterios de conformidad** comprobables, cada uno con
un nivel: A es lo mínimo, AA es lo que exige la mayoría de las normativas, y AAA es lo más estricto.
Uno de los criterios AA es el que importa en este bloque:

> "The visual presentation of text and images of text has a contrast ratio of at least 4.5:1, except
> for the following…"
>
> — WCAG 2.2, criterio 1.4.3, Contraste (mínimo), nivel AA

En español: *la presentación visual del texto tiene una relación de contraste de al menos 4,5 a 1*,
con excepciones que siguen en el criterio, como el texto grande, que exige 3 a 1. La **relación de
contraste** compara lo claro del texto con lo claro del fondo: 1 a 1 es texto invisible, del mismo color
que el fondo, y 21 a 1 es negro sobre blanco. Es un criterio con magnitud, método y umbral ya escritos
—exactamente lo que la sesión de esta mañana pedía para «se entiende»—, y por eso una herramienta lo
puede comprobar sola.

### 3.2 Una revisión automática con `axe-core`

`axe-core` es una biblioteca que recorre una página y comprueba las reglas de las WCAG que se pueden
verificar sin una persona. `@axe-core/playwright` la conecta con Playwright, así que la revisión se
escribe como una prueba más:

```typescript
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const PAUTAS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

test.beforeEach(async ({ request }) => {
  await request.post("/_prueba/reiniciar");
});

test("con un bloque tomado, la página no tiene fallas de accesibilidad detectables", async ({ page, request }) => {
  await request.post("/reservas", {
    data: {
      nombre: "Ana Rivas",
      rut: "11.111.111-1",
      correo_electronico: "ana.rivas@ejemplo.cl",
      bloque: 4,
      personas: 12,
    },
  });
  await page.goto("/");
  await expect(page.getByRole("listitem").filter({ hasText: "Bloque 4" })).toContainText("Tomado");

  const resultado = await new AxeBuilder({ page }).withTags(PAUTAS).analyze();

  expect(resultado.violations.map((v) => v.id)).toEqual([]);
});
```

| Pieza | Qué hace |
|---|---|
| `PAUTAS` | Las etiquetas de las reglas que se revisan: los niveles A y AA de las WCAG 2.0, 2.1 y 2.2. |
| `request.post("/reservas", ...)` | Reserva el bloque 4 directamente por la API, sin pasar por el formulario, para que la página tenga una ficha «Tomado». |
| `new AxeBuilder({ page }).withTags(PAUTAS).analyze()` | Recorre la página tal como está en ese momento y devuelve lo que encontró. |
| `resultado.violations.map((v) => v.id)` | La lista de reglas que no se cumplen, por su identificador. La prueba afirma que está vacía. |

La primera versión de esta prueba revisaba la página recién abierta, sin reservas, y **pasó**. La
herramienta comprobó 24 reglas y no encontró ninguna falla. Pero en ese estado todos los bloques están
libres, y la página que ve una persona a media mañana no es esa. La misma revisión, con un bloque
tomado:

```text
Error: expect(received).toEqual(expected) // deep equality
- Expected  - 1
+ Received  + 3
- Array []
+ Array [
+   "color-contrast",
+ ]
```

El detalle que entrega la herramienta para esa regla:

```text
Element has insufficient color contrast of 2.55 (foreground color: #ffffff, background color: #9aa3ad,
font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 4.5:1
```

En español: *el elemento tiene un contraste insuficiente de 2,55 a 1 (texto blanco sobre fondo gris
`#9aa3ad`, de 16 píxeles y peso normal); se esperaba 4,5 a 1.* Es la ficha de un bloque tomado: el
texto «Bloque 4» y la palabra «Tomado», en blanco sobre un gris claro. Para una persona con baja visión,
o para cualquiera frente a una pantalla con reflejo, esa ficha es difícil de leer, y es justo la que
dice que el bloque no está disponible.

Una revisión automática revisa **el estado que se le muestra**. La página tiene tantos estados como
situaciones: sin reservas, con reservas, con un mensaje de error, con uno de confirmación. Una prueba
de accesibilidad que solo abre la página vacía está comprobando la versión que casi nadie ve.

La corrección es de una línea, en la hoja de estilos. El gris de la ficha tomada pasa a otro gris que
la interfaz ya usaba para los textos secundarios:

```css
--tomado: #5b6878;
```

Con ese fondo, el contraste del texto blanco, calculado con la fórmula de las WCAG, es de 5,68 a 1, y la prueba pasa en los tres navegadores
de la sección 3.4.

### 3.3 Lo que la herramienta no ve

Quienes desarrollan `axe-core` son explícitos sobre su alcance:

> "With axe-core, you can find on average 57% of WCAG issues automatically."
>
> — axe-core, documentación del proyecto

En español: *con axe-core se puede encontrar, en promedio, el 57 % de los problemas de las WCAG de
forma automática.* El resto necesita a una persona. Dos pruebas sobre esta misma interfaz muestran
dónde está el límite.

**La herramienta no sabe si un texto significa algo.** Con la página mostrando el `[object Object]`
del bloque 1 —la persona dejó vacío el campo de personas y la pantalla le respondió con una etiqueta
genérica—, la misma revisión de `axe-core` encontró **cero** violaciones. El mensaje está en un párrafo
con `role="status"` y `aria-live="polite"`, dos atributos que le avisan a un lector de pantalla que
debe leerlo en voz alta cuando cambia; el contraste del texto rojo cumple; la estructura es correcta.
Lo que el lector de pantalla va a leer en voz alta es la etiqueta `[object Object]`. Ninguna regla automática puede
saber que eso no le sirve a nadie.

**La herramienta no recorre la página como una persona.** El criterio 2.1.1 de las WCAG, de nivel A,
exige que toda la funcionalidad se pueda operar con el teclado. `axe-core` revisa algunas condiciones
que lo favorecen, pero no intenta completar una reserva sin mouse. Eso lo hace una prueba escrita:

```typescript
test("una reserva se completa solo con el teclado", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("listitem")).toHaveCount(8);

  await page.keyboard.press("Tab");
  await page.keyboard.type("Ana Rivas");
  await page.keyboard.press("Tab");
  await page.keyboard.type("11.111.111-1");
  await page.keyboard.press("Tab");
  await page.keyboard.type("ana.rivas@ejemplo.cl");
  await page.keyboard.press("Tab");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Tab");
  await page.keyboard.type("12");
  await page.keyboard.press("Enter");

  await expect(page.getByRole("status")).toContainText("Reserva confirmada");
  await expect(page.getByRole("listitem").filter({ hasText: "Bloque 4" })).toContainText("Tomado");
});
```

`page.keyboard.press("Tab")` mueve el foco al siguiente campo, como la tecla Tab; `ArrowDown` baja una
opción en el selector de bloque, de 1 a 4 con tres pulsaciones; y `Enter` envía el formulario. La
prueba pasa: la reserva se completa sin tocar el mouse. Es un resultado positivo, y vale registrarlo
igual que uno negativo: ahora está **comprobado**, no supuesto.

La interfaz ya resolvía bien otra pieza que ninguna herramienta pide de forma evidente: el mensaje
tiene `role="status"`, así que un lector de pantalla lo anuncia sin que la persona tenga que buscarlo,
que es lo que exige el criterio 4.1.3 de las WCAG sobre los mensajes de estado. Lo que el mensaje dice
—y si le sirve a quien lo escucha— sigue siendo un asunto de requisito, como estableció el bloque 4 de
la mañana.

### 3.4 La misma suite en otros entornos

La última pregunta del bloque es dónde corre el sistema. ISO/IEC 25010:2023 la trata dentro de la
**flexibilidad**, que reemplazó a la antigua portabilidad y reúne la capacidad de un producto de
adaptarse a otros entornos, de instalarse, de reemplazar a otro y, desde 2023, de escalar.

La interfaz la usa cada persona con su propio navegador. Playwright puede ejecutar las mismas pruebas
con los tres motores principales: **Chromium**, el de Chrome y Edge; **Firefox**; y **WebKit**, el
motor de Safari. Se declaran como **proyectos** en la configuración, y cada prueba corre una vez por
proyecto:

```typescript
projects: [
  { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  { name: "firefox", use: { ...devices["Desktop Firefox"] } },
  { name: "webkit", use: { ...devices["Desktop Safari"] } },
],
```

`devices` trae configuraciones ya definidas de cada navegador, como el tamaño de la ventana. Firefox y
WebKit se instalan una vez con `npx playwright install firefox webkit`. La suite de extremo a extremo
completa, con las pruebas de la mañana y las dos de este bloque, en los tres:

```text
  x   6 [chromium] › pruebas\reserva.spec.ts:20:5 › si falta un dato, la pantalla dice cuál corregir (6.0s)
  x  13 [firefox] › pruebas\reserva.spec.ts:20:5 › si falta un dato, la pantalla dice cuál corregir (6.4s)
  x  20 [webkit] › pruebas\reserva.spec.ts:20:5 › si falta un dato, la pantalla dice cuál corregir (6.0s)
  3 failed
  18 passed (1.1m)
```

Las mismas seis pruebas por navegador, y el mismo resultado en los tres. La única que falla es la del
`[object Object]`, y en los tres navegadores recibe exactamente el mismo texto. Del lado del servidor,
la suite de `pytest` —las 20 pruebas de siempre, la de concurrencia del bloque 1 y las dos de seguridad
del bloque 2— se ejecutó con dos versiones de Python:

```bash
uv run pytest -q
uv run --python 3.12 --isolated pytest -q
```

`--python 3.12` le pide a `uv` que use esa versión, y `--isolated` que arme un entorno aparte para no
mezclarla con el del proyecto. Con Python 3.13.11 y con Python 3.12.12, el mismo resultado:

```text
1 failed, 22 passed, 1 warning
```

La que falla en las dos es la prueba de suplantación del bloque 2.

Que la portabilidad no haya encontrado nada nuevo **es un resultado**, y tiene dos lecturas útiles. La
primera: que el sistema funciona en Firefox, en WebKit y en Python 3.12 ya no es una suposición, está
comprobado. La segunda es más fina: cuando una prueba falla **igual en todos los entornos**, el defecto
es del sistema, no del entorno. Si la del `[object Object]` hubiera fallado solo en WebKit, la
pregunta habría sido otra.

Queda un límite que conviene declarar. El WebKit que instala Playwright es el motor de Safari, no Safari
en un Mac ni en un iPhone; pasar en él reduce mucho el riesgo, pero no lo elimina. Como en el bloque 1,
un resultado vale para las condiciones en que se obtuvo.

## Ejercicio del bloque

Sobre el proyecto propio. Si tu proyecto no tiene interfaz web, haz solo los puntos 3 y 4.

1. **Escribe una prueba de accesibilidad con `axe-core`** y ejecútala sobre al menos dos estados de tu
   interfaz: el inicial y uno que aparezca después de usarla. Anota las reglas que fallen.
2. **Escribe una prueba que complete la tarea principal solo con el teclado**, y anota si pasa.
3. **Ejecuta tu suite en al menos dos entornos**: dos navegadores, o dos versiones de Python con
   `uv run --python`. Anota los dos resultados literales.
4. **Compara**: si algún resultado cambia entre entornos, escribe en una línea qué cambió y a qué lo
   atribuyes; si no cambia nada, escribe qué quedó comprobado.

**Pista:** para encontrar el estado de tu interfaz que conviene revisar, piensa en lo que ve una
persona a mitad de uso, no al abrir la página: una lista con datos, un mensaje de error, una
confirmación, un elemento deshabilitado.

**Evidencia esperada:** la prueba de accesibilidad con sus resultados en dos estados, la prueba de
teclado, y la suite ejecutada en dos entornos con su comparación.

## Preguntas guía

1. La revisión de accesibilidad pasó con la página recién abierta y falló con un bloque tomado. Un
   compañero dice que la primera versión de la prueba estaba bien, porque encontró lo que había.
   ¿Tiene razón?

   **Pista:** revisa qué fichas había en la página cuando pasó. Pregúntate qué parte de la interfaz no
   estaba en pantalla para que la herramienta la revisara.

2. Con `[object Object]` en pantalla, `axe-core` encontró cero violaciones. ¿Significa que ese mensaje
   es accesible?

   **Pista:** separa lo que la herramienta revisó —contraste, estructura, atributos— de lo que un lector
   de pantalla le va a leer a la persona. Pregúntate cuál de las dos cosas decide si la persona logra
   reservar.

3. La suite dio el mismo resultado en tres navegadores y dos versiones de Python. ¿Valió la pena
   ejecutarla cinco veces si no encontró nada nuevo?

   **Pista:** compara «funciona en Firefox» antes y después de ejecutar la suite en Firefox.
   Pregúntate también qué dice que la misma prueba falle igual en todos los entornos.

## Fuentes técnicas del bloque

- [ISO/IEC 25010:2023, vista previa de la publicación](https://cdn.standards.iteh.ai/samples/78176/13ff8ea97048443f99318920757df124/ISO-IEC-25010-2023.pdf) — el prólogo: la accesibilidad dividida en inclusividad y asistencia al usuario, y la portabilidad reemplazada por la flexibilidad, que incorpora la escalabilidad.
- [WCAG 2.2, Recomendación del W3C, versión del 12 de diciembre de 2024](https://www.w3.org/TR/WCAG22/) — el criterio 1.4.3 de contraste mínimo, citado literalmente; el criterio 2.1.1 de operación con teclado; y el criterio 4.1.3 de mensajes de estado.
- [axe-core — repositorio y documentación](https://github.com/dequelabs/axe-core) — la cifra del 57 % de problemas detectables automáticamente, citada literalmente.
- [@axe-core/playwright](https://www.npmjs.com/package/@axe-core/playwright) — la integración de axe-core con Playwright y la clase `AxeBuilder`.
- [Playwright — proyectos y navegadores](https://playwright.dev/docs/test-projects) — la configuración de proyectos para ejecutar la misma suite con Chromium, Firefox y WebKit.
- [uv — versiones de Python](https://docs.astral.sh/uv/guides/install-python/) — la opción `--python` para ejecutar con otra versión.
- Ejecuciones registradas para esta clase sobre el proyecto de reserva de laboratorio, con Playwright 1.63.0, `@axe-core/playwright` y `axe-core` 4.13.0, y WebKit 26.6: la revisión de accesibilidad sin fallas en la página recién abierta y con la falla de contraste de 2,55 a 1 con un bloque tomado; la misma revisión en verde tras la corrección; cero violaciones con `[object Object]` en pantalla; la prueba de teclado en verde en los tres navegadores; la suite de extremo a extremo con `18 passed` y `3 failed` en tres navegadores; y la suite de `pytest` con el mismo resultado en Python 3.13.11 y 3.12.12.

---

# BLOQUE 4: Un requisito sin umbral no se prueba

- **Duración:** 20 minutos
- **Objetivo del bloque:** evaluar la auditoría no funcional que entrega un agente, verificando sus
  afirmaciones con ejecuciones, y convertir un hallazgo confirmado en una prueba con magnitud, método
  y umbral. Al finalizar, el estudiante debe poder clasificar cada afirmación de una auditoría como
  confirmada, refutada, no reproducida o dependiente del requisito, y reconocer qué parte de una
  auditoría no se puede delegar.
- **Modalidad:** lectura de una auditoría producida por un agente, y verificación en vivo de sus
  hallazgos.
- **Ritmo sugerido:** 4 minutos para el pedido y lo que devolvió, 9 para la verificación, 4 para la
  corrección que dejó un defecto nuevo, y 3 para los umbrales y el ejercicio.

## Desarrollo

### 4.1 El pedido y lo que devolvió

Se le entregó a un agente el proyecto **tal como estaba al comenzar esta sesión** —con la condición de
carrera, la falla de contraste y la suplantación todavía presentes, y sin ninguna de las pruebas
nuevas— y se le pidió una auditoría no funcional. Con permiso solo para leer:

```bash
claude -p "Eres auditor de calidad de software. Revisa este proyecto, una API de reservas de
laboratorio hecha con FastAPI y SQLite, con una interfaz web en la carpeta interfaz. Entrega una
auditoria NO FUNCIONAL del proyecto: rendimiento y capacidad, seguridad, accesibilidad de la
interfaz, portabilidad y mantenibilidad.

Para cada hallazgo indica: la caracteristica de ISO/IEC 25010:2023 a la que corresponde, la
evidencia (archivo y linea), la severidad (alta, media o baja), y un requisito verificable con
magnitud, metodo de medicion y umbral.

Solo puedes leer archivos; no puedes ejecutar nada. Al final, declara que afirmaciones hiciste sin
poder comprobarlas." --allowed-tools "Read,Grep,Glob"
```

`claude -p` le entrega el pedido al agente y espera su respuesta, y `--allowed-tools "Read,Grep,Glob"`
le permite solo leer y buscar en los archivos. El pedido va sin tildes porque se escribió así en la
terminal; el agente respondió en español correcto.

Devolvió una auditoría de **28 hallazgos** en cinco áreas, seis de ellos de severidad alta, cada uno con
su característica de la norma, su evidencia con archivo y línea, y un requisito con magnitud, método y
umbral. Terminó con una lista de **diez afirmaciones que declaró no haber podido comprobar**: los
contrastes, que calculó a mano; el `[object Object]`, que dedujo de cómo FastAPI forma los errores sin
verlo en pantalla; la doble reserva, que infirió del código; y los umbrales de tiempo, que presentó como
«valores de referencia propuestos, no mediciones».

Es una buena auditoría, y hay que decirlo con la misma claridad con que se dirían sus errores. Leyendo,
sin ejecutar nada, encontró las cuatro cosas que esta sesión y la de la mañana encontraron ejecutando:
la condición de carrera del bloque 1, la suplantación del bloque 2, el contraste del bloque 3 —lo estimó
en 2,6 a 1; medido, fue 2,55— y el `[object Object]` de la mañana. Y trajo hallazgos que nadie había
hecho.

### 4.2 Afirmación por afirmación

Una auditoría, como la exploración de la mañana, es una lista de hipótesis. Se tomaron los hallazgos
que se podían comprobar en el tiempo de la sesión y se ejecutó cada uno:

| Hallazgo del agente | Cómo se verificó | Veredicto |
|---|---|---|
| Carrera entre consultar e insertar: doble reserva | Veinte reservas simultáneas, bloque 1 | **Confirmado** |
| Sin autenticación: se reserva con cualquier RUT | Prueba de suplantación, bloque 2 | **Confirmado** |
| Contraste de la ficha «Tomado» | `axe-core`, bloque 3 | **Confirmado** (2,55 a 1) |
| Errores 422 como `[object Object]` | Prueba de la mañana | **Confirmado** |
| El RUT no se normaliza: se salta el límite de 3 | Cuatro reservas con el mismo RUT escrito distinto | **Confirmado**, nuevo |
| El botón queda deshabilitado ante una falla de red | Prueba con la red cortada | **Confirmado**, nuevo |
| El diseño no se adapta a 320 píxeles | Prueba con una ventana de 320 píxeles | **Confirmado**, nuevo |
| El borde de los campos tiene contraste 1,4 a 1 | Cálculo con la fórmula de las WCAG: 1,42 a 1 | **Confirmado**, nuevo |
| La dependencia `httpx2` es un error de tipeo o un paquete malicioso | Consulta a PyPI, el repositorio público de paquetes de Python, y a las dependencias de Starlette | **Refutado** |
| Escrituras simultáneas producen errores 500 por base bloqueada | Todas las tandas de carga y estrés del bloque 1 | **No reproducido** |

Los confirmados nuevos, con su evidencia:

- **El RUT se compara como texto.** `11.111.111-1`, `11111111-1`, `11111111-1 ` y `11.111.111-1 ` —el
  mismo RUT, con y sin puntos, con y sin un espacio al final— se contaron como cuatro personas: las
  cuatro reservas respondieron `201`, sobre un límite de tres por RUT.
- **El diseño no se adapta a una pantalla angosta.** Con una ventana de 320 píxeles de ancho, la página
  midió **514**: para ver el formulario completo hay que desplazarse hacia los lados. Las WCAG 2.2 lo
  exigen en el criterio 1.4.10, *Reflow*, de nivel AA: el contenido se debe poder presentar sin
  desplazamiento en dos direcciones a un ancho equivalente a 320 píxeles.
- **El borde de los campos casi no se ve.** El gris `#d4d9df` sobre blanco tiene un contraste de 1,42 a
  1, y el criterio 1.4.11 de las WCAG pide 3 a 1 para lo que identifica a un componente de la
  interfaz. `axe-core` no lo detectó porque no revisa el contraste de los bordes: es otro ejemplo de lo
  que la herramienta del bloque 3 no ve.

La **refutación** es la más instructiva. El agente señaló `httpx2` como «probable error o
*typosquatting*», el ataque que publica un paquete malicioso con un nombre parecido al de uno legítimo.
Es una sospecha razonable —el paquete conocido se llama `httpx`— y fue honesto al declarar que no
verificó en PyPI si existía. La verificación tomó un minuto: `httpx2` lo publica Tom Christie, el autor
de `httpx`; su código está en el repositorio de la organización Pydantic; y la propia Starlette, que
FastAPI usa por debajo, lo declara entre sus dependencias. Una afirmación de seguridad sobre una
dependencia se resuelve mirando la fuente, no el nombre.

El **no reproducido** también enseña. El agente dedujo del código que las escrituras simultáneas
producirían errores 500 porque la conexión «no configura `timeout`». En ninguna de las diez tandas del
bloque 1, con hasta 2.000 usuarios, apareció un solo error 500; las fallas con 2.000 fueron conexiones
cortadas, no la base bloqueada. Y la premisa era inexacta: la conexión de Python a SQLite espera 5
segundos por omisión aunque nadie lo configure. La deducción era plausible, y la ejecución no la
confirmó.

Quedan hallazgos que ninguna ejecución resuelve. El agente señaló que el sistema no guarda la fecha
de las reservas y que, por lo tanto, solo admite ocho reservas en toda su vida; que el comprobante
—el texto de confirmación que la API devuelve al aceptar una reserva—
devuelve el RUT y el correo completos; y propuso un límite de 10 reservas por minuto por dirección.
Los tres son reales o razonables, y los tres **dependen del requisito**: cuántos días se reservan,
qué datos necesita ver la persona en su comprobante —la Ley 21.719 pide, en su principio de
proporcionalidad, tratar solo los datos necesarios para el fin—, y cuántos intentos por minuto son
un uso normal.

### 4.3 La corrección que dejó un defecto nuevo

De los confirmados nuevos, uno tiene una historia que conviene contar entera. El botón que queda
deshabilitado ante una falla de red **no estaba en el sistema original**: lo introdujo la corrección
del doble clic de la sesión de esta mañana. Esa corrección deshabilita el botón al enviar y lo vuelve
a habilitar al final del manejador. Si la solicitud falla por la red, `fetch` lanza un error, el
manejador se interrumpe antes de llegar al final, y el botón queda deshabilitado para siempre: la
persona no puede volver a intentar sin recargar la página.

Las pruebas del doble clic no lo vieron porque ninguna corta la red. El hallazgo se convierte en una
prueba con sus tres piezas:

| Pieza | Valor |
|---|---|
| **Magnitud** | El estado del botón «Reservar» después de una solicitud fallida |
| **Método** | Cortar la red de la página con Playwright antes de enviar, y leer el estado del botón |
| **Umbral** | El botón vuelve a estar habilitado |

```typescript
test("si la red falla, el botón vuelve a quedar disponible", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("listitem")).toHaveCount(8);
  await page.route("**/reservas", (ruta) => ruta.abort());

  await page.getByLabel("Nombre").fill("Ana Rivas");
  await page.getByLabel("RUT").fill("11.111.111-1");
  await page.getByLabel("Correo electrónico").fill("ana.rivas@ejemplo.cl");
  await page.getByLabel("Bloque", { exact: true }).selectOption("4");
  await page.getByLabel("Personas").fill("12");
  await page.getByRole("button", { name: "Reservar" }).click();

  await expect(page.getByRole("button", { name: "Reservar" })).toBeEnabled();
});
```

`page.route("**/reservas", (ruta) => ruta.abort())` intercepta toda solicitud cuya dirección termine
en `/reservas` y la corta, como si la red se hubiera caído. Contra la interfaz tal como quedó en la
mañana:

```text
Error: expect(locator).toBeEnabled() failed
Expected: enabled
Received: disabled
```

La corrección envuelve la solicitud en un bloque que, pase lo que pase, rehabilita el botón al
terminar, y le dice a la persona qué ocurrió si la red falló:

```javascript
formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const boton = formulario.querySelector("button");
  if (boton.disabled) return;
  boton.disabled = true;
  const datos = Object.fromEntries(new FormData(formulario));

  try {
    const respuesta = await fetch("/reservas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });
    const cuerpo = await respuesta.json();

    if (respuesta.ok) {
      mensaje.className = "mensaje exito";
      mensaje.textContent = `Reserva confirmada. ${cuerpo.comprobante}`;
      formulario.reset();
      cargarBloques();
    } else {
      mensaje.className = "mensaje error";
      mensaje.textContent = cuerpo.detail;
    }
  } catch {
    mensaje.className = "mensaje error";
    mensaje.textContent = "No se pudo conectar con el sistema. Intenta de nuevo.";
  } finally {
    boton.disabled = false;
  }
});
```

`try` agrupa lo que puede fallar; `catch` se ejecuta si algo dentro de `try` lanza un error, como el
`fetch` sin red; y `finally` se ejecuta **siempre**, haya fallado o no, que es donde tiene que estar la
línea que rehabilita el botón. La prueba nueva y las dos del doble clic, en los tres navegadores:

```text
  9 passed (25.7s)
```

A un defecto que una corrección introduce en algo que antes funcionaba se le llama **regresión**. Esta
es particular: el sistema original no tenía el defecto porque tampoco deshabilitaba el botón. La
corrección arregló el doble clic y abrió un camino nuevo que nadie probó. Por eso las pruebas se
vuelven a ejecutar enteras después de cada cambio, y no solo la que motivó el cambio: el tema de
la sesión de integración continua.

### 4.4 Los umbrales del agente

Cada hallazgo de la auditoría traía un umbral: un p95 de 200 milisegundos, diez reservas por minuto
por dirección, una cobertura de ramas del 90 %. El agente los declaró como «valores de referencia
propuestos», y esa es exactamente su condición. Son razonables, están bien formulados, y ninguno salió
de un requisito: el agente no sabe cuántas personas usan el laboratorio, cuánto está dispuesta a
esperar una de ellas, ni cuánto intento de reserva es normal en una semana de evaluaciones.

La regla con que cerró la sesión de la mañana se aplica igual aquí. El agente puede proponer la
magnitud y el método, y los propone bien. El umbral es una decisión sobre lo que el sistema le debe a
quien lo usa, y la toma quien conoce el requisito.

## Ejercicio del bloque

Sobre el proyecto propio.

1. **Pide una auditoría no funcional a un agente**, con permiso solo de lectura, pidiéndole que declare
   al final lo que no pudo comprobar.
2. **Elige cinco hallazgos** y verifica cada uno con una ejecución, una consulta a la fuente o un
   cálculo. Clasifícalos: confirmado, refutado, no reproducido, o depende del requisito.
3. **Convierte un hallazgo confirmado en una prueba** con magnitud, método y umbral, y ejecútala.
4. **Revisa tus correcciones de la sesión**: por cada cambio que hiciste hoy, pregúntate qué camino
   nuevo abrió y si alguna prueba lo recorre.

**Pista:** para clasificar un hallazgo como «depende del requisito», pregúntate si podrías decidir el
umbral sin preguntarle a nadie. Si la respuesta honesta es no, el hallazgo es real pero su umbral no
es tuyo.

**Evidencia esperada:** la auditoría del agente, cinco hallazgos con su verificación y su veredicto,
una prueba nueva con su resultado, y la revisión de tus correcciones.

## Preguntas guía

1. El agente encontró leyendo lo mismo que la sesión encontró ejecutando, y más. ¿Para qué ejecutar
   entonces?

   **Pista:** mira qué pasó con `httpx2` y con los errores 500. Pregúntate qué habría quedado en el
   informe si se hubieran aceptado todas las afirmaciones sin ejecutarlas.

2. La corrección del doble clic pasó todas sus pruebas y dejó un defecto nuevo. ¿Fue una mala
   corrección?

   **Pista:** separa lo que la corrección arregló de lo que ninguna prueba recorría. Pregúntate qué
   prueba habría hecho falta para verlo esa misma mañana.

3. El agente propuso un límite de diez reservas por minuto por dirección. ¿Se puede escribir ya la
   prueba de ese requisito?

   **Pista:** la prueba se puede escribir. Pregúntate si el número diez es un requisito o una
   propuesta, y quién tendría que confirmarlo.

## Fuentes técnicas del bloque

- [WCAG 2.2, Recomendación del W3C](https://www.w3.org/TR/WCAG22/) — el criterio 1.4.10, *Reflow*, y el criterio 1.4.11, contraste de elementos que no son texto, los dos de nivel AA.
- [PyPI — httpx2](https://pypi.org/project/httpx2/) y [PyPI — Starlette 1.6.0](https://pypi.org/project/starlette/1.6.0/) — el autor y el repositorio de `httpx2`, y su presencia entre las dependencias declaradas de Starlette.
- [Python — módulo `sqlite3`](https://docs.python.org/3/library/sqlite3.html) — el plazo de espera por omisión de 5 segundos de `sqlite3.connect`.
- [Playwright — `page.route`](https://playwright.dev/docs/network) — la intercepción de solicitudes para simular una falla de red.
- Ley 21.719, artículo 3°, letra c, principio de proporcionalidad.
- Ejecuciones registradas para esta clase sobre el proyecto de reserva de laboratorio: la auditoría producida por `claude -p` con herramientas restringidas a lectura sobre el proyecto tal como estaba al comenzar la sesión, con 28 hallazgos y 10 afirmaciones declaradas sin comprobar; las cuatro reservas con el mismo RUT en cuatro formatos; la prueba de ventana de 320 píxeles, con 514 de ancho medido; la prueba de red cortada en rojo contra la interfaz de la mañana y en verde tras la corrección, con las del doble clic, en los tres navegadores.

---

# Cierre: lo que el sistema hace, y cómo lo hace

## 1. Lo que cada prueba no funcional puede afirmar

| Prueba | Qué puede afirmar | Qué no puede afirmar |
|---|---|---|
| **Carga** | Que el sistema responde dentro del umbral con la cantidad de personas prevista, en esas condiciones | Que lo que respondió sea correcto |
| **Estrés** | Dónde deja de cumplir y cómo falla, en esa máquina | El límite en otra máquina |
| **Seguridad escrita** | Que un ataque concreto no prospera, o que sí | Que no existan otros ataques |
| **`bandit` y `pip-audit`** | Qué patrones inseguros y qué vulnerabilidades conocidas hay hoy | Si un hallazgo es explotable, ni qué se publicará mañana |
| **`axe-core`** | Qué reglas automáticas no se cumplen en el estado revisado | Si los textos significan algo, ni lo que no revisa |
| **Portabilidad** | Que la suite da lo mismo en cada entorno probado | Nada sobre los entornos no probados |

La columna de la derecha no es una lista de defectos de las herramientas. Es lo que cada una necesita
que una persona complete.

## 2. La afirmación que se puede sostener

A lo que la mañana dejó defendible sobre la persona que usa la pantalla, esta sesión agrega una capa
sobre **cómo** se comporta el sistema:

> Con cien personas usando el sistema a la vez responde dentro del umbral que fijé antes de medir, y
> sé dónde deja de hacerlo en mi máquina. Dos reservas simultáneas del mismo bloque ya no se aceptan
> las dos, y lo comprobé con una prueba que falló diez de diez antes de la corrección. Sé qué ataque
> prospera hoy y tengo la prueba que lo muestra. La interfaz cumple las reglas automáticas de
> accesibilidad en el estado que ve una persona a media mañana, se puede usar solo con teclado, y
> funciona igual en tres navegadores y dos versiones de Python.

Lo que sigue sin poder afirmarse: cuáles de todos estos hallazgos había que atender primero. La sesión
dejó en rojo la suplantación, el `[object Object]` y la pantalla angosta, y en espera de un requisito
la fecha de las reservas, el comprobante con datos completos y el límite de intentos. Nadie ha decidido
en qué orden.

## 3. Ticket de salida

En tres líneas, antes de salir:

1. El umbral que fijaste para tu prueba de carga, y si lo escribiste antes o después de medir.
2. Un hallazgo de una herramienta —`bandit`, `pip-audit` o `axe-core`— que verificaste, con su
   veredicto.
3. Una afirmación de la auditoría del agente sobre tu sistema que resultó falsa o que no pudiste
   reproducir.

## 4. Próxima sesión: cuánto de todo esto vale la pena probar

Mañana a las 08:30 la sesión se ocupa del **plan de pruebas**: el documento donde se declara qué se
prueba, qué queda fuera y con qué criterio se reparte el esfuerzo. Conviene llegar con esta pregunta,
porque esta sesión la volvió concreta: entre la suplantación, la condición de carrera ya corregida, el
RUT sin normalizar, el botón bloqueado, la pantalla angosta y los 28 hallazgos del agente, **¿con qué
criterio se decide cuál probar primero, si no hay tiempo para todos?**

## Mensaje final

Todo lo que esta sesión encontró estaba detrás de un resultado en verde. La prueba de carga no tuvo
fallas mientras dos personas quedaban con el mismo bloque. La revisión de accesibilidad pasó con la
página vacía. `pip-audit` no encontró nada que alguien conozca hoy. Y la corrección del doble clic pasó
sus pruebas mientras dejaba un botón bloqueado para siempre.

> Un sistema no es rápido, seguro ni accesible: lo es con cierta carga, frente a cierto ataque, en
> cierto estado de la pantalla, para cierta persona. Probar cómo se comporta exige decir primero cuánto
> es suficiente, y después desconfiar de todo verde que no se sabe qué midió. Un agente lee el código
> más rápido que cualquiera y propone umbrales razonables; decidir cuáles son los del sistema sigue
> siendo trabajo de quien firma.

## Fuentes de síntesis

- [ISTQB Certified Tester Foundation Level Syllabus v4.0.1](https://astqb.org/assets/documents/ISTQB_CTFL_Syllabus_v4.0.1.pdf) — la prueba funcional y la no funcional (sección 2.2.2).
- [ISO/IEC 25010:2023](https://www.iso.org/standard/78176.html) — las características de calidad del producto y los cambios de la revisión de 2023.
- [OWASP Top 10:2025](https://top10.owasp.org/2025) — las categorías de riesgo de seguridad en aplicaciones web.
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) — los criterios de accesibilidad comprobables.
- [Ley 21.719](https://www.bcn.cl/leychile/navegar?idNorma=1209601) — el principio de seguridad y los deberes de adoptar medidas y de reportar las vulneraciones.
