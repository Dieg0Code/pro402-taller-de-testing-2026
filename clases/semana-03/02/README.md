# Clase 08 - Semana 03 - Auditar no es mirar con más atención: alcance, orden y el registro que hace verificable un hallazgo

- **Unidad:** 01 · Calidad y Testing de Software
- **Fecha:** Martes 8 de septiembre de 2026
- **Duración:** 3 horas pedagógicas · 140 minutos (08:30 - 10:50)
- **Modalidad:** Presencial en Laboratorio PC · taller integrador
- **Docente:** Diego Obando
- **Marco de referencia:** IEEE 1028-2008 · auditoría de software · ISO/IEC/IEEE 29119-2:2021 · procesos de prueba · ISO/IEC/IEEE 29119-3:2021 · informe de término

---

# Objetivos de la Clase

## Objetivo General

Al finalizar esta sesión, el estudiante será capaz de conducir una auditoría de verificación y
validación como un procedimiento, y no como un acto de atención: con un alcance declarado antes de
empezar, un criterio que no proviene de quien audita, un orden que aplica primero las barreras
baratas y objetivas, y un registro que permite a un tercero repetir cada hallazgo sin la presencia
del auditor. Sobre esa base evaluará críticamente la creencia más repetida del software libre —que
basta con que muchos miren— contrastándola con lo que ocurrió cuando el costo de mirar cayó
efectivamente a cero, y podrá explicar por qué la cantidad de revisores nunca fue la restricción.

## Objetivos Específicos

1. **Distinguir la auditoría de los demás tipos de revisión** por las tres propiedades que la
   definen en IEEE 1028-2008 —un auditor independiente, un criterio establecido fuera del equipo y
   un informe formal obligatorio— y explicar por qué esas tres convierten su producto en algo
   oponible a un tercero, cosa que una revisión no necesita ser.
2. **Evaluar críticamente la Ley de Linus**, siguiendo su formulación original hasta la fuente,
   reconociendo por qué resultaba creíble, contrastándola con el caso documentado de un componente
   crítico mantenido por dos personas, y con lo ocurrido en 2025 y 2026 cuando revisar dejó de
   costar tiempo humano.
3. **Ordenar las barreras del módulo en una secuencia de auditoría**, justificando por qué el
   análisis automático va antes que la lectura, la lectura antes que el juicio de criterio, y la
   ejecución al final, en términos de costo y de objetividad de cada paso.
4. **Fijar el alcance de una auditoría antes de abrirla y sostener su criterio de término**,
   entendiendo que una auditoría termina cuando cubrió lo que declaró cubrir, y no cuando el auditor
   se queda sin ideas o sin tiempo.
5. **Registrar un hallazgo de modo que otro pueda verificarlo sin ayuda**, con su entrada concreta,
   el comportamiento observado, la referencia contra la cual se comparó y su clasificación como
   defecto, riesgo o estilo.
6. **Redactar el informe de término** con la estructura que define ISO/IEC/IEEE 29119-3:2021 en su
   cláusula 7.4, incluyendo explícitamente las desviaciones respecto de lo planificado y los riesgos
   que quedan abiertos, que son las dos secciones que un informe complaciente omite.

## Competencias Transversales

- **Procedimiento sobre intuición:** confiar en un orden declarado de pasos antes que en la propia
  agudeza, de modo que el resultado de una auditoría no dependa de en qué estaba inspirado quien la
  hizo.
- **Independencia del juicio:** reconocer cuándo se está evaluando el propio trabajo y qué pierde una
  auditoría cuando el criterio lo pone la misma persona que produjo lo auditado.
- **Escepticismo ante la sabiduría heredada:** preguntar qué evidencia sostiene una afirmación que
  todo el gremio repite, y qué predice esa afirmación que pueda comprobarse.
- **Comunicación de un resultado incómodo:** informar riesgos abiertos y desviaciones sin suavizarlos,
  porque un informe que solo trae buenas noticias no sirve para tomar ninguna decisión.

---

# Mapa de la Clase

| Horario | Sección | Propósito |
|---------|---------|-----------|
| 08:30 - 08:40 | Encuadre | Retomar las tres barreras que el módulo ya construyó —las herramientas, la lectura contra el requisito y el criterio con umbral— y constatar que están sueltas: falta el procedimiento que las ordena y el producto que deja constancia. |
| 08:40 - 09:05 | Bloque 1 | Separar auditoría de revisión por sus tres propiedades definitorias, y establecer qué hace que el producto de una auditoría sea oponible a un tercero. |
| 09:05 - 09:35 | Bloque 2 | Auditar la creencia de que muchos ojos encuentran todos los defectos: su origen, la evidencia en contra y el experimento que la realidad corrió cuando revisar dejó de costar. |
| 09:35 - 09:45 | Pausa | Descanso técnico. |
| 09:45 - 10:15 | Bloque 3 | Ejecutar la auditoría sobre el proyecto entregado, aplicando las barreras en orden y deteniéndose en el alcance declarado. |
| 10:15 - 10:40 | Bloque 4 | Convertir lo encontrado en registro: la ficha de hallazgo verificable y el informe de término con sus desviaciones y riesgos abiertos. |
| 10:40 - 10:50 | Cierre | Consolidar qué distingue una auditoría de una opinión con plantilla, y qué queda escrito al terminarla. |

> El taller se trabaja sobre un proyecto entregado para la sesión, ya ejecutado y con sus salidas
> registradas. Nadie queda detenido por el estado de su propio repositorio, y el procedimiento que se
> practica aquí es el mismo que después se aplica sobre cualquier código propio.

---

# BLOQUE 1: Qué es una auditoría, y qué no

- **Duración:** 25 minutos
- **Objetivo del bloque:** separar la auditoría de las demás formas de revisión por las tres
  propiedades que la definen, y establecer qué le exige eso a su producto. Al finalizar, el
  estudiante debe poder decir si lo que está haciendo sobre un código es una auditoría o es otra
  cosa, y qué le falta para serlo.
- **Modalidad:** trabajo individual, con registro escrito.
- **Ritmo sugerido:** 4 minutos para el encuadre, 6 para la definición, 7 para el caso, 5 para la
  consecuencia operativa y 3 para el ejercicio.

## Desarrollo

### 1.1 Tres barreras, ningún procedimiento

Hasta aquí el módulo construyó tres formas distintas de encontrar un problema antes de que llegue a
producción:

- **Las herramientas.** El tipado compara el código contra los tipos declarados; el linter, contra un
  catálogo de patrones conocidos. Son baratas, objetivas y no se cansan.
- **La lectura contra el requisito.** Alguien compara lo que el código hace con lo que un documento
  dice que debe hacer. Encuentra lo que ninguna herramienta puede formular, porque su fuente de
  información está fuera del código.
- **El criterio con umbral.** Una característica de calidad convertida en una frase con magnitud,
  método y umbral, que ya se puede escribir como prueba.

