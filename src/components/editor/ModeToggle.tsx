import { useEditorStore } from '@/editor/useEditorStore'

interface ModeToggleProps {
  className?: string
}

export default function ModeToggle({ className = '' }: ModeToggleProps) {
  const isHanMode = useEditorStore(state => state.isHanMode)
  const toggleHanMode = useEditorStore(state => state.toggleHanMode)
  const writingMode = useEditorStore(state => state.writingMode)
  const showGrid = useEditorStore(state => state.showGrid)
  const toggleGrid = useEditorStore(state => state.toggleGrid)

  const handleWritingModeChange = (mode: 'horizontal-tb' | 'vertical-rl') => {
    useEditorStore.setState({ writingMode: mode })
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Writing Mode Toggle */}
      <div
        style={{
          backgroundColor: 'var(--color-bg-toolbar)',
          borderColor: 'var(--color-border)',
        }}
        className="flex p-1 rounded-lg border transition-all"
      >
        <button
          onClick={() => handleWritingModeChange('horizontal-tb')}
          style={{
            backgroundColor: writingMode === 'horizontal-tb' ? 'var(--color-bg-active)' : 'transparent',
            color: writingMode === 'horizontal-tb' ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
          }}
          className="px-3 py-1 rounded-md text-[10px] font-bold transition-all shadow-sm"
          onMouseEnter={(e) => {
            if (writingMode !== 'horizontal-tb') {
              e.currentTarget.style.color = 'var(--color-text-secondary)'
            }
          }}
          onMouseLeave={(e) => {
            if (writingMode !== 'horizontal-tb') {
              e.currentTarget.style.color = 'var(--color-text-tertiary)'
            }
          }}
        >
          NGANG
        </button>
        <button
          onClick={() => handleWritingModeChange('vertical-rl')}
          style={{
            backgroundColor: writingMode === 'vertical-rl' ? 'var(--color-bg-active)' : 'transparent',
            color: writingMode === 'vertical-rl' ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
          }}
          className="px-3 py-1 rounded-md text-[10px] font-bold transition-all shadow-sm"
          onMouseEnter={(e) => {
            if (writingMode !== 'vertical-rl') {
              e.currentTarget.style.color = 'var(--color-text-secondary)'
            }
          }}
          onMouseLeave={(e) => {
            if (writingMode !== 'vertical-rl') {
              e.currentTarget.style.color = 'var(--color-text-tertiary)'
            }
          }}
        >
          DỌC
        </button>
      </div>

      {/* Grid Toggle */}
      <button
        onClick={toggleGrid}
        style={{
          backgroundColor: showGrid ? 'rgba(79, 70, 229, 0.2)' : 'var(--color-bg-toolbar)',
          borderColor: showGrid ? 'rgba(79, 70, 229, 0.4)' : 'var(--color-border)',
          color: showGrid ? 'var(--color-primary-light)' : 'var(--color-text-secondary)',
        }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border shadow-md"
        title={showGrid ? 'Tắt lưới ô' : 'Bật lưới ô'}
        onMouseEnter={(e) => {
          if (!showGrid) {
            e.currentTarget.style.borderColor = 'var(--color-border-light)'
          }
        }}
        onMouseLeave={(e) => {
          if (!showGrid) {
            e.currentTarget.style.borderColor = 'var(--color-border)'
          }
        }}
      >
        <div
          style={{
            backgroundColor: showGrid ? 'var(--color-primary-light)' : 'var(--color-text-tertiary)',
          }}
          className="w-1.5 h-1.5 rounded-sm transition-all"
        />
        {showGrid ? 'TẮT LƯỚI Ô' : 'BẬT LƯỚI Ô'}
      </button>

      <div
        style={{
          backgroundColor: 'var(--color-border)',
        }}
        className="w-px h-6 mx-2 transition-all"
      />

      {/* IME Toggle */}
      <button
        onClick={toggleHanMode}
        style={{
          backgroundColor: isHanMode ? 'var(--color-primary)' : 'var(--color-bg-toolbar)',
          borderColor: isHanMode ? 'var(--color-primary)' : 'var(--color-border)',
          color: isHanMode ? 'white' : 'var(--color-text-secondary)',
        }}
        className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all border shadow-lg"
        title={isHanMode ? 'Chuyển sang ASCII' : 'Chuyển sang Hán-Dao'}
        onMouseEnter={(e) => {
          if (!isHanMode) {
            e.currentTarget.style.borderColor = 'var(--color-border-light)'
          }
        }}
        onMouseLeave={(e) => {
          if (!isHanMode) {
            e.currentTarget.style.borderColor = 'var(--color-border)'
          }
        }}
      >
        <div
          style={{
            backgroundColor: isHanMode ? 'white' : 'var(--color-text-tertiary)',
          }}
          className={`w-2 h-2 rounded-full ${isHanMode ? 'animate-pulse' : ''} transition-all`}
        />
        {isHanMode ? 'HÁN-DAO MODE' : 'ASCII MODE'}
      </button>
    </div>
  )
}