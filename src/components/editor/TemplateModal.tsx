import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { listTemplates, seedTemplates, type TemplateEntry } from '@/db/dexie'
import { useEditorStore } from '@/editor/useEditorStore'

interface TemplateModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function TemplateModal({ isOpen, onClose }: TemplateModalProps) {
  const [templates, setTemplates] = useState<TemplateEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [confirmApply, setConfirmApply] = useState(false)
  const editor = useEditorStore(state => state.editor)
  const setMargins = useEditorStore(state => state.setMargins)

  useEffect(() => {
    if (isOpen) {
      loadTemplates()
    }
  }, [isOpen])

  const loadTemplates = async () => {
    setLoading(true)
    try {
      await seedTemplates()
      const entries = await listTemplates()
      setTemplates(entries)
    } catch {
      // Dexie not ready
    } finally {
      setLoading(false)
    }
  }

  const handleApply = () => {
    const template = templates.find(t => t.id === selectedId)
    if (!template || !editor) return

    try {
      const content = JSON.parse(template.content)
      editor.commands.setContent(content)

      // Apply writing mode
      if (template.writingMode) {
        editor.commands.setPageMode(template.writingMode)
      }

      // Reset margins to default for template
      setMargins({ top: 20, bottom: 20, left: 20, right: 20 })

      setConfirmApply(false)
      onClose()
    } catch {
      // Invalid JSON
    }
  }

