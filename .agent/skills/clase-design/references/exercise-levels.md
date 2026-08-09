# Sistema de 4 Niveles de Ejercicios

## Filosofía del Sistema

**Objetivo:** Que CADA estudiante encuentre su zona de desarrollo próximo.

- 🟢 **Nivel 1:** Para quien se siente perdido → Éxito garantizado
- 🟡 **Nivel 2:** Para quien entiende pero necesita guía → Confianza
- 🟠 **Nivel 3:** Para quien se siente seguro → Desafío justo
- 🔴 **Nivel 4:** Para quien quiere más → Flow state

**Regla de oro:** Estudiante puede cambiar de nivel en cualquier momento.

---

## Template Genérico

```markdown
## 🎯 Ejercicio: [Nombre del Ejercicio]

### Contexto
[Caso de uso realista, 2-3 líneas]

### Tu Misión
[Objetivo concreto y medible]

---

### 🟢 Nivel 1 - Código Guiado
**Para:** Primera vez con este concepto

[Template con espacios en blanco]

**Tiempo estimado:** [X] minutos
**Pista:** [Guía específica]

---

### 🟡 Nivel 2 - Estructura Dada  
**Para:** Entiendes el concepto pero necesitas scaffolding

[Estructura con TODOs]

**Tiempo estimado:** [X] minutos
**Pista:** [Concepto clave a recordar]

---

### 🟠 Nivel 3 - Solo Requisitos
**Para:** Te sientes seguro con el concepto

[Lista de requisitos funcionales]

**Tiempo estimado:** [X] minutos
**Validación:** [Cómo saber si está correcto]

---

### 🔴 Nivel 4 - Problema Abierto
**Para:** Quieres desafío real

[Descripción de problema complejo]

**Tiempo estimado:** [X] minutos
**Bonus:** [Extensión creativa]

---

### 💡 Recomendaciones
- Si terminas en < 10 min → Sube un nivel
- Si estás atorado > 15 min → Baja un nivel
- Pide ayuda después de intentar 10-15 min
```

---

## Ejemplos Concretos por Tema

### JavaScript: Arrays y Funciones

```markdown
## 🎯 Ejercicio: Sistema de Calificaciones

### Contexto
Eres profe y necesitas calcular el promedio de calificaciones de tus estudiantes y determinar quiénes aprobaron (nota ≥ 4.0).

### Tu Misión
Crear funciones para procesar un array de calificaciones.

---

### 🟢 Nivel 1 - Código Guiado

**Completa los espacios en blanco:**

```javascript
// Array de calificaciones
const notas = [5.5, 3.2, 6.1, 4.0, 2.8, 5.9]

// Función 1: Calcular promedio
function calcularPromedio(arrayNotas) {
  let suma = ___
  
  for (let i = 0; i < arrayNotas.___; i++) {
    suma += arrayNotas[___]
  }
  
  return suma / arrayNotas.___
}

// Función 2: Filtrar aprobados (nota >= 4.0)
function filtrarAprobados(arrayNotas) {
  const aprobados = []
  
  for (let i = 0; i < arrayNotas.length; i++) {
    if (arrayNotas[i] >= ___) {
      aprobados.___(arrayNotas[i])
    }
  }
  
  return aprobados
}

// Llamar funciones
const promedio = calcularPromedio(___)
const aprobados = filtrarAprobados(___)

console.log("Promedio:", ___)
console.log("Aprobados:", ___)
```

**Pistas:**
- `___` en línea 4: ¿Con qué valor inicial empiezas a sumar?
- `arrayNotas.___` en línea 6: ¿Qué propiedad te da el tamaño del array?
- `>=` en línea 15: Nota mínima para aprobar es 4.0

**Tiempo estimado:** 10-15 minutos

---

### 🟡 Nivel 2 - Estructura Dada

**Implementa las funciones según los TODOs:**

```javascript
const notas = [5.5, 3.2, 6.1, 4.0, 2.8, 5.9]

function calcularPromedio(arrayNotas) {
  // TODO: Crear variable suma = 0
  
  // TODO: Recorrer array con for loop
  //       Sumar cada nota a la variable suma
  
  // TODO: Retornar suma dividido por cantidad de notas
}

