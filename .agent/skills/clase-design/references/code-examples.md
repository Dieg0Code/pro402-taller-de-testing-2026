# Patrones de Ejemplos de Código para Enseñanza

## Principios de Buenos Ejemplos de Código

1. **Progresión:** De simple a complejo
2. **Comentarios pedagógicos:** Explicar el "por qué", no solo el "qué"
3. **Casos de uso realistas:** Contextos que los estudiantes reconozcan
4. **Errores comunes:** Mostrar qué NO hacer

## Patrón 1: Ejemplo Mínimo → Ejemplo Completo

### HTML: Formulario

#### Versión Mínima (Concepto base)
```html
<!-- Formulario más simple posible -->
<form>
  <input type="text" name="nombre">
  <button>Enviar</button>
</form>
```

#### Versión Mejorada (Prácticas básicas)
```html
<!-- Formulario con labels y tipos apropiados -->
<form>
  <label for="nombre">Nombre:</label>
  <input type="text" id="nombre" name="nombre" required>
  
  <label for="email">Email:</label>
  <input type="email" id="email" name="email" required>
  
  <button type="submit">Enviar</button>
</form>
```

#### Versión Completa (Producción)
```html
<!-- Formulario completo con validación y accesibilidad -->
<form action="/api/contact" method="POST" class="contact-form">
  <div class="form-group">
    <label for="nombre">
      Nombre completo <span class="required">*</span>
    </label>
    <input 
      type="text" 
      id="nombre" 
      name="nombre" 
      required 
      minlength="2"
      maxlength="100"
      aria-describedby="nombre-help"
      placeholder="Ej: Juan Pérez"
    >
    <small id="nombre-help">Ingresa tu nombre y apellido</small>
  </div>
  
  <div class="form-group">
    <label for="email">
      Email <span class="required">*</span>
    </label>
    <input 
      type="email" 
      id="email" 
      name="email" 
      required
      pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
      aria-describedby="email-help"
      placeholder="ejemplo@dominio.com"
    >
    <small id="email-help">Usaremos este email para contactarte</small>
  </div>
  
  <button type="submit" class="btn btn-primary">
    Enviar mensaje
  </button>
</form>
```

## Patrón 2: Antes/Después (Refactoring)

### JavaScript: Función con Lógica Duplicada

#### ❌ Antes (Código con problemas)
```javascript
// Problema: Código duplicado, difícil de mantener
function calcularDescuentoEstudiante(precio) {
  let descuento = precio * 0.15;
  let precioFinal = precio - descuento;
  return precioFinal;
}

function calcularDescuentoProfesor(precio) {
  let descuento = precio * 0.20;
  let precioFinal = precio - descuento;
  return precioFinal;
}

function calcularDescuentoAdultoMayor(precio) {
  let descuento = precio * 0.25;
  let precioFinal = precio - descuento;
  return precioFinal;
}
```

#### ✅ Después (Código mejorado)
```javascript
// Solución: Función reutilizable con parámetros
function calcularPrecioConDescuento(precio, porcentajeDescuento) {
  const descuento = precio * (porcentajeDescuento / 100);
  const precioFinal = precio - descuento;
  return precioFinal;
}

// Uso:
const precioEstudiante = calcularPrecioConDescuento(100, 15);  // 15% descuento
const precioProfesor = calcularPrecioConDescuento(100, 20);    // 20% descuento
const precioAdultoMayor = calcularPrecioConDescuento(100, 25); // 25% descuento
```

## Patrón 3: Scaffolding (Construcción Paso a Paso)

### CSS: Layout con Flexbox

#### Paso 1: HTML Base
```html
<div class="container">
  <div class="item">Item 1</div>
  <div class="item">Item 2</div>
  <div class="item">Item 3</div>
</div>
```

#### Paso 2: Convertir a Flexbox
```css
/* Activar flexbox en el contenedor */
.container {
  display: flex;
}

/* Resultado: Items en fila horizontal (default) */
```

#### Paso 3: Ajustar Dirección
```css
.container {
  display: flex;
  flex-direction: column; /* Ahora en columna vertical */
}
```

#### Paso 4: Centrar Contenido
```css
.container {
  display: flex;
  flex-direction: column;
  align-items: center;     /* Centrar horizontalmente */
  justify-content: center; /* Centrar verticalmente */
  height: 100vh;           /* Altura completa de viewport */
}
```

#### Paso 5: Espaciado entre Items
```css
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 20px; /* Espacio de 20px entre cada item */
}
```

## Patrón 4: Comparación de Enfoques

### JavaScript: Manejo de Arrays

#### Enfoque 1: For Loop Tradicional
```javascript
// Método imperativo: Decimos CÓMO hacer cada paso
const numeros = [1, 2, 3, 4, 5];
const dobles = [];

for (let i = 0; i < numeros.length; i++) {
  dobles.push(numeros[i] * 2);
}

console.log(dobles); // [2, 4, 6, 8, 10]

// Pros: Muy explícito, control total
// Contras: Verbose, más código, más propenso a errores
```

