import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Download, NotebookPen, Pencil, Plus, SearchX, Trash2 } from 'lucide-react'
import { useNotes } from '@/store/hooks'
import NoteEditor from '@/components/NoteEditor'
import { EmptyState, PageHeader, SearchBox } from '@/components/ui'
import { formatReference, readerPath } from '@/lib/reference'
import { downloadText } from '@/lib/download'
import { notesToMarkdown } from '@/lib/notesExport'
import type { Note } from '@/types'

function normalize(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

export default function NotesPage() {
  const { notes, addNote, updateNote, deleteNote } = useNotes()
  const [query, setQuery] = useState('')
  const [tag, setTag] = useState<string | null>(null)
  const [editing, setEditing] = useState<Note | null>(null)
  const [creating, setCreating] = useState(false)
  const [confirmId, setConfirmId] = useState<string | null>(null)

  const tags = useMemo(() => [...new Set(notes.flatMap((n) => n.tags))].sort(), [notes])

  const list = useMemo(() => {
    const q = normalize(query.trim())
    return notes
      .filter((n) => !tag || n.tags.includes(tag))
      .filter(
        (n) =>
          !q ||
          normalize(`${n.title} ${n.body} ${n.tags.join(' ')} ${n.bookId && n.chapter ? formatReference(n.bookId, n.chapter, n.verse) : ''}`).includes(q),
      )
  }, [notes, query, tag])

  return (
    <div>
      <PageHeader
        eyebrow="Mi espacio"
        title="Cuaderno de apuntes"
        subtitle="Tus notas de estudio se guardan solo en este navegador. Haz una copia desde Ajustes si quieres llevarlas a otro dispositivo."
        actions={
          <>
            <button
              type="button"
              className="btn btn-outline"
              disabled={notes.length === 0}
              onClick={() => downloadText('mis-apuntes.md', notesToMarkdown(notes), 'text/markdown')}
            >
              <Download aria-hidden className="size-4" /> Exportar
            </button>
            <button type="button" className="btn btn-primary" onClick={() => setCreating(true)}>
              <Plus aria-hidden className="size-4" /> Nuevo apunte
            </button>
          </>
        }
      />

      {notes.length === 0 ? (
        <EmptyState icon={<NotebookPen className="size-8" />} title="Tu cuaderno está vacío">
          Crea tu primer apunte aquí, o desde el lector seleccionando un versículo o usando “Añadir apunte”.
        </EmptyState>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="min-w-60 flex-1 sm:max-w-sm">
              <SearchBox label="Buscar apuntes" placeholder="Buscar en tus apuntes…" value={query} onChange={setQuery} />
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por etiqueta">
                {tags.map((t) => (
                  <button
                    key={t}
                    type="button"
                    aria-pressed={tag === t}
                    onClick={() => setTag(tag === t ? null : t)}
                    className={`min-h-9 rounded-full border px-3 text-xs font-semibold ${
                      tag === t ? 'border-navy bg-navy text-white' : 'border-line bg-white text-navy hover:border-gold'
                    }`}
                  >
                    #{t}
                  </button>
                ))}
              </div>
            )}
          </div>

          {list.length === 0 ? (
            <EmptyState icon={<SearchX className="size-8" />} title="Sin resultados">
              Ningún apunte coincide con tu búsqueda.
            </EmptyState>
          ) : (
            <ul className="grid gap-4 md:grid-cols-2">
              {list.map((n) => (
                <li key={n.id} className="card flex flex-col p-5">
                  <h2 className="text-lg font-bold">{n.title}</h2>
                  {n.bookId && n.chapter && (
                    <Link to={readerPath(n.bookId, n.chapter, n.verse)} className="text-xs font-semibold text-gold-700 hover:underline">
                      {formatReference(n.bookId, n.chapter, n.verse)}
                    </Link>
                  )}
                  <p className="mt-2 flex-1 whitespace-pre-line text-sm text-ink/90">{n.body}</p>
                  {n.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {n.tags.map((t) => (
                        <span key={t} className="badge">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 flex items-center justify-between gap-2 border-t border-line pt-3">
                    <span className="text-xs text-muted">{new Date(n.updatedAt).toLocaleDateString('es')}</span>
                    {confirmId === n.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-red-700">¿Eliminar?</span>
                        <button type="button" className="btn btn-danger !min-h-9" onClick={() => deleteNote(n.id)}>
                          Sí, eliminar
                        </button>
                        <button type="button" className="btn btn-outline !min-h-9" onClick={() => setConfirmId(null)}>
                          No
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-1">
                        <button type="button" className="btn btn-ghost !min-h-9" onClick={() => setEditing(n)} aria-label={`Editar ${n.title}`}>
                          <Pencil aria-hidden className="size-4" /> Editar
                        </button>
                        <button type="button" className="btn btn-ghost !min-h-9 text-red-700" onClick={() => setConfirmId(n.id)} aria-label={`Eliminar ${n.title}`}>
                          <Trash2 aria-hidden className="size-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <NoteEditor open={creating} onClose={() => setCreating(false)} onSave={(input) => addNote(input)} initial={{ tags: [] }} />
      <NoteEditor open={!!editing} onClose={() => setEditing(null)} initial={editing ?? undefined} onSave={(input) => editing && updateNote(editing.id, input)} />
    </div>
  )
}