Las tres funcionan. El problema es que están sueltas. Nada dice en qué orden aplicarlas, hasta dónde
llegar, ni qué tiene que quedar escrito al terminar. Y sin eso, dos personas revisando el mismo
código con las mismas herramientas entregan resultados que no se pueden comparar entre sí.

Eso que falta tiene nombre y tiene norma. Se llama **auditoría**, y es el quinto tipo de revisión que
define IEEE 1028-2008 —el único que quedó pendiente en la sesión sobre revisión de código—.

### 1.2 La definición, y las tres cosas que la sostienen

La norma define la auditoría así:

> "An independent examination of a software product, software process, or set of software processes
> performed by a third party to assess compliance with specifications, standards, contractual
> agreements, or other criteria."
>
> — IEEE Std 1028-2008

En castellano: un examen **independiente** de un producto o de un proceso de software, realizado por
un **tercero**, para evaluar el cumplimiento respecto de especificaciones, estándares, acuerdos
contractuales u otros criterios.

Esa frase corta contiene tres exigencias, y ninguna es decorativa.

**Primera: el auditor es independiente.** No es quien escribió el código, ni quien lo va a mantener,
ni quien responde por el plazo de entrega. En los otros cuatro tipos de revisión que define la norma,
la independencia es una buena práctica; en la auditoría es parte de la definición. Si la persona que
audita también responde por el resultado, lo que está haciendo tiene otro nombre.

**Segunda: el criterio viene de afuera.** Una auditoría no evalúa contra el buen gusto de quien
audita, ni contra lo que al equipo le pareció razonable. Evalúa contra algo que ya estaba escrito
antes de que la auditoría empezara: una especificación, un estándar, un contrato, una ley. Ese
documento externo es —con el vocabulario de la sesión anterior— la base de prueba de toda la
auditoría.

**Tercera: el producto es un juicio de conformidad.** Una revisión técnica termina con
recomendaciones para mejorar. Una auditoría termina con una afirmación distinta: *esto cumple* o
*esto no cumple*, y con la evidencia que sostiene esa afirmación.

De ahí sale la distinción que organiza todo el bloque:

> Una **revisión** busca mejorar el producto. Una **auditoría** busca establecer si el producto
> cumple con una referencia declarada. La primera puede terminar sin hallazgos y haber sido útil; la
> segunda tiene que terminar con un veredicto, aunque el veredicto sea que todo está en orden.

### 1.3 El caso: cuando el auditor trabaja para el auditado

La independencia suena a formalismo administrativo hasta que se mira qué pasa cuando falta.

En Estados Unidos, la certificación de un avión de línea es responsabilidad de la Administración
Federal de Aviación. Como la FAA no da abasto para revisar cada componente de cada aeronave, opera
desde hace décadas un programa —la Organization Designation Authorization, ODA— por el cual **delega
parte de esa certificación en el propio fabricante**. En la práctica, empleados de la empresa quedan
autorizados para realizar trabajo de certificación en representación del regulador.

El 737 MAX de Boeing se certificó bajo ese esquema. Incluía un sistema de software llamado MCAS, que
empuja automáticamente la nariz del avión hacia abajo bajo ciertas condiciones. Dos aviones con ese
sistema se estrellaron —Lion Air 610 en octubre de 2018 y Ethiopian Airlines 302 en marzo de 2019—
con 346 personas fallecidas en total.

En septiembre de 2020, tras dieciocho meses de investigación, el Comité de Transporte e
Infraestructura de la Cámara de Representantes publicó su informe final: 238 páginas y más de setenta
hallazgos. Dos de sus cinco temas centrales son, literalmente, *"Conflicted Representation"* y
*"Boeing's Influence Over the FAA's Oversight Structure"*. Y su conclusión sobre el esquema de
delegación:

> "The FAA's current oversight structure with respect to Boeing creates inherent conflicts of
> interest that have jeopardized the safety of the flying public."

El informe documenta cómo operó ese conflicto en los dos sentidos posibles. Hacia abajo:

> "Boeing employees who have been authorized to perform work on behalf of the FAA failed to alert the
> FAA to potential safety and/or certification issues."

Y hacia arriba:

> "Multiple career FAA officials have documented examples where FAA management overruled a
> determination of the FAA's own technical experts at the behest of Boeing."

Conviene ser preciso con lo que este caso muestra y con lo que no. No muestra que los ingenieros
involucrados fueran incompetentes ni deshonestos. Muestra algo estructural: **cuando quien evalúa
depende de quien es evaluado, el resultado de la evaluación deja de ser información**. No porque
alguien mienta, sino porque nadie puede confiar en que no lo haría, y una evaluación en la que no se
puede confiar no sirve para decidir nada.

Por eso la norma pone la independencia en la definición y no en las recomendaciones.

### 1.4 Qué le exige esto al producto de una auditoría

Aquí aparece la consecuencia práctica, y es la que va a organizar el resto de la clase.

Si una auditoría existe para que **otro** —un cliente, un regulador, un equipo que recibe el sistema—
pueda apoyarse en su resultado, entonces su producto tiene que poder sostenerse sin la presencia de
quien la hizo. Alguien que nunca estuvo en la sala tiene que poder tomar el registro, repetir cada
comprobación y llegar al mismo resultado.

Eso descarta de entrada tres cosas que suelen aparecer en informes de auditoría:

| Lo que no sirve | Por qué |
| --- | --- |
| "El código está desordenado" | No dice contra qué se comparó ni cómo verificarlo. Es una impresión. |
| "Encontré varios problemas de seguridad" | Sin la entrada concreta que los produce, nadie puede reproducirlos. |
| "Revisé el módulo de pagos" | No declara hasta dónde llegó la revisión, así que no se sabe qué quedó sin mirar. |

Y deja tres exigencias, que son las mismas tres propiedades de la definición vistas desde el otro
lado:

1. **Alcance declarado**, para que se sepa qué quedó fuera.
2. **Criterio citado**, para que el veredicto sea contrastable contra el mismo documento.
3. **Hallazgos reproducibles**, para que otro llegue al mismo resultado por su cuenta.

**Una aclaración honesta antes de seguir.** Cuando audites tu propio proyecto, la primera propiedad
de la definición —la independencia— no la vas a tener. Eso es un hecho, y conviene nombrarlo en vez
de disimularlo: lo que harás sobre tu código es una revisión técnica conducida con procedimiento de
auditoría. Todo lo demás sí está a tu alcance: puedes declarar el alcance antes de empezar, citar un
criterio que no escribiste tú, aplicar los pasos en orden y dejar un registro reproducible.

Y hay una manera de acercarse a la independencia que ya practicaste: entregarle el código y el
criterio a un agente que no participó en escribirlo, y arbitrar sus hallazgos convirtiéndolos en
pruebas. No es un tercero independiente en el sentido de la norma —no responde por nada—, pero sí es
un lector que no tiene compromiso previo con las decisiones que tomaste.

### 1.5 Ejercicio

