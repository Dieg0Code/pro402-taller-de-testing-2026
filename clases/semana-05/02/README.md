# Clase 14 - Semana 05 - La suite dice qué pasó, no qué se decidió probar: plan de pruebas, riesgo y una trazabilidad que se ejecuta

- **Unidad:** 02 · Desarrollo y Ejecución de Casos de Prueba
- **Fecha:** Martes 29 de septiembre de 2026
- **Duración:** 3 horas pedagógicas · 140 minutos (08:30 - 10:50)
- **Modalidad:** Presencial en Laboratorio PC
- **Docente:** Diego Obando
- **Marco de referencia:** ISO/IEC/IEEE 29119-3:2021 · el plan de pruebas (7.2) y la conformidad adaptada (cláusula 4) · ISO/IEC/IEEE 29119-2:2021 · la estrategia de pruebas basada en riesgo · la matriz de trazabilidad entre requisitos y casos de prueba · marcadores de `pytest` y recolección de la suite sin ejecutarla · Ley 21.719 · los derechos del titular convertidos en requisitos verificables

---

# Objetivos de la Clase

## Objetivo General

Al finalizar esta sesión, el estudiante será capaz de responder, sobre su propio proyecto, una
pregunta que su suite de pruebas no puede responder por sí sola: **qué quedó sin probar, y por qué
eso es aceptable**. Las cinco sesiones anteriores dejaron una suite que informa un hecho cierto y
verificable —cuántas pruebas se ejecutaron y cuántas pasaron—, y ese hecho, por sólido que sea, es
un informe sobre lo que existe. No dice nada sobre lo que no existe. Una suite completa en verde y
una suite a la que le falta la mitad de lo importante producen exactamente la misma línea de salida,
y ninguna herramienta puede distinguirlas, porque la información que las separa no está en el
código.
Esa información se escribe en otra parte, y esa otra parte tiene nombre y estructura definidos en una
norma: el **plan de pruebas**, el documento de nivel de gestión de ISO/IEC/IEEE 29119-3 que la
sesión de la Unidad 1 dedicada al ciclo de vida inventarió sin desarrollar. El estudiante establecerá
qué contiene ese documento que no puede estar en ningún archivo del repositorio —el alcance, lo que
queda deliberadamente fuera, los supuestos sobre los que se trabaja, los riesgos asumidos y el
criterio por el cual se declara que probar fue suficiente— y aplicará la modalidad de conformidad
que la propia norma contempla para recortarlo: declarar qué partes se aplican y cuáles no, y por
qué. Omitir con criterio declarado es conformidad; omitir en silencio, no.
Sobre esa base la sesión ataca el problema que hasta ahora quedó sin método. La sesión de diseño de
casos estableció que probar todo es imposible y entregó técnicas para elegir los casos dentro de una
función; lo que nunca se decidió con criterio fue el nivel anterior: **cuánto esfuerzo merece cada
parte del sistema**. Hasta hoy el estudiante eligió el nivel de cada prueba porque era el tema de la
clase —unitaria en una sesión, de integración en la siguiente—, no porque algo lo justificara. El
criterio que la norma usa para ese reparto es el riesgo, entendido como la combinación de qué tan
probable es que algo falle y qué tan grave sería que fallara, y el estudiante lo aplicará contando
las pruebas que ya tiene y contrastando ese reparto real con el reparto del riesgo.
El núcleo técnico de la sesión es la **trazabilidad**, y la forma en que se trabaja aquí es lo que la
separa de la planilla que se firma y envejece. Si el identificador del requisito vive dentro de la
prueba, la relación entre ambos deja de ser una afirmación de un documento y pasa a ser un dato que
se puede extraer de la suite y volver a extraer mañana. El estudiante construirá esa matriz
ejecutándola, y leerá los dos huecos que revela y que ninguna ejecución en verde había mostrado
nunca: requisitos que ninguna prueba cubre, y pruebas que no responden a ningún requisito —que son,
con otro nombre, las pruebas derivadas de la implementación que la Unidad 1 aprendió a reconocer.
Y establecerá también el límite de la herramienta, que es la parte que la vuelve utilizable sin
creerle de más: una matriz demuestra que la relación entre un requisito y una prueba existe, no que
la prueba compruebe el requisito, de modo que una fila declarada cubierta puede estar vacía por
dentro. Lo que resuelve esa duda no es la matriz sino alterar el código y exigir que la suite
reaccione.
La sesión cierra convirtiendo en filas de esa misma matriz las obligaciones que hasta ahora se
habían tratado bloque a bloque: los derechos que la Ley 21.719 reconoce al titular de los datos. Cada
derecho se escribe como requisito con criterio de aceptación y se baja a un caso de prueba
ejecutable, y el derecho de supresión aporta el hallazgo que ordena todo el bloque: una prueba que
comprueba el borrado mirando un solo lugar pasa en verde mientras el dato sigue existiendo en otro.
Eliminar no es una operación sobre una tabla, sino una propiedad del sistema completo, y demostrarla
exige saber en cuántos lugares está el dato antes de escribir la prueba que afirma que ya no está.

## Objetivos Específicos

1. **Distinguir el plan de pruebas de la suite de pruebas**, nombrando con precisión qué información
   contiene el primero que no puede deducirse del segundo —alcance, exclusiones declaradas,
   supuestos, riesgos y criterio de salida—, y explicando por qué dos suites con resultados idénticos
   pueden corresponder a decisiones de prueba completamente distintas.
2. **Aplicar la conformidad adaptada que contempla ISO/IEC/IEEE 29119-3**, produciendo un plan
   proporcionado al tamaño del proyecto propio en el que cada parte omitida quede declarada junto con
   su justificación, de modo que el recorte sea una decisión documentada y no una ausencia.
3. **Convertir un riesgo en una decisión de nivel de prueba**, estimando sus dos factores —qué tan
   probable es el fallo y qué tan grave sería— y justificando con ellos si ese riesgo se cubre con
   una prueba unitaria, una de integración o una de extremo a extremo, en lugar de elegir el nivel
   por costumbre o por facilidad.
4. **Contrastar el reparto real del esfuerzo de prueba con el reparto del riesgo**, contando las
   pruebas que la suite propia dedica a cada parte del sistema y sosteniendo una lectura del
   resultado: qué zona está sobreprobada porque era barato probarla y qué zona quedó descubierta
   aunque su fallo sea el más caro.
5. **Construir una matriz de trazabilidad de forma ejecutable**, marcando cada prueba con el
   identificador del requisito que la justifica y generándola desde la propia suite; interpretar sus
   dos clases de hueco —el requisito sin ninguna prueba que lo cubra y la prueba que no responde a
   ningún requisito—, y sostener por qué un requisito que la matriz declara cubierto todavía puede
   no estar verificado, comprobándolo con una alteración deliberada del código.
6. **Escribir los derechos del titular que reconoce la Ley 21.719 como requisitos verificables con
   criterio de aceptación**, bajarlos a casos de prueba concretos sobre el proyecto, demostrar
   ejecutando por qué una prueba de supresión que comprueba un solo lugar de almacenamiento pasa en
   verde aunque el dato personal siga existiendo en el sistema, y fundamentar en cada lugar de
   almacenamiento la decisión entre suprimir el registro y anonimizarlo.

## Competencias Transversales

- **Declarar lo que se deja fuera:** la diferencia entre un alcance recortado y un alcance
  incompleto no está en cuánto se cubrió, sino en si alguien puede leer qué se decidió no cubrir; lo
  omitido en silencio no se distingue de lo olvidado.
- **Repartir el esfuerzo por consecuencia y no por comodidad:** la tendencia natural es probar
  mucho donde probar es fácil y poco donde es incómodo, y el resultado tiene buen aspecto mientras
  nadie pregunte dónde duele más un fallo.
- **Preferir el artefacto que se regenera al documento que se firma:** una afirmación que hay que
  mantener a mano empieza a mentir el día siguiente a escribirla, y nadie se entera; una que se
  vuelve a producir desde la fuente no puede quedar desactualizada sin que se note.
- **Poder responder «¿contra qué?» frente a cualquier prueba propia:** una prueba que no sabe qué
  requisito la justifica no es necesariamente incorrecta, pero es una prueba que nadie puede
  defender ni retirar con fundamento.
- **Tratar un derecho de una persona como un requisito con criterio de aceptación:** mientras un
  derecho se enuncie en lenguaje jurídico no se puede probar ni incumplir de forma demostrable, y esa
  imposibilidad de demostrar es justamente lo que la ley deja de aceptar.

---

# Mapa de la Clase

| Horario | Sección | Propósito |
|---------|---------|-----------|
| 08:30 - 08:40 | Encuadre | Constatar el punto al que llegó el proyecto —una suite con pruebas de los tres niveles, en verde— y plantear la pregunta que esa suite no responde: qué quedó sin probar. Situar la semana de cierre: el plazo de la segunda evaluación parcial ya venció el viernes, y el corte final es este miércoles 30. |
| 08:40 - 09:05 | Bloque 1 | Qué información contiene un plan de pruebas que no puede estar en el código, leída sobre la norma que la define. Alcance, exclusiones, supuestos, riesgos y criterio de salida. La conformidad adaptada como permiso explícito para recortar declarando. Y el plan que devuelve un agente cuando se le pide uno. |
| 09:05 - 09:30 | Bloque 2 | El riesgo como criterio para repartir el esfuerzo, con sus dos factores. De cada riesgo a una decisión de nivel de prueba. El recuento de la suite propia y el contraste entre dónde están las pruebas y dónde está el riesgo. |
| 09:30 - 09:40 | Pausa | Descanso técnico. |
| 09:40 - 10:10 | Bloque 3 | La matriz de trazabilidad, generada desde la suite en lugar de escrita a mano. El identificador del requisito dentro de la prueba, la extracción sin ejecutar, y la lectura de sus tres resultados: el requisito sin prueba, la prueba sin requisito, y el requisito que la matriz declara cubierto sin estarlo. |
| 10:10 - 10:40 | Bloque 4 | Los derechos del titular de la Ley 21.719 escritos como requisitos con criterio de aceptación y convertidos en casos de prueba. La demostración del derecho de supresión: la misma prueba pasa mirando una tabla y falla cuando mira el sistema completo. Y la decisión que ninguna prueba puede tomar: suprimir o anonimizar. |
| 10:40 - 10:50 | Cierre | Consolidar la relación entre las tres cosas que la sesión puso juntas —lo que la suite informa, lo que el plan decidió y lo que la matriz comprueba— y dejar planteado el límite que las vuelve frágiles: todo esto depende de que alguien se acuerde de ejecutarlo. |

> Se trabaja sobre el mismo proyecto de reserva de laboratorio de las sesiones anteriores, con la
> suite que quedó acumulada hasta hoy y con dos piezas que la sesión necesita para ser demostrable.
> La primera es el archivo de requisitos que la Unidad 1 dejó iniciado, ahora con identificadores
> estables: sin ellos no hay nada que trazar. La segunda es un registro de eventos, una segunda
> tabla donde el sistema guarda lo que fue ocurriendo, y es la que vuelve observable el asunto del
> último bloque: el mismo dato personal vive en más de un lugar, y quien escribe la prueba de
> borrado tiene que saberlo antes de escribirla.

## Punto de partida: un resultado de ejecución no es una respuesta sobre el alcance

Cuando una suite termina e informa cuántas pruebas pasaron, está informando un hecho cierto sobre las
pruebas que existen. Ese hecho no contiene, ni puede contener, información sobre las pruebas que no
existen. Es la misma limitación de siempre, llevada un nivel más arriba: así como una prueba en verde
no demuestra que el código sea correcto sino que ese caso concreto se comportó como se esperaba, una
suite en verde no demuestra que el sistema esté probado, sino que lo que alguien decidió probar se
comportó como esa persona esperaba. **Quién fue esa persona, qué decidió y qué descartó son datos que
no quedan registrados en ninguna parte del repositorio.**

En este material, el **plan de pruebas** es el documento donde esas decisiones quedan escritas antes
de ejecutarse, y la **trazabilidad** es la propiedad que permite verificar después que las decisiones
escritas y las pruebas ejecutadas son la misma cosa. Las dos se trabajan aquí como artefactos
técnicos, no como formalidad administrativa: el plan porque fija el alcance y el criterio de salida,
que son afirmaciones que alguien puede discutir y que nadie puede deducir leyendo el código; la
matriz porque se genera desde la suite y, al generarse, delata las dos incoherencias que una
ejecución en verde jamás muestra.

Esas dos incoherencias son el hallazgo central de la sesión, y hay una tercera que la matriz no
alcanza a ver y que la sesión resuelve por otra vía. Un **requisito sin prueba** es una
promesa del sistema que nadie está comprobando, y el problema es que la suite pasa igual. Una
**prueba sin requisito** es una comprobación que nadie pidió, y el problema es más sutil: suele ser
una prueba escrita mirando lo que el código hace, de modo que fija el comportamiento actual en lugar
de la regla, y el día que la regla cambie esa prueba se pondrá roja defendiendo la versión
equivocada. La Unidad 1 ya había aprendido a reconocer esa clase de prueba leyéndola; hoy se la
puede listar por nombre.

La tercera es la que obliga a no confiar del todo en las dos anteriores: un **requisito que la matriz
declara cubierto** porque alguna prueba dice responder a él, mientras esa prueba comprueba otra cosa.
Ahí ningún artefacto de los que la sesión construye alcanza, y lo que decide es volver a la técnica
de la sesión de cobertura: alterar el código a propósito y exigir que la suite se ponga roja.

El recorrido de trabajo de la sesión es **declarar → priorizar → trazar → comprobar**. Se declara el
alcance y lo que queda fuera, se prioriza el esfuerzo según el riesgo, se traza cada prueba hasta el
requisito que la justifica, y se comprueba ejecutando que esa traza es verdadera. Ninguna afirmación
de esta sesión se da por buena porque esté escrita en el plan: se da por buena cuando algo se ejecuta
y lo confirma.

---

# BLOQUE 1: Veinte pruebas en verde no dicen qué se decidió probar

- **Duración:** 25 minutos
- **Objetivo del bloque:** establecer qué información contiene un plan de pruebas que no puede
  deducirse del código ni de la suite, leyéndola en la norma que la define en lugar de en una
  plantilla heredada, y comprobar con una ejecución que un proyecto puede tener toda su suite en
  verde mientras arrastra un defecto que contradice su requisito. Al finalizar, el estudiante debe
  poder nombrar las diez partes que la norma pide para un plan, distinguir las que describen
  decisiones de las que describen circunstancias, y explicar qué exige exactamente la norma para
  que omitir una de ellas siga siendo conforme.
- **Modalidad:** exposición con lectura de la norma y ejecución en vivo sobre el proyecto, y
  registro escrito individual.
- **Ritmo sugerido:** 3 minutos para el estado de la suite, 6 para leer el plan en la norma, 4 para
  la conformidad adaptada, 5 para el experimento con el agente, 4 para la comprobación por ejecución
  y 3 para el hallazgo final y el ejercicio.

## Desarrollo

### 1.1 Veinte pruebas en verde, y la pregunta que no responden

El proyecto llega a esta sesión con todo lo que las cinco sesiones anteriores fueron dejando: las
funciones de reglas con sus casos elegidos por partición de equivalencia y valores límite, la
función de cupo construida escribiendo la prueba antes que el código, la API con su contrato
corregido, la *fixture* que le da a cada prueba una base de datos propia y la borra al terminar, y
desde la sesión anterior una interfaz web con sus propias pruebas de extremo a extremo.

