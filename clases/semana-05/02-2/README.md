# Clase 16 - Semana 05 - Lo que nadie ejecuta no existe: pruebas de regresión, integración continua con GitHub Actions y la prueba inestable en una suite que corre sola

- **Unidad:** 02 · Desarrollo y Ejecución de Casos de Prueba
- **Fecha:** Martes 29 de septiembre de 2026 · segundo bloque
- **Duración:** 3 horas pedagógicas · 135 minutos (11:00 - 13:15)
- **Modalidad:** Presencial en Laboratorio de Redes
- **Docente:** Diego Obando
- **Marco de referencia:** ISTQB CTFL v4.0.1 · pruebas de confirmación y de regresión · GitHub Actions · flujos de trabajo disparados por `push`, `pull_request` y `schedule` · protección de la rama principal · `pytest` · la falla esperada estricta (`xfail`) · Playwright · reintentos y el informe de pruebas inestables · las pruebas inestables en la integración continua de Google · el agente que introduce un defecto en un `pull request`

---

# Objetivos de la Clase

## Objetivo General

Al finalizar esta sesión, el estudiante será capaz de conseguir que su suite se ejecute **sola**, ante
cada cambio, y que su resultado decida si ese cambio entra o no entra al proyecto. Todo lo que el
módulo construyó hasta aquí —las pruebas unitarias, las de integración, las de extremo a extremo, las
no funcionales, el plan de pruebas y la matriz de trazabilidad— comparte una condición que nadie ha
cuestionado todavía: **alguien tiene que acordarse de ejecutarlo**. Una suite que hay que acordarse
de correr se deja de correr en la primera semana apurada, y un defecto que entra ese día nadie lo ve.
La sesión traslada esa responsabilidad de las personas a la infraestructura. Una **prueba de
regresión** vuelve a ejecutar lo que ya funcionaba para comprobar que sigue funcionando después de un
cambio; la **integración continua** es la práctica de ejecutar esas pruebas automáticamente cada vez
que alguien sube un cambio al repositorio, en un servidor que no depende de la máquina ni de la
voluntad de nadie. El estudiante lo construirá con **GitHub Actions**, el servicio de GitHub que
ejecuta esas tareas, sobre el mismo proyecto de reserva de laboratorio de las sesiones anteriores, y
lo repetirá sobre su propio proyecto.
Automatizar la suite trae a la superficie dos problemas que en la máquina propia se podían ignorar.
El primero es qué hacer con una prueba que falla **a propósito**: la suplantación, el `[object
Object]` y la pantalla de 320 píxeles siguen en rojo, y un servidor que se niega a integrar cualquier
cambio mientras exista un rojo obliga a decidir qué hacer con ellos. Borrarlos o apagarlos consigue el
verde escondiendo lo que se sabe; la sesión enseña a dejarlos **visibles y justificados**, de modo que
el pipeline avise cuando dejen de fallar. El segundo es la **prueba inestable**, la que pasa y falla
sin que el sistema cambie: en una suite que corre sola decenas de veces al día, una prueba así
enseña a todo el equipo a volver a ejecutar hasta que salga verde, y el día que falla por un defecto
real ya nadie le cree.
La sesión cierra comprobando qué protege realmente el pipeline. Un agente introduce un defecto en el
proyecto mediante un `pull request` —la solicitud de integrar un cambio a la rama principal—, y se
observa si el pipeline lo bloquea, en qué etapa y si su resultado permite entender qué se rompió sin
abrir el código. Un pipeline en verde solo afirma lo que la suite mira, y esa es la última lección del
módulo antes del corte de mañana.

## Objetivos Específicos

1. **Explicar qué es una prueba de regresión y por qué se ejecuta la suite completa después de cada
   cambio**, y no solo la prueba que motivó el cambio, a partir de una corrección de las sesiones
   anteriores que dejó un defecto nuevo en algo que antes funcionaba.
2. **Escribir un flujo de trabajo de GitHub Actions** que se dispare ante cada `push` y cada `pull
   request`, que ejecute los controles estáticos y los tres niveles de la suite, y leer su resultado
   en el repositorio: qué paso falló, con qué salida y sobre qué cambio.
3. **Tratar una prueba que falla a propósito sin esconderla**, distinguiendo entre borrarla, omitirla
   y marcarla como falla esperada estricta, y dejando por escrito el motivo y la decisión pendiente.
4. **Programar las revisiones que dependen del tiempo y no de los cambios**, como la auditoría de
   dependencias, y regenerar la matriz de trazabilidad en cada ejecución del pipeline.
5. **Detectar y tratar una prueba inestable en integración continua**, usando reintentos que la
   informan como inestable en lugar de esconderla, y decidir qué hacer con ella mientras se corrige.
6. **Comprobar qué protege el pipeline** abriendo un `pull request` con un defecto introducido por un
   agente, reconocer un defecto que la suite no detecta aunque el pipeline esté en verde, y proteger la
   rama principal para que un cambio en rojo no se pueda integrar.

## Competencias Transversales

- **Quitarle a la memoria lo que la infraestructura puede hacer:** lo que depende de que alguien se
  acuerde deja de ocurrir justo cuando más importa.
- **Llegar al verde sin mentir:** un pipeline en verde conseguido apagando lo que fallaba es peor que
  uno en rojo, porque afirma algo falso con autoridad.
- **Dejar por escrito lo que se decidió no corregir todavía:** una prueba en rojo justificada es
  información; una desactivada sin explicación es un defecto escondido.
- **No acostumbrarse a volver a ejecutar:** repetir una prueba hasta que pase convierte la suite en
  un sorteo y le quita el valor a cada verde.
- **Poder explicar todo lo que está en el repositorio**, incluido el archivo que configura el
  pipeline: qué hace cada línea, por qué está ahí y qué pasaría si se quitara.

---

# Mapa de la Clase

| Horario | Sección | Propósito |
|---------|---------|-----------|
| 11:00 - 11:10 | Encuadre | Constatar que todo lo construido en el módulo depende de que alguien se acuerde de ejecutarlo, y separar la prueba de confirmación de la prueba de regresión con un defecto real de las sesiones anteriores. |
| 11:10 - 11:40 | Bloque 1 | El pipeline. Un flujo de trabajo de GitHub Actions escrito línea por línea, que se dispara ante cada cambio y ejecuta los controles estáticos y los tres niveles de la suite. Su primera ejecución, en rojo, y cómo se lee. |
| 11:40 - 12:10 | Bloque 2 | El verde honesto. Qué hacer con los rojos conocidos sin esconderlos: la falla esperada estricta, con el motivo escrito, que avisa cuando la prueba deja de fallar. La auditoría de dependencias programada para cuando nadie cambia nada, y la matriz de trazabilidad regenerada en cada ejecución. |
| 12:10 - 12:20 | Pausa | Descanso técnico. |
| 12:20 - 12:40 | Bloque 3 | La prueba inestable en una suite que corre sola. Reintentos que la informan como inestable en lugar de esconderla, qué dice la evidencia sobre su costo, y qué hacer con ella mientras se corrige. |
| 12:40 - 13:00 | Bloque 4 | Qué protege el pipeline. Un agente introduce un defecto en un `pull request`, y se observa si el pipeline lo bloquea, en qué etapa y si se entiende qué se rompió. Un defecto que la suite no ve y deja el pipeline en verde, y la protección de la rama principal. |
| 13:00 - 13:15 | Cierre | Recorrer lo que el módulo construyó, de la primera prueba al pipeline, y dejar preparado el corte de mañana: qué revisar esta noche en el propio repositorio y cómo ordenar el trabajo que falte. |

> Se trabaja sobre el mismo proyecto de reserva de laboratorio de las sesiones anteriores, con su
> API, su interfaz y sus dos suites: la de `pytest` y la de Playwright. Esta vez el proyecto vive en
> un repositorio público de GitHub, para que las ejecuciones del pipeline se puedan ver desde
> cualquier navegador. Cada estudiante repite todo sobre **su propio repositorio**. El defecto que
> introduce el agente en el bloque 4 se introduce en un repositorio propio, en una rama propia y
> mediante un `pull request` que nadie integra: nunca en el repositorio de otra persona.

> **Vocabulario que la sesión usa desde el primer minuto.** Un **repositorio** es la carpeta de un
> proyecto con todo su historial de cambios, guardada en GitHub. Un **commit** es un cambio registrado
> en ese historial, y hacer **push** es subirlo al repositorio de GitHub. Una **rama** es una línea de
> trabajo paralela dentro del repositorio; la **rama principal**, llamada `main`, es la versión que se
> considera buena. Un **pull request** es la solicitud de integrar los cambios de una rama a la rama
> principal, y GitHub la muestra con el detalle de lo que cambió y el resultado de las pruebas. La
> **integración continua** es la práctica de ejecutar las pruebas automáticamente ante cada cambio,
> y un **pipeline** es la secuencia de pasos que esa ejecución recorre: instalar, revisar, probar.
> **GitHub Actions** es el servicio de GitHub que ejecuta ese pipeline en un servidor, a partir de un
> archivo de configuración guardado en el propio repositorio. Una **suite** es el conjunto de pruebas
> que se ejecutan juntas con un comando, y una **prueba inestable** es la que pasa y falla sin que el
> sistema haya cambiado.

## Punto de partida: una corrección que pasó sus pruebas y rompió otra cosa

El lunes el proyecto tuvo un defecto que conviene recordar entero, porque es el ejemplo más claro de
lo que esta sesión resuelve. En la sesión de la mañana, la interfaz enviaba **dos** reservas cuando
alguien hacía doble clic en el botón «Reservar». La corrección fue deshabilitar el botón apenas se
envía el formulario y volver a habilitarlo al final. Las pruebas del doble clic pasaron: el defecto
estaba corregido.

Pero la corrección abrió un camino nuevo, y apareció en la sesión de las 11:00. Si la red fallaba
mientras se enviaba la reserva, el código se interrumpía antes de llegar a la línea que rehabilitaba el
botón, y el botón quedaba deshabilitado **para siempre**: la persona no podía volver a intentarlo sin recargar la página. Nadie
lo vio, porque ninguna prueba cortaba la red.

El programa de ISTQB distingue las dos preguntas que ese episodio mezcla:

> "Confirmation testing confirms that an original defect has been successfully fixed. […]
> Regression testing confirms that no adverse consequences have been caused by a change, including
> a fix that has already been confirmation tested. These adverse consequences could affect the same
> component where the change was made, other components in the same system, or even other connected
> systems."
>
> — ISTQB Certified Tester Foundation Level Syllabus v4.0.1, sección 2.2.3

En español: *la prueba de confirmación confirma que un defecto original fue corregido con éxito.
[…] La prueba de regresión confirma que un cambio no causó consecuencias adversas, incluso una
corrección que ya pasó su prueba de confirmación. Esas consecuencias adversas pueden afectar al mismo
componente donde se hizo el cambio, a otros componentes del mismo sistema o incluso a otros
sistemas conectados.*

Las pruebas del doble clic fueron la **confirmación**: comprobaron que el defecto original ya no
ocurría, y lo hicieron bien. Lo que faltó fue la **regresión**: comprobar que el cambio no había roto
nada más. Y una regresión no se busca solo cerca del cambio, porque puede aparecer en cualquier parte;
por eso la única forma segura de buscarla es volver a ejecutar **todas** las pruebas después de cada
cambio, también las que no tienen nada que ver con él.

Eso tiene un problema práctico evidente: nadie ejecuta la suite completa, en los tres navegadores,
cada vez que cambia una línea. La misma sección del programa dice cuál es la salida:

> "Regression test suites are run many times and generally the number of regression test cases will
> increase with each iteration or release, so regression testing is a strong candidate for
> automation. […] Where CI is used, such as in DevOps (see section 2.1.4), it is good practice to
> also include automated regression tests."
>
> — ISTQB Certified Tester Foundation Level Syllabus v4.0.1, sección 2.2.3

En español: *las suites de regresión se ejecutan muchas veces y, en general, la cantidad de casos
de regresión crece con cada iteración o entrega, así que la prueba de regresión es una fuerte
candidata a la automatización. […] Donde se usa integración continua, como en DevOps, es una buena
práctica incluir también pruebas de regresión automatizadas.* **DevOps** es la forma de organizar el
trabajo en que desarrollo, pruebas y operación trabajan juntos con el objetivo de entregar cambios
seguidos y con retroalimentación rápida.

Esa es la tarea de la sesión: que la suite completa se ejecute sola, en un servidor, cada vez que
alguien sube un cambio. El recorrido tiene cuatro pasos: **ejecutar → decidir → estabilizar →
proteger**. Primero se consigue que la suite corra sola; después se decide qué hacer con los rojos
que ya se conocen; después se enfrenta la prueba que pasa y falla sin motivo; y al final se comprueba
qué protege realmente todo eso.

---

# BLOQUE 1: El pipeline