function filtrarAprobados(arrayNotas) {
  // TODO: Crear array vacío para guardar aprobados
  
  // TODO: Recorrer array de notas
  //       Si nota >= 4.0, agregarla al array de aprobados
  
  // TODO: Retornar array de aprobados
}

// TODO: Llamar calcularPromedio con el array notas
// TODO: Llamar filtrarAprobados con el array notas
// TODO: Imprimir resultados con console.log
```

**Pistas:**
- Usa `for (let i = 0; i < array.length; i++)`
- Para agregar a array: `array.push(elemento)`
- Para dividir: `suma / cantidad`

**Tiempo estimado:** 15-20 minutos

---

### 🟠 Nivel 3 - Solo Requisitos

**Requisitos funcionales:**

- [ ] Función `calcularPromedio(array)` que retorne el promedio
- [ ] Función `filtrarAprobados(array)` que retorne solo notas ≥ 4.0
- [ ] Función `contarReprobados(array)` que retorne cantidad de notas < 4.0
- [ ] Imprimir:
  - Promedio del curso
  - Lista de notas aprobadas
  - Cantidad de reprobados

**Input:** `[5.5, 3.2, 6.1, 4.0, 2.8, 5.9]`

**Output esperado:**
```
Promedio: 4.58
Aprobados: [5.5, 6.1, 4.0, 5.9]
Reprobados: 2
```

**Validación:**
- Promedio debe ser número con decimales
- Array aprobados debe tener solo notas ≥ 4.0
- Contador debe ser exacto

**Tiempo estimado:** 20-25 minutos

---

### 🔴 Nivel 4 - Problema Abierto

**Desafío:**

Crea un **Sistema Completo de Gestión de Calificaciones** que incluya:

**Features obligatorias:**
1. Calcular promedio
2. Filtrar por rangos:
   - Excelente: 6.0-7.0
   - Bueno: 5.0-5.9
   - Suficiente: 4.0-4.9
   - Insuficiente: < 4.0
3. Encontrar nota más alta y más baja
4. Calcular mediana
5. Mostrar distribución de notas (cuántos en cada rango)

**Features bonus:**
- Calcular desviación estándar
- Detectar outliers (notas muy alejadas del promedio)
- Generar "curva" (agregar puntos a todos si promedio < 4.0)
- Ordenar notas de mayor a menor
- Validar que todas las notas estén entre 1.0 y 7.0

**Output esperado:**
```
=== REPORTE DE CALIFICACIONES ===
Promedio: 4.58
Mediana: 4.75
Nota más alta: 6.1
Nota más baja: 2.8

Distribución:
  Excelente (6.0-7.0): 1 estudiante
  Bueno (5.0-5.9): 2 estudiantes
  Suficiente (4.0-4.9): 1 estudiante
  Insuficiente (< 4.0): 2 estudiantes
```

**Tiempo estimado:** 40-60 minutos

**Bonus creativo:**
- Visualización ASCII de distribución
- Interfaz HTML simple para ingresar notas
- Exportar reporte a formato texto

---
```

---

### React: useState Hook

```markdown
## 🎯 Ejercicio: Contador Interactivo

### Contexto
Necesitas crear un componente de contador que se use en una app de gimnasio para contar repeticiones de ejercicios.

### Tu Misión
Crear contador que se pueda incrementar, decrementar y resetear.

---

### 🟢 Nivel 1 - Código Guiado

**Completa el código:**

```jsx
import { useState } from 'react'

function Contador() {
  // Crea state con valor inicial 0
  const [___, ___] = useState(___)
  
  return (
    <div>
      <h1>Repeticiones: {___}</h1>
      
      <button onClick={() => ___(cuenta + 1)}>
        ➕ Incrementar
      </button>
      
      <button onClick={() => ___(cuenta - 1)}>
        ➖ Decrementar
      </button>
      
      <button onClick={() => ___(___)}>
        🔄 Resetear
      </button>
    </div>
  )
}

export default Contador
```

**Pistas:**
- `useState(0)` retorna `[valor, funcionParaCambiar]`
- Nombres típicos: `[cuenta, setCuenta]`
- Reset debe volver a 0

**Tiempo estimado:** 10 minutos

---

### 🟡 Nivel 2 - Estructura Dada

**Implementa según TODOs:**

```jsx
import { useState } from 'react'

