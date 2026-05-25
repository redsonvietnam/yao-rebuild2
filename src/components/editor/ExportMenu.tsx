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
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
          isExporting
            ? 'bg-indigo-600/10 border-indigo-500/30 text-indigo-400 cursor-not-allowed'
            : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-200'
        }`}
        title="Xuất tài liệu"
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
            className="absolute right-0 top-full mt-1.5 w-48 bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-lg shadow-2xl overflow-hidden z-[110]"
          >
            <div className="px-2 py-1 border-b border-gray-800">
              <span className="text-[9px] text-gray-500 font-medium">ĐỊNH DẠNG XUẤT</span>
            </div>

            <button
              onClick={() => handleExport('pdf')}
              className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-gray-800/80 transition-all text-left group"
            >
              <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <div className="flex flex-col">
                <span className="text-xs text-gray-300 group-hover:text-white">PDF (A4)</span>
                <span className="text-[9px] text-gray-600">In trang giấy</span>
              </div>
            </button>

            <button
              onClick={() => handleExport('docx')}
              className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-gray-800/80 transition-all text-left group"
            >
              <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div className="flex flex-col">
                <span className="text-xs text-gray-300 group-hover:text-white">DOCX (Word)</span>
                <span className="text-[9px] text-gray-600">Soạn thảo tiếp</span>
              </div>
            </button>

            <button
              onClick={() => handleExport('png')}
              className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-gray-800/80 transition-all text-left group"
            >
              <svg className="w-4 h-4 text-green-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div className="flex flex-col">
                <span className="text-xs text-gray-300 group-hover:text-white">PNG (Ảnh)</span>
                <span className="text-[9px] text-gray-600">Ảnh chất lượng cao</span>
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
            className="fixed inset-0 bg-gray-950/80 z-[200] flex items-center justify-center backdrop-blur-sm"
          >
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-80 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-5 h-5 text-indigo-400 animate-spin shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <div>
                  <p className="text-sm text-white font-medium">Đang xuất...</p>
                  <p className="text-[10px] text-gray-500">{formatLabel(format)}</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-[10px] text-gray-500 text-right mt-1">{progress}%</p>

              {error && (
                <p className="mt-2 text-[10px] text-red-400">{error}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}