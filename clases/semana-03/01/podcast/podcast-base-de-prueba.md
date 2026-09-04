# Podcast — Clase 07: La base de prueba

- Audiencia: estudiantes técnicos de segundo año de PRO402.
- Propósito: explicar por qué una suite puede proteger un defecto cuando su base de prueba es el propio código, y cómo los criterios y fuentes externas permiten revelar vacíos del requisito.
- Formato: Conversación en profundidad de NotebookLM, 27 min 24 s.
- Generación: cuadro de personalización del Resumen de Audio.
- Fuente conceptual: README de la Clase 07; cargar únicamente ese documento.
- Audio generado: `Por_qué_el_verde_oculta_fugas_críticas.m4a`.

## Prompt final

```text
Genera un podcast educativo conversado en español neutro para estudiantes técnicos de segundo año que ya saben programar y están aprendiendo testing.

Abre con esta paradoja: una suite muestra “42 passed”, pero al corregir una fuga de RUT fallan diez pruebas. ¿Cómo puede una suite verde proteger un defecto?

Desarrolla el episodio como una investigación, no como una lectura del README:

1. Cada etapa del ciclo de vida permite pruebas distintas según el material disponible. Un error en el requisito puede ser invisible para las pruebas posteriores porque ellas lo usan como referencia.
2. Cuestiona la regla 100:1 usando los matices y estudios del documento. Probar temprano sigue importando, pero por una razón lógica, no por repetir una cifra.
3. Explica la “base de prueba”: la información usada para diseñar los casos y juzgar sus resultados.
4. Contrasta las dos suites del experimento. Una copia el comportamiento del código; la otra puede disentir porque tiene un requisito.
5. Explica cómo ISO/IEC 25010 convierte “debe ser seguro” en un criterio con magnitud, método y umbral.
6. Usa el RUT para conectar confidencialidad, finalidad, proporcionalidad y privacidad desde el diseño según la Ley 21.719.
7. Cierra con la cadena: PRINCIPIO → REQUISITO → COMPORTAMIENTO → PRUEBA → EVIDENCIA.

Mantén una conversación dinámica entre dos voces: una explica y la otra cuestiona las conclusiones fáciles. Usa ejemplos concretos, respeta exactamente las cifras del README y no inventes información.

Conclusión: las fuentes externas reducen los vacíos del requisito, pero no demuestran que esté completo.
```

## Notas de generación

- Elegir **Conversación en profundidad** y una duración larga si está disponible.
- Mantener el idioma de salida en español.
- Cargar únicamente el README para evitar que el audio enumere diapositivas.
- Guardar el audio final en esta misma carpeta y actualizar arriba su nombre real si NotebookLM propone otro título.
