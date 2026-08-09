# Quality Gates

## Meta de cantidad (según perfil de deck)

La densidad depende de **qué deck es** y **para quién**. Declarar la audiencia (ver
`docs/audiencias.md`) antes de fijar la cantidad.

**Perfil "deck de clase" (audiencia técnica/escolar, sesión larga):**
- Para clases de `3 horas`, el deck final debe tener al menos `60` diapositivas.
- Meta recomendada: `60 a 75`.
- Menos de `60` suele indicar ritmo insuficiente o contenido demasiado comprimido.

**Perfil "deck institucional / reunión" (audiencia directiva, docentes, socio comunitario):**
- Mucho más corto: típicamente `15 a 30` diapositivas. Una presentación en vivo a una directiva o
  a un aliado no se infla a 60 slides; cada slide es una idea que se expone hablando.
- Acá manda la claridad y el registro institucional, no la cobertura curricular. Para este perfil,
  usar la skill `reuniones-vcm` (sello de Vinculación con el Medio + reglas de audiencia externa).
- La regla de `≥60` **no aplica** a este perfil: forzarla rompe el ritmo de una presentación
  ejecutiva.

## Cómo expandir sin relleno

Si el deck queda corto, ampliar con:

- ejemplos concretos;
- errores comunes;
- comparaciones útiles;
- preguntas guía;
- mini casos;
- slides de transición entre ideas;
- recapitulaciones parciales;
- pasos intermedios de un proceso;
- distinciones conceptuales que ayuden a enseñar mejor.

No ampliar con:

- texto repetido;
- párrafos innecesarios;
- slides casi vacías sin función pedagógica;
- cambios cosméticos que no agregan ritmo ni comprensión.

## Validación visual

- No debe haber overflow ni texto fuera de cajas.
- No debe haber elementos pegados a bordes sin intención clara.
- La portada y aperturas de bloque deben verse emparentadas.
- Las slides internas deben mantener la misma familia visual.
- El rojo debe aparecer como acento controlado.
- El deck debe seguir sintiéndose AIEP aunque se quite el logo de una slide interna.
- El deck no debe sentirse plano, frío o burocrático.
- Si varias slides parecen la misma tarjeta repetida con otro texto, falta ritmo visual.
- Ninguna slide debe contener comentarios meta sobre el deck, su versión o su proceso de construcción.
- Si una slide se sostiene solo por un par de bloques grandes con mucho texto, probablemente le falta elegancia.
- Si la distribución no ayuda a explicar el contenido, el layout está fallando aunque se vea “ordenado”.
- Si apertura, desarrollo, preguntas y cierre se ven casi iguales, el deck está perdiendo capacidad de conducción.
- Si tres slides consecutivas comparten el mismo esqueleto visual, revisar composición y ritmo.
- La variación debe ser intencional: cambiar solo colores no cuenta como cambio de estructura.
- Si un bloque nuevo parece una copia del bloque anterior con texto reemplazado, el deck no pasó la revisión visual.
- Si una clase nueva recicla la misma distribución general de otra clase sin una razón pedagógica clara, rehacer composición.
- Si una slide incluye componentes web simulados, esos componentes deben verse operables y bien resueltos: botones alineados, inputs consistentes, jerarquía clara y acciones ubicadas donde se esperan.
- Ninguna maqueta de interfaz importante para el contenido debería sentirse improvisada, torcida o decorativa; si enseña UI, la UI debe estar bien hecha.
- Si una slide incluye código, el snippet no debería verse como texto plano: debe usar tipografía monoespaciada, sintaxis resaltada y una composición coherente con un editor real.
- Si una slide comenta partes del código, revisar que exista un anclaje visual claro entre explicación y snippet; no debería depender solo de proximidad espacial o intuición del estudiante.
- Si los conectores pasan por encima del código, del texto explicativo o de otras tarjetas, el patrón está mal resuelto y debe rehacerse.
- Si los conectores gritan más que el código o que la anotación, también están mal resueltos; el recorrido debe ser secundario respecto del snippet y la tarjeta explicativa.
- Si una slide incluye comandos, JSON, árboles de archivos o paneles técnicos, esos artefactos deben verse nativos a su contexto y no como cajas de texto genéricas.
- Si un artefacto técnico se repite entre clases y sigue resuelto ad hoc dentro de un deck, todavía no pasó el estándar del repositorio: debe extraerse a `tools/slides-system/`.
- Un deck nuevo no debería nacer copiando helpers viejos desde otra clase si el sistema central ya ofrece tema, primitives o componentes equivalentes.

## Validación operativa

- Si se modificó `tools/slides-system/`, ejecutar `npm run test:all` dentro de ese directorio.
- No cerrar una mejora de librería con `typecheck`, `build`, `vitest`, `cspell` o chequeo de mojibake fallando.
- Si el deck nuevo usa TypeScript o depende de `dist/`, ejecutar `npm run build` en `tools/slides-system/` antes de regenerar el `.pptx`.
- Después de generar el deck, ejecutar la validación de overflow y revisar el render visual.
- Confirmar apertura correcta del archivo en PowerPoint; si PowerPoint intenta reparar, el deck no está listo.
- Si la validación detecta fallos, corregir y regenerar antes de seguir.
- No dar por bueno un deck solo porque “abre”: debe abrir limpio y además pasar revisión visual y textual.

## Validación pedagógica

- Cada bloque debe tener apertura, desarrollo y cierre reconocibles.
- Debe existir una progresión clara entre slides.
- El número de slides debe traducirse en mejor conducción de clase, no en más ruido.
- El deck debe apoyar al docente y no competir con su explicación.
- La composición debe sostener la atención del estudiante y marcar cambios de función dentro del relato.
- El lenguaje visual debe acompañar la explicación: comparar debe sentirse distinto de secuenciar, preguntar, sintetizar o cerrar.
- El lenguaje visual también debe distinguir una clase de otra: continuidad institucional sí, clonación entre decks no.
- Antes de cerrar, preguntar explícitamente: ¿esta distribución ayuda a enseñar este contenido o solo es la misma plantilla aplicada otra vez?
