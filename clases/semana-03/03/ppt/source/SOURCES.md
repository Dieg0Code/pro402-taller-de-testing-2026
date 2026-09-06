# Fuentes de recursos visuales

| Archivo local | Fuente | Uso |
| --- | --- | --- |
| `assets/logo-aiep.svg` | Identidad institucional AIEP incluida en el repositorio | Logo completo sobre fondos claros |
| `assets/logo-aiep-dark.png` | Variante institucional preparada para el módulo | Logo completo sobre fondos oscuros |

El deck no utiliza imágenes externas: las láminas se resuelven con composición, tipografía y la
paleta del sistema (`tools/slides-system/theme/tokens.js`). No se agregó ningún acento nuevo. Los
cuatro colores tienen un rol declarado en el fuente —navy es la especificación y lo que se declara,
oro es la técnica y la tabla que produce, rojo es la clase que quedó sin representante y el defecto
que se cuela por ahí, verde es lo que pasa—.

La identidad de la clase la carga la composición, y es la **reducción**: una tira de cuatro etapas
—todas las entradas, clases, límites, reglas combinadas— aparece en la portada y en cada divisor,
marcando en qué tramo de la contracción trabaja el bloque que se abre. En las láminas de código se
repite un segundo dispositivo de tres pasos —leer, predecir, comprobar— que indica qué se está
haciendo con el código que está en pantalla.

## Datos citados en el Bloque 1