- **Duración:** 30 minutos
- **Objetivo del bloque:** escribir un flujo de trabajo de GitHub Actions que ejecute los controles
  estáticos y los tres niveles de la suite ante cada cambio, y leer sus resultados. Al finalizar, el
  estudiante debe poder explicar cada línea del archivo de configuración, encontrar en el repositorio
  qué paso falló y por qué, y distinguir entre un rojo causado por el sistema, uno causado por el
  proyecto y uno causado por el propio pipeline.
- **Modalidad:** exposición con escritura del archivo en vivo, ejecuciones reales en GitHub, y
  aplicación individual sobre el proyecto propio.
- **Ritmo sugerido:** 5 minutos para qué es GitHub Actions y dónde vive, 10 para el archivo línea por
  línea, 12 para las cuatro ejecuciones y cómo se leen, y 3 para el ejercicio.

## Desarrollo

### 1.1 Qué es GitHub Actions y dónde vive

GitHub Actions ejecuta tareas en servidores de GitHub cuando ocurre algo en un repositorio: alguien
sube un cambio, alguien abre un `pull request`, llega una hora programada. Esas tareas se describen en
un **flujo de trabajo** (*workflow*), y la documentación lo define así:

> "A workflow is a configurable automated process made up of one or more jobs. You must create a
> YAML file to define your workflow configuration."
>
> — GitHub Docs, *Workflow syntax for GitHub Actions*

En español: *un flujo de trabajo es un proceso automatizado y configurable, compuesto por uno o más
trabajos. Hay que crear un archivo YAML para definir su configuración.* **YAML** es un formato de
texto para escribir configuración, en el que la **sangría** —los espacios al comienzo de cada línea—
indica qué va dentro de qué. Un espacio de más o de menos cambia el significado del archivo.

El archivo vive en el propio repositorio, en la carpeta `.github/workflows/`. Eso tiene una
consecuencia que conviene notar desde el principio: **la configuración del pipeline es código del
proyecto**. Se versiona, se revisa y puede tener defectos, igual que el resto.

Cada **trabajo** (*job*) se ejecuta en una máquina virtual nueva, creada para esa ejecución y
destruida al terminar. No tiene nada instalado del proyecto: ni Python en la versión que el proyecto
pide, ni sus dependencias, ni los navegadores de Playwright. Todo lo que el trabajo necesita lo tiene
que instalar desde lo que está escrito en el repositorio. Esa es la propiedad más valiosa de la
integración continua, y la más incómoda: **lo que funciona solo porque está instalado en tu máquina,
ahí no funciona**.

Para un repositorio público no tiene costo:

> "GitHub Actions usage is free for self-hosted runners and for public repositories that use
> standard GitHub-hosted runners."
>
> — GitHub Docs, *GitHub Actions billing*

En español: *el uso de GitHub Actions es gratuito con ejecutores propios y en repositorios públicos
que usan los ejecutores estándar de GitHub.* Un **ejecutor** (*runner*) es la máquina que ejecuta los
trabajos; los estándar son las máquinas virtuales que pone GitHub. En un repositorio privado, el plan
gratuito incluye 2.000 minutos al mes.

### 1.2 El flujo, línea por línea

El proyecto de reserva de laboratorio está publicado en
<https://github.com/Dieg0Code/reserva-laboratorio-pro402>, con todo su historial. Esta es la primera
versión de su flujo de trabajo, en `.github/workflows/pruebas.yml`; los bloques siguientes le agregan
pasos:

```yaml
name: Pruebas

on:
  push:
  pull_request:

jobs:
  estaticos:
    name: Controles estáticos
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: astral-sh/setup-uv@v10.2.0
      - run: uv sync --locked
      - run: uv run ruff check .
      - run: uv run pyrefly check

  pytest:
    name: Pruebas de Python
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: astral-sh/setup-uv@v10.2.0
      - run: uv sync --locked
      - run: uv run pytest -q

  extremo-a-extremo:
    name: Pruebas de extremo a extremo
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: astral-sh/setup-uv@v10.2.0
      - uses: actions/setup-node@v7
        with:
          node-version: 22
      - run: uv sync --locked
      - run: npm ci
        working-directory: e2e
      - run: npx playwright install --with-deps
        working-directory: e2e
      - run: npx playwright test
        working-directory: e2e
```

| Pieza | Qué hace |
|---|---|
| `name: Pruebas` | El nombre del flujo, el que aparece en la pestaña **Actions** del repositorio. |
| `on:` con `push:` y `pull_request:` | Cuándo se ejecuta: ante cada `push` a cualquier rama y ante cada `pull request`. Sin esta sección, el flujo nunca se ejecuta solo. |
| `jobs:` | Los trabajos del flujo. Este tiene tres: `estaticos`, `pytest` y `extremo-a-extremo`, que son los nombres internos; `name:` es el que se muestra. |
| `runs-on: ubuntu-latest` | La máquina virtual donde corre el trabajo: la versión más reciente de Ubuntu, un sistema Linux, que ofrece GitHub. |
| `steps:` | Los pasos del trabajo, que se ejecutan en orden, de arriba hacia abajo. |
| `uses:` | Un paso que usa una **acción**: un componente ya escrito que alguien publicó para reutilizarlo. Después de `@` va la versión. |
| `actions/checkout@v7` | Descarga el repositorio en la máquina virtual. Sin este paso, la máquina está vacía. |
| `astral-sh/setup-uv@v10.2.0` | Instala `uv`, que a su vez instala la versión de Python que pide el archivo `.python-version`. |
| `run:` | Un paso que ejecuta un comando, exactamente como se escribiría en la terminal. |
| `uv run ruff check .` y `uv run pyrefly check` | Los **controles estáticos**, que revisan el código sin ejecutarlo: `ruff` busca errores comunes y problemas de estilo, y `pyrefly` comprueba que los tipos de datos declarados sean coherentes. |
| `uv run pytest -q` | Ejecuta las pruebas de Python. `-q` pide una salida resumida. |
| `npx playwright test` | Ejecuta las pruebas de extremo a extremo en los tres navegadores. |
| `uv sync --locked` | Instala las dependencias de Python con las versiones exactas de `uv.lock`, y falla si ese archivo no coincide con `pyproject.toml`. Así el servidor usa las mismas versiones que tu máquina. |
| `actions/setup-node@v7` con `node-version: 22` | Instala Node.js, que Playwright necesita. `with:` le entrega parámetros a la acción. |
| `npm ci` | Instala las dependencias de la carpeta `e2e` con las versiones exactas de `package-lock.json`. Es la versión para servidores de `npm install`. |
| `npx playwright install --with-deps` | Descarga los tres navegadores y las bibliotecas del sistema que necesitan para funcionar en Linux. |
| `working-directory: e2e` | Ejecuta ese comando dentro de la carpeta `e2e`, donde están las pruebas de Playwright. |

Tres decisiones del archivo merecen explicación.

**¿Por qué tres trabajos y no uno?** Porque los trabajos de un flujo se ejecutan en paralelo:

> "A workflow run is made up of one or more `jobs`, which run in parallel by default."
>
> — GitHub Docs, *Workflow syntax for GitHub Actions*

En español: *una ejecución de un flujo está compuesta por uno o más trabajos, que por omisión se
ejecutan en paralelo.* Separados, los tres terminan antes y, sobre todo, **fallan por separado**: si
`ruff` encuentra un problema, las pruebas se ejecutan igual y se sabe cómo están. En un solo trabajo,
el primer paso que falla detiene todos los siguientes y deja sin respuesta todo lo demás. El costo es
que cada trabajo repite la descarga y la instalación, porque cada uno corre en su propia máquina.

**¿Por qué `--locked` y `npm ci`, y no `uv sync` y `npm install`?** Porque los dos comandos que se
usan en la propia máquina actualizan las versiones cuando pueden, y los que se usan en el pipeline
instalan **exactamente** las del archivo de bloqueo. Una prueba que pasa en tu máquina con una
versión y falla en el servidor con otra no informa nada del sistema: informa una diferencia de
entornos.

**¿Por qué la versión completa `v10.2.0` en `setup-uv`, si en las otras acciones basta `v7`?** Esa
respuesta la dio la primera ejecución.

### 1.3 La primera ejecución: el pipeline también tiene defectos

El flujo se subió con `astral-sh/setup-uv@v10`, siguiendo la costumbre de las otras dos acciones. La
ejecución terminó en 8 segundos, con los tres trabajos en rojo antes de ejecutar un solo comando:

```text
X Unable to resolve action `astral-sh/setup-uv@v10`, unable to find version `v10`
```

En español: *no se pudo resolver la acción `astral-sh/setup-uv@v10`; no se encontró la versión
`v10`.* Muchas acciones, como `checkout` y `setup-node`, publican además de cada versión completa
una etiqueta corta, como `v7`, que apunta siempre a la última versión de esa serie. La de `uv` no la
publica: solo tiene versiones completas, como `v10.2.0`. La corrección fue escribir la versión
completa.

Este primer rojo no dice nada del sistema de reservas: dice que el archivo de configuración tenía un
error. Distinguir **quién** falló es lo primero que se hace al leer un pipeline en rojo, porque hay
tres respuestas posibles y cada una se corrige en un lugar distinto: el sistema, el proyecto o el
propio pipeline.

### 1.4 La segunda ejecución: tres trabajos, tres motivos

Con la versión corregida, los tres trabajos llegaron a ejecutar sus comandos, y los tres terminaron en
rojo. En la pestaña **Actions** se abre la ejecución, se entra al trabajo marcado con una X y se
busca el paso marcado igual. Cada paso muestra su salida completa, tal como se habría visto en la
terminal.

**Controles estáticos**, en el paso `uv run ruff check .`:

```text
error: Failed to spawn: `ruff`
  cause: No such file or directory (os error 2)
```

En español: *no se pudo lanzar `ruff`: no existe el archivo.* El proyecto nunca declaró `ruff` ni
`pyrefly` entre sus dependencias. Hasta ahora se habían ejecutado con `uv run --with ruff`, que los
instala solo para ese comando, así que funcionaban sin que el proyecto dijera que los necesitaba. El servidor instaló exactamente lo que el proyecto declara, y `ruff` no estaba. **Es un
rojo del proyecto, no del sistema**: cualquier persona que clonara el repositorio y siguiera sus
instrucciones habría tenido el mismo problema. La corrección los declara como dependencias de
desarrollo, las que se necesitan para trabajar en el proyecto pero no para que funcione:

```bash
uv add --dev ruff pyrefly
```

**Pruebas de Python**, en el paso `uv run pytest -q`:

```text
FAILED test_seguridad.py::test_otra_persona_no_puede_agotar_la_cuota_de_ana - assert 409 == 201
1 failed, 24 passed, 1 warning in 0.95s
```

Es la prueba de suplantación de la sesión del lunes. El sistema permite tres reservas por semana a
cada RUT —esa es la **cuota**—, y la API acepta cualquier RUT sin comprobar quién lo escribe, así que
otra persona puede gastar la cuota de Ana usando el RUT de ella. **Es un rojo del sistema**, y ya se
sabía.

**Pruebas de extremo a extremo**, en el paso `npx playwright test`:

```text
  ✘   6 [chromium] › pruebas/reserva.spec.ts:20:5 › si falta un dato, la pantalla dice cuál corregir (6.2s)
  ✘   9 [chromium] › pruebas/verificacion.spec.ts:22:5 › en una pantalla de 320 píxeles no hay desplazamiento horizontal (1.4s)
  ✘  15 [firefox] › pruebas/reserva.spec.ts:20:5 › si falta un dato, la pantalla dice cuál corregir (5.8s)
  ✘  18 [firefox] › pruebas/verificacion.spec.ts:22:5 › en una pantalla de 320 píxeles no hay desplazamiento horizontal (1.3s)
  ✘  24 [webkit] › pruebas/reserva.spec.ts:20:5 › si falta un dato, la pantalla dice cuál corregir (6.1s)
  ✘  27 [webkit] › pruebas/verificacion.spec.ts:22:5 › en una pantalla de 320 píxeles no hay desplazamiento horizontal (1.6s)
  6 failed
  21 passed (1.3m)
```

Las dos pruebas que ya fallaban, en los tres navegadores. La primera: cuando falta un dato, la
pantalla muestra `[object Object]`, que es lo que JavaScript escribe al convertir en texto un dato que
no es texto, en lugar del mensaje que decía qué campo faltaba. La segunda: la página no cabe en una
pantalla de 320 píxeles de ancho y obliga a desplazarse hacia los lados. Dos rojos del sistema,
también conocidos.

Uno de los detalles de esta salida merece atención. En la máquina Windows de las sesiones anteriores,
la página medía **514** píxeles de ancho en Chromium. En el servidor Linux de GitHub mide **560**, en los
tres navegadores:

```text
    Expected: <= 320
    Received:    560
```

La diferencia viene del entorno. La explicación más probable son las fuentes tipográficas, que no
son las mismas en Windows y en Linux, y con las que el mismo texto ocupa distinto ancho; no se
investigó más, porque no cambia nada de lo que importa. El número cambió; el veredicto no. Es lo que
una prueba bien escrita consigue al afirmar contra un umbral —«no más de 320»— en lugar de contra un
valor exacto: sigue siendo válida en un entorno distinto. Y es otro recordatorio de la lección de la
portabilidad: cada número vale para las condiciones en que se midió.

