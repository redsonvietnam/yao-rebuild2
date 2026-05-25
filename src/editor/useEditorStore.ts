import { create } from 'zustand'
import type { Editor } from '@tiptap/core'
import type { Candidate } from '@/engine/types'
import { match } from '@/engine/matcher'
import { transform } from '@/engine/transform'
import { loadDict } from '@/engine/loader'
import { buildUserDictMap } from '@/db/dexie'

interface EditorStore {
  // IME state
  preedit: string
  transformedPreedit: string
  candidates: Candidate[]
  selectedIdx: number
  isHanMode: boolean
  caretCoords: { x: number; y: number } | null
  
  // Dictionary state
  dict: Map<string, Candidate[]> | null
  isDictLoading: boolean
  userDictMap: Map<string, Candidate[]> | null

  // AutoSave state (M20)
  saveStatus: 'idle' | 'saving' | 'saved'

  // Editor config
  writingMode: 'horizontal-tb' | 'vertical-rl'
  pageSize: 'A4' | 'A3' | 'custom'
  showGrid: boolean
  marginLeft: number
  marginRight: number
  marginTop: number
  marginBottom: number

  // Editor reference (for ExportMenu etc.)
  editor: Editor | null
  setEditor: (editor: Editor | null) => void

  // Actions
  initDict: () => Promise<void>
  refreshUserDict: () => Promise<void>
  setPreedit: (text: string) => void
  nextCandidate: () => void
  prevCandidate: () => void
  selectCandidate: (idx: number) => void
  commitSelection: () => Candidate | null
  toggleHanMode: () => void
  updateCaretCoords: (coords: { x: number; y: number } | null) => void
  resetIME: () => void
  toggleGrid: () => void
  setMargins: (margins: { left?: number; right?: number; top?: number; bottom?: number }) => void
  setSaveStatus: (status: 'idle' | 'saving' | 'saved') => void
}

// Build merged dict: base dict + user overrides (user overrides prepended for priority)
function mergeDict(baseDict: Map<string, Candidate[]>, userMap: Map<string, Candidate[]>): Map<string, Candidate[]> {
  const merged = new Map<string, Candidate[]>()
  // Copy base dict
  for (const [key, candidates] of baseDict) {
    merged.set(key, [...candidates])
  }
  // Merge user overrides: prepend to existing key, or create new key
  for (const [key, candidates] of userMap) {
    const existing = merged.get(key) || []
    // User overrides go first (higher priority)
    merged.set(key, [...candidates, ...existing])
  }
  return merged
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  preedit: '',
  transformedPreedit: '',
  candidates: [],
  selectedIdx: 0,
  isHanMode: true,
  caretCoords: null,
  dict: null,
  isDictLoading: false,
  userDictMap: null,
  editor: null,
  saveStatus: 'idle',
  writingMode: 'horizontal-tb',
  pageSize: 'A4',
  showGrid: false,
  marginLeft: 20,
  marginRight: 20,
  marginTop: 20,
  marginBottom: 20,

  initDict: async () => {
    if (get().dict) return
    set({ isDictLoading: true })
    const dict = await loadDict()
    // Load user overrides
    const userDictMap = await buildUserDictMap()
    set({ dict, userDictMap, isDictLoading: false })
  },

  refreshUserDict: async () => {
    const userDictMap = await buildUserDictMap()
    set({ userDictMap })
  },

  setPreedit: (text: string) => {
    const { dict, userDictMap, isHanMode, isDictLoading } = get()
    
    // If dictionary is loading or missing, just update the preedit text without candidates
    if (!isHanMode || !dict || isDictLoading) {
      set({ preedit: text, transformedPreedit: text, candidates: [], selectedIdx: 0 })
      return
    }

    const transformed = transform(text)
    // Merge user overrides into dict for matching
    const effectiveDict = userDictMap && userDictMap.size > 0
      ? mergeDict(dict, userDictMap)
      : dict
    const candidates = match(transformed, effectiveDict)
    
    set({ 
      preedit: text, 
      transformedPreedit: transformed, 
      candidates, 
      selectedIdx: 0 
    })
  },

  nextCandidate: () => {
    const { candidates, selectedIdx } = get()
    if (candidates.length === 0) return
    set({ selectedIdx: (selectedIdx + 1) % candidates.length })
  },

  prevCandidate: () => {
    const { candidates, selectedIdx } = get()
    if (candidates.length === 0) return
    set({ selectedIdx: (selectedIdx - 1 + candidates.length) % candidates.length })
  },

  selectCandidate: (idx: number) => {
    const { candidates } = get()
    if (idx >= 0 && idx < candidates.length) {
      set({ selectedIdx: idx })
    }
  },

  commitSelection: () => {
    const { candidates, selectedIdx } = get()
    const selection = candidates[selectedIdx] || null
    get().resetIME()
    return selection
  },

  toggleHanMode: () => {
    const { isHanMode } = get()
    if (isHanMode) {
      get().resetIME()
    }
    set({ isHanMode: !isHanMode })
  },

  toggleGrid: () => set(state => ({ showGrid: !state.showGrid })),

  setMargins: (margins) => set(state => ({
    marginLeft: margins.left ?? state.marginLeft,
    marginRight: margins.right ?? state.marginRight,
    marginTop: margins.top ?? state.marginTop,
    marginBottom: margins.bottom ?? state.marginBottom,
  })),

  updateCaretCoords: (coords) => {
    const current = get().caretCoords
    if (current?.x === coords?.x && current?.y === coords?.y) return
    set({ caretCoords: coords })
  },

  setEditor: (editor) => set({ editor }),
  setSaveStatus: (status) => set({ saveStatus: status }),

  resetIME: () => set({ 
    preedit: '', 
    transformedPreedit: '', 
    candidates: [], 
    selectedIdx: 0 
  }),
}))
