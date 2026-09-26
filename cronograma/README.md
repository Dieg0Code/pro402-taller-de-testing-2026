# Cronograma Módulo PRO402 Taller de Testing y Calidad de Software

## Información General

- Período: 10 de agosto - 30 de septiembre de 2026
- Horario: Lunes, Martes y Miércoles de 08:30 a 10:50. El martes 22, el lunes 28 y el martes 29 de septiembre se suma un segundo bloque de 11:00 a 13:15, en el Laboratorio de Redes
- Modalidad: Presencial, laboratorio PC. Los estudiantes trabajan sobre su propio equipo
- Unidades: UA1 Calidad y testing de software (24 h) · UA2 Desarrollo y ejecución de casos de prueba (30 h)
- Evaluación: 3 sumativas prácticas e incrementales (1 en la Unidad 1, 2 en la Unidad 2), evaluadas por producto y desempeño con rúbrica. No hay pruebas escritas
- Stack de práctica: Python (`uv`, `ruff`, `pyrefly`, `pytest`, FastAPI) como columna vertebral, TypeScript (Vitest, Playwright) en la capa de interfaz, y GitHub Actions como integración continua
- Proyecto transversal: cada estudiante hace confiable su propio sistema a lo largo del módulo. Las tres evaluaciones son incrementos del mismo repositorio, que al cierre queda como pieza de portafolio: un servicio con tipado estricto, pirámide de pruebas completa y pipeline en verde

> Entre el 14 y el 16 de septiembre no hay sesiones: la semana de fiestas patrias es receso
> institucional. Las clases se retoman el lunes 21. El martes 22, el lunes 28 y el martes 29
> hay un segundo bloque de 11:00 a 13:15, en el Laboratorio de Redes. El del martes 22 se usó como
> trabajo supervisado sobre el proyecto, sin materia nueva; por eso la Clase 12 pasó al miércoles 23
> y el resto de la unidad se corrió un bloque. Las clases se numeran por contenido: la 15 se dicta
> el lunes 28 a las 11:00, antes que la 14.

## Evaluación

Las tres evaluaciones sumativas son versiones del mismo repositorio. Las pautas ya están
entregadas y cada estudiante avanza a su propio ritmo, de modo que **ninguna evaluación ocupa
sesión de clase**. Lo que se fija es la fecha de corte en que cada uno envía su avance.

| Evaluación | Fecha de corte | Qué se envía |
| --- | --- | --- |
| Parcial 1 (Unidad 1) | Lunes 21 de septiembre | La línea base de calidad del proyecto |
| Parcial 2 (Unidad 2) | Viernes 25 de septiembre | El plan de pruebas y la suite automatizada |
| Final (Unidad 2) | Miércoles 30 de septiembre | El proyecto cerrado, con su pipeline en verde |

Las tres fechas son de envío, no de sesión.

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

El módulo trabaja con una guía maestra de la Ley 21.719 como referencia.

## Cronograma Detallado

### Unidad 1: Calidad y Testing de Software (24 horas)
**Foco:** Qué significa que un software "funcione", cómo se mide contra estándares y cómo se detectan defectos antes de ejecutar una sola línea.

| Día | Bloque | Clase | Contenido |
|-----|--------|-------|-----------|
| _Semana del 10/08_ | | | _¿Qué significa que funcione?_ |
| 10/08 | 08:30–10:50 | 01 | Presentación del módulo y diagnóstico. La tesis del curso: si el código lo escribe un agente, el testing es lo que decide si sirve |
| 11/08 | 08:30–10:50 | 02 | Entorno de trabajo: `uv`, `ruff`, `pyrefly` y `pytest`. Primer test en verde el mismo día |
| 12/08 | 08:30–10:50 | 03 | La calidad no es opinión: ISO/IEC 25010:2023 y sus nueve características aplicadas a un producto real |
| _Semana del 24/08_ | | | _Verificación y validación_ |
| 25/08 | 08:30–10:50 | 04 | Verificación y validación: construir bien el producto vs. construir el producto correcto. Casos reales de fracaso (Therac-25, Ariane 5, Knight Capital) |
| _Semana del 31/08_ | | | _Pruebas estáticas y revisión_ |
| 31/08 | 08:30–10:50 | 05 | Software probado vs. no probado, con indicadores verificables sobre un proyecto real. Pruebas estáticas: el tipado como primera prueba (`pyrefly`) y el linter como segunda barrera (`ruff`) |
| 01/09 | 08:30–10:50 | 06 | Revisión de código como prueba estática. Review adversarial entre modelos: un agente escribe, otro audita, el estudiante arbitra |
| _Semana del 07/09_ | | | _Auditoría de calidad_ |
| 07/09 | 08:30–10:50 | 07 | Ciclo de vida del producto y pruebas asociadas a cada etapa. Estándares ISO/IEC 25010 e ISO/IEC/IEEE 29119 y la documentación de pruebas que exigen. Privacidad por diseño, finalidad y evidencia de cumplimiento desde la definición del producto |
| 08/09 | 08:30–10:50 | 08 | Taller integrador: cómo se conduce una auditoría de verificación y validación de principio a fin, qué se mira en cada paso y qué evidencia debe quedar registrada |

