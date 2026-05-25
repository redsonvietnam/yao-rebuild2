// dexie.ts — Dexie DB: dict cache + searchHistory + documents + settings + exportCache + ocrCache + userDict + templates
import Dexie, { type Table } from 'dexie'

// === Dict Cache ===
export interface DictCacheEntry {
  id?: number
  query: string
  results: string // JSON serialized Candidate[]
  cachedAt: number
}

// === Search History ===
export interface SearchHistoryEntry {
  id?: number
  query: string
  searchedAt: number
}

// === Document Storage ===
export interface DocumentEntry {
  id?: number
  docId: string
  title: string
  content: string // JSON serialized Tiptap content
  writingMode: 'horizontal-tb' | 'vertical-rl'
  pageSize: 'A4' | 'A3' | 'custom'
  margins: {
    top: number
    bottom: number
    left: number
    right: number
  }
  wordCount: number
  lineCount: number
  createdAt: number
  updatedAt: number
  isAutoSaved: boolean
}

// === Settings Persistence ===
export interface SettingsEntry {
  id?: number
  key: string
  value: string // JSON serialized
  updatedAt: number
}

// === Export Cache ===
export interface ExportCacheEntry {
  id?: number
  docId: string
  format: 'pdf' | 'docx' | 'png'
  blob: Blob
  cachedAt: number
}

// === OCR Results Cache ===
export interface OCRCacheEntry {
  id?: number
  imageHash: string // simple hash of image data URL
  recognizedText: string
  confidence: number
  cachedAt: number
}

// === User Dictionary Override (M18) ===
export interface UserDictEntry {
  id?: number
  key: string      // pinyin input key (e.g., "nhaxn")
  hanzi: string     // output character (e.g., "人")
  pinyin: string    // pinyin reading
  weight: number    // priority (default 100, higher = shows first)
  createdAt: number
  updatedAt: number
}

// === Document Templates (M21) ===
export interface TemplateEntry {
  id?: number
  title: string
  category: string     // e.g., "Cổ điển", "Công văn", "Thơ", "Luyện tập"
  description: string
  content: string      // JSON serialized Tiptap content
  writingMode: 'horizontal-tb' | 'vertical-rl'
  createdAt: number
}

class YaoEditorDB extends Dexie {
  dictCache!: Table<DictCacheEntry>
  searchHistory!: Table<SearchHistoryEntry>
  documents!: Table<DocumentEntry>
  settings!: Table<SettingsEntry>
  exportCache!: Table<ExportCacheEntry>
  ocrCache!: Table<OCRCacheEntry>
  userDict!: Table<UserDictEntry>
  templates!: Table<TemplateEntry>

  constructor() {
    super('YaoEditorDB')
    this.version(3).stores({
      dictCache: '++id, query, cachedAt',
      searchHistory: '++id, query, searchedAt',
      documents: '++id, docId, updatedAt, createdAt, isAutoSaved',
      settings: '++id, key',
      exportCache: '++id, docId, format, cachedAt',
      ocrCache: '++id, imageHash, cachedAt',
      userDict: '++id, key, hanzi',
      templates: '++id, title, category',
    })
  }
}

export const db = new YaoEditorDB()

// === Storage Service Helpers ===

// Document CRUD
export async function saveDocument(doc: Omit<DocumentEntry, 'id' | 'updatedAt' | 'createdAt'> & { id?: number; updatedAt?: number; createdAt?: number }) {
  const now = Date.now()
  const existing = doc.docId ? await db.documents.where('docId').equals(doc.docId).first() : undefined

  if (existing?.id) {
    return db.documents.update(existing.id, {
      ...doc,
      updatedAt: now,
    })
  }

  return db.documents.add({
    ...doc,
    createdAt: now,
    updatedAt: now,
  })
}

export async function loadDocument(docId: string): Promise<DocumentEntry | undefined> {
  return db.documents.where('docId').equals(docId).first()
}

export async function listDocuments(): Promise<DocumentEntry[]> {
  return db.documents.orderBy('updatedAt').reverse().toArray()
}

export async function deleteDocument(docId: string) {
  return db.documents.where('docId').equals(docId).delete()
}