#### Enfoque 2: Array.map() (Recomendado)
```javascript
// Método declarativo: Decimos QUÉ queremos
const numeros = [1, 2, 3, 4, 5];
const dobles = numeros.map(numero => numero * 2);

console.log(dobles); // [2, 4, 6, 8, 10]

// Pros: Conciso, claro, inmutable, menos errores
// Contras: Requiere entender funciones de alto orden
```

#### ¿Cuándo usar cada uno?
```javascript
// Usa for cuando:
// - Necesitas break/continue
// - Necesitas modificar el índice manualmente
for (let i = 0; i < datos.length; i++) {
  if (datos[i] === 'STOP') break;
  // ...
}

// Usa .map() cuando:
// - Quieres transformar cada elemento
// - Necesitas un nuevo array
// - El código es más legible
const nombres = usuarios.map(u => u.nombre);
```

## Patrón 5: Caso de Uso Realista

### PHP: Conexión a Base de Datos

#### Contexto
```
Caso: Sistema de Login de Usuario
Usuario ingresa email y contraseña
Sistema debe verificar credenciales en la base de datos
```

#### Código Completo con Contexto
```php
<?php
// config/database.php
// Configuración centralizada de la conexión

class Database {
    private $host = 'localhost';
    private $db_name = 'mi_app';
    private $username = 'root';
    private $password = '';
    private $conn;
    
    /**
     * Obtiene la conexión a la base de datos
     * Usa PDO para seguridad contra SQL injection
     * 
     * @return PDO|null Conexión o null si falla
     */
    public function getConnection() {
        $this->conn = null;
        
        try {
            // DSN (Data Source Name): string de conexión
            $dsn = "mysql:host={$this->host};dbname={$this->db_name}";
            
            // Crear conexión PDO
            $this->conn = new PDO($dsn, $this->username, $this->password);
            
            // Configurar modo de error: lanzar excepciones
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            // Configurar charset UTF-8 para caracteres especiales
            $this->conn->exec("SET NAMES utf8");
            
        } catch(PDOException $e) {
            // Registrar error (en producción, usar logging adecuado)
            echo "Error de conexión: " . $e->getMessage();
        }
        
        return $this->conn;
    }
}

// models/Usuario.php
// Clase que maneja la lógica de usuarios

class Usuario {
    private $conn;
    private $table = 'usuarios';
    
    // Propiedades del objeto
    public $id;
    public $email;
    public $password;
    public $nombre;
    
    /**
     * Constructor: recibe conexión a DB
     */
    public function __construct($db) {
        $this->conn = $db;
    }
    
    /**
     * Verifica si un usuario existe con email y password dados
     * 
     * @return bool True si credenciales válidas, false si no
     */
    public function login() {
        // Query preparada (prepared statement) para prevenir SQL injection
        $query = "SELECT id, email, nombre, password 
                  FROM {$this->table} 
                  WHERE email = :email 
                  LIMIT 1";
        
        // Preparar statement
        $stmt = $this->conn->prepare($query);
        
        // Limpiar datos de entrada
        $this->email = htmlspecialchars(strip_tags($this->email));
        
        // Bind del parámetro :email
        $stmt->bindParam(':email', $this->email);
        
        // Ejecutar query
        $stmt->execute();
        
        // Obtener resultado
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Si usuario existe
        if ($row) {
            // Verificar password (asumiendo que está hasheado con password_hash)
            if (password_verify($this->password, $row['password'])) {
                // Credenciales correctas: cargar datos del usuario
                $this->id = $row['id'];
                $this->nombre = $row['nombre'];
                return true;
            }
        }
        
        // Credenciales incorrectas
        return false;
    }
}

// api/login.php
// Endpoint API que maneja el login

header('Content-Type: application/json');
require_once '../config/database.php';
require_once '../models/Usuario.php';

// Obtener datos del POST (JSON)
$data = json_decode(file_get_contents("php://input"));

// Validar que vengan los datos requeridos
if (!empty($data->email) && !empty($data->password)) {
    
    // Crear conexión a DB
    $database = new Database();
    $db = $database->getConnection();
    
    // Crear objeto Usuario
    $usuario = new Usuario($db);
    $usuario->email = $data->email;
    $usuario->password = $data->password;
    
    // Intentar login
    if ($usuario->login()) {
        // Login exitoso
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Login exitoso",
            "data" => [
                "id" => $usuario->id,
                "nombre" => $usuario->nombre,
                "email" => $usuario->email
            ]
        ]);
    } else {
        // Credenciales inválidas
        http_response_code(401);
        echo json_encode([
            "success" => false,
            "message" => "Email o contraseña incorrectos"
        ]);
    }
    
} else {
    // Datos incompletos
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Email y contraseña son requeridos"
    ]);
}
?>
```

## Patrón 6: Errores Comunes y Soluciones

### React: UseEffect con Dependencias

