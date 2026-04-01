# FASES DUNYO
## Tabla de avance del proyecto — actualizar día a día

**Última actualización:** 1 de abril de 2026 — v1.6 (Módulo Mi Día integrado como core — agenda emocional visual táctil)
**Etapa activa:** Fase 2 + Fase 3 en curso

---

## RESUMEN GENERAL DE FASES

| Fase | Nombre | Estado | Inicio | Cierre estimado |
|------|--------|--------|--------|-----------------|
| 0 | Concepto y fundamentos | En curso | Abr 2026 | — |
| 1 | Diseño, arquitectura base e infraestructura fundacional | En curso | Abr 2026 | — |
| 2 | Desarrollo MVP niño | En curso | Abr 2026 | — |
| 3 | Desarrollo MVP padre | En curso | Abr 2026 | — |
| 4 | IA aplicada, scoring avanzado y reportes inteligentes | Pendiente | — | — |
| 5 | QA, seguridad y legal | Pendiente | — | — |
| 5.5 | Alpha interna / dogfooding | Pendiente | — | — |
| 6 | Beta privada | Pendiente | — | — |
| 7 | Lanzamiento V1 | Pendiente | — | — |

---

## FASE 0 — CONCEPTO Y FUNDAMENTOS

| # | Tarea | Estado | Responsable | Fecha | Notas |
|---|-------|--------|-------------|-------|-------|
| 0.1 | Tesis ejecutiva del negocio | Completado | — | Abr 2026 | Documento Tesis Dunyo.md |
| 0.2 | Manifiesto del producto | Completado | — | Abr 2026 | Documento Manifiesto Dunyo.md |
| 0.3 | Dirección de producto y experiencia | Completado | — | Abr 2026 | Documento Direccion de Producto.md |
| 0.4 | Sistema emocional y métricas | Completado | — | Abr 2026 | Documento Proyecto Sistema Emocional.md |
| 0.5 | Orquestador de IA y analítica | Completado | — | Abr 2026 | Documento Orquestador.md |
| 0.6 | Paleta de colores OFICIAL | Completado | — | Abr 2026 | 5 colores, ver Notas Importantes.md |
| 0.7 | Tipografía oficial | Completado | — | Abr 2026 | Cocomat Pro Regular, archivos en carpeta |
| 0.8 | Reglas duras de diseño documentadas | Completado | — | Abr 2026 | Ver Notas Importantes.md |
| 0.9 | Aprobación del concepto por director | Pendiente | Director | — | — |
| 0.10 | Definición de stack nativo (iOS/Android) | Pendiente | — | — | — |
| 0.11 | Definición del equipo de desarrollo | Pendiente | — | — | — |

---

## FASE 1 — DISEÑO, ARQUITECTURA BASE E INFRAESTRUCTURA FUNDACIONAL

> **NOTA CRÍTICA:** La infraestructura analítica base, event logging, tablas, jobs y reglas duras arrancan aquí. No en Fase 4. La Fase 4 es maduración de IA, no inicio del motor.

### Diseño

| # | Tarea | Estado | Responsable | Fecha | Notas |
|---|-------|--------|-------------|-------|-------|
| 1.1 | Sistema de diseño base (componentes) | Pendiente | — | — | Neumorphism, paleta oficial, Cocomat Pro |
| 1.2 | Biblioteca de iconos propios | Pendiente | — | — | Sin emojis. Vectoriales, estilo suave |
| 1.3 | Tipografía complementaria para UI densa | Pendiente | — | — | Sans moderna si body/textos pequeños lo requieren |
| 1.4 | Wireframes app niño (core screens) | Pendiente | — | — | — |
| 1.5 | Wireframes panel padre (vistas core) | Pendiente | — | — | — |
| 1.6 | Prototipo navegable niño | Pendiente | — | — | — |
| 1.7 | Prototipo navegable padre | Pendiente | — | — | — |
| 1.8 | Aprobación de diseño por director | Pendiente | Director | — | — |

### Infraestructura fundacional (no mover a Fase 4)

