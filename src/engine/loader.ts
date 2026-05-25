import type { Candidate } from './types'

export async function loadDict(): Promise<Map<string, Candidate[]>> {
  try {
    // In Vite, we can import JSON directly
    const dictData = await import('../assets/dict.json')
    const dict = new Map<string, Candidate[]>()

    // dictData.default because it's a dynamic import
    const data = dictData.default as Record<string, Candidate[]>

    for (const [key, candidates] of Object.entries(data)) {
      dict.set(key, candidates)
    }

    return dict
  } catch (error) {
    console.error('[Loader] Failed to load dictionary:', error)
    return new Map()
  }
}