### 1.5 La tercera ejecución: lo que `ruff` encontró en cuanto pudo ejecutarse

Con `ruff` y `pyrefly` declarados, el trabajo de controles estáticos volvió a fallar, ahora por otra
razón:

```text
I001 [*] Import block is un-sorted or un-formatted
  --> test_concurrencia.py:1:1
...
Found 1 error.
[*] 1 fixable with the `--fix` option.
```

En español: *el bloque de importaciones está desordenado o mal formateado; se encontró un error, y se
puede corregir automáticamente con la opción `--fix`.* Es una regla de la versión de `ruff` que ahora
instala el proyecto, 0.16.9, y el archivo de la prueba de concurrencia no la cumplía.

Hay dos cosas que aprender de esta ejecución. La primera es que corregir un rojo puede **revelar el
siguiente**: el problema del import existía antes, pero nadie lo veía porque `ruff` ni siquiera
llegaba a ejecutarse. La segunda está en la lista de pasos: `uv run pyrefly check` aparece marcado con
un guion, sin ejecutar. Dentro de un trabajo, cuando un paso falla, los siguientes se saltan. Por eso
`pyrefly` no dijo nada todavía: no se sabe si pasa.

La corrección la hace el propio `ruff`, y el cambio es mover una línea:

```bash
uv run ruff check --fix .
```

```diff
 import sqlite3
-from contextlib import closing
 from concurrent.futures import ThreadPoolExecutor
+from contextlib import closing
 from pathlib import Path
```

### 1.6 La cuarta ejecución: el estado desde el que se decide

```text
✓ Controles estáticos in 8s
X Pruebas de Python in 10s
X Pruebas de extremo a extremo in 1m52s
```

Los controles estáticos quedaron en verde, con la salida de los dos pasos a la vista: `All checks
passed!` para `ruff` y `0 errors` para `pyrefly`. Las dos suites siguen en rojo, y **solo** por los tres
defectos que ya se conocían: la suplantación en `pytest`, y el `[object Object]` y la pantalla de 320
píxeles en Playwright.

Cuatro ejecuciones, cuatro commits, y cada una quedó registrada en la pestaña **Actions** con su
commit, su hora y su resultado. Ese historial también es evidencia: muestra qué se encontró, en qué
orden y cómo se corrigió, algo que un pipeline en verde desde el primer día no puede mostrar.

La ejecución también dejó una advertencia que vale la pena leer:

```text
The ubuntu-latest label will migrate to Ubuntu 26 beginning October 19, 2026.
```

En español: *la etiqueta `ubuntu-latest` pasará a Ubuntu 26 a partir del 19 de octubre de 2026.*
`latest` significa «la más reciente», y la más reciente cambia sin que nadie toque el repositorio. Lo
mismo ocurre con Python: el archivo `.python-version` dice `3.13`, y el servidor instaló la 3.13.15,
mientras las sesiones anteriores usaron la 3.13.11. Fijar una versión exacta hace que el entorno no
cambie solo; dejarla abierta recibe las correcciones sin pedirlas. Las dos son decisiones legítimas,
siempre que se tomen sabiendo cuál se tomó.

El pipeline está en rojo por lo que el sistema todavía no hace bien. Quedan dos formas de ponerlo en
verde: corregir los tres defectos, o dejar de preguntarlos. La segunda es la tentación de todo equipo
con prisa, y es el tema del bloque siguiente.

## Ejercicio del bloque

Sobre tu propio proyecto, en tu propio repositorio de GitHub.

1. **Crea el archivo `.github/workflows/pruebas.yml`** con un trabajo por cada tipo de control que
   tenga tu proyecto: los controles estáticos, las pruebas de Python y, si tu proyecto tiene interfaz,
   las de extremo a extremo. Usa los mismos comandos que ejecutas en tu terminal.
2. **Haz commit y push**, y abre la pestaña **Actions** de tu repositorio. Espera a que termine la
   primera ejecución.
3. **Por cada trabajo en rojo, clasifica el motivo**: ¿es un rojo del sistema, del proyecto o del
   propio pipeline? Anota el paso que falló y la línea de la salida que lo muestra.
4. **Corrige los rojos del proyecto y del pipeline**, uno por commit, hasta que solo queden los rojos
   del sistema. Esos no los toques todavía: son el tema del bloque 2.

**Pista:** si un comando funciona en tu terminal y falla en el pipeline, pregúntate qué tiene tu
máquina que el repositorio no dice. Casi siempre es una herramienta instalada a mano, una variable de
entorno o un archivo que no está en el repositorio porque el `.gitignore` lo excluye.

**Evidencia esperada:** el enlace a la pestaña Actions de tu repositorio con al menos dos ejecuciones,
y la clasificación de cada rojo con su paso y su línea.

## Preguntas guía

1. La primera ejecución falló en 8 segundos sin ejecutar ninguna prueba. ¿Dice algo sobre la calidad
   del sistema de reservas?

   **Pista:** revisa en qué paso falló y qué decía el mensaje. Pregúntate qué archivo había que
   corregir y si ese archivo es parte del sistema.

2. `ruff` funcionaba en las sesiones anteriores y en el servidor no se pudo ejecutar. Un compañero
   dice que el problema es del servidor. ¿Tiene razón?

   **Pista:** compara el comando que se usaba antes con el del pipeline. Pregúntate qué habría
   pasado si otra persona hubiera clonado el repositorio y seguido sus instrucciones.

3. En Windows la página medía 514 píxeles y en el servidor 560. ¿Cuál de los dos es el resultado
   correcto de la prueba?

   **Pista:** mira qué afirma la prueba: un valor exacto o un límite. Pregúntate si el veredicto cambió
   entre los dos entornos.

## Fuentes técnicas del bloque

