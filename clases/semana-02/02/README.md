# Clase 05 - Semana 02 - Antes de ejecutar nada: qué cambian las pruebas en un proyecto real y por qué las primeras no ejecutan el código

- **Unidad:** 01 · Calidad y Testing de Software
- **Fecha:** Lunes 31 de agosto de 2026
- **Duración:** 3 horas pedagógicas · 140 minutos (08:30 - 10:50)
- **Modalidad:** Presencial en Laboratorio PC
- **Docente:** Diego Obando
- **Marco de referencia:** ISO/IEC/IEEE 29119-1:2022 · pruebas estáticas y pruebas dinámicas

---

# Objetivos de la Clase

## Objetivo General

Al finalizar esta sesión, el estudiante será capaz de fundamentar, con evidencia observable tomada
de repositorios reales, qué cambia efectivamente en la vida de un proyecto cuando sostiene una suite
de pruebas, y de ejecutar sobre su propio proyecto la primera capa de control del arco de pruebas:
el tipado estricto y el análisis de código, dos comprobaciones que encuentran defectos sin ejecutar
una sola línea. Para ello distinguirá pruebas estáticas de pruebas dinámicas según la fuente de
información que utiliza cada una, interpretará los diagnósticos que producen `pyrefly` y `ruff`, y
delimitará explícitamente qué clase de defectos quedan fuera del alcance de ambas herramientas.

## Objetivos Específicos

1. **Contrastar dos repositorios reales de madurez distinta** mediante indicadores observables
   —cobertura declarada, historial de defectos, ritmo de cambios y tiempo de vida de un defecto
   desde que se reporta hasta que se corrige—, estableciendo qué afirmación respalda cada indicador
   y cuál no permite sostener por sí solo.
2. **Distinguir prueba estática de prueba dinámica** según si la comprobación requiere ejecutar el
   código o solo analizarlo, y ubicar el tipado y el análisis estático como el primer filtro del
   arco de pruebas que el módulo construirá.
3. **Activar el tipado estricto con `pyrefly` sobre el proyecto propio**, interpretando cada
   diagnóstico y separando un error de tipos genuino de un diagnóstico originado en una anotación
   ausente o en una firma mal declarada.
4. **Configurar `ruff` como segunda barrera**, diferenciando las reglas que solo uniforman estilo de
   aquellas que detectan defectos con consecuencias en tiempo de ejecución, y justificando cada
   regla que se habilite o se silencie en el proyecto.
5. **Delimitar el alcance de las pruebas estáticas**, identificando al menos un defecto del propio
   proyecto que ni `pyrefly` ni `ruff` señalan, y explicando qué información solo aparece cuando el
   programa se ejecuta.
6. **Auditar la corrección que un agente propone frente a un error de tipos**, determinando si
   eliminó el defecto o únicamente el diagnóstico, y qué evidencia permite distinguir ambas
   situaciones.

## Competencias Transversales

- **Lectura de evidencia comparada:** sostener un juicio sobre la calidad de un proyecto a partir de
  indicadores verificables y de su contexto, en lugar de la impresión que produce el código a
  primera vista.
- **Interpretación de diagnósticos:** leer la salida de una herramienta como una afirmación acotada
  que hay que comprender y confirmar, y no como un veredicto que se acata o se silencia.
- **Justificación de decisiones técnicas:** explicar por qué una regla se habilita, se ajusta o se
  desactiva, dejando la decisión trazable para quien revise el proyecto más adelante.
- **Criterio frente a la automatización:** usar un agente para acelerar correcciones sin cederle la
  distinción entre resolver un problema y hacer desaparecer su síntoma.

---

# Mapa de la Clase

| Horario | Sección | Propósito |
|---------|---------|-----------|
| 08:30 - 08:40 | Encuadre | Retomar la pregunta con que cerró la clase anterior: si una prueba en verde no garantiza que el criterio sea correcto, ¿qué es exactamente lo que las pruebas sí cambian en un proyecto? |
| 08:40 - 09:05 | Bloque 1 | Comparar dos repositorios reales de madurez distinta con indicadores observables y establecer qué diferencia sostiene la evidencia y cuál es atribución nuestra. |
| 09:05 - 09:35 | Bloque 2 | Separar pruebas estáticas de dinámicas y ejecutar la primera: activar el tipado estricto con `pyrefly` sobre el proyecto propio e interpretar sus diagnósticos. |
| 09:35 - 09:45 | Pausa | Descanso técnico. |
| 09:45 - 10:15 | Bloque 3 | Incorporar `ruff` como segunda barrera, distinguir estilo de defecto real y encontrar el error que ninguna de las dos herramientas puede ver. |
| 10:15 - 10:40 | Bloque 4 | Pedirle a un agente que resuelva un error de tipos y auditar si corrigió el defecto o solo apagó el diagnóstico. |
| 10:40 - 10:50 | Cierre | Consolidar qué quedó comprobado sin ejecutar el proyecto, qué sigue sin comprobarse y por qué la próxima capa exige otra clase de prueba. |

---

# BLOQUE 1: Dos estados del mismo proyecto

- **Duración:** 25 minutos
- **Objetivo del bloque:** responder con evidencia observable qué cambia en la vida de un proyecto
  cuando adopta una suite de pruebas, usando cuatro indicadores que pueden verificarse desde fuera.
  Al finalizar, el estudiante debe poder separar la afirmación que los datos sostienen de la
  atribución que agregamos nosotros al interpretarlos.
