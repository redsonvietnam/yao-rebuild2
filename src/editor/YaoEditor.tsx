import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { PageNode } from './PageNode'
import { useEditorStore } from './useEditorStore'
import { useEffect } from 'react'
import { useIME } from '@/hooks/useIME'
import { useAutoSave } from '@/hooks/useAutoSave'
import { Extension } from '@tiptap/core'
import { PaginationPlugin } from './PaginationPlugin'
import { UnderlineExtension } from './UnderlineExtension'
import { AlignmentExtension } from './AlignmentExtension'
import Ruler from '@/components/editor/Ruler'
import EditorToolbar from '@/components/editor/EditorToolbar'

const Pagination = Extension.create({
  name: 'pagination',
  addProseMirrorPlugins() {
    return [PaginationPlugin()]
  },
})

export default function YaoEditor() {
  const writingMode = useEditorStore(state => state.writingMode)
  const showGrid = useEditorStore(state => state.showGrid)

  // Margins state
  const marginLeft = useEditorStore(state => state.marginLeft)
  const marginRight = useEditorStore(state => state.marginRight)
  const marginTop = useEditorStore(state => state.marginTop)
  const marginBottom = useEditorStore(state => state.marginBottom)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        document: {
          content: 'page+',
        },
      }),
      PageNode,
      Pagination,
      UnderlineExtension,
      AlignmentExtension,
    ],
    // Use JSON content for reliable schema parsing (no HTML parsing ambiguity)
    content: {
      type: 'doc',
      content: [
        {
          type: 'page',
          attrs: { writingMode: 'horizontal-tb', pageSize: 'A4' },
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Chào mừng bạn đến với Yao Editor v2. Hãy bắt đầu soạn thảo...' }]
            }
          ]
        }
      ]
    },
    editorProps: {
      attributes: {
        // Remove 'prose' classes — they conflict with .yao-page CSS dimensions
        class: 'focus:outline-none',
      },
      // IME Interception
      handleKeyDown: (view, event) => {
        return ime.handleKeyDown(view, event)
      },
    },
  })

  const ime = useIME(editor)

  // Register editor in Zustand store (for ExportMenu etc.)
  const setEditor = useEditorStore(state => state.setEditor)
  useEffect(() => {
    setEditor(editor)
    return () => setEditor(null)
  }, [editor, setEditor])

  // M20 AutoSave: debounced persistence
  const { saveStatus, restoreDocument } = useAutoSave(editor)
  const setSaveStatus = useEditorStore(state => state.setSaveStatus)

  // Sync saveStatus from hook to Zustand store (for footer badge)
  useEffect(() => {
    setSaveStatus(saveStatus)
  }, [saveStatus, setSaveStatus])

  // Restore autosaved document on first mount
  useEffect(() => {
    if (editor) {
      restoreDocument()
    }
  }, [editor, restoreDocument])

  // Handle selection updates via stable effect
  useEffect(() => {
    if (!editor) return
    const handler = () => ime.syncCaretCoords()
    editor.on('selectionUpdate', handler)
    return () => {
      editor.off('selectionUpdate', handler)
    }
  }, [editor, ime])

  // Sync writing mode from store to editor
  useEffect(() => {
    if (editor && writingMode) {
      editor.commands.setPageMode(writingMode)
    }
  }, [editor, writingMode])

  // Trigger pagination reflow when margins change
  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      // Small delay to let CSS custom properties apply and DOM reflow
      setTimeout(() => {
        editor.view.dispatch(editor.state.tr.setMeta('force-pagination', true))
      }, 50)
    }
  }, [editor, marginLeft, marginRight, marginTop, marginBottom])

  if (!editor) {
    return null
  }

  return (
    <div className="flex flex-col w-full h-full bg-gray-950 overflow-hidden">
      {/* Pinned Formatting Toolbar */}
      <EditorToolbar editor={editor} />

      {/* Content area — relative container for absolute-positioned Ruler */}
      <div className="flex-1 relative min-h-0">
        {/* Ruler: absolute-positioned to avoid flex layout phantom overlay bug */}
        {showGrid && (
          <div
            className="absolute top-0 left-0 right-0 bg-gray-900/80 border-b border-gray-800 flex justify-center overflow-x-auto z-[95]"
            style={{ height: '45px' }}
          >
            <Ruler />
          </div>
        )}

        {/* Editor Canvas Area with Dynamic CSS Margins */}
        <div
          className={`h-full overflow-auto p-6 ${showGrid ? 'show-grid' : ''}`}
          style={{
            paddingTop: showGrid ? '53px' : undefined, // 45px ruler + 8px breathing room
            '--margin-top': `${marginTop}mm`,
            '--margin-bottom': `${marginBottom}mm`,
            '--margin-left': `${marginLeft}mm`,
            '--margin-right': `${marginRight}mm`,
          } as React.CSSProperties}
        >
          {/* Editor Viewport */}
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  )
}
