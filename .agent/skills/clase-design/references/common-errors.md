# Banco de Errores Pedagógicos Comunes

## Propósito

Los mejores profesores cometen errores **a propósito** para que estudiantes:
1. Aprendan a leer errores
2. Desarrollen debugging skills
3. Entiendan por qué algo falla
4. Recuerden mejor (error = emoción = memoria)

---

## Template de Error Pedagógico

```markdown
### 🐛 Error Común: [Nombre Descriptivo]

**Contexto:** [Cuándo suele ocurrir]

**Código con bug:**
```[lenguaje]
[código que falla]
```

**🤔 Antes de ejecutar:**
- ¿Qué crees que imprimirá/hará?
- ¿Funcionará? ¿Por qué sí/no?

**⚡ Ejecutamos...**
```
[Output con error o comportamiento inesperado]
```

**🔍 Análisis:**
1. [Qué indica el error]
2. [Por qué ocurrió]
3. [Concepto mal entendido]

**✅ Solución:**
```[lenguaje]
[código corregido]
```

**💡 Lección aprendida:**
[Regla o principio a recordar]

**🎯 Cómo evitarlo:**
[Práctica recomendada]
```

---

## JavaScript

### Error 1: Off-by-One en Arrays

```markdown
### 🐛 Error: Índice Fuera de Rango

**Contexto:** 80% de principiantes acceden a índice incorrecto

**Código con bug:**
```javascript
const frutas = ["manzana", "pera", "uva"]

for (let i = 0; i <= frutas.length; i++) {
  console.log(frutas[i])
}
```

**🤔 Predicción:**
¿Qué imprimirá? ¿Cuántas veces iterará?

**⚡ Output real:**
```
manzana
pera
uva
undefined
```

**🔍 Análisis:**
1. `frutas.length` es 3
2. Condición `i <= 3` permite i = 0, 1, 2, **3**
3. `frutas[3]` no existe → `undefined`
4. Arrays empiezan en índice 0, entonces:
   - frutas[0] = "manzana"
   - frutas[1] = "pera"
   - frutas[2] = "uva"
   - frutas[3] = no existe

**✅ Solución:**
```javascript
for (let i = 0; i < frutas.length; i++) {
  //              ^ < en lugar de <=
  console.log(frutas[i])
}
```

**💡 Lección:**
Arrays de tamaño N tienen índices de 0 a N-1, no de 0 a N.

**🎯 Regla:**
- Usar `i < array.length` (no `<=`)
- Último índice válido = `array.length - 1`
```

---

### Error 2: Asignación en Vez de Comparación

```markdown
### 🐛 Error: = vs === en Condicionales

**Contexto:** Error #1 que cometen incluso devs con experiencia

**Código con bug:**
```javascript
const edad = 17

if (edad = 18) {
  console.log("Puedes entrar")
} else {
  console.log("No puedes entrar")
}
```

**🤔 Predicción:**
Edad es 17, debería decir "No puedes entrar", ¿verdad?

**⚡ Output real:**
```
Puedes entrar
```

**🔍 Análisis:**
1. `edad = 18` es **asignación**, no comparación
2. Asigna 18 a edad (cambia el valor)
3. Expresión `edad = 18` retorna 18
4. 18 es "truthy" → siempre entra al if
5. edad ahora vale 18 (¡cambió!)

**✅ Solución:**
```javascript
if (edad === 18) {
  //      ^^^ tres signos igual
  console.log("Puedes entrar")
} else {
  console.log("No puedes entrar")
}
```

**💡 Lección:**
- `=` → asignación (guarda valor)
- `==` → comparación laxa (evitar)
- `===` → comparación estricta (usar siempre)

**🎯 Truco nemotécnico:**
"Uno guarda, dos compara mal, tres compara bien"
```

---

### Error 3: Callback Hell sin Return

```markdown
### 🐛 Error: Olvidar Return en Callback

**Código con bug:**
```javascript
const numeros = [1, 2, 3, 4, 5]

const dobles = numeros.map(n => {
  n * 2  // ← Sin return
})

console.log(dobles)
```

**🤔 Predicción:**
Debería retornar [2, 4, 6, 8, 10], ¿no?

**⚡ Output real:**
```
[undefined, undefined, undefined, undefined, undefined]
```

**🔍 Análisis:**
1. Arrow function con `{ }` necesita `return` explícito
2. `n * 2` se calcula pero no se retorna
3. Sin return, función retorna `undefined`
4. map() guarda cada `undefined`

**✅ Soluciones:**

Opción 1: return explícito
```javascript
const dobles = numeros.map(n => {
  return n * 2
})
```

Opción 2: return implícito (sin llaves)
```javascript
const dobles = numeros.map(n => n * 2)
```

**💡 Lección:**
- Arrow function sin `{ }` → return implícito
- Arrow function con `{ }` → return explícito necesario
```

