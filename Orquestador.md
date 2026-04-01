Groq para clasificación rápida, barata y masiva de eventos y para tareas de primer pase.
OpenAI para salidas estructuradas, resumen parental final y redacción controlada de recomendaciones y reportes. OpenAI soporta salidas estructuradas con JSON schema.
Anthropic como segunda capa de validación editorial y de seguridad en casos medium/high/critical o cuando el texto para padres necesite un pase extra de tono, guardrails y consistencia. Anthropic documenta tool use y soporte de structured outputs en modelos compatibles.
Groq también soporta structured outputs y expone API OpenAI-compatible, lo cual te simplifica integración y fallback.

Con eso, el criterio ejecutivo queda así:
reglas deterministas mandan, Groq clasifica, OpenAI redacta y estructura, Anthropic audita y afina.
Nunca permitas que un LLM por sí solo dispare una alerta crítica. Eso ya va totalmente alineado con tu manifiesto.

Pégale esto tal cual a Copilot:

# DOCUMENTO ORQUESTADOR
# Motor de analítica, alertas, reportes parentales e IA
# Proyecto: sistema premium de inteligencia emocional infantil 8–12

## 1. Objetivo del documento
Definir la lógica central del sistema para:
1. capturar y normalizar eventos emocionales del niño
2. convertir eventos en métricas útiles
3. determinar alertas por severidad con reglas duras
4. generar reportes parentales periódicos
5. orquestar el uso de OpenAI, Anthropic y Groq sin sobreingeniería
6. mantener privacidad, trazabilidad y lenguaje no clínico

Este documento es el contrato de backend + IA + analítica.
Nada de aquí debe romper los principios del producto:
- niño acompañado, no vigilado
- padre informado, no paranoico
- IA útil, no clínica
- reglas antes que narrativa
- tendencias antes que detalle íntimo

---

## 2. Principios no negociables
1. Ningún LLM puede diagnosticar.
2. Ningún LLM puede escalar a CRITICAL por sí solo.
3. HIGH y CRITICAL solo nacen por reglas duras o por reglas duras + confirmación de seguridad.
4. El padre ve tendencias, contextos, cambios, recomendaciones y alertas relevantes.
5. El padre NO ve diarios completos, transcripciones literales ni detalle lineal de cada sesión.
6. Todo texto enviado a IA externa debe ir redactado y minimizado.
7. Los reportes deben ser accionables, no decorativos.
8. El sistema debe funcionar aunque un proveedor de IA falle.
9. Todas las decisiones de riesgo deben quedar auditadas.
10. El producto se mantiene en bienestar general y acompañamiento, no en claims clínicos.

---

## 3. Arquitectura general del motor
Se implementarán 6 capas:

### Capa 0. Captura de eventos
Entradas:
- mood_checkins
- session_interventions
- support_requests
- helpful_response_selected
- action_selected
- action_completed
- action_skipped
- routine_night_started/completed
- parent settings
- child_context

### Capa 1. Normalización y feature extraction
Convierte eventos crudos en features estructurados:
- emoción primaria
- emoción secundaria
- intensidad 0–100
- contexto
- persona relacionada
- intención de hablar
- evitación
- herramienta usada
- helpfulness
- franja horaria
- repetición por cluster

### Capa 2. Métricas cuantitativas deterministas
Calcula scores diarios y por ventana:
- Emotional Load Score (ELS)
- Relationship Emotional Weight (REW)
- Context Pressure Score (CPS)
- Intensity Trend Index (ITI)
- Recovery Speed Score (RSS)
- Communication Intent Score (CIS)
- Suppression Index (SI)
- Emotional Volatility Index (EVI)
- Trust Distribution Map (TDM)
- Help Utility Score (HUS)

### Capa 3. Motor de riesgo y alertas
Reglas duras con thresholds configurables.
Salida:
- no_alert
- low
- medium
- high
- critical

### Capa 4. Motor LLM
Submotores:
- clasificación enriquecida
- recomendación infantil
- resumen parental
- recomendación parental contextual
- auditoría editorial y seguridad

### Capa 5. Distribución
- panel parental
- correo programado semanal/quincenal/mensual
- push para alertas
- backoffice interno
- logs de auditoría

