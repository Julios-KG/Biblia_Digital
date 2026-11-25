import { BOOKS, getBook } from '@/data/books'

/**
 * Esta aplicación NO incluye ningún texto bíblico propio. El texto se obtiene de
 * dos fuentes opcionales, ambas locales y bajo responsabilidad de quien publica la app:
 *
 * 1) Archivos estáticos: public/biblia/<versión>/<LIBRO>.json (ver public/biblia/LEEME.md)
 * 2) Importación desde Ajustes: un archivo JSON que se guarda en el navegador (IndexedDB).
 *
 * Formato de un capítulo: arreglo de versículos (índice 0 = versículo 1).
 */

export type BookText = Record<string, string[]>

export interface BibleMeta {
  id: string
  name: string
  language?: string
  /** Obligatorio: indica con qué licencia o autorización se usa el texto. */
  license: string
  source?: string
}

export interface ImportedBible {
  meta: BibleMeta
  books: Record<string, BookText>
}

export interface VersionInfo {
  id: string
  name: string
  license: string
  origin: 'static' | 'imported'
}

export type ValidationResult = { ok: true; bible: ImportedBible } | { ok: false; error: string }

const ID_PATTERN = /^[a-z0-9][a-z0-9_-]{0,31}$/

export function validateBible(data: unknown): ValidationResult {
  if (!data || typeof data !== 'object') return { ok: false, error: 'El archivo no contiene un objeto JSON válido.' }
  const { meta, books } = data as { meta?: Partial<BibleMeta>; books?: unknown }
  if (!meta || typeof meta !== 'object') return { ok: false, error: 'Falta el bloque "meta".' }
  if (typeof meta.id !== 'string' || !ID_PATTERN.test(meta.id)) {
    return { ok: false, error: 'meta.id debe usar minúsculas, números, guiones y tener máximo 32 caracteres.' }
  }
  if (typeof meta.name !== 'string' || !meta.name.trim()) return { ok: false, error: 'Falta meta.name.' }
  if (typeof meta.license !== 'string' || !meta.license.trim()) {
    return { ok: false, error: 'Falta meta.license: indica la licencia o autorización del texto.' }
  }
  if (!books || typeof books !== 'object' || Array.isArray(books)) return { ok: false, error: 'Falta el bloque "books".' }

  const clean: Record<string, BookText> = {}
  let verseCount = 0
  for (const [rawId, chapters] of Object.entries(books as Record<string, unknown>)) {
    const book = getBook(rawId)
    if (!book) return { ok: false, error: `El libro "${rawId}" no es un código válido (usa GEN, EXO, ..., REV).` }
    if (!chapters || typeof chapters !== 'object' || Array.isArray(chapters)) {
      return { ok: false, error: `${book.name}: los capítulos deben ser un objeto {"1": [...]}.` }
    }
    const bookText: BookText = {}
    for (const [chKey, verses] of Object.entries(chapters as Record<string, unknown>)) {
      const ch = Number(chKey)
      if (!Number.isInteger(ch) || ch < 1 || ch > book.chapters) {
        return { ok: false, error: `${book.name}: el capítulo "${chKey}" está fuera de rango (1–${book.chapters}).` }
      }
      if (!Array.isArray(verses) || verses.some((v) => typeof v !== 'string')) {
        return { ok: false, error: `${book.name} ${ch}: los versículos deben ser un arreglo de textos.` }
      }
      bookText[String(ch)] = verses as string[]
      verseCount += verses.length
    }
    clean[book.id] = bookText
  }
  if (verseCount === 0) return { ok: false, error: 'El archivo no contiene versículos.' }

  return {
    ok: true,
    bible: {
      meta: {
        id: meta.id,
        name: meta.name.trim(),
        language: meta.language,
        license: meta.license.trim(),
        source: meta.source,
      },
      books: clean,
    },
  }
}

/* ---------- IndexedDB (textos importados) ---------- */

const DB_NAME = 'mbd-biblia'
const STORE = 'bibles'

