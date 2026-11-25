import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ERAS, TIMELINE } from '@/data/timeline'
import { getBook } from '@/data/books'
import { PageHeader } from '@/components/ui'

export default function TimelinePage() {
  const [era, setEra] = useState('all')

  const grouped = useMemo(
    () =>
      ERAS.filter((e) => era === 'all' || e.id === era)
        .map((e) => ({ era: e, events: TIMELINE.filter((t) => t.era === e.id) }))
        .filter((g) => g.events.length > 0),
    [era],
  )

  return (
    <div>
      <PageHeader
        eyebrow="Estudiar"
        title="Cronología bíblica"
        subtitle="Un recorrido por los grandes momentos de la historia bíblica. Las fechas son aproximadas y varias se discuten entre los estudiosos."
      />

      <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filtrar por época">
        {[{ id: 'all', name: 'Todas' }, ...ERAS].map((e) => (
          <button
            key={e.id}
            type="button"
            aria-pressed={era === e.id}
            onClick={() => setEra(e.id)}
            className={`min-h-10 rounded-full border px-4 text-sm font-semibold ${
              era === e.id ? 'border-navy bg-navy text-white' : 'border-line bg-white text-navy hover:border-gold'
            }`}
          >
            {e.name}
          </button>
        ))}
      </div>

      <div className="space-y-10">
        {grouped.map(({ era: e, events }) => (
          <section key={e.id} aria-labelledby={`era-${e.id}`}>
            <h2 id={`era-${e.id}`} className="mb-4 text-xl font-bold">
              {e.name}
            </h2>
            <ol className="relative space-y-4 border-l-2 border-gold/60 pl-5 sm:pl-8">
              {events.map((ev) => (
                <li key={ev.id} className="relative">
                  <span aria-hidden className="absolute -left-[1.72rem] top-5 size-3 rounded-full border-2 border-gold bg-paper sm:-left-[2.3rem]" />
                  <div className="card p-4 sm:p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gold-700">{ev.dateLabel}</p>
                    <h3 className="text-lg font-bold">{ev.title}</h3>
                    <p className="mt-1 text-sm text-ink/90">{ev.summary}</p>
                    <p className="mt-2 text-xs text-muted">Referencia: {ev.reference}</p>
                    {ev.bookIds.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {ev.bookIds.map((id) => {
                          const b = getBook(id)
                          return b ? (
                            <Link key={id} to={`/libro/${id.toLowerCase()}`} className="badge !bg-white border border-line hover:border-gold">
                              {b.name}
                            </Link>
                          ) : null
                        })}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  )
}
