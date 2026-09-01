# Fuentes de recursos visuales

| Archivo local | Fuente | Uso |
| --- | --- | --- |
| `assets/logo-aiep.svg` | Identidad institucional AIEP incluida en el repositorio | Logo completo sobre fondos claros |
| `assets/logo-aiep-dark.png` | Variante institucional preparada para el módulo | Logo completo sobre fondos oscuros |

El deck no utiliza imágenes externas: las láminas se resuelven con composición, tipografía y la
paleta del sistema (`tools/slides-system/theme/tokens.js`).

## Datos citados en el Bloque 1

| Dato | Fuente |
| --- | --- |
| Los cinco tipos de revisión, con sus participantes y su producto | [IEEE Std 1028-2008 — IEEE Standard for Software Reviews and Audits](https://standards.ieee.org/ieee/1028/4402/) |
| La revisión como prueba estática, junto al tipado y al análisis de código | [ISO/IEC/IEEE 29119-1:2022](https://www.iso.org/standard/81291.html) |
| Naturaleza del defecto de OpenSSL, versiones afectadas y fecha de divulgación | [The Heartbleed Bug](https://heartbleed.com/) · [CVE-2014-0160](https://www.cvedetails.com/cve/CVE-2014-0160/) |
| Envío del parche a openssl-dev el 15-12-2011, la única respuesta de revisión y la cita literal del autor | [Declaración de Robin Seggelmann — The Register, 11 de abril de 2014](https://www.theregister.com/2014/04/11/openssl_heartbleed_robin_seggelmann/) |
| Salidas de `ruff` y `pyrefly` sobre el fragmento de la lámina 6 | Ejecución local registrada para esta clase, Python 3.12.12 |

## Datos citados en el Bloque 2

| Dato | Fuente |
| --- | --- |
| 200 a 400 líneas por revisión · 60 minutos por sesión · caída de la densidad de defectos sobre 500 líneas por hora | [SmartBear — Best Practices for Peer Code Review](https://smartbear.com/learn/code-review/best-practices-for-peer-code-review/) |
| Mediana de 24 líneas modificadas, mediana de 1 revisor, y el propósito declarado de la revisión | [Sadowski, Söderberg, Church, Sipko y Bacchelli — *Modern Code Review: A Case Study at Google*, ICSE-SEIP 2018](https://sback.it/publications/icse2018seip.pdf) |
| Salidas de `pytest`, `ruff` y `pyrefly` sobre el fragmento, y comportamiento de `nota_final`, `estado` y `resumen` | Ejecución local registrada para esta clase, Python 3.12.12 |
| `sum()` usa suma compensada de Neumaier desde Python 3.12 | [CPython — *Improve accuracy of builtin sum() for float inputs*, issue #100425](https://github.com/python/cpython/issues/100425) |
| Comparación de `sum([1.0, 1.3, 6.6, 6.9]) / 4` entre Python 3.10.1 y 3.12.12, y los contraejemplos `[1.3, 4.6]` y `[1.1, 6.6]` | Ejecución local en ambos intérpretes, registrada para esta clase |
| Minimización y datos sensibles por combinación | Guía del módulo en [`docs/ley-21719/`](../../../../../docs/ley-21719/Guia-Maestra-Ley-21719-Proteccion-Datos-Chile-2026.pdf) |

## Datos citados en el Bloque 3

| Dato | Fuente |
| --- | --- |
| Salidas literales de los tres protocolos de auditoría | Ejecuciones registradas para esta clase con `codex-cli 0.151.0` y `Claude Code 2.1.252`, sobre Python 3.12.12 |
| Verificación de las cifras del tercer protocolo: 204 pares con promedio en punto medio redondeados hacia abajo, 12 de ellos en 3,95 | Barrido propio sobre el mismo intérprete, registrado para esta clase |
| `codex exec review` como auditoría no interactiva del cambio sin commitear | [Codex CLI — features](https://developers.openai.com/codex/cli/features) |
| Modo no interactivo `-p` y control de herramientas con `--allowed-tools` | [Claude Code — CLI reference](https://code.claude.com/docs/en/cli-reference) |
| La exigencia de un facilitador imparcial en la inspección | [IEEE Std 1028-2008](https://standards.ieee.org/ieee/1028/4402/) |

## Datos citados en el Bloque 4 y el cierre

| Dato | Fuente |
| --- | --- |
| Las tres pruebas escritas antes de corregir y su resultado `2 failed, 1 passed` | Ejecución local registrada para esta clase |
| El cambio de síntoma de `ZeroDivisionError` a `decimal.InvalidOperation` tras corregir el redondeo | Ejecución local registrada para esta clase |
| Estado final del proyecto: `8 passed`, `All checks passed!`, `INFO 0 errors` | Ejecución local registrada para esta clase |
| `pytest.raises` como forma de expresar una excepción esperada | [Documentación de pytest](https://docs.pytest.org/en/stable/reference/reference.html#pytest-raises) |
| Privacidad por diseño y finalidad declarada | Guía del módulo en [`docs/ley-21719/`](../../../../../docs/ley-21719/Guia-Maestra-Ley-21719-Proteccion-Datos-Chile-2026.pdf) |
