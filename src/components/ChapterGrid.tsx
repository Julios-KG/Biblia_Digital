import { Link } from 'react-router-dom'
import { Bookmark, Check } from 'lucide-react'
import type { Book } from '@/data/books'
import { useBookmarks, useProgress } from '@/store/hooks'
import { readerPath } from '@/lib/reference'

export default function ChapterGrid({ book }: { book: Book }) {
  const { isRead } = useProgress()
  const { isBookmarked } = useBookmarks()
  const chapters = Array.from({ length: book.chapters }, (_, i) => i + 1)

  return (
    <ul className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12" aria-label={`Capítulos de ${book.name}`}>
      {chapters.map((c) => {
        const read = isRead(book.id, c)
        const marked = isBookmarked(book.id, c)
        return (
          <li key={c}>
            <Link
              to={readerPath(book.id, c)}
              aria-label={`${book.name} capítulo ${c}${read ? ', leído' : ''}${marked ? ', con marcador' : ''}`}
              className={`relative grid min-h-12 place-items-center rounded-lg border text-sm font-semibold transition-colors ${
                read
                  ? 'border-gold bg-gold/25 text-navy hover:bg-gold/40'
                  : 'border-line bg-white text-navy hover:border-gold hover:bg-gold/10'
              }`}
            >
              {c}
              {read && <Check aria-hidden className="absolute right-1 top-1 size-3 text-gold-700" />}
              {marked && <Bookmark aria-hidden className="absolute bottom-1 right-1 size-3 fill-navy text-navy" />}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
