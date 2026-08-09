---
name: reuniones-vcm
description: Construir decks de reunión de la línea de Vinculación con el Medio (VcM) de AIEP, con el sello/lockup "Vinculación con el Medio" y registro institucional. Usar para presentaciones a directiva, otros docentes, socio comunitario o aliados (no para clases). Aplica audiencia directiva/externa (ver docs/audiencias.md), densidad corta (~15-30 slides) y el componente vcmLockup de slides-system. Documenta la técnica opcional de fusión con una base institucional cuando alguien co-presenta sus propias slides.
---

# Reuniones VcM

Skill para los decks de la línea **Vinculación con el Medio**: presentaciones en vivo a la
directiva, a otros docentes, al socio comunitario o a aliados. No son clases — son presentaciones
ejecutivas con identidad institucional. Se construyen sobre `slides-aiep` + `slides-system`, pero
con tres diferencias clave: el **sello VcM**, el **registro institucional** y la **densidad corta**.

## Lo que distingue a un deck VcM

1. **El sello "Vinculación con el Medio"** en cada slide (esquina superior derecha). Es el lockup
   institucional de la línea VcM. Se aplica con el componente `vcmLockup` de `slides-system`
   (no copiar el helper a mano).
2. **Audiencia directiva / externa** (ver `docs/audiencias.md`): registro institucional, **sin
   tecnicismo, sin abreviaturas internas, sin contexto de coordinación**. Característica → beneficio.
3. **Densidad corta**: típicamente `15 a 30` slides. Cada slide es una idea que se expone hablando.
   La regla de `≥60` de los decks de clase **no aplica**.

## Flujo de trabajo

1. **Declarar la audiencia** (directiva, docente, socio comunitario, aliado — ver `docs/audiencias.md`)
   y el objetivo de la reunión (informar, sumar un aliado, rendir cuentas, lanzar).
2. Aplicar la dirección visual con `slides-aiep` (paleta, logo, patrones) — un deck VcM **sí** respeta
   identidad AIEP estricta.
3. Construir las slides con `slides-system` (PptxGenJS + tema AIEP). En **cada slide**, colocar el
   sello con `vcmLockup`:
   ```js
   const { components } = require(".../tools/slides-system");
   const { vcmLockup } = components;
   // fondo claro -> sello navy (default):
   vcmLockup(slide);
   // fondo oscuro (divisores, cierre) -> sello blanco:
   vcmLockup(slide, { onDark: true });
   ```
   El sello vive en `slides-system/assets/vcm/` y el componente lo posiciona solo
   (esquina sup-derecha, tamaño fijo).
4. **Chequeo anti-meta estricto** (ver `references/registro-institucional.md`): nada de "demo",
   "simulado", fechas tentativas marcadas como tales, ESP32, rId, abreviaturas ni referencias de
   coordinación interna. Lo interno no sale a una audiencia externa.
5. Validar el deck como cualquier otro (overflow, PowerPoint abre sin reparar, `pptx-validator`).
6. **Si alguien co-presenta sus propias slides** (p. ej. la directora abre con su base
   institucional), fusionar con la técnica de `references/fusion-base-institucional.md`. Es un
   **caso opcional**, no un paso obligatorio de todo deck VcM.

## El sello: origen y reuso

El lockup salió de extraer el `image1.svg` del PPTX institucional y recolorearlo: **navy** para
fondos claros (`lockup-vinculacion-dark.png`) y **blanco** para fondos oscuros
(`lockup-vinculacion-white.png`). Ambos están bundleados en
`packages/slides-system/assets/vcm/` y los usa `vcmLockup`. Si en el futuro cambia el sello oficial,
se reemplazan esos dos PNG en un solo lugar y todos los decks VcM quedan actualizados.

## Densidad y ritmo

- `15 a 30` slides. Si el deck crece más, probablemente está entrando en detalle de clase, no de
  reunión: recortar.
- Cada slide = una idea expuesta hablando. Portada → contexto/problema → propuesta → evidencia →
  alianza/cierre.
- Divisores y cierre suelen ir en fondo oscuro (sello blanco); el desarrollo en fondo claro
  (sello navy).

## Cuándo leer recursos adicionales

- `references/registro-institucional.md`: siempre, para fijar el registro y pasar el chequeo anti-meta.
- `references/fusion-base-institucional.md`: solo cuando haya que fusionar con slides que presenta
  otra persona (base institucional intacta + nuestras slides).

## Checklist mínimo antes de cerrar

- La audiencia quedó declarada y el registro es institucional (sin tecnicismo ni contexto interno).
- El sello VcM aparece en todas las slides (variante correcta según fondo).
- La densidad es de reunión (`15-30`), no de clase.
- El deck pasó el chequeo anti-meta: nada interno se filtró a la audiencia externa.
- El deck respeta identidad AIEP y abre limpio en PowerPoint (validado con `pptx-validator`).
- Si hubo fusión, la base institucional quedó intacta y las imágenes se remapearon bien.
