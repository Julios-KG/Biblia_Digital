import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  FileWarning,
  Info,
  NotebookPen,
  Star,
  StickyNote,
} from 'lucide-react'
import { BOOKS, getBook } from '@/data/books'
import { formatReference, readerPath } from '@/lib/reference'
import { nextChapter, prevChapter } from '@/lib/progress'
import { listVersions, loadChapter, type VersionInfo } from '@/lib/bibleText'
import { useBookmarks, useFavorites, useNotes, useProgress, useSettings } from '@/store/hooks'
import NoteEditor from '@/components/NoteEditor'
import NotFoundPage from '@/pages/NotFoundPage'
import type { FontSize } from '@/types'

type TextState = { status: 'loading' } | { status: 'ready'; verses: string[] } | { status: 'missing' }

const FONT_CLASS: Record<FontSize, string> = {
  sm: 'text-base leading-7',
  md: 'text-lg leading-8',
  lg: 'text-xl leading-9',
  xl: 'text-2xl leading-10',
}

export default function ReaderPage() {
  const params = useParams()
  const book = getBook(params.bookId)
  const chapter = Number(params.chapter)
  const valid = !!book && Number.isInteger(chapter) && chapter >= 1 && chapter <= book.chapters

  if (!book || !valid) return <NotFoundPage message="Ese capítulo no existe. Revisa el libro y el número de capítulo." />
  return <Reader key={`${book.id}.${chapter}`} bookId={book.id} chapter={chapter} />
}

