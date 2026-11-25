export type Testament = 'AT' | 'NT'

export interface Book {
  /** Código de 3 caracteres (estilo OSIS). Se usa en rutas en minúsculas: /libro/gen */
  id: string
  name: string
  abbr: string
  testament: Testament
  /** Posición canónica 1–66 */
  order: number
  /** Número de capítulos (canon protestante de 66 libros) */
  chapters: number
  /** Agrupación tradicional */
  section: string
}

type Row = [id: string, name: string, abbr: string, chapters: number, section: string]

const AT: Row[] = [
  ['GEN', 'Génesis', 'Gn', 50, 'Pentateuco'],
  ['EXO', 'Éxodo', 'Éx', 40, 'Pentateuco'],
  ['LEV', 'Levítico', 'Lv', 27, 'Pentateuco'],
  ['NUM', 'Números', 'Nm', 36, 'Pentateuco'],
  ['DEU', 'Deuteronomio', 'Dt', 34, 'Pentateuco'],
  ['JOS', 'Josué', 'Jos', 24, 'Libros históricos'],
  ['JDG', 'Jueces', 'Jue', 21, 'Libros históricos'],
  ['RUT', 'Rut', 'Rt', 4, 'Libros históricos'],
  ['1SA', '1 Samuel', '1 S', 31, 'Libros históricos'],
  ['2SA', '2 Samuel', '2 S', 24, 'Libros históricos'],
  ['1KI', '1 Reyes', '1 R', 22, 'Libros históricos'],
  ['2KI', '2 Reyes', '2 R', 25, 'Libros históricos'],
  ['1CH', '1 Crónicas', '1 Cr', 29, 'Libros históricos'],
  ['2CH', '2 Crónicas', '2 Cr', 36, 'Libros históricos'],
  ['EZR', 'Esdras', 'Esd', 10, 'Libros históricos'],
  ['NEH', 'Nehemías', 'Neh', 13, 'Libros históricos'],
  ['EST', 'Ester', 'Est', 10, 'Libros históricos'],
  ['JOB', 'Job', 'Job', 42, 'Poesía y sabiduría'],
  ['PSA', 'Salmos', 'Sal', 150, 'Poesía y sabiduría'],
  ['PRO', 'Proverbios', 'Pr', 31, 'Poesía y sabiduría'],
  ['ECC', 'Eclesiastés', 'Ec', 12, 'Poesía y sabiduría'],
  ['SNG', 'Cantares', 'Cnt', 8, 'Poesía y sabiduría'],
  ['ISA', 'Isaías', 'Is', 66, 'Profetas mayores'],
  ['JER', 'Jeremías', 'Jer', 52, 'Profetas mayores'],
  ['LAM', 'Lamentaciones', 'Lm', 5, 'Profetas mayores'],
  ['EZK', 'Ezequiel', 'Ez', 48, 'Profetas mayores'],
  ['DAN', 'Daniel', 'Dn', 12, 'Profetas mayores'],
  ['HOS', 'Oseas', 'Os', 14, 'Profetas menores'],
  ['JOL', 'Joel', 'Jl', 3, 'Profetas menores'],
  ['AMO', 'Amós', 'Am', 9, 'Profetas menores'],
  ['OBA', 'Abdías', 'Abd', 1, 'Profetas menores'],
  ['JON', 'Jonás', 'Jon', 4, 'Profetas menores'],
  ['MIC', 'Miqueas', 'Mi', 7, 'Profetas menores'],
  ['NAM', 'Nahúm', 'Nah', 3, 'Profetas menores'],
  ['HAB', 'Habacuc', 'Hab', 3, 'Profetas menores'],
  ['ZEP', 'Sofonías', 'Sof', 3, 'Profetas menores'],
  ['HAG', 'Hageo', 'Hag', 2, 'Profetas menores'],
  ['ZEC', 'Zacarías', 'Zac', 14, 'Profetas menores'],
  ['MAL', 'Malaquías', 'Mal', 4, 'Profetas menores'],
]