export async function getLatestAutoSave(): Promise<DocumentEntry | undefined> {
  return db.documents.where('isAutoSaved').equals(1).first()
}

// Settings CRUD
export async function saveSetting(key: string, value: unknown) {
  const existing = await db.settings.where('key').equals(key).first()
  if (existing?.id) {
    return db.settings.update(existing.id, {
      key,
      value: JSON.stringify(value),
      updatedAt: Date.now(),
    })
  }
  return db.settings.add({
    key,
    value: JSON.stringify(value),
    updatedAt: Date.now(),
  })
}

export async function loadSetting<T>(key: string): Promise<T | undefined> {
  const entry = await db.settings.where('key').equals(key).first()
  if (entry) {
    try {
      return JSON.parse(entry.value) as T
    } catch {
      return undefined
    }
  }
  return undefined
}

export async function loadAllSettings(): Promise<Record<string, unknown>> {
  const entries = await db.settings.toArray()
  const result: Record<string, unknown> = {}
  for (const entry of entries) {
    try {
      result[entry.key] = JSON.parse(entry.value)
    } catch {
      result[entry.key] = entry.value
    }
  }
  return result
}

// Export Cache
export async function getCachedExport(docId: string, format: 'pdf' | 'docx' | 'png'): Promise<ExportCacheEntry | undefined> {
  return db.exportCache.where({ docId, format }).first()
}

export async function cacheExport(docId: string, format: 'pdf' | 'docx' | 'png', blob: Blob) {
  return db.exportCache.put({
    docId,
    format,
    blob,
    cachedAt: Date.now(),
  })
}

// OCR Cache
export async function getCachedOCR(imageHash: string): Promise<OCRCacheEntry | undefined> {
  return db.ocrCache.where('imageHash').equals(imageHash).first()
}

export async function cacheOCR(imageHash: string, recognizedText: string, confidence: number) {
  return db.ocrCache.put({
    imageHash,
    recognizedText,
    confidence,
    cachedAt: Date.now(),
  })
}

// Utility: simple hash for OCR cache
export function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0 // Convert to 32bit integer
  }
  return hash.toString(36)
}

// === User Dictionary Override Helpers (M18) ===
export async function addOverride(entry: { key: string; hanzi: string; pinyin: string; weight?: number }): Promise<number> {
  const now = Date.now()
  return db.userDict.add({
    key: entry.key,
    hanzi: entry.hanzi,
    pinyin: entry.pinyin,
    weight: entry.weight ?? 100,
    createdAt: now,
    updatedAt: now,
  })
}

export async function listOverrides(): Promise<UserDictEntry[]> {
  return db.userDict.orderBy('updatedAt').reverse().toArray()
}

export async function updateOverride(id: number, changes: Partial<Pick<UserDictEntry, 'key' | 'hanzi' | 'pinyin' | 'weight'>>) {
  return db.userDict.update(id, {
    ...changes,
    updatedAt: Date.now(),
  })
}

export async function deleteOverride(id: number) {
  return db.userDict.delete(id)
}

export async function clearAllOverrides() {
  return db.userDict.clear()
}

// Build a merge Map from user overrides for IME engine
export async function buildUserDictMap(): Promise<Map<string, import('@/engine/types').Candidate[]>> {
  const entries = await listOverrides()
  const map = new Map<string, import('@/engine/types').Candidate[]>()
  for (const entry of entries) {
    const key = entry.key
    const existing = map.get(key) || []
    existing.push({
      hanzi: entry.hanzi,
      pinyin: entry.pinyin,
      weight: entry.weight,
      matchType: 'exact',
    })
    map.set(key, existing)
  }
  return map
}

