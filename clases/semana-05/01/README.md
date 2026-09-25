# Clase 13 - Semana 05 - El contrato se cumple y la persona igual no puede reservar: pruebas de extremo a extremo, la espera que vuelve inestable una prueba y el agente que entra por primera vez

- **Unidad:** 02 · Desarrollo y Ejecución de Casos de Prueba
- **Fecha:** Lunes 28 de septiembre de 2026
- **Duración:** 3 horas pedagógicas · 140 minutos (08:30 - 10:50)
- **Modalidad:** Presencial en Laboratorio PC
- **Docente:** Diego Obando
- **Marco de referencia:** Playwright (`@playwright/test`) sobre TypeScript · localizadores, espera automática y aserciones que reintentan · ISTQB Certified Tester Foundation Level v4.0.1, sección 4.4 · pruebas exploratorias y pruebas por sesiones · ISO/IEC/IEEE 29119-4:2021 y 29119-1:2022 · la diferencia entre técnica de prueba y práctica de prueba · ISO/IEC 25010:2023 · capacidad de interacción · el agente como usuario de la interfaz

---

# Objetivos de la Clase

## Objetivo General

Al finalizar esta sesión, el estudiante será capaz de comprobar el sistema por el único lugar por
donde lo usa una persona —una pantalla, en un navegador— y de sostener qué evidencia entrega esa
comprobación que ninguno de los niveles anteriores podía entregar. Las sesiones anteriores dejaron
una función verificada, una colaboración entre piezas comprobada contra su contrato y una base de
datos que se prepara y se borra en cada prueba. Todo eso se comprobó **enviando solicitudes desde un
programa**. Un programa lee el contrato —el acuerdo sobre la forma de lo que entra y lo que sale del
sistema—; una persona no. Una persona lee un botón, un mensaje y una
lista, y de eso depende que logre o no lo que vino a hacer.
Por eso el nivel de extremo a extremo no agrega precisión sobre lo ya comprobado: agrega **un testigo
distinto**, y con él una clase de defecto que hasta hoy no podía aparecer. El estudiante verá
ejecutado el caso que la ordena: la API —la puerta por la que otros programas usan el sistema—
responde exactamente lo que su contrato promete, las pruebas
de integración siguen en verde, y la persona que usa la pantalla igual no puede completar la reserva
ni entender por qué. Ese defecto no vive en ninguna pieza ni en el acuerdo entre dos de ellas, sino
en lo que el sistema le muestra a quien lo usa.
Ir al navegador tiene un costo inmediato, y es el segundo asunto de la sesión. Hasta hoy cada
aserción comparaba un valor que ya estaba calculado cuando la prueba lo miraba. En una pantalla eso
deja de ser cierto: la respuesta llega después, la página se actualiza después, y una prueba que
mira antes de tiempo falla sin que el sistema tenga ningún defecto. El estudiante verá aparecer, por
primera vez en el módulo, **una prueba que falla sin que nadie haya tocado el sistema**, y aprenderá
la regla que la corrige: no se espera un tiempo, se espera una condición.
La segunda mitad de la sesión cambia de pregunta. Las pruebas escritas de antemano comprueban lo que
alguien ya pensó que había que comprobar; lo que nadie pensó queda afuera. La **prueba exploratoria**
existe para eso: diseñar, ejecutar y evaluar a la vez, mientras se aprende el sistema. El estudiante
la conducirá con el método que la hace auditable —una carta que fija el objetivo, un tiempo acotado y
un registro de hallazgos— y comprobará que las dos fuentes de referencia del módulo no la clasifican
igual, lo que dice algo sobre qué clase de cosa es. Con ese método evaluará lo que propone el
cronograma: **un agente que usa la interfaz como alguien que entra por primera vez**, qué encuentra
bien, qué no puede encontrar y cuáles de sus hallazgos hay que confirmar antes de creerlos.
La sesión cierra devolviendo esos hallazgos al terreno donde se pueden probar. «La interfaz es
confusa» no se puede cumplir ni incumplir; convertido en un criterio con magnitud, método y umbral
—las tres piezas que la Unidad 1 estableció— y asociado a la capacidad de interacción de ISO/IEC
25010:2023, se vuelve una prueba de Playwright que hoy falla. Y no toda prueba bien redactada lo
consigue: el estudiante verá una que pasa con el defecto presente, porque mide algo que fue cierto
solo durante un instante.

## Objetivos Específicos

1. **Distinguir la prueba de extremo a extremo de la de integración por el testigo que incorpora**,
   no por su tamaño, y nombrar la clase de defecto que solo puede manifestarse en ese nivel: el
   sistema cumple su contrato y la persona que lo usa no puede completar la tarea.
2. **Leer y ejecutar una prueba de Playwright sobre TypeScript**, nombrando con precisión el
   localizador, la acción y la aserción, y explicando por qué los elementos de la página se buscan
   por lo que una persona percibe —su rol, su etiqueta, su texto— y no por la estructura interna del
   documento.
3. **Explicar por qué una prueba que espera un tiempo fijo es inestable**, demostrándolo con
   ejecuciones repetidas sobre el mismo sistema sin cambiarlo, y corregirla reemplazando la espera
   por una aserción que reintenta hasta que se cumple una condición o se agota un plazo.
4. **Conducir una sesión de prueba exploratoria** con carta de sesión, tiempo acotado y registro de
   hallazgos, y sostener con las fuentes por qué la norma ISO la trata como una práctica de prueba y
   el programa de ISTQB como una técnica basada en la experiencia.
5. **Evaluar el recorrido de un agente que usa la interfaz como quien entra por primera vez**,
   separando los hallazgos que se pueden confirmar mirando la pantalla de los que exigen conocer el
   requisito, y declarando cuáles se aceptan como defecto y cuáles quedan como indicio.
6. **Convertir un hallazgo de usabilidad en un criterio verificable**, con magnitud observable,
   método de medición y umbral, asociarlo a la capacidad de interacción de ISO/IEC 25010:2023,
   escribir la prueba de Playwright que lo comprueba, y reconocer cuándo una prueba pasa con el
   defecto presente porque midió un estado que fue cierto solo por un instante.

## Competencias Transversales

- **Probar desde el lugar de quien usa:** la pregunta deja de ser «¿el sistema responde lo que
  promete?» y pasa a ser «¿alguien que no conoce el sistema logra lo que vino a hacer?», y las dos
  pueden tener respuestas distintas sobre el mismo código.
- **No esperar un tiempo, esperar una condición:** un plazo fijo que funciona en una máquina es una
  apuesta sobre la velocidad de otra, y la costumbre de reemplazar apuestas por condiciones vale
  mucho más allá de las pruebas.
- **No convivir con la prueba que falla a veces:** una prueba inestable no es una prueba que a veces
  informa bien; es una prueba cuyo resultado no significa nada, porque nadie puede distinguir si el
  rojo de hoy es del sistema o de ella.
- **Tratar una opinión sobre una interfaz como una hipótesis:** «se entiende» y «confunde» son
  afirmaciones que se pueden someter a prueba, y hasta que se someten no son más que gusto.
- **Usar al agente como testigo y no como juez:** lo que reporta un agente que recorre la interfaz es
  un indicio útil y rápido, y la decisión de si es un defecto sigue siendo de quien conoce el
  requisito.

---

# Mapa de la Clase

| Horario | Sección | Propósito |
|---------|---------|-----------|
| 08:30 - 08:40 | Encuadre | Constatar hasta dónde llegó la evidencia —todo se comprobó enviando solicitudes desde un programa— y plantear la pregunta que ocupa la sesión: qué ocurre cuando quien usa el sistema es una persona frente a una pantalla. Situar la semana de cierre: el plazo de la segunda evaluación parcial venció el viernes y el corte final es este miércoles 30. |
| 08:40 - 09:10 | Bloque 1 | La interfaz del proyecto, leída, y la primera prueba de Playwright: localizador, acción y aserción. Y el defecto que ordena la sesión: la API cumple su contrato, las pruebas de integración pasan, y la persona igual no puede completar la reserva. |
| 09:10 - 09:35 | Bloque 2 | La espera. Por qué en una pantalla el valor que se quiere comprobar todavía no existe cuando la prueba lo mira, la primera prueba del módulo que falla sin que nadie toque el sistema, y la regla que la corrige: esperar una condición, no un tiempo. |
| 09:35 - 09:45 | Pausa | Descanso técnico. |
| 09:45 - 10:15 | Bloque 3 | Probar sin casos escritos de antemano. La prueba exploratoria según las dos fuentes, que no la clasifican igual; la sesión con carta, tiempo acotado y registro; y un agente que recorre la interfaz como quien entra por primera vez, con sus hallazgos separados entre los que se confirman y los que no. |
| 10:15 - 10:40 | Bloque 4 | De un hallazgo a un criterio. El doble clic convertido en magnitud, método y umbral contra la capacidad de interacción de ISO/IEC 25010:2023; la prueba que lo comprueba y hoy falla, y otra que pasa con el defecto presente porque mide un instante. |
| 10:40 - 10:50 | Cierre | Consolidar qué agrega cada testigo —la función, la colaboración, la persona— y dejar planteado lo que la sesión siguiente tiene que decidir: cuánto de todo esto vale la pena probar, y cómo se registra una evidencia que corre con otra herramienta. |

> Se trabaja sobre el mismo proyecto de reserva de laboratorio de las sesiones anteriores, que hoy
> recibe por primera vez algo que una persona puede abrir en un navegador: una interfaz web pequeña,
> servida por la misma aplicación, con el formulario de reserva y el estado de los bloques del día. Se
> entrega **ya escrita** y se lee, porque la sesión es sobre probarla y no sobre construirla. Las
> pruebas de extremo a extremo se escriben en TypeScript, el mismo lenguaje que el estudiante usó con
> Vitest en la sesión de desarrollo guiado por pruebas. Viven en una **suite** aparte —una suite es el
> conjunto de pruebas que se ejecutan juntas con un solo comando— y corren con su propio
> **ejecutor**, el programa que encuentra las pruebas, las corre y resume el resultado. La suite de
> `pytest`, la herramienta que ejecuta las pruebas de Python del proyecto, no cambia.

## Punto de partida: un contrato es un acuerdo entre programas

La sesión de integración estableció que entre dos piezas correctas hay un tercer lugar donde fallar:
el contrato, el acuerdo sobre la forma de lo que entra y lo que sale. Las pruebas de ese nivel
comprueban que ese acuerdo se respeta, y lo hacen desde el único lugar donde tiene sentido hacerlo:
otro programa, que envía una solicitud y lee la respuesta campo por campo.

Pero el contrato es un acuerdo **entre programas**. Dice que un rechazo se informa con el código 409
y un campo `detail`; no dice qué ve la persona cuando eso ocurre, ni si entiende qué tiene que
cambiar para que su reserva se acepte. Un sistema puede cumplir su contrato al pie de la letra y
dejar a quien lo usa sin saber qué hacer. Ese defecto no es de ninguna pieza ni del acuerdo entre
dos de ellas. Es del sistema completo, visto desde afuera, y por eso solo lo encuentra una prueba que
mira desde afuera.

En este material, una **prueba de extremo a extremo** es la que recorre el sistema completo por donde
lo usa una persona —abre la página, escribe en el formulario, aprieta el botón, lee lo que aparece—
y afirma algo sobre lo que esa persona encontró. No sustituye ninguna pieza: si el sistema tiene una
base de datos, esa base de datos existe; si tiene una API, la página la llama de verdad. Lo que la
distingue de una prueba de integración no es que toque más código, sino **quién está mirando**: ya no
es un programa que lee el contrato, sino alguien que lee una pantalla.

