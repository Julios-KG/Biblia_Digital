import { Link } from 'react-router-dom'
import { groupBySection, type Book } from '@/data/books'
import { ProgressBar } from '@/components/ui'
import { useProgress } from '@/store/hooks'

export function BookCard({ book, showProgress = true }: { book: Book; showProgress?: boolean }) {
  const { bookRead, bookPercent } = useProgress()
  const read = bookRead(book)
  return (
    <Link
      to={`/libro/${book.id.toLowerCase()}`}
      className="card block p-4 transition hover:-translate-y-0.5 hover:border-gold hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-bold leading-snug">{book.name}</h3>
          <p className="text-xs text-muted">
            {book.chapters} {book.chapters === 1 ? 'capítulo' : 'capítulos'}
          </p>
        </div>
        <span className="badge shrink-0">{book.abbr}</span>
      </div>
      {showProgress && (
        <div className="mt-3 space-y-1">
          <ProgressBar value={bookPercent(book)} label={`Progreso en ${book.name}`} />
          <p className="text-xs text-muted">
            {read} de {book.chapters} leídos
          </p>
        </div>
      )}
    </Link>
  )
}

export function BookSections({ books }: { books: Book[] }) {
  if (books.length === 0) return null
  return (
    <div className="space-y-8">
      {groupBySection(books).map((group) => (
        <section key={group.section} aria-labelledby={`sec-${group.section}`}>
          <h2 id={`sec-${group.section}`} className="mb-3 text-lg font-bold">
            {group.section}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {group.books.map((b) => (
              <BookCard key={b.id} book={b} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
