# Fuentes de recursos visuales

| Archivo local | Fuente | Uso |
| --- | --- | --- |
| `assets/logo-aiep.svg` | Identidad institucional AIEP incluida en el repositorio | Logo completo sobre fondos claros |
| `assets/logo-aiep-dark.png` | Variante institucional preparada para el módulo | Logo completo sobre fondos oscuros |

El deck no utiliza imágenes externas: las láminas se resuelven con composición, tipografía y la
paleta del sistema (`tools/slides-system/theme/tokens.js`).

## Datos citados en el Bloque 1

Todos verificados en fuente primaria antes de incorporarlos al deck.

| Dato | Fuente |
| --- | --- |
| Primera línea de TH3 (2008-09-25) · 100% MC/DC (2009-07-25) · versión 3.6.17 (2009-08-10) | [TH3 — sqlite.org](https://sqlite.org/th3.html) |
| 155,8 KSLOC de librería contra 92.053,1 KSLOC de prueba en la versión 3.42.0 (2023-05-16) | [How SQLite Is Tested — sqlite.org](https://www.sqlite.org/testing.html) |
| Cita de D. Richard Hipp sobre el esfuerzo y sobre los reportes desde Android | [The Untold Story of SQLite — CoRecursive, 2021](https://corecursive.com/066-sqlite-with-richard-hipp/) |
| MC/DC como criterio de cobertura exigido a software crítico de vuelo | RTCA DO-178B |

## Datos citados en el Bloque 2

| Dato | Fuente |
| --- | --- |
| Distinción entre prueba estática y dinámica | [ISO/IEC/IEEE 29119-1:2022](https://www.iso.org/standard/81291.html) |
| Zulip anotó el 100% de su backend Python —unas 50.000 líneas— y el proceso señaló decenas de defectos latentes | [Static types in Python, oh my(py)! — Zulip, 2016](https://blog.zulip.com/2016/10/13/static-types-in-python-oh-mypy/) |
| Comandos y diagnóstico mostrados para la verificación de tipos | [Documentación de Pyrefly](https://pyrefly.org/) y ejecución local registrada en el README de la clase |

## Datos citados en el Bloque 3

| Dato | Fuente |
| --- | --- |
| `zip()` termina en la secuencia más corta; `strict=True` exige longitudes iguales | [Python — `zip()`](https://docs.python.org/3/library/functions.html#zip) |
| B905 advierte el uso de `zip()` sin un valor explícito para `strict=` | [Ruff — regla B905](https://docs.astral.sh/ruff/rules/zip-without-explicit-strict/) |
| `extend-select` agrega códigos o prefijos de reglas a la selección activa | [Ruff — configuración](https://docs.astral.sh/ruff/configuration/) |
| Diagnósticos de Pyrefly, Ruff y pytest frente al defecto de redondeo | Ejecución local registrada en el README de la clase; la regla de producto `3.95 → 4.0` proviene de la Clase 02 |

## Datos citados en el Bloque 4 y el cierre

| Dato | Fuente |
| --- | --- |
| Pyrefly puede ofrecer comentarios de supresión después de encontrar diagnósticos | [Documentación de Pyrefly](https://pyrefly.org/) y salida literal registrada en el README de la clase |
| La prueba escrita antes de aplicar la corrección funciona como expectativa ejecutable | Clase 02 — introducción a `pytest`; Clase 04 — la regla del producto como fuente de verdad |
| La revisión de código se introduce como otra forma de prueba estática | Continuidad curricular con la Clase 06, según `cronograma/README.md` |
