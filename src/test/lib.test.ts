import { describe, expect, it } from 'vitest'
import { parseReference, formatReference, readerPath } from '@/lib/reference'
import { BOOKS, getBook } from '@/data/books'
import {
  bookPercent,
  completedBooks,
  computeStreak,
  countReadInBook,
  nextChapter,
  overallPercent,
  prevChapter,
  totalRead,
  type ReadMap,
} from '@/lib/progress'
import { validateBible } from '@/lib/bibleText'
import { STORAGE_KEYS, clearAllData, exportAllData, getStored, importAllData, setStored } from '@/lib/storage'
import { notesToMarkdown } from '@/lib/notesExport'
import { parseTags } from '@/components/NoteEditor'
import { notConfiguredProvider } from '@/lib/aiAssistant'

describe('referencias', () => {
  it('interpreta nombres, abreviaturas y versículos', () => {
    expect(parseReference('Juan 3')).toEqual({ bookId: 'JHN', chapter: 3, verse: undefined })
    expect(parseReference('juan 3:16')).toEqual({ bookId: 'JHN', chapter: 3, verse: 16 })
    expect(parseReference('1 Co 13')).toEqual({ bookId: '1CO', chapter: 13, verse: undefined })
    expect(parseReference('1 Corintios 13:4')).toEqual({ bookId: '1CO', chapter: 13, verse: 4 })
    expect(parseReference('Gn 1:5')).toEqual({ bookId: 'GEN', chapter: 1, verse: 5 })
    expect(parseReference('Salmos 23')).toEqual({ bookId: 'PSA', chapter: 23, verse: undefined })
    expect(parseReference('Sal 119')?.chapter).toBe(119)
    expect(parseReference('génesis 2')?.bookId).toBe('GEN')
    expect(parseReference('1 Jn 1')?.bookId).toBe('1JN')
    expect(parseReference('Rut 2 4')).toEqual({ bookId: 'RUT', chapter: 2, verse: 4 })
  })

  it('un nombre sin número lleva al capítulo 1', () => {
    expect(parseReference('Apocalipsis')).toEqual({ bookId: 'REV', chapter: 1, verse: undefined })
    expect(parseReference('2 Reyes')?.bookId).toBe('2KI')
  })

  it('rechaza libros y capítulos inexistentes', () => {
    expect(parseReference('')).toBeNull()
    expect(parseReference('Libro inventado 3')).toBeNull()
    expect(parseReference('Juan 22')).toBeNull()
    expect(parseReference('Rut 0')).toBeNull()
    expect(parseReference('Salmos 151')).toBeNull()
  })

  it('reconoce cada libro por su nombre y su abreviatura', () => {
    for (const b of BOOKS) {
      expect(parseReference(`${b.name} 1`)?.bookId, b.name).toBe(b.id)
      expect(parseReference(`${b.abbr} 1`)?.bookId, b.abbr).toBe(b.id)
    }
  })

  it('formatea referencias y rutas', () => {
    expect(formatReference('JHN', 3, 16)).toBe('Juan 3:16')
    expect(formatReference('GEN', 1)).toBe('Génesis 1')
    expect(readerPath('JHN', 3, 16)).toBe('/leer/jhn/3?v=16')
    expect(readerPath('GEN', 1)).toBe('/leer/gen/1')
  })
})

describe('progreso', () => {
  const gen = getBook('GEN')!
  const rut = getBook('RUT')!

  it('cuenta capítulos leídos por libro y total', () => {
    const read: ReadMap = { 'GEN.1': 1, 'GEN.2': 1, 'RUT.1': 1 }
    expect(countReadInBook(read, gen)).toBe(2)
    expect(bookPercent(read, gen)).toBe(4)
    expect(totalRead(read)).toBe(3)
    expect(overallPercent(read)).toBeCloseTo(0.3, 1)
  })

  it('ignora claves inválidas', () => {
    expect(totalRead({ 'XXX.1': 1, 'GEN.99': 1 })).toBe(0)
  })

  it('detecta libros completos', () => {
    const read: ReadMap = {}
    for (let c = 1; c <= rut.chapters; c++) read[`RUT.${c}`] = 1
    expect(completedBooks(read).map((b) => b.id)).toEqual(['RUT'])
  })

  it('calcula la racha de días consecutivos', () => {
    const day = 24 * 60 * 60 * 1000
    const now = new Date(2026, 5, 10, 12).getTime()
    expect(computeStreak({}, now)).toBe(0)
    expect(computeStreak({ 'GEN.1': now, 'GEN.2': now - day, 'GEN.3': now - 2 * day }, now)).toBe(3)
    // Si hoy no se leyó, cuenta desde ayer
    expect(computeStreak({ 'GEN.1': now - day, 'GEN.2': now - 2 * day }, now)).toBe(2)
    // Una pausa rompe la racha
    expect(computeStreak({ 'GEN.1': now, 'GEN.2': now - 3 * day }, now)).toBe(1)
    expect(computeStreak({ 'GEN.1': now - 5 * day }, now)).toBe(0)
  })

  it('navega entre capítulos cruzando libros', () => {
    expect(nextChapter('GEN', 1)).toEqual({ bookId: 'GEN', chapter: 2 })
    expect(nextChapter('GEN', 50)).toEqual({ bookId: 'EXO', chapter: 1 })
    expect(nextChapter('MAL', 4)).toEqual({ bookId: 'MAT', chapter: 1 })
    expect(nextChapter('REV', 22)).toBeNull()
    expect(prevChapter('EXO', 1)).toEqual({ bookId: 'GEN', chapter: 50 })
    expect(prevChapter('GEN', 1)).toBeNull()
  })
})

