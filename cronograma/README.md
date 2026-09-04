# Cronograma Módulo PRO402 Taller de Testing y Calidad de Software

## Información General

- Período: 10 de agosto - 30 de septiembre de 2026
- Horario: Lunes, Martes y Miércoles de 08:30 a 10:50
- Planificado: 72 horas · 24 sesiones de 3 horas pedagógicas · 8 semanas
- Realizado: 18 sesiones · 54 horas de docencia directa. Seis sesiones no se realizaron (ausencia docente justificada del 17 al 19 de agosto; actividades de vinculación con el medio el 24 y el 26 de agosto; actividad externa en el Liceo Comercial el 2 de septiembre)
- Modalidad: Presencial, laboratorio PC. Los estudiantes trabajan sobre su propio equipo
- Unidades: UA1 Calidad y testing de software (27 h) · UA2 Desarrollo y ejecución de casos de prueba (30 h)
- Evaluación: 3 sumativas prácticas e incrementales (1 en la Unidad 1, 2 en la Unidad 2), evaluadas por producto y desempeño con rúbrica. No hay pruebas escritas. Las tres pautas se entregan al inicio y cada estudiante avanza a su propio ritmo: no se rinden en sesión de clase, sino que se envían en la fecha de corte y se corrigen fuera del aula
- Stack de práctica: Python (`uv`, `ruff`, `pyrefly`, `pytest`, FastAPI) como columna vertebral, TypeScript (Vitest, Playwright) en la capa de interfaz, y GitHub Actions como integración continua
- Proyecto transversal: cada estudiante hace confiable su propio sistema a lo largo del módulo. Las tres evaluaciones son incrementos del mismo repositorio, que al cierre queda como pieza de portafolio: un servicio con tipado estricto, pirámide de pruebas completa y pipeline en verde

> El feriado del 18 de septiembre cae viernes, por lo que no afecta sesiones. La única
> contingencia de calendario sería un receso institucional de esa semana completa.

## Ajuste del Cronograma

De las nueve sesiones comprendidas entre el 10 y el 26 de agosto se realizaron cuatro, y el 2 de
septiembre se perdió una más. Ninguna se recupera como sesión adicional, porque el período del
módulo no se extiende: los contenidos se redistribuyen en las sesiones que quedan hasta el 30 de
septiembre.

El ajuste se resolvió fusionando cinco pares de sesiones, en todos los casos donde dos contenidos
comparten instrumento, herramienta o estándar y podían enseñarse en una sola sesión sin perder
profundidad:

| Contenidos fusionados | Sesión resultante |
| --- | --- |
| Software probado vs. no probado + pruebas estáticas (tipado y linter) | Clase 05 |
| Ciclo de vida y pruebas por etapa + estándares ISO/IEC 25010 e ISO/IEC/IEEE 29119 | Clase 07 |
| TDD con `pytest` + TDD en TypeScript con Vitest | Clase 11 |
| Regresión e integración continua + integración final del pipeline | Clase 15 |
| Pruebas no funcionales I (rendimiento) + II (seguridad, privacidad, usabilidad, accesibilidad) | Clase 16 |

Las tres evaluaciones sumativas se mantienen y siguen siendo versiones del mismo repositorio. Lo
que cambió es su forma de entrega: las pautas ya están en manos de los estudiantes y cada uno avanza
a su propio ritmo, de modo que **ninguna evaluación ocupa sesión de clase**. Lo que se fija es la
fecha de corte en que cada estudiante envía su avance, que se corrige fuera del aula:

| Evaluación | Fecha de corte | Qué se envía |
| --- | --- | --- |
| Parcial 1 (Unidad 1) | Lunes 21 de septiembre | La línea base de calidad del proyecto |
| Parcial 2 (Unidad 2) | Viernes 25 de septiembre | El plan de pruebas y la suite automatizada |
| Final (Unidad 2) | Miércoles 30 de septiembre | El proyecto cerrado, con su pipeline en verde |

Las tres fechas son de envío, no de sesión. La primera y la última caen en días de clase, lo que
permite recordarlas esa misma mañana; la segunda cae en viernes para dejar el fin de semana de
corrección antes de la recta final.

Al liberar los tres días que las evaluaciones ocupaban en la versión anterior, las sesiones
recuperadas absorben la pérdida del 2 de septiembre sin necesidad de fusionar ningún par nuevo, y
todavía dejan dos sesiones al cierre para trabajo supervisado sobre el proyecto.

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

### Unidad 1: Calidad y Testing de Software (27 horas)
**Foco:** Qué significa que un software "funcione", cómo se mide contra estándares y cómo se detectan defectos antes de ejecutar una sola línea.

