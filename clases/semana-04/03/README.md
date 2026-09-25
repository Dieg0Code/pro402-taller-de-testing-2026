# Clase 12 - Semana 04 - La pieza sola no es el sistema: integración, la fixture que decide qué datos existen y el doble que deja de ser legítimo

- **Unidad:** 02 · Desarrollo y Ejecución de Casos de Prueba
- **Fecha:** Miércoles 23 de septiembre de 2026
- **Duración:** 3 horas pedagógicas · 140 minutos (08:30 - 10:50)
- **Modalidad:** Presencial en Laboratorio PC
- **Docente:** Diego Obando
- **Marco de referencia:** FastAPI y su cliente de pruebas `TestClient` · `pytest`: *fixtures*, `conftest.py` y alcance · SQLite como base de datos de prueba · ISO/IEC/IEEE 29119-3:2021 · requisitos de datos de prueba (8.5) y de ambiente de prueba (8.6) · Ley 21.719 · minimización y eliminación verificable

---

# Objetivos de la Clase

## Objetivo General

Al finalizar esta sesión, el estudiante será capaz de probar una colaboración entre piezas en lugar
de una pieza sola, y de sostener qué evidencia adicional entrega esa prueba que ninguna prueba
unitaria podía entregar. Para eso establecerá primero qué separa realmente una prueba de integración
de una unitaria, que no es su tamaño ni la cantidad de piezas que toca, sino **qué deja de
sustituir**: la unitaria reemplaza el entorno para observar una función, y la de integración renuncia
a ese reemplazo justamente donde quiere comprobar que dos piezas se entienden.
Sobre esa base verá aparecer una clase de defecto que hasta hoy no podía aparecer. Las sesiones
anteriores dejaron una función verificada, medida y construida con la prueba antes que el código; hoy
esa misma función, alcanzada por una solicitud HTTP, falla igual, y falla por una razón distinta: el
contrato entre las piezas —la forma del dato que entra, el código de estado que sale, la
representación que viaja— no es materia de la lógica interna de ninguna de las dos.
Renunciar a sustituir el entorno tiene un costo inmediato, y es el asunto central de la sesión:
aparecen datos que existen de verdad, que persisten después de que la prueba termina y que
contaminan a la prueba siguiente. El estudiante aprenderá la pieza que administra ese problema —la
*fixture*, que prepara lo que una prueba necesita y lo deshace cuando termina— y comprobará
ejecutando que el aislamiento no es una buena práctica opcional sino la condición para que el
resultado de una prueba signifique algo.
Y decidirá qué datos pueden existir dentro de esa preparación. Ahí las obligaciones de la Ley 21.719
que en la Unidad 1 se escribieron como requisitos dejan de ser un documento: la minimización se
vuelve el contenido concreto de la fixture, y la eliminación verificable se vuelve su desmontaje,
que además puede comprobarse con una prueba.
La sesión cierra con el límite que da sentido a todo lo anterior: hasta dónde es legítimo sustituir
una dependencia en este nivel, y por qué una prueba que sustituye justamente la colaboración que dice
verificar es una prueba unitaria con otro nombre —que es, además, lo que suele devolver un agente
cuando se le pide una prueba de integración.

## Objetivos Específicos

1. **Distinguir la prueba unitaria de la prueba de integración por lo que cada una deja de
   sustituir**, en lugar de por su tamaño o por la cantidad de componentes que toca, y nombrar la
   clase de defecto que solo puede manifestarse en el segundo nivel: el defecto de contrato entre dos
   piezas que, por separado, están correctas y verificadas.
2. **Leer y ejecutar una prueba de integración sobre una API HTTP**, nombrando con precisión cada
   pieza que interviene —la aplicación, la ruta, el cliente de pruebas, la solicitud, el código de
   estado y el cuerpo de la respuesta— y explicando qué afirma exactamente una aserción sobre el
   código de estado frente a una sobre el contenido devuelto.
3. **Escribir una *fixture* de `pytest` y justificar sus cuatro decisiones**: qué prepara antes de la
   prueba, qué entrega a la prueba que la pide, qué deshace después, y con qué alcance —`function`,
   `module` o `session`—, además de saber dónde ubicarla en `conftest.py` para que varias pruebas la
   compartan sin necesidad de importarla.
4. **Demostrar que el aislamiento es una condición y no una virtud**, construyendo dos pruebas que
   pasan por separado y fallan al ejecutarse juntas porque comparten estado, diagnosticando la causa
   y corrigiéndola, de modo que el resultado de cada prueba deje de depender del orden en que se
   ejecutó la suite.
5. **Decidir qué datos pueden existir dentro de una prueba**, aplicando minimización al contenido de
   la fixture —solamente los datos que la finalidad de esa prueba exige—, prefiriendo datos
   sintéticos a cualquier copia de datos reales, y convirtiendo el desmontaje en eliminación
   verificable: una prueba que comprueba que los datos creados ya no están.
6. **Establecer dónde un doble de prueba deja de ser legítimo en el nivel de integración**,
   sosteniendo el criterio que lo decide —se sustituye lo que no es el objeto de la prueba y lo que
   no está bajo control propio, y no se sustituye la colaboración que la prueba dice verificar— y
   reconociendo el caso concreto en que una prueba presentada como de integración es una unitaria
   disfrazada por haber sustituido exactamente aquello que debía observar.

## Competencias Transversales

- **Dejar el mundo como estaba:** el hábito de que todo lo que una prueba crea lo deshaga ella misma,
  que es higiene técnica cuando se trata de un registro cualquiera y una obligación exigible cuando
  se trata de datos de una persona.
- **Sospechar del verde que llega demasiado fácil:** cuando una prueba de integración pasa a la
  primera y en milisegundos, la primera hipótesis razonable no es que el sistema esté bien integrado,
  sino que no se está integrando nada.
- **Tratar una obligación legal como una propiedad verificable del sistema:** la distancia entre
  declarar que se cumple una exigencia y poder ejecutar algo que lo demuestre es exactamente la
  distancia entre un compromiso y una evidencia.
- **Leer un error de contrato sin culpar a la herramienta:** un rechazo del framework no es ruido ni
  capricho de la librería; es el sistema informando qué esperaba recibir y no recibió, y esa
  información es utilizable.
- **Responsabilidad sobre datos que son de otros:** entender que llevar una copia de datos reales a
  un ambiente de pruebas es una decisión con consecuencias sobre personas que no están en la sala, y
  que la comodidad de quien prueba no es una justificación admisible.

---

# Mapa de la Clase

| Horario | Sección | Propósito |
|---------|---------|-----------|
| 08:30 - 08:40 | Encuadre | Retomar el límite con el que cerró la sesión anterior —todo lo verificado hasta ahora se verificó sobre piezas aisladas— y plantear la pregunta que ocupa la sesión: qué evidencia demuestra que esas piezas funcionan juntas. Recordar la fecha de corte de la segunda evaluación parcial. |
| 08:40 - 09:10 | Bloque 1 | Qué separa una prueba de integración de una unitaria, y la primera ejecución sobre la API del proyecto: una función ya verificada, alcanzada por una solicitud HTTP, falla por una razón que ninguna prueba unitaria podía revelar. El defecto de contrato. |
| 09:10 - 09:35 | Bloque 2 | La *fixture* —la preparación reutilizable de lo que una prueba necesita, junto con su desmontaje— como la pieza que administra el costo de integrar de verdad. Y la demostración de por qué hace falta: dos pruebas que pasan por separado y fallan juntas. |
| 09:35 - 09:45 | Pausa | Descanso técnico. |
| 09:45 - 10:15 | Bloque 3 | Qué datos pueden existir dentro de una prueba. Datos sintéticos frente a copia de datos reales, minimización aplicada al contenido de la fixture, y el desmontaje convertido en eliminación verificable mediante una prueba que la comprueba. |
| 10:15 - 10:40 | Bloque 4 | Hasta dónde es legítimo sustituir una dependencia en este nivel. El criterio, su demostración —la misma prueba pasa con la base sustituida y falla con la base real, y el defecto era real— y el sesgo de un agente al que se le pide una prueba de integración. |
| 10:40 - 10:50 | Cierre | Consolidar qué afirma cada nivel de prueba y qué no alcanza a afirmar, y dejar planteado lo que sigue faltando: nadie ha comprobado todavía el sistema por donde lo usa una persona. |

> Se trabaja sobre el mismo proyecto de reserva de laboratorio de las sesiones anteriores, con dos
> piezas nuevas. La primera es una API HTTP de un solo endpoint, que recibe una solicitud de reserva
> y responde si fue aceptada o rechazada; se entrega **ya escrita** y se lee línea por línea, porque
> la sesión es sobre probar la integración y no sobre construir la API. La segunda es una base de
> datos en un archivo, que es la que vuelve observable el asunto del día: lo que una prueba escribe
> queda escrito, y se puede mirar qué quedó después de que la prueba terminó.

## Punto de partida: entre dos piezas correctas hay un tercer lugar donde fallar

En este material, **integrar** significa hacer que dos o más piezas del sistema trabajen juntas sin
reemplazar a ninguna por un sustituto. Una **prueba de integración** es entonces la que ejecuta esa
colaboración real y afirma algo sobre su resultado. Lo que la distingue de una prueba unitaria no es
que sea más grande, sino que renuncia a sustituir aquello que quiere observar.

Esa renuncia es la que abre un lugar nuevo para los defectos. Una función puede estar correcta y una
ruta HTTP puede estar correcta, y el sistema fallar igual porque lo que una entrega no es lo que la
otra espera: el nombre de un campo, el tipo de un valor, el código de estado que corresponde a un
rechazo. Ese defecto no vive dentro de ninguna de las dos piezas, sino entre ellas, y por eso ninguna
prueba que mire una sola pieza puede encontrarlo, por buena que sea.

La renuncia también tiene un precio. Cuando se deja de sustituir la base de datos, los datos que una
prueba crea existen de verdad y siguen existiendo cuando la prueba termina. Eso convierte en
problema técnico dos cosas que hasta hoy no lo eran: el resultado de una prueba puede depender de lo
que dejó la anterior, y los datos que se cargan para probar son datos que alguien decidió poner ahí y
que alguien tiene que sacar. La sesión de la Unidad 1 que convirtió finalidad y minimización en
requisitos escritos encuentra aquí su forma ejecutable, y la norma que se inventarió entonces la
nombra directamente: los requisitos de datos de prueba y de ambiente de prueba de ISO/IEC/IEEE
29119-3:2021.

El recorrido de trabajo de la sesión es **conectar → observar → aislar → borrar**. Se conecta la
pieza con su entorno real, se observa qué falla cuando ya no hay sustituto, se aísla cada prueba para
que su resultado no dependa de las demás, y se deshace lo que la prueba creó dejando evidencia de que
se deshizo. Ninguna prueba de esta sesión se da por buena si pasa en aislamiento pero falla dentro de
la suite, ni si deja datos detrás cuando termina.

---

# BLOQUE 1: Dos piezas correctas y un sistema que falla

- **Duración:** 30 minutos
- **Objetivo del bloque:** establecer qué distingue realmente a una prueba de integración de una
  unitaria, que no es su tamaño sino qué deja de sustituir, y ver ejecutada la consecuencia: una
  función verificada, medida y construida con la prueba antes que el código falla igual cuando se la
  alcanza a través de una API. Al finalizar, el estudiante debe poder leer una prueba de integración
  sobre HTTP nombrando cada pieza que interviene, y distinguir un fallo de lógica de un fallo de
  contrato leyendo la salida.
- **Modalidad:** exposición con lectura de código y ejecución en vivo sobre el proyecto, y registro
  escrito individual.
- **Ritmo sugerido:** 4 minutos para el estado de la suite y el contraste con la fuente, 7 para leer
  la API línea por línea, 5 para el contrato escrito, 9 para la ejecución y sus dos rojos, y 5 para
  el sesgo del agente y el ejercicio.

## Desarrollo

### 1.1 La suite está en verde y el sistema no está probado