- **Modalidad:** trabajo individual, con consulta de fuentes en pantalla y registro escrito.
- **Ritmo sugerido:** 5 minutos para instalar los indicadores, 9 para el caso, 5 para el examen de
  la evidencia y 6 para el ejercicio.

## Desarrollo

### 1.1 Cuatro indicadores en vez de una opinión

La clase anterior cerró con una pregunta abierta: si una suite en verde no garantiza que el criterio
sea correcto, ¿qué es exactamente lo que las pruebas sí cambian?

Es una pregunta sobre hechos, así que no se responde argumentando. Se responde mirando un proyecto y
midiendo. Estos son los cuatro indicadores que vamos a usar, elegidos porque cualquiera puede
verificarlos desde fuera, sin acceso al equipo que escribió el código:

| Indicador | Qué se observa | Dónde se mira |
| --- | --- | --- |
| **Proporción de prueba** | Cuánto código de prueba existe por cada línea de código de producto | El repositorio |
| **Historial de defectos** | Cuántos defectos se reportan y qué ocurre con ellos después | El registro de incidencias |
| **Vida de un defecto** | Cuánto pasa entre que un defecto se introduce y alguien lo detecta | El historial de cambios |
| **Costo de un cambio** | Qué tiene que ocurrir para que una modificación entre al proyecto | Las reglas de contribución |

Ninguno de los cuatro mide calidad. Miden **lo que el proyecto puede afirmar sobre sí mismo**, que
es la distinción que venimos sosteniendo desde la Clase 03.

### 1.2 SQLite, antes y después de sí mismo

Comparar dos proyectos distintos es un mal experimento: cambian el dominio, el equipo, la
complejidad y la antigüedad al mismo tiempo, y después no se sabe cuál de todas esas variables
explica la diferencia.

Por eso el caso es un proyecto comparado consigo mismo. SQLite es la base de datos más desplegada
del mundo: está en cada teléfono Android, en cada iPhone, en los navegadores y en aviones. Y tiene
una fecha exacta que parte su historia en dos.

```text
2008-09-25   Primera línea de TH3, su tercer sistema de pruebas
             ↓  10 meses de trabajo
2009-07-25   TH3 alcanza 100% de cobertura MC/DC
2009-08-10   Versión 3.6.17: desde aquí, todas las versiones se prueban con ese estándar
```

**MC/DC** —*Modified Condition/Decision Coverage*— es el criterio de cobertura que exige la norma
aeronáutica DO-178B para software crítico de vuelo. No basta con ejecutar cada línea ni con recorrer
cada rama: hay que demostrar que **cada condición dentro de una decisión puede alterar el resultado
por sí sola**. Es el estándar con el que se certifica el software que controla un avión.

Los cuatro indicadores, aplicados al SQLite de hoy:

| Indicador | Valor observable |
| --- | --- |
| **Proporción de prueba** | 155,8 KSLOC de código de librería contra 92.053,1 KSLOC de código de prueba: **590 veces más prueba que producto** (versión 3.42.0, 2023-05-16) |
| **Historial de defectos** | Su autor describe el período posterior como prácticamente sin errores durante ocho o nueve años |
| **Vida de un defecto** | La cobertura MC/DC busca que el defecto se detecte al introducirlo, no cuando un usuario lo encuentra |
| **Costo de un cambio** | Ninguna versión se publica sin pasar el estándar completo |

Sobre el esfuerzo y sobre el resultado, en palabras de Richard Hipp, su autor:

> «Eso tomó un año de semanas de 60 horas. Fue trabajo duro, durísimo. Metía jornadas de 12 horas
> todos los días. […] Una vez que llegamos a ese punto, **dejamos de recibir reportes de error desde
> Android**. Simplemente funcionó de ahí en adelante. Hizo una diferencia enorme, enorme.»

Conviene detenerse en qué tipo de afirmación es esa. No dice que el software se volviera más rápido,
ni más elegante, ni que tuviera más funcionalidades. Dice que **dejó de llegar una clase de
información**: la de los usuarios descubriendo defectos en producción.

Y una advertencia sobre la cifra: 590 veces no es una meta para nuestros proyectos. SQLite se prueba
como software aeronáutico porque falla dentro de miles de millones de dispositivos donde nadie puede
parcharlo. Lo que se traslada no es la proporción, es la relación entre lo que un proyecto prueba y
lo que puede afirmar.

### 1.3 Qué sostiene esta evidencia y qué es atribución nuestra

Acá aplicamos al caso el mismo rigor que la Clase 04 nos exigió aplicar a nuestros propios criterios.

Lo que la evidencia **sí** sostiene:

- Las fechas, el estándar alcanzado y la proporción entre prueba y producto están publicados y son
  verificables por cualquiera.
- Existe una correlación temporal declarada entre alcanzar cobertura MC/DC y dejar de recibir
  reportes de error desde el mayor consumidor del proyecto.

Lo que **no** sostiene, y que sería atribución nuestra:

- No es un experimento controlado. No hay un SQLite paralelo que no adoptara TH3, así que no se
  puede aislar la variable: en esos mismos diez meses también cambiaron el equipo, la madurez del
  código y la experiencia acumulada.
- La afirmación sobre el período posterior es **testimonio del mantenedor**, no una medición
  independiente. Es la fuente mejor informada que existe, y aun así es una parte interesada.
- Que le haya funcionado a SQLite no demuestra que le funcione a cualquier proyecto.