| Día | Clase | Contenido |
|-----|-------|-----------|
| _Semana del 10/08_ | | _¿Qué significa que funcione?_ |
| 10/08 | 01 | Presentación del módulo y diagnóstico. La tesis del curso: si el código lo escribe un agente, el testing es lo que decide si sirve |
| 11/08 | 02 | Entorno de trabajo: `uv`, `ruff`, `pyrefly` y `pytest`. Primer test en verde el mismo día |
| 12/08 | 03 | La calidad no es opinión: ISO/IEC 25010:2023 y sus nueve características aplicadas a un producto real |
| _Semana del 17/08_ | | _Sesiones no realizadas_ |
| 17/08 – 19/08 | — | Ausencia docente justificada |
| _Semana del 24/08_ | | _Verificación y validación_ |
| 24/08 | — | Vinculación con el medio |
| 25/08 | 04 | Verificación y validación: construir bien el producto vs. construir el producto correcto. Casos reales de fracaso (Therac-25, Ariane 5, Knight Capital) |
| 26/08 | — | Vinculación con el medio |
| _Semana del 31/08_ | | _Pruebas estáticas y revisión_ |
| 31/08 | 05 | Software probado vs. no probado, con indicadores verificables sobre un proyecto real. Pruebas estáticas: el tipado como primera prueba (`pyrefly`) y el linter como segunda barrera (`ruff`) |
| 01/09 | 06 | Revisión de código como prueba estática. Review adversarial entre modelos: un agente escribe, otro audita, el estudiante arbitra |
| 02/09 | — | Actividad externa en el Liceo Comercial |
| _Semana del 07/09_ | | _Auditoría de calidad_ |
| 07/09 | 07 | Ciclo de vida del producto y pruebas asociadas a cada etapa. Estándares ISO/IEC 25010 e ISO/IEC/IEEE 29119 y la documentación de pruebas que exigen. Privacidad por diseño, finalidad y evidencia de cumplimiento desde la definición del producto |
| 08/09 | 08 | Taller integrador: cómo se conduce una auditoría de verificación y validación de principio a fin, qué se mira en cada paso y qué evidencia debe quedar registrada |

### Unidad 2: Desarrollo y Ejecución de Casos de Prueba (30 horas)
**Foco:** Diseñar, escribir y automatizar pruebas reales sobre un proyecto propio, hasta sostener un plan de pruebas ejecutándose solo en integración continua.

| Día | Clase | Contenido |
|-----|-------|-----------|
| _Semana del 07/09_ | | _Diseño de casos de prueba_ |
| 09/09 | 09 | Diseño de casos: partición de equivalencia, análisis de valores límite y tablas de decisión |
| _Semana del 14/09_ | | _De los casos al código_ |
| 14/09 | 10 | Caja negra, caja blanca y cobertura: por qué el 100% de cobertura no prueba nada. Generar casos con IA y auditarlos críticamente |
| 15/09 | 11 | TDD con `pytest`: el ciclo rojo-verde-refactor completo sobre el proyecto, y su traducción a Vitest en TypeScript |
| 16/09 | 12 | Pruebas de integración sobre FastAPI: fixtures, base de datos y dobles de prueba. Datos sintéticos, minimización, aislamiento y eliminación verificable bajo la Ley 21.719 |
| _Semana del 21/09_ | | _Extremo a extremo y plan de pruebas_ |
| 21/09 | 13 | Pruebas E2E con Playwright. El agente como usuario que entra por primera vez: exploratorio asistido y hallazgos de usabilidad |
| **21/09** | — | **Fecha de corte de la Evaluación Parcial 1** (envío, no ocupa la sesión) |
| 22/09 | 14 | Plan de pruebas según ISO/IEC/IEEE 29119: estructura, objetivos y trazabilidad. Derechos y obligaciones de protección de datos convertidos en requisitos, riesgos y casos de prueba |
| 23/09 | 15 | Pruebas de regresión e integración continua con GitHub Actions. Pruebas inestables (flaky) y cómo tratarlas. Pipeline completo en verde sobre el proyecto |
| **25/09** | — | **Fecha de corte de la Evaluación Parcial 2** (viernes, sin sesión) |
| _Semana del 28/09_ | | _Cierre del módulo_ |
| 28/09 | 16 | Pruebas no funcionales: rendimiento, carga y escalabilidad; seguridad, privacidad, usabilidad, accesibilidad y portabilidad. Ley 21.719, decisiones automatizadas y respuesta frente a incidentes |
| 29/09 | — | Taller de cierre: trabajo supervisado sobre el proyecto, con el docente disponible para resolver lo que falte antes del corte final |
| 30/09 | — | Cierre del módulo. **Fecha de corte de la Evaluación Final**: el proyecto con integración continua, pruebas de regresión y no funcionales, y su pipeline en verde |

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