Ese cambio de testigo trae un costo que no existía. Un programa lee una respuesta que ya llegó; una
pantalla muestra una respuesta que todavía está llegando. Todo lo que la sesión enseña sobre la
espera sale de esa diferencia.

El recorrido de trabajo de la sesión es **abrir → esperar → explorar → precisar**. Se abre el sistema
por donde lo usa una persona, se espera lo que la pantalla todavía no muestra en lugar de suponer que
ya está, se explora lo que ninguna prueba escrita de antemano pensó en mirar, y se precisa lo
encontrado hasta convertirlo en algo que una prueba puede comprobar. Ningún hallazgo de esta sesión
se da por bueno porque alguien lo haya visto en pantalla: se da por bueno cuando una prueba lo
reproduce.

---

# BLOQUE 1: El defecto que el contrato no puede tener

- **Duración:** 30 minutos
- **Objetivo del bloque:** leer la primera interfaz del proyecto y escribir sobre ella la primera
  prueba de extremo a extremo, nombrando cada pieza que interviene, y ver ejecutada la clase de
  defecto que ordena la sesión: la API responde exactamente lo que su contrato promete y la persona
  que usa la pantalla igual no puede saber qué corregir. Al finalizar, el estudiante debe poder
  explicar por qué ninguna prueba de los niveles anteriores podía encontrar ese defecto, y distinguir
  una aserción que exige lo que la persona necesita de una que solo excluye una falla ya vista.
- **Modalidad:** exposición con lectura de código y ejecución en vivo sobre el proyecto, y registro
  escrito individual.
- **Ritmo sugerido:** 4 minutos para el estado de la evidencia, 6 para leer la interfaz, 7 para la
  anatomía de la prueba y su primer error, 7 para el defecto y la respuesta de la API, y 6 para lo
  que hace un agente y el ejercicio.

## Desarrollo

### 1.1 Veinte pruebas en verde, y nadie abrió el sistema

El proyecto llega a esta sesión con la suite que dejaron las sesiones anteriores. Ejecutada completa:

```text
....................                                                     [100%]
20 passed in 0.71s
```

Entre esas veinte hay cuatro **pruebas de integración**: pruebas que hacen trabajar juntas a la API
y a la base de datos real y comprueban la respuesta. Para hacerlo usan un **cliente de pruebas**, un
programa que envía solicitudes a la aplicación y lee la respuesta campo por campo. Es la forma
correcta de comprobar un contrato, porque un contrato es un acuerdo entre programas.

Pero ninguna persona usa el sistema así. Una persona abre una página, escribe en un formulario,
aprieta un botón y lee lo que aparece. Nada de eso está en las veinte pruebas. El sistema tiene, a
partir de hoy, algo que una persona puede abrir en un navegador, y nadie ha comprobado todavía que
sirva.

### 1.2 La interfaz, leída

La interfaz se entrega ya escrita: una página servida por la misma aplicación, con un formulario de
reserva a la izquierda y el estado de los ocho bloques del día a la derecha. Son tres archivos: la
página (`index.html`), su aspecto (`estilos.css`) y su comportamiento (`app.js`).

De la página interesa el formulario. Cada campo tiene su **etiqueta** —el texto que la persona lee
al lado— asociada al campo por el atributo `for`:

```html
<form id="formulario">
  <label for="nombre">Nombre</label>
  <input id="nombre" name="nombre" autocomplete="name" />

  <label for="rut">RUT</label>
  <input id="rut" name="rut" placeholder="12.345.678-9" />

  <label for="correo">Correo electrónico</label>
  <input id="correo" name="correo_electronico" type="email" />

  <label for="bloque">Bloque</label>
  <select id="bloque" name="bloque">
    <option value="1">Bloque 1</option>
    <option value="2">Bloque 2</option>
    <option value="3">Bloque 3</option>
    <option value="4">Bloque 4</option>
    <option value="5">Bloque 5</option>
    <option value="6">Bloque 6</option>
    <option value="7">Bloque 7</option>
    <option value="8">Bloque 8</option>
  </select>

  <label for="personas">Personas</label>
  <input id="personas" name="personas" type="number" min="1" max="30" />

  <button type="submit">Reservar</button>
</form>
<p id="mensaje" class="mensaje" role="status" aria-live="polite"></p>
```

El párrafo del final es donde aparecen los mensajes. Su atributo `role="status"` declara para qué
sirve: es una zona de estado, que los lectores de pantalla anuncian cuando cambia.

El comportamiento está completo en este archivo, y conviene leerlo entero porque es corto:

```javascript
const formulario = document.querySelector("#formulario");
const mensaje = document.querySelector("#mensaje");
const grilla = document.querySelector("#bloques");

async function cargarBloques() {
  const respuesta = await fetch("/bloques");
  const { tomados } = await respuesta.json();
  grilla.innerHTML = "";
  for (let bloque = 1; bloque <= 8; bloque++) {
    const tomado = tomados.includes(bloque);
    const ficha = document.createElement("li");
    ficha.className = tomado ? "ficha tomada" : "ficha libre";
    ficha.innerHTML = `<span>Bloque ${bloque}</span><span class="estado">${tomado ? "Tomado" : "Libre"}</span>`;
    grilla.append(ficha);
  }
}

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const datos = Object.fromEntries(new FormData(formulario));

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
});

cargarBloques();
```

Las piezas que hacen trabajo, una por una:

| Pieza | Qué hace |
|---|---|
| `fetch(dirección, opciones)` | Envía una solicitud a la API desde el navegador y devuelve la respuesta cuando llega. |
| `await` | Espera a que termine una operación que toma tiempo, como una solicitud por la red, antes de seguir con la línea siguiente. Solo se puede usar dentro de una función marcada `async`. |
| `new FormData(formulario)` | Reúne los valores que la persona escribió en el formulario, uno por campo. |
| `JSON.stringify(datos)` | Convierte ese objeto en texto con formato JSON, que es la forma en que la API espera recibir el cuerpo de la solicitud. |
| `Object.fromEntries(...)` | Convierte esos valores en un objeto: `{ nombre: "Ana Rivas", personas: "12", ... }`. Todos los valores quedan como **texto**, también los números. |
| `respuesta.ok` | Es verdadero si el **código de estado** —el número con que la API informa qué pasó con la solicitud— indica éxito, y falso si indica un rechazo o un error. |
| `mensaje.textContent = ...` | Pone un texto dentro del párrafo de mensajes, que es lo que la persona lee. |

Que los números viajen como texto no es un problema en sí: la API recibe `"12"` y el modelo que valida
la solicitud lo convierte a número. Esa conversión va a importar en un momento.

### 1.3 La primera prueba de extremo a extremo

**Playwright** es una herramienta que abre un navegador de verdad, lo controla desde un programa y
permite comprobar lo que aparece en la página. Por defecto el navegador corre **sin ventana**
—*headless*, como se lo llama—: carga y dibuja la página igual, pero no la muestra en pantalla, lo
que permite ejecutarlo en cualquier máquina. Las pruebas se escriben en TypeScript, con la misma
forma que el estudiante ya usó en Vitest: una función `test` con un nombre y una función `expect`
para afirmar.

Esta es la primera prueba, la del camino feliz:

```typescript
import { expect, test } from "@playwright/test";

test("una reserva completa se confirma en pantalla", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Nombre").fill("Ana Rivas");
  await page.getByLabel("RUT").fill("11.111.111-1");
  await page.getByLabel("Correo electrónico").fill("ana.rivas@ejemplo.cl");
  await page.getByLabel("Bloque").selectOption("4");
  await page.getByLabel("Personas").fill("12");
  await page.getByRole("button", { name: "Reservar" }).click();

  await expect(page.getByRole("status")).toContainText("Reserva confirmada");
});
```

Toda prueba de extremo a extremo tiene tres clases de piezas, y conviene nombrarlas porque se repiten
en cada línea:

| Clase de pieza | En esta prueba | Qué es |
|---|---|---|
| **Localizador** | `page.getByLabel("Nombre")`, `page.getByRole("button", { name: "Reservar" })` | La forma de encontrar un elemento de la página. |
| **Acción** | `fill`, `selectOption`, `click`, `goto` | Lo que la prueba hace con ese elemento, como lo haría una persona. |
| **Aserción** | `expect(...).toContainText("Reserva confirmada")` | Lo que la prueba afirma sobre lo que quedó en pantalla. |

`page` es la pestaña del navegador que Playwright le entrega a cada prueba, limpia. `goto("/")` abre
la página principal de la aplicación.

**Los localizadores buscan lo que una persona percibe.** `getByLabel("Nombre")` busca el campo cuya
etiqueta dice «Nombre». `getByRole("button", { name: "Reservar" })` busca un botón que dice
«Reservar». El **rol** es lo que un elemento *es* para quien usa la página —un botón, una lista, una
zona de estado—, y es lo mismo que un lector de pantalla le anuncia a una persona ciega. La otra
forma posible sería buscar por la estructura interna del documento —«el tercer `input` del
formulario»—, y es frágil por una razón concreta: esa estructura cambia cada vez que alguien
rediseña la página, aunque la persona siga viendo exactamente lo mismo. Si una prueba no encuentra el
botón «Reservar», es probable que una persona tampoco lo encuentre.

**El primer error de la sesión no fue del sistema.** Ejecutada tal como está escrita, la prueba
falla antes de llegar a la aserción:

```text
Error: locator.selectOption: Error: strict mode violation: getByLabel('Bloque') resolved to 2 elements:
    1) <select id="bloque" name="bloque">…</select> aka getByLabel('Bloque', { exact: true })
    2) <ul id="bloques" class="grilla" aria-label="Estado de los bloques">…</ul>
```

`getByLabel` compara por **fragmento**, sin distinguir mayúsculas: «Bloque» aparece en la etiqueta del
selector y también en «Estado de los bloques», el nombre que la página le da a la lista de la
derecha. Hay dos candidatos, y Playwright **se niega a elegir**. A eso se le llama *strict mode*: si
un localizador encuentra más de un elemento, la acción falla en lugar de usar el primero. Es una
decisión de diseño deliberada y conviene agradecerla, porque una prueba que elige al azar entre dos
elementos pasa hoy y falla el día que cambia el orden de la página.

La propia herramienta sugiere la corrección, y es exigir la coincidencia completa:

```typescript
await page.getByLabel("Bloque", { exact: true }).selectOption("4");
```

Con eso la prueba pasa. Y el resultado ya dice algo que las veinte pruebas anteriores no podían
decir: una persona que llena el formulario completo logra reservar.

### 1.4 El defecto que el contrato no puede tener

La segunda prueba mira el caso incómodo. Una persona llena todo menos la cantidad de personas y
aprieta «Reservar». Lo que necesita es que la pantalla le diga qué le falta:

```typescript
test("si falta un dato, la pantalla dice cuál corregir", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Nombre").fill("Ana Rivas");
  await page.getByLabel("RUT").fill("11.111.111-1");
  await page.getByLabel("Correo electrónico").fill("ana.rivas@ejemplo.cl");
  await page.getByLabel("Bloque", { exact: true }).selectOption("5");
  await page.getByRole("button", { name: "Reservar" }).click();

  await expect(page.getByRole("status")).toContainText("Personas");
});
```

El resultado:

```text
Error: expect(locator).toContainText(expected) failed

Locator: getByRole('status')
Expected substring: "Personas"
Received string:    "[object Object]"

1 failed, 1 passed (8.9s)
```

Donde la persona esperaba leer qué corregir, la pantalla dice **`[object Object]`**. Esa es la forma en
que JavaScript escribe un objeto cuando se le pide convertirlo en texto sin decirle cómo: no muestra
su contenido, muestra la etiqueta genérica «objeto».

Ahora hay que mirar qué respondió la API en ese mismo momento, porque ahí está la lección del
bloque. La misma solicitud, enviada con el cliente de pruebas:

```text
422
{
  "detail": [
    {
      "type": "int_parsing",
      "loc": ["body", "personas"],
      "msg": "Input should be a valid integer, unable to parse string as an integer",
      "input": ""
    }
  ]
}
```

El `422` es el código con el que una API informa que el cuerpo de la solicitud no tiene la forma
esperada. El campo vacío llegó como texto vacío, el modelo que valida la solicitud no pudo
convertirlo a número, y la API respondió **exactamente lo que su contrato promete**: el código
correcto y una lista de errores, cada uno con su tipo, su mensaje y —en `loc`, de *location*— el
lugar exacto del problema: el campo `personas` del cuerpo.

La información que la persona necesitaba **llegó a la página**. La página la tiró. La línea
responsable es esta:

```javascript
mensaje.textContent = cuerpo.detail;
```

Quien la escribió probó con un rechazo de reserva, donde `detail` es un texto —«La sala no tiene ese
cupo»— y funciona. Pero en un error de validación `detail` no es un texto, es una **lista de
objetos**, y al ponerla dentro del párrafo se convierte en `[object Object]`.

Y las veinte pruebas siguen pasando:

```text
20 passed in 0.71s
```

Porque tienen razón: la API cumple su contrato. El defecto no está en la API, ni en la base de datos,
ni en el acuerdo entre las dos. Está entre lo que la API responde y lo que la persona ve. La sesión
de la Unidad 1 sobre calidad del producto ya había escrito este riesgo, casi palabra por palabra,
para la **capacidad de interacción**: que ante una entrada inválida la persona reciba un error *sin
comprender qué debe corregir*. Hoy dejó de ser un riesgo escrito: es una salida de ejecución.

### 1.5 Por qué ningún nivel anterior podía encontrarlo

La sesión de integración estableció que lo que distingue un nivel de prueba es **qué deja de
sustituir**. Aplicado aquí, la respuesta es precisa:

| Nivel | Qué ejecuta de verdad | ¿Ejecuta `app.js`? |
|---|---|---|
| Unitaria | Una función de reglas, sola | No |
| Integración | La API y la base de datos, llamadas por un cliente de pruebas | No: el cliente de pruebas **es** un programa, y ocupa el lugar de la página |
| Extremo a extremo | La página, en un navegador, llamando a la API real | **Sí** |

El cliente de pruebas de la integración no es un sustituto cualquiera: sustituye justamente a la
página. Por eso, en ese nivel, el código que convierte la respuesta en un mensaje nunca corre.

Conviene ser honesto con un matiz. Una prueba unitaria escrita directamente sobre `app.js` también
podría haberlo encontrado, pero solo si quien la escribe le pasa una respuesta con `detail` como
lista. Es decir: solo si ya sabe que los errores de validación tienen esa forma, que es exactamente
lo que no sabía quien escribió la página. La prueba de extremo a extremo no necesitó saberlo. No
imaginó ninguna respuesta: preguntó lo que una persona pregunta —¿la pantalla me dice qué corregir?—
y dejó que el sistema completo respondiera.

### 1.6 Lo que hace un agente con esto

Vale la pena pedirle la misma prueba a un agente, con acceso solo de lectura sobre el proyecto y sin
mostrarle la prueba anterior:

```bash
claude -p "Escribe una prueba de Playwright en TypeScript para el caso en que el usuario
llena el formulario de reserva pero deja vacio el campo Personas. La configuracion ya esta
en e2e/playwright.config.ts. Devuelve solo el archivo de prueba, sin explicaciones." \
  --allowed-tools "Read,Glob,Grep"
```

La herramienta se invoca desde la terminal; `-p` le entrega una instrucción y devuelve su respuesta
sin abrir una conversación, y `--allowed-tools` le permite solo leer archivos, buscarlos por nombre y
buscar texto dentro de ellos.

Encontró el defecto. Leyendo `app.js` razonó que la respuesta sería un 422 con `detail` como lista y
lo escribió sin que se lo pidieran: *«con el código actual, la aserción va a fallar: al dejar
Personas vacío, el servidor responde 422 y `detail` es un arreglo, que `app.js` muestra tal cual. Es
un defecto real de la aplicación, no de la prueba»*. Además anticipó el problema del localizador
ambiguo y usó `exact: true` sin haberlo visto fallar. Y declaró que no había podido ejecutar su
prueba. Es un buen resultado, y hay que decirlo así.

El detalle que importa está en sus aserciones sobre el mensaje:

```typescript
const mensaje = page.getByRole("status");
await expect(mensaje).toHaveClass(/error/);
await expect(mensaje).not.toBeEmpty();
await expect(mensaje).not.toContainText("Reserva confirmada");
await expect(mensaje).not.toContainText("[object Object]");
```

Las cuatro son **negativas o de forma**: que el mensaje tenga aspecto de error, que no esté vacío, que
no confirme la reserva y que no diga `[object Object]`. Ninguna exige lo que la persona necesita, que
es saber qué campo corregir.

Eso se puede poner a prueba. Se aplica la corrección más habitual —mostrar el mensaje del primer error
de la lista— y se ejecutan las pruebas:

```javascript
mensaje.textContent = Array.isArray(cuerpo.detail) ? cuerpo.detail[0].msg : cuerpo.detail;
```

```text
  ok 1 pruebas\agente.spec.ts › no se confirma la reserva si el campo Personas queda vacio
  ok 2 pruebas\reserva.spec.ts › una reserva completa se confirma en pantalla
  x  3 pruebas\reserva.spec.ts › si falta un dato, la pantalla dice cuál corregir

Expected substring: "Personas"
Received string:    "Input should be a valid integer, unable to parse string as an integer"
```

`Array.isArray` pregunta si un valor es una lista, y `[0].msg` toma el mensaje del primer error. Con
esa corrección **la prueba del agente pasa**, y la persona ahora lee un mensaje técnico, en inglés,
que no nombra ningún campo. Sigue sin saber qué corregir.

De ahí sale la distinción que el bloque deja instalada:

> Una **aserción negativa** excluye una falla que alguien ya vio. Una **aserción positiva** exige la
> conducta que la persona necesita. La primera deja pasar cualquier falla distinta de la que
> excluye.

El agente escribió la prueba contra el defecto que encontró en el código. Lo que no podía saber
leyendo el código es qué necesita la persona que usa la pantalla, porque eso no está escrito en
ningún archivo del proyecto. Esa es la parte que sigue siendo de quien diseña la prueba.

## Ejercicio del bloque

Sobre el proyecto propio, el mismo que se entrega como evaluación.

1. **Encuentra un lugar donde tu sistema le muestra un error a una persona.** Una página, una
   pantalla de consola, un mensaje en un formulario. Si tu proyecto no tiene interfaz, elige la
   salida más cercana a una persona que tenga: lo que imprime un comando, lo que devuelve la función
   que está más arriba.
2. **Escribe en dos columnas** qué devuelve internamente tu sistema en ese caso y qué ve la persona.
   Si las dos columnas dicen lo mismo, busca otro caso: el que interesa es donde difieren.
3. **Escribe la aserción que exige lo que la persona necesita**, en una línea y en positivo: no «que
   no diga X», sino «que diga Y». Si es una página, escríbela con Playwright; si no, con la
   herramienta que ya usas.
4. **Escribe al lado una aserción negativa para el mismo caso**, y una corrección defectuosa que la
   haría pasar a ella y no a la positiva.

**Pista:** si en el punto 3 te cuesta escribir el «que diga Y», probablemente es porque tu sistema no
tiene decidido qué debería decirle a la persona. Eso no es un problema de la prueba: es un requisito
que falta, y lo acabas de encontrar.

**Evidencia esperada:** un caso con sus dos columnas diferenciadas, una aserción positiva, una
negativa y una corrección que distinga entre las dos.

## Preguntas guía

1. La API respondió 422 con el campo exacto en `loc`, y la pantalla mostró `[object Object]`. Un
   compañero dice que el defecto es de la API, porque debería devolver un texto simple. ¿Tiene
   razón?

   **Pista:** revisa qué promete el contrato para un error de validación y si la API lo cumplió.
   Después pregúntate qué pieza tenía la información y no la usó.

2. Las veinte pruebas pasaron todo el tiempo, incluidas las cuatro de integración que llaman a la
   API real. ¿Por qué ninguna de ellas podía detectar el `[object Object]`, aunque todas estuvieran
   bien escritas?

   **Pista:** mira la tabla de 1.5 y busca qué pieza ocupa el cliente de pruebas. Pregúntate si
   `app.js` se ejecuta alguna vez durante esas pruebas.

3. La prueba del agente siguió pasando con una corrección que deja a la persona igual de perdida.
   ¿Qué tendría que haber sabido el agente para escribir la aserción positiva, y dónde debería estar
   escrito eso?

   **Pista:** el agente leyó todos los archivos del proyecto. Pregúntate si en alguno dice qué
   mensaje necesita ver una persona cuando falta un dato.

## Fuentes técnicas del bloque