Decir esto no debilita el caso: lo vuelve utilizable. Una conclusión proporcional a esta evidencia
suena así — *en un proyecto crítico, alcanzar cobertura MC/DC coincidió con la desaparición de los
reportes de defectos desde producción, según su mantenedor* — y no así — *las pruebas eliminan los
errores*. La segunda es más cómoda de repetir y no la sostiene ningún dato de los que acabamos de
ver.

### 1.4 Ejercicio individual: los cuatro indicadores sobre el proyecto propio

Sobre el proyecto de cálculo de calificaciones que vienes trabajando desde la Clase 02, responde por
escrito:

```text
1. Proporción de prueba: ¿cuántas líneas de prueba tienes por cada línea de producto?
2. Historial de defectos: ¿cuántos defectos has encontrado y qué pasó con cada uno?
3. Vida de un defecto: el defecto de redondeo de la Clase 02, ¿cuánto tiempo estuvo ahí
   antes de que alguien lo notara?
4. Costo de un cambio: si mañana modificas la fórmula, ¿qué tiene que ocurrir para que
   sepas si rompiste algo?
```

Dos de las cuatro preguntas probablemente no las puedas responder todavía. **Marca cuáles y por
qué**: la respuesta que falta es más informativa que la que tienes, porque señala qué no puede
afirmar hoy tu proyecto sobre sí mismo.

## Punto de control

El bloque está completo cuando cada estudiante puede:

- nombrar los cuatro indicadores y decir dónde se observa cada uno;
- explicar por qué comparar un proyecto consigo mismo es mejor evidencia que comparar dos proyectos
  distintos;
- distinguir, sobre el caso de SQLite, una afirmación respaldada de una atribución añadida;
- y señalar cuáles de los cuatro indicadores su propio proyecto no puede responder hoy.

## Preguntas guía

1. **¿Por qué 590 veces más código de prueba que de producto no es una meta razonable para
   cualquier proyecto?**
   **Pista:** piensa en qué cambia según dónde y cómo se despliegue el software.
2. **Si nadie reporta defectos, ¿significa que no los hay?**
   **Pista:** el indicador mide reportes, no defectos; considera qué otras causas producen silencio.
3. **¿Qué le faltaría a este caso para ser una demostración y no una correlación?**
   **Pista:** revisa qué exigiría poder aislar la variable que se está estudiando.

## Cierre del bloque

- **Idea clave:** lo que las pruebas cambian en un proyecto se observa desde fuera, con indicadores
  verificables, y la conclusión que se saca debe ser proporcional a lo que esos indicadores
  realmente miden.
- **Evidencia producida:** los cuatro indicadores aplicados al proyecto propio, con las preguntas
  que todavía no pueden responderse marcadas como tales.
- **Puente:** en el caso de SQLite, buena parte de lo que impide que un cambio defectuoso entre al
  proyecto ocurre **antes de ejecutar el código**. El bloque siguiente empieza por ahí: la primera
  prueba del arco no ejecuta el programa.

### Fuentes técnicas del bloque