Dos palabras se van a usar durante toda la sesión y conviene fijarlas antes. **Suite** es el conjunto
de pruebas automatizadas del proyecto: las que se ejecutan juntas, con un solo comando, y producen un
resultado único. **Fixture** es la pieza que prepara lo que una prueba necesita antes de que corra y
lo deshace cuando termina; la de este proyecto crea una base de datos nueva para cada prueba y la
elimina al final.

El proyecto tiene hoy **dos suites**: la de `pytest`, que prueba las funciones y la API, y la de
Playwright, que prueba la interfaz con un navegador y corre con otro ejecutor. Salvo que se diga otra
cosa, en esta sesión «la suite» es la de `pytest`. La otra vuelve en el bloque 3, porque plantea un
problema propio.

Ejecutada completa, la suite de `pytest` informa:

```text
....................                                                     [100%]
20 passed in 1.80s
```

Veinte casos, ningún fallo, menos de dos segundos. Es un resultado que en cualquier equipo se
presentaría como evidencia de que el trabajo está hecho.

Ahora la pregunta de la sesión, que conviene hacerse antes de seguir: **¿qué quedó sin probar?**

La respuesta no está en esa salida y no puede estarlo. El texto `20 passed` es un informe sobre
veinte pruebas que existen. Sobre las pruebas que no existen no dice nada, y no porque la
herramienta sea limitada: no hay forma de que un programa informe sobre algo que nadie escribió. Si
mañana alguien borrara ocho de las veinte, la suite informaría `12 passed` y seguiría siendo
verde. El color no cambia cuando falta cobertura; solo cambia cuando lo que hay falla.

Esto es la misma limitación de siempre, corrida un nivel hacia arriba. La Unidad 1 estableció que
una prueba en verde no demuestra que el código sea correcto, sino que ese caso concreto se comportó
como alguien esperaba. Sumando: **una suite en verde no demuestra que el sistema esté probado, sino
que lo que alguien decidió probar se comportó como esa persona esperaba.** Quién fue esa persona,
qué decidió incluir, qué decidió dejar afuera y con qué argumento son cuatro datos que no están en
ningún archivo del repositorio y que ninguna herramienta puede reconstruir.

Esos cuatro datos son el contenido de un documento que tiene nombre, estructura definida y una norma
que lo especifica.

### 1.2 El plan de pruebas, leído en la norma que lo define

La sesión de la Unidad 1 dedicada al ciclo de vida inventarió los documentos que define
ISO/IEC/IEEE 29119-3:2021 y encontró que casi todos ya existían en el proyecto bajo otro nombre: los
casos de prueba eran las funciones `test_*`, el procedimiento era el comando de ejecución, el
registro era la salida de la herramienta. En ese inventario había un documento del **nivel de
gestión** —el que vale para este proyecto y no para cada prueba concreta— que quedó nombrado y sin
desarrollar. Es el de la cláusula 7.2, y se llama **plan de pruebas**.

La norma lo define así, en su cláusula 3.19:

> "detailed description of test objectives to be achieved and the means and schedule for achieving
> them, organized to coordinate testing activities for some test item or set of test items"
>
> — ISO/IEC/IEEE 29119-3:2021, cláusula 3.19

En español: *descripción detallada de los objetivos de prueba que se quieren alcanzar, y de los
medios y el calendario para alcanzarlos, organizada para coordinar las actividades de prueba sobre
un elemento de prueba o un conjunto de ellos*.

Dos términos de esa definición hay que fijarlos antes de seguir, porque se usan en todo el bloque:

- **Elemento de prueba** (*test item*): la cosa concreta que se va a probar. En este proyecto son
  las funciones de reglas, el módulo de persistencia, la ruta de la API y el modelo que valida el
  cuerpo de la solicitud. No es «el sistema» en abstracto, sino una lista enumerable.
- **Objetivo de prueba**: qué se quiere averiguar probando ese elemento. No es «que funcione», que
  no es averiguable, sino algo del tipo «que rechace las solicitudes que el requisito manda
  rechazar».

Y una convención de lectura que la norma usa y conviene tener presente desde ahora, porque decide
qué es obligatorio y qué no:

> "Requirements of this document are marked by the use of the verb 'shall'. Recommendations are
> marked by the use of the verb 'should'. Permissions are marked by the use of the verb 'may'."
>
> — ISO/IEC/IEEE 29119-3:2021, nota 4 de la cláusula 4.1.1

`shall` es exigencia, `should` es recomendación, `may` es permiso. Quien lee una norma sin distinguir
esos tres verbos termina tratando como obligatorio todo lo que aparece impreso, y de ahí sale la
idea de que cumplir una norma es llenar formularios.

**Las diez partes que la norma pide.** La cláusula 7.2 se subdivide en diez, y esta es la lista
completa, con el nombre que trae la norma y lo que significa cada una aplicada a un proyecto real:

| Cláusula | Nombre en la norma | Qué contiene |
|---|---|---|
| 7.2.1 | *Overview* | Identificación del documento, su alcance y a qué se aplica. |
| 7.2.2 | *Context of testing* | Qué se va a probar, en qué proyecto se inserta y qué queda fuera. |
| 7.2.3 | *Assumptions and constraints* | Lo que se da por cierto sin haberlo verificado, y lo que limita el trabajo. |
| 7.2.4 | *Stakeholders* | Quién tiene interés en el resultado de estas pruebas. |
| 7.2.5 | *Testing communication* | Quién informa qué, a quién y cada cuánto. |
| 7.2.6 | *Risk register* | Los riesgos identificados, con su valoración y su tratamiento. |
| 7.2.7 | *Test strategy* | El enfoque: qué niveles, qué técnicas, qué datos, qué ambiente, cuándo se para. |
| 7.2.8 | *Testing activities and estimates* | Qué actividades hay que hacer y cuánto esfuerzo cuestan. |
| 7.2.9 | *Staffing* | Quién hace cada cosa y qué necesita saber para hacerla. |
| 7.2.10 | *Schedule* | Cuándo ocurre cada actividad. |

Conviene mirar esa lista buscando una cosa: **cuáles de las diez podrían obtenerse leyendo el
repositorio**. La respuesta es ninguna. Las diez son o decisiones que alguien tomó —qué queda fuera,
qué riesgo se acepta, cuándo se considera suficiente— o circunstancias que el código no registra
—quién tiene interés, quién ejecuta, en qué plazo—. Un repositorio puede decir qué se probó. No
puede decir qué se decidió probar, y mucho menos por qué.

De las diez, la que hace el trabajo técnico es la 7.2.7, y la norma la define aparte:

> "part of the test plan (3.19) that describes the approach to testing for a specific project, test
> level or test type"
>
> — ISO/IEC/IEEE 29119-3:2021, cláusula 3.25

Es decir: la **estrategia de pruebas** no es un sinónimo de plan de pruebas ni un documento
distinto, sino una **parte** del plan. La confusión es frecuente y vale la pena cortarla ahora,
porque en la industria se oyen las dos palabras como intercambiables. La nota de esa misma cláusula
enumera lo que la estrategia suele describir: los niveles y tipos de prueba que se van a
implementar, la repetición de pruebas y la regresión, las técnicas de diseño y sus criterios de
finalización, los datos de prueba, el ambiente y las herramientas, y qué entregables se esperan.
Esa enumeración es, casi literalmente, el índice de lo que este módulo viene haciendo desde la
sesión de diseño de casos.

Dentro de esa lista viaja el elemento que más se echa de menos al mirar la tabla de las diez
subcláusulas, porque no tiene fila propia: el **criterio de salida**, que la norma llama *test
completion criteria* y que también se traduce como criterio de finalización. Es la respuesta escrita
a la pregunta «¿cuándo dejamos de probar?», y no vive en una subcláusula aparte sino dentro de la
estrategia (7.2.7). Un criterio de salida tiene la misma forma que cualquier criterio verificable:
una magnitud, un método y un umbral. «Cuando esté bien probado» no es un criterio de salida; «cuando
todo riesgo de nivel 6 o superior tenga al menos un caso ejecutado» sí lo es, porque se puede
contestar con un número y porque permite que alguien discrepe. Sin él, probar termina cuando se
acaba el tiempo, y eso no es una decisión sino un resultado.

### 1.3 Recortar es legítimo; recortar en silencio no

Diez subcláusulas para un proyecto de cinco archivos suenan desproporcionadas, y lo son. La objeción
es correcta, y la norma la anticipa de dos maneras.

La primera es sobre la **forma**. La cláusula 4.1.1 dice que la documentación de pruebas se
considera conforme si está en formato electrónico —registros en una herramienta de gestión de
pruebas o en una planilla—, repartida en documentos separados o combinada con otros documentos en
uno solo. Y agrega:

> "Test documentation titles, headings and layout described in this document may be modified (e.g.
> added to, combined or re-titled). The use of the nomenclature used in Clauses 5, 6, 7 and 8 is
> not mandatory."
>
> — ISO/IEC/IEEE 29119-3:2021, cláusula 4.1.1

Los títulos, encabezados y disposición **pueden** modificarse: agregarse, combinarse o renombrarse.
La nomenclatura de la norma no es obligatoria. Nada exige un documento con carátula ni secciones
numeradas igual que la norma.

La segunda es sobre la **cantidad**, y es la que importa. La norma distingue dos formas de cumplir.
La **conformidad completa** exige satisfacer todos los requisitos —todas las frases con `shall`— de
la documentación definida en las cláusulas 5 a 8. La **conformidad adaptada** es esta:

> "When this document is used as a basis for establishing a set of test documentation that does not
> qualify for full conformance, the subset of test documentation for which tailored conformance is
> claimed, shall be recorded. […] Where tailoring occurs, justification shall be provided (either
> directly or by reference)."
>
> — ISO/IEC/IEEE 29119-3:2021, cláusula 4.1.3

Léase con la convención de 1.2, porque los dos verbos son `shall` y por lo tanto son exigencias, no
sugerencias. Recortar no está prohibido: está **regulado**, y la regulación pide dos cosas. Primero,
que el subconjunto que sí se aplica quede **registrado**. Segundo, que donde hubo recorte se
entregue una **justificación**, directamente o por referencia.

De ahí sale el criterio que esta sesión usa para todo lo que sigue, y que el estudiante puede
aplicar mañana en un proyecto real: **omitir con criterio declarado es conformidad; omitir en
silencio, no**. Un plan de dos páginas que dice «no hay calendario porque este trabajo no tiene
fecha comprometida» es conforme. Un plan de dos páginas al que simplemente le falta el calendario es
indistinguible de uno donde alguien se olvidó, y esa indistinguibilidad es exactamente el problema:
quien lo lea después no puede saber si hubo una decisión o un descuido.

### 1.4 El experimento: un plan escrito por un agente en un minuto

Con la norma leída, la pregunta práctica es obvia: si un agente puede escribir código y pruebas,
¿puede escribir el plan? Vale la pena responderla ejecutando y no opinando.

El montaje es el mismo que la Unidad 1 usó para generar suites: se le da al agente acceso **solo de
lectura** sobre la carpeta del proyecto y se le pide el documento. La herramienta se invoca desde la
terminal; `-p` significa que se le entrega una instrucción y devuelve su respuesta sin abrir una
conversación, y `--allowed-tools` restringe qué puede hacer: aquí, únicamente leer archivos
(`Read`), buscar archivos por nombre (`Glob`) y buscar texto dentro de ellos (`Grep`). No puede
escribir, ni ejecutar comandos, ni ejecutar la suite.

```bash
claude -p "Escribe el plan de pruebas de este proyecto segun ISO/IEC/IEEE 29119-3.
Devuelve solo el documento en Markdown, sin explicaciones." --allowed-tools "Read,Glob,Grep"
```

Devolvió un documento de 392 líneas, y conviene decir de entrada lo que no se esperaba: **es bueno**.
Está organizado sobre las diez subcláusulas reales de 7.2, no sobre una plantilla genérica. Enumera
ocho elementos de prueba, uno por función pública. Separa lo que está dentro del alcance de lo que
está fuera, y justifica cada exclusión. Declara tres supuestos y tres restricciones. Y lista trece
riesgos —nueve de producto y cuatro de proyecto— con una escala explícita de probabilidad e impacto.

Este es el registro de riesgos que produjo, abreviado a sus cuatro entradas de nivel más alto:

| ID | Riesgo | P | I | Nivel |
|---|---|---|---|---|
| RP-01 | `reservas_de` cuenta **todas** las reservas históricas del RUT, no las de la semana. Un usuario quedaría bloqueado para siempre al llegar a 3 reservas. | 3 | 3 | **9** |
| RP-04 | La tabla no registra fecha ni semana, así que «bloque tomado» es permanente y no se puede reutilizar en otra semana. | 3 | 3 | **9** |
| RP-02 | Condición de carrera entre `bloque_tomado` y `guardar`. No existe una restricción `UNIQUE(bloque)`, así que dos solicitudes simultáneas pueden reservar el mismo bloque. | 2 | 3 | **6** |
| RP-05 | No se validan el formato del RUT ni del correo. Se aceptan datos basura o vacíos. | 3 | 2 | **6** |

Trece riesgos, de los cuales cuatro tienen nivel alto, sobre un proyecto cuya suite acaba de
informar veinte pruebas en verde. Antes de discutir qué vale ese documento hay que resolver una
pregunta anterior, que es la única que este módulo acepta como punto de partida: **¿son ciertos?**

### 1.5 El riesgo principal del plan, comprobado por ejecución

Tomamos el primero, RP-01, y lo convertimos en una prueba. El requisito del proyecto —el que se
viene usando desde la sesión de diseño de casos— dice que *un estudiante puede tener hasta 3
reservas por semana*. Si eso es cierto, alguien que tuvo tres reservas en semanas **pasadas** debe
poder reservar hoy.

La prueba usa cuatro piezas que vienen de la sesión anterior y conviene volver a nombrar, porque aquí
hacen trabajo. `cliente` es el cliente de pruebas de FastAPI: envía solicitudes a la aplicación
dentro del mismo proceso, sin levantar un servidor ni abrir un navegador. `SOLICITUD` es el
diccionario con los cinco campos de una reserva válida, escrito una sola vez para no repetirlo en
cada prueba. `tmp_path` es un directorio temporal, distinto para cada prueba, que `pytest` entrega a
la que lo pida. Y `almacen.RUTA_BASE` es la variable donde el proyecto guarda dónde está su base de
datos: la prueba la apunta al directorio temporal y la restaura al terminar, para no tocar la base
real.

```python
def test_tres_reservas_de_semanas_pasadas_no_deben_bloquear(tmp_path: Path) -> None:
    ruta_real = almacen.RUTA_BASE
    almacen.RUTA_BASE = tmp_path / "reservas-de-prueba.db"
    conexion = almacen.conectar()
    for bloque in (1, 5, 6):
        almacen.guardar(conexion, bloque=bloque, rut="11.111.111-1")
    conexion.close()

    respuesta = cliente.post("/reservas", json=SOLICITUD)

    almacen.RUTA_BASE.unlink(missing_ok=True)
    almacen.RUTA_BASE = ruta_real

    assert respuesta.status_code == 201
```

El resultado:

```text
>       assert respuesta.status_code == 201
E       assert 409 == 201
E        +  where 409 = <Response [409 Conflict]>.status_code

1 failed in 0.62s
```

