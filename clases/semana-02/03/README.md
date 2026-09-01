# Clase 06 - Semana 02 - La revisión como prueba: qué separa una lectura del código de una opinión sobre el código

- **Unidad:** 01 · Calidad y Testing de Software
- **Fecha:** Martes 1 de septiembre de 2026
- **Duración:** 3 horas pedagógicas · 140 minutos (08:30 - 10:50)
- **Modalidad:** Presencial en Laboratorio PC
- **Docente:** Diego Obando
- **Marco de referencia:** IEEE 1028-2008 · revisiones de software · ISO/IEC/IEEE 29119-1:2022 · pruebas estáticas

---

# Objetivos de la Clase

## Objetivo General

Al finalizar esta sesión, el estudiante será capaz de tratar la revisión de código como una prueba
estática con método —con criterios declarados antes de leer, un alcance acotado y un registro de
hallazgos— y no como una opinión emitida sobre el trabajo de otro. Sobre esa base montará la versión
actual del oficio: un agente escribe el código, otro lo audita sin conocer el razonamiento del
primero, y el estudiante arbitra entre ambos. El arbitraje no se resuelve eligiendo al que suena más
seguro, sino convirtiendo cada hallazgo en una prueba ejecutable antes de tocar el código: el
hallazgo que hace fallar una prueba es un defecto, el que no la hace fallar es una preferencia, y el
que no puede escribirse como prueba todavía no está formulado.

## Objetivos Específicos

1. **Ubicar la revisión de código dentro del arco de pruebas estáticas**, distinguiendo los cinco
   tipos formales que define IEEE 1028-2008 —revisión de gestión, revisión técnica, inspección,
   recorrido y auditoría— por su propósito, sus participantes y el registro que cada uno exige, y
   explicando qué defectos puede encontrar una persona que ninguna regla de `pyrefly` o de `ruff`
   podría formular.
2. **Fundamentar con evidencia por qué la revisión sin método falla**, a partir de casos
   documentados en que un código legible por cualquiera mantuvo un defecto grave durante años, y de
   los límites medidos del revisor humano en cantidad de código y en tiempo sostenido de atención.
3. **Construir una lista de comprobación de revisión para el proyecto propio**, derivada de las
   fuentes de defecto ya trabajadas en el módulo —el contrato declarado, los límites, los casos
   vacíos y nulos, la regla de producto y el tratamiento de datos personales—, y aplicarla a un
   fragmento real registrando cada hallazgo como defecto, riesgo o estilo.
4. **Montar una revisión adversarial entre dos agentes** sobre el proyecto propio, entregando al
   auditor el código y el requisito pero no el razonamiento de quien escribió, y documentando la
   configuración usada para que la revisión pueda repetirse.
5. **Demostrar que la respuesta de un auditor automático depende de cómo se le pregunta**,
   contrastando sobre el mismo código dos formulaciones distintas de la misma consulta y explicando
   qué consecuencia tiene ese resultado sobre la confianza que puede depositarse en una revisión
   asistida.
6. **Arbitrar los hallazgos convirtiéndolos en pruebas**, clasificando cada uno según los tres
   desenlaces posibles —la prueba falla, la prueba pasa, o el hallazgo no puede escribirse como
   prueba— y sosteniendo la decisión final con la evidencia obtenida y no con la autoridad de quien
   la propuso.

## Competencias Transversales

- **Revisión con criterio declarado:** fijar qué se va a mirar antes de abrir el código, para que el
  resultado de la revisión no dependa de en qué se fijó el revisor ese día.
- **Comunicación técnica de un hallazgo:** describir un defecto por su efecto observable y no por su
  autor, de modo que la observación pueda verificarse, discutirse o descartarse con evidencia.
- **Arbitraje entre fuentes que se contradicen:** decidir entre dos afirmaciones seguras y opuestas
  buscando el hecho que las separa, en lugar de promediarlas o de seguir a la más elocuente.
- **Responsabilidad sobre el código propio:** asumir que quien firma la entrega responde por todo lo
  que contiene, incluido lo que escribió un agente y lo que otro agente aprobó.

---

# Mapa de la Clase

| Horario | Sección | Propósito |
|---------|---------|-----------|
| 08:30 - 08:40 | Encuadre | Retomar el cierre de la clase anterior: dos herramientas leyeron el código sin ejecutarlo y encontraron defectos reales. Queda una tercera prueba estática, la más antigua de todas, y la única que no es una herramienta. |
| 08:40 - 09:05 | Bloque 1 | Ubicar la revisión como prueba estática formal, distinguir los cinco tipos que define IEEE 1028-2008 y examinar la evidencia de por qué una revisión sin método no encuentra lo que se supone que encuentra. |
| 09:05 - 09:35 | Bloque 2 | Convertir la revisión en un procedimiento: construir la lista de comprobación del proyecto propio y aplicarla a un fragmento, clasificando cada hallazgo como defecto, riesgo o estilo. |
| 09:35 - 09:45 | Pausa | Descanso técnico. |
| 09:45 - 10:15 | Bloque 3 | Montar la revisión adversarial sobre el proyecto propio —un agente escribe, otro audita— y comprobar sobre el mismo código cuánto cambia el veredicto del auditor según cómo se formule la pregunta. |
| 10:15 - 10:40 | Bloque 4 | Arbitrar los hallazgos escribiendo la prueba antes de aplicar la corrección, y clasificar cada uno según los tres desenlaces posibles. |
| 10:40 - 10:50 | Cierre | Consolidar qué agrega la revisión que las herramientas no pueden dar, qué exige a cambio, y por qué el próximo paso es ubicar cada tipo de prueba en la etapa del ciclo de vida que le corresponde. |

---

# BLOQUE 1: La prueba estática que no es una herramienta

- **Duración:** 25 minutos
- **Objetivo del bloque:** ubicar la revisión de código como una prueba estática con procedimiento
  definido, distinguir sus tipos formales y establecer, con evidencia documentada, por qué una
  revisión puede existir y aun así no encontrar nada. Al finalizar, el estudiante debe poder nombrar
  qué clase de defecto solo aparece cuando alguien lee el código contra el requisito.
- **Modalidad:** trabajo individual, con registro escrito sobre el propio repositorio.
- **Ritmo sugerido:** 5 minutos para el encuadre, 5 para los tipos formales, 8 para el caso, 4 para
  los límites medidos y 3 para el ejercicio.

## Desarrollo

### 1.1 Lo que una herramienta no puede preguntar

Ayer dos herramientas leyeron el código sin ejecutarlo y encontraron defectos reales. Vale la pena
mirar de dónde sacaba cada una su información:

- `pyrefly` compara el código **contra los tipos declarados**.
- `ruff` compara el código **contra un catálogo de patrones conocidos**.

Las dos comparan el código contra algo que ya está escrito en alguna parte del sistema. Ninguna lo
compara contra **lo que el producto tenía que hacer**, porque eso no vive en el código: vive en el
requisito.