| # | Tarea | Estado | Responsable | Fecha | Notas |
|---|-------|--------|-------------|-------|-------|
| 1.9 | Setup Supabase (proyecto, auth, RLS) | Completado | Copilot | 01 Abr 2026 | Proyecto en producción ixwfrgswtfrgfbnofhrs |
| 1.10 | Schema SQL inicial (tablas del Orquestador) | Completado | Copilot | 01 Abr 2026 | Migrations 001 y 002 ejecutadas — 13 tablas |
| 1.11 | Row Level Security configurado | Completado | Copilot | 01 Abr 2026 | RLS en todas las 13 tablas |
| 1.12 | Edge Functions base | Pendiente | — | — | — |
| 1.13 | Event logging base (mood_logged, intensity_changed, etc.) | Completado | Copilot | 01 Abr 2026 | auth_events + mood_checkins + session_interventions |
| 1.14 | Entornos dev / staging / prod | Pendiente | — | — | — |
| 1.15 | Secrets y variables de entorno seguras | Completado | Copilot | 01 Abr 2026 | .env con URL y anon key de Supabase |
| 1.16 | Resend configurado (correos parentales) | Pendiente | — | — | — |
| 1.17 | Expo / EAS configurado | Completado | Copilot | 01 Abr 2026 | Expo blank-typescript, scheme dunyo://, tz Mexico_City |
| 1.18 | Firebase configurado (error tracking — más adelante) | Pendiente | — | — | Sentry descartado. Firebase Crashlytics cuando se cree el proyecto en Google |
| 1.19 | PostHog o analytics base | Pendiente | — | — | Opcional, definir alcance |
| 1.20 | Arquitectura de backend y servicios documentada | Pendiente | — | — | — |
| 1.23 | Supabase Auth configurado (email+contraseña padre) | Completado | Copilot | 01 Abr 2026 | Site URL: dunyo.my · Redirect: dunyo://auth/callback |
| 1.24 | Tablas auth: users, child_profiles con campos de patrón | Completado | Copilot | 01 Abr 2026 | Migration 001 — child_profiles, child_context, parental_consents |
| 1.25 | RLS auth: padre solo ve sus hijos | Completado | Copilot | 01 Abr 2026 | Policies en child_profiles |
| 1.26 | Hash de patrón infantil (sin texto plano jamás) | Completado | Copilot | 01 Abr 2026 | SHA-256 con expo-crypto, solo el hash se guarda |
| 1.27 | Event logging de auth (12 eventos definidos en Manifiesto §12) | Completado | Copilot | 01 Abr 2026 | Tabla auth_events con trigger set_updated_at |
| 1.28 | Schema SQL: Migration 003 — tablas day_map_entries y day_map_people | Pendiente | — | — | Ver Manifiesto Módulo 11 §10. RLS por child_profile_id del padre |

### Legal

| # | Tarea | Estado | Responsable | Fecha | Notas |
|---|-------|--------|-------------|-------|-------|
| 1.21 | Revisión legal y COPPA inicial | Pendiente | — | — | Claims del producto, consentimiento, política |
| 1.22 | Definición de qué ve el padre vs qué permanece privado | Pendiente | — | — | Privacidad por capas documentada |

---

## FASE 2 — DESARROLLO MVP NIÑO

### Auth y acceso

| # | Tarea | Estado | Responsable | Fecha | Notas |
|---|-------|--------|-------------|-------|-------|
| 2.0.1 | Pantalla: Crear cuenta (padre) | Completado | Copilot | 01 Abr 2026 | PantallaCrearCuenta — email + contraseña + validaciones + logo Letrero_dunyo.png |
| 2.0.2 | Pantalla: Verificar correo | Pendiente | — | — | — |
| 2.0.3 | Pantalla: Crear perfil parental | Pendiente | — | — | — |
| 2.0.4 | Pantalla: Consentimiento COPPA | Pendiente | — | — | Obligatorio antes de datos del menor |
| 2.0.5 | Pantalla: Alta del niño | Completado | Copilot | 01 Abr 2026 | PantallaCrearHijo — crea child_profile, redirige a HomePadre (NO al patrón) |
| 2.0.6 | Pantalla: Login del padre | Completado | Copilot | 01 Abr 2026 | PantallaLoginPadre — email + contraseña + logo Letrero_dunyo.png |
| 2.0.7 | Pantalla: Selector de perfil del niño | Completado | Copilot | 01 Abr 2026 | PantallaSelectorPerfil — detecta primer acceso → SetupPatronNino si no tiene hash |
| 2.0.8 | Pantalla: Setup de patrón infantil | Completado | Copilot | 01 Abr 2026 | PantallaSetupPatronNino — EL NIÑO hace su patrón, no el padre. Cuadrícula 3x3 |
| 2.0.9 | Pantalla: Entrada por patrón (login niño) | Completado | Copilot | 01 Abr 2026 | PantallaAccesoNino — valida hash, rate limit en auth_events |
| 2.0.10 | Pantalla: Reset de patrón por padre | Completado | Copilot | 01 Abr 2026 | PantallaResetPatron — solo con sesión del padre |
| 2.0.11 | Pantalla: Cambiar patrón (niño recuerda el actual) | Pendiente | — | — | — |

