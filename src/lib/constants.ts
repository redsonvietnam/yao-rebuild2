// constants.ts — Hằng số toàn project
export const CM_TO_PX = 37.7952756 // 1cm = 37.8px at 96dpi

export const PAGE_SIZES = {
  A4: { width: 210, height: 297 }, // mm
  A3: { width: 297, height: 420 }, // mm
  A5: { width: 148, height: 210 }, // mm
} as const

export const DEFAULT_MARGINS = {
  top: 20,
  right: 20,
  bottom: 20,
  left: 20,
} as const // mm

export const DEFAULT_GRID_SIZE = 40 // px

export const FONTS = [
  { label: 'Noto Serif CJK', value: 'Noto Serif CJK SC, serif' },
  { label: 'Noto Sans CJK', value: 'Noto Sans CJK SC, sans-serif' },
  { label: 'HaNom PV', value: 'HaNom PV, serif' },
] as const

export const WRITING_MODES = {
  horizontal: 'horizontal-tb',
  vertical: 'vertical-rl',
} as const
