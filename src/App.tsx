import { useEffect, useState, useCallback } from 'react'
import { useEditorStore } from '@/editor/useEditorStore'
import YaoEditor from '@/editor/YaoEditor'
import CandidateBar from '@/components/editor/CandidateBar'
import DictionaryPanel from '@/components/dictionary/DictionaryPanel'
import ModeToggle from '@/components/editor/ModeToggle'
import LayoutModal from '@/components/editor/LayoutModal'
import ExportMenu from '@/components/editor/ExportMenu'
import TemplateModal from '@/components/editor/TemplateModal'
import OCRPanel from '@/components/ocr/OCRPanel'

function FooterStats() {
  const saveStatus = useEditorStore(state => state.saveStatus)
  const dict = useEditorStore(state => state.dict)

  const statusBadge = () => {
    switch (saveStatus) {
      case 'saved':
        return (
          <span className="flex items-center gap-1 text-green-400">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            ĐÃ LƯU
          </span>
        )
      case 'saving':
        return (
          <span className="flex items-center gap-1 text-yellow-400">
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
            ĐANG LƯU...
          </span>
        )
      default:
        return (
          <span className="flex items-center gap-1 text-gray-600">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-600" />
            CHƯA LƯU
          </span>
        )
    }
  }

  return (
    <footer className="h-8 border-t border-gray-800 bg-gray-900/50 flex items-center px-6 justify-between text-[10px] text-gray-500 font-mono shrink-0">
      <div className="flex gap-4">
        <span>LINES: 1</span>
        <span>CHARS: 0</span>
      </div>
      <div className="flex gap-4 items-center">
        {statusBadge()}
        <span className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          ENGINE READY
        </span>
        <span>DICT: {dict ? `${dict.size.toLocaleString()}_ENTRIES` : 'LOADING...'}</span>
      </div>
    </footer>
  )
}

/** Wraps ExportMenu, getting editor from Zustand store */
function ExportMenuWrapper() {
  const editor = useEditorStore(state => state.editor)
  return <ExportMenu editor={editor} />
}

function App() {
  const initDict = useEditorStore(state => state.initDict)

  const [isLayoutModalOpen, setIsLayoutModalOpen] = useState(false)
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)

  useEffect(() => {
    initDict()
  }, [initDict])

  // Keyboard shortcut for layout modal
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
      e.preventDefault()
      setIsLayoutModalOpen(true)
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <div className="h-screen bg-gray-950 flex flex-col font-sans selection:bg-indigo-500/30 overflow-hidden">
      {/* Header / Toolbar Area */}
      <header className="h-14 border-b border-gray-800 flex items-center px-6 justify-between bg-gray-900/80 backdrop-blur-xl sticky top-0 z-[100]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-white font-bold text-lg">Y</span>
          </div>
          <h1 className="text-white font-bold tracking-tight text-lg">YAO EDITOR <span className="text-indigo-500 text-[10px] ml-1 px-1.5 py-0.5 bg-indigo-500/10 rounded-full border border-indigo-500/20">V2</span></h1>
        </div>

        <div className="flex items-center gap-2">
          {/* ModeToggle — M12: unified mode/switching controls */}
          <ModeToggle />

          {/* M21 Template Modal Trigger */}
          <button
            onClick={() => setIsTemplateModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-200"
            title="Chọn mẫu tài liệu"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm12 0a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            MẪU
          </button>

          {/* Layout Modal Trigger */}
          <button
            onClick={() => setIsLayoutModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-200"
            title="Bố cục trang (Ctrl+Shift+L)"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm12 0a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            BỐ CỤC
          </button>

          {/* M22 ExportMenu — dropdown export with progress bar */}
          <ExportMenuWrapper />
        </div>
      </header>

      {/* Main Editor Area */}
      <main className="flex-1 min-h-0 relative flex flex-col bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-gray-950">
        <YaoEditor />

        {/* Professional CandidateBar */}
        <CandidateBar />

        {/* Dictionary Panel — slide-in right sidebar */}
        <DictionaryPanel />

        {/* OCR Panel — floating bottom-right panel */}
        <OCRPanel />
      </main>

      {/* Subtle Footer Stats with AutoSave badge */}
      <FooterStats />

      {/* Layout Modal */}
      <LayoutModal
        isOpen={isLayoutModalOpen}
        onClose={() => setIsLayoutModalOpen(false)}
      />

      {/* M21 Template Modal */}
      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
      />

      {/* Custom Scrollbar CSS */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1f2937;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #374151;
        }
      `}</style>
    </div>
  )
}

export default App