---

## React

### Error 4: Modificar State Directamente

```markdown
### 🐛 Error: Mutar State en Vez de Usar setState

**Código con bug:**
```javascript
function Carrito() {
  const [items, setItems] = useState([])
  
  function agregarItem(nuevoItem) {
    items.push(nuevoItem) // ❌ Mutación directa
  }
  
  return <div>{items.length} items</div>
}
```

**🤔 ¿Qué pasará?**
Al agregar item, ¿se actualiza la UI?

**⚡ Resultado:**
- Item se agrega al array
- UI NO se actualiza (contador no cambia)
- React no detecta el cambio

**🔍 Análisis:**
1. `.push()` modifica array existente
2. React compara referencias: `items` sigue siendo el mismo array
3. React dice "no cambió nada" → no re-renderiza
4. Aunque el contenido cambió, la referencia es igual

**✅ Solución:**
```javascript
function agregarItem(nuevoItem) {
  setItems([...items, nuevoItem]) // Nuevo array
}

// O también:
function agregarItem(nuevoItem) {
  setItems(prevItems => [...prevItems, nuevoItem])
}
```

**💡 Lección:**
NUNCA modifiques state directamente. Siempre crea uno nuevo.

**🎯 Regla:**
- Arrays: usa spread `[...array, nuevo]`
- Objetos: usa spread `{...obj, prop: nuevo}`
- Números/strings: solo reasigna
```

---

### Error 5: useEffect Sin Dependencias

```markdown
### 🐛 Error: Loop Infinito con useEffect

**Código con bug:**
```javascript
function UserProfile({ userId }) {
  const [user, setUser] = useState(null)
  
  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => setUser(data))
  }) // ← Sin array de dependencias
}
```

**🤔 ¿Cuántas veces ejecutará el fetch?**

**⚡ Resultado:**
```
Fetch ejecuta... ejecuta... ejecuta... (INFINITO)
Console: "Maximum update depth exceeded"
```

**🔍 Análisis:**
1. useEffect sin dependencias → ejecuta en CADA render
2. fetch cambia state con setUser
3. Cambio de state → re-render
4. Re-render → useEffect ejecuta de nuevo
5. GOTO paso 2 (loop infinito)

**✅ Soluciones:**

Si quieres ejecutar solo al montar:
```javascript
useEffect(() => {
  fetch(...)
}, []) // Array vacío
```

Si quieres ejecutar cuando userId cambie:
```javascript
useEffect(() => {
  fetch(`/api/users/${userId}`)
    .then(...)
}, [userId]) // userId en dependencias
```

**💡 Lección:**
- Sin array → ejecuta en cada render
- Array vacío `[]` → ejecuta solo al montar
- Array con valores `[x, y]` → ejecuta cuando x o y cambian
```

---

## PHP

### Error 6: SQL Injection Vulnerable

```markdown
### 🐛 Error: Concatenación Directa en SQL

**Contexto:** Vulnerabilidad #1 en web

**Código con bug:**
```php
$nombre = $_POST['nombre'];

$query = "SELECT * FROM usuarios WHERE nombre = '$nombre'";
$result = mysqli_query($conn, $query);
```

**🤔 ¿Qué pasa si usuario malicioso ingresa?**
```
nombre: '; DROP TABLE usuarios; --
```

**⚡ Query resultante:**
```sql
SELECT * FROM usuarios WHERE nombre = ''; DROP TABLE usuarios; --'
```

**Resultado:**
💣 TABLA BORRADA. Todos los usuarios perdidos. Empresa en pánico.

**🔍 Análisis:**
1. Input del usuario se inyecta directo en SQL
2. Usuario puede "cerrar" el string con `'`
3. Usuario puede ejecutar SQL arbitrario
4. `;` permite múltiples comandos
5. `--` comenta el resto (evita errores de sintaxis)

**✅ Solución: Prepared Statements**
```php
$stmt = $conn->prepare("SELECT * FROM usuarios WHERE nombre = ?");
$stmt->bind_param("s", $nombre);
$stmt->execute();
$result = $stmt->get_result();
```

**Por qué es seguro:**
- `?` es placeholder
- `$nombre` se pasa separado del SQL
- Database trata `$nombre` como DATO, nunca como CÓDIGO
- Imposible inyectar SQL

**💡 Lección:**
NUNCA concatenes input de usuario en queries.
Siempre usa prepared statements.

