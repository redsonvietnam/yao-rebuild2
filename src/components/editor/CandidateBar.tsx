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
  const left = (caretCoords as any).left + (isVertical ? -120 : 0) // Shift left in vertical mode

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
          backgroundColor: 'var(--color-bg-secondary)',
          borderColor: 'var(--color-border)',
        }}
        className="fixed z-[9999] backdrop-blur-md border rounded-lg shadow-2xl overflow-hidden min-w-[200px] transition-all"
      >
        {/* Preedit Header */}
        <div
          style={{
            backgroundColor: 'var(--color-bg-tertiary)',
            borderBottomColor: 'var(--color-border)',
          }}
          className="px-3 py-1.5 border-b flex justify-between items-center transition-all"
        >
          <span
            style={{ color: 'var(--color-primary-light)' }}
            className="font-mono text-xs font-bold tracking-wider uppercase transition-colors"
          >
            {transformedPreedit || preedit}
          </span>
          <span
            style={{ color: 'var(--color-text-tertiary)' }}
            className="text-[10px] font-medium transition-colors"
          >
            IME
          </span>
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
                  }}
                  style={{
                    backgroundColor: i === selectedIdx ? 'var(--color-primary)' : 'transparent',
                    color: i === selectedIdx ? 'white' : 'var(--color-text-secondary)',
                  }}
                  className="flex items-center px-3 py-1.5 rounded-md transition-all group shadow-lg"
                  onMouseEnter={(e) => {
                    if (i !== selectedIdx) {
                      e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)'
                      e.currentTarget.style.color = 'var(--color-text-primary)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (i !== selectedIdx) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.color = 'var(--color-text-secondary)'
                    }
                  }}
                >
                  <span
                    style={{
                      color: i === selectedIdx ? 'rgba(255, 255, 255, 0.7)' : 'var(--color-text-tertiary)',
                    }}
                    className="text-[10px] font-bold w-4 transition-colors"
                  >
                    {i + 1}
                  </span>
                  <span className="text-lg font-medium leading-none ml-1">{c.hanzi}</span>
                  <span
                    style={{
                      color: i === selectedIdx ? 'rgba(255, 255, 255, 0.8)' : 'var(--color-text-tertiary)',
                    }}
                    className="ml-auto text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {c.pinyin}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-3 py-3 text-center">
              <span
                style={{ color: 'var(--color-text-tertiary)' }}
                className="text-xs italic transition-colors"
              >
                No candidates found
              </span>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div
          style={{
            backgroundColor: 'var(--color-bg-tertiary)',
            borderTopColor: 'var(--color-border)',
          }}
          className="px-3 py-1 flex justify-between items-center border-t transition-all"
        >
           <span
             style={{ color: 'var(--color-text-tertiary)' }}
             className="text-[9px] font-medium transition-colors"
           >
             Space/Enter to select
           </span>
           {candidates.length > 10 && (
             <span
               style={{ color: 'var(--color-text-tertiary)' }}
               className="text-[9px] transition-colors"
             >
               +{candidates.length - 10} more
             </span>
           )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
