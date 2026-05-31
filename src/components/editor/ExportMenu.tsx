import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useExport } from '@/hooks/useExport'
import type { Editor } from '@tiptap/core'

interface ExportMenuProps {
  editor: Editor | null
}

export default function ExportMenu({ editor }: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { isExporting, progress, format, error, exportPDF, exportDOCX, exportPNG } = useExport()

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleExport = async (fmt: 'pdf' | 'docx' | 'png') => {
    if (!editor || isExporting) return
    setIsOpen(false)

    const timestamp = new Date().toISOString().slice(0, 10)
    const filename = `yao-document-${timestamp}`

    switch (fmt) {
      case 'pdf':
        await exportPDF(editor, filename)
        break
      case 'docx':
        await exportDOCX(editor, filename)
        break
      case 'png':
        await exportPNG(editor, filename)
        break
    }
  }

  const formatLabel = (fmt: 'pdf' | 'docx' | 'png' | null) => {
    switch (fmt) {
      case 'pdf': return 'PDF (A4)'
      case 'docx': return 'DOCX (Word)'
      case 'png': return 'PNG (Ảnh)'
      default: return ''
    }
  }

  return (
    <div ref={menuRef} className="relative">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        style={{
          backgroundColor: isExporting ? 'rgba(79, 70, 229, 0.1)' : 'var(--color-bg-toolbar)',
          borderColor: isExporting ? 'rgba(79, 70, 229, 0.3)' : 'var(--color-border)',
          color: isExporting ? 'var(--color-primary-light)' : 'var(--color-text-secondary)',
          cursor: isExporting ? 'not-allowed' : 'pointer',
        }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border"
        title="Xuất tài liệu"
        onMouseEnter={(e) => {
          if (!isExporting) {
            e.currentTarget.style.borderColor = 'var(--color-border-light)'
            e.currentTarget.style.color = 'var(--color-text-primary)'
          }
        }}
        onMouseLeave={(e) => {
          if (!isExporting) {
            e.currentTarget.style.borderColor = 'var(--color-border)'
            e.currentTarget.style.color = 'var(--color-text-secondary)'
          }
        }}
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        {isExporting ? 'ĐANG XUẤT...' : 'XUẤT'}
        <svg className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              backgroundColor: 'var(--color-bg-secondary)',
              borderColor: 'var(--color-border)',
            }}
            className="absolute right-0 top-full mt-1.5 w-48 backdrop-blur-xl border rounded-lg shadow-2xl overflow-hidden z-[110] transition-all"
          >
            <div
              style={{
                borderBottomColor: 'var(--color-border)',
              }}
              className="px-2 py-1 border-b transition-all"
            >
              <span
                style={{ color: 'var(--color-text-tertiary)' }}
                className="text-[9px] font-medium transition-colors"
              >
                ĐỊNH DẠNG XUẤT
              </span>
            </div>

            <button
              onClick={() => handleExport('pdf')}
              style={{
                color: 'var(--color-text-secondary)',
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 transition-all text-left group"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)'
                e.currentTarget.style.color = 'var(--color-text-primary)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = 'var(--color-text-secondary)'
              }}
            >
              <svg
                style={{ color: 'var(--color-error)' }}
                className="w-4 h-4 shrink-0 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <div className="flex flex-col">
                <span className="text-xs transition-colors">PDF (A4)</span>
                <span
                  style={{ color: 'var(--color-text-tertiary)' }}
                  className="text-[9px] transition-colors"
                >
                  In trang giấy
                </span>
              </div>
            </button>

            <button
              onClick={() => handleExport('docx')}
              style={{
                color: 'var(--color-text-secondary)',
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 transition-all text-left group"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)'
                e.currentTarget.style.color = 'var(--color-text-primary)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = 'var(--color-text-secondary)'
              }}
            >
              <svg
                style={{ color: 'var(--color-info)' }}
                className="w-4 h-4 shrink-0 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div className="flex flex-col">
                <span className="text-xs transition-colors">DOCX (Word)</span>
                <span
                  style={{ color: 'var(--color-text-tertiary)' }}
                  className="text-[9px] transition-colors"
                >
                  Soạn thảo tiếp
                </span>
              </div>
            </button>

            <button
              onClick={() => handleExport('png')}
              style={{
                color: 'var(--color-text-secondary)',
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 transition-all text-left group"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)'
                e.currentTarget.style.color = 'var(--color-text-primary)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = 'var(--color-text-secondary)'
              }}
            >
              <svg
                style={{ color: 'var(--color-success)' }}
                className="w-4 h-4 shrink-0 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div className="flex flex-col">
                <span className="text-xs transition-colors">PNG (Ảnh)</span>
                <span
                  style={{ color: 'var(--color-text-tertiary)' }}
                  className="text-[9px] transition-colors"
                >
                  Ảnh chất lượng cao
                </span>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Export Progress Overlay */}
      <AnimatePresence>
        {isExporting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
            }}
            className="fixed inset-0 z-[200] flex items-center justify-center backdrop-blur-sm transition-all"
          >
            <div
              style={{
                backgroundColor: 'var(--color-bg-secondary)',
                borderColor: 'var(--color-border)',
              }}
              className="border rounded-xl p-6 w-80 shadow-2xl transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <svg
                  style={{ color: 'var(--color-primary-light)' }}
                  className="w-5 h-5 animate-spin shrink-0 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <div>
                  <p
                    style={{ color: 'var(--color-text-primary)' }}
                    className="text-sm font-medium transition-colors"
                  >
                    Đang xuất...
                  </p>
                  <p
                    style={{ color: 'var(--color-text-tertiary)' }}
                    className="text-[10px] transition-colors"
                  >
                    {formatLabel(format)}
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div
                style={{
                  backgroundColor: 'var(--color-bg-tertiary)',
                }}
                className="h-2 rounded-full overflow-hidden transition-all"
              >
                <motion.div
                  style={{
                    background: 'linear-gradient(to right, var(--color-primary), var(--color-primary-light))',
                  }}
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p
                style={{ color: 'var(--color-text-tertiary)' }}
                className="text-[10px] text-right mt-1 transition-colors"
              >
                {progress}%
              </p>

              {error && (
                <p
                  style={{ color: 'var(--color-error)' }}
                  className="mt-2 text-[10px] transition-colors"
                >
                  {error}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}