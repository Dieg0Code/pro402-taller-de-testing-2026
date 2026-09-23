# Clase 11 - Semana 04 - Primero el rojo: desarrollo guiado por pruebas, verde mínimo y refactor con una suite sensible

- **Unidad:** 02 · Desarrollo y Ejecución de Casos de Prueba
- **Fecha:** Martes 22 de septiembre de 2026
- **Duración:** 3 horas pedagógicas · 140 minutos (08:30 - 10:50)
- **Modalidad:** Presencial en Laboratorio PC
- **Docente:** Diego Obando
- **Marco de referencia:** Kent Beck, *Test-Driven Development: By Example* · el ciclo rojo-verde-refactor del desarrollo guiado por pruebas (TDD) · `pytest` sobre Python · Vitest y TypeScript sobre Node · el debate público de 2014 sobre la vigencia de TDD

---

# Objetivos de la Clase

## Objetivo General

Al finalizar esta sesión, el estudiante será capaz de escribir una prueba que todavía no puede
pasar, verla fallar, y recién entonces escribir el código que la hace pasar. Para eso distinguirá el
desarrollo guiado por pruebas de la práctica de escribir pruebas: lo primero no es una técnica de
diseño de casos —esa fue la sesión de partición, valores límite y tablas de decisión— ni una medida
de calidad —esa fue la sesión de cobertura y mutantes, alteraciones artificiales del código—, sino
un **orden de operaciones**, y la
sesión se dedica a establecer qué evidencia aporta exactamente ese orden.
La garantía específica de este orden es puntual y verificable: la prueba puede fallar ante la
ausencia del comportamiento, y consta que puede porque ese fallo se observó antes de implementar el
código que la hace pasar. La sesión anterior
tuvo que preguntar «¿qué haría fallar esta prueba?» y responderla después, alterando el código a
propósito; hoy esa pregunta queda respondida por construcción.
Sobre esa base el estudiante ejecutará el ciclo completo varias veces seguidas sobre su propio
proyecto, sosteniendo las dos disciplinas que lo hacen funcionar: escribir solo el código que la
prueba actual exige y refactorizar solo cuando la suite está en verde. En esta clase, **suite**
significa el conjunto de pruebas automatizadas que se ejecutan como una unidad. También observará
una consecuencia que no buscó: la forma de la función quedó decidida por la prueba que se escribió
primero.
Después repetirá una vuelta completa del mismo ciclo en otro lenguaje y con otro ejecutor de
pruebas, para comprobar con evidencia que el ciclo es independiente de la herramienta.
Y cerrará con el caso que la industria actual vuelve cotidiano: la entrega de un agente, donde la
prueba y el código nacen juntos y en verde, de modo que el rojo previo no quedó observado y esa
garantía del proceso no está disponible. Se aplicará un procedimiento para reconstruir sensibilidad
actual y se marcará con precisión qué parte del historial no puede recuperarse.

## Objetivos Específicos

1. **Distinguir el desarrollo guiado por pruebas de la práctica general de escribir pruebas**,
   enunciando la regla que lo define y las tres fases de su ciclo, y explicando qué garantía concreta
   entrega ese orden de trabajo que ninguna medición posterior sobre una suite ya escrita puede
   reconstruir por completo.
2. **Diferenciar el rojo por ausencia del rojo por comportamiento**, reconociendo que una prueba que
   falla porque la función todavía no existe y una que falla porque el resultado no coincide con el
   esperado son dos estados distintos del ciclo, que se reportan con errores distintos, y que solo el
   segundo confirma que la aserción llegó a ejecutarse y distinguió el valor observado del esperado.
3. **Ejecutar el ciclo completo sobre el proyecto propio al menos tres vueltas seguidas**, dejando
   registro literal de cada rojo, cada verde y cada refactor, y sosteniendo las dos disciplinas que
   lo hacen funcionar: escribir únicamente el código que la prueba actual exige, aunque se sepa de
   antemano cuál será la versión definitiva, y refactorizar solo cuando se cumple la condición que lo
   autoriza —una suite en verde de la que además se sabe que detecta cambios—, entendiendo que un
   refactor cambia la estructura interna y no cambia el comportamiento observable, y que quien lo
   comprueba es la suite y no la lectura del autor.
4. **Reconocer el diseño emergente y leer la cobertura resultante en su lugar correcto**,
   constatando que el nombre, los parámetros y el valor de retorno de la función quedaron decididos
   por la prueba escrita antes que el código, y que el porcentaje de cobertura de una suite así
   aparece alto como consecuencia del método y nunca como meta perseguida.
5. **Reproducir una vuelta completa del ciclo en Vitest sobre TypeScript**, escribiendo la prueba con
   `describe`, `it` y `expect`, viéndola fallar y haciéndola pasar, para separar con evidencia lo que
   cambia al cambiar de lenguaje —la sintaxis y el comando— de lo que no cambia: el orden de las
   operaciones y la garantía que ese orden produce.
6. **Auditar una entrega en la que la prueba y el código fueron escritos a la vez**, identificando
   por qué en ese material la garantía del ciclo está ausente, aplicando el procedimiento que la
   reconstruye en parte, y nombrando qué decisión del ciclo no es delegable en ningún caso.

## Competencias Transversales

- **Tolerar el rojo como evidencia:** provocar el fallo de algo propio y leerlo con calma, entendiendo
  que en este oficio un fallo buscado es un dato que se obtuvo y no un error que se cometió; quien no
  soporta ver rojo termina escribiendo pruebas que no pueden fallar.
- **Disciplina del paso mínimo:** resistir la tentación de escribir la versión completa cuando ya se
  sabe cómo es, porque el valor del método está justamente en que cada incremento de comportamiento
  tenga antes una prueba que lo exija.
- **Separar estructura de comportamiento:** sostener en la práctica una distinción que en el discurso
  todos aceptan, y aceptar el criterio que la resuelve —si el comportamiento observable cambió, eso
  no fue un refactor, sin importar cómo se lo llame.
- **Transferir un método y no una herramienta:** reconocer qué parte de lo aprendido pertenece a
  `pytest` y qué parte sobrevive al cambio de lenguaje, que es la diferencia entre saber usar una
  herramienta y entender un método.
- **Conservar la autoría del criterio:** aceptar ayuda para escribir el código y las pruebas, y no
  ceder la decisión de qué debe cumplir el sistema, que es la única parte del ciclo que no puede
  delegarse sin vaciarlo.

---

# Mapa de la Clase