const NT: Row[] = [
  ['MAT', 'Mateo', 'Mt', 28, 'Evangelios'],
  ['MRK', 'Marcos', 'Mr', 16, 'Evangelios'],
  ['LUK', 'Lucas', 'Lc', 24, 'Evangelios'],
  ['JHN', 'Juan', 'Jn', 21, 'Evangelios'],
  ['ACT', 'Hechos', 'Hch', 28, 'Historia de la iglesia'],
  ['ROM', 'Romanos', 'Ro', 16, 'Cartas de Pablo'],
  ['1CO', '1 Corintios', '1 Co', 16, 'Cartas de Pablo'],
  ['2CO', '2 Corintios', '2 Co', 13, 'Cartas de Pablo'],
  ['GAL', 'Gálatas', 'Gá', 6, 'Cartas de Pablo'],
  ['EPH', 'Efesios', 'Ef', 6, 'Cartas de Pablo'],
  ['PHP', 'Filipenses', 'Fil', 4, 'Cartas de Pablo'],
  ['COL', 'Colosenses', 'Col', 4, 'Cartas de Pablo'],
  ['1TH', '1 Tesalonicenses', '1 Ts', 5, 'Cartas de Pablo'],
  ['2TH', '2 Tesalonicenses', '2 Ts', 3, 'Cartas de Pablo'],
  ['1TI', '1 Timoteo', '1 Ti', 6, 'Cartas de Pablo'],
  ['2TI', '2 Timoteo', '2 Ti', 4, 'Cartas de Pablo'],
  ['TIT', 'Tito', 'Tit', 3, 'Cartas de Pablo'],
  ['PHM', 'Filemón', 'Flm', 1, 'Cartas de Pablo'],
  ['HEB', 'Hebreos', 'He', 13, 'Cartas generales'],
  ['JAS', 'Santiago', 'Stg', 5, 'Cartas generales'],
  ['1PE', '1 Pedro', '1 P', 5, 'Cartas generales'],
  ['2PE', '2 Pedro', '2 P', 3, 'Cartas generales'],
  ['1JN', '1 Juan', '1 Jn', 5, 'Cartas generales'],
  ['2JN', '2 Juan', '2 Jn', 1, 'Cartas generales'],
  ['3JN', '3 Juan', '3 Jn', 1, 'Cartas generales'],
  ['JUD', 'Judas', 'Jud', 1, 'Cartas generales'],
  ['REV', 'Apocalipsis', 'Ap', 22, 'Profecía'],
]

function build(rows: Row[], testament: Testament, offset: number): Book[] {
  return rows.map(([id, name, abbr, chapters, section], i) => ({
    id,
    name,
    abbr,
    testament,
    order: offset + i + 1,
    chapters,
    section,
  }))
}

export const OLD_TESTAMENT: Book[] = build(AT, 'AT', 0)
export const NEW_TESTAMENT: Book[] = build(NT, 'NT', AT.length)
export const BOOKS: Book[] = [...OLD_TESTAMENT, ...NEW_TESTAMENT]

const byId = new Map(BOOKS.map((b) => [b.id.toLowerCase(), b]))

export function getBook(id: string | undefined): Book | undefined {
  return id ? byId.get(id.toLowerCase()) : undefined
}

export const TOTAL_CHAPTERS = BOOKS.reduce((n, b) => n + b.chapters, 0)

export function booksByTestament(t: Testament): Book[] {
  return t === 'AT' ? OLD_TESTAMENT : NEW_TESTAMENT
}

export function groupBySection(books: Book[]): { section: string; books: Book[] }[] {
  const groups: { section: string; books: Book[] }[] = []
  for (const b of books) {
    const last = groups[groups.length - 1]
    if (last && last.section === b.section) last.books.push(b)
    else groups.push({ section: b.section, books: [b] })
  }
  return groups
}

export function chapterKey(bookId: string, chapter: number): string {
  return `${bookId.toUpperCase()}.${chapter}`
}
