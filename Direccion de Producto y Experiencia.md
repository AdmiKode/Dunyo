Dirección de producto y experiencia Tesis UX

La app debe sentirse como:

● refugio

● espacio propio

● calma con agencia

● seguridad sin juicio

● acompañamiento, no examen

No debe sentirse como:

● escuela

● terapia

● control parental

● diario forzado

● juego ruidoso

● app de tareas

Tesis visual

Nada de primarios de kinder.

Nada de interfaz de preescolar.

Nada de mascadas visuales saturadas. Sí a:

● atmósferas suaves

● gradientes calmados

● contraste suficiente

● ilustración emocional elegante

● personajes cálidos

● capas con profundidad blanda

● fondos orgánicos

● microanimación lenta

● tarjetas limpias

Personalización del niño

Sí, completamente. Tu idea de perritos o gatitos está buena, pero no debe sentirse “app de sticker”. Debe ser parte del refugio.

Personalización permitida en V1

● elegir compañero: perrito o gatito

● elegir una de 2 paletas base

● elegir estilo de fondo

● elegir nombre de su refugio

● elegir sonido ambiente opcional

● elegir modo día / noche dentro de la paleta

● elegir ícono o objeto protector: estrella, nube, linterna, hoja, luna, brújula Lo que no haría en V1

● vestir personajes con mil accesorios

● tienda interna

● monedas

● elementos hiperjuego

Queremos vínculo, no circo.

2. Árbol de navegación

A. App del niño

1. Splash / entrada

● logo

● transición suave

● acceso seguro

2. Selección de perfil

● niño único o varios hijos si aplica en plan familiar

● avatar / compañero

3. Home del refugio

● ¿Qué necesitas ahorita? ○ calmarme ○ entenderme ○ dormir ○ decir algo difícil ○ sentirme fuerte ○ no sé, guíame

● acceso secundario ○ mi refugio ○ mis ayudas ○ mis logros ○ mi compañero

4. Flujo de check-in

● cómo se siente hoy

● dónde pasó más

● qué tan fuerte

● quiero ayuda / no quiero hablar / solo calmarme

5. Rutas de intervención

● calma rápida

● entender lo que me pasa

● situación específica

● historia o misión

● práctica para hablar con adulto

6. Módulo “Ayúdame a decirlo”

● elegir adulto ● elegir tema

● practicar

● generar frase / nota / tarjeta

7. Módulo “Dormir / noche”

● miedo nocturno

● pesadillas

● rutina de calma

● audio o historia

8. Módulo “Mi fuerza”

● logros emocionales

● herramientas favoritas

● personas seguras

● cosas que sí me ayudan

9. Personalización

● compañero

● paleta

● fondo

● sonidos

● nombre del refugio

10. Configuración básica infantil

● accesibilidad

● música / sonidos

● notificaciones suaves

● privacidad explicada en lenguaje infantil

B. App / panel del padre 1. Home parental

● resumen general

● semáforo

● cambios de patrón

● alertas

● recomendaciones de la semana

2. Panel del hijo

● tendencias

● categorías principales

● horarios sensibles

● progreso de uso

● herramientas que más le sirven

3. Recomendaciones para padres

● cómo abordar

● qué decir ● qué no decir

● sugerencia según perfil del niño

4. Alertas

● bandeja de alertas

● gravedad

● qué hacer

● si ya se atendió

5. Correos y reportes

● configuración de frecuencia

● destinatarios

● formato semanal / quincenal

6. Perfil del niño

● edad

● contexto

● preocupaciones registradas

● adultos seguros

● permisos

7. Configuración y privacidad

● consentimiento

● descarga / borrado

● nivel de visibilidad

● notificaciones

3. Mapa de pantallas Niño Onboarding

1. Bienvenida infantil 2. Explicación simple de privacidad 3. Elige tu compañero 4. Elige tu paleta 5. Elige tu refugio 6. Primer check-in guiado

Core

7. Home del refugio 8. Selector “qué necesito ahorita” 9. Selector emocional visual 10. Selector de contexto 11. Intensidad 12. Ruta sugerida 13. Herramienta rápida 14. ¿Te ayudó?

15. Guardar / pedir ayuda Situaciones

