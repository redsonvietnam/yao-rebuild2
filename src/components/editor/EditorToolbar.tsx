import { Editor } from '@tiptap/react'

interface EditorToolbarProps {
  editor: Editor | null
}

export default function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) return null

  const toggleBold = () => editor.chain().focus().toggleBold().run()
  const toggleItalic = () => editor.chain().focus().toggleItalic().run()
  const toggleUnderline = () => editor.chain().focus().toggleUnderline().run()
  const toggleStrike = () => editor.chain().focus().toggleStrike().run()

  const setTextAlign = (align: string) => editor.chain().focus().setTextAlign(align).run()
  const setHeading = (level: 1 | 2 | 3 | 0) => {
    if (level === 0) {
      editor.chain().focus().setParagraph().run()
    } else {
      editor.chain().focus().toggleHeading({ level }).run()
    }
  }

  const togglePageOrientation = () => {
    // Get current orientation from first page
    let currentOrientation = 'portrait'
    editor.state.doc.descendants((node) => {
      if (node.type.name === 'page') {
        currentOrientation = node.attrs.orientation || 'portrait'
        return false // Stop after first page
      }
    })
    
    const newOrientation = currentOrientation === 'portrait' ? 'landscape' : 'portrait'
    editor.chain().focus().setPageOrientation(newOrientation).run()
  }

  const clearFormatting = () => editor.chain().focus().clearNodes().unsetAllMarks().run()
  const undo = () => editor.chain().focus().undo().run()
  const redo = () => editor.chain().focus().redo().run()

  return (
    <div className="shrink-0 h-12 border-b editor-toolbar flex items-center px-6 gap-4 z-[90] justify-between">
      {/* Undo / Redo & Basic formatting */}
      <div className="flex items-center gap-1">
        {/* Undo */}
        <button 
          onClick={undo}
          disabled={!editor.can().undo()}
          className="p-1.5 rounded transition-all disabled:opacity-30 disabled:hover:bg-transparent"
          title="Hoàn tác (Ctrl+Z)"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        </button>
        {/* Redo */}
        <button 
          onClick={redo}
          disabled={!editor.can().redo()}
          className="p-1.5 rounded transition-all disabled:opacity-30 disabled:hover:bg-transparent"
          title="Làm lại (Ctrl+Y)"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2m18-12l-6 6m6-6l-6-6" />
          </svg>
        </button>

        <div className="w-px h-5 divider mx-1.5" />

        {/* Headings */}
        <div className="flex p-0.5 rounded-lg border mr-2" style={{
          backgroundColor: 'var(--color-bg-hover)',
          borderColor: 'var(--color-border)',
        }}>
          <button 
            onClick={() => setHeading(0)}
            className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${
              editor.isActive('paragraph') ? 'text-white' : ''
            }`}
            style={{
              backgroundColor: editor.isActive('paragraph') ? 'var(--color-bg-active)' : 'transparent',
              color: editor.isActive('paragraph') ? 'white' : 'var(--color-text-secondary)',
            }}
          >
            P
          </button>
          <button 
            onClick={() => setHeading(1)}
            className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${
              editor.isActive('heading', { level: 1 }) ? 'text-white' : ''
            }`}
            style={{
              backgroundColor: editor.isActive('heading', { level: 1 }) ? 'var(--color-bg-active)' : 'transparent',
              color: editor.isActive('heading', { level: 1 }) ? 'white' : 'var(--color-text-secondary)',
            }}
          >
            H1
          </button>
          <button 
            onClick={() => setHeading(2)}
            className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${
              editor.isActive('heading', { level: 2 }) ? 'text-white' : ''
            }`}
            style={{
              backgroundColor: editor.isActive('heading', { level: 2 }) ? 'var(--color-bg-active)' : 'transparent',
              color: editor.isActive('heading', { level: 2 }) ? 'white' : 'var(--color-text-secondary)',
            }}
          >
            H2
          </button>
          <button 
            onClick={() => setHeading(3)}
            className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${
              editor.isActive('heading', { level: 3 }) ? 'text-white' : ''
            }`}
            style={{
              backgroundColor: editor.isActive('heading', { level: 3 }) ? 'var(--color-bg-active)' : 'transparent',
              color: editor.isActive('heading', { level: 3 }) ? 'white' : 'var(--color-text-secondary)',
            }}
          >
            H3
          </button>
        </div>

        {/* Bold */}
        <button 
          onClick={toggleBold}
          className="px-2 py-1.5 text-xs font-bold rounded transition-all"
          style={{
            backgroundColor: editor.isActive('bold') ? 'var(--color-primary)' : 'transparent',
            color: editor.isActive('bold') ? 'white' : 'var(--color-text-secondary)',
          }}
          title="Chữ đậm (Ctrl+B)"
        >
          B
        </button>
        {/* Italic */}
        <button 
          onClick={toggleItalic}
          className="px-2 py-1.5 text-xs italic font-serif rounded transition-all"
          style={{
            backgroundColor: editor.isActive('italic') ? 'var(--color-primary)' : 'transparent',
            color: editor.isActive('italic') ? 'white' : 'var(--color-text-secondary)',
          }}
          title="Chữ nghiêng (Ctrl+I)"
        >
          I
        </button>
        {/* Underline */}
        <button 
          onClick={toggleUnderline}
          className="px-2 py-1.5 text-xs underline rounded transition-all"
          style={{
            backgroundColor: editor.isActive('underline') ? 'var(--color-primary)' : 'transparent',
            color: editor.isActive('underline') ? 'white' : 'var(--color-text-secondary)',
          }}
          title="Gạch chân (Ctrl+U)"
        >
          U
        </button>
        {/* Strike */}
        <button 
          onClick={toggleStrike}
          className="px-2 py-1.5 text-xs line-through rounded transition-all"
          style={{
            backgroundColor: editor.isActive('strike') ? 'var(--color-primary)' : 'transparent',
            color: editor.isActive('strike') ? 'white' : 'var(--color-text-secondary)',
          }}
          title="Gạch ngang (Ctrl+Shift+X)"
        >
          S
        </button>

        <div className="w-px h-5 divider mx-1.5" />

        {/* Alignment */}
        <button 
          onClick={() => setTextAlign('left')}
          className="p-1.5 rounded transition-all"
          style={{
            backgroundColor: (editor.isActive({ align: 'left' }) || (!editor.isActive({ align: 'center' }) && !editor.isActive({ align: 'right' }) && !editor.isActive({ align: 'justify' }))) ? 'var(--color-primary)' : 'transparent',
            color: (editor.isActive({ align: 'left' }) || (!editor.isActive({ align: 'center' }) && !editor.isActive({ align: 'right' }) && !editor.isActive({ align: 'justify' }))) ? 'white' : 'var(--color-text-secondary)',
          }}
          title="Căn trái (Ctrl+Shift+L)"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h12M4 18h16" />
          </svg>
        </button>
        <button 
          onClick={() => setTextAlign('center')}
          className="p-1.5 rounded transition-all"
          style={{
            backgroundColor: editor.isActive({ align: 'center' }) ? 'var(--color-primary)' : 'transparent',
            color: editor.isActive({ align: 'center' }) ? 'white' : 'var(--color-text-secondary)',
          }}
          title="Căn giữa (Ctrl+Shift+E)"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M4 18h16" />
          </svg>
        </button>
        <button 
          onClick={() => setTextAlign('right')}
          className="p-1.5 rounded transition-all"
          style={{
            backgroundColor: editor.isActive({ align: 'right' }) ? 'var(--color-primary)' : 'transparent',
            color: editor.isActive({ align: 'right' }) ? 'white' : 'var(--color-text-secondary)',
          }}
          title="Căn phải (Ctrl+Shift+R)"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M8 12h12M4 18h16" />
          </svg>
        </button>
        <button 
          onClick={() => setTextAlign('justify')}
          className="p-1.5 rounded transition-all"
          style={{
            backgroundColor: editor.isActive({ align: 'justify' }) ? 'var(--color-primary)' : 'transparent',
            color: editor.isActive({ align: 'justify' }) ? 'white' : 'var(--color-text-secondary)',
          }}
          title="Căn đều (Ctrl+Shift+J)"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="w-px h-5 bg-gray-800 mx-1.5" />

        {/* Page Orientation */}
        <button 
          onClick={togglePageOrientation}
          className="p-1.5 rounded transition-all"
          style={{
            color: 'var(--color-text-secondary)',
          }}
          title="Xoay khổ giấy (Portrait ⇄ Landscape)"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Clear Styles */}
      <button 
        onClick={clearFormatting}
        className="p-1.5 rounded text-[10px] font-bold border transition-all"
        style={{
          color: 'var(--color-text-secondary)',
          borderColor: 'var(--color-border)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)'
          e.currentTarget.style.color = 'var(--color-text-primary)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
          e.currentTarget.style.color = 'var(--color-text-secondary)'
        }}
        title="Xóa toàn bộ định dạng"
      >
        CLEAR FORMAT
      </button>
    </div>
  )
}
