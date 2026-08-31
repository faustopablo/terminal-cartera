---
format: 1920x1080
duration: 15s
message: "La recarga, resuelta en tu cochera"
arc: PAS comprimido — pain → product intro → proof → CTA
audience: dueños de autos eléctricos en Argentina (y quienes administran cocheras/edificios)
mode: autonomous
language: es
music: confident minimal tech underscore, dark premium electronic
---

## Video direction

- **Palette** (frame.md, broadside remixado): canvas carbón `dark` #0B0F0F como fondo de todo el film; ink blanco #FFFFFF para el display; acento magenta #EC13A0 reservado a la palabra clave, el logo, los stats y el CTA — nunca como fondo de texto largo. Verde oscuro solo si frame.md lo mapea como rol secundario.
- **Motion grammar**: long-tail `power3`, smooth sobre bouncy; overshoot solo en el bloom del mark final. Reveal model: cada pieza entra cuando la VO la nombra — nada se front-loadea; los reveals se reparten en el back ~50% de cada frame. Durante un hold: quietud, a lo sumo subtle jitter.
- **Ritmo / frames sostenidos**: Frame 4 cierra en un hold largo y muerto-estático (el lockup + CTA) — es el breather deliberado del film; Frames 1–3 revelan a la VO.
- **Negative list**: nada de breathing loops, ni pan/push lento en la segunda mitad de una escena, ni `back.out` por defecto, ni gradientes violeta-azul "IA", ni bokeh flotante, ni chrome de browser/cursores reales; ni slideshow (todo al 25% inicial y congelar) ni screensaver (todo flotando). Sin fotos stock: todo el material visual es tipografía, SVG de marca y mock-UI reconstruido.
- **Caption band**: todo el contenido importante en el ~83% superior del canvas.

## Frame 1 — El trámite

- scene: Frases de dolor en tipografía masiva blanca sobre carbón; la palabra clave cambia en el lugar
- voiceover: "Cargar tu auto eléctrico — no debería ser un trámite."
- duration: 2.965s
- transition_in: cut
- status: outline
- src: compositions/frames/01-el-tramite.html
- type: hook
- persuasion: Pain validation
- beat: frustración → curiosidad
- blueprint: kinetic-type-beats (Reproduce — variante Problem, sub-shape B statement build)
- asset_candidates: none — beat tipográfico puro (sin assets capturados)
- focal: la línea de dolor (tipografía)
- sfx: impact-soft

Scene 1 (0.0–1.2s): campo carbón sólido; "Cargar tu auto eléctrico" entra dead-center vía per-word staggered reveal (`dynamic-content-sequencing`) en display blanco bold, ~55% del ancho, settle long-tail — Centered, jerarquía por tamaño 3:1 sobre el vacío.
Scene 2 (1.2–2.4s): cuando la VO dice "no debería ser un trámite", la segunda línea llega debajo vía kinetic beat-slam (`kinetic-beat-slam`); al aterrizar la palabra "trámite", una barra magenta fina la tacha creciendo izquierda→derecha (un scaleX con origin left, tween plano — sin regla dedicada). Layout sigue Centered, dos líneas apiladas en el tercio medio-superior.
Scene 3 (2.4–2.965s): hold quieto sobre el dolor tachado — quietud total, nada se mueve. Sin exit propio — la transición zoom-through del Frame 2 es el exit.

narrativeRole: Validar el dolor en lenguaje del viewer — cargar afuera es una vuelta más en el día. Sin producto todavía.
keyMessage: Cargar no debería ser un trámite.

## Frame 2 — Recharg

- scene: Name-drop "Recharg" con el logo reconstruido (ícono cargador magenta) y la tesis del sitio como tagline
- voiceover: "Recharg. La recarga, resuelta en tu cochera."
- duration: 2.645s
- transition_in: zoom-through
- status: outline
- src: compositions/frames/02-recharg.html
- type: product_intro
- persuasion: Friction reduction — el producto elimina el trámite llevándolo a donde el auto duerme
- beat: alivio + claridad
- blueprint: kinetic-type-beats (Adapt — variante Product_Intro namedrop resolviendo en logo reveal)
- asset_candidates: none — logo y wordmark reconstruidos en HTML/SVG según asset-descriptions.md
- focal: el lockup Recharg (ícono SVG magenta + wordmark)
- sfx: whoosh