**🎯 Regla de oro:**
"Si viene del usuario, no va directo en SQL"
```

---

### Error 7: División por Cero

```markdown
### 🐛 Error: No Validar Denominador

**Código con bug:**
```php
function calcularPromedio($suma, $cantidad) {
  return $suma / $cantidad;
}

$promedio = calcularPromedio(0, 0);
echo "Promedio: $promedio";
```

**⚡ Output:**
```
Warning: Division by zero
Promedio: INF
```

**✅ Solución:**
```php
function calcularPromedio($suma, $cantidad) {
  if ($cantidad === 0) {
    return 0; // O throw exception, depende del caso
  }
  return $suma / $cantidad;
}
```

**💡 Lección:**
Siempre validar denominador antes de dividir.
```

---

## CSS

### Error 8: Olvidar Box-Sizing

```markdown
### 🐛 Error: Width Incluye o No Incluye Padding?

**Código con bug:**
```css
.caja {
  width: 200px;
  padding: 20px;
  border: 2px solid black;
}
```

**🤔 ¿Cuál es el ancho total de .caja?**

**⚡ Respuesta:**
244px (200 + 20*2 + 2*2)

**🔍 Análisis:**
- Por defecto, `box-sizing: content-box`
- width solo cuenta el contenido
- padding y border se AGREGAN

**✅ Solución:**
```css
* {
  box-sizing: border-box;
}

.caja {
  width: 200px; /* Ahora incluye padding y border */
  padding: 20px;
  border: 2px solid black;
}
```

Ahora ancho total = 200px (más intuitivo)

**💡 Lección:**
Siempre usar `box-sizing: border-box` en reset CSS.
```

---

## SQL

### Error 9: Olvidar WHERE en UPDATE/DELETE

```markdown
### 🐛 Error: Actualizar/Borrar TODA la Tabla

**Código con bug:**
```sql
-- Quieres actualizar email de un usuario
UPDATE usuarios
SET email = 'nuevo@email.com'
-- ← Olvidaste WHERE
```

**⚡ Resultado:**
💣 TODOS los usuarios ahora tienen email 'nuevo@email.com'

**Análisis:**
Sin WHERE, UPDATE/DELETE afecta TODAS las filas.

**✅ Solución:**
```sql
UPDATE usuarios
SET email = 'nuevo@email.com'
WHERE id = 123;
```

**🎯 Protección:**
SIEMPRE ejecuta SELECT primero:
```sql
-- Primero verificar qué afectarás
SELECT * FROM usuarios WHERE id = 123;

-- Si resultado correcto, cambiar SELECT por UPDATE
UPDATE usuarios SET email = 'nuevo@email.com' WHERE id = 123;
```

**💡 Lección:**
Never UPDATE/DELETE without WHERE (a menos que sea intencional).
```

---

## Git

### Error 10: Commit a Main Sin Pull

```markdown
### 🐛 Error: Push Rechazado por Conflictos

**Secuencia con bug:**
```bash
# Modificas archivo.js
git add .
git commit -m "Feature nueva"
git push origin main
```

**⚡ Error:**
```
error: failed to push some refs to 'origin'
hint: Updates were rejected because the remote contains work
```

**🔍 Análisis:**
1. Alguien más hizo push mientras trabajabas
2. Tu código está basado en versión vieja
3. Git rechaza para evitar sobrescribir

**✅ Solución:**
```bash
# SIEMPRE pull primero
git pull origin main

# Si hay conflictos, resuélvelos
git add .
git commit -m "Merge conflicts"

# Ahora sí push
git push origin main
```

**💡 Regla:**
"Pull antes de push" siempre.
```

---

## Checklist para Crear Errores Pedagógicos

Al diseñar un error intencional:

- [ ] Es un error que 50%+ de estudiantes cometen
- [ ] Tiene mensaje de error claro para analizar
- [ ] Ilustra un concepto mal entendido común
- [ ] La corrección refuerza una regla importante
- [ ] Incluyes predicción antes de mostrar resultado
- [ ] Explicas PORQUÉ falló, no solo QUÉ falló
- [ ] Das lección memorable para evitarlo
- [ ] El error es "seguro" (no rompe sistema, solo didáctico)

---

## Uso en Clase

**Insertar después de explicar concepto:**

```markdown
## Concepto Explicado

[Tu explicación del concepto]

---

## 🐛 Error Común en Vivo

**Ahora veamos el error que 80% de ustedes cometerá esta semana:**

[Inserta error pedagógico aquí]

---

## Continuamos...
```

**Timing:** 5-7 minutos por error pedagógico

**Frecuencia:** 1-2 por clase de 3 horas