### Unidad 2: Desarrollo y Ejecución de Casos de Prueba (30 horas)
**Foco:** Diseñar, escribir y automatizar pruebas reales sobre un proyecto propio, hasta sostener un plan de pruebas ejecutándose solo en integración continua.

| Día | Bloque | Clase | Contenido |
|-----|--------|-------|-----------|
| _Semana del 07/09_ | | | _Diseño de casos de prueba_ |
| 09/09 | 08:30–10:50 | 09 | Diseño de casos: partición de equivalencia, análisis de valores límite y tablas de decisión. De la tabla al código: la aserción, la parametrización y el vocabulario para leer una prueba escrita por otro |
| _Semana del 14/09_ | | | _Receso institucional de fiestas patrias: no hay sesiones_ |
| _Semana del 21/09_ | | | _De los casos al código, y del código a la interfaz_ |
| 21/09 | 08:30–10:50 | 10 | Caja negra, caja blanca y cobertura: por qué el 100% de cobertura no prueba nada. Dobles de prueba y el mecanismo por el que una suite mockeada llega al 100% sin verificar nada. Generar casos con IA y auditarlos críticamente |
| **21/09** | — | — | **Fecha de corte de la Evaluación Parcial 1** (envío, no ocupa sesión) |
| 22/09 | 08:30–10:50 | 11 | TDD con `pytest`: el ciclo rojo-verde-refactor completo sobre el proyecto, y su traducción a Vitest en TypeScript |
| 22/09 | 11:00–13:15 | — | Bloque de recuperación sin materia nueva: trabajo supervisado sobre el proyecto |
| 23/09 | 08:30–10:50 | 12 | Pruebas de integración sobre FastAPI: fixtures, base de datos y dónde un doble deja de ser legítimo. Datos sintéticos, minimización, aislamiento y eliminación verificable bajo la Ley 21.719 |
| **25/09** | — | — | **Fecha de corte de la Evaluación Parcial 2** (viernes, sin sesión) |
| _Semana del 28/09_ | | | _Extremo a extremo, no funcionales, plan de pruebas y cierre_ |
| 28/09 | 08:30–10:50 | 13 | Pruebas E2E con Playwright y la espera que vuelve inestable una prueba. El agente como usuario que entra por primera vez: exploratorio asistido y hallazgos de usabilidad |
| 28/09 | 11:00–13:15 | 15 | Pruebas no funcionales: rendimiento, carga, estrés y escalabilidad; seguridad frente al OWASP Top 10 y los deberes de seguridad y reporte de la Ley 21.719; accesibilidad según WCAG 2.2 y portabilidad. La auditoría no funcional de un agente, verificada ejecutando |
| 29/09 | 08:30–10:50 | 14 | Plan de pruebas según ISO/IEC/IEEE 29119: estructura, riesgos y trazabilidad que se ejecuta. Derechos y obligaciones de protección de datos convertidos en requisitos, riesgos y casos de prueba |
| 29/09 | 11:00–13:15 | 16 | Pruebas de regresión e integración continua con GitHub Actions. Pruebas inestables (flaky) y cómo tratarlas. Pipeline completo en verde sobre el proyecto |
| 30/09 | 08:30–10:50 | — | Cierre del módulo. **Fecha de corte de la Evaluación Final**: el proyecto con integración continua, pruebas de regresión y no funcionales, y su pipeline en verde |

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