function Contador() {
  // TODO: Crear state 'cuenta' con useState(0)
  
  // TODO: Función para incrementar (cuenta + 1)
  function incrementar() {
    // Tu código
  }
  
  // TODO: Función para decrementar (cuenta - 1)
  function decrementar() {
    // Tu código
  }
  
  // TODO: Función para resetear (volver a 0)
  function resetear() {
    // Tu código
  }
  
  return (
    <div>
      {/* TODO: Mostrar cuenta actual */}
      <h1>Repeticiones: ???</h1>
      
      {/* TODO: Botón que llama incrementar */}
      <button>➕ Incrementar</button>
      
      {/* TODO: Botón que llama decrementar */}
      <button>➖ Decrementar</button>
      
      {/* TODO: Botón que llama resetear */}
      <button>🔄 Resetear</button>
    </div>
  )
}

export default Contador
```

**Tiempo estimado:** 15-20 minutos

---

### 🟠 Nivel 3 - Solo Requisitos

**Requisitos:**

- [ ] Componente `Contador` con state inicial = 0
- [ ] Botón "Incrementar" que suma 1
- [ ] Botón "Decrementar" que resta 1
- [ ] Botón "Resetear" que vuelve a 0
- [ ] Validación: No permitir números negativos
- [ ] Mostrar mensaje si llega a 10: "¡Meta alcanzada! 🎉"

**Comportamiento esperado:**
- Click +5 veces → cuenta = 5
- Click - 1 vez → cuenta = 4  
- Click "Reset" → cuenta = 0
- Click - cuando está en 0 → cuenta sigue en 0 (no negativo)

**Tiempo estimado:** 25 minutos

---

### 🔴 Nivel 4 - Problema Abierto

**Desafío: Contador Avanzado de Ejercicios**

**Features obligatorias:**
1. Incremento/Decremento por cantidad personalizada (input)
2. Historial de cambios (log de acciones)
3. Meta personalizable (input)
4. Progreso visual (barra de progreso %)
5. Tiempo transcurrido desde inicio
6. Botón "Guardar sesión" que persiste en localStorage

**Features bonus:**
- Múltiples contadores (diferentes ejercicios)
- Gráfico de progreso
- Sound effects al alcanzar meta
- Modo oscuro
- Exportar historial

**UI sugerida:**
```
┌────────────────────────────┐
│ 🏋️ Contador de Ejercicios  │
├────────────────────────────┤
│ Flexiones: 23/30          │
│ [████████████░░░░░] 76%   │
│                           │
│ [➕5] [➕1] [-1] [-5]      │
│ [🔄 Reset] [💾 Guardar]   │
│                           │
│ ⏱️ Tiempo: 05:23          │
│                           │
│ Historial:                │
│ • 13:45 - Incremento +1   │
│ • 13:44 - Decremento -1   │
└────────────────────────────┘
```

**Tiempo estimado:** 60-90 minutos

---
```

---

### PHP: Funciones y Arrays

```markdown
## 🎯 Ejercicio: Sistema de Productos

### Contexto
Tienes una tienda online y necesitas procesar un array de productos para mostrar información y calcular totales.

---

### 🟢 Nivel 1 - Código Guiado

```php
<?php
// Array de productos
$productos = [
  ["nombre" => "Laptop", "precio" => 500, "stock" => 3],
  ["nombre" => "Mouse", "precio" => 20, "stock" => 15],
  ["nombre" => "Teclado", "precio" => 45, "stock" => 8]
];

// Función: Calcular valor total del inventario
function calcularValorTotal($productos) {
  $total = ___;
  
  foreach ($productos as $___) {
    $valorProducto = $producto["___"] * $producto["___"];
    $total += ___;
  }
  
  return $___;
}

// Función: Encontrar producto más caro
function productoMasCaro($productos) {
  $masCaro = $productos[___]; // Primero del array
  
  foreach ($productos as $producto) {
    if ($producto["precio"] > $___["precio"]) {
      $___ = $producto;
    }
  }
  
  return $___;
}

// Llamar funciones
$total = ___($ productos);
$caro = ___($ productos);

