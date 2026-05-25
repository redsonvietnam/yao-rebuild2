import { useRef, useState, useEffect, useCallback } from 'react'
import { createWorker } from 'tesseract.js'
import { useEditorStore } from '@/editor/useEditorStore'

interface HandwritingCanvasProps {
  onRecognized?: (characters: Array<{ hanzi: string; confidence: number }>) => void
  className?: string
}

interface StrokePoint {
  x: number
  y: number
}

export default function HandwritingCanvas({ onRecognized, className = '' }: HandwritingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [strokes, setStrokes] = useState<StrokePoint[][]>([])
  const [currentStroke, setCurrentStroke] = useState<StrokePoint[]>([])
  const [undoStack, setUndoStack] = useState<StrokePoint[][]>([])
  const [brushSize, setBrushSize] = useState(4)
  const [brushColor, setBrushColor] = useState('#e0e7ff')
  const [isRecognizing, setIsRecognizing] = useState(false)
  const [recognizedText, setRecognizedText] = useState<string>('')
  const [error, setError] = useState<string>('')

  const dict = useEditorStore(state => state.dict)

  // Canvas sizing
  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current
      const container = containerRef.current
      if (!canvas || !container) return

      const rect = container.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`

      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.scale(dpr, dpr)
      }
      redrawAll()
    }

    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  // Redraw all strokes
  const redrawAll = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr)

    const drawStroke = (points: StrokePoint[]) => {
      if (points.length < 2) {
        if (points.length === 1) {
          ctx.beginPath()
          ctx.arc(points[0].x, points[0].y, brushSize / 2, 0, Math.PI * 2)
          ctx.fillStyle = brushColor
          ctx.fill()
        }
        return
      }

      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)
      for (let i = 1; i < points.length; i++) {
        const xc = (points[i].x + points[i - 1].x) / 2
        const yc = (points[i].y + points[i - 1].y) / 2
        ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc)
      }
      ctx.strokeStyle = brushColor
      ctx.lineWidth = brushSize
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.stroke()
    }

    strokes.forEach(drawStroke)
    drawStroke(currentStroke)
  }, [strokes, currentStroke, brushSize, brushColor])

  useEffect(() => {
    redrawAll()
  }, [strokes, currentStroke, brushColor, brushSize, redrawAll])

  // Drawing handlers
  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()

    if ('touches' in e) {
      const touch = e.touches[0]
      return { x: touch.clientX - rect.left, y: touch.clientY - rect.top }
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    setIsDrawing(true)
    setError('')
    const pos = getPos(e)
    setCurrentStroke([pos])
  }

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    if (!isDrawing) return
    const pos = getPos(e)
    setCurrentStroke(prev => [...prev, pos])
  }

  const handleEnd = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    if (!isDrawing) return
    setIsDrawing(false)
    if (currentStroke.length > 0) {
      setStrokes(prev => [...prev, currentStroke])
      setUndoStack([])
    }
    setCurrentStroke([])
  }

  // Clear canvas
  const handleClear = () => {
    setStrokes([])
    setCurrentStroke([])
    setUndoStack([])
    setRecognizedText('')
    setError('')
  }

  // Undo last stroke
  const handleUndo = () => {
    if (strokes.length === 0) return
    const lastStroke = strokes[strokes.length - 1]
    setUndoStack(prev => [...prev, lastStroke])
    setStrokes(prev => prev.slice(0, -1))
  }

  // Redo
  const handleRedo = () => {
    if (undoStack.length === 0) return
    const restoredStroke = undoStack[undoStack.length - 1]
    setUndoStack(prev => prev.slice(0, -1))
    setStrokes(prev => [...prev, restoredStroke])
  }

  // Recognize via Tesseract.js OCR on canvas image
  const handleRecognize = async () => {
    if (strokes.length === 0) {
      setError('Vẽ một ký tự trước khi nhận dạng')
      return
    }

    setIsRecognizing(true)
    setError('')
    setRecognizedText('')

    try {
      const canvas = canvasRef.current
      if (!canvas) return

      // Get the image data from canvas
      const imageData = canvas.toDataURL('image/png')

      // Run Tesseract OCR for Chinese (chi_sim)
      const worker = await createWorker('chi_sim')
      const result = await worker.recognize(imageData)
      await worker.terminate()

      const text = result.data.text.replace(/\s+/g, '').trim()

      if (!text) {
        setError('Không nhận dạng được ký tự. Thử vẽ rõ hơn.')
        setIsRecognizing(false)
        return
      }

      setRecognizedText(text)

      // Parse recognized characters
      const characters = text.split('').map(ch => ({
        hanzi: ch,
        confidence: result.data.confidence,
      }))

      onRecognized?.(characters)
    } catch (err) {
      console.error('OCR failed:', err)
      setError('Lỗi nhận dạng. Thử lại hoặc tra cứu thủ công.')
    } finally {
      setIsRecognizing(false)
    }
  }

  // Look up recognized text in dict
  const handleDictionaryLookup = (char: string) => {
    if (!dict) return
    // Search dict for this character
    for (const [key, candidates] of dict) {
      const match = candidates.find(c => c.hanzi === char)
      if (match) {
        return { hanzi: match.hanzi, pinyin: match.pinyin || key, weight: match.weight }
      }
    }
    return null
  }

  const recognizedChars = recognizedText ? recognizedText.split('').map(ch => ({
    char: ch,
    dictInfo: handleDictionaryLookup(ch),
  })) : []

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Controls Bar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-800/50 bg-gray-900/50 rounded-t-lg shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-500 font-medium tracking-wide">BÚT</span>

          {/* Brush Size */}
          <div className="flex items-center gap-1">
            {[2, 4, 6, 10].map(size => (
              <button
                key={size}
                onClick={() => setBrushSize(size)}
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                  brushSize === size
                    ? 'bg-indigo-600/30 border border-indigo-500/40'
                    : 'hover:bg-gray-800 border border-transparent'
                }`}
              >
                <div
                  className="rounded-full bg-gray-300"
                  style={{ width: `${Math.max(2, size * 0.7)}px`, height: `${Math.max(2, size * 0.7)}px` }}
                />
              </button>
            ))}
          </div>

          <div className="w-px h-4 bg-gray-700 mx-1" />

          {/* Color Picker */}
          <div className="flex items-center gap-1">
            {['#e0e7ff', '#f5f5f4', '#fef3c7', '#d1fae5', '#c7d2fe'].map(color => (
              <button
                key={color}
                onClick={() => setBrushColor(color)}
                className={`w-4 h-4 rounded-full transition-all ${
                  brushColor === color ? 'ring-2 ring-indigo-400 ring-offset-1 ring-offset-gray-900' : ''
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Undo */}
          <button
            onClick={handleUndo}
            disabled={strokes.length === 0}
            className="p-1.5 rounded hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed text-gray-400 hover:text-white transition-colors"
            title="Hoàn tác"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a5 5 0 015 5v2M3 10l4-4M3 10l4 4" />
            </svg>
          </button>

          {/* Redo */}
          <button
            onClick={handleRedo}
            disabled={undoStack.length === 0}
            className="p-1.5 rounded hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed text-gray-400 hover:text-white transition-colors"
            title="Làm lại"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a5 5 0 00-5 5v2m15-7l-4-4m4 4l-4 4" />
            </svg>
          </button>

          <div className="w-px h-4 bg-gray-700 mx-1" />

          {/* Clear */}
          <button
            onClick={handleClear}
            className="p-1.5 rounded hover:bg-red-900/30 text-gray-400 hover:text-red-400 transition-colors"
            title="Xóa hết"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div
        ref={containerRef}
        className="relative flex-1 min-h-[200px] bg-gray-950/80 rounded-b-lg overflow-hidden border border-gray-800/50 border-t-0"
      >
        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        <canvas
          ref={canvasRef}
          className="absolute inset-0 cursor-crosshair touch-none"
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />

        {/* Empty state hint */}
        {strokes.length === 0 && !isDrawing && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-gray-600 text-xs">Vẽ ký tự Hán vào đây...</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 mt-2">
        <button
          onClick={handleRecognize}
          disabled={isRecognizing || strokes.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg text-xs font-bold transition-all disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
        >
          {isRecognizing ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-indigo-300/30 border-t-indigo-300 rounded-full animate-spin" />
              ĐANG NHẬN DẠNG...
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              NHẬN DẠNG KÝ TỰ
            </>
          )}
        </button>

        {strokes.length > 0 && (
          <span className="text-[10px] text-gray-600">{strokes.length} nét vẽ</span>
        )}
      </div>

      {/* Error display */}
      {error && (
        <div className="mt-2 px-3 py-2 bg-red-900/20 border border-red-800/30 rounded-lg text-[11px] text-red-400">
          {error}
        </div>
      )}

      {/* Recognized Results */}
      {recognizedChars.length > 0 && (
        <div className="mt-3 bg-gray-800/50 border border-gray-700/50 rounded-lg p-3">
          <div className="text-[10px] text-gray-500 font-medium mb-2 uppercase tracking-wider">
            KẾT QUẢ NHẬN DẠNG
          </div>
          <div className="flex flex-wrap gap-2">
            {recognizedChars.map(({ char, dictInfo }, i) => (
              <div
                key={i}
                className="group relative flex flex-col items-center"
              >
                <div className="w-12 h-12 bg-gray-900/80 border border-gray-700 rounded-lg flex items-center justify-center hover:border-indigo-500/50 transition-all cursor-pointer">
                  <span className="text-2xl text-white font-medium">{char}</span>
                </div>

                {dictInfo && (
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-900/95 border border-gray-700 rounded-md px-2 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    <span className="text-[10px] text-indigo-300 font-medium">{dictInfo.pinyin}</span>
                    <span className="text-[9px] text-gray-500 ml-1">w:{dictInfo.weight}</span>
                  </div>
                )}

                {!dictInfo && (
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-900/95 border border-gray-700 rounded-md px-2 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    <span className="text-[10px] text-gray-500">Không có trong từ điển</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-3 pt-2 border-t border-gray-700/50">
            <div className="text-[10px] text-gray-500 font-medium mb-1">
              Văn bản thô: <span className="text-gray-300 font-mono">{recognizedText}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}