16. Casa y familia 17. Escuela 18. Amigos 19. Miedo / noche 20. Vergüenza / cuerpo 21. Enojo fuerte 22. Tristeza / extrañar 23. “No sé qué me pasa”

Comunicación

24. Ayúdame a decirlo 25. Elegir adulto 26. Ensayo de conversación 27. Tarjeta / nota preparada

Refuerzo

28. Mi fuerza 29. Mis herramientas 30. Mis logros 31. Mi compañero 32. Personalización del refugio

Utilidad

33. Rutina de noche 34. Caja de calma 35. Botón “solo ayúdame” 36. Botón “quiero hablar con alguien”

Padre

1. Login / consentimiento 2. Onboarding parental 3. Home ejecutivo 4. Vista por hijo 5. Tendencias semanales 6. Gráficas por categoría 7. Horarios / contexto 8. Recomendaciones de abordaje 9. Alertas 10. Centro de guías 11. Correos configurables 12. Perfil / configuración / privacidad 13. Historial de intervenciones 14. Estado de alertas atendidas 4. Arquitectura de base de datos Te la doy en lógica de producto. No SQL todavía, pero casi lista para schema. Tabla: users

Padres o tutores autenticados. Campos:

● id

● email

● nombre

● tipo_usuario = parent/admin/support

● timezone

● idioma

● plan

● status

● creado_en

● ultimo_acceso

Tabla: child_profiles

Perfil principal del niño. Campos:

● id

● parent_user_id

● nombre_display

● edad

● fecha_nacimiento_aprox o solo rango_edad

● grado_escolar

● pronombres opcional

● companion_type = dog/cat

● theme_palette_id

● background_style_id

● refuge_name

● profile_state = active/paused

● onboarding_completed

● created_at

Tabla: child_context

Contexto cargado por el padre. Campos:

● id

● child_profile_id

● principales_preocupaciones [array]

● composicion_hogar

● situacion_familiar

● horarios_sensibles ● nota_parental_resumida

● adults_safe_list

● updated_at

Tabla: parental_consents

Consentimientos y compliance. Campos:

● id

● parent_user_id

● child_profile_id

● consent_type

● verification_method

● verified_at

● version_privacy_policy

● version_terms

● status

● revoked_at

Tabla: mood_checkins

Check-ins emocionales del niño. Campos:

● id

● child_profile_id

● session_id

● emotion_primary

● emotion_secondary

● body_signal

● context_primary

● intensity

● wants_to_talk boolean

● wants_only_help boolean

● free_text_short nullable

● created_at

Tabla: situation_tags

Catálogo de situaciones. Campos:

● id

● category

● slug

● nombre

● descripcion

● age_group

● active Tabla: session_interventions

Qué ruta o herramienta se activó. Campos:

● id

● child_profile_id

● mood_checkin_id

● intervention_type

● intervention_slug

● duration_seconds

● completed boolean

● helpful_score

● created_at

Tabla: child_resources

Herramientas favoritas / recursos del niño. Campos:

● id

● child_profile_id

● resource_type

● resource_slug

● pinned

● use_count

● last_used_at

Tabla: child_strength_events

Logros emocionales. Campos:

● id

● child_profile_id

● event_type

● title

● description

● created_at

Tabla: support_requests

Pedidos de ayuda o “ayúdame a decirlo”. Campos:

● id

● child_profile_id

● request_type

● target_adult

● topic

● generated_message

● status

● created_at Tabla: parent_reports

Resumen generado para padres. Campos:

● id

● child_profile_id

● period_start

● period_end

● summary_json

● sentiment_band

● delivered_email boolean

● delivered_at

● created_at

Tabla: alerts

Sistema de alertas. Campos:

● id

● child_profile_id

● alert_type

● severity = low/medium/high/critical

● trigger_source

● rule_id

● status = open/acknowledged/resolved

● summary

● recommended_action

● created_at

● acknowledged_at

● resolved_at

Tabla: parent_recommendations

Recomendaciones activas al padre. Campos:

● id

● child_profile_id

● recommendation_type

● context

● recommendation_text

● confidence_level

● source_period_start

● source_period_end

● active

● created_at Tabla: theme_palettes

Paletas visuales disponibles. Campos:

● id

● slug

● name

● description

● bg_primary

● bg_secondary

● surface

● accent

● text_primary

