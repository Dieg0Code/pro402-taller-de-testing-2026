# Cronograma Módulo PRO402 Taller de Testing y Calidad de Software

## Información General

- Período: 10 de agosto - 30 de septiembre de 2026
- Horario: Lunes, Martes y Miércoles de 08:30 a 10:50
- Total: 72 horas · 24 sesiones de 3 horas pedagógicas · 8 semanas
- Modalidad: Presencial, laboratorio PC. Los estudiantes trabajan sobre su propio equipo
- Unidades: UA1 Calidad y testing de software (32 h) · UA2 Desarrollo y ejecución de casos de prueba (40 h)
- Evaluación: 3 sumativas prácticas e incrementales (1 en la Unidad 1, 2 en la Unidad 2), evaluadas por producto y desempeño con rúbrica. No hay pruebas escritas
- Stack de práctica: Python (`uv`, `ruff`, `pyrefly`, `pytest`, FastAPI) como columna vertebral, TypeScript (Vitest, Playwright) en la capa de interfaz, y GitHub Actions como integración continua
- Proyecto transversal: cada estudiante hace confiable su propio sistema a lo largo del módulo. Las tres evaluaciones son incrementos del mismo repositorio, que al cierre queda como pieza de portafolio: un servicio con tipado estricto, pirámide de pruebas completa y pipeline en verde

> El feriado del 18 de septiembre cae viernes, por lo que no afecta sesiones. La única
> contingencia de calendario sería un receso institucional de esa semana completa.

## Enfoque del Módulo

Hoy buena parte del código se escribe con asistencia de agentes de IA, y se escribe rápido. Lo que
decide si ese código sirve —y lo que separa a un profesional de alguien reemplazable— ya no es la
velocidad para producirlo, sino la capacidad de **demostrar que funciona**. Ese es el oficio que
enseña este módulo: el testing como la disciplina que hace confiable el software, venga de donde
venga.

El módulo se organiza con foco en:

- entender la calidad de software como algo que se mide contra un estándar, no como una opinión;
- distinguir verificación de validación, y sostener esa distinción con evidencia y no con intuición;
- escribir pruebas reales desde la primera semana, con la sintaxis y las herramientas del mercado actual;
- tratar el tipado estricto y el análisis estático como la primera línea de pruebas, antes de ejecutar nada;
- incorporar la revisión adversarial entre modelos —un agente produce, otro audita, el estudiante arbitra— como una forma legítima y actual de prueba estática;
- diseñar casos de prueba con técnicas formales, y usar la IA para ampliarlos sin delegarle el criterio;
- automatizar la ejecución en integración continua, para que la prueba deje de depender de la voluntad de alguien;
- cubrir el arco completo funcional y no funcional: regresión, rendimiento, seguridad, usabilidad y accesibilidad;
- tratar la protección de datos personales como un requisito verificable del producto: privacidad por diseño, datos de prueba seguros, ejercicio de derechos y evidencia de cumplimiento frente a la Ley 21.719;
- y trabajar todo sobre un proyecto único, para que el estudiante vea el mismo sistema volverse confiable sesión a sesión.

## Eje Transversal: Protección de Datos Personales

La Ley 21.719 entra en vigor el 1 de diciembre de 2026 y cambia el estándar chileno de protección
de datos personales. En este módulo no se aborda como una unidad jurídica aislada, sino como un
conjunto de requisitos que deben traducirse a comportamiento del sistema, casos de prueba y
evidencia verificable.

Su incorporación progresa en cuatro momentos:

1. **Ciclo de vida:** reconocer finalidad, proporcionalidad, privacidad por diseño y responsabilidad demostrable desde que se define el producto.
2. **Datos de prueba:** priorizar datos sintéticos, minimización, aislamiento, acceso controlado y eliminación verificable en ambientes no productivos.
3. **Trazabilidad:** convertir derechos y obligaciones en requisitos, riesgos, casos de prueba y evidencia dentro del plan de pruebas.
4. **Pruebas no funcionales:** verificar seguridad, privacidad, ejercicio de derechos, decisiones automatizadas y respuesta frente a incidentes.

La guía de referencia del módulo se encuentra en
[`docs/ley-21719/Guia-Maestra-Ley-21719-Proteccion-Datos-Chile-2026.pdf`](../docs/ley-21719/Guia-Maestra-Ley-21719-Proteccion-Datos-Chile-2026.pdf).

## Cronograma Detallado

### Unidad 1: Calidad y Testing de Software (33 horas)
**Foco:** Qué significa que un software "funcione", cómo se mide contra estándares y cómo se detectan defectos antes de ejecutar una sola línea.

