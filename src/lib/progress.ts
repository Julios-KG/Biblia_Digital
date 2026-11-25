import { BOOKS, TOTAL_CHAPTERS, chapterKey, type Book } from '@/data/books'

/** Mapa `LIBRO.capítulo` → marca de tiempo en la que se marcó como leído. */
export type ReadMap = Record<string, number>

export function countReadInBook(read: ReadMap, book: Book): number {
  let n = 0
  for (let c = 1; c <= book.chapters; c++) if (read[chapterKey(book.id, c)]) n++
  return n
}

export function bookPercent(read: ReadMap, book: Book): number {
  return Math.round((countReadInBook(read, book) / book.chapters) * 100)
}

export function totalRead(read: ReadMap): number {
  // Solo cuenta claves válidas, por si una copia importada trae datos sobrantes.
  return BOOKS.reduce((sum, b) => sum + countReadInBook(read, b), 0)
}

export function overallPercent(read: ReadMap): number {
  return Math.round((totalRead(read) / TOTAL_CHAPTERS) * 1000) / 10
}

export function completedBooks(read: ReadMap): Book[] {
  return BOOKS.filter((b) => countReadInBook(read, b) === b.chapters)
}

function dayKey(ts: number): string {
  const d = new Date(ts)
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

/** Días consecutivos con lectura, contando desde hoy (o ayer, si hoy aún no se leyó). */
export function computeStreak(read: ReadMap, now: number = Date.now()): number {
  const days = new Set(Object.values(read).map(dayKey))
  if (days.size === 0) return 0
  const oneDay = 24 * 60 * 60 * 1000
  let cursor = now
  if (!days.has(dayKey(cursor))) cursor -= oneDay
  let streak = 0
  while (days.has(dayKey(cursor))) {
    streak++
    cursor -= oneDay
  }
  return streak
}

export function nextChapter(bookId: string, chapter: number): { bookId: string; chapter: number } | null {
  const idx = BOOKS.findIndex((b) => b.id === bookId.toUpperCase())
  if (idx === -1) return null
  const book = BOOKS[idx]
  if (chapter < book.chapters) return { bookId: book.id, chapter: chapter + 1 }
  const next = BOOKS[idx + 1]
  return next ? { bookId: next.id, chapter: 1 } : null
}

export function prevChapter(bookId: string, chapter: number): { bookId: string; chapter: number } | null {
  const idx = BOOKS.findIndex((b) => b.id === bookId.toUpperCase())
  if (idx === -1) return null
  if (chapter > 1) return { bookId: BOOKS[idx].id, chapter: chapter - 1 }
  const prev = BOOKS[idx - 1]
  return prev ? { bookId: prev.id, chapter: prev.chapters } : null
}
