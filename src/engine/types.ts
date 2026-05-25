// types.ts — IME Engine type definitions
// TODO: Implement in M02

export interface Candidate {
  hanzi: string
  pinyin: string
  weight: number
  matchType: 'exact' | 'prefix' | 'abbrev' | 'meaning'
}

export interface DictEntry {
  hanzi: string
  pinyin: string
  weight?: number
}

export interface MatchResult {
  candidates: Candidate[]
  preedit: string
}
