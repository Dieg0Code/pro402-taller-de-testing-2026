# Banco de Preguntas Socráticas

## Filosofía Socrática en Programación

**Objetivo:** Que el estudiante DESCUBRA, no que tú le DIGAS.

**Proceso:**
1. Hacer pregunta que guíe al concepto
2. Esperar respuesta (silencio está OK)
3. Si respuesta incorrecta → pregunta que revele error
4. Si respuesta correcta → pregunta de profundización
5. NUNCA dar respuesta directa (guiar al descubrimiento)

---

## Framework: Taxonomía de Bloom

### Nivel 1: RECORDAR (Reconocimiento)
"¿Qué es X?" "¿Cuál es la sintaxis de Y?"

### Nivel 2: COMPRENDER (Explicación)
"¿Por qué usamos X?" "¿Qué diferencia hay entre X e Y?"

### Nivel 3: APLICAR (Uso)
"¿Cómo harías X?" "¿Qué método usarías para Y?"

### Nivel 4: ANALIZAR (Descomposición)
"¿Por qué este código falla?" "¿Qué está mal en este approach?"

### Nivel 5: EVALUAR (Juicio)
"¿Cuál es mejor? ¿Por qué?" "¿Vale la pena la complejidad?"

### Nivel 6: CREAR (Diseño)
"Diseña una solución para X" "¿Cómo mejorarías Y?"

---

## Preguntas por Concepto

### Variables y Tipos de Datos

**Nivel 1 - Recordar:**
- "¿Qué es una variable?"
- "¿Qué diferencia hay entre `const` y `let`?"
- "¿Qué tipos de datos básicos conoces?"

**Nivel 2 - Comprender:**
- "¿Por qué necesitamos variables? ¿Qué problema resuelven?"
- "¿En qué situación usarías `const` en lugar de `let`?"
- "¿Qué pasa si intentas cambiar una variable `const`?"

**Nivel 3 - Aplicar:**
- "Si necesitas guardar la edad de un usuario, ¿qué tipo de dato usarías?"
- "Tengo un valor que no debería cambiar nunca, ¿const o let?"

**Nivel 4 - Analizar:**
```javascript
let x = 5
x = "hola"
```
- "¿Qué está pasando aquí?"
- "¿Es esto válido? ¿Por qué?"
- "¿Qué nos dice sobre JavaScript?"

**Nivel 5 - Evaluar:**
- "¿Es buena práctica reasignar variables a diferentes tipos?"
- "¿Deberíamos usar `var`? ¿Por qué sí/no?"

**Nivel 6 - Crear:**
- "Diseña un sistema de configuración usando solo const"

---

### Funciones

**Nivel 1 - Recordar:**
- "¿Qué es una función?"
- "¿Cómo defines una función en JavaScript?"

**Nivel 2 - Comprender:**
- "¿Por qué usamos funciones en lugar de escribir código repetido?"
- "¿Qué significa que una función 'retorna' algo?"
- "¿Cuál es la diferencia entre parámetro y argumento?"

**Nivel 3 - Aplicar:**
- "¿Cómo crearías una función que sume dos números?"
- "Si quiero usar el resultado de esta función después, ¿qué necesito?"

**Nivel 4 - Analizar:**
```javascript
function saludar(nombre) {
  console.log("Hola " + nombre)
}
const resultado = saludar("Juan")
console.log(resultado) // ¿Qué imprime?
```
- "¿Por qué `resultado` es undefined?"
- "¿Qué le falta a esta función?"

**Nivel 5 - Evaluar:**
- "¿Es mejor usar `console.log` dentro de la función o `return`? ¿Por qué?"
- "¿Cuándo una función debería tener side effects?"

**Nivel 6 - Crear:**
- "Diseña una función reutilizable que valide emails"

---

### Arrays

**Nivel 1 - Recordar:**
- "¿Qué es un array?"
- "¿Cómo accedes al primer elemento?"

**Nivel 2 - Comprender:**
- "¿Por qué los índices empiezan en 0 y no en 1?"
- "¿Qué diferencia hay entre `.push()` y `.pop()`?"
- "¿Qué significa que arrays son 'ordenados'?"

**Nivel 3 - Aplicar:**
```javascript
const frutas = ["manzana", "pera"]
```
- "¿Cómo agregarías 'uva' al final?"
- "¿Cómo accederías al último elemento sin saber el tamaño?"

**Nivel 4 - Analizar:**
```javascript
const nums = [1, 2, 3]
nums[10] = 100
console.log(nums.length) // ¿Qué imprime?
```
- "¿Qué pasó entre índice 3 y 10?"
- "¿Qué contienen esas posiciones?"

**Nivel 5 - Evaluar:**
- "¿Es mejor usar `.push()` o `arr[arr.length] = valor`? ¿Por qué?"
- "¿Cuándo usarías un array vs un objeto?"

