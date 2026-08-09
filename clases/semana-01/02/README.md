# Clase 02 - Semana 01 - Tu primera evidencia: entorno reproducible y primer test

- **Unidad:** 01 · Calidad y Testing de Software
- **Fecha:** Martes 11 de agosto de 2026
- **Duración:** 3 horas pedagógicas · 140 minutos (08:30 - 10:50)
- **Modalidad:** Presencial en Laboratorio PC
- **Docente:** Diego Obando

---

# Objetivos de la Clase

## Objetivo General

Al finalizar esta sesión, el estudiante será capaz de construir una primera evidencia técnica y
repetible de que un programa cumple un comportamiento esperado. Para ello, configurará un proyecto
Python reproducible con `uv`, distinguirá el propósito de `ruff`, `pyrefly` y `pytest`, escribirá
una prueba automatizada sobre la función `nota_final()` trabajada en la clase anterior e
interpretará el ciclo entre una prueba que falla, el diagnóstico del defecto y su ejecución final
en verde.

## Objetivos Específicos

1. **Crear un proyecto Python reproducible con `uv`**, identificando el propósito de
   `pyproject.toml`, `uv.lock` y el entorno virtual como piezas que permiten ejecutar el mismo
   proyecto bajo condiciones controladas.
2. **Distinguir qué pregunta responde cada herramienta del entorno**, diferenciando gestión de
   dependencias, análisis estático, verificación de tipos y pruebas de comportamiento, sin asumir
   que una herramienta en verde garantiza por sí sola la calidad completa del programa.
3. **Ejecutar controles iniciales con `ruff` y `pyrefly`**, leyendo sus mensajes y relacionando
   cada hallazgo con una categoría concreta de problema antes de modificar el código.
4. **Escribir y ejecutar una primera prueba automatizada con `pytest`**, usando nombres
   descriptivos y una aserción que documente un comportamiento esperado de `nota_final()`.
5. **Interpretar una prueba fallida como evidencia diagnóstica**, identificando el valor esperado,
   el valor obtenido y la línea relevante, para corregir la causa del defecto y comprobar el cambio
   mediante una nueva ejecución en verde.
6. **Usar un agente de IA como apoyo supervisado para ampliar casos de prueba**, evaluando cada
   propuesta según el riesgo que cubre y justificando qué se acepta, modifica o rechaza.

## Competencias Transversales

- **Reproducibilidad técnica:** preparar un entorno que otra persona pueda reconstruir y ejecutar,
  en lugar de depender de configuraciones invisibles de un solo computador.
- **Lectura diagnóstica:** interpretar la salida de una herramienta antes de intentar corregir por
  ensayo y error.
- **Comunicación técnica:** explicar qué verifica cada control, qué hallazgo produjo y qué evidencia
  permite sostener una conclusión.
- **Criterio frente a la automatización:** aprovechar propuestas de un agente sin confundir cantidad
  de casos generados con calidad de la verificación.

---

# Mapa de la Clase

| Horario | Sección | Propósito |
|---------|---------|-----------|
| 08:30 - 08:40 | Encuadre | Retomar el defecto de `nota_final()` descubierto en la clase anterior y formular el desafío: convertir un hallazgo manual en evidencia repetible. |
| 08:40 - 09:10 | Bloque 1 | Crear un proyecto reproducible con `uv`, declarar las herramientas de desarrollo e interpretar la estructura inicial del entorno. |
| 09:10 - 09:35 | Bloque 2 | Distinguir las cuatro capas de control —entorno, linting, tipos y comportamiento— y ejecutar las primeras verificaciones con `ruff` y `pyrefly`. |
| 09:35 - 09:45 | Pausa | Descanso técnico. |
| 09:45 - 10:15 | Bloque 3 | Escribir la primera prueba con `pytest`, reproducir el defecto de redondeo, interpretar la falla y completar el ciclo hasta obtener verde. |
| 10:15 - 10:40 | Bloque 4 | Evaluar casos sugeridos por un agente, introducir problemas controlados y predecir qué herramienta debería detectar cada uno. |
| 10:40 - 10:50 | Cierre | Ejecutar los controles finales, explicar qué demuestra cada resultado y conectar la evidencia obtenida con la calidad definida por estándares. |

---

# BLOQUE 1: Un entorno también es evidencia

- **Duración:** 30 minutos
- **Objetivo del bloque:** crear un proyecto Python reproducible con `uv`, declarar las herramientas
  de desarrollo e interpretar la función de los archivos que controlan el entorno. Al finalizar,
  el estudiante debe poder explicar por qué «funciona en mi computador» no constituye evidencia
  suficiente y distinguir qué partes del proyecto se comparten de cuáles se reconstruyen.
- **Modalidad:** demostración guiada en terminal y trabajo simultáneo de los estudiantes en sus
  equipos.

## Desarrollo

### 1.1 El problema anterior sigue incompleto

En la clase anterior descubrimos que `nota_final()` podía producir un resultado incorrecto aunque
el código se viera limpio y funcionara con varios ejemplos. El hallazgo fue importante, pero todavía
depende de condiciones que no hemos controlado:

- qué versión de Python ejecutó la función;
- qué herramientas estaban instaladas;
- qué dependencias tenía ese computador;
- y qué pasos exactos tendría que repetir otra persona.

Si copiamos solamente el archivo `.py` y en otro equipo no se puede ejecutar, la verificación no es
repetible. Y si para hacerlo funcionar debemos recordar de memoria qué instalar, tampoco tenemos un
proceso confiable.

