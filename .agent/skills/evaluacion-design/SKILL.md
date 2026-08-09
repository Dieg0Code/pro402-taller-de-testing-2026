---
name: evaluacion-design
description: Diseñar y estructurar evaluaciones docentes para este repositorio. Usar cuando el docente necesite crear o mejorar una evaluación práctica o teórica, definir consigna, requisitos mínimos, rúbrica, política de IA/agentes, criterios de corrección, método de entrega, materiales de apoyo o decks operativos breves para preparación de evaluaciones.
---

# Evaluacion Design

Usar esta skill para convertir una intención de evaluación en un paquete claro, comparable y pedagógicamente sólido para este repo.

## Flujo de trabajo

1. Leer primero `cronograma/README.md` y el `README.md` de la evaluación o clase asociada.
2. Fijar el contexto: carrera/módulo y audiencia evaluada (ver `docs/audiencias.md`). La rúbrica, los requisitos y la política de IA dependen del oficio que se evalúa; los ejemplos de abajo son del perfil técnico web, no un molde universal.
3. Distinguir si se trata de:
   - una evaluación práctica;
   - una evaluación teórica;
   - una evaluación mixta;
   - o un material de preparación para una evaluación.
4. Definir primero qué evidencia de aprendizaje se quiere observar. No partir por la herramienta ni por el formato de entrega.
5. Diseñar la evaluación en este orden:
   - consigna;
   - alcance y restricciones;
   - requisitos mínimos;
   - rúbrica;
   - qué suma y qué baja puntos;
   - política de IA/agentes;
   - método de entrega;
   - materiales de apoyo.
6. Mantener el alcance acotado para que los resultados sean comparables entre estudiantes.
7. Evaluar producto y proceso cuando corresponda. En este repo eso suele incluir calidad técnica, criterio, validación y orden de entrega.
8. Publicar la rúbrica y la política de IA antes de cerrar el material.
9. Si la evaluación tiene un material de preparación, mantenerlo breve, operativo y sin ambigüedades.
10. Recién después producir README, deck, infografía o ejemplos.

## Principios base

Usar por defecto estas reglas:

- evaluar desempeño auténtico, no solo repetición;
- partir desde resultados de aprendizaje claros;
- usar rúbricas criteriales y transparentes;
- evaluar producto y proceso cuando aporte valor;
- acotar el alcance para que sea comparable;
- explicitar siempre la política de IA/agentes;
- pedir evidencia de criterio técnico, no automatismo;
- y cerrar con una entrega profesional.

Si hace falta justificar o profundizar estas decisiones, leer `references/pedagogia-evaluacion.md`.

## Patrones para este repositorio

### README de evaluación

- Escribirlo breve, instructivo y directo.
- Priorizar:
  - qué hay que hacer;
  - cómo se evaluará;
  - qué suma y qué baja;
  - y cómo se entrega.
- Si la sesión misma es una evaluación, no forzar una clase expositiva de 4 bloques salvo que el docente lo pida.

### Rúbrica

- Preferir porcentajes simples que sumen `100`.
- Hacer visible qué pesa más antes del día de la evaluación.
- En evaluaciones prácticas web, usar por defecto esta base si el docente no pide otra:
  - `20%` HTML y semántica;
  - `20%` CSS y sistema visual;
  - `20%` responsive y versión móvil;
  - `15%` calidad visual general;
  - `10%` accesibilidad básica;
  - `10%` uso de IA con criterio;
  - `5%` orden y entrega.

### Política de IA y agentes

- Dejar explícito qué está permitido.
- No evaluar "quién promptéa más bonito".
- Evaluar cómo el estudiante:
  - define el problema;
  - usa el agente;
  - valida el resultado;
  - y entrega algo técnicamente defendible.
- Recordar siempre:
  - el agente ayuda a proponer;
  - la revisión humana sigue siendo obligatoria.

### Método de entrega

- Priorizar GitHub cuando el contexto lo permita.
- Aceptar `.zip` o `.rar` cuando sea necesario.
- Dejar claro si entregas por WhatsApp o correo bajan puntaje en el criterio de orden y entrega.

### Materiales de apoyo

- Para evaluaciones prácticas web, conviene usar:
  - `BRIEF`;
  - `SPEC`;
  - `DESIGN`;
  - `AGENTS`;
  - ejemplos resueltos;
  - y scaffolds.
- Una infografía suele servir bien como mapa operativo.
- Un podcast suele ser opcional y normalmente no hace falta si la evaluación es procedural.
- Si se hace un deck auxiliar de preparación en una carpeta como `ejemplo-web/ppt/`, puede ser breve. No necesita comportarse como un deck completo de clase de 60 slides.

## Soporte para evaluaciones web prácticas

Cuando la evaluación sea construir una página o artefacto web:

1. Definir tipos de proyecto permitidos comparables.
2. Especificar requisitos mínimos técnicos.
3. Explicitar qué hace que el resultado se sienta profesional y no de juguete.
4. Separar claramente:
   - requisitos obligatorios;
   - refinamientos que suman puntos;
   - errores que bajan puntos.
5. Si se permite Codex, acompañar la evaluación con un flujo claro:
   - `BRIEF -> SPEC -> DESIGN -> AGENTS -> implementación -> validación -> entrega`.

## Cuándo leer recursos adicionales

- Leer `references/pedagogia-evaluacion.md` cuando haya que justificar criterios, definir política de IA, diseñar una rúbrica o decidir entre evaluación auténtica, teórica o mixta.

## Convenciones de salida

- Si el docente pide solo consigna, escribir solo consigna.
- Si pide solo rúbrica, escribir solo rúbrica.
- Si pide un README de evaluación, mantenerlo breve y operativo.
- Si pide un deck de evaluación, diseñarlo como guía de ejecución y no como clase teórica.
- Si pide revisar una evaluación, priorizar claridad, comparabilidad, autenticidad, política de IA y viabilidad real para el tiempo disponible.