Este ejemplo pasa las dos barreras sin un solo diagnóstico:

```python
def estado(notas: list[float], asistencia: float) -> str:
    if nota_final(notas) >= 4.0 and asistencia > 70:
        return "aprobado"
    return "reprobado"
```

Los tipos están completos y son correctos. No hay ningún patrón sospechoso. `pyrefly` no tiene nada
que decir y `ruff` tampoco. Y sin embargo el código está mal, porque el requisito dice esto:

```text
Un estudiante APRUEBA cuando cumple las dos condiciones:
  - nota final mayor o igual a 4,0
  - asistencia mayor o igual a 70 por ciento
```

El programa exige asistencia **mayor** a 70. El estudiante con exactamente 70 % reprueba, y no
debería. Para ver ese defecto hay que tener a la vista dos documentos al mismo tiempo —el código y
el requisito— y compararlos. Eso no lo hace una herramienta. Eso es una revisión.

De ahí sale la definición que usaremos durante toda la clase:

> Revisar código es comparar lo que el código hace contra lo que se supone que tenía que hacer,
> antes de ejecutarlo.

ISO/IEC/IEEE 29119-1:2022 la clasifica en la misma familia que el tipado y el linter: es una prueba
estática, porque no ejecuta el programa. Y es la más antigua de las tres.

### 1.2 Cinco cosas distintas que se llaman "revisión"

En la industria la palabra "revisión" nombra actividades que no comparten propósito ni
participantes. IEEE 1028-2008 las separa en cinco tipos y define el procedimiento de cada uno:

| Tipo | Qué examina | Quién participa | Qué produce |
| --- | --- | --- | --- |
| **Revisión de gestión** | El avance, los planes y los plazos | La jefatura, o alguien en su representación | Una decisión sobre el proyecto |
| **Revisión técnica** | Si el producto sirve para el uso previsto | Personas con competencia técnica en el tema | Un juicio técnico fundado |
| **Inspección** | El producto, buscando anomalías | Pares, conducidos por un facilitador imparcial y entrenado | Una lista de anomalías registradas |
| **Recorrido** | El producto, explicado por su propio autor | El autor y su equipo | Comentarios y aprendizaje del equipo |
| **Auditoría** | El cumplimiento de especificaciones, estándares o contratos | Un tercero independiente | Evidencia de conformidad o no conformidad |

Tres distinciones importan para este módulo:

1. **Solo la inspección tiene como objetivo declarado encontrar anomalías.** Las demás persiguen
   otra cosa y pueden encontrar defectos de paso, pero no fracasan si no encuentran ninguno.
2. **La inspección exige un facilitador imparcial**, que por definición no es el autor. Alguien
   revisando su propio código está haciendo otra cosa, y esa otra cosa tiene otro nombre.
3. **La auditoría la hace un tercero independiente.** Es el único tipo donde la independencia es
   parte de la definición y no una buena práctica opcional.

Cuando en esta clase digamos "revisión" sin apellido, nos referimos al tipo que corresponde al
trabajo diario sobre un cambio concreto: una revisión técnica conducida con criterios de inspección.

### 1.3 El caso: el código sí fue revisado

Existe una creencia cómoda sobre la revisión, que suele enunciarse así: si mucha gente puede leer el
código, los defectos se encuentran solos. Hay un caso documentado que la desmiente, y conviene
mirarlo con las fechas exactas.

**Heartbleed** (CVE-2014-0160) fue un defecto en OpenSSL, la biblioteca que cifra buena parte del
tráfico de internet. Permitía pedirle a un servidor hasta 64 KB de su propia memoria —donde viven
las claves privadas, las contraseñas y las sesiones de los usuarios— sin dejar rastro en ningún
registro del servidor.

```text
2011-12-15   Robin Seggelmann envía el parche a la lista openssl-dev
             ↓  recibe UNA respuesta de revisión, de Stephen Henson
2011-12-31   Henson incorpora el parche al proyecto
2012-03-14   Se publica OpenSSL 1.0.1, con la función activada por omisión
             ↓  2 años y 24 días en producción, en la mitad de internet
2014-04-07   Se divulga públicamente y se publica la corrección
```

El punto no es que el código no se hubiera revisado. **Se revisó.** El propio autor lo dijo después:

> *"Unfortunately, even the OpenSSL developer who conducted the review of the code did not notice
> the missing check."*
>
> Lamentablemente, ni siquiera el desarrollador de OpenSSL que hizo la revisión del código notó la
> comprobación que faltaba.

Código abierto, publicado, legible por cualquiera durante dos años, con una revisión efectivamente
realizada por un desarrollador competente del proyecto. El defecto sobrevivió a todo eso. La
conclusión no es que la revisión no sirva: es que **una revisión sin criterios declarados es
indistinguible de no haber revisado**, y la diferencia solo se nota cuando ya es tarde.

### 1.4 Lo que sí se puede medir de un revisor

Si la revisión es una prueba, tiene condiciones de ejecución como cualquier otra. Dos fuentes
independientes las delimitan.

**Cuánto se puede revisar.** SmartBear, a partir del trabajo con un equipo de Cisco Systems, publica
tres límites operativos:

| Límite | Valor |
| --- | --- |
| Código por revisión | no más de 200 a 400 líneas de una vez |
| Tiempo por sesión | no más de 60 minutos seguidos |
| Velocidad de inspección | por sobre 500 líneas por hora, la densidad de defectos encontrados cae de forma marcada |

El tercer número es el más incómodo. Cuando alguien revisa más rápido que 500 líneas por hora, no
encuentra menos defectos porque haya menos: **encuentra menos porque va rápido**. El defecto sigue
ahí.

**Qué tan grande es un cambio real.** El estudio de Google sobre su propio proceso —unos 9 millones
de cambios, más de 25.000 autores y revisores, entre enero de 2014 y julio de 2016— reporta que la
mediana de líneas modificadas por cambio es **24**, que más del 10 % de los cambios modifica una
sola línea, y que la mediana de revisores por cambio es **1**.

Y reporta algo más, que conviene leer completo antes de sacar conclusiones:

> *"Expectations for code review at Google do not center around problem solving. Reviewing was
> introduced at Google to ensure code readability and maintainability. [...] Defect finding is
> welcomed but not the only focus."*
>
> Las expectativas sobre la revisión de código en Google no giran en torno a resolver problemas. La
> revisión se introdujo para asegurar legibilidad y mantenibilidad. [...] Encontrar defectos es
> bienvenido, pero no es el único foco.

Es decir que la organización que más código revisa en el mundo no lo hace principalmente para
encontrar defectos. Lo hace para que el código siga siendo entendible por otra persona. Encontrar
defectos es un efecto valioso, no la razón del proceso.

Eso ordena las cifras anteriores en una sola frase: **la revisión encuentra defectos cuando es
pequeña, lenta y con criterios; y aun así ese no es su único trabajo.**

### 1.5 Ejercicio

Sobre tu propio repositorio, en 3 minutos:

```bash
git log --oneline -5
git diff --stat HEAD~1 HEAD
```

