# Procedimiento reproducible de mutación · Evaluación Parcial 1 · [Estudiante]

- **Asignatura:** PRO402 · Taller de Testing y Calidad de Software
- **Proyecto:** [nombre del proyecto]
- **Repositorio:** [URL]
- **Commit evaluado:** `[SHA completo]`
- **Fecha y hora:** [AAAA-MM-DD HH:MM, America/Santiago]
- **Entorno:** [sistema operativo] · Python [versión] · uv [versión]
- **Agente y modelo que generan la mutación:** [herramienta y modelo]
- **Responsable de la evaluación:** [nombre]

Este documento registra la mutación aplicada durante la evaluación. Su función es dejar evidencia
suficiente para repetir el procedimiento sobre el mismo commit y comprobar por qué el resultado
obtenido sustenta el puntaje. No reemplaza el feedback ni la rúbrica.

> Regla de registro: los comandos, fragmentos, diferencias y salidas se copian literalmente. Si una
> salida debe acortarse, se marca el corte con `[salida omitida: N líneas]`; nunca se reemplaza por
> expresiones vagas como “todo bien” o “los tests fallaron”.

## 1. Estado inicial reproducible

### 1.1 Preparación del clon aislado

```powershell
git clone <URL_DEL_REPOSITORIO> <DIRECTORIO_TEMPORAL>
Set-Location <DIRECTORIO_TEMPORAL>
git checkout --detach <SHA_EVALUADO>
git rev-parse HEAD
git status --short
python --version
uv --version
```

**Salida obtenida:**

```text
[salida literal]
```

**Comprobación:**

- SHA obtenido: `[SHA completo]`
- Estado limpio antes de probar: Sí / No
- Observación si no está limpio: [detalle]

### 1.2 Línea base antes de mutar

**Comando exacto:**

```powershell
[comando documentado por el proyecto; por ejemplo, uv run pytest -q]
```

**Salida completa antes de la mutación:**

```text
[salida literal de la consola, incluido el resumen y el código de salida]
```

| Dato de la línea base | Resultado |
| :--- | :--- |
| Código de salida | [valor] |
| Pruebas recolectadas | [cantidad] |
| Pruebas aprobadas | [cantidad] |
| Pruebas fallidas | [cantidad] |
| Duración informada | [valor] |
| ¿La suite estaba verde? | Sí / No |

**Decisión:** Continuar con la mutación / No continuar.

**Fundamento:** [si la línea base no está verde, explicar por qué no es posible atribuir con certeza
un fallo posterior a la mutación].

## 2. Regla y función seleccionadas

### 2.1 Regla de negocio declarada

> [copiar literalmente la regla declarada en el README]

- **Lugar donde fue declarada:** `[archivo y sección]`
- **Por qué es una regla de negocio observable:** [entrada, decisión y resultado observable]
- **Prueba que debería protegerla:** `[ruta::nombre_de_prueba]`

### 2.2 Implementación elegida

- **Archivo fuente:** `[ruta relativa]`
- **Símbolo:** `[clase.función o función]`
- **Línea original:** `[número o rango según el commit evaluado]`
- **Responsabilidad de la función:** [explicación breve]

**Código relevante antes de mutar:**

```python
[función completa o fragmento autocontenido que incluya la línea seleccionada]
```

**Relación con la regla:** [explicar cómo esa línea implementa la regla declarada].

## 3. Mutación aplicada

- **Tipo del catálogo:** invertir comparación / desplazar límite en uno / cambiar redondeo /
  alterar valor por defecto / negar condición
- **Mutación única:** Sí / No
- **Archivos de prueba o configuración modificados:** Ninguno / [detalle]

### 3.1 Comparación puntual

| Antes | Después |
| :--- | :--- |
| `[línea original]` | `[línea mutada]` |

### 3.2 Diferencia completa

**Comando:**

```powershell
git diff --check
git diff --no-ext-diff --unified=3
```

**Salida de `git diff --check`:**

```text
[salida literal; si no imprime nada, escribir: sin salida, código 0]
```

**Diff completo aplicado:**

```diff
[diff literal]
```

### 3.3 Hipótesis antes de ejecutar

