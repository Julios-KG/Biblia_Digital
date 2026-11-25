import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronLeft, SearchX } from 'lucide-react'
import { EXPLANATIONS } from '@/data/explanations'
import { EmptyState, PageHeader, SearchBox } from '@/components/ui'
import NotFoundPage from '@/pages/NotFoundPage'

function normalize(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

export function ExplanationsPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Todas')
  const categories = useMemo(() => ['Todas', ...new Set(EXPLANATIONS.map((e) => e.category))], [])

  const list = useMemo(() => {
    const q = normalize(query.trim())
    return EXPLANATIONS.filter((e) => category === 'Todas' || e.category === category).filter(
      (e) => !q || normalize(`${e.title} ${e.summary} ${e.sections.map((s) => s.body).join(' ')}`).includes(q),
    )
  }, [query, category])

  return (
    <div>
      <PageHeader eyebrow="Estudiar" title="Explicaciones bíblicas" subtitle="Guías breves para leer la Biblia con más claridad." />
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Categoría">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
              className={`min-h-10 rounded-full border px-4 text-sm font-semibold ${
                category === c ? 'border-navy bg-navy text-white' : 'border-line bg-white text-navy hover:border-gold'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="min-w-60 flex-1 sm:max-w-sm">
          <SearchBox label="Buscar explicación" placeholder="Buscar…" value={query} onChange={setQuery} />
        </div>
      </div>

      {list.length === 0 ? (
        <EmptyState icon={<SearchX className="size-8" />} title="Sin resultados">
          Prueba con otra palabra o cambia la categoría.
        </EmptyState>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {list.map((e) => (
            <li key={e.id}>
              <Link to={`/explicaciones/${e.id}`} className="card block h-full p-5 transition hover:-translate-y-0.5 hover:border-gold hover:shadow-md">
                <span className="badge">{e.category}</span>
                <h2 className="mt-2 text-lg font-bold">{e.title}</h2>
                <p className="mt-1 text-sm text-muted">{e.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function ExplanationDetailPage() {
  const { id } = useParams()
  const index = EXPLANATIONS.findIndex((e) => e.id === id)
  if (index === -1) return <NotFoundPage message="No encontré esa explicación." />
  const item = EXPLANATIONS[index]
  const prev = EXPLANATIONS[index - 1]
  const next = EXPLANATIONS[index + 1]

  return (
    <article className="mx-auto max-w-3xl">
      <Link to="/explicaciones" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-gold-700 hover:underline">
        <ChevronLeft aria-hidden className="size-4" /> Todas las explicaciones
      </Link>
      <PageHeader eyebrow={item.category} title={item.title} subtitle={item.summary} />
      <div className="space-y-6">
        {item.sections.map((s) => (
          <section key={s.heading} className="card p-5">
            <h2 className="mb-2 text-lg font-bold">{s.heading}</h2>
            <p className="leading-relaxed text-ink/90">{s.body}</p>
          </section>
        ))}
      </div>
      <nav aria-label="Explicaciones" className="mt-8 flex justify-between gap-3 border-t border-line pt-4">
        {prev ? (
          <Link to={`/explicaciones/${prev.id}`} className="btn btn-outline">
            <ChevronLeft aria-hidden className="size-4" /> {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link to={`/explicaciones/${next.id}`} className="btn btn-outline">
            {next.title}
          </Link>
        )}
      </nav>
    </article>
  )
}