---

## 4. Orquestación por proveedor IA

### Groq = Motor de primer pase y volumen
Usar Groq para:
- clasificación rápida de check-ins
- enriquecimiento estructurado barato
- sugerencia inicial de intervención
- batch processing nocturno de eventos
- fallback para tareas simples de JSON estructurado

Razón:
- menor costo por tarea operativa
- menor latencia
- ideal para alto volumen de clasificación repetitiva

### OpenAI = Motor principal de reportes y salidas estructuradas
Usar OpenAI para:
- resumen parental final
- redacción de recomendaciones para padres
- generación de mensaje “ayúdame a decirlo”
- explicación estructurada para panel parental
- generación del JSON final de reportes

Razón:
- mejor desempeño esperado en redacción controlada, consistencia de formato y salidas estructuradas
- debe usarse con JSON schema estricto

### Anthropic = Validador editorial y capa de seguridad
Usar Anthropic para:
- segunda opinión en casos borderline medium/high
- auditoría del texto final para padres
- revisión de tono no alarmista
- validación de que no haya lenguaje clínico o culpabilizante
- fallback de resumen parental si OpenAI falla

Razón:
- capa de calidad y guardrail
- no usar Anthropic para todo; solo para decisiones sensibles o refinamiento final

### Regla de negocio de routing
1. evento entra
2. reglas duras calculan riesgo preliminar
3. Groq clasifica y enriquece
4. si caso normal => OpenAI genera recomendación o resumen
5. si caso medium/high borderline => Anthropic valida texto y seguridad
6. si critical por regla dura => se dispara alerta de inmediato y Anthropic solo redacta guidance posterior, nunca bloquea la notificación

---

## 5. Modelo de datos mínimo para la capa analítica

### Tabla event_features
Campos:
- id
- child_profile_id
- source_event_id
- source_type
- occurred_at
- emotion_primary
- emotion_secondary
- intensity
- context_primary
- person_id nullable
- wants_to_talk boolean
- wants_only_help boolean
- action_type nullable
- helpful_score nullable
- cluster_key
- day_bucket
- week_bucket
- month_bucket
- created_at

### Tabla daily_metrics
Campos:
- id
- child_profile_id
- metric_date
- els
- rew_top_person_json
- cps_top_context_json
- iti
- rss
- cis
- si
- evi
- tdm_json
- hus_json
- event_count
- avg_intensity
- support_request_count
- night_event_count
- no_talk_count
- no_idea_count
- updated_at

### Tabla report_jobs
Campos:
- id
- child_profile_id
- cadence_type enum(weekly, biweekly, monthly)
- next_run_at
- last_run_at
- status
- period_start
- period_end
- report_id nullable

### Tabla ai_audit_logs
Campos:
- id
- child_profile_id
- engine_type
- provider
- model
- input_hash
- output_json
- risk_level_before
- risk_level_after
- validation_status
- created_at

---

## 6. Features y clusters base

### cluster_key
Construir un cluster_key así:
emotion_primary + context_primary + person_id_or_none + time_band

Ejemplo:
frustration|school|teacher|afternoon

Esto servirá para detectar repetición real.

### time_band
- early_morning
- morning
- afternoon
- evening
- night

### flags operativas
- is_night_distress
- is_avoidance
- is_support_request
- is_high_intensity
- is_low_helpfulness
- is_repeat_cluster
- is_no_idea_pattern
- is_sensitive_family_context

---

## 7. Cálculo exacto de métricas

## 7.1 Emotional Load Score (ELS)
Objetivo:
medir carga emocional agregada en escala 0–100.

Inputs:
- event_count_window
- avg_intensity_window
- repeat_cluster_ratio
- suppression_index
- volatility_index

Fórmula:
ELS = round(
  0.30 * freq_score +
  0.30 * avg_intensity_window +
  0.20 * repeat_score +
  0.10 * suppression_index +
  0.10 * volatility_index
)

Definiciones:
- freq_score:
  - 0 eventos = 0
  - 1 evento = 20
  - 2–3 eventos = 40
  - 4–5 eventos = 60
  - 6–7 eventos = 80
  - >=8 eventos = 100

- repeat_score:
  porcentaje de eventos que pertenecen al cluster dominante * 100

