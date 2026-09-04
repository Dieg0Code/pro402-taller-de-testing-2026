# Fuentes de recursos visuales

| Archivo local | Fuente | Uso |
| --- | --- | --- |
| `assets/logo-aiep.svg` | Identidad institucional AIEP incluida en el repositorio | Logo completo sobre fondos claros |
| `assets/logo-aiep-dark.png` | Variante institucional preparada para el módulo | Logo completo sobre fondos oscuros |

El deck no utiliza imágenes externas: las láminas se resuelven con composición, tipografía y la
paleta del sistema (`tools/slides-system/theme/tokens.js`), más un acento propio de esta clase
—verde documento, `2F6F5E`— reservado para todo lo que representa «lo escrito».

## Datos citados en el Bloque 1

| Dato | Fuente |
| --- | --- |
| La cita del punto 1, la palabra «often» agregada respecto de la lista de 1987, y el factor 5:1 para sistemas pequeños y no críticos | [Barry Boehm y Victor R. Basili — *Software Defect Reduction Top 10 List*, IEEE Computer, enero de 2001, pp. 135-137](https://www.cs.umd.edu/projects/SoftEng/ESEG/papers/82.78.pdf) |
| El rastro documental del «IBM Systems Sciences Institute» y su resultado | [Búsqueda de la fuente primaria de la razón 1:10:100](https://gist.github.com/Morendil/ebfa32d10528af04e2ccb8995e3cb4a7) |
| Los 171 proyectos entre 2006 y 2014, la ausencia de evidencia del efecto y la limitación declarada por los propios autores | [Menzies, Nichols, Shull y Layman — *Are Delayed Issues Harder to Resolve?*, arXiv:1609.04886 (2016)](https://arxiv.org/pdf/1609.04886) |
| «Code is now cheap», la medición de 2.577 líneas de markdown frente a 689 de código, y los tiempos comparados | [Colin Eberhardt — *Putting Spec Kit Through Its Paces*, Scott Logic, 26 de noviembre de 2025](https://blog.scottlogic.com/2025/11/26/putting-spec-kit-through-its-paces-radical-idea-or-reinvented-waterfall.html) |
| «AI makes specifications executable» y las cuatro fases del flujo | [Den Delimarsky — *Spec-driven development with AI*, GitHub Blog, 2 de septiembre de 2025](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/) |
| Contenido recomendado del archivo, adopción y tutela bajo la Agentic AI Foundation | [AGENTS.md](https://agents.md/) |
| Los procesos de prueba en los tres niveles, aplicables a cualquier modelo de ciclo de vida | [ISO/IEC/IEEE 29119-2:2021](https://www.iso.org/standard/79428.html) |

## Datos citados en el Bloque 2

| Dato | Fuente |
| --- | --- |
| La definición de base de prueba y su nota 1 (cláusula 3.7), el conjunto de documentos de las cláusulas 6, 7 y 8, la forma admitida de la documentación y las dos modalidades de conformidad de la cláusula 4 | [ISO/IEC/IEEE 29119-3:2021 — *Test documentation*, segunda edición](https://www.iso.org/standard/79429.html) |
| Las cuatro partes de una prueba, la taxonomía de siete fuentes de autoridad y la proporción del corpus que emite veredicto sin especificación | [Mughal y Bilal — *LLM-Based Test Oracles: Source-of-Authority Taxonomy*, IEEE Access, DOI 10.1109/ACCESS.2026.3729738 (arXiv:2607.05031)](https://arxiv.org/abs/2607.05031) |
| El problema del oráculo antes de los modelos de lenguaje | [Barr, Harman, McMinn, Shahbaz y Yoo — *The Oracle Problem in Software Testing: A Survey*, IEEE TSE 41(5), 2015](https://coinse.github.io/publications/pdfs/Barr2015qd.pdf) |
| Las dos suites generadas por los protocolos A y B, sus resultados `42 passed` y `1 failed, 42 passed`, la verificación del caso `[4.0, 3.9]`, y el `10 failed, 32 passed` tras enmascarar el RUT | Ejecuciones registradas para esta clase con `claude -p` y herramientas restringidas a lectura, sobre Python 3.12.12 |

## Datos citados en el Bloque 3

| Dato | Fuente |
| --- | --- |
| Las nueve características del modelo, y el alcance que declara la validación de completitud de los requisitos y la identificación de criterios de aceptación entre los usos del modelo | [ISO/IEC 25010:2023 — *Product quality model*, segunda edición](https://www.iso.org/standard/78176.html) |
| El marco que relaciona los modelos de calidad con la medición y la definición de requisitos | [ISO/IEC 25002:2024](https://www.iso.org/standard/78175.html) |
| Los criterios S1, S2, S5 y S6 producidos por el agente, y la prueba del criterio de confidencialidad con sus resultados `1 failed` y `1 passed` | Ejecuciones registradas para esta clase con `claude -p` y herramientas restringidas a lectura, sobre Python 3.12.12 |

## Datos citados en el Bloque 4 y el cierre

| Dato | Fuente |
| --- | --- |
| La definición de dato personal con el número de cédula de identidad entre los identificadores, el artículo 3º con los principios de finalidad y proporcionalidad, y el artículo 14 quáter sobre el deber de protección desde el diseño y por defecto | [Ley 21.719 — Diario Oficial de la República de Chile, núm. 44.023, 13 de diciembre de 2024, CVE 2583630](https://www.diariooficial.interior.gob.cl/publicaciones/2024/12/13/44023/01/2583630.pdf) |
| El patrón de trabajo principio → requisito → comportamiento → prueba → evidencia | Guía de protección de datos del módulo, en [`docs/ley-21719/`](../../../../../docs/ley-21719/Guia-Maestra-Ley-21719-Proteccion-Datos-Chile-2026.pdf) |
| La revisión del módulo sin corregir contra el `REQUISITOS.md` ampliado, y su salida literal | Ejecución registrada para esta clase con `claude -p` y herramientas restringidas a lectura, sobre Python 3.12.12 |

## Nota sobre las citas

Las citas de normas y publicaciones en inglés aparecen traducidas en el deck, con el sello
«traducción del original en inglés» en su sello de fuente. Los textos literales en su idioma
original están en el `README.md` de la clase, que es el registro. Las citas de la Ley 21.719 son
textuales del castellano original.
