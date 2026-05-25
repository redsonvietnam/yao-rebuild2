import { useEditorStore } from '@/editor/useEditorStore'
import type { Editor } from '@tiptap/react'
import { useCallback, useMemo } from 'react'

export function useIME(editor: Editor | null) {
  const store = useEditorStore()

  const syncCaretCoords = useCallback(() => {
    if (!editor) return
    const { selection } = editor.state
    const coords = editor.view.coordsAtPos(selection.from)
    store.updateCaretCoords({ x: coords.left, y: coords.top })
  }, [editor, store.updateCaretCoords])

  const commitSelection = useCallback(() => {
    if (!editor) return
    const selection = store.commitSelection()
    if (selection) {
      editor.commands.insertContent(selection.hanzi)
    }
  }, [editor, store.commitSelection])

  const handleKeyDown = useCallback((view: any, event: KeyboardEvent): boolean => {
    if (!editor || !store.isHanMode) return false

    const { key, ctrlKey, altKey, metaKey } = event
    if (ctrlKey || altKey || metaKey) return false

    // 1. If we are in IME mode (preedit is not empty)
    if (store.preedit) {
      if (key === 'Backspace') {
        store.setPreedit(store.preedit.slice(0, -1))
        syncCaretCoords()
        return true
      }

      if (key === ' ' || key === 'Enter') {
        commitSelection()
        return true
      }

      if (key === 'ArrowRight' || key === 'ArrowDown') {
        store.nextCandidate()
        return true
      }
      if (key === 'ArrowLeft' || key === 'ArrowUp') {
        store.prevCandidate()
        return true
      }

      if (/^[1-9]$/.test(key)) {
        const idx = parseInt(key) - 1
        if (idx < store.candidates.length) {
          store.selectCandidate(idx)
          commitSelection()
          return true
        }
      }

      if (key === 'Escape') {
        store.resetIME()
        return true
      }
    }

    if (/^[a-zA-Z]$/.test(key)) {
      store.setPreedit(store.preedit + key)
      syncCaretCoords()
      return true
    }

    return false
  }, [editor, store, syncCaretCoords, commitSelection])

  return useMemo(() => ({
    handleKeyDown,
    syncCaretCoords,
  }), [handleKeyDown, syncCaretCoords])
}
