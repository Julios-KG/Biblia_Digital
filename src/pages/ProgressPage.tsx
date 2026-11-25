import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Award, Flame } from 'lucide-react'
import { NEW_TESTAMENT, OLD_TESTAMENT, TOTAL_CHAPTERS, type Book } from '@/data/books'
import { useProgress } from '@/store/hooks'
import { PageHeader, ProgressBar } from '@/components/ui'

function BookRow({ book }: { book: Book }) {
  const { bookRead, bookPercent } = useProgress()
  const read = bookRead(book)
  const pct = bookPercent(book)
  return (
    <li>
      <Link to={`/libro/${book.id.toLowerCase()}`} className="block rounded-lg px-3 py-2 hover:bg-navy/5">
        <div className="mb-1 flex items-baseline justify-between gap-2 text-sm">
          <span className="font-semibold">{book.name}</span>
          <span className="text-xs text-muted">
            {read}/{book.chapters} · {pct}%
          </span>
        </div>
        <ProgressBar value={pct} label={`Progreso en ${book.name}`} />
      </Link>
    </li>
  )
}

export default function ProgressPage() {
  const { stats, resetAll } = useProgress()
  const [confirm, setConfirm] = useState(false)

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Mi espacio" title="Progreso de lectura" subtitle="Marca los capítulos como leídos desde el lector y mira cómo avanzas." />

      <section aria-label="Resumen" className="grid gap-4 sm:grid-cols-3">
        <div className="card p-5 sm:col-span-2">
          <p className="text-4xl font-bold text-navy">{stats.percent}%</p>
          <p className="mb-3 text-sm text-muted">
            {stats.total} de {TOTAL_CHAPTERS} capítulos
          </p>
          <ProgressBar value={stats.percent} label="Progreso total" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-1">
          <div className="card flex items-center gap-3 p-4">
            <Flame aria-hidden className="size-6 text-gold-700" />
            <div>
              <p className="text-2xl font-bold text-navy">{stats.streak}</p>
              <p className="text-xs text-muted">{stats.streak === 1 ? 'día seguido' : 'días seguidos'}</p>
            </div>
          </div>
          <div className="card flex items-center gap-3 p-4">
            <Award aria-hidden className="size-6 text-gold-700" />
            <div>
              <p className="text-2xl font-bold text-navy">{stats.completed.length}</p>
              <p className="text-xs text-muted">libros completos</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <section aria-labelledby="at-prog">
          <h2 id="at-prog" className="mb-2 text-xl font-bold">
            Antiguo Testamento
          </h2>
          <ul className="card divide-y divide-line p-2">
            {OLD_TESTAMENT.map((b) => (
              <BookRow key={b.id} book={b} />
            ))}
          </ul>
        </section>
        <section aria-labelledby="nt-prog">
          <h2 id="nt-prog" className="mb-2 text-xl font-bold">
            Nuevo Testamento
          </h2>
          <ul className="card divide-y divide-line p-2">
            {NEW_TESTAMENT.map((b) => (
              <BookRow key={b.id} book={b} />
            ))}
          </ul>
        </section>
      </div>

      <section className="card flex flex-wrap items-center justify-between gap-3 p-4">
        <p className="text-sm text-muted">Reiniciar borra solo tu progreso de lectura; no afecta tus apuntes ni favoritos.</p>
        {confirm ? (
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-red-700">¿Seguro?</span>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => {
                resetAll()
                setConfirm(false)
              }}
            >
              Sí, reiniciar
            </button>
            <button type="button" className="btn btn-outline" onClick={() => setConfirm(false)}>
              Cancelar
            </button>
          </div>
        ) : (
          <button type="button" className="btn btn-danger" onClick={() => setConfirm(true)} disabled={stats.total === 0}>
            Reiniciar progreso
          </button>
        )}
      </section>
    </div>
  )
}