Esa línea se lee «obtenido a la izquierda, esperado a la derecha», y los dos números son códigos de
estado: la forma en que una API informa qué ocurrió con una solicitud. El `201` significa «se creó
algo nuevo», y es el que el contrato del proyecto manda devolver cuando una reserva se acepta. El
`409` significa que la solicitud choca con el estado actual del sistema: el rechazo. El requisito
dice que la reserva debía aceptarse, y el sistema la rechaza. El riesgo era real, y ahora está
comprobado, no argumentado.

La causa está en una línea que se lee en tres segundos:

```python
def reservas_de(conexion: sqlite3.Connection, rut: str) -> int:
    fila = conexion.execute(
        "SELECT COUNT(*) FROM reservas WHERE rut = ?", (rut,)
    ).fetchone()
    return fila[0]
```

No hay ninguna condición sobre la fecha, porque **la tabla no tiene columna de fecha**. La función
cuenta todas las reservas que ese RUT haya hecho alguna vez. Al llegar a tres, el sistema lo bloquea
de forma permanente.

Y aquí está lo que hace que este hallazgo pertenezca a esta clase y no a la anterior: **las veinte
pruebas pasan igual**. No fallan porque ninguna de las veinte ejercita ese caso. La prueba unitaria
correspondiente le pasa el número de reservas de la semana como argumento —`puede_reservar(3, 4,
tomado=False)`— y comprueba que la regla decide bien con ese número. Decide bien. El defecto no está
en la regla: está en quién calcula el número que la regla recibe, y eso nadie lo probó. No es un
defecto que la suite no detectó por estar mal escrita; es un defecto sobre el que **nadie tomó la
decisión de probar o no probar**, y esa decisión no tenía dónde quedar escrita.

### 1.6 La línea que decide cuánto vale el documento entero

El plan del agente es mejor de lo que la mayoría de los equipos escribe a mano, y encontró por
lectura un defecto que veinte pruebas en verde no mostraban. Entonces la pregunta no puede ser si
sirve, porque sirve. La pregunta correcta es **qué parte de él puede darse por buena sin
verificarla**, y la respuesta está escrita por el propio agente, en su tabla de restricciones:

> | C-03 | Restricción | No existe un documento formal de requisitos. La base de prueba se deriva del código, de las constantes y de los nombres de las pruebas existentes. |

Esa fila es el hallazgo del bloque. La **base de prueba** —la información contra la cual se compara
para decidir si algo está bien, que la Unidad 1 definió como cláusula 3.7 de esta misma norma— no
fue un requisito. Fueron el código y los nombres.

Aplíquese a RP-01. El agente afirma que contar todas las reservas históricas es un defecto. ¿De
dónde sacó que la regla debía ser semanal? De que la constante se llama `MAX_POR_SEMANA`. Leyó un
**nombre de variable** y lo elevó a requisito.

En este caso acertó: el requisito del proyecto efectivamente dice «hasta 3 reservas por semana», y
la ejecución lo confirmó. Pero el acierto es una coincidencia afortunada entre lo que el
programador quiso nombrar y lo que el requisito pedía. Si la regla real fuera «3 reservas en todo el
semestre» y el nombre de la constante estuviera mal elegido —algo que ocurre todos los días—, el
agente habría escrito exactamente el mismo riesgo, con el mismo nivel 9, con la misma redacción
segura, y habría estado equivocado. **Y el documento se vería idéntico.**

De ahí sale la distinción que ordena el resto de la sesión. Un plan de pruebas contiene dos clases
de afirmaciones:

| Clase | Ejemplos en este plan | Cómo se comprueba |
|---|---|---|
| Afirmaciones sobre el sistema | «La regla de cupo no distingue semanas»; «no se valida el formato del RUT» | Ejecutando algo que las confirme o las refute |
| Afirmaciones sobre decisiones | «El rendimiento queda fuera del alcance»; «se prueba cuando la cobertura de ramas supera el 85 %»; «se informa el estado cada semana» | No se comprueban: se sostienen, se discuten y se firman |

Las de la segunda clase son legítimas y necesarias —son la razón de ser del documento—, pero no son
verificables, y por eso un plan entero nunca puede validarse ejecutando. Las de la primera clase sí,
y dejarlas escritas en un documento que nadie ejecuta es desperdiciarlas.

El resto de la sesión se dedica a las dos preguntas que quedan abiertas. La primera: con qué
criterio se reparte el esfuerzo entre esos trece riesgos, porque probarlos todos por igual no es una
opción. La segunda, y es el núcleo técnico: cómo se hace para que la parte verificable del plan
—qué requisito cubre cada prueba— deje de ser una afirmación escrita y pase a ser un dato que se
extrae del propio repositorio y se vuelve a extraer mañana.

## Ejercicio del bloque

Sobre el proyecto propio, el mismo que se entrega como evaluación, en un archivo nuevo que a partir
de hoy es el plan de pruebas del proyecto.

1. **Escribe las dos primeras filas de tu registro de riesgos (7.2.6).** Cada una con: qué puede
   fallar, qué tan probable es del 1 al 3, qué tan grave sería del 1 al 3, y el producto de ambos.
   No inventes riesgos genéricos como «puede haber errores»: mira tu código y nombra dos cosas
   concretas que hoy podrían estar mal.
2. **Escribe tu alcance en dos listas (7.2.2):** tres cosas que están dentro y tres que están fuera.
   Las tres de fuera son las importantes.
3. **Declara tu conformidad adaptada (cláusula 4.1.3).** De las diez subcláusulas de 7.2, escribe
   cuáles no vas a incluir y, al lado de cada una, la razón en una línea. Es la única parte del
   ejercicio donde la norma exige algo en forma de `shall`.
4. **Marca cada riesgo del punto 1 como comprobable o no comprobable**, usando la tabla de 1.6. Si
   alguno es comprobable, escribe en una línea qué habría que ejecutar para confirmarlo.

**Pista:** si al escribir las tres exclusiones del punto 2 te cuesta encontrar la tercera, no es que
tu alcance sea total: es que hay cosas que estás dejando fuera sin haberlo notado. Mira el
rendimiento bajo carga, la interfaz que no existe, los navegadores que nunca probaste, la
recuperación ante una caída de la base de datos.

**Evidencia esperada:** un archivo con dos riesgos valorados, un alcance con sus exclusiones, una
declaración de conformidad adaptada con al menos tres omisiones justificadas, y al menos un riesgo
marcado como comprobable con su ejecución propuesta.

## Preguntas guía

1. La suite informa `20 passed` y el plan del agente lista trece riesgos, cuatro de ellos altos.
   Un compañero concluye que las veinte pruebas están mal escritas. ¿Tiene razón, y qué habría que
   cambiar en la prueba unitaria del cupo semanal para que hubiera detectado el `409`?

   **Pista:** revisa qué recibe `puede_reservar` como argumento y quién calcula ese argumento.
   Pregúntate si el defecto está dentro de la función que la prueba observa o antes de ella.

2. El agente escribió que la base de prueba se derivó del código y de los nombres, y aun así acertó
   en el riesgo principal. Si el resultado fue correcto, ¿qué problema queda exactamente, y qué
   habría que agregarle a la carpeta para que la próxima vez el acierto no dependa de la suerte?

   **Pista:** piensa qué habría pasado si la constante se llamara `MAX_RESERVAS` a secas, o si
   estuviera mal nombrada. Compara el documento que habría salido con el que salió.

3. La norma permite omitir partes del plan siempre que se registre el subconjunto y se justifique el
   recorte. Si eso es así, ¿qué es exactamente lo que la norma **no** te deja hacer, y por qué esa
   prohibición es más útil que exigir el documento completo?

   **Pista:** compara dos planes a los que les falta el calendario, uno que lo declara y otro que
   no. Pregúntate qué puede hacer con cada uno la persona que llegue al proyecto en seis meses.

## Fuentes técnicas del bloque

