# Patrones Mermaid para Clases de Programación

## Flujos de Datos y Procesos

### Patrón: Flujo de Request-Response
```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend
    participant B as Backend
    participant D as Database
    
    U->>F: Click en botón
    F->>B: POST /api/data
    B->>D: SELECT * FROM tabla
    D-->>B: Datos
    B-->>F: JSON response
    F-->>U: Renderiza UI
```

### Patrón: Arquitectura de Aplicación Web
```mermaid
graph TB
    subgraph "Cliente (Navegador)"
        A[HTML/CSS]
        B[JavaScript]
    end
    
    subgraph "Servidor"
        C[Web Server<br/>Apache/Nginx]
        D[Backend<br/>PHP/Node]
    end
    
    subgraph "Datos"
        E[(Base de Datos<br/>MySQL)]
    end
    
    A --> B
    B --> C
    C --> D
    D --> E
    
    style A fill:#E3F2FD
    style D fill:#FFE5B4
    style E fill:#C8E6C9
```

### Patrón: Ciclo de Vida de Request HTTP
```mermaid
graph LR
    A[1. DNS<br/>Resolver] --> B[2. TCP<br/>Connection]
    B --> C[3. HTTP<br/>Request]
    C --> D[4. Server<br/>Processing]
    D --> E[5. HTTP<br/>Response]
    E --> F[6. Render<br/>Page]
    
    style A fill:#FFE5E5
    style C fill:#E3F2FD
    style E fill:#E8F5E9
```

### Patrón: Comparación de Metodologías
```mermaid
graph TB
    subgraph "Desarrollo Tradicional"
        A1[Análisis] --> A2[Diseño]
        A2 --> A3[Implementación]
        A3 --> A4[Deploy]
    end
    
    subgraph "Desarrollo Ágil"
        B1[Sprint Planning] --> B2[Desarrollo]
        B2 --> B3[Testing]
        B3 --> B4[Deploy]
        B4 --> B1
    end
    
    style A4 fill:#FFE5B4
    style B4 fill:#C8E6C9
```

## Estados y Transiciones

### Patrón: Estados de un Formulario
```mermaid
stateDiagram-v2
    [*] --> Vacío
    Vacío --> Llenando: Usuario escribe
    Llenando --> Validando: Submit
    Validando --> Error: Validación falla
    Validando --> Enviando: Validación pasa
    Error --> Llenando: Usuario corrige
    Enviando --> Éxito: Respuesta OK
    Enviando --> Error: Respuesta error
    Éxito --> [*]
```

### Patrón: Ciclo de Vida de Componente React
```mermaid
stateDiagram-v2
    [*] --> Mounting
    Mounting --> Mounted: componentDidMount()
    Mounted --> Updating: setState() / props change
    Updating --> Mounted: render()
    Mounted --> Unmounting: Component removed
    Unmounting --> [*]: componentWillUnmount()
```

## Timeline y Evolución

### Patrón: Historia de una Tecnología
```mermaid
timeline
    title Evolución de JavaScript
    1995 : Creación de LiveScript
         : Netscape Navigator
    1997 : ECMAScript 1
         : Estándar oficial
    2009 : Node.js
         : JavaScript en servidor
    2015 : ES6/ES2015
         : Clases Arrow functions
    2024 : Estado Actual
         : TypeScript React Vue
```

### Patrón: Roadmap de Curso
```mermaid
timeline
    title Cronograma PRO301
    Mes 1 : HTML CSS
          : Fundamentos Web
          : SEO básico
    Mes 2 : JavaScript
          : Next.js React
          : PHP POO
    Mes 3 : Bases de Datos
          : SQL CRUD
          : Proyecto Final
```

## Mindmaps Conceptuales

### Patrón: Desglose de Tecnología
```mermaid
mindmap
  root((Next.js))
    Routing
      File-based
      Dynamic routes
      API routes
    Rendering
      SSR Server Side
      SSG Static
      ISR Incremental
    Features
      Image optimization
      Font optimization
      Built-in CSS
    Ecosystem
      React base
      TypeScript support
      Vercel deploy
```

### Patrón: Comparación de Conceptos
```mermaid
mindmap
  root((CSS Layout))
    Flexbox
      1D Layout
      Align items
      Justify content
      Flexible sizing
    Grid
      2D Layout
      Template areas
      Gap spacing
      Auto-fit columns
    Position
      Static
      Relative
      Absolute
      Fixed Sticky
```

## Diagramas de Relaciones (ERD)

### Patrón: Modelo de Datos Básico
```mermaid
erDiagram
    USUARIO ||--o{ PEDIDO : realiza
    PEDIDO ||--|{ ITEM_PEDIDO : contiene
    PRODUCTO ||--o{ ITEM_PEDIDO : es
    
    USUARIO {
        int id PK
        string nombre
        string email UK
        datetime created_at
    }
    
    PEDIDO {
        int id PK
        int usuario_id FK
        decimal total
        string estado
        datetime fecha
    }
    
    PRODUCTO {
        int id PK
        string nombre
        decimal precio
        int stock
    }
    
    ITEM_PEDIDO {
        int id PK
        int pedido_id FK
        int producto_id FK
        int cantidad
        decimal subtotal
    }
```

