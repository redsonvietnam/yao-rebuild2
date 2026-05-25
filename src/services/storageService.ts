// storageService.ts — Delegates to Dexie document storage + settings persistence
import {
  saveDocument as dexieSave,
  loadDocument as dexieLoad,
  listDocuments as dexieList,
  deleteDocument as dexieDelete,
  getLatestAutoSave,
  saveSetting as dexieSaveSetting,
  loadSetting as dexieLoadSetting,
  loadAllSettings,
  type DocumentEntry,
} from '@/db/dexie'

export async function saveDocument(doc: {
  docId: string
  title: string
  content: string
  writingMode: 'horizontal-tb' | 'vertical-rl'
  pageSize: 'A4' | 'A3' | 'custom'
  margins: { top: number; bottom: number; left: number; right: number }
  wordCount: number
  lineCount: number
  isAutoSaved: boolean
}) {
  return dexieSave(doc)
}

export async function loadDocument(docId: string): Promise<DocumentEntry | undefined> {
  return dexieLoad(docId)
}

export async function listDocuments(): Promise<DocumentEntry[]> {
  return dexieList()
}

export async function deleteDocument(docId: string) {
  return dexieDelete(docId)
}

export async function restoreAutoSave(): Promise<DocumentEntry | undefined> {
  return getLatestAutoSave()
}

export async function saveSetting(key: string, value: unknown) {
  return dexieSaveSetting(key, value)
}

export async function loadSetting<T>(key: string): Promise<T | undefined> {
  return dexieLoadSetting<T>(key)
}

export async function getAllSettings(): Promise<Record<string, unknown>> {
  return loadAllSettings()
}

// Note: getLatestAutoSave is already re-exported as restoreAutoSave