echo "Valor total inventario: $" . $___ . "\n";
echo "Producto más caro: " . $___["nombre"];
?>
```

**Tiempo estimado:** 15 minutos

---

### 🟡 Nivel 2 - Estructura Dada

```php
<?php
$productos = [
  ["nombre" => "Laptop", "precio" => 500, "stock" => 3],
  ["nombre" => "Mouse", "precio" => 20, "stock" => 15],
  ["nombre" => "Teclado", "precio" => 45, "stock" => 8]
];

function calcularValorTotal($productos) {
  // TODO: Crear variable $total = 0
  
  // TODO: Recorrer array de productos con foreach
  //       Calcular: precio * stock de cada producto
  //       Sumar al total
  
  // TODO: Retornar total
}

function productoMasCaro($productos) {
  // TODO: Guardar primer producto como $masCaro
  
  // TODO: Recorrer todos los productos
  //       Si precio > precio de $masCaro
  //       Actualizar $masCaro
  
  // TODO: Retornar $masCaro
}

function contarProductosSinStock($productos) {
  // TODO: Crear contador = 0
  
  // TODO: Recorrer productos
  //       Si stock == 0, incrementar contador
  
  // TODO: Retornar contador
}

// TODO: Llamar funciones e imprimir resultados
?>
```

**Tiempo estimado:** 20 minutos

---

### 🟠 Nivel 3 - Solo Requisitos

**Requisitos:**

Array de productos dado:
```php
$productos = [
  ["nombre" => "Laptop", "precio" => 500, "stock" => 3],
  ["nombre" => "Mouse", "precio" => 20, "stock" => 15],
  ["nombre" => "Teclado", "precio" => 45, "stock" => 8],
  ["nombre" => "Monitor", "precio" => 200, "stock" => 0]
];
```

Crear funciones:
- [ ] `calcularValorTotal($productos)` → Suma de (precio × stock)
- [ ] `productoMasCaro($productos)` → Producto con precio más alto
- [ ] `productoMasBarato($productos)` → Producto con precio más bajo
- [ ] `productosConStock($productos)` → Array de productos con stock > 0
- [ ] `productosSinStock($productos)` → Array de productos con stock = 0

**Output esperado:**
```
Valor total inventario: $2660
Producto más caro: Laptop ($500)
Producto más barato: Mouse ($20)
Productos disponibles: 3
Productos sin stock: 1
```

**Tiempo estimado:** 30 minutos

---

### 🔴 Nivel 4 - Problema Abierto

**Desafío: Sistema Completo de Inventario**

**Features:**
1. CRUD de productos (Create, Read, Update, Delete)
2. Búsqueda por nombre (búsqueda parcial, case-insensitive)
3. Filtros:
   - Por rango de precio
   - Por disponibilidad de stock
   - Por categoría (agregar campo categoría)
4. Ordenamiento:
   - Por precio (asc/desc)
   - Por nombre (alfabético)
   - Por stock
5. Alertas:
   - Stock bajo (< 5 unidades)
   - Productos sin stock
6. Reportes:
   - Valor total por categoría
   - Productos más vendidos (agregar campo vendidos)

**Bonus:**
- Guardar en JSON file
- Interfaz HTML simple para gestionar
- Sistema de descuentos por cantidad
- Historial de cambios

**Tiempo estimado:** 90+ minutos

---
```

---

## Checklist de Calidad

Al crear ejercicios multinivel, verificar:

### Nivel 1 (Guiado):
- [ ] Tiene espacios en blanco claros
- [ ] Pistas específicas para cada blank
- [ ] Tiempo estimado realista (10-15 min)
- [ ] Éxito garantizado si sigue pistas

### Nivel 2 (Estructura):
- [ ] TODOs describen QUÉ hacer, no CÓMO
- [ ] Estructura completa del código
- [ ] Nombres de funciones/variables dados
- [ ] Pistas conceptuales (no solución directa)

### Nivel 3 (Requisitos):
- [ ] Lista clara de requisitos funcionales
- [ ] Output esperado explícito
- [ ] Criterios de validación
- [ ] Sin código de ejemplo

### Nivel 4 (Abierto):
- [ ] Problema realista y complejo
- [ ] Múltiples formas de resolver
- [ ] Features bonus opcionales
- [ ] Estimación de tiempo honesta

### General:
- [ ] Progresión lógica entre niveles
- [ ] Cada nivel es 30-50% más complejo
- [ ] Contexto realista y motivador
- [ ] Instrucciones claras de cuándo cambiar nivel