| Día | Contenido |
|-----|-----------|
| _Semana 1_ | _¿Qué significa que funcione?_ |
| 10/08 | Presentación del módulo y diagnóstico. La tesis del curso: si el código lo escribe un agente, el testing es lo que decide si sirve |
| 11/08 | Entorno de trabajo: `uv`, `ruff`, `pyrefly` y `pytest`. Primer test en verde el mismo día |
| 12/08 | La calidad no es opinión: ISO/IEC 25010 y sus ocho características aplicadas a un producto real |
| _Semana 2_ | _Verificación, validación y evidencia_ |
| 17/08 | Verificación y validación: construir bien el producto vs. construir el producto correcto. Casos reales de fracaso (Therac-25, Ariane 5, Knight Capital) |
| 18/08 | Software testeado vs. no testeado: comparación de repositorios reales, cobertura e historial de defectos |
| 19/08 | Ciclo de vida del producto y pruebas asociadas a cada etapa. Privacidad por diseño, finalidad y evidencia de cumplimiento desde la definición del producto |
| _Semana 3_ | _Pruebas estáticas y revisión_ |
| 24/08 | Pruebas estáticas: el tipado como primera prueba (`pyrefly`, `tsc`) y el linter como segunda barrera |
| 25/08 | Revisión de código como prueba estática. Review adversarial entre modelos: un agente escribe, otro audita, el estudiante arbitra |
| 26/08 | Estándares internacionales: ISO/IEC 25010 e ISO/IEC/IEEE 29119, y la documentación de pruebas que exigen |
| _Semana 4_ | _Auditoría de calidad_ |
| 31/08 | Taller integrador: auditoría de verificación y validación aplicada al proyecto propio |
| 01/09 | **Evaluación Parcial 1 (Unidad 1):** línea base de calidad del proyecto — tipado estricto y análisis estático en verde, primeras pruebas que documentan el comportamiento actual, y hallazgos de la auditoría ISO/IEC 25010 evidenciados en el repositorio |

### Unidad 2: Desarrollo y Ejecución de Casos de Prueba (39 horas)
**Foco:** Diseñar, escribir y automatizar pruebas reales sobre un proyecto propio, hasta sostener un plan de pruebas ejecutándose solo en integración continua.

| Día | Contenido |
|-----|-----------|
| _Semana 4_ | _Diseño de casos de prueba_ |
| 02/09 | Diseño de casos: partición de equivalencia, análisis de valores límite y tablas de decisión |
| _Semana 5_ | _De los casos al código_ |
| 07/09 | Caja negra, caja blanca y cobertura: por qué el 100% de cobertura no prueba nada. Generar casos con IA y auditarlos críticamente |
| 08/09 | TDD con `pytest`: el ciclo rojo-verde-refactor completo sobre el proyecto |
| 09/09 | TDD en TypeScript con Vitest: la misma disciplina, otra sintaxis |
| _Semana 6_ | _Integración y extremo a extremo_ |
| 14/09 | Pruebas de integración sobre FastAPI: fixtures, base de datos y dobles de prueba. Datos sintéticos, minimización, aislamiento y eliminación verificable bajo la Ley 21.719 |
| 15/09 | Pruebas E2E con Playwright. El agente como usuario que entra por primera vez: exploratorio asistido y hallazgos de usabilidad |
| 16/09 | Plan de pruebas según ISO/IEC/IEEE 29119: estructura, objetivos y trazabilidad. Derechos y obligaciones de protección de datos convertidos en requisitos, riesgos y casos de prueba |
| _Semana 7_ | _Automatización y pruebas no funcionales_ |
| 21/09 | **Evaluación Parcial 2 (Unidad 2):** el mismo proyecto con su plan de pruebas y su suite automatizada — casos diseñados con técnicas formales, y pruebas unitarias, de integración y extremo a extremo ejecutándose |
| 22/09 | Pruebas de regresión e integración continua con GitHub Actions. Pruebas inestables (flaky) y cómo tratarlas |
| 23/09 | Pruebas no funcionales I: rendimiento, carga y escalabilidad |
| _Semana 8_ | _Cierre del módulo_ |
| 28/09 | Pruebas no funcionales II: seguridad, privacidad, usabilidad, accesibilidad y portabilidad. Ley 21.719, decisiones automatizadas y respuesta frente a incidentes |
| 29/09 | Integración final: pipeline completo en verde y preparación de la defensa |
| 30/09 | **Evaluación Final (Unidad 2):** el proyecto cerrado con integración continua, pruebas de regresión y no funcionales; defensa con el pipeline ejecutándose en vivo |

## Resultado Esperado del Módulo

Al finalizar, el estudiante debería ser capaz de:

- Evaluar la calidad de un software contra un estándar internacional y sostener el juicio con evidencia.
- Distinguir verificación de validación y aplicar ambas sobre un proyecto real de desarrollo.
- Diseñar casos de prueba con técnicas formales, en lugar de probar por intuición o al azar.
- Escribir pruebas unitarias, de integración y extremo a extremo con las herramientas actuales del mercado.
- Implementar un plan de pruebas y automatizar su ejecución en integración continua.
- Aplicar pruebas funcionales y no funcionales, y comunicar sus resultados de forma profesional.
- Traducir exigencias de protección de datos personales a requisitos verificables, casos de prueba y evidencia técnica, usando datos de prueba de forma responsable.
- Usar agentes de IA para ampliar y revisar pruebas sin delegarles el criterio técnico.
- Demostrar que un sistema funciona, en vez de afirmarlo.