### Onboarding y flujos principales

| # | Tarea | Estado | Responsable | Fecha | Notas |
|---|-------|--------|-------------|-------|-------|
| 2.1 | Onboarding del niño | Completado | Copilot | 01 Abr 2026 | PantallaOnboardingNino — 3 pasos, sin teclado, logo real, compañero por perfil |
| 2.2 | Explicación de privacidad en lenguaje infantil | Pendiente | — | — | Qué ven y qué no ven sus papás |
| 2.3 | Selección de compañero desde onboarding | Pendiente | — | — | Perro o gato |
| 2.4 | Selección de paleta y nombre del refugio desde onboarding | Pendiente | — | — | — |
| 2.5 | Home / Refugio del niño | Completado | Copilot | 01 Abr 2026 | PantallaHomeNino — gauge ELS real + check-in del día |
| 2.6 | Check-in emocional guiado | Completado | Copilot | 01 Abr 2026 | PantallaCheckin — 4 pasos, inserta en mood_checkins real |
| 2.7 | Selector de contexto | Completado | Copilot | 01 Abr 2026 | ContextPrimary: casa/escuela/afuera/coche/online/otro |
| 2.8 | Selector de personas importantes | Completado | Copilot | 01 Abr 2026 | Carga SafeAdult[] desde Supabase + opción Solo |
| 2.9 | Slider de intensidad (0-100) | Completado | Copilot | 01 Abr 2026 | Cuadrícula táctil 1-10 (sin dependencia nativa) |
| 2.10 | Opción "no sé, guíame" | Completado | Copilot | 01 Abr 2026 | Emoción "no_se" en EmotionPrimary + EMOCIONES_LIST |
| 2.11 | Botón "solo ayúdame" | Pendiente | — | — | Acceso rápido sin flujo completo |
| 2.12 | Botón "quiero hablar con alguien" | Pendiente | — | — | Activa protocolo de escalamiento |
| 2.13 | Cierre de helpfulness | Completado | Copilot | 01 Abr 2026 | Pregunta helpful_score en Calmarme y AyudameADecirlo — actualiza session_interventions |
| 2.14 | Módulo Calmarme | Completado | Copilot | 01 Abr 2026 | PantallaCalmarme — respiracion_478, ciclos 20s/1min/2min, guarda SessionIntervention |
| 2.15 | Módulo Desahogarme | Completado | Copilot | 01 Abr 2026 | PantallaDesahogarme — TextInput 280 chars, texto NO guardado (privacidad), helpful_score, intervention_slug: desahogo_texto |
| 2.16 | Módulo Pensar | Pendiente | — | — | — |
| 2.17 | Biblioteca de situaciones V1 | Pendiente | — | — | Casa, escuela, amigos, cuerpo, miedo, enojo |
| 2.18 | Kit de herramientas emocionales | Completado | Copilot | 01 Abr 2026 | Duraciones 20s/1min/2min implementadas en Calmarme |
| 2.19 | Módulo Ayúdame a decirlo | Completado | Copilot | 01 Abr 2026 | PantallaAyudameADecirlo — selección de frase, muestra al adulto, guarda SessionIntervention |
| 2.20 | Módulo Mi fuerza — logros simples | Pendiente | — | — | Cosas que sí pude, personas seguras |
| 2.21 | Módulo Mis ayudas / favoritos | Pendiente | — | — | Herramientas que le sirven más |
| 2.22 | Módulo Dormir / noche | Pendiente | — | — | Miedo nocturno, rutina de calma |
| 2.23 | Personalización del refugio | Pendiente | — | — | Compañero, paleta, fondo, sonidos, nombre |
| 2.24 | Tab bar y navegación principal | Completado | Copilot | 01 Abr 2026 | Navegadores raíz/auth/padre/niño conectados a AuthContext |
| 2.25 | Conectar todos los eventos al event_logging de Fase 1 | Completado | Copilot | 01 Abr 2026 | mood_checkins + session_interventions → event_features vía trigger |

### Módulo Mi Día — V1 (agenda emocional visual táctil)

> Módulo core oficial. Integrado como sistema principal de registro diario. Alimenta ELS, REW, CPS, SI, CIS, EVI, TDM.

