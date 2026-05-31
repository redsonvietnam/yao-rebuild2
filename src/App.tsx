import { useEffect, useState, useCallback } from 'react'
import { useEditorStore } from '@/editor/useEditorStore'
import { useAppContext } from '@/contexts/AppContext'
import YaoEditor from '@/editor/YaoEditor'
import CandidateBar from '@/components/editor/CandidateBar'
import DictionaryPanel from '@/components/dictionary/DictionaryPanel'
import ThemeToggle from '@/components/common/ThemeToggle'
import LayoutModal from '@/components/editor/LayoutModal'
import TemplateModal from '@/components/editor/TemplateModal'
import OCRPanel from '@/components/ocr/OCRPanel'
import NotificationList from '@/components/common/NotificationList'
import Toolbar from '@/components/layout/Toolbar'

function FooterStats() {
  const saveStatus = useEditorStore(state => state.saveStatus)
  const dict = useEditorStore(state => state.dict)

  const statusBadge = () => {
    switch (saveStatus) {
      case 'saved':
        return (
          <span className="flex items-center gap-1.5 text-emerald-400">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 animate-pulse" />
            <span className="font-semibold">ĐÃ LƯU</span>
          </span>
        )
      case 'saving':
        return (
          <span className="flex items-center gap-1.5 text-amber-400">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 animate-pulse" />
            <span className="font-semibold">ĐANG LƯU...</span>
          </span>
        )
      default:
        return (
          <span className="flex items-center gap-1.5 text-gray-500">
            <div className="w-2 h-2 rounded-full bg-gray-600" />
            <span className="font-semibold">CHƯA LƯU</span>
          </span>
        )
    }
  }

  return (
    <footer className="h-10 flex items-center px-6 justify-between text-[11px] font-mono shrink-0 shadow-lg transition-colors" style={{
      borderTopColor: 'var(--color-border)',
      background: 'linear-gradient(to right, rgba(0,0,0,0.1), rgba(0,0,0,0.05))',
      color: 'var(--color-text-secondary)',
    }}>
      <div className="flex gap-6">
        <span className="flex items-center gap-2">
          <span style={{ color: 'var(--color-text-tertiary)' }}>LINES:</span>
          <span style={{ color: 'var(--color-text-secondary)', fontWeight: 'bold' }}>1</span>
        </span>
        <span className="flex items-center gap-2">
          <span style={{ color: 'var(--color-text-tertiary)' }}>CHARS:</span>
          <span style={{ color: 'var(--color-text-secondary)', fontWeight: 'bold' }}>0</span>
        </span>
      </div>
      <div className="flex gap-6 items-center">
        {statusBadge()}
        <span className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
          <span style={{ fontWeight: 'bold' }}>ENGINE READY</span>
        </span>
        <span className="flex items-center gap-2">
          <span style={{ color: 'var(--color-text-tertiary)' }}>DICT:</span>
          <span style={{ color: 'var(--color-text-secondary)', fontWeight: 'bold' }}>{dict ? `${dict.size.toLocaleString()}_ENTRIES` : 'LOADING...'}</span>
        </span>
      </div>
    </footer>
  )
}