describe('validación de texto importado', () => {
  const meta = { id: 'prueba', name: 'Prueba', license: 'Texto de prueba' }

  it('acepta un archivo válido', () => {
    const r = validateBible({ meta, books: { gen: { '1': ['a', 'b'] } } })
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.bible.books.GEN['1']).toEqual(['a', 'b'])
  })

  it('exige licencia, id válido y contenido', () => {
    expect(validateBible({ meta: { ...meta, license: '' }, books: { GEN: { '1': ['a'] } } }).ok).toBe(false)
    expect(validateBible({ meta: { ...meta, id: 'Mal Id!' }, books: { GEN: { '1': ['a'] } } }).ok).toBe(false)
    expect(validateBible({ meta, books: {} }).ok).toBe(false)
    expect(validateBible(null).ok).toBe(false)
  })

  it('rechaza libros, capítulos y versículos inválidos', () => {
    expect(validateBible({ meta, books: { ZZZ: { '1': ['a'] } } }).ok).toBe(false)
    expect(validateBible({ meta, books: { RUT: { '5': ['a'] } } }).ok).toBe(false)
    expect(validateBible({ meta, books: { RUT: { '1': [1, 2] } } }).ok).toBe(false)
    expect(validateBible({ meta, books: { RUT: { '1': 'texto' } } }).ok).toBe(false)
  })
})

describe('almacenamiento local', () => {
  it('guarda y recupera valores', () => {
    setStored(STORAGE_KEYS.settings, { fontSize: 'xl', serif: false, versionId: null })
    expect(getStored(STORAGE_KEYS.settings, null)).toEqual({ fontSize: 'xl', serif: false, versionId: null })
    expect(JSON.parse(window.localStorage.getItem('mbd:settings')!).fontSize).toBe('xl')
  })

  it('exporta, borra e importa copias de seguridad', () => {
    setStored(STORAGE_KEYS.progress, { 'GEN.1': 123 })
    const backup = exportAllData()
    expect(backup.app).toBe('mi-biblia-digital')
    expect(backup.data.progress).toEqual({ 'GEN.1': 123 })

    clearAllData()
    expect(getStored(STORAGE_KEYS.progress, {})).toEqual({})

    const result = importAllData(JSON.parse(JSON.stringify(backup)))
    expect(result).toEqual({ ok: true, keys: 1 })
    expect(getStored(STORAGE_KEYS.progress, {})).toEqual({ 'GEN.1': 123 })
  })

  it('rechaza archivos ajenos y claves desconocidas', () => {
    expect(importAllData({ foo: 1 }).ok).toBe(false)
    expect(importAllData(null).ok).toBe(false)
    const r = importAllData({ app: 'mi-biblia-digital', version: 1, data: { desconocida: 1, notes: [] } })
    expect(r).toEqual({ ok: true, keys: 1 })
    expect(window.localStorage.getItem('mbd:desconocida')).toBeNull()
  })
})

describe('apuntes y asistente', () => {
  it('normaliza etiquetas', () => {
    expect(parseTags(' Oración, gracia ,, ORACIÓN ')).toEqual(['oración', 'gracia'])
  })

  it('exporta apuntes a Markdown', () => {
    const md = notesToMarkdown([
      { id: '1', title: 'Mi idea', body: 'Texto', bookId: 'JHN', chapter: 3, verse: 16, tags: ['fe'], createdAt: 0, updatedAt: 0 },
    ])
    expect(md).toContain('# Mi cuaderno de apuntes')
    expect(md).toContain('## Mi idea')
    expect(md).toContain('Juan 3:16')
    expect(md).toContain('#fe')
  })

  it('el asistente por defecto no está configurado y no llama a ningún servicio', async () => {
    expect(notConfiguredProvider.isConfigured()).toBe(false)
    const r = await notConfiguredProvider.ask({ question: 'Hola' })
    expect(r.status).toBe('not-configured')
  })
})