| # | Tarea | Estado | Responsable | Fecha | Notas |
|---|-------|--------|-------------|-------|-------|
| 2.26 | Schema SQL: tablas day_map_entries y day_map_people | Pendiente | — | — | Migration 003 — ver §9 del brief oficial en Manifiesto |
| 2.27 | RLS: child_profile_id = auth padre, niño solo ve los suyos | Pendiente | — | — | — |
| 2.28 | Lib: insertar/leer day_map_entries desde Supabase | Pendiente | — | — | Funciones en src/lib/midia.ts |
| 2.29 | Pantalla: Mi Día — bloques temporales (mañana/escuela/tarde/noche) | Pendiente | — | — | PantallaMiDia.tsx — sin teclado, totalmente táctil |
| 2.30 | Componente: selector de emoción (tap/drag) dentro de bloque | Pendiente | — | — | 9 emociones: calma, tristeza, enojo, miedo, frustración, vergüenza, confusión, raro, no_se |
| 2.31 | Componente: selector de persona importante dentro de bloque | Pendiente | — | — | Carga SafeAdult[] desde Supabase + mamá/papá/hermano/amigo/maestro/otro |
| 2.32 | Componente: selector de contexto dentro de bloque | Pendiente | — | — | casa/escuela/cuarto/camino/digital/otro |
| 2.33 | Componente: selector de intensidad (leve/medio/fuerte/demasiado) | Pendiente | — | — | 4 niveles, sin slider, botones cápsula |
| 2.34 | Botón/tarjeta especial: "Hoy no quiero decir nada" | Pendiente | — | — | Guarda evento evitación suave. No alerta aislada. Sí alimenta SI si se repite |
| 2.35 | Guardar entradas por bloque del día en day_map_entries | Pendiente | — | — | child_profile_id + entry_date + day_slot + emotion + intensity + context + selected_no_talk |
| 2.36 | Historial visual simple — últimos 7 días en Mi Día | Pendiente | — | — | Vista de línea de tiempo compacta por día |
| 2.37 | Event logging de Mi Día (14 eventos nuevos del brief) | Pendiente | — | — | day_map_opened, day_slot_selected, emotion_dragged, emotion_selected, person_dragged, context_dragged, day_map_saved, day_no_talk_selected, constellation_opened, constellation_node_moved, constellation_saved + otros |
| 2.38 | Card de Mi Día en Home Niño (acceso visible, no escondido) | Pendiente | — | — | Mini resumen de hoy + CTA "Marcar mi día" / "Hoy no quiero decir nada" |
| 2.39 | Integrar Mi Día en sistema de métricas (ELS/REW/SI/CPS/CIS/EVI/TDM) | Pendiente | — | — | day_map_entries dispara cálculo incremental de features |

### Módulo Mi Día — V2 (Mapa de vínculos)

> V2 — implementar después de V1 estabilizado. Submódulo visual del módulo Mi Día.

| # | Tarea | Estado | Responsable | Fecha | Notas |
|---|-------|--------|-------------|-------|-------|
| 2.40 | Pantalla: Mapa de vínculos — nodo central niño + nodos arrastrables | Pendiente | — | — | PantallaMapaVinculos.tsx — neumorphism, sin efectos de juego |
| 2.41 | Tabla day_map_people: person_id + proximity_band + emotional_weight | Pendiente | — | — | proximity_band: near/mid/far — emotional_weight: calm/neutral/load |
| 2.42 | Guardar posición de nodos en day_map_people | Pendiente | — | — | — |
| 2.43 | Vista parental: leer Mapa de vínculos como agregados — nunca íntimo | Pendiente | — | — | Solo tendencias: persona más asociada a carga, persona más calmante, etc. |
| 2.44 | Patrones por franja horaria en Mapa de vínculos | Pendiente | — | — | — |
| 2.45 | Comparación semanal visual de vínculos | Pendiente | — | — | — |

---

## FASE 3 — DESARROLLO MVP PADRE

> El padre es quien paga. Este panel no puede quedar corto.

