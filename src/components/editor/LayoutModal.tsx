import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEditorStore } from '@/editor/useEditorStore'

interface LayoutModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LayoutModal({ isOpen, onClose }: LayoutModalProps) {
  const marginLeft = useEditorStore(state => state.marginLeft)
  const marginRight = useEditorStore(state => state.marginRight)
  const marginTop = useEditorStore(state => state.marginTop)
  const marginBottom = useEditorStore(state => state.marginBottom)
  const pageSize = useEditorStore(state => state.pageSize)
  const setMargins = useEditorStore(state => state.setMargins)

  // Local state for form
  const [localLeft, setLocalLeft] = useState(marginLeft)
  const [localRight, setLocalRight] = useState(marginRight)
  const [localTop, setLocalTop] = useState(marginTop)
  const [localBottom, setLocalBottom] = useState(marginBottom)
  const [localPageSize, setLocalPageSize] = useState(pageSize)
  const [activePreset, setActivePreset] = useState<string>('custom')

  // Sync local state from store when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalLeft(marginLeft)
      setLocalRight(marginRight)
      setLocalTop(marginTop)
      setLocalBottom(marginBottom)
      setLocalPageSize(pageSize)
      // Detect preset
      if (marginLeft === 20 && marginRight === 20 && marginTop === 20 && marginBottom === 20) {
        setActivePreset('standard')
      } else if (marginLeft === 15 && marginRight === 15 && marginTop === 15 && marginBottom === 15) {
        setActivePreset('narrow')
      } else if (marginLeft === 30 && marginRight === 30 && marginTop === 30 && marginBottom === 30) {
        setActivePreset('wide')
      } else if (marginLeft === 25 && marginRight === 20 && marginTop === 20 && marginBottom === 20) {
        setActivePreset('book-binding')
      } else {
        setActivePreset('custom')
      }
    }
  }, [isOpen, marginLeft, marginRight, marginTop, marginBottom, pageSize])

  const applyPreset = (preset: string) => {
    setActivePreset(preset)
    switch (preset) {
      case 'standard':
        setLocalLeft(20); setLocalRight(20); setLocalTop(20); setLocalBottom(20)
        break
      case 'narrow':
        setLocalLeft(15); setLocalRight(15); setLocalTop(15); setLocalBottom(15)
        break
      case 'wide':
        setLocalLeft(30); setLocalRight(30); setLocalTop(30); setLocalBottom(30)
        break
      case 'book-binding':
        setLocalLeft(25); setLocalRight(20); setLocalTop(20); setLocalBottom(20)
        break
      case 'traditional':
        setLocalLeft(35); setLocalRight(25); setLocalTop(25); setLocalBottom(25)
        break
    }
  }

  const handleApply = () => {
    setMargins({
      left: localLeft,
      right: localRight,
      top: localTop,
      bottom: localBottom,
    })
    if (localPageSize !== pageSize) {
      useEditorStore.setState({ pageSize: localPageSize })
    }
    onClose()
  }

  const handleReset = () => {
    setLocalLeft(20); setLocalRight(20); setLocalTop(20); setLocalBottom(20)
    setLocalPageSize('A4')
    setActivePreset('standard')
    setMargins({ left: 20, right: 20, top: 20, bottom: 20 })
    useEditorStore.setState({ pageSize: 'A4' })
    onClose()
  }

  // Page dimension constants (mm)
  const pageWidth = localPageSize === 'A4' ? 210 : localPageSize === 'A3' ? 297 : 210
  const pageHeight = localPageSize === 'A4' ? 297 : localPageSize === 'A3' ? 420 : 297

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
            }}
            className="fixed inset-0 backdrop-blur-sm z-[200]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              borderColor: 'rgba(55, 65, 81, 0.5)',
            }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[210] w-[480px] border rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div
              style={{
                borderBottomColor: 'var(--color-border)',
              }}
              className="px-5 py-4 border-b flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  style={{ color: 'var(--color-primary-light)' }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm12 0a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
                <h2
                  style={{ color: 'var(--color-text-primary)' }}
                  className="text-sm font-bold tracking-tight"
                >
                  BỐ CỤC TRANG
                </h2>
              </div>
              <button
                onClick={onClose}
                style={{
                  color: 'var(--color-text-tertiary)',
                }}
                className="p-1 rounded transition-colors"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(55, 65, 81, 0.5)'
                  e.currentTarget.style.color = 'var(--color-text-secondary)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = 'var(--color-text-tertiary)'
                }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-5 flex flex-col gap-5">
              {/* Page Size Selector */}
              <div>
                <label
                  style={{ color: 'var(--color-text-tertiary)' }}
                  className="text-[10px] font-medium mb-2 block uppercase tracking-wider"
                >
                  Khổ giấy
                </label>
                <div className="flex gap-2">
                  {(['A4', 'A3'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => setLocalPageSize(size)}
                      style={{
                        backgroundColor: localPageSize === size ? 'rgba(79, 70, 229, 0.2)' : 'rgba(30, 41, 59, 0.5)',
                        borderColor: localPageSize === size ? 'rgba(79, 70, 229, 0.4)' : 'rgba(55, 65, 81, 0.5)',
                        color: localPageSize === size ? 'var(--color-primary-light)' : 'var(--color-text-tertiary)',
                      }}
                      className="flex-1 py-2 px-3 rounded-lg text-xs font-bold border transition-all hover:border-gray-600"
                      onMouseEnter={(e) => {
                        if (localPageSize !== size) {
                          e.currentTarget.style.borderColor = 'rgba(75, 85, 99, 0.7)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (localPageSize !== size) {
                          e.currentTarget.style.borderColor = 'rgba(55, 65, 81, 0.5)'
                        }
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Presets */}
              <div>
                <label
                  style={{ color: 'var(--color-text-tertiary)' }}
                  className="text-[10px] font-medium mb-2 block uppercase tracking-wider"
                >
                  Mẫu lề có sẵn
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {[
                    { id: 'standard', label: 'Chuẩn' },
                    { id: 'narrow', label: 'Hẹp' },
                    { id: 'wide', label: 'Rộng' },
                    { id: 'book-binding', label: 'Đóng sách' },
                    { id: 'traditional', label: 'Cổ điển' },
                  ].map(preset => (
                    <button
                      key={preset.id}
                      onClick={() => applyPreset(preset.id)}
                      style={{
                        backgroundColor: activePreset === preset.id ? 'rgba(79, 70, 229, 0.2)' : 'rgba(30, 41, 59, 0.5)',
                        borderColor: activePreset === preset.id ? 'rgba(79, 70, 229, 0.4)' : 'rgba(55, 65, 81, 0.5)',
                        color: activePreset === preset.id ? 'var(--color-primary-light)' : 'var(--color-text-tertiary)',
                      }}
                      className="py-1.5 px-2 rounded-md text-[10px] font-medium border transition-all"
                      onMouseEnter={(e) => {
                        if (activePreset !== preset.id) {
                          e.currentTarget.style.color = 'var(--color-text-secondary)'
                          e.currentTarget.style.borderColor = 'rgba(75, 85, 99, 0.7)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (activePreset !== preset.id) {
                          e.currentTarget.style.color = 'var(--color-text-tertiary)'
                          e.currentTarget.style.borderColor = 'rgba(55, 65, 81, 0.5)'
                        }
                      }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Margin Inputs */}
              <div>
                <label
                  style={{ color: 'var(--color-text-tertiary)' }}
                  className="text-[10px] font-medium mb-2 block uppercase tracking-wider"
                >
                  Lề (mm) — tùy chỉnh
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label
                      style={{ color: 'var(--color-text-tertiary)' }}
                      className="text-[9px] font-medium"
                    >
                      Lề trên
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={80}
                      value={localTop}
                      onChange={e => { setLocalTop(Number(e.target.value)); setActivePreset('custom') }}
                      style={{
                        backgroundColor: 'var(--color-bg-tertiary)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text-primary)',
                      }}
                      className="rounded-lg px-3 py-1.5 text-sm focus:outline-none w-full transition-all"
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(79, 70, 229, 0.5)'
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)'
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'var(--color-border)'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label
                      style={{ color: 'var(--color-text-tertiary)' }}
                      className="text-[9px] font-medium"
                    >
                      Lề dưới
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={80}
                      value={localBottom}
                      onChange={e => { setLocalBottom(Number(e.target.value)); setActivePreset('custom') }}
                      style={{
                        backgroundColor: 'var(--color-bg-tertiary)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text-primary)',
                      }}
                      className="rounded-lg px-3 py-1.5 text-sm focus:outline-none w-full transition-all"
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(79, 70, 229, 0.5)'
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)'
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'var(--color-border)'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label
                      style={{ color: 'var(--color-text-tertiary)' }}
                      className="text-[9px] font-medium"
                    >
                      Lề trái
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={80}
                      value={localLeft}
                      onChange={e => { setLocalLeft(Number(e.target.value)); setActivePreset('custom') }}
                      style={{
                        backgroundColor: 'var(--color-bg-tertiary)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text-primary)',
                      }}
                      className="rounded-lg px-3 py-1.5 text-sm focus:outline-none w-full transition-all"
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(79, 70, 229, 0.5)'
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)'
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'var(--color-border)'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label
                      style={{ color: 'var(--color-text-tertiary)' }}
                      className="text-[9px] font-medium"
                    >
                      Lề phải
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={80}
                      value={localRight}
                      onChange={e => { setLocalRight(Number(e.target.value)); setActivePreset('custom') }}
                      style={{
                        backgroundColor: 'var(--color-bg-tertiary)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text-primary)',
                      }}
                      className="rounded-lg px-3 py-1.5 text-sm focus:outline-none w-full transition-all"
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(79, 70, 229, 0.5)'
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)'
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'var(--color-border)'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div>
                <label
                  style={{ color: 'var(--color-text-tertiary)' }}
                  className="text-[10px] font-medium mb-2 block uppercase tracking-wider"
                >
                  Xem trước bố cục
                </label>
                <div className="flex justify-center">
                  <div
                    style={{
                      backgroundColor: 'rgba(30, 41, 59, 0.5)',
                      borderColor: 'var(--color-border)',
                      width: `${Math.min(pageWidth / 2, 200)}px`,
                      height: `${Math.min(pageHeight / 2, 260)}px`,
                    }}
                    className="relative rounded-lg overflow-hidden border"
                  >
                    {/* Margins visualization */}
                    <div
                      style={{
                        borderColor: 'rgba(79, 70, 229, 0.3)',
                        backgroundColor: 'rgba(30, 41, 59, 0.3)',
                        top: `${(localTop / pageHeight) * 100}%`,
                        right: `${(localRight / pageWidth) * 100}%`,
                        bottom: `${(localBottom / pageHeight) * 100}%`,
                        left: `${(localLeft / pageWidth) * 100}%`,
                      }}
                      className="absolute border"
                    >
                      {/* Inline text preview */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-50">
                        <div className="flex flex-col gap-0.5">
                          {Array.from({ length: Math.min(Math.floor((pageHeight - localTop - localBottom) / 12), 12) }).map((_, i) => (
                            <div
                              key={i}
                              style={{
                                backgroundColor: 'rgba(107, 114, 128, 0.5)',
                                width: `${Math.max(30, ((pageWidth - localLeft - localRight) / pageWidth) * 180)}px`,
                              }}
                              className="h-[2px] rounded"
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Labels */}
                    <span
                      style={{ color: 'var(--color-text-tertiary)' }}
                      className="absolute top-1 left-1/2 -translate-x-1/2 text-[7px] font-mono"
                    >
                      {localTop}mm
                    </span>
                    <span
                      style={{ color: 'var(--color-text-tertiary)' }}
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[7px] font-mono"
                    >
                      {localBottom}mm
                    </span>
                    <span
                      style={{ color: 'var(--color-text-tertiary)' }}
                      className="absolute left-1 top-1/2 -translate-y-1/2 text-[7px] font-mono"
                    >
                      {localLeft}
                    </span>
                    <span
                      style={{ color: 'var(--color-text-tertiary)' }}
                      className="absolute right-1 top-1/2 -translate-y-1/2 text-[7px] font-mono"
                    >
                      {localRight}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                borderTopColor: 'var(--color-border)',
              }}
              className="px-5 py-3 border-t flex items-center justify-between gap-3"
            >
              <button
                onClick={handleReset}
                style={{
                  color: 'var(--color-text-tertiary)',
                }}
                className="px-3 py-1.5 text-[10px] transition-colors font-medium"
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--color-error-light)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--color-text-tertiary)'
                }}
              >
                ĐẶT LẠI MẶC ĐỊNH
              </button>
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  style={{
                    color: 'var(--color-text-secondary)',
                    borderColor: 'rgba(55, 65, 81, 0.5)',
                  }}
                  className="px-4 py-1.5 rounded-lg text-xs font-medium border transition-all"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--color-text-primary)'
                    e.currentTarget.style.backgroundColor = 'rgba(55, 65, 81, 0.5)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--color-text-secondary)'
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  HỦY
                </button>
                <button
                  onClick={handleApply}
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-text-primary)',
                    borderColor: 'rgba(79, 70, 229, 0.3)',
                    boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.2)',
                  }}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold border transition-all"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-primary-light)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-primary)'
                  }}
                >
                  ÁP DỤNG
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