- [ISTQB Certified Tester Foundation Level Syllabus v4.0.1](https://astqb.org/assets/documents/ISTQB_CTFL_Syllabus_v4.0.1.pdf) — sección 2.2.3, las pruebas de confirmación y de regresión y su automatización en integración continua, citadas literalmente; y sección 2.1.4, DevOps y pruebas.
- [GitHub Docs — Workflow syntax for GitHub Actions](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions) — la definición de flujo de trabajo y la ejecución en paralelo de los trabajos, citadas literalmente; la carpeta `.github/workflows`, `on`, `jobs`, `runs-on`, `steps`, `uses`, `run`, `with` y `working-directory`.
- [GitHub Docs — GitHub Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions) — el uso gratuito en repositorios públicos, citado literalmente, y los 2.000 minutos mensuales del plan gratuito para repositorios privados.
- [astral-sh/setup-uv](https://github.com/astral-sh/setup-uv) — la acción que instala `uv`, publicada solo con versiones completas.
- [uv — `uv sync`](https://docs.astral.sh/uv/reference/cli/#uv-sync) — la opción `--locked`, que exige que `uv.lock` no cambie.
- [Playwright — Continuous Integration](https://playwright.dev/docs/ci) — la instalación de los navegadores y sus dependencias del sistema con `npx playwright install --with-deps`.
- [Repositorio del proyecto de reserva de laboratorio](https://github.com/Dieg0Code/reserva-laboratorio-pro402) — el flujo de trabajo y el historial de ejecuciones citado en el bloque.
- Ejecuciones registradas para esta clase en GitHub Actions, sobre `ubuntu-latest` con Python 3.13.15, `uv` instalado con `setup-uv` 10.2.0, Node.js 22, `ruff` 0.16.9, `pyrefly` 1.3.1, `pytest` 9.1.1 y Playwright 1.63.0: la primera ejecución detenida por la versión inexistente `v10`; la segunda con `Failed to spawn: ruff`, `1 failed, 24 passed` en `pytest` y `6 failed, 21 passed` en Playwright, con la página de 560 píxeles en los tres navegadores; la tercera con la regla I001 en `test_concurrencia.py` y `pyrefly` sin ejecutar; y la cuarta con los controles estáticos en verde y las dos suites en rojo solo por los defectos conocidos.

---

# BLOQUE 2: El verde honesto

- **Duración:** 30 minutos
- **Objetivo del bloque:** llevar el pipeline a verde sin esconder lo que se sabe. Al finalizar, el
  estudiante debe poder elegir qué hacer con una prueba que falla a propósito —corregir, borrar,
  omitir o marcar como falla esperada estricta— y justificar la elección; marcar una falla esperada
  en `pytest` y en Playwright con su motivo escrito; explicar qué ocurre cuando alguien corrige el
  defecto; y programar las revisiones que dependen del tiempo y no de los cambios.
- **Modalidad:** exposición con ejecuciones reales en GitHub, un `pull request` de demostración, y
  aplicación individual sobre el proyecto propio.
- **Ritmo sugerido:** 5 minutos para las cuatro opciones, 10 para las marcas y el `pull request` que
  las pone a prueba, 5 para el registro escrito, 7 para la auditoría programada y la matriz, y 3 para
  el ejercicio.

## Desarrollo

### 2.1 Cuatro formas de salir del rojo

El bloque 1 terminó con el pipeline en rojo por tres pruebas que describen defectos reales del
sistema: la suplantación, el `[object Object]` y la pantalla de 320 píxeles. Las tres se conocen desde
el lunes y ninguna se va a corregir hoy, porque cada una espera una decisión que no es técnica: cómo
se identifican las personas, qué dice el mensaje de cada campo, cómo se rediseña la **grilla**, la
cuadrícula de fichas que muestra el estado de los ocho bloques.

Mientras tanto, el pipeline está en rojo **siempre**. Y un pipeline que está siempre en rojo tiene el
mismo problema que una alarma que suena todo el día: nadie la mira, y el día que un cambio rompa algo
nuevo, el rojo nuevo se pierde entre los viejos. Hay cuatro formas de salir de ahí:

| Opción | Qué pasa con el pipeline | Qué pasa con lo que se sabe |
|---|---|---|
| **Corregir el defecto** | Queda en verde | Desaparece, porque dejó de ser cierto |
| **Borrar la prueba** | Queda en verde | Se pierde: nadie sabrá que el defecto existe |
| **Omitir la prueba** | Queda en verde | Se esconde: la prueba ni siquiera se ejecuta |
| **Marcarla como falla esperada** | Queda en verde | Sigue visible, y la prueba se sigue ejecutando |

La primera es la única que resuelve algo, y cuando se puede, es la respuesta. Las dos del medio
consiguen el verde **afirmando algo falso**: que el sistema no tiene ese defecto. La cuarta es la que
este bloque enseña, y `pytest` la distingue con precisión de la omisión:

> "A **skip** means that you expect your test to pass only if some conditions are met, otherwise
> pytest should skip running the test altogether. […] An **xfail** means that you expect a test to
> fail for some reason. A common example is a test for a feature not yet implemented, or a bug not
> yet fixed."
>
> — pytest, *How to use skip and xfail to deal with tests that cannot succeed*

En español: *omitir (*skip*) significa que se espera que la prueba pase solo si se cumplen ciertas
condiciones, y si no se cumplen, `pytest` no la ejecuta en absoluto. […] Una falla esperada (*xfail*)
significa que se espera que la prueba falle por algún motivo. Un ejemplo común es una prueba de una
funcionalidad todavía no implementada, o de un defecto todavía no corregido.* La omisión es para
pruebas que no aplican —una prueba de Windows en un servidor Linux—; la falla esperada es para
defectos conocidos. Usar la primera para lo segundo es esconderlo.

### 2.2 La falla esperada en `pytest`

La prueba de suplantación queda así:

```python
import pytest

@pytest.mark.xfail(
    strict=True,
    reason=(
        "Suplantación: la API acepta cualquier RUT sin comprobar quién lo escribe. "
        "Pendiente: decidir cómo se identifican las personas."
    ),
)
def test_otra_persona_no_puede_agotar_la_cuota_de_ana(base_de_datos_de_prueba: Path) -> None:
    ...
```

El cuerpo de la prueba no cambia: sigue afirmando exactamente lo mismo. Lo único que se agrega es la
marca, con dos parámetros.

| Pieza | Qué hace |
|---|---|
| `@pytest.mark.xfail` | Declara que se espera que esta prueba falle. `pytest` la ejecuta igual, y si falla, la informa como `xfailed` en lugar de `failed`, sin poner la suite en rojo. |
| `reason=` | El motivo, escrito en la propia prueba. Aparece en el informe cada vez que la suite se ejecuta. |
| `strict=True` | Si la prueba **pasa**, la suite se pone en rojo. Es lo que impide que la marca sobreviva a su motivo. |

Sin `strict`, una falla esperada que empieza a pasar no molesta a nadie:

> "Both `XFAIL` and `XPASS` don't fail the test suite by default. You can change this by setting the
> `strict` keyword-only parameter to `True` […]. This will make `XPASS` ("unexpectedly passing")
> results from this test to fail the test suite."
>
> — pytest, *How to use skip and xfail to deal with tests that cannot succeed*

En español: *por omisión, ni `XFAIL` ni `XPASS` ponen la suite en rojo. Se puede cambiar poniendo el
parámetro `strict` en `True`, y entonces un resultado `XPASS` —«pasó inesperadamente»— de esta prueba
pondrá la suite en rojo.* Sin esa marca estricta, alguien podría corregir la suplantación sin saberlo,
y la marca seguiría diciendo, para siempre, que el defecto existe.

En el pipeline, el paso de `pytest` se ejecuta ahora con una opción más:

```yaml
      - run: uv run pytest -q -rxX
```

`-r` pide un resumen de ciertos resultados al final de la salida, y `xX` elige cuáles: las fallas
esperadas (`x`) y las que pasaron inesperadamente (`X`). Sin esa opción, el motivo solo se vería
pidiéndolo. Con ella, cada ejecución lo muestra:

```text
XFAIL test_seguridad.py::test_otra_persona_no_puede_agotar_la_cuota_de_ana - Suplantación: la API acepta cualquier RUT sin comprobar quién lo escribe. Pendiente: decidir cómo se identifican las personas.
24 passed, 1 xfailed, 1 warning in 0.83s
```

El resumen ya no dice `1 failed`, y tampoco dice `25 passed`: dice `1 xfailed`. El defecto sigue en
la salida, con su motivo, en cada ejecución.

Esta opción tiene un defecto que el pipeline dejó a la vista más tarde, en el bloque 4: `-rxX`
**reemplaza** el resumen por omisión en lugar de sumarse a él, y las pruebas que fallan dejan de
aparecer al final de la salida. La forma correcta es `-rfExX`, y es la que usa el proyecto.

### 2.3 La falla esperada en Playwright

Playwright tiene su propia forma de declararla. Las dos pruebas de extremo a extremo quedan así:

```typescript
test.fail("si falta un dato, la pantalla dice cuál corregir", {
  annotation: {
    type: "rojo conocido",
    description: "La pantalla muestra [object Object]. Pendiente: decidir qué dice el mensaje de cada campo.",
  },
}, async ({ page }) => {
  // el mismo cuerpo de siempre
});
```

`test.fail` reemplaza a `test`, y entre el título y el cuerpo recibe un objeto de detalles con una
**anotación**: una etiqueta con un tipo y una descripción que Playwright guarda junto a la prueba y
muestra en sus informes. La documentación de Playwright explica qué hace:

> "Marks a test as "should fail". Playwright runs this test and ensures that it is actually failing.
> This is useful for documentation purposes to acknowledge that some functionality is broken until it
> is fixed."
>
> — Playwright, `test.fail`

En español: *marca una prueba como «debe fallar». Playwright ejecuta la prueba y se asegura de que
efectivamente falle. Sirve para dejar documentado que cierta funcionalidad está rota hasta que se
corrija.* En Playwright la marca es estricta sin necesidad de pedirlo: si la prueba pasa, Playwright
la cuenta como falla.

La salida en el pipeline tiene un detalle que conviene conocer para no leerla mal:

```text
  ✘   6 [chromium] › pruebas/reserva.spec.ts:20:6 › si falta un dato, la pantalla dice cuál corregir (6.0s)
  ✘   9 [chromium] › pruebas/verificacion.spec.ts:22:6 › en una pantalla de 320 píxeles no hay desplazamiento horizontal (938ms)
  ✘  15 [firefox] › pruebas/reserva.spec.ts:20:6 › si falta un dato, la pantalla dice cuál corregir (6.1s)
  ✘  18 [firefox] › pruebas/verificacion.spec.ts:22:6 › en una pantalla de 320 píxeles no hay desplazamiento horizontal (1.8s)
  ✘  24 [webkit] › pruebas/reserva.spec.ts:20:6 › si falta un dato, la pantalla dice cuál corregir (6.2s)
  ✘  27 [webkit] › pruebas/verificacion.spec.ts:22:6 › en una pantalla de 320 píxeles no hay desplazamiento horizontal (1.2s)
  27 passed (1.2m)
```

Las seis pruebas marcadas aparecen con `✘`, porque fallaron, y el total dice **`27 passed`**, porque
fallar era lo esperado. El número del final no distingue entre las pruebas que pasaron y las que
fallaron como se esperaba; las marcas de cada línea, sí. Quien lea solo el total va a creer que las
27 pasaron. Por eso la marca no basta: hace falta el registro escrito de la sección 2.5.

### 2.4 Qué pasa cuando alguien corrige el defecto

La marca estricta se entiende de verdad viéndola actuar. En una rama del repositorio se corrigió el
`[object Object]`: cuando la API rechaza un dato, la interfaz busca el campo que falló y muestra su
etiqueta, «Revisa el campo Personas.», en lugar del objeto sin convertir. Con esa corrección se abrió
un `pull request`, el
[número 1 del repositorio](https://github.com/Dieg0Code/reserva-laboratorio-pro402/pull/1).

El pipeline del `pull request` quedó en rojo:

```text
  1) [chromium] › pruebas/reserva.spec.ts:20:6 › si falta un dato, la pantalla dice cuál corregir ──
    Expected to fail, but passed.
  2) [firefox] › pruebas/reserva.spec.ts:20:6 › si falta un dato, la pantalla dice cuál corregir ───
    Expected to fail, but passed.
  3) [webkit] › pruebas/reserva.spec.ts:20:6 › si falta un dato, la pantalla dice cuál corregir ────
    Expected to fail, but passed.
  3 failed
  24 passed (1.0m)
```

En español: *se esperaba que fallara, pero pasó.* El sistema mejoró, y el pipeline se puso en rojo.
No es una contradicción: es la marca estricta cumpliendo su función. La prueba decía «esto está roto»,
y dejó de ser cierto; el pipeline no acepta que el repositorio siga afirmando algo falso. La única
forma de volver al verde es quitar la marca, y con ella la fila del registro de rojos conocidos. Ese
segundo commit dejó el `pull request` en verde en los cuatro trabajos: los tres del flujo de pruebas
y el de la auditoría de dependencias, que se presenta en la sección 2.6.

El `pull request` quedó **abierto, sin integrar**. La corrección técnica está hecha y comprobada, pero
integrarla significa aceptar «Revisa el campo Personas.» como el mensaje que el sistema le da a quien
se equivoca, y esa es la decisión que faltaba desde el principio. El pipeline dice que el cambio
funciona; no dice que el texto sea el correcto. Eso lo decide quien conoce el requisito.

En la lista de ejecuciones aparece un detalle más: cada commit de la rama ejecutó el flujo **dos
veces**, una por el evento `push` y otra por el evento `pull_request`. Es la consecuencia de haber
pedido las dos cosas en `on:`. Se puede evitar limitando `push` a la rama principal, con `push:
branches: [main]`, a costa de que un `push` a otra rama sin `pull request` abierto no ejecute nada.
En el proyecto se dejaron las dos, para que cada `push` y cada `pull request` tengan su propia
ejecución.

### 2.5 Dejarlo por escrito

La marca vive dentro del código, y quien no lo abra no la ve. Por eso cada rojo conocido tiene
además un registro legible por cualquier persona, en el README del proyecto:

| Prueba | Qué muestra | Qué decisión falta |
|---|---|---|
| `test_otra_persona_no_puede_agotar_la_cuota_de_ana` | La API acepta cualquier RUT sin comprobar quién lo escribe, así que otra persona puede gastar la cuota de Ana | Cómo se identifican las personas |
| «si falta un dato, la pantalla dice cuál corregir» | La pantalla muestra `[object Object]` en lugar de decir qué campo falta | Qué dice el mensaje de cada campo |
| «en una pantalla de 320 píxeles no hay desplazamiento horizontal» | La página mide más de 320 píxeles de ancho y obliga a desplazarse hacia los lados | Cómo se rediseña la grilla para pantallas angostas |

La tercera columna es la que importa. Una prueba marcada sin decisión pendiente es una prueba
abandonada; con la decisión escrita, es una tarea con dueño posible. Y es lo que pide la sección
3.B de las instrucciones de la Evaluación Final:

> «Una prueba desactivada tiene que estar justificada por escrito. Una prueba borrada sin
> explicación cuenta como un defecto sin cubrir.»
>
> — Instrucciones de la Evaluación Final, sección 3.B

### 2.6 Lo que depende del tiempo, no de los cambios

La sesión del lunes dejó una tarea pendiente para este pipeline. Una **vulnerabilidad** es una
debilidad de seguridad ya descubierta y publicada, con un identificador propio. `pip-audit` compara las
dependencias del proyecto con las bases públicas de vulnerabilidades conocidas, y su resultado puede cambiar **sin
que nadie toque el repositorio**: basta con que se publique una vulnerabilidad nueva sobre una versión
que ya estaba instalada. Un pipeline que solo se ejecuta ante cada cambio nunca se entera.

GitHub Actions resuelve eso con otro evento, `schedule`, que ejecuta un flujo a una hora fija. La
auditoría quedó en su propio archivo, `.github/workflows/auditoria.yml`:

```yaml
name: Auditoría de dependencias

on:
  push:
  pull_request:
  schedule:
    - cron: "0 8 * * *"
      timezone: "America/Santiago"
  workflow_dispatch:

jobs:
  pip-audit:
    name: Vulnerabilidades conocidas
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: astral-sh/setup-uv@v10.2.0
      - run: uv sync --locked
      - run: uv export --no-dev --format requirements-txt --no-hashes -o req-prod.txt
      - run: uv run pip-audit -r req-prod.txt
```

| Pieza | Qué hace |
|---|---|
| `schedule:` con `cron: "0 8 * * *"` | Ejecuta el flujo todos los días a las 8:00. `cron` es una notación de cinco campos separados por espacios: minuto, hora, día del mes, mes y día de la semana. Un asterisco significa «cualquiera»: minuto 0, hora 8, cualquier día, cualquier mes, cualquier día de la semana. |
| `timezone: "America/Santiago"` | La hora de Chile. Sin esta línea, `cron` se interpreta en la hora universal (UTC). |
| `workflow_dispatch:` | Permite ejecutar el flujo a mano, con un botón en la pestaña **Actions**. |
| `push:` y `pull_request:` | La auditoría también corre ante cada cambio, porque un cambio puede agregar una dependencia vulnerable. |
| `uv export --no-dev ...` | Escribe la lista exacta de dependencias de producción, las que usa el sistema al funcionar, sin las herramientas de desarrollo. |
| `uv run pip-audit -r req-prod.txt` | Audita esa lista. `pip-audit` quedó declarado como dependencia de desarrollo, con la lección del bloque 1. |

El evento `schedule` tiene tres condiciones que conviene conocer antes de confiar en él. La
documentación de GitHub dice que *los flujos programados se ejecutan sobre el último commit de la rama
principal*, que *el evento `schedule` se puede retrasar en los períodos de alta carga*, y que en los
repositorios públicos *los flujos programados se desactivan automáticamente cuando no ha habido
actividad en el repositorio durante 60 días*. Un proyecto que se deja de tocar deja también de
auditarse, sin avisar.

La auditoría ya se ejecutó por tres caminos distintos —un `push`, un `pull request` y a mano con
`workflow_dispatch`—, y las tres veces dijo lo mismo:

```text
No known vulnerabilities found
```

Desde entonces queda programada para ejecutarse sola cada mañana a las 8:00. Su resultado puede ser
distinto sin que nadie haya cambiado una línea, y ese es precisamente el motivo para programarla.

### 2.7 La matriz, en cada ejecución

La **matriz de trazabilidad** es la tabla que cruza cada requisito con las pruebas que lo comprueban.
La sesión de esta mañana construyó un programa que la genera, `trazabilidad.py`, y dejó una
advertencia:
una matriz que nadie regenera vuelve a ser una planilla vieja con otro nombre. El pipeline la regenera
ahora en cada ejecución, con un paso más en el trabajo de `pytest`:

```yaml
      - name: Matriz de trazabilidad
        if: always()
        run: |
          echo '```text' >> "$GITHUB_STEP_SUMMARY"
          uv run python trazabilidad.py >> "$GITHUB_STEP_SUMMARY"
          echo '```' >> "$GITHUB_STEP_SUMMARY"
```

| Pieza | Qué hace |
|---|---|
| `name:` | Un nombre para el paso, el que se muestra en la lista de pasos. |
| `if: always()` | Ejecuta el paso **aunque el anterior haya fallado**. Sin esta línea, un rojo en `pytest` saltaría la matriz, que es justo cuando más interesa verla. |
| `run: \|` | La barra vertical permite escribir varios comandos, uno por línea. |
| `echo '...'` | Escribe el texto que va entre comillas. |
| `>>` | Agrega la salida del comando al final del archivo que sigue, sin borrar lo que ya tenía. |
| `uv run python trazabilidad.py` | Genera la matriz. |
| `$GITHUB_STEP_SUMMARY` | Un archivo especial: lo que se escribe en él aparece en la página de resumen de la ejecución. Las comillas triples invertidas antes y después hacen que la matriz se muestre como texto de ancho fijo, con las columnas alineadas. |

La documentación de GitHub lo describe así: *se puede definir un texto en Markdown para cada trabajo,
que se mostrará en la página de resumen de la ejecución*. El resultado, en cada ejecución:

```text
MATRIZ DE TRAZABILIDAD
requisito    pruebas   estado
RF-01             10   cubierto
RF-02              3   cubierto
RF-03              2   cubierto
RF-04              4   cubierto
RF-05              0   SIN PRUEBA
RF-06              1   cubierto
RF-07              2   cubierto
RF-08              0   SIN PRUEBA
RF-09              0   SIN PRUEBA
RF-10              0   SIN PRUEBA

Requisitos sin prueba: 4
  RF-05
  RF-08
  RF-09
  RF-10

Pruebas sin requisito: 3
  test_api.py::test_la_base_de_datos_existe_durante_la_prueba
  test_seguridad.py::test_un_nombre_con_codigo_sql_se_guarda_como_texto
  test_seguridad.py::test_otra_persona_no_puede_agotar_la_cuota_de_ana
```

La matriz **informa y no bloquea**: cuatro requisitos sin prueba no ponen el pipeline en rojo. Es una
decisión, y se podría tomar la contraria —hacer que el script termine con error si queda un requisito
sin prueba—. Qué debe bloquear un cambio y qué solo debe quedar a la vista es un **criterio de
salida**, la condición que el plan de pruebas declara para dar por terminada la prueba. Pertenece al
plan, no al pipeline: el pipeline ejecuta lo que el plan decidió.

### 2.8 El estado al final del bloque

```text
✓ Controles estáticos
✓ Pruebas de Python          24 passed, 1 xfailed
✓ Pruebas de extremo a extremo   27 passed, 6 de ellas fallas esperadas
✓ Vulnerabilidades conocidas   No known vulnerabilities found
```

Todo en verde, y nada escondido. Cada verde dice lo que mide: los controles estáticos no encontraron
problemas; las suites pasaron, salvo tres defectos declarados, con su motivo y su decisión pendiente;
y ninguna dependencia tiene hoy una vulnerabilidad conocida. Si mañana alguien corrige uno de los
defectos, el pipeline lo va a obligar a actualizar el registro. Si mañana se publica una
vulnerabilidad, la auditoría programada la va a encontrar.

Falta una pregunta que ningún verde responde: ¿y si una de estas pruebas pasa y falla sin que nadie
haya cambiado nada? Es el tema del bloque 3.

## Ejercicio del bloque

Sobre tu propio proyecto, con el pipeline del bloque 1.

1. **Para cada prueba que siga en rojo, decide** entre corregir el defecto, marcarla como falla
   esperada estricta o, si de verdad no aplica a un entorno, omitirla. Escribe al lado por qué no
   elegiste las otras opciones.
2. **Marca las fallas esperadas** con `@pytest.mark.xfail(strict=True, reason=...)` o con `test.fail`
   y una anotación, según la suite. El motivo debe decir qué falla y qué decisión falta.
3. **Agrega el registro de rojos conocidos** a tu README, con las tres columnas de la sección 2.5.
4. **Agrega la auditoría de dependencias** en un flujo propio, con `schedule` y `workflow_dispatch`, y
   ejecútala una vez a mano desde la pestaña **Actions**.
5. **Si tu proyecto tiene matriz de trazabilidad**, publícala en el resumen de cada ejecución.

**Pista:** si dudas entre omitir y marcar como falla esperada, pregúntate si la prueba describe un
defecto de tu sistema. Si lo describe, no se omite: una prueba omitida no se ejecuta, y un defecto que
no se ejecuta no se ve.

**Evidencia esperada:** una ejecución en verde con los motivos de cada falla esperada visibles en la
salida, el registro de rojos conocidos en el README, y una ejecución de la auditoría lanzada a mano.

## Preguntas guía

1. Un compañero consiguió el verde agregando `@pytest.mark.skip` a las dos pruebas que fallaban. Su
   pipeline está en verde, igual que el del proyecto de la clase. ¿Qué diferencia hay?

   **Pista:** revisa qué hace `pytest` con una prueba omitida y qué hace con una falla esperada.
   Pregúntate qué va a pasar el día que alguien corrija el defecto.

2. En el `pull request` número 1, el sistema mejoró y el pipeline se puso en rojo. ¿Tiene sentido que
   una mejora rompa el pipeline?

   **Pista:** relee qué afirmaba la marca antes de la corrección. Pregúntate qué afirmaría el
   repositorio si la marca se quedara.

3. La salida de Playwright dice `27 passed`. ¿Se puede escribir en un informe que las 27 pruebas de
   extremo a extremo pasan?

   **Pista:** busca las líneas marcadas con `✘` en la misma salida. Pregúntate qué parte del informe
   se tiene que leer para saber cuántas pasaron de verdad.

## Fuentes técnicas del bloque

- [pytest — How to use skip and xfail to deal with tests that cannot succeed](https://docs.pytest.org/en/stable/how-to/skipping.html) — la diferencia entre omitir y falla esperada, y el parámetro `strict`, citados literalmente; el parámetro `reason` y la opción `-r`.
- [Playwright — `test.fail`](https://playwright.dev/docs/api/class-test#test-fail) — la marca «debe fallar», citada literalmente, y las formas de declararla con detalles y anotaciones.
- [GitHub Docs — Events that trigger workflows](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows) — el evento `schedule`: el último commit de la rama principal, los retrasos en alta carga y la desactivación tras 60 días sin actividad en repositorios públicos; y el evento `workflow_dispatch`.
- [GitHub Docs — Workflow syntax for GitHub Actions](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax) — la sintaxis de `cron` en cinco campos, la hora universal por omisión y la opción `timezone`.
- [GitHub Docs — Workflow commands](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands) — el resumen de la ejecución con `GITHUB_STEP_SUMMARY`.
- [pip-audit](https://github.com/pypa/pip-audit) — la auditoría de dependencias de Python contra bases públicas de vulnerabilidades conocidas.
- Instrucciones de la Evaluación Final del módulo, sección 3.B — la justificación por escrito de toda prueba desactivada.
- Ejecuciones registradas para esta clase en el [repositorio del proyecto](https://github.com/Dieg0Code/reserva-laboratorio-pro402), con `pytest` 9.1.1, Playwright 1.63.0 y `pip-audit`: el pipeline en verde con `24 passed, 1 xfailed` y el motivo visible, y con `27 passed` en Playwright junto a las seis líneas marcadas con `✘`; el `pull request` número 1 con la corrección del `[object Object]`, en rojo con `Expected to fail, but passed` en los tres navegadores y en verde tras quitar la marca, abierto sin integrar; la ejecución doble por los eventos `push` y `pull_request`; y la auditoría de dependencias sin vulnerabilidades conocidas en sus ejecuciones por `push`, por `pull_request` y a mano con `workflow_dispatch`.

---

# BLOQUE 3: La prueba inestable en una suite que corre sola

- **Duración:** 20 minutos
- **Objetivo del bloque:** reconocer una prueba inestable cuando llega al pipeline, configurar los
  reintentos para que la **informen** en lugar de esconderla, y decidir qué hacer con ella. Al
  finalizar, el estudiante debe poder distinguir una prueba que falló de una inestable en la salida de
  Playwright, explicar por qué reintentar sin informar esconde defectos, medir la frecuencia con que
  falla una prueba y registrar la decisión tomada.
- **Modalidad:** exposición con ejecuciones reales en GitHub sobre un `pull request` de demostración,
  y aplicación individual sobre el proyecto propio.
- **Ritmo sugerido:** 4 minutos para qué cuesta una prueba inestable, 4 para el `pull request` que la
  trae, 7 para los reintentos y el bloqueo, 3 para medir, corregir y registrar, y 2 para el ejercicio.

## Desarrollo

### 3.1 Lo que cuesta una prueba inestable cuando todo corre solo

Una **prueba inestable** —en inglés, *flaky test*— es la que pasa y falla sin que el código cambie. La
sesión del lunes en la mañana mostró cómo nace: una prueba que esperaba un tiempo fijo, 400
milisegundos, antes de leer la pantalla, y que fallaba cuando la respuesta del servidor tardaba más.
En la máquina de quien la escribió pasaba diez de diez; con una red más lenta, fallaba entre tres y
cinco veces de cada diez. La corrección fue dejar de esperar un tiempo y esperar **la condición** que
se quería comprobar.

En una suite que se ejecuta a mano, una prueba inestable es una molestia. En una que se ejecuta sola,
decenas de veces al día y para todo el equipo, es otra cosa. Google publicó en 2016 lo que mide en su
propia integración continua:

> "Across our entire corpus of tests, we see a continual rate of about 1.5% of all test runs
> reporting a "flaky" result. We define a "flaky" test result as a test that exhibits both a passing
> and a failing result with the same code. […] Almost 16% of our tests have some level of flakiness
> associated with them!"
>
> — John Micco, *Flaky Tests at Google and How We Mitigate Them*, Google Testing Blog, 2016

En español: *en todo nuestro conjunto de pruebas vemos una tasa constante de alrededor del 1,5 % de
las ejecuciones con un resultado «inestable». Definimos un resultado inestable como el de una prueba
que muestra un resultado exitoso y uno fallido con el mismo código. […] ¡Casi el 16 % de nuestras
pruebas tiene algún grado de inestabilidad!* Y lo que eso produce en la práctica:

> "What we find in practice is that about 84% of the transitions we observe from pass to fail involve
> a flaky test! This causes extra repetitive work to determine whether a new failure is a flaky
> result or a legitimate failure. It is quite common to ignore legitimate failures in flaky tests due
> to the high number of false-positives."
>
> — John Micco, *Flaky Tests at Google and How We Mitigate Them*, Google Testing Blog, 2016

En español: *lo que encontramos en la práctica es que alrededor del 84 % de las transiciones que
observamos de verde a rojo involucran una prueba inestable. Eso obliga a un trabajo repetitivo extra
para determinar si una falla nueva es un resultado inestable o una falla legítima. Es bastante común
ignorar fallas legítimas en pruebas inestables por la gran cantidad de falsos positivos.* Un **falso
positivo**, aquí, es un rojo que no indica ningún defecto. Esa última oración es el problema entero:
una prueba inestable no solo molesta, **enseña a no creerle al rojo**. Y el día que el rojo es real,
nadie lo mira.

### 3.2 Una prueba nueva, un commit, dos resultados

Para ver cómo llega una prueba inestable al pipeline, se agregó al proyecto una prueba nueva y útil:
después de una reserva confirmada, el formulario tiene que quedar vacío para la siguiente. Se escribió
con el mismo error de la sesión del lunes, una espera fija:

```typescript
test("tras una reserva confirmada, el formulario queda vacío", async ({ page }) => {
  await reservarBloque4(page);

  await page.waitForTimeout(300);
  const nombre = await page.getByLabel("Nombre").inputValue();
  expect(nombre).toBe("");
});
```

`reservarBloque4` llena el formulario y aprieta «Reservar»; `inputValue()` lee lo que tiene escrito el
campo en ese instante. El servidor de pruebas agrega a cada respuesta una demora al azar de hasta 400
milisegundos, para imitar una red real, y el formulario se vacía recién cuando llega la respuesta.
Con 300 milisegundos de espera, a veces llega y a veces no.

La prueba se subió en una rama y se abrió el `pull request` número 2. Como el flujo se ejecuta por el
`push` y por el `pull request`, el **mismo commit** se probó dos veces:

| Evento | Resultado en Chromium | Pipeline |
|---|---|---|
| `push` | `✘` la prueba falló | Rojo |
| `pull_request` | `✓` la prueba pasó | Verde |

Mismo código, mismo servidor, mismos comandos: un rojo y un verde. La ejecución doble del bloque
anterior, que parecía un desperdicio, dejó a la vista la firma exacta de una prueba inestable. Quien
viera solo el rojo pensaría que la prueba encontró un defecto; quien viera solo el verde pensaría que
todo está bien. Ninguna de las dos lecturas es correcta.

### 3.3 Reintentar: la herramienta que informa y la que esconde

Playwright puede volver a ejecutar una prueba que falla. La documentación explica que, con los
reintentos activos, clasifica cada prueba en tres grupos:

> - "passed" - tests that passed on the first run;
> - "flaky" - tests that failed on the first run, but passed when retried;
> - "failed" - tests that failed on the first run and failed all retries.
>
> — Playwright, *Retries*

En español: *pasó: las que pasaron en el primer intento; inestable: las que fallaron en el primer
intento pero pasaron al reintentarlas; falló: las que fallaron en el primer intento y en todos los
reintentos.* Por omisión no reintenta nada. Se configura en `playwright.config.ts`:

```typescript
  retries: process.env.CI ? 2 : 0,
```

Una **variable de entorno** es un valor con nombre que el sistema operativo le entrega a cada
programa. `process.env.CI` lee la variable `CI`, que GitHub Actions define en sus servidores y que en
una máquina propia normalmente no existe. La forma `condición ? valor_si : valor_no` elige entre dos
valores: lo que va antes de `?` es la pregunta, lo que sigue es el valor si la respuesta es sí, y lo
que va después de `:`, el valor si es no. La línea se lee así: ¿se está ejecutando en integración
continua? Si es así, hasta dos reintentos; si no, ninguno. En la máquina propia conviene ver cada
falla tal como es.

Con esa línea se subió un commit más a la rama. Su ejecución por `push` mostró esto:

```text
  ✘   5 [chromium] › pruebas/espera.spec.ts:26:5 › tras una reserva confirmada, el formulario queda vacío (888ms)
  ✓   6 [chromium] › pruebas/espera.spec.ts:26:5 › tras una reserva confirmada, el formulario queda vacío (retry #1) (1.2s)
  ✘  16 [firefox] › pruebas/espera.spec.ts:26:5 › tras una reserva confirmada, el formulario queda vacío (1.7s)
  ✓  17 [firefox] › pruebas/espera.spec.ts:26:5 › tras una reserva confirmada, el formulario queda vacío (retry #1) (2.9s)
  ✘  27 [webkit] › pruebas/espera.spec.ts:26:5 › tras una reserva confirmada, el formulario queda vacío (1.9s)
  ✓  28 [webkit] › pruebas/espera.spec.ts:26:5 › tras una reserva confirmada, el formulario queda vacío (retry #1) (1.6s)
  3 flaky
  27 passed (1.3m)
```

La prueba falló en el primer intento y pasó en el primer reintento (`retry #1`), en los tres
navegadores, y Playwright la informó como **`3 flaky`**. Es exactamente lo que se quería: el resultado
ya no se confunde con un defecto ni con un verde limpio. Pero hay un problema, y está en el estado del
pipeline: la ejecución terminó en **verde**. Los reintentos informaron la inestabilidad y, al mismo
tiempo, la dejaron pasar. Un equipo apurado no lee la línea `3 flaky`; lee el verde. La ejecución
por `pull request` de ese mismo commit ni siquiera la mostró: la prueba pasó al primer intento en los
tres navegadores.

No todas las herramientas de reintento informan. Para `pytest`, que no reintenta por sí mismo, existe
un complemento muy usado, `pytest-rerunfailures`, y su ayuda se describe así:

```text
re-run failing tests to eliminate flaky failures:
  --reruns=RERUNS       number of times to re-run failed tests. defaults to 0.
```

En español: *volver a ejecutar las pruebas que fallan para eliminar las fallas inestables*. Eliminar
la falla no elimina la inestabilidad: la esconde. Y Google describe lo que ese mecanismo produce,
incluso en un equipo que lo usa con cuidado:

> "We even have a way to denote a test as flaky - causing it to report a failure only if it fails 3
> times in a row. This reduces false positives, but encourages developers to ignore flakiness in their
> own tests unless their tests start failing 3 times in a row, which is hardly a perfect solution."
>
> — John Micco, *Flaky Tests at Google and How We Mitigate Them*, Google Testing Blog, 2016

En español: *tenemos incluso una forma de marcar una prueba como inestable, con la que solo informa
una falla si falla tres veces seguidas. Eso reduce los falsos positivos, pero anima a quienes
desarrollan a ignorar la inestabilidad de sus propias pruebas mientras no fallen tres veces seguidas,
lo que dista de ser una solución perfecta.*

### 3.4 Que la inestable bloquee

Playwright tiene una opción para que una prueba inestable no pueda pasar:

```typescript
  retries: process.env.CI ? 2 : 0,
  failOnFlakyTests: !!process.env.CI,
```

`failOnFlakyTests` hace que la ejecución termine con error si alguna prueba quedó clasificada como
inestable. Los dos signos de exclamación convierten el valor de la variable en verdadero o falso:
verdadero si existe, falso si no. Con las dos líneas juntas, los reintentos siguen sirviendo para lo
que sirven —distinguir una inestable de una que falla siempre—, pero el pipeline ya no la acepta. El
mensaje deja de ser «hay un defecto» o «todo bien», y pasa a ser **«esta prueba no es confiable, y
así no entra»**.

Con esa opción se subió otro commit. Su ejecución por `pull request`:

```text
  ✘  15 [firefox] › pruebas/espera.spec.ts:26:5 › tras una reserva confirmada, el formulario queda vacío (1.9s)
  ✘  16 [firefox] › pruebas/espera.spec.ts:26:5 › tras una reserva confirmada, el formulario queda vacío (retry #1) (2.3s)
  ✓  17 [firefox] › pruebas/espera.spec.ts:26:5 › tras una reserva confirmada, el formulario queda vacío (retry #2) (2.4s)
  ✘  27 [webkit] › pruebas/espera.spec.ts:26:5 › tras una reserva confirmada, el formulario queda vacío (2.1s)
  ✘  28 [webkit] › pruebas/espera.spec.ts:26:5 › tras una reserva confirmada, el formulario queda vacío (retry #1) (1.7s)
  ✓  29 [webkit] › pruebas/espera.spec.ts:26:5 › tras una reserva confirmada, el formulario queda vacío (retry #2) (1.8s)
  2 flaky
  28 passed (1.5m)
```

`2 flaky`, y esta vez el pipeline quedó en **rojo**: el `pull request` quedó marcado con una revisión
fallida. En Firefox y WebKit la prueba falló dos veces seguidas y pasó recién al tercer intento; con un
reintento menos, habría figurado como una falla más. Que un rojo, además de avisar, **impida**
integrar es otra configuración, y es tema del bloque 4.

Pero la misma ronda tuvo otra ejecución, la del `push`, sobre el mismo commit:

```text
  30 passed (1.3m)
```

Verde, sin inestables: esa vez la prueba pasó al primer intento en los tres navegadores. **Una prueba
inestable no se deja ver en todas las ejecuciones.** Los reintentos y el bloqueo la atrapan cuando
falla; cuando por azar pasa, entra igual. Detectarla en el pipeline es una cuestión de probabilidad,
y por eso la configuración no reemplaza lo que viene: medir y corregir.

### 3.5 Medir, corregir y dejarlo por escrito

Para saber cuán inestable es una prueba no basta una ejecución. La opción `--repeat-each` de
Playwright la ejecuta muchas veces seguidas, y `--retries 0` apaga los reintentos para contar cada
falla tal como ocurre:

```bash
npx playwright test pruebas/espera.spec.ts -g "formulario" --project chromium --repeat-each 20 --retries 0
```

`-g` elige las pruebas cuyo título contiene ese texto, y `--project chromium`, un solo navegador. Dos
tandas de 20 ejecuciones en una máquina local dieron el mismo resultado:

```text
  7 failed
  13 passed (54.3s)
```

Siete de veinte: la prueba falla un 35 % de las veces. Cada falla muestra lo que ya se sabía:

```text
    Expected: ""
    Received: "Ana Rivas"
```

La prueba leyó el campo antes de que llegara la respuesta del servidor. La corrección es la misma de
la sesión del lunes, **esperar la condición** en lugar de un tiempo:

```typescript
test("tras una reserva confirmada, el formulario queda vacío", async ({ page }) => {
  await reservarBloque4(page);

  await expect(page.getByLabel("Nombre")).toHaveValue("");
});
```

`toHaveValue("")` vuelve a mirar el campo hasta que esté vacío o hasta que se acabe el plazo de
espera de Playwright —cinco segundos por omisión—, y solo falla en el segundo caso. Veinte ejecuciones en cada navegador, sin
reintentos:

```text
  20 passed (55.1s)
  20 passed (2.0m)
  20 passed (57.4s)
```

Con la corrección, el `pull request` pasó en verde sus dos ejecuciones, con `30 passed` y ninguna
inestable, y se integró a la rama principal. El proyecto ganó una prueba de regresión y una regla: una
prueba inestable no entra.

Queda el caso difícil: una prueba inestable que **no se puede corregir hoy**. La respuesta de muchos
equipos es la **cuarentena**: sacarla del camino que bloquea los cambios mientras alguien la corrige.
Google la usa, y advierte su costo:

> "Quarantining removes the test from the critical path and files a bug for developers to reduce the
> flakiness. This prevents it from becoming a problem for developers, but could easily mask a real race
> condition or some other bug in the code being tested."
>
> — John Micco, *Flaky Tests at Google and How We Mitigate Them*, Google Testing Blog, 2016

En español: *la cuarentena saca la prueba del camino crítico y registra un error para que se reduzca su
inestabilidad. Eso evita que se convierta en un problema para el equipo, pero podría esconder
fácilmente una condición de carrera real u otro defecto del código que se prueba.* Una **condición de
carrera** es el defecto de la sesión del lunes a las 11:00: el resultado depende de qué operación llega
primero. Y una prueba que pasa y falla sin motivo aparente puede estar señalando justamente eso.

Por eso una prueba inestable que se deja pendiente, igual que un rojo conocido, se registra por
escrito. Las instrucciones de la Evaluación Final piden las cuatro piezas:

> «Si alguna prueba es inestable, no se esconde. Se documenta cuál es, con qué frecuencia falla, qué
> se investigó sobre su causa y qué decisión se tomó.»
>
> — Instrucciones de la Evaluación Final, sección 3.B

Para la prueba de este bloque, el registro habría sido así:

| Prueba | Frecuencia | Causa investigada | Decisión |
|---|---|---|---|
| «tras una reserva confirmada, el formulario queda vacío» | 7 de 20 en Chromium, dos tandas | Espera fija de 300 ms contra una respuesta que tarda hasta 400 ms | Corregida: espera la condición con `toHaveValue`; 20 de 20 en los tres navegadores |

## Ejercicio del bloque

Sobre tu propio proyecto, con el pipeline de los bloques anteriores.

1. **Busca en tu suite de extremo a extremo** las esperas fijas (`waitForTimeout`) y las lecturas de
   un solo instante (`textContent()`, `inputValue()` seguidas de un `expect` sobre el valor leído).
   Son las candidatas a inestables.
2. **Mide las sospechosas** con `--repeat-each 20 --retries 0`, y anota cuántas veces falló cada una.
3. **Agrega a tu configuración** los reintentos solo en integración continua y `failOnFlakyTests`.
4. **Corrige** las que fallaron al menos una vez, y vuelve a medirlas.
5. **Registra** cualquier prueba inestable que no alcances a corregir, con las cuatro columnas de la
   sección 3.5.

**Pista:** si una prueba pasa 20 de 20 en tu máquina, prueba con la red más lenta. En este proyecto,
el servidor de pruebas agrega una demora al azar; en el tuyo, puedes demorar las respuestas con
`page.route`, la misma herramienta que cortó la red en la sesión del lunes, o ejecutar la medición en
el propio pipeline, que suele ser más lento que tu computador.

**Evidencia esperada:** la medición de cada prueba sospechosa, la configuración con reintentos y
bloqueo, y el registro de las inestables que queden, con su decisión.

## Preguntas guía

1. El `pull request` número 2 tuvo, sobre el mismo commit, un pipeline en rojo y uno en verde. ¿Cuál
   de los dos decía la verdad sobre la prueba?

   **Pista:** piensa qué afirma cada ejecución por separado y qué afirman las dos juntas. Pregúntate
   qué habría concluido alguien que solo vio una.

2. Con `retries: 2`, el pipeline quedó en verde y la salida decía `3 flaky`. Un compañero propone
   dejarlo así, porque «igual pasa». ¿Qué le falta a esa decisión?

   **Pista:** relee lo que Google cuenta sobre marcar pruebas que solo fallan tres veces seguidas.
   Pregúntate qué pasa el día que esa misma prueba falle por un defecto real.

3. Con `failOnFlakyTests`, una ejecución bloqueó la prueba y otra, sobre el mismo commit, la dejó pasar.
   ¿Sirve de algo la opción, si no la atrapa siempre?

   **Pista:** compara lo que hace la configuración con lo que hizo `--repeat-each`. Pregúntate cuál
   de las dos cosas se puede usar para afirmar que una prueba **no** es inestable.

## Fuentes técnicas del bloque

- [John Micco, *Flaky Tests at Google and How We Mitigate Them*, Google Testing Blog, 27 de mayo de 2016](https://testing.googleblog.com/2016/05/flaky-tests-at-google-and-how-we.html) — el 1,5 % de ejecuciones inestables, el 16 % de pruebas con algún grado de inestabilidad, el 84 % de transiciones de verde a rojo que involucran una prueba inestable, la marca de tres fallas seguidas y la cuarentena, citados literalmente.
- [Playwright — Retries](https://playwright.dev/docs/test-retries) — las tres categorías de resultado con reintentos, citadas literalmente, y la configuración de `retries`.
- [Playwright — `testConfig.failOnFlakyTests`](https://playwright.dev/docs/api/class-testconfig#test-config-fail-on-flaky-tests) — la opción que hace fallar la ejecución si alguna prueba resultó inestable.
- [Playwright — Command line](https://playwright.dev/docs/test-cli) — las opciones `--repeat-each`, `--retries`, `-g` y `--project`.
- [pytest-rerunfailures](https://github.com/pytest-dev/pytest-rerunfailures) — el complemento de reintentos para `pytest` y la descripción de su opción `--reruns`, tomada de su ayuda.
- Instrucciones de la Evaluación Final del módulo, sección 3.B — el registro de las pruebas inestables, citado literalmente.
- Ejecuciones registradas para esta clase en el [repositorio del proyecto](https://github.com/Dieg0Code/reserva-laboratorio-pro402), con Playwright 1.63.0 y `pytest-rerunfailures` 16.7: el `pull request` número 2 con la prueba de espera fija, en rojo por el `push` y en verde por el `pull request` sobre el mismo commit; con `retries: 2`, `3 flaky` y el pipeline en verde; con `failOnFlakyTests`, `2 flaky` y el pipeline en rojo, junto a una ejecución del mismo commit con `30 passed`; dos tandas locales de 20 ejecuciones en Chromium con 7 fallas cada una; la corrección con `toHaveValue` en 20 de 20 en los tres navegadores; y el `pull request` integrado con sus dos ejecuciones en `30 passed`.

---

# BLOQUE 4: Qué protege el pipeline

- **Duración:** 20 minutos
- **Objetivo del bloque:** comprobar qué protege realmente el pipeline, introduciendo defectos a
  propósito y observando qué hace con ellos. Al finalizar, el estudiante debe poder ensayar sobre su
  propio repositorio lo que describe la sección 6 de las instrucciones de la Evaluación Final —un
  agente abre un `pull request` con un defecto—, leer en qué etapa se detiene el pipeline y si el
  resultado se entiende sin abrir el código, reconocer un defecto que la suite no mira, y proteger la
  rama principal.
- **Modalidad:** ejecución en vivo con un agente y `pull request` reales, y ensayo individual sobre el
  proyecto propio.
- **Ritmo sugerido:** 3 minutos para el mecanismo, 5 para el primer defecto y cómo se lee, 3 para la
  protección de la rama, 6 para el defecto que pasa y la prueba que lo atrapa, y 3 para el ejercicio.

## Desarrollo

### 4.1 El ensayo: un agente introduce un defecto

Todo lo que se construyó hasta aquí se puede poner a prueba de una sola forma: metiendo un defecto a
propósito y mirando qué pasa. Es lo que describe la sección 6 de las instrucciones de la Evaluación
Final:

> «Durante la defensa se abre un `pull request` con un defecto introducido en tu sistema. Se observa
> qué hace tu pipeline: si lo bloquea, en qué etapa, y si el resultado permite entender qué se rompió
> sin abrir el código.»
>
> — Instrucciones de la Evaluación Final, sección 6

Las mismas instrucciones fijan las reglas del defecto: lo genera un agente, sale de un catálogo fijo,
es un solo cambio y toca algo que el proyecto declaró. Y se descarta si no altera el comportamiento
observable del sistema. El ensayo de esta sección usa esas mismas reglas sobre el proyecto de la
clase, y el ejercicio lo repite sobre el tuyo.

El pedido al agente, con permiso para leer y editar archivos, y sin permiso para ejecutar nada:

```bash
claude -p "Vas a introducir un defecto en este proyecto para comprobar si su pipeline de
integracion continua lo detecta.

Reglas:
1. Elige UN tipo de defecto de este catalogo fijo:
   a) invertir o desplazar una comparacion (por ejemplo < por <=, o > por >=);
   b) cambiar un numero limite de una regla;
   c) quitar una validacion;
   d) cambiar el valor que devuelve una funcion;
   e) cambiar el codigo de respuesta de la API.
2. El defecto debe tocar un comportamiento que declara REQUISITOS.md, y debe cambiar lo que el
   sistema hace de forma observable.
3. Haz exactamente un cambio, en el codigo de la aplicacion. No modifiques pruebas, configuracion
   ni documentacion.
4. Solo puedes leer y editar archivos; no puedes ejecutar nada.

Al terminar, responde en una sola linea: el archivo que cambiaste y la letra del catalogo que
usaste. No expliques que requisito rompiste." --allowed-tools "Read,Grep,Glob,Edit"
```

`claude -p` le entrega el pedido al agente y espera su respuesta, y `--allowed-tools
"Read,Grep,Glob,Edit"` le permite leer, buscar y editar archivos, y nada más. El pedido va sin tildes
porque se escribió así en la terminal. La respuesta fue una línea, `reservas.py — a`, y el cambio,
este:

```diff
 def bloque_valido(bloque: int) -> bool:
-    return BLOQUE_MIN <= bloque <= BLOQUE_MAX
+    return BLOQUE_MIN <= bloque < BLOQUE_MAX
```

Un solo carácter. Con `<` en lugar de `<=`, el bloque 8 deja de ser válido, y la jornada pasa a
tener siete bloques en lugar de los ocho que declara RF-01. Es un defecto de **valor límite**: el
sistema sigue funcionando para casi todo, y falla exactamente en el borde.

### 4.2 Cómo se lee lo que hizo el pipeline

Con el cambio en una rama se abrió el
[`pull request` número 3](https://github.com/Dieg0Code/reserva-laboratorio-pro402/pull/3). Las tres
preguntas de la sección 6, contestadas con lo que mostró el pipeline:

**¿Lo bloquea?** Lo detecta: un trabajo quedó en rojo. Si ese rojo además impide integrar el cambio
es otra pregunta, y la respuesta está en la sección 4.3.

```text
✓ Controles estáticos
X Pruebas de Python
✓ Pruebas de extremo a extremo
✓ Vulnerabilidades conocidas
```

**¿En qué etapa?** En las pruebas de Python. Los controles estáticos no podían verlo, porque el código
sigue siendo válido y ordenado; las de extremo a extremo tampoco, porque ninguna reserva el bloque 8.
Cada nivel mira una cosa distinta, y el defecto lo atrapó el único que miraba ese borde.

**¿Se entiende qué se rompió sin abrir el código?** La salida de `pytest`:

```text
______________________ test_limites_del_requisito[ultimo] ______________________
>       assert bloque_valido(bloque) is esperado
E       assert False is True
E        +  where False = bloque_valido(8)
___________________ test_regla_permitida_incluye_el_bloque_8 ___________________
>       assert puede_reservar(1, 8, tomado=False) is True
E       assert False is True
E        +  where False = puede_reservar(1, 8, tomado=False)
2 failed, 22 passed, 1 xfailed, 1 warning in 1.42s
```

Sí, y muy bien: los nombres de las pruebas y los valores dicen lo que pasó. `test_limites_del_requisito[ultimo]`
es la prueba de valores límite que se diseñó para RF-01, con el caso del último bloque; y
`bloque_valido(8)` devolvió `False`. Sin abrir el código se sabe que el bloque 8 dejó de ser válido.
Esa claridad no la puso el pipeline: la pusieron los nombres de las pruebas y la técnica con que se
eligieron sus casos. **El pipeline muestra lo que la suite sabe decir.**

Y esta ejecución dejó al descubierto un defecto del propio pipeline. En el bloque 2 se agregó
`-rxX` al comando de `pytest` para mostrar los motivos de las fallas esperadas, y el resumen final de
esta ejecución no listaba las dos pruebas que fallaron: esa opción **reemplaza** el resumen por
omisión en lugar de sumarse a él. Los nombres se encontraron en los encabezados de la salida, pero no
donde se buscan primero. Se corrigió a `-rfExX`, que conserva las fallas (`f`) y los errores (`E`)
del resumen por omisión y agrega las fallas esperadas (`x`) y las que pasaron inesperadamente (`X`):

```text
FAILED test_reservas.py::test_limites_del_requisito[ultimo] - assert False is True
FAILED test_reservas.py::test_regla_permitida_incluye_el_bloque_8 - assert False is True
```

Es la lección del bloque 1 otra vez, ahora con una prueba práctica: la configuración del pipeline es
código, y sus defectos aparecen usándola.

### 4.3 Un rojo que no impide integrar

El pipeline se puso en rojo, pero el `pull request` seguía pudiéndose integrar. GitHub lo informaba
con el estado `UNSTABLE`: hay revisiones fallidas, y el botón para integrar está disponible igual. Un
pipeline en rojo **avisa**; no **impide** nada por sí solo. Quien tenga apuro, integra.

Para que el rojo impida integrar, la rama principal se **protege**: se le exige a todo cambio que las
revisiones indicadas pasen antes de integrarse. Se configura en el repositorio, en **Settings →
Branches**, con una regla de protección para `main` que marque *Require status checks to pass before
merging* y elija las revisiones obligatorias. Cada revisión aparece para elegirla recién después de
que el pipeline se ejecutó al menos una vez. En el proyecto se eligieron los cuatro trabajos:
`Controles estáticos`, `Pruebas de Python`, `Pruebas de extremo a extremo` y `Vulnerabilidades
conocidas`. Se
marcó también que la regla valga para quien administra el repositorio, porque una regla que el dueño
se puede saltar no protege del dueño apurado.

Con la regla activa, el mismo `pull request` pasó de `UNSTABLE` a **`BLOCKED`**: ya no se puede
integrar mientras sus revisiones estén en rojo. Y la regla tiene una consecuencia más: nadie puede
subir cambios directamente a `main`. Un `push` directo, incluso del dueño del repositorio, recibe esto:

```text
remote: error: GH006: Protected branch update failed for refs/heads/main.
remote:
remote: - 4 of 4 required status checks are expected.
 ! [remote rejected] main -> main (protected branch hook declined)
```

En español: *falló la actualización de la rama protegida; se esperan las cuatro revisiones
obligatorias.* Todo cambio entra por un `pull request`, y todo `pull request` pasa por el pipeline.

### 4.4 El defecto que pasa

El segundo ensayo usó el mismo pedido con una sola diferencia: el defecto tenía que tocar el
requisito **RF-06**, que dice que una reserva aceptada devuelve un comprobante con el nombre, el RUT,
el correo y el bloque. La matriz de trazabilidad lo declara **cubierto**, con una prueba. El agente
respondió `reservas.py — d` e hizo este cambio:

```diff
 def comprobante(nombre: str, rut: str, correo: str, bloque: int) -> str:
-    return f"{nombre} | {rut} | {correo} | bloque {bloque}"
+    return f"{nombre} | {rut} | bloque {bloque}"
```

El comprobante ya no trae el correo. Es observable —la persona recibe un comprobante incompleto— y
contradice un requisito escrito. El
[`pull request` número 4](https://github.com/Dieg0Code/reserva-laboratorio-pro402/pull/4) quedó así:

```text
✓ Controles estáticos
✓ Pruebas de Python          24 passed, 1 xfailed
✓ Pruebas de extremo a extremo   30 passed
✓ Vulnerabilidades conocidas
```

Todo en verde, y con la rama protegida, en estado **`CLEAN`**: listo para integrarse. La protección
de la rama no lo detiene, porque solo exige que las pruebas pasen, y pasan. La razón está en la única
prueba de RF-06:

```python
@pytest.mark.requisito("RF-06")
def test_reserva_aceptada_responde_201(base_de_datos_de_prueba: Path) -> None:
    respuesta = cliente.post("/reservas", json=SOLICITUD)
    assert respuesta.status_code == 201
```

La prueba lleva la marca de RF-06, pero solo comprueba que la reserva se acepte. No mira el
comprobante. La sesión de esta mañana lo encontró reduciendo el comprobante a una constante; ahora,
un agente lo encontró quitándole un dato. Es el mismo hueco, y el pipeline no puede ver lo que
la suite no mira.

La prueba que faltaba afirma lo que el requisito dice:

```python
@pytest.mark.requisito("RF-06")
def test_el_comprobante_trae_nombre_rut_correo_y_bloque(base_de_datos_de_prueba: Path) -> None:
    comprobante = cliente.post("/reservas", json=SOLICITUD).json()["comprobante"]

    assert SOLICITUD["nombre"] in comprobante
    assert SOLICITUD["rut"] in comprobante
    assert SOLICITUD["correo_electronico"] in comprobante
    assert f"bloque {SOLICITUD['bloque']}" in comprobante
```

`.json()["comprobante"]` toma el campo `comprobante` de la respuesta, y cada `assert` exige que uno
de los cuatro datos esté dentro de él. Contra el código correcto, la prueba pasa. Contra el código
del agente, ejecutando solo el archivo de pruebas de la API, falla y dice exactamente qué falta:

```text
E       AssertionError: assert 'ana.rivas@ejemplo.cl' in 'Ana Rivas | 11.111.111-1 | bloque 4'
FAILED test_api.py::test_el_comprobante_trae_nombre_rut_correo_y_bloque - AssertionError: assert 'ana.rivas@ejemplo.cl' in 'Ana Ri...
1 failed, 4 passed, 1 warning in 0.77s
```

La prueba se propuso en el
[`pull request` número 5](https://github.com/Dieg0Code/reserva-laboratorio-pro402/pull/5), que pasó
sus revisiones y se integró a `main`, donde la suite de Python quedó en `25 passed, 1 xfailed`.

Con la prueba ya en `main`, el `pull request` número 4 —el mismo defecto, sin tocar— se volvió a
ejecutar. Para eso se cerró y se reabrió: el evento `pull_request` se dispara de nuevo y prueba el
cambio combinado con la rama principal **actual**, mientras que repetir la ejecución anterior habría
vuelto a probar la combinación vieja. El resultado:

```text
E       AssertionError: assert 'ana.rivas@ejemplo.cl' in 'Ana Rivas | 11.111.111-1 | bloque 4'
FAILED test_api.py::test_el_comprobante_trae_nombre_rut_correo_y_bloque - AssertionError: assert 'ana.rivas@ejemplo.cl' in 'Ana Rivas | 11.111.111-1 | bloque 4'
1 failed, 24 passed, 1 xfailed, 1 warning in 0.86s
```

Y el estado del `pull request` pasó de `CLEAN` a **`BLOCKED`**. El defecto no cambió; cambió lo que la
suite mira.

### 4.5 Lo que el ensayo enseña

Los dos defectos eran del mismo tamaño —un carácter, un dato— y tuvieron destinos opuestos. El
primero cayó en un borde que la técnica de valores límite había mandado probar. El segundo cayó en un
requisito que la matriz declaraba cubierto con una prueba que no miraba lo que el requisito dice.

Un pipeline en verde afirma una sola cosa: **que ninguna de las pruebas que existen falló**. No afirma
que el sistema no tenga defectos. Lo que decide cuánto vale ese verde está antes del pipeline: en qué
pruebas se escribieron, con qué técnica se eligieron sus casos y qué afirma cada una. El pipeline
solo se asegura de que todo eso se ejecute siempre y de que nadie integre un rojo.

Por eso el ensayo sirve más antes que durante. Hacerlo sobre el propio repositorio, antes de que lo
haga otra persona, es la forma más directa de encontrar los requisitos que tu matriz declara cubiertos
y tu suite no mira.

## Ejercicio del bloque

Sobre tu propio proyecto, con el pipeline de los bloques anteriores.

1. **Protege la rama principal** con las revisiones de tu pipeline como obligatorias, y marca que la
   regla valga también para quien administra el repositorio.
2. **Pide a un agente un defecto**, con el pedido de la sección 4.1 y permiso solo para leer y editar,
   en una rama nueva. Revisa el cambio antes de subirlo: si no altera nada observable o toca algo que
   no declaraste, descártalo y pide otro.
3. **Abre el `pull request`** y contesta por escrito las tres preguntas: ¿lo bloquea?, ¿en qué etapa?,
   ¿se entiende qué se rompió sin abrir el código?
4. **Repítelo dos veces más.** Si algún defecto pasa, escribe la prueba que lo habría atrapado y súbela
   por su propio `pull request`.
5. **Cierra los `pull request` con defectos sin integrarlos.**

**Pista:** para decidir dónde pedirle el defecto al agente, mira tu matriz de trazabilidad y elige un
requisito que figure como cubierto con una sola prueba. Pregúntate si esa prueba afirma lo que el
requisito dice o solo algo cercano.

**Evidencia esperada:** la regla de protección de tu rama principal, tres `pull request` con un
defecto cada uno y las tres respuestas escritas para cada uno, y la prueba nueva de cada defecto que
haya pasado.

## Preguntas guía

1. El defecto del bloque 8 lo atrapó `pytest`, y las pruebas de extremo a extremo quedaron en verde.
   ¿Faltaba una prueba de extremo a extremo que reservara el bloque 8?

   **Pista:** piensa qué nivel es el más barato para probar un borde de una regla. Pregúntate qué
   agregaría una prueba en el navegador a lo que ya dice `test_limites_del_requisito[ultimo]`.

2. El `pull request` número 4 estaba en verde y en estado `CLEAN`. ¿Falló la protección de la rama?

   **Pista:** relee qué exige exactamente la regla de protección. Pregúntate en qué parte del proyecto
   estaba el hueco.

3. La matriz de trazabilidad decía que RF-06 estaba cubierto. ¿Mentía?

   **Pista:** revisa qué cuenta la matriz y qué afirma la prueba que cuenta. Pregúntate qué tendría que
   leer alguien, además de la matriz, para saber si un requisito está bien cubierto.

## Fuentes técnicas del bloque

- Instrucciones de la Evaluación Final del módulo, sección 6 — el `pull request` con un defecto introducido por un agente, las tres preguntas que se observan y las reglas del defecto, citadas y resumidas.
- [GitHub Docs — About protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches) — la exigencia de revisiones aprobadas antes de integrar y su aplicación a quienes administran el repositorio.
- [pytest — Command-line flags](https://docs.pytest.org/en/stable/reference/reference.html#command-line-flags) — la opción `-r` y los caracteres que eligen qué resultados se resumen.
- Ejecuciones registradas para esta clase en el [repositorio del proyecto](https://github.com/Dieg0Code/reserva-laboratorio-pro402), con `claude -p` y herramientas restringidas a leer y editar: el `pull request` número 3 con el defecto `<` en `bloque_valido`, en rojo solo en `pytest` con `2 failed, 22 passed, 1 xfailed`, primero en estado `UNSTABLE` y `BLOCKED` tras proteger la rama; el `push` directo a `main` rechazado con `GH006`; el resumen de `pytest` sin las fallas con `-rxX` y con ellas tras cambiarlo a `-rfExX`; el `pull request` número 4 con el comprobante sin el correo, en verde en los cuatro trabajos y en estado `CLEAN`; la prueba nueva de RF-06 en verde contra el código correcto y en rojo contra el del agente; el `pull request` número 5 que la propone, integrado con la suite de `main` en `25 passed, 1 xfailed`; y el `pull request` número 4 reabierto contra esa `main`, en rojo con `1 failed, 24 passed, 1 xfailed` y en estado `BLOCKED`.

---

# Cierre: lo que nadie ejecuta no existe

## 1. Lo que cada pieza del pipeline puede afirmar

| Pieza | Qué puede afirmar | Qué no puede afirmar |
|---|---|---|
| **Controles estáticos** | Que el código cumple las reglas de `ruff` y los tipos de `pyrefly` | Que haga lo correcto |
| **Suites en el pipeline** | Que ninguna prueba existente falló sobre este cambio, en un entorno limpio | Que el sistema no tenga defectos que ninguna prueba mira |
| **Falla esperada estricta** | Que un defecto conocido sigue ahí, con su motivo y su decisión pendiente | Nada sobre los defectos que no se conocen |
| **Reintentos con bloqueo** | Que una prueba resultó inestable en esta ejecución | Que una prueba **no** es inestable: eso solo lo dice medirla |
| **Auditoría programada** | Que hoy no hay vulnerabilidades conocidas en las dependencias | Qué se va a publicar mañana |
| **Matriz en cada ejecución** | Qué requisitos tienen pruebas marcadas y cuáles no | Que esas pruebas afirmen lo que el requisito dice |
| **Protección de la rama** | Que nada entra a `main` con una revisión en rojo | Que lo que entra en verde esté bien |

Las siete filas tienen la misma forma que la tabla con que cerró la sesión del lunes a las 11:00: cada
herramienta afirma algo preciso y deja algo afuera. La columna de la derecha es el trabajo que sigue
siendo de una persona.

## 2. El recorrido del módulo

El módulo empezó con una pregunta que parecía simple: ¿cómo se sabe que un software es de calidad? La
respuesta se fue construyendo por capas, cada una sobre la anterior:

1. **Un criterio**: una norma internacional, ISO/IEC 25010, para decir qué significa calidad y contra
   qué se mide.
2. **Una línea base**: un entorno que cualquiera puede reproducir y controles estáticos en verde.
3. **Casos con método**: particiones, valores límite y tablas de decisión, para que cada prueba se
   pueda defender.
4. **Tres niveles**: unitarias, de integración y de extremo a extremo, porque un sistema falla en tres
   lugares distintos.
5. **Lo que el sistema hace además de funcionar**: rendimiento, seguridad, accesibilidad y
   portabilidad, cada una con un umbral fijado antes de medir.
6. **Un plan**: qué se prueba, por qué y con qué prioridad, con una trazabilidad que se ejecuta.
7. **Hoy**: que todo eso se ejecute solo, ante cada cambio, y que un rojo impida integrar.

En cada capa apareció un agente, y en cada capa pasó lo mismo: propuso rápido y bien, y algunas de sus
afirmaciones resultaron falsas o inverificables hasta que alguien las ejecutó. El criterio para
decidir cuáles creer nunca fue del agente.

## 3. Mañana: el corte

Mañana es la fecha de corte de la Evaluación Final. Esta es la lista para revisar esta noche sobre tu
propio repositorio, tomada de lo que piden las instrucciones:

- **El pipeline** se dispara ante cada `push` y cada `pull request`, ejecuta los controles estáticos y
  los tres niveles de la suite, y su última ejecución sobre la rama principal está en verde.
- **Hay historial**: más de una ejecución, que muestre el trabajo. Un pipeline que solo estuvo en
  verde una vez baja la evaluación.
- **Cada rojo conocido** está marcado como falla esperada, con su motivo, y registrado por escrito.
  Ninguna prueba está borrada ni omitida para llegar al verde.
- **Cada prueba inestable** está corregida o registrada: cuál es, con qué frecuencia falla, qué se
  investigó y qué se decidió.
- **Las pruebas no funcionales**, al menos tres categorías, tienen el umbral escrito **antes** de la
  medición.
- **El plan de pruebas** está cerrado, con la trazabilidad completa hasta el resultado en el pipeline.
- **La sección de uso de agentes** cierra con el balance del módulo: qué delegaste, qué auditaste, qué
  propuso un agente que resultó estar mal, y qué decisiones son tuyas.
- **No hay datos personales reales** en el repositorio: ni en las pruebas, ni en los datos de prueba,
  ni en las capturas.
- **El README** permite instalar, ejecutar y probar el proyecto completo a alguien que no seas tú.

Si no alcanzas a todo, ordena el trabajo por el peso que tiene en la evaluación. La integración
continua vale un 25 %; las pruebas no funcionales, un 20 %; la regresión y las pruebas inestables, un
15 %; el plan cerrado y el balance del trabajo con agentes, un 10 % cada uno. Un pipeline que se
ejecuta y dice la verdad es lo primero.

El 20 % restante es la defensa, y no se prepara esta noche escribiendo: se prepara **entendiendo** lo
que ya está escrito. Las instrucciones dan ejemplos del tipo de pregunta, y todos se contestan
mirando el propio proyecto:

- ¿Qué prueba de esta suite es la que más te costó escribir, y por qué?
- ¿Qué parte de tu sistema sigue sin estar cubierta, y qué riesgo aceptaste al dejarla así?
- Este umbral de rendimiento, ¿de dónde salió?
- Si mañana alguien cambia esta función, ¿qué se pone rojo?
- ¿Qué te dijo un agente durante el módulo que resultó estar equivocado, y cómo te diste cuenta?

Hazte esas preguntas esta noche frente a tu repositorio. Y haz el ensayo del bloque 4: si un defecto
pasa tu pipeline, es mucho mejor que lo descubras tú.

## 4. Ticket de salida

En tres líneas, antes de salir:

1. El enlace a la pestaña **Actions** de tu repositorio, y el estado de la última ejecución.
2. Un rojo de tu pipeline que clasificaste —del sistema, del proyecto o del pipeline— y qué hiciste
   con él.
3. Un requisito de tu matriz que figura como cubierto y del que, después de hoy, no estás seguro.

## Mensaje final

Todo lo que el módulo construyó tenía un punto débil que no se veía mientras se construía: dependía de
que alguien se acordara. La sesión de hoy lo cambió de lugar. Ahora la suite se ejecuta sola, los
defectos conocidos quedan a la vista con su motivo, una prueba inestable no entra, y un rojo no se
puede integrar.

> Un pipeline en verde no dice que el sistema funcione: dice que ninguna de las pruebas que existen
> falló. Lo que vale ese verde lo deciden las pruebas que se escribieron, los casos que se eligieron y
> lo que cada una afirma. La infraestructura hace que todo eso se ejecute siempre; decidir qué hay que
> ejecutar sigue siendo trabajo de quien firma.

## Fuentes de síntesis

- [ISTQB Certified Tester Foundation Level Syllabus v4.0.1](https://astqb.org/assets/documents/ISTQB_CTFL_Syllabus_v4.0.1.pdf) — las pruebas de confirmación y de regresión, y su automatización en integración continua (sección 2.2.3).
- [GitHub Docs — GitHub Actions](https://docs.github.com/en/actions) — los flujos de trabajo, sus eventos y la protección de ramas.
- [John Micco, *Flaky Tests at Google and How We Mitigate Them*, 2016](https://testing.googleblog.com/2016/05/flaky-tests-at-google-and-how-we.html) — el costo de las pruebas inestables en integración continua.
- Instrucciones de la Evaluación Final del módulo — los requisitos del pipeline, de la regresión y de las pruebas inestables, los pesos de cada criterio y la defensa.