La primera evidencia de calidad no aparece todavía en una prueba. Aparece cuando el proyecto puede
responder esta pregunta:

> Si otra persona recibe esta carpeta, ¿puede reconstruir las mismas condiciones sin adivinar qué
> tenía instalado mi computador?

Un entorno reproducible no demuestra que el comportamiento sea correcto. Demuestra algo previo y
necesario: que todos estamos observando el programa bajo condiciones controladas.

### 1.2 Comprobación inicial del laboratorio

Antes de crear archivos, comprobamos que `uv` esté disponible. En PowerShell:

```powershell
uv --version
```

El resultado debe mostrar una versión instalada, no un mensaje indicando que el comando es
desconocido. No es necesario que todos tengan exactamente la misma versión de `uv`: la herramienta
es un requisito externo, mientras que la versión esperada de Python y las dependencias del proyecto
quedarán registradas más adelante en sus archivos.

Si el comando no existe, se utiliza el método oficial para Windows mediante WinGet:

```powershell
winget install --id=astral-sh.uv -e
```

Después de instalar, se cierra y vuelve a abrir la terminal antes de repetir `uv --version`. La
instalación es una contingencia, no el contenido central del bloque: quien ya tiene la herramienta
lista ayuda a comprobar el equipo de un compañero, pero no avanza solo a la siguiente actividad.

### 1.3 Crear el proyecto desde una instrucción reproducible

Creamos un proyecto nuevo y entramos en su carpeta:

```powershell
uv init evidencia-testing
cd evidencia-testing
```

`uv init` no descarga una aplicación terminada. Crea una estructura mínima y explícita sobre la que
podemos trabajar. Para comprobar qué apareció, ejecutamos:

```powershell
Get-ChildItem -Force
```

La estructura inicial debería contener, como mínimo:

```text
evidencia-testing/
├── .gitignore
├── .python-version
├── README.md
├── main.py
└── pyproject.toml
```

Ejecutamos el programa inicial sin activar manualmente ningún entorno:

```powershell
uv run main.py
```

La primera ejecución puede descargar Python y crear recursos locales. Esa demora inicial no es una
falla: `uv` está construyendo las condiciones declaradas por el proyecto. Las ejecuciones siguientes
reutilizan ese entorno.

El detalle importante es `uv run`. El comando no pregunta qué Python aparece primero en el sistema
ni confía en que alguien haya activado correctamente un entorno. Busca el proyecto, sincroniza lo
necesario y ejecuta dentro de su contexto.

### 1.4 Declarar las herramientas del módulo

Ahora incorporamos las tres herramientas que utilizaremos durante esta primera etapa:

```powershell
uv add --dev pytest ruff pyrefly
```

La opción `--dev` indica que son dependencias necesarias para desarrollar y verificar el proyecto,
pero no forman parte del comportamiento que recibiría una persona usuaria. `uv` actualiza la
declaración del proyecto, resuelve versiones compatibles y sincroniza el entorno local.

Volvemos a revisar la carpeta:

```powershell
Get-ChildItem -Force
```

Ahora aparecen dos piezas nuevas:

- `.venv/`: entorno local donde se instalan Python y las dependencias necesarias para trabajar;
- `uv.lock`: resolución exacta de las versiones compatibles que permiten reconstruir el entorno.

Para observar dónde quedaron declaradas las herramientas, abrimos el archivo principal:

```powershell
Get-Content pyproject.toml
```

En su grupo de dependencias de desarrollo deben aparecer `pytest`, `ruff` y `pyrefly`. Las versiones
concretas pueden variar según la fecha de la clase; lo importante es que ya no dependen de nuestra
memoria ni de instalaciones invisibles.

### 1.5 Qué se comparte y qué se reconstruye

No todos los archivos cumplen la misma función. Esta distinción evita dos errores frecuentes:
enviar una carpeta gigantesca con el entorno completo o compartir solo el código y omitir las
condiciones necesarias para ejecutarlo.

- `pyproject.toml` **se comparte**: declara el proyecto, la versión de Python admitida y sus
  dependencias.
- `uv.lock` **se comparte**: registra la resolución concreta necesaria para reconstruir el mismo
  conjunto de dependencias.
- `.python-version` **se comparte**: deja visible qué versión de Python espera el proyecto.
- `.venv/` **no se comparte**: contiene archivos locales, rutas y ejecutables propios del sistema;
  se reconstruye mediante `uv`.
- el código fuente **se comparte**: es el comportamiento que más adelante someteremos a pruebas.

Una forma útil de recordarlo es esta:

> Compartimos la receta y la lista exacta de ingredientes; no enviamos la cocina completa.

### 1.6 Punto de control

Antes de cerrar el bloque, cada estudiante comprueba tres cosas:

```powershell
uv run main.py
Get-Content pyproject.toml
Get-ChildItem -Force
```

El punto de control está completo cuando:

1. `uv run main.py` ejecuta el programa inicial;
2. `pyproject.toml` declara `pytest`, `ruff` y `pyrefly` como herramientas de desarrollo;
3. la carpeta contiene `uv.lock` y `.venv`;
4. el estudiante puede explicar por qué el primero se comparte y el segundo se reconstruye.

Si algo falla, no se borra el proyecto para empezar de nuevo. Se lee el mensaje, se identifica qué
comando produjo el problema y se registra la corrección. Aprender a conservar el contexto de una
falla es parte del trabajo técnico que comienza en esta clase.

## Preguntas guía