#### ❌ Error Común 1: Dependencias Faltantes
```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // ❌ PROBLEMA: userId en dependencias faltantes
    // Este efecto NO se vuelve a ejecutar cuando userId cambia
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => setUser(data));
  }, []); // Array vacío = solo ejecuta al montar
  
  return <div>{user?.name}</div>;
}
```

#### ✅ Solución
```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // ✅ CORRECTO: userId en array de dependencias
    // Efecto se ejecuta cada vez que userId cambia
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => setUser(data));
  }, [userId]); // Se ejecuta cuando userId cambia
  
  return <div>{user?.name}</div>;
}
```

#### ❌ Error Común 2: Loop Infinito
```jsx
function TodoList() {
  const [todos, setTodos] = useState([]);
  
  useEffect(() => {
    // ❌ PROBLEMA: Modifica 'todos' dentro del efecto
    // que depende de 'todos' = LOOP INFINITO
    fetch('/api/todos')
      .then(res => res.json())
      .then(data => setTodos(data));
  }, [todos]); // ¡Cada vez que cambia todos, se ejecuta de nuevo!
  
  return <ul>{/* ... */}</ul>;
}
```

#### ✅ Solución
```jsx
function TodoList() {
  const [todos, setTodos] = useState([]);
  
  useEffect(() => {
    // ✅ CORRECTO: Solo ejecuta una vez al montar
    fetch('/api/todos')
      .then(res => res.json())
      .then(data => setTodos(data));
  }, []); // Array vacío = solo al montar componente
  
  return <ul>{/* ... */}</ul>;
}
```

## Patrón 7: Código Comentado Pedagógicamente

### Next.js: API Route con Validación

```typescript
// app/api/products/route.ts
// API Route para manejar productos
// Métodos soportados: GET (listar), POST (crear)

import { NextRequest, NextResponse } from 'next/server';

// Interface para tipar el producto (TypeScript)
interface Product {
  id?: number;
  name: string;
  price: number;
  stock: number;
}

// Simulación de base de datos (en producción usar DB real)
let products: Product[] = [
  { id: 1, name: 'Laptop', price: 999, stock: 5 },
  { id: 2, name: 'Mouse', price: 25, stock: 50 }
];

/**
 * GET /api/products
 * Retorna todos los productos
 * 
 * Query params opcionales:
 * - minPrice: filtrar por precio mínimo
 * - maxPrice: filtrar por precio máximo
 */
export async function GET(request: NextRequest) {
  // Obtener parámetros de query string
  const { searchParams } = new URL(request.url);
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  
  // Filtrar productos si hay parámetros
  let filteredProducts = products;
  
  if (minPrice) {
    const min = parseFloat(minPrice);
    filteredProducts = filteredProducts.filter(p => p.price >= min);
  }
  
  if (maxPrice) {
    const max = parseFloat(maxPrice);
    filteredProducts = filteredProducts.filter(p => p.price <= max);
  }
  
  // Retornar respuesta JSON con status 200
  return NextResponse.json({
    success: true,
    count: filteredProducts.length,
    data: filteredProducts
  });
}

/**
 * POST /api/products
 * Crea un nuevo producto
 * 
 * Body esperado (JSON):
 * {
 *   "name": "string",
 *   "price": number,
 *   "stock": number
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Parsear body JSON
    const body: Product = await request.json();
    
    // Validación de campos requeridos
    if (!body.name || !body.price || !body.stock) {
      return NextResponse.json(
        {
          success: false,
          error: 'Faltan campos requeridos: name, price, stock'
        },
        { status: 400 } // 400 = Bad Request
      );
    }
    
    // Validación de tipos y rangos
    if (typeof body.price !== 'number' || body.price <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Price debe ser un número mayor a 0'
        },
        { status: 400 }
      );
    }
    
    if (typeof body.stock !== 'number' || body.stock < 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Stock debe ser un número mayor o igual a 0'
        },
        { status: 400 }
      );
    }
    
    // Crear nuevo producto
    const newProduct: Product = {
      id: products.length + 1, // Auto-incrementar ID
      name: body.name.trim(), // Limpiar espacios
      price: body.price,
      stock: body.stock
    };
    
    // Agregar a "base de datos"
    products.push(newProduct);
    
    // Retornar producto creado con status 201
    return NextResponse.json(
      {
        success: true,
        message: 'Producto creado exitosamente',
        data: newProduct
      },
      { status: 201 } // 201 = Created
    );
    
  } catch (error) {
    // Manejo de errores (ej: JSON inválido)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al procesar la solicitud'
      },
      { status: 500 } // 500 = Internal Server Error
    );
  }
}
```

## Consejos para Escribir Buenos Ejemplos

1. **Nombres descriptivos:** `calcularPrecioConDescuento` mejor que `calc`
2. **Comentarios útiles:** Explica el "por qué", no el "qué obvio"
3. **Casos edge:** Muestra qué pasa con inputs inválidos
4. **Consistencia:** Mismo estilo de código en todos los ejemplos
5. **Realismo:** Ejemplos que los estudiantes puedan usar en proyectos reales