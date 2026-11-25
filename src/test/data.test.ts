import { describe, expect, it } from 'vitest'
import { BOOKS, NEW_TESTAMENT, OLD_TESTAMENT, TOTAL_CHAPTERS, getBook, groupBySection } from '@/data/books'
import { BOOK_INFO } from '@/data/bookInfo'
import { ERAS, TIMELINE } from '@/data/timeline'
import { ENCYCLOPEDIA } from '@/data/encyclopedia'
import { EXPLANATIONS } from '@/data/explanations'
import { VIDEO_TOPICS, parseYouTubeId, youtubeSearchUrl } from '@/data/videos'

describe('libros', () => {
  it('tiene los 66 libros del canon protestante', () => {
    expect(BOOKS).toHaveLength(66)
    expect(OLD_TESTAMENT).toHaveLength(39)
    expect(NEW_TESTAMENT).toHaveLength(27)
  })

  it('suma los capítulos esperados (929 + 260 = 1189)', () => {
    expect(OLD_TESTAMENT.reduce((n, b) => n + b.chapters, 0)).toBe(929)
    expect(NEW_TESTAMENT.reduce((n, b) => n + b.chapters, 0)).toBe(260)
    expect(TOTAL_CHAPTERS).toBe(1189)
  })

  it('usa ids y órdenes únicos y consecutivos', () => {
    expect(new Set(BOOKS.map((b) => b.id)).size).toBe(66)
    expect(BOOKS.map((b) => b.order)).toEqual(Array.from({ length: 66 }, (_, i) => i + 1))
  })

  it('conoce capítulos de libros clave', () => {
    expect(getBook('psa')?.chapters).toBe(150)
    expect(getBook('GEN')?.chapters).toBe(50)
    expect(getBook('jhn')?.chapters).toBe(21)
    expect(getBook('rev')?.chapters).toBe(22)
    expect(getBook('obq')).toBeUndefined()
  })

  it('agrupa por sección conservando el orden', () => {
    const groups = groupBySection(OLD_TESTAMENT)
    expect(groups.map((g) => g.section)).toEqual([
      'Pentateuco',
      'Libros históricos',
      'Poesía y sabiduría',
      'Profetas mayores',
      'Profetas menores',
    ])
    expect(groups[0].books).toHaveLength(5)
  })

  it('tiene información completa de cada libro', () => {
    for (const b of BOOKS) {
      const info = BOOK_INFO[b.id]
      expect(info, `falta info de ${b.id}`).toBeDefined()
      expect(info.author.length).toBeGreaterThan(3)
      expect(info.summary.length).toBeGreaterThan(20)
      expect(info.context.length).toBeGreaterThan(20)
      expect(info.themes.length).toBeGreaterThanOrEqual(2)
    }
    expect(Object.keys(BOOK_INFO)).toHaveLength(66)
  })
})

describe('contenido de estudio', () => {
  const valid = (ids: string[]) => ids.every((id) => !!getBook(id))

  it('la cronología referencia épocas y libros válidos', () => {
    const eras = new Set(ERAS.map((e) => e.id))
    expect(new Set(TIMELINE.map((t) => t.id)).size).toBe(TIMELINE.length)
    for (const t of TIMELINE) {
      expect(eras.has(t.era), t.id).toBe(true)
      expect(valid(t.bookIds), t.id).toBe(true)
    }
  })

  it('la enciclopedia tiene ids únicos y libros válidos', () => {
    expect(new Set(ENCYCLOPEDIA.map((e) => e.id)).size).toBe(ENCYCLOPEDIA.length)
    for (const e of ENCYCLOPEDIA) expect(valid(e.bookIds), e.id).toBe(true)
    expect(ENCYCLOPEDIA.some((e) => e.kind === 'persona')).toBe(true)
    expect(ENCYCLOPEDIA.some((e) => e.kind === 'lugar')).toBe(true)
  })

  it('las explicaciones tienen secciones y ids únicos', () => {
    expect(new Set(EXPLANATIONS.map((e) => e.id)).size).toBe(EXPLANATIONS.length)
    for (const e of EXPLANATIONS) expect(e.sections.length).toBeGreaterThan(0)
  })

  it('los videos son búsquedas, no enlaces inventados', () => {
    expect(VIDEO_TOPICS.length).toBeGreaterThan(5)
    expect(youtubeSearchUrl('a b')).toBe('https://www.youtube.com/results?search_query=a%20b')
  })

  it('extrae el id de enlaces de YouTube', () => {
    expect(parseYouTubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
    expect(parseYouTubeId('https://youtu.be/dQw4w9WgXcQ?t=3')).toBe('dQw4w9WgXcQ')
    expect(parseYouTubeId('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
    expect(parseYouTubeId('https://www.youtube.com/shorts/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
    expect(parseYouTubeId('https://example.com/watch?v=dQw4w9WgXcQ')).toBeNull()
    expect(parseYouTubeId('no es un enlace')).toBeNull()
    expect(parseYouTubeId('https://www.youtube.com/watch?v=corto')).toBeNull()
  })
})