Adapt: mantengo la firma — beats de tipo duro que resuelven en la marca; cambio: el name-drop llega primero (la VO abre con el nombre), y el "Introducing" se omite — el zoom-through de entrada ya hace de anuncio.
Scene 1 (0.0–0.8s): sobre carbón, el lockup Recharg aterriza dead-center — el ícono SVG (rectángulo redondeado con rayo + enchufe + silueta de auto, magenta #EC13A0) hace spring-pop con settle suave (`spring-pop-entrance`) mientras un glow magenta (un div radial-gradient blureado) hace fade-in y fade-out una sola vez detrás — tween plano de opacity, sin regla dedicada; el wordmark "Recharg" en display blanco se revela a su derecha saliendo de atrás del ícono (x-slide bajo máscara overflow-hidden, tween plano). Centered, lockup ~40% del ancho, 3 capas de profundidad (glow / ícono / wordmark).
Scene 2 (0.8–2.2s): cuando la VO entra en la tesis, la tagline "La recarga, resuelta en tu cochera." se arma per-word debajo del lockup (`dynamic-content-sequencing`), body-display blanco a ~60% del tamaño del wordmark; al decirse "cochera", una barra magenta fina crece izquierda→derecha bajo la palabra (scaleX con origin left, tween plano).
Scene 3 (2.2–2.645s): hold del lockup + tagline; quietud total. Nada nuevo entra.

narrativeRole: Nombrar el producto y aterrizar el message (la tesis del video) en el beat 2 — reverse iceberg.
keyMessage: La recarga, resuelta en tu cochera.

## Frame 3 — La prueba

- scene: Grilla de cards que se autoensambla: potencias 7/11/22 kW, mock de la app (estado · energía · potencia), instalación en 3 pasos
- voiceover: "Un cargador dedicado donde estacionás — hasta veintidós kilovatios — con tu carga visible en la app."
- duration: 5.504s
- transition_in: crossfade
- status: outline
- src: compositions/frames/03-la-prueba.html
- type: feature_showcase
- persuasion: Show-don't-tell proof — los números y la app del propio sitio como evidencia
- beat: confianza + control
- blueprint: grid-card-assemble (Adapt — variante Key_Feature grid, cadencia dictada por la VO)
- asset_candidates: none — cards y mock de app reconstruidos en HTML según asset-descriptions.md (datos reales del sitio: 7/11/22 kW; app con estado, energía, duración y potencia; pasos 01 Relevamiento / 02 Instalación / 03 Listo para usar)
- focal: la card central de potencias (22 kW en magenta)
- sfx: pop-soft, tick

Adapt: mantengo la firma — el stagger-assemble de items hacia su slot; cambio: la cascada no es de golpe — cada card entra en su cue hablado (3 cues = 3 cards), y la grilla resuelve como triptych.
Scene 1 (0.0–1.8s): sobre carbón, "Un cargador dedicado donde estacionás" — card 1 entra a su slot izquierdo con fade + slide corto (`center-outward-expansion`, forma short-path directo al slot): silueta SVG del cargador mural (gabinete grafito, frente vidrio, cable) + label "Donde estacionás". Triptych en construcción, fila al centro del ~83% superior; cards oscuras con borde sutil, primaria ≥40% del canvas cuando complete.
Scene 2 (1.8–3.4s): "hasta veintidós kilovatios" — card 2 entra al slot central igual; dentro, "7 · 11 · 22 kW" y el 22 hace count-up con escala creciente (`counting-dynamic-scale`) en magenta — la card central domina por tamaño y contraste (jerarquía 2 de 4).
Scene 3 (3.4–4.8s): "con tu carga visible en la app" — card 3 entra al slot derecho: mini mock de la app Recharg (pantalla oscura, logo, filas estado / energía / potencia) cuyas barras de métrica se llenan izquierda→derecha (`stat-bars-and-fills`).
Scene 4 (4.8–5.504s): triptych completo hold; un brillo magenta suave (div gradient blureado) cruza UNA vez detrás de las tres cards con un tween plano de x + opacity, y todo queda quieto.

narrativeRole: Evidencia al servicio de la tesis: el hardware, la potencia y la visibilidad desde la app, en una sola mirada.
keyMessage: Cargador dedicado + potencia real + carga visible.

## Frame 4 — Mientras dormís

- scene: Cierre calmo: "Tu auto carga mientras dormís." resuelve en el lockup Recharg + botón magenta HABLEMOS
- voiceover: "Tu auto carga mientras dormís. Hablemos."
- duration: 2.368s
- transition_in: crossfade
- status: outline
- src: compositions/frames/04-mientras-dormis.html
- type: cta
- persuasion: Future pacing + risk reversal suave (una conversación, no una compra)
- beat: paz mental → urgencia-de-actuar
- blueprint: logo-assemble-lockup (Adapt — variante CTA text-clear bloom)
- asset_candidates: none — lockup y botón CTA reconstruidos en HTML/SVG según asset-descriptions.md
- focal: el lockup Recharg + botón HABLEMOS
- sfx: whoosh-soft, impact-soft

Adapt: mantengo la firma — el texto se limpia solo y el mark hace spring-BLOOM desde cero en el centro vacío; cambio: el payoff a la derecha del bloom no es una URL sino el botón píldora magenta "HABLEMOS" debajo del lockup.
Scene 1 (0.0–1.6s): sobre carbón, "Tu auto carga mientras dormís." se revela word-by-word en fade silencioso pasando de gris a blanco (stagger plano de opacity + color por palabra — registro quieto, no waterfall), display centrado, ~55% del ancho. Frame estático.
Scene 2 (1.6–2.4s): el texto se limpia — shrink-toward-center + fade (`scale-swap-transition`, mitad exit) — y sobre el frame vacío el ícono Recharg hace spring-bloom desde cero con leve rotación (`spring-pop-entrance`, el único overshoot permitido del film); se desliza un paso a la izquierda mientras el wordmark "Recharg" se revela a su derecha con estados parciales visibles (clip-path wipe).
Scene 3 (2.4–3.5s): cuando la VO dice "Hablemos", el botón píldora magenta "HABLEMOS" (texto carbón, mayúsculas) hace spring-pop debajo del lockup (`spring-pop-entrance`, settle suave) — y todo queda muerto-estático hasta el último frame: este es el hold deliberado del film.

narrativeRole: Convertir la tesis en futuro deseable y cerrar con el CTA textual del sitio ("Hablemos").
keyMessage: Tu auto carga mientras dormís — hablemos.