Interpretación:
- 0–24 bajo
- 25–49 leve
- 50–69 moderado
- 70–84 alto
- 85–100 muy alto

## 7.2 Relationship Emotional Weight (REW)
Objetivo:
medir carga emocional asociada a cada persona.

Para cada person_id:
REW_person = round(
  0.40 * normalized_event_share +
  0.35 * avg_intensity_with_person +
  0.25 * repeat_ratio_with_person
)

Salida:
top 3 personas con mayor peso emocional del periodo.

## 7.3 Context Pressure Score (CPS)
Objetivo:
medir presión emocional por contexto.

Para cada contexto:
CPS_context = round(
  0.45 * normalized_event_share +
  0.35 * avg_intensity_in_context +
  0.20 * repeat_ratio_in_context
)

Salida:
top 3 contextos críticos.

## 7.4 Intensity Trend Index (ITI)
Objetivo:
comparar intensidad del periodo actual vs periodo previo igual.

Fórmula:
ITI = current_avg_intensity - previous_avg_intensity

Bandas:
- <= -10 mejora clara
- -9 a +9 estable
- +10 a +19 subiendo
- >= +20 escalamiento importante

## 7.5 Suppression Index (SI)
Objetivo:
medir evitación.

Conteo de eventos donde:
- wants_to_talk = false
- action_type = none
- action_type = save_only
- helpful_score es nulo y no hubo intervención completada

Fórmula:
SI = round((avoidance_events / total_events) * 100)

## 7.6 Communication Intent Score (CIS)
Objetivo:
medir disposición a comunicar.

Fórmula:
CIS = round(
  (
    talk_events * 1.0 +
    support_requests * 1.2 +
    message_to_person_events * 1.1
  )
  /
  max(total_events,1)
  * 100
)

Cap a 100.

## 7.7 Emotional Volatility Index (EVI)
Objetivo:
medir inestabilidad de emoción/intensidad.

Inputs:
- average absolute delta between consecutive intensities
- count of primary emotion switches

Fórmula:
EVI = min(
  100,
  round((avg_intensity_delta * 0.8) + (emotion_switch_count * 8))
)

## 7.8 Recovery Speed Score (RSS)
Objetivo:
medir qué tan rápido recupera regulación.

Inputs:
- tiempo entre evento de intensidad >= 60 y primer cierre helpful_score >= 70
- o primer registro posterior con intensidad <= 35

Bandas:
- <= 30 min = 90
- 31–120 min = 70
- 121–360 min = 50
- >360 min = 30
- sin dato = null

RSS en V1 es informativo, no crítico para alertas.

## 7.9 Trust Distribution Map (TDM)
Objetivo:
mapear a quién sí recurre y con quién asocia calma o carga.

Construcción:
- share of support_requests by person
- share of message_to_person by person
- share of distress events by person
- share of calm-associated events by person

Salida JSON:
[
  {
    person_id,
    trust_score,
    distress_association_score,
    calm_association_score
  }
]

## 7.10 Help Utility Score (HUS)
Objetivo:
medir qué herramientas sí sirven.

Para cada intervention_slug:
HUS_tool = round(
  0.50 * avg_helpful_score +
  0.30 * completion_rate +
  0.20 * repeated_use_after_positive_outcome
)

---

## 8. Algoritmo exacto de alertas

## Regla madre
Una sola emoción aislada NO genera alerta.
Patrón + intensidad + repetición + evitación sí.

## 8.1 LOW
Disparar LOW si se cumple cualquiera:
1. ELS entre 45 y 59 en ventana 7d
2. SI >= 50 en ventana 7d
3. 3 o más eventos “no sé qué me pasa” en 7d
4. aumento de eventos nocturnos >= 2 vs periodo previo
5. cluster dominante repetido 3 veces con intensidad promedio >= 50 en 7d

Acción:
- mostrar en panel
- incluir en reporte periódico
- generar recomendación ligera
- no push inmediato

## 8.2 MEDIUM
Disparar MEDIUM si se cumple cualquiera:
1. 3 o más eventos con intensidad >= 65 en mismo contexto en 7d
2. miedo nocturno fuerte repetido 2+ veces en 7d
3. SI >= 65 y HUS promedio < 50 en 7d
4. incremento de vergüenza / aislamiento / conflicto familiar >= 40% vs periodo previo
5. 2 support_requests en 7d sin resolución posterior útil

