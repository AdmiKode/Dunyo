// Paleta oficial DUNYO — no usar ningún otro color
export const COLORES = {
  // Paleta base
  madretierra: '#513229',    // base oscura, textos primarios, iconos de acento
  suertedados: '#F4F1E2',    // background principal, superficies base
  azulsuave: '#D8EBF9',      // acento frío, elementos de calma
  arenaCalida: '#FCE6B7',    // acento cálido, energía suave
  verdeApagado: '#D7D4B1',   // elementos secundarios, naturaleza

  // Derivados semánticos (siempre de la paleta base)
  fondo: '#F4F1E2',
  superficie: '#EDE9D5',
  textoPrimario: '#513229',
  textoSecundario: '#7A5C54',
  textoSuave: '#A08880',
  borde: '#D9D5C2',
  sombra: 'rgba(81, 50, 41, 0.08)',
  sombraMedia: 'rgba(81, 50, 41, 0.14)',
  sombraFuerte: 'rgba(81, 50, 41, 0.22)',

  // Estados funcionales — solo de la paleta
  exito: '#D7D4B1',
  alerta: '#FCE6B7',
  info: '#D8EBF9',
  error: '#C4907A',          // derivado suave de madretierra, no rojo puro

  // Transparencias
  fondoOverlay: 'rgba(244, 241, 226, 0.95)',
  madretierraAlpha: 'rgba(81, 50, 41, 0.06)',
} as const

// Radio de bordes — siempre redondeados
export const RADIO = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 28,
  capsula: 999,
} as const

// Espaciado base
export const ESPACIO = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const

// Tipografía — Cocomat Pro para títulos, sistema para UI densa
export const FUENTES = {
  cocomatRegular: 'CocomatPro',
  sistema: 'System',
} as const

// Sombras neumorphism — dirección: abajo-derecha oscura + borde blanco arriba-izquierda como highlight
export const SOMBRA_CARD = {
  shadowColor: COLORES.madretierra,
  shadowOffset: { width: 6, height: 8 },
  shadowOpacity: 0.16,
  shadowRadius: 18,
  elevation: 6,
} as const

export const SOMBRA_BOTON = {
  shadowColor: COLORES.madretierra,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.22,
  shadowRadius: 10,
  elevation: 4,
} as const

// Borde highlight — simula cara iluminada del neumorphism
export const BORDE_HIGHLIGHT = {
  borderWidth: 1.5,
  borderColor: 'rgba(255,255,255,0.9)',
} as const