  const iconForCategory = (category: string) => {
    switch (category) {
      case 'Cổ điển':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        )
      case 'Công văn':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      case 'Thơ':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        )
      case 'Luyện tập':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
          }}
          className="fixed inset-0 z-[150] flex items-center justify-center backdrop-blur-md p-4 transition-all"
          onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            style={{
              backgroundColor: 'var(--color-bg-secondary)',
              borderColor: 'var(--color-border)',
            }}
            className="border rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden transition-all"
          >
            {/* Header */}
            <div
              style={{
                borderBottomColor: 'var(--color-border)',
              }}
              className="px-6 py-4 border-b flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-3">
                <div
                  style={{
                    backgroundColor: 'rgba(245, 158, 11, 0.15)',
                  }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                >
                  <svg
                    style={{ color: 'var(--color-warning)' }}
                    className="w-4 h-4 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm12 0a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <h2
                  style={{ color: 'var(--color-text-primary)' }}
                  className="text-base font-bold transition-colors"
                >
                  CHỌN MẪU TÀI LIỆU
                </h2>
              </div>
              <button
                onClick={onClose}
                style={{
                  color: 'var(--color-text-tertiary)',
                }}
                className="p-1.5 rounded-lg transition-all"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)'
                  e.currentTarget.style.color = 'var(--color-text-secondary)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = 'var(--color-text-tertiary)'
                }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div
                    style={{
                      borderColor: 'rgba(245, 158, 11, 0.2)',
                      borderTopColor: 'var(--color-warning)',
                    }}
                    className="w-6 h-6 border-2 rounded-full animate-spin"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {templates.map((template) => {
                    const isSelected = selectedId === template.id
                    return (
                      <button
                        key={template.id}
                        onClick={() => setSelectedId(template.id ?? null)}
                        style={{
                          backgroundColor: isSelected ? 'rgba(245, 158, 11, 0.1)' : 'var(--color-bg-tertiary)',
                          borderColor: isSelected ? 'rgba(245, 158, 11, 0.4)' : 'var(--color-border)',
                        }}
                        className="text-left p-4 rounded-xl border transition-all group"
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.borderColor = 'var(--color-border-light)'
                            e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.borderColor = 'var(--color-border)'
                            e.currentTarget.style.backgroundColor = 'var(--color-bg-tertiary)'
                          }
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            style={{
                              backgroundColor: isSelected ? 'rgba(245, 158, 11, 0.2)' : 'var(--color-bg-hover)',
                              color: isSelected ? 'var(--color-warning)' : 'var(--color-text-tertiary)',
                            }}
                            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-all"
                          >
                            {iconForCategory(template.category)}
                          </div>
                          <div className="min-w-0">
                            <h3
                              style={{
                                color: isSelected ? 'var(--color-warning)' : 'var(--color-text-primary)',
                              }}
                              className="text-sm font-bold truncate transition-colors"
                            >
                              {template.title}
                            </h3>
                            <p
                              style={{ color: 'var(--color-text-tertiary)' }}
                              className="text-[10px] mt-0.5 line-clamp-2 transition-colors"
                            >
                              {template.description}
                            </p>
                            <span
                              style={{
                                backgroundColor: isSelected ? 'rgba(245, 158, 11, 0.15)' : 'var(--color-bg-hover)',
                                color: isSelected ? 'var(--color-warning)' : 'var(--color-text-tertiary)',
                              }}
                              className="inline-block mt-1.5 text-[9px] font-medium px-1.5 py-0.5 rounded transition-all"
                            >
                              {template.category}
                            </span>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                borderTopColor: 'var(--color-border)',
              }}
              className="px-6 py-4 border-t flex items-center justify-between transition-all"
            >
              <p
                style={{ color: 'var(--color-text-tertiary)' }}
                className="text-[10px] transition-colors"
              >
                {selectedId ? 'Mẫu sẽ thay thế nội dung hiện tại' : 'Chọn một mẫu để áp dụng'}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  style={{
                    color: 'var(--color-text-secondary)',
                  }}
                  className="px-4 py-2 rounded-lg text-xs transition-all"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--color-text-primary)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--color-text-secondary)'
                  }}
                >
                  HỦY
                </button>
                <button
                  onClick={() => setConfirmApply(true)}
                  disabled={!selectedId}
                  style={{
                    backgroundColor: selectedId ? 'rgba(245, 158, 11, 0.2)' : 'var(--color-bg-hover)',
                    borderColor: selectedId ? 'rgba(245, 158, 11, 0.4)' : 'var(--color-border)',
                    color: selectedId ? 'var(--color-warning)' : 'var(--color-text-tertiary)',
                    cursor: selectedId ? 'pointer' : 'not-allowed',
                  }}
                  className="px-4 py-2 rounded-lg text-xs font-bold border transition-all"
                  onMouseEnter={(e) => {
                    if (selectedId) {
                      e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.3)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedId) {
                      e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.2)'
                    }
                  }}
                >
                  ÁP DỤNG
                </button>
              </div>
            </div>

            {/* Confirm Overwrite Dialog */}
            <AnimatePresence>
              {confirmApply && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.95)',
                  }}
                  className="absolute inset-0 rounded-2xl flex items-center justify-center z-10 backdrop-blur-sm"
                >
                  <div className="text-center px-6">
                    <div
                      style={{
                        backgroundColor: 'rgba(245, 158, 11, 0.15)',
                      }}
                      className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                    >
                      <svg
                        style={{ color: 'var(--color-warning)' }}
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <p
                      style={{ color: 'var(--color-text-primary)' }}
                      className="text-sm mb-1"
                    >
                      Áp dụng mẫu?
                    </p>
                    <p
                      style={{ color: 'var(--color-text-tertiary)' }}
                      className="text-[10px] mb-4"
                    >
                      Nội dung hiện tại sẽ bị thay thế. Hành động này không thể hoàn tác.
                    </p>
                    <div className="flex items-center gap-2 justify-center">
                      <button
                        onClick={() => setConfirmApply(false)}
                        style={{
                          color: 'var(--color-text-secondary)',
                        }}
                        className="px-4 py-2 rounded-lg text-xs transition-all"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = 'var(--color-text-primary)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'var(--color-text-secondary)'
                        }}
                      >
                        HỦY
                      </button>
                      <button
                        onClick={handleApply}
                        style={{
                          backgroundColor: 'rgba(245, 158, 11, 0.2)',
                          borderColor: 'rgba(245, 158, 11, 0.4)',
                          color: 'var(--color-warning)',
                        }}
                        className="px-4 py-2 rounded-lg text-xs font-bold border transition-all"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.3)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.2)'
                        }}
                      >
                        ÁP DỤNG
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}