Acción:
- panel prioritario
- correo prioritario o push suave según configuración
- recomendación contextual específica
- abrir seguimiento de observación 72h

## 8.3 HIGH
Disparar HIGH si se cumple cualquiera:
1. 3 o más eventos con intensidad >= 80 en 72h
2. 2 o más support_requests explícitos en 72h
3. ELS >= 75 y SI >= 70 en 7d
4. patrón fuerte de miedo severo o desesperanza no clínica:
   - cluster dominante 4+ veces
   - intensidad promedio >= 75
   - helpfulness promedio < 40
5. caída brusca de uso útil:
   - venía usando herramientas útiles y de pronto deja de usarlas
   - combinado con distress alto

Acción:
- push directo al padre/tutor
- panel exige acknowledgement
- recomendación de acción clara hoy
- sugerir apoyo humano/profesional
- Anthropic revisa copy final, pero NO bloquea el disparo

## 8.4 CRITICAL
CRITICAL solo por regla dura, no por LLM.

Disparar CRITICAL si se cumple cualquiera:
1. free_text_short o support_request contiene lenguaje explícito de daño a sí mismo o a otros
2. petición explícita de ayuda urgente
3. combinación de:
   - intensidad >= 90
   - repetición >= 3 en 48h
   - SI >= 80
   - support_request presente
4. miedo extremo persistente con deterioro fuerte y petición de ayuda inmediata

Acción:
- notificación inmediata al padre/tutor
- bloqueo de respuestas suaves
- pantalla de seguridad
- recursos humanos/profesionales
- log prioritario
- backoffice flag

## Regla de precedencia
critical > high > medium > low > no_alert

## Regla de consolidación
Solo una alerta activa por child_profile_id + cluster_familiar por ventana.
No duplicar spam.
Actualizar severidad si empeora.

---

## 9. Qué sí se reporta a padres
Reportar:
- estado general del periodo
- cambios vs periodo anterior
- emociones principales
- contextos principales
- personas con más peso emocional
- horarios sensibles
- herramientas que sí ayudaron
- tendencia de apertura o evitación
- recomendación concreta
- conversación sugerida
- qué evitar
- watchout si aplica
- alerta si aplica

No reportar:
- textos literales completos
- diarios completos
- detalle sesión por sesión
- interpretaciones diagnósticas
- inferencias clínicas

---

## 10. Cadencias de reporte

## 10.1 Weekly
Ventana:
últimos 7 días comparados contra 7 días previos.

Uso:
default para usuarios activos.

## 10.2 Biweekly
Ventana:
últimos 15 días comparados contra 15 días previos.

Uso:
padres que quieren menos ruido y más patrón.

## 10.3 Monthly
Ventana:
últimos 30 días comparados contra 30 días previos.

Uso:
visión ejecutiva y evolución más estable.

## Regla de envío
El sistema debe revisar diario si child_profile_id tiene reporte pendiente por cadence_type.
Si hoy >= next_run_at:
- compilar métricas
- generar summary_json
- validar
- guardar parent_reports
- enviar correo
- actualizar next_run_at

---

## 11. Algoritmo de generación de reportes parentales

### Paso 1. Agregación determinista
Construir dataset agregado del periodo:
- total_events
- avg_intensity
- top_emotions
- top_contexts
- top_people
- top_time_bands
- SI, CIS, ELS, EVI, RSS
- top_helpful_tools
- trend_vs_previous
- active_alerts
- child_profile_style
- parent_context_flags

### Paso 2. Risk framing
Definir:
- sentiment_band = stable | watch | rising | urgent
- escalation_flag = boolean
- watchout_type nullable

### Paso 3. LLM summary
Enviar SOLO datos agregados y redactados.
No mandar raw journal.
No mandar PII innecesaria.

### Paso 4. Validation
Validar que el JSON regrese completo.
Validar:
- sin lenguaje clínico
- sin culpabilizar
- sin frases absolutas
- sin claims diagnósticos

### Paso 5. Delivery
Guardar report_json, renderizar correo y panel.