**Secuencia Socrática Completa:**

```markdown
Profesor: "Tengo este array: [1, 2, 3, 4, 5]"
          "¿Cómo obtendrías solo los números pares?"

Estudiante: "No sé"

Profesor: "OK. ¿Qué necesitas hacer con cada elemento?"
Estudiante: "Revisar si es par"

Profesor: "Exacto. ¿Cómo sabes si un número es par?"
Estudiante: "Si dividido entre 2 da resto 0"

Profesor: "Bien. En código, ¿cómo verificas el resto de una división?"
Estudiante: "Con %"

Profesor: "Perfecto. Entonces `n % 2 === 0` te dice si es par. Ahora, ¿qué método de array sirve para quedarte solo con algunos elementos?"
Estudiante: "¿filter?"

Profesor: "Excelente. ¿Cómo sería el código?"
Estudiante: "arr.filter(n => n % 2 === 0)"

Profesor: "👏 Perfecto. Ahora explícame con tus palabras qué hace"
```

---

### Objetos

**Nivel 1 - Recordar:**
- "¿Qué es un objeto?"
- "¿Cómo accedes a una propiedad?"

**Nivel 2 - Comprender:**
- "¿Cuándo usarías un objeto en lugar de variables separadas?"
- "¿Qué diferencia hay entre dot notation y bracket notation?"

**Nivel 3 - Aplicar:**
- "Crea un objeto que represente un libro con título, autor y año"
- "¿Cómo agregarías una nueva propiedad a un objeto existente?"

**Nivel 4 - Analizar:**
```javascript
const persona = { nombre: "Ana" }
persona.nombre = "Juan"
```
- "¿Esto está permitido aunque persona sea const?"
- "¿Por qué?"

**Nivel 5 - Evaluar:**
- "¿Es mejor guardar datos de usuario en objeto o en variables separadas?"
- "¿Cuándo tiene sentido anidar objetos?"

---

### Loops

**Nivel 1 - Recordar:**
- "¿Qué es un loop?"
- "¿Qué hace `for`? ¿Y `while`?"

**Nivel 2 - Comprender:**
- "¿Por qué necesitamos loops? ¿Qué problema resuelven?"
- "¿Cuál es la diferencia entre `for` y `while`?"
- "¿Qué pasa si la condición de while nunca se vuelve false?"

**Nivel 3 - Aplicar:**
- "¿Cómo imprimirías números del 1 al 10?"
- "¿Cómo recorrerías un array de nombres?"

**Nivel 4 - Analizar:**
```javascript
let i = 0
while (i < 5) {
  console.log(i)
}
```
- "¿Qué va a pasar?"
- "¿Por qué?"
- "¿Cómo lo arreglas?"

**Nivel 5 - Evaluar:**
- "¿Cuándo usarías `for` vs `forEach`?"
- "¿Es siempre necesario un loop o hay mejores opciones?"

---

### Condicionales

**Nivel 1 - Recordar:**
- "¿Qué hace `if`?"
- "¿Para qué sirve `else`?"

**Nivel 2 - Comprender:**
- "¿Por qué usamos `===` en lugar de `==`?"
- "¿Qué significa que algo es 'truthy' o 'falsy'?"

**Nivel 3 - Aplicar:**
- "Si edad es menor a 18, quiero imprimir 'Menor'. ¿Cómo?"
- "¿Cómo verificarías si un string está vacío?"

**Nivel 4 - Analizar:**
```javascript
if (edad = 18) {
  console.log("Puedes votar")
}
```
- "¿Qué está mal aquí?"
- "¿Qué va a pasar?"

**Nivel 5 - Evaluar:**
- "¿Es mejor if/else o switch? ¿Cuándo?"
- "¿Deberíamos anidar muchos if?"

---

### Async/Await

**Nivel 1 - Recordar:**
- "¿Qué significa 'asíncrono'?"
- "¿Qué es una Promise?"

**Nivel 2 - Comprender:**
- "¿Por qué necesitamos código asíncrono?"
- "¿Qué problema resuelve async/await comparado con .then()?"
- "¿Qué significa 'await'?"

**Nivel 3 - Aplicar:**
- "¿Cómo harías un fetch con async/await?"
- "¿Dónde pondrías el `await`?"

**Nivel 4 - Analizar:**
```javascript
async function getData() {
  const data = await fetch('/api')
  console.log("Data obtenida")
}
console.log("Inicio")
getData()
console.log("Fin")
```
- "¿En qué orden se imprimen los console.log?"
- "¿Por qué?"

**Nivel 5 - Evaluar:**
- "¿Cuándo usar async/await vs Promises?"
- "¿Qué pasa si no usas await?"

---

### React Hooks

**useState - Secuencia Socrática:**

