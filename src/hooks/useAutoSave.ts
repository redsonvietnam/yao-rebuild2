import { useEffect, useRef, useCallback, useState } from 'react'
import type { Editor } from '@tiptap/core'
import { saveDocument, getLatestAutoSave, type DocumentEntry } from '@/db/dexie'
import { useEditorStore } from '@/editor/useEditorStore'
import { useAppContext } from '@/contexts/AppContext'

export type SaveStatus = 'idle' | 'saving' | 'saved'

export function useAutoSave(editor: Editor | null) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isRestoringRef = useRef(false)
  const { addNotification } = useAppContext()

  const writingMode = useEditorStore(state => state.writingMode)
  const pageSize = useEditorStore(state => state.pageSize)
  const marginLeft = useEditorStore(state => state.marginLeft)
  const marginRight = useEditorStore(state => state.marginRight)
  const marginTop = useEditorStore(state => state.marginTop)
  const marginBottom = useEditorStore(state => state.marginBottom)

  // Perform the actual save
  const doSave = useCallback(async () => {
    if (!editor || editor.isDestroyed || isRestoringRef.current) return

    setSaveStatus('saving')
    try {
      const content = JSON.stringify(editor.getJSON())
      const text = editor.state.doc.textContent
      const wordCount = text.replace(/\s/g, '').length
      const lineCount = text.split('\n').length

      const now = Date.now()
      await saveDocument({
        docId: 'current-doc',
        title: 'Tài liệu chưa đặt tên',
        content,
        writingMode,
        pageSize,
        margins: {
          top: marginTop,
          bottom: marginBottom,
          left: marginLeft,
          right: marginRight,
        },
        wordCount,
        lineCount,
        isAutoSaved: true,
        createdAt: now,
        updatedAt: now,
      })
      setSaveStatus('saved')
      setLastSavedAt(now)
      // Không hiển thị notification cho auto-save
    } catch (error) {
      setSaveStatus('idle')
      const errorMessage = error instanceof Error ? error.message : 'Lưu tài liệu thất bại'
      addNotification({
        type: 'error',
        message: errorMessage,
        duration: 5000,
      })
    }
  }, [editor, writingMode, pageSize, marginLeft, marginRight, marginTop, marginBottom, addNotification])

  // Debounced save trigger
  const triggerSave = useCallback(() => {
    setSaveStatus('idle') // Reset to idle to show "unsaved" briefly
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      doSave()
    }, 2000)
  }, [doSave])

  // Restore autosaved document on mount
  const restoreDocument = useCallback(async (): Promise<boolean> => {
    if (!editor || editor.isDestroyed) return false

    try {
      const saved = await getLatestAutoSave()
      if (!saved) return false

      isRestoringRef.current = true
      const content = JSON.parse(saved.content)
      editor.commands.setContent(content)
      setLastSavedAt(saved.updatedAt)
      setSaveStatus('saved')

      // Restore writing mode if it differs
      if (saved.writingMode && saved.writingMode !== writingMode) {
        useEditorStore.getState().setMargins({
          top: saved.margins?.top,
          bottom: saved.margins?.bottom,
          left: saved.margins?.left,
          right: saved.margins?.right,
        })
      }

      // Wait a tick then re-enable auto-save
      setTimeout(() => {
        isRestoringRef.current = false
      }, 500)

      return true
    } catch {
      return false
    }
  }, [editor, writingMode])

  // Listen to editor changes
  useEffect(() => {
    if (!editor) return

    const onUpdate = () => {
      triggerSave()
    }

    editor.on('update', onUpdate)
    return () => {
      editor.off('update', onUpdate)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [editor, triggerSave])

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return {
    saveStatus,
    lastSavedAt,
    restoreDocument,
  }
}