import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { SearchX } from 'lucide-react'
import { BOOKS } from '@/data/books'
import { BOOK_INFO } from '@/data/bookInfo'
import { EmptyState, PageHeader, SearchBox, Tabs } from '@/components/ui'

function normalize(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

export default function ContextPage() {
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<'ALL' | 'AT' | 'NT'>('ALL')

  const list = useMemo(() => {
    const q = normalize(query.trim())
    return BOOKS.filter((b) => tab === 'ALL' || b.testament === tab).filter((b) => {
      if (!q) return true
      const info = BOOK_INFO[b.id]
      return [b.name, info?.author, info?.genre, info?.summary, info?.context, ...(info?.themes ?? [])]
        .filter(Boolean)
        .some((t) => normalize(t as string).includes(q))
    })
  }, [query, tab])

  return (
    <div>
      <PageHeader
        eyebrow="Estudiar"
        title="Contexto histórico"
        subtitle="Autor, fecha, género y entorno de cada libro. Las fechas son aproximadas y algunas se discuten."
      />
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Tabs
          label="Testamento"
          value={tab}
          onChange={setTab}
          tabs={[
            { id: 'ALL', label: 'Todos' },
            { id: 'AT', label: 'Antiguo' },
            { id: 'NT', label: 'Nuevo' },
          ]}
        />
        <div className="min-w-60 flex-1 sm:max-w-sm">
          <SearchBox label="Buscar en el contexto" placeholder="Buscar por tema, autor o género…" value={query} onChange={setQuery} />
        </div>
      </div>

      {list.length === 0 ? (
        <EmptyState icon={<SearchX className="size-8" />} title="Sin resultados">
          Prueba con otra palabra, por ejemplo “profeta”, “carta” o “exilio”.
        </EmptyState>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {list.map((b) => {
            const info = BOOK_INFO[b.id]
            return (
              <li key={b.id} className="card flex flex-col p-5">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-lg font-bold">{b.name}</h2>
                  <span className="badge shrink-0">{b.testament === 'AT' ? 'AT' : 'NT'}</span>
                </div>
                <p className="text-xs font-semibold text-gold-700">
                  {info.genre} · {info.written}
                </p>
                <p className="mt-2 text-sm text-ink/90">{info.context}</p>
                <p className="mt-2 text-xs text-muted">Autor: {info.author}</p>
                <Link to={`/libro/${b.id.toLowerCase()}`} className="mt-3 text-sm font-semibold text-gold-700 hover:underline">
                  Ver libro completo
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