function idbAvailable(): boolean {
  return typeof indexedDB !== 'undefined'
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE, { keyPath: 'meta.id' })
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function withStore<T>(mode: IDBTransactionMode, fn: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDb()
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(STORE, mode)
    const req = fn(tx.objectStore(STORE))
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
    tx.oncomplete = () => db.close()
  })
}

export async function saveImportedBible(bible: ImportedBible): Promise<void> {
  if (!idbAvailable()) throw new Error('Este navegador no permite guardar el texto localmente.')
  await withStore('readwrite', (s) => s.put(bible))
  invalidateCache()
}

export async function deleteImportedBible(id: string): Promise<void> {
  if (!idbAvailable()) return
  await withStore('readwrite', (s) => s.delete(id))
  invalidateCache()
}

async function getImportedBible(id: string): Promise<ImportedBible | undefined> {
  if (!idbAvailable()) return undefined
  try {
    return await withStore<ImportedBible | undefined>('readonly', (s) => s.get(id))
  } catch {
    return undefined
  }
}

async function listImported(): Promise<VersionInfo[]> {
  if (!idbAvailable()) return []
  try {
    const all = await withStore<ImportedBible[]>('readonly', (s) => s.getAll())
    return all.map((b) => ({ id: b.meta.id, name: b.meta.name, license: b.meta.license, origin: 'imported' as const }))
  } catch {
    return []
  }
}

/* ---------- Archivos estáticos (public/biblia) ---------- */

async function listStatic(): Promise<VersionInfo[]> {
  if (typeof fetch === 'undefined') return []
  try {
    const res = await fetch('/biblia/index.json', { cache: 'no-cache' })
    if (!res.ok) return []
    const type = res.headers.get('content-type') ?? ''
    if (!type.includes('json')) return []
    const json = (await res.json()) as { versions?: { id: string; name: string; license: string }[] }
    return (json.versions ?? [])
      .filter((v) => v && typeof v.id === 'string' && ID_PATTERN.test(v.id) && typeof v.name === 'string')
      .map((v) => ({ id: v.id, name: v.name, license: v.license ?? 'No indicada', origin: 'static' as const }))
  } catch {
    return []
  }
}

const bookCache = new Map<string, BookText | null>()
function invalidateCache() {
  bookCache.clear()
}

async function loadStaticBook(versionId: string, bookId: string): Promise<BookText | null> {
  if (typeof fetch === 'undefined' || !ID_PATTERN.test(versionId)) return null
  try {
    const res = await fetch(`/biblia/${versionId}/${bookId.toUpperCase()}.json`)
    if (!res.ok) return null
    const type = res.headers.get('content-type') ?? ''
    if (!type.includes('json')) return null
    return (await res.json()) as BookText
  } catch {
    return null
  }
}

export async function listVersions(): Promise<VersionInfo[]> {
  const [stat, imp] = await Promise.all([listStatic(), listImported()])
  const seen = new Set<string>()
  return [...imp, ...stat].filter((v) => (seen.has(v.id) ? false : (seen.add(v.id), true)))
}

/**
 * Devuelve los versículos del capítulo, o null si no hay texto disponible
 * para esa versión (nunca se inventa contenido).
 */
export async function loadChapter(versionId: string | null, bookId: string, chapter: number): Promise<string[] | null> {
  if (!versionId) return null
  const book = getBook(bookId)
  if (!book || chapter < 1 || chapter > book.chapters) return null
  const cacheKey = `${versionId}:${book.id}`
  if (!bookCache.has(cacheKey)) {
    const imported = await getImportedBible(versionId)
    const text = imported?.books[book.id] ?? (await loadStaticBook(versionId, book.id))
    bookCache.set(cacheKey, text)
  }
  const text = bookCache.get(cacheKey)
  const verses = text?.[String(chapter)]
  return verses && verses.length > 0 ? verses : null
}

export function describeFormat(): string {
  const example = BOOKS[0].id
  return `{ "meta": { "id": "mi-version", "name": "Nombre", "license": "Licencia o permiso" }, "books": { "${example}": { "1": ["Versículo 1", "Versículo 2"] } } }`
}
