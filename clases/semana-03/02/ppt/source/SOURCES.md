# Fuentes de recursos visuales

| Archivo local | Fuente | Uso |
| --- | --- | --- |
| `assets/logo-aiep.svg` | Identidad institucional AIEP incluida en el repositorio | Logo completo sobre fondos claros |
| `assets/logo-aiep-dark.png` | Variante institucional preparada para el módulo | Logo completo sobre fondos oscuros |

El deck no utiliza imágenes externas: las láminas se resuelven con composición, tipografía y la
paleta del sistema (`tools/slides-system/theme/tokens.js`). No se agregó ningún acento nuevo: los
cuatro colores tienen un rol declarado en el fuente —navy es la norma y el procedimiento, oro es la
auditoría y el registro, rojo son los hallazgos y el caso de fracaso, verde es lo que pasa— y la
identidad de la clase la carga la composición.

## Datos citados en el Bloque 1

| Dato | Fuente |
| --- | --- |
| La definición de auditoría y su distinción respecto de los otros cuatro tipos de revisión | [IEEE Std 1028-2008 — IEEE Standard for Software Reviews and Audits](https://standards.ieee.org/ieee/1028/4402/) |
| Los cinco temas centrales del informe, la conclusión sobre los conflictos de interés del esquema de delegación, y los hallazgos sobre los empleados autorizados y la jefatura del regulador | [Final Committee Report on the Design, Development and Certification of the Boeing 737 MAX, Comité de Transporte e Infraestructura de la Cámara de Representantes de EE. UU., 16 de septiembre de 2020](https://democrats-transportation.house.gov/imo/media/doc/final_boeing_737_max_report1.pdf) |

## Datos citados en el Bloque 2

| Dato | Fuente |
| --- | --- |
| La formulación formal del punto 8, la versión menos formal de los ojos, el bautizo de la ley y la corrección textual de Linus Torvalds | [Eric S. Raymond — *The Cathedral and the Bazaar*, sección «Release Early, Release Often» (1999)](https://www.catb.org/~esr/writings/cathedral-bazaar/cathedral-bazaar/ar01s04.html) |
| Las 87 vulnerabilidades confirmadas, los más de 100.000 USD pagados, la caída de la tasa de confirmación de más del 15 % a menos del 5 %, los tres factores declarados como causa del cierre y la fecha de término | [Daniel Stenberg — *The end of the curl bug-bounty*, 26 de enero de 2026](https://daniel.haxx.se/blog/2026/01/26/the-end-of-the-curl-bug-bounty/) |
| El defecto de OpenSSL y la desproporción entre usuarios y revisores | [The Heartbleed Bug](https://heartbleed.com/) · [CVE-2014-0160](https://www.cvedetails.com/cve/CVE-2014-0160/) |
| La objeción de que la mayoría de las personas no sabe qué buscar | Michael Howard y David LeBlanc — *Writing Secure Code*, 2.ª edición (Microsoft Press, 2003) |

## Datos citados en el Bloque 3

| Dato | Fuente |
| --- | --- |
| Las salidas de `ruff`, `pyrefly` y `pytest` del paso 1, el barrido de los bloques 1, 7, 8 y 9, la salida del comprobante, los tres casos de cancelación, y el `2 failed` de las pruebas escritas antes de corregir | Ejecuciones registradas para esta clase sobre el proyecto de reserva de laboratorio, con Python 3.12.12 |
| El alcance declarado y el criterio de término como parte del procedimiento | [IEEE Std 1028-2008](https://standards.ieee.org/ieee/1028/4402/) |
| La subcaracterística de confidencialidad, como referencia externa del paso 3 | [ISO/IEC 25010:2023](https://www.iso.org/standard/78176.html) |
| El principio de proporcionalidad aplicado a los datos del comprobante | [Ley 21.719 — Diario Oficial núm. 44.023, 13 de diciembre de 2024](https://www.diariooficial.interior.gob.cl/publicaciones/2024/12/13/44023/01/2583630.pdf) |

## Datos citados en el Bloque 4 y el cierre

| Dato | Fuente |
| --- | --- |
| Los nueve campos del reporte de incidente (cláusula 8.11), la nota sobre los otros nombres que recibe, la definición amplia de incidente, y las secciones del informe de término (cláusula 7.4) incluidas las desviaciones y los riesgos residuales | [ISO/IEC/IEEE 29119-3:2021](https://www.iso.org/standard/79429.html) |
| El informe formal como producto obligatorio de la auditoría | [IEEE Std 1028-2008](https://standards.ieee.org/ieee/1028/4402/) |

## Nota sobre las citas

Las citas de normas, informes y publicaciones en inglés aparecen traducidas en el deck, con el sello
«traducción del original en inglés» en su sello de fuente. Vale también para los nombres de las
secciones del informe del 737 MAX. Los textos literales en su idioma original están en el
`README.md` de la clase, que es el registro.
