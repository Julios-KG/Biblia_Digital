import { useCallback, useMemo } from 'react'
import { STORAGE_KEYS, useStored } from '@/lib/storage'
import { chapterKey } from '@/data/books'
import {
  bookPercent,
  completedBooks,
  computeStreak,
  countReadInBook,
  overallPercent,
  totalRead,
  type ReadMap,
} from '@/lib/progress'
import type { Book } from '@/data/books'
import type { Bookmark, CustomVideo, FavoriteVerse, LastRead, Note, Settings } from '@/types'

// Constantes estables para useSyncExternalStore.
const EMPTY_NOTES: Note[] = []
const EMPTY_FAVORITES: FavoriteVerse[] = []
const EMPTY_BOOKMARKS: Bookmark[] = []
const EMPTY_PROGRESS: ReadMap = {}
const NO_LAST_READ: LastRead | null = null
const EMPTY_VIDEOS: CustomVideo[] = []
export const DEFAULT_SETTINGS: Settings = { fontSize: 'md', serif: true, versionId: null }

function uid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

/* ---------- Apuntes ---------- */

export type NoteInput = Pick<Note, 'title' | 'body' | 'bookId' | 'chapter' | 'verse' | 'tags'>

export function useNotes() {
  const [notes, setNotes] = useStored<Note[]>(STORAGE_KEYS.notes, EMPTY_NOTES)

  const addNote = useCallback(
    (input: NoteInput): Note => {
      const now = Date.now()
      const note: Note = { ...input, id: uid(), createdAt: now, updatedAt: now }
      setNotes((prev) => [note, ...prev])
      return note
    },
    [setNotes],
  )

  const updateNote = useCallback(
    (id: string, input: NoteInput) => {
      setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...input, updatedAt: Date.now() } : n)))
    },
    [setNotes],
  )

  const deleteNote = useCallback(
    (id: string) => setNotes((prev) => prev.filter((n) => n.id !== id)),
    [setNotes],
  )

  return { notes, addNote, updateNote, deleteNote }
}

/* ---------- Favoritos y marcadores ---------- */

export function useFavorites() {
  const [favorites, setFavorites] = useStored<FavoriteVerse[]>(STORAGE_KEYS.favorites, EMPTY_FAVORITES)

  const isFavorite = useCallback(
    (bookId: string, chapter: number, verse: number) =>
      favorites.some((f) => f.id === `${bookId.toUpperCase()}.${chapter}.${verse}`),
    [favorites],
  )

  const toggleFavorite = useCallback(
    (bookId: string, chapter: number, verse: number, text?: string) => {
      const id = `${bookId.toUpperCase()}.${chapter}.${verse}`
      setFavorites((prev) =>
        prev.some((f) => f.id === id)
          ? prev.filter((f) => f.id !== id)
          : [{ id, bookId: bookId.toUpperCase(), chapter, verse, text, createdAt: Date.now() }, ...prev],
      )
    },
    [setFavorites],
  )

  const removeFavorite = useCallback(
    (id: string) => setFavorites((prev) => prev.filter((f) => f.id !== id)),
    [setFavorites],
  )

  return { favorites, isFavorite, toggleFavorite, removeFavorite }
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useStored<Bookmark[]>(STORAGE_KEYS.bookmarks, EMPTY_BOOKMARKS)

  const isBookmarked = useCallback(
    (bookId: string, chapter: number) => bookmarks.some((b) => b.id === chapterKey(bookId, chapter)),
    [bookmarks],
  )

  const toggleBookmark = useCallback(
    (bookId: string, chapter: number) => {
      const id = chapterKey(bookId, chapter)
      setBookmarks((prev) =>
        prev.some((b) => b.id === id)
          ? prev.filter((b) => b.id !== id)
          : [{ id, bookId: bookId.toUpperCase(), chapter, createdAt: Date.now() }, ...prev],
      )
    },
    [setBookmarks],
  )

  const setLabel = useCallback(
    (id: string, label: string) =>
      setBookmarks((prev) => prev.map((b) => (b.id === id ? { ...b, label: label.trim() || undefined } : b))),
    [setBookmarks],
  )

  const removeBookmark = useCallback(
    (id: string) => setBookmarks((prev) => prev.filter((b) => b.id !== id)),
    [setBookmarks],
  )

  return { bookmarks, isBookmarked, toggleBookmark, setLabel, removeBookmark }
}

/* ---------- Progreso de lectura ---------- */

export function useProgress() {
  const [read, setRead] = useStored<ReadMap>(STORAGE_KEYS.progress, EMPTY_PROGRESS)
  const [lastRead, setLastRead] = useStored<LastRead | null>(STORAGE_KEYS.lastRead, NO_LAST_READ)

  const isRead = useCallback((bookId: string, chapter: number) => !!read[chapterKey(bookId, chapter)], [read])

  const setChapterRead = useCallback(
    (bookId: string, chapter: number, value: boolean) => {
      const key = chapterKey(bookId, chapter)
      setRead((prev) => {
        const next = { ...prev }
        if (value) next[key] = Date.now()
        else delete next[key]
        return next
      })
      if (value) setLastRead({ bookId: bookId.toUpperCase(), chapter, at: Date.now() })
    },
    [setRead, setLastRead],
  )

  /** Guarda el punto de lectura sin marcar el capítulo como leído. */
  const visit = useCallback(
    (bookId: string, chapter: number) => setLastRead({ bookId: bookId.toUpperCase(), chapter, at: Date.now() }),
    [setLastRead],
  )

  const resetBook = useCallback(
    (book: Book) =>
      setRead((prev) => {
        const next = { ...prev }
        for (let c = 1; c <= book.chapters; c++) delete next[chapterKey(book.id, c)]
        return next
      }),
    [setRead],
  )

  const resetAll = useCallback(() => {
    setRead({})
    setLastRead(null)
  }, [setRead, setLastRead])

  const stats = useMemo(
    () => ({
      total: totalRead(read),
      percent: overallPercent(read),
      streak: computeStreak(read),
      completed: completedBooks(read),
    }),
    [read],
  )

  return {
    read,
    lastRead,
    isRead,
    setChapterRead,
    visit,
    resetBook,
    resetAll,
    stats,
    bookRead: (book: Book) => countReadInBook(read, book),
    bookPercent: (book: Book) => bookPercent(read, book),
  }
}

/* ---------- Ajustes y videos propios ---------- */

export function useSettings() {
  const [settings, setSettings] = useStored<Settings>(STORAGE_KEYS.settings, DEFAULT_SETTINGS)
  const merged = useMemo(() => ({ ...DEFAULT_SETTINGS, ...settings }), [settings])
  const update = useCallback(
    (patch: Partial<Settings>) => setSettings((prev) => ({ ...DEFAULT_SETTINGS, ...prev, ...patch })),
    [setSettings],
  )
  return { settings: merged, update }
}

export function useCustomVideos() {
  const [videos, setVideos] = useStored<CustomVideo[]>(STORAGE_KEYS.customVideos, EMPTY_VIDEOS)
  const addVideo = useCallback(
    (input: Pick<CustomVideo, 'title' | 'youtubeId' | 'note'>) =>
      setVideos((prev) => [{ ...input, id: uid(), createdAt: Date.now() }, ...prev]),
    [setVideos],
  )
  const removeVideo = useCallback((id: string) => setVideos((prev) => prev.filter((v) => v.id !== id)), [setVideos])
  return { videos, addVideo, removeVideo }
}
