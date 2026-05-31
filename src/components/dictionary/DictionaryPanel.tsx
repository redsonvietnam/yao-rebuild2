import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEditorStore } from '@/editor/useEditorStore'
import { db } from '@/db/dexie'
import HandwritingCanvas from '@/components/dictionary/HandwritingCanvas'
import OverrideManager from '@/components/dictionary/OverrideManager'
import { explainCharacter, type CharacterExplanation } from '@/services/geminiService'
import { useAppContext } from '@/contexts/AppContext'

interface DictResult {
  hanzi: string
  pinyin: string
  meaning?: string
  weight: number
}

interface SearchHistoryItem {
  id?: number
  query: string
  searchedAt: number
}

interface DictionaryPanelProps {
  isOpen?: boolean
  onClose?: () => void
}

export default function DictionaryPanel({ isOpen = false, onClose }: DictionaryPanelProps) {
  const { addNotification } = useAppContext()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<DictResult[]>([])
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<SearchHistoryItem[]>([])
  const [activeTab, setActiveTab] = useState<'search' | 'history' | 'details' | 'handwriting' | 'override'>('search')
  const [selectedChar, setSelectedChar] = useState<DictResult | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const dict = useEditorStore(state => state.dict)

  // M19 GemAI state
  const [aiLoading, setAiLoading] = useState(false)
  const [aiExplanation, setAiExplanation] = useState<CharacterExplanation | null>(null)

  const handleAIExplain = async () => {
    if (!selectedChar || aiLoading) return
    setAiLoading(true)
    setAiExplanation(null)
    try {
      const result = await explainCharacter(selectedChar.hanzi)
      setAiExplanation(result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định'
      // Check if it's a timeout error
      if (errorMessage === 'Gemini timeout') {
        addNotification({
          type: 'warning',
          message: 'Gemini không phản hồi, thử lại sau',
          duration: 6000
        })
      } else {
        addNotification({
          type: 'error',
          message: `Gemini lỗi: ${errorMessage}`,
          duration: 5000
        })
      }
    } finally {
      setAiLoading(false)
    }
  }

  // Load search history on mount
  useEffect(() => {
    if (isOpen) {
      loadHistory()
    }
  }, [isOpen])

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  const loadHistory = async () => {
    try {
      const items = await db.searchHistory.orderBy('searchedAt').reverse().limit(20).toArray()
      setHistory(items)
    } catch {
      // Dexie may not be ready
    }
  }

  const saveToHistory = async (q: string) => {
    try {
      await db.searchHistory.add({ query: q, searchedAt: Date.now() })
    } catch {
      // ignore
    }
  }

  const handleSearch = useCallback(async (q: string) => {
    const trimmed = q.trim()
    if (!trimmed) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      // Check Dexie cache first
      const cached = await db.dictCache.where('query').equals(trimmed).first()
      if (cached) {
        setResults(JSON.parse(cached.results))
        setLoading(false)
        return
      }

      // Search in-memory dict (from IME engine)
      if (dict) {
        const found: DictResult[] = []
        // Normalize: remove diacritics and lowercase
        const normalizedQuery = trimmed.toLowerCase()
          .normalize('NFD').replace(/[\u0300-\u036f]/g, '')

        for (const [key, candidates] of dict) {
          const normalizedKey = key.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          
          // Match: exact pinyin, hanzi equals, or pinyin contains
          if (
            normalizedKey === normalizedQuery ||
            normalizedKey.includes(normalizedQuery) ||
            candidates.some(c => 
              c.hanzi === trimmed ||
              (c.pinyin && c.pinyin.toLowerCase().includes(trimmed.toLowerCase()))
            )
          ) {
            found.push(...candidates.map(c => ({
              hanzi: c.hanzi,
              pinyin: c.pinyin || key,
              weight: c.weight,
            })))
          }
        }

        // Deduplicate by hanzi
        const seen = new Set<string>()
        const unique = found.filter(c => {
          if (seen.has(c.hanzi)) return false
          seen.add(c.hanzi)
          return true
        }).sort((a, b) => b.weight - a.weight).slice(0, 50)

        setResults(unique)

        // Cache to Dexie
        try {
          await db.dictCache.put({
            query: trimmed,
            results: JSON.stringify(unique),
            cachedAt: Date.now(),
          })
        } catch {
          // ignore cache errors
        }
      } else {
        setResults([])
      }
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }

    await saveToHistory(trimmed)
    await loadHistory()
  }, [dict])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(query)
    }
    if (e.key === 'Escape' && onClose) {
      onClose()
    }
  }

  const handleHistoryClick = (item: SearchHistoryItem) => {
    setQuery(item.query)
    handleSearch(item.query)
    setActiveTab('search')
  }

  const clearHistory = async () => {
    try {
      await db.searchHistory.clear()
      setHistory([])
    } catch {
      // ignore
    }
  }

  return (
    <AnimatePresence>
        {isOpen && (
          <div className="h-full w-full bg-gray-900/95 dark:bg-gray-900/95 light:bg-white/95 backdrop-blur-xl flex flex-col shadow-2xl transition-colors">
            {/* Header */}
            <div className="shrink-0 px-6 py-4 border-b border-gray-800 dark:border-gray-800 light:border-gray-200 flex items-center justify-between transition-colors">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-indigo-400 dark:text-indigo-400 light:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h2 className="text-lg font-bold text-white dark:text-white light:text-gray-900 tracking-tight transition-colors">TỪ ĐIỂN HÁN-DAO</h2>
              </div>
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-800 light:hover:bg-gray-200 text-gray-500 dark:text-gray-500 light:text-gray-600 hover:text-gray-300 dark:hover:text-gray-300 light:hover:text-gray-800 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Tab Bar */}
            <div className="shrink-0 flex border-b border-gray-800 dark:border-gray-800 light:border-gray-200 transition-colors px-6">
              <button
                onClick={() => { setActiveTab('search'); setSelectedChar(null) }}
                className={`px-6 py-3 text-xs font-bold transition-all ${
                  activeTab === 'search'
                    ? 'text-indigo-400 dark:text-indigo-400 light:text-indigo-600 border-b-2 border-indigo-500 dark:border-indigo-500 light:border-indigo-500 bg-indigo-500/5 dark:bg-indigo-500/5 light:bg-indigo-500/3 transition-colors'
                    : 'text-gray-500 dark:text-gray-500 light:text-gray-600 hover:text-gray-300 dark:hover:text-gray-300 light:hover:text-gray-800 transition-colors'
                }`}
              >
                TRA CỨU
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-6 py-3 text-xs font-bold transition-all ${
                  activeTab === 'history'
                    ? 'text-indigo-400 dark:text-indigo-400 light:text-indigo-600 border-b-2 border-indigo-500 dark:border-indigo-500 light:border-indigo-500 bg-indigo-500/5 dark:bg-indigo-500/5 light:bg-indigo-500/3 transition-colors'
                    : 'text-gray-500 dark:text-gray-500 light:text-gray-600 hover:text-gray-300 dark:hover:text-gray-300 light:hover:text-gray-800 transition-colors'
                }`}
              >
                LỊCH SỬ
              </button>
              {selectedChar && (
                <button
                  onClick={() => setActiveTab('details')}
                  className={`px-6 py-3 text-xs font-bold transition-all ${
                    activeTab === 'details'
                      ? 'text-indigo-400 dark:text-indigo-400 light:text-indigo-600 border-b-2 border-indigo-500 dark:border-indigo-500 light:border-indigo-500 bg-indigo-500/5 dark:bg-indigo-500/5 light:bg-indigo-500/3 transition-colors'
                      : 'text-gray-500 dark:text-gray-500 light:text-gray-600 hover:text-gray-300 dark:hover:text-gray-300 light:hover:text-gray-800 transition-colors'
                  }`}
                >
                  CHI TIẾT
                </button>
              )}
              <button
                onClick={() => { setActiveTab('handwriting'); setSelectedChar(null) }}
                className={`px-6 py-3 text-xs font-bold transition-all ${
                  activeTab === 'handwriting'
                    ? 'text-indigo-400 dark:text-indigo-400 light:text-indigo-600 border-b-2 border-indigo-500 dark:border-indigo-500 light:border-indigo-500 bg-indigo-500/5 dark:bg-indigo-500/5 light:bg-indigo-500/3 transition-colors'
                    : 'text-gray-500 dark:text-gray-500 light:text-gray-600 hover:text-gray-300 dark:hover:text-gray-300 light:hover:text-gray-800 transition-colors'
                }`}
              >
                VIẾT TAY
              </button>
              <button
                onClick={() => { setActiveTab('override'); setSelectedChar(null) }}
                className={`px-6 py-3 text-xs font-bold transition-all ${
                  activeTab === 'override'
                    ? 'text-amber-400 dark:text-amber-400 light:text-amber-600 border-b-2 border-amber-500 dark:border-amber-500 light:border-amber-500 bg-amber-500/5 dark:bg-amber-500/5 light:bg-amber-500/3 transition-colors'
                    : 'text-gray-500 dark:text-gray-500 light:text-gray-600 hover:text-gray-300 dark:hover:text-gray-300 light:hover:text-gray-800 transition-colors'
                }`}
              >
                CÁ NHÂN
              </button>
            </div>

            {/* Content - Full Screen */}
            <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full"
            >
              {/* Search Tab */}
              {activeTab === 'search' && (
                <div className="flex flex-col gap-4">
                  {/* Search Input */}
                  <div className="relative max-w-2xl">
                    <input
                      ref={inputRef}
                      type="text"
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Gõ phiên âm hoặc chữ Hán..."
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-base text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/30 transition-all"
                    />
                    <button
                      onClick={() => handleSearch(query)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  </div>

                  {/* Loading */}
                  {loading && (
                    <div className="flex items-center justify-center py-12">
                      <div className="w-6 h-6 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                    </div>
                  )}

                  {/* Results */}
                  {!loading && results.length > 0 && (
                    <div>
                      <div className="text-xs text-gray-500 mb-3 font-medium">
                        {results.length} kết quả
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {results.map((r, i) => (
                          <button
                            key={`${r.hanzi}-${i}`}
                            onClick={() => { setSelectedChar(r); setActiveTab('details') }}
                            className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-800/80 transition-all group text-left border border-gray-800 hover:border-gray-700"
                          >
                            <span className="text-3xl font-medium text-white group-hover:text-indigo-300 transition-colors min-w-[40px] text-center">
                              {r.hanzi}
                            </span>
                            <div className="flex flex-col min-w-0 flex-1">
                              <span className="text-sm text-gray-300 truncate">{r.pinyin}</span>
                              {r.meaning && (
                                <span className="text-xs text-gray-500 truncate mt-0.5">{r.meaning}</span>
                              )}
                            </div>
                            <span className="ml-auto text-[10px] text-gray-600 font-mono">
                              w:{r.weight}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Empty state */}
                  {!loading && query && results.length === 0 && (
                    <div className="text-center py-16">
                      <div className="text-gray-600 text-5xl mb-3">𰻞</div>
                      <p className="text-gray-500 text-base">Không tìm thấy kết quả</p>
                      <p className="text-gray-600 text-sm mt-2">Thử gõ phiên âm khác</p>
                    </div>
                  )}

                  {/* Initial state */}
                  {!loading && !query && (
                    <div className="text-center py-20">
                      <svg className="w-16 h-16 text-gray-700 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <p className="text-gray-500 text-base">Nhập phiên âm hoặc chữ Hán</p>
                      <p className="text-gray-600 text-sm mt-2">để tra cứu từ điển</p>
                    </div>
                  )}
                </div>
              )}

              {/* History Tab */}
              {activeTab === 'history' && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500 font-medium">TRA CỨU GẦN ĐÂY</span>
                    {history.length > 0 && (
                      <button
                        onClick={clearHistory}
                        className="text-xs text-gray-600 hover:text-red-400 transition-colors"
                      >
                        XÓA HẾT
                      </button>
                    )}
                  </div>
                  {history.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {history.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleHistoryClick(item)}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-800/80 transition-all text-left group border border-gray-800 hover:border-gray-700"
                        >
                          <svg className="w-4 h-4 text-gray-600 group-hover:text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm text-gray-300 group-hover:text-white truncate flex-1">{item.query}</span>
                          <span className="ml-auto text-xs text-gray-600 shrink-0">
                            {new Date(item.searchedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <p className="text-gray-600 text-base">Chưa có lịch sử tra cứu</p>
                    </div>
                  )}
                </div>
              )}

              {/* Handwriting Tab — M14: draw characters for recognition */}
              {activeTab === 'handwriting' && (
                <div className="max-w-2xl mx-auto">
                  <HandwritingCanvas
                    onRecognized={(characters) => {
                      if (characters.length > 0 && dict) {
                        // Look up recognized character in dictionary
                        for (const [key, candidates] of dict) {
                          const match = candidates.find(c => c.hanzi === characters[0].hanzi)
                          if (match) {
                            setSelectedChar({
                              hanzi: match.hanzi,
                              pinyin: match.pinyin || key,
                              weight: match.weight,
                            })
                            setActiveTab('details')
                            return
                          }
                        }
                      }
                    }}
                  />
                </div>
              )}

              {/* Override Tab — M18: personal dictionary management */}
              {activeTab === 'override' && (
                <OverrideManager />
              )}

              {/* Details Tab */}
              {activeTab === 'details' && selectedChar && (
                <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">
                  {/* Large character display */}
                  <div className="w-32 h-32 bg-gray-800/50 rounded-3xl border border-gray-700 flex items-center justify-center">
                    <span className="text-7xl text-white font-medium">{selectedChar.hanzi}</span>
                  </div>

                  <div className="w-full space-y-4">
                    {/* Pronunciation */}
                    <div className="bg-gray-800/50 rounded-xl p-4">
                      <div className="text-xs text-gray-500 font-medium mb-2">PHIÊN ÂM</div>
                      <div className="text-lg text-indigo-300 font-medium">{selectedChar.pinyin}</div>
                    </div>

                    {/* Meaning */}
                    {selectedChar.meaning && (
                      <div className="bg-gray-800/50 rounded-xl p-4">
                        <div className="text-xs text-gray-500 font-medium mb-2">NGHĨA</div>
                        <div className="text-base text-gray-200">{selectedChar.meaning}</div>
                      </div>
                    )}

                    {/* Weight / Frequency */}
                    <div className="bg-gray-800/50 rounded-xl p-4">
                      <div className="text-xs text-gray-500 font-medium mb-2">TẦN SUẤT</div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full"
                            style={{ width: `${Math.min((selectedChar.weight / 1000) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-400 font-mono">{selectedChar.weight}</span>
                      </div>
                    </div>
                  </div>

                  {/* M19 GemAI: AI Explanation */}
                  <div className="w-full bg-gray-800/30 rounded-xl p-4 border border-gray-700/30">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-gray-500 font-medium">AI GIẢI NGHĨA</span>
                      {!aiLoading && !aiExplanation && (
                        <button
                          onClick={handleAIExplain}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-600/20 border border-purple-500/40 text-purple-300 hover:bg-purple-600/30 transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          GIẢI NGHĨA
                        </button>
                      )}
                    </div>

                    {/* AI Loading */}
                    {aiLoading && (
                      <div className="flex items-center gap-3 py-4 justify-center">
                        <div className="w-5 h-5 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                        <span className="text-xs text-purple-400">Đang gọi Gemini...</span>
                      </div>
                    )}

                    {/* AI Result */}
                    {aiExplanation && (
                      <div className="space-y-3">
                        <div>
                          <span className="text-xs text-gray-500">NGHĨA:</span>
                          <p className="text-sm text-gray-200 mt-1">{aiExplanation.meaning}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <span className="text-xs text-gray-500">BỘ THỦ:</span>
                            <p className="text-sm text-gray-300 mt-1">{aiExplanation.radical}</p>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500">ÂM HÁN VIỆT:</span>
                            <p className="text-sm text-purple-300 mt-1">{aiExplanation.sinoVietnamese}</p>
                          </div>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">SỐ NÉT:</span>
                          <p className="text-sm text-gray-300 mt-1 font-mono">{aiExplanation.strokeCount}</p>
                        </div>
                        {aiExplanation.examples.length > 0 && (
                          <div>
                            <span className="text-xs text-gray-500">VÍ DỤ:</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {aiExplanation.examples.map((ex, i) => (
                                <span key={i} className="text-xs bg-gray-800/80 px-2 py-1 rounded text-gray-300">
                                  {ex}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        <button
                          onClick={handleAIExplain}
                          className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          ↻ Gọi lại
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Copy button */}
                  <button
                    onClick={() => navigator.clipboard.writeText(selectedChar.hanzi)}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm text-gray-300 hover:text-white hover:border-gray-600 transition-all w-full justify-center"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    SAO CHÉP CHỮ
                  </button>

                  <button
                    onClick={() => { setActiveTab('search'); setSelectedChar(null); setAiExplanation(null) }}
                    className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    ← Quay lại tra cứu
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="shrink-0 px-6 py-3 border-t border-gray-800 dark:border-gray-800 light:border-gray-200 flex items-center justify-between text-xs text-gray-600 dark:text-gray-600 light:text-gray-500 transition-colors">
              <span>{dict ? `${dict.size.toLocaleString()} mục từ` : 'Đang tải...'}</span>
              <span>Yao Dictionary v2</span>
            </div>
          </div>
        )}
      </AnimatePresence>
  )
}