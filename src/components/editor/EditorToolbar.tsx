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

  const clearFormatting = () => editor.chain().focus().clearNodes().unsetAllMarks().run()
  const undo = () => editor.chain().focus().undo().run()
  const redo = () => editor.chain().focus().redo().run()

  return (
    <div className="shrink-0 h-12 border-b border-gray-800 bg-gray-900/95 backdrop-blur-md flex items-center px-6 gap-4 z-[90] justify-between">
      {/* Undo / Redo & Basic formatting */}
      <div className="flex items-center gap-1">
        {/* Undo */}
        <button 
          onClick={undo}
          disabled={!editor.can().undo()}
          className="p-1.5 rounded hover:bg-gray-800 text-gray-400 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
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
          className="p-1.5 rounded hover:bg-gray-800 text-gray-400 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          title="Làm lại (Ctrl+Y)"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2m18-12l-6 6m6-6l-6-6" />
          </svg>
        </button>

        <div className="w-px h-5 bg-gray-800 mx-1.5" />

        {/* Headings */}
        <div className="flex bg-gray-800/80 p-0.5 rounded-lg border border-gray-700/50 mr-2">
          <button 
            onClick={() => setHeading(0)}
            className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${
              editor.isActive('paragraph') ? 'bg-gray-750 text-white' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            P
          </button>
          <button 
            onClick={() => setHeading(1)}
            className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${
              editor.isActive('heading', { level: 1 }) ? 'bg-gray-750 text-white' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            H1
          </button>
          <button 
            onClick={() => setHeading(2)}
            className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${
              editor.isActive('heading', { level: 2 }) ? 'bg-gray-750 text-white' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            H2
          </button>
          <button 
            onClick={() => setHeading(3)}
            className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${
              editor.isActive('heading', { level: 3 }) ? 'bg-gray-750 text-white' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            H3
          </button>
        </div>

        {/* Bold */}
        <button 
          onClick={toggleBold}
          className={`px-2 py-1.5 text-xs font-bold rounded transition-all ${
            editor.isActive('bold') ? 'bg-indigo-600 text-white' : 'hover:bg-gray-800 text-gray-400'
          }`}
          title="Chữ đậm (Ctrl+B)"
        >
          B
        </button>
        {/* Italic */}
        <button 
          onClick={toggleItalic}
          className={`px-2 py-1.5 text-xs italic font-serif rounded transition-all ${
            editor.isActive('italic') ? 'bg-indigo-600 text-white' : 'hover:bg-gray-800 text-gray-400'
          }`}
          title="Chữ nghiêng (Ctrl+I)"
        >
          I
        </button>
        {/* Underline */}
        <button 
          onClick={toggleUnderline}
          className={`px-2 py-1.5 text-xs underline rounded transition-all ${
            editor.isActive('underline') ? 'bg-indigo-600 text-white' : 'hover:bg-gray-800 text-gray-400'
          }`}
          title="Gạch chân (Ctrl+U)"
        >
          U
        </button>
        {/* Strike */}
        <button 
          onClick={toggleStrike}
          className={`px-2 py-1.5 text-xs line-through rounded transition-all ${
            editor.isActive('strike') ? 'bg-indigo-600 text-white' : 'hover:bg-gray-800 text-gray-400'
          }`}
          title="Gạch ngang (Ctrl+Shift+X)"
        >
          S
        </button>

        <div className="w-px h-5 bg-gray-800 mx-1.5" />

        {/* Alignment */}
        <button 
          onClick={() => setTextAlign('left')}
          className={`p-1.5 rounded transition-all ${
            editor.isActive({ align: 'left' }) || (!editor.isActive({ align: 'center' }) && !editor.isActive({ align: 'right' }) && !editor.isActive({ align: 'justify' }))
              ? 'bg-indigo-600 text-white' 
              : 'hover:bg-gray-800 text-gray-400'
          }`}
          title="Căn trái (Ctrl+Shift+L)"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h12M4 18h16" />
          </svg>
        </button>
        <button 
          onClick={() => setTextAlign('center')}
          className={`p-1.5 rounded transition-all ${
            editor.isActive({ align: 'center' }) ? 'bg-indigo-600 text-white' : 'hover:bg-gray-800 text-gray-400'
          }`}
          title="Căn giữa (Ctrl+Shift+E)"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M4 18h16" />
          </svg>
        </button>
        <button 
          onClick={() => setTextAlign('right')}
          className={`p-1.5 rounded transition-all ${
            editor.isActive({ align: 'right' }) ? 'bg-indigo-600 text-white' : 'hover:bg-gray-800 text-gray-400'
          }`}
          title="Căn phải (Ctrl+Shift+R)"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M8 12h12M4 18h16" />
          </svg>
        </button>
        <button 
          onClick={() => setTextAlign('justify')}
          className={`p-1.5 rounded transition-all ${
            editor.isActive({ align: 'justify' }) ? 'bg-indigo-600 text-white' : 'hover:bg-gray-800 text-gray-400'
          }`}
          title="Căn đều (Ctrl+Shift+J)"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Clear Styles */}
      <button 
        onClick={clearFormatting}
        className="p-1.5 rounded hover:bg-gray-800 text-gray-500 hover:text-gray-300 transition-all text-[10px] font-bold border border-gray-800/80 hover:border-gray-700"
        title="Xóa toàn bộ định dạng"
      >
        CLEAR FORMAT
      </button>
    </div>
  )
}
