import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BookmarkX, StarOff, Trash2 } from 'lucide-react'
import { useBookmarks, useFavorites } from '@/store/hooks'
import { formatReference, readerPath } from '@/lib/reference'
import { EmptyState, PageHeader, Tabs } from '@/components/ui'

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useFavorites()
  const { bookmarks, removeBookmark, setLabel } = useBookmarks()
  const [tab, setTab] = useState<'versiculos' | 'marcadores'>('versiculos')

  return (
    <div>
      <PageHeader eyebrow="Mi espacio" title="Favoritos y marcadores" subtitle="Tus versículos favoritos y los capítulos que marcaste para volver." />
      <div className="mb-6">
        <Tabs
          label="Tipo"
          value={tab}
          onChange={setTab}
          tabs={[
            { id: 'versiculos', label: 'Versículos favoritos', count: favorites.length },
            { id: 'marcadores', label: 'Marcadores', count: bookmarks.length },
          ]}
        />
      </div>

      {tab === 'versiculos' &&
        (favorites.length === 0 ? (
          <EmptyState icon={<StarOff className="size-8" />} title="Aún no tienes versículos favoritos">
            En el lector, toca un versículo y elige “Favorito”. Para ver el texto guardado aquí, necesitas tener una versión cargada.
          </EmptyState>
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {favorites.map((f) => (
              <li key={f.id} className="card flex flex-col p-4">
                <Link to={readerPath(f.bookId, f.chapter, f.verse)} className="font-bold text-navy hover:underline">
                  {formatReference(f.bookId, f.chapter, f.verse)}
                </Link>
                {f.text ? <p className="mt-2 flex-1 font-serif text-ink/90">{f.text}</p> : <p className="mt-2 flex-1 text-sm text-muted">Abre el pasaje para leerlo.</p>}
                <button type="button" className="btn btn-ghost mt-3 self-end !min-h-9 text-red-700" onClick={() => removeFavorite(f.id)}>
                  <Trash2 aria-hidden className="size-4" /> Quitar
                </button>
              </li>
            ))}
          </ul>
        ))}

      {tab === 'marcadores' &&
        (bookmarks.length === 0 ? (
          <EmptyState icon={<BookmarkX className="size-8" />} title="Aún no tienes marcadores">
            En el lector, usa “Poner marcador” para guardar el capítulo en el que quieres volver.
          </EmptyState>
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {bookmarks.map((b) => (
              <li key={b.id} className="card p-4">
                <Link to={readerPath(b.bookId, b.chapter)} className="font-bold text-navy hover:underline">
                  {formatReference(b.bookId, b.chapter)}
                </Link>
                <div className="mt-2">
                  <label htmlFor={`label-${b.id}`} className="sr-only">
                    Etiqueta del marcador {formatReference(b.bookId, b.chapter)}
                  </label>
                  <input
                    id={`label-${b.id}`}
                    className="input"
                    placeholder="Añade una etiqueta (opcional)"
                    defaultValue={b.label ?? ''}
                    onBlur={(e) => setLabel(b.id, e.target.value)}
                  />
                </div>
                <button type="button" className="btn btn-ghost mt-3 !min-h-9 text-red-700" onClick={() => removeBookmark(b.id)}>
                  <Trash2 aria-hidden className="size-4" /> Quitar marcador
                </button>
              </li>
            ))}
          </ul>
        ))}
    </div>
  )
}