| Horario | Sección | Propósito |
|---------|---------|-----------|
| 08:30 - 08:40 | Encuadre | Retomar la pregunta con la que cerró la sesión anterior —qué haría fallar esta prueba— y constatar que allí hubo que responderla alterando el código a propósito, porque la suite ya existía. Plantear el cambio de orden que ocupa la sesión. Recordar la fecha de corte de la segunda evaluación parcial y el segundo bloque de la jornada. |
| 08:40 - 09:10 | Bloque 1 | Qué es el desarrollo guiado por pruebas y qué no es. La regla que lo define, las tres fases del ciclo, y la primera vuelta ejecutada en vivo hasta el rojo: la distinción entre fallar porque el código no existe y fallar porque el código no cumple. |
| 09:10 - 09:35 | Bloque 2 | El verde mínimo como decisión deliberada y no como descuido, y el refactor definido como un cambio estructural que no altera el comportamiento observable. Qué autoriza a refactorizar y cómo se comprueba que el refactor no rompió nada. |
| 09:35 - 09:45 | Pausa | Descanso técnico. |
| 09:45 - 10:15 | Bloque 3 | Recapitulación de la primera vuelta y ejecución de la segunda y la tercera sobre la regla de cupo, con todas sus salidas a la vista. El diseño emergente: la forma de la función fue determinada progresivamente por los ejemplos. Y la cobertura de esa suite, leída como consecuencia del método. |
| 10:15 - 10:40 | Bloque 4 | Una vuelta del ciclo en Vitest sobre TypeScript, para separar lo que cambia de lo que no. Y la entrega de un agente, donde prueba y código nacen juntos y en verde: qué evidencia falta, cuál puede reconstruirse después y cuál no. |
| 10:40 - 10:50 | Cierre | Consolidar qué afirma quien trabajó con este orden y no puede afirmar quien probó después, y dejar planteado el límite de la prueba unitaria: hasta aquí todo se verificó con las piezas aisladas. |

> Se trabaja sobre el mismo proyecto de reserva de laboratorio de las sesiones anteriores, pero hoy
> sobre una regla que el sistema **todavía no cumple**: cada sala tiene un cupo máximo de personas y
> una reserva no puede excederlo. Que la regla no esté implementada es la condición para poder
> trabajar, porque el método exige que la prueba exista antes que el código. Para el último bloque hay
> además una carpeta de TypeScript ya preparada con su ejecutor de pruebas instalado, de modo que el
> tiempo se vaya en escribir la prueba y no en instalar herramientas.

## Punto de partida: una prueba que nunca falló no demostró que pueda fallar

Todo lo medido en la sesión anterior se midió **sobre una suite que ya existía**. Ese orden obliga a
una pregunta incómoda: una prueba que nació en verde nunca mostró que fuera capaz de ponerse en
rojo. Una forma directa de averiguarlo fue alterar el código a propósito y mirar si reaccionaba.

En este material, **prueba** significa un caso automatizado que ejecuta una expectativa; **evidencia**
significa la salida, el cambio o el registro observable que permite sostener una afirmación sobre ese
caso. La distinción evita usar «prueba» como si fuera una demostración absoluta de corrección.

Invertir el orden convierte esa averiguación en un hecho observado. Si la prueba se escribe cuando
el comportamiento todavía no existe, el rojo está ahí desde el principio: lo que corresponde es
leer su causa antes de escribir el cambio que la hará pasar.

El recorrido de trabajo de la sesión es **rojo → verde → refactor**, repetido. Se escribe una prueba
que expresa un requisito que el sistema todavía no cumple, se ejecuta y se lee el fallo hasta
entenderlo, se escribe la menor cantidad de código que lo convierte en verde, y recién con la suite
en verde se mejora la forma de lo escrito. En las vueltas TDD de esta sesión no se incorpora
comportamiento nuevo sin una prueba en rojo que lo pida primero, y ningún refactor se hace sin la
suite en verde que lo respalde.

---

# BLOQUE 1: El rojo que hay que ver

- **Duración:** 30 minutos
- **Objetivo del bloque:** explicar TDD como un orden de trabajo, reconocer las fases
  rojo-verde-refactor y distinguir un error que impide ejecutar la prueba de una falla que demuestra
  que la aserción sí llegó a observar y comparar el comportamiento esperado.
- **Modalidad:** ejecución guiada y comprobación individual.
- **Ritmo sugerido:** 5 min para definir el cambio de orden · 5 min para leer el ciclo · 7 min para
  obtener el rojo por ausencia · 8 min para obtener y diagnosticar el rojo por comportamiento ·
  5 min para registrar la evidencia y conectar con el siguiente bloque.

## Desarrollo

### 1.1 TDD no significa solamente «tener pruebas»

Un equipo puede escribir pruebas antes, durante o después del código y terminar, en los tres casos,
con una suite completamente verde. El resultado final puede parecer idéntico, pero el proceso no
entrega la misma evidencia.

En **desarrollo guiado por pruebas** (*Test-Driven Development*, TDD), la prueba que expresa el
siguiente comportamiento se escribe **antes** que el código que lo implementa. Kent Beck resume la
regla inicial así: escribir código nuevo solo cuando una prueba automatizada haya fallado. La prueba
no acompaña una decisión ya tomada: crea la necesidad concreta a la que responderá el siguiente
cambio de producción.

| Orden de trabajo | Qué se observa | Qué se puede afirmar |
|---|---|---|
| Código → prueba → verde | La prueba acepta el código existente | La prueba pasa con esta implementación |
| Prueba → rojo esperado → código → verde | La prueba rechazó el sistema sin el comportamiento y luego aceptó el cambio | La prueba puede detectar, al menos, esa ausencia o respuesta incorrecta |

El rojo no demuestra que el requisito sea correcto ni que todos los casos estén cubiertos. Entrega
una garantía más pequeña y precisa: **la prueba que se está escribiendo es capaz de reaccionar ante
el problema que motivó el cambio**.

### 1.2 El ciclo cambia la pregunta de cada momento

El ciclo se repite en pasos breves:

1. **Rojo:** escribir una prueba para un comportamiento que todavía falta, ejecutarla y comprobar
   que falla por la razón esperada.
2. **Verde:** escribir la menor cantidad de código de producción necesaria para que esa prueba pase.
3. **Refactor:** mejorar nombres, estructura o duplicación sin modificar el comportamiento
   observable, ejecutando la suite para comprobar que sigue verde.

Cada color autoriza una acción distinta. En rojo no corresponde diseñar la solución completa: primero
se debe entender la falla. En verde ya no corresponde agregar comportamiento sin una prueba nueva:
ese será el inicio de otra vuelta. El refactor solo ocurre cuando existe una red de seguridad verde.

```text
requisito pequeño
      ↓
   ROJO ── fallo esperado y entendido
      ↓
   VERDE ─ código mínimo que lo resuelve
      ↓
 REFACTOR ─ misma conducta, mejor estructura
      └──────────────────────────────↺
```

Para esta primera vuelta, la nueva regla del proyecto es:

> Una reserva debe rechazarse cuando la cantidad de personas supera la capacidad de la sala.

Todavía no se diseña toda la política de reservas. Se toma un solo ejemplo observable: una solicitud
de 31 personas para una sala con capacidad 30 debe producir `False`.

### 1.3 Primer intento: rojo por ausencia

La primera prueba fija el nombre de la operación, sus entradas y el resultado esperado antes de que
exista la implementación:

```python
from capacidad import cabe_en_sala


def test_rechaza_reserva_que_supera_el_cupo():
    assert cabe_en_sala(personas=31, capacidad=30) is False
```

Se ejecuta desde la raíz del proyecto:

```bash
uv run --with pytest python -m pytest -q
```

Como `capacidad.py` todavía no existe, `pytest` informa:

```text
ERROR collecting tests/test_capacidad.py
E   ModuleNotFoundError: No module named 'capacidad'
Interrupted: 1 error during collection
```

Este resultado es útil, pero todavía no demuestra que la aserción pueda detectar una reserva que
excede el cupo. `pytest` necesita importar los módulos de prueba para poder ejecutarlos y aquí se
detuvo durante esa **recolección**. El cuerpo de
`test_rechaza_reserva_que_supera_el_cupo()` no llegó a ejecutarse.