| # | Tarea | Estado | Responsable | Fecha | Notas |
|---|-------|--------|-------------|-------|-------|
| 3.1 | Onboarding del padre + consentimiento COPPA verificable | Completado | Copilot | 01 Abr 2026 | PantallaOnboardingPadre implementada |
| 3.2 | Home parental (dashboard ejecutivo) | Completado | Copilot | 01 Abr 2026 | PantallaHomePadre — badge ELS, banda, top emoción, alertas activas por hijo |
| 3.3 | Vista tendencias semanales | Pendiente | — | — | Gráficas por categoría emocional (no datos crudos) |
| 3.4 | Vista "Con quién lo siente" | Pendiente | — | — | REW/RIS por persona |
| 3.5 | Vista "Dónde pasa más" | Pendiente | — | — | CPS por contexto |
| 3.6 | Vista comparativa entre periodos | Pendiente | — | — | Esta semana vs semana anterior |
| 3.7 | Cadencia configurable de reportes | Pendiente | — | — | Semanal / quincenal / mensual (configuración del padre) |
| 3.8 | Correo de reporte según cadencia configurada | Pendiente | — | — | Resumen ejecutivo, tendencias, recomendaciones, alertas |
| 3.9 | Recomendaciones de abordaje | Pendiente | — | — | Qué decir, qué NO decir, estilo sugerido según perfil del niño |
| 3.10 | Frases sugeridas para iniciar conversación | Pendiente | — | — | Basadas en patrón emocional del periodo |
| 3.11 | Centro de guías para padres | Pendiente | — | — | Contenido práctico y accionable, no blog decorativo |
| 3.12 | Sistema de alertas (LOW / MEDIUM / HIGH / CRITICAL) | Pendiente | — | — | LLM nunca dispara CRITICAL solo |
| 3.13 | Bandeja de alertas con estado | Pendiente | — | — | Abiertas / atendidas / resueltas |
| 3.14 | Historial de intervenciones | Pendiente | — | — | Qué hizo el sistema, qué hizo el padre |
| 3.15 | Perfil del hijo y contexto | Pendiente | — | — | Preocupaciones, hogarperfil de respuesta, adultos seguros |
| 3.16 | Configuración de visibilidad | Pendiente | — | — | Qué nivel de detalle quiere ver el padre |
| 3.17 | Configuración de privacidad, borrado y exportación | Pendiente | — | — | COPPA compliance |
| 3.18 | Vista parental: agregados de Mi Día (franjas sensibles, personas relevantes, evitación) | Pendiente | — | — | NO muestra detalle íntimo. Solo tendencias y recomendaciones accionables |
| 3.19 | Vista parental: frecuencia de "no quiero decir nada" por periodo | Pendiente | — | — | Alimenta SI — umbral 3+ en 7 días => alerta LOW |

---

## FASE 4 — IA APLICADA, SCORING AVANZADO Y REPORTES INTELIGENTES

> **IMPORTANTE:** Las métricas base (ELS, REW, CPS, etc.) y el event logging arrancan desde Fase 1 junto con la infraestructura. Esta fase es la maduración del motor, no su inicio. Las integraciones de IA aquí se profundizan, no se empiezan de cero.

| # | Tarea | Estado | Responsable | Fecha | Notas |
|---|-------|--------|-------------|-------|-------|
| 4.1 | Integración Groq — clasificación enriquecida de check-ins | Pendiente | — | — | Structured outputs, primer pase y batch nocturno |
| 4.2 | Integración OpenAI — reportes y redacción estructurada | Pendiente | — | — | JSON schema estricto, recomendaciones parentales |
| 4.3 | Integración Anthropic — validación editorial y guardrails | Pendiente | — | — | Solo casos medium/high/critical y resumen parental final |
| 4.4 | Routing LLM por nivel de riesgo | Pendiente | — | — | Reglas duras → Groq → OpenAI → Anthropic |
| 4.5 | Sanitización/redacción de PII antes de enviar a IA | Pendiente | — | — | NUNCA mandar datos crudos del niño a proveedor externo |
| 4.6 | JSON schemas definitivos para cada output de IA | Pendiente | — | — | — |
| 4.7 | Validación estructurada de outputs de IA | Pendiente | — | — | — |
| 4.8 | Retries y fallback chain por proveedor | Pendiente | — | — | Sistema funciona aunque un proveedor falle |
| 4.9 | Thresholds configurables del motor de alertas | Pendiente | — | — | LOW/MEDIUM/HIGH/CRITICAL — reglas duras |
| 4.10 | Versionado de prompts | Pendiente | — | — | Control de cambios en producción |
| 4.11 | Cálculo avanzado ELS, REW, CPS, ITI, RSS, CIS, SI, EVI, HUS | Pendiente | — | — | Fórmulas completas en Orquestador.md §7 |
| 4.12 | Generación automática de resumen parental (job por cadencia) | Pendiente | — | — | Semanal / quincenal / mensual |
| 4.13 | Generación de recomendaciones contextuales para padres | Pendiente | — | — | Basadas en patrón + perfil del niño |
| 4.14 | Evaluación offline con casos sintéticos | Pendiente | — | — | Antes de activar en producción |
| 4.15 | Logs de auditoría completos por regla disparada | Pendiente | — | — | Tabla ai_audit_logs |
| 4.16 | Auditoría de tono no alarmista en textos para padres | Pendiente | — | — | Sin lenguaje clínico ni culpabilizante |

