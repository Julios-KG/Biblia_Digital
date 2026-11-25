import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  Bot,
  Clock,
  Compass,
  Film,
  Flame,
  Globe2,
  Landmark,
  Lightbulb,
  NotebookPen,
  Star,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'
import { getBook, TOTAL_CHAPTERS } from '@/data/books'
import { formatReference, readerPath } from '@/lib/reference'
import { ProgressBar } from '@/components/ui'
import { useBookmarks, useFavorites, useNotes, useProgress } from '@/store/hooks'

const MODULES: { to: string; title: string; text: string; icon: LucideIcon }[] = [
  { to: '/biblia', title: 'Biblia digital', text: 'Los 66 libros, capítulos y versículos.', icon: BookOpen },
  { to: '/contexto', title: 'Contexto histórico', text: 'Autor, fecha y entorno de cada libro.', icon: Compass },
  { to: '/explicaciones', title: 'Explicaciones', text: 'Guías para leer y entender mejor.', icon: Lightbulb },
  { to: '/cronologia', title: 'Cronología', text: 'De los orígenes a la iglesia primitiva.', icon: Clock },
  { to: '/enciclopedia', title: 'Personajes y lugares', text: 'Enciclopedia bíblica de consulta.', icon: Globe2 },
  { to: '/videos', title: 'Videos', text: 'Biblioteca de videos y tus enlaces.', icon: Film },
  { to: '/apuntes', title: 'Apuntes', text: 'Tu cuaderno de estudio personal.', icon: NotebookPen },
  { to: '/asistente', title: 'Asistente IA', text: 'Interfaz lista para el futuro.', icon: Bot },
]

export default function HomePage() {
  const { lastRead, stats } = useProgress()
  const { notes } = useNotes()
  const { favorites } = useFavorites()
  const { bookmarks } = useBookmarks()
  const last = lastRead ? getBook(lastRead.bookId) : undefined

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-navy to-navy-2 p-6 text-white shadow-lg sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-gold">Bienvenido</p>
        <h1 className="mt-2 !text-white text-3xl font-bold sm:text-4xl">Mi Biblia Digital</h1>
        <p className="mt-3 max-w-xl text-white/85">
          Un espacio gratuito para leer, estudiar y comprender la Biblia. Tus apuntes, favoritos y progreso se guardan solo en
          tu dispositivo.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {last && lastRead ? (
            <Link to={readerPath(last.id, lastRead.chapter)} className="btn btn-gold">
              Continuar en {formatReference(last.id, lastRead.chapter)} <ArrowRight className="size-4" />
            </Link>
          ) : (
            <Link to={readerPath('GEN', 1)} className="btn btn-gold">
              Comenzar por Génesis 1 <ArrowRight className="size-4" />
            </Link>
          )}
          <Link to="/biblia" className="btn border border-white/30 text-white hover:bg-white/10">
            Explorar los libros
          </Link>
        </div>
      </section>

      <section aria-labelledby="resumen" className="grid gap-4 md:grid-cols-3">
        <h2 id="resumen" className="sr-only">
          Resumen de tu actividad
        </h2>
        <div className="card p-5 md:col-span-2">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gold-700">
            <TrendingUp aria-hidden className="size-4" /> Progreso de lectura
          </div>
          <p className="text-3xl font-bold text-navy">{stats.percent}%</p>
          <p className="mb-3 text-sm text-muted">
            {stats.total} de {TOTAL_CHAPTERS} capítulos leídos · {stats.completed.length} libros completados
          </p>
          <ProgressBar value={stats.percent} label="Progreso total de lectura" />
          <Link to="/progreso" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-gold-700 hover:underline">
            Ver detalle <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-1">
          <div className="card flex items-center gap-3 p-4">
            <Flame aria-hidden className="size-6 text-gold-700" />
            <div>
              <p className="text-2xl font-bold text-navy">{stats.streak}</p>
              <p className="text-xs text-muted">{stats.streak === 1 ? 'día seguido' : 'días seguidos'}</p>
            </div>
          </div>
          <Link to="/favoritos" className="card flex items-center gap-3 p-4 hover:border-gold">
            <Star aria-hidden className="size-6 text-gold-700" />
            <div>
              <p className="text-2xl font-bold text-navy">{favorites.length + bookmarks.length}</p>
              <p className="text-xs text-muted">favoritos y marcadores</p>
            </div>
          </Link>
        </div>
      </section>

      <section aria-labelledby="modulos">
        <h2 id="modulos" className="mb-3 text-xl font-bold">
          Explora
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {MODULES.map(({ to, title, text, icon: Icon }) => (
            <Link key={to} to={to} className="card group p-4 transition hover:-translate-y-0.5 hover:border-gold hover:shadow-md">
              <Icon aria-hidden className="mb-2 size-6 text-gold-700" />
              <h3 className="font-bold">{title}</h3>
              <p className="mt-1 text-sm text-muted">{text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="testamentos" className="grid gap-4 sm:grid-cols-2">
        <h2 id="testamentos" className="sr-only">
          Testamentos
        </h2>
        <Link to="/antiguo-testamento" className="card flex items-center gap-4 p-5 hover:border-gold">
          <Landmark aria-hidden className="size-8 text-gold-700" />
          <div>
            <h3 className="font-bold">Antiguo Testamento</h3>
            <p className="text-sm text-muted">39 libros · 929 capítulos</p>
          </div>
        </Link>
        <Link to="/nuevo-testamento" className="card flex items-center gap-4 p-5 hover:border-gold">
          <BookOpen aria-hidden className="size-8 text-gold-700" />
          <div>
            <h3 className="font-bold">Nuevo Testamento</h3>
            <p className="text-sm text-muted">27 libros · 260 capítulos</p>
          </div>
        </Link>
      </section>

      {notes.length > 0 && (
        <section aria-labelledby="recientes">
          <div className="mb-3 flex items-center justify-between">
            <h2 id="recientes" className="text-xl font-bold">
              Apuntes recientes
            </h2>
            <Link to="/apuntes" className="text-sm font-semibold text-gold-700 hover:underline">
              Ver todos
            </Link>
          </div>
          <ul className="grid gap-3 md:grid-cols-3">
            {notes.slice(0, 3).map((n) => (
              <li key={n.id} className="card p-4">
                <h3 className="font-bold">{n.title}</h3>
                {n.bookId && n.chapter && <p className="text-xs text-gold-700">{formatReference(n.bookId, n.chapter, n.verse)}</p>}
                <p className="mt-1 line-clamp-3 text-sm text-muted">{n.body}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