● text_secondary

● illustration_tint

● active

Tabla: companion_assets

Assets del compañero visual. Campos:

● id

● type = dog/cat

● style

● mood_variant

● asset_url

● active

Tabla: content_modules

Biblioteca de contenido. Campos:

● id

● module_type

● slug

● title

● age_range

● category

● context_tags

● difficulty

● active

Tabla: content_steps

Pasos de una historia, misión o herramienta. Campos:

● id

● module_id

● step_order ● step_type

● title

● body

● button_labels_json

● asset_ref

● created_at

Tabla: analytics_events

Evento crudo de producto. Campos:

● id

● user_type

● user_id

● child_profile_id nullable

● event_name

● screen_name

● payload_json

● created_at

5. Eventos analíticos Adquisición / activación

● app_opened

● onboarding_parent_started

● onboarding_parent_completed

● consent_started

● consent_completed

● child_profile_created

● child_onboarding_started

● child_onboarding_completed

Core niño

● refuge_home_viewed

● need_selected

● mood_checkin_started

● mood_checkin_completed

● context_selected

● intensity_selected

● intervention_shown

● intervention_started

● intervention_completed

● helpful_response_selected

● support_request_started

● support_request_completed

● routine_night_started ● routine_night_completed

● personalization_opened

● companion_changed

● palette_changed

Retención

● session_day_1

● session_day_7

● session_day_30

● weekly_active_child

● weekly_active_parent

● streak_updated

● favorite_tool_saved

Padre

● parent_dashboard_viewed

● report_opened

● email_report_opened

● recommendation_clicked

● alert_opened

● alert_acknowledged

● alert_resolved

● parent_guides_viewed

Monetización

● paywall_viewed

● trial_started

● subscription_started

● annual_plan_selected

● churn_cancellation_started

● churn_reason_selected

Calidad / seguridad

● risk_rule_triggered

● false_positive_flagged_internal

● support_contact_initiated

● escalation_shown

● escalation_completed

6. Backlog V1 / V2 / V3 V1: MVP premium serio

Objetivo: demostrar uso real niño + valor claro para padre.

Niño

● onboarding

● compañero perro/gato

● 2 paletas ● home del refugio

● check-in guiado

● 5 contextos fuertes: casa, escuela, amigos, noche, no sé

● 12 herramientas rápidas

● módulo ayúdame a decirlo básico

● rutina de noche

● logros simples

● favoritos

Padre

● onboarding

● consentimiento

● configuración de alertas

● panel general

● reportes semanales

● recomendaciones base

● alertas low/medium/high

● centro de guía básico

Sistema

● reglas IA v1

● eventos analíticos

● correo semanal

● backoffice de contenido

● logs y auditoría

V2: producto fuerte

Objetivo: personalización real y mejor retención.

● perfil dinámico del niño

● recomendaciones parentales por estilo del niño

● más situaciones: vergüenza, cuerpo, conflictos familiares, regaños

● más herramientas

● más tipos de compañero

● sonidos ambiente

● módulo de historias

● mejor scoring de helpfulness

● reportes quincenales y mensuales

● multi-hijo

● nudges inteligentes

● testing A/B de home y misiones

V3: ecosistema

Objetivo: expansión y moat. ● red de especialistas aliados

● referrals

● dashboard profesional opcional

● panel escolar opcional

● paquetes temáticos: separación, miedo nocturno, autoestima, amigos

● comunidad / contenido premium para padres

● bundle familiar

● copiloto conversacional más rico, siempre con guardrails

● motor de pattern intelligence más fino

7. Prompts y reglas del motor IA

Aquí está el músculo. Pero ojo: IA como copiloto, no como terapeuta.

Motores necesarios Motor A: Clasificación emocional

Entrada:

● emoción elegida

● contexto

● intensidad

● wants_to_talk

● historial reciente

Salida:

● categoría primaria

● categoría secundaria

● nivel de carga

● intervención sugerida

● share_level

● risk_score

Motor B: Recomendador infantil

Entrada:

● categoría emocional

● hora del día

● edad

● perfil de respuesta del niño

● herramientas que antes sí ayudaron

Salida:

● herramienta exacta

● duración sugerida

● tono

● si mostrar historia, misión o guía directa

Motor C: Resumen parental

Entrada:

