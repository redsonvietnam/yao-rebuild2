import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEditorStore } from '@/editor/useEditorStore'
import { db } from '@/db/dexie'
import HandwritingCanvas from '@/components/dictionary/HandwritingCanvas'
import OverrideManager from '@/components/dictionary/OverrideManager'
import { explainCharacter, type CharacterExplanation } from '@/services/geminiService'

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

export default function DictionaryPanel() {
  const [isOpen, setIsOpen] = useState(false)
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
    } catch {
      // already handled inside explainCharacter fallback
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
    if (e.key === 'Escape') {
      setIsOpen(false)
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
    <>
      {/* Toggle Button — floating right sidebar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed right-0 top-1/2 -translate-y-1/2 z-[80] p-2 rounded-l-lg border border-r-0 transition-all duration-200 ${
          isOpen
            ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-400 translate-x-[320px]'
            : 'bg-gray-900/90 border-gray-700/50 text-gray-400 hover:text-white hover:bg-gray-800'
        }`}
        title="Từ điển (Ctrl+D)"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: 320 }}
            animate={{ x: 0 }}
            exit={{ x: 320 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-[320px] bg-gray-900/95 backdrop-blur-xl border-l border-gray-800 z-[70] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="shrink-0 px-4 py-3 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h2 className="text-sm font-bold text-white tracking-tight">TỪ ĐIỂN</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded hover:bg-gray-800 text-gray-500 hover:text-gray-300 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tab Bar */}
            <div className="shrink-0 flex border-b border-gray-800">
              <button
                onClick={() => { setActiveTab('search'); setSelectedChar(null) }}
                className={`flex-1 py-2 text-[10px] font-bold transition-all ${
                  activeTab === 'search'
                    ? 'text-indigo-400 border-b-2 border-indigo-500 bg-indigo-500/5'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                TRA CỨU
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 py-2 text-[10px] font-bold transition-all ${
                  activeTab === 'history'
                    ? 'text-indigo-400 border-b-2 border-indigo-500 bg-indigo-500/5'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                LỊCH SỬ
              </button>
              {selectedChar && (
                <button
                  onClick={() => setActiveTab('details')}
                  className={`flex-1 py-2 text-[10px] font-bold transition-all ${
                    activeTab === 'details'
                      ? 'text-indigo-400 border-b-2 border-indigo-500 bg-indigo-500/5'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  CHI TIẾT
                </button>
              )}
              <button
                onClick={() => { setActiveTab('handwriting'); setSelectedChar(null) }}
                className={`flex-1 py-2 text-[10px] font-bold transition-all ${
                  activeTab === 'handwriting'
                    ? 'text-indigo-400 border-b-2 border-indigo-500 bg-indigo-500/5'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                VIẾT TAY
              </button>
              <button
                onClick={() => { setActiveTab('override'); setSelectedChar(null) }}
                className={`flex-1 py-2 text-[10px] font-bold transition-all ${
                  activeTab === 'override'
                    ? 'text-amber-400 border-b-2 border-amber-500 bg-amber-500/5'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                CÁ NHÂN
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Search Tab */}
              {activeTab === 'search' && (
                <div className="p-3 flex flex-col gap-3">
                  {/* Search Input */}
                  <div className="relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Gõ phiên âm hoặc chữ Hán..."
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                    />
                    <button
                      onClick={() => handleSearch(query)}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  </div>

                  {/* Loading */}
                  {loading && (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-5 h-5 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                    </div>
                  )}

                  {/* Results */}
                  {!loading && results.length > 0 && (
                    <div>
                      <div className="text-[10px] text-gray-500 mb-2 font-medium">
                        {results.length} kết quả
                      </div>
                      <div className="flex flex-col gap-1">
                        {results.map((r, i) => (
                          <button
                            key={`${r.hanzi}-${i}`}
                            onClick={() => { setSelectedChar(r); setActiveTab('details') }}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800/80 transition-all group text-left"
                          >
                            <span className="text-2xl font-medium text-white group-hover:text-indigo-300 transition-colors min-w-[32px] text-center">
                              {r.hanzi}
                            </span>
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs text-gray-300 truncate">{r.pinyin}</span>
                              {r.meaning && (
                                <span className="text-[10px] text-gray-500 truncate mt-0.5">{r.meaning}</span>
                              )}
                            </div>
                            <span className="ml-auto text-[9px] text-gray-600 font-mono">
                              w:{r.weight}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Empty state */}
                  {!loading && query && results.length === 0 && (
                    <div className="text-center py-8">
                      <div className="text-gray-600 text-3xl mb-2">𰻞</div>
                      <p className="text-gray-500 text-xs">Không tìm thấy kết quả</p>
                      <p className="text-gray-600 text-[10px] mt-1">Thử gõ phiên âm khác</p>
                    </div>
                  )}

                  {/* Initial state */}
                  {!loading && !query && (
                    <div className="text-center py-12">
                      <svg className="w-10 h-10 text-gray-700 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <p className="text-gray-500 text-xs">Nhập phiên âm hoặc chữ Hán</p>
                      <p className="text-gray-600 text-[10px] mt-1">để tra cứu từ điển</p>
                    </div>
                  )}
                </div>
              )}

              {/* History Tab */}
              {activeTab === 'history' && (
                <div className="p-3 flex flex-col gap-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-gray-500 font-medium">TRA CỨU GẦN ĐÂY</span>
                    {history.length > 0 && (
                      <button
                        onClick={clearHistory}
                        className="text-[9px] text-gray-600 hover:text-red-400 transition-colors"
                      >
                        XÓA HẾT
                      </button>
                    )}
                  </div>
                  {history.length > 0 ? (
                    history.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleHistoryClick(item)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800/80 transition-all text-left group"
                      >
                        <svg className="w-3 h-3 text-gray-600 group-hover:text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm text-gray-300 group-hover:text-white truncate">{item.query}</span>
                        <span className="ml-auto text-[9px] text-gray-600 shrink-0">
                          {new Date(item.searchedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600 text-xs">Chưa có lịch sử tra cứu</p>
                    </div>
                  )}
                </div>
              )}

              {/* Handwriting Tab — M14: draw characters for recognition */}
              {activeTab === 'handwriting' && (
                <div className="p-3">
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
                <div className="p-4 flex flex-col items-center gap-4">
                  {/* Large character display */}
                  <div className="w-24 h-24 bg-gray-800/50 rounded-2xl border border-gray-700 flex items-center justify-center">
                    <span className="text-5xl text-white font-medium">{selectedChar.hanzi}</span>
                  </div>

                  <div className="w-full space-y-3">
                    {/* Pronunciation */}
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <div className="text-[10px] text-gray-500 font-medium mb-1">PHIÊN ÂM</div>
                      <div className="text-sm text-indigo-300 font-medium">{selectedChar.pinyin}</div>
                    </div>

                    {/* Meaning */}
                    {selectedChar.meaning && (
                      <div className="bg-gray-800/50 rounded-lg p-3">
                        <div className="text-[10px] text-gray-500 font-medium mb-1">NGHĨA</div>
                        <div className="text-sm text-gray-200">{selectedChar.meaning}</div>
                      </div>
                    )}

                    {/* Weight / Frequency */}
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <div className="text-[10px] text-gray-500 font-medium mb-1">TẦN SUẤT</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full"
                            style={{ width: `${Math.min((selectedChar.weight / 1000) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400 font-mono">{selectedChar.weight}</span>
                      </div>
                    </div>
                  </div>

                  {/* M19 GemAI: AI Explanation */}
                  <div className="w-full bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-gray-500 font-medium">AI GIẢI NGHĨA</span>
                      {!aiLoading && !aiExplanation && (
                        <button
                          onClick={handleAIExplain}
                          className="flex items-center gap-1 px-2 py-1 rounded text-[9px] font-bold bg-purple-600/20 border border-purple-500/40 text-purple-300 hover:bg-purple-600/30 transition-all"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          GIẢI NGHĨA
                        </button>
                      )}
                    </div>

                    {/* AI Loading */}
                    {aiLoading && (
                      <div className="flex items-center gap-2 py-3 justify-center">
                        <div className="w-4 h-4 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                        <span className="text-[10px] text-purple-400">Đang gọi Gemini...</span>
                      </div>
                    )}

                    {/* AI Result */}
                    {aiExplanation && (
                      <div className="space-y-2">
                        <div>
                          <span className="text-[9px] text-gray-500">NGHĨA:</span>
                          <p className="text-xs text-gray-200 mt-0.5">{aiExplanation.meaning}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-[9px] text-gray-500">BỘ THỦ:</span>
                            <p className="text-[10px] text-gray-300 mt-0.5">{aiExplanation.radical}</p>
                          </div>
                          <div>
                            <span className="text-[9px] text-gray-500">ÂM HÁN VIỆT:</span>
                            <p className="text-[10px] text-purple-300 mt-0.5">{aiExplanation.sinoVietnamese}</p>
                          </div>
                        </div>
                        <div>
                          <span className="text-[9px] text-gray-500">SỐ NÉT:</span>
                          <p className="text-[10px] text-gray-300 mt-0.5 font-mono">{aiExplanation.strokeCount}</p>
                        </div>
                        {aiExplanation.examples.length > 0 && (
                          <div>
                            <span className="text-[9px] text-gray-500">VÍ DỤ:</span>
                            <div className="flex flex-wrap gap-1 mt-0.5">
                              {aiExplanation.examples.map((ex, i) => (
                                <span key={i} className="text-[9px] bg-gray-800/80 px-1.5 py-0.5 rounded text-gray-300">
                                  {ex}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        <button
                          onClick={handleAIExplain}
                          className="text-[9px] text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          ↻ Gọi lại
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Copy button */}
                  <button
                    onClick={() => navigator.clipboard.writeText(selectedChar.hanzi)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-xs text-gray-300 hover:text-white hover:border-gray-600 transition-all w-full justify-center"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    SAO CHÉP CHỮ
                  </button>

                  <button
                    onClick={() => { setActiveTab('search'); setSelectedChar(null); setAiExplanation(null) }}
                    className="text-[10px] text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    ← Quay lại tra cứu
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="shrink-0 px-4 py-2 border-t border-gray-800 flex items-center justify-between text-[9px] text-gray-600">
              <span>{dict ? `${dict.size.toLocaleString()} mục từ` : 'Đang tải...'}</span>
              <span>Yao Dictionary v2</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}