- [Playwright — localizadores](https://playwright.dev/docs/locators) — `getByRole` y `getByLabel` como localizadores recomendados porque reflejan cómo una persona percibe la página, la opción `exact` para exigir coincidencia completa, y el comportamiento por defecto de comparar por fragmento sin distinguir mayúsculas.
- [Playwright — *strictness*](https://playwright.dev/docs/locators#strictness) — el modo estricto: una acción sobre un localizador que resuelve a más de un elemento falla en lugar de elegir uno.
- [Playwright — aserciones](https://playwright.dev/docs/test-assertions) — `toContainText`, `toHaveClass` y `not`, y el comportamiento de las aserciones sobre localizadores, que reintentan hasta cumplirse o agotar el plazo.
- [Playwright — servidor web en las pruebas](https://playwright.dev/docs/test-webserver) — la opción `webServer`, que arranca la aplicación antes de las pruebas y la detiene al terminar.
- [MDN — `Object.prototype.toString()`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object/toString) — por qué un objeto convertido a texto sin indicación produce `[object Object]`; y [MDN — `textContent`](https://developer.mozilla.org/es/docs/Web/API/Node/textContent) y [MDN — `fetch`](https://developer.mozilla.org/es/docs/Web/API/fetch).
- [MDN — rol ARIA `status`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/status_role) — la zona de estado que los lectores de pantalla anuncian cuando cambia su contenido.
- [FastAPI — manejo de errores](https://fastapi.tiangolo.com/tutorial/handling-errors/) — la respuesta `422` con `detail` como lista de errores de validación, cada uno con `type`, `loc`, `msg` e `input`.
- ISO/IEC 25010:2023, tal como se trabajó en la sesión de calidad de producto de la Unidad 1 — la capacidad de interacción y el riesgo de que la persona reciba un error sin comprender qué debe corregir.
- Ejecuciones registradas para esta clase sobre el proyecto de reserva de laboratorio, con Python 3.13.11, FastAPI 0.141.1, Pydantic 2.13.5, uvicorn 0.53.0, Node 24.18.0, TypeScript 7.0.2 y Playwright 1.63.0 con Chromium 153 sin ventana: la suite de `pytest` en `20 passed`, el error de modo estricto del localizador del bloque, la prueba del mensaje con `[object Object]` y `1 failed, 1 passed (8.9s)`, la respuesta `422` de la API citada literalmente, la prueba generada con `claude -p` y herramientas restringidas a lectura, y la ejecución con la corrección habitual en que esa prueba pasa y la positiva falla.

---

# BLOQUE 2: No se espera un tiempo, se espera una condición

- **Duración:** 25 minutos
- **Objetivo del bloque:** entender por qué, en cuanto la prueba mira una pantalla, el valor que
  quiere comprobar puede no existir todavía, y ver ejecutada la consecuencia: la primera prueba del
  módulo que pasa y falla sobre el mismo código sin que nadie lo toque. Al finalizar, el estudiante
  debe poder reconocer una espera fija en una prueba, explicar por qué en su máquina puede pasar
  siempre y en otra fallar a veces, y reemplazarla por una aserción que espera una condición.
- **Modalidad:** exposición con ejecución en vivo repetida sobre el proyecto, y registro escrito
  individual.
- **Ritmo sugerido:** 4 minutos para la diferencia entre un valor que ya está y uno que viene, 5 para
  la prueba con espera fija y su entorno, 4 para las ejecuciones repetidas, 5 para la corrección, 4
  para la evidencia sobre las causas de la inestabilidad, y 3 para lo que hace un agente y el
  ejercicio.

## Desarrollo

### 2.1 Hasta ahora, el valor ya estaba ahí

Todas las aserciones del módulo hasta el bloque anterior compartían una condición que nadie tuvo que
nombrar: **cuando la prueba miraba el valor, el valor ya existía**. Una función devolvía su resultado
y la prueba lo comparaba. El cliente de pruebas enviaba una solicitud, esperaba la respuesta completa
y recién entonces la entregaba. Entre la acción y la comprobación no pasaba nada que la prueba no
controlara.

En una pantalla eso deja de ser cierto. Cuando una persona aprieta «Reservar», la página hace esto,
en este orden:

1. Envía la solicitud de reserva a la API.
2. Espera la respuesta, que llega cuando llega.
3. Muestra el mensaje de confirmación.
4. Pide a la API el estado actualizado de los bloques.
5. Espera esa segunda respuesta.
6. Redibuja la lista de bloques.

A esta forma de trabajar se la llama **asíncrona**: la página no se queda detenida esperando, sigue
funcionando, y cada parte ocurre cuando llega lo que necesita. Para la persona es invisible, porque
todo pasa en décimas de segundo. Para una prueba es decisivo: si mira la lista de bloques justo
después de apretar el botón, puede estar mirando la lista **de antes**.

### 2.2 Una prueba que espera un tiempo

La forma más intuitiva de resolverlo es esperar un rato antes de mirar. Esta prueba reserva el bloque
4 y comprueba que la lista lo muestre tomado, esperando 400 milisegundos antes de leer:

```typescript
test("tras reservar, el bloque 4 aparece tomado · espera fija", async ({ page }) => {
  await reservarBloque4(page);

  await page.waitForTimeout(400);
  const ficha = await page.getByRole("listitem").filter({ hasText: "Bloque 4" }).textContent();
  expect(ficha).toContain("Tomado");
});
```

`reservarBloque4` es una función auxiliar que abre la página, llena el formulario completo con el
bloque 4 y aprieta «Reservar»; está escrita una sola vez para no repetirla en cada prueba. Las piezas
nuevas:

| Pieza | Qué hace |
|---|---|
| `page.waitForTimeout(400)` | Detiene la prueba 400 milisegundos, pase lo que pase en la página. |
| `getByRole("listitem").filter({ hasText: "Bloque 4" })` | Busca, entre los elementos de lista, el que contiene el texto «Bloque 4». |
| `.textContent()` | Lee el texto de ese elemento **una sola vez**, en ese instante, y devuelve lo que haya. |
| `expect(ficha).toContain("Tomado")` | Compara ese texto ya leído. No vuelve a mirar la página. |

Antes de ejecutarla hay que preparar dos condiciones, sin las cuales el resultado no significaría
nada.

**Un mundo limpio antes de cada prueba.** La sesión de integración estableció que el resultado de una
prueba no puede depender de lo que dejó la anterior. Aquí vale lo mismo, con una dificultad nueva: la
aplicación corre en otro proceso, el servidor, así que la prueba no puede tocar su base de datos
directamente. El servidor de pruebas ofrece por eso una ruta que la vacía, y cada prueba la llama
antes de empezar:

```typescript
test.beforeEach(async ({ request }) => {
  await request.post("/_prueba/reiniciar");
});
```

`test.beforeEach` ejecuta esa función antes de cada prueba del archivo, y `request` es un cliente
que Playwright entrega para hablar con la API directamente, sin navegador. La ruta existe solo en el
servidor que arranca para las pruebas; la aplicación real no la tiene.

**Una red que no es instantánea.** En la máquina del laboratorio, la API responde en milisegundos,
porque el servidor está en la misma máquina que el navegador. Una red real, o un servidor de
**integración continua** —el que ejecuta las pruebas automáticamente cada vez que alguien sube un
cambio— ocupado con otras tareas, no responde siempre igual de rápido. Para ver lo que
ocurre en esas condiciones, el servidor de pruebas agrega a cada respuesta una **demora aleatoria**
de hasta 400 milisegundos:

```python
@app.middleware("http")
async def latencia_variable(request: Request, llamar_siguiente):
    if LATENCIA_MAXIMA:
        await asyncio.sleep(random.uniform(0, LATENCIA_MAXIMA))
    return await llamar_siguiente(request)
```

Un *middleware* es una pieza que se ejecuta alrededor de cada solicitud que recibe la aplicación.
Esta espera un tiempo al azar entre cero y el máximo configurado, y recién después deja pasar la
solicitud. Es una simulación declarada, y hay que decirlo así: la demora no es un defecto del sistema,
es la variación normal de cualquier red.

### 2.3 El mismo código, tres resultados distintos

La herramienta permite ejecutar la misma prueba varias veces seguidas con la opción
`--repeat-each`. Diez veces:

```text
  4 failed
  6 passed (31.4s)
```

Otra vez, sin cambiar nada:

```text
  3 failed
  7 passed (30.7s)
```

Y otra:

```text
  5 failed
  5 passed (28.5s)
```

Mismo código, mismo sistema, misma prueba: cuatro, tres y cinco fallas. Cuando falla, dice esto:

```text
Error: expect(received).toContain(expected)

Expected substring: "Tomado"
Received string:    "Bloque 4Libre"
```

`Bloque 4Libre` es el texto de la ficha tal como estaba en ese instante: sus dos partes, «Bloque 4» y
«Libre», leídas juntas. La reserva sí se hizo; la lista todavía no se había redibujado. La prueba miró
antes de tiempo.

A una prueba que da resultados distintos sobre el mismo código, sin que nada cambie, se la llama
**prueba inestable** —en inglés, *flaky test*—. Es la primera del módulo, y aparece justo al llegar
al navegador.

Falta el dato más importante del bloque. La misma prueba, diez veces, **sin la demora**:

```text
  10 passed (21.6s)
```

Diez de diez. En la máquina de quien la escribió, la prueba con espera fija **parece perfecta**. Y va
a empezar a fallar el día que corra en otra máquina más lenta o sobre una red real. Por eso una prueba
inestable casi nunca se detecta al escribirla: se detecta después, cuando ya se confió en ella.

### 2.4 Esperar una condición

La corrección no consiste en esperar más. Consiste en dejar de esperar un tiempo y empezar a esperar
**lo que se quiere comprobar**:

```typescript
test("tras reservar, el bloque 4 aparece tomado · espera una condición", async ({ page }) => {
  await reservarBloque4(page);

  const ficha = page.getByRole("listitem").filter({ hasText: "Bloque 4" });
  await expect(ficha).toContainText("Tomado");
});
```

La diferencia está en dos cosas, y las dos son pequeñas en el código y enormes en el resultado.
Primero, `ficha` ya no es un texto leído: es el **localizador**, la forma de encontrar el elemento.
Segundo, la aserción recibe ese localizador, y una aserción sobre un localizador **reintenta**: vuelve
a buscar el elemento y a comparar su texto una y otra vez, hasta que la condición se cumple o hasta
que se agota un plazo, que por defecto es de cinco segundos.

Con la misma demora aleatoria, diez veces:

```text
  10 passed (32.5s)
```

Esto ya había ocurrido en el bloque anterior sin que se notara. Cuando la prueba del mensaje falló, la
herramienta informó `14 × locator resolved to … [object Object]` y `Timeout: 5000ms`: había vuelto a
mirar catorce veces durante cinco segundos antes de rendirse. Esa es la conducta que corrige la
inestabilidad. Y las acciones hacen algo parecido: `click` espera a que el botón exista, esté visible
y se pueda apretar antes de apretarlo, sin que la prueba tenga que pedirlo.

La documentación de la herramienta es explícita sobre la espera fija:

> "Never wait for timeout in production. Tests that wait for time are inherently flaky. Use Locator
> actions and web assertions that wait automatically."
>
> — Playwright, documentación de `page.waitForTimeout`

En español: *nunca esperes un tiempo fijo en una prueba real. Las pruebas que esperan tiempo son
inestables por naturaleza. Usa las acciones de los localizadores y las aserciones sobre la página,
que esperan solas.*

Y conviene descartar la corrección tentadora antes de que aparezca: subir la espera a dos segundos.
Pasaría más veces, y haría cada ejecución dos segundos más lenta **siempre**, incluso cuando la
respuesta llega en diez milisegundos. Sobre todo, seguiría siendo una apuesta sobre la velocidad de
una máquina que quien escribe la prueba no controla. Esperar una condición no apuesta: termina en
cuanto la condición se cumple, sea a los diez milisegundos o a los tres segundos.

### 2.5 Por qué la inestabilidad nace aquí

Que la primera prueba inestable del módulo aparezca justo al llegar al navegador no es una
coincidencia, y hay evidencia de por qué. El estudio de referencia sobre el tema analizó 201 cambios
que corregían pruebas inestables en 51 proyectos de código abierto de la fundación Apache, y clasificó
por causa los 161 que se podían clasificar:

| Causa | Casos | Proporción |
|---|---|---|
| **Espera asíncrona**: la prueba hace una llamada asíncrona y no espera bien su resultado | 74 de 161 | 45 % |
| Concurrencia: varios hilos de ejecución que interactúan de forma no deseada | 32 de 161 | 20 % |
| Dependencia del orden: el resultado depende de qué pruebas corrieron antes | 19 de 161 | 12 % |

Las tres primeras suman el 77 %. La primera es la de este bloque. La tercera es la que la sesión de
integración mostró con las tres pruebas que pasaban juntas y fallaban por separado.

Dos hallazgos del mismo estudio describen casi literalmente lo que se acaba de ejecutar:

> "F.4 About third of Async Wait flaky tests (34%) use a simple method call with time delays to
> enforce orderings. […] F.8 Many Async Wait flaky tests (54%) are fixed using waitFor."
>
> — Luo, Hariri, Eloussi y Marinov, *An Empirical Analysis of Flaky Tests*, FSE 2014

En español: *cerca de un tercio de las pruebas inestables por espera asíncrona (34 %) usa una simple
llamada con una demora fija para imponer un orden. Muchas de ellas (54 %) se corrigen usando una
espera por condición.* La espera fija es la causa más documentada; esperar una condición, la
corrección más documentada.

Y un tercer hallazgo explica por qué conviene aprenderlo ahora y no después:

> "F.2 Most flaky tests (78%) are flaky the first time they are written."

*La mayoría de las pruebas inestables (78 %) ya lo son la primera vez que se escriben.* No se
estropean con el tiempo: nacen así. Por eso la costumbre que protege es la de escribirlas bien desde
la primera línea.

El costo de una prueba inestable no es que falle: es que **deja de informar**. Si una prueba falla
cuatro de cada diez veces sin motivo, el día que falle por un defecto real nadie lo va a creer, y la
van a volver a ejecutar hasta que pase. Qué hacer con las pruebas inestables que ya existen en una
suite —cómo detectarlas, qué hacer mientras se corrigen— es tema de la sesión de integración
continua.

### 2.6 Lo que hace un agente con esto

Se le pidió a un agente, con acceso solo de lectura, que corrigiera la prueba inestable, dándole el
archivo y el mensaje de error. La corrigió bien: reemplazó la espera fija por una aserción sobre el
localizador y lo explicó en una línea correcta —*«leía el texto una sola vez; ahora vuelve a revisar
hasta que aparece o se acaba el tiempo»*—. Le quedó un detalle: dejó el nombre «espera fija» en una
prueba que ya no espera un tiempo fijo, y un nombre que miente también es un defecto.

Después se le hizo el pedido más realista, sin señalarle ninguna prueba: *«la suite a veces falla en
integración continua y a veces pasa; necesito que pase de forma confiable»*. También acertó, y mejor:
encontró la espera fija, corrigió el nombre, agregó una comprobación de que el reinicio de la base
funcionara, y recomendó algo que conviene subrayar: **mantener la demora simulada**, porque *«sirve
justamente para detectar esperas fijas como esta»*. La ejecución sin demora de 2.3 le da la razón: sin
ella, la prueba defectuosa pasaba diez de diez.

Las dos veces terminó igual: *«no lo he ejecutado»*. Y ahí está lo que no se delega. Una prueba
inestable no se da por corregida porque pase una vez, porque la original también pasaba entre cinco y
siete de cada diez. Se da por corregida cuando se ejecuta muchas veces, en las condiciones donde fallaba, y no falla
ninguna. La corrección del agente, ejecutada diez veces con la demora activa:

```text
  10 passed (32.3s)
```

Es la misma regla que el módulo aplicó a los mutantes —las alteraciones deliberadas del código que se
hacen para ver si una prueba las detecta—: una afirmación sobre una prueba no se cree, se comprueba
ejecutando.

## Ejercicio del bloque

Sobre el proyecto propio, el mismo que se entrega como evaluación.

1. **Busca esperas fijas en tu suite.** En TypeScript, `waitForTimeout` o `setTimeout`; en Python,
   `time.sleep`. Anota cuántas hay y en qué pruebas. Si no hay ninguna, anota cuál de tus pruebas
   mira algo que llega después de una acción: una respuesta, un archivo que se escribe, una tarea en
   segundo plano.
2. **Ejecuta una de tus pruebas diez veces seguidas.** Con Playwright, `--repeat-each=10`; con
   `pytest`, repítela en un ciclo desde la terminal. Anota el resultado literal.
3. **Reemplaza una espera fija por una condición**, o, si no tenías ninguna, escribe en una línea qué
   condición esperaría tu prueba si la acción que comprueba tardara.
4. **Ejecuta otra vez diez veces** y compara los dos resultados.

**Pista:** si todas tus pruebas pasan diez de diez, no concluyas todavía que no hay inestabilidad.
Pregúntate en qué se diferencia tu máquina del lugar donde van a correr en integración continua, y
qué pasaría con cada espera si todo tardara el doble.

**Evidencia esperada:** el inventario de esperas fijas, dos ejecuciones de diez con su salida literal,
y una espera reemplazada por una condición o la condición escrita.

## Preguntas guía

1. La prueba con espera fija pasa diez de diez en tu máquina. Un compañero concluye que está bien
   escrita y que el problema es del servidor de integración continua, que es lento. ¿Tiene razón?

   **Pista:** mira qué le pasó a la misma prueba cuando las respuestas tardaron distinto. Pregúntate
   quién garantiza que la red siempre va a ser tan rápida como en tu máquina.

2. Otro compañero sube la espera de 400 a 2.000 milisegundos y la prueba pasa diez de diez con la
   demora activa. ¿La arregló?

   **Pista:** calcula cuánto tarda cada ejecución ahora, incluso cuando la respuesta llega en diez
   milisegundos. Después pregúntate qué pasa el día que una respuesta tarde tres segundos.

3. El agente corrigió la prueba y declaró que no la había ejecutado. ¿Cuántas ejecuciones en verde
   necesitas para creer que la corrección funciona, y en qué condiciones tienen que ocurrir?

   **Pista:** la prueba original, la defectuosa, pasaba entre cinco y siete de cada diez veces, y diez
   de diez sin la demora. Pregúntate qué habría demostrado una sola ejecución en verde.

## Fuentes técnicas del bloque

- [Playwright — `page.waitForTimeout`](https://playwright.dev/docs/api/class-page#page-wait-for-timeout) — marcado como desaconsejado, con la advertencia citada literalmente: las pruebas que esperan tiempo son inestables por naturaleza, y se deben usar acciones de los localizadores y aserciones que esperan solas.
- [Playwright — aserciones](https://playwright.dev/docs/test-assertions) — las aserciones sobre localizadores, que reintentan hasta cumplirse, y su plazo por defecto de cinco segundos.
- [Playwright — accionabilidad](https://playwright.dev/docs/actionability) — las comprobaciones que hace una acción como `click` antes de ejecutarse: que el elemento exista, esté visible, estable y habilitado.
- [Playwright — línea de comandos](https://playwright.dev/docs/test-cli) — la opción `--repeat-each`, que ejecuta cada prueba varias veces seguidas.
- [Playwright — pruebas de API](https://playwright.dev/docs/api-testing) — el cliente `request`, que habla con la API sin navegador, usado aquí para vaciar la base antes de cada prueba.
- [Qingzhou Luo, Farah Hariri, Lamyaa Eloussi y Darko Marinov — *An Empirical Analysis of Flaky Tests*, FSE 2014, DOI 10.1145/2635868.2635920](http://mir.cs.illinois.edu/marinov/publications/LuoETAL14FlakyTestsAnalysis.pdf) — 201 cambios que corrigen pruebas inestables en 51 proyectos de la fundación Apache; la clasificación por causa de 161 de ellos, con la espera asíncrona en 74 casos (45 %), la concurrencia en 32 (20 %) y la dependencia del orden en 19 (12 %); y los hallazgos F.2, F.4 y F.8 citados literalmente.
- [FastAPI — *middleware*](https://fastapi.tiangolo.com/tutorial/middleware/) — la pieza que se ejecuta alrededor de cada solicitud, usada aquí para simular la demora de una red.
- Ejecuciones registradas para esta clase sobre el proyecto de reserva de laboratorio, con Playwright 1.63.0 y Chromium 153 sin ventana, y una demora simulada de hasta 400 ms por respuesta: la prueba con espera fija en tres tandas de diez ejecuciones con 4, 3 y 5 fallas, y en una tanda sin demora con `10 passed`; su mensaje de falla literal; la prueba que espera una condición con `10 passed` bajo demora; las dos correcciones propuestas por `claude -p` con herramientas restringidas a lectura, y la segunda ejecutada diez veces con `10 passed`.

---

# BLOQUE 3: Probar lo que nadie pensó en escribir

- **Duración:** 30 minutos
- **Objetivo del bloque:** establecer qué es la prueba exploratoria y qué clase de cosa es según las
  dos fuentes de referencia del módulo, conducir una sesión con el método que la vuelve auditable, y
  evaluar con ese mismo método el recorrido de un agente que usa la interfaz como quien entra por
  primera vez. Al finalizar, el estudiante debe poder escribir una carta de sesión, registrar sus
  hallazgos, y separar los que se confirman mirando la pantalla de los que exigen conocer el
  requisito y de los que resultan falsos al reproducirlos.
- **Modalidad:** exposición con ejecución en vivo, lectura de un registro de sesión producido por un
  agente, y verificación de sus hallazgos.
- **Ritmo sugerido:** 4 minutos para el límite de las pruebas escritas de antemano, 6 para las dos
  fuentes, 6 para la sesión con carta, 5 para el recorrido del agente, 6 para la verificación de sus
  hallazgos, y 3 para la conclusión y el ejercicio.

## Desarrollo

### 3.1 Lo que una prueba escrita de antemano no puede ver

Todas las pruebas del módulo hasta aquí se escribieron **antes de ejecutarse**. Alguien pensó un caso
—el bloque 0, el campo vacío, la reserva repetida—, escribió qué debía ocurrir y después lo comprobó.
Es la forma correcta de fijar lo que el sistema promete, y tiene un límite que no depende de lo bien
que se haga: una prueba escrita de antemano solo comprueba lo que a alguien se le ocurrió comprobar.

Los defectos que nadie imaginó no quedan en rojo: quedan afuera. Y en una interfaz son muchos, porque
una persona hace cosas que quien escribe las pruebas no suele hacer: se equivoca de campo, aprieta el
botón dos veces, deja algo a medias, vuelve a intentar con el mensaje anterior todavía en pantalla.

### 3.2 Qué es la prueba exploratoria, según las dos fuentes

El programa de ISTQB la define así:

> "In exploratory testing, tests are simultaneously designed, executed, and evaluated while the
> tester learns about the test object."
>
> — ISTQB Certified Tester Foundation Level Syllabus v4.0.1, sección 4.4.2

En español: *en la prueba exploratoria, las pruebas se diseñan, ejecutan y evalúan simultáneamente,
mientras quien prueba aprende sobre el objeto de prueba.* La diferencia con todo lo anterior está en
la palabra *simultáneamente*: no hay una lista de casos escrita antes. Cada prueba sale de lo que la
anterior mostró.

Eso no significa probar al azar. La misma sección describe la forma de darle estructura, que se llama
**prueba por sesiones**:

> "Exploratory testing is sometimes performed using session-based testing to structure the testing.
> In a session-based approach, exploratory testing is performed within a defined time box. The
> tester uses a test charter containing test objectives to guide the testing. The test session is
> usually followed by a debriefing […]. The tester may use test session sheets to document the steps
> followed and the discoveries made."

En español: *la prueba exploratoria a veces se estructura mediante sesiones. En ese enfoque se realiza
dentro de un tiempo acotado, quien prueba se guía por una carta con objetivos de prueba, la sesión
suele terminar con una reunión posterior, y los pasos seguidos y lo descubierto se documentan en
hojas de sesión.* Las cuatro piezas, fijadas antes de usarlas:

| Pieza | Qué es |
|---|---|
| **Carta de sesión** (*test charter*) | Una o dos líneas que dicen qué se explora y para qué. Dirige la sesión sin convertirla en un guion. |
| **Tiempo acotado** (*time box*) | Un límite fijado de antemano. Evita que la exploración se extienda sin fin y permite comparar sesiones. |
| **Registro de sesión** (*session sheet*) | Lo que se probó, lo que apareció en pantalla y lo que se encontró. Es lo que vuelve auditable una exploración. |
| **Reunión posterior** (*debriefing*) | La conversación con quien tiene interés en el resultado, donde se decide qué hallazgo es un defecto. |

Según el propio sitio de James Bach, el método lo desarrollaron él y su hermano Jonathan en
Hewlett-Packard.

**La norma ISO no lo clasifica igual.** La parte 4 de ISO/IEC/IEEE 29119 contiene las técnicas de
diseño de casos, y en su cláusula de técnicas basadas en la experiencia, la 5.4, trae una sola: la
adivinación de errores (*error guessing*), que consiste en anticipar por experiencia dónde suelen
equivocarse los programas y diseñar casos para esos lugares. Sobre la exploratoria dice esto:

> "Experience-based testing practices like exploratory testing and other test practices such as
> model-based testing are not defined in this document because this document only describes
> techniques for designing test cases. Test practices such as exploratory testing, which can use the
> test techniques defined in this document, are described in ISO/IEC/IEEE 29119-1."
>
> — ISO/IEC/IEEE 29119-4:2021, introducción

En español: *las prácticas de prueba basadas en la experiencia, como la prueba exploratoria, no se
definen en este documento, porque este documento solo describe técnicas para diseñar casos de
prueba. Las prácticas como la prueba exploratoria, que pueden usar las técnicas definidas aquí, se
describen en la parte 1.*

Para ISTQB es una **técnica**; para ISO es una **práctica**. No es una discusión de nombres, y conviene
entender por qué, porque dice algo sobre lo que es:

| | Técnica | Práctica |
|---|---|---|
| Qué produce | Casos de prueba, derivados con un procedimiento | Una forma de organizar el trabajo |
| Ejemplo del módulo | Partición de equivalencia, valores límite, tablas de decisión | La prueba exploratoria, el desarrollo guiado por pruebas |
| Relación entre ambas | — | Una práctica puede **usar** técnicas adentro |

La lectura de ISO describe mejor lo que ocurre en una sesión real: quien explora usa valores límite
cuando prueba 30 y 31 personas, y usa partición cuando prueba un RUT sin formato. La exploración no
reemplaza a las técnicas; decide cuándo aplicar cuál, sobre la marcha. Las dos fuentes coinciden en lo
que importa para trabajar: se diseña, se ejecuta y se evalúa a la vez, y se registra.

### 3.3 Una sesión con carta

La sesión que se condujo sobre el proyecto tuvo esta carta:

> **Carta:** explorar la reserva de un bloque con datos incompletos, inválidos o repetidos, para
> encontrar situaciones en que una persona no logre reservar o no entienda qué pasó.
> **Tiempo:** 20 minutos.

Este es su registro, con lo que apareció literalmente en pantalla:

| # | Qué se probó | Qué apareció en pantalla |
|---|---|---|
| 1 | Todo completo menos el nombre | `Reserva confirmada.  \| 11.111.111-1 \| ana.rivas@ejemplo.cl \| bloque 4` |
| 2 | Reservar un bloque ya tomado | `La reserva no esta permitida` |
| 3 | 0 personas | El formulario no se envía. El navegador muestra: `Value must be greater than or equal to 1.` |
| 4 | 31 personas | El formulario no se envía. El navegador muestra: `Value must be less than or equal to 30.` |
| 5 | Doble clic rápido en «Reservar» | La ficha del bloque queda `Tomado` y el mensaje final dice `La reserva no esta permitida` |
| 6 | RUT escrito como `hola` | `Reserva confirmada. Ana Rivas \| hola \| ana.rivas@ejemplo.cl \| bloque 4` |

La prueba 5 es el hallazgo de la sesión, y nadie la habría escrito como caso de antemano. El doble clic
envía dos solicitudes: la primera reserva el bloque y la segunda choca con esa misma reserva. La página
muestra la respuesta que llega al último, que es el rechazo. **La persona reservó y la pantalla le dice
que no pudo.** Repetida diez veces, el mensaje final fue el rechazo las diez.

En las pruebas 3 y 4 el formulario nunca llega a la API: lo detiene la **validación nativa** del
navegador, que revisa los atributos `min` y `max` del campo antes de enviar y muestra un globo sobre él.
El globo aparece en inglés porque el navegador de las pruebas está configurado en inglés; en el de una
persona configurado en español aparecería en español. Es el primer ejemplo de algo que parece un
defecto y depende de quién mira.

Y el registro deja además una observación que no es de usabilidad: la confirmación muestra **el RUT y
el correo completos** en pantalla. Es el mismo hallazgo que la Unidad 1 encontró en el listado del
sistema de notas, ahora en otra pieza. Si es aceptable o no, lo decide la finalidad escrita en el
requisito, no la sesión.

### 3.4 Un agente que entra por primera vez

El cronograma propone un uso preciso: el agente como **usuario que entra por primera vez**. La
condición que lo define es lo que el agente *no* tiene. En los experimentos de los bloques anteriores,
el agente leía el código. Aquí no: se le conectó una herramienta que le permite manejar un navegador
—abrir la página, escribir, hacer clic y leer lo que aparece— y **no se le dio acceso a ningún archivo
del proyecto**. Ve el sistema como lo vería una persona que llega sin saber nada.

```bash
claude -p "Eres una persona que usa este sistema por primera vez. No tienes acceso al codigo,
solo a un navegador. Abre http://127.0.0.1:8000.

Carta de la sesion: explorar la reserva de un bloque del laboratorio, con el objetivo de
encontrar situaciones en que una persona no logre reservar, o no entienda que paso. Tienes un
maximo de 30 acciones en el navegador.

Al terminar entrega un registro de la sesion: que probaste, que observaste literalmente en
pantalla, y para cada hallazgo di si lo consideras un defecto o una duda que alguien con el
requisito deberia resolver." --mcp-config mcp.json --allowed-tools "mcp__navegador__*"
```

`--mcp-config` le conecta la herramienta del navegador, que está descrita en el archivo `mcp.json`, y
`--allowed-tools "mcp__navegador__*"` le permite usar solo esa herramienta. El tiempo acotado de una
persona se tradujo, para el agente, en un presupuesto de acciones: treinta.

Devolvió un registro de sesión con seis pruebas y nueve hallazgos, cada uno clasificado. Usó 29 de las
30 acciones y declaró que cuatro se le fueron en errores propios al apuntar a elementos de la
pantalla. Estos son sus hallazgos, en sus palabras:

| # | Hallazgo del agente | Cómo lo clasificó |
|---|---|---|
| 1 | Con el formulario vacío sale `[object Object]` | Defecto |
| 2 | «La reserva no esta permitida» no dice por qué, y es **el mismo texto cuando el bloque está tomado y cuando son demasiadas personas** (probó con 50) | Defecto |
| 3 | El límite de personas no aparece en ninguna parte | Duda |
| 4 | La lista de bloques deja elegir bloques ya tomados | Duda que roza el defecto |
| 5 | Se acepta cualquier dígito verificador del RUT, y el RUT de ejemplo `12.345.678-9` tiene el dígito equivocado: el correcto es 5 | Duda |
| 6 | La confirmación no muestra la cantidad de personas | Duda |
| 7 | Los bloques no muestran horario ni fecha | Duda |
| 8 | El mensaje no cambia entre dos intentos seguidos | Defecto menor |
| 9 | La consola del navegador marcó tres errores | Observación técnica |

Varios de estos hallazgos no estaban en la sesión anterior. El 4, el 5 y el 7 son observaciones
válidas que nadie había hecho: el agente calculó el dígito verificador del RUT de ejemplo y tiene
razón, el correcto es 5. En amplitud y velocidad, el recorrido es bueno.

### 3.5 Separar lo que se confirma de lo que no

Un hallazgo de exploración no es todavía un defecto: es una **hipótesis sobre el sistema**, y se trata
como tal. Se tomó cada uno y se intentó reproducir.

El hallazgo 2 llamaba la atención por una razón concreta: en la sesión anterior, con 31 personas, el
formulario ni siquiera se había enviado. Se reprodujo exactamente la secuencia del agente —primero un
bloque tomado, después el bloque 2 con 50 personas— observando además la red:

```text
[mensaje en pantalla] La reserva no esta permitida
[solicitudes enviadas por el segundo intento] 0
[validación nativa del campo] Value must be less than or equal to 30.
[la API, si recibiera 50 personas] 409 {"detail":"La sala no tiene ese cupo"}
```

El segundo intento **no envió ninguna solicitud**. La validación nativa del navegador lo detuvo, y el
mensaje que el agente leyó era **el del intento anterior**, que seguía en pantalla. Si la solicitud
hubiera llegado, la API habría respondido otro texto: «La sala no tiene ese cupo». La mitad del
hallazgo 2 es cierta —el rechazo por bloque tomado no dice por qué—, y la otra mitad es **falsa**: el
sistema no usa el mismo mensaje para las dos situaciones. El agente lo afirmó con la misma seguridad
que el resto, y el globo de validación que detuvo el envío no aparece en ningún lugar de su registro.

Lo más instructivo es que el hallazgo 8 era la causa real del error del 2: el mensaje no cambia entre
intentos porque, cuando el navegador bloquea el envío, la página no borra el mensaje anterior. El
agente vio el síntoma y no lo conectó con su propia conclusión.

Con todos los hallazgos reproducidos, el registro queda así:

| # | Veredicto | Por qué |
|---|---|---|
| 1 | **Confirmado** | Es el defecto del bloque 1. |
| 2 | **Mitad confirmado, mitad falso** | El mensaje no dice por qué; pero con 50 personas no hubo solicitud. |
| 3 | **Exige el requisito** | El límite existe en el código, pero si debe mostrarse lo decide quien define el producto. |
| 4 | **Confirmado** | La lista ofrece bloques que la grilla muestra tomados. |
| 5 | **Exige el requisito** | Validar el dígito verificador es una regla que el requisito tiene que declarar. |
| 6 | **Exige el requisito** | Qué debe mostrar una confirmación lo decide el requisito. |
| 7 | **Exige el requisito** | Y apunta a algo más serio: la tabla de reservas no guarda fecha. |
| 8 | **Confirmado** | Y es la causa del error del hallazgo 2. |
| 9 | **No es defecto** | Es el navegador registrando las respuestas `409` y `422` como errores de carga. |

Y el cruce con la sesión con carta completa la lectura. El agente **no encontró** el doble clic, que es
el defecto más grave de los dos registros: no lo intentó. Tampoco señaló el RUT completo en la
confirmación, aunque lo leyó y lo copió en su tabla. Y la sesión con carta no había visto los
hallazgos 4, 5 y 7.

### 3.6 Testigo, no juez

De la comparación sale una forma de trabajo que no depende de si el agente es mejor o peor que una
persona:

> Un hallazgo de exploración es una hipótesis. Se vuelve un defecto cuando se reproduce, y se vuelve un
> requisito cuando alguien con autoridad sobre el producto decide que el sistema debería comportarse
> de otra forma.

El agente es un **testigo** rápido y amplio: recorre en minutos lo que a una persona le toma una
sesión, y ve cosas que quien conoce el sistema ya dejó de ver. No es un **juez**: afirma con la misma
seguridad lo que observó y lo que dedujo, y su forma de ver la página no es idéntica a la de una
persona. Separar una cosa de la otra es el trabajo que la reunión posterior de la sesión existe para
hacer, y sigue siendo de quien conoce el requisito.

Queda una pregunta abierta para el bloque siguiente. Cinco de los hallazgos confirmados son defectos
de lo que la persona ve y entiende. Ninguno se puede probar todavía, porque nadie escribió qué debería
ver. «El mensaje no dice por qué» es una observación; para convertirla en una prueba que falle hay que
decir qué es un mensaje que sí lo dice.

## Ejercicio del bloque

Sobre el proyecto propio, el mismo que se entrega como evaluación.

1. **Escribe una carta de sesión** de dos líneas para tu sistema: qué vas a explorar y para qué.
   Fíjate un tiempo de 10 minutos.
2. **Explora durante ese tiempo** y registra cada prueba en una tabla de tres columnas: qué probaste,
   qué apareció literalmente y qué te pareció.
3. **Clasifica cada hallazgo** en una de tres categorías: confirmado, exige el requisito, o falso al
   reproducirlo. Para clasificar uno como confirmado tienes que haberlo reproducido al menos una vez
   más.
4. **Elige un hallazgo confirmado** y escribe en una línea qué debería ver la persona en lugar de lo
   que vio. Esa línea es la entrada del bloque siguiente.

**Pista:** si en 10 minutos no encontraste nada, revisa la carta: probablemente describe lo que el
sistema hace bien, no dónde podría fallar. Una carta útil nombra una situación incómoda —datos
incompletos, repetidos, fuera de rango, una acción hecha dos veces—, no una función.

**Evidencia esperada:** una carta con su tiempo, un registro de al menos cinco pruebas con lo que
apareció literalmente, una clasificación con al menos un hallazgo reproducido, y la línea del punto 4.

## Preguntas guía

1. Para ISTQB la prueba exploratoria es una técnica y para ISO es una práctica. Si en la sesión con
   carta se usaron valores límite al probar 30 y 31 personas, ¿cuál de las dos clasificaciones
   describe mejor lo que ocurrió?

   **Pista:** revisa qué produce una técnica y qué organiza una práctica. Pregúntate si los valores
   límite los aportó la exploración o los usó.

2. El agente afirmó que el sistema usa el mismo mensaje para un bloque tomado y para demasiadas
   personas, y al reproducirlo resultó falso. ¿Qué habría tenido que hacer el agente para no
   equivocarse, y por qué no basta con pedirle que tenga más cuidado?

   **Pista:** mira cuántas solicitudes envió el segundo intento. Pregúntate qué necesitaba observar
   para saberlo, y si lo que vio en pantalla alcanzaba.

3. El agente encontró tres hallazgos que la sesión con carta no vio, y la sesión encontró el defecto
   más grave, que el agente no intentó. Si tuvieras que explorar tu propio sistema con veinte minutos,
   ¿cómo repartirías el trabajo entre ti y un agente?

   **Pista:** compara qué aporta cada uno en amplitud, en profundidad y en capacidad de reproducir.
   Pregúntate quién decide al final qué es un defecto.

## Fuentes técnicas del bloque

- [ISTQB Certified Tester Foundation Level Syllabus v4.0.1, 15 de septiembre de 2024](https://astqb.org/assets/documents/ISTQB_CTFL_Syllabus_v4.0.1.pdf) — sección 4.4.2 *Exploratory Testing*, citada literalmente: el diseño, la ejecución y la evaluación simultáneos, y la prueba por sesiones con tiempo acotado, carta de sesión, reunión posterior y hojas de sesión.
- [ISO/IEC/IEEE 29119-4:2021 — *Test techniques*](https://www.iso.org/standard/79430.html) — la introducción citada literalmente, que excluye la prueba exploratoria de las técnicas y la clasifica como práctica descrita en la parte 1; y la cláusula 5.4, cuya única técnica basada en la experiencia es la adivinación de errores.
- [ISO/IEC/IEEE 29119-1:2022 — *General concepts*](https://www.iso.org/standard/81291.html) — la parte que, según la parte 4, describe las prácticas de prueba como la exploratoria.
- [James Bach — *Session-Based Test Management*](https://www.satisfice.com/download/session-based-test-management) — la página donde el autor atribuye el método a él y a su hermano Jonathan, a partir del proceso que desarrollaron en Hewlett-Packard.
- [Playwright MCP](https://github.com/microsoft/playwright-mcp) — la herramienta que permite a un agente manejar un navegador leyendo la página, usada aquí para el recorrido sin acceso al código.
- [MDN — validación de restricciones de formularios](https://developer.mozilla.org/es/docs/Web/HTML/Constraint_validation) — la validación nativa del navegador, que revisa atributos como `min` y `max` antes de enviar un formulario y muestra su mensaje en el idioma del navegador.
- Ejecuciones registradas para esta clase sobre el proyecto de reserva de laboratorio, con Playwright 1.63.0 y una demora simulada de hasta 400 ms: la sesión con carta y sus seis pruebas con lo que apareció literalmente; el doble clic repetido diez veces con el rechazo como mensaje final las diez; el registro de sesión producido por `claude -p` con solo la herramienta del navegador y sin acceso al código; y la reproducción de su segundo hallazgo, con cero solicitudes enviadas, el mensaje de validación nativa y la respuesta que la API habría dado.

---

# BLOQUE 4: De un hallazgo a una prueba que puede fallar

- **Duración:** 25 minutos
- **Objetivo del bloque:** convertir un hallazgo de la exploración en un criterio verificable, con
  magnitud, método y umbral, asociado a la capacidad de interacción de ISO/IEC 25010:2023, y
  comprobar ejecutando que no todo criterio bien redactado produce una prueba que detecta el defecto.
  Al finalizar, el estudiante debe poder escribir el criterio y su prueba, y reconocer cuándo una
  prueba pasa con el defecto presente porque mide algo que fue cierto por un instante.
- **Modalidad:** exposición con ejecución en vivo sobre el proyecto, y registro escrito individual.
- **Ritmo sugerido:** 3 minutos para la observación sin forma, 5 para la norma, 5 para las tres
  piezas, 6 para las dos pruebas y lo que midieron, 4 para la corrección, y 2 para lo que hace un
  agente y el ejercicio.

## Desarrollo

### 4.1 «Confunde» no se puede cumplir ni incumplir

El bloque anterior dejó el defecto más grave de la sesión escrito así: *la persona hace doble clic,
reserva, y la pantalla le dice que no pudo*. Es una observación verdadera y reproducible. Y todavía no
es algo que una prueba pueda comprobar, porque no dice qué debería pasar en su lugar.

Una frase como «la interfaz confunde» tiene el mismo problema, más grave: no se puede cumplir ni
incumplir. Nadie puede ejecutar algo que diga «confunde: sí» o «confunde: no». Mientras una observación
sobre una interfaz no tenga esa forma, es una opinión, y con opiniones no se decide si un sistema está
listo.

La Unidad 1 dejó la herramienta para darle forma. Un criterio verificable necesita tres piezas:

- **Magnitud observable:** algo que se pueda contar, medir o detectar en el sistema.
- **Método de medición:** cómo se obtiene esa magnitud, de modo que dos personas obtengan lo mismo.
- **Umbral:** el valor que separa lo aceptable de lo inaceptable.

### 4.2 La capacidad de interacción, en la norma

Antes de medir hay que saber qué característica de calidad está en juego. ISO/IEC 25010:2023, la
misma norma que la Unidad 1 usó para clasificar la calidad del producto, la define así:

> "interaction capability: capability of a product to be interacted with by specified users to
> exchange information between a user and a system via the user interface to complete the intended
> task"
>
> — ISO/IEC 25010:2023, cláusula 3.4

En español: *capacidad de interacción: capacidad de un producto de ser usado por usuarios
determinados para intercambiar información con el sistema mediante su interfaz y completar la tarea
prevista.* Una de sus notas aclara algo que conviene no confundir: *«la capacidad de interacción es un
requisito previo de la usabilidad»*. La usabilidad —si las personas logran sus objetivos con eficacia,
eficiencia y satisfacción— se mide con personas reales usando el sistema. La capacidad de interacción
es una propiedad **del producto**, y por eso se puede comprobar con pruebas.

La norma la divide en ocho subcaracterísticas. La revisión de 2023 cambió varias respecto de la
anterior, y el propio documento enumera esos cambios:

| Subcaracterística | En pocas palabras |
|---|---|
| Reconocibilidad de adecuación | Que la persona reconozca si el producto le sirve |
| Aprendibilidad | Que aprenda a usarlo en un tiempo determinado |
| Operabilidad | Que sea fácil de operar y controlar |
| **Protección frente a errores del usuario** | **Que prevenga los errores de operación** |
| Compromiso del usuario | Reemplaza a la antigua estética de la interfaz |
| Inclusividad | Que puedan usarlo personas diversas; sale de dividir la antigua accesibilidad |
| Asistencia al usuario | Que la persona reciba ayuda; también sale de esa división |
| Autodescriptividad | Que el producto muestre por sí mismo lo que la persona necesita saber; es nueva en 2023 |

La que corresponde al doble clic es la cuarta, y su definición es de una línea:

> "user error protection: capability of a product to prevent operation errors"
>
> — ISO/IEC 25010:2023, cláusula 3.4.4

*Protección frente a errores del usuario: capacidad de un producto de prevenir errores de operación.*
Apretar dos veces un botón es exactamente un error de operación, y el producto no lo previene: lo
convierte en dos solicitudes.

### 4.3 Las tres piezas, aplicadas al doble clic

Del mismo hallazgo se pueden escribir **dos criterios distintos**, y conviene escribir los dos para ver
en qué se diferencian:

| | Criterio A · el mecanismo | Criterio B · lo que la persona ve |
|---|---|---|
| **Magnitud** | Cantidad de solicitudes de reserva que envía la página ante un doble clic | Coincidencia entre el mensaje final y el estado real del bloque |
| **Método** | Registrar las solicitudes que salen de la página mientras se hace el doble clic | Hacer el doble clic, esperar a que la ficha del bloque cambie y leer el mensaje |
| **Umbral** | Exactamente una | Si la ficha dice «Tomado», el mensaje dice «Reserva confirmada» |
| **Criterio** | *Un doble clic en «Reservar» envía una sola solicitud de reserva* | *Tras un doble clic, el mensaje dice lo que realmente pasó* |

El criterio A mide la causa. El B mide la consecuencia que sufre la persona, que es la que el hallazgo
describía. A primera vista, el B parece el más fiel al problema.

### 4.4 Las dos pruebas, y lo que realmente midieron

Las dos, escritas en Playwright:

```typescript
test("un doble clic envía una sola solicitud de reserva", async ({ page }) => {
  await llenarBloque4(page);
  const solicitudes: string[] = [];
  page.on("request", (r) => {
    if (r.method() === "POST" && r.url().endsWith("/reservas")) solicitudes.push(r.url());
  });

  await page.getByRole("button", { name: "Reservar" }).dblclick();
  await expect(page.getByRole("status")).not.toBeEmpty();

  expect(solicitudes).toHaveLength(1);
});

test("tras un doble clic, el mensaje dice lo que realmente pasó", async ({ page }) => {
  await llenarBloque4(page);

  await page.getByRole("button", { name: "Reservar" }).dblclick();
  await expect(page.getByRole("listitem").filter({ hasText: "Bloque 4" })).toContainText("Tomado");

  await expect(page.getByRole("status")).toContainText("Reserva confirmada");
});
```

`llenarBloque4` llena el formulario completo sin enviarlo. `page.on("request", ...)` le pide a la
página que avise cada vez que sale una solicitud por la red, y la función anota las que son de
reserva. `dblclick` hace el doble clic, y `toHaveLength(1)` afirma que la lista de solicitudes tiene
exactamente un elemento.

Ejecutadas contra la interfaz tal como está:

```text
  x  1 un doble clic envía una sola solicitud de reserva
  ok 2 tras un doble clic, el mensaje dice lo que realmente pasó

Expected length: 1
Received length: 2
Received array:  ["http://127.0.0.1:8000/reservas", "http://127.0.0.1:8000/reservas"]
```

La A falla, como debía: salieron **dos** solicitudes. La B **pasó**, con el defecto presente. Y es la B la
que parecía más fiel al problema.

Para entender qué ocurrió hay que mirar cómo cambia el mensaje durante el doble clic. Se registraron
los cambios del párrafo de mensajes en tres ejecuciones, con el momento de cada uno:

```text
corrida 1:   144 ms · Reserva confirmada. Ana Rivas     277 ms · La reserva no esta permitida
corrida 2:   241 ms · Reserva confirmada. Ana Rivas     421 ms · La reserva no esta permitida
corrida 3:   177 ms · Reserva confirmada. Ana Rivas     483 ms · La reserva no esta permitida
```

«Reserva confirmada» **sí aparece**: cuando llega la respuesta de la primera solicitud. Dura entre 133
y 306 milisegundos en pantalla, y después la respuesta de la segunda lo reemplaza por el rechazo, que
es lo que queda. La aserción de la prueba B reintenta, como se estableció en el bloque 2, y encontró
el mensaje correcto durante ese instante. En ese momento la condición era cierta, y la prueba se dio
por satisfecha.

De ahí sale la lección del bloque, y completa la del bloque 2 desde el otro lado:

> Una aserción que reintenta pregunta si algo **llegó a ser** cierto, no si **terminó siendo**
> cierto.

Para esperar, eso es exactamente lo que se quiere. Para comprobar un estado final, no alcanza. La
prueba B pasa con el defecto y pasaría sin él: no distingue entre los dos, que es la definición de
una prueba que no detecta nada. Para medir de verdad lo que la persona ve al final, la página tendría
que dar alguna señal de que terminó de responder, y la página original no la da. Es, además, parte del
mismo problema de la persona, que tampoco sabe cuándo terminó.

Por eso, de los dos criterios, el que se lleva a la suite es el A. No porque la causa importe más que
la consecuencia, sino porque su medición es **estable**: una cantidad de solicitudes no cambia de
valor según el instante en que se mira.

### 4.5 Cuando la prueba pasa por la razón correcta

La prueba A falla hoy, y eso ya es un resultado: el defecto quedó convertido en algo que una prueba
detecta. Falta comprobar que pase cuando el defecto se corrige. La corrección habitual es deshabilitar
el botón mientras una solicitud está en curso:

```javascript
formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const boton = formulario.querySelector("button");
  if (boton.disabled) return;
  boton.disabled = true;
  const datos = Object.fromEntries(new FormData(formulario));
```

Y al final del manejador, `boton.disabled = false;` lo vuelve a habilitar. Un botón deshabilitado no
responde al segundo clic, así que sale una sola solicitud. Las dos pruebas del doble clic, diez veces
cada una:

```text
  20 passed (55.6s)
```

Y la suite de extremo a extremo completa, tal como queda al terminar la sesión:

```text
  ok 1 un doble clic envía una sola solicitud de reserva
  ok 2 tras un doble clic, el mensaje dice lo que realmente pasó
  ok 3 tras reservar, el bloque 4 aparece tomado · espera una condición
  ok 4 una reserva completa se confirma en pantalla
  x  5 si falta un dato, la pantalla dice cuál corregir

  1 failed
  4 passed (17.0s)
```

La que queda en rojo es la del bloque 1: el `[object Object]` sigue ahí, porque nadie lo corrigió. Y esa
prueba roja **informa**: dice exactamente qué defecto conocido tiene el sistema. Es lo contrario de la
prueba inestable del bloque 2, cuyo rojo no significaba nada. Un rojo que siempre aparece por la misma
razón es evidencia; un rojo que aparece a veces es ruido.

La suite de `pytest`, mientras tanto, no cambió:

```text
20 passed in 0.78s
```

### 4.6 Lo que hace un agente con esto

El agente del bloque anterior ya dio la respuesta sin que se le preguntara. De sus nueve hallazgos,
clasificó cuatro como *«una duda que alguien con el requisito debería resolver»*: el límite de
personas, el dígito verificador, lo que debe mostrar la confirmación y el horario de los bloques.
Reconoció que podía observar el sistema y no podía decidir qué debía hacer.

Es la misma frontera de este bloque. Un agente puede proponer la magnitud y el método, y escribir la
prueba con soltura. El **umbral** —una solicitud y no dos, un mensaje que nombra el campo, un límite que
se muestra— es una decisión sobre lo que el producto le debe a una persona. Esa decisión no está en el
código ni en la pantalla, y por eso no se delega.

## Ejercicio del bloque

Sobre el proyecto propio, continuando el hallazgo que elegiste en el bloque anterior.

1. **Asocia tu hallazgo a una subcaracterística** de la capacidad de interacción, de la tabla de 4.2.
   Escribe en una línea por qué es esa y no otra.
2. **Escribe dos criterios distintos** para el mismo hallazgo, con sus tres piezas: uno que mida la
   causa y otro que mida lo que la persona ve.
3. **Escribe la prueba del que tenga la medición más estable** y ejecútala. Anota el resultado literal.
4. **Si la prueba pasó con el defecto presente**, explica en una línea qué instante midió. Si falló,
   escribe la corrección más simple que la haría pasar y compruébalo.

**Pista:** para saber si una medición es estable, pregúntate si su valor puede cambiar según el
momento en que la mires. Una cantidad de solicitudes, un campo guardado o un código de estado no
cambian; un texto en pantalla mientras llegan respuestas sí puede cambiar.

**Evidencia esperada:** el hallazgo asociado a una subcaracterística, dos criterios con sus tres piezas,
una prueba ejecutada con su salida literal, y la explicación o la corrección del punto 4.

## Preguntas guía

1. La prueba del criterio B pasó con el defecto presente y también pasa sin él. Un compañero dice que
   entonces está bien, porque nunca falla. ¿Qué le responderías?

   **Pista:** pregúntate qué información te da una prueba que da el mismo resultado con el defecto y
   sin él. Recuerda qué significa que una prueba detecte algo.

2. El criterio A mide la cantidad de solicitudes, algo que la persona nunca ve. ¿Cómo puede ser una
   prueba de capacidad de interacción si no mira lo que la persona ve?

   **Pista:** lee otra vez la definición de 3.4.4. Pregúntate si prevenir un error de operación se
   puede comprobar por su causa, y qué ventaja tiene hacerlo así.

3. Al final de la sesión la suite de extremo a extremo tiene una prueba en rojo. ¿En qué se diferencia
   ese rojo del que producía la prueba con espera fija del bloque 2?

   **Pista:** compara si cada uno aparece siempre o a veces, y si cada uno te dice algo sobre el
   sistema o sobre la prueba.

## Fuentes técnicas del bloque

- [ISO/IEC 25010:2023 — *Product quality model*](https://www.iso.org/standard/78176.html) — la definición de capacidad de interacción (cláusula 3.4) y su nota sobre la usabilidad, las definiciones de sus primeras subcaracterísticas (3.4.1 a 3.4.4), incluida la protección frente a errores del usuario, y la lista de cambios respecto de la edición de 2011: capacidad de interacción en lugar de usabilidad, compromiso del usuario en lugar de estética de la interfaz, accesibilidad dividida en inclusividad y asistencia al usuario, y autodescriptividad como subcaracterística nueva.
- [ISO/IEC 25010:2023, vista previa de la publicación](https://cdn.standards.iteh.ai/samples/78176/13ff8ea97048443f99318920757df124/ISO-IEC-25010-2023.pdf) — prólogo y páginas numeradas 1 a 3: los textos citados literalmente.
- [Playwright — eventos de red](https://playwright.dev/docs/network) — `page.on("request")`, que avisa cada vez que la página envía una solicitud.
- [MDN — atributo `disabled`](https://developer.mozilla.org/es/docs/Web/HTML/Attributes/disabled) — un botón deshabilitado no responde a los clics.
- Ejecuciones registradas para esta clase sobre el proyecto de reserva de laboratorio, con Playwright 1.63.0 y una demora simulada de hasta 400 ms: las dos pruebas del doble clic contra la interfaz original, con la del mecanismo en rojo y dos solicitudes registradas, y la del mensaje en verde; la secuencia de mensajes con sus tiempos en tres ejecuciones; las dos pruebas con la corrección, diez veces cada una, en `20 passed`; la suite de extremo a extremo final en `4 passed, 1 failed`; y la suite de `pytest` en `20 passed`.

---

# Cierre: cuatro testigos, cuatro afirmaciones distintas

## 1. Lo que cada testigo puede afirmar

El módulo ya tiene pruebas de cuatro clases sobre el mismo sistema. No se reemplazan entre sí, porque
cada una la hace un testigo distinto y cada testigo solo puede declarar lo que vio.

| Testigo | Qué puede afirmar | Qué no puede afirmar |
|---|---|---|
| **La prueba unitaria** | Que una función decide bien con los datos que recibe | Que alguien la llame, ni que la llamen con los datos correctos |
| **La prueba de integración** | Que las piezas se entienden entre sí y el contrato se cumple | Qué ve una persona cuando el contrato se cumple |
| **La prueba de extremo a extremo** | Que una persona puede completar la tarea por la pantalla | Lo que nadie pensó en escribir como caso |
| **La exploración** | Lo que apareció cuando alguien se salió del camino previsto | Nada, hasta que se reproduce |

La última fila es la más fácil de malinterpretar, y por eso conviene subrayarla. Una exploración produce
hallazgos, no afirmaciones. Pasan a ser afirmaciones cuando una prueba los reproduce.

## 2. La afirmación que se puede sostener

A lo que las sesiones anteriores dejaron defendible sobre cada función y cada colaboración, hoy se
agrega una capa que habla de las personas:

> Una persona puede completar la reserva por la pantalla, y puedo mostrar la prueba que lo comprueba
> con un navegador real. Mis pruebas esperan condiciones y no tiempos, y lo comprobé ejecutándolas
> muchas veces con la red lenta. Exploré el sistema con una carta y un registro, y cada hallazgo que
> declaro como defecto lo reproduje. Y de lo que encontré, hay una prueba que hoy falla y dice
> exactamente qué falta corregir.

Lo que sigue sin poder afirmarse: cuánto de todo esto era necesario probar. Hoy la suite creció en
cinco pruebas y un ejecutor nuevo, y nadie decidió por qué esas y no otras.

## 3. Ticket de salida

En tres líneas, antes de salir:

1. Un lugar de tu sistema donde lo que devuelve internamente y lo que ve la persona no coinciden.
2. Una espera fija que encontraste en tus pruebas, o la condición que esperaría una prueba tuya si la
   acción que comprueba tardara.
3. Un hallazgo de exploración de tu sistema, con su clasificación: confirmado, exige el requisito, o
   falso al reproducirlo.

## 4. Próxima sesión: cuánto de todo esto vale la pena probar

Con esta sesión el módulo tiene pruebas en cuatro niveles, y ninguna decisión escrita sobre cuántas
hacen falta en cada uno ni por qué. La sesión de mañana se ocupa de eso: el plan de pruebas, el
documento donde se declara qué se prueba, qué queda fuera y con qué criterio se reparte el esfuerzo.

Conviene llegar con una pregunta, porque la sesión de mañana va a construir una herramienta que la
vuelve concreta. Las pruebas de hoy están escritas en TypeScript y corren con otro ejecutor. Si
mañana se genera un registro de qué requisito cubre cada prueba a partir de la suite de `pytest`,
**¿dónde quedan en ese registro las cinco pruebas de extremo a extremo?**

## Mensaje final

Los hallazgos de la sesión tienen una forma en común. La API respondió el campo exacto que faltaba y la
pantalla mostró `[object Object]`. La prueba con espera fija pasaba diez de diez en una máquina y cuatro
de diez en otra. El agente afirmó con seguridad un comportamiento que el sistema no tiene. La prueba del
mensaje pasó leyendo una confirmación que duró un tercio de segundo. En todos los casos, lo que se veía
en un instante no era lo que ocurría.

> Una persona no lee el contrato de un sistema: lee lo que la pantalla le muestra, en el momento en que
> se lo muestra. Probar desde ese lugar exige esperar lo que todavía no llega, desconfiar de lo que se
> vio una sola vez, y convertir cada «confunde» en algo que una prueba pueda contradecir. Un agente
> recorre la pantalla más rápido que cualquiera; decidir qué le debe el sistema a quien la usa sigue
> siendo trabajo de quien firma.

## Fuentes de síntesis

- [ISTQB Certified Tester Foundation Level Syllabus v4.0.1](https://astqb.org/assets/documents/ISTQB_CTFL_Syllabus_v4.0.1.pdf) — la prueba exploratoria y la prueba por sesiones (sección 4.4.2).
- [ISO/IEC/IEEE 29119-4:2021](https://www.iso.org/standard/79430.html) — la distinción entre técnica de diseño de casos y práctica de prueba.
- [ISO/IEC 25010:2023](https://www.iso.org/standard/78176.html) — la capacidad de interacción y la protección frente a errores del usuario.
- [Luo, Hariri, Eloussi y Marinov — *An Empirical Analysis of Flaky Tests*, FSE 2014](http://mir.cs.illinois.edu/marinov/publications/LuoETAL14FlakyTestsAnalysis.pdf) — la espera asíncrona como primera causa de inestabilidad.
- Documentación oficial de [Playwright](https://playwright.dev/docs/intro): localizadores, aserciones, espera automática y servidor web de pruebas.

---