---

## FASE 5 — QA, SEGURIDAD Y LEGAL

| # | Tarea | Estado | Responsable | Fecha | Notas |
|---|-------|--------|-------------|-------|-------|
| 5.1 | Auditoría COPPA / GDPR-K | Pendiente | — | — | Antes de beta pública |
| 5.2 | Revisión de claims del producto | Pendiente | — | — | Sin claims médicos ni clínicos |
| 5.3 | Pruebas de privacidad (qué ve el padre) | Pendiente | — | — | Validar que no hay datos crudos expuestos |
| 5.4 | Pruebas de seguridad de datos infantiles | Pendiente | — | — | OWASP, encriptación en tránsito y reposo |
| 5.5 | Pruebas de accesibilidad en niños | Pendiente | — | — | Contraste, tamaño táctil, legibilidad |
| 5.6 | QA funcional app niño (flujos core) | Pendiente | — | — | — |
| 5.7 | QA funcional panel padre | Pendiente | — | — | — |
| 5.8 | QA del motor de alertas | Pendiente | — | — | Pruebas de casos CRITICAL |
| 5.9 | Pruebas de carga y rendimiento | Pendiente | — | — | — |
| 5.10 | Revisión de política de privacidad final | Pendiente | — | — | — |

---

## FASE 5.5 — ALPHA INTERNA / DOGFOODING

> Antes de poner el motor frente a familias reales, validar internamente. Brincar directo a beta con un motor de alertas sin probar es jugar ruleta.

| # | Tarea | Estado | Responsable | Fecha | Notas |
|---|-------|--------|-------------|-------|-------|
| 5.5.1 | Pruebas con data sintética (perfiles simulados) | Pendiente | — | — | Cubrir todos los escenarios emocionales |
| 5.5.2 | Simulación de severidades LOW / MEDIUM / HIGH / CRITICAL | Pendiente | — | — | Verificar que reglas duras disparan correctamente |
| 5.5.3 | Prueba de flujo completo de correo parental | Pendiente | — | — | Entrega, formato, tono, contenido |
| 5.5.4 | Revisión editorial de reportes generados | Pendiente | — | — | Sin lenguaje clínico, sin culpabilizar |
| 5.5.5 | Stress test de reglas del motor de alertas | Pendiente | — | — | Edge cases, intensidad máxima, repetición |
| 5.5.6 | Revisión interna del flujo del niño (10 sesiones completas) | Pendiente | — | — | — |
| 5.5.7 | Revisión interna del panel del padre | Pendiente | — | — | — |
| 5.5.8 | Validación de privacidad: confirmar que padre no ve datos crudos | Pendiente | — | — | — |
| 5.5.9 | Go / No-go para beta privada | Pendiente | Director | — | — |

---

## FASE 6 — BETA PRIVADA

| # | Tarea | Estado | Responsable | Fecha | Notas |
|---|-------|--------|-------------|-------|-------|
| 6.1 | Setup de pagos / suscripción en sandbox | Pendiente | — | — | Pricing, gating premium, entitlements, prueba gratis |
| 6.2 | Selección de familias beta (10-30) | Pendiente | — | — | NSE medio-alto, niños 8-12 |
| 6.3 | Onboarding beta users | Pendiente | — | — | — |
| 6.4 | Monitoreo de uso y retención infantil | Pendiente | — | — | KPI: sesiones por semana |
| 6.5 | Monitoreo de retención parental | Pendiente | — | — | KPI: apertura de correo, visitas al panel |
| 6.6 | Entrevistas cualitativas (padres) | Pendiente | — | — | — |
| 6.7 | Entrevistas cualitativas (niños) | Pendiente | — | — | Metodología apropiada para edad |
| 6.8 | Iteración de producto post-beta | Pendiente | — | — | — |
| 6.9 | Validación de pricing real | Pendiente | — | — | USD 9.99-14.99/mes o USD 79-99/año |
| 6.10 | Gestión de suscripción y cancelación probada | Pendiente | — | — | — |
| 6.11 | Aprobación de lanzamiento por director | Pendiente | Director | — | — |