El proyecto llega a esta sesión con su suite unitaria completa. Ejecutada, informa:

```text
................                                                         [100%]
16 passed in 0.04s
```

Dieciséis casos en verde. Entre ellos están `puede_reservar`, cuyos casos se eligieron con partición
de equivalencia y valores límite, y `cabe_en_sala`, que se construyó escribiendo la prueba antes que
el código y se vio en rojo antes de existir. Son, en el sentido más estricto que este módulo puede
darle a la palabra, funciones verificadas.

Y aun así nadie ha comprobado todavía que el sistema funcione, porque nadie ha comprobado que esas
funciones se alcancen. Un usuario no llama a `puede_reservar`: envía una solicitud por la red, y en
el camino hay una ruta que la recibe, una validación que la revisa, una conversión de datos y una
respuesta que vuelve. Todo eso está fuera de las dieciséis pruebas.

### 1.2 «Una prueba de integración es una prueba más grande», contrastado con la fuente

La frase circula con esa forma: una prueba unitaria prueba una cosa, una de integración prueba
varias. Es cómoda y es falsa, y conviene desmontarla con la fuente en la mano porque de ella salen
decisiones equivocadas —por ejemplo, creer que basta con llamar a tres funciones en una misma prueba
para haber integrado algo.

El programa de estudios *Foundation Level* de ISTQB, versión 4.0.1, describe cinco niveles de prueba
en su sección 2.2.1. Los dos primeros son los que interesan hoy:

> Component testing (also known as unit testing) focuses on testing components in isolation.

> Las pruebas de componente (también conocidas como pruebas unitarias) se centran en probar
> componentes de manera aislada.

> Component integration testing (also known as unit integration testing) focuses on testing the
> interfaces and interactions between components.

> Las pruebas de integración de componentes (también conocidas como pruebas de integración unitaria)
> se centran en probar las interfaces y las interacciones entre componentes.

Las dos definiciones no se distinguen por cantidad. Se distinguen por **objeto**: una mira el
componente, la otra mira la interfaz y la interacción entre componentes. «Aislamiento» en la primera
definición no es un adorno: es lo que la caracteriza. Y aislar admite dos formas, las dos legítimas:
que la función no dependa de nada más —el caso de `puede_reservar` y `cabe_en_sala`, que solo reciben
números y devuelven un valor—, o que aquello de lo que depende se reemplace por un sustituto. En
ambos casos, lo que rodea a la pieza no participa del resultado.

El mismo documento, al cerrar la sección, dice cómo se separan los niveles entre sí:

> Test levels are distinguished by the following non-exhaustive list of attributes, to avoid
> overlapping of test activities: Test object, Test objectives, Test basis, Defects and failures,
> Approach and responsibilities

> Los niveles de prueba se distinguen por la siguiente lista no exhaustiva de atributos, para evitar
> el solapamiento de las actividades de prueba: objeto de prueba, objetivos de prueba, base de
> prueba, defectos y fallos, y enfoque y responsabilidades.

En esa lista de cinco atributos no aparece el tamaño. Sí aparece **«defectos y fallos»**: cada nivel
existe porque encuentra una clase de defecto que los otros no encuentran. Esa es la afirmación que
este bloque va a comprobar ejecutando, y no aceptar por autoridad.

Con eso ya se puede escribir la definición operativa que se usará el resto de la sesión:

> Una **prueba de integración** ejecuta la colaboración real entre dos o más piezas —sin reemplazar
> por un sustituto aquello que quiere observar— y afirma algo sobre su resultado.

### 1.3 La API del proyecto, leída línea por línea

El proyecto incorpora hoy una interfaz HTTP. **HTTP** es el protocolo con el que un cliente —un
navegador, una aplicación móvil, otro servicio— le envía una **solicitud** a un servidor y recibe una
**respuesta**. Cuatro piezas de esa solicitud importan hoy:

| Pieza | Qué es | En el proyecto |
|-------|--------|----------------|
| Método | El verbo de la operación | `POST`, que significa «crear algo nuevo» |
| Ruta | La dirección dentro del servicio | `/reservas` |
| Cuerpo | Los datos que viajan, en formato JSON | los campos de la solicitud de reserva |
| Código de estado | Un número con el que el servidor resume qué pasó | `200`, `201`, `409`, `422` |

**JSON** es un formato de texto para representar datos con la forma `{"campo": valor}`. Y los cuatro
códigos de estado que aparecerán hoy significan, según el estándar HTTP:

| Código | Nombre | Qué afirma el servidor al devolverlo |
|--------|--------|--------------------------------------|
| `200` | OK | La solicitud se procesó correctamente |
| `201` | Created | La solicitud se procesó y **creó un recurso nuevo** |
| `409` | Conflict | La solicitud era válida pero **choca con el estado actual**; no se puede cumplir |
| `422` | Unprocessable Content | El cuerpo llegó, pero **no tiene la forma esperada**; no se pudo ni intentar procesarlo |

La API se entrega escrita. Es esta, completa:

```python
from fastapi import FastAPI
from pydantic import BaseModel

from reservas import comprobante, puede_reservar
from sala import cabe_en_sala

CAPACIDAD_SALA = 30

app = FastAPI()

reservas_registradas: list[dict] = []


class SolicitudReserva(BaseModel):
    nombre: str
    rut: str
    correo: str
    bloque: int
    personas: int


@app.post("/reservas")
def crear_reserva(solicitud: SolicitudReserva) -> dict:
    tomado = any(r["bloque"] == solicitud.bloque for r in reservas_registradas)
    de_la_semana = sum(1 for r in reservas_registradas if r["rut"] == solicitud.rut)
    permitida = puede_reservar(
        de_la_semana, solicitud.bloque, tomado
    ) and cabe_en_sala(solicitud.personas, CAPACIDAD_SALA)
    if permitida:
        reservas_registradas.append({"bloque": solicitud.bloque, "rut": solicitud.rut})
    return {
        "permitida": permitida,
        "comprobante": comprobante(
            solicitud.nombre, solicitud.rut, solicitud.correo, solicitud.bloque
        ),
    }
```

Se lee así, y conviene leerla entera antes de probarla, porque lo que no se entiende no se puede
auditar:

1. `app = FastAPI()` crea la aplicación. Es el objeto que conoce todas las rutas.
2. `class SolicitudReserva(BaseModel)` declara **qué forma debe tener el cuerpo** de la solicitud.
   `BaseModel` viene de Pydantic, la librería que FastAPI usa para validar. Las anotaciones de tipo
   —`nombre: str`, `bloque: int`— no son documentación: son la regla que se aplica de verdad. Si el
   cuerpo que llega no la cumple, la solicitud se rechaza con `422` y **la función nunca se ejecuta**.
3. `@app.post("/reservas")` es un decorador: registra la función que sigue como la responsable de
   atender las solicitudes `POST` dirigidas a `/reservas`.
4. `def crear_reserva(solicitud: SolicitudReserva)` recibe el cuerpo ya validado y convertido en un
   objeto. Que el parámetro esté anotado con la clase es lo que le indica a FastAPI que ese
   argumento sale del cuerpo de la solicitud.
5. Las tres líneas siguientes calculan el estado a partir de `reservas_registradas` —una lista en
   memoria— y llaman a las dos funciones ya verificadas.
6. El `return` de un diccionario se convierte automáticamente en JSON, y se devuelve con código `200`
   por defecto.

Nada de esto tiene un error de lógica. La función decide bien porque ya se comprobó que decide bien,
y la ruta reporta lo que la función decidió.

### 1.4 El contrato: lo que el sistema promete responder

El proyecto tiene una especificación de su API, escrita antes que el código, y es la base de prueba
de este bloque —la fuente de la que salen los resultados esperados, como en toda la Unidad 2:

| Caso | Respuesta comprometida |
|------|------------------------|
| La reserva se acepta | `201`, y el cuerpo incluye el comprobante |
| La reserva se rechaza por una regla del negocio | `409`, y el cuerpo incluye el motivo |
| El cuerpo de la solicitud está mal formado | `422` |

Además, la especificación fija el nombre de cada campo del cuerpo. El campo del correo se llama
`correo_electronico`.

A esto se le llama **contrato**: el acuerdo sobre la forma de lo que entra y lo que sale entre dos
piezas que se comunican. No vive dentro de ninguna de ellas.

### 1.5 La primera prueba de integración, y sus dos rojos

La prueba se escribe contra el contrato, no contra el código de la API. Para ejecutarla se usa el
cliente de pruebas que FastAPI provee. Su documentación oficial indica cómo construirlo:

> Create a `TestClient` by passing your **FastAPI** application to it.

> Crea un `TestClient` pasándole tu aplicación **FastAPI**.

```python
from fastapi.testclient import TestClient

from api import app

cliente = TestClient(app)

SOLICITUD = {
    "nombre": "Ana Rivas",
    "rut": "11.111.111-1",
    "correo_electronico": "ana.rivas@ejemplo.cl",
    "bloque": 4,
    "personas": 12,
}


def test_reserva_aceptada_responde_201() -> None:
    respuesta = cliente.post("/reservas", json=SOLICITUD)
    assert respuesta.status_code == 201


def test_bloque_fuera_de_jornada_responde_409() -> None:
    respuesta = cliente.post("/reservas", json=SOLICITUD | {"bloque": 12})
    assert respuesta.status_code == 409
```

Tres piezas nuevas, y ninguna se usa sin nombrarla:

- `TestClient(app)` envuelve la aplicación y permite enviarle solicitudes **sin levantar un servidor
  ni abrir un puerto**. La solicitud recorre el mismo camino que recorrería de verdad —validación,
  ruta, función, respuesta—, solo que dentro del mismo proceso que ejecuta la prueba.
- `cliente.post("/reservas", json=SOLICITUD)` envía la solicitud. El argumento `json=` toma el
  diccionario de Python y lo convierte en el cuerpo JSON.
- `respuesta.status_code` es el código de estado que devolvió el servidor. `respuesta.json()`, que se
  usará en un momento, devuelve el cuerpo convertido de vuelta a un diccionario.

El operador `|` entre dos diccionarios, en `SOLICITUD | {"bloque": 12}`, produce un diccionario nuevo
con todos los campos del primero y el `bloque` reemplazado. Se usa para no repetir los cinco campos.

**Primera ejecución:**

```text
FF                                                                       [100%]
E       assert 422 == 201
E        +  where 422 = <Response [422 Unprocessable Content]>.status_code
E       assert 422 == 409
E        +  where 422 = <Response [422 Unprocessable Content]>.status_code

FAILED test_api.py::test_reserva_aceptada_responde_201 - assert 422 == 201
FAILED test_api.py::test_bloque_fuera_de_jornada_responde_409 - assert 422 == 409
```

Dos rojos, y los dos son `422`. Ese código significa que el cuerpo no tenía la forma esperada, y
tiene una consecuencia que conviene decir con todas sus letras: **la función verificada nunca se
ejecutó**. La solicitud se rechazó antes. Las dieciséis pruebas unitarias siguen en verde y siguen
teniendo razón; simplemente no tenían forma de enterarse de esto.

El cuerpo de la respuesta dice exactamente qué pasó:

```json
{
  "detail": [
    {
      "type": "missing",
      "loc": ["body", "correo"],
      "msg": "Field required",
      "input": {
        "nombre": "Ana Rivas",
        "rut": "11.111.111-1",
        "correo_electronico": "ana.rivas@ejemplo.cl",
        "bloque": 4,
        "personas": 12
      }
    }
  ]
}
```

`loc` indica dónde está el problema: en el cuerpo, en el campo `correo`. `msg` dice que es
obligatorio y no llegó. E `input` muestra lo que sí llegó. La especificación dice
`correo_electronico`; la API declara `correo`. Un nombre de campo. El defecto no está en la función
ni en la ruta: está en el acuerdo entre ellas.

Se corrige el nombre del campo en la API —una palabra— y se ejecuta de nuevo.

**Segunda ejecución:**

