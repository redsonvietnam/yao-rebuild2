import type { Candidate } from './types'

export function match(
  preedit: string,
  dict: Map<string, Candidate[]>
): Candidate[] {
  if (!preedit) return []

  const exact: Candidate[] = []
  const prefix: Candidate[] = []
  const abbrev: Candidate[] = []
  const meaning: Candidate[] = []

  const lowerPreedit = preedit.toLowerCase()

  for (const [key, candidates] of dict.entries()) {
    const lowerKey = key.toLowerCase()

    if (lowerKey === lowerPreedit) {
      exact.push(...candidates.map(c => ({ ...c, matchType: 'exact' as const })))
    } else if (lowerKey.startsWith(lowerPreedit)) {
      prefix.push(...candidates.map(c => ({ ...c, matchType: 'prefix' as const })))
    } else if (key.length > 1 && lowerKey[0] === lowerPreedit) {
      abbrev.push(...candidates.map(c => ({ ...c, matchType: 'abbrev' as const })))
    }
  }

  const sortFn = (a: Candidate, b: Candidate) => (b.weight || 0) - (a.weight || 0)

  return [
    ...exact.sort(sortFn),
    ...prefix.sort(sortFn),
    ...abbrev.sort(sortFn),
    ...meaning.sort(sortFn),
  ].slice(0, 50) // Limit to 50 candidates for performance
}