Por eso conviene separar dos estados que suelen llamarse informalmente «rojo»:

- **Rojo por ausencia o infraestructura:** la prueba no puede ejecutarse porque falta un módulo, un
  símbolo, una dependencia o una configuración. Prueba que algo necesario no está disponible.
- **Rojo por comportamiento:** la prueba sí se ejecuta y su aserción falla porque el valor observado
  no coincide con el esperado. Prueba que la aserción está mirando el comportamiento declarado.

La disciplina no consiste en celebrar cualquier salida roja. Consiste en leerla y confirmar que la
causa corresponde al paso actual.

### 1.4 Hacer ejecutable la prueba sin resolver todavía la regla

El cambio siguiente elimina solo el obstáculo de importación. Se crea la función con la firma exigida
por la prueba, pero con una respuesta deliberadamente insuficiente:

```python
def cabe_en_sala(personas: int, capacidad: int) -> bool:
    return True
```

Esta función acepta todas las reservas. Por lo tanto, todavía incumple el ejemplo de 31 personas en
una sala de 30. Al volver a ejecutar el mismo comando, la salida relevante es:

```text
F                                                                    [100%]

def test_rechaza_reserva_que_supera_el_cupo():
>   assert cabe_en_sala(personas=31, capacidad=30) is False
E   assert True is False
E    +  where True = cabe_en_sala(personas=31, capacidad=30)

FAILED tests/test_capacidad.py::test_rechaza_reserva_que_supera_el_cupo
1 failed
```

Ahora sí hay un **rojo por comportamiento**:

- `F` indica que la prueba fue recogida y ejecutada;
- `assert True is False` muestra el valor observado y el esperado;
- el nombre de la prueba coincide con la regla que se quiere introducir;
- si la función devuelve la respuesta incorrecta, la prueba reacciona.

Este es el rojo que debe conservarse como evidencia antes de escribir el código que hará pasar la
prueba. No basta con recordar que apareció color rojo en la terminal: hay que poder explicar su
causa.

### 1.5 Criterio para aceptar un rojo

Antes de avanzar al verde, se comprueban tres condiciones:

| Comprobación | Pregunta | Evidencia esperada |
|---|---|---|
| La prueba se ejecutó | ¿`pytest` identifica la función de prueba como `FAILED`? | Aparece el nombre completo de la prueba fallida |
| La causa es la prevista | ¿falló por la regla todavía no implementada y no por un error de escritura o configuración? | El mensaje compara el valor observado con el esperado |
| El mensaje es comprensible | ¿otra persona puede relacionar la salida con el requisito? | El nombre de la prueba y sus datos describen el caso |

Un `SyntaxError`, una dependencia ausente o un nombre mal escrito deben corregirse hasta alcanzar un
rojo que hable del comportamiento. Corregir esos obstáculos no autoriza a implementar toda la regla:
solo permite que la prueba llegue a observarla.

## Comprobación individual del bloque

Sobre el proyecto propio:

1. Elegir una regla pequeña que todavía no esté implementada y expresarla con un solo ejemplo.
2. Escribir una prueba cuyo nombre comunique la respuesta esperada.
3. Ejecutarla y guardar la salida literal del primer rojo.
4. Si la prueba no alcanzó la aserción, agregar únicamente la firma o estructura necesaria para que
   pueda ejecutarse; todavía no implementar la regla.
5. Ejecutarla otra vez hasta obtener un rojo por comportamiento y registrar qué valor se observó y
   cuál se esperaba.

La evidencia del bloque son la prueba y las dos salidas comentadas. El código que la hará pasar se
escribe recién en el Bloque 2.

## Preguntas guía

1. **¿Por qué `ModuleNotFoundError` no demuestra que el `assert` sea sensible al comportamiento?**
   - *Pista:* ubicar en qué fase se interrumpió `pytest` y si el cuerpo de la prueba alcanzó a correr.
2. **¿Qué tendría de sospechoso que la primera ejecución de una prueba nueva apareciera verde?**
   - *Pista:* puede existir ya el comportamiento, o la prueba podría no estar observando aquello que
     declara. Antes de continuar hay que distinguir cuál de las dos situaciones ocurrió.
3. **¿Qué parte de la interfaz de `cabe_en_sala` decidió la prueba antes que la implementación?**
   - *Pista:* revisar el nombre, los parámetros nombrados y el tipo de resultado que exige el
     `assert`.

## Puente al Bloque 2

La prueba ya se ejecuta, falla por la razón esperada y deja visible la diferencia entre `True` y
`False`. El siguiente paso no es escribir la solución definitiva: es descubrir cuál es el cambio más
pequeño que convierte **este** rojo en verde y qué se puede mejorar después sin alterar la conducta.

## Fuentes técnicas del bloque