- [ISO/IEC/IEEE 29119-3:2021 — *Test documentation*, segunda edición, octubre de 2021](https://www.iso.org/standard/79429.html) — la definición de plan de pruebas (cláusula 3.19) y sus tres notas, la definición de estrategia de pruebas como parte del plan (cláusula 3.25) y su nota 1 con lo que la estrategia suele describir, las diez subcláusulas de la cláusula 7.2, la conformidad completa (4.1.2) y la conformidad adaptada (4.1.3) con sus dos exigencias de registro y justificación, la libertad de forma y nomenclatura de la cláusula 4.1.1, y la convención de los verbos `shall`, `should` y `may` de su nota 4.
- [ISO/IEC/IEEE 29119-3:2021, vista previa de la publicación](https://cdn.standards.iteh.ai/samples/79429/27623aa24dba41a2876884c0ec57f5d7/ISO-IEC-IEEE-29119-3-2021.pdf) — páginas numeradas 3 a 5: las definiciones citadas literalmente y el texto completo de la cláusula 4 sobre conformidad.
- [ISO/IEC/IEEE 29119-2:2021 — *Test processes*](https://www.iso.org/standard/79428.html) — el proceso de gestión de pruebas, del cual el plan de la cláusula 7.2 de la parte 3 es la salida documental.
- [pytest — documentación oficial](https://docs.pytest.org/en/stable/) — la salida resumida de una ejecución y el significado de la línea final de conteo.
- Ejecuciones registradas para esta clase sobre el proyecto de reserva de laboratorio, con Python 3.13.11, pytest 9.1.1, FastAPI 0.141.1, Pydantic 2.13.5 y SQLite 3.50.4: la suite completa en `20 passed in 1.80s`, el plan de 392 líneas generado con `claude -p` y herramientas restringidas a lectura junto con su registro de trece riesgos y su restricción C-03, y la prueba del riesgo RP-01 con su resultado `assert 409 == 201` y `1 failed in 0.62s`.

---

# BLOQUE 2: El esfuerzo se reparte por consecuencia, no por comodidad

- **Duración:** 25 minutos
- **Objetivo del bloque:** establecer el criterio con el que se decide cuánto esfuerzo de prueba
  merece cada parte del sistema, definiendo el riesgo con la precisión de su fuente en lugar de
  usarlo como sinónimo de preocupación, y medir sobre el proyecto propio la distancia entre dónde
  están las pruebas y dónde está el riesgo. Al finalizar, el estudiante debe poder justificar el
  nivel de una prueba por el lugar donde el fallo puede manifestarse, y explicar por qué no todo
  riesgo identificado se responde escribiendo una prueba.
- **Modalidad:** exposición con lectura de la fuente, medición ejecutada en vivo sobre la suite y
  trabajo individual sobre el proyecto propio.
- **Ritmo sugerido:** 4 minutos para la definición de riesgo, 3 para las dos familias, 3 para el
  riesgo que dejó de serlo, 5 para la regla del nivel, 6 para la medición y su lectura, y 4 para las
  cuatro respuestas posibles y el ejercicio.

## Desarrollo

### 2.1 El riesgo, definido antes de usarlo

El bloque anterior terminó con trece riesgos sobre la mesa y una pregunta: probarlos todos por igual
no es una opción, así que hace falta un criterio para repartir. Antes de repartir hay que fijar qué
es exactamente un riesgo, porque en el uso corriente la palabra significa «algo que me preocupa», y
con esa definición no se puede ordenar nada.

El programa de estudios de ISTQB, en el nivel de fundamentos, la define así:

> "Risk is a potential event, hazard, threat, or situation whose occurrence causes an adverse
> effect."
>
> — ISTQB Certified Tester Foundation Level Syllabus v4.0.1, sección 5.2.1

Un riesgo es un evento **potencial** cuya ocurrencia causa un efecto adverso. Las dos palabras que
hacen el trabajo son *potencial* —todavía no ocurrió— y *adverso* —si ocurre, hay daño—. Y se
caracteriza por dos factores:

> "Risk likelihood — the probability of the risk occurrence (greater than zero and less than one)
> Risk impact (harm) — the consequences of this occurrence. These two factors express the risk
> level, which is a measure for the risk. The higher the risk level, the more important is its
> treatment."
>
> — ISTQB CTFL v4.0.1, sección 5.2.1

Tres términos quedan fijados aquí, y se usan con estos nombres durante el resto de la sesión:

- **Probabilidad del riesgo** (*risk likelihood*): qué tan probable es que el evento ocurra.
- **Impacto del riesgo** (*risk impact*, o *harm*): las consecuencias si ocurre.
- **Nivel del riesgo** (*risk level*): la medida que resulta de combinar ambos. Cuanto más alto, más
  importante es tratarlo.

Y hay un detalle en la definición de la probabilidad que conviene no pasar por alto, porque decide
qué entra y qué no entra en un registro de riesgos: la norma dice **mayor que cero y menor que
uno**. Un evento con probabilidad cero no es un riesgo: es algo que no puede ocurrir. Y un evento
con probabilidad uno tampoco es un riesgo: **es un hecho**. Esa segunda mitad de la frase parece un
tecnicismo y va a resultar decisiva dentro de dos apartados.

Sobre esa base, el programa nombra el enfoque completo:

> "The test approach, in which test activities are selected, prioritized, and managed based on risk
> analysis and risk control, is called risk-based testing."
>
> — ISTQB CTFL v4.0.1, sección 5.2

**Pruebas basadas en riesgo** es entonces, literalmente, seleccionar y priorizar las actividades de
prueba según el análisis de riesgo. No es una técnica de diseño de casos —eso fueron la partición,
los valores límite y las tablas de decisión— sino una forma de decidir **dónde** aplicar esas
técnicas y con cuánta profundidad.

**Una advertencia sobre la aritmética.** El programa distingue dos formas de valorar:

> "In the quantitative approach the risk level is calculated as the multiplication of risk
> likelihood and risk impact. In the qualitative approach the risk level can be determined using a
> risk matrix."
>
> — ISTQB CTFL v4.0.1, sección 5.2.3

El plan del bloque anterior usó una escala de 1 a 3 para cada factor y multiplicó. Conviene saber
qué es eso realmente: los números del 1 al 3 no son probabilidades —una probabilidad va entre cero y
uno— sino **posiciones en un orden**. Multiplicar posiciones no es multiplicar probabilidades, y el
«9» de RP-01 no significa que sea nueve veces peor que un riesgo de nivel 1. Es un enfoque
cualitativo con aspecto de cuantitativo. Sirve perfectamente para **ordenar** riesgos de mayor a
menor, que es para lo que se lo usa, y no sirve para hacer cuentas con él. Usarlo sabiendo eso es
correcto; usarlo creyendo que se está calculando algo, no.

### 2.2 Dos familias de riesgo, y solo una decide cómo se prueba

El registro del bloque anterior venía partido en dos tablas, y esa partición no era decorativa. El
programa de ISTQB separa:

> "Project risks are related to the management and control of the project. […] Product risks are
> related to the product quality characteristics."
>
> — ISTQB CTFL v4.0.1, sección 5.2.2

| Familia | De qué se trata | Ejemplos que da la fuente | Ejemplos en este proyecto |
|---|---|---|---|
| **Riesgo de proyecto** | La gestión y el control del trabajo | Retrasos en las entregas, estimaciones inexactas, falta de personal, conflictos, herramientas pobres, incumplimiento de un proveedor | Que el entorno no se reproduzca en una instalación limpia; que el calendario académico deje sin tiempo la implementación |
| **Riesgo de producto** | Las características de calidad del producto | Funcionalidad ausente o incorrecta, cálculos erróneos, errores en ejecución, arquitectura pobre, algoritmos ineficientes, tiempo de respuesta inadecuado, mala experiencia de uso, vulnerabilidades de seguridad | Que el cupo semanal no distinga semanas; que no se valide el formato del RUT |

La distinción importa por una razón práctica: **solo los riesgos de producto se pueden mitigar
probando**. Un riesgo de proyecto se trata con decisiones de gestión —conseguir tiempo, conseguir
gente, cambiar una herramienta—, y ninguna prueba lo reduce. Por eso, cuando se reparte el esfuerzo
de prueba, la tabla que se mira es la de producto.

El programa también enumera qué consecuencias puede tener un riesgo de producto cuando se
materializa, y vale la pena leer la lista completa porque incluye dos que este módulo viene tratando
desde la Unidad 1: insatisfacción del usuario; pérdida de ingresos, de confianza o de reputación; **daño a
terceros**; costos altos de mantenimiento; sobrecarga de la mesa de ayuda; **sanciones penales**; y
en casos extremos daño físico, lesiones o incluso la muerte. Daño a
terceros y sanciones son exactamente el terreno del bloque 4 de esta sesión.

### 2.3 El riesgo que se ejecutó dejó de ser un riesgo

Ahora se cobra el detalle de 2.1. La probabilidad de un riesgo es mayor que cero y **menor que
uno**.

En el bloque anterior, RP-01 —«el cupo semanal cuenta todas las reservas históricas»— se convirtió
en una prueba y se ejecutó. El resultado fue `assert 409 == 201`. El evento no es potencial: **ya
ocurre, cada vez, de forma reproducible**. Su probabilidad es uno.

Con la definición en la mano, la conclusión es forzosa: RP-01 ya no es un riesgo. Es un **defecto
confirmado**, y esa diferencia cambia lo que corresponde hacer.

| | Riesgo | Defecto confirmado |
|---|---|---|
| Qué es | Un evento que podría ocurrir | Un comportamiento que ocurre |
| Dónde se registra | En el registro de riesgos del plan (7.2.6) | En un reporte de incidente (cláusula 8.11), que la Unidad 1 ya redactó |
| Qué se hace con él | Se valora, se prioriza y se decide cómo tratarlo | Se corrige, o se acepta con una decisión documentada |
| Cómo se cierra | Dejando de ser probable, o aceptándolo | Con un cambio en el código y una prueba que lo fija |

Esto no es una sutileza de vocabulario. Es la mecánica del registro de riesgos: **cada vez que se
ejecuta algo que confirma un riesgo, ese riesgo sale del registro y entra en otra parte**, y el
registro queda más corto y más honesto. Un registro de riesgos que después de un mes de trabajo
sigue teniendo las mismas trece filas es un registro que nadie ejecutó.

Al proyecto le quedan, entonces, doce riesgos por tratar y un defecto por corregir. La pregunta del
reparto sigue en pie para los doce.

### 2.4 De un riesgo a un nivel de prueba: dónde puede manifestarse

El programa de ISTQB dice para qué sirven los resultados del análisis de riesgo, y una de las seis
aplicaciones es exactamente la que hace falta aquí:

> "Determine the particular test levels and propose test types to be performed"
>
> — ISTQB CTFL v4.0.1, sección 5.2.3

Determinar los niveles de prueba. Lo que la fuente no da —y hay que construir— es la regla concreta
para pasar de un riesgo a un nivel. La sesión anterior dejó el criterio que la hace posible: un
nivel de prueba se distingue por **qué deja de sustituir**. De ahí sale la regla:

> **El nivel de una prueba lo decide el arreglo más pequeño de piezas en el que el evento adverso
> puede efectivamente ocurrir.**

No se elige el nivel por costumbre ni por cuál es más cómodo de escribir: se busca el lugar donde el
fallo *cabe*. Si el evento no puede ocurrir dentro de una función aislada, una prueba unitaria no
puede encontrarlo por buena que sea.

Los tres niveles que el módulo ha trabajado, en una línea cada uno, porque la tabla que sigue los usa
como respuesta: la **prueba unitaria** ejecuta una función sola y sustituye todo lo demás; la
**prueba de integración** hace trabajar juntas a dos o más piezas reales, sin sustituir justamente
aquello que quiere observar; y la **prueba de extremo a extremo** recorre el sistema completo por
donde lo usa una persona.

Aplicada a cuatro riesgos del registro:

| Riesgo | ¿Dónde puede ocurrir el evento? | Nivel que corresponde |
|---|---|---|
| RP-09 · el comprobante no escapa el carácter separador, y un nombre que lo contenga rompe el formato | Dentro de `comprobante()`, que recibe un texto y devuelve un texto | **Unitaria**: no hace falta nada más que la función |
| RP-01 · el cupo cuenta todas las reservas históricas | Solo cuando `crear_reserva` llama a `reservas_de` con una base de datos que tiene filas anteriores | **Integración**: la función de regla recibe el número ya calculado, así que en su nivel el evento no cabe |
| RP-05 · no se valida el formato del RUT ni del correo | En el borde donde el cuerpo de la solicitud se convierte en el modelo | **Integración sobre la API**: el modelo no se ejecuta si no entra una solicitud |
| RP-02 · dos solicitudes simultáneas pueden tomar el mismo bloque | Solo si hay más de una solicitud a la vez | **Ningún nivel de los tres alcanza por sí solo**: hace falta un tipo de prueba distinto, con ejecución concurrente |

La segunda fila es la que conviene mirar dos veces, porque explica el resultado del bloque anterior.
La prueba unitaria del cupo existe, está bien escrita y pasa:

```python
(3, 4, False, False),   # R3-sin-cupo: con 3 reservas, no se permite
```

Le entrega a `puede_reservar` el número 3 y comprueba que decide rechazar. Decide bien. El evento
adverso —contar mal— no ocurre dentro de esa función, porque esa función **no cuenta**: recibe el
conteo hecho. Ninguna cantidad de pruebas unitarias sobre `puede_reservar` habría encontrado RP-01,
y eso no es un defecto de esas pruebas. Es que el riesgo vive un nivel más arriba.

La cuarta fila enseña lo contrario y es igual de importante: **hay riesgos para los que ningún
nivel sirve**, y reconocerlo a tiempo evita escribir una prueba que da tranquilidad sin dar
evidencia. Una prueba secuencial de dos reservas al mismo bloque pasa en verde y no dice nada sobre
la condición de carrera, porque nunca hubo dos cosas a la vez.

### 2.5 Dónde están las pruebas y dónde está el riesgo

Con la regla escrita, se puede medir. La pregunta es simple: **¿el esfuerzo que ya está invertido
coincide con el riesgo?**

La suite se puede contar sin ejecutarla. La opción `--collect-only` le pide a la herramienta que
recolecte las pruebas y las liste sin correrlas, y `-q` reduce la salida a una línea por prueba:

```bash
uv run pytest --collect-only -q | grep "::" | cut -d: -f1 | sort | uniq -c
```

La tubería toma esa lista, se queda con las líneas que contienen el separador `::` —el que la
herramienta usa entre el archivo y el nombre de la prueba—, recorta lo que va antes, ordena y
cuenta repeticiones. El resultado sobre el proyecto:

```text
      4 test_api.py
     12 test_reservas.py
      4 test_sala.py
```

Veinte pruebas, y más de la mitad en un solo archivo. Desglosado por elemento de prueba —la lista de
ocho que el plan del bloque anterior enumeró— queda así:

| Elemento de prueba | Pruebas | Riesgo asociado y su nivel |
|---|---|---|
| `bloque_valido` | **7** | ninguno |
| `puede_reservar` | **5** | — |
| `cabe_en_sala` | **4** | — |
| `crear_reserva` (la ruta de la API) | **3** | RP-02 nivel 6, RP-05 nivel 6, RP-06 nivel 2 |
| La *fixture* de base de datos | **1** | — |
| `almacen.*` (cuatro funciones) | **0** | RP-01 nivel 9, RP-04 nivel 9, RP-08 nivel 3 |
| `puede_cancelar` | **0** | RP-03, nivel 6 |
| `comprobante` | **0** | RP-09, nivel 2 |
| El modelo que valida la solicitud | **0** | RP-05, nivel 6 |

Léase de arriba hacia abajo y después de abajo hacia arriba.

Siete de las veinte pruebas —el 35 % del esfuerzo— están sobre `bloque_valido`, que es esta función:

```python
def bloque_valido(bloque: int) -> bool:
    return BLOQUE_MIN <= bloque <= BLOQUE_MAX
```

Una línea, dos comparaciones, ningún riesgo de nivel alto asociado. Y las cuatro funciones del
módulo de persistencia, donde viven **los dos riesgos de nivel 9**, tienen cero pruebas propias: se
ejecutan solo de paso, cuando alguna prueba de la API las alcanza sin afirmar nada sobre ellas.

La pregunta obligada es por qué salió así, y la respuesta no es negligencia. Salió así porque cada
sesión probó lo que esa sesión enseñaba, y porque **probar `bloque_valido` es barato**: se importa
la función, se le pasa un número y se compara el resultado. Probar `almacen.reservas_de` cuesta una
base de datos, una *fixture*, un desmontaje y datos precargados. El esfuerzo siguió al costo, que es
lo que ocurre siempre cuando nadie decide lo contrario de forma explícita.

Conviene además nombrar lo que **no** dice esta tabla, para no sacar la conclusión equivocada. No
dice que sobren pruebas de `bloque_valido`: esas siete cubren particiones y límites y están bien
elegidas. No dice que la suite sea mala. Dice una sola cosa, y es suficiente: **el reparto del
esfuerzo no fue una decisión, y hoy no coincide con el reparto del riesgo**. Eso es corregible, y
corregirlo es una decisión de plan, no de código.

Hay un detalle más en esa tabla que se va a usar en el bloque siguiente. Una de las veinte pruebas
—la de la *fixture*— no aparece asociada a ningún elemento de prueba del sistema, porque no prueba
el sistema: comprueba que la preparación de la prueba funciona. Es legítima y es útil. Pero no
responde a ningún requisito, y por lo tanto es invisible para cualquier argumento sobre qué está
cubierto.

### 2.6 No todo riesgo se responde con una prueba

Queda un error de lectura frecuente, y es el que convierte un registro de riesgos en una lista de
tareas imposible: suponer que cada fila exige una prueba. El programa de ISTQB enumera cuatro
respuestas posibles, y solo una de ellas es probar:

> "several response options to risk are possible, e.g., risk mitigation by testing, risk
> acceptance, risk transfer, or a contingency plan"
>
> — ISTQB CTFL v4.0.1, sección 5.2.4

| Respuesta | Qué significa | Ejemplo en este proyecto |
|---|---|---|
| **Mitigar probando** | Escribir y ejecutar pruebas que reduzcan la probabilidad de que el fallo llegue al usuario | RP-01 y RP-04: son la razón de ser de las pruebas de integración que faltan |
| **Aceptar** | Decidir, y dejar escrito, que se convive con el riesgo | RP-08: los nombres de columna se arman con interpolación de texto, pero hoy solo lo invocan llamadas internas con claves fijas |
| **Transferir** | Pasarlo a otro responsable | Delegar la validación del formato del RUT en una biblioteca mantenida por terceros |
| **Plan de contingencia** | Preparar qué se hace si ocurre | Un procedimiento de restauración si la base de datos queda corrupta |

Aceptar un riesgo **no** es ignorarlo. La diferencia es exactamente la misma que el bloque anterior
estableció para las omisiones del plan: aceptar es escribir «este riesgo se conoce, se valoró en
nivel 3 y se decide no tratarlo por esta razón». Ignorar es que no aparezca. Lo primero es
gobernanza; lo segundo es suerte.

**Lo que hace un agente con esto.** El registro que produjo el agente en el bloque anterior es una
buena muestra, y tiene un sesgo que se puede constatar leyendo la columna de tratamiento: de los
nueve riesgos de producto, **los nueve reciben al menos un caso de prueba**. Ninguno queda aceptado,
transferido ni con plan de contingencia; dos agregan revisión estática, pero además del caso, no en
su lugar. Incluso RP-08, para el cual el propio agente escribió el argumento de aceptación —«hoy
solo lo invocan llamadas internas con claves fijas»—, termina con un caso asignado. En cambio los
cuatro riesgos de proyecto sí recibieron respuestas no ejecutables, porque ahí no había prueba
posible que proponer.

El sesgo es explicable y no es un error del modelo: se le pidió un plan de pruebas, y responde en el
idioma de lo que se le pidió. Pero el efecto sobre el documento es real y es el mismo que produce
una lista donde todo es prioritario: **si los nueve riesgos exigen pruebas, el registro dejó de
priorizar**. La decisión que el agente no puede tomar —y que es del estudiante— no es cuáles riesgos
existen, sino **cuáles se aceptan**. Esa es una decisión sobre cuánto daño se está dispuesto a
admitir, y no se delega.

Con el esfuerzo repartido por riesgo queda pendiente la otra mitad del problema, y es la que ocupa
el bloque siguiente. Decidir qué probar es una cosa; poder demostrar después que lo que se decidió y
lo que se escribió son lo mismo es otra, y hasta ahora ninguna herramienta del módulo lo ha
comprobado.

## Ejercicio del bloque

Sobre el proyecto propio, continuando el archivo de plan que empezó en el bloque anterior.

1. **Cuenta tu suite por archivo.** Ejecuta la tubería de 2.5 sobre tu proyecto y pega el resultado
   literal en tu plan. Si tu suite está en un solo archivo, cuenta por función probada en vez de por
   archivo.
2. **Arma la tabla del reparto.** Una fila por elemento de prueba de tu sistema, con dos columnas:
   cuántas pruebas tiene y qué riesgo de tu registro le corresponde. Los elementos con cero pruebas
   se escriben igual: son la información que la tabla existe para mostrar.
3. **Encuentra tu `bloque_valido`.** Nombra la parte de tu sistema que está sobreprobada porque era
   barata de probar, y la parte con más riesgo que tiene menos pruebas. Escribe las dos en una línea
   cada una.
4. **Asigna nivel a dos riesgos**, usando la regla de 2.4: ¿cuál es el arreglo más pequeño de piezas
   en el que ese evento puede ocurrir? Escribe el nivel y la razón, no solo el nivel.
5. **Acepta un riesgo por escrito.** Elige el de nivel más bajo de tu registro y redacta la fila de
   aceptación: qué riesgo es, qué nivel tiene, y por qué se decide no tratarlo ahora.

**Pista:** para el punto 4, si dudas entre unitaria e integración, pregúntate si el dato que
provoca el fallo lo *calcula* la función que quieres probar o lo *recibe* ya calculado. Si lo
recibe, el evento no cabe en ese nivel.

**Evidencia esperada:** la salida literal del recuento, una tabla de reparto con al menos un
elemento en cero, dos riesgos con nivel asignado y justificado por el lugar donde pueden
manifestarse, y una aceptación escrita con su razón.

## Preguntas guía

1. RP-01 se ejecutó y falló, así que su probabilidad es uno y dejó de ser un riesgo. Un compañero
   dice que entonces basta con subirlo a nivel máximo en el registro y seguir. ¿Qué se pierde al
   dejarlo ahí, y a qué documento debería pasar?

   **Pista:** mira la tabla de 2.3 y pregúntate qué acción corresponde a cada fila. Un riesgo se
   prioriza; un defecto confirmado se corrige o se acepta. Son decisiones distintas y las toma gente
   distinta.

2. Siete de veinte pruebas están sobre una función de una línea, y las cuatro funciones que guardan
   los datos no tienen ninguna. ¿Significa eso que hay que borrar pruebas de `bloque_valido`, y qué
   distingue a una suite desbalanceada de una suite con pruebas de más?

   **Pista:** pregúntate qué pasaría si borraras tres de esas siete. ¿Se pierde alguna partición o
   algún límite? Después pregúntate si borrarlas agrega una sola prueba donde falta.

3. El agente asignó un caso de prueba a los nueve riesgos de producto, incluido uno para el que él
   mismo había escrito el argumento de por qué no hacía falta. Si tú tuvieras que quedarte con solo
   cuatro de esos nueve, ¿qué información necesitas para elegir, y está esa información en el
   código?

   **Pista:** la elección no depende de qué tan probable es cada fallo, que ya está estimado. Depende
   de cuánto daño estás dispuesto a admitir, y eso no es un dato técnico.

## Fuentes técnicas del bloque

- [ISTQB Certified Tester Foundation Level Syllabus v4.0.1, 15 de septiembre de 2024](https://astqb.org/assets/documents/ISTQB_CTFL_Syllabus_v4.0.1.pdf) — sección 5.2 *Risk Management*: la definición de pruebas basadas en riesgo; la sección 5.2.1 con la definición de riesgo, los dos factores y el rango declarado de la probabilidad, mayor que cero y menor que uno; la sección 5.2.2 con la distinción entre riesgo de proyecto y riesgo de producto y sus listas de ejemplos y de consecuencias; la sección 5.2.3 con los enfoques cuantitativo y cualitativo y las seis aplicaciones del análisis de riesgo, entre ellas determinar los niveles de prueba; y la sección 5.2.4 con las cuatro respuestas posibles ante un riesgo.
- [ISTQB CTFL v4.0.1, sección 1.3](https://astqb.org/assets/documents/ISTQB_CTFL_Syllabus_v4.0.1.pdf) — el cuarto principio, *los defectos se agrupan*: un número pequeño de componentes suele concentrar la mayoría de los defectos, y esa agrupación es una entrada para las pruebas basadas en riesgo.
- [ISO/IEC/IEEE 29119-3:2021 — *Test documentation*](https://www.iso.org/standard/79429.html) — el registro de riesgos como subcláusula 7.2.6 del plan de pruebas, y el reporte de incidente de la cláusula 8.11 como el lugar al que pasa un riesgo cuya ocurrencia quedó confirmada.
- [ISO 31000 — *Risk management*](https://www.iso.org/iso-31000-risk-management.html) — la fuente que el programa de ISTQB cita para el marco general de gestión de riesgos.
- [pytest — recolección de pruebas](https://docs.pytest.org/en/stable/how-to/usage.html) — la opción `--collect-only`, que lista las pruebas sin ejecutarlas, y el formato `archivo::prueba` con el que las identifica.
- Ejecuciones registradas para esta clase sobre el proyecto de reserva de laboratorio, con Python 3.13.11 y pytest 9.1.1: el recuento por archivo `4 test_api.py`, `12 test_reservas.py` y `4 test_sala.py` sobre un total de veinte pruebas recolectadas, y el desglose por elemento de prueba obtenido de la lista completa de identificadores que devuelve la recolección.

---

# BLOQUE 3: La trazabilidad deja de escribirse y pasa a generarse

- **Duración:** 30 minutos
- **Objetivo del bloque:** construir la matriz de trazabilidad del proyecto propio como un artefacto
  que se genera desde la suite en lugar de mantenerse a mano, leer los dos huecos que revela, y
  establecer con una demostración cuál es el hueco que **no** puede revelar. Al finalizar, el
  estudiante debe poder marcar una prueba con el requisito que la justifica, generar la matriz,
  interpretar sus tres resultados posibles y explicar por qué «cubierto» no significa «verificado».
- **Modalidad:** exposición con escritura de código y ejecución en vivo, y aplicación individual
  sobre el proyecto propio.
- **Ritmo sugerido:** 3 minutos para la definición, 6 para el marcador dentro de la prueba, 6 para
  el generador y su salida, 4 para los dos huecos, 6 para el mutante que desmiente a la matriz, y 5
  para la comparación con el agente y el ejercicio.

## Desarrollo

### 3.1 Qué es una matriz de trazabilidad

Los dos bloques anteriores dejaron decisiones escritas: un alcance, trece riesgos valorados, un
reparto de esfuerzo que no coincide con ese riesgo. Todo eso vive en un documento. La pregunta que
falta es si el documento y el repositorio dicen lo mismo, y para responderla la norma define un
artefacto específico:

> "test traceability matrix
> *verification cross reference matrix; requirements test matrix; requirements verification table*
>
> document, spreadsheet, or other tool used to identify related items in documentation and software,
> such as requirements with associated tests"
>
> — ISO/IEC/IEEE 29119-3:2021, cláusula 3.26

Tres cosas de esa definición conviene fijarlas antes de usarla:

- **Qué relaciona:** elementos relacionados entre la documentación y el software. El ejemplo que da
  la propia norma es el que se usa hoy: requisitos con sus pruebas asociadas.
- **Qué forma tiene:** «documento, planilla **u otra herramienta**». La norma no exige una tabla
  escrita a mano. Un programa que la produce es una herramienta, y por lo tanto una matriz conforme.
- **Los otros nombres:** *verification cross reference matrix*, *requirements test matrix*,
  *requirements verification table*. Aparecen en la norma como sinónimos, y conviene reconocerlos
  porque en la industria se usan los cuatro indistintamente.

La norma agrega una nota que es la que hace viable el resto del bloque:

> "Note 1 to entry: Different test traceability matrices can have different information, formats,
> and levels of detail."
>
> — ISO/IEC/IEEE 29119-3:2021, nota 1 de la cláusula 3.26

Distinta información, distinto formato, distinto nivel de detalle. No hay una plantilla obligatoria,
y por lo tanto nada impide que la matriz de este proyecto sea la salida de texto de un programa.

**Por qué esto importa más de lo que parece.** Una matriz escrita a mano tiene un problema que no
se arregla escribiéndola mejor: describe el estado del repositorio en el momento en que alguien la
escribió. Mañana se agrega una prueba, pasado se borra otra, la semana que viene cambia un
requisito, y la matriz sigue afirmando lo mismo con la misma seguridad. No se pone roja, no avisa,
no se nota. Es la diferencia entre un documento y un artefacto: **el documento envejece en silencio;
el artefacto se vuelve a producir**. Todo este bloque consiste en pasar la matriz de la primera
categoría a la segunda.

### 3.2 El identificador vive dentro de la prueba

Para que la matriz se pueda generar, la relación entre requisito y prueba tiene que estar guardada
en algún lugar que un programa pueda leer. Hay dos candidatos, y solo uno funciona.

El primero es un archivo aparte que enumere los pares. Es exactamente la planilla que se desactualiza:
nada obliga a actualizarla cuando alguien renombra una prueba. El segundo es poner el identificador
**dentro de la prueba misma**, de modo que renombrarla, moverla o borrarla se lleve la relación
consigo. Ese es el que se usa.

El proyecto necesita entonces dos piezas nuevas. La primera es el archivo de requisitos con
identificadores estables, que hasta ahora no existía —era la restricción C-03 que el agente declaró
en el bloque 1—:

```markdown
| ID | Requisito |
|---|---|
| RF-01 | La jornada tiene ocho bloques, numerados del 1 al 8. Una solicitud para un bloque fuera de ese rango se rechaza. |
| RF-02 | Un bloque que ya tiene una reserva no puede volver a reservarse. |
| RF-03 | Un estudiante puede tener como maximo 3 reservas activas por semana. |
| RF-04 | La sala admite entre 1 y 30 personas. Una solicitud fuera de ese rango se rechaza. |
| RF-05 | Una reserva puede cancelarse hasta 2 horas antes del inicio de su bloque. |
| RF-06 | Una reserva aceptada devuelve un comprobante con el nombre, el RUT, el correo y el bloque. |
```

El identificador `RF-01` no tiene ningún significado especial: es una etiqueta corta y estable. Lo
que importa es que **no cambie**. Si mañana el requisito se redacta distinto, sigue siendo RF-01; si
se elimina, el identificador se retira y no se reutiliza para otra cosa.

La segunda pieza es el **marcador**. En `pytest`, un marcador es una etiqueta que se le pega a una
prueba y que la herramienta conserva y deja consultar. Se escribe como un decorador:

```python
@pytest.mark.requisito("RF-01")
@pytest.mark.parametrize(
    ("bloque", "esperado"),
    [(0, False), (1, True), (8, True), (9, False)],
    ids=["antes", "primero", "ultimo", "despues"],
)
def test_limites_del_requisito(bloque: int, esperado: bool) -> None:
    assert bloque_valido(bloque) is esperado
```

`requisito` no es un marcador que `pytest` traiga: lo inventamos aquí, y por eso hay que declararlo
en la configuración del proyecto. Sin esa declaración la herramienta lo acepta igual pero emite una
advertencia en cada ejecución, y esa advertencia existe por una buena razón: sin ella, escribir
`@pytest.mark.requsito` con un error de tipeo produciría un marcador nuevo y silencioso.

```toml
[tool.pytest.ini_options]
markers = ["requisito(id): el requisito que esta prueba comprueba"]
```

**El caso que obliga a afinar.** Un marcador puesto sobre la función se aplica a **todos** sus casos
parametrizados. Eso sirve cuando los cuatro casos comprueban el mismo requisito, y no sirve para la
prueba de las reglas de reserva, donde cada caso comprueba una regla distinta. Para marcar caso por
caso hay que envolver cada fila de parámetros en `pytest.param`, que acepta un argumento `marks`:

```python
@pytest.mark.parametrize(
    ("reservas", "bloque", "tomado", "esperado"),
    [
        pytest.param(1, 0, False, False, marks=pytest.mark.requisito("RF-01")),
        pytest.param(1, 4, True, False, marks=pytest.mark.requisito("RF-02")),
        pytest.param(3, 4, False, False, marks=pytest.mark.requisito("RF-03")),
        pytest.param(1, 4, False, True, marks=pytest.mark.requisito("RF-03")),
    ],
    ids=["R1-fuera-jornada", "R2-ocupado", "R3-sin-cupo", "R4-permitida"],
)
def test_reglas_de_reserva(...)
```

`pytest.param(valores..., marks=...)` reemplaza a la tupla de valores y le agrega marcadores a **ese
caso**. Los identificadores de `ids` no cambian: cada caso sigue llamándose igual, y ahora además
sabe qué requisito lo justifica.

Marcar las veinte pruebas no cambia nada de lo que hacen. La suite sigue informando lo mismo:

```text
20 passed in 0.80s
```

Eso es deseable y conviene notarlo: **la trazabilidad no altera el comportamiento de la suite**. Lo
único que agrega es información legible por un programa.

### 3.3 La matriz, generada

Con los marcadores puestos, generar la matriz es cruzar dos listas: los identificadores que aparecen
en el archivo de requisitos y los que aparecen en la suite. La parte interesante es cómo se obtienen
los segundos sin ejecutar las pruebas.

`pytest` se puede invocar desde dentro de un programa de Python, y acepta objetos que participan de
su proceso. Un objeto con un método que tenga el nombre de un *hook* —un punto del proceso donde la
herramienta llama a quien quiera escuchar— recibe el control en ese punto. El *hook* que hace falta
es el que se ejecuta justo después de recolectar:

```python
class Recolector:
    """Se entera de cada prueba que pytest recolecta, sin ejecutarla."""

    def __init__(self) -> None:
        self.pruebas: dict[str, list[str]] = {}

    def pytest_collection_modifyitems(self, items: list[pytest.Item]) -> None:
        for item in items:
            marcas = [m.args[0] for m in item.iter_markers(name="requisito")]
            self.pruebas[item.nodeid] = marcas
```

Las piezas, una por una:

| Pieza | Qué es |
|---|---|
| `pytest_collection_modifyitems` | El *hook* que `pytest` llama después de recolectar las pruebas y antes de ejecutarlas, pasándole la lista completa. |
| `items` | Esa lista. Cada elemento es una prueba concreta, incluido cada caso parametrizado por separado. |
| `item.nodeid` | El identificador de esa prueba: `archivo.py::nombre[caso]`. Es el mismo texto que imprime la recolección. |
| `item.iter_markers(name="requisito")` | Recorre los marcadores de ese nombre que tiene esa prueba, vengan de la función o del caso. |
| `m.args[0]` | El primer argumento del marcador, que es el identificador: el `"RF-01"` de `@pytest.mark.requisito("RF-01")`. |

Y la invocación:

```python
recolector = Recolector()
pytest.main(["--collect-only", "-p", "no:terminal"], plugins=[recolector])
```

`pytest.main` ejecuta la herramienta con esos argumentos. `--collect-only` recolecta sin ejecutar
—es la misma opción del bloque anterior—, `plugins=[recolector]` registra el objeto para que reciba
los *hooks*, y `-p "no:terminal"` desactiva el informe en pantalla de `pytest`, porque aquí la única
salida que interesa es la del programa propio.

El resto es contar. El programa lee los identificadores del archivo de requisitos con una expresión
regular, arma un diccionario con una lista vacía por requisito, y recorre las pruebas repartiéndolas:
las que traen marcas se suman a su requisito, y las que no traen ninguna se acumulan aparte.

Ejecutado sobre el proyecto:

```text
MATRIZ DE TRAZABILIDAD
requisito    pruebas   estado
RF-01             10   cubierto
RF-02              2   cubierto
RF-03              2   cubierto
RF-04              4   cubierto
RF-05              0   SIN PRUEBA
RF-06              1   cubierto

Requisitos sin prueba: 1
  RF-05

Pruebas sin requisito: 1
  test_api.py::test_la_base_de_datos_existe_durante_la_prueba
```

Esa salida es la matriz de trazabilidad del proyecto, y tiene la propiedad que el apartado 3.1
buscaba: **se vuelve a producir cuando se quiera**. Si mañana alguien borra la prueba del bloque 8,
la línea de RF-01 baja a 9 sin que nadie tenga que acordarse de nada.

Y hay algo que esta matriz no ve, aunque exista: **las cinco pruebas de extremo a extremo** de la
sesión anterior. No aparecen como cubiertas ni como huérfanas, porque el generador recolecta la suite
de `pytest` y esas pruebas corren con otro ejecutor. No es un defecto del programa, sino de su
alcance, y es exactamente el problema que el bloque 1 estableció para el plan: **una matriz que no
declara qué suites lee omite en silencio**.

La solución tiene la misma forma que la de `pytest`. En Playwright, cada prueba puede llevar una
etiqueta, y la herramienta las lista sin ejecutar nada:

```typescript
test("un doble clic envía una sola solicitud de reserva", { tag: "@RF-11" }, async ({ page }) => {
```

```bash
npx playwright test --list --reporter=json
```

La segunda instrucción devuelve, para cada prueba, su nombre y sus etiquetas —en este caso,
`["RF-11"]`—, y un generador puede leerlas igual que lee los marcadores. La matriz completa del
proyecto necesita leer las dos suites. Mientras no lo haga, lo mínimo es escribir en el plan que
cubre solo la de `pytest`.

### 3.4 Los dos huecos

La salida contiene tres clases de información, y dos de ellas son hallazgos.

**Primero, el reparto**, que confirma por otra vía lo que el bloque anterior midió: RF-01 tiene diez
de las diecinueve pruebas marcadas. Más de la mitad del esfuerzo está sobre el requisito más simple
del sistema.

**Segundo, el requisito sin prueba.** RF-05 —cancelar hasta 2 horas antes— tiene cero. La función que
implementa esa regla existe en el proyecto desde hace sesiones:

```python
def puede_cancelar(inicio_bloque: datetime, ahora: datetime) -> bool:
    return inicio_bloque - ahora > ANTICIPACION_CANCELACION
```

Está escrita, tiene su constante, y nunca nadie la probó. Durante seis sesiones la suite informó
verde y el requisito de cancelación estuvo sin comprobar. Ninguna ejecución podía avisarlo, porque
una prueba que no existe no falla. Y conviene ser preciso sobre la magnitud del hallazgo: no es que
la función esté mal —puede estar perfecta—, es que **nadie lo sabe**, y hasta hoy nadie tenía cómo
enterarse de que no lo sabía.

**Tercero, la prueba sin requisito.** `test_la_base_de_datos_existe_durante_la_prueba` no responde a
ningún requisito, y hay que leer ese resultado con cuidado porque admite dos interpretaciones muy
distintas:

| Interpretación | Qué significa | Qué hacer |
|---|---|---|
| Falta un requisito | La prueba comprueba algo que el sistema sí promete, pero que nadie escribió | Escribir el requisito y marcar la prueba |
| La prueba no es sobre el sistema | Comprueba el andamiaje de la propia suite, no una promesa del producto | Dejarla, sabiendo que no cuenta como cobertura de nada |

Este caso es el segundo: la prueba comprueba que la *fixture* preparó la base de datos. Es legítima
y útil, y no cubre ningún requisito. Lo que la matriz aporta no es un veredicto sino una
**obligación de decidir**: cada prueba huérfana obliga a responder cuál de las dos filas es, y esa
respuesta no la puede dar un programa.

Hay una tercera interpretación que en un proyecto real es la más frecuente, y la Unidad 1 ya la
nombró: la prueba huérfana que fija el comportamiento actual del código porque quien la escribió
miró la implementación en vez del requisito. Esa prueba pasa siempre, no protege nada, y el día que
la regla cambie se pondrá roja defendiendo la versión vieja. La matriz no distingue esa de las otras
dos; solo garantiza que aparezca en la lista y que alguien tenga que mirarla.

### 3.5 El hueco que la matriz no puede ver

Queda RF-06, que la matriz informa como **cubierto** con una prueba. Vale la pena mirar cuál es esa
prueba.

El requisito dice: *una reserva aceptada devuelve un comprobante con el nombre, el RUT, el correo y
el bloque*. La prueba marcada es esta:

```python
@pytest.mark.requisito("RF-06")
def test_reserva_aceptada_responde_201(base_de_datos_de_prueba: Path) -> None:
    respuesta = cliente.post("/reservas", json=SOLICITUD)
    assert respuesta.status_code == 201
```

Comprueba el código de estado. No mira el comprobante. No mira el nombre, ni el RUT, ni el correo,
ni el bloque. La marca dice RF-06 y la aserción no comprueba nada de lo que RF-06 promete.

Esto no es una hipótesis: se puede demostrar con la técnica de la sesión de cobertura. Se altera el
código a propósito, de la forma más grosera posible, y se mira si la suite reacciona. A esa
alteración deliberada se la llama **mutante**, y lo que mide es la **sensibilidad** de la suite: si
nota el cambio o lo deja pasar. La función del comprobante pasa de esto:

```python
def comprobante(nombre: str, rut: str, correo: str, bloque: int) -> str:
    return f"{nombre} | {rut} | {correo} | bloque {bloque}"
```

a esto:

```python
def comprobante(nombre: str, rut: str, correo: str, bloque: int) -> str:
    return "comprobante"
```

El comprobante ya no contiene el nombre, ni el RUT, ni el correo, ni el bloque. Es decir: RF-06 ya
no se cumple en absoluto. La suite de `pytest` completa:

```text
....................                                                     [100%]
20 passed in 0.63s
```

Veinte en verde. La matriz sigue informando RF-06 como cubierto. **El requisito está destruido y
ningún artefacto del proyecto lo nota.**

De aquí sale el límite exacto de la técnica, y hay que decirlo con precisión porque es lo que
distingue usarla bien de creerle de más:

> Una matriz de trazabilidad demuestra la **existencia** de una relación entre un requisito y una
> prueba. No demuestra que la prueba **compruebe** ese requisito. Detecta ausencias, no
> insuficiencias.

Dicho de otra manera: la matriz es tan buena como las marcas, y una marca es una afirmación humana
—«esta prueba responde a este requisito»— con el mismo estatus que cualquier otra afirmación escrita
en el plan. Que esté dentro del código la hace más difícil de olvidar; no la hace verdadera.

Lo que sí resuelve la pregunta es lo que se acaba de hacer: **alterar el código y exigir el rojo**.
Esa es la comprobación de sensibilidad que la sesión de cobertura introdujo y que la sesión de
desarrollo guiado por pruebas obtuvo por construcción. Aquí reaparece con un uso nuevo: ya no para
auditar una suite entregada, sino para **validar una fila de la matriz**. Una fila marcada como
cubierta y que sobrevive a un mutante del requisito es una fila que miente.

El proyecto queda entonces con tres resultados distintos, que conviene no confundir:

| Requisito | Qué dice la matriz | Qué es verdad |
|---|---|---|
| RF-01 a RF-04 | Cubiertos | Cubiertos, con reparto desigual |
| RF-05 | Sin prueba | Sin prueba. La matriz acertó |
| RF-06 | Cubierto | **No verificado.** La matriz no podía saberlo |

### 3.6 La misma pregunta, hecha a un agente

Con la matriz generada, vale la pena hacer el experimento que cierra el bloque: darle a un agente el
archivo de requisitos y las pruebas **sin marcar**, y pedirle la misma matriz. Otra vez con acceso
solo de lectura.

```bash
claude -p "Lee REQUISITOS.md y las pruebas de este proyecto. Devuelve la matriz de
trazabilidad: para cada requisito, que pruebas lo cubren, y si queda alguno sin
cubrir. Solo la tabla y las conclusiones, sin explicaciones." --allowed-tools "Read,Glob,Grep"
```

Encontró los dos huecos que encontró el programa: RF-05 sin cubrir, y la prueba de la *fixture* sin
requisito asociado. Y además escribió esto:

> | RF-06 (comprobante con nombre, RUT, correo, bloque) | `test_api.py::test_reserva_aceptada_responde_201` (solo revisa el código 201) | **Sin cubrir**: nunca se revisa el contenido del comprobante |

Es decir: **acertó donde el programa se equivocó**. Vio la marca que correspondía poner, vio que la
aserción no comprueba el requisito, y se negó a darlo por cubierto. Y agregó dos observaciones que
el programa no puede formular de ninguna manera: que RF-03 está a medias porque falta el límite de
dos reservas activas, y que RF-04 está a medias porque falta el caso de una sola persona. Las dos
son ciertas.

Conviene detenerse en esto antes de sacar la conclusión cómoda. Los dos artefactos fallan en
direcciones opuestas, y no por casualidad:

| | El programa | El agente |
|---|---|---|
| De dónde saca su respuesta | De las marcas que alguien puso | De leer el requisito y la aserción y compararlos |
| En qué se equivoca | Confunde «marcado» con «comprobado»; no puede juzgar suficiencia | Puede declarar cubierto lo que no lo está, y nada lo detecta |
| Cuándo vuelve a responder | Cada vez que se lo ejecuta, con el mismo criterio | Cuando alguien se acuerda de preguntarle, con un criterio que puede variar |
| Qué produce | Un hecho mecánico y reproducible | Un juicio, emitido una vez |

El programa no tiene criterio y nunca lo tendrá; el agente tiene criterio y no tiene obligación de
volver a ejercerlo. Un juicio que no se vuelve a emitir envejece exactamente igual que la planilla
escrita a mano del apartado 3.1, con el agravante de que parece más fresco.

Por eso la forma de trabajo que rinde no es elegir uno, sino usarlos en el orden correcto: **el
programa sostiene el esqueleto** —qué existe, qué falta, qué no responde a nada— porque eso hay que
saberlo todos los días y sin depender de nadie; **el agente audita las filas** que el programa
declara cubiertas, porque ahí es donde el programa es ciego; y **la alteración del código arbitra**,
porque es lo único de los tres que produce evidencia en vez de una afirmación. Cuando el agente dijo
que RF-06 no estaba cubierto, lo que convirtió esa opinión en un hecho fue el mutante.

El bloque siguiente aplica esta misma maquinaria a requisitos que no son del sistema sino de una
persona: los derechos que la Ley 21.719 le reconoce al titular de los datos. Son filas de esta misma
matriz, y traen consigo un modo de fallar que RF-06 acaba de anticipar.

## Ejercicio del bloque

Sobre el proyecto propio, continuando el plan de los bloques anteriores.

1. **Escribe tu archivo de requisitos con identificadores.** Mínimo cuatro, con la forma
   `RF-NN | el sistema debe ___ cuando ___`. Si la Unidad 1 te dejó una línea de base de prueba, ese
   es tu RF-01.
2. **Declara el marcador** en la configuración de tu proyecto y **marca al menos seis pruebas** con
   el requisito que cada una justifica. Si alguna prueba parametrizada cubre requisitos distintos
   por caso, márcala con `pytest.param`.
3. **Genera tu matriz.** Usa el programa de 3.3 sobre tu proyecto y pega la salida literal en tu
   plan.
4. **Resuelve cada hueco por escrito.** Para cada requisito sin prueba: si es una falta real, anótalo
   como caso pendiente en el plan. Para cada prueba sin requisito: decide cuál de las tres
   interpretaciones de 3.4 es, y escríbela.
5. **Audita una fila cubierta.** Elige el requisito que más te importe de los que la matriz declara
   cubiertos, altera el código de producción para que ese requisito deje de cumplirse, y ejecuta.
   Anota si la suite se puso roja. Después restaura el código.

**Pista:** para el punto 5, la alteración tiene que romper el requisito, no el programa. Si el código
deja de ejecutarse, el rojo no prueba nada: cualquier prueba que toque esa línea va a fallar. Busca
un cambio que siga funcionando y entregue algo distinto de lo que el requisito promete.

**Evidencia esperada:** un archivo de requisitos con identificadores, al menos seis pruebas
marcadas, la salida literal de tu matriz con al menos un hueco, una decisión escrita por cada hueco,
y el resultado de la alteración del punto 5 con su conclusión en una línea.

## Preguntas guía

1. La matriz informa RF-06 como cubierto y el mutante demostró que no lo está. Un compañero propone
   arreglar el programa para que detecte esos casos. ¿Qué tendría que poder hacer el programa para
   detectarlo, y por qué eso lo convierte en un problema distinto del que resuelve?

   **Pista:** el programa tendría que decidir si una aserción comprueba lo que un requisito en
   español promete. Pregúntate qué clase de artefacto sabe hacer eso, y si su respuesta se puede
   volver a producir igual mañana.

2. `puede_cancelar` estuvo seis sesiones sin una sola prueba y la suite informó verde todos los
   días. ¿Qué otro artefacto del proyecto podría haberlo detectado antes, y por qué ninguno lo hizo?

   **Pista:** repasa lo que mide la cobertura y lo que mide el conteo del bloque anterior. Pregúntate
   cuál de los dos habría mostrado un cero en esa función, y por qué un cero ahí es más elocuente que
   un porcentaje.

3. El agente acertó en RF-06, donde el programa falló, y además detectó dos coberturas parciales. Si
   es mejor en todo lo que se comparó, ¿por qué no se reemplaza el programa por el agente y se
   termina el problema?

   **Pista:** compara las dos últimas filas de la tabla de 3.6. Pregúntate qué pasa con cada uno de
   los dos artefactos el día que nadie se acuerda de la trazabilidad.

## Fuentes técnicas del bloque

- [ISO/IEC/IEEE 29119-3:2021 — *Test documentation*](https://www.iso.org/standard/79429.html) — la cláusula 3.26, que define la matriz de trazabilidad, enumera sus tres nombres alternativos, admite explícitamente «documento, planilla u otra herramienta» como formas válidas, y en su nota 1 permite distinta información, formato y nivel de detalle; y la subcláusula 8.2.7, que exige trazabilidad también en la documentación del nivel dinámico.
- [ISO/IEC/IEEE 29119-3:2021, vista previa de la publicación](https://cdn.standards.iteh.ai/samples/79429/27623aa24dba41a2876884c0ec57f5d7/ISO-IEC-IEEE-29119-3-2021.pdf) — página numerada 4: el texto literal de la cláusula 3.26 con sus sinónimos y su nota.
- [pytest — marcadores](https://docs.pytest.org/en/stable/how-to/mark.html) — `@pytest.mark.<nombre>`, la declaración de marcadores propios en la configuración para evitar marcadores creados por un error de tipeo, y la advertencia que emite la herramienta cuando falta esa declaración.
- [pytest — parametrización](https://docs.pytest.org/en/stable/how-to/parametrize.html) — `pytest.param(valores, marks=...)`, que permite marcar un caso individual de una prueba parametrizada en lugar de la función completa.
- [pytest — escribir *plugins* y usar la API desde Python](https://docs.pytest.org/en/stable/how-to/writing_plugins.html) — `pytest.main(args, plugins=[...])`, el *hook* `pytest_collection_modifyitems`, y los atributos `nodeid` e `iter_markers` de cada prueba recolectada.
- Ejecuciones registradas para esta clase sobre el proyecto de reserva de laboratorio, con Python 3.13.11 y pytest 9.1.1: la suite marcada en `20 passed in 0.80s`, la salida completa del generador de la matriz con RF-05 en cero y una prueba sin requisito, la ejecución con `comprobante()` reducido a una constante que devolvió `20 passed in 0.63s` con RF-06 aún informado como cubierto, y la matriz producida por `claude -p` con herramientas restringidas a lectura sobre las pruebas sin marcar.

---

# BLOQUE 4: Un derecho es una fila de la matriz

- **Duración:** 30 minutos
- **Objetivo del bloque:** convertir los derechos que la Ley 21.719 le reconoce al titular de los
  datos en requisitos con criterio de aceptación, incorporarlos a la matriz del bloque anterior, y
  demostrar ejecutando por qué una prueba de supresión que mira un solo lugar de almacenamiento pasa
  en verde mientras el dato personal sigue existiendo. Al finalizar, el estudiante debe poder
  escribir un derecho como un requisito comprobable, decidir entre suprimir y anonimizar con un
  fundamento, y explicar por qué la calidad de la prueba que produce un agente depende de la calidad
  del requisito que se le entregó.
- **Modalidad:** exposición con lectura de la ley y ejecución en vivo, y aplicación individual sobre
  el proyecto propio.
- **Ritmo sugerido:** 4 minutos para los seis derechos, 6 para la traducción a requisito, 3 para la
  primera comprobación, 5 para la segunda, 6 para la decisión entre suprimir y anonimizar, y 6 para
  la matriz completa, el agente y el ejercicio.

## Desarrollo

### 4.1 Seis derechos, leídos en la ley

La Unidad 1 trabajó los principios de la Ley 21.719 —finalidad, proporcionalidad, responsabilidad
demostrable— y la sesión de integración convirtió la proporcionalidad en el contenido concreto de
una *fixture*. Queda la parte que el cronograma del módulo reserva para hoy: los **derechos**, que
no son principios que orientan sino facultades que una persona ejerce y que el sistema tiene que
poder satisfacer.

La ley los enumera en un solo artículo:

> "Artículo 4º.- Derechos del titular de datos. Toda persona, actuando por sí o a través de su
> representante legal o mandatario, según corresponda, tiene derecho de **acceso, rectificación,
> supresión, oposición, portabilidad y bloqueo** de sus datos personales, de conformidad a la
> presente ley."
>
> — Ley 21.719, artículo 4º

Son **seis**, y conviene contarlos porque la referencia rápida más difundida —incluida la guía del
módulo— presenta cinco: acceso, rectificación, supresión, oposición y portabilidad. El sexto,
**bloqueo**, aparece en el texto del artículo 4º y tiene su propio artículo, y es justamente el que
más se parece a un requisito de software:

> "Artículo 8° ter.- Derecho de bloqueo del tratamiento. El titular de datos tiene derecho a
> solicitar la suspensión temporal de cualquier operación de tratamiento de sus datos personales
> cuando formule una solicitud de rectificación, supresión u oposición […] mientras dicha solicitud
> no se resuelva."
>
> — Ley 21.719, artículo 8º ter

Bloqueo es un **estado del sistema**: mientras hay una solicitud pendiente, los datos de esa persona
no se tratan. Un estado es exactamente la clase de cosa que se puede comprobar con una prueba.

Y antes de seguir, el dato que fija la consecuencia. Que un derecho no funcione no es un detalle de
cortesía:

> "Artículo 34 ter.- Infracciones graves. Se consideran infracciones graves, las siguientes: […]
> e) Impedir u obstaculizar el ejercicio legítimo de los derechos de acceso, rectificación,
> supresión, oposición o portabilidad del titular. f) Omitir la respuesta, responder tardíamente o
> denegar la petición sin causa justificada, en los casos de solicitudes fundadas de bloqueo
> temporal […]"
>
> — Ley 21.719, artículo 34 ter

Un derecho que el sistema no puede satisfacer, y una respuesta que llega tarde, están en la misma
lista de infracciones graves. La sesión de riesgo nombró entre las consecuencias posibles de un
riesgo de producto el «daño a terceros» y las «sanciones»; aquí están las dos, con nombre y
artículo.

### 4.2 De un derecho a un requisito verificable

Un derecho, tal como lo escribe la ley, todavía no se puede probar. «El titular tiene derecho a
solicitar y obtener la eliminación de los datos personales que le conciernen» es una facultad
jurídica, no una afirmación sobre el comportamiento de un programa. Traducirlo es el trabajo de este
apartado, y la herramienta es la que la Unidad 1 dejó armada: **un criterio verificable necesita una
magnitud observable, un método de medición y un umbral**. Si le falta una de las tres, no se puede
probar.

La ley ayuda más de lo que parece, porque en varios artículos ya trae la magnitud y el umbral
escritos. Cuatro ejemplos, con el texto literal a la izquierda y la traducción a la derecha:

| Artículo y texto | Magnitud | Método | Umbral | Requisito |
|---|---|---|---|---|
| **Art. 7º:** «la eliminación de los datos personales que le conciernen» | Cantidad de filas del sistema que contienen datos del titular, después de ejecutar la supresión | Buscar el identificador en todas las tablas | Cero | **RF-07** · Ejecutada una solicitud de supresión, ninguna tabla del sistema conserva datos que identifiquen al titular |
| **Art. 5º:** «acceder a dichos datos y a la siguiente información» | Cantidad de datos que el sistema trata sobre el titular y que no aparecen en la respuesta de acceso | Comparar lo entregado con lo almacenado | Cero | **RF-08** · El titular puede obtener todos los datos personales que el sistema trata sobre él |
| **Art. 9º:** «en un formato electrónico estructurado, genérico y de uso común, que permita ser operado por distintos sistemas» | Si la respuesta se puede leer con un analizador estándar sin código propio | Intentar interpretarla con un analizador del formato declarado | Se interpreta sin error | **RF-09** · Los datos que se entregan al titular van en un formato electrónico estructurado, genérico y de uso común |
| **Art. 11:** «el responsable no podrá tratar los datos del titular que forman parte del requerimiento» mientras no resuelva el bloqueo | Cantidad de operaciones de tratamiento ejecutadas sobre datos bloqueados | Ejecutar una operación con el bloqueo activo y observar si procede | Cero | **RF-10** · Mientras una solicitud de supresión no se resuelva, el sistema no trata los datos del titular |

Nótese lo que ocurrió en la tercera fila. «Formato estructurado, genérico y de uso común, que
permita ser operado por distintos sistemas» suena a redacción jurídica vaga, y es una **condición de
aceptación perfectamente ejecutable**: se toma la respuesta, se le pasa a un analizador estándar del
formato, y si se interpreta sin error el criterio se cumple. Entregar los datos en un texto con un
formato inventado por la casa falla esa prueba. La ley no dijo qué formato; dijo una propiedad del
formato, y una propiedad se comprueba.

Y el artículo 11 agrega dos umbrales que son literalmente números:

> "Recibida la solicitud el responsable deberá acusar recibo de ella y pronunciarse a más tardar
> dentro de los **treinta días corridos** siguientes a la fecha de ingreso de la solicitud. Este
> plazo podrá ser prorrogado, por una sola vez, hasta por treinta días corridos. […] La solicitud de
> bloqueo temporal deberá ser fundada y el responsable deberá responder al requerimiento dentro de
> los **dos días hábiles** siguientes a su recepción."
>
> — Ley 21.719, artículo 11

Treinta días corridos, prorrogables una vez; dos días hábiles para el bloqueo. No hay que negociar
el umbral con nadie: viene dado.

### 4.3 La supresión, comprobada mirando una tabla

El proyecto ya tiene por dónde ejercer el derecho. La operación de supresión borra las reservas de
ese RUT:

```python
def suprimir_datos_de(conexion: sqlite3.Connection, rut: str) -> None:
    conexion.execute("DELETE FROM reservas WHERE rut = ?", (rut,))
    conexion.commit()
```

Esa operación se expone en una **ruta** de la API —cada dirección por la que la aplicación recibe
solicitudes; en la industria se la llama habitualmente *endpoint*—, en este caso
`/titulares/{rut}`, y se invoca con el verbo `DELETE`, que es el que HTTP reserva para pedir que un
recurso deje de existir. Las llaves en `{rut}` indican que esa parte de la dirección es variable: la
rellena quien hace la solicitud.

Y la prueba que comprueba RF-07 es la que cualquiera escribiría primero: se crea una reserva, se
pide la supresión, y se verifica que no quedan reservas de esa persona.

```python
@pytest.mark.requisito("RF-07")
def test_supresion_elimina_las_reservas(base_de_datos_de_prueba: Path) -> None:
    cliente.post("/reservas", json=SOLICITUD)

    cliente.delete(f"/titulares/{RUT}")

    conexion = almacen.conectar()
    assert almacen.reservas_de(conexion, RUT) == 0
    conexion.close()
```

Pasa. Y la matriz del bloque anterior, regenerada, informa RF-07 como cubierto.

En este punto el proyecto tiene un requisito de protección de datos escrito, una prueba que lo
comprueba, y una matriz que lo declara cubierto. Es más de lo que tiene la mayoría de los sistemas
en producción, y **es insuficiente**.

### 4.4 La misma supresión, comprobada mirando el sistema

La prueba anterior verifica el borrado en la tabla de reservas. RF-07 no dice «la tabla de
reservas»: dice **ninguna tabla del sistema**. Y el sistema, desde que registra lo que va
ocurriendo, guarda el RUT en un segundo lugar:

```python
def registrar_evento(conexion: sqlite3.Connection, accion: str, rut: str) -> None:
    conexion.execute(
        "INSERT INTO eventos (momento, accion, rut) VALUES (datetime('now'), ?, ?)",
        (accion, rut),
    )
    conexion.commit()
```

Para comprobar el requisito como está escrito hace falta contar el rastro en todas las tablas, sin
suponer cuáles son. SQLite guarda la lista de sus propias tablas en un catálogo interno llamado
`sqlite_master`, así que se le puede preguntar:

```python
def rastro_de(conexion: sqlite3.Connection, rut: str) -> dict[str, int]:
    """Cuenta en cuantas filas de cada tabla aparece ese RUT."""
    rastro = {}
    tablas = conexion.execute(
        "SELECT name FROM sqlite_master WHERE type = 'table'"
    ).fetchall()
    for (tabla,) in tablas:
        fila = conexion.execute(
            f"SELECT COUNT(*) FROM {tabla} WHERE rut = ?", (rut,)
        ).fetchone()
        rastro[tabla] = fila[0]
    return rastro
```

Y la segunda prueba del mismo requisito, idéntica a la primera salvo en qué mira:

```python
@pytest.mark.requisito("RF-07")
def test_supresion_no_deja_rastro_del_titular(base_de_datos_de_prueba: Path) -> None:
    cliente.post("/reservas", json=SOLICITUD)

    cliente.delete(f"/titulares/{RUT}")

    conexion = almacen.conectar()
    rastro = almacen.rastro_de(conexion, RUT)
    conexion.close()
    assert rastro == {"reservas": 0, "eventos": 0}
```

Las dos juntas:

```text
E       AssertionError: assert {'reservas': 0, 'eventos': 1} == {'reservas': 0, 'eventos': 0}
E         Differing items:
E         {'eventos': 1} != {'eventos': 0}

1 failed, 1 passed in 0.73s
```

`1 failed, 1 passed`. **La misma supresión, el mismo sistema, el mismo requisito, dos veredictos
opuestos**, y la única diferencia entre las dos pruebas es cuántos lugares miran. El RUT de la
persona sigue en la base de datos después de que el sistema respondió que sus datos fueron
suprimidos.

Esto no es un detalle de este proyecto. La guía de protección de datos del módulo lo enuncia como
regla general para la corrección y la supresión: *propagar cambios o eliminaciones sin romper
integridad ni obligaciones*, y se prueba sobre **réplicas, caché y respaldos**. Y la ley lo extiende
más allá del propio sistema:

> "Con todo, cuando el responsable haya comunicado dichos datos a otras personas, deberá comunicar a
> éstas los cambios realizados en virtud de la rectificación, supresión u oposición."
>
> — Ley 21.719, artículo 11

Es decir: si el dato salió hacia otro responsable, la supresión tiene que viajar con él. Un sistema
que envía confirmaciones por correo, que replica a un servicio de reportes o que mantiene un
respaldo tiene tantos lugares donde comprobar el borrado como destinos le dio al dato. **La primera
tarea de quien escribe una prueba de supresión no es escribirla: es enumerar dónde está el dato.**

### 4.5 Suprimir o anonimizar: borrar no siempre es la respuesta

La corrección obvia es agregar un borrado de la tabla de eventos. Antes de escribirla conviene leer
el resto del artículo 7º, porque la ley no manda borrar siempre:

> "No procede la supresión cuando el tratamiento sea necesario: […] ii. Para el cumplimiento de una
> obligación legal o la ejecución de un contrato suscrito entre el titular y el responsable. […] vi.
> Para la formulación, ejercicio o defensa de una reclamación administrativa o judicial."
>
> — Ley 21.719, artículo 7º, inciso final

El registro de eventos existe para poder demostrar qué hizo el sistema y cuándo. Borrarlo entero
destruye justamente la evidencia con la que el responsable acredita que cumplió —incluido que
cumplió esta supresión—. Pero conservarlo con el RUT adentro incumple el derecho. Las dos salidas
parecen cerradas, y no lo están: la sesión de integración ya estableció la distinción que las
resuelve, y viene del artículo 3º de la misma ley, que manda que los datos sean «**suprimidos o
anonimizados**».

Son dos operaciones distintas y hay que tenerlas separadas:

| | Qué le pasa a la fila | Qué le pasa al dato personal | Cuándo corresponde |
|---|---|---|---|
| **Suprimir** | Desaparece | Desaparece con ella | El registro entero carece de finalidad una vez cumplido su propósito |
| **Anonimizar** | Se conserva | Se quita, de modo que ya no se pueda reidentificar a la persona | El registro tiene una finalidad legítima que sobrevive al dato personal |

La reserva se suprime: cumplida la reserva, no hay finalidad que justifique conservar el nombre, el
RUT y el correo. El evento se anonimiza: la constancia de que hubo una reserva y de que se suprimió
sigue siendo necesaria, y no necesita saber de quién era.

```python
def suprimir_datos_de(conexion: sqlite3.Connection, rut: str) -> None:
    conexion.execute("DELETE FROM reservas WHERE rut = ?", (rut,))
    conexion.execute("UPDATE eventos SET rut = NULL WHERE rut = ?", (rut,))
    conexion.commit()
```

Mirado sobre la base de datos, antes y después de la supresión:

```text
antes  : [('reserva creada', '11.111.111-1')]
despues: [('reserva creada', None)]
reservas: 0
```

El `NULL` que escribe la instrucción y el `None` que aparece al leer son la misma cosa vista desde
dos lados: `NULL` es como la base de datos representa la ausencia de valor, y `None` es como esa
ausencia llega a Python. El evento sobrevive; la persona no está en él. Y las dos pruebas de RF-07:

```text
2 passed in 0.59s
```

Conviene subrayar cuál fue exactamente el trabajo humano en este apartado, porque es el que no se
delega. No fue escribir el `UPDATE`: eso lo escribe cualquiera en diez segundos. Fue **decidir que
la fila del evento debía sobrevivir sin su RUT en lugar de desaparecer**, y esa decisión se tomó
leyendo dos artículos y pesando dos obligaciones que apuntan en direcciones contrarias. La prueba no
podía tomarla: la prueba solo comprueba que el rastro quedó en cero, y ese cero se consigue igual
borrando la fila entera. **Dos implementaciones pasan la misma prueba y solo una cumple la ley.**

### 4.6 Los derechos, dentro de la matriz

Con los cuatro requisitos de 4.2 escritos en el archivo de requisitos y las dos pruebas de RF-07
marcadas, la matriz del bloque anterior se regenera sin tocar el programa:

```text
MATRIZ DE TRAZABILIDAD
requisito    pruebas   estado
RF-01             10   cubierto
RF-02              2   cubierto
RF-03              2   cubierto
RF-04              4   cubierto
RF-05              0   SIN PRUEBA
RF-06              1   cubierto
RF-07              2   cubierto
RF-08              0   SIN PRUEBA
RF-09              0   SIN PRUEBA
RF-10              0   SIN PRUEBA

Requisitos sin prueba: 4
  RF-05
  RF-08
  RF-09
  RF-10
```

Los derechos no necesitaron un artefacto aparte: son filas de la misma matriz, con el mismo
tratamiento que cualquier otro requisito. Y al entrar, hicieron aparecer tres huecos que el proyecto
tenía desde siempre y que nadie había nombrado. El sistema no tiene por dónde ejercer el acceso, ni
la portabilidad, ni el bloqueo. Eso no lo descubrió una ejecución ni una auditoría: lo descubrió
**escribir el requisito**. Un hueco solo se puede ver contra algo, y hasta hoy no había contra qué.

**Lo que hace un agente con esto.** El experimento que cierra la sesión es pedirle la prueba de
RF-07, con el requisito ya escrito y acceso solo de lectura:

```bash
claude -p "Escribe una prueba de pytest que compruebe el requisito RF-07 de REQUISITOS.md
sobre el endpoint DELETE /titulares/{rut}. Devuelve solo el archivo de prueba, sin
explicaciones." --allowed-tools "Read,Glob,Grep"
```

Devolvió una prueba mejor que la de 4.4. No supone los nombres de las tablas ni de las columnas:
consulta el catálogo de SQLite, consulta las columnas de cada tabla y busca los tres datos
identificatorios —nombre, RUT y correo— en todas ellas. Y agrega algo que no estaba en la versión
de la clase:

```python
    for valor in DATOS_IDENTIFICATORIOS:
        assert apariciones_en_la_base(base_de_datos_de_prueba, valor), (
            f"la reserva no dejo {valor!r} en la base; la prueba no comprobaria nada"
        )
```

Antes de borrar, comprueba que los datos **estaban**. Es la defensa contra una prueba que pasa por
vacío: si por cualquier razón la reserva no se hubiera guardado, la comprobación del borrado daría
cero y pasaría sin haber comprobado nada. Ejecutada contra la versión con el defecto, la prueba lo
encuentra:

```text
AssertionError: '11.111.111-1' sigue en la base tras la supresion
```

Y aquí se cierra el arco de la sesión, porque este resultado y el del primer bloque son el mismo
experimento con una variable cambiada. En el bloque 1 el agente escribió un plan sobre un proyecto
**sin requisitos escritos**, y tuvo que inferir la regla de negocio del nombre de una constante:
acertó por suerte, y el documento no dejaba ver que había adivinado. Aquí escribió una prueba sobre
un requisito que alguien redactó con una magnitud —cantidad de apariciones del titular—, un método
—buscar en todas las tablas— y un umbral —cero—, y produjo algo riguroso.

El modelo es el mismo en los dos casos. Lo que cambió fue que alguien hizo el trabajo de esta
sesión.

> Un agente convierte un requisito bien escrito en una prueba rigurosa con una facilidad que
> conviene aprovechar. Lo que no puede hacer es escribir el requisito por ti, porque escribirlo
> exige decidir qué le debe el sistema a una persona, y eso no está en el código.

Lo que sigue sin delegarse queda a la vista en los dos momentos del bloque: **enumerar dónde vive el
dato** antes de escribir la prueba, y **decidir entre suprimir y anonimizar** cuando dos
obligaciones se cruzan. Las dos son juicios sobre finalidad, y la finalidad no se infiere de un
esquema de base de datos.

## Ejercicio del bloque

Sobre el proyecto propio, cerrando el plan de la sesión.

1. **Enumera dónde vive el dato personal en tu sistema.** Una lista de lugares: tablas, archivos,
   registros de eventos, respaldos, servicios externos a los que le envías datos, correos que
   despachas. Si tu lista tiene un solo elemento, revísala otra vez.
2. **Escribe dos derechos como requisitos**, con las tres piezas: magnitud, método y umbral. Elige el
   de supresión y uno más entre acceso, portabilidad y bloqueo. Dales identificador y agrégalos a tu
   archivo de requisitos.
3. **Escribe la prueba de supresión que mira todos los lugares del punto 1**, y ejecútala. Anota el
   resultado literal, sea rojo o verde. Si es rojo, encontraste un incumplimiento real de tu
   proyecto.
4. **Decide, por cada lugar de tu lista, si corresponde suprimir o anonimizar**, y escribe al lado
   la finalidad que justifica conservar el registro en los casos donde elegiste anonimizar. Si no
   puedes nombrar la finalidad, corresponde suprimir.
5. **Regenera tu matriz** y pega la salida. Los derechos sin prueba quedan como casos pendientes
   priorizados en tu plan, no como omisiones silenciosas.

**Pista:** para el punto 1, el lugar que más se olvida no es el respaldo: es el registro de eventos
o la bitácora, porque se escribió para depurar y nadie la pensó como un almacén de datos personales.
El segundo más olvidado es el cuerpo del correo de confirmación que el sistema ya envió.

**Evidencia esperada:** una lista de lugares con más de un elemento, dos derechos escritos como
requisitos con sus tres piezas, la salida literal de la prueba de supresión, una decisión de
suprimir o anonimizar por lugar con su finalidad, y la matriz regenerada con los derechos incluidos.

## Preguntas guía

1. Las dos pruebas de RF-07 comprueban el mismo requisito sobre el mismo sistema y dan resultados
   opuestos. ¿Cuál de las dos estaba mal escrita, y qué tendría que haber hecho su autor antes de
   escribirla para no equivocarse?

   **Pista:** ninguna de las dos tiene un error de programación. Compara lo que dice el requisito
   —«ninguna tabla del sistema»— con lo que mira cada una, y pregúntate qué información necesitaba
   tener el autor de la primera y no tenía.

2. La corrección deja la fila del evento en pie con el RUT en nulo. Otra persona resuelve el mismo
   problema borrando la fila completa, y las dos pruebas de RF-07 pasan igual. ¿Por qué solo una de
   las dos soluciones es correcta, y qué artefacto del proyecto debería contener la razón?

   **Pista:** lee el inciso final del artículo 7º y pregúntate qué pierde el responsable cuando borra
   el registro. Después pregúntate dónde se escribe una decisión de ese tipo para que la próxima
   persona no la deshaga sin saber.

3. Escribir los cuatro derechos como requisitos hizo aparecer tres huecos en un sistema que no
   cambió ni una línea. Si los huecos ya estaban, ¿qué fue exactamente lo que cambió, y qué dice eso
   sobre el valor de un requisito escrito frente a una suite que pasa?

   **Pista:** pregúntate qué habría informado la suite el día anterior a escribir esos requisitos, y
   qué habría informado la matriz. Las dos decían la verdad sobre lo que existía.

## Fuentes técnicas del bloque

- [Ley 21.719, que regula la protección y el tratamiento de los datos personales y crea la Agencia de Protección de Datos Personales. Diario Oficial núm. 44.023, viernes 13 de diciembre de 2024](https://www.bcn.cl/leychile/navegar?idNorma=1209601) — el artículo 4º con la enumeración de los seis derechos del titular; el artículo 5º sobre el derecho de acceso; el artículo 7º sobre el derecho de supresión, con sus seis causales y el inciso final que enumera los casos en que la supresión no procede; el artículo 8º ter sobre el derecho de bloqueo como suspensión temporal mientras una solicitud no se resuelve; el artículo 9º sobre portabilidad y la exigencia de un formato electrónico estructurado, genérico y de uso común; el artículo 11 con los plazos de treinta días corridos para pronunciarse y dos días hábiles para el bloqueo temporal, y la obligación de comunicar la supresión a quienes se les hayan comunicado los datos; y el artículo 34 ter, letras e) y f), que califican como infracción grave impedir el ejercicio de los derechos y responder tardíamente una solicitud de bloqueo.
- Guía maestra de la Ley 21.719 del módulo — la regla de corrección y supresión: propagar cambios o eliminaciones sin romper integridad ni obligaciones, y su indicación de qué se prueba en esos casos: réplicas, caché y respaldos.
- [ISO/IEC/IEEE 29119-3:2021 — *Test documentation*](https://www.iso.org/standard/79429.html) — la matriz de trazabilidad de la cláusula 3.26, aquí aplicada sin modificaciones a requisitos cuya fuente es una ley en lugar de una especificación funcional.
- [SQLite — el esquema interno `sqlite_master`](https://www.sqlite.org/schematab.html) — la tabla del catálogo donde el motor guarda la definición de sus propias tablas, que permite recorrer el almacenamiento sin suponer qué tablas existen.
- [pytest — documentación oficial](https://docs.pytest.org/en/stable/) — la comparación de diccionarios en una aserción y el informe de diferencias que produce cuando falla.
- Ejecuciones registradas para esta clase sobre el proyecto de reserva de laboratorio, con Python 3.13.11, pytest 9.1.1, FastAPI 0.141.1 y SQLite 3.50.4: las dos pruebas de RF-07 con el resultado `1 failed, 1 passed in 0.73s` y la diferencia literal `{'reservas': 0, 'eventos': 1}`; el estado de la tabla de eventos antes y después de la supresión corregida; las mismas dos pruebas en `2 passed in 0.59s` tras la corrección; la matriz regenerada con diez requisitos y cuatro sin prueba; y la prueba de supresión generada con `claude -p` con herramientas restringidas a lectura, con su resultado sobre la versión defectuosa.

---

# Cierre: tres artefactos, tres afirmaciones distintas

## 1. Lo que cada artefacto puede afirmar

La sesión puso a trabajar juntos tres artefactos sobre el mismo proyecto. No se reemplazan entre sí,
y confundir lo que afirma cada uno es lo que lleva a creer que un sistema está probado cuando lo
único que está es en verde.

| Artefacto | Qué afirma | Qué no puede afirmar |
|---|---|---|
| **La suite** | Que los casos que existen se comportaron como alguien esperaba | Qué quedó sin probar. No hay forma de que informe sobre lo que nadie escribió |
| **El plan de pruebas** | Qué se decidió probar, qué queda deliberadamente fuera, qué riesgo se acepta y cuándo se considera suficiente | Que lo decidido se haya hecho. Un plan es una declaración, no una medición |
| **La matriz de trazabilidad** | Si lo decidido y lo escrito coinciden: qué requisito no tiene prueba, qué prueba no responde a ningún requisito | Si una prueba comprueba de verdad el requisito que dice cubrir. Detecta ausencias, no insuficiencias |

Las tres filas dejan un hueco común, y la sesión mostró con qué se tapa: **alterar el código a
propósito y exigir el rojo**. Es el único procedimiento de los cuatro que produce evidencia en lugar
de una afirmación, y por eso es el que arbitra cuando los otros se contradicen. Cuando la matriz dijo
que RF-06 estaba cubierto y el agente dijo que no, lo que resolvió la discusión no fue ninguno de los
dos: fue un comprobante reducido a una constante y una suite que siguió en verde.

## 2. La afirmación que se puede sostener

Las sesiones anteriores fueron acumulando lo defendible sobre cada prueba: qué comprueba, que se la
vio fallar antes de existir, qué cambios detecta, que no hereda el estado de ninguna otra. Todo eso
era sobre las pruebas. Hoy se agrega la capa que falta, que es sobre **el conjunto**:

> Estas pruebas comprueban estos requisitos —y puedo mostrar la matriz que los cruza, generada desde
> la suite y no escrita a mano—, estos otros requisitos no tienen ninguna prueba y está escrito por
> qué y con qué prioridad quedaron así, el esfuerzo está repartido según un riesgo que valoré y no
> según lo que era cómodo de probar, y de las filas que declaro cubiertas puedo mostrar al menos una
> que verifiqué alterando el código y exigiendo el rojo.

Lo que sigue sin poder afirmarse, y conviene decirlo en voz alta antes de salir: **que algo de esto
ocurra cuando nadie se acuerde**. La matriz se genera si alguien la ejecuta. La suite corre si
alguien la corre. El plan se cumple si alguien lo lee. Todo lo de hoy depende de la memoria y la
disciplina de una persona, y esa es la dependencia más frágil que tiene un proyecto.

## 3. Ticket de salida

En tres líneas, antes de salir:

1. Un requisito de tu proyecto que hoy no tiene ninguna prueba, con el identificador que le
   asignaste.
2. El resultado de alterar el código de un requisito que tu matriz declara cubierto: ¿se puso roja la
   suite, o sobrevivió?
3. Un lugar de tu sistema donde vive un dato personal y que no habías considerado antes de hoy.

## 4. Próxima sesión: lo que nadie ejecuta no existe

La sesión de mañana ataca exactamente esa fragilidad. Todo lo que se construyó hoy —la suite, el
plan, la matriz— comparte una condición que hasta ahora nadie cuestionó: alguien tiene que
acordarse. Basta una entrega apurada para que la suite no se ejecute, y basta un mes para que la
matriz deje de regenerarse y vuelva a ser una planilla vieja con otro nombre.

La sesión que sigue traslada esa responsabilidad de las personas a la infraestructura: pruebas de
regresión que vuelven a ejecutar lo que ya funcionaba para comprobar que sigue funcionando, e
integración continua que las dispara sola ante cada cambio, sin pedir permiso ni depender de que
alguien tenga un buen día. Y aparece ahí un problema nuevo que hoy no podía aparecer, porque hoy
todas las ejecuciones dieron el mismo resultado: la **prueba inestable**, la que pasa y falla sin que
el sistema haya cambiado, que es la forma más eficaz conocida de que un equipo deje de creerle a su
propia suite.

## Mensaje final

Los tres hallazgos de la sesión tienen la misma forma, y por eso se pueden resumir en una sola idea.
El requisito de cancelación llevaba seis sesiones sin una sola prueba, y la suite informó verde todos
los días. El requisito del comprobante tenía una marca que decía «cubierto» y una aserción que no lo
comprobaba, y sobrevivió intacto a que la función se redujera a una constante. Los derechos del
titular no tenían huecos hasta que se escribieron como requisitos, porque un hueco solo existe
contra algo. En los tres casos, lo que faltaba no produjo ninguna señal.

> Ninguna herramienta informa lo que falta, porque lo que falta no se ejecuta. Un verde solo alcanza
> hasta donde alguien decidió escribir, y por eso la decisión —qué se prueba, qué se deja fuera, y
> contra qué documento se compara— es el único artefacto del que no existe una versión automática. Un
> agente la convierte en pruebas rigurosas mejor y más rápido que cualquiera de nosotros, una vez que
> está escrita. Escribirla es lo que queda del oficio.

## Fuentes de síntesis

- [ISO/IEC/IEEE 29119-3:2021 — *Test documentation*](https://www.iso.org/standard/79429.html) — el plan de pruebas y sus diez subcláusulas (7.2), la matriz de trazabilidad (3.26), y las dos modalidades de conformidad de la cláusula 4, con la exigencia de registrar y justificar todo recorte.
- [ISO/IEC/IEEE 29119-2:2021 — *Test processes*](https://www.iso.org/standard/79428.html) — el proceso de gestión del que el plan de pruebas es la salida documental.
- [ISTQB Certified Tester Foundation Level Syllabus v4.0.1](https://astqb.org/assets/documents/ISTQB_CTFL_Syllabus_v4.0.1.pdf) — la sección 5.2 completa: definición de riesgo y sus dos factores, riesgo de proyecto y de producto, análisis de riesgo y sus aplicaciones, y las cuatro respuestas posibles ante un riesgo identificado.
- [Ley 21.719 — Diario Oficial núm. 44.023, 13 de diciembre de 2024](https://www.diariooficial.interior.gob.cl/publicaciones/2024/12/13/44023/01/2583630.pdf) — el artículo 4º con los seis derechos del titular, el artículo 7º sobre supresión y los casos en que no procede, el artículo 9º sobre portabilidad, el artículo 11 con sus plazos y la obligación de propagar la supresión, y el artículo 34 ter sobre las infracciones graves asociadas al ejercicio de los derechos.
- Documentación oficial de [`pytest`](https://docs.pytest.org/en/stable/) — marcadores, parametrización con `pytest.param`, recolección sin ejecución y la API de *plugins*.

---
