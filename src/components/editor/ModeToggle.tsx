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
      <div className="flex bg-gray-800 p-1 rounded-lg border border-gray-700/50">
        <button
          onClick={() => handleWritingModeChange('horizontal-tb')}
          className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
            writingMode === 'horizontal-tb'
              ? 'bg-gray-700 text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          NGANG
        </button>
        <button
          onClick={() => handleWritingModeChange('vertical-rl')}
          className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
            writingMode === 'vertical-rl'
              ? 'bg-gray-700 text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          DỌC
        </button>
      </div>

      {/* Grid Toggle */}
      <button
        onClick={toggleGrid}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
          showGrid
            ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-400 shadow-md shadow-indigo-500/5'
            : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
        }`}
        title={showGrid ? 'Tắt lưới ô' : 'Bật lưới ô'}
      >
        <div className={`w-1.5 h-1.5 rounded-sm ${showGrid ? 'bg-indigo-400' : 'bg-gray-600'}`} />
        {showGrid ? 'TẮT LƯỚI Ô' : 'BẬT LƯỚI Ô'}
      </button>

      <div className="w-px h-6 bg-gray-800 mx-2" />

      {/* IME Toggle */}
      <button
        onClick={toggleHanMode}
        className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all border ${
          isHanMode
            ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
            : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
        }`}
        title={isHanMode ? 'Chuyển sang ASCII' : 'Chuyển sang Hán-Dao'}
      >
        <div className={`w-2 h-2 rounded-full ${isHanMode ? 'bg-white animate-pulse' : 'bg-gray-600'}`} />
        {isHanMode ? 'HÁN-DAO MODE' : 'ASCII MODE'}
      </button>
    </div>
  )
}