En 3 minutos, sobre cualquier revisión de código que hayas hecho o recibido:

1. **Clasifícala.** ¿Fue una revisión o una auditoría? Usa las tres propiedades de 1.2 y responde por
   cada una: ¿quién revisó era independiente?, ¿contra qué criterio escrito comparó?, ¿terminó con un
   veredicto de conformidad o con sugerencias?
2. **Anota cuál de las tres faltó.** En la mayoría de los casos falta alguna, y eso no está mal: no
   toda revisión tiene que ser una auditoría. Lo que importa es no llamarle auditoría a lo que no lo
   es.
3. **Escribe una frase de informe que no sirva**, tomada de tu propia experiencia o inventada, y
   corrígela para que cumpla las tres exigencias de 1.4.

## Preguntas guía

1. La norma exige que el auditor sea independiente y que el criterio venga de afuera. Si tú auditas
   tu propio código contra un requisito que también escribiste tú, ¿qué queda en pie de la definición
   y qué se pierde?
2. Una revisión técnica puede terminar sin hallazgos y haber sido útil. Una auditoría no puede
   terminar sin veredicto. ¿Por qué esa diferencia cambia lo que hay que hacer cuando no se encuentra
   nada?
3. El informe del 737 MAX no acusa a los ingenieros de incompetencia, sino a la estructura de
   supervisión. ¿Qué tendría que cambiar en esa estructura para que el resultado de la certificación
   volviera a ser información confiable?

## Fuentes técnicas del bloque

