# Checklist de revisión del PNG

Revisar la imagen generada **antes** de archivarla. GPT Image produce láminas atractivas pero con
fallas típicas; esta lista las caza.

## Texto (lo primero y lo más importante)

- [ ] Ortografía correcta: sin palabras deformadas, inventadas o cortadas.
- [ ] Tildes y `ñ` presentes y bien puestas.
- [ ] Los datos exactos que pediste (fechas, nombres propios, cifras) aparecen y son correctos.
- [ ] No se "comió" ningún dato clave (ej. una fecha que estaba en el brief).
- [ ] No hay texto de relleno sin sentido (lorem-ipsum-ish, glifos raros).

## Estilo AIEP

- [ ] Fondo claro, navy + rojo, proporción `60/30/10` (el rojo no domina).
- [ ] Tarjetas blancas con borde fino, íconos lineales, secciones numeradas, mucho aire.
- [ ] Se siente de la misma familia que las infografías AIEP previas del repo.
- [ ] **No se coló ningún logo** ni marca registrada.
- [ ] Tono institucional/sobrio, sin estética de startup ni gradientes ruidosos.

## Contenido y audiencia

- [ ] El contenido deriva de la fuente real (README/cronograma/docs), sin inventar.
- [ ] El registro calza con la audiencia declarada. Para directiva/externos: sin tecnicismo, sin
      abreviaturas internas, característica traducida a beneficio.
- [ ] Sin contexto interno indebido (nada de "demo/simulado", códigos de coordinación, etc.) si la
      lámina es para audiencia externa.

## Archivado

- [ ] Nombre `infografia-<tema>-gptimage.png` (con `-<NNNN>w` si hay variantes de resolución).
- [ ] Guardada en la carpeta-unidad (`infografia/` o `infografias/`).
- [ ] El **prompt** quedó versionado junto al PNG (mismo nombre base, `.md`/`.txt`).

> Si algo falló: ajustar el prompt y regenerar. No editar el PNG a mano para "tapar" un error del
> modelo — la lámina debe poder reproducirse desde su prompt.
