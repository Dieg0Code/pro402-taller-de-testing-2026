# pro402-taller-de-testing-2026

Módulo de clases de AIEP, planificado con el framework docente **aiep-educator-skills**. Este repo
automatiza buena parte del trabajo de planificar: el contenido, los decks, las infografías y la
comunicación se producen con skills de agente consistentes con la identidad AIEP.

## Cómo está organizado

- `docs/` — documentos que comparte AIEP (programa, planificaciones). Fuente oficial: no se inventa.
- `cronograma/` — la planificación en el tiempo. **Empezar por aquí.**
- `clases/` — el cuerpo del trabajo. Cada unidad (ej. `clases/semana-01/01/`) tiene:
  `README.md` (el contenido), `ppt/` (el deck), y los complementos `infografia/` y `podcast/`.
- `.agent/skills/` — las skills de agente instaladas (ver `AGENTS.md`).
- `tools/` — el sistema de slides y los validadores.

## Cómo trabajar aquí

1. Definir o leer el `cronograma/README.md`.
2. Para cada unidad: redactar su `README.md`, después el deck, y luego los complementos.
3. Validar el deck antes de cerrarlo (que abra en PowerPoint sin reparar).

Se puede hacer a mano o delegar a un agente (Claude Code / Codex): las skills ya están instaladas y
la guía para el agente está en `AGENTS.md`. Las convenciones completas están en
`docs/estandares.md` y el registro por audiencia en `docs/audiencias.md`.

> Mantener el repo al día con el framework: `aiep-skills sync` actualiza skills y tooling.