● check-ins agregados ● intervenciones

● horarios

● cambios de patrón

● alertas disparadas

● perfil del niño

Salida:

● resumen semanal

● 3 recomendaciones

● 1 conversación sugerida

● 1 watchout

Motor D: Seguridad

Primero reglas, luego IA. Entrada:

● patrones de intensidad

● frecuencia

● tags

● texto corto si existe

● support requests

● eventos previos

Salida:

● no alert

● alert low

● alert medium

● alert high

● alert critical

● guidance exacta

Prompt base: clasificador emocional

“Eres un motor de clasificación emocional infantil para niños de 8 a 12 años. No diagnostiques ni uses lenguaje clínico. Clasifica la entrada en categorías emocionales y contextuales simples. Prioriza seguridad, claridad y utilidad inmediata. Devuelve JSON con:

emotion_primary, emotion_secondary, context_primary, intensity_band, suggested_intervention_type, share_level, risk_level, confidence.”

Prompt base: recomendador infantil

“Eres un motor de intervención breve para niños de 8 a 12 años. Tu objetivo es recomendar una herramienta corta, calmada, clara y útil. No uses lenguaje médico, no moralices, no asustes. La recomendación debe poder completarse en 20 segundos, 1 minuto o 2 minutos. Devuelve JSON con:

title, intervention_type, tone, estimated_duration, steps_short, followup_question.”

Prompt base: resumen parental

“Eres un copiloto de acompañamiento parental. Resume patrones emocionales de un niño sin diagnosticar ni usar lenguaje alarmista. Entrega observaciones prácticas y sugerencias concretas. No compartas detalles íntimos textuales. Tu salida debe incluir:

weekly_summary, patterns_detected, top_contexts, suggested_conversation, what_to_avoid, recommended_parent_action, escalation_flag.”

Prompt base: recomendación parental contextual

“Genera una recomendación breve para padre o madre según el perfil del niño. Habla en tono claro, cálido y ejecutivo. No culpes al padre. No diagnostiques. Explica cómo abrir conversación, qué tono usar y qué evitar.”

Reglas del motor IA Lo que la IA sí puede hacer

● clasificar

● priorizar

● resumir

● sugerir herramientas

● recomendar preguntas

● adaptar tono

● detectar persistencia de patrones

Lo que la IA no puede hacer

● diagnosticar

● decir “tu hijo tiene…”

● prometer prevención de trastornos

● dar consejo médico o psiquiátrico

● inferir abuso o trauma como hecho consumado

● reemplazar criterio humano en alerta crítica

Guardrails

● salida siempre estructurada

● lenguaje no clínico

● bloqueo de claims diagnósticos

● capa de reglas antes de LLM para alertas

● PII redacted hacia proveedor IA

● logs auditables

● thresholds configurables

8. Definición exacta de alertas

Aquí hay que ser finas. No queremos una app histérica.

Niveles Alert Low

Señal suave. No urgente. Triggers:

● aumento leve sostenido de frustración o tristeza ● más uso de herramientas nocturnas

● evitación repetida de “quiero hablar”

● varios check-ins de “no sé qué me pasa”

Acción:

● aparece en panel

● entra al correo semanal

● recomendación ligera al padre

Alert Medium

Patrón claro que conviene abordar pronto. Triggers:

● 3 o más check-ins intensos en 7 días en mismo contexto

● repetición de miedo nocturno fuerte

● evitación persistente + baja respuesta a herramientas

● incremento claro de vergüenza / aislamiento / conflicto familiar

Acción:

● push o correo prioritario al padre

● recomendación específica de conversación

● sugerencia de observar próximos días

Alert High

Riesgo importante, no necesariamente crítico, pero sí de atención pronta. Triggers:

● múltiples eventos intensos en 72 horas

● solicitud explícita recurrente de ayuda

● patrón fuerte de desesperanza o miedo severo

● deterioro visible del uso y alto distress combinado

Acción:

● notificación directa

● panel exige acknowledgement

● recomendaciones claras

● sugerencia fuerte de apoyo humano/profesional

Alert Critical

Solo para lo serio. Triggers:

● lenguaje o patrón de daño a sí mismo o a otros

● miedo extremo persistente con señales fuertes

● petición explícita de ayuda urgente

