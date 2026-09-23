# Feedback Evaluación Parcial 1 · [Nombre del estudiante]

- **Asignatura:** PRO402 · Taller de Testing y Calidad de Software
- **Proyecto:** [Nombre del proyecto]
- **Repositorio:** [URL]
- **Commit evaluado:** `[SHA completo]`
- **Fecha de revisión:** [fecha]
- **Entorno:** [sistema operativo] · Python [versión] · uv [versión]
- **Evidencia reproducible de la mutación:** `[procedimiento-mutacion-estudiante.md]`

## Evaluación general

[Síntesis breve del nivel alcanzado. Indicar qué evidencia sostiene la evaluación, qué distingue a
la entrega y cuál es su principal límite.]

## Reproducción técnica

| Paso | Comando o evidencia | Resultado |
| :--- | :--- | :--- |
| Instalación | `[comando literal del README]` | [resultado y código de salida] |
| Tipos | `uv run pyrefly check` | [resultado] |
| Linter | `uv run ruff check .` | [resultado] |
| Suite | `uv run pytest -q` | [resultado] |
| Estado del repositorio | `git status --short` | [resultado] |

### Alcance declarado

| Regla de negocio | Prueba localizada | ¿Puede detectar un cambio? | Observación |
| :--- | :--- | :---: | :--- |
| [regla] | `[archivo::prueba]` | Sí / No | [evidencia] |

### Evidencia de trazabilidad comprobada

Las filas `[número]` y `[número]` fueron seleccionadas usando como semilla el commit evaluado.

| Fila | Evidencia declarada | Evidencia encontrada | Resultado |
| :---: | :--- | :--- | :--- |
| | | | |

## Resultado de la mutación

- **Agente y modelo:** [herramienta y versión/modelo]
- **Ubicación:** `[archivo:línea · función]`
- **Regla mutada:** [regla declarada en el README]
- **Antes:** `[línea original]`
- **Después:** `[línea mutada]`
- **Línea base:** [cantidad aprobada/fallida y código de salida]
- **Después de mutar:** [cantidad aprobada/fallida y código de salida]
- **Prueba que detectó el cambio:** `[ruta::prueba]` / Ninguna
- **Resultado:** Mutante detectado / Sobrevivió / Equivalente / Fuera de alcance
- **Impugnación:** No / Sí · [causal y resolución]
- **Explicación del estudiante:** [síntesis fiel]
- **Conclusión técnica:** [qué demuestra y qué no demuestra el ensayo]

Los comandos, salidas completas de consola, fragmentos de código y diff se conservan en el documento
de evidencia reproducible indicado al inicio. Este feedback resume el resultado sin sustituir esa
bitácora.

## Desglose por rúbrica

### C1 · Suite de pruebas que documenta el comportamiento · [puntaje]/25 · [nivel]

- **Evidencia:** [reglas cubiertas, aserciones, defecto reproducido, historial y mutación].
- **Decisión:** [por qué corresponde el nivel].
- **Para alcanzar el nivel siguiente:** [condición observable, o “Nivel máximo alcanzado”].

### C2 · Evidencia estática · [puntaje]/20 · [nivel]

- **Evidencia:** [salidas de pyrefly y ruff, configuración y silenciamientos].
- **Decisión:** [por qué corresponde el nivel].
- **Para alcanzar el nivel siguiente:** [condición observable, o “Nivel máximo alcanzado”].

### C3 · Trazabilidad y ficha de calidad · [puntaje]/20 · [nivel]

- **Evidencia:** [características, criterios verificables y filas comprobadas].
- **Decisión:** [por qué corresponde el nivel].
- **Para alcanzar el nivel siguiente:** [condición observable, o “Nivel máximo alcanzado”].

### C4 · Hallazgo de validación · [puntaje]/15 · [nivel]

- **Evidencia:** [especificación, necesidad real, fuente de verdad y argumento].
- **Decisión:** [por qué corresponde el nivel].
- **Para alcanzar el nivel siguiente:** [condición observable, o “Nivel máximo alcanzado”].

### C5 · Entorno reproducible y orden de entrega · [puntaje]/10 · [nivel]

- **Evidencia:** [clon limpio, README, uv, bloqueo, versión, secretos e historial].
- **Decisión:** [por qué corresponde el nivel].
- **Para alcanzar el nivel siguiente:** [condición observable, o “Nivel máximo alcanzado”].

### C6 · Criterio frente al agente · [puntaje]/10 · [nivel]

- **Evidencia:** [registro de IA, intervención propia y explicación de una prueba].
- **Decisión:** [por qué corresponde el nivel].
- **Para alcanzar el nivel siguiente:** [condición observable, o “Nivel máximo alcanzado”].

## Resultado final

| Criterio | Puntaje |
| :--- | :---: |
| C1 · Suite de pruebas | [ ] / 25 |
| C2 · Evidencia estática | [ ] / 20 |
| C3 · Trazabilidad y ficha de calidad | [ ] / 20 |
| C4 · Hallazgo de validación | [ ] / 15 |
| C5 · Entorno reproducible y orden | [ ] / 10 |
| C6 · Criterio frente al agente | [ ] / 10 |
| **Total** | **[ ] / 100** |

- **Nota:** `[ ]`
- **Exigencia:** `60%`

## Fortalezas

- [Fortaleza vinculada a evidencia concreta.]
- [Fortaleza vinculada a evidencia concreta.]
- [Fortaleza vinculada a evidencia concreta.]

## Aspectos a mejorar

1. **[Prioridad 1].** [Problema, evidencia y cambio concreto recomendado.]
2. **[Prioridad 2].** [Problema, evidencia y cambio concreto recomendado.]
3. **[Prioridad 3].** [Problema, evidencia y cambio concreto recomendado.]

## Siguiente paso técnico

[Una recomendación acotada que prepare el mismo repositorio para la Evaluación Parcial 2.]

## Cierre docente

[Síntesis final directa, proporcional al desempeño y sin repetir el desglose completo.]