### Patrón: Relaciones de Autenticación
```mermaid
erDiagram
    USUARIO ||--o{ SESION : tiene
    USUARIO ||--o{ ROL_USUARIO : posee
    ROL ||--o{ ROL_USUARIO : asigna
    ROL ||--o{ PERMISO : incluye
    
    USUARIO {
        int id PK
        string username UK
        string password_hash
        boolean activo
    }
    
    SESION {
        int id PK
        int usuario_id FK
        string token
        datetime expira
    }
    
    ROL {
        int id PK
        string nombre
        string descripcion
    }
```

## Diagramas de Clases (OOP)

### Patrón: Jerarquía de Clases
```mermaid
classDiagram
    Animal <|-- Perro
    Animal <|-- Gato
    Animal : +string nombre
    Animal : +int edad
    Animal : +comer()
    Animal : +dormir()
    
    class Perro{
        +string raza
        +ladrar()
    }
    
    class Gato{
        +string color
        +maullar()
    }
```

### Patrón: MVC (Modelo-Vista-Controlador)
```mermaid
classDiagram
    Controller --> Model
    Controller --> View
    View --> Model
    
    class Model{
        +getData()
        +saveData()
        +validateData()
    }
    
    class View{
        +render()
        +update()
        +displayError()
    }
    
    class Controller{
        +handleRequest()
        +processInput()
        +updateView()
    }
```

## Gantt Charts (Comparaciones Temporales)

### Patrón: Comparación de Enfoques de Desarrollo
```mermaid
gantt
    title Tiempo de Desarrollo: Vanilla JS vs Framework
    dateFormat YYYY-MM-DD
    
    section Vanilla JavaScript
    Setup proyecto       :a1, 2024-01-01, 1d
    Desarrollo features  :a2, after a1, 20d
    Testing             :a3, after a2, 5d
    Deploy              :a4, after a3, 2d
    
    section Con Framework (Next.js)
    Setup proyecto       :b1, 2024-01-01, 2d
    Desarrollo features  :b2, after b1, 12d
    Testing             :b3, after b2, 3d
    Deploy              :b4, after b3, 1d
```

### Patrón: Sprint Planning
```mermaid
gantt
    title Sprint 1 - Desarrollo de Features
    dateFormat YYYY-MM-DD
    
    section Planning
    Definir historias    :p1, 2024-01-01, 1d
    
    section Development
    Feature A: Login     :d1, after p1, 3d
    Feature B: Dashboard :d2, after d1, 4d
    Feature C: Reports   :d3, after d2, 3d
    
    section Testing
    QA y Bugs           :t1, after d3, 2d
    
    section Review
    Sprint Review       :milestone, r1, after t1, 0d
```

## Diagramas de Flujo de Usuario

### Patrón: User Journey
```mermaid
journey
    title Proceso de Compra Online
    section Exploración
      Ver productos: 5: Cliente
      Filtrar categorías: 4: Cliente
      Ver detalles: 5: Cliente
    section Compra
      Agregar al carrito: 4: Cliente
      Ir a checkout: 5: Cliente
      Llenar formulario: 2: Cliente
    section Pago
      Seleccionar método: 3: Cliente
      Confirmar pago: 5: Cliente, Sistema
      Recibir confirmación: 5: Cliente
```

## Git Flow y Branching

### Patrón: Git Workflow
```mermaid
gitgraph
    commit
    branch develop
    checkout develop
    commit
    branch feature-login
    checkout feature-login
    commit
    commit
    checkout develop
    merge feature-login
    branch feature-dashboard
    checkout feature-dashboard
    commit
    checkout develop
    merge feature-dashboard
    checkout main
    merge develop tag: "v1.0"
```

## Diagramas de Paquetes/Módulos

### Patrón: Estructura de Proyecto Next.js
```mermaid
graph TB
    subgraph "app/"
        A[page.tsx<br/>Home]
        B[layout.tsx<br/>Root Layout]
        C["(auth)/<br/>Login/Register"]
        D["dashboard/<br/>Admin Panel"]
    end
    
    subgraph "components/"
        E[Header.tsx]
        F[Footer.tsx]
        G[Card.tsx]
    end
    
    subgraph "lib/"
        H[db.ts<br/>Database]
        I[utils.ts<br/>Helpers]
    end
    
    A --> E
    A --> F
    D --> G
    A --> I
    D --> H
    
    style A fill:#E3F2FD
    style D fill:#FFE5B4
    style H fill:#C8E6C9
```

## Consejos de Uso

1. **Mantener diagramas simples:** Máximo 7-10 nodos por diagrama
2. **Usar colores consistentes:** Mismo color para mismo tipo de elemento
3. **Agregar leyendas cuando sea necesario**
4. **Priorizar claridad sobre complejidad**
5. **Usar subgrafos para agrupar elementos relacionados**
6. **Incluir títulos descriptivos**

## Colores Recomendados

```mermaid
graph LR
    A[Frontend<br/>UI/UX] --> B[Backend<br/>Lógica]
    B --> C[Base de Datos<br/>Persistencia]
    D[API<br/>Comunicación] --> B
    
    style A fill:#E3F2FD
    style B fill:#FFE5B4
    style C fill:#C8E6C9
    style D fill:#F3E5F5
```

- `#E3F2FD` - Azul claro (Frontend/Cliente)
- `#FFE5B4` - Naranja claro (Backend/Servidor)
- `#C8E6C9` - Verde claro (Base de Datos)
- `#F3E5F5` - Morado claro (APIs/Comunicación)
- `#FFE5E5` - Rojo claro (Errores/Advertencias)
- `#FFF9C4` - Amarillo claro (Decisiones/Condicionales)