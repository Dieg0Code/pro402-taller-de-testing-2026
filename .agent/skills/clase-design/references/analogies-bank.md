# Banco de Analogías por Concepto Técnico

## Principios de una Buena Analogía

1. **Del mundo del estudiante:** No uses analogías técnicas para explicar técnica
2. **Mapeo 1:1:** Cada elemento técnico tiene equivalente claro
3. **Visual cuando sea posible:** Que puedan "verlo" mentalmente
4. **Reconocible:** Algo que 90%+ de estudiantes conocen
5. **Extensible:** Que sirva para explicar conceptos relacionados

---

## Variables y Tipos de Datos

### Analogía 1: Cajas Etiquetadas
```
Variable = Caja con etiqueta
Valor = Lo que guardas dentro
Tipo de dato = Tipo de caja (para zapatos, para frutas, etc.)

const nombre = "Juan"
→ Caja etiquetada "nombre" con papel "Juan" dentro
→ const = caja sellada (no puedes cambiar contenido)

let edad = 25
→ Caja etiquetada "edad" con número 25 dentro  
→ let = caja abierta (puedes cambiar contenido después)
```

**Tabla de mapeo:**
| Código | Mundo Real |
|--------|------------|
| Variable nombre | Etiqueta de la caja |
| Valor | Contenido de la caja |
| const | Caja sellada con candado |
| let | Caja con tapa removible |
| Tipo de dato | Tipo de caja (zapatos, frutas, libros) |

### Analogía 2: Contactos del Celular
```
Variable = Nombre de contacto
Valor = Número telefónico

const mamá = "912345678"
→ Contacto "mamá" guardado con ese número
→ const = no cambiarás quién es tu mamá

let trabajo = "987654321"
→ Contacto "trabajo" con ese número
→ let = puedes cambiar de trabajo (y número)
```

---

## Funciones

### Analogía 1: Licuadora/Juguera
```
Función = Licuadora
Parámetros = Ingredientes que pones
Proceso = Licuar (lo que hace internamente)
Return = Jugo que sale

function hacerJugo(frutas, agua) {
  return frutas + agua // licuadas
}

const jugo = hacerJugo("fresa", "100ml")
```

**Tabla:**
| Código | Licuadora |
|--------|-----------|
| `function` | La licuadora misma |
| Parámetros `(frutas, agua)` | Ingredientes |
| Cuerpo `{ }` | Motor que procesa |
| `return` | Jugo que sale |
| Llamar función | Presionar botón ON |

### Analogía 2: Receta de Cocina
```
Función = Receta
Parámetros = Ingredientes necesarios
Instrucciones = Pasos (cuerpo de función)
Return = Plato terminado

function hacerPizza(masa, salsa, queso) {
  // Paso 1: Extender masa
  // Paso 2: Agregar salsa
  // Paso 3: Agregar queso
  // Paso 4: Hornear
  return pizza
}
```

### Analogía 3: Máquina Expendedora
```
Función = Máquina
Input (parámetro) = Dinero que metes
Proceso = Selección y entrega interna
Output (return) = Producto que sale

function comprar(dinero, codigo) {
  if (dinero >= precio) {
    return producto
  }
}
```

---

## Arrays (Listas)

### Analogía 1: Estante de Libros
```
Array = Estante
Elementos = Libros en el estante
Índice = Posición en el estante (1°, 2°, 3°)

const libros = ["Harry Potter", "LOTR", "GOT"]
libros[0] // Primer libro (Harry Potter)
libros[1] // Segundo libro (LOTR)
```

**IMPORTANTE:** Estantes empiezan en posición 0, no 1.

### Analogía 2: Playlist de Spotify
```
Array = Playlist
Elementos = Canciones
.push() = Agregar canción al final
.pop() = Quitar última canción
.length = Cantidad de canciones

const playlist = ["Song 1", "Song 2", "Song 3"]
playlist.push("Song 4") // Agregar al final
playlist.pop() // Quitar última
```

### Analogía 3: Vagones de Tren
```
Array = Tren completo
Elementos = Vagones
Índice = Número de vagón
Orden = Importa (primer vagón ≠ último vagón)

[🚂][🚃][🚃][🚃]
 [0] [1] [2] [3]
```

---

## Objetos

### Analogía 1: Cédula de Identidad
```
Objeto = Cédula completa
Propiedades = Campos de la cédula

const persona = {
  nombre: "Juan Pérez",
  rut: "12.345.678-9",
  edad: 30,
  foto: "📸"
}

→ persona.nombre → Leer el campo "nombre"
→ persona.edad → Leer el campo "edad"
```

### Analogía 2: Tarjeta Pokémon
```
Objeto = Carta completa
Propiedades = Estadísticas de la carta

const pikachu = {
  nombre: "Pikachu",
  tipo: "Eléctrico",
  hp: 35,
  ataque: "Rayo",
  evolucion: "Raichu"
}
```

### Analogía 3: Ficha Médica
```
Objeto = Ficha del paciente
Propiedades = Datos médicos

const paciente = {
  nombre: "Ana López",
  edad: 45,
  sangre: "O+",
  alergias: ["penicilina", "maní"],
  enfermedades: []
}
```

