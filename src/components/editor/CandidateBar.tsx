import { useEditorStore } from '@/editor/useEditorStore'
import { motion, AnimatePresence } from 'framer-motion'

export default function CandidateBar() {
  const preedit = useEditorStore(state => state.preedit)
  const transformedPreedit = useEditorStore(state => state.transformedPreedit)
  const candidates = useEditorStore(state => state.candidates)
  const selectedIdx = useEditorStore(state => state.selectedIdx)
  const caretCoords = useEditorStore(state => state.caretCoords)
  const writingMode = useEditorStore(state => state.writingMode)
  const selectCandidate = useEditorStore(state => state.selectCandidate)

  if (!preedit || !caretCoords) return null

  // Calculate position with offsets
  const isVertical = writingMode === 'vertical-rl'
  
  // Basic offset to avoid covering the character being typed
  const top = caretCoords.y + (isVertical ? 0 : 30)
  const left = caretCoords.left + (isVertical ? -120 : 0) // Shift left in vertical mode

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 5, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.1, ease: 'easeOut' }}
        style={{ 
          top: `${top}px`, 
          left: `${left}px`,
        }}
        className="fixed z-[9999] bg-gray-900/95 backdrop-blur-md border border-gray-700/50 rounded-lg shadow-2xl overflow-hidden min-w-[200px]"
      >
        {/* Preedit Header */}
        <div className="bg-gray-800/50 px-3 py-1.5 border-b border-gray-700/50 flex justify-between items-center">
          <span className="text-indigo-400 font-mono text-xs font-bold tracking-wider uppercase">
            {transformedPreedit || preedit}
          </span>
          <span className="text-[10px] text-gray-500 font-medium">IME</span>
        </div>

        {/* Candidate List */}
        <div className="p-1 max-h-60 overflow-y-auto">
          {candidates.length > 0 ? (
            <div className="flex flex-col gap-0.5">
              {candidates.slice(0, 10).map((c, i) => (
                <button
                  key={`${c.hanzi}-${i}`}
                  onClick={() => {
                    selectCandidate(i)
                    // We can't easily trigger the editor commit from here without passing editor ref,
                    // but for now, clicking can just update selection.
                    // Actually, the IME hook handles Enter/Space.
                  }}
                  className={`flex items-center px-3 py-1.5 rounded-md transition-all group ${
                    i === selectedIdx 
                      ? 'bg-indigo-600 text-white shadow-lg' 
                      : 'hover:bg-gray-800 text-gray-300 hover:text-white'
                  }`}
                >
                  <span className={`text-[10px] font-bold w-4 ${
                    i === selectedIdx ? 'text-indigo-200' : 'text-gray-600'
                  }`}>
                    {i + 1}
                  </span>
                  <span className="text-lg font-medium leading-none ml-1">{c.hanzi}</span>
                  <span className={`ml-auto text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity ${
                     i === selectedIdx ? 'text-indigo-300' : 'text-gray-500'
                  }`}>
                    {c.pinyin}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-3 py-3 text-center">
              <span className="text-gray-500 text-xs italic">No candidates found</span>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="px-3 py-1 bg-gray-950/50 flex justify-between items-center border-t border-gray-800/50">
           <span className="text-[9px] text-gray-600 font-medium">Space/Enter to select</span>
           {candidates.length > 10 && (
             <span className="text-[9px] text-gray-500">+{candidates.length - 10} more</span>
           )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