Registra dos cosas:

1. **El tamaño de tu último cambio** en líneas modificadas. Compáralo con la mediana de 24 líneas y
   con el límite de 200 a 400. ¿Tu cambio es revisable en una sola sesión, o habría que partirlo?
2. **Un defecto de tu proyecto que ninguna herramienta podría encontrar**, porque para verlo hay que
   conocer el requisito. Escríbelo en el formato de la comparación: *"el código hace X, el requisito
   dice Y"*. Si todavía no puedes escribirlo así, anota cuál es el requisito que no está escrito en
   ninguna parte: ese es el hallazgo.

## Preguntas guía

1. `pyrefly` compara el código contra los tipos y `ruff` contra un catálogo de patrones. ¿Contra qué
   compara una revisión, y por qué esa fuente de información no puede convertirse en una regla de
   herramienta?
2. El código de Heartbleed fue revisado por un desarrollador competente del proyecto y el defecto
   pasó igual. ¿Qué tendría que haber tenido esa revisión para que el resultado fuera distinto, y
   cuál de los cinco tipos de IEEE 1028 exige justamente eso?
3. Google revisa con una mediana de un revisor y 24 líneas por cambio, y declara que encontrar
   defectos no es su foco principal. ¿Es eso una debilidad del proceso o una decisión? ¿Qué otra
   cosa tiene que estar funcionando para que puedan permitírselo?

## Fuentes técnicas del bloque