```text
FF                                                                       [100%]
E       assert 200 == 201
E        +  where 200 = <Response [200 OK]>.status_code
E       assert 200 == 409
E        +  where 200 = <Response [200 OK]>.status_code

FAILED test_api.py::test_reserva_aceptada_responde_201 - assert 200 == 201
FAILED test_api.py::test_bloque_fuera_de_jornada_responde_409 - assert 200 == 409
```

Siguen rojas, y el rojo cambió de naturaleza. Ahora la solicitud sí entró, la función sí corrió y
decidió bien. Lo que no ocurrió es que su decisión viajara como corresponde: una reserva creada se
informa con `200` en lugar de `201`, y un rechazo se informa con `200` en lugar de `409`.

El cuerpo de ese rechazo muestra el tercer hallazgo, y es el más serio de los tres:

```json
{
  "permitida": false,
  "comprobante": "Ana Rivas | 11.111.111-1 | ana.rivas@ejemplo.cl | bloque 12"
}
```

El sistema rechazó la reserva —`"permitida": false` es correcto, el bloque 12 está fuera de la
jornada— y le entregó al usuario un comprobante de esa reserva que no existe. Ninguna prueba
unitaria podía detectarlo: `puede_reservar` devolvió `False`, que es lo correcto, y `comprobante`
armó bien la cadena que se le pidió armar, que también es lo correcto. El defecto está en que
alguien las compuso sin decidir qué pasa cuando la primera dice que no.

### 1.6 Tres defectos, una misma clase

Los tres hallazgos del bloque son distintos entre sí y comparten una propiedad:

| Hallazgo | Qué falló | Dónde vive el defecto |
|----------|-----------|-----------------------|
| `422` por nombre de campo | La colaboración no llegó a ocurrir | Entre el contrato y el modelo de datos |
| `200` en lugar de `201` y `409` | Ocurrió, y se informó mal | Entre la decisión y su representación HTTP |
| Comprobante de una reserva rechazada | Ocurrió, y se compuso mal | Entre dos funciones correctas |

Ninguno es un error de lógica dentro de una función, y por eso ninguno podía aparecer en el nivel
unitario: no por falta de rigor al escribir esas pruebas, sino porque el objeto que miran es otro. Es
la afirmación de ISTQB —los niveles se distinguen, entre otras cosas, por los defectos que
encuentran— comprobada sobre el proyecto propio.

### 1.7 Lo que cambia cuando la prueba de integración la escribe un agente

Pedirle a un agente «una prueba de integración para este endpoint» produce, casi siempre, código que
corre y pasa. El sesgo tiene una causa concreta y verificable leyendo lo que devuelve: el agente lee
**el código de la API** y escribe la prueba contra lo que el código hace. Si la API responde `200`,
la prueba afirma `200`.

El resultado es una prueba que no puede encontrar ninguno de los tres defectos de este bloque,
porque los tres consisten precisamente en que el código no hace lo que el contrato dice. Es el mismo
problema de procedencia del resultado esperado que ya se trabajó, agravado: aquí el esperado no sale
del requisito sino de la implementación, y además se ejecuta sobre varias piezas a la vez, lo que le
da apariencia de cobertura amplia.

- **Qué hace bien el agente:** el andamiaje. Construir el `TestClient`, armar el cuerpo con campos
  plausibles, cubrir los casos de forma mecánica y repetir la estructura sin equivocarse.
- **Qué no conviene delegarle:** el valor esperado. Ese sale del contrato, y el contrato es un
  documento que el agente no tiene a menos que se lo entregues explícitamente.
- **Error frecuente:** aceptar la prueba porque pasa. Una prueba de integración que pasa a la
  primera, sobre un sistema que nadie había integrado antes, es más probable que esté describiendo
  el código que verificándolo.

La forma de trabajo que sí rinde es la inversa: entregarle el contrato al agente como contexto, y
pedirle la prueba contra el contrato. Y revisar igual, porque el que responde por el resultado
esperado sigue siendo quien firma la entrega.

## Ejercicio del bloque

Sobre el proyecto propio, el mismo que se entrega como evaluación.

1. Escribe el contrato de **una** operación de tu sistema, en tres líneas: qué recibe, qué responde
   cuando todo sale bien y qué responde cuando la operación se rechaza. Si tu proyecto todavía no
   tiene una interfaz HTTP, escribe el contrato de la función que está más arriba en tu sistema: qué
   recibe, qué devuelve, qué hace cuando la entrada no sirve.
2. Elige una prueba unitaria ya escrita sobre la lógica de esa operación y escribe, en una frase, un
   defecto real que esa prueba **no podría detectar aunque estuviera perfecta**.
3. Clasifica ese defecto según la tabla de 1.6: ¿la colaboración no llega a ocurrir, ocurre y se
   informa mal, u ocurre y se compone mal?
4. Escribe la primera línea de la prueba de integración que sí lo detectaría: qué se envía y qué se
   afirma. No hace falta que la ejecutes todavía.

**Pista:** si al escribir el punto 2 no se te ocurre ningún defecto, es señal de que estás pensando
en la función y no en sus bordes. Mira qué pasa con lo que entra antes de que la función lo reciba, y
con lo que sale después de que la función devolvió.

**Evidencia esperada:** un contrato escrito con sus tres casos, un defecto nombrado con su
clasificación, y una aserción propuesta cuyo valor esperado se pueda rastrear al contrato y no al
código.

## Preguntas guía

1. La suite unitaria informa `16 passed` y las dos pruebas de integración fallan. Un compañero
   concluye que las pruebas unitarias estaban mal escritas. ¿Tiene razón, y qué habría que cambiar
   en ellas para que hubieran detectado el `422`?

   **Pista:** revisa cuál es el objeto de prueba de cada nivel. Pregúntate si el nombre del campo del
   cuerpo HTTP está dentro o fuera de lo que `puede_reservar` puede observar.

2. El sistema devolvió `"permitida": false` junto con un comprobante. Las dos funciones que
   produjeron esa respuesta están verificadas y ninguna tiene un defecto. ¿De quién es el defecto
   entonces, y qué tendría que haber existido para prevenirlo?

   **Pista:** el defecto aparece al componer. Piensa qué documento decide qué se devuelve cuando la
   primera función dice que no.

3. Un agente entrega una prueba de integración que pasa a la primera sobre esta misma API, tal como
   estaba al empezar el bloque. ¿Qué afirma esa prueba exactamente, y por qué el hecho de que pase
   no es una buena noticia?

   **Pista:** compara de dónde salió el `200` que la prueba afirma con de dónde salió el `201` que
   afirma la prueba de esta sección.

## Fuentes técnicas del bloque

