import { useEffect, useState, type FormEvent } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  BookMarked,
  BookOpen,
  Bot,
  Clock,
  Compass,
  Film,
  Globe2,
  Home,
  Landmark,
  Lightbulb,
  Menu,
  NotebookPen,
  Settings,
  Star,
  TrendingUp,
  X,
  type LucideIcon,
} from 'lucide-react'
import { parseReference, readerPath } from '@/lib/reference'

interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
}

const NAV_GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: 'Leer',
    items: [
      { to: '/', label: 'Inicio', icon: Home, end: true },
      { to: '/biblia', label: 'Biblia digital', icon: BookOpen },
      { to: '/antiguo-testamento', label: 'Antiguo Testamento', icon: Landmark },
      { to: '/nuevo-testamento', label: 'Nuevo Testamento', icon: BookMarked },
    ],
  },
  {
    title: 'Estudiar',
    items: [
      { to: '/contexto', label: 'Contexto histórico', icon: Compass },
      { to: '/explicaciones', label: 'Explicaciones', icon: Lightbulb },
      { to: '/cronologia', label: 'Cronología', icon: Clock },
      { to: '/enciclopedia', label: 'Personajes y lugares', icon: Globe2 },
      { to: '/videos', label: 'Videos', icon: Film },
    ],
  },
  {
    title: 'Mi espacio',
    items: [
      { to: '/apuntes', label: 'Cuaderno de apuntes', icon: NotebookPen },
      { to: '/favoritos', label: 'Favoritos y marcadores', icon: Star },
      { to: '/progreso', label: 'Progreso de lectura', icon: TrendingUp },
    ],
  },
  {
    title: 'Más',
    items: [
      { to: '/asistente', label: 'Asistente IA', icon: Bot },
      { to: '/ajustes', label: 'Ajustes', icon: Settings },
    ],
  },
]

const BOTTOM_NAV: NavItem[] = [
  { to: '/', label: 'Inicio', icon: Home, end: true },
  { to: '/biblia', label: 'Biblia', icon: BookOpen },
  { to: '/apuntes', label: 'Apuntes', icon: NotebookPen },
  { to: '/favoritos', label: 'Favoritos', icon: Star },
  { to: '/progreso', label: 'Progreso', icon: TrendingUp },
]

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Principal" className="space-y-5">
      {NAV_GROUPS.map((group) => (
        <div key={group.title}>
          <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-widest text-gold/80">{group.title}</p>
          <ul className="space-y-0.5">
            {group.items.map(({ to, label, icon: Icon, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors ${
                      isActive ? 'bg-gold text-navy' : 'text-white/85 hover:bg-white/10'
                    }`
                  }
                >
                  <Icon aria-hidden className="size-4 shrink-0" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}

function Brand() {
  return (
    <NavLink to="/" className="flex items-center gap-2 text-white">
      <span className="grid size-9 place-items-center rounded-lg bg-gold text-navy">
        <BookOpen aria-hidden className="size-5" />
      </span>
      <span className="font-serif text-lg font-bold leading-tight">Mi Biblia Digital</span>
    </NavLink>
  )
}

function GoToReference() {
  const navigate = useNavigate()
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const ref = parseReference(value)
    if (!ref) {
      setError(true)
      return
    }
    setError(false)
    setValue('')
    navigate(readerPath(ref.bookId, ref.chapter, ref.verse))
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-md" role="search" aria-label="Ir a una referencia">
      <label htmlFor="goto-ref" className="sr-only">
        Ir a una referencia bíblica
      </label>
      <input
        id="goto-ref"
        className={`input !min-h-10 ${error ? 'border-red-500' : ''}`}
        placeholder="Ir a… (Juan 3)"
        value={value}
        aria-invalid={error}
        aria-describedby={error ? 'goto-ref-error' : undefined}
        onChange={(e) => {
          setValue(e.target.value)
          setError(false)
        }}
      />
      {error && (
        <p id="goto-ref-error" role="alert" className="mt-1 text-xs text-red-700">
          No reconocí esa referencia. Prueba con “Juan 3” o “Gn 1:1”.
        </p>
      )}
    </form>
  )
}

export default function Layout() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setOpen(false)
    window.scrollTo?.(0, 0)
  }, [location.pathname])

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[17rem_1fr]">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[60] focus:rounded-lg focus:bg-gold focus:px-4 focus:py-2 focus:font-semibold focus:text-navy"
      >
        Saltar al contenido
      </a>

      {/* Barra lateral (escritorio) */}
      <aside className="hidden bg-navy p-4 lg:sticky lg:top-0 lg:block lg:h-dvh lg:overflow-y-auto">
        <div className="mb-6 px-1 pt-1">
          <Brand />
        </div>
        <NavList />
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 bg-navy px-4 py-2.5 pt-[max(0.625rem,env(safe-area-inset-top))] shadow">
          <button
            type="button"
            className="btn btn-ghost !px-2 text-white hover:!bg-white/10 lg:hidden"
            aria-label="Abrir menú"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <Menu className="size-6" />
          </button>
          <div className="lg:hidden">
            <Brand />
          </div>
          <div className="ml-auto flex flex-1 justify-end lg:justify-start">
            <GoToReference />
          </div>
        </header>

        <main id="contenido" tabIndex={-1} className="mx-auto w-full max-w-6xl flex-1 px-4 pb-28 pt-6 sm:px-6 lg:pb-12">
          <Outlet />
        </main>

        <footer className="hidden border-t border-line px-6 py-4 text-center text-xs text-muted lg:block">
          Mi Biblia Digital · Tus apuntes, favoritos y progreso se guardan solo en este navegador.
        </footer>
      </div>

      {/* Menú móvil */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menú">
          <div className="absolute inset-0 bg-navy/60" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-[min(20rem,86vw)] flex-col overflow-y-auto bg-navy p-4 pt-[max(1rem,env(safe-area-inset-top))]">
            <div className="mb-5 flex items-center justify-between">
              <Brand />
              <button
                type="button"
                className="btn btn-ghost !px-2 text-white hover:!bg-white/10"
                aria-label="Cerrar menú"
                onClick={() => setOpen(false)}
              >
                <X className="size-6" />
              </button>
            </div>
            <NavList onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      {/* Barra inferior (teléfonos y tablets pequeñas) */}
      <nav
        aria-label="Acceso rápido"
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-navy-2 bg-navy pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        {BOTTOM_NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium ${
                isActive ? 'text-gold' : 'text-white/75'
              }`
            }
          >
            <Icon aria-hidden className="size-5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