| Dato | Fuente |
| --- | --- |
| El cálculo del multiplicador de 27 bits y sus 2^54 casos, la cifra de «más de 10 000 años», la expresión «testing by sampling», la advertencia sobre las clases enteras que quedan sin probar, la etiqueta «Corollary of the first part of this section» que encabeza la frase célebre, y la conclusión sobre no tratar el mecanismo como una caja negra | [Edsger W. Dijkstra — *Notes on Structured Programming* (EWD249), 2.ª edición, abril de 1970, sección «On the reliability of mechanisms»](https://www.cs.utexas.edu/~EWD/transcriptions/EWD02xx/EWD249/EWD249.html) |
| La definición de caso de prueba como conjunto de precondiciones, entradas y resultados esperados (cláusula 3.49), y la ubicación de las tres técnicas de la sesión entre las basadas en especificación (cláusula 5.2) | [ISO/IEC/IEEE 29119-4:2021](https://www.iso.org/standard/79430.html) |
| El costo medido por caso, el tamaño de los tres dominios, el conjunto de 194 cifras de `comprobante()`, el barrido exhaustivo de las 64 combinaciones declaradas con sus tres desacuerdos, la verificación de la aritmética de Dijkstra a cuatro velocidades, y la ejecución de la suite entregada | Ejecuciones registradas para esta clase sobre el proyecto de reserva de laboratorio |

## Datos citados en el Bloque 2

| Dato | Fuente |
| --- | --- |
| La definición de partición de equivalencia como «clase de entradas o salidas que se espera que el elemento de prueba trate de forma similar» (cláusula 3.28), y la ubicación de la técnica entre las basadas en especificación (cláusula 3.29) | [ISO/IEC/IEEE 29119-4:2021](https://www.iso.org/standard/79430.html) |
| La ejecución de la parametrización de tres clases: `collected 3 items`, `3 tests collected in 0.02s` y `3 passed in 0.02s`; y el diagnóstico completo al sustituir el representante `4` por `8` —`test_particiones.py:17`, `E assert False is True`, `FAILED ...[dentro-jornada]` y `1 failed, 2 passed in 0.09s`— | Ejecuciones registradas para esta clase |
| El comportamiento de una comparación sin `assert`, el efecto de `-O` sobre las aserciones, y la diferencia entre `1 == True` y `1 is True` | [Documentación de Python — sentencia `assert`](https://docs.python.org/3/reference/simple_stmts.html#the-assert-statement) · comprobado en la ejecución |
| La sintaxis de la parametrización, el papel de `ids`, y las opciones `--collect-only`, `-q`, `-v`, `--tb=short` y `-k` | [Documentación de `@pytest.mark.parametrize`](https://docs.pytest.org/en/stable/how-to/parametrize.html) · comprobado en la ejecución |

## Datos citados en el Bloque 3

| Dato | Fuente |
| --- | --- |
| La definición del análisis de valores límite como técnica basada en especificación que ejercita «los límites de las particiones de equivalencia» (cláusula 3.3) | [ISO/IEC/IEEE 29119-4:2021](https://www.iso.org/standard/79430.html) |
| La distinción entre la variante de dos valores y la de tres valores, y su nomenclatura | Syllabus ISTQB CTFL v4.0.1, sección 4.2.2. La definición breve de ISO no separa las variantes; la atribución se hace explícita en la lámina |
| El estudio empírico sobre eficacia comparada de lectura de código, pruebas funcionales y pruebas estructurales: 47 estudiantes, programas pequeños en C, eficacia individual ampliamente similar, dependiente del programa y sus defectos, y mayor al combinar técnicas | Marc Roper, Murray Wood y James Miller (1997), Universidad de Strathclyde. Se cita con su alcance intacto: no aísla el efecto de los valores límite ni mide qué proporción de defectos vive en bordes |
| Los desacuerdos de cada variante frente a `bloque_valido_solo_extremos()`, el `4 passed` de la suite con límites copiados del código, el `1 failed, 3 passed` de la suite con límites del requisito, el barrido de la anticipación al microsegundo, la salida de `sum([0.1, 0.2])` y la sensibilidad de `approx` a dos tolerancias | Ejecuciones registradas para esta clase |
| El comportamiento de `pytest.approx`, el significado de `abs` y `rel`, y que con ambas configuradas se acepta si se cumple cualquiera | [Documentación de `pytest.approx`](https://docs.pytest.org/en/stable/reference/reference.html#pytest-approx) · comprobado en la ejecución |

## Datos citados en el Bloque 4 y el cierre

| Dato | Fuente |
| --- | --- |
| La distinción entre la tabla de decisión (cláusula 3.23), la regla de decisión (3.22) y la técnica de prueba con tabla de decisión (3.24) | [ISO/IEC/IEEE 29119-4:2021](https://www.iso.org/standard/79430.html) |
| El desarrollo de la construcción y reducción de una tabla de decisión | Syllabus ISTQB CTFL v4.0.1, sección 4.2.3 |
| La verificación de la reducción sobre las ocho combinaciones —`{'R1': 4, 'R2': 2, 'R3': 1, 'R4': 1}`, sin huecos, sin solapamientos y sin desacuerdos—, el `1 failed, 4 passed` al agregar el quinto caso con el bloque 8, el `2 passed` de la prueba con `raises`, el `DID NOT RAISE ValueError` al sustituir el `raise` por un `return`, y el `1 passed` de la prueba que captura su propio fallo | Ejecuciones registradas para esta clase |
| El comportamiento de `pytest.raises` como gestor de contexto, el argumento `match` y la aceptación de subclases de la excepción declarada | [Documentación de `pytest.raises`](https://docs.pytest.org/en/stable/reference/reference.html#pytest-raises) · comprobado en la ejecución |
| Que `AssertionError` es una subclase de `Exception` | [Jerarquía de excepciones de Python](https://docs.python.org/3/library/exceptions.html#exception-hierarchy) · comprobado en la ejecución |
| El vocabulario equivalente de otros entornos: `expect(...).toBe(...)` y `toThrow` en Vitest, `assertThat(...).isTrue()` en AssertJ, y el estilo `should` de Chai | [Vitest — expect](https://vitest.dev/api/expect.html) · [AssertJ](https://assertj.github.io/doc/) · [Chai — should](https://www.chaijs.com/guide/styles/) |

## Nota sobre las ejecuciones

Todas las salidas citadas en el deck se ejecutaron para esta clase sobre el proyecto de reserva de
laboratorio, con **Python 3.12.12 y pytest 9.1.1**. Las láminas muestran fragmentos literales: se
omiten encabezados, barras de progreso y separadores, y no se edita ninguna cifra. Cuando una
ejecución se hizo sobre una copia modificada del proyecto —la implementación que acepta solo los
extremos, o la que sustituye el `raise` por un `return`— la lámina lo declara.

## Nota sobre las citas

Las citas en inglés aparecen en el deck en su idioma original y con su traducción al español
inmediatamente debajo, con el sello «traducción del original en inglés» en la línea de fuente. Los
textos literales completos, sin recorte, están en el `README.md` de la clase, que es el registro.
