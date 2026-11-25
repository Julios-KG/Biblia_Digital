import { Link, useParams } from 'react-router-dom'
import { BookOpenText, ChevronLeft, ChevronRight, Clock, NotebookPen, User } from 'lucide-react'
import { BOOKS, getBook } from '@/data/books'
import { BOOK_INFO } from '@/data/bookInfo'
import { TIMELINE } from '@/data/timeline'
import { ENCYCLOPEDIA } from '@/data/encyclopedia'
import ChapterGrid from '@/components/ChapterGrid'
import { PageHeader, ProgressBar } from '@/components/ui'
import { useNotes, useProgress } from '@/store/hooks'
import { formatReference, readerPath } from '@/lib/reference'
import NotFoundPage from '@/pages/NotFoundPage'

export default function BookPage() {
  const { bookId } = useParams()
  const book = getBook(bookId)
  const { bookRead, bookPercent, resetBook } = useProgress()
  const { notes } = useNotes()

  if (!book) return <NotFoundPage message="No encontré ese libro." />

  const info = BOOK_INFO[book.id]
  const idx = BOOKS.findIndex((b) => b.id === book.id)
  const prev = BOOKS[idx - 1]
  const next = BOOKS[idx + 1]
  const read = bookRead(book)
  const events = TIMELINE.filter((e) => e.bookIds.includes(book.id))
  const entries = ENCYCLOPEDIA.filter((e) => e.bookIds.includes(book.id))
  const bookNotes = notes.filter((n) => n.bookId === book.id)

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={`${book.testament === 'AT' ? 'Antiguo' : 'Nuevo'} Testamento · ${book.section}`}
        title={book.name}
        subtitle={info?.summary}
        actions={
          <Link to={readerPath(book.id, 1)} className="btn btn-primary">
            <BookOpenText aria-hidden className="size-4" /> Empezar a leer
          </Link>
        }
      />

      {info && (
        <section aria-labelledby="ficha" className="grid gap-4 md:grid-cols-3">
          <h2 id="ficha" className="sr-only">
            Ficha del libro
          </h2>
          <div className="card p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gold-700">Autor</p>
            <p className="mt-1 text-sm">{info.author}</p>
          </div>
          <div className="card p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gold-700">Fecha aproximada</p>
            <p className="mt-1 text-sm">{info.written}</p>
          </div>
          <div className="card p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gold-700">Género</p>
            <p className="mt-1 text-sm">{info.genre}</p>
          </div>
        </section>
      )}

      {info && (
        <section aria-labelledby="contexto" className="card p-5">
          <h2 id="contexto" className="mb-2 text-xl font-bold">
            Contexto histórico
          </h2>
          <p className="text-ink/90">{info.context}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {info.themes.map((t) => (
              <span key={t} className="badge">
                {t}
              </span>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted">
            Las fechas y autorías son aproximadas y reflejan la tradición y posturas frecuentes; algunas se discuten.
          </p>
        </section>
      )}

      <section aria-labelledby="capitulos">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="capitulos" className="text-xl font-bold">
              Capítulos
            </h2>
            <p className="text-sm text-muted">
              {read} de {book.chapters} leídos
            </p>
          </div>
          {read > 0 && (
            <button type="button" className="btn btn-ghost text-sm" onClick={() => resetBook(book)}>
              Reiniciar progreso del libro
            </button>
          )}
        </div>
        <div className="mb-4">
          <ProgressBar value={bookPercent(book)} label={`Progreso en ${book.name}`} />
        </div>
        <ChapterGrid book={book} />
      </section>

      {events.length > 0 && (
        <section aria-labelledby="eventos">
          <h2 id="eventos" className="mb-3 flex items-center gap-2 text-xl font-bold">
            <Clock aria-hidden className="size-5 text-gold-700" /> En la cronología
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {events.map((e) => (
              <li key={e.id} className="card p-4">
                <p className="text-xs font-semibold text-gold-700">{e.dateLabel}</p>
                <p className="font-bold">{e.title}</p>
                <p className="mt-1 text-sm text-muted">{e.reference}</p>
              </li>
            ))}
          </ul>
          <Link to="/cronologia" className="mt-3 inline-block text-sm font-semibold text-gold-700 hover:underline">
            Ver cronología completa
          </Link>
        </section>
      )}

      {entries.length > 0 && (
        <section aria-labelledby="enciclopedia">
          <h2 id="enciclopedia" className="mb-3 flex items-center gap-2 text-xl font-bold">
            <User aria-hidden className="size-5 text-gold-700" /> Personajes y lugares
          </h2>
          <div className="flex flex-wrap gap-2">
            {entries.map((e) => (
              <Link key={e.id} to={`/enciclopedia?q=${encodeURIComponent(e.name)}`} className="badge !bg-white border border-line hover:border-gold">
                {e.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {bookNotes.length > 0 && (
        <section aria-labelledby="apuntes-libro">
          <h2 id="apuntes-libro" className="mb-3 flex items-center gap-2 text-xl font-bold">
            <NotebookPen aria-hidden className="size-5 text-gold-700" /> Tus apuntes sobre {book.name}
          </h2>
          <ul className="space-y-2">
            {bookNotes.map((n) => (
              <li key={n.id} className="card p-4">
                <p className="font-bold">{n.title}</p>
                {n.chapter && <p className="text-xs text-gold-700">{formatReference(book.id, n.chapter, n.verse)}</p>}
                <p className="mt-1 line-clamp-2 text-sm text-muted">{n.body}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <nav aria-label="Libros vecinos" className="flex justify-between gap-3 border-t border-line pt-4">
        {prev ? (
          <Link to={`/libro/${prev.id.toLowerCase()}`} className="btn btn-outline">
            <ChevronLeft aria-hidden className="size-4" /> {prev.name}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link to={`/libro/${next.id.toLowerCase()}`} className="btn btn-outline">
            {next.name} <ChevronRight aria-hidden className="size-4" />
          </Link>
        )}
      </nav>
    </div>
  )
}
