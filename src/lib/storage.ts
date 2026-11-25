import { useCallback, useSyncExternalStore } from 'react'

/**
 * Almacenamiento local reactivo basado en localStorage.
 * - Todo vive en el navegador de la persona; no hay backend.
 * - Los componentes que usan la misma clave se actualizan juntos.
 */

const PREFIX = 'mbd:'

export const STORAGE_KEYS = {
  notes: 'notes',
  favorites: 'favorites',
  bookmarks: 'bookmarks',
  progress: 'progress',
  lastRead: 'lastRead',
  settings: 'settings',
  customVideos: 'customVideos',
} as const

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]

const cache = new Map<string, unknown>()
const listeners = new Map<string, Set<() => void>>()

function hasStorage(): boolean {
  try {
    return typeof window !== 'undefined' && !!window.localStorage
  } catch {
    return false
  }
}

function readRaw<T>(key: string, fallback: T): T {
  if (!hasStorage()) return fallback
  try {
    const raw = window.localStorage.getItem(PREFIX + key)
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function getStored<T>(key: string, fallback: T): T {
  if (!cache.has(key)) cache.set(key, readRaw(key, fallback))
  return cache.get(key) as T
}

function emit(key: string) {
  listeners.get(key)?.forEach((l) => l())
}

export function setStored<T>(key: string, value: T): void {
  cache.set(key, value)
  if (hasStorage()) {
    try {
      window.localStorage.setItem(PREFIX + key, JSON.stringify(value))
    } catch {
      // Cuota llena o modo privado: el valor queda en memoria durante la sesión.
    }
  }
  emit(key)
}

function subscribe(key: string, listener: () => void): () => void {
  let set = listeners.get(key)
  if (!set) {
    set = new Set()
    listeners.set(key, set)
  }
  set.add(listener)
  return () => {
    set?.delete(listener)
  }
}

/** Reinicia la caché en memoria (útil en pruebas y tras importar datos). */
export function resetStorageCache(): void {
  cache.clear()
  listeners.forEach((_, key) => emit(key))
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key && e.key.startsWith(PREFIX)) {
      const key = e.key.slice(PREFIX.length)
      cache.delete(key)
      emit(key)
    }
  })
}

/**
 * Hook para leer/escribir una clave. `fallback` debe ser una constante estable
 * (definida fuera del componente) para que la referencia no cambie en cada render.
 */
export function useStored<T>(key: string, fallback: T): [T, (next: T | ((prev: T) => T)) => void] {
  const value = useSyncExternalStore(
    (cb) => subscribe(key, cb),
    () => getStored<T>(key, fallback),
    () => fallback,
  )
  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      const prev = getStored<T>(key, fallback)
      const resolved = typeof next === 'function' ? (next as (p: T) => T)(prev) : next
      setStored(key, resolved)
    },
    [key, fallback],
  )
  return [value, set]
}

/* ---------- Copia de seguridad ---------- */

export interface BackupFile {
  app: 'mi-biblia-digital'
  version: 1
  exportedAt: string
  data: Partial<Record<StorageKey, unknown>>
}

export function exportAllData(): BackupFile {
  const data: Partial<Record<StorageKey, unknown>> = {}
  for (const key of Object.values(STORAGE_KEYS)) {
    const raw = readRaw<unknown>(key, undefined)
    if (raw !== undefined) data[key] = raw
  }
  return { app: 'mi-biblia-digital', version: 1, exportedAt: new Date().toISOString(), data }
}

export type ImportResult = { ok: true; keys: number } | { ok: false; error: string }

export function importAllData(input: unknown): ImportResult {
  if (!input || typeof input !== 'object') return { ok: false, error: 'El archivo no tiene un formato válido.' }
  const file = input as Partial<BackupFile>
  if (file.app !== 'mi-biblia-digital' || !file.data || typeof file.data !== 'object') {
    return { ok: false, error: 'El archivo no es una copia de seguridad de Mi Biblia Digital.' }
  }
  const allowed = new Set<string>(Object.values(STORAGE_KEYS))
  let keys = 0
  for (const [key, value] of Object.entries(file.data)) {
    if (!allowed.has(key)) continue
    setStored(key, value)
    keys++
  }
  return { ok: true, keys }
}

export function clearAllData(): void {
  for (const key of Object.values(STORAGE_KEYS)) {
    if (hasStorage()) {
      try {
        window.localStorage.removeItem(PREFIX + key)
      } catch {
        /* ignorar */
      }
    }
    cache.delete(key)
    emit(key)
  }
}
