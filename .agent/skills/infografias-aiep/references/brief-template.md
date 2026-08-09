# Plantilla de brief / prompt

El brief es el entregable de la skill (lo que se lleva a la app desktop). Guardarlo junto al PNG
como provenance. Estructura recomendada:

```
INFOGRAFÍA AIEP — <tema>

AUDIENCIA: <técnica | escolar | docente | directiva | externa>  (registro y nivel de tecnicismo)
PROPÓSITO: <para qué sirve la lámina, dónde se usa>
FORMATO: vertical largo 1024x1536, calidad alta. VIBE AIEP · SIN LOGOS.

ESTILO:
- Fondo claro (crema #F8F3EC). Navy #102A43 para estructura y números. Rojo #D62027 como acento (poco).
- Tarjetas blancas con borde fino, íconos lineales, secciones numeradas, mucho aire.
- Institucional, técnico, sobrio. Sin logos, sin gradientes ruidosos, sin stock genérico.

TÍTULO: <título corto y fuerte>
SUBTÍTULO: <una línea, opcional>

SECCIONES (poco texto, frases cerradas):
1. <título sección> — <idea/dato clave>
2. ...
3. ...

DATOS QUE DEBEN APARECER TAL CUAL (verificar en el resultado):
- <fechas, nombres propios, cifras exactas>

PIE (opcional): <ej. "Osorno, Región de Los Lagos · AIEP">

TEXTO: español de Chile, con tildes y ñ. Mantener los textos cortos y bien escritos.
```

## Consejos

- Si hay infografías previas en el repo de la misma familia, mencionarlo: "componer en el mismo
  estilo que las láminas AIEP previas" — ayuda a la consistencia.
- No meter párrafos largos: GPT Image rompe el texto largo. Preferir bullets y datos sueltos.
- Para audiencias no técnicas: traducir característica → beneficio dentro del propio brief, no esperar
  que el modelo lo haga.
- Iterar sobre el **prompt**, no sobre el PNG. Si algo sale mal, ajustar el brief y regenerar.