- [IEEE Std 1028-2008 — IEEE Standard for Software Reviews and Audits](https://standards.ieee.org/ieee/1028/4402/) — define los cinco tipos de revisión y el procedimiento de cada uno.
- [ISO/IEC/IEEE 29119-1:2022](https://www.iso.org/standard/81291.html) — prueba estática y prueba dinámica.
- [The Heartbleed Bug](https://heartbleed.com/) y [CVE-2014-0160](https://www.cvedetails.com/cve/CVE-2014-0160/) — naturaleza del defecto, versiones afectadas y fecha de divulgación.
- [Declaración de Robin Seggelmann sobre la revisión del parche — The Register, 11 de abril de 2014](https://www.theregister.com/2014/04/11/openssl_heartbleed_robin_seggelmann/) — envío a openssl-dev, la única respuesta de revisión y la cita literal.
- [SmartBear — Best Practices for Peer Code Review](https://smartbear.com/learn/code-review/best-practices-for-peer-code-review/) — los límites de 200 a 400 líneas, 60 minutos y 500 líneas por hora.
- [Sadowski, Söderberg, Church, Sipko y Bacchelli — *Modern Code Review: A Case Study at Google*, ICSE-SEIP 2018](https://sback.it/publications/icse2018seip.pdf) — mediana de 24 líneas modificadas, mediana de 1 revisor, y el Hallazgo 1 sobre el propósito de la revisión.

---

# BLOQUE 2: Qué se mira cuando se revisa

- **Duración:** 30 minutos
- **Objetivo del bloque:** convertir la revisión en un procedimiento repetible. Al finalizar, el
  estudiante debe tener una lista de comprobación propia cuyos ítems ninguna herramienta puede
  responder, y debe poder clasificar cualquier hallazgo como defecto, riesgo o estilo aplicando un
  criterio operativo y no una impresión.
- **Modalidad:** trabajo individual sobre el fragmento entregado y luego sobre el proyecto propio.
- **Ritmo sugerido:** 4 minutos para la regla de la lista, 10 para las cuatro preguntas, 6 para la
  clasificación, 5 para el caso del contraejemplo y 5 para el ejercicio.

## Desarrollo

### 2.1 La lista empieza donde termina la herramienta

El bloque anterior dejó una definición: revisar es comparar el código contra lo que tenía que hacer.
Falta lo difícil, que es **con qué preguntas se hace esa comparación**. Sin preguntas fijadas de
antemano, la revisión encuentra lo que al revisor le llame la atención ese día, que es justamente lo
que le pasó a la revisión de Heartbleed.

Y hay una regla previa a cualquier lista, que se deduce de las cifras de ayer: si un revisor rinde
durante 60 minutos y 400 líneas, esa atención es el recurso más caro del proceso. **Gastarla en algo
que una herramienta ya comprueba es desperdiciarla.** Por eso ningún ítem de nuestra lista puede ser
algo que `pyrefly` o `ruff` respondan solos.

Este es el fragmento que vamos a revisar. Es el cierre de asignatura de un curso:

```python
"""Cierre de asignatura segun la regla declarada en REQUISITOS.md."""

from decimal import ROUND_HALF_UP, Decimal

UMBRAL_APROBACION = 4.0
ASISTENCIA_MINIMA = 70


def nota_final(notas: list[float]) -> float:
    promedio = sum(notas) / len(notas)
    return float(Decimal(str(promedio)).quantize(Decimal("0.1"), rounding=ROUND_HALF_UP))


def estado(notas: list[float], asistencia: float) -> str:
    if nota_final(notas) >= UMBRAL_APROBACION and asistencia > ASISTENCIA_MINIMA:
        return "aprobado"
    return "reprobado"


def resumen(alumno: str, rut: str, notas: list[float], asistencia: float) -> str:
    return f"{alumno} ({rut}): {nota_final(notas)} - {estado(notas, asistencia)}"
```

Y este es el requisito completo del que salió:

```text
Un estudiante APRUEBA la asignatura cuando cumple las dos condiciones:
  - nota final mayor o igual a 4,0
  - asistencia mayor o igual a 70 por ciento

En cualquier otro caso REPRUEBA.

La nota final se informa con un decimal, redondeando 0,05 hacia arriba
(3,95 se informa 4,0).
```

Antes de leerlo, el estado del proyecto:

```text
uv run pytest -q                       →  4 passed in 0.03s
uv run ruff check                      →  All checks passed!
uv run ruff check --extend-select B    →  All checks passed!
uv run pyrefly check                   →  INFO 0 errors
```

Cuatro pruebas en verde, las dos barreras de ayer conformes, y la regla `B` habilitada además. El
fragmento tiene cuatro problemas y ninguna de esas cuatro líneas los menciona.

### 2.2 Las cuatro preguntas de la lista

Cada pregunta viene de una fuente de defecto que ya trabajamos en el módulo. Ninguna se puede
convertir en una regla de herramienta, porque todas necesitan el requisito.

#### Pregunta 1 — El límite: ¿el código usa el mismo operador que el requisito?

El requisito dice **mayor o igual a 70**. El código dice `asistencia > ASISTENCIA_MINIMA`. El nombre
de la constante es correcto y el valor también; lo que está mal es el operador, que es el único
carácter del que ninguna herramienta puede opinar.

```text
estado([5.0, 5.0], 70)   →  'reprobado'
```

El requisito dice que ese estudiante aprueba.

#### Pregunta 2 — El caso que el requisito no nombra: ¿qué pasa con lo vacío, lo cero, lo negativo?

El requisito habla de notas y de asistencia, pero nunca dice qué ocurre si un estudiante no tiene
notas registradas. El código tampoco lo dice, así que decide por accidente:

```text
Traceback (most recent call last):
  File "src/curso.py", line 10, in nota_final
    promedio = sum(notas) / len(notas)
               ~~~~~~~~~~~^~~~~~~~~~~~
ZeroDivisionError: division by zero
```

Un estudiante sin notas hace caer el cierre de asignatura completo.

#### Pregunta 3 — La regla de producto: ¿el redondeo, las unidades y el formato son los declarados?

El requisito es explícito: *3,95 se informa 4,0*. El código usa `Decimal` y `ROUND_HALF_UP`, que es
exactamente lo que la regla pide. Se ve correcto. Este hallazgo es el que trabajaremos en 2.4,
porque confirmarlo cuesta más de lo que parece.

#### Pregunta 4 — El dato personal: ¿qué sale de esta función y hacia dónde va?

```text
resumen('Ana', '11.111.111-1', [5.0, 6.0], 90)
  →  'Ana (11.111.111-1): 5.5 - aprobado'
```

La función devuelve una cadena que contiene el RUT junto con el rendimiento académico. El requisito
no pide el RUT en ninguna parte: no menciona `resumen` en absoluto. Alguien decidió incluirlo, y esa
cadena va a terminar en una pantalla, en un archivo o en un registro de la aplicación.

La Ley 21.719 exige minimización: se tratan los datos necesarios para la finalidad declarada, no
todos los que se tienen a mano. Un identificador nacional pegado a una calificación es un dato
sensible por combinación, y nadie declaró que hiciera falta.

### 2.3 Tres clases de hallazgo, con un criterio y no con una impresión

Los cuatro hallazgos no son la misma cosa, y tratarlos igual es lo que convierte una revisión en una
discusión. La distinción se hace con una sola pregunta operativa:

> **¿Puedes escribir hoy una prueba que falle por este hallazgo?**

| Clase | Qué significa | Qué hacer |
| --- | --- | --- |
| **Defecto** | Existe una entrada concreta donde el sistema hace algo distinto de lo que el requisito declara. La prueba se puede escribir y falla. | Corregir el código. |
| **Riesgo** | Existe una entrada concreta donde el sistema hace algo indeseable, pero el requisito no dice qué debería hacer. La prueba no se puede escribir sin decidir antes el comportamiento esperado. | Completar el requisito, y recién después corregir. |
| **Estilo** | No existe ninguna entrada que distinga el comportamiento actual del propuesto. La prueba pasaría igual antes y después del cambio. | Registrar como preferencia. No bloquea. |

Aplicada al fragmento:

| Hallazgo | Clase | Por qué |
| --- | --- | --- |
| `asistencia > 70` en vez de `>= 70` | **Defecto** | `estado([5.0, 5.0], 70)` devuelve `reprobado` y el requisito dice `aprobado`. La prueba se escribe en una línea. |
| Lista de notas vacía | **Riesgo** | El requisito no dice qué debe pasar. Hay que decidirlo primero: ¿reprueba, es un error de datos, o el estudiante no se informa? |
| El redondeo declarado | **Defecto** | Ver 2.4. Confirmarlo exige encontrar la entrada correcta. |
| El RUT en `resumen` | **Riesgo** | El requisito no define `resumen` ni qué identificador corresponde. Hay que declararlo antes de tocar el código. |

Nótese lo que hace la clasificación: **los dos riesgos no son problemas del programador, son huecos
de la especificación**. Un revisor que los reporta como defectos genera una discusión sin salida,
porque no hay contra qué comparar. Un revisor que los reporta como riesgos devuelve una pregunta que
alguien tiene que responder, y esa respuesta después sí se puede probar.

### 2.4 El hallazgo que era verdadero y falso a la vez

La pregunta 3 quedó pendiente. Alguien revisa `nota_final`, ve que el promedio se calcula en punto
flotante **antes** de entrar a `Decimal`, y levanta el hallazgo:

> El redondeo se aplica sobre un número que ya se corrompió. `Decimal(str(promedio))` no puede
> arreglar lo que `sum(notas) / len(notas)` ya perdió.

Suena bien. Pero un hallazgo sin entrada concreta no se puede clasificar, así que hace falta el
contraejemplo. Aquí hay uno: `[1.0, 1.3, 6.6, 6.9]` suma 15,8 y promedia exactamente 3,95, que por
la regla del producto debe informarse **4,0**.

```text
nota_final([1.0, 1.3, 6.6, 6.9])   →  4.0
```

Devuelve lo correcto. El contraejemplo no falla. ¿Se descarta el hallazgo?

**No, porque el contraejemplo se probó mal.** Estos son los dos intérpretes de la misma máquina:

```text
Python 3.10.1
  sum([1.0, 1.3, 6.6, 6.9])  →  15.799999999999999   /4  →  3.9499999999999997

Python 3.12.12
  sum([1.0, 1.3, 6.6, 6.9])  →  15.8                 /4  →  3.95
```

En 3.12 el `sum()` de Python dejó de ser una suma corriente: usa la variación de Neumaier de la suma
compensada, que arrastra el error acumulado y lo devuelve al total. Ese contraejemplo fallaba en
3.10 y dejó de fallar en 3.12. **El proyecto declara `requires-python = ">=3.12"`.** Quien lo probó
lo hizo en un intérprete que este proyecto no usa.

Pero la compensación mejora la suma, no la vuelve exacta. El hallazgo sigue en pie y solo hay que
buscarle una entrada que sí falle en el entorno declarado:

```text
Python 3.12.12, codigo actual
  nota_final([1.3, 4.6])   →  2.9      (promedio exacto 2,95; debe informar 3,0)
  nota_final([1.1, 6.6])   →  3.8      (promedio exacto 3,85; debe informar 3,9)

Python 3.12.12, sumando en Decimal desde el inicio
  nota_final([1.3, 4.6])   →  3.0
  nota_final([1.1, 6.6])   →  3.9
```

Un estudiante con 1,3 y 4,6 tiene 2,95 de promedio y el sistema le informa 2,9. Es un **defecto**, y
ahora sí se puede escribir la prueba que lo demuestra.

De este episodio salen las dos reglas que gobiernan el resto de la clase:

1. **Un hallazgo sin entrada concreta no es un hallazgo, es una sospecha.** Puede ser una sospecha
   correcta, pero no se puede clasificar ni corregir hasta que alguien produzca la entrada.
2. **Un contraejemplo solo vale en el entorno que el proyecto declara.** Reproducirlo en otro
   intérprete, otra versión o otra máquina no confirma ni descarta nada. Por eso el entorno
   reproducible no es burocracia: es la condición para que una evidencia signifique algo.

En el bloque siguiente veremos de dónde salió ese primer contraejemplo, y por qué quien lo propuso
estaba completamente seguro de tener razón.

### 2.5 Ejercicio

Sobre tu propio proyecto, en 5 minutos:

1. **Escribe tu lista de comprobación**, con al menos cuatro ítems. Cada ítem tiene que ser una
   pregunta que ni `pyrefly` ni `ruff` puedan responder. Si dudas de alguno, la prueba es directa:
   ejecútalos y mira si lo mencionan. Si lo mencionan, sácalo de la lista.
2. **Aplícala a una función tuya** y registra los hallazgos en esta tabla:

   | Hallazgo | Entrada concreta | Qué hace | Qué debería hacer | Clase |
   | --- | --- | --- | --- | --- |

3. **Deja al menos un riesgo declarado**, con la pregunta que hay que responder antes de poder
   corregirlo. Si tu lista solo produjo defectos, es señal de que tu requisito está más completo de
   lo habitual, o de que no lo estás mirando.

## Preguntas guía

1. Un compañero propone agregar a la lista el ítem *"verificar que no haya argumentos mutables por
   omisión"*. ¿Entra o no entra en la lista, y cómo lo compruebas antes de decidir?
2. Dos de los cuatro hallazgos del fragmento son riesgos y no defectos. Si los reportaras como
   defectos, ¿qué discusión se abriría, y por qué no tendría forma de cerrarse?
3. El mismo contraejemplo falla en Python 3.10 y pasa en 3.12. Si tu proyecto no declarara su
   versión de Python, ¿qué le pasaría a cualquier hallazgo de este tipo cuando otra persona intente
   confirmarlo?

## Fuentes técnicas del bloque

- Salidas de `pytest`, `ruff` y `pyrefly` sobre el fragmento, y comportamiento de `nota_final`, `estado` y `resumen`: ejecución registrada sobre el proyecto de la clase en Python 3.12.12 y 3.10.1.
- [CPython — *Improve accuracy of builtin sum() for float inputs*, issue #100425](https://github.com/python/cpython/issues/100425) — cambio de `sum()` a la variación de Neumaier de la suma compensada.
- [Python — `math.fsum()`](https://docs.python.org/3/library/math.html#math.fsum) y [`decimal`](https://docs.python.org/3/library/decimal.html) — alternativas exactas para sumar valores decimales.
- [`Decimal.quantize()` y los modos de redondeo](https://docs.python.org/3/library/decimal.html#decimal.Decimal.quantize) — la regla de producto `3,95 → 4,0` proviene de la Clase 02.
- Minimización de datos personales y datos sensibles por combinación: guía del módulo en [`docs/ley-21719/`](../../../docs/ley-21719/Guia-Maestra-Ley-21719-Proteccion-Datos-Chile-2026.pdf).

---

# BLOQUE 3: Dos agentes, una decisión

- **Duración:** 30 minutos
- **Objetivo del bloque:** montar la revisión adversarial sobre el proyecto propio y comprobar, con
  la misma versión del código, que el resultado de una auditoría automática depende del protocolo
  con que se pide. Al finalizar, el estudiante debe poder describir qué clase de hallazgo un auditor
  automático encuentra bien y cuál no encuentra nunca.
- **Modalidad:** trabajo individual, en el equipo propio, con registro de la configuración usada.
- **Ritmo sugerido:** 6 minutos para el montaje, 8 para los comandos, 10 para el experimento y 6
  para el ejercicio.

## Desarrollo

### 3.1 El montaje: qué recibe el auditor y qué no

La revisión adversarial tiene tres papeles y ninguno se puede saltar:

| Papel | Quién | Qué recibe |
| --- | --- | --- |
| **Autor** | un agente, o tú con ayuda de uno | El requisito. Escribe el código. |
| **Auditor** | otro agente, o el mismo en una sesión nueva | El código y el requisito. **Nada más.** |
| **Árbitro** | tú, siempre | Los dos textos, y la obligación de decidir con evidencia. |

La regla que sostiene el montaje es la del renglón del medio: **el auditor no recibe el razonamiento
del autor**. Si le explicas por qué escribiste el código así, deja de auditar el código y pasa a
auditar tu explicación, que es una tarea distinta y mucho más fácil de aprobar. Por eso la sesión
del auditor tiene que ser nueva: una sesión que ya vio cómo se escribió el código no puede evaluarlo
sin ese antecedente.

Es el mismo principio que IEEE 1028 le exige a la inspección cuando pide un facilitador imparcial.
La diferencia es que aquí la imparcialidad no se consigue con una persona distinta, sino con un
contexto distinto.

### 3.2 Los comandos

Las dos herramientas del oficio hoy sirven para esto y ninguna necesita instalación adicional en el
proyecto. Cualquiera de las dos hace de auditor:

```bash
# Auditoría del cambio sin commitear, contra el estado ya comprometido
codex exec review --uncommitted

# Auditoría dirigida, indicando el requisito contra el cual comparar
claude -p "Audita src/curso.py contra REQUISITOS.md. Para cada hallazgo entrega:
la linea, la entrada concreta que lo hace fallar, lo que hace y lo que deberia
hacer. No corrijas nada." --allowed-tools "Read,Grep,Glob,Bash"
```

Tres detalles del montaje que importan más de lo que parecen:

1. **`--uncommitted` define el alcance.** El auditor revisa lo que cambiaste contra lo último
   comprometido. Eso conecta directo con el límite de ayer: si tu cambio son 800 líneas, el auditor
   revisa 800 líneas de una vez, y ya sabemos qué pasa con la densidad de hallazgos por sobre 500
   líneas por hora.
2. **El requisito tiene que estar en el repositorio.** Los dos comandos comparan el código contra
   los documentos que encuentran. Si tu regla de negocio vive solo en tu cabeza, el auditor no tiene
   contra qué comparar y te va a devolver observaciones de estilo.
3. **La etiqueta del entorno no es garantía del entorno.** Estas herramientas declaran un modo de
   aislamiento —`read-only`, por ejemplo— pero eso depende de la configuración de la máquina. En una
   ejecución registrada para esta clase, una sesión declarada `read-only` ejecutó la suite completa
   y dejó escritos `.pytest_cache/` y `__pycache__/` en el proyecto. Compruébalo tú:

   ```bash
   git status --short
   ```

   antes y después de una auditoría. Es la misma disciplina del bloque anterior: la afirmación se
   verifica, no se acata.

### 3.3 El experimento: la misma versión, tres protocolos

Sobre el fragmento del bloque anterior —el que tiene cuatro problemas y la suite en verde— se
ejecutaron tres auditorías. Mismo código, mismo requisito, mismos cuatro problemas esperando.

**Protocolo 1 — la pregunta que pide confirmación.**

> *"Un compañero revisó `src/curso.py` contra `REQUISITOS.md` y concluyó que el código cumple la
> regla de negocio. Necesito tu confirmación para cerrar la revisión."*

Respuesta obtenida:

```text
No confirmo. El requisito permite aprobar con asistencia igual o superior al 70 %,
pero src/curso.py usa `asistencia > ASISTENCIA_MINIMA`.

Asi, alguien con nota final 4,0 o superior y asistencia exactamente 70 % queda
incorrectamente reprobado. Deberia usar `asistencia >= ASISTENCIA_MINIMA`.
El redondeo ROUND_HALF_UP si coincide con el requisito.
```

Encontró un defecto real, así que la lectura fácil —"si le pides que confirme, te dice que sí"— es
falsa. Lo que hizo fue peor y más difícil de detectar: **emitió una absolución**. Esa última frase
declara correcto justamente el defecto más caro del fragmento, el que cambia estados de aprobación.
Y la emitió sin ejecutar nada.

**Protocolo 2 — la auditoría del cambio.**

```bash
codex exec review --uncommitted
```

```text
[P1] Use decimal arithmetic for the average — src/curso.py:10
  When valid one-decimal grades produce a half-way average, the float calculation
  can move it below the rounding boundary: `[1.3, 6.6]` becomes `3.9499999999999997`,
  so this returns `3.9` and `estado(..., 90)` incorrectly fails the student.

[P1] Use an inclusive attendance cutoff — src/curso.py:15
  For a student with a passing grade and exactly 70% attendance, this strict
  comparison returns "reprobado", although REQUISITOS.md defines the minimum as
  attendance greater than or equal to 70%.
```

Dos defectos, cada uno con su entrada concreta. Para llegar ahí abrió el intérprete y buscó el
contraejemplo, en vez de opinar sobre el código.

**Protocolo 3 — la auditoría dirigida contra el requisito.** Tres hallazgos, y el tercero con una
distinción que conviene leer literal:

```text
3. Lista de notas vacia revienta sin control — src/curso.py:10
   Entrada que falla: nota_final([]) o estado([], 90)
   Hace: lanza ZeroDivisionError: division by zero (verificado).
   Deberia: indefinido — REQUISITOS.md no dice que pasa con un alumno sin notas.

   Lo marco como vacio de especificacion, no como contradiccion con el requisito:
   a diferencia de los hallazgos 1 y 2, aqui no hay una regla escrita que el codigo
   incumpla. Antes de tocarlo hay que decidir cual es la conducta esperada.
```

Es exactamente la distinción entre defecto y riesgo del bloque anterior, hecha por el auditor y sin
que nadie se la pidiera. Además cuantificó el alcance del defecto de redondeo: barriendo pares de
notas de 0,1 a 7,0, **204 combinaciones** con promedio en punto medio se redondean hacia abajo, y
**12 de ellas caen exactamente en 3,95**, que es el caso que el requisito nombra por escrito.

Todas esas cifras se verificaron ejecutando el barrido de nuevo, y son exactas. También lo es la
observación más fina del informe:

```text
nota_final([3.9, 4.0]) si da 4.0, porque ahi el float cae por sobre el punto medio.
El bug es intermitente segun los sumandos.
```

Ese es el motivo por el que la prueba `test_nota_final_redondea_395_a_40` de la clase pasada quedaba
en verde: eligió justo el par que no falla.

**El resultado, en una tabla.**

| Problema del fragmento | Clase | Protocolo 1 | Protocolo 2 | Protocolo 3 |
| --- | --- | :--: | :--: | :--: |
| `asistencia > 70` | Defecto | encontrado | encontrado | encontrado |
| Redondeo sobre punto flotante | Defecto | **declarado correcto** | encontrado | encontrado |
| Lista de notas vacía | Riesgo | no visto | no visto | encontrado y clasificado |
| El RUT en `resumen` | Riesgo | no visto | no visto | no visto |

### 3.4 Lo que ninguno de los tres vio

Los tres auditores fallaron en el mismo punto: **ninguno mencionó el RUT**.

No es una casualidad ni un descuido. Un auditor automático compara el código contra los documentos
del repositorio, y ese hallazgo no está en ningún documento: para verlo hay que saber que un RUT
identifica a una persona natural, que combinarlo con una calificación produce un dato más sensible
que cualquiera de los dos por separado, y que existe una ley que exige tratar solo los datos
necesarios para una finalidad declarada. Nada de eso está en `REQUISITOS.md`, y por eso no hay
contra qué compararlo.

De ahí sale el límite del montaje, que conviene tener claro antes de confiarle una revisión a
cualquiera de las dos herramientas:

> Un auditor automático es muy bueno encontrando **contradicciones** entre el código y lo que está
> escrito. Es desigual encontrando **huecos** en lo que está escrito. Y no encuentra lo que exige
> conocer el producto, el usuario o la ley que lo regula.

Eso último no es una carencia que se arregle con un mejor prompt. Es la razón de que el tercer papel
del montaje exista, y de que sea el tuyo.

### 3.5 Ejercicio

Sobre tu propio proyecto, en 6 minutos:

1. **Asegura el insumo.** Confirma que la regla de negocio que vas a auditar está escrita en un
   archivo del repositorio. Si no lo está, escríbela ahora: dos o tres líneas bastan. Sin eso el
   ejercicio no funciona, y esa es la primera lección.
2. **Corre una auditoría** con cualquiera de los dos comandos, sobre un cambio tuyo sin commitear.
3. **Corre la segunda con el protocolo 1**, pidiendo confirmación de que el código está bien.
4. **Registra la configuración**, para que la revisión sea repetible: qué herramienta, qué versión,
   qué comando exacto, qué archivos vio y en qué fecha.
5. **Compara las dos salidas** y anota:
   - qué hallazgo apareció en una y no en la otra;
   - si alguna emitió una absolución, es decir, si declaró correcto algo sin mostrar la entrada que
     lo respalda;
   - y un problema de tu proyecto que sabes que existe y que **ninguna de las dos** mencionó. Ese es
     el hallazgo que solo tú podías levantar, y es el que vas a defender en el bloque siguiente.

## Preguntas guía

1. El protocolo 1 encontró un defecto real y además declaró correcto otro que no lo era. ¿Cuál de
   las dos cosas es más peligrosa para un proyecto, y por qué la segunda es más difícil de detectar
   que un hallazgo equivocado?
2. Los protocolos 2 y 3 ejecutaron código para respaldar sus hallazgos; el protocolo 1 no ejecutó
   nada. Si tuvieras que escribir una sola regla para aceptar o rechazar una auditoría automática
   sin leerla completa, ¿cuál sería?
3. Ninguno de los tres vio el hallazgo del RUT. ¿Qué tendría que haber existido en el repositorio
   para que sí lo vieran, y por qué escribir eso es trabajo tuyo y no del agente?

## Fuentes técnicas del bloque

- Salidas de los tres protocolos: ejecuciones registradas para esta clase con `codex-cli 0.151.0` y `Claude Code 2.1.252` sobre el fragmento de la sesión, en Python 3.12.12.
- Verificación independiente de las cifras del protocolo 3 —204 pares con promedio en punto medio redondeados hacia abajo, 12 de ellos en 3,95— mediante barrido propio sobre el mismo intérprete.
- [Codex CLI — `codex exec review`](https://developers.openai.com/codex/cli/features) — auditoría no interactiva del cambio sin commitear.
- [Claude Code — modo no interactivo (`-p`) y control de herramientas](https://code.claude.com/docs/en/cli-reference) — auditoría dirigida con alcance de herramientas acotado.
- [IEEE Std 1028-2008](https://standards.ieee.org/ieee/1028/4402/) — la exigencia de un facilitador imparcial en la inspección, de donde se deriva la regla del contexto separado.
- Minimización y datos sensibles por combinación: guía del módulo en [`docs/ley-21719/`](../../../docs/ley-21719/Guia-Maestra-Ley-21719-Proteccion-Datos-Chile-2026.pdf).

---

# BLOQUE 4: El arbitraje se resuelve ejecutando

- **Duración:** 25 minutos
- **Objetivo del bloque:** resolver los hallazgos de una revisión sin depender de la autoridad de
  quien los propuso. Al finalizar, el estudiante debe haber convertido al menos un hallazgo en una
  prueba escrita antes de la corrección, y debe poder clasificar cualquier hallazgo en uno de los
  tres desenlaces posibles.
- **Modalidad:** trabajo individual sobre el proyecto propio.
- **Ritmo sugerido:** 4 minutos para la regla, 8 para los tres desenlaces, 7 para el riesgo que se
  vuelve defecto y 6 para el ejercicio.

## Desarrollo

### 4.1 Por qué la prueba se escribe antes

Al terminar el bloque anterior tienes dos informes que no coinciden y una decisión que tomar. La
tentación es resolverla leyendo: ver cuál argumenta mejor, cuál cita más líneas, cuál suena más
seguro. Ya vimos a dónde lleva eso — el protocolo 1 sonaba perfectamente seguro cuando declaró
correcto el defecto de redondeo.

La decisión se toma de otra manera:

> **Cada hallazgo se convierte en una prueba, y la prueba se escribe antes de tocar el código.**

El orden no es un detalle de procedimiento. Una prueba escrita **después** de la corrección se
escribe mirando el código ya corregido, y entonces solo confirma lo que acabas de hacer: es un
espejo. Escrita **antes**, la prueba dice qué esperas que el sistema haga, y el código todavía no
tiene forma de complacerte. Esa es la diferencia entre una expectativa y una confirmación.

Además resuelve el problema de la autoridad. Da lo mismo si el hallazgo lo levantó un agente, un
compañero o tú: la prueba no sabe quién lo propuso.

### 4.2 Los tres desenlaces

Estas son las tres pruebas escritas para los hallazgos del fragmento, antes de modificar una sola
línea del código:

```python
"""Una prueba por hallazgo, escritas ANTES de tocar el codigo."""

from src.curso import estado, nota_final


def test_h1_asistencia_exactamente_en_el_limite():
    assert estado([5.0, 5.0], 70) == "aprobado"


def test_h2_promedio_395_se_informa_40():
    assert nota_final([1.3, 6.6]) == 4.0


def test_h2_con_el_contraejemplo_del_primer_auditor():
    assert nota_final([1.0, 1.3, 6.6, 6.9]) == 4.0
```

Resultado de ejecutarlas sobre el código sin corregir:

```text
    def test_h1_asistencia_exactamente_en_el_limite():
>       assert estado([5.0, 5.0], 70) == "aprobado"
E       AssertionError: assert 'reprobado' == 'aprobado'

    def test_h2_promedio_395_se_informa_40():
>       assert nota_final([1.3, 6.6]) == 4.0
E       assert 3.9 == 4.0
E        +  where 3.9 = nota_final([1.3, 6.6])

2 failed, 1 passed in 0.10s
```

Tres pruebas, dos desenlaces distintos en una sola corrida.

**Desenlace A — la prueba falla.** El hallazgo está confirmado: existe una entrada concreta donde el
sistema hace algo distinto de lo que el requisito declara. Es un defecto y se corrige. Los dos
primeros hallazgos terminan aquí.

**Desenlace B — la prueba pasa.** Es el tercer caso, y merece leerse con cuidado porque es el que
más se malinterpreta. `[1.0, 1.3, 6.6, 6.9]` era el contraejemplo con que un auditor respaldó el
hallazgo del redondeo. Escrito como prueba, **pasa**. Y sin embargo el hallazgo era correcto, como
demuestra la prueba de al lado.

Que la prueba pase no significa que el hallazgo sea falso. Significa que **esa evidencia no lo
sostiene**, y quedan exactamente dos salidas honestas:

1. buscar otra entrada que sí falle, que es lo que hicimos en el Bloque 2 hasta dar con `[1.3, 6.6]`;
2. o retirar el hallazgo, dejando registrado qué se probó y por qué no se sostuvo.

Lo que no es una salida es dejarlo abierto porque el auditor parecía convincente.

**Desenlace C — la prueba no se puede escribir.** El cuarto hallazgo, el del RUT, se atasca antes de
llegar al `assert`:

```text
lo que devuelve hoy:      'Ana (11.111.111-1): 5.5 - aprobado'
lo que deberia devolver:  ???  el requisito no define resumen
```

No falta trabajo de programación: falta una decisión de producto. El hallazgo es un **riesgo**, y
sigue el camino del bloque siguiente.

### 4.3 El riesgo que se vuelve defecto

El otro riesgo, el de la lista vacía, sirve para ver el camino completo. Se resuelve en tres pasos y
en ese orden:

**Paso 1 — se completa el requisito.** No lo decide el programador ni el agente; lo decide quien
define el producto. Aquí la decisión fue esta:

```text
Un estudiante sin notas registradas no tiene nota final: el sistema debe
rechazar el calculo con un error explicito, no informar un valor.
```

**Paso 2 — ahora sí se puede escribir la prueba**, porque ya existe algo contra qué comparar:

```python
import pytest


def test_h3_sin_notas_registradas_es_un_error_explicito():
    with pytest.raises(ValueError):
        nota_final([])
```

**Paso 3 — se ejecuta antes de corregir**, y falla:

```text
>       promedio = total / Decimal(len(notas))
E       decimal.InvalidOperation: [<class 'decimal.DivisionUndefined'>]

1 failed in 0.11s
```

Aquí hay un detalle que vale la clase entera. Cuando este problema apareció en el Bloque 2, el
síntoma era `ZeroDivisionError`. Ahora es `decimal.InvalidOperation`, porque **la corrección del
hallazgo del redondeo cambió el síntoma del hallazgo de la lista vacía**. Si la prueba se hubiera
escrito después de las correcciones, se habría escrito contra el síntoma nuevo y nadie habría notado
que era el mismo problema de antes. Escrita antes, sigue apuntando a la conducta esperada y no al
error que el código produce hoy.

Recién entonces se corrige, y el resultado sobre todo el proyecto es:

```text
uv run pytest -q       →  8 passed in 0.03s
uv run ruff check      →  All checks passed!
uv run pyrefly check   →  INFO 0 errors
```

Ocho pruebas: las cuatro que ya existían y seguían pasando —eso es la comprobación de regresión— más
las cuatro que salieron de esta revisión.

### 4.4 Lo que queda abierto, y por qué eso también es un resultado

Al cerrar el arbitraje, el registro del fragmento queda así:

| Hallazgo | Clase | Desenlace | Estado |
| --- | --- | --- | --- |
| `asistencia > 70` | Defecto | A · la prueba falló | Corregido, con prueba |
| Redondeo sobre punto flotante | Defecto | A · la prueba falló con `[1.3, 6.6]` | Corregido, con prueba |
| Contraejemplo `[1.0, 1.3, 6.6, 6.9]` | Evidencia | B · la prueba pasó | Descartado como evidencia; el hallazgo se sostuvo con otra |
| Lista de notas vacía | Riesgo → Defecto | C, luego A | Requisito completado, corregido, con prueba |
| El RUT en `resumen` | Riesgo | C · la prueba no se puede escribir | **Abierto**, esperando decisión de producto |

Un hallazgo abierto y declarado como tal es un resultado legítimo de una revisión. Lo que no es
legítimo es cerrarlo sin decisión, o corregirlo inventando la expectativa que falta: eso reemplaza
al que define el producto por el que escribe el código, que es precisamente el error del que se
originan la mitad de los defectos de requisito.

### 4.5 Ejercicio

Sobre los hallazgos que obtuviste en el bloque anterior, en 6 minutos:

1. **Elige dos hallazgos** de las auditorías: uno que creas real y uno del que dudes.
2. **Escribe la prueba de cada uno antes de tocar el código.** Ejecútala y anota el desenlace: A, B
   o C.
3. **Corrige solo lo que quedó en A**, y vuelve a ejecutar la suite completa para comprobar que no
   rompiste nada.
4. **Deja registrado lo demás:**
   - si te quedó un B, escribe qué entrada probaste, por qué no falló, y si el hallazgo se sostiene
     con otra o lo retiras;
   - si te quedó un C, escribe la pregunta de producto que hay que responder antes de poder
     corregirlo.
5. **Anota, para el hallazgo que ningún auditor vio**, qué tendría que decir el requisito para que
   la próxima auditoría sí lo encuentre.

## Preguntas guía

1. Una prueba escrita después de la corrección y una escrita antes pueden tener exactamente el mismo
   código. ¿Qué es distinto entonces, y por qué esa diferencia no se puede ver leyendo el archivo?
2. El desenlace B —la prueba pasa— es el único donde no cambia nada en el código. ¿Por qué entonces
   corresponde registrarlo igual, y qué se pierde si simplemente se borra?
3. La corrección de un hallazgo cambió el síntoma de otro. ¿Qué te dice eso sobre corregir varios
   hallazgos juntos antes de haber escrito sus pruebas?

---

# CIERRE

- **Duración:** 10 minutos

## 1. Evidencia esperada al final de la sesión

Al terminar la sesión, en tu proyecto debe existir:

- tu lista de comprobación, con al menos cuatro ítems, y la constancia de que ninguno es algo que
  `pyrefly` o `ruff` ya respondan;
- el registro de hallazgos sobre una función tuya, con cada uno clasificado como defecto, riesgo o
  estilo, y su entrada concreta;
- la configuración de la auditoría automática que ejecutaste: herramienta, versión, comando exacto y
  archivos que vio;
- las salidas de las dos auditorías con protocolos distintos, y la diferencia entre ambas anotada;
- al menos una prueba escrita antes de la corrección, con su desenlace A, B o C registrado;
- y un hallazgo abierto, con la pregunta de producto que hay que responder para poder cerrarlo.

## 2. Lo que podemos afirmar hoy

La Clase 05 terminó con una afirmación acotada, la que dejaban las dos herramientas. Con la revisión
hecha, la afirmación crece un poco:

```text
El codigo fue comparado contra el requisito escrito,
y las diferencias que aparecieron estan corregidas o registradas.
```

Y lo que sigue sin poder afirmarse, aunque suene parecido:

```text
El codigo hace lo que el producto necesita.
```

La distancia entre esas dos frases tiene hoy un nombre concreto: **es todo lo que el requisito no
dice**. El hallazgo del RUT es la prueba. Sobrevivió a tres auditorías con dos herramientas
distintas, no porque fuera difícil de ver en el código —está en la línea más corta del archivo—,
sino porque no había ningún documento contra el cual compararlo.

Una revisión es tan buena como el documento que usa de referencia. Esa es la lección cara de hoy.

## 3. Ticket de salida

Antes de salir, responde en una línea cada una:

1. ¿Qué hallazgo de tu proyecto levantaste tú y ninguna auditoría automática mencionó?
2. ¿Qué desenlace obtuvo la prueba que escribiste antes de corregir, y qué hiciste con ese resultado?
3. ¿Cuál es el riesgo que dejaste abierto, y qué pregunta hay que responder para cerrarlo?

## 4. Próxima clase: dónde se escribe lo que la revisión necesita

Hoy tres de los cuatro hallazgos dependieron de un documento, y el único que nadie vio fue el único
que ningún documento mencionaba. Queda una pregunta obvia: **¿dónde y cuándo se escribe ese
documento?**

La próxima sesión ubica cada tipo de prueba en la etapa del ciclo de vida que le corresponde, y
revisa qué documentación exigen ISO/IEC 25010 e ISO/IEC/IEEE 29119 en cada una. Ahí aparece también
la respuesta al hallazgo que hoy dejamos abierto: la privacidad por diseño significa que la pregunta
sobre el RUT se responde cuando se define el producto, no cuando alguien la encuentra revisando
código tres semanas después.

## Mensaje final

> Dos auditorías del mismo código, hechas por herramientas distintas, coincidieron en los defectos y
> fallaron en el mismo punto ciego. Ninguna se equivocó por incompetencia: las dos compararon el
> código contra lo que estaba escrito, que es exactamente lo que se les pidió. El punto ciego no
> estaba en las herramientas, estaba en el documento. Y escribir ese documento nunca fue trabajo de
> ellas.

### Fuentes técnicas del cierre

- Ejecuciones registradas para esta clase: las tres pruebas antes de la corrección (`2 failed, 1 passed`), la prueba del requisito completado, y la suite final (`8 passed`) con `ruff` y `pyrefly` en verde, sobre Python 3.12.12.
- [ISO/IEC/IEEE 29119-1:2022](https://www.iso.org/standard/81291.html) — prueba estática, prueba dinámica y su lugar en el proceso.
- [IEEE Std 1028-2008](https://standards.ieee.org/ieee/1028/4402/) — el registro de anomalías como producto obligatorio de la inspección.
- [`pytest.raises`](https://docs.pytest.org/en/stable/reference/reference.html#pytest-raises) — expresar una excepción esperada como expectativa ejecutable.
- Privacidad por diseño y finalidad declarada: guía del módulo en [`docs/ley-21719/`](../../../docs/ley-21719/Guia-Maestra-Ley-21719-Proteccion-Datos-Chile-2026.pdf).
