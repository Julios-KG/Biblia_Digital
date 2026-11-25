import { useMemo, useState } from 'react'
import { BOOKS, NEW_TESTAMENT, OLD_TESTAMENT, type Book } from '@/data/books'
import { BookSections } from '@/components/BookList'
import { EmptyState, PageHeader, SearchBox, Tabs } from '@/components/ui'
import { BookX } from 'lucide-react'

type Scope = 'ALL' | 'AT' | 'NT'

const COPY: Record<Scope, { title: string; subtitle: string }> = {
  ALL: { title: 'Biblia digital', subtitle: 'Elige un libro para ver su información y leer capítulo por capítulo.' },
  AT: { title: 'Antiguo Testamento', subtitle: '39 libros: ley, historia, poesía, sabiduría y profetas.' },
  NT: { title: 'Nuevo Testamento', subtitle: '27 libros: evangelios, Hechos, cartas y Apocalipsis.' },
}

function normalize(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

export default function BooksPage({ scope }: { scope: Scope }) {
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<'AT' | 'NT' | 'ALL'>('ALL')

  const source: Book[] = useMemo(() => {
    if (scope === 'AT') return OLD_TESTAMENT
    if (scope === 'NT') return NEW_TESTAMENT
    if (tab === 'AT') return OLD_TESTAMENT
    if (tab === 'NT') return NEW_TESTAMENT
    return BOOKS
  }, [scope, tab])

  const filtered = useMemo(() => {
    const q = normalize(query.trim())
    if (!q) return source
    return source.filter((b) => normalize(b.name).includes(q) || normalize(b.abbr).includes(q) || normalize(b.section).includes(q))
  }, [source, query])

  return (
    <div>
      <PageHeader eyebrow="Leer" title={COPY[scope].title} subtitle={COPY[scope].subtitle} />
      <div className="mb-6 flex flex-wrap items-center gap-3">
        {scope === 'ALL' && (
          <Tabs
            label="Testamento"
            value={tab}
            onChange={setTab}
            tabs={[
              { id: 'ALL', label: 'Todos', count: BOOKS.length },
              { id: 'AT', label: 'Antiguo', count: OLD_TESTAMENT.length },
              { id: 'NT', label: 'Nuevo', count: NEW_TESTAMENT.length },
            ]}
          />
        )}
        <div className="min-w-60 flex-1 sm:max-w-sm">
          <SearchBox label="Buscar libro" placeholder="Buscar libro o sección…" value={query} onChange={setQuery} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<BookX className="size-8" />} title="No encontré ese libro">
          Revisa la ortografía o prueba con una parte del nombre, por ejemplo “sam” o “reyes”.
        </EmptyState>
      ) : (
        <BookSections books={filtered} />
      )}
    </div>
  )
}
