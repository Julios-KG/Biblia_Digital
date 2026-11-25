import { BOOKS, getBook, type Book } from '@/data/books'

export interface ParsedReference {
  bookId: string
  chapter: number
  verse?: number
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\./g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Alias adicionales comunes (sin tildes y en minúsculas). */
const EXTRA_ALIASES: Record<string, string> = {
  cantares: 'SNG',
  'cantar de los cantares': 'SNG',
  'cantares de salomon': 'SNG',
  salmo: 'PSA',
  proverbio: 'PRO',
  apocalipsis: 'REV',
  revelacion: 'REV',
  hechos: 'ACT',
  'hechos de los apostoles': 'ACT',
  marcos: 'MRK',
  mr: 'MRK',
  mc: 'MRK',
  santiago: 'JAS',
  stg: 'JAS',
  sant: 'JAS',
  jn: 'JHN',
  genesis: 'GEN',
}

let aliasMap: Map<string, string> | null = null

function getAliasMap(): Map<string, string> {
  if (aliasMap) return aliasMap
  const map = new Map<string, string>()
  for (const b of BOOKS) {
    map.set(normalize(b.name), b.id)
    map.set(normalize(b.abbr), b.id)
    map.set(b.id.toLowerCase(), b.id)
    // "1 samuel", "1samuel" y "i samuel"
    const compact = normalize(b.name).replace(/^(\d) /, '$1')
    map.set(compact, b.id)
  }
  for (const [alias, id] of Object.entries(EXTRA_ALIASES)) map.set(alias, id)
  // "Juan" debe ser el evangelio; "Jn" también, pero "1 Jn" es 1 Juan (ya cubierto arriba).
  map.set('juan', 'JHN')
  aliasMap = map
  return map
}

export function findBook(text: string): Book | undefined {
  const key = normalize(text)
  const direct = getAliasMap().get(key)
  if (direct) return getBook(direct)
  const compact = getAliasMap().get(key.replace(/^(\d) /, '$1'))
  return compact ? getBook(compact) : undefined
}

/**
 * Interpreta referencias como "Juan 3", "1 Co 13", "Gn 1:5", "salmos 23" o "Rut 2 4".
 * Devuelve null si el libro no existe o el capítulo está fuera de rango.
 */
export function parseReference(input: string): ParsedReference | null {
  const text = normalize(input)
  if (!text) return null
  const match = text.match(/^(.*?)[\s]*(\d+)(?:\s*[:.,\s]\s*(\d+))?$/)
  let bookPart: string
  let chapter: number
  let verse: number | undefined
  if (match && match[1] && !/^\d$/.test(match[1])) {
    bookPart = match[1]
    chapter = Number(match[2])
    verse = match[3] ? Number(match[3]) : undefined
  } else {
    // Solo el nombre del libro: lleva al capítulo 1.
    bookPart = text
    chapter = 1
  }
  const book = findBook(bookPart)
  if (!book) return null
  if (!Number.isInteger(chapter) || chapter < 1 || chapter > book.chapters) return null
  if (verse !== undefined && verse < 1) return null
  return { bookId: book.id, chapter, verse }
}

export function formatReference(bookId: string, chapter: number, verse?: number): string {
  const book = getBook(bookId)
  const name = book ? book.name : bookId
  return verse ? `${name} ${chapter}:${verse}` : `${name} ${chapter}`
}

export function readerPath(bookId: string, chapter: number, verse?: number): string {
  const base = `/leer/${bookId.toLowerCase()}/${chapter}`
  return verse ? `${base}?v=${verse}` : base
}
