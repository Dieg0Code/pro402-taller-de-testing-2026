# Fusión con una base institucional (caso opcional)

A veces otra persona **co-presenta** y es dueña de unas slides (la directora abre con la base
institucional Misión/Visión/Valores + Modelo VcM). En ese caso no se rehace su parte: se conserva
**intacta** y nuestras slides se fusionan después. Esto es **opcional** — la mayoría de los decks
VcM son de una sola fuente (todas nuestras slides con `vcmLockup`).

## La técnica

1. Generar **nuestras** slides con `slides-system` a un `.pptx` aparte (`parte.pptx`), cada una con
   el sello `vcmLockup`.
2. Recortar la base institucional a las slides que esa persona presenta (ej. 1–5).
3. Copiar cada slide nuestra (formas + fondo + imágenes, **remapeando los rId** de las imágenes)
   sobre el layout "Blank" de su base.
4. Si hay video, incrustarlo **después** de la fusión (python-pptx copia imágenes, no media).

Se corre con `uv` sin instalar nada global: `uv run --with python-pptx python fusionar.py`.

> Cada slide nuestra debe pintar un **fondo opaco a sangre** para no heredar formas del master de la
> base. (En `slides-system`, el helper de fondo ya lo hace.)

## Plantilla: `fusionar.py`

Recorta la base a N slides y fusiona nuestras slides encima. Ajustar `BASE`, `PART`, `OUT` y el
índice de recorte (`[5:]` = conservar 5).

```python
#!/usr/bin/env python
"""Fusiona base institucional (intacta) + nuestras slides (parte.pptx).
Uso: uv run --with python-pptx python fusionar.py"""
import copy, os
from io import BytesIO
from pptx import Presentation
from pptx.oxml.ns import qn

HERE = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.join(HERE, "base", "base-institucional.pptx")  # la base de quien co-presenta
PART = os.path.join(HERE, "parte.pptx")                        # nuestras slides (slides-system)
OUT  = os.path.join(HERE, "deck-final.pptx")

R_EMBED, A_BLIP = qn("r:embed"), qn("a:blip")
base, part = Presentation(BASE), Presentation(PART)

# 1) Recortar la base a sus primeras N slides (aquí 5)
sldIdLst = base.slides._sldIdLst
for sldId in list(sldIdLst)[5:]:
    rId = sldId.get(qn("r:id"))
    if rId:
        base.part.drop_rel(rId)
    sldIdLst.remove(sldId)

blank_layout = base.slides[0].slide_layout

def copy_slide(src):
    dst = base.slides.add_slide(blank_layout)
    for sh in list(dst.shapes):              # limpiar placeholders heredados
        sh._element.getparent().remove(sh._element)
    src_cSld = src._element.find(qn("p:cSld"))
    dst_cSld = dst._element.find(qn("p:cSld"))
    src_bg = src_cSld.find(qn("p:bg"))       # fondo a sangre
    if src_bg is not None:
        dst_cSld.insert(0, copy.deepcopy(src_bg))
    for el in list(src.shapes._spTree):      # formas
        if el.tag in (qn("p:nvGrpSpPr"), qn("p:grpSpPr")):
            continue
        dst.shapes._spTree.append(copy.deepcopy(el))
    for blip in dst._element.iter(A_BLIP):   # remapear imágenes cross-package
        rId = blip.get(R_EMBED)
        if not rId:
            continue
        img_part = src.part.related_part(rId)
        _, new_rId = dst.part.get_or_add_image_part(BytesIO(img_part.blob))
        blip.set(R_EMBED, new_rId)
    return dst

for s in part.slides:
    copy_slide(s)
base.save(OUT)
print("OK:", OUT, "·", len(base.slides._sldIdLst), "slides")
```

## Plantilla: `agregar-video.py` (solo si hay video)

`fusionar.py` no copia media. Para incrustar un video reproducible, ubicar la slide por una marca de
texto y usar `add_movie` con un poster.

```python
#!/usr/bin/env python
"""Incrusta un video reproducible tras la fusión.
Uso: uv run --with python-pptx python agregar-video.py"""
import os
from pptx import Presentation
from pptx.util import Inches

HERE = os.path.dirname(os.path.abspath(__file__))
DECK = os.path.join(HERE, "deck-final.pptx")
VIDEO = os.path.join(HERE, "assets", "video.mp4")
POSTER = os.path.join(HERE, "assets", "poster.jpg")
LEFT, TOP, WIDTH, HEIGHT = Inches(6.88), Inches(2.11), Inches(5.54), Inches(4.33)  # = rect de la imagen de portada
MARCA = "El dispositivo en 3D"  # texto que identifica la slide destino

prs = Presentation(DECK)
target = next((sl for sl in prs.slides
               for sh in sl.shapes
               if sh.has_text_frame and MARCA in sh.text_frame.text), None)
if target is None:
    raise SystemExit(f"No se encontró la slide con '{MARCA}'")
target.shapes.add_movie(VIDEO, LEFT, TOP, WIDTH, HEIGHT,
                        poster_frame_image=POSTER, mime_type="video/mp4")
prs.save(DECK)
print("OK: video incrustado")
```

## Qué es reusable vs circunstancial

- **Reusable:** la técnica de fusión (recorte + copia de spTree + remapeo de rId), el patrón
  add_movie por marca de texto, y el sello `vcmLockup`.
- **Circunstancial:** las slides específicas de quien co-presenta, sus assets, el número exacto de
  slides a conservar y el video puntual. Eso cambia en cada reunión.
