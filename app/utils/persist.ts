import type { CollageState, StoredImage } from './collage'

/**
 * Autoguardado del proyecto en IndexedDB del propio navegador.
 * Si el navegador lo bloquea (modo privado, etc.) el editor sigue funcionando.
 */
const DB_NAME = 'simple-collage'
const DB_VERSION = 1
const PROJECT_KEY = 'current'

export interface SavedProject {
  state: CollageState
  images: StoredImage[]
}

let dbPromise: Promise<IDBDatabase> | null = null

function openDb(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION)
      req.onupgradeneeded = () => {
        const db = req.result
        if (!db.objectStoreNames.contains('projects')) db.createObjectStore('projects')
        if (!db.objectStoreNames.contains('images')) db.createObjectStore('images')
      }
      req.onsuccess = () => resolve(req.result)
      req.onerror = () => reject(req.error)
    })
    dbPromise.catch(() => { dbPromise = null })
  }
  return dbPromise
}

function run<T>(store: string, mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return openDb().then(db => new Promise<T>((resolve, reject) => {
    const tx = db.transaction(store, mode)
    const req = fn(tx.objectStore(store))
    tx.oncomplete = () => resolve(req.result)
    tx.onerror = () => reject(tx.error)
    tx.onabort = () => reject(tx.error)
  }))
}

export async function saveProject(project: SavedProject): Promise<void> {
  try {
    await run('projects', 'readwrite', s => s.put(JSON.parse(JSON.stringify(project)), PROJECT_KEY))
  }
  catch { /* sin almacenamiento disponible */ }
}

export async function loadProject(): Promise<SavedProject | null> {
  try {
    return (await run<SavedProject | undefined>('projects', 'readonly', s => s.get(PROJECT_KEY))) ?? null
  }
  catch {
    return null
  }
}

export async function saveImageBlob(id: string, blob: Blob): Promise<void> {
  try {
    await run('images', 'readwrite', s => s.put(blob, id))
  }
  catch { /* sin almacenamiento disponible */ }
}

export async function loadImageBlob(id: string): Promise<Blob | null> {
  try {
    return (await run<Blob | undefined>('images', 'readonly', s => s.get(id))) ?? null
  }
  catch {
    return null
  }
}

export async function deleteImageBlob(id: string): Promise<void> {
  try {
    await run('images', 'readwrite', s => s.delete(id))
  }
  catch { /* sin almacenamiento disponible */ }
}

export async function clearProject(): Promise<void> {
  try {
    await run('projects', 'readwrite', s => s.clear())
    await run('images', 'readwrite', s => s.clear())
  }
  catch { /* sin almacenamiento disponible */ }
}