---

## Loops (Bucles)

### Analogía 1: Lavar Platos
```
Loop = Repetir proceso
Condición = "Mientras queden platos sucios"
Iteración = Lavar un plato

while (hayPlatosSucios) {
  lavarPlato()
  enjuagarPlato()
  secarPlato()
}
```

### Analogía 2: Leer un Libro
```
for = Leer página por página
i = Número de página
Condición = Hasta la última página

for (let pagina = 1; pagina <= 300; pagina++) {
  leerPagina(pagina)
}
```

### Analogía 3: Fila del Banco
```
while = Mientras haya gente en la fila
Iteración = Atender a una persona

while (hayPersonasEnFila) {
  atenderPersona()
  personasSiguiente++
}
```

---

## Condicionales (If/Else)

### Analogía 1: Semáforo
```
if = Si está verde → avanza
else if = Si está amarillo → precaución
else = Si está rojo → detente

if (semaforo === "verde") {
  avanzar()
} else if (semaforo === "amarillo") {
  precaucion()
} else {
  detenerse()
}
```

### Analogía 2: Control de Acceso (Boliche)
```
if (edad >= 18) {
  dejarEntrar()
} else {
  rechazar()
}

→ Si tienes 18+ años → entras
→ Si no → no entras
```

### Analogía 3: Termostato
```
if (temperatura < 18) {
  encenderCalefaccion()
} else if (temperatura > 25) {
  encenderAireAcondicionado()
} else {
  apagar()
}
```

---

## APIs y Fetch

### Analogía 1: Mesero en Restaurante
```
Cliente = Tu código frontend
Mesero = API
Cocina = Servidor/Base de datos
Pedido = Request
Comida = Response

// Tú (cliente) pides al mesero
fetch('/api/menu')
  .then(menu => mostrarMenu(menu))

→ Mesero va a cocina
→ Cocina prepara
→ Mesero trae comida
→ Tú comes
```

**Tabla:**
| Código | Restaurante |
|--------|-------------|
| `fetch()` | Llamar al mesero |
| URL | Qué plato pides |
| Request | Pedido verbal |
| Response | Comida que trae |
| `.then()` | Cuando llegue la comida |
| Error 404 | "No tenemos ese plato" |
| Error 500 | "Se quemó en la cocina" |

### Analogía 2: Cajero Automático (ATM)
```
Tú = Frontend
ATM = API
Banco = Backend/Database

// Pides sacar dinero
fetch('/api/retiro', {
  method: 'POST',
  body: { monto: 100 }
})

→ ATM se comunica con banco
→ Banco verifica saldo
→ ATM te da dinero
```

### Analogía 3: Llamada Telefónica
```
fetch() = Marcar número
Request = Tu pregunta
Response = Respuesta de quien contesta
.then() = Cuando contesten
.catch() = Si no contestan (error)
```

---

## Promises y Async/Await

### Analogía 1: Pedido de Pizza
```
Promise = "Promesa" de que pizza llegará
Pending = Pizza en camino
Fulfilled = Pizza llegó
Rejected = No llegó (se perdió el delivery)

const pizza = ordenarPizza()
// Estado: Pending (en camino)

pizza.then(comer) // Cuando llegue, comer
pizza.catch(reclamar) // Si no llega, reclamar
```

### Analogía 2: Email/Mensaje
```
async = Enviar email (no esperas respuesta inmediata)
await = Esperar a que respondan antes de continuar

async function pedirAprobacion() {
  const respuesta = await enviarEmail(jefe)
  // ESPERA aquí hasta que jefe responda
  if (respuesta === "aprobado") {
    continuar()
  }
}
```

### Analogía 3: Lavar Ropa
```
Sincrono = Lavar a mano (esperas ahí hasta terminar)
Asincrono = Lavadora (la pones y haces otras cosas)

// Sincrono
lavarRopa() // 2 horas esperando
hacerOtraCosa() // Recién ahora puedes

// Asincrono
lavadora.start()
hacerOtraCosa() // Haces esto mientras lava
await lavadora.finish()
```

---

## Git y Control de Versiones

### Analogía 1: Máquina del Tiempo
```
Git = Máquina del tiempo para tu código
Commit = Foto/checkpoint en el tiempo
Branch = Línea de tiempo alternativa
Merge = Combinar líneas de tiempo

main: [📸1]---[📸2]---[📸3]
              \
feature:       [📸A]---[📸B]
```

### Analogía 2: Guardado de Videojuego
```
Commit = Guardar partida
Cada commit = Punto al que puedes volver
Branch = Guardar en slot diferente

Slot 1 (main): Nivel 5 guardado
Slot 2 (feature): Nivel 3 con poder especial
```

### Analogía 3: Documento con Track Changes
```
Git = Microsoft Word con "Control de cambios"
Cada commit = Versión guardada
Diff = Ver qué cambió entre versiones
Revert = Volver a versión anterior
```

---

## Base de Datos Relacional

