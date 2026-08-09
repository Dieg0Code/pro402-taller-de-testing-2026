# Registro por audiencia

El aprendizaje central del framework: **el mismo contenido cambia de registro según a quién le
hablo.** Las skills nacieron asumiendo un alumno técnico (carrera de programación) y eso sesgó el
tono. En la práctica produzco material para audiencias muy distintas, y tratarlas igual comunica
mal: a la directiva no le importa el stack, y al socio comunitario una abreviatura interna lo deja
afuera.

Toda skill que produzca salida audience-facing (`slides-aiep`, `cohort-comms`, `infografias-aiep`,
`reuniones-vcm`, y los cierres de `clase-design`) debe **fijar la audiencia antes de redactar** y
ajustar el registro según esta tabla.

## Las audiencias

| Audiencia | Quiénes | Registro | Jerga / código | Foco |
|---|---|---|---|---|
| **Técnica** | Alumnos de carreras técnicas (Programación / Análisis de Sistemas) | Directo, técnico, exigente | Sí: código real, diagramas, términos del oficio | Dominio técnico, criterio, práctica |
| **Escolar** | Estudiantes de liceo (GeoGreen Escolar, talleres) | Cercano, motivador, concreto | No: analogías y ejemplos del mundo real | Curiosidad, participación, "yo puedo hacer esto" |
| **Docente (par)** | Otros docentes AIEP, no necesariamente de tu área | Profesional entre pares | Moderada: no asumas su stack | Claridad, utilidad, transferible |
| **Directiva / administrativa** | Jefatura, dirección, administración AIEP | Institucional, ejecutivo | No: cero jerga; traducir a impacto | Impacto, gestión, indicadores, viabilidad |
| **Socio comunitario / externa** | Liceo, apoderados, aliados, comunidad | Cercano, claro, sin contexto interno | No: ni abreviaturas ni nombres internos | Beneficio, alianza, propósito |

## Reglas que cruzan a todas las no-técnicas

Estas salieron de errores reales (geogreen, reunión socio comunitario):

- **Sin tecnicismo gratis.** Si un término técnico es imprescindible, explícalo en una línea con
  una analogía. Si no aporta, sácalo.
- **Sin abreviaturas internas ni nombres de coordinación** (ESP32, "demo/simulado", rId, códigos
  de módulo, fechas tentativas marcadas como tales). Lo interno no sale a audiencia externa.
- **Traducir característica → beneficio.** No "sensor HC-SR04 ultrasónico"; sí "mide cuánto se
  llenó el basurero sin abrirlo".
- **Chequeo anti-meta.** El contenido le habla a la audiencia, no comenta el proceso de armado
  ("esta versión del deck", "aquí pondremos", "se desarrollará después"). Especialmente estricto
  en material externo.
- **Cuando subes de audiencia interna a externa, recortas, no agregas.** El default es decir menos
  y más claro.

## Cómo lo usan las skills

Cada skill audience-facing referencia este documento y, como primer paso de su flujo, **declara la
audiencia objetivo**. El default histórico era "técnica"; ahora es una decisión explícita. Cuando
una skill tenga material propio de calibración por audiencia (ej. `cohort-comms` ya tiene
`references/audience-profile.md`, hoy centrado en el curso técnico), ese material debe ampliarse
para cubrir las audiencias de esta tabla, no reemplazar esta fuente común.