1. **¿Por qué necesitamos `uv.lock` si `pyproject.toml` ya enumera las dependencias?**  
   **Pista:** distingue entre la versión que el proyecto permite solicitar y la versión concreta
   que finalmente fue resuelta.
2. **¿Por qué no conviene subir o enviar la carpeta `.venv` junto con el proyecto?**  
   **Pista:** piensa qué elementos de esa carpeta podrían depender del sistema operativo, las rutas
   locales o el computador donde fue creada.
3. **Si `uv run main.py` termina correctamente, ¿ya demostramos que `nota_final()` calcula bien?**  
   **Pista:** separa las condiciones necesarias para ejecutar de la evidencia sobre el
   comportamiento ejecutado.

## Cierre del bloque

- **Idea clave:** un entorno reproducible no prueba que el programa sea correcto, pero elimina la
  incertidumbre sobre dónde y con qué se está ejecutando. Sin esa base, dos personas pueden observar
  resultados distintos y atribuirlos equivocadamente al código.
- **Evidencia producida:** un proyecto ejecutable con sus dependencias declaradas, una resolución
  registrada en `uv.lock` y un entorno local que puede reconstruirse.
- **Puente:** ya controlamos las condiciones de ejecución. En el siguiente bloque separaremos las
  preguntas que responden `ruff`, `pyrefly` y `pytest`, porque que el entorno funcione no significa
  todavía que el código esté limpio, que sus tipos sean coherentes ni que su comportamiento sea el
  esperado.

### Fuentes técnicas del bloque