```markdown
P: "¿Qué problema tenemos con variables normales en React?"
E: "Se resetean en cada render"

P: "Exacto. ¿Qué necesitamos entonces?"
E: "Algo que persista"

P: "Bien. Y cuando el valor cambia, ¿qué debería pasar?"
E: "Actualizar la UI"

P: "Perfecto. Entonces necesitamos dos cosas: ¿cuáles?"
E: "Guardar el valor y una forma de cambiarlo"

P: "Sí. ¿Cómo crees que useState nos da eso?"
E: "Retorna un array con el valor y una función"

P: "Exacto. ¿Por qué array y no objeto?"
E: "Para poder nombrar las variables como queramos"

P: "👏 Perfecto. Prueba crear un contador"
```

---

### SQL

**Nivel 2 - Comprender:**
- "¿Por qué usamos JOIN en lugar de dos queries separadas?"
- "¿Qué diferencia hay entre INNER JOIN y LEFT JOIN?"

**Nivel 4 - Analizar:**
```sql
SELECT * FROM usuarios
```
- "Si esta tabla tiene 1 millón de filas, ¿qué problema hay?"
- "¿Cómo lo mejorarías?"

**Nivel 5 - Evaluar:**
- "¿Deberíamos siempre normalizar las tablas?"
- "¿Cuándo tiene sentido desnormalizar?"

---

## Técnicas de Preguntas

### 1. La Secuencia de Descubrimiento

```
Pregunta General → Pregunta Específica → Concepto Emergido

Ejemplo:
P: "¿Qué hace este código?"
P: "¿Qué pasa en línea 5?"
P: "¿Por qué retorna undefined?"
P: "Entonces... ¿qué le falta?"
E: "¡Ah! Falta el return"
```

### 2. La Pregunta Invertida

```
Estudiante: "¿Cómo hago X?"
Profesor: "Buena pregunta. ¿Qué has intentado?"
Estudiante: "Probé Y pero no funcionó"
Profesor: "¿Por qué crees que Y no funcionó?"
Estudiante: "Porque..."
Profesor: "Interesante. Entonces, ¿qué sería lo opuesto a Y?"
```

### 3. El Ping-Pong Conceptual

```
P: "¿Qué es un array?"
E: "Una lista"
P: "¿Qué es una lista?"
E: "Colección de elementos"
P: "¿Los elementos tienen orden?"
E: "Sí"
P: "¿Cómo accedes a un elemento específico?"
E: "Con un número"
P: "¿Cómo se llama ese número?"
E: "¡Índice!"
```

### 4. La Predicción

```
P: "Antes de ejecutar, ¿qué crees que va a pasar?"
E: "Va a imprimir 5"
P: [ejecuta] "Imprimió undefined. ¿Por qué crees?"
E: "Hmm..."
P: "¿Qué hace la función?"
E: "Suma dos números"
P: "¿Los imprime o los retorna?"
E: "Ah... los imprime, no los retorna"
P: "Exacto. ¿Cómo lo arreglamos?"
```

---

## Frases Útiles

### Para Guiar Sin Decir:
- "¿Qué has intentado hasta ahora?"
- "Interesante. ¿Por qué crees que pasó eso?"
- "¿Qué te dice el error?"
- "¿Qué pasa si...?"
- "Explícamelo con tus palabras"

### Para Profundizar:
- "¿Por qué?"
- "Dame un ejemplo"
- "¿En qué se diferencia de X?"
- "¿Qué pasaría si cambias Y?"

### Para Validar Razonamiento:
- "Buen pensamiento. ¿Cómo lo verificamos?"
- "Puede ser. ¿Cómo lo probarías?"
- "Interesante teoría. ¿Qué evidencia tienes?"

### Para Celebrar Descubrimiento:
- "¡Exacto! Llegaste solo a eso"
- "Ahí está. ¿Ves cómo lo descubriste?"
- "Perfecto razonamiento"

---

## Checklist de Preguntas Socráticas

Una buena pregunta socrática:

- [ ] Guía sin revelar respuesta
- [ ] Tiene una respuesta que el estudiante puede descubrir
- [ ] Construye sobre conocimiento previo
- [ ] Requiere pensar, no solo recordar
- [ ] Tiene follow-ups preparados
- [ ] Permite múltiples caminos de respuesta
- [ ] Evita preguntas de sí/no (en general)
- [ ] Fomenta explicación con propias palabras

---

## Timing en Clase

**Insertar checkpoints cada 5-7 minutos:**

```markdown
[3-4 minutos de contenido]

### ❓ Checkpoint

[Pregunta socrática nivel 2-3]

[Esperar respuestas]

[Continuar basado en respuestas]

---

[3-4 minutos más de contenido]

### ❓ Checkpoint

[Pregunta socrática nivel 3-4]

...
```

**Regla:** Máximo 7 minutos sin pregunta.