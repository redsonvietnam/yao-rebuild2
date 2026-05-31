import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createWorker } from 'tesseract.js'
import { simpleHash, getCachedOCR, cacheOCR } from '@/db/dexie'
import { useAppContext } from '@/contexts/AppContext'

interface OCRResult {
  text: string
  confidence: number
  lines: string[]
}

interface OCRPanelProps {
  isOpen?: boolean
  onClose?: () => void
}

export default function OCRPanel({ isOpen = false, onClose }: OCRPanelProps) {
  const [image, setImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<OCRResult | null>(null)
  const [error, setError] = useState('')
  const [language, setLanguage] = useState<'chi_sim' | 'vie' | 'eng'>('chi_sim')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)
  const { addNotification } = useAppContext()

  const reset = useCallback(() => {
    setImage(null)
    setResult(null)
    setError('')
    setProgress(0)
  }, [])

  const handleFileSelect = useCallback((file: File) => {
    setError('')
    setResult(null)

    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn file ảnh (PNG, JPG, WebP)')
      return
    }

    if (file.size > 20 * 1024 * 1024) {
      setError('File quá lớn. Kích thước tối đa: 20MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setImage(e.target?.result as string)
    }
    reader.onerror = () => setError('Không thể đọc file')
    reader.readAsDataURL(file)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }, [handleFileSelect])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handlePaste = useCallback(async (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile()
        if (file) handleFileSelect(file)
        break
      }
    }
  }, [handleFileSelect])

  const handleRecognize = async () => {
    if (!image) return

    setIsProcessing(true)
    setError('')
    setProgress(0)
    setResult(null)

    try {
      // Check Dexie OCR cache first
      const hash = simpleHash(image)
      const cached = await getCachedOCR(hash)
      if (cached) {
        setResult({
          text: cached.recognizedText,
          confidence: cached.confidence,
          lines: cached.recognizedText.split('\n').filter(Boolean),
        })
        setIsProcessing(false)
        return
      }

      // Run Tesseract OCR with progress logging
      const worker = await createWorker(language, undefined, {
        logger: (info: { progress?: number; status?: string }) => {
          if (info.progress) {
            setProgress(Math.round(info.progress * 100))
          }
        },
      })

      const ocrResult = await worker.recognize(image)
      await worker.terminate()

      const text = ocrResult.data.text.trim()
      const lines = text.split('\n').filter(Boolean)
      const confidence = ocrResult.data.confidence || 0

      const finalResult: OCRResult = { text, confidence, lines }
      setResult(finalResult)

      // Cache the result
      try {
        await cacheOCR(hash, text, confidence)
      } catch {
        // ignore cache errors
      }

      // Show success notification
      addNotification({
        type: 'info',
        message: 'Nhận dạng hoàn tất',
        duration: 4000
      })

    } catch (err) {
      console.error('OCR error:', err)
      setError('Lỗi xử lý ảnh. Thử lại với ảnh khác.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCopyText = () => {
    if (result?.text) {
      navigator.clipboard.writeText(result.text)
    }
  }

  const languageLabels: Record<string, string> = {
    chi_sim: 'CHỮ HÁN',
    vie: 'TIẾNG VIỆT',
    eng: 'TIẾNG ANH',
  }

  return (
    <AnimatePresence>
        {isOpen && (
          <div className="h-full w-full bg-gray-900/95 backdrop-blur-xl flex flex-col shadow-2xl transition-colors">
            {/* Header */}
            <div className="shrink-0 px-4 py-3 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h2 className="text-sm font-bold text-white tracking-tight">NHẬN DẠNG KÝ TỰ</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={reset}
                  className="text-[10px] text-gray-500 hover:text-gray-300 transition-colors"
                >
                  XÓA
                </button>
                {onClose && (
                  <button
                    onClick={onClose}
                    className="p-1 rounded hover:bg-gray-800 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Language Selector */}
            <div className="shrink-0 px-4 py-2 border-b border-gray-800/50 flex items-center gap-2 bg-gray-900/30">
              <span className="text-[10px] text-gray-500 font-medium">NGÔN NGỮ:</span>
              {Object.entries(languageLabels).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setLanguage(key as typeof language)}
                  className={`px-2 py-1 rounded text-[10px] font-medium transition-all ${
                    language === key
                      ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/40'
                      : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800 border border-transparent'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4">
              {/* Paste Hint */}
              {!image && !result && (
                <p className="text-[10px] text-gray-600 text-center mb-3">
                  Bạn cũng có thể <kbd className="px-1 py-0.5 bg-gray-800 rounded text-gray-400 font-mono">Ctrl+V</kbd> để dán ảnh từ clipboard
                </p>
              )}

              {/* Drop Zone / Image Preview */}
              <div
                ref={dropZoneRef}
                tabIndex={0}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onPaste={handlePaste}
                className={`relative rounded-xl border-2 border-dashed transition-all mb-3 ${
                  image
                    ? 'border-gray-700 bg-gray-800/30 p-0 overflow-hidden'
                    : 'border-gray-700/50 hover:border-indigo-500/30 bg-gray-800/20 p-8 cursor-pointer flex flex-col items-center justify-center gap-2 min-h-[160px]'
                }`}
                onClick={() => !image && fileInputRef.current?.click()}
              >
                {image ? (
                  <>
                    <img
                      src={image}
                      alt="Preview"
                      className="w-full max-h-[200px] object-contain"
                    />
                    <button
                      onClick={(e) => { e.stopPropagation(); reset() }}
                      className="absolute top-2 right-2 p-1 rounded-full bg-black/60 hover:bg-black/80 text-gray-400 hover:text-white transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </>
                ) : (
                  <>
                    <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-xs text-gray-500 font-medium">Kéo thả ảnh vào đây hoặc nhấn để chọn</p>
                    <p className="text-[10px] text-gray-600">PNG, JPG, WebP — tối đa 20MB</p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files?.[0]
                    if (file) handleFileSelect(file)
                  }}
                  className="hidden"
                />
              </div>

              {/* Progress */}
              {isProcessing && (
                <div className="bg-gray-800/50 rounded-lg p-3 mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-gray-400 font-medium">ĐANG NHẬN DẠNG...</span>
                    <span className="text-[10px] text-indigo-400 font-mono">{progress}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-indigo-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-3 mb-3">
                  <p className="text-xs text-red-400">{error}</p>
                </div>
              )}

              {/* Results */}
              {result && (
                <div className="space-y-3">
                  {/* Confidence Badge */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-500">ĐỘ TIN CẬY:</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            result.confidence > 80 ? 'bg-green-500' : result.confidence > 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${result.confidence}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono">{Math.round(result.confidence)}%</span>
                    </div>
                  </div>

                  {/* Recognized Text */}
                  <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">VĂN BẢN NHẬN DẠNG</span>
                      <button
                        onClick={handleCopyText}
                        className="text-[10px] text-gray-500 hover:text-indigo-400 transition-colors"
                      >
                        SAO CHÉP
                      </button>
                    </div>

                    {/* Multi-line display */}
                    <div className="space-y-1 max-h-[200px] overflow-y-auto">
                      {result.lines.map((line, i) => (
                        <div key={i} className="text-sm text-gray-200 leading-relaxed font-medium">
                          {line}
                        </div>
                      ))}
                    </div>

                    {/* Raw text */}
                    <div className="mt-2 pt-2 border-t border-gray-700/50">
                      <span className="text-[10px] text-gray-600 font-mono break-all">{result.text}</span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopyText}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gray-800 border border-gray-700 rounded-lg text-xs text-gray-300 hover:text-white hover:border-gray-600 transition-all"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      SAO CHÉP
                    </button>
                    <button
                      onClick={reset}
                      className="flex-1 py-2 bg-gray-800 border border-gray-700 rounded-lg text-xs text-gray-400 hover:text-white hover:border-gray-600 transition-all"
                    >
                      ẢNH MỚI
                    </button>
                  </div>
                </div>
              )}

              {/* Empty state (no image, no result) */}
              {!image && !result && !isProcessing && (
                <div className="text-center py-6">
                  <svg className="w-10 h-10 text-gray-700 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-600 text-xs">Chưa có ảnh để nhận dạng</p>
                  <p className="text-gray-700 text-[10px] mt-1">Kéo thả, chọn file hoặc dán ảnh</p>
                </div>
              )}
            </div>

            {/* Action Button */}
            {image && !isProcessing && !result && (
              <div className="shrink-0 px-4 pb-4">
                <button
                  onClick={handleRecognize}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-indigo-500/20"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  NHẬN DẠNG KÝ TỰ (OCR)
                </button>
              </div>
            )}
          </div>
        )}
      </AnimatePresence>
  )
}