function App() {
  const initDict = useEditorStore(state => state.initDict)
  const { activeTab, setActiveTab, isOCRSplitOpen, setIsOCRSplitOpen } = useAppContext()

  const [isLayoutModalOpen, setIsLayoutModalOpen] = useState(false)
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)

  useEffect(() => {
    initDict()
  }, [initDict])

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Layout modal: Ctrl+Shift+L
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
      e.preventDefault()
      setIsLayoutModalOpen(true)
    }
    // Dictionary: Ctrl+D
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
      e.preventDefault()
      setActiveTab(activeTab === 'dictionary' ? 'editor' : 'dictionary')
    }
    // OCR: Ctrl+Shift+O
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'O') {
      e.preventDefault()
      if (activeTab === 'editor') {
        setIsOCRSplitOpen(prev => !prev)
      }
    }
  }, [activeTab, setActiveTab, setIsOCRSplitOpen])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <div className="h-screen flex flex-col font-sans selection:bg-indigo-500/30 overflow-hidden transition-colors" style={{
      background: 'linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 50%, var(--color-bg-primary) 100%)',
    }}>
      {/* Header - Premium Glass Effect */}
      <header className="h-16 flex items-center px-8 justify-between sticky top-0 z-[100] shadow-xl transition-colors" style={{
        borderBottomColor: 'var(--color-border)',
        background: 'linear-gradient(to right, rgba(0,0,0,0.1), rgba(0,0,0,0.05))',
        backdropFilter: 'blur(20px)',
      }}>
        <div className="flex items-center gap-4">
          {/* Logo with gradient */}
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <span className="text-white font-bold text-xl">Y</span>
          </div>
          {/* Title with gradient text */}
          <div className="flex items-center gap-2">
            <h1 className="font-bold tracking-tight text-lg transition-colors" style={{ color: 'var(--color-text-primary)' }}>YAO EDITOR</h1>
            <span className="text-xs font-bold px-2.5 py-1 bg-gradient-to-r from-indigo-500/20 to-indigo-600/20 rounded-full border border-indigo-500/30 shadow-lg shadow-indigo-500/10 transition-colors" style={{ color: 'var(--color-primary-light)' }}>V2</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* OCR Button */}
          <button
            onClick={() => {
              if (activeTab === 'editor') {
                setIsOCRSplitOpen(prev => !prev)
              } else {
                setActiveTab('editor')
                setIsOCRSplitOpen(true)
              }
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all border active:scale-95"
            title="Nhận dạng ký tự (Ctrl+Shift+O)"
            style={{
              borderColor: isOCRSplitOpen ? 'var(--color-primary)' : 'var(--color-border)',
              backgroundColor: isOCRSplitOpen ? 'rgba(79, 70, 229, 0.1)' : 'var(--color-bg-toolbar)',
              color: isOCRSplitOpen ? 'var(--color-primary-light)' : 'var(--color-text-secondary)',
            }}
            onMouseEnter={(e) => {
              if (!isOCRSplitOpen) {
                e.currentTarget.style.color = 'var(--color-text-primary)'
                e.currentTarget.style.borderColor = 'var(--color-border-light)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isOCRSplitOpen) {
                e.currentTarget.style.color = 'var(--color-text-secondary)'
                e.currentTarget.style.borderColor = 'var(--color-border)'
              }
            }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            OCR
          </button>

          {/* Dictionary Button */}
          <button
            onClick={() => setActiveTab(activeTab === 'dictionary' ? 'editor' : 'dictionary')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all border active:scale-95"
            title="Từ điển (Ctrl+D)"
            style={{
              borderColor: activeTab === 'dictionary' ? 'var(--color-primary)' : 'var(--color-border)',
              backgroundColor: activeTab === 'dictionary' ? 'rgba(79, 70, 229, 0.1)' : 'var(--color-bg-toolbar)',
              color: activeTab === 'dictionary' ? 'var(--color-primary-light)' : 'var(--color-text-secondary)',
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'dictionary') {
                e.currentTarget.style.color = 'var(--color-text-primary)'
                e.currentTarget.style.borderColor = 'var(--color-border-light)'
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'dictionary') {
                e.currentTarget.style.color = 'var(--color-text-secondary)'
                e.currentTarget.style.borderColor = 'var(--color-border)'
              }
            }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            TỪ ĐIỂN
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </header>

      {/* Conditional Rendering based on activeTab */}
      {activeTab === 'dictionary' ? (
        /* Dictionary Full Screen View */
        <main className="flex-1 min-h-0 relative flex flex-col transition-colors" style={{
          background: 'linear-gradient(to br, var(--color-bg-secondary) 0%, var(--color-bg-tertiary) 50%, var(--color-bg-secondary) 100%)',
        }}>
          <DictionaryPanel 
            isOpen={true}
            onClose={() => setActiveTab('editor')}
          />
        </main>
      ) : (
        /* Editor View */
        <>
          {/* Toolbar - Editor Controls */}
          <Toolbar
            onTemplateClick={() => setIsTemplateModalOpen(true)}
            onLayoutClick={() => setIsLayoutModalOpen(true)}
          />

          {/* Main Editor Area - Premium Gradient Background */}
          <main className="flex-1 min-h-0 relative flex transition-colors" style={{
            background: 'linear-gradient(to br, var(--color-bg-secondary) 0%, var(--color-bg-tertiary) 50%, var(--color-bg-secondary) 100%)',
          }}>
            {/* Subtle animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/5 light:bg-indigo-500/3 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 dark:bg-emerald-500/5 light:bg-emerald-500/3 rounded-full blur-3xl" />
            </div>

            {/* Editor Section */}
            <div className={`relative z-10 flex flex-col transition-all ${isOCRSplitOpen ? 'flex-1' : 'w-full'}`}>
              <YaoEditor />

              {/* Professional CandidateBar */}
              <CandidateBar />
            </div>

            {/* OCR Split Panel */}
            {isOCRSplitOpen && (
              <div className="relative z-10 w-[420px] border-l transition-all" style={{
                borderLeftColor: 'var(--color-border)',
              }}>
                <OCRPanel 
                  isOpen={true}
                  onClose={() => setIsOCRSplitOpen(false)}
                />
              </div>
            )}
          </main>

          {/* Premium Footer Stats with AutoSave badge */}
          <FooterStats />
        </>
      )}

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

      {/* Notification stack - positioned fixed in top-right corner */}
      <NotificationList />

      {/* Premium Custom Scrollbar CSS */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(79, 70, 229, 0.6) 0%, rgba(67, 56, 202, 0.6) 100%);
          border-radius: 5px;
          border: 2px solid transparent;
          background-clip: padding-box;
          transition: background 150ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgba(99, 102, 241, 0.8) 0%, rgba(79, 70, 229, 0.8) 100%);
          background-clip: padding-box;
        }
      `}</style>
    </div>
  )
}

export default App