- [How SQLite Is Tested — proporción entre código de prueba y librería, cobertura MC/DC](https://www.sqlite.org/testing.html)
- [TH3 — fechas del desarrollo y del estándar alcanzado](https://sqlite.org/th3.html)
- [The Untold Story of SQLite — entrevista a D. Richard Hipp, CoRecursive (2021)](https://corecursive.com/066-sqlite-with-richard-hipp/)
- RTCA DO-178B — origen del criterio de cobertura MC/DC en software aeronáutico.
- Clase 03 — la calidad se mide contra un estándar, no se opina.
- Clase 04 — conclusiones proporcionales a la evidencia disponible.

---

# BLOQUE 2: La primera prueba no ejecuta el programa

- **Duración:** 30 minutos
- **Objetivo del bloque:** distinguir prueba estática de prueba dinámica y ejecutar la primera sobre
  el proyecto propio, activando la verificación de tipos e interpretando sus diagnósticos. Al
  finalizar, el estudiante debe poder explicar por qué anotar los tipos no corrige defectos sino que
  los deja a la vista.
- **Modalidad:** demostración en pantalla y análisis individual por escrito. La ejecución de los
  comandos sobre el proyecto propio queda como trabajo autónomo, en el equipo de cada estudiante.
- **Ritmo sugerido:** 5 minutos para la distinción, 8 para el código nuevo, 9 para el diagnóstico y
  8 para el análisis.

## Desarrollo

### 2.1 Dos familias de prueba, separadas por una sola cosa

La norma ISO/IEC/IEEE 29119-1 separa las pruebas en dos familias, y el criterio que las divide es
uno solo:

| Familia | ¿Ejecuta el programa? | Qué examina |
| --- | --- | --- |
| **Prueba estática** | No | El código, su estructura y sus declaraciones |
| **Prueba dinámica** | Sí | El comportamiento observado al correrlo |

`pytest` es prueba dinámica: corre la función y compara el resultado. `pyrefly` y `ruff` son prueba
estática: leen el código y afirman cosas sobre él sin ejecutar una sola línea.

Es razonable preguntarse para qué sirve una segunda barrera si la suite ya está en verde. Zulip
—una aplicación web madura, con cobertura de pruebas inusualmente alta— anotó con tipos el 100% de
su backend, unas 50.000 líneas de Python, y el verificador **señaló decenas de defectos latentes**
que las pruebas no habían encontrado. Sus propios desarrolladores aclaran que, precisamente por esa
cobertura alta, no aparecieron errores escandalosos: aparecieron los otros, los que sobreviven
callados porque ninguna prueba pasó por ahí.

La conclusión que importa: **no son la misma barrera dos veces**. Cada una ve una clase distinta de
problema.

### 2.2 El proyecto crece, y el verificador se queda callado

El producto de calificaciones necesita una función más: obtener la nota final de un alumno concreto
a partir del registro del curso. Se agrega a `notas.py`:

```python
def nota_de(alumno, registro):
    notas = registro.get(alumno)
    return nota_final(notas)
```

Antes de ejecutar el verificador hay un paso que conviene no saltarse. `pyrefly` necesita saber qué
archivos le corresponden; sin esa declaración revisa con una configuración automática y puede no
llegar a tu código:

```powershell
uv run pyrefly init
```

Eso escribe una sección `[tool.pyrefly]` en el `pyproject.toml`. Ahora sí:

```powershell
uv run pyrefly check
```

```text
 INFO 0 errors
```

Cero errores. Y conviene entender por qué, porque no es que el código esté bien:

`alumno` y `registro` no tienen anotación, así que el verificador no sabe qué se le va a pasar. Sin
una declaración contra la cual contrastar, no puede afirmar que algo esté mal. **No hay
especificación, así que no hay verificación** — exactamente lo mismo que vimos en la Clase 04, ahora
con otra herramienta.

El silencio de una herramienta nunca significa por sí solo que no haya problemas. Significa que, con
la información que tiene, no puede decir nada.

### 2.3 Anotar no corrige: revela

Ahora declaramos el contrato de la función, que es lo que teníamos en la cabeza al escribirla:

```python
def nota_de(alumno: str, registro: dict[str, list[float]]) -> float:
    notas = registro.get(alumno)
    return nota_final(notas)
```

No cambiamos ni una línea de lógica. Volvemos a ejecutar `uv run pyrefly check`:

```text
ERROR Argument `list[float] | None` is not assignable to parameter `notas`
      with type `list[float]` in function `nota_final` [bad-argument-type]
  --> notas.py:14:23
   |
14 |     return nota_final(notas)
   |                       ^^^^^
   |
  The declared type does not allow `None`.
  Consider narrowing the value with an `is not None` check.
 INFO 1 error
```

Lo que el verificador está afirmando, en palabras:

```text
`registro.get(alumno)` devuelve la lista de notas SI el alumno existe en el registro,
y devuelve None si no existe.
Tu código entrega ese resultado directamente a `nota_final`, que no sabe qué hacer con None.
Si alguien consulta por un alumno que no está en el registro, el programa falla.
```

Ese defecto ya estaba antes de anotar. La anotación no lo introdujo: lo hizo visible. Y es un
defecto real, no una formalidad — con un alumno inexistente, el sistema revienta.

Pero hay algo más importante que el defecto, y es lo que este bloque quiere dejar instalado: **el
verificador no encontró un error de programación, encontró una decisión que nadie tomó**. ¿Qué debe
pasar cuando se consulta por un alumno que no está en el registro? ¿Un error explícito? ¿Una nota
cero? ¿Un valor ausente que el llamador debe manejar?

Esa pregunta no la responde ninguna herramienta. Es la misma clase de vacío que la Clase 04 llamó
**criterio sin fuente autorizada**: la especificación nunca dijo nada al respecto, y el código
resolvió por omisión.

La corrección, entonces, no consiste en hacer callar el mensaje sino en tomar la decisión y dejarla
escrita:

```python
def nota_de(alumno: str, registro: dict[str, list[float]]) -> float:
    notas = registro.get(alumno)
    if notas is None:
        raise KeyError(f"No hay notas registradas para {alumno}")
    return nota_final(notas)
```

Con eso el diagnóstico desaparece, y desaparece porque el problema se resolvió. La diferencia entre
esas dos formas de que un mensaje deje de aparecer es el asunto del Bloque 4.

### 2.4 Ejercicio individual: anotar y contar

Sobre tu propio proyecto:

```text
1. Ejecuta `uv run pyrefly check` y anota cuántos diagnósticos aparecen hoy.
2. Elige una función tuya que no tenga anotaciones completas y declárale el contrato
   que tenías en mente al escribirla: qué recibe y qué devuelve.
3. Vuelve a ejecutar el verificador y anota cuántos diagnósticos aparecen ahora.
4. Para cada diagnóstico nuevo, responde por escrito: ¿es un error real en el código,
   o es que la anotación que escribiste no describe bien lo que la función realmente
   hace?
```

Si el número del paso 3 es mayor que el del paso 1, el ejercicio salió bien. Anotar aumenta los
diagnósticos porque aumenta lo que se puede comprobar.

## Punto de control

El bloque está completo cuando cada estudiante puede:

- separar prueba estática de dinámica por el criterio de si se ejecuta el programa;
- explicar por qué una función sin anotar no produce diagnósticos aunque tenga defectos;
- interpretar un diagnóstico de tipos y traducirlo a la situación concreta que haría fallar el
  programa;
- y distinguir un error real en el código de una anotación que describe mal la función.

## Preguntas guía

1. **Si anotar los tipos no cambia el comportamiento del programa, ¿por qué aparecen errores que
   antes no aparecían?**
   **Pista:** revisa contra qué compara el verificador antes y después de la anotación.
2. **¿Por qué un error de tipos suele ser una pregunta de producto sin responder?**
   **Pista:** piensa en qué decisión hay detrás del caso que la anotación dejó al descubierto.
3. **¿Qué significa exactamente que una herramienta estática no reporte nada?**
   **Pista:** distingue entre «no hay problemas» y «no puedo afirmar nada con lo que tengo».

## Cierre del bloque

- **Idea clave:** el verificador de tipos es la primera prueba del arco y no ejecuta el programa,
  pero solo puede comprobar aquello que alguien declaró. Anotar no corrige defectos: los vuelve
  visibles, y con frecuencia lo que deja al descubierto es una decisión de producto que nunca se
  tomó.
- **Evidencia producida:** el conteo de diagnósticos antes y después de anotar una función propia,
  con cada diagnóstico nuevo clasificado como error real o como anotación mal escrita.
- **Puente:** el verificador de tipos comprueba contratos. Hay una familia entera de defectos que no
  son errores de contrato y que igual se pueden detectar sin ejecutar el código: de eso se ocupa la
  segunda barrera.

### Fuentes técnicas del bloque

- [ISO/IEC/IEEE 29119-1:2022 — conceptos de prueba estática y dinámica](https://www.iso.org/standard/81291.html)
- [Static types in Python, oh my(py)! — Zulip, 2016](https://blog.zulip.com/2016/10/13/static-types-in-python-oh-mypy/)
- [Documentación de Pyrefly](https://pyrefly.org/)
- Clase 02 — el proyecto `evidencia-testing` y la función `nota_final`.
- Clase 04 — criterios sin fuente autorizada.

---

# BLOQUE 3: La segunda barrera, y el techo de las dos

- **Duración:** 30 minutos
- **Objetivo del bloque:** incorporar el análisis estático como segunda barrera, distinguiendo las
  reglas que uniforman estilo de las que detectan defectos, y delimitar el alcance de ambas
  herramientas encontrando un defecto que ninguna de las dos puede ver. Al finalizar, el estudiante
  debe poder justificar cada regla que habilitó y nombrar qué clase de error exige ejecución.
- **Modalidad:** demostración en pantalla y análisis individual por escrito. La ejecución de los
  comandos sobre el proyecto propio queda como trabajo autónomo, en el equipo de cada estudiante.
- **Ritmo sugerido:** 7 minutos para el linter, 6 para la distinción estilo/defecto, 7 para el
  contraste entre barreras y 10 para el experimento final.

## Desarrollo

### 3.1 Lo que el linter ve, y lo que hay que pedirle que vea

El producto necesita una función más: el promedio ponderado, donde cada nota tiene un peso distinto.
Se agrega a `notas.py`, anotada y con la misma disciplina de redondeo que ya usamos:

```python
def promedio_ponderado(notas: list[float], pesos: list[float]) -> float:
    total = sum(n * p for n, p in zip(notas, pesos))
    return float(Decimal(str(total / sum(pesos))).quantize(Decimal("0.1"), rounding=ROUND_HALF_UP))
```

Se ejecutan las dos barreras:

```text
uv run pyrefly check   →   INFO 0 errors
uv run ruff check      →   All checks passed!
```

Las dos en verde. Y sin embargo la función tiene un defecto que entrega notas equivocadas:

```python
>>> notas = [6.0, 5.0, 4.0]
>>> pesos = [0.5, 0.5]
>>> promedio_ponderado(notas, pesos)
5.5
```

`zip()` se detiene en la secuencia más corta. Si los pesos son menos que las notas, **las notas
sobrantes desaparecen del cálculo sin que nadie se entere**: acá el 4.0 no participó del promedio.
No hay excepción, no hay aviso, y el número que sale es plausible. Es exactamente la clase de
defecto que el módulo persigue.

La regla que lo detecta se llama `B905` y viene de `flake8-bugbear`, una familia que **no está
habilitada por defecto**. Se declara en el `pyproject.toml`:

```toml
[tool.ruff.lint]
extend-select = ["B"]
```

Se vuelve a ejecutar `uv run ruff check`:

```text
B905 `zip()` without an explicit `strict=` parameter
  --> notas.py:18:35
help: Add explicit value for parameter `strict=`
Found 1 error.
```

Con `strict=True`, esa misma llamada lanza un error en vez de descartar notas en silencio: el
defecto pasa de invisible a ruidoso, que es lo que queríamos.

El conjunto de reglas activo por defecto cambia entre versiones de la herramienta, así que no se da
por sabido: se comprueba ejecutando, antes y después de habilitar. Lo que un linter detecta no es
una propiedad fija de la herramienta, **es una consecuencia de lo que alguien decidió activar**.

### 3.2 Estilo o defecto: la distinción que obliga a justificar

Las reglas de un linter no son todas de la misma naturaleza, y tratarlas como si lo fueran es lo que
lleva a desactivarlas en bloque cuando molestan.

| Clase de regla | Qué pasa si se incumple | Ejemplo |
| --- | --- | --- |
| **Estilo** | El código queda menos legible o menos uniforme | Líneas demasiado largas, importaciones desordenadas |
| **Defecto** | El programa se comporta de forma incorrecta o imprevista | `B006`, comparaciones con `None` usando `==`, variables asignadas y nunca usadas |

La distinción tiene una consecuencia práctica. Silenciar una regla de estilo es una decisión de
equipo, discutible y de bajo riesgo. Silenciar una regla de defecto es aceptar un error conocido, y
eso exige un argumento escrito.

De ahí la exigencia que vas a arrastrar por el resto del módulo: **cada regla que habilites,
ajustes o silencies necesita una razón registrada**, indicando qué decía el diagnóstico y por qué en
ese caso concreto no corresponde. Una configuración sin justificación no es una decisión técnica: es
un ajuste hasta que el mensaje desapareció.

### 3.3 Las dos barreras no se solapan

Con las dos herramientas configuradas, se comprueba en máquina que cada una detecta lo que la otra
no:

| Defecto | `pyrefly` | `ruff` |
| --- | :---: | :---: |
| `zip()` que descarta elementos en silencio (`B905`) | No | **Sí, si se habilita `B`** |
| Pasar `None` donde se espera una lista | **Sí** | No |
| Función que declara devolver `float` y devuelve `str` | **Sí** | No |
| Variable asignada y nunca utilizada (`F841`) | No | **Sí** |
| Fecha sin zona horaria (`DTZ005`) | No | **Sí** |

Ninguna de las dos es un superconjunto de la otra. Por eso el proyecto corre las dos, y por eso las
dos tienen que quedar en verde antes de ejecutar una sola prueba.

### 3.4 Experimento final: el defecto que ninguna de las dos ve

Este es el experimento que cierra la clase, y usa un defecto que ya conoces.

En la Clase 02 corregimos `nota_final` para que un promedio de `3.95` se informara como `4.0`,
reemplazando el redondeo del lenguaje por `Decimal` con criterio `ROUND_HALF_UP`. Vamos a deshacer
esa corrección a propósito y observar qué dice cada barrera.

**Paso 1.** Reemplaza el cuerpo de `nota_final` por la versión ingenua:

```python
def nota_final(notas: list[float]) -> float:
    promedio = sum(notas) / len(notas)
    return round(promedio, 1)
```

**Paso 2.** Se ejecutan las tres herramientas, en este orden. Este es el resultado real:

```text
uv run pyrefly check
 INFO 0 errors

uv run ruff check
All checks passed!

uv run pytest -q
.F                                                                       [100%]
=================================== FAILURES ===================================
____________________________ test_redondea_395_a_40 ____________________________

    def test_redondea_395_a_40() -> None:
>       assert nota_final([3.8, 4.1, 3.95]) == 4.0
E       assert 3.9 == 4.0
E        +  where 3.9 = nota_final([3.8, 4.1, 3.95])

test_notas.py:9: AssertionError
=========================== short test summary info ============================
FAILED test_notas.py::test_redondea_395_a_40 - assert 3.9 == 4.0
1 failed, 1 passed in 0.09s
```

**Paso 3.** Responde por escrito:

```text
1. ¿Qué dijo el verificador de tipos sobre esta implementación?
2. ¿Qué dijo el linter?
3. ¿Qué dijo la suite de pruebas?
4. ¿Por qué las dos primeras no podían detectarlo?
```

El resultado que vas a observar: las dos barreras estáticas quedan en verde y `pytest` deja roja la
prueba `3.95 → 4.0`.

Y la respuesta a la cuarta pregunta es el motivo de todo lo que viene en la Unidad 2. Los tipos son
correctos: entra una lista de números y sale un número. El estilo es correcto: no hay nada
sospechoso en la forma de ese código. **Lo que está mal es el resultado**, y el resultado solo
existe cuando el programa se ejecuta. Ninguna herramienta que se limite a leer el código puede saber
que la regla del producto exige `4.0` y la implementación entrega `3.9`, porque esa regla no está
escrita en el código: está en el acuerdo con quien define el producto.

**Paso 4.** Restaura la versión con `Decimal` y confirma que las tres herramientas vuelven a quedar
en verde.

## Punto de control

El bloque está completo cuando cada estudiante puede:

- explicar por qué una regla que detecta defectos puede estar desactivada por defecto;
- clasificar una regla del linter como de estilo o de defecto y justificar la clasificación;
- nombrar al menos un defecto que detecta cada herramienta y que la otra no;
- y explicar, sobre el caso del redondeo, por qué ninguna prueba estática podía detectarlo.

## Preguntas guía

1. **¿Por qué desactivar una regla de defecto exige un argumento escrito y desactivar una de estilo
   no?**
   **Pista:** compara qué se acepta en cada caso cuando el diagnóstico deja de aparecer.
2. **Si las dos barreras estáticas están en verde, ¿qué puedes afirmar sobre tu proyecto?**
   **Pista:** enuncia la afirmación acotada, no la cómoda.
3. **¿Por qué el defecto de redondeo no es detectable leyendo el código?**
   **Pista:** pregunta dónde está escrita la regla que ese resultado incumple.

## Cierre del bloque

- **Idea clave:** las pruebas estáticas son dos barreras distintas y complementarias, y lo que
  detectan depende de lo que alguien decidió activar. Ambas tienen el mismo techo: pueden comprobar
  que el código es consistente consigo mismo, pero no que el resultado sea el que el producto
  necesitaba.
- **Evidencia producida:** el registro de las tres herramientas frente al mismo defecto, con la
  explicación de por qué solo la tercera lo detecta, y la configuración del linter con cada regla
  habilitada justificada.
- **Puente:** ya sabemos leer un diagnóstico y decidir qué hacer con él. El bloque siguiente entrega
  esa misma decisión a un agente y examina si la resolvió o solo la hizo desaparecer.

### Fuentes técnicas del bloque

- [Ruff — regla B006, mutable-argument-default](https://docs.astral.sh/ruff/rules/mutable-argument-default/)
- [Ruff — configuración y selección de reglas](https://docs.astral.sh/ruff/configuration/)
- [Documentación de Pyrefly](https://pyrefly.org/)
- Clase 02 — el defecto de redondeo `3.95 → 4.0` y su corrección con `Decimal`.
- Clase 04 — la regla del producto como fuente de verdad, fuera del código.

---

# BLOQUE 4: El agente lo arregló… ¿o lo hizo desaparecer?

- **Duración:** 25 minutos
- **Objetivo del bloque:** auditar la corrección que un agente propone frente a un diagnóstico
  estático, determinando con evidencia si eliminó el defecto o únicamente el mensaje. Al finalizar,
  el estudiante debe poder sostener esa distinción con una prueba y no con una impresión.
- **Modalidad:** demostración en pantalla y análisis individual por escrito. La auditoría sobre el
  proyecto propio queda como trabajo autónomo, en el equipo de cada estudiante.
- **Ritmo sugerido:** 5 minutos para plantear el encargo, 7 para reconocer los desenlaces, 8 para la
  auditoría y 5 para consolidar la regla.

## Desarrollo

### 4.1 El encargo

Volvemos a la función del Bloque 2, en su versión con el diagnóstico abierto:

```python
def nota_de(alumno: str, registro: dict[str, list[float]]) -> float:
    notas = registro.get(alumno)
    return nota_final(notas)
```

Se le entrega a un agente el código y la salida literal de `pyrefly`, con un encargo deliberadamente
neutro, del tipo que cualquiera escribiría con prisa:

```text
Este código produce el siguiente error de tipos. Corrígelo.
```

Ese encargo no dice qué debe pasar cuando el alumno no existe, porque **nosotros tampoco lo hemos
decidido**. Ahí está el problema: le estamos pidiendo a la herramienta que resuelva un vacío de
especificación, y va a resolverlo, porque siempre resuelve.

Y no hace falta un agente para caer en esto. El propio `pyrefly`, al terminar de configurarse,
ofrece exactamente el primero de los tres caminos que veremos:

```text
Found 1 errors. We can add suppression comments (e.g., `pyrefly: ignore`)
to silence them for you. Would you like to suppress them? (y/N):
```

La herramienta que encontró el problema se ofrece a taparlo, con una sola tecla. Responder que sí
deja el proyecto en verde y el defecto intacto.

### 4.2 Los tres desenlaces posibles

La respuesta va a caer en una de estas tres formas. Todas hacen desaparecer el mensaje; solo una
resuelve el problema.

**A. Silenciar el diagnóstico.**

```python
    return nota_final(notas)  # type: ignore[arg-type]
```

También cuenta como silenciar ensanchar la anotación hasta que el conflicto deje de existir. El
mensaje se va, el defecto queda intacto: con un alumno inexistente el programa sigue fallando, solo
que ahora sin aviso previo.

**B. Complacer al verificador cambiando la lógica.**

```python
    notas = registro.get(alumno, [])
    return nota_final(notas)
```

Este es el desenlace peligroso, y es el más frecuente. El tipo ahora es `list[float]`, el verificador
queda conforme, y el código incluso parece más elegante. Pero se cambió el comportamiento: ante un
alumno inexistente ya no llega `None` a `nota_final`, llega una lista vacía, y `nota_final` intenta
dividir por cero.

El resultado es **estrictamente peor que el original**. Antes el programa fallaba en el lugar donde
estaba el problema. Ahora falla dentro de otra función, con una excepción aritmética que no menciona
al alumno ni al registro, y quien la reciba tendrá que reconstruir de dónde vino.

**C. Tomar la decisión y dejarla escrita.**

```python
    notas = registro.get(alumno)
    if notas is None:
        raise KeyError(f"No hay notas registradas para {alumno}")
    return nota_final(notas)
```

Acá el mensaje desaparece porque el caso quedó resuelto: se decidió qué ocurre cuando el alumno no
existe y esa decisión quedó en el código, legible para el que venga después.

Las tres versiones dejan `pyrefly` en verde. La herramienta no distingue entre ellas, y esa es
exactamente la razón por la que hace falta alguien que sí.

### 4.3 Ejercicio individual: auditar con una prueba, no con una opinión

La pregunta *¿resolvió el problema o hizo desaparecer el mensaje?* no se responde mirando el código
y opinando. Se responde con evidencia, y la evidencia acá es una prueba dinámica.

```text
1. Pídele a un agente que corrija el diagnóstico, con el encargo neutro de 4.1.
2. Antes de mirar su respuesta, escribe una prueba para el caso que el diagnóstico
   señalaba: consultar por un alumno que no está en el registro.
3. Decide y escribe qué esperas que ocurra en ese caso. Esa decisión es tuya, no del
   agente.
4. Aplica la corrección del agente y ejecuta la prueba.
5. Clasifica el resultado como A, B o C, y fundamenta con la salida de la prueba.
```

El paso 3 es el que ordena todo lo demás. Sin una expectativa declarada antes de ver la respuesta,
cualquier resultado parece aceptable: el código corre, el verificador está verde y no hay nada
visible que objetar. La prueba escrita de antemano es lo que convierte la auditoría en una
comprobación en lugar de una impresión.

### 4.4 La regla que queda

De este bloque sale un criterio que vas a arrastrar por el resto del módulo, y que se aplica a
cualquier cosa que un agente proponga —una corrección de tipos, una regla del linter silenciada, una
prueba nueva:

> Si un agente hizo desaparecer un diagnóstico, tienes que poder mostrar **qué caso concreto dejó de
> fallar**. Si lo único que puedes mostrar es que el mensaje ya no aparece, no está corregido: está
> tapado.

El agente propone, y propone bien y rápido. Lo que no puede hacer es decidir qué debía pasar cuando
el alumno no existe, porque esa nunca fue una pregunta técnica.

## Punto de control

El bloque está completo cuando cada estudiante puede:

- reconocer los tres desenlaces posibles frente a un diagnóstico entregado a un agente;
- explicar por qué el desenlace B puede dejar el sistema peor que antes de la corrección;
- auditar una corrección con una prueba escrita antes de conocer la respuesta;
- y enunciar qué evidencia distingue un problema resuelto de un mensaje silenciado.

## Preguntas guía

1. **¿Por qué la versión que usa `registro.get(alumno, [])` es peor que el código original, si pasa
   todas las barreras estáticas?**
   **Pista:** compara dónde falla cada versión y cuánta información entrega ese fallo.
2. **¿Qué parte de este problema no podía resolver el agente por mucho contexto que le dieras?**
   **Pista:** vuelve a la Clase 04 y pregúntate quién es la fuente de verdad de esa decisión.
3. **¿Por qué la prueba debe escribirse antes de ver la corrección propuesta?**
   **Pista:** piensa qué pasa con tu criterio cuando ya viste una solución que se ve razonable.

## Cierre del bloque

- **Idea clave:** las tres formas de hacer desaparecer un diagnóstico son indistinguibles para la
  herramienta y muy distintas para el producto. Separarlas exige una expectativa declarada antes y
  una prueba que la compruebe después.
- **Evidencia producida:** la prueba escrita antes de ver la respuesta del agente, el resultado de
  ejecutarla sobre la corrección propuesta y la clasificación fundamentada del desenlace.
- **Puente:** hoy auditaste a un agente con una prueba. La sesión siguiente convierte esa auditoría
  en un método: un agente produce, otro revisa, y tú arbitras.

### Fuentes técnicas del bloque

- [Documentación de Pyrefly](https://pyrefly.org/)
- Clase 02 — la prueba como expectativa ejecutable.
- Clase 04 — la fuente de verdad de una decisión de producto.

---

# CIERRE DE LA CLASE: Qué quedó comprobado sin ejecutar nada

- **Duración:** 10 minutos

## 1. El recorrido de la sesión

Empezamos con una pregunta heredada de la clase anterior y la respondimos con datos en vez de
argumentos: sobre un proyecto real comparado consigo mismo, se ve qué cambia cuando adopta una suite
de pruebas, y se ve también qué parte de esa lectura es evidencia y qué parte es atribución nuestra.

De ahí salió la observación que ordenó el resto de la clase: buena parte de lo que impide que un
cambio defectuoso entre a un proyecto ocurre **antes de ejecutar el código**. Montamos esas dos
barreras sobre el proyecto propio, comprobamos que no se solapan, y después les buscamos el techo:
un defecto que ambas dejan pasar en verde.

La sesión cerró entregándole un diagnóstico a un agente y auditando qué hizo realmente con él.

## 2. Evidencia mínima de salida

Al terminar la sesión, en tu proyecto debe existir:

- los cuatro indicadores aplicados a tu propio repositorio, con las preguntas que todavía no puedes
  responder marcadas como tales;
- una función tuya anotada, con el conteo de diagnósticos antes y después y cada diagnóstico nuevo
  clasificado;
- `pyrefly` y `ruff` ejecutándose sobre tu proyecto, con las reglas que habilitaste y su
  justificación;
- el registro de las tres herramientas frente al defecto de redondeo, con la explicación de por qué
  solo una lo detecta;
- y una prueba escrita antes de ver la corrección de un agente, con el desenlace clasificado.

## 3. Lo que podemos afirmar hoy

Con las dos barreras en verde, la afirmación acotada es esta:

```text
El código es consistente con los contratos que declaramos,
y no contiene los patrones de defecto que decidimos vigilar.
```

Y lo que **no** podemos afirmar, aunque suene parecido:

```text
El código hace lo que el producto necesita.
```

La distancia entre esas dos frases es la Unidad 2 completa.

## 4. Ticket de salida

Antes de salir, responde en una línea cada una:

1. ¿Qué diagnóstico apareció en tu proyecto solo después de anotar, y qué caso concreto haría fallar?
2. ¿Qué regla habilitaste en el linter y por qué esa?
3. ¿Qué dijeron `pyrefly` y `ruff` sobre el defecto de redondeo?

## 5. Próxima clase: cuando la revisión también es una prueba

Hoy usamos dos herramientas que leen el código sin ejecutarlo. Existe una tercera prueba estática,
la más antigua de todas y la que más defectos encuentra: **que otra persona lea el código**.

La próxima sesión la trata como lo que es, un tipo de prueba con método y con criterios, y le agrega
la versión actual del oficio: un agente escribe, otro audita lo que escribió el primero, y el
estudiante arbitra entre los dos. La pregunta que llevaremos es si dos modelos revisándose entre
ellos producen una revisión real o solo dos opiniones que suenan seguras.

## Mensaje final

> Ninguna de las herramientas de hoy ejecutó tu programa, y aun así encontraron defectos reales. Esa
> es la lección barata. La cara es la otra: las tres formas de hacer callar un diagnóstico se ven
> idénticas desde la herramienta, y solo una arregla algo. Elegir entre ellas nunca fue trabajo de
> la herramienta.

### Fuentes técnicas del cierre

- [ISO/IEC/IEEE 29119-1:2022 — prueba estática y prueba dinámica](https://www.iso.org/standard/81291.html)
- [How SQLite Is Tested](https://www.sqlite.org/testing.html)
- Continuidad del módulo — la revisión de código como prueba estática.