- [Instalación oficial de uv](https://docs.astral.sh/uv/getting-started/installation/)
- [Creación de proyectos con `uv init`](https://docs.astral.sh/uv/concepts/projects/init/)
- [Estructura, entorno y archivo `uv.lock`](https://docs.astral.sh/uv/concepts/projects/layout/)

---

# BLOQUE 2: Cuatro capas, evidencias distintas

- **Duración:** 25 minutos
- **Objetivo del bloque:** distinguir qué pregunta responde cada herramienta del entorno y ejecutar
  las primeras verificaciones estáticas sobre un archivo real. Al finalizar, el estudiante debe
  poder interpretar un hallazgo de `ruff`, diferenciarlo de un error de tipos detectado por
  `pyrefly` y explicar por qué ambos controles pueden quedar en verde mientras el comportamiento
  continúa siendo incorrecto.
- **Modalidad:** demostración guiada con predicción antes de ejecutar, corrección mínima y repetición
  de cada control en los equipos de los estudiantes.

## Desarrollo

### 2.1 «Verde» siempre necesita apellido

En el bloque anterior logramos ejecutar el proyecto con `uv`. Ese resultado es una evidencia útil,
pero responde una sola pregunta: **¿podemos reconstruir y ejecutar el entorno?** No nos dice todavía
si el código está limpio, si sus tipos son coherentes ni si hace lo que debería.

Durante el módulo utilizaremos controles que se complementan porque observan problemas distintos:

```text
ENTORNO             CÓDIGO              CONTRATOS            COMPORTAMIENTO
uv                  ruff                pyrefly               pytest
¿se reproduce?  →   ¿hay señales de  →  ¿los tipos son    →  ¿hace lo esperado?
                        problema?           coherentes?
```

Una herramienta en verde no invalida la necesidad de la siguiente. Cada resultado debe leerse con
su apellido:

- «el entorno está sincronizado»;
- «Ruff no encontró infracciones entre las reglas activas»;
- «Pyrefly no encontró inconsistencias de tipos bajo su configuración»;
- «las pruebas ejecutadas cumplieron sus expectativas».

Ninguna de esas frases significa por sí sola «el sistema es correcto». Incluso la última queda
limitada por los casos que realmente fueron escritos y ejecutados.

### 2.2 Preparar un archivo con dos problemas diferentes

En la raíz de `evidencia-testing`, creamos `notas.py` con una versión deliberadamente defectuosa:

```python
import math


def nota_final(notas: list[float]) -> float:
    """Calcula la nota final como el promedio redondeado a un decimal."""
    promedio: str = sum(notas) / len(notas)
    return round(promedio, 1)
```

Antes de ejecutar cualquier herramienta, hacemos dos predicciones:

1. ¿Qué línea parece innecesaria?
2. ¿Qué afirmación del código contradice el valor que realmente se asigna a `promedio`?

El propósito no es adivinar el texto exacto de los mensajes. Es aprender a formular una hipótesis
antes de recibir la respuesta de la herramienta. Sin predicción, ejecutar controles puede
convertirse en una rutina mecánica de «copiar error, pegar en un agente y aceptar la corrección».

### 2.3 Primera capa estática: Ruff

Ejecutamos el linter desde el entorno del proyecto:

```powershell
uv run ruff check .
```

Ruff debería señalar que `math` fue importado, pero nunca utilizado. El diagnóstico contiene cuatro
piezas que debemos aprender a leer:

```text
notas.py:1:8
│        │
│        └── columna aproximada del hallazgo
└─────────── archivo y línea

F401  `math` imported but unused
│      └── explicación breve
└───────── identificador de la regla
```

Ruff no está afirmando que la función calcule bien. Está informando que encontró una señal concreta
de código innecesario bajo las reglas activas.

Corregimos únicamente ese hallazgo eliminando `import math` y volvemos a ejecutar exactamente el
mismo comando:

```powershell
uv run ruff check .
```

La segunda ejecución debe quedar en verde. Repetir el control es indispensable: editar el archivo
no constituye evidencia de que el problema desapareció. La evidencia aparece cuando el mismo
mecanismo que detectó el hallazgo deja de detectarlo después de la corrección.

Sin embargo, el archivo aún contiene esta línea:

```python
promedio: str = sum(notas) / len(notas)
```

Ruff puede quedar conforme porque esa contradicción pertenece a otra capa. Su trabajo no es validar
todo el sistema de tipos de Python.

### 2.4 Segunda capa estática: Pyrefly

Inicializamos una configuración explícita de tipos para el proyecto. Este comando se ejecuta una
sola vez:

```powershell
uv run pyrefly init
```

Según la estructura encontrada, Pyrefly puede actualizar `pyproject.toml` o crear un archivo de
configuración propio. En ambos casos, el objetivo es dejar visible y compartible el criterio con el
que se verifican los tipos.

Como el archivo ya contiene una contradicción, Pyrefly puede preguntar si queremos agregar
supresiones para ocultar los errores existentes. Respondemos `N`: el objetivo de esta actividad es
leer y corregir el problema, no enseñar a la herramienta a ignorarlo.

Ejecutamos el análisis:

```powershell
uv run pyrefly check
```

Pyrefly debería mostrar que el resultado numérico de `sum(notas) / len(notas)` no puede asignarse a
una variable declarada como `str`. También puede advertir que `round()` está recibiendo un texto
donde espera un valor numérico.

Antes de editar, leemos el hallazgo con el mismo patrón:

1. **Ubicación:** archivo, línea y expresión involucrada.
2. **Contrato declarado:** `promedio` debería ser un `str` según la anotación escrita.
3. **Valor inferido:** la operación produce un número de punto flotante.
4. **Incompatibilidad:** ambas afirmaciones no pueden ser verdaderas al mismo tiempo.

La corrección mínima es declarar el tipo que corresponde al valor real:

```python
def nota_final(notas: list[float]) -> float:
    """Calcula la nota final como el promedio redondeado a un decimal."""
    promedio: float = sum(notas) / len(notas)
    return round(promedio, 1)
```

Volvemos a ejecutar los dos controles estáticos:

```powershell
uv run ruff check .
uv run pyrefly check
```

Ambos deberían quedar en verde. Eso demuestra que, bajo las reglas y la configuración actuales, no
quedan los problemas estructurales ni la contradicción de tipos que acabamos de introducir.

### 2.5 Dos controles verdes y un comportamiento todavía equivocado

Ejecutamos manualmente el caso que descubrió el defecto en la clase anterior:

```powershell
uv run python -c "from notas import nota_final; print(nota_final([3.8, 4.1, 3.95]))"
```

El resultado observado es `3.9`, aunque la regla acordada para este ejercicio espera `4.0`. Ruff no
lo detectó porque el código no infringe una regla de linting. Pyrefly tampoco, porque todas las
operaciones son compatibles con sus tipos declarados.

El defecto no contradice la sintaxis ni los contratos de tipos. Contradice una **expectativa de
negocio**: cómo debe redondearse una nota. Para detectar esa diferencia necesitamos expresar la
regla como un ejemplo ejecutable. Ese será el trabajo del siguiente bloque con `pytest`.

### 2.6 Cómo puede ayudar un agente sin borrar el aprendizaje

Si un diagnóstico no se entiende, un agente puede ayudar a traducirlo. La solicitud útil incluye
el mensaje completo y mantiene la decisión en manos del estudiante:

> Explica este diagnóstico de Ruff o Pyrefly indicando archivo, regla, causa probable y dos opciones
> de corrección. No modifiques el código todavía.

Lo que no conviene hacer en esta etapa es pedir «arregla todos los errores» antes de leerlos. Esa
instrucción puede producir un archivo verde, pero elimina la oportunidad de comprender:

- qué herramienta detectó el problema;
- qué evidencia entregó;
- por qué la corrección era válida;
- y qué riesgos siguen fuera de su alcance.

El agente puede proponer una explicación. La verificación final sigue siendo volver al archivo,
leer la línea señalada y ejecutar nuevamente el control original.

## Punto de control

El bloque está completo cuando cada estudiante puede mostrar:

```powershell
uv run ruff check .
uv run pyrefly check
```

Ambos comandos deben quedar en verde, pero el estudiante también debe poder explicar oralmente:

- qué problema detectó Ruff;
- qué problema diferente detectó Pyrefly;
- y por qué ninguno descubrió todavía el defecto de redondeo.

## Preguntas guía

1. **¿Cómo puede Ruff quedar en verde mientras Pyrefly todavía encuentra un problema?**  
   **Pista:** compara una regla sobre la estructura del código con una afirmación sobre los tipos
   que circulan por él.
2. **¿Por qué debemos repetir el mismo comando después de modificar el archivo?**  
   **Pista:** distingue entre creer que hicimos una corrección y producir evidencia de que el
   hallazgo realmente desapareció.
3. **Si Ruff y Pyrefly quedan en verde, ¿qué defecto de `nota_final()` sigue sin estar cubierto?**  
   **Pista:** recuerda qué regla pertenece al contexto educativo chileno y no al lenguaje Python.

## Cierre del bloque

- **Idea clave:** `ruff` y `pyrefly` observan el código sin necesitar ejecutar casos de uso, pero
  miran propiedades distintas. Sus resultados se complementan y ninguno sustituye una prueba de
  comportamiento.
- **Evidencia producida:** un hallazgo de linting corregido y vuelto a verificar; una contradicción
  de tipos diagnosticada, corregida y verificada; y un caso manual que demuestra el límite de ambos
  controles.
- **Puente:** tenemos dos controles estáticos en verde y un ejemplo que aún produce `3.9`. Después
  de la pausa convertiremos la expectativa `3.95 → 4.0` en una prueba que pueda ejecutarse siempre,
  sin depender de que alguien recuerde comprobar manualmente ese valor.

### Fuentes técnicas del bloque

- [Ejecución y reglas de Ruff](https://docs.astral.sh/ruff/linter/)
- [Configuración de Ruff](https://docs.astral.sh/ruff/configuration/)
- [Instalación, inicialización y ejecución de Pyrefly](https://pyrefly.org/en/docs/installation/)

---

# BLOQUE 3: Del rojo al verde: la primera prueba que conserva el defecto

**Duración:** 30 minutos  
**Objetivo:** escribir una primera prueba con `pytest`, reproducir automáticamente el defecto de
redondeo, interpretar la salida de una prueba fallida y corregir la implementación sin alterar la
expectativa acordada.  
**Modalidad:** demostración guiada, ejecución individual y lectura colectiva de evidencia.

## 3.1 Una comprobación manual se pierde; una prueba permanece

Antes de la pausa ejecutamos este caso:

```powershell
uv run python -c "from notas import nota_final; print(nota_final([3.8, 4.1, 3.95]))"
```

Vimos `3.9`, aunque para este ejercicio acordamos que un promedio de `3.95` debe informarse como
`4.0`. El hallazgo es valioso, pero por ahora depende de que alguien recuerde el comando, los datos
y el resultado esperado.

Una prueba automatizada transforma ese recuerdo en evidencia repetible. Para hacerlo necesita tres
elementos:

- **entrada:** las notas `[3.8, 4.1, 3.95]`;
- **acción:** ejecutar `nota_final()`;
- **resultado esperado:** obtener `4.0`.

En este bloque no aplicaremos todavía el ciclo formal de TDD, que se estudiará más adelante.
Partimos de un defecto ya conocido y lo convertimos en una **prueba de regresión**: una prueba que
impedirá que el mismo comportamiento incorrecto reaparezca sin ser detectado.

## 3.2 Crear la primera prueba con `pytest`

En la raíz del proyecto creamos el archivo `test_notas.py`:

```python
from notas import nota_final


def test_calcula_promedio_normal() -> None:
    assert nota_final([6.0, 5.5, 6.5]) == 6.0
```

`pytest` puede descubrir esta prueba automáticamente porque:

- el archivo comienza con `test_`;
- la función también comienza con `test_`;
- y la expectativa está escrita con el `assert` normal de Python.

Ejecutamos todas las pruebas del proyecto:

```powershell
uv run pytest -q
```

La salida esperada es similar a esta:

```text
.                                                                        [100%]
1 passed
```

El punto verde indica que el ejemplo pasó. No significa que `nota_final()` sea correcta para todos
los valores posibles: solo demuestra que respondió correctamente ante **ese caso específico**.

## 3.3 Convertir el defecto conocido en una prueba roja

Agregamos al mismo archivo una segunda prueba:

```python
def test_redondea_395_a_40() -> None:
    assert nota_final([3.8, 4.1, 3.95]) == 4.0
```

Volvemos a ejecutar:

```powershell
uv run pytest -q
```

Ahora esperamos una salida equivalente a esta:

```text
.F                                                                       [100%]
=================================== FAILURES ===================================
________________________ test_redondea_395_a_40 _________________________

    def test_redondea_395_a_40() -> None:
>       assert nota_final([3.8, 4.1, 3.95]) == 4.0
E       assert 3.9 == 4.0

FAILED test_notas.py::test_redondea_395_a_40 - assert 3.9 == 4.0
1 failed, 1 passed
```

La prueba roja no es un fracaso del estudiante. Es evidencia de que el sistema de pruebas logró
detectar una diferencia real. Leemos el reporte en este orden:

1. `test_redondea_395_a_40` identifica el comportamiento que se estaba verificando.
2. `assert 3.9 == 4.0` muestra el valor obtenido a la izquierda y el esperado a la derecha.
3. `test_notas.py::test_redondea_395_a_40` permite localizar exactamente la prueba fallida.
4. `1 failed, 1 passed` confirma que el caso normal sigue funcionando y que el desacuerdo está
   concentrado en el redondeo.

Cuando existan muchas pruebas, también podremos ejecutar solo este caso mediante su identificador:

```powershell
uv run pytest -q test_notas.py::test_redondea_395_a_40
```

## 3.4 Antes de editar, decidir qué evidencia manda

Una prueba puede fallar porque:

- la implementación está equivocada;
- la expectativa de la prueba está equivocada;
- o la preparación del caso no representa lo que queríamos comprobar.

Por eso no corresponde cambiar automáticamente `4.0` por `3.9` solo para obtener verde. La fuente
de verdad en este ejercicio es la regla acordada: el promedio decimal `3.95` debe redondearse a
`4.0`. La prueba expresa esa regla correctamente; lo que debemos revisar es la implementación.

El problema aparece porque los valores `float` se representan internamente en formato binario. La
operación puede producir un valor apenas inferior a `3.95`, aunque al imprimirlo parezca igual. En
una regla de negocio que exige un criterio de redondeo explícito, conviene calcular con `Decimal` y
declarar el criterio, en vez de depender del comportamiento implícito de `round()`.

Reemplazamos el contenido de `notas.py` por:

```python
from decimal import ROUND_HALF_UP, Decimal


def nota_final(notas: list[float]) -> float:
    """Calcula el promedio y redondea a un decimal con criterio ROUND_HALF_UP."""
    notas_decimales = [Decimal(str(nota)) for nota in notas]
    total: Decimal = sum(notas_decimales, Decimal(0))
    promedio: Decimal = total / Decimal(len(notas_decimales))
    return float(promedio.quantize(Decimal("0.1"), rounding=ROUND_HALF_UP))
```

Hay dos decisiones importantes en esta corrección:

- `Decimal(str(nota))` convierte la representación visible del dato, sin arrastrar el artefacto
  binario del `float` original;
- `ROUND_HALF_UP` hace explícita la regla para los empates: se redondean alejándose de cero.

No estamos agregando una solución mágica para un solo número. Estamos implementando de forma
visible el criterio que la prueba exige.

## 3.5 Volver a ejecutar hasta producir evidencia verde

Ejecutamos nuevamente la suite:

```powershell
uv run pytest -q
```

La salida esperada ahora es:

```text
..                                                                       [100%]
2 passed
```

El cambio de rojo a verde demuestra que la implementación satisface tanto el caso normal como el
caso de regresión. Para cerrar el ciclo, repetimos también los controles anteriores:

```powershell
uv run ruff check .
uv run pyrefly check
uv run pytest -q
```

Los tres comandos deben quedar en verde. Corregir el comportamiento no nos autoriza a introducir
problemas de estilo o contradicciones de tipos.

## 3.6 Usar un agente sin entregarle la fuente de verdad

Ante una prueba roja, una solicitud útil para un agente podría ser:

> La prueba exige que el promedio decimal `3.95` se informe como `4.0`, pero la implementación
> devuelve `3.9`. Explica la causa y propón dos correcciones posibles. No cambies la prueba y señala
> los riesgos de cada alternativa.

La instrucción mantiene fija la expectativa y pide razonamiento antes de modificar. En cambio,
«haz que el test pase» deja abierta una salida peligrosa: alterar la prueba para que acepte el
defecto. La responsabilidad humana es conservar la regla, evaluar la propuesta y volver a ejecutar
los tres controles.

## Punto de control

El bloque está completo cuando cada estudiante puede mostrar:

- un archivo `test_notas.py` con dos pruebas;
- una ejecución roja donde se observe `3.9 == 4.0`;
- una ejecución posterior con `2 passed`;
- y los controles de Ruff y Pyrefly nuevamente en verde.

Además, debe poder explicar por qué se modificó `notas.py` y no el resultado esperado de la prueba.

## Preguntas guía

1. **¿Por qué una prueba en verde no demuestra que una función sea correcta para todos los casos?**  
   **Pista:** identifica cuántas entradas ejecutó realmente esa prueba y cuáles todavía no fueron
   representadas.
2. **Cuando una prueba queda roja, ¿cómo decidimos si debemos cambiar el código o la expectativa?**  
   **Pista:** antes de editar, busca dónde está definida la regla que funciona como fuente de verdad.
3. **¿Qué riesgo existe si cambiamos el resultado esperado de `4.0` a `3.9` solo para obtener verde?**  
   **Pista:** un indicador puede verse saludable aunque hayamos modificado la regla para que coincida
   con el defecto.

## Cierre del bloque

- **Idea clave:** una prueba roja bien construida es evidencia útil. El verde adquiere valor cuando
  aparece después de una corrección coherente con la regla, no cuando debilitamos la expectativa.
- **Evidencia producida:** una prueba de regresión que reproduce el defecto de redondeo, un reporte
  de falla interpretado y una implementación corregida que supera los tres controles.
- **Puente:** ya sabemos convertir un caso conocido en una prueba repetible. En el último bloque
  pediremos apoyo a un agente para proponer nuevos casos y evaluaremos cuáles representan riesgos
  reales antes de incorporarlos.

### Fuentes técnicas del bloque

- [Primeras pruebas y modo de salida breve de pytest](https://docs.pytest.org/en/stable/getting-started.html)
- [Descubrimiento y ejecución selectiva de pruebas](https://docs.pytest.org/en/stable/how-to/usage.html)
- [Lectura de fallas en expresiones `assert`](https://docs.pytest.org/en/stable/how-to/assert.html)
- [Aritmética decimal, `quantize()` y modos de redondeo](https://docs.python.org/es/3.13/library/decimal.html)

---

# BLOQUE 4: El agente propone; el equipo decide y verifica

**Duración:** 25 minutos  
**Objetivo:** evaluar casos de prueba sugeridos por un agente, incorporar solo aquellos que cubren
un riesgo comprensible y distinguir qué barrera del entorno debería detectar distintos problemas
controlados.  
**Modalidad:** trabajo breve en parejas, auditoría colectiva y desafío de diagnóstico.  
**Ritmo sugerido:** 4 minutos para especificar la solicitud, 6 para auditar propuestas, 5 para
incorporar casos, 7 para el sabotaje asignado y 3 para restaurar y comprobar.

## 4.1 Dar contexto antes de pedir casos

Un agente puede producir muchos ejemplos en pocos segundos. Eso no significa que conozca la regla
del problema ni que todos sus casos sean útiles. Antes de solicitar propuestas, explicitamos lo que
sí sabemos:

- `nota_final(notas: list[float]) -> float` calcula un promedio;
- el resultado se entrega con un decimal;
- los empates se resuelven con el criterio `ROUND_HALF_UP`;
- ya existen pruebas para un promedio normal y para el defecto `3.95 → 4.0`;
- todavía no hemos definido qué debe ocurrir con una lista vacía ni con datos que no sean números.

Con ese contexto, usamos una solicitud acotada:

> Propón cinco casos de prueba para `nota_final()`. Para cada uno incluye nombre descriptivo,
> entrada, resultado esperado y riesgo que intenta cubrir. No escribas ni modifiques código. No
> repitas los casos existentes. Si el resultado depende de una regla que no está definida, marca el
> caso como «requiere decisión» en vez de inventar una respuesta.

La última restricción es fundamental: cuando falta una regla, el agente debe exponer la ambigüedad,
no esconderla detrás de una expectativa aparentemente razonable.

## 4.2 Auditar la propuesta: aceptar, modificar, posponer o rechazar

Cada pareja revisa las sugerencias del agente con cuatro decisiones posibles:

- **Aceptar:** el caso representa un riesgo distinto y su resultado se deriva de una regla conocida.
- **Modificar:** el riesgo es útil, pero el nombre, la entrada o la expectativa necesitan precisión.
- **Posponer:** el caso descubre una decisión de negocio pendiente, como qué hacer con `[]`.
- **Rechazar:** repite evidencia existente, contradice el contrato actual o no explica qué riesgo
  cubre.

Aplicamos el criterio a cinco propuestas típicas:

1. `[5.5] → 5.5`: **aceptar**, porque comprueba el caso mínimo con una sola nota.
2. `[3.94] → 3.9`: **aceptar**, porque observa el valor inmediatamente inferior al empate.
3. `[3.8, 4.1, 3.95] → 4.0`: **rechazar**, porque ya está cubierto por la prueba de regresión.
4. `[] → 0.0`: **posponer**, porque aún no decidimos si una lista vacía debe devolver un valor o
   producir un error explícito.
5. `["4.0", "5.0"] → 4.5`: **rechazar en el contrato actual**, porque la función declara una lista
   de `float`; aceptar texto exigiría definir primero una nueva responsabilidad de conversión.

La cantidad de pruebas no decide la calidad de una suite. Cada caso aceptado debe poder responder:
**¿qué riesgo nuevo vuelve visible?**

## 4.3 Incorporar dos casos con propósito

Agregamos a `test_notas.py` solo los dos casos aceptados:

```python
def test_conserva_una_unica_nota() -> None:
    assert nota_final([5.5]) == 5.5


def test_redondea_394_hacia_39() -> None:
    assert nota_final([3.94]) == 3.9
```

Ejecutamos la suite:

```powershell
uv run pytest -q
```

La evidencia esperada es:

```text
....                                                                     [100%]
4 passed
```

Mantenemos funciones separadas porque, en esta primera experiencia, sus nombres ayudan a leer el
propósito de cada caso. Más adelante podremos reducir repetición con parametrización sin perder esa
trazabilidad.

## 4.4 Desafío de sabotaje controlado: predecir antes de ejecutar

Cada pareja recibe uno de estos cambios temporales. Antes de tocar el código debe anotar qué
control debería detectarlo primero y qué mensaje espera encontrar.

### Sabotaje A — entorno desalineado

Agregar manualmente una dependencia a `pyproject.toml` sin actualizar `uv.lock`.

- **Predicción esperada:** `uv lock --check` debe informar que el archivo de bloqueo está
  desactualizado.
- **Restauración:** deshacer la línea agregada; no actualizar el lockfile para conservar el entorno
  original del ejercicio.

### Sabotaje B — estructura innecesaria

Agregar `import math` al comienzo de `notas.py` sin utilizarlo.

- **Predicción esperada:** `uv run ruff check .` debe señalar el import no utilizado.
- **Restauración:** eliminar el import después de leer el diagnóstico.

### Sabotaje C — contrato de tipos contradictorio

Cambiar temporalmente la firma a `nota_final(notas: list[str]) -> float`, sin cambiar las pruebas.

- **Predicción esperada:** `uv run pyrefly check` debe detectar que las pruebas entregan listas de
  números donde la firma ahora declara texto.
- **Restauración:** recuperar `list[float]` después de localizar las líneas afectadas.

En este sabotaje, pytest puede conservar sus cuatro pruebas en verde porque el cuerpo todavía logra
ejecutarse con esos valores. Ese contraste no invalida a Pyrefly: demuestra que el comportamiento
observado y el contrato declarado son evidencias diferentes.

### Sabotaje D — comportamiento equivocado

Reemplazar la importación de `ROUND_HALF_UP` por `ROUND_DOWN` y usar también `ROUND_DOWN` en la
llamada a `quantize()`.

- **Predicción esperada:** `uv run pytest -q` debe volver a dejar roja la prueba `3.95 → 4.0`.
- **Restauración:** recuperar `ROUND_HALF_UP` después de interpretar el valor obtenido y el esperado.

Estas asociaciones indican la barrera más directa, no fronteras absolutas. Un mismo cambio puede
provocar consecuencias en más de una herramienta. El objetivo profesional es elegir primero el
control que entregue la evidencia más precisa para la hipótesis formulada.

## 4.5 Restaurar y comprobar el estado real

Después del sabotaje no basta con afirmar que el archivo quedó como antes. Cada pareja repite el
mismo control que produjo su diagnóstico:

- sabotaje A: `uv lock --check`;
- sabotaje B: `uv run ruff check .`;
- sabotaje C: `uv run pyrefly check`;
- sabotaje D: `uv run pytest -q`.

La actividad concluye cuando el control asignado vuelve a quedar en verde y la pareja puede mostrar
qué cambio restauró. Reservamos la batería completa para el cierre compartido de la clase.

## Punto de control

El bloque está completo cuando cada pareja puede presentar:

- una propuesta del agente auditada con decisiones justificadas;
- dos casos nuevos que cubren riesgos distintos;
- una predicción formulada antes de ejecutar el sabotaje asignado;
- el diagnóstico real comparado con esa predicción;
- y el proyecto restaurado con el control asignado nuevamente en verde.

## Preguntas guía

1. **¿Qué hace que un caso sugerido por un agente sea útil y no solo diferente?**  
   **Pista:** busca el riesgo nuevo que permite observar y la regla que justifica su expectativa.
2. **¿Por qué no deberíamos convertir inmediatamente `[] → 0.0` en una prueba?**  
   **Pista:** distingue entre descubrir una situación posible y conocer la respuesta correcta para
   esa situación.
3. **Si varias herramientas reaccionan al mismo cambio, ¿cuál conviene ejecutar primero?**  
   **Pista:** vuelve a la hipótesis inicial y elige el diagnóstico más directo para confirmarla o
   descartarla.

## Cierre del bloque

- **Idea clave:** el agente amplía el espacio de posibilidades; el equipo conserva la autoridad
  sobre la especificación y exige una razón para cada caso aceptado.
- **Evidencia producida:** dos pruebas adicionales, una propuesta auditada y un diagnóstico
  controlado que relaciona cada barrera con el tipo de problema que observa.
- **Puente:** contamos con un entorno reproducible y cuatro controles complementarios. El cierre de
  la clase servirá para delimitar qué podemos afirmar con esa evidencia y qué aspectos de la calidad
  todavía permanecen fuera de ella.

### Fuentes técnicas del bloque

- [Comprobación y sincronización del lockfile con uv](https://docs.astral.sh/uv/concepts/projects/sync/)
- [Ejecución principal del linter Ruff](https://docs.astral.sh/ruff/linter/)
- [Ejecución y configuración de Pyrefly](https://pyrefly.org/en/docs/installation/)
- [Ejecución y selección de pruebas con pytest](https://docs.pytest.org/en/stable/how-to/usage.html)

---

# CIERRE DE LA CLASE: Qué podemos demostrar hoy

**Duración:** 10 minutos  
**Propósito:** reunir las evidencias producidas, formular conclusiones proporcionadas y conectar
los controles técnicos de hoy con una mirada más amplia de la calidad de software.

## 1. La cadena de evidencia

La clase comenzó con una frase insuficiente: «en mi computador funciona». Ahora podemos sostener
afirmaciones más precisas:

- `pyproject.toml` y `uv.lock` describen un entorno que otra persona puede reconstruir;
- Ruff indica que no encontró infracciones a las reglas de linting habilitadas;
- Pyrefly indica que no encontró contradicciones dentro del contrato de tipos analizado;
- pytest demuestra que la implementación satisface los cuatro ejemplos ejecutados.

Ninguna de esas evidencias demuestra que el software sea perfecto. Juntas permiten formular una
conclusión acotada, repetible y revisable por otra persona.

```text
Intención explícita
        ↓
Entorno reproducible
        ↓
Controles estáticos
        ↓
Pruebas de comportamiento
        ↓
Conclusión proporcional a la evidencia
```

## 2. Ejecución final compartida

Toda la sala ejecuta una última vez:

```powershell
uv lock --check
uv run ruff check .
uv run pyrefly check
uv run pytest -q
```

El resultado esperado no es solamente «todo verde». Cada estudiante debe poder explicar:

- qué archivo o comportamiento observó cada comando;
- qué tipo de defecto podría revelar;
- y qué defectos todavía podrían existir aunque el comando termine correctamente.

## 3. Evidencia mínima de salida

Antes de cerrar el equipo, cada estudiante conserva en su proyecto:

- `pyproject.toml` y `uv.lock`;
- la configuración generada por `pyrefly init`;
- `notas.py` con la regla de redondeo explícita;
- `test_notas.py` con cuatro pruebas descriptivas;
- y una captura o registro breve de la ejecución final en verde.

## 4. Ticket de salida

Cada estudiante completa estas cuatro frases en no más de una línea por respuesta:

1. **`uv` aporta evidencia de que…**
2. **Ruff y Pyrefly no son equivalentes porque…**
3. **La prueba roja fue útil cuando…**
4. **Todavía no puedo afirmar que el programa…**

La última frase evita una conclusión exagerada: cuatro casos aprobados no cubren seguridad,
rendimiento, facilidad de uso ni todos los escenarios funcionales posibles.

## 5. Próxima clase

Hoy observamos piezas concretas y pequeñas de la calidad. En la próxima sesión ampliaremos la
pregunta con ISO/IEC 25010: pasaremos de «¿qué comando quedó en verde?» a «¿qué características
debe exhibir un producto para que podamos considerarlo de calidad?».

El proyecto `nota_final()` seguirá siendo nuestra evidencia inicial, pero también servirá para
identificar qué dimensiones importantes todavía no están representadas por el entorno, el linter,
el verificador de tipos ni estas primeras pruebas.

## Mensaje final

> La calidad no consiste en confiar más. Consiste en formular una expectativa, producir evidencia
> y limitar cada conclusión a lo que esa evidencia realmente demuestra.

### Fuentes técnicas del cierre

- [Estructura del proyecto y función de `uv.lock`](https://docs.astral.sh/uv/concepts/projects/layout/)
- [Ejecución y selección de pruebas con pytest](https://docs.pytest.org/en/stable/how-to/usage.html)

---