- [IEEE Std 1028-2008 — IEEE Standard for Software Reviews and Audits](https://standards.ieee.org/ieee/1028/4402/) — la definición de auditoría, y su distinción respecto de los otros cuatro tipos de revisión que define la norma.
- [Comité de Transporte e Infraestructura, Cámara de Representantes de EE. UU. — *Final Committee Report on the Design, Development and Certification of the Boeing 737 MAX*, 16 de septiembre de 2020](https://democrats-transportation.house.gov/imo/media/doc/final_boeing_737_max_report1.pdf) — los cinco temas centrales del informe, la conclusión sobre los conflictos de interés inherentes al esquema de delegación, y los hallazgos sobre el comportamiento de los empleados autorizados y de la jefatura del regulador. El [comunicado oficial del Comité](https://democrats-transportation.house.gov/news/press-releases/after-18-month-investigation-chairs-defazio-and-larsen-release-final-committee-report-on-boeing-737-max) resume los mismos hallazgos.
- [ISO/IEC/IEEE 29119-3:2021](https://www.iso.org/standard/79429.html) — la base de prueba como la información contra la cual se compara, aquí en el papel del criterio externo de la auditoría.

---

# BLOQUE 2: El mito de los muchos ojos

- **Duración:** 30 minutos
- **Objetivo del bloque:** auditar la creencia más repetida del software libre —que basta con que
  muchos miren— siguiéndola hasta su formulación original, recuperando la precisión que el eslogan
  perdió, y contrastándola con lo ocurrido cuando revisar dejó de costar tiempo humano. Al finalizar,
  el estudiante debe poder explicar por qué la cantidad de revisores nunca fue la restricción.
- **Modalidad:** trabajo individual, con registro escrito.
- **Ritmo sugerido:** 5 minutos para la afirmación, 5 para lo que el mismo párrafo agrega, 6 para el
  caso, 8 para el experimento reciente, 3 para lo que queda en pie y 3 para el ejercicio.

## Desarrollo

### 2.1 La afirmación, en su versión original

Si el Bloque 1 estableció que una auditoría necesita procedimiento, la objeción evidente es que tal
vez no haga falta tanto aparato. Existe una respuesta muy conocida a este problema, y dice que basta
con que mire suficiente gente.

Tiene autor y tiene fecha. Eric Raymond la publicó en *The Cathedral and the Bazaar* (1999),
analizando por qué el desarrollo del kernel de Linux funcionaba pese a no parecerse a nada de lo que
la ingeniería de software recomendaba. Es el punto 8 de su lista:

> "Given a large enough beta-tester and co-developer base, almost every problem will be characterized
> quickly and the fix obvious to someone."
>
> "Or, less formally, «Given enough eyeballs, all bugs are shallow.» I dub this: «Linus's Law»."

Traducido: dada una base suficientemente grande de gente que prueba versiones preliminares y que
además desarrolla, casi todo problema será caracterizado rápido y la corrección le resultará obvia a
alguien. O, menos formalmente, *con suficientes ojos, todos los errores son superficiales*.

Y es creíble. El mecanismo que propone es razonable: un defecto es difícil para quien no reconoce el
patrón, y trivial para quien ya lo vio antes. Con suficientes personas mirando, sube la probabilidad
de que alguna sea justamente la que reconoce ese patrón.

De las dos frases, la que sobrevivió fue la segunda. La de los ojos.

### 2.2 Lo que dice el mismo párrafo, y casi nadie cita

Igual que ocurrió con la curva de costo del defecto, la fuente contiene una precisión que el eslogan
descartó. Y esta vez la aporta el propio Linus Torvalds, a quien la ley está dedicada. Raymond la
transcribe dos líneas más abajo:

> "My original formulation was that every problem «will be transparent to somebody». Linus demurred
> that the person who understands and fixes the problem is not necessarily or even usually the person
> who first characterizes it. «Somebody finds the problem,» he says, «and somebody else understands
> it. **And I'll go on record as saying that finding it is the bigger challenge.**»"

Torvalds corrige a Raymond y deja constancia de que **encontrar el problema es el desafío mayor**, no
entenderlo ni corregirlo. Esa frase, en la fuente original de la ley de los muchos ojos, dice que el
cuello de botella está en la detección.

Hay una segunda precisión, y está en la propia redacción formal. Raymond no escribió «ojos». Escribió
**«beta-tester and co-developer base»**: gente que prueba versiones preliminares y que además
desarrolla. No usuarios. No espectadores. Personas que ejecutan el software con intención y que
además tienen la competencia para modificarlo.

El eslogan cambió *co-desarrolladores* por *ojos*, y ese cambio es el que hace falsa la versión
popular. Un ojo no revisa: mira. Y mirar no era lo que la ley pedía.

### 2.3 El caso conocido, leído con precisión

Ya vimos Heartbleed en la sesión sobre revisión de código, para establecer que un código legible por
cualquiera puede mantener un defecto grave durante años. Vale la pena volver a él por una razón
distinta, porque es el caso que siempre se usa para dar por refutada la ley de Linus.

Los hechos: OpenSSL sostenía buena parte del tráfico cifrado de internet y era mantenido por muy poca
gente. Millones de sistemas dependían de esa biblioteca; el número de personas que efectivamente
leían y modificaban su código era ínfimo en comparación.

Ahora la lectura precisa. Ese caso **no refuta la afirmación formal de Raymond**. La confirma por
ausencia: OpenSSL nunca tuvo una base grande de co-desarrolladores, así que la condición de la ley no
se cumplía. Lo que el caso refuta es el eslogan, y específicamente la sustitución que introdujo:

> Millones de usuarios no son millones de revisores. Depender de un software no es mirarlo.

Michael Howard y David LeBlanc lo habían escrito en 2003, once años antes de Heartbleed, en *Writing
Secure Code*: el problema es que **la mayoría de la gente simplemente no sabe qué buscar**. Que es
otra forma de decir lo que este módulo viene construyendo desde la clase sobre revisión: sin una
lista de comprobación y sin una base de prueba, mirar no produce hallazgos.

### 2.4 El experimento que la realidad acaba de correr

Durante veinticinco años esta discusión fue teórica, porque no había manera de conseguir muchos ojos
competentes y baratos. Eso cambió.

Hoy cualquiera puede apuntar un agente a un repositorio ajeno y producir un informe de seguridad con
apariencia profesional en minutos, sin haber leído el código y sin costo. Si la ley de los muchos
ojos fuera cierta en su versión popular, esto tendría que haber sido la edad de oro de la seguridad
del software libre.

Lo que ocurrió fue lo contrario, y está documentado con números por quien lo sufrió.

**curl** es una de las piezas de software más desplegadas del mundo: está en autos, televisores,
teléfonos y servidores. Su proyecto mantuvo durante años un programa de recompensas por
vulnerabilidades, que pagaba a quien reportara un problema de seguridad real. Daniel Stenberg, su
creador y mantenedor principal, publicó el 26 de enero de 2026 el anuncio de su cierre.

Los números que da, de su propio registro:

| Dato | Valor |
| --- | --- |
| Vulnerabilidades confirmadas en toda la vida del programa | 87 |
| Dinero pagado en recompensas | más de 100.000 USD |
| Tasa histórica de reportes que resultaban ser vulnerabilidad real | por encima del 15 % |
| Tasa desde 2025 | por debajo del 5 % |

En sus palabras:

> "Previous years we have had a rate of somewhere north of 15% of the submissions ending up confirmed
> vulnerabilities. Starting 2025, the confirmed-rate plummeted to below 5%."

Y la razón que declara para cerrarlo:

> "…the mind-numbing AI slop, humans doing worse than ever and the apparent will to poke holes rather
> than to help."

El programa terminó el 31 de enero de 2026.

Conviene leer esa cita completa antes de sacar conclusiones apresuradas, porque Stenberg nombra tres
factores y solo uno es la IA. También dice que las personas están trabajando peor que nunca, y que
aparece la voluntad de buscar agujeros en lugar de ayudar. La herramienta amplificó un problema de
incentivos que ya existía.

Pero el resultado es el que importa para esta clase: cuando los ojos se volvieron infinitos y
gratuitos, no hubo más seguridad. Hubo tanto ruido que el proyecto tuvo que **cerrar el canal que
existía para recibir hallazgos**. Los ojos no eran escasos; lo escaso era otra cosa.

### 2.5 Qué queda en pie

Lo que era escaso lo dijo Torvalds en 1999, en la misma página donde nació la ley: **caracterizar el
problema**. Un hallazgo vale cuando alguien puede decir con qué entrada ocurre, contra qué debía
compararse y cómo se reproduce. Eso no escala con la cantidad de lectores, porque no depende de
cuántos miran sino de qué tan verificable es lo que reportan.

De ahí sale la afirmación que sostiene el resto de la clase:

> El valor de una auditoría no está en cuántos hallazgos declara, sino en cuántos de ellos otro puede
> confirmar sin ayuda del que los encontró.

Es la misma regla que la sesión sobre revisión adversarial dejó establecida: un hallazgo sin entrada
concreta es una sospecha. Lo que agrega este bloque es la escala. Diez mil sospechas bien redactadas
no son mejores que ninguna; son peores, porque consumen el tiempo del único recurso verdaderamente
escaso, que es alguien competente decidiendo.

### 2.6 Ejercicio

En 3 minutos:

1. **Toma la versión formal de Raymond** —«una base suficientemente grande de beta-testers y
   co-desarrolladores»— y aplícala a un proyecto que uses a diario. ¿Cuántas personas lo *usan* y
   cuántas lo *modifican*? Si no tienes el dato exacto, estima y anota en qué te basas.
2. **Escribe la diferencia** entre ese proyecto y uno donde la ley sí se cumpliría.
3. **Formula un reporte de hallazgo inútil y su versión útil.** El inútil, del estilo que ahogó a
   curl: una afirmación de seguridad plausible y sin entrada. El útil: el mismo tema, pero con lo que
   permite a otro confirmarlo. Guarda los dos, porque el Bloque 4 vuelve sobre ellos.

## Preguntas guía

1. Raymond escribió «base de beta-testers y co-desarrolladores» y el eslogan lo convirtió en «ojos».
   ¿Qué se pierde exactamente en esa sustitución, y por qué esa pérdida vuelve falsa la versión
   popular sin que la original lo sea?
2. Torvalds dejó dicho que encontrar el problema es el desafío mayor. Si eso es cierto, ¿qué tendría
   que aportar un agente para ayudar de verdad en una auditoría, más allá de generar texto que
   parezca un hallazgo?
3. curl no cerró su programa porque recibiera pocos reportes, sino porque recibía demasiados sin
   valor. ¿Qué le habría permitido al proyecto separar los útiles de los inútiles sin leerlos todos?

## Fuentes técnicas del bloque

- [Eric S. Raymond — *The Cathedral and the Bazaar*, sección «Release Early, Release Often» (1999)](https://www.catb.org/~esr/writings/cathedral-bazaar/cathedral-bazaar/ar01s04.html) — la formulación formal del punto 8, la versión menos formal de los ojos, el bautizo de la ley, y la corrección textual de Linus Torvalds sobre cuál de las dos partes del proceso es el desafío mayor.
- [Daniel Stenberg — *The end of the curl bug-bounty*, 26 de enero de 2026](https://daniel.haxx.se/blog/2026/01/26/the-end-of-the-curl-bug-bounty/) — las 87 vulnerabilidades confirmadas y los más de 100.000 USD pagados en la vida del programa, la caída de la tasa de confirmación desde más del 15 % a menos del 5 %, los tres factores que declara como causa del cierre, y la fecha de término.
- [The Heartbleed Bug](https://heartbleed.com/) y [CVE-2014-0160](https://www.cvedetails.com/cve/CVE-2014-0160/) — el defecto de OpenSSL, ya trabajado en la sesión sobre revisión de código, aquí en su papel de contraejemplo del eslogan y no de la afirmación original.
- Michael Howard y David LeBlanc — *Writing Secure Code*, 2.ª edición (Microsoft Press, 2003) — la objeción de que la mayoría de las personas no sabe qué buscar, formulada once años antes de Heartbleed.
- [IEEE Std 1028-2008](https://standards.ieee.org/ieee/1028/4402/) — la auditoría como examen con procedimiento, frente a la lectura masiva sin método.

---

# BLOQUE 3: El procedimiento, ejecutado

- **Duración:** 30 minutos
- **Objetivo del bloque:** aplicar las barreras del módulo en un orden justificado sobre un proyecto
  entregado, comprobando que cada paso encuentra una clase de problema que el anterior no podía
  encontrar. Al finalizar, el estudiante debe poder declarar el alcance de una auditoría antes de
  abrirla y saber en qué momento termina.
- **Modalidad:** taller individual sobre el proyecto entregado para la sesión.
- **Ritmo sugerido:** 5 minutos para el orden, 4 para el alcance, 13 para los cuatro pasos, 4 para el
  criterio de término y 4 para el ejercicio.

## Desarrollo

### 3.1 El orden, y por qué es ese

Una auditoría aplica las barreras que ya conoces, pero no en cualquier orden. El orden se decide por
dos criterios que apuntan en la misma dirección:

- **Costo creciente.** Ejecutar `ruff` cuesta segundos de máquina. Leer el código contra el requisito
  cuesta atención humana. Decidir si un umbral corresponde cuesta una conversación con quien manda.
- **Objetividad decreciente.** Una herramienta no discute consigo misma: dos ejecuciones dan lo
  mismo. Un juicio de criterio depende de quién lo emite.

De ahí sale la regla: **lo barato y objetivo primero, y cada paso reduce lo que el siguiente tiene
que mirar.** No tiene sentido gastar atención humana en algo que una herramienta detecta sola.

| Paso | Contra qué compara | Qué encuentra que el anterior no podía |
| --- | --- | --- |
| **0. Alcance** | — | Fija el límite. Sin esto no hay criterio de término |
| **1. Barreras automáticas** | Los tipos declarados y un catálogo de patrones | Lo mecánico, sin juicio y sin cansancio |
| **2. El requisito escrito** | El documento del proyecto | Lo que ninguna herramienta puede formular, porque el requisito no está en el código |
| **3. Una referencia externa** | Un modelo de calidad, una norma, una ley | Lo que el requisito mismo olvidó decir |
| **4. La ejecución** | El comportamiento real, con una prueba | Separa el defecto de la sospecha y del hueco |

### 3.2 Paso 0: declarar el alcance antes de abrir nada

Una auditoría sin alcance declarado no puede terminar bien, porque no puede terminar: siempre queda
algo por mirar. Declarar el alcance es escribir, **antes** de empezar, cuatro cosas:

```text
Alcance de la auditoria
  Que se audita:      el modulo src/reservas.py
  Contra que:         REQUISITOS.md, ISO/IEC 25010 y la Ley 21.719
  Que queda fuera:    la interfaz, la persistencia y el rendimiento
  Cuando termina:     cuando los cuatro pasos se aplicaron sobre ese modulo
```

Lo importante es la tercera línea. Un informe que no declara qué quedó fuera es peor que uno
incompleto: hace creer que se revisó todo.

El proyecto de hoy es un sistema de reserva de laboratorio. Su requisito completo son cuatro reglas:

```markdown
- La jornada se divide en bloques numerados del 1 al 8.
- Un estudiante puede tener como maximo 3 reservas activas por semana.
- No se puede reservar un bloque que ya esta tomado.
- Una reserva se puede cancelar hasta 2 horas antes del inicio del bloque.

El sistema entrega un comprobante de reserva que identifica al estudiante.
```

### 3.3 Paso 1: las barreras automáticas

Primero lo que no requiere criterio. Tres comandos:

```bash
uv run ruff check .
uv run pyrefly check
uv run pytest -q
```

`ruff` encuentra uno:

```text
import json
       ^^^^
help: Remove unused import: `json`
Found 1 error.
[*] 1 fixable with the `--fix` option.
```

`pyrefly` encuentra otro:

```text
ERROR Returned type `None` is not assignable to declared return type `bool` [bad-return]
  --> src\reservas.py:18:16
   |
16 | def bloque_disponible(bloque: int, tomados: list[int]) -> bool:
17 |     if not bloque_valido(bloque):
18 |         return None
   |                ^^^^
 INFO 1 error
```

Y `pytest`:

```text
....                                                                     [100%]
4 passed in 0.03s
```

Detente en ese último resultado, porque es el que engaña. **La suite está en verde y el módulo tiene
dos defectos reales**, que van a aparecer en los pasos siguientes. Las pruebas existentes comparan el
código contra lo que su autor entendió; no contra el requisito.

Los dos hallazgos de este paso son válidos y baratos, pero fíjate en su naturaleza: un import que
sobra y un tipo de retorno que no calza. Ninguno tiene que ver con si el sistema hace lo que el
laboratorio necesita.

### 3.4 Paso 2: contra el requisito escrito

Ahora sí hace falta leer. El requisito dice que la jornada va del bloque 1 al 8. El código dice:

```python
BLOQUE_MIN = 1
BLOQUE_MAX = 8


def bloque_valido(bloque: int) -> bool:
    return BLOQUE_MIN <= bloque < BLOQUE_MAX
```

Ejecutado sobre los valores del límite:

```text
bloque 1: bloque_valido=True   puede_reservar=True
bloque 7: bloque_valido=True   puede_reservar=True
bloque 8: bloque_valido=False  puede_reservar=False
bloque 9: bloque_valido=False  puede_reservar=False
```

**El bloque 8 no se puede reservar.** El requisito lo incluye; el código lo excluye, porque usa `<`
donde correspondía `<=`. Un octavo de la jornada del laboratorio quedó inutilizable.

Ninguna herramienta podía encontrar esto. Para `ruff` y `pyrefly`, `< BLOQUE_MAX` es código
perfectamente correcto. Lo es: solo está comparando contra el número equivocado, y el número correcto
está en un archivo de texto que las herramientas no leen.

### 3.5 Paso 3: contra una referencia externa

El paso anterior compara el código contra el requisito. Este compara **el requisito contra algo que
el proyecto no escribió**. Sobre el comprobante, el requisito dice una sola frase:

> "El sistema entrega un comprobante de reserva que identifica al estudiante."

El código:

```python
def comprobante(nombre: str, rut: str, correo: str, bloque: int) -> str:
    return f"{nombre} | {rut} | {correo} | bloque {bloque}"
```

Y lo que produce:

```text
Ana Perez | 12.345.678-9 | ana.perez@correo.cl | bloque 3
```

Contra el requisito, esto **cumple**: identifica al estudiante. Sin duda alguna. Por eso el Paso 2 no
lo habría marcado.

Contra la referencia externa, no. El modelo de calidad ISO/IEC 25010 trae la subcaracterística
*confidencialidad*, que el requisito no menciona; y la Ley 21.719 exige que los datos tratados se
limiten a los necesarios para la finalidad declarada. La finalidad aquí es identificar al estudiante
en un comprobante de reserva. El nombre alcanza. El RUT y el correo no son necesarios para eso, y los
dos son datos personales.

Esta es la razón de que el paso exista como paso separado: **el requisito puede estar cumplido y aun
así estar incompleto**, y esa clase de hueco solo aparece cuando se trae una referencia de afuera.

### 3.6 Paso 4: la ejecución separa el defecto de la sospecha

Los hallazgos de los pasos 2 y 3 todavía son afirmaciones. Se convierten en hechos escribiendo la
prueba **antes** de tocar el código:

```python
def test_h1_el_bloque_8_se_puede_reservar():
    """REQUISITOS.md: la jornada se divide en bloques numerados del 1 al 8."""
    assert puede_reservar(0, 8, tomado=False) is True


def test_h2_el_comprobante_no_expone_el_rut():
    """El comprobante identifica al estudiante; el RUT no es necesario para eso."""
    salida = comprobante("Ana Perez", "12.345.678-9", "ana.perez@correo.cl", 3)
    assert RUT.search(salida) is None
```

Resultado:

```text
FAILED tests/test_hallazgos.py::test_h1_el_bloque_8_se_puede_reservar
FAILED tests/test_hallazgos.py::test_h2_el_comprobante_no_expone_el_rut
2 failed in 0.11s
```

Dos rojos. Los dos hallazgos son **defectos**, no opiniones, y ahora existe la evidencia que lo
demuestra.

**Y aparece el tercero, que no llega a serlo.** La cuarta regla del requisito dice que una reserva se
cancela «hasta 2 horas antes del inicio». El código usa `>` estricto. Ejecutado:

```text
tres horas antes                 puede_cancelar=True
exactamente dos horas antes      puede_cancelar=False
una hora antes                   puede_cancelar=False
```

¿Es un defecto? Depende de si «hasta 2 horas antes» incluye el instante exacto de las dos horas, y el
requisito no lo dice. No se puede escribir la prueba, porque no se sabe qué debería dar. Es el tercer
desenlace: **un hueco de especificación**. No falta código; falta que alguien decida.

Cuatro pasos, cuatro clases de hallazgo, y cada uno encontró algo que el anterior no estaba en
condiciones de encontrar:

| Paso | Hallazgo | Clase |
| --- | --- | --- |
| 1 · Barreras automáticas | Import sin usar · retorno `None` declarado `bool` | Mecánico |
| 2 · Contra el requisito | El bloque 8 no se puede reservar | Defecto |
| 3 · Contra referencia externa | El comprobante expone RUT y correo | Riesgo, y hueco del requisito |
| 4 · Ejecución | «Hasta 2 horas antes» no está decidido | Hueco de especificación |

### 3.7 Cuándo termina una auditoría

Termina cuando los pasos declarados se aplicaron sobre el alcance declarado. No cuando aparece algo
grave, no cuando se acaba la hora, y no cuando el auditor siente que ya encontró bastante.

Eso tiene una consecuencia que incomoda y que hay que sostener igual: **una auditoría puede terminar
sin hallazgos y estar bien hecha**, siempre que su alcance haya quedado escrito. Y al revés, una
auditoría con veinte hallazgos y sin alcance declarado no permite saber qué quedó sin revisar, que es
justamente lo que un tercero necesita saber.

Por eso el informe del bloque siguiente tiene una sección obligatoria para lo que quedó fuera.

### 3.8 Ejercicio

En 4 minutos, sobre el proyecto entregado o sobre el tuyo:

1. **Escribe la declaración de alcance** con las cuatro líneas de 3.2. Sé específico en la tercera:
   qué queda fuera.
2. **Ejecuta el Paso 1** y anota cuántos hallazgos dio y de qué naturaleza. Si tu suite queda en
   verde, escríbelo: es un dato del informe, no una ausencia de dato.
3. **Aplica el Paso 2 a una sola regla** del requisito. Elige la que tenga un límite —un mínimo, un
   máximo, un rango— y prueba los dos valores del borde.
4. **Anota un hallazgo del Paso 4** que hoy no puedas escribir como prueba, y la pregunta concreta que
   habría que responder para poder escribirla.

## Preguntas guía

1. La suite del proyecto quedó en verde en el Paso 1, y los pasos siguientes encontraron dos
   defectos. ¿Qué estaban comparando esas pruebas, y por qué eso las dejaba ciegas a estos dos casos?
2. El comprobante cumple el requisito y aun así se marcó como hallazgo. ¿Qué autoriza a un auditor a
   levantar algo que el documento del proyecto no incumple?
3. Una auditoría puede terminar sin ningún hallazgo y estar bien hecha. ¿Qué tiene que traer ese
   informe para que alguien pueda creerle, en lugar de suponer que el auditor no miró bien?

## Fuentes técnicas del bloque

- Ejecuciones registradas para esta clase sobre el proyecto de reserva de laboratorio, con Python 3.12.12: las salidas de `ruff`, `pyrefly` y `pytest` del Paso 1, el barrido de los bloques 1, 7, 8 y 9 del Paso 2, la salida del comprobante del Paso 3, y el `2 failed` de las pruebas escritas antes de corregir.
- [IEEE Std 1028-2008](https://standards.ieee.org/ieee/1028/4402/) — el alcance declarado y el criterio de término como parte del procedimiento de auditoría.
- [ISO/IEC 25010:2023](https://www.iso.org/standard/78176.html) — la subcaracterística de confidencialidad, en su papel de referencia externa del Paso 3.
- [Ley 21.719 — Diario Oficial núm. 44.023, 13 de diciembre de 2024](https://www.diariooficial.interior.gob.cl/publicaciones/2024/12/13/44023/01/2583630.pdf) — el principio de proporcionalidad aplicado a los datos del comprobante.

---

# BLOQUE 4: El registro, que es el producto

- **Duración:** 25 minutos
- **Objetivo del bloque:** convertir lo encontrado en un registro que otro pueda verificar sin ayuda,
  usando las dos estructuras que define la norma: la ficha de hallazgo y el informe de término. Al
  finalizar, el estudiante debe tener escritos ambos para la auditoría que acaba de hacer.
- **Modalidad:** taller individual, con producción escrita.
- **Ritmo sugerido:** 6 minutos para la ficha, 7 para escribirla, 8 para el informe y 4 para el
  ejercicio.

## Desarrollo

### 4.1 El hallazgo tiene forma, y la norma la define

En el Bloque 2 quedó establecido que el problema de curl no era recibir pocos reportes, sino recibir
muchos que nadie podía confirmar. La diferencia entre un reporte útil y uno inútil no es el talento
de quien lo escribe: es que tenga los campos que permiten reproducirlo.

ISO/IEC/IEEE 29119-3:2021 define esa estructura en su cláusula 8.11, con el nombre de **reporte de
incidente**. La propia norma aclara que el nombre da lo mismo:

> "Incident reports are also known as anomaly reports, bug reports, defect reports, error reports,
> issues, problem reports and trouble reports."

Y define *incidente* de forma deliberadamente amplia: un evento, condición o situación **anómala o
inesperada** en cualquier momento del ciclo de vida. No dice «defecto». Un incidente es lo que
llamó tu atención; recién después se decide qué era.

Los campos que la norma pide, y para qué sirve cada uno:

| Campo | Cláusula | Qué permite |
| --- | --- | --- |
| Identificador único | 8.11.1 | Referirse al hallazgo sin describirlo de nuevo |
| Información temporal | 8.11.2 | Saber sobre qué versión ocurrió |
| Autor | 8.11.3 | Saber a quién preguntarle |
| **Contexto** | 8.11.4 | **Reproducirlo: la entrada concreta y el entorno** |
| **Descripción** | 8.11.5 | **Qué se observó y qué se esperaba** |
| Severidad estimada | 8.11.6 | Cuánto daño haría |
| Prioridad estimada | 8.11.7 | Con qué urgencia atenderlo |
| Riesgo | 8.11.8 | Qué pasa si no se corrige |
| Estado | 8.11.9 | En qué quedó |

Los dos en negrita son los que separan un hallazgo de una sospecha. Sin contexto no se puede
reproducir; sin descripción de lo observado **y lo esperado**, no se puede decidir si está mal.

Y hay un detalle en la redacción de la norma que vale la pena mirar. Los campos 8.11.6 y 8.11.7 no se
llaman «severidad» y «prioridad»: se llaman **«originator's assessment of severity»** y
**«originator's assessment of priority»** — la estimación *de quien reporta*. La norma no le pide al
auditor que dictamine la gravedad; le pide que declare la suya, dejando constancia de que es una
estimación y de quién la hizo. Es la misma disciplina de todo el módulo: separar lo que se observó de
lo que se opina sobre lo observado.

### 4.2 Las fichas de la auditoría de hoy

Así queda el primer hallazgo del Paso 2:

```text
ID          H-01
Version     src/reservas.py, sin corregir
Autor       [tu nombre]
Contexto    puede_reservar(reservas_de_la_semana=0, bloque=8, tomado=False)
            Python 3.12.12, sin dependencias externas
Observado   Devuelve False. El bloque 8 no se puede reservar.
Esperado    True. REQUISITOS.md: "la jornada se divide en bloques
            numerados del 1 al 8".
Referencia  REQUISITOS.md, primera regla
Evidencia   tests/test_hallazgos.py::test_h1_el_bloque_8_se_puede_reservar
            2 failed in 0.11s
Severidad   Alta segun el autor: inutiliza un octavo de la jornada
Riesgo      Si no se corrige, el laboratorio pierde un bloque diario
Clase       Defecto
Estado      Abierto
```

Y el del Paso 3:

```text
ID          H-02
Version     src/reservas.py, sin corregir
Autor       [tu nombre]
Contexto    comprobante("Ana Perez", "12.345.678-9",
                        "ana.perez@correo.cl", 3)
Observado   "Ana Perez | 12.345.678-9 | ana.perez@correo.cl | bloque 3"
Esperado    Un comprobante que identifique al estudiante sin incluir
            datos personales innecesarios para esa finalidad.
Referencia  ISO/IEC 25010:2023, confidencialidad. Ley 21.719, principio
            de proporcionalidad.
Evidencia   tests/test_hallazgos.py::test_h2_el_comprobante_no_expone_el_rut
            2 failed in 0.11s
Severidad   Alta segun el autor: son datos personales en una salida
            que circula
Riesgo      Exposicion de RUT y correo de cada estudiante que reserva
Clase       Defecto contra referencia externa. El requisito no lo prohibia.
Estado      Abierto
```

Fíjate en el campo **Referencia** de la segunda. Ahí está la diferencia con un reporte del tipo que
ahogó a curl: no dice «esto es inseguro», dice contra qué documento se comparó. Un tercero puede
abrir ese documento y discrepar con argumentos, que es exactamente lo que hace verificable a un
hallazgo.

El tercer hallazgo, el de las dos horas, se registra igual pero con dos campos distintos:

```text
Clase       Hueco de especificacion
Estado      Requiere decision: definir si "hasta 2 horas antes" incluye
            el instante exacto. Sin esa definicion no se puede escribir
            la prueba.
```

No tiene evidencia de prueba porque no puede tenerla, y eso se declara en lugar de disimularse.

### 4.3 El informe de término

La ficha registra un hallazgo. El informe registra **la auditoría completa**, y es lo que un tercero
lee primero. La norma lo define en la cláusula 7.4, y de sus diez secciones hay dos que un informe
complaciente siempre omite:

- **7.4.3 Desviaciones respecto de lo planificado.** Qué se dijo que se iba a hacer y no se hizo.
- **7.4.7 Riesgos residuales.** Qué queda expuesto después de esta auditoría.

Ninguna de las dos trae buenas noticias, y por eso ninguna de las dos puede faltar: un informe que
solo dice lo que se hizo bien no sirve para tomar ninguna decisión.

El informe de la auditoría de hoy, completo:

```markdown
# Informe de termino - Auditoria de src/reservas.py

## Alcance
Se audito el modulo src/reservas.py contra REQUISITOS.md, ISO/IEC 25010
y la Ley 21.719. Quedaron fuera la interfaz, la persistencia y el
rendimiento.

## Resumen de lo realizado
Se aplicaron los cuatro pasos del procedimiento: barreras automaticas
(ruff, pyrefly, pytest), comparacion contra el requisito escrito,
comparacion contra referencia externa, y ejecucion de los hallazgos
como pruebas escritas antes de corregir.

## Desviaciones respecto de lo planificado
Ninguna. Los cuatro pasos se aplicaron sobre el alcance declarado.

## Evaluacion de termino
La auditoria se considera completa para el alcance declarado.

## Hallazgos
- H-01 Defecto. El bloque 8 no se puede reservar. Abierto.
- H-02 Defecto contra referencia externa. El comprobante expone RUT y
  correo. Abierto.
- H-03 Hueco de especificacion. "Hasta 2 horas antes" no define si
  incluye el instante exacto. Requiere decision.
- Dos hallazgos mecanicos de herramienta: import sin usar y retorno
  None declarado bool.

## Riesgos residuales
- Todo lo que quedo fuera del alcance no fue mirado: interfaz,
  persistencia y rendimiento.
- Las pruebas preexistentes del proyecto (4 passed) comparan el codigo
  contra lo que entendio su autor, no contra REQUISITOS.md. Su color
  verde no es evidencia de conformidad.
- H-03 no se puede cerrar sin una decision de producto.

## Lecciones
La suite estaba en verde con dos defectos presentes. El color de la
suite no dice nada sobre la conformidad mientras no se sepa contra que
compara.
```

Ese documento tiene una propiedad que ningún hallazgo suelto tiene: **alguien que no estuvo puede
tomarlo, repetir cada paso y llegar al mismo resultado**. Eso es lo que distingue una auditoría de una
opinión con plantilla.

### 4.4 Ejercicio

En 4 minutos:

1. **Escribe la ficha completa** de un hallazgo tuyo, con todos los campos de 4.2. Si algún campo
   queda vacío, no lo borres: escribe por qué no lo puedes llenar. Un campo vacío declarado también
   es información.
2. **Recupera el reporte inútil** que escribiste en el ejercicio del Bloque 2 y complétalo hasta que
   tenga contexto, observado, esperado y referencia. Compara las dos versiones.
3. **Escribe las dos secciones incómodas** de tu informe: desviaciones y riesgos residuales. En la
   segunda tiene que aparecer, como mínimo, todo lo que declaraste fuera del alcance.

## Preguntas guía

1. La norma llama al campo «estimación de severidad **de quien reporta**», y no simplemente
   «severidad». ¿Qué cambia esa palabra, y qué problema evita en un informe que va a leer un tercero?
2. El hallazgo del comprobante cita como referencia un modelo de calidad y una ley, no el requisito
   del proyecto. ¿Por qué esa cita es justamente lo que lo hace discutible, y por qué eso es una
   virtud y no un defecto del reporte?
3. Un informe de auditoría sin sección de riesgos residuales parece mejor que uno que la tiene.
   ¿Qué pierde exactamente quien recibe el informe sin esa sección?

## Fuentes técnicas del bloque

- [ISO/IEC/IEEE 29119-3:2021](https://www.iso.org/standard/79429.html) — la estructura del reporte de incidente (cláusula 8.11) con sus nueve campos, la nota de la cláusula 3.4 sobre los otros nombres que recibe, la definición amplia de incidente (3.3), y las diez secciones del informe de término (cláusula 7.4), incluidas las desviaciones respecto de lo planificado (7.4.3) y los riesgos residuales (7.4.7).
- [IEEE Std 1028-2008](https://standards.ieee.org/ieee/1028/4402/) — el informe formal como producto obligatorio de la auditoría.
- Ejecuciones registradas para esta clase: las salidas citadas en las fichas H-01 y H-02, y el `2 failed` de las pruebas escritas antes de corregir.

---

# Cierre de la Sesión

## 1. Lo que queda en tu proyecto

Al terminar la sesión, en tu proyecto debe existir:

- la declaración de alcance de tu auditoría, con lo que quedó fuera escrito de forma específica;
- la salida de las barreras automáticas, incluido el resultado aunque haya sido en verde;
- al menos un hallazgo del Paso 2, con los dos valores del borde que probaste;
- al menos un hallazgo del Paso 3, con la referencia externa citada;
- la ficha completa de un hallazgo, con los campos que no pudiste llenar declarados como tales;
- un hallazgo que hoy no se pueda escribir como prueba, con la pregunta que habría que responder;
- y el informe de término, con sus secciones de desviaciones y de riesgos residuales.

## 2. Lo que podemos afirmar hoy

La sesión anterior terminó con esta afirmación:

```text
El requisito fue comparado contra un modelo de calidad y contra la ley,
y lo que faltaba esta escrito y tiene una prueba que lo vigila.
```

Hoy la afirmación cambia de naturaleza. Ya no habla de lo que se comparó, sino de **quién puede
confiar en esa comparación**:

```text
La comparacion se hizo con un procedimiento declarado,
y su resultado puede repetirlo alguien que no estuvo.
```

Y lo que sigue sin poder afirmarse:

```text
El sistema no tiene mas defectos.
```

Esa frase no se puede sostener, y esta vez la razón no es un vacío que se pueda llenar trayendo otra
referencia. Es estructural: **una auditoría cubre el alcance que declaró cubrir**. Todo lo demás
quedó sin mirar por decisión explícita, y por eso está escrito en la sección de riesgos residuales.
Un informe honesto no elimina la incertidumbre; la delimita.

Queda además una pregunta que hoy se resolvió por intuición. En el Paso 2 se probaron los bloques 1,
7, 8 y 9. ¿Por qué esos cuatro y no otros? Porque parecía sensato mirar los bordes. Es una buena
intuición, y funcionó, pero una intuición no es un método: no se puede enseñar, no se puede auditar y
no garantiza haber mirado lo que correspondía.

## 3. Ticket de salida

Antes de salir, responde en una línea cada una:

1. ¿Qué declaraste fuera del alcance de tu auditoría, y dónde quedó eso escrito?
2. ¿Cuál de tus hallazgos podría verificar alguien que no estuvo hoy, usando solo tu ficha?
3. ¿Qué encontró tu Paso 3 que tu propio requisito no prohibía?

## 4. Próxima clase: dejar de elegir los casos por intuición

Hoy el defecto del bloque 8 apareció porque a alguien le pareció razonable probar los extremos del
rango. Esa corazonada tiene nombre técnico, tiene procedimiento y tiene norma: se llama análisis de
valores límite, y es una de las técnicas de diseño de casos de prueba que define
ISO/IEC/IEEE 29119-4.

La próxima sesión abre la Unidad 2 con esas técnicas —partición de equivalencia, valores límite y
tablas de decisión—, que responden la pregunta que hoy quedó abierta: de todas las entradas posibles,
cuáles hay que probar y por qué esas.

## Mensaje final

> El proyecto de hoy tenía la suite en verde. Cuatro pruebas, ninguna falla, todas escritas por
> alguien que conocía bien el código. Y tenía un defecto que dejaba un octavo de la jornada del
> laboratorio inutilizable, y un comprobante que repartía el RUT y el correo de cada estudiante que
> reservaba. Ninguna de esas cuatro pruebas iba a encontrarlos nunca, porque comparaban el código
> contra lo que su autor había entendido. Lo que los encontró no fue mirar con más atención ni pedirle
> a más gente que mirara: fue aplicar cuatro pasos en un orden declarado, contra referencias que el
> proyecto no había escrito, y dejar constancia de hasta dónde se llegó.

### Fuentes técnicas del cierre

- [ISO/IEC/IEEE 29119-3:2021](https://www.iso.org/standard/79429.html) — el informe de término y el reporte de incidente como productos del proceso de prueba.
- [IEEE Std 1028-2008](https://standards.ieee.org/ieee/1028/4402/) — la auditoría como examen independiente con criterio externo e informe obligatorio.
- [Eric S. Raymond — *The Cathedral and the Bazaar* (1999)](https://www.catb.org/~esr/writings/cathedral-bazaar/cathedral-bazaar/ar01s04.html) y [Daniel Stenberg — *The end of the curl bug-bounty* (2026)](https://daniel.haxx.se/blog/2026/01/26/the-end-of-the-curl-bug-bounty/) — la ley de los muchos ojos y lo que ocurrió cuando los ojos dejaron de ser escasos.
- Ejecuciones registradas para esta clase sobre Python 3.12.12: las salidas de las tres herramientas, los barridos de los pasos 2, 3 y 4, y el `2 failed` de las pruebas escritas antes de corregir.