---

## FASE 7 — LANZAMIENTO V1

| # | Tarea | Estado | Responsable | Fecha | Notas |
|---|-------|--------|-------------|-------|-------|
| 7.1 | Publicación App Store (iOS) | Pendiente | — | — | — |
| 7.2 | Publicación Google Play (Android) | Pendiente | — | — | — |
| 7.3 | Activación de pagos en producción | Pendiente | — | — | Ya probado en Fase 6 sandbox |
| 7.4 | Landing page de adquisición | Pendiente | — | — | Mensaje: refugio del niño + claridad para padres |
| 7.5 | Estrategia de adquisición inicial | Pendiente | — | — | Creators, contenido, alianzas |
| 7.6 | Verificación final de analytics de producto | Pendiente | — | — | Eventos definidos en Proyecto Sistema.md §12 |
| 7.7 | Monitoreo post-lanzamiento semana 1 | Pendiente | — | — | — |
| 7.8 | Revisión de métricas mes 1 | Pendiente | — | — | Descargas, activación, conversión, retención |

---

## PUNTO DE RETOMA — LEER PRIMERO AL ABRIR NUEVO CHAT

> Este bloque se actualiza después de cada movimiento. Si abres un chat nuevo, empieza aquí.

**Último push:** `42baa89` — rama `main` — repo `https://github.com/AdmiKode/Dunyo`
**Última sesión:** Sesión 8 — 01 Abr 2026
**TypeScript:** limpio (`npx tsc --noEmit` sin errores)
**Servidor web:** `CI=1 npx expo start --web --clear` en `app/` → http://localhost:8081

### Archivos clave del proyecto
| Ruta | Estado |
|------|--------|
| `app/src/types/database.ts` | Completo — todos los tipos, enums, JSON shapes |
| `app/src/lib/checkins.ts` | Completo — CRUD mood_checkins, safe_adults, session_interventions |
| `app/src/lib/metricas.ts` | Completo — ELS local, alertas, ResumenNino |
| `app/src/screens/child/PantallaCheckin.tsx` | Completo — 4 pasos, mood_checkins real, PasoPersona con SafeAdult[] |
| `app/src/screens/child/PantallaCalmarme.tsx` | Completo — respiracion_478, SessionIntervention, helpful_score |
| `app/src/screens/child/PantallaAyudameADecirlo.tsx` | Completo — frase al adulto, SessionIntervention, helpful_score |
| `app/src/screens/child/PantallaHomeNino.tsx` | Completo — gauge ELS real, checkin del día |
| `app/src/screens/child/PantallaOnboardingNino.tsx` | Completo — 3 pasos, logo_dunyo hero, compañero real, sin teclado |
| `app/src/screens/parent/PantallaHomePadre.tsx` | Completo — badge ELS, alertas, top emoción por hijo |
| `app/src/screens/parent/PantallaOnboardingPadre.tsx` | Completo — logo_dunyo completo como hero |
| `app/src/navigation/NavegadorNino.tsx` | Completo — incluye SetupPatronNino y OnboardingNino en flujo del niño |
| `app/src/navigation/NavegadorPadre.tsx` | Completo — arranques en OnboardingPadre si padre sin hijos |
| `app/src/store/AuthContext.tsx` | Completo — carga perfiles antes de transicionar a padre_autenticado |
| `app/assets/logo_dunyo.png` | Logo completo (globo + letras) |
| `app/assets/logo_dunyo_mundo.png` | Ícono solo (globo) |
| `app/assets/letrero_dunyo.png` | Solo letras — usado en Login y CrearCuenta |
| `app/assets/fonts/cocomat-pro-regular.woff2` | Fuente cargada con useFonts → CocomatPro |
| `supabase/migrations/001_schema_auth_perfiles.sql` | Ejecutado en producción |
| `supabase/migrations/002_schema_analitica_motor.sql` | Ejecutado en producción |

### Siguiente tarea a construir
**`2.15 — Módulo Desahogarme`**: nueva pantalla `PantallaDesahogarme.tsx` en `app/src/screens/child/`.
- Texto libre corto (máx 280 chars) que el niño puede escribir
- Guarda como `SessionIntervention` con `intervention_slug: 'desahogo_texto'`
- Al terminar: pregunta helpful_score igual que Calmarme
- Botones: Listo / Borrar todo / Volver
- NO guardar texto crudo — solo metadata: `{ chars: texto.length }`

