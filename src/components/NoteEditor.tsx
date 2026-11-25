import { useState, type FormEvent } from 'react'
import { BOOKS, getBook } from '@/data/books'
import { Field, Modal } from '@/components/ui'
import type { NoteInput } from '@/store/hooks'
import type { Note } from '@/types'

export function parseTags(text: string): string[] {
  const seen = new Set<string>()
  for (const raw of text.split(',')) {
    const tag = raw.trim().toLowerCase()
    if (tag) seen.add(tag)
  }
  return [...seen]
}

interface Props {
  open: boolean
  onClose: () => void
  onSave: (input: NoteInput) => void
  /** Nota existente (edición) o valores iniciales (nota nueva). */
  initial?: Partial<Note>
}

export default function NoteEditor({ open, onClose, onSave, initial }: Props) {
  return (
    <Modal open={open} title={initial?.id ? 'Editar apunte' : 'Nuevo apunte'} onClose={onClose}>
      {/* La clave reinicia el formulario cada vez que se abre con otro contenido. */}
      <NoteForm key={initial?.id ?? `${initial?.bookId}-${initial?.chapter}-${initial?.verse}`} initial={initial} onClose={onClose} onSave={onSave} />
    </Modal>
  )
}

function NoteForm({ initial, onClose, onSave }: Omit<Props, 'open'>) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [body, setBody] = useState(initial?.body ?? '')
  const [bookId, setBookId] = useState(initial?.bookId ?? '')
  const [chapter, setChapter] = useState(initial?.chapter ? String(initial.chapter) : '')
  const [verse, setVerse] = useState(initial?.verse ? String(initial.verse) : '')
  const [tags, setTags] = useState((initial?.tags ?? []).join(', '))
  const [error, setError] = useState('')

  const book = getBook(bookId)

  function submit(e: FormEvent) {
    e.preventDefault()
    if (!title.trim() && !body.trim()) {
      setError('Escribe un título o el contenido del apunte.')
      return
    }
    let ch: number | undefined
    let v: number | undefined
    if (book) {
      if (chapter) {
        ch = Number(chapter)
        if (!Number.isInteger(ch) || ch < 1 || ch > book.chapters) {
          setError(`El capítulo debe estar entre 1 y ${book.chapters}.`)
          return
        }
      }
      if (verse) {
        v = Number(verse)
        if (!ch || !Number.isInteger(v) || v < 1) {
          setError('Para indicar un versículo, elige también un capítulo válido.')
          return
        }
      }
    }
    onSave({
      title: title.trim() || 'Sin título',
      body: body.trim(),
      bookId: book?.id,
      chapter: ch,
      verse: v,
      tags: parseTags(tags),
    })
    onClose()
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="Título">{(id) => <input id={id} className="input" value={title} onChange={(e) => setTitle(e.target.value)} />}</Field>
      <Field label="Apunte">
        {(id) => <textarea id={id} className="input min-h-36" value={body} onChange={(e) => setBody(e.target.value)} />}
      </Field>

      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold text-navy">Pasaje relacionado (opcional)</legend>
        <div className="grid grid-cols-[1fr_5.5rem_5.5rem] gap-2">
          <div>
            <label htmlFor="note-book" className="sr-only">
              Libro
            </label>
            <select
              id="note-book"
              className="input"
              value={bookId}
              onChange={(e) => {
                setBookId(e.target.value)
                setChapter('')
                setVerse('')
              }}
            >
              <option value="">Sin pasaje</option>
              {BOOKS.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="note-chapter" className="sr-only">
              Capítulo
            </label>
            <input
              id="note-chapter"
              className="input"
              inputMode="numeric"
              placeholder="Cap."
              disabled={!book}
              value={chapter}
              onChange={(e) => setChapter(e.target.value.replace(/\D/g, ''))}
            />
          </div>
          <div>
            <label htmlFor="note-verse" className="sr-only">
              Versículo
            </label>
            <input
              id="note-verse"
              className="input"
              inputMode="numeric"
              placeholder="Vers."
              disabled={!book}
              value={verse}
              onChange={(e) => setVerse(e.target.value.replace(/\D/g, ''))}
            />
          </div>
        </div>
      </fieldset>

      <Field label="Etiquetas" hint="Sepáralas con comas, por ejemplo: oración, gracia">
        {(id) => <input id={id} className="input" value={tags} onChange={(e) => setTags(e.target.value)} />}
      </Field>

      {error && (
        <p role="alert" className="text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" className="btn btn-outline" onClick={onClose}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary">
          Guardar apunte
        </button>
      </div>
    </form>
  )
}