- Kent Beck, [*Test-Driven Development: By Example*](https://www.informit.com/store/test-driven-development-by-example-9780321146533): regla inicial del método y desarrollo conducido por ejemplos pequeños.
- Documentación oficial de `pytest`, [Anatomy of a test](https://docs.pytest.org/en/stable/explanation/anatomy.html): relación entre acción, comportamiento y aserción.
- Documentación oficial de `pytest`, [How to write and report assertions in tests](https://docs.pytest.org/en/stable/how-to/assert.html): lectura de valores observados y esperados en una falla de aserción.
- Documentación oficial de `pytest`, [pytest import mechanisms and `sys.path`/`PYTHONPATH`](https://docs.pytest.org/en/stable/explanation/pythonpath.html): importación de módulos de prueba durante la recolección.

---

# BLOQUE 2: Verde mínimo y refactor con una red que ya reaccionó

- **Duración:** 25 minutos
- **Objetivo del bloque:** convertir el rojo por comportamiento en verde con el cambio mínimo,
  diferenciar implementación de refactor y aplicar un criterio verificable para modificar la
  estructura sin alterar la conducta observable.
- **Modalidad:** recorrido guiado sobre el mismo ejemplo y aplicación individual en el proyecto.
- **Ritmo sugerido:** 4 min para recuperar el rojo · 7 min para alcanzar el verde mínimo · 5 min
  para comparar estrategias de implementación · 6 min para ejecutar un refactor seguro · 3 min
  para registrar la evidencia y preparar la segunda vuelta.

## Desarrollo

### 2.1 Verde mínimo no significa solución definitiva

El bloque anterior terminó con una prueba ejecutada y una diferencia precisa:

```text
esperado: False
obtenido: True
```

La función disponible era:

```python
def cabe_en_sala(personas: int, capacidad: int) -> bool:
    return True
```

La responsabilidad del paso verde no es anticipar todos los casos del dominio. Es hacer pasar la
prueba actual con el cambio más pequeño que satisfaga exactamente la evidencia disponible:

```python
def cabe_en_sala(personas: int, capacidad: int) -> bool:
    return False
```

Al ejecutar nuevamente:

```bash
uv run --with pytest python -m pytest -q
```

la salida relevante de la ejecución verificada fue:

```text
.                                                                    [100%]
1 passed in 0.02s
```

El tiempo cambia entre equipos; lo importante es el punto, el conteo aprobado y el código de salida.

El punto representa una prueba aprobada. Además, `pytest` termina con código de salida `0`, que en
su interfaz pública significa que todas las pruebas fueron recogidas y pasaron correctamente.

`return False` parece demasiado simple porque lo es. Resuelve un solo ejemplo y no pretende ser la
política completa de capacidad. Esa limitación es deliberada: si se agrega comportamiento que
ninguna prueba pidió, se vuelve a escribir código sin haber visto la prueba que podría rechazarlo.

> **Verde mínimo** es el menor cambio que satisface la prueba actual sin romper las anteriores. No
> significa código descuidado, incompleto por accidente ni listo para producción.

### 2.2 Tres estrategias para llegar a verde

Kent Beck describe estrategias distintas para implementar el paso verde. No son niveles de calidad;
son formas de administrar cuánto riesgo se toma en cada vuelta.

| Estrategia | Qué se hace | Cuándo resulta útil | Riesgo que se controla |
|---|---|---|---|
| **Resolver con una constante** (*Fake It*) | Devolver una constante que satisface el ejemplo actual | Cuando todavía no está clara la generalización o se quiere mantener el paso muy pequeño | Evita inventar una abstracción antes de tener evidencia |
| **Implementación obvia** | Escribir directamente la solución simple que se comprende con seguridad | Cuando la regla es inequívoca y el salto es pequeño | Ahorra pasos mecánicos; si aparece un rojo inesperado, se vuelve a un paso menor |
| **Triangulación** | Agregar otro ejemplo que obligue a reemplazar la constante por una regla general | Cuando hay más de una generalización posible o se necesita evidencia adicional | Impide generalizar a partir de un solo dato |

En esta vuelta se usa **Fake It**: el valor constante `False` es suficiente para el ejemplo
31/30. Esto no engaña a la prueba ni al equipo, porque su carácter provisional está explícito y el
siguiente ejemplo lo dejará en evidencia.

La implementación que ya se puede imaginar es:

```python
def cabe_en_sala(personas: int, capacidad: int) -> bool:
    return personas <= capacidad
```

Sin embargo, esa expresión también decide que 30/30 y 1/30 producen `True`, aunque todavía no existe
una prueba para ninguno de esos casos. Puede ser una implementación obvia razonable, pero en el
recorrido de esta clase se posterga para observar la triangulación: una segunda prueba deberá volver
roja la constante y exigir la regla general.

### 2.3 Refactorizar no es agregar comportamiento con otro nombre

Martin Fowler define un refactor como un cambio en la estructura interna que facilita comprender o
modificar el software **sin cambiar su comportamiento observable**. La intención y el resultado
importan: si cambia lo que el sistema responde, se implementó comportamiento, se corrigió un defecto
o se introdujo uno; no fue un refactor.

| Cambio propuesto | Clasificación | Razón |
|---|---|---|
| `return True` → `return False` | Implementación | Cambia la respuesta para hacer pasar la prueba |
| `return False` → `return personas <= capacidad` | Nuevo comportamiento | Cambia la respuesta de entradas que la prueba actual no cubre |
| `assert ... is False` → `assert ... is True` | Alteración indebida de la especificación | Hace verde la suite cambiando lo esperado, no cumpliéndolo |
| Separar preparación, acción y aserción sin cambiar datos ni resultado | Refactor de la prueba | Reorganiza la lectura y conserva la misma observación |
| Renombrar una variable local sin cambiar su valor ni uso | Refactor | Mejora claridad y conserva la conducta observable |

La fase de refactor **puede terminar sin cambios**. Después del primer verde, la función de producción
tiene una sola línea, no contiene duplicación y todavía no dispone de evidencia para generalizar.
Forzar una abstracción aquí agregaría complejidad, no claridad.

Sí puede mejorarse la lectura de la prueba si los nombres ayudan a separar preparación, acción y
aserción:

```python
from capacidad import cabe_en_sala


def test_rechaza_reserva_que_supera_el_cupo():
    personas_solicitadas = 31
    capacidad_sala = 30

    resultado = cabe_en_sala(
        personas=personas_solicitadas,
        capacidad=capacidad_sala,
    )

    assert resultado is False
```

La prueba sigue consultando los mismos datos y esperando el mismo resultado. Después del cambio, la
ejecución verificada continúa verde:

```text
.                                                                    [100%]
1 passed in 0.01s
```

El formato más extenso no es automáticamente mejor. Se conserva solo si los nombres hacen más
visible la intención; si agregan ruido, la versión breve era la estructura más clara.

### 2.4 La condición que autoriza el refactor

Una suite verde sirve como red de seguridad cuando existe evidencia de que puede reaccionar. En este
caso no se confía únicamente en el verde actual: en el Bloque 1 se observó la misma prueba fallando
con `assert True is False`. Por eso se sabe que el verde apareció por el cambio de producción y no
porque la prueba fuera indiferente al resultado.

Antes de cada refactor se aplica esta puerta de entrada:

1. **Verde:** todas las pruebas relevantes pasan antes de tocar la estructura.
2. **Sensibilidad conocida:** al menos la prueba relacionada fue observada en rojo por el motivo
   esperado.
3. **Conducta fija:** se puede explicar qué respuestas deben permanecer iguales durante el cambio.
4. **Paso pequeño:** se realiza una transformación estructural por vez.
5. **Verificación inmediata:** se ejecuta la suite después de cada transformación.

Si la suite se pone roja durante un refactor, no se modifican las expectativas para recuperar el
verde. Se inspecciona el último cambio estructural, se corrige o se revierte y se vuelve a ejecutar.

#### El agente bajo la misma restricción

Un agente puede proponer el cambio o ejecutar la suite, pero tiende a completar la regla que infiere
del dominio. En esta vuelta eso produciría prematuramente `personas <= capacidad` y borraría el paso
de triangulación. La tarea debe declarar el límite:

```text
Objetivo: hacer pasar únicamente
test_rechaza_reserva_que_supera_el_cupo.

Restricciones:
- no agregar pruebas, ramas, validaciones ni casos nuevos;
- hacer el cambio mínimo en la función existente;
- mostrar el `diff` —la comparación de líneas modificadas— y la salida literal de pytest;
- no declarar éxito si el comando termina con un código distinto de 0.
```

La validación humana no consiste en aceptar el mensaje «listo». Consiste en revisar que el diff no
incorpore conducta no solicitada, que la prueba sensible siga presente y que la salida corresponda a
la ejecución real.

## Comprobación individual del bloque

1. Partir desde el rojo por comportamiento conservado en el Bloque 1.
2. Cambiar la menor cantidad posible de código de producción para satisfacer solo esa prueba.
3. Ejecutar la suite y registrar la salida verde y el código de salida del proceso.
4. Identificar una mejora estructural concreta o justificar por qué todavía no hace falta
   refactorizar.
5. Si se realiza el refactor, ejecutar de nuevo y comparar las respuestas observables antes y
   después.

La evidencia del bloque es una secuencia trazable: **rojo conocido → diff mínimo → verde → refactor
opcional → verde**. Una captura verde sin el rojo previo ni el diff no demuestra el recorrido.

## Preguntas guía

1. **¿Por qué `return False` es aceptable en esta vuelta aunque no sea la solución final?**
   - *Pista:* separar lo que exige el único ejemplo actual de lo que se sabe informalmente sobre el
     dominio completo.
2. **¿Por qué cambiar a `return personas <= capacidad` todavía no cuenta como refactor?**
   - *Pista:* probar mentalmente entradas distintas de 31/30 y observar si alguna respuesta cambia.
3. **¿Qué evidencia convierte el verde actual en una red más confiable que una prueba nacida en
   verde?**
   - *Pista:* recuperar la salida `assert True is False` observada antes del cambio.
4. **¿Cuándo es correcto no modificar nada durante la fase de refactor?**
   - *Pista:* el ciclo ofrece una oportunidad de mejorar la estructura; no obliga a inventar una
     abstracción.

## Puente al Bloque 3

El primer ejemplo ya está verde, pero la constante `False` también rechaza reservas que deberían
aceptarse. El siguiente bloque escribirá un segundo ejemplo —una reserva que coincide exactamente con
la capacidad— y dejará que ese nuevo rojo obligue a generalizar. Así se observará el ciclo completo
varias veces y la regla emergerá de evidencia acumulada, no de una solución adelantada.

## Fuentes técnicas del bloque

- Kent Beck, [*Test-Driven Development: By Example*](https://www.informit.com/store/test-driven-development-by-example-9780321146533): patrones del paso verde y ciclo continuo de prueba y refactor.
- Kent Beck, [“Equality for All”](https://www.informit.com/articles/article.aspx?p=30641): ejemplo original de implementación falsa y triangulación antes de generalizar.
- Martin Fowler, [“Definition of Refactoring”](https://martinfowler.com/bliki/DefinitionOfRefactoring.html): cambio de estructura interna sin alterar el comportamiento observable.
- Martin Fowler, [“Refactoring Boundary”](https://martinfowler.com/bliki/RefactoringBoundary.html): refactor como secuencia de cambios pequeños que preservan comportamiento.
- Documentación oficial de `pytest`, [Managing pytest's output](https://docs.pytest.org/en/stable/how-to/output.html): significado de `.` y `F` en el reporte de ejecución.
- Documentación oficial de `pytest`, [Exit codes](https://docs.pytest.org/en/stable/reference/exit-codes.html): código `0` para una ejecución en que todas las pruebas fueron recogidas y aprobadas.

---

# BLOQUE 3: Tres vueltas, una regla que emerge

- **Duración:** 30 minutos
- **Objetivo del bloque:** completar tres vueltas trazables de rojo-verde-refactor, usar
  triangulación para convertir ejemplos concretos en una regla general y explicar por qué la
  cobertura obtenida es evidencia de ejecución, no una prueba de corrección.
- **Modalidad:** programación guiada y reproducción individual sobre el proyecto.
- **Ritmo sugerido:** 3 min para reconstruir la primera vuelta · 8 min para triangular con el límite
  superior · 8 min para incorporar el límite inferior · 6 min para inspeccionar diseño, cobertura y
  sensibilidad · 5 min para registrar la secuencia propia.

## Desarrollo

### 3.1 La secuencia completa se construye un ejemplo a la vez

La primera vuelta ya está completa:

| Vuelta | Ejemplo escrito primero | Rojo observado | Verde mínimo |
|---|---|---|---|
| 1 | 31 personas, capacidad 30 → `False` | La función devolvía `True` | `return False` |

La constante es correcta para ese ejemplo, pero no distingue entre reservas válidas e inválidas.
La **triangulación** incorpora otro ejemplo que varía un dato significativo. Si ambos ejemplos no
pueden resolverse con la misma constante, el código debe generalizarse lo suficiente para explicar
los dos.

El proceso no parte eligiendo una fórmula y buscando pruebas que la confirmen. Parte expresando una
respuesta del dominio, observando cómo contradice al código existente y recién entonces modifica la
implementación.

```text
ejemplo 1 ── exige rechazar sobrecupo ──┐
                                        ├─ regla que explica ambos
ejemplo 2 ── exige aceptar el límite ───┘
```

### 3.2 Vuelta 2: el límite exacto rompe la constante

La regla de sobrecupo contiene una frontera importante: si la capacidad es 30, una reserva de 30
personas todavía cabe. Se escribe el nuevo ejemplo sin cambiar la implementación:

```python
def test_acepta_reserva_que_ocupa_el_cupo_exacto():
    assert cabe_en_sala(personas=30, capacidad=30) is True
```

Con `return False`, la ejecución produce el rojo esperado:

```text
.F                                                                   [100%]

def test_acepta_reserva_que_ocupa_el_cupo_exacto():
>   assert cabe_en_sala(personas=30, capacidad=30) is True
E   assert False is True

FAILED tests/test_capacidad.py::test_acepta_reserva_que_ocupa_el_cupo_exacto
1 failed, 1 passed in 0.10s
```

La primera prueba continúa verde y la segunda falla. Esto localiza el problema: la constante explica
el sobrecupo, pero no explica el límite permitido. Ahora los dos ejemplos autorizan una
generalización:

```python
def cabe_en_sala(personas: int, capacidad: int) -> bool:
    return personas <= capacidad
```

La suite confirma el verde:

```text
..                                                                   [100%]
2 passed in 0.02s
```

La expresión `<=` no se eligió solo porque parecía correcta. El segundo ejemplo hizo visible que la
igualdad pertenece al lado aceptado de la frontera. La fase de refactor se inspecciona y termina sin
cambios: no hay duplicación ni una estructura interna que simplificar todavía.

### 3.3 Vuelta 3: el límite inferior corrige una generalización incompleta

La fórmula actual acepta cualquier número menor o igual que la capacidad. Eso incluye una reserva de
cero personas, que no representa una reserva válida. Se expresa la nueva decisión del dominio:

```python
def test_rechaza_reserva_sin_personas():
    assert cabe_en_sala(personas=0, capacidad=30) is False
```

El nuevo rojo muestra exactamente el defecto de la generalización anterior:

```text
..F                                                                  [100%]

def test_rechaza_reserva_sin_personas():
>   assert cabe_en_sala(personas=0, capacidad=30) is False
E   assert True is False

FAILED tests/test_capacidad.py::test_rechaza_reserva_sin_personas
1 failed, 2 passed in 0.10s
```

El cambio mínimo agrega el límite inferior y conserva el superior:

```python
def cabe_en_sala(personas: int, capacidad: int) -> bool:
    return 1 <= personas <= capacidad
```

La ejecución final de esta vuelta queda en verde:

```text
...                                                                  [100%]
3 passed in 0.02s
```

El archivo de pruebas completo deja cada decisión separada y localizable:

```python
from capacidad import cabe_en_sala


def test_rechaza_reserva_que_supera_el_cupo():
    assert cabe_en_sala(personas=31, capacidad=30) is False


def test_acepta_reserva_que_ocupa_el_cupo_exacto():
    assert cabe_en_sala(personas=30, capacidad=30) is True


def test_rechaza_reserva_sin_personas():
    assert cabe_en_sala(personas=0, capacidad=30) is False
```

Las tres vueltas pueden auditarse sin reconstruir la intención a partir del código final:

| Vuelta | Rojo | Verde | Decisión obtenida |
|---|---|---|---|
| 1 | `True is False` para 31/30 | constante `False` | el sobrecupo se rechaza |
| 2 | `False is True` para 30/30 | `personas <= capacidad` | el límite exacto se acepta |
| 3 | `True is False` para 0/30 | `1 <= personas <= capacidad` | una reserva requiere al menos una persona |

### 3.4 Diseño emergente, cobertura y sensibilidad

El diseño **emergió** porque varias decisiones se tomaron cuando un ejemplo las volvió necesarias:

- la primera prueba fijó el nombre `cabe_en_sala`, los parámetros nombrados y el resultado booleano;
- la segunda fijó que la igualdad pertenece al conjunto aceptado;
- la tercera agregó el límite inferior;
- la implementación final expresa las tres decisiones sin ramas ni duplicación.

Esto no significa que TDD produzca automáticamente un buen diseño. Las pruebas aportan presión y
retroalimentación; el criterio técnico sigue siendo necesario para escoger nombres, ejemplos,
límites y refactors. «Emergente» tampoco significa improvisado: cada cambio está respaldado por una
decisión observable y una ejecución.

#### La cobertura aparece después del comportamiento

Solo una vez terminadas las vueltas se mide cobertura:

```bash
uv run --with pytest --with pytest-cov python -m pytest --cov=capacidad --cov-report=term-missing -q
```

La ejecución verificada entrega:

```text
...                                                                  [100%]

Name           Stmts   Miss  Cover   Missing
--------------------------------------------
capacidad.py       2      0   100%
--------------------------------------------
TOTAL              2      0   100%
3 passed in 0.09s
```

El 100 % no fue el objetivo que decidió qué pruebas escribir. Es una consecuencia previsible de
haber creado cada línea de producción para responder a ejemplos ejecutables. Además, la métrica solo
informa que las dos sentencias fueron ejecutadas; no demuestra que la política sea completa, que los
resultados sean correctos ni que todos los requisitos del negocio estén representados.

La sensibilidad se comprueba con alteraciones controladas, igual que en la sesión anterior:

| Alteración temporal | Prueba que reacciona | Resultado observado |
|---|---|---|
| `1 <= personas < capacidad` | `test_acepta_reserva_que_ocupa_el_cupo_exacto` | `False is True` |
| `0 <= personas <= capacidad` | `test_rechaza_reserva_sin_personas` | `True is False` |

Estas alteraciones fueron ejecutadas y ambas dejaron `1 failed, 2 passed`. Luego se restauró la
implementación correcta y la suite volvió a `3 passed`. La cobertura indicó **dónde** se ejecutó;
los rojos indicaron **qué decisiones** puede vigilar la suite.

#### Un agente dentro del ciclo, no por encima de él

Una práctica actual de ingeniería agéntica consiste en descomponer objetivos grandes en bloques
pequeños y ofrecer bucles de retroalimentación verificables. Aplicada aquí, cada vuelta es una tarea
separada para el agente:

```text
Contexto: la suite actual está verde y esta es su salida literal.
Nuevo comportamiento: 30 personas en una sala de 30 deben aceptarse.

Secuencia obligatoria:
1. agrega únicamente la prueba de este comportamiento;
2. ejecútala y conserva el rojo;
3. cambia lo mínimo para obtener verde;
4. ejecuta toda la suite;
5. muestra el diff y ambas salidas.

No agregues otros casos ni anticipes reglas no especificadas.
```

El agente puede editar, ejecutar y reportar. La persona conserva dos decisiones: cuál es el siguiente
comportamiento del dominio y si la evidencia presentada realmente lo demuestra. Una salida escrita
por el agente no sustituye la salida producida por la herramienta.

## Comprobación individual del bloque

1. Recuperar el primer verde del proyecto propio.
2. Elegir un segundo ejemplo que contradiga la implementación mínima, no un dato distinto con la
   misma respuesta.
3. Registrar rojo, cambio mínimo y verde sin mezclar otros comportamientos.
4. Repetir con un tercer ejemplo que revele otro límite o supuesto.
5. Medir cobertura después de completar las vueltas y explicar en una frase qué demuestra y qué no.
6. Alterar temporalmente una decisión de la implementación y comprobar qué prueba reacciona antes de
   restaurar el código correcto.

La evidencia es una tabla de tres vueltas con ejemplo, salida roja, diff mínimo y salida verde. El
porcentaje de cobertura puede acompañarla, pero no reemplazarla.

## Preguntas guía

1. **¿Por qué 30/30 aporta más información que repetir otro caso de sobrecupo como 40/30?**
   - *Pista:* identificar cuál de los dos ejemplos obliga a abandonar `return False`.
2. **¿Qué defecto conserva `personas <= capacidad` aunque las dos primeras pruebas pasen?**
   - *Pista:* probar mentalmente el valor inmediatamente anterior al mínimo válido.
3. **¿Qué parte del diseño fue decidida por los ejemplos y qué parte todavía dependió del criterio
   de quien programa?**
   - *Pista:* separar interfaz, fronteras y fórmula final de la selección de requisitos y nombres.
4. **¿Por qué 100 % de cobertura no vuelve innecesaria la alteración controlada?**
   - *Pista:* cobertura registra ejecución; la alteración pregunta si una decisión equivocada sería
     detectada.

## Puente al Bloque 4

El ciclo ya produjo una regla en Python a partir de tres rojos observados. El siguiente bloque cambia
de lenguaje y ejecutor: la misma disciplina se trasladará a TypeScript y Vitest. Después se aplicará
el criterio más exigente de la sesión a una entrega generada por un agente, donde prueba y código
llegaron juntos y en verde y, por lo tanto, falta el historial que aquí se conservó.

## Fuentes técnicas del bloque

- Kent Beck, [“Equality for All”](https://www.informit.com/articles/article.aspx?p=30641): triangulación mediante un segundo ejemplo que obliga a abandonar una constante.
- Kent Beck, [muestra de *Test-Driven Development: By Example*](https://www.informit.com/content/images/9780321146533/samplepages/0321146530.pdf): ciclo rojo-verde-refactor y eliminación de duplicación en pasos breves.
- Coverage.py, [documentación oficial](https://coverage.readthedocs.io/en/latest/): cobertura de sentencias como registro del código ejecutado y soporte para medición de ramas.
- Coverage.py, [“How coverage.py works”](https://coverage.readthedocs.io/en/latest/howitworks.html): separación entre ejecución, análisis y reporte de cobertura.
- OpenAI, [“Harness engineering: leveraging Codex in an agent-first world”](https://openai.com/index/harness-engineering/) (2026): objetivos descompuestos en bloques pequeños, repositorio como fuente de contexto y bucles de validación ejecutables para agentes.

---

# BLOQUE 4: El mismo ciclo en Vitest y la evidencia que falta en una entrega agéntica

- **Duración:** 25 minutos
- **Objetivo del bloque:** ejecutar una vuelta rojo-verde-refactor con Vitest sobre TypeScript,
  separar el método de la herramienta y auditar con precisión una entrega en la que prueba y código
  llegaron juntos y en verde.
- **Modalidad:** ejecución guiada, comparación entre herramientas y análisis técnico individual.
- **Ritmo sugerido:** 3 min para reconocer equivalencias · 8 min para ejecutar una vuelta en Vitest ·
  8 min para auditar una entrega agéntica · 4 min para discutir el alcance actual de TDD · 2 min
  para formular la conclusión del bloque.

## Desarrollo

### 4.1 Cambia la sintaxis; no cambia la disciplina

La carpeta TypeScript parte con Vitest instalado y un script no interactivo:

```json
{
  "scripts": {
    "test": "vitest run"
  },
  "devDependencies": {
    "vitest": "5.0.1"
  }
}
```

`vitest run` ejecuta una sola vez y termina. Esto evita confundir el resultado de la clase con el
modo de observación continua, que permanece esperando cambios en archivos.

La implementación inicial conserva el verde mínimo de la primera vuelta realizada en Python:

```typescript
export function cabeEnSala(
  personas: number,
  capacidad: number,
): boolean {
  return false
}
```

Ahora se escribe primero el comportamiento del límite exacto:

```typescript
import { describe, expect, it } from 'vitest'

import { cabeEnSala } from './capacidad'

describe('cabeEnSala', () => {
  it('acepta una reserva que ocupa el cupo exacto', () => {
    expect(cabeEnSala(30, 30)).toBe(true)
  })
})
```

Las piezas tienen equivalentes claros:

| `pytest` en Python | Vitest en TypeScript | Función |
|---|---|---|
| función cuyo nombre comienza con `test_` | `it(nombre, función)` o `test(nombre, función)` | declarar un caso ejecutable |
| archivo `test_*.py` | archivo `*.test.ts` o `*.spec.ts` | permitir el descubrimiento de pruebas |
| `assert resultado is True` | `expect(resultado).toBe(true)` | comparar valor observado y esperado |
| agrupación por archivo o clase | `describe(nombre, función)` | agrupar casos relacionados; es opcional |
| `python -m pytest -q` | `npm test` | ejecutar la suite preparada |

Vitest transforma TypeScript para ejecutar las pruebas, pero esa ejecución no realiza por sí sola
una comprobación completa de tipos. La prueba de comportamiento y el chequeo estático son controles
distintos; si el proyecto exige ambos, se ejecutan Vitest y el comando de tipado configurado por el
proyecto.

### 4.2 Una vuelta real con otro ejecutor

Con `return false`, el comando:

```bash
npm test -- --reporter=verbose
```

produce el rojo por comportamiento:

```text
RUN  v5.0.1

× capacidad.test.ts > cabeEnSala > acepta una reserva que ocupa el cupo exacto
  → expected false to be true // Object.is equality

Test Files  1 failed (1)
Tests       1 failed (1)
```

La función fue importada, la prueba fue ejecutada y `toBe(true)` comparó el valor booleano mediante
`Object.is`. Para valores booleanos, eso distingue exactamente `true` de `false`. La causa coincide
con el requisito, por lo que el rojo es aceptable.

El cambio mínimo es equivalente al realizado en la segunda vuelta de Python:

```typescript
export function cabeEnSala(
  personas: number,
  capacidad: number,
): boolean {
  return personas <= capacidad
}
```

La nueva ejecución entrega:

```text
✓ capacidad.test.ts > cabeEnSala > acepta una reserva que ocupa el cupo exacto

Test Files  1 passed (1)
Tests       1 passed (1)
```

No hay una mejora estructural necesaria en esta función de una línea, de modo que la fase de refactor
termina sin modificarla. El ciclo quedó completo: rojo leído, verde mínimo comprobado y estructura
inspeccionada.

La transferencia puede resumirse sin nombres de herramientas:

```text
expresar una expectativa → observar que no se cumple → cambiar lo mínimo
→ comprobar que se cumple → mejorar estructura sin cambiar la respuesta
```

### 4.3 Auditar prueba y código cuando nacieron juntos

Una entrega generada por un agente puede llegar con una implementación final y tres pruebas verdes:

```typescript
export function cabeEnSala(
  personas: number,
  capacidad: number,
): boolean {
  return 1 <= personas && personas <= capacidad
}
```

```text
Test Files  1 passed (1)
Tests       3 passed (3)
```

Ese verde demuestra compatibilidad entre las pruebas y el código recibido. No demuestra por sí solo
que las pruebas rechacen una implementación defectuosa: el agente pudo haber escrito expectativas
que simplemente describen su propio código, pudo omitir un límite o pudo no ejecutar lo que afirma.

La auditoría reconstruye parte de la evidencia:

1. **Fijar el criterio fuera del código:** leer el requisito y confirmar de forma independiente las
   respuestas esperadas.
2. **Ejecutar la entrega sin modificarla:** conservar la salida verde como línea base.
3. **Introducir una alteración dirigida:** cambiar temporalmente una decisión de producción sin
   modificar las pruebas.
4. **Exigir el rojo correspondiente:** identificar qué prueba falla y si el mensaje coincide con la
   decisión alterada.
5. **Restaurar la implementación:** comprobar que el cambio temporal ya no aparece en el diff.
6. **Ejecutar otra vez:** recuperar la suite completamente verde.

En la ejecución verificada se reemplazó temporalmente la regla por `return true`. Vitest informó:

```text
× rechaza una reserva que supera el cupo
  → expected true to be false
✓ acepta una reserva que ocupa el cupo exacto
× rechaza una reserva sin personas
  → expected true to be false

Test Files  1 failed (1)
Tests       2 failed | 1 passed (3)
```

Después de restaurar `1 <= personas && personas <= capacidad`, la suite volvió a `3 passed`.

La prueba de rechazo de sobrecupo y la prueba de cero personas demostraron sensibilidad frente a esa
alteración. La prueba del límite exacto permaneció verde porque `return true` todavía satisface ese
caso; eso no es un defecto del test, sino el resultado esperado de una alteración que no contradice
su requisito.

#### Qué se recupera y qué no

| Evidencia | ¿La auditoría puede obtenerla después? | Alcance |
|---|---|---|
| La suite recibida está verde | Sí | Código y pruebas actuales coinciden |
| Las pruebas reaccionan ante alteraciones seleccionadas | Sí | Sensibilidad actual frente a esas alteraciones |
| El requisito elegido es correcto | No automáticamente | Requiere criterio de producto o dominio |
| La prueba existió antes que el código | No, si no quedó historial | Es un hecho del proceso, no del estado final |
| La prueba influyó en el diseño | No retrospectivamente | Requiere observar o registrar la secuencia de trabajo |
| La suite detectará cualquier defecto futuro | No | Ningún conjunto finito de ejemplos ofrece esa garantía |

El procedimiento reconstruye **sensibilidad**, pero no convierte el trabajo pasado en TDD. Para
preservar la secuencia en una entrega futura se necesitan artefactos trazables: commits separados,
salidas de ejecución, registro de la tarea o un agente obligado a detenerse después del rojo.

### 4.4 TDD con agentes: práctica verificable, no dogma

En 2014, David Heinemeier Hansson declaró muerto para su práctica el enfoque *test-first*, pero no las
pruebas automatizadas. Su crítica apuntaba al uso dogmático de TDD y a diseños deformados para
satisfacer aislamiento y dobles de prueba. Kent Beck, Martin Fowler y Hansson discutieron
públicamente esas diferencias y dejaron una conclusión más útil que el eslogan: el valor y el costo
de TDD dependen del contexto, del tipo de sistema y de cómo se aplica.

Los agentes no resuelven ese debate; cambian su escala. Pueden producir código y pruebas juntos con
gran rapidez, pero la velocidad no determina si las expectativas representan el requisito correcto.
El enfoque actual de ingeniería agéntica refuerza precisamente los elementos transferibles de esta
clase: intención explícita, tareas pequeñas, fuentes de verdad accesibles, pruebas ejecutables,
restricciones mecánicas y bucles de retroalimentación.

TDD resulta especialmente útil cuando se necesita:

- convertir un requisito pequeño en una expectativa ejecutable antes de delegar la implementación;
- observar que la prueba puede rechazar el estado anterior;
- limitar el cambio que realizará un agente;
- obtener retroalimentación rápida durante diseño incierto;
- conservar una secuencia auditable de decisiones.

No es obligatorio presentar como TDD todo código que tenga pruebas. También es legítimo escribir
pruebas después, hacer pruebas exploratorias o verificar mediante integración y pruebas de extremo a
extremo (*end-to-end*, E2E). Lo imprescindible es nombrar correctamente la evidencia disponible y
no atribuirle una garantía que el proceso no produjo.

## Comprobación individual del bloque

1. Traducir un solo caso de `pytest` a Vitest sin cambiar su comportamiento esperado.
2. Conservar la salida roja de Vitest antes de implementar la respuesta.
3. Obtener verde mediante el cambio mínimo y decidir explícitamente si existe algo que refactorizar.
4. Tomar una entrega donde prueba y código estén verdes, introducir una alteración dirigida y
   registrar qué prueba reacciona.
5. Escribir dos conclusiones separadas: qué sensibilidad quedó demostrada y qué parte del historial
   continúa siendo desconocida.

## Preguntas guía

1. **¿Qué cambió al pasar de `pytest` a Vitest y qué parte del método permaneció intacta?**
   - *Pista:* separar sintaxis, descubrimiento y comando del orden rojo-verde-refactor.
2. **¿Por qué tres pruebas verdes generadas junto al código no prueban que hubo TDD?**
   - *Pista:* distinguir el estado actual de los archivos del orden histórico en que se produjeron.
3. **¿Por qué la prueba 30/30 continúa verde cuando la implementación se altera a `return true`?**
   - *Pista:* preguntar si esa alteración contradice específicamente la expectativa de ese caso.
4. **¿Qué decisión no debería delegarse al agente aunque este escriba y ejecute todo el código?**
   - *Pista:* alguien debe determinar qué comportamiento representa realmente el requisito.

## Puente al cierre

El método sobrevivió al cambio de lenguaje y la auditoría dejó dos garantías distintas: haber visto
una prueba roja antes de implementar no equivale a comprobar después que una prueba puede fallar.
Ambas evidencias son útiles, pero solo la primera pertenece al proceso TDD. El cierre fija qué puede
afirmarse en cada caso y prepara el cambio desde funciones aisladas hacia componentes integrados.

## Fuentes técnicas del bloque

- Vitest, [Getting Started](https://vitest.dev/guide/): instalación, descubrimiento y ejecución de pruebas.
- Vitest, [Writing Tests](https://vitest.dev/guide/learn/writing-tests): uso de TypeScript y distinción entre transformación para ejecutar y comprobación estática de tipos.
- Vitest, [Test API Reference](https://vitest.dev/api/test): `test`, su alias `it` y definición de casos ejecutables.
- Vitest, [`expect` API](https://vitest.dev/api/expect): aserciones y semántica de `toBe`.
- David Heinemeier Hansson, [“TDD is dead. Long live testing.”](https://dhh.dk/2014/tdd-is-dead-long-live-testing.html): crítica a *test-first* como práctica universal, no a las pruebas automatizadas.
- Martin Fowler, [“Is TDD Dead?”](https://martinfowler.com/articles/is-tdd-dead/): conversaciones públicas entre Kent Beck, David Heinemeier Hansson y Martin Fowler sobre TDD y diseño.
- OpenAI, [“Harness engineering: leveraging Codex in an agent-first world”](https://openai.com/index/harness-engineering/) (2026): intención especificada por personas, tareas pequeñas y bucles de validación para trabajo ejecutado por agentes.

---

# Cierre de la clase: qué evidencia permite afirmar cada proceso

- **Duración:** 10 minutos
- **Propósito:** consolidar las garantías precisas del ciclo, evitar afirmaciones exageradas y
  conectar las pruebas unitarias de esta sesión con las pruebas de integración de la siguiente.

## Síntesis verificable

| Evidencia disponible | Afirmación válida | Afirmación que todavía no corresponde |
|---|---|---|
| La prueba fue observada en rojo por la razón esperada | La prueba detectó el estado sin el comportamiento | Que cubre todos los defectos posibles |
| El cambio mínimo produjo verde | El ejemplo actual fue satisfecho sin romper la suite ejecutada | Que el producto completo es correcto |
| La suite permaneció verde durante el refactor | Para los casos cubiertos, no se observó un cambio de conducta | Que ninguna conducta externa pudo cambiar |
| Una segunda prueba obligó a generalizar | La regla nueva explica al menos ambos ejemplos | Que no existen otros límites relevantes |
| La cobertura llegó a 100 % | Todas las sentencias medidas fueron ejecutadas | Que todas las decisiones o requisitos fueron comprobados |
| Una alteración dirigida produjo rojo | La suite es sensible a esa alteración concreta | Que la prueba fue escrita antes del código |
| Git conserva, en el momento de trabajo, la prueba roja antes que la implementación | Existe evidencia trazable del orden registrado | Que la expectativa representa por sí sola el requisito correcto |

## La cadena completa

```text
criterio humano
      ↓
ejemplo ejecutable
      ↓
rojo por la razón esperada
      ↓
verde mínimo
      ↓
refactor con una suite sensible
      ↓
siguiente ejemplo
```

La herramienta puede ser `pytest`, Vitest u otra. El agente puede escribir el cambio, ejecutar los
comandos y devolver los resultados. La responsabilidad de decidir qué debe cumplir el sistema y de
evaluar si la evidencia alcanza permanece en la persona que conduce el trabajo.

## Comprobación de salida

Cada estudiante completa, sin ejecutar cambios nuevos, estas tres frases con evidencia de su propia
secuencia:

1. **Mi prueba podía fallar porque observé...**
2. **El código mínimo que convirtió ese rojo en verde fue...**
3. **Todavía no puedo afirmar que...**

Una respuesta correcta nombra una salida, un cambio concreto y un límite. «Todo funciona» no es una
conclusión admisible porque excede la evidencia producida durante la sesión.

## Conexión con la siguiente clase

Hasta aquí `cabe_en_sala` y `cabeEnSala` se ejecutaron como funciones aisladas, sin HTTP, base de
datos ni estado compartido. Eso permite retroalimentación rápida, pero no demuestra que una solicitud
recibida por FastAPI llegue a la función correcta, lea datos reales y persista o rechace una reserva.

La siguiente clase cambia la pregunta:

> La pieza funciona sola. ¿Qué evidencia demuestra que funciona cuando se conecta con las demás?

Para responderla se introducirán pruebas de integración sobre FastAPI, *fixtures* —preparaciones
reutilizables de datos o dependencias para una prueba—, aislamiento de datos y el límite a partir del
cual sustituir una dependencia por un doble de prueba —un reemplazo controlado— deja de comprobar la
colaboración real que interesa.

## Fuentes de síntesis

- Kent Beck, [*Test-Driven Development: By Example*](https://www.informit.com/store/test-driven-development-by-example-9780321146533).
- Martin Fowler, [“Definition of Refactoring”](https://martinfowler.com/bliki/DefinitionOfRefactoring.html).
- Documentación oficial de [`pytest`](https://docs.pytest.org/en/stable/) y [Vitest](https://vitest.dev/).
- Coverage.py, [documentación oficial](https://coverage.readthedocs.io/en/latest/).

---
