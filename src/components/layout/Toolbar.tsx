import ExportMenu from '@/components/editor/ExportMenu'
import { useEditorStore } from '@/editor/useEditorStore'

interface ToolbarProps {
  onTemplateClick: () => void
  onLayoutClick: () => void
}

export default function Toolbar({ onTemplateClick, onLayoutClick }: ToolbarProps) {
  const editor = useEditorStore(state => state.editor)
  const isHanMode = useEditorStore(state => state.isHanMode)
  const toggleHanMode = useEditorStore(state => state.toggleHanMode)
  const writingMode = useEditorStore(state => state.writingMode)
  const showGrid = useEditorStore(state => state.showGrid)
  const toggleGrid = useEditorStore(state => state.toggleGrid)

  const handleWritingModeChange = (mode: 'horizontal-tb' | 'vertical-rl') => {
    useEditorStore.setState({ writingMode: mode })
  }

  return (
    <div
      className="h-12 flex items-center px-6 gap-2 border-b transition-colors"
      style={{
        backgroundColor: 'var(--color-bg-toolbar)',
        borderBottomColor: 'var(--color-border)',
      }}
    >
      {/* Writing Direction */}
      <button
        onClick={() => handleWritingModeChange(writingMode === 'horizontal-tb' ? 'vertical-rl' : 'horizontal-tb')}
        style={{
          backgroundColor: 'var(--color-bg-toolbar)',
          borderColor: 'var(--color-border)',
          color: 'var(--color-text-secondary)',
        }}
        className="p-2 rounded-lg border transition-all hover:border-indigo-500/30"
        title={writingMode === 'horizontal-tb' ? 'Chuyển sang dọc' : 'Chuyển sang ngang'}
      >
        {writingMode === 'horizontal-tb' ? (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4v16M12 4v16M18 4v16" />
          </svg>
        )}
      </button>

      {/* Grid Toggle */}
      <button
        onClick={toggleGrid}
        style={{
          backgroundColor: showGrid ? 'rgba(79, 70, 229, 0.15)' : 'var(--color-bg-toolbar)',
          borderColor: showGrid ? 'rgba(79, 70, 229, 0.4)' : 'var(--color-border)',
          color: showGrid ? 'var(--color-primary-light)' : 'var(--color-text-secondary)',
        }}
        className="p-2 rounded-lg border transition-all"
        title={showGrid ? 'Tắt lưới ô' : 'Bật lưới ô'}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
        </svg>
      </button>

      {/* IME Mode Toggle */}
      <button
        onClick={toggleHanMode}
        style={{
          backgroundColor: isHanMode ? 'var(--color-primary)' : 'var(--color-bg-toolbar)',
          borderColor: isHanMode ? 'var(--color-primary)' : 'var(--color-border)',
          color: isHanMode ? 'white' : 'var(--color-text-secondary)',
        }}
        className="p-2 rounded-lg border transition-all"
        title={isHanMode ? 'Chuyển sang ASCII' : 'Chuyển sang Hán-Dao'}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      </button>

      <div
        style={{ backgroundColor: 'var(--color-border)' }}
        className="w-px h-6 mx-1"
      />

      {/* Template Button */}
      <button
        onClick={onTemplateClick}
        className="p-2 rounded-lg border transition-all"
        title="Chọn mẫu tài liệu"
        style={{
          borderColor: 'var(--color-border)',
          backgroundColor: 'var(--color-bg-toolbar)',
          color: 'var(--color-text-secondary)',
        }}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </button>

      {/* Layout Button */}
      <button
        onClick={onLayoutClick}
        className="p-2 rounded-lg border transition-all"
        title="Bố cục trang (Ctrl+Shift+L)"
        style={{
          borderColor: 'var(--color-border)',
          backgroundColor: 'var(--color-bg-toolbar)',
          color: 'var(--color-text-secondary)',
        }}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm12 0a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      </button>

      {/* Export Menu */}
      <ExportMenu editor={editor} />
    </div>
  )
}