---

## 12. JSON final requerido para cada reporte parental

```json
{
  "report_type": "weekly|biweekly|monthly",
  "period_start": "ISO_DATE",
  "period_end": "ISO_DATE",
  "state_band": "stable|watch|rising|urgent",
  "headline": "string",
  "weekly_summary": "string",
  "patterns_detected": [
    {
      "pattern_type": "emotion|context|person|time|avoidance|tool",
      "label": "string",
      "change": "up|down|stable",
      "strength": 0
    }
  ],
  "top_emotions": [
    { "emotion": "string", "share": 0, "avg_intensity": 0 }
  ],
  "top_contexts": [
    { "context": "string", "share": 0, "avg_intensity": 0 }
  ],
  "top_people": [
    { "person_label": "string", "weight": 0, "avg_intensity": 0 }
  ],
  "sensitive_time_bands": [
    { "time_band": "string", "share": 0 }
  ],
  "helpful_tools": [
    { "tool": "string", "utility_score": 0 }
  ],
  "avoidance_signals": {
    "suppression_index": 0,
    "communication_intent_score": 0,
    "note": "string"
  },
  "conversation_suggestion": "string",
  "what_to_avoid": [
    "string"
  ],
  "recommended_parent_action": [
    "string"
  ],
  "watchout": "string",
  "alert_summary": {
    "has_alert": false,
    "severity": "none|low|medium|high|critical",
    "summary": "string",
    "recommended_action": "string"
  }
}
13. Prompts por motor
13.1 Groq - Clasificación enriquecida

System:
Eres un motor de clasificación emocional infantil. No diagnostiques. No uses lenguaje clínico. Devuelve solo JSON válido.

User payload:

emotion_primary
intensity
context_primary
person_label nullable
wants_to_talk
action_type nullable
recent_cluster_summary
helpful_history_summary

Output JSON:
{
"emotion_primary_normalized": "",
"emotion_secondary_candidate": "",
"distress_band": "low|mid|high",
"pattern_hint": "",
"suggested_intervention_type": "",
"share_level": "private|summary|alert_candidate",
"confidence": 0
}

13.2 OpenAI - Resumen parental

System:
Eres un copiloto de acompañamiento parental. Resume patrones emocionales de un niño sin diagnosticar ni usar lenguaje alarmista. No compartas detalles íntimos textuales. Habla claro, cálido y ejecutivo. Devuelve solo JSON bajo el schema exigido.

Input:

aggregated_metrics_json
trend_vs_previous_json
child_profile_style_json
active_alerts_json
parent_context_json
13.3 Anthropic - Auditoría editorial

System:
Eres un validador editorial y de seguridad para reportes parentales de bienestar emocional infantil. No diagnostiques. No uses lenguaje clínico. Revisa si el texto:

culpa al padre
invade privacidad
suena alarmista
contiene claims diagnósticos
recomienda acciones demasiado duras o inapropiadas

Devuelve JSON:
{
"approved": true,
"risk_flags": [],
"tone_flags": [],
"needs_rewrite": false,
"rewrite_instructions": []
}

14. Flujo operacional completo
Evento de check-in
guardar evento crudo
generar event_features
correr reglas duras preliminares
llamar Groq para clasificación enriquecida
recalcular métricas rolling 24h / 7d / 30d
evaluar alertas
si no hay alerta grave:
recomendar intervención
si hay low/medium/high/critical:
persistir alerta
notificar según severidad
Job nocturno

Hora sugerida: 02:00 local del padre

recalcular daily_metrics del día anterior
consolidar clusters
actualizar vistas materializadas
refrescar recomendaciones activas
marcar report jobs próximos
Job de envío de reportes

Hora sugerida: 07:30 local del padre

detectar report_jobs vencidos
construir aggregated_metrics_json
OpenAI genera reporte estructurado
Anthropic audita si:
hay medium/high/critical
o el reporte contiene watchout importante
guardar parent_reports
enviar por Resend
registrar analytics + delivery status
15. Pseudocódigo de alertas
function computeAlertSeverity(features, metrics, previousMetrics): AlertSeverity {
  if (hasCriticalHardSignal(features, metrics)) return "critical";

  if (
    countHighIntensityEvents(72) >= 3 ||
    countSupportRequests(72) >= 2 ||
    (metrics.els >= 75 && metrics.si >= 70) ||
    severeRepeatedFearPattern(metrics)
  ) return "high";

  if (
    repeatedContextPattern(7, 3, 65) ||
    repeatedNightFear(7, 2) ||
    (metrics.si >= 65 && averageHelpfulness(7) < 50) ||
    familyConflictJump(previousMetrics, metrics) >= 40
  ) return "medium";

  if (
    (metrics.els >= 45 && metrics.els <= 59) ||
    metrics.si >= 50 ||
    countNoIdeaEvents(7) >= 3 ||
    nightEventsIncrease(previousMetrics, metrics) >= 2 ||
    dominantClusterRepeats(7) >= 3
  ) return "low";

  return "no_alert";
}
16. Pseudocódigo de reportes
async function generateParentReport(childId: string, cadence: "weekly"|"biweekly"|"monthly") {
  const period = getPeriodWindow(cadence);
  const previousPeriod = getPreviousEquivalentWindow(cadence);

  const aggregate = await buildAggregateMetrics(childId, period, previousPeriod);
  const preliminaryStateBand = deriveStateBand(aggregate);

  const openAiReport = await generateStructuredReportWithOpenAI(aggregate);

  let finalReport = openAiReport;

  if (aggregate.alertSeverity === "medium" || aggregate.alertSeverity === "high" || aggregate.alertSeverity === "critical") {
    const audit = await validateWithAnthropic(openAiReport, aggregate);
    finalReport = audit.approved ? openAiReport : await rewriteWithOpenAI(openAiReport, audit.rewrite_instructions);
  }

  await saveParentReport(childId, cadence, period, finalReport);
  await sendReportEmail(childId, finalReport);
}
17. Qué debe ver el panel parental
Home
semáforo general
variación vs periodo previo
top 3 temas
alerta activa si existe
recomendación de la semana
acceso a guía
Tendencias
emociones por tiempo
intensidad promedio
distribución por contexto
horario sensible
apertura vs evitación
herramientas que sí ayudan
Acompañamiento
perfil de respuesta del niño
cómo abordarlo
qué decir
qué evitar
conversación sugerida
Alertas
open
acknowledged
resolved
historial
severidad
recommended_action
Reportes
weekly / biweekly / monthly
comparativa contra periodo previo
exportable en futuro
18. Guardrails de privacidad y seguridad
redacción de PII antes de enviar a cualquier LLM
free_text_short solo sale a proveedor si pasa por sanitizer
jamás enviar nombre completo del niño
jamás enviar diarios completos
jamás guardar prompt con PII cruda
logs con hashes, no payloads sensibles completos
alertas critical deben dejar huella de auditoría
métricas deben poder recalcularse sin depender del LLM
19. Observabilidad y QA

Registrar:

provider usado
latencia
tokens
validación JSON pass/fail
porcentaje de fallback
falsos positivos
falsos negativos
alertas acknowledged
apertura de reportes
clic en recomendaciones
utilidad marcada por padres

Crear evaluaciones internas:

50 casos sintéticos low
50 medium
50 high
50 critical
50 reportes con feedback esperado

Objetivo:

cero diagnósticos
cero fuga de detalles íntimos
alta consistencia estructural
alta utilidad práctica
20. Implementación por fases
V1
reglas duras
Groq para clasificación
OpenAI para reportes y recomendaciones
Anthropic solo en auditoría de medium/high/critical
reportes weekly
alertas low/medium/high/critical
panel básico
logs completos
V2
biweekly y monthly
perfil dinámico del niño
recomendación parental más fina
calibración por cohortes
HUS y RSS mejorados
explainability interna por regla disparada
V3
ensemble scoring más sofisticado
revisión humana asistida en casos críticos
panel profesional opcional
exportables
aprendizaje calibrado con feedback real
21. Instrucción final de desarrollo

Construir este motor como sistema híbrido:

analytics y alerting determinista en backend
LLM solo para clasificación complementaria, copy y resumen
reglas primero, lenguaje después
privacidad primero, personalización después
nunca depender de un solo proveedor
todo configurable por feature flags y thresholds