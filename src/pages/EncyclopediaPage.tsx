import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { MapPin, SearchX, User } from 'lucide-react'
import { ENCYCLOPEDIA, PEOPLE, PLACES, type EncyclopediaEntry } from '@/data/encyclopedia'
import { getBook } from '@/data/books'
import { EmptyState, Modal, PageHeader, SearchBox, Tabs } from '@/components/ui'

type Kind = 'todos' | 'persona' | 'lugar'

function normalize(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

export default function EncyclopediaPage() {
  const [params] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') ?? '')
  const [kind, setKind] = useState<Kind>('todos')
  const [category, setCategory] = useState('Todas')
  const [open, setOpen] = useState<EncyclopediaEntry | null>(null)

  const base = kind === 'persona' ? PEOPLE : kind === 'lugar' ? PLACES : ENCYCLOPEDIA
  const categories = useMemo(() => ['Todas', ...new Set(base.map((e) => e.category))], [base])

  const list = useMemo(() => {
    const q = normalize(query.trim())
    return base
      .filter((e) => category === 'Todas' || e.category === category)
      .filter((e) => !q || normalize(`${e.name} ${e.summary} ${e.reference} ${e.category}`).includes(q))
      .sort((a, b) => a.name.localeCompare(b.name, 'es'))
  }, [base, category, query])

  return (
    <div>
      <PageHeader eyebrow="Estudiar" title="Personajes y lugares" subtitle="Enciclopedia de consulta rápida con referencias bíblicas." />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Tabs
          label="Tipo de entrada"
          value={kind}
          onChange={(k) => {
            setKind(k)
            setCategory('Todas')
          }}
          tabs={[
            { id: 'todos', label: 'Todo', count: ENCYCLOPEDIA.length },
            { id: 'persona', label: 'Personajes', count: PEOPLE.length },
            { id: 'lugar', label: 'Lugares', count: PLACES.length },
          ]}
        />
        <div className="min-w-60 flex-1 sm:max-w-sm">
          <SearchBox label="Buscar en la enciclopedia" placeholder="Buscar nombre o tema…" value={query} onChange={setQuery} />
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Categoría">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={category === c}
            onClick={() => setCategory(c)}
            className={`min-h-9 rounded-full border px-3 text-xs font-semibold ${
              category === c ? 'border-navy bg-navy text-white' : 'border-line bg-white text-navy hover:border-gold'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <EmptyState icon={<SearchX className="size-8" />} title="Sin resultados">
          No hay entradas con ese criterio. Prueba con otro nombre o limpia los filtros.
        </EmptyState>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((e) => (
            <li key={e.id}>
              <button type="button" onClick={() => setOpen(e)} className="card block h-full w-full p-4 text-left transition hover:-translate-y-0.5 hover:border-gold hover:shadow-md">
                <div className="flex items-center gap-2 text-xs font-semibold text-gold-700">
                  {e.kind === 'persona' ? <User aria-hidden className="size-4" /> : <MapPin aria-hidden className="size-4" />}
                  {e.category}
                </div>
                <h2 className="mt-1 text-base font-bold">{e.name}</h2>
                <p className="mt-1 line-clamp-3 text-sm text-muted">{e.summary}</p>
              </button>
            </li>
          ))}
        </ul>
      )}

      <Modal open={!!open} title={open?.name ?? ''} onClose={() => setOpen(null)}>
        {open && (
          <div className="space-y-4">
            <span className="badge">{open.category}</span>
            <p className="leading-relaxed">{open.summary}</p>
            {open.note && <p className="rounded-lg bg-gold/15 p-3 text-sm">Nota: {open.note}</p>}
            <p className="text-sm">
              <span className="font-semibold">Referencias: </span>
              {open.reference}
            </p>
            <div className="flex flex-wrap gap-2">
              {open.bookIds.map((id) => {
                const b = getBook(id)
                return b ? (
                  <Link key={id} to={`/libro/${id.toLowerCase()}`} className="btn btn-outline !min-h-9" onClick={() => setOpen(null)}>
                    {b.name}
                  </Link>
                ) : null
              })}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