- **Entrada o escenario afectado:** [dato concreto]
- **Resultado esperado en el commit original:** [valor o conducta]
- **Resultado esperado con la mutación:** [valor o conducta]
- **Prueba que se espera que falle:** `[ruta::nombre_de_prueba]`
- **Mensaje o aserción que se espera observar:** [predicción]

## 4. Ejecución después de mutar

**Comando exacto:**

```powershell
[el mismo comando utilizado en la línea base]
```

**Salida completa después de la mutación:**

```text
[salida literal de la consola, incluido el resumen y el código de salida]
```

| Dato | Antes | Después |
| :--- | :---: | :---: |
| Código de salida | [valor] | [valor] |
| Pruebas aprobadas | [cantidad] | [cantidad] |
| Pruebas fallidas | [cantidad] | [cantidad] |
| Prueba esperada | [estado] | [estado] |

## 5. Observación e interpretación técnica

- **Resultado del mutante:** Detectado / Sobrevivió / Equivalente / Fuera de alcance
- **Prueba que falló:** `[ruta::nombre]` / Ninguna
- **Fallo observado:** [copiar la parte relevante del mensaje]
- **¿Falló la prueba que protege la regla?** Sí / No
- **¿Hubo fallos colaterales?** No / Sí: [detalle]
- **Coincidencia con la hipótesis:** Total / Parcial / Nula

**Observación:** [describir objetivamente qué cambió entre ambas ejecuciones].

**Interpretación:** [explicar qué demuestra el resultado sobre la capacidad de la suite para detectar
un cambio de comportamiento en la regla seleccionada].

> Un mutante detectado demuestra sensibilidad frente a este cambio concreto; no demuestra por sí
> solo que la suite sea completa. Un mutante que sobrevive exige distinguir entre una prueba ausente
> o débil, un mutante equivalente y una mutación fuera del alcance declarado.

## 6. Participación del estudiante

- **El estudiante revisó el diff antes de ejecutar:** Sí / No
- **Predicción o explicación entregada:** [registro fiel]
- **Impugnación:** No / Sí
- **Causal invocada:** Mutante equivalente / Fuera de alcance / Otra
- **Evidencia presentada:** [detalle]
- **Resolución:** Se mantiene / Se descarta y se genera otra mutación
- **Fundamento de la resolución:** [explicación verificable]

Si la mutación se descarta, se conserva este registro y se agrega un nuevo bloque desde la sección 2
para la mutación de reemplazo. No se borra el intento anterior.

## 7. Conclusión que fundamenta el puntaje

### C1 · Suite de pruebas que documenta el comportamiento

- **Evidencia aportada por esta mutación:** [detección, prueba y aserción relevantes]
- **Límite de la evidencia:** [qué no permite concluir este ensayo]
- **Nivel asignado en la rúbrica:** Excelente / Logrado / Insuficiente / No entregado
- **Puntaje C1:** `[0, 5, 15 o 25] / 25`
- **Fundamento:** [conectar el resultado con todos los requisitos del nivel; la mutación no es la
  única evidencia de C1]

### C6 · Criterio frente al agente

- **Evidencia aportada por la interacción:** [revisión del diff, impugnación, explicación de la prueba]
- **Nivel asignado en la rúbrica:** Excelente / Logrado / Insuficiente / No entregado
- **Puntaje C6:** `[0, 2, 6 o 10] / 10`
- **Fundamento:** [conectar la respuesta del estudiante con los requisitos del nivel]

## 8. Cierre de la evidencia

- [ ] Se registró el commit exacto.
- [ ] La línea base y la ejecución mutada usaron el mismo comando.
- [ ] Se conservó la salida de consola anterior y posterior.
- [ ] Se identificaron archivo, función y línea.
- [ ] Se conservaron el código antes, el código después y el diff completo.
- [ ] La observación distingue hechos de interpretación.
- [ ] La conclusión se vinculó con C1 y C6 sin duplicar descuentos.
- [ ] El clon temporal fue descartado y el repositorio original quedó intacto.

**Nombre sugerido del documento completo:** `procedimiento-mutacion-[estudiante].md`.