### Analogía 1: Biblioteca Organizada
```
Database = Biblioteca completa
Tabla = Estante específico (Ficción, Historia, etc.)
Fila = Libro individual
Columna = Dato del libro (autor, año, ISBN)

Tabla LIBROS:
| ID | Título | Autor | Año |
|----|--------|-------|-----|
| 1 | "1984" | Orwell | 1949 |
```

### Analogía 2: Excel/Planilla
```
Database = Archivo Excel completo
Tabla = Hoja/Sheet
Fila = Fila en Excel
Columna = Columna en Excel
Primary Key = ID único de cada fila
```

### Analogía 3: Agenda Telefónica
```
Tabla = Libreta completa
Fila = Contacto individual
Columnas = Nombre, Teléfono, Email, Dirección
```

---

## SQL JOINs

### Analogía 1: Emparejar en Cita Rápida
```
Tabla A = Personas solteras
Tabla B = Hobbies
JOIN = Emparejar personas con hobbies en común

SELECT personas.nombre, hobbies.actividad
FROM personas
JOIN hobbies ON personas.hobby_id = hobbies.id

→ María tiene hobby_id = 3
→ hobby_id 3 = "Fotografía"
→ JOIN conecta: María → Fotografía
```

### Analogía 2: Piezas de Rompecabezas
```
Tabla A = Pieza con saliente
Tabla B = Pieza con entrante
JOIN = Conectar piezas que encajan

LEFT JOIN = Todas las piezas de A, con o sin match
INNER JOIN = Solo piezas que conectan perfectamente
```

---

## CSS Flexbox

### Analogía 1: Organizar Personas en Fila
```
display: flex = Poner personas en fila
flex-direction: row = Fila horizontal
flex-direction: column = Fila vertical
justify-content = ¿Dónde poner la fila? (inicio, centro, fin)
align-items = ¿Cómo alinearlos? (arriba, centro, abajo)

.container {
  display: flex;
  justify-content: center; // Fila en el centro
  align-items: center;      // Personas centradas verticalmente
}
```

### Analogía 2: Organizar Libros en Estante
```
display: flex = Activar el estante
flex-direction: row = Libros horizontal
flex-wrap: wrap = Si no caben, pasa a siguiente fila
justify-content: space-between = Espacio igual entre libros
```

---

## React State

### Analogía 1: Luz con Interruptor
```
State = Si la luz está prendida o apagada
setState = Presionar el interruptor
Re-render = La luz cambia visualmente

const [luz, setLuz] = useState(false)
// luz = apagada

setLuz(true)
// luz = prendida → UI se actualiza automáticamente
```

### Analogía 2: Termostato Digital
```
State = Temperatura actual mostrada
setState = Cambiar temperatura
UI = Display que muestra el número

const [temp, setTemp] = useState(20)
setTemp(25) // Display cambia de 20 → 25
```

---

## Event Listeners

### Analogía 1: Timbre de Casa
```
addEventListener = Instalar timbre
Event = Alguien toca el timbre
Callback = Lo que haces cuando suena (abrir puerta)

button.addEventListener('click', abrirModal)
→ Botón = timbre
→ Click = alguien presiona
→ abrirModal = abrir la puerta
```

### Analogía 2: Detector de Humo
```
addEventListener = Instalar detector
Event = Humo detectado
Callback = Activar alarma

window.addEventListener('error', mostrarAlerta)
```

---

## Principios de Uso

### Cómo Presentar la Analogía:

```markdown
## [Concepto Técnico]

**La Analogía del [Objeto Familiar]:**

> "[Frase que conecta concepto con analogía en 1-2 líneas]"

**Ejemplo lado a lado:**

| Mundo Real | Código |
|------------|--------|
| [Elemento 1] | [Equivalente técnico] |
| [Elemento 2] | [Equivalente técnico] |

**En código:**
```[lenguaje]
// Código con comentarios que usan analogía
```

**¿Por qué funciona esta analogía?**
[1-2 líneas explicando el mapeo]
```

### Cuándo Extender la Analogía:

✅ Cuando ayuda a entender un concepto relacionado
❌ Cuando forzarla confunde más que aclara

**Ejemplo bueno:**
```
Función = Licuadora
Parámetros = Ingredientes
Retur = Jugo

✅ Extender: "función pura = licuadora siempre da mismo jugo con mismos ingredientes"
```

**Ejemplo malo:**
```
❌ Forzar: "closure = cuando la licuadora recuerda qué licuaste antes"
→ Confuso, mejor otra analogía
```

---

## Plantilla Reutilizable

```markdown
### Analogía: [Nombre del Objeto Familiar]

**Concepto técnico como analogía:**
[Concepto] = [Objeto familiar]

**Mapeo:**
| Elemento Técnico | Mundo Real |
|------------------|------------|
| [Tech 1] | [Real 1] |
| [Tech 2] | [Real 2] |
| [Tech 3] | [Real 3] |

**Ejemplo:**
[Código con comentarios usando analogía]

**Por qué funciona:**
[Explicación breve del mapeo]
```