- [ISTQB Certified Tester Foundation Level Syllabus v4.0.1, 15 de septiembre de 2024](https://astqb.org/assets/documents/ISTQB_CTFL_Syllabus_v4.0.1.pdf) — sección 2.2.1 *Test Levels*: las definiciones de *component testing* y *component integration testing*, los cinco niveles descritos y la lista de cinco atributos —objeto, objetivos, base de prueba, defectos y fallos, enfoque y responsabilidades— por los que se distinguen los niveles entre sí.
- [ISO/IEC/IEEE 29119-3:2021 — *Test documentation*](https://www.iso.org/standard/79429.html) — la base de prueba de la cláusula 3.7, que en este bloque es la especificación de la API y no el código de la API.
- [FastAPI — documentación oficial de pruebas](https://fastapi.tiangolo.com/tutorial/testing/) — la construcción del `TestClient` a partir de la aplicación y su uso como cliente HTTP; y la nota técnica de que `fastapi.testclient` es el `starlette.testclient` de Starlette.
- [Starlette — `TestClient`](https://www.starlette.io/testclient/) — el cliente que ejecuta la aplicación dentro del mismo proceso, sin levantar un servidor.
- [Pydantic — modelos](https://docs.pydantic.dev/latest/concepts/models/) — `BaseModel` y la validación derivada de las anotaciones de tipo, que es la que produce el `422`.
- [MDN — Códigos de estado de respuesta HTTP](https://developer.mozilla.org/es/docs/Web/HTTP/Reference/Status) — el significado de `200`, `201`, `409` y `422`.
- Ejecuciones registradas para esta clase sobre el proyecto de reserva de laboratorio, con Python 3.12.12, pytest 9.1.1, FastAPI 0.141.1, Starlette 1.6.0, Pydantic 2.13.5 y httpx2 2.13.0: la suite unitaria de 16 casos en verde, las dos pruebas de integración con `422` antes de corregir el nombre del campo y con `200` después, y los dos cuerpos de respuesta citados literalmente.

---

# BLOQUE 2: La preparación que decide si una prueba significa algo

- **Duración:** 25 minutos
- **Objetivo del bloque:** comprobar que el resultado de una prueba puede depender de qué otras
  pruebas se ejecutaron antes, y aprender la pieza que corta esa dependencia. Al finalizar, el
  estudiante debe poder escribir una *fixture* de `pytest` nombrando sus cuatro decisiones —qué
  prepara, qué entrega, qué deshace y con qué alcance—, y debe poder explicar por qué una suite
  completamente en verde no demuestra que sus pruebas estén aisladas.
- **Modalidad:** exposición con ejecución en vivo sobre el proyecto, y escritura individual de una
  fixture.
- **Ritmo sugerido:** 3 minutos para la corrección del contrato, 6 para el verde que dependía del
  orden, 3 para el diagnóstico clásico, 7 para escribir la fixture, 3 para el alcance y 3 para el
  sesgo del agente y el ejercicio.

## Desarrollo

### 2.1 Corregir el contrato, para tener una base en verde

Los tres defectos del bloque anterior se corrigen en la API. No es el asunto de esta sesión, así que
se lee rápido, pero se lee, porque aparecen dos piezas de sintaxis que después se usan:

```python
@app.post("/reservas", status_code=201)
def crear_reserva(solicitud: SolicitudReserva) -> dict:
    tomado = any(r["bloque"] == solicitud.bloque for r in reservas_registradas)
    de_la_semana = sum(1 for r in reservas_registradas if r["rut"] == solicitud.rut)
    if not cabe_en_sala(solicitud.personas, CAPACIDAD_SALA):
        raise HTTPException(status_code=409, detail="La sala no tiene ese cupo")
    if not puede_reservar(de_la_semana, solicitud.bloque, tomado):
        raise HTTPException(status_code=409, detail="La reserva no esta permitida")
    reservas_registradas.append({"bloque": solicitud.bloque, "rut": solicitud.rut})
    return {
        "comprobante": comprobante(
            solicitud.nombre, solicitud.rut, solicitud.correo_electronico, solicitud.bloque
        )
    }
```

- `status_code=201` en el decorador cambia el código con el que se responde cuando **todo sale
  bien**. Es el código por defecto de esa ruta, no de la aplicación entera.
- `raise HTTPException(status_code=409, detail="...")` interrumpe la función y responde con ese
  código y ese motivo. Al interrumpir, el `return` del final no se ejecuta, y por eso desaparece
  también el tercer defecto del bloque anterior: ya no hay forma de devolver un comprobante junto a
  un rechazo, porque el rechazo sale antes de llegar a armarlo.

Con esa corrección se escribe una tercera prueba, la del caso que el sistema tiene que rechazar
porque el bloque ya está reservado:

```python
def test_reserva_aceptada_responde_201() -> None:
    respuesta = cliente.post("/reservas", json=SOLICITUD)
    assert respuesta.status_code == 201


def test_bloque_fuera_de_jornada_responde_409() -> None:
    respuesta = cliente.post("/reservas", json=SOLICITUD | {"bloque": 12})
    assert respuesta.status_code == 409


def test_bloque_ya_tomado_responde_409() -> None:
    respuesta = cliente.post("/reservas", json=SOLICITUD)
    assert respuesta.status_code == 409
```

Se ejecuta el archivo completo:

```bash
uv run pytest test_api.py -q
```

```text
...                                                                      [100%]
3 passed in 0.52s
```

Tres en verde. La tentación en este punto es dar el trabajo por terminado.

### 2.2 El verde que dependía del orden

Antes de darlo por terminado conviene ejecutar una sola de las tres. La tercera, por ejemplo, que es
la que acaba de escribirse:

```bash
uv run pytest "test_api.py::test_bloque_ya_tomado_responde_409" -q
```

La sintaxis `archivo::nombre_de_la_prueba` le indica a `pytest` que ejecute exactamente esa prueba y
ninguna otra. El resultado:

```text
E       assert 201 == 409
E        +  where 201 = <Response [201 Created]>.status_code

FAILED test_api.py::test_bloque_ya_tomado_responde_409 - assert 201 == 409
1 failed in 0.66s
```

La misma prueba, el mismo código, sin cambiar una línea: **pasa acompañada y falla sola**.

La causa se lee en la API. `reservas_registradas` es una lista que vive en el módulo, no dentro de la
función, así que existe desde que el módulo se importa hasta que el proceso termina. La primera
prueba reservó el bloque 4 y dejó ese registro puesto. La tercera prueba encontró el bloque ocupado
—pero no porque ella lo hubiera ocupado, sino porque lo ocupó otra prueba antes.

Dicho de otro modo: la tercera prueba nunca comprobó lo que dice comprobar. Dice que un bloque ya
tomado se rechaza, y lo que en realidad comprobó es que un bloque tomado *por la primera prueba* se
rechaza. Si mañana alguien borra, renombra o reordena la primera prueba, la tercera se cae sin que
nadie haya tocado el sistema.

Que eso último no es una hipótesis se comprueba invirtiendo el orden en la misma línea de comandos:

```bash
uv run pytest "test_api.py::test_bloque_ya_tomado_responde_409" \
              "test_api.py::test_reserva_aceptada_responde_201" -q
```

```text
FAILED test_api.py::test_bloque_ya_tomado_responde_409 - assert 201 == 409
FAILED test_api.py::test_reserva_aceptada_responde_201 - assert 409 == 201
2 failed in 0.65s
```

Ahora fallan las dos, y por razones opuestas: la tercera no encontró el bloque tomado, y la primera
lo encontró tomado cuando esperaba poder reservarlo. Tres ejecuciones del mismo código, tres
resultados distintos:

| Qué se ejecutó | Resultado |
|----------------|-----------|
| Las tres pruebas, en el orden del archivo | `3 passed` |
| Solo la tercera | `1 failed` — `assert 201 == 409` |
| La tercera y la primera, en ese orden | `2 failed` — `assert 201 == 409` y `assert 409 == 201` |

El `3 passed` de la primera fila no era un resultado sobre el sistema. Era un resultado sobre el
orden en que `pytest` recorrió el archivo.

### 2.3 El diagnóstico ya tiene nombre

Esto no es un descubrimiento de esta clase. Gerard Meszaros —el mismo autor de la taxonomía de
dobles de prueba que se usó en la sesión de cobertura— lo catalogó como un síntoma con causas
identificables. La causa general:

> Cause: Interacting Tests — Tests depend on each other in some way.

> Causa: pruebas que interactúan — las pruebas dependen unas de otras de alguna manera.

Y el caso exacto que acaba de ocurrir tiene su propio nombre dentro de esa familia:

> Lonely Test is a special case of Interacting Tests in which a test can be run as part of a suite
> but cannot be run by itself because it depends on something in a Shared Fixture that was created by
> another test.

> La *prueba solitaria* es un caso especial de las pruebas que interactúan, en el que una prueba
> puede ejecutarse como parte de una suite pero no puede ejecutarse por sí sola, porque depende de
> algo que está en un *fixture compartido* y que fue creado por otra prueba.

Sobre el mecanismo, Meszaros es categórico, y la frase describe con precisión a `reservas_registradas`:

> Anything that outlives the lifetime of the test can lead to interactions.

> Cualquier cosa que sobreviva a la duración de la prueba puede provocar interacciones.

El remedio que propone también tiene nombre, y es lo que ocupa el resto del bloque:

> We construct the fixture as part of running the test and tear down the fixture when the test has
> finished. We do not reuse any fixture left over by other tests or other test runs. This way, we
> start and end every test with a "clean slate".

> Construimos el fixture como parte de la ejecución de la prueba y lo desmontamos cuando la prueba
> termina. No reutilizamos ningún fixture dejado por otras pruebas ni por otras ejecuciones. Así,
> empezamos y terminamos cada prueba con la pizarra limpia.

Conviene fijar el vocabulario antes de escribir código, porque la palabra se usa con dos sentidos y
los dos aparecen hoy:

- **Fixture** (el concepto): todo lo que tiene que estar puesto para que una prueba pueda ejecutarse
  —datos cargados, archivos creados, conexiones abiertas, estado inicial conocido.
- **Fixture fresco:** el que se construye para esa prueba y se desmonta al terminar. Es el que se
  quiere.
- **Fixture compartido:** el que sobrevive entre pruebas. Es más rápido, y es el que produce lo que
  acaba de verse.
- **`@pytest.fixture`** (la herramienta): el mecanismo con el que `pytest` permite escribir uno.

### 2.4 La fixture: qué prepara, qué entrega, qué deshace

La documentación oficial de `pytest` define para qué sirve:

> Fixtures define the steps and data that constitute the *arrange* phase of a test. […] a fixture
> provides a defined, reliable and consistent context for the tests.

> Las fixtures definen los pasos y los datos que constituyen la fase de *preparación* de una prueba.
> […] una fixture entrega a las pruebas un contexto definido, fiable y consistente.

La fixture que este proyecto necesita deja la agenda vacía antes de cada prueba y la vuelve a vaciar
al terminar:

```python
import pytest

from api import reservas_registradas


@pytest.fixture
def agenda_vacia() -> list[dict]:
    reservas_registradas.clear()
    yield reservas_registradas
    reservas_registradas.clear()
```

Cuatro decisiones, una por línea, y ninguna es decorativa:

1. **`@pytest.fixture`** marca la función como fixture. A partir de ahí, `pytest` no la ejecuta por
   ser una prueba —no lo es—, sino cuando alguien la pide.
2. **Lo que está antes del `yield` es la preparación.** Se ejecuta antes de la prueba. Aquí, vaciar
   la lista.
3. **`yield` entrega el objeto a la prueba** y deja la fixture en pausa. Donde una función normal
   haría `return`, una fixture hace `yield`, y esa es toda la diferencia de sintaxis. La
   documentación lo dice así: *«`return` is swapped out for `yield`»* —«se cambia `return` por
   `yield`»—, y *«any teardown code for that fixture is placed after the `yield`»* —«todo el código
   de desmontaje de esa fixture se coloca después del `yield`».
4. **Lo que está después del `yield` es el desmontaje.** `pytest` lo ejecuta cuando la prueba
   termina, haya pasado o haya fallado.

Una prueba pide la fixture **escribiendo su nombre como parámetro**. No se importa y no se llama:

```python
def test_reserva_aceptada_responde_201(agenda_vacia: list[dict]) -> None:
    respuesta = cliente.post("/reservas", json=SOLICITUD)
    assert respuesta.status_code == 201


def test_bloque_fuera_de_jornada_responde_409(agenda_vacia: list[dict]) -> None:
    respuesta = cliente.post("/reservas", json=SOLICITUD | {"bloque": 12})
    assert respuesta.status_code == 409


def test_bloque_ya_tomado_responde_409(agenda_vacia: list[dict]) -> None:
    cliente.post("/reservas", json=SOLICITUD)
    respuesta = cliente.post("/reservas", json=SOLICITUD)
    assert respuesta.status_code == 409
```

La tercera prueba cambió en algo que importa más que la fixture: ahora **crea su propia condición
previa**. Hace la primera reserva ella misma, y recién entonces comprueba que la segunda se rechaza.
Antes esa condición se la daba otra prueba; ahora está escrita, a la vista, dentro de la prueba que
la necesita.

El archivo `conftest.py` es donde vive la fixture. Es un nombre reservado de `pytest`: las fixtures
definidas ahí quedan disponibles para todas las pruebas de esa carpeta **sin importarlas**. La
documentación lo describe como poner la fixture en un archivo aparte *«so that tests from multiple
test modules in the directory can access the fixture function»* —«para que las pruebas de varios
módulos del directorio puedan acceder a la función fixture».

Las tres ejecuciones de antes, repetidas ahora sin cambiar nada más:

| Qué se ejecutó | Antes | Ahora |
|----------------|-------|-------|
| Las tres pruebas, en el orden del archivo | `3 passed` | `3 passed` |
| Solo la tercera | `1 failed` | `1 passed` |
| La tercera y la primera, en ese orden | `2 failed` | `2 passed` |

```text
...                                                                      [100%]
3 passed in 0.09s
```

El `3 passed` de la primera fila es el mismo número que antes y ya no significa lo mismo. Antes
describía un orden; ahora describe el sistema.

### 2.5 El alcance es una decisión, y se puede ver

Una fixture no se ejecuta siempre con la misma frecuencia. El **alcance** decide cada cuánto se
construye y se desmonta, y `pytest` ofrece cinco:

| Alcance | Se desmonta |
|---------|-------------|
| `function` | al final de cada prueba — **es el valor por defecto** |
| `class` | al terminar la última prueba de la clase |
| `module` | al terminar la última prueba del archivo |
| `package` | al terminar la última prueba del paquete |
| `session` | al terminar toda la ejecución |

La elección no es un detalle de configuración. Cambiar una palabra en la fixture recién escrita:

```python
@pytest.fixture(scope="module")
def agenda_vacia() -> list[dict]:
    ...
```

…y volver a ejecutar produce esto:

```text
# las tres pruebas, en el orden del archivo
3 passed in 0.08s

# la tercera y la primera, en ese orden
FAILED test_api.py::test_reserva_aceptada_responde_201 - assert 409 == 201
1 failed, 1 passed in 0.38s
```

La fixture existe, está bien escrita y no aísla nada, porque con alcance `module` se vacía la agenda
una sola vez para todo el archivo y las pruebas vuelven a heredarse el estado. Y obsérvese lo
peligroso del caso: **la suite completa sigue informando `3 passed`**. Un alcance mal elegido no se
manifiesta como un error; se manifiesta como un verde que vuelve a depender del orden.

La regla práctica que se desprende: el alcance por defecto es `function` porque es el único que
garantiza aislamiento, y ampliarlo es una optimización que se paga en riesgo. Se amplía cuando
preparar el recurso es caro —levantar un servidor, crear un esquema completo de base de datos— y
solo para lo que efectivamente sea caro y no cambie durante las pruebas.

### 2.6 Lo que hace un agente con esto

Pedirle a un agente que «arregle las pruebas que fallan» sobre el estado del punto 2.2 produce, con
mucha frecuencia, una de estas dos respuestas, y las dos dejan el problema intacto:

- **Adaptar la aserción al resultado observado:** cambiar `assert respuesta.status_code == 409` por
  `== 201` en la prueba que falla sola. La suite vuelve al verde y la prueba dejó de comprobar el
  requisito. Es la misma operación que en la sesión de cobertura se identificó como tomar el
  esperado del código en lugar del requisito.
- **Marcar el orden como requisito:** ordenar las pruebas o encadenarlas para que el verde vuelva.
  Eso conserva la dependencia y además la oficializa.

El motivo del sesgo es estructural y conviene nombrarlo: el agente optimiza contra la señal que
recibe, y la señal que recibe es «la suite en verde». El aislamiento no se ve en esa señal —de
hecho, el punto 2.5 acaba de mostrar que una suite en verde es compatible con cero aislamiento.

- **Qué hace bien el agente:** escribir la fixture una vez que se le dice cuál es el estado
  compartido. Identificar en un archivo largo qué variables sobreviven a las pruebas es trabajo
  mecánico y lo hace rápido y bien.
- **Qué no conviene delegarle:** el diagnóstico y el alcance. Que el problema sea de aislamiento y no
  de aserción es una lectura que exige saber qué comprobaba la prueba; y el alcance es una decisión
  entre velocidad y riesgo que alguien tiene que tomar a sabiendas.
- **Error frecuente:** pedir «que pasen las pruebas» en vez de «que cada prueba pase sola». La
  segunda formulación es verificable y la primera no distingue entre arreglar y disimular.

## Ejercicio del bloque

Sobre el proyecto propio, el mismo que se entrega como evaluación.

1. Ejecuta tu suite completa y anota el resultado. Después ejecuta **cada prueba por separado**, con
   `uv run pytest "archivo.py::nombre_de_la_prueba" -q`, y anota cuáles cambian de resultado al
   correr solas. Si ninguna cambia, anótalo igual: es un hallazgo.
2. Busca en tu proyecto todo lo que sobreviva a una prueba: variables definidas fuera de las
   funciones, archivos que se escriben, listas o diccionarios a nivel de módulo, conexiones. Haz la
   lista, aunque hoy no te esté dando problemas.
3. Escribe una fixture para el elemento de esa lista que te parezca más riesgoso. Debe tener las
   cuatro decisiones explícitas: qué prepara, qué entrega con `yield`, qué deshace después y con qué
   alcance —justifica el alcance en una frase.
4. Vuelve a ejecutar las pruebas por separado y anota qué cambió.

**Pista:** si al ejecutar una prueba sola obtienes un resultado distinto al que obtienes con la suite
completa, no busques el error dentro de esa prueba. Busca qué dejó puesto la que corrió antes.

**Evidencia esperada:** las dos tandas de ejecuciones con sus resultados literales, la lista de
estado que sobrevive, y una fixture escrita con su alcance justificado.

## Preguntas guía

1. La suite informa `3 passed` y una de esas tres pruebas falla al ejecutarse sola. ¿Cuál de los dos
   resultados describe el estado del sistema, y qué habría que agregar a la rutina de trabajo para
   que ese desacuerdo no pase inadvertido?

   **Pista:** pregúntate qué condición tuvo que cumplirse para que la prueba pasara, y si esa
   condición está escrita dentro de la prueba o le llegó de afuera.

2. Un compañero cambia el alcance de una fixture de `function` a `session` porque la suite tardaba
   demasiado, ejecuta todo y obtiene el mismo verde de antes. ¿Qué evidencia falta para afirmar que
   el cambio fue inocuo?

   **Pista:** el punto 2.5 mostró un caso donde la suite completa pasa y el aislamiento no existe.
   Piensa qué ejecución distinta habría que hacer para detectarlo.

3. Una prueba crea un registro y lo deja puesto al terminar. Como ningún compañero la ejecuta nunca
   sola, la suite está siempre en verde y nadie ha tenido problemas en seis meses. ¿Qué dos cosas
   distintas están en riesgo ahí, y por qué una de ellas no se arregla con más pruebas?

   **Pista:** una es técnica y tiene que ver con lo que ocurrirá cuando alguien agregue una prueba
   nueva. La otra tiene que ver con qué datos quedaron guardados y con el bloque que sigue.

## Fuentes técnicas del bloque

- [`pytest` — *About fixtures*](https://docs.pytest.org/en/stable/explanation/fixtures.html) — la fixture como la fase de preparación de una prueba y como contexto definido, fiable y consistente; y las ventajas de nombre explícito, modularidad y desmontaje gestionado frente al estilo clásico de `setUp`/`tearDown`.
- [`pytest` — *How to use fixtures*](https://docs.pytest.org/en/stable/how-to/fixtures.html) — las fixtures con `yield` y la ubicación del desmontaje después del `yield`; la solicitud de una fixture por nombre de parámetro; `conftest.py` como el lugar que las hace disponibles sin importarlas; y los cinco alcances `function`, `class`, `module`, `package` y `session`, con `function` como valor por defecto.
- [Gerard Meszaros — *xUnit Test Patterns*, sitio complementario: *Erratic Test*](http://xunitpatterns.com/Erratic%20Test.html) — las causas *Interacting Tests* y *Lonely Test*, la afirmación de que cualquier cosa que sobreviva a la duración de la prueba puede provocar interacciones, y los síntomas por los que se reconocen.
- [Gerard Meszaros — *xUnit Test Patterns*: *Fresh Fixture*](http://xunitpatterns.com/Fresh%20Fixture.html) y [*Shared Fixture*](http://xunitpatterns.com/Shared%20Fixture.html) — la construcción y desmontaje del fixture dentro de la prueba para empezar y terminar con la pizarra limpia, y la descripción del fixture compartido como el que sobrevive a una prueba y es reutilizado por otra.
- [FastAPI — manejo de errores con `HTTPException`](https://fastapi.tiangolo.com/tutorial/handling-errors/) — la interrupción de la función y la respuesta con un código y un detalle.
- [FastAPI — código de estado de la respuesta](https://fastapi.tiangolo.com/tutorial/response-status-code/) — el parámetro `status_code` del decorador de la ruta.
- Ejecuciones registradas para esta clase sobre el proyecto de reserva de laboratorio, con Python 3.12.12, pytest 9.1.1, FastAPI 0.141.1, Starlette 1.6.0, Pydantic 2.13.5 y httpx2 2.13.0: las tres ejecuciones sin fixture con sus resultados `3 passed`, `1 failed` y `2 failed`; las mismas tres con la fixture de alcance `function` en `1 passed`, `2 passed` y `3 passed`; y la ejecución con alcance `module` que informa `3 passed` en la suite completa y `1 failed, 1 passed` con el orden invertido.

---

# BLOQUE 3: Qué datos pueden existir dentro de una prueba

- **Duración:** 30 minutos
- **Objetivo del bloque:** decidir con un criterio externo qué datos carga una fixture y qué pasa con
  ellos cuando la prueba termina. Al finalizar, el estudiante debe poder justificar el contenido de
  su fixture citando el principio que lo obliga, y debe poder mostrar una ejecución en la que el
  borrado de los datos de prueba se comprueba y no se supone.
- **Modalidad:** exposición con ejecución en vivo e inspección del disco, y escritura individual.
- **Ritmo sugerido:** 5 minutos para el paso de la memoria al archivo, 4 para el argumento de que un
  ambiente de prueba es tratamiento de datos, 7 para la proporcionalidad ejecutada, 3 para
  `tmp_path`, 7 para la eliminación verificable y 4 para el sesgo del agente y el ejercicio.

## Desarrollo

### 3.1 De una lista en memoria a un archivo en disco

Hasta aquí las reservas vivían en `reservas_registradas`, una lista de Python. Esa lista desaparece
cuando el proceso termina, y eso escondía la mitad del problema: por descuidada que fuera una prueba,
al apagar `pytest` no quedaba nada.

Un sistema real guarda. El proyecto incorpora ahora una base de datos SQLite, que es una base de
datos completa contenida **en un solo archivo** del disco. Se eligió justamente porque hace visible
lo que interesa hoy: se puede abrir el archivo y mirar qué quedó escrito.

```python
import sqlite3
from pathlib import Path

RUTA_BASE = Path("reservas.db")

ESQUEMA = """
CREATE TABLE IF NOT EXISTS reservas (
    bloque INTEGER NOT NULL,
    rut TEXT,
    nombre TEXT,
    correo_electronico TEXT
)
"""


def conectar() -> sqlite3.Connection:
    conexion = sqlite3.connect(RUTA_BASE)
    conexion.execute(ESQUEMA)
    return conexion


def guardar(conexion: sqlite3.Connection, **campos: object) -> None:
    columnas = ", ".join(campos)
    marcas = ", ".join("?" for _ in campos)
    conexion.execute(
        f"INSERT INTO reservas ({columnas}) VALUES ({marcas})", tuple(campos.values())
    )
    conexion.commit()


def bloque_tomado(conexion: sqlite3.Connection, bloque: int) -> bool:
    fila = conexion.execute(
        "SELECT COUNT(*) FROM reservas WHERE bloque = ?", (bloque,)
    ).fetchone()
    return fila[0] > 0
```

Lo que hay que saber leer aquí, porque se usa el resto de la sesión:

- **`sqlite3.connect(ruta)`** abre el archivo —y lo crea si no existe— y devuelve una conexión.
- **`conexion.execute(sql, parametros)`** ejecuta una instrucción SQL. `CREATE TABLE IF NOT EXISTS`
  crea la tabla solo si falta; `INSERT INTO` agrega una fila; `SELECT COUNT(*)` cuenta filas.
- **El signo `?` es un marcador de posición.** Los valores nunca se pegan dentro del texto SQL: se
  pasan aparte, en la tupla del segundo argumento, y el motor los inserta ya escapados. Pegar un
  valor que viene del usuario dentro del texto SQL es la vulnerabilidad conocida como inyección SQL.
  Nótese que en `guardar` sí se arma texto con una f-string, pero **solo con los nombres de las
  columnas**, que salen del código y nunca del usuario; los valores siguen yendo por `?`.
- **`.fetchone()`** devuelve la primera fila del resultado, como tupla. Por eso `fila[0]` es el
  número que devolvió `COUNT(*)`.
- **`.commit()`** confirma la escritura en el archivo. Sin él, lo insertado se pierde.
- **`**campos`** recoge los argumentos con nombre en un diccionario, de modo que `guardar(conexion,
  bloque=2)` y `guardar(conexion, bloque=2, rut="...")` funcionan igual. Esa flexibilidad es la que
  se usará en un momento.

La consecuencia inmediata: a partir de ahora, cada prueba que acepte una reserva **escribe una fila
en un archivo**. Ese archivo es un dato que alguien decidió crear, y por lo tanto alguien tiene que
responder por él.

Una precisión de vocabulario, porque a partir de aquí conviven dos expresiones parecidas que nombran
cosas distintas:

| Expresión | Qué nombra |
|-----------|------------|
| **Base de prueba** | El documento del que salen los resultados esperados —el requisito, la especificación de la API. Es el término de ISO/IEC/IEEE 29119-3 que se usó en el Bloque 1. |
| **Base de datos de prueba** | El archivo donde el sistema guarda durante la ejecución de las pruebas. Es lo que se incorpora en este bloque. |

No tienen relación entre sí más allá de la palabra «base». En este material la segunda se escribe
siempre completa, para que no se confundan.

### 3.2 «Es solo el ambiente de pruebas»

Esa frase es la que hay que desmontar antes de escribir una línea más, porque es la que autoriza
todos los atajos que vienen después. La guía de protección de datos del módulo la contesta directo:

> Un ambiente no productivo sigue siendo tratamiento de datos. La etiqueta «test» no reduce el daño
> posible ni reemplaza los controles.

La razón es que la ley no define el tratamiento por el ambiente en que ocurre. Si en la base de
pruebas hay nombres, RUT y correos de personas reales, eso es tratamiento de datos personales, esté
donde esté el servidor y se llame como se llame la carpeta.

La misma guía separa lo que sí y lo que no, y conviene leerla completa porque los cinco puntos de la
izquierda son, literalmente, el diseño de una fixture:

| Sí · diseñar para reducir riesgo | No · normalizar atajos peligrosos |
|---|---|
| Datos sintéticos por defecto | Copiar producción completa |
| Subconjuntos mínimos y aislados | Compartir dumps por canales informales |
| Accesos temporales y auditables | Dejar credenciales o enlaces permanentes |
| Borrado verificable al terminar | Confundir seudonimizar con anonimizar |
| Casos de prueba para derechos y fallas | Conservar datos sin dueño ni plazo |

Dos precisiones de vocabulario, porque las tres palabras se usan como si fueran sinónimas y no lo son:

- **Datos sintéticos:** inventados para la prueba. No corresponden a ninguna persona. Un RUT
  sintético es un número con el formato correcto que no es el de nadie.
- **Seudonimizar:** reemplazar el identificador directo por un código, conservando la posibilidad de
  volver atrás. Siguen siendo datos personales.
- **Anonimizar:** eliminar la posibilidad de reidentificación. La guía advierte que no es lo mismo
  que renombrar: *«si una persona puede reidentificarse combinando atributos, el riesgo sigue vivo»*.

De las tres, la única que saca el problema del medio es la primera, y es también la más barata:
inventar los datos cuesta menos que cualquiera de las otras dos.

### 3.3 La proporcionalidad, ejecutada

La ley chilena no usa la palabra «minimización», que viene del vocabulario europeo. Usa
**proporcionalidad**, y lo dice en el artículo 3º letra c):

> c) Principio de proporcionalidad. Los datos personales que se traten deben limitarse estrictamente
> a aquéllos que resulten necesarios, adecuados y pertinentes en relación con los fines del
> tratamiento. Los datos personales pueden ser conservados sólo por el período de tiempo que sea
> necesario para cumplir con los fines del tratamiento, luego de lo cual deben ser suprimidos o
> anonimizados, sin perjuicio de las excepciones que establezca la ley.

Son dos obligaciones en un mismo párrafo, y las dos caen exactamente sobre las dos mitades de una
fixture:

1. **Qué datos se cargan** → «limitarse estrictamente a aquéllos que resulten necesarios… en relación
   con los fines». Es la preparación, lo que está antes del `yield`.
2. **Hasta cuándo se conservan** → «sólo por el período de tiempo que sea necesario… luego de lo cual
   deben ser suprimidos». Es el desmontaje, lo que está después del `yield`.

Aplicarlo exige la pregunta que ya se trabajó en la Unidad 1: **primero la finalidad, después el
juicio**. Aquí la finalidad de una fixture es concreta y pequeña: poner el sistema en el estado que
esa prueba necesita.

Tómese la prueba que comprueba que un bloque ya tomado se rechaza. Su finalidad es que exista una
reserva en el bloque 2. La versión cómoda de la fixture carga una persona completa:

```python
almacen.guardar(
    conexion,
    bloque=2,
    rut="11.111.111-1",
    nombre="Ana Rivas",
    correo_electronico="ana.rivas@ejemplo.cl",
)
```

La versión proporcionada carga lo necesario y nada más:

```python
almacen.guardar(conexion, bloque=2)
```

Las dos versiones producen el mismo resultado de ejecución:

```text
....                                                                     [100%]
4 passed in 0.65s
```

Y escriben cosas distintas en el archivo:

```text
--- fixture cómoda  -> lo que queda escrito en el archivo:
    (2, '11.111.111-1', 'Ana Rivas', 'ana.rivas@ejemplo.cl')
--- fixture mínima  -> lo que queda escrito en el archivo:
    (2, None, None, None)
```

Ahí está el argumento completo, y no es una opinión sobre privacidad: los tres campos personales
**no resultaron necesarios en relación con el fin**, y la prueba de que no lo eran es que al
quitarlos el resultado no cambió. Ese es el criterio del artículo 3º letra c), y es verificable
ejecutando. El día que alguien pregunte por qué la fixture no trae el RUT, la respuesta no es «por
precaución»: es que la prueba pasa igual sin él, y por lo tanto no había fin que lo justificara.

Vale la pena decir lo que este criterio **no** dice: no dice que los datos personales estén
prohibidos en una prueba. Si lo que se prueba es el formato del comprobante, el nombre es necesario
para esa finalidad y entra —sintético, eso sí. La proporcionalidad no es una prohibición: es la
obligación de poder nombrar la finalidad de cada campo que se carga.

### 3.4 `tmp_path`: dónde vive la base de datos de prueba

La fixture no debe escribir en la base de datos del proyecto. Para eso `pytest` trae una fixture ya
hecha, que se pide igual que cualquier otra —poniendo su nombre como parámetro:

> You can use the `tmp_path` fixture which will provide a temporary directory unique to each test
> function.

> Puedes usar la fixture `tmp_path`, que entrega un directorio temporal único para cada función de
> prueba.

`tmp_path` es un objeto `pathlib.Path` que apunta a una carpeta distinta para cada prueba. El
operador `/` construye rutas dentro de ella: `tmp_path / "reservas-de-prueba.db"`.

Eso resuelve el **aislamiento**: dos pruebas nunca comparten archivo. Lo que no resuelve —y es el
punto del apartado siguiente— es la **eliminación**. La propia documentación lo advierte:

> By default, `pytest` retains the temporary directory for the last 3 `pytest` invocations.

> Por omisión, `pytest` conserva el directorio temporal de las últimas 3 ejecuciones.

`pytest` guarda esas carpetas a propósito, para poder inspeccionarlas cuando una prueba falla. Es una
decisión razonable para depurar y es exactamente lo contrario de lo que pide el artículo 3º letra c).

### 3.5 El desmontaje como eliminación verificable

La fixture completa del proyecto queda así:

```python
from pathlib import Path

import pytest

import almacen


@pytest.fixture
def base_de_datos_de_prueba(tmp_path: Path) -> Path:
    ruta_real = almacen.RUTA_BASE
    almacen.RUTA_BASE = tmp_path / "reservas-de-prueba.db"

    conexion = almacen.conectar()
    almacen.guardar(conexion, bloque=2)
    conexion.close()

    yield almacen.RUTA_BASE

    almacen.RUTA_BASE.unlink(missing_ok=True)
    assert not almacen.RUTA_BASE.exists(), "la base de datos de prueba no se eliminó"
    almacen.RUTA_BASE = ruta_real
```

Esta fixture reemplaza a la del bloque anterior: donde `agenda_vacia` vaciaba una lista en memoria,
`base_de_datos_de_prueba` prepara un archivo. La estructura es la misma —preparación, `yield`,
desmontaje— y cambió lo que administra, porque cambió dónde guarda el sistema.

Obsérvese además que una fixture puede pedir otra: `base_de_datos_de_prueba` recibe `tmp_path` como
parámetro, igual que una prueba la recibiría. Y hay tres decisiones nuevas después del `yield`:

- **`.unlink(missing_ok=True)`** borra el archivo. `missing_ok=True` evita que falle si ya no está.
- **El `assert` que sigue** es lo que convierte el borrado en **eliminación verificable**. No se
  confía en que la línea anterior haya funcionado: se comprueba, y si el archivo sigue ahí, la
  ejecución lo informa. Un `assert` acepta un segundo argumento con el mensaje que se muestra cuando
  falla, y aquí se usa para que el motivo quede escrito.
- **`almacen.RUTA_BASE = ruta_real`** devuelve la ruta a su valor original. Todo lo que una fixture
  modifica fuera de sí misma tiene que quedar como estaba.

Las pruebas la piden por su nombre, igual que antes, y la que comprueba el bloque ya tomado ya no
necesita crear la reserva previa: la fixture la dejó puesta, que es su trabajo.

```python
def test_reserva_aceptada_responde_201(base_de_datos_de_prueba: Path) -> None:
    respuesta = cliente.post("/reservas", json=SOLICITUD)
    assert respuesta.status_code == 201


def test_bloque_fuera_de_jornada_responde_409(base_de_datos_de_prueba: Path) -> None:
    respuesta = cliente.post("/reservas", json=SOLICITUD | {"bloque": 12})
    assert respuesta.status_code == 409


def test_bloque_ya_tomado_responde_409(base_de_datos_de_prueba: Path) -> None:
    respuesta = cliente.post("/reservas", json=SOLICITUD | {"bloque": 2})
    assert respuesta.status_code == 409


def test_la_base_de_datos_existe_durante_la_prueba(base_de_datos_de_prueba: Path) -> None:
    assert base_de_datos_de_prueba.exists()
```

Con la fixture completa, la suite informa:

```text
....                                                                     [100%]
4 passed in 0.61s
```

**Ahora la parte que importa.** Supóngase que alguien comenta la línea del borrado —por depurar, y se
le olvida descomentarla. El código de las pruebas no cambia. El resultado sí:

```text
E       AssertionError: la base de datos de prueba no se eliminó
E       assert not True

ERROR test_api.py::test_reserva_aceptada_responde_201 - AssertionError: la base de datos de prueba no se eliminó
ERROR test_api.py::test_bloque_fuera_de_jornada_responde_409 - AssertionError: la base de datos de prueba no se eliminó
ERROR test_api.py::test_bloque_ya_tomado_responde_409 - AssertionError: la base de datos de prueba no se eliminó
ERROR test_api.py::test_la_base_de_datos_existe_durante_la_prueba - AssertionError: la base de datos de prueba no se eliminó

4 passed, 4 errors in 0.75s
```

Léase despacio la última línea: **`4 passed, 4 errors`**. Las cuatro pruebas pasaron y la ejecución
falló igual. `pytest` distingue las dos cosas y les pone nombres distintos:

- **`FAILED`** es una prueba que se ejecutó y su aserción no se cumplió.
- **`ERROR`** es un fallo en la preparación o el desmontaje de la fixture, es decir, fuera de la
  prueba propiamente tal.

Esa distinción es la que permite exigir dos cosas a la vez de una misma ejecución: que el sistema se
comporte como dice el contrato, y que los datos que se usaron para comprobarlo ya no estén.

Y el resultado de esa ejecución sigue en el disco. `pytest` numera correlativamente las carpetas que
crea —`pytest-14`, `pytest-15`, `pytest-16`— y conserva las tres últimas. Contando los archivos de
base de datos que quedaron en cada una:

```text
--- pytest-14: 4 archivos .db      <- la ejecución sin el borrado
--- pytest-15: 0 archivos .db
--- pytest-16: 0 archivos .db
```

Los cuatro archivos que sobrevivieron se pueden abrir, y su contenido se lee sin dificultad:

```text
[(2, None, None, None)]
```

Aquí cierran las dos mitades del bloque, y conviene decirlo explícitamente porque es el argumento
completo de la sesión: **el borrado falló de verdad, por una línea comentada, y lo que quedó
guardado en el disco fue `(2, None, None, None)` en lugar del nombre, el RUT y el correo de una
persona.** Eso no ocurrió por suerte. Ocurrió porque la fixture cargaba lo proporcionado. La
proporcionalidad no es el control que impide el incidente: es el que decide su tamaño cuando el
incidente ocurre.

### 3.6 Lo que hace un agente con los datos de prueba

Pedirle a un agente «datos de prueba realistas» es una de las instrucciones más peligrosas que se le
pueden dar, y el motivo no es que el agente se equivoque: es que hace bien lo que se le pidió.
«Realista» es, para un modelo de lenguaje, un nombre chileno plausible, un RUT con dígito verificador
correcto y un correo con forma de correo. El resultado tiene exactamente la apariencia de un dato
personal, y ahí empiezan dos problemas distintos:

1. **Un RUT generado con dígito verificador válido puede ser el de una persona real.** No hay
   intención de por medio y da lo mismo: el dato queda en la base de datos de prueba y es
   indistinguible de uno verdadero.
2. **Si los datos se ven reales, nadie los trata como sintéticos.** Se copian a otro ambiente, se
   pegan en un ticket, se comparten en un mensaje.

- **Qué hace bien el agente:** generar volumen sintético con formato correcto cuando se le fija el
  criterio —por ejemplo, RUT de un rango reservado para pruebas, correos en un dominio propio,
  nombres evidentemente ficticios. Y escribir el desmontaje, que es trabajo mecánico.
- **Qué no conviene delegarle:** decidir qué campos entran. Esa decisión exige nombrar la finalidad
  de la prueba, y la finalidad no está en el código; está en el requisito.
- **Error frecuente:** pedir «datos de prueba realistas» en vez de «datos sintéticos que cumplan este
  formato y sean reconociblemente falsos». La segunda formulación es verificable y la primera pide
  justamente lo que hay que evitar.

Y una advertencia que va más allá de la fixture: pegar una fila de producción en el chat de un
agente para que «entienda el formato» es comunicar datos personales a un tercero. Es la versión
moderna de compartir un *dump* por un canal informal, que es uno de los cinco atajos que la guía del
módulo desaconseja expresamente.

## Ejercicio del bloque

Sobre el proyecto propio, el mismo que se entrega como evaluación.

1. Abre la fixture que escribiste en el bloque anterior —o la preparación que haga sus veces— y lista
   **cada campo** que carga.
2. Al lado de cada campo, escribe la finalidad que lo justifica, en la forma «este campo es necesario
   porque la prueba comprueba ___». Si no puedes completar la frase, el campo sobra.
3. Quita los campos que sobran y vuelve a ejecutar. Anota el resultado. Si la suite sigue en verde,
   acabas de producir la evidencia de que esos datos no eran necesarios en relación con el fin.
4. Agrega a tu desmontaje una comprobación de que lo creado ya no está, con su mensaje. Después
   inutiliza el borrado a propósito, ejecuta, y copia la línea de resumen que obtienes.
5. En dos líneas: si mañana el borrado de tu proyecto fallara sin que nadie se diera cuenta, ¿qué
   quedaría escrito, y de quién sería?

**Pista:** para el punto 3, la forma más rápida de encontrar campos que sobran es quitarlos de a uno
y ejecutar. El campo que no cambia ningún resultado al desaparecer no tenía finalidad en esa prueba.

**Evidencia esperada:** la lista de campos con su finalidad declarada, las dos ejecuciones antes y
después de quitar los que sobran, la línea de resumen con el borrado inutilizado, y la respuesta del
punto 5.

## Preguntas guía

1. El artículo 3º letra c) exige que los datos se limiten a los «necesarios, adecuados y pertinentes
   en relación con los fines del tratamiento». ¿Por qué ese criterio no se puede aplicar mirando solo
   la fixture, y qué hay que tener escrito antes para poder aplicarlo?

   **Pista:** la frase dice «en relación con los fines». Revisa qué pasa si intentas juzgar si el RUT
   sobra sin haber dicho antes qué comprueba la prueba.

2. Una suite informa `4 passed, 4 errors`. Un compañero dice que se puede subir igual, porque las
   cuatro pruebas pasaron y los errores son «de la fixture, no del código». ¿Qué le falta considerar?

   **Pista:** piensa qué afirma cada una de las dos cifras por separado, y cuál de las dos habla de
   datos que quedaron en un disco.

3. `pytest` conserva a propósito los directorios temporales de las últimas tres ejecuciones para
   poder depurar. ¿En qué se convierte esa comodidad si la fixture carga datos de personas reales, y
   por qué el `unlink` explícito no es redundante?

   **Pista:** separa dos cosas que `tmp_path` no resuelve juntas. Una es que dos pruebas no se pisen;
   la otra es cuánto tiempo sobrevive lo que se escribió.

## Fuentes técnicas del bloque

- [Ley 21.719, que regula la protección y el tratamiento de los datos personales y crea la Agencia de Protección de Datos Personales — Diario Oficial de la República de Chile, núm. 44.023, viernes 13 de diciembre de 2024, CVE 2583630](https://www.diariooficial.interior.gob.cl/publicaciones/2024/12/13/44023/01/2583630.pdf) — el artículo 3º letra c), principio de proporcionalidad, con sus dos frases: la limitación de los datos a los necesarios en relación con los fines, y la obligación de suprimirlos o anonimizarlos una vez cumplido el fin; y el derecho de supresión de la letra s) del artículo 2º. La ley entra en vigencia el 1 de diciembre de 2026.
- Guía de protección de datos del módulo, en [`docs/ley-21719/`](../../../docs/ley-21719/Guia-Maestra-Ley-21719-Proteccion-Datos-Chile-2026.pdf) — la sección «Testing e IA: los datos de prueba también cuentan», con la afirmación de que un ambiente no productivo sigue siendo tratamiento de datos, las cinco prácticas recomendadas —datos sintéticos por defecto, subconjuntos mínimos y aislados, accesos temporales y auditables, borrado verificable al terminar, casos de prueba para derechos y fallas— y los cinco atajos desaconsejados, incluida la advertencia de que anonimizar no es renombrar.
- [ISO/IEC/IEEE 29119-3:2021 — *Test documentation*](https://www.iso.org/standard/79429.html) — los requisitos de datos de prueba (8.5) y de ambiente de prueba (8.6): la fixture es la forma ejecutable de esos dos documentos.
- [`pytest` — *How to use temporary directories and files in tests*](https://docs.pytest.org/en/stable/how-to/tmp_path.html) — la fixture `tmp_path` como directorio temporal único por función de prueba, y la retención por omisión de los directorios de las últimas tres ejecuciones.
- [Documentación de `sqlite3` en la biblioteca estándar de Python](https://docs.python.org/3/library/sqlite3.html) — `connect`, `execute` con marcadores de posición, `fetchone` y `commit`, y la advertencia sobre no construir sentencias SQL concatenando valores.
- Ejecuciones registradas para esta clase sobre el proyecto de reserva de laboratorio, con Python 3.12.12, pytest 9.1.1, FastAPI 0.141.1, Starlette 1.6.0, Pydantic 2.13.5 y httpx2 2.13.0: la suite de cuatro casos en verde con la fixture cómoda y con la fixture proporcionada, el contenido escrito en el archivo por cada una de las dos, la ejecución con el borrado inutilizado que informa `4 passed, 4 errors`, y el recuento de archivos `.db` sobrevivientes en los directorios temporales de las tres últimas ejecuciones.

---

# BLOQUE 4: Dónde un doble deja de ser legítimo

- **Duración:** 25 minutos
- **Objetivo del bloque:** fijar el criterio que decide qué se puede sustituir en una prueba de
  integración y qué no, y comprobar ejecutando qué ocurre cuando se cruza ese límite. Al finalizar,
  el estudiante debe poder mirar una prueba que se presenta como de integración y decir si integra
  algo o si es una prueba unitaria con otro nombre.
- **Modalidad:** exposición con ejecución en vivo y comparación de dos ejecuciones del mismo caso.
- **Ritmo sugerido:** 5 minutos para el criterio, 6 para el defecto con la base real, 6 para la misma
  comprobación con la base sustituida, 4 para lo que el doble registró y 4 para el sesgo del agente y
  el ejercicio.

## Desarrollo

### 4.1 El criterio

La sesión de cobertura dejó nombrados los cinco tipos de doble —*dummy*, *stub*, *spy*, *mock* y
*fake*— y la razón para usarlos: sustituir una dependencia para poder observar una pieza. Lo que
falta es el límite, y el límite lo da el nivel en el que se está probando.

ISTQB define el objeto del nivel de integración con precisión suficiente para resolverlo:

> Component integration testing […] focuses on testing the interfaces and interactions between
> components.

> Las pruebas de integración de componentes […] se centran en probar las interfaces y las
> interacciones entre componentes.

De ahí sale la regla, y es casi una tautología una vez dicha: **si el objeto de la prueba es la
interacción entre dos piezas, sustituir esa interacción por un doble deja a la prueba sin objeto.**

Eso no convierte a los dobles en ilegítimos en este nivel. Martin Fowler distingue dos formas de
prueba de integración, y la primera los usa explícitamente:

> Narrow integration tests […] exercise only that portion of the code in my service that talks to a
> separate service […] uses test doubles of those services, either in process or remote.

> Las pruebas de integración estrechas […] ejercitan solo la porción de código de mi servicio que
> habla con un servicio separado […] usan dobles de prueba de esos servicios, ya sea en el mismo
> proceso o remotos.

> Broad integration tests […] require live versions of all services […] exercise code paths through
> all services, not just code responsible for interactions.

> Las pruebas de integración amplias […] requieren versiones vivas de todos los servicios […]
> ejercitan caminos de código a través de todos los servicios, no solo el código responsable de las
> interacciones.

Léase con atención dónde pone Fowler el doble: en **el servicio separado**, al otro lado del límite.
Lo que sí se ejecuta, en los dos casos, es el código propio que habla con ese servicio. Con eso el
criterio queda en una frase que se puede aplicar mirando una prueba:

> Se sustituye lo que está **al otro lado** del límite que se está probando. No se sustituye el
> código propio que **está en** ese límite, porque entonces ese código no se ejecuta y el límite no
> se prueba.

Y una segunda pregunta, más práctica, que en general basta: **¿qué defecto seguiría estando ahí si
esta prueba pasara?** Si la respuesta incluye el defecto que la prueba dice buscar, el doble se puso
en el lugar equivocado.

### 4.2 El defecto que solo la base real encuentra

Se introduce en la API un error de los que se cometen de verdad: al preguntar si el bloque está
tomado, se le pasa el argumento equivocado.

```python
tomado = almacen.bloque_tomado(conexion, solicitud.personas)
```

Donde debía ir `solicitud.bloque` va `solicitud.personas`. Es un descuido de copiar y pegar, la
línea sigue siendo sintácticamente correcta, ningún analizador estático la marca —los dos son `int`—
y el sistema, en consecuencia, **deja reservar un bloque que ya estaba reservado**.

Con la base de datos real, la suite del bloque anterior lo encuentra sin que haya que hacer nada
nuevo:

```text
E       assert 201 == 409
E        +  where 201 = <Response [201 Created]>.status_code

FAILED test_api.py::test_bloque_ya_tomado_responde_409 - assert 201 == 409
1 failed, 3 passed in 0.72s
```

La prueba pidió el bloque 2, que la fixture había dejado reservado, y el sistema respondió `201`: lo
aceptó. Funcionó porque la consulta salió de verdad hacia el archivo, buscó reservas en el bloque
`12` —el número de personas— y no encontró ninguna.

### 4.3 La misma comprobación, con la base sustituida

Ahora la misma comprobación, escrita como se escribe habitualmente cuando se quiere que la prueba
sea rápida y no dependa de ningún archivo. Se sustituye el módulo de almacenamiento completo con
`create_autospec`, la herramienta de la sesión de cobertura que construye un doble respetando la
firma del original:

```python
from unittest.mock import create_autospec

import almacen
import api


@pytest.fixture
def almacen_doble():
    real = api.almacen
    api.almacen = create_autospec(almacen)
    yield api.almacen
    api.almacen = real


def test_bloque_ya_tomado_responde_409(almacen_doble) -> None:
    almacen_doble.bloque_tomado.return_value = True
    almacen_doble.reservas_de.return_value = 0
    respuesta = cliente.post("/reservas", json=SOLICITUD | {"bloque": 2})
    assert respuesta.status_code == 409
```

Se lee así: `api.almacen` es la referencia al módulo que la API usa; reemplazarla hace que la API
llame al doble sin enterarse. `return_value` fija la respuesta prefabricada del *stub* —el doble que
devuelve una respuesta preparada, según la taxonomía ya trabajada. Y el mismo defecto de 4.2 sigue
en la API, sin tocar.

El resultado:

```text
.                                                                        [100%]
1 passed in 0.47s
```

Verde. Más rápido que la versión con archivo, sin base de datos que preparar ni borrar, y
**comprobando exactamente nada**. La comparación, lado a lado:

| | Base real | Base sustituida |
|---|---|---|
| Resultado | `1 failed, 3 passed` | `1 passed` |
| El defecto | queda expuesto | sigue ahí, invisible |
| Qué se ejecutó | la consulta, el archivo, la comparación | la aserción, y nada más |

La causa es la que anticipaba el criterio. La prueba dice comprobar que el sistema reconoce un bloque
ya tomado. Reconocer un bloque ya tomado es, en este sistema, **consultar la base de datos**. Al
sustituir la base, lo único que quedó comprobado es que la API devuelve `409` cuando alguien le dice
que el bloque está tomado —que era justamente lo que no hacía falta comprobar.

Conviene notar también por qué `create_autospec` no ayuda aquí, porque en la sesión de cobertura se
lo presentó como la forma segura de construir un doble: verifica la **firma** —que se llame con dos
argumentos del tipo correcto— y no tiene nada que decir sobre **cuál** es el valor que se pasa. La
llamada `bloque_tomado(conexion, 12)` respeta la firma perfectamente.

### 4.4 Lo que el doble sí registró, y nadie miró

Hay un detalle que vuelve el caso más interesante, y de paso indica el remedio. El doble no ignoró el
defecto: lo anotó. Preguntándole con qué se lo llamó:

```text
respuesta: 409
el doble registro esta llamada: call(<MagicMock name='mock.conectar()' id='...'>, 12)
```

Ese `12` es el número de personas. El doble registró que la API le preguntó por el bloque `12` cuando
la solicitud era del bloque `2`. La evidencia del defecto estaba dentro de la prueba, y la prueba no
la miró, porque su única aserción era sobre el código de estado.

Ese es el uso del *spy* —el doble que registra cómo fue llamado—: cuando se sustituye una
dependencia, la prueba se vuelve responsable de comprobar también **qué se le pidió**.

```python
almacen_doble.bloque_tomado.assert_called_once_with(cualquier_conexion, 2)
```

Con esa línea agregada, el doble habría detectado el defecto. Pero nótese lo que esa aserción
comprueba y lo que no: comprueba que la API pide lo correcto, no que la base responda correctamente
a lo que se le pide. Sustituir obliga a duplicar en la prueba lo que se sabe de la dependencia, y esa
copia puede quedar desactualizada respecto de la dependencia real —que es el mecanismo, ya visto, por
el cual una suite llega al verde comprobando los supuestos de quien la escribió.

### 4.5 La prueba de integración que devuelve un agente

Pedirle a un agente «una prueba de integración para este endpoint» produce, con mucha frecuencia,
exactamente el archivo de 4.3. El sesgo tiene dos causas que se refuerzan:

1. **Es lo que abunda en el material del que aprendió.** Las pruebas con dependencias sustituidas son
   más numerosas, más cortas y más fáciles de mostrar en un ejemplo que las que preparan y limpian
   una base de datos.
2. **Es lo que optimiza la señal que se le pide.** Una prueba con dobles es rápida, no necesita
   ambiente y pasa a la primera. Si el criterio de éxito es «la prueba corre y pasa», sustituir
   siempre es la jugada ganadora.

- **Qué hace bien el agente:** construir el andamiaje del doble. `create_autospec`, la fixture que
  reemplaza y restaura, las aserciones sobre llamadas. Es trabajo mecánico y lo hace correctamente.
- **Qué no conviene delegarle:** decidir qué se sustituye. Esa decisión requiere saber cuál es el
  objeto de la prueba, y el objeto de la prueba está en el requisito, no en el código.
- **Error frecuente:** aceptar la prueba porque es rápida y pasa. Las dos propiedades que la hacen
  atractiva —velocidad y verde inmediato— son consecuencia de lo mismo que la vacía.

La instrucción que sí rinde nombra el límite en vez de pedir un resultado: «prueba de integración que
use la base de datos real sobre un archivo temporal, sin sustituir el módulo de almacenamiento». Es
verificable —se puede leer la prueba y comprobar si lo cumple— y no admite la salida cómoda.

## Ejercicio del bloque

Sobre el proyecto propio, el mismo que se entrega como evaluación.

1. Busca en tu suite todas las pruebas que sustituyan alguna dependencia. Haz una lista con el nombre
   de la prueba y qué sustituye.
2. Para cada una, responde la pregunta del criterio: **¿qué defecto seguiría ahí si esta prueba
   pasara?** Escribe la respuesta, aunque sea incómoda.
3. Clasifica cada sustitución en legítima o no, según si lo sustituido está al otro lado del límite
   que la prueba dice comprobar o si está justo en ese límite.
4. Elige la sustitución más difícil de defender, y escribe la versión sin doble de esa prueba: qué
   tendría que preparar la fixture para que la dependencia real pudiera ejecutarse. No hace falta que
   la ejecutes.

**Pista:** una señal práctica para el punto 3 es el tiempo. Si una prueba que dice tocar la base de
datos, la red o el sistema de archivos termina en menos de un milisegundo, no está tocando nada de
eso.

**Evidencia esperada:** la lista de sustituciones con lo que cada una oculta, la clasificación con su
criterio, y el diseño de la fixture que permitiría prescindir del doble en el caso más dudoso.

## Preguntas guía

1. La misma comprobación dio `1 failed` con la base real y `1 passed` con la base sustituida, sobre
   el mismo código defectuoso. ¿Cuál de las dos pruebas está mal escrita, y por qué la respuesta no
   es «la que falla»?

   **Pista:** pregúntate qué afirma cada una. Una habla del sistema; la otra habla de lo que el autor
   de la prueba le dijo al doble que respondiera.

2. `create_autospec` fue presentado como la forma segura de construir un doble porque respeta la
   firma del original. Aquí no detectó nada. ¿Qué clase de defecto sí detecta y cuál no, y por qué esa
   distinción importa más en el nivel de integración que en el unitario?

   **Pista:** compara lo que cambia cuando alguien renombra un parámetro de la dependencia con lo que
   cambia cuando alguien le pasa el valor equivocado.

3. Un compañero defiende sus pruebas con dobles diciendo que la suite completa corre en 0,3 segundos
   y la versión con base de datos tardaría diez veces más. ¿Qué le concedes y qué no?

   **Pista:** los dos niveles existen y los dos son necesarios. La pregunta no es cuál elegir, sino
   qué queda sin comprobar si solo existe uno de los dos.

## Fuentes técnicas del bloque

- [ISTQB Certified Tester Foundation Level Syllabus v4.0.1, 15 de septiembre de 2024](https://astqb.org/assets/documents/ISTQB_CTFL_Syllabus_v4.0.1.pdf) — sección 2.2.1: el objeto de las pruebas de integración de componentes son las interfaces y las interacciones entre componentes, que es lo que hace contradictoria su sustitución por un doble.
- [Martin Fowler — *IntegrationTest*, 16 de enero de 2018](https://martinfowler.com/bliki/IntegrationTest.html) — la distinción entre pruebas de integración estrechas y amplias, y la ubicación del doble en el servicio separado y no en el código propio que habla con él.
- [Martin Fowler — *Mocks Aren't Stubs*, 2 de enero de 2007](https://martinfowler.com/articles/mocksArentStubs.html) — la taxonomía de los cinco dobles y la distinción entre verificación de estado y de comportamiento, que esta sesión aplica al nivel de integración.
- [Documentación de `unittest.mock` — `create_autospec` y `assert_called_once_with`](https://docs.python.org/3/library/unittest.mock.html) — la construcción de un doble que respeta la firma del original, y la comprobación de con qué argumentos fue llamado.
- Ejecuciones registradas para esta clase sobre el proyecto de reserva de laboratorio, con Python 3.12.12, pytest 9.1.1, FastAPI 0.141.1, Starlette 1.6.0, Pydantic 2.13.5 y httpx2 2.13.0: el mismo defecto de orden de argumentos evaluado dos veces, con la base real (`1 failed, 3 passed`) y con el módulo de almacenamiento sustituido por `create_autospec` (`1 passed`), y el registro de la llamada que el doble conservó.

---

# Cierre: tres niveles, tres afirmaciones distintas

## 1. Lo que cada nivel puede afirmar

Las últimas sesiones produjeron pruebas de tres clases sobre el mismo sistema. No se reemplazan entre
sí, y confundirlas es lo que lleva a creer que un sistema está probado cuando no lo está.

| Nivel | Qué afirma | Qué no puede afirmar |
|-------|-----------|----------------------|
| Unitario | Que una función decide lo correcto, aislada del resto | Que alguien la llame, ni que la llamen bien |
| Integración con la dependencia real | Que dos piezas se entienden: la forma del dato, el contrato, la consulta que sale de verdad | Que el sistema completo sirva para lo que fue construido |
| Integración con la dependencia sustituida | Que la pieza propia hace las llamadas que se espera que haga | Nada sobre la dependencia sustituida, ni sobre el acuerdo con ella |

La tercera fila es la que más se malinterpreta, y de ahí salió el bloque anterior: es un nivel
legítimo y útil, siempre que quien lo escribe sepa que está comprobando sus propias llamadas y no la
colaboración.

## 2. La afirmación que se puede sostener

Al terminar la sesión anterior, lo defendible era sobre cada pieza por separado: qué comprueba,
que se la vio fallar antes de existir, qué cambios detecta. Hoy se le agrega una segunda capa, y las
dos juntas son lo que se le pide a un profesional:

> Estas piezas se entienden entre sí —y puedo mostrar el contrato contra el que lo comprobé—, cada
> prueba prepara el estado que necesita y no hereda el de ninguna otra —y puedo mostrarlo
> ejecutándolas por separado—, y los datos que usé para comprobarlo ya no existen —y puedo mostrar la
> ejecución que lo verifica.

Lo que sigue sin poder afirmarse, y conviene decirlo en voz alta: que el sistema sirva para lo que
fue construido. Todo lo de hoy se comprobó enviando solicitudes desde un programa. Nadie abrió el
sistema y lo usó.

## 3. Ticket de salida

En tres líneas, antes de salir:

1. Un defecto de contrato de tu propio proyecto: qué pieza entrega algo distinto de lo que la otra
   espera.
2. El resultado de ejecutar tu prueba más reciente **sola**, y si coincide con el que da dentro de la
   suite.
3. Un campo que hoy carga tu fixture y que no puedes justificar con una finalidad.

## 4. Próxima sesión: el sistema visto por quien lo usa

Todo lo de hoy pasó por debajo de la interfaz. El `TestClient` envía solicitudes sin abrir un
navegador, sin pulsar nada y sin esperar a que se dibuje una pantalla, y eso fue deliberado: permitió
aislar el contrato y los datos sin que se mezclara nada más.

La próxima sesión sube al último nivel, donde el objeto de prueba es el sistema completo tal como lo
encuentra una persona: un navegador de verdad, la interfaz de verdad y las esperas que impone una
pantalla que tarda en responder. Ahí aparecen defectos que ninguno de los tres niveles de hoy puede
ver. Y aparece también, por primera vez en el módulo, una prueba que falla sin que nadie haya tocado
el sistema —consecuencia de que ahora hay que esperar a que algo ocurra en pantalla.

## Mensaje final

Los tres hallazgos de la sesión tienen la misma forma, y por eso se pueden resumir en una sola idea.
El defecto de contrato estaba entre dos funciones correctas. La prueba solitaria pasaba por algo que
había hecho otra prueba. El doble ocultaba el defecto ocupando el lugar exacto donde había que mirar.
En los tres casos, cada pieza vista por separado estaba bien.

> Un sistema no es la suma de sus piezas, sino de sus piezas y de los acuerdos entre ellas. Los
> acuerdos no viven dentro de ningún archivo, y por eso ninguna prueba que mire un archivo solo puede
> comprobarlos. Un agente escribe las piezas cada vez mejor; decidir qué acuerdo tenían que cumplir, y
> negarse a sustituir justo aquello que hay que observar, sigue siendo trabajo de quien firma.

## Fuentes de síntesis

- [ISTQB Certified Tester Foundation Level Syllabus v4.0.1](https://astqb.org/assets/documents/ISTQB_CTFL_Syllabus_v4.0.1.pdf) — los cinco niveles de prueba y los atributos que los distinguen.
- [ISO/IEC/IEEE 29119-3:2021 — *Test documentation*](https://www.iso.org/standard/79429.html) — requisitos de datos de prueba (8.5) y de ambiente de prueba (8.6).
- [Ley 21.719 — Diario Oficial núm. 44.023, 13 de diciembre de 2024](https://www.diariooficial.interior.gob.cl/publicaciones/2024/12/13/44023/01/2583630.pdf) — artículo 3º letra c), principio de proporcionalidad, en sus dos obligaciones: limitación de los datos y supresión una vez cumplido el fin.
- [Gerard Meszaros — *xUnit Test Patterns*](http://xunitpatterns.com/Erratic%20Test.html) — *Interacting Tests*, *Lonely Test* y *Fresh Fixture*.
- Documentación oficial de [`pytest`](https://docs.pytest.org/en/stable/), [FastAPI](https://fastapi.tiangolo.com/) y [`sqlite3`](https://docs.python.org/3/library/sqlite3.html).