function Reader({ bookId, chapter }: { bookId: string; chapter: number }) {
  const book = getBook(bookId)!
  const navigate = useNavigate()
  const [search] = useSearchParams()
  const targetVerse = Number(search.get('v')) || undefined

  const { settings, update } = useSettings()
  const { isRead, setChapterRead, visit } = useProgress()
  const { isBookmarked, toggleBookmark } = useBookmarks()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { notes, addNote } = useNotes()

  const [versions, setVersions] = useState<VersionInfo[] | null>(null)
  const [text, setText] = useState<TextState>({ status: 'loading' })
  const [selected, setSelected] = useState<number | null>(targetVerse ?? null)
  const [noteOpen, setNoteOpen] = useState(false)
  const [noteVerse, setNoteVerse] = useState<number | undefined>()
  const [copied, setCopied] = useState(false)
  const [jump, setJump] = useState('')

  // Versiones disponibles (archivos estáticos + importadas)
  useEffect(() => {
    let cancelled = false
    listVersions().then((v) => {
      if (!cancelled) setVersions(v)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const versionId = useMemo(() => {
    if (!versions || versions.length === 0) return null
    return versions.some((v) => v.id === settings.versionId) ? settings.versionId : versions[0].id
  }, [versions, settings.versionId])

  // Carga del capítulo
  useEffect(() => {
    if (versions === null) return
    let cancelled = false
    setText({ status: 'loading' })
    loadChapter(versionId, bookId, chapter).then((verses) => {
      if (cancelled) return
      setText(verses ? { status: 'ready', verses } : { status: 'missing' })
    })
    return () => {
      cancelled = true
    }
  }, [versions, versionId, bookId, chapter])

  // Guarda el punto de lectura al abrir el capítulo
  useEffect(() => {
    visit(bookId, chapter)
  }, [visit, bookId, chapter])

  // Desplaza al versículo pedido
  useEffect(() => {
    if (text.status === 'ready' && targetVerse) {
      document.getElementById(`v${targetVerse}`)?.scrollIntoView?.({ block: 'center' })
    }
  }, [text.status, targetVerse])

  const prev = prevChapter(bookId, chapter)
  const next = nextChapter(bookId, chapter)
  const read = isRead(bookId, chapter)
  const bookmarked = isBookmarked(bookId, chapter)
  const chapterNotes = notes.filter((n) => n.bookId === bookId && n.chapter === chapter)
  const verses = text.status === 'ready' ? text.verses : []
  const selectedText = selected && text.status === 'ready' ? verses[selected - 1] : undefined

  const goTo = useCallback((b: string, c: number) => navigate(readerPath(b, c)), [navigate])

  function openNote(verse?: number) {
    setNoteVerse(verse)
    setNoteOpen(true)
  }

  async function copyVerse() {
    if (!selected || !selectedText) return
    try {
      await navigator.clipboard.writeText(`${selectedText} — ${formatReference(bookId, chapter, selected)}`)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  function submitJump(e: FormEvent) {
    e.preventDefault()
    const n = Number(jump)
    if (Number.isInteger(n) && n >= 1 && n <= verses.length) {
      setSelected(n)
      document.getElementById(`v${n}`)?.scrollIntoView?.({ behavior: 'smooth', block: 'center' })
    }
  }

  function markAndContinue() {
    setChapterRead(bookId, chapter, true)
    if (next) goTo(next.bookId, next.chapter)
  }

  return (
    <article className="mx-auto max-w-3xl space-y-6">
      {/* Navegación: libro → capítulo → versículo */}
      <section aria-label="Navegación" className="card grid gap-3 p-3 sm:grid-cols-[1fr_7rem_auto]">
        <div>
          <label htmlFor="nav-book" className="sr-only">
            Libro
          </label>
          <select id="nav-book" className="input" value={bookId} onChange={(e) => goTo(e.target.value, 1)}>
            <optgroup label="Antiguo Testamento">
              {BOOKS.filter((b) => b.testament === 'AT').map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="Nuevo Testamento">
              {BOOKS.filter((b) => b.testament === 'NT').map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </optgroup>
          </select>
        </div>
        <div>
          <label htmlFor="nav-chapter" className="sr-only">
            Capítulo
          </label>
          <select id="nav-chapter" className="input" value={chapter} onChange={(e) => goTo(bookId, Number(e.target.value))}>
            {Array.from({ length: book.chapters }, (_, i) => i + 1).map((c) => (
              <option key={c} value={c}>
                Cap. {c}
              </option>
            ))}
          </select>
        </div>
        <form onSubmit={submitJump} className="flex gap-2">
          <label htmlFor="nav-verse" className="sr-only">
            Ir al versículo
          </label>
          <input
            id="nav-verse"
            className="input w-24"
            inputMode="numeric"
            placeholder="Vers."
            value={jump}
            disabled={text.status !== 'ready'}
            onChange={(e) => setJump(e.target.value.replace(/\D/g, ''))}
            title={text.status === 'ready' ? `Versículos 1–${verses.length}` : 'Necesitas texto cargado para ir a un versículo'}
          />
          <button type="submit" className="btn btn-outline" disabled={text.status !== 'ready'}>
            Ir
          </button>
        </form>
      </section>

      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gold-700">
            <Link to={`/libro/${bookId.toLowerCase()}`} className="hover:underline">
              Información del libro
            </Link>
          </p>
          <h1 className="text-3xl font-bold">
            {book.name} {chapter}
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={`btn ${bookmarked ? 'btn-gold' : 'btn-outline'}`}
            aria-pressed={bookmarked}
            onClick={() => toggleBookmark(bookId, chapter)}
          >
            {bookmarked ? <BookmarkCheck aria-hidden className="size-4" /> : <Bookmark aria-hidden className="size-4" />}
            {bookmarked ? 'Marcador guardado' : 'Poner marcador'}
          </button>
          <button
            type="button"
            className={`btn ${read ? 'btn-gold' : 'btn-outline'}`}
            aria-pressed={read}
            onClick={() => setChapterRead(bookId, chapter, !read)}
          >
            <CheckCircle2 aria-hidden className="size-4" />
            {read ? 'Leído' : 'Marcar como leído'}
          </button>
        </div>
      </header>

      {/* Controles de lectura */}
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <div className="flex items-center gap-1" role="group" aria-label="Tamaño del texto">
          {(['sm', 'md', 'lg', 'xl'] as FontSize[]).map((s, i) => (
            <button
              key={s}
              type="button"
              aria-pressed={settings.fontSize === s}
              aria-label={['Texto pequeño', 'Texto mediano', 'Texto grande', 'Texto muy grande'][i]}
              onClick={() => update({ fontSize: s })}
              className={`grid size-10 place-items-center rounded-lg border font-serif font-bold ${
                settings.fontSize === s ? 'border-navy bg-navy text-white' : 'border-line bg-white text-navy'
              }`}
              style={{ fontSize: 12 + i * 3 }}
            >
              A
            </button>
          ))}
        </div>
        {versions && versions.length > 1 && (
          <div>
            <label htmlFor="version" className="sr-only">
              Versión
            </label>
            <select
              id="version"
              className="input !min-h-10 !w-auto"
              value={versionId ?? ''}
              onChange={(e) => update({ versionId: e.target.value })}
            >
              {versions.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Texto */}
      {text.status === 'loading' && (
        <div className="card p-6 text-sm text-muted" role="status">
          Cargando…
        </div>
      )}

      {text.status === 'missing' && (
        <section className="card border-gold/60 bg-gold/10 p-5" aria-labelledby="sin-texto">
          <h2 id="sin-texto" className="flex items-center gap-2 text-lg font-bold">
            <FileWarning aria-hidden className="size-5 text-gold-700" /> El texto de este capítulo no está cargado
          </h2>
          <p className="mt-2 text-sm text-ink/90">
            Mi Biblia Digital no incluye ninguna traducción por defecto y nunca inventa versículos. Para leer el texto aquí, carga
            una versión que tengas autorizada (o de dominio público) desde Ajustes. Mientras tanto puedes usar el marcador, el progreso
            y los apuntes de este capítulo.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link to="/ajustes" className="btn btn-primary">
              Cargar texto en Ajustes
            </Link>
            <Link to={`/libro/${bookId.toLowerCase()}`} className="btn btn-outline">
              <Info aria-hidden className="size-4" /> Leer información del libro
            </Link>
          </div>
        </section>
      )}

      {text.status === 'ready' && (
        <section
          aria-label={`Texto de ${book.name} ${chapter}`}
          className={`card p-5 sm:p-8 ${FONT_CLASS[settings.fontSize]} ${settings.serif ? 'font-serif' : 'font-sans'}`}
        >
          <ol className="space-y-1">
            {verses.map((v, i) => {
              const n = i + 1
              const isSel = selected === n
              const fav = isFavorite(bookId, chapter, n)
              return (
                <li key={n} id={`v${n}`} className="scroll-mt-28">
                  <button
                    type="button"
                    onClick={() => setSelected(isSel ? null : n)}
                    aria-pressed={isSel}
                    aria-label={`Versículo ${n}${fav ? ', favorito' : ''}`}
                    className={`w-full rounded-lg px-2 py-1 text-left transition-colors ${
                      isSel ? 'bg-gold/30' : targetVerse === n ? 'bg-gold/15' : 'hover:bg-navy/5'
                    }`}
                  >
                    <sup className="mr-2 select-none font-sans text-xs font-bold text-gold-700">{n}</sup>
                    {v}
                    {fav && <Star aria-hidden className="ml-2 inline size-4 fill-gold text-gold-700" />}
                  </button>
                </li>
              )
            })}
          </ol>
        </section>
      )}

      {/* Acciones del versículo seleccionado */}
      {selected && text.status === 'ready' && (
        <div
          role="toolbar"
          aria-label={`Acciones para ${formatReference(bookId, chapter, selected)}`}
          className="card sticky bottom-20 z-20 flex flex-wrap items-center gap-2 border-gold p-3 shadow-lg lg:bottom-4"
        >
          <span className="mr-auto text-sm font-bold text-navy">{formatReference(bookId, chapter, selected)}</span>
          <button
            type="button"
            className={`btn ${isFavorite(bookId, chapter, selected) ? 'btn-gold' : 'btn-outline'}`}
            aria-pressed={isFavorite(bookId, chapter, selected)}
            onClick={() => toggleFavorite(bookId, chapter, selected, selectedText)}
          >
            <Star aria-hidden className="size-4" /> Favorito
          </button>
          <button type="button" className="btn btn-outline" onClick={() => openNote(selected)}>
            <StickyNote aria-hidden className="size-4" /> Apunte
          </button>
          <button type="button" className="btn btn-outline" onClick={copyVerse}>
            <Copy aria-hidden className="size-4" /> {copied ? 'Copiado' : 'Copiar'}
          </button>
        </div>
      )}

      {/* Apuntes del capítulo */}
      <section aria-labelledby="apuntes-capitulo" className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 id="apuntes-capitulo" className="flex items-center gap-2 text-xl font-bold">
            <NotebookPen aria-hidden className="size-5 text-gold-700" /> Apuntes de este capítulo
          </h2>
          <button type="button" className="btn btn-outline" onClick={() => openNote(selected ?? undefined)}>
            Añadir apunte
          </button>
        </div>
        {chapterNotes.length === 0 ? (
          <p className="text-sm text-muted">Aún no tienes apuntes aquí.</p>
        ) : (
          <ul className="space-y-2">
            {chapterNotes.map((n) => (
              <li key={n.id} className="card p-4">
                <p className="font-bold">{n.title}</p>
                {n.verse && <p className="text-xs text-gold-700">{formatReference(bookId, chapter, n.verse)}</p>}
                <p className="mt-1 whitespace-pre-line text-sm text-ink/90">{n.body}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Anterior / siguiente */}
      <nav aria-label="Capítulos" className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        {prev ? (
          <Link to={readerPath(prev.bookId, prev.chapter)} className="btn btn-outline">
            <ChevronLeft aria-hidden className="size-4" /> {formatReference(prev.bookId, prev.chapter)}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <button type="button" className="btn btn-primary" onClick={markAndContinue}>
            Marcar leído y seguir a {formatReference(next.bookId, next.chapter)} <ChevronRight aria-hidden className="size-4" />
          </button>
        )}
      </nav>

      <NoteEditor
        open={noteOpen}
        onClose={() => setNoteOpen(false)}
        initial={{ bookId, chapter, verse: noteVerse, tags: [] }}
        onSave={(input) => addNote(input)}
      />
    </article>
  )
}
