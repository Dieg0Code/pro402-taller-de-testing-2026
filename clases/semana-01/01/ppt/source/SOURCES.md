# Procedencia de imágenes — Clase 01

Todas las imágenes de esta clase provienen de Wikimedia Commons con licencia
verificada antes de descargarlas. Ninguna imagen de los casos históricos fue
generada: fabricar una fotografía sintética de un accidente real con víctimas
sería una falsificación, aunque se viera bien en la lámina.

| Archivo | Contenido | Autor | Licencia | Origen |
| --- | --- | --- | --- | --- |
| `assets/caso-therac-interfaz.png` | Interfaz de operador del Therac-25 | — | Copyrighted free use | [Commons](https://commons.wikimedia.org/wiki/File:Therac25_Interface.png) |
| `assets/caso-ariane5.jpg` | Cohete Ariane 5 en la plataforma de lanzamiento | Bill Ingalls (NASA) | Dominio público | [Commons](https://commons.wikimedia.org/wiki/File:Ariane_5_with_James_Webb_Space_Telescope_Prelaunch._(NHQ202112230013).jpg) |
| `assets/caso-nyse.jpg` | Piso de transacciones de la Bolsa de Nueva York | Carol M. Highsmith (Library of Congress) | Dominio público | [Commons](https://commons.wikimedia.org/wiki/File:No_Known_Restrictions_Trading_Floor,_New_York_Stock_Exchange_(Highsmith_LOC)_(6718386525).jpg) |
| `assets/caso-apollo-hamilton.jpg` | Margaret Hamilton junto a los listados del software de vuelo del Apollo | NASA / MIT (restauracion de Adam Cuerden) | Dominio publico | [Commons](https://commons.wikimedia.org/wiki/File:Margaret_Hamilton_-_restoration.jpg) |
| `assets/logo-aiep-hd.png` | Logo AIEP a color, alta resolución | AIEP | Institucional | Generado desde `logo-aiep.svg` del framework |
| `assets/logo-aiep-hd-blanco.png` | Logo AIEP para fondos oscuros | AIEP | Institucional | Generado desde `logo-aiep.svg` del framework |

## Notas de honestidad visual

- **Ariane 5**: la fotografía corresponde a un Ariane 5 posterior, no al vuelo 501
  de 1996. La lámina lo declara explícitamente para no inducir a error.
- **Therac-25**: es la interfaz real del operador, que es justamente donde se
  activaba el defecto al corregir un dato demasiado rápido. Es material técnico
  auténtico, no una recreación.
- **Apollo 11**: la fotografia es autentica y corresponde al equipo que escribio ese software.
  Se usa como contrapunto: un sistema que fallo y aun asi cumplio la mision.
- **Knight Capital**: no existe imagen del incidente. Se usa el piso de la Bolsa
  de Nueva York como contexto, declarado como tal en la lámina.

## Logos AIEP

El PNG del framework (`.agent/skills/slides-aiep/assets/logo-aiep.png`) tiene el
fondo blanco horneado —canal alfa opaco en toda la imagen— y solo 156 px de
ancho, por lo que dibuja un recuadro blanco sobre fondos oscuros. Las versiones
de esta carpeta se regeneran desde el SVG vectorial con transparencia real a
1560 px. Conviene corregirlo en el framework.