**Después de eso (en orden):**
1. `2.16` — PantallaPensar (técnica de reencuadre guiado, 3 preguntas simples)
2. `2.22` — PantallaDormir (rutina de noche: respiración corta + frase de cierre)
3. `3.3` — PantallaTendenciasPadre (gráfica semanal por emoción usando checkins7d)
4. Commit + push

---

## REGISTRO DIARIO DE TRABAJO

| Fecha | Sesión | Lo que se avanzó | Siguiente paso |
|-------|--------|------------------|----------------|
| 01 Abr 2026 | 1 | Creación de archivos base del proyecto. Lectura completa de todos los documentos. Notas importantes registradas. Fases v0.8 creadas. | Presentar concepto al director para aprobación |
| 01 Abr 2026 | 2 | Fases actualizadas a v0.9 con correcciones del director: Fase 4 renombrada, infraestructura fundacional a Fase 1, Fase 2 y 3 completadas, Fase 5.5 alpha agregada, pagos a Fase 6. | Obtener aprobación del director para iniciar Fase 1 |
| 01 Abr 2026 | 3 | Expo inicializado (blank-typescript). Supabase configurado. Migration 001 ejecutada: child_profiles, child_context, parental_consents, auth_events. Auth screens: PantallaCrearCuenta, PantallaLoginPadre, PantallaSetupPatronNino, PantallaAccesoNino, PantallaResetPatron. ComponentePatron 3x3. AuthContext + 4 navegadores. Push a GitHub (14 archivos). | Construir pantallas principales del niño y del padre |
| 01 Abr 2026 | 4 | Pantallas principales completas: PantallaHomePadre, PantallaOnboardingPadre, PantallaCrearHijo, PantallaSelectorPerfil, PantallaHomeNino, PantallaCheckin, PantallaCalmarme, PantallaAyudameADecirlo. App.tsx conectado. Push (15 archivos, 2,481 inserciones). | Conectar código a tablas reales de analytics |
| 01 Abr 2026 | 5 | Migration 002 ejecutada: safe_adults, mood_checkins, session_interventions, event_features, daily_metrics, alert_records, report_jobs, parent_reports, ai_audit_logs. Triggers fill_checkin_fields y propagate_to_event_features. RLS completo en 9 tablas nuevas. | Conectar pantallas al schema real |
| 01 Abr 2026 | 6 | database.ts expandido con todos los tipos (enums, JSON shapes, 9 tablas nuevas). lib/checkins.ts creado (CRUD mood_checkins, safe_adults, session_interventions). lib/metricas.ts creado (ELS local, alertas, ResumenNino). PantallaCheckin reescrita con mood_checkins real. PantallaCalmarme guarda SessionIntervention + helpful_score. PantallaAyudameADecirlo ídem. PantallaHomeNino con gauge ELS real. PantallaHomePadre con dashboard real (ELS, alertas, top emoción). TypeScript limpio. Push 42baa89 (8 archivos, 1,309 inserciones). | Fase 2 pendientes: onboarding niño, módulos Desahogarme/Pensar/Dormir. Fase 3: vistas de tendencias y alertas. |
| 01 Abr 2026 | 7 | Servidor web levantado (CI=1 expo start --web). Fix NavigationContainer duplicado. react-native-worklets instalado. .env copiado a app/. supabase.ts adaptado para web (localStorage). App renderizando en http://localhost:8081. Fuente Cocomat Pro: archivos copiados a assets/fonts/, nombre corregido (tenía caracteres cirílicos), useFonts cargando. | Confirmar rendering de fuente |
| 01 Abr 2026 | 8 | CORRECCIÓN CRÍTICA DE FLUJO: El niño ahora hace su propio patrón (no el padre). AuthContext carga perfiles antes de transición. NavegadorPadre arranca en OnboardingPadre si padre sin hijos. PantallaCrearHijo va a HomePadre (no SetupPatron). NavegadorNino incluye SetupPatronNino y OnboardingNino. PantallaSelectorPerfil detecta primer acceso. PantallaOnboardingNino construida (3 pasos, logo real, animación fade). Logos integrados: logo_dunyo hero en OnboardingPadre y OnboardingNino paso 1; letrero_dunyo en Login y CrearCuenta. TypeScript limpio. | 2.15 PantallaDesahogarme |

---

## LEYENDA DE ESTADOS

| Estado | Significado |
|--------|-------------|
| Completado | Terminado y revisado |
| En curso | Trabajo activo hoy |
| Pendiente | No comenzado |
| Bloqueado | Requiere algo para continuar |
| En revisión | Esperando feedback o aprobación |