● combinación de alta intensidad + repetición + señales críticas

Acción:

● aviso inmediato al padre/tutor

● bloqueo de respuestas suaves

● pantalla de seguridad

● recursos humanos/profesionales inmediatos ● log interno prioritario

9. Definición exacta de correos Correo semanal estándar

Asunto tipo:

● Resumen semanal de [Nombre del niño]

● Tendencias emocionales de esta semana

● Señales y recomendaciones para acompañar mejor

Secciones:

1. estado general 2. cambios frente a semana previa 3. contextos más sensibles 4. herramientas que sí usó 5. sugerencia de conversación 6. recomendación para casa 7. watchout suave si aplica

Correo de alerta medium

Asunto:

● Conviene revisar algo esta semana con [Nombre]

● Se detectó un cambio de patrón que vale la pena acompañar

Secciones:

● qué cambió

● por qué importa

● cómo abordarlo

● qué evitar

● cuándo revisar de nuevo

Correo de alerta high/critical

Asunto:

● Atención importante sobre [Nombre]

● Hay una señal que requiere acompañamiento hoy

Secciones:

● resumen claro

● no alarmista pero directo

● qué hacer ahorita

● a quién acudir

● recursos

10. Definición exacta del panel parental Home

Widgets:

● semáforo general

● variación semanal

● top 3 temas ● alerta activa si existe

● recomendación de la semana

● acceso a guías

Vista de tendencias

Gráficas:

● emociones por semana

● intensidad promedio

● distribución por contexto

● horario sensible

● uso de herramientas

● tendencia de apertura o evitación

Vista de acompañamiento

● perfil de respuesta del niño

● estilo sugerido para hablarle

● frases sugeridas

● errores comunes a evitar

Vista de alertas

● abierta

● atendida

● resuelta

● historial

● severidad

● recomendación

Vista de reportes

● semanal

● mensual

● comparativa

● exportable en futuro

11. Dirección visual y paletas

No te voy a imponer la paleta, pero sí te voy a dar el marco correcto para elegirla.

Qué evitar

● rojo primario duro

● azul eléctrico chillón

● amarillo escolar

● combinaciones RGB tipo juguetería

● saturación excesiva

● demasiados elementos contrastantes

Qué buscar

● sensación de refugio

● profundidad blanda ● contraste limpio

● acentos seguros

● luz calmada

● textura atmosférica

● colores que acompañen sin adormecer

Dos familias visuales que sí exploraría Familia A: “Refugio cielo”

● base fría-suave

● niebla / nube / luna / agua ligera

● ideal para niños sensibles, noche, calma, confianza

Familia B: “Refugio bosque”

● base orgánica-terrosa-suave

● musgo, salvia, piedra, crema, arcilla apagada

● ideal para seguridad, cuerpo, arraigo, estabilidad

Compañeros

Perrito o gatito, sí.

Pero no caricatura boba. Más bien:

● suave

● redondeado

● amable

● silencioso

● protector

● con expresiones sutiles

Tipografía Para niños 8-12 y padres, yo pondría dos capas: UI principal

Sans redondeada, legible, moderna, cálida.

Toques de identidad

Una secundaria suave para títulos, pero nunca infantilona exagerada. Necesitamos legibilidad primero, abrazo visual después.

12. Lo que le mandaría al equipo como tesis final de desarrollo Producto

App premium de inteligencia emocional infantil para 8 a 12 años con panel parental de señales tempranas, tendencias y recomendaciones prácticas.

UX

Interacción guiada por botones, tarjetas, rutas cortas y misiones emocionales. No chat abierto como base.

No escritura larga como patrón principal.

Diseño

Atmósfera de refugio emocional premium. Nada de colores de kinder.

Paletas suaves, profundidad blanda, compañeros cálidos, interfaz serena.

IA

Clasifica, resume, recomienda y prioriza. No diagnostica.

No reemplaza humano.

No da consejo clínico.

Datos

Separación estricta entre capa infantil, capa parental y capa de seguridad. Padre ve tendencias, no diarios completos.

Alertas por niveles.

Backlog

V1 premium serio.

V2 personalización profunda. V3 ecosistema.

Meta

Que el niño diga: “me gusta entrar aquí”.

Que el padre diga: “esto me ayudó a ver algo a tiempo”.