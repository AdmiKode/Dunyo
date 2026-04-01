# NOTAS IMPORTANTES — DUNYO
## Mis notas de trabajo internas. No modificar sin autorización.

---

## REGLAS DURAS DE DISEÑO (NO NEGOCIABLES)

### Tipografía
- Fuente oficial: **Cocomat Pro Regular** (archivos en carpeta: .eot, .woff, .woff2)
- No usar ninguna otra fuente sin autorización expresa
- No usar bold pesado ni fuentes system por defecto en UI visible

### Paleta de colores OFICIAL — CERO excepciones
| Nombre | HEX | Uso |
|---|---|---|
| Mother Earth | `#513229` | Base oscura, textos primarios, iconos de acento |
| Lucky Dice | `#F4F1E2` | Background principal, superficies base |
| Something Blue | `#D8EBF9` | Acento frío, elementos de calma |
| The Bay | `#FCE6B7` | Acento cálido, arena, energía suave |
| Walking Vinnie | `#D7D4B1` | Verde apagado, elementos secundarios, naturaleza |

- **PROHIBIDO usar cualquier color fuera de esta paleta**
- No usar negro puro (#000000) ni blanco puro (#FFFFFF)
- No usar primarios saturados (rojo vivo, azul royal, amarillo neón, verde brillante)
- Los states de botones deben construirse con variaciones de la paleta (opacidad, sombra), no con colores nuevos

### Iconos
- **PROHIBIDO usar emojis en cualquier parte de la app. Nunca. Sin excepción.**
- Todos los iconos se construyen como íconos vectoriales propios en el estilo del sistema
- Estilo de iconos: línea suave, bordes redondeados, peso ligero, coherente con neumorphism
- No usar librerías de iconos genéricas (Material Icons, SF Symbols visible como tales) sin rediseñar al estilo DUNYO

### Estilo visual general
- **Neumorphism soft premium** — tarjetas elevadas, sombras suaves, superficies cálidas
- Botones en forma cápsula / pill
- Fondos orgánicos, gradientes calmados
- Microanimaciones lentas — nunca rápidas ni agresivas
- Bordes redondeados en todos los componentes (border-radius generoso)
- Profundidad por capas (layering), no por bordes duros
- Nada de interfaz de preescolar, nada de colores de kínder, nada saturado

### Lo que NO debe verse jamás
- Emojis
- Colores fuera de paleta
- Fuentes distintas a Cocomat Pro
- Animaciones rápidas o saltarinas
- Estética de "app de tareas" o escolar
- Estética de control parental agresivo
- Elementos de gamificación excesiva (monedas, tiendas internas)
- Publicidad o banners

---

## ARQUITECTURA TÉCNICA — NOTAS CLAVE

### Stack elegido (a confirmar con director)
- App 100% nativa (iOS y Android por separado, no cross-platform)
- Backend separado del frontend
- Motor de IA orquestado: Groq (clasificación rápida) → OpenAI (reportes y redacción) → Anthropic (auditoría y seguridad)

### Regla crítica de IA
- Ningún LLM puede diagnosticar
- Ningún LLM puede escalar a alerta CRITICAL por sí solo
- Las reglas duras del motor disparan CRITICAL, la IA nunca lo hace sola
- Todo texto enviado a IA va minimizado y redactado (sin datos crudos del niño)

### Privacidad y legal
- COPPA compliance obligatorio (menores de 13)
- Consentimiento parental verificable ANTES de recolectar cualquier dato del menor
- El padre ve tendencias y resúmenes — nunca diarios completos ni transcripciones literales
- Sin publicidad dirigida, sin monetización secundaria de datos infantiles

---

## PRODUCTO — RECORDATORIOS ESENCIALES

### Dos experiencias separadas
1. **App del niño**: refugio visual, interactivo, sin escritura larga, 8-12 años
2. **Panel del padre**: tendencias, alertas, recomendaciones — no espionaje

### El niño NUNCA debe sentir que lo evalúan o vigilan
### El padre NUNCA debe sentir que espía o que recibe datos crudos

### Diferenciador central del producto
"Emotional intelligence companion for children with parent insight layer"
— No terapia, no control parental, no meditación genérica —

### Módulos V1 confirmados
1. Refugio del niño (home)
2. Check-in emocional guiado (máx 20 segundos)
3. Biblioteca de situaciones de vida real
4. Kit de herramientas (calma, regulación)
5. Ayúdame a decirlo (puente con adulto)
6. Mi fuerza (logros, progreso)
7. Panel parental
8. Correo semanal para padres
9. Centro de guía para padres
10. Sistema de alertas y escalamiento

### Métricas del sistema (motor cuantitativo)
- ELS — Emotional Load Score
- REW — Relationship Emotional Weight
- CPS — Context Pressure Score
- ITI — Intensity Trend Index
- RSS — Recovery Speed Score
- CIS — Communication Intent Score
- SI — Suppression Index
- EVI — Emotional Volatility Index

---

## POSICIONAMIENTO COMERCIAL
- B2C premium, suscripción recurrente
- Plan mensual: USD 9.99 – 14.99
- Plan anual: USD 79 – 99
- Comprador: madre/padre 30-45 años, NSE medio-alto, urbano
- Usuario: niño/niña 8-12 años
- No compite con terapia ni con control parental
- Competitor reference: Moshi, Mightier, Bark, Calm Family

---

## ESTADO DEL PROYECTO (actualizar siempre aquí)
- Fecha de inicio documentación: 1 de abril de 2026
- Etapa actual: Conceptualización y arquitectura de producto
- Próximo hito: Aprobación de concepto por director
- Archivo de fases: ver `Fases Dunyo.md`
