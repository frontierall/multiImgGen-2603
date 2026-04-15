import type { HistoryEntry } from '../hooks/useImageGen'

const DB_NAME = 'multi-img-gen-db'
const STORE_NAME = 'history'
const DB_VERSION = 1
const MAX_HISTORY_ITEMS = 7

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('IndexedDB를 열 수 없습니다.'))
  })
}

export async function loadHistoryEntries(): Promise<HistoryEntry[]> {
  if (typeof window === 'undefined' || !window.indexedDB) return []

  const db = await openDb()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.getAll()

    request.onsuccess = () => {
      const entries = (request.result as HistoryEntry[])
        .sort((a, b) => b.id - a.id)
        .slice(0, MAX_HISTORY_ITEMS)
      resolve(entries)
    }
    request.onerror = () => reject(request.error ?? new Error('히스토리를 불러올 수 없습니다.'))
  })
}

export async function saveHistoryEntries(entries: HistoryEntry[]): Promise<void> {
  if (typeof window === 'undefined' || !window.indexedDB) return

  const db = await openDb()
  const trimmed = entries.slice(0, MAX_HISTORY_ITEMS)

  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    store.clear()
    trimmed.forEach((entry) => store.put(entry))

    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error ?? new Error('히스토리를 저장할 수 없습니다.'))
  })
}
