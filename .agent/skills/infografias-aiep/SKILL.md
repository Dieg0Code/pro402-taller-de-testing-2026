---
name: infografias-aiep
description: Diseñar infografías en estilo AIEP generadas con GPT Image (gpt-image-1) desde una app desktop (ChatGPT o Codex Desktop). Usar cuando haya que crear una infografía de apoyo, lámina resumen, cronograma visual o material complementario en imagen. NO genera la imagen por API (no hay API key): la skill produce el brief/prompt, decide el estilo y la composición, y luego revisa y archiva el PNG resultante. El registro se adapta a la audiencia (ver docs/audiencias.md).
---

# Infografías AIEP

Skill para producir infografías estilo AIEP. **La generación de la imagen ocurre en una app desktop**
(ChatGPT o Codex Desktop, que sí tienen la herramienta de GPT Image); aquí no hay API key. Por eso el
trabajo de la skill es el **brief, el estilo, la revisión y el archivado**, no llamar a un modelo.

Es la evolución del material visual del framework: de componentes vectoriales en `slides-system` a
imágenes generadas. Distinta de la infografía libre de NotebookLM (esa es más suelta); aquí el estilo
AIEP es estricto.

## Flujo de trabajo

1. **Declarar la audiencia y el propósito** (ver `docs/audiencias.md`). Una lámina para alumnos
   técnicos, para la directiva o para el socio comunitario no dicen lo mismo ni con el mismo registro.
2. **Reunir el contenido fuente**: leer el `README.md` de la clase/taller, el cronograma o los docs
   del proyecto. La infografía **deriva** de ese contenido (jerarquía de verdad, ver `docs/estandares.md`);
   no inventa datos.
3. **Mirar infografías de referencia** ya existentes en el repo (las `*-gptimage.png` previas) para
   copiar la composición institucional y mantener la familia visual. Esto es lo que da consistencia
   entre láminas.
4. **Escribir el brief/prompt** siguiendo `references/brief-template.md` y el estilo de
   `references/estilo-aiep-infografia.md`. Poco texto, jerarquía clara, **sin logos**.
5. **Generar en la app desktop**: entregar el prompt a ChatGPT/Codex Desktop con GPT Image. Tamaño
   por defecto `1024x1536` (vertical largo), calidad alta. (Si hay un agente con capacidad de imagen
   disponible, se le puede delegar el brief; el resultado es igual: un PNG.)
6. **Revisar el PNG resultante** con `references/checklist-revision.md`. Lo más frágil de GPT Image
   es el **texto**: revisar ortografía, tildes, `ñ` y que no haya palabras deformadas o inventadas.
   También: consistencia con la paleta AIEP, que no se hayan colado logos, y que los datos calcen con
   la fuente.
7. **Archivar** en la carpeta-unidad (`infografia/` o `infografias/`):
   - el PNG con la convención de nombre `infografia-<tema>-gptimage.png` (sufijo `-gptimage` = marca
     de procedencia; agregar `-<NNNN>w` si se guardan variantes de resolución);
   - **y el prompt usado**, junto al PNG (mismo nombre base, `.md` o `.txt`). Versionar el prompt es
     parte del entregable: hoy se pierde y no se puede regenerar ni iterar la lámina.
8. Si la lámina no pasó la revisión (texto roto, dato equivocado, se salió del estilo), **ajustar el
   prompt y regenerar**, no parchear el PNG.

## Reglas duras

- **Sin logos.** Las infografías AIEP van sin marcas registradas; el sello de identidad es la paleta
  y la composición, no un logotipo. Convención interna en briefs: `VIBE AIEP · SIN LOGOS`.
- **Estilo AIEP estricto** (ver `references/estilo-aiep-infografia.md`): fondo claro, navy + rojo,
  tarjetas blancas con borde fino, íconos lineales, secciones numeradas, mucho aire.
- **Poco texto.** La infografía es un mapa visual, no un documento. Frases cortas, datos clave.
- **El texto debe quedar perfecto.** Revisar siempre la ortografía del resultado; es la falla típica
  de GPT Image y arruina una lámina por lo demás buena.
- **Registro por audiencia.** Para directiva/externos: sin tecnicismo, sin abreviaturas internas,
  traducir característica → beneficio (ver `docs/audiencias.md`).

## Cuándo leer recursos adicionales

- `references/estilo-aiep-infografia.md`: siempre, para fijar paleta, composición y tono visual.
- `references/brief-template.md`: al redactar el prompt de generación.
- `references/checklist-revision.md`: al revisar el PNG generado, antes de archivarlo.

## Checklist mínimo antes de cerrar

- La audiencia y el propósito quedaron declarados y el registro calza.
- El contenido deriva de la fuente real (README/cronograma/docs), sin datos inventados.
- El estilo se siente AIEP y emparenta con las infografías previas del repo.
- No hay logos.
- El texto está en español correcto, sin palabras deformadas por el modelo.
- El PNG quedó con nombre `-gptimage` en la carpeta-unidad, **con su prompt versionado al lado**.