// === Template Helpers (M21) ===
const BUILTIN_TEMPLATES: Omit<TemplateEntry, 'id' | 'createdAt'>[] = [
  {
    title: 'Thư tịch cổ',
    category: 'Cổ điển',
    description: 'Trang viết dọc theo phong cách thư tịch cổ, có lưới ô ly',
    content: JSON.stringify({
      type: 'doc',
      content: [{
        type: 'page',
        attrs: { writingMode: 'vertical-rl', pageSize: 'A4' },
        content: [{
          type: 'paragraph',
          content: [{ type: 'text', text: 'Bắt đầu viết thư tịch cổ của bạn tại đây...' }]
        }]
      }]
    }),
    writingMode: 'vertical-rl' as const,
  },
  {
    title: 'Công văn hành chính',
    category: 'Công văn',
    description: 'Mẫu công văn trang trọng, viết ngang, định dạng chuẩn',
    content: JSON.stringify({
      type: 'doc',
      content: [{
        type: 'page',
        attrs: { writingMode: 'horizontal-tb', pageSize: 'A4' },
        content: [
          { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM' }] },
          { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Độc lập - Tự do - Hạnh phúc' }] },
          { type: 'paragraph', content: [] },
          { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Kính gửi: ...' }] },
          { type: 'paragraph', content: [{ type: 'text', text: 'Nội dung công văn...' }] },
          { type: 'paragraph', content: [] },
          { type: 'paragraph', content: [{ type: 'text', text: 'Trân trọng,' }] },
          { type: 'paragraph', content: [{ type: 'text', text: 'Người ký' }] },
        ]
      }]
    }),
    writingMode: 'horizontal-tb' as const,
  },
  {
    title: 'Thơ Đường luật',
    category: 'Thơ',
    description: 'Khuôn mẫu thơ Đường thất ngôn bát cú, viết dọc',
    content: JSON.stringify({
      type: 'doc',
      content: [{
        type: 'page',
        attrs: { writingMode: 'vertical-rl', pageSize: 'A4' },
        content: [
          { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'TÊN BÀI THƠ' }] },
          { type: 'paragraph', content: [{ type: 'text', text: 'Câu 1 — bảy chữ...' }] },
          { type: 'paragraph', content: [{ type: 'text', text: 'Câu 2 — bảy chữ...' }] },
          { type: 'paragraph', content: [{ type: 'text', text: 'Câu 3 — bảy chữ...' }] },
          { type: 'paragraph', content: [{ type: 'text', text: 'Câu 4 — bảy chữ...' }] },
          { type: 'paragraph', content: [{ type: 'text', text: 'Câu 5 — bảy chữ...' }] },
          { type: 'paragraph', content: [{ type: 'text', text: 'Câu 6 — bảy chữ...' }] },
          { type: 'paragraph', content: [{ type: 'text', text: 'Câu 7 — bảy chữ...' }] },
          { type: 'paragraph', content: [{ type: 'text', text: 'Câu 8 — bảy chữ...' }] },
        ]
      }]
    }),
    writingMode: 'vertical-rl' as const,
  },
  {
    title: 'Luyện viết chữ Hán',
    category: 'Luyện tập',
    description: 'Trang luyện viết chữ Hán lớn có lưới ô ly, cỡ chữ to',
    content: JSON.stringify({
      type: 'doc',
      content: [{
        type: 'page',
        attrs: { writingMode: 'horizontal-tb', pageSize: 'A4' },
        content: [
          { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'LUYỆN VIẾT CHỮ HÁN' }] },
          { type: 'paragraph', content: [{ type: 'text', text: '日 月 山 水 火 木 金 土 人 子' }] },
          { type: 'paragraph', content: [{ type: 'text', text: '口 目 手 足 耳 心 力 女 男 父' }] },
        ]
      }]
    }),
    writingMode: 'horizontal-tb' as const,
  },
]

export async function seedTemplates() {
  const count = await db.templates.count()
  if (count > 0) return // Already seeded
  const now = Date.now()
  await db.templates.bulkAdd(
    BUILTIN_TEMPLATES.map(t => ({ ...t, createdAt: now }))
  )
}

export async function listTemplates(): Promise<TemplateEntry[]> {
  return db.templates.orderBy('createdAt').toArray()
}

export async function saveTemplate(template: Omit<TemplateEntry, 'id' | 'createdAt'> & { id?: number; createdAt?: number }) {
  const now = Date.now()
  if (template.id) {
    return db.templates.update(template.id, { ...template, createdAt: template.createdAt ?? now })
  }
  return db.templates.add({ ...template, createdAt: now })
}

export async function deleteTemplate(id: number) {
  return db.templates.delete(id)
}