# Estilo AIEP para infografías

El sello AIEP de una infografía no es un logo: es la **paleta + la composición**. Una lámina bien
hecha se reconoce como AIEP aunque no tenga ninguna marca.

## Paleta

Espeja los tokens de `packages/slides-system/theme/tokens.js` (la fuente de color del ecosistema):

- **Fondo claro** — `paper #F8F3EC` (crema/hueso). Nunca fondo oscuro como base.
- **Navy institucional** — `navy #102A43` (sostiene títulos, estructura, números de sección).
- **Rojo de acento** — `red #D62027`, usado con moderación (10% aprox.), nunca como fondo dominante.
- **Tinta de texto** — `ink #243B53` / `slate #52606D` para cuerpo.
- **Bordes finos** — `border #D8CFC4`.
- Apoyos suaves para fondos de tarjeta: `softBlue #E6EEF7`, `softNeutral #EDE6DA`.

Proporción tipo `60 / 30 / 10`: 60% claros, 30% navy, 10% rojo.

## Composición

- **Tarjetas blancas con borde fino** y mucho aire entre ellas. Nada apretado.
- **Secciones numeradas** (1, 2, 3…) con el número en navy como ancla visual.
- **Íconos lineales** (line icons), no ilustraciones recargadas ni 3D ruidoso.
- Jerarquía clara: un título fuerte arriba, bloques con subtítulo + dato/idea corta.
- Geometría sobria emparentada con la marca: barras, módulos rectos, cortes limpios.
- Formato por defecto: **vertical largo `1024x1536`** (apto para WhatsApp y para imprimir/compartir).

## Tono visual

- Institucional, técnico y sobrio, pero **no frío ni clínico**.
- Evitar estética de startup, gradientes ruidosos, colores fuera de marca, stock genérico.
- **Sin logos.** Convención de brief: `VIBE AIEP · SIN LOGOS`.
- Poco texto: la lámina es un mapa, no un documento.

## Texto (el punto frágil de GPT Image)

- El modelo deforma o inventa palabras. Mantener el texto **corto y en frases cerradas** para que
  tenga menos que romper.
- Español correcto: tildes y `ñ`. Revisar SIEMPRE el resultado (ver `checklist-revision.md`).
- Si una cifra o nombre propio es importante (fechas, "Instituto Comercial Liceo Bicentenario",
  "Osorno"), dejarlo explícito en el prompt y verificarlo en el PNG.
