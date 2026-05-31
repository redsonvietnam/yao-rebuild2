import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { addOverride, listOverrides, updateOverride, deleteOverride, clearAllOverrides, type UserDictEntry } from '@/db/dexie'
import { useEditorStore } from '@/editor/useEditorStore'
import { useAppContext } from '@/contexts/AppContext'

export default function OverrideManager() {
  const [overrides, setOverrides] = useState<UserDictEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false)
  const refreshUserDict = useEditorStore(state => state.refreshUserDict)
  const { addNotification } = useAppContext()

  // Form state
  const [formKey, setFormKey] = useState('')
  const [formHanzi, setFormHanzi] = useState('')
  const [formPinyin, setFormPinyin] = useState('')
  const [formWeight, setFormWeight] = useState('100')
  const [formError, setFormError] = useState('')

  const loadOverrides = useCallback(async () => {
    try {
      const entries = await listOverrides()
      setOverrides(entries)
    } catch {
      // Dexie not ready
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadOverrides()
  }, [loadOverrides])

  const resetForm = () => {
    setFormKey('')
    setFormHanzi('')
    setFormPinyin('')
    setFormWeight('100')
    setFormError('')
    setEditingId(null)
    setShowForm(false)
  }

  const validateForm = (): boolean => {
    if (!formKey.trim()) {
      setFormError('Vui lòng nhập khóa (pinyin đầu vào)')
      return false
    }
    if (!formHanzi.trim()) {
      setFormError('Vui lòng nhập chữ Hán')
      return false
    }
    if (!formPinyin.trim()) {
      setFormError('Vui lòng nhập phiên âm')
      return false
    }
    const weight = parseInt(formWeight, 10)
    if (isNaN(weight) || weight < 1 || weight > 9999) {
      setFormError('Trọng số phải là số từ 1 đến 9999')
      return false
    }
    return true
  }

  const handleAdd = async () => {
    if (!validateForm()) return
    try {
      await addOverride({
        key: formKey.trim(),
        hanzi: formHanzi.trim(),
        pinyin: formPinyin.trim(),
        weight: parseInt(formWeight, 10),
      })
      resetForm()
      await loadOverrides()
      // Refresh the IME merged dict
      await refreshUserDict()
      addNotification({
        type: 'success',
        message: 'Đã thêm mục từ',
        duration: 3000,
      })
    } catch (err) {
      setFormError('Lỗi khi thêm mục. Có thể trùng khóa?')
      addNotification({
        type: 'error',
        message: 'Lỗi khi thêm mục từ',
        duration: 5000,
      })
    }
  }

  const handleEdit = async () => {
    if (editingId === null || !validateForm()) return
    try {
      await updateOverride(editingId, {
        key: formKey.trim(),
        hanzi: formHanzi.trim(),
        pinyin: formPinyin.trim(),
        weight: parseInt(formWeight, 10),
      })
      resetForm()
      await loadOverrides()
      await refreshUserDict()
      addNotification({
        type: 'success',
        message: 'Đã cập nhật mục từ',
        duration: 3000,
      })
    } catch {
      setFormError('Lỗi khi cập nhật mục.')
      addNotification({
        type: 'error',
        message: 'Lỗi khi cập nhật mục từ',
        duration: 5000,
      })
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteOverride(id)
      await loadOverrides()
      await refreshUserDict()
      addNotification({
        type: 'success',
        message: 'Đã xóa mục từ',
        duration: 3000,
      })
    } catch {
      addNotification({
        type: 'error',
        message: 'Lỗi khi xóa mục từ',
        duration: 5000,
      })
    }
  }

  const handleClearAll = async () => {
    try {
      await clearAllOverrides()
      await loadOverrides()
      await refreshUserDict()
      setConfirmDeleteAll(false)
      addNotification({
        type: 'success',
        message: 'Đã xóa tất cả mục cá nhân',
        duration: 3000,
      })
    } catch {
      addNotification({
        type: 'error',
        message: 'Lỗi khi xóa tất cả mục',
        duration: 5000,
      })
    }
  }

  const openEditForm = (entry: UserDictEntry) => {
    setFormKey(entry.key)
    setFormHanzi(entry.hanzi)
    setFormPinyin(entry.pinyin)
    setFormWeight(String(entry.weight))
    setEditingId(entry.id ?? null)
    setShowForm(true)
    setFormError('')
  }

  return (
    <div className="p-3 flex flex-col gap-3 h-full">
      {/* Header actions */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-gray-500 font-medium">
          {overrides.length} mục cá nhân
        </span>
        <div className="flex items-center gap-1">
          {overrides.length > 0 && (
            <button
              onClick={() => setConfirmDeleteAll(true)}
              className="text-[9px] text-gray-600 hover:text-red-400 transition-colors px-1"
            >
              XÓA HẾT
            </button>
          )}
          <button
            onClick={() => { resetForm(); setShowForm(!showForm) }}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold transition-all ${
              showForm
                ? 'bg-indigo-600/20 border border-indigo-500/40 text-indigo-400'
                : 'bg-gray-800 border border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-200'
            }`}
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            THÊM
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50 flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] text-gray-500 mb-0.5 block">KHÓA (gõ)</label>
                  <input
                    type="text"
                    value={formKey}
                    onChange={e => setFormKey(e.target.value)}
                    placeholder="vd: nhaxn"
                    className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-gray-500 mb-0.5 block">CHỮ HÁN</label>
                  <input
                    type="text"
                    value={formHanzi}
                    onChange={e => setFormHanzi(e.target.value)}
                    placeholder="vd: 人"
                    className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-gray-500 mb-0.5 block">PHIÊN ÂM</label>
                  <input
                    type="text"
                    value={formPinyin}
                    onChange={e => setFormPinyin(e.target.value)}
                    placeholder="vd: nhân"
                    className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-gray-500 mb-0.5 block">TRỌNG SỐ</label>
                  <input
                    type="number"
                    value={formWeight}
                    onChange={e => setFormWeight(e.target.value)}
                    min="1"
                    max="9999"
                    className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50"
                  />
                </div>
              </div>

              {formError && (
                <p className="text-[10px] text-red-400">{formError}</p>
              )}

              <div className="flex items-center gap-2 justify-end">
                <button
                  onClick={resetForm}
                  className="px-2 py-1 rounded text-[10px] text-gray-500 hover:text-gray-300 transition-colors"
                >
                  HỦY
                </button>
                <button
                  onClick={editingId !== null ? handleEdit : handleAdd}
                  className="px-3 py-1 rounded bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-[10px] font-bold hover:bg-indigo-600/50 transition-all"
                >
                  {editingId !== null ? 'CẬP NHẬT' : 'THÊM'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Override List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-4 h-4 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          </div>
        ) : overrides.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-8 h-8 text-gray-700 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <p className="text-gray-500 text-xs">Chưa có mục cá nhân nào</p>
            <p className="text-gray-600 text-[10px] mt-1">Thêm mục riêng để tùy chỉnh từ điển</p>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {overrides.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-800/60 transition-all group"
              >
                <span className="text-lg font-medium text-white min-w-[24px] text-center">
                  {entry.hanzi}
                </span>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[10px] text-gray-300 truncate">{entry.pinyin}</span>
                  <span className="text-[9px] text-gray-600 truncate">gõ: {entry.key}</span>
                </div>
                <span className="text-[9px] text-gray-600 font-mono shrink-0">w:{entry.weight}</span>

                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={() => openEditForm(entry)}
                    className="p-1 rounded hover:bg-gray-700 text-gray-500 hover:text-indigo-400 transition-colors"
                    title="Sửa"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => entry.id !== undefined && handleDelete(entry.id)}
                    className="p-1 rounded hover:bg-gray-700 text-gray-500 hover:text-red-400 transition-colors"
                    title="Xóa"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirm Delete All Modal */}
      <AnimatePresence>
        {confirmDeleteAll && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gray-950/90 rounded-lg flex items-center justify-center z-10"
          >
            <div className="text-center px-4">
              <p className="text-sm text-gray-300 mb-2">Xóa tất cả mục cá nhân?</p>
              <p className="text-[10px] text-gray-500 mb-3">Hành động này không thể hoàn tác</p>
              <div className="flex items-center gap-2 justify-center">
                <button
                  onClick={() => setConfirmDeleteAll(false)}
                  className="px-3 py-1 rounded text-[10px] text-gray-400 hover:text-gray-200 transition-colors"
                >
                  HỦY
                </button>
                <button
                  onClick={handleClearAll}
                  className="px-3 py-1 rounded bg-red-600/30 border border-red-500/40 text-red-300 text-[10px] font-bold hover:bg-red-600/50 transition-all"
                >
                  XÓA HẾT
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}