import { useState, type FormEvent } from 'react'
import { ExternalLink, Plus, Trash2, Video } from 'lucide-react'
import { VIDEO_TOPICS, parseYouTubeId, youtubeSearchUrl } from '@/data/videos'
import { useCustomVideos } from '@/store/hooks'
import { EmptyState, Field, PageHeader } from '@/components/ui'

export default function VideosPage() {
  const { videos, addVideo, removeVideo } = useCustomVideos()
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [category, setCategory] = useState('Todas')

  const categories = ['Todas', ...new Set(VIDEO_TOPICS.map((v) => v.category))]
  const topics = VIDEO_TOPICS.filter((v) => category === 'Todas' || v.category === category)

  function submit(e: FormEvent) {
    e.preventDefault()
    const id = parseYouTubeId(url)
    if (!id) {
      setError('Pega un enlace de YouTube válido (por ejemplo https://www.youtube.com/watch?v=…).')
      return
    }
    if (videos.some((v) => v.youtubeId === id)) {
      setError('Ese video ya está en tu biblioteca.')
      return
    }
    addVideo({ youtubeId: id, title: title.trim() || 'Video sin título', note: note.trim() || undefined })
    setUrl('')
    setTitle('')
    setNote('')
    setError('')
  }

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Estudiar"
        title="Biblioteca de videos"
        subtitle="Temas para encontrar videos de estudio, y un espacio para guardar tus propios enlaces."
      />

      <section aria-labelledby="mis-videos" className="space-y-4">
        <h2 id="mis-videos" className="text-xl font-bold">
          Mis videos
        </h2>
        <form onSubmit={submit} className="card grid gap-3 p-4 md:grid-cols-2">
          <Field label="Enlace de YouTube">
            {(id) => (
              <input
                id={id}
                className="input"
                inputMode="url"
                placeholder="https://www.youtube.com/watch?v=…"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value)
                  setError('')
                }}
              />
            )}
          </Field>
          <Field label="Título">{(id) => <input id={id} className="input" value={title} onChange={(e) => setTitle(e.target.value)} />}</Field>
          <div className="md:col-span-2">
            <Field label="Nota (opcional)">{(id) => <input id={id} className="input" value={note} onChange={(e) => setNote(e.target.value)} />}</Field>
          </div>
          {error && (
            <p role="alert" className="text-sm font-medium text-red-700 md:col-span-2">
              {error}
            </p>
          )}
          <div className="md:col-span-2">
            <button type="submit" className="btn btn-primary">
              <Plus aria-hidden className="size-4" /> Guardar video
            </button>
            <p className="mt-2 text-xs text-muted">Se guardan solo en este navegador y se reproducen con el reproductor oficial de YouTube.</p>
          </div>
        </form>

        {videos.length === 0 ? (
          <EmptyState icon={<Video className="size-8" />} title="Aún no has guardado videos">
            Cuando agregues un enlace aparecerá aquí con su reproductor.
          </EmptyState>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {videos.map((v) => (
              <li key={v.id} className="card overflow-hidden">
                <div className="aspect-video bg-navy">
                  <iframe
                    className="size-full"
                    src={`https://www.youtube-nocookie.com/embed/${v.youtubeId}`}
                    title={v.title}
                    loading="lazy"
                    allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
                <div className="flex items-start justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <h3 className="font-bold">{v.title}</h3>
                    {v.note && <p className="text-sm text-muted">{v.note}</p>}
                  </div>
                  <button type="button" className="btn btn-danger !px-3" aria-label={`Quitar ${v.title}`} onClick={() => removeVideo(v.id)}>
                    <Trash2 aria-hidden className="size-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="temas" className="space-y-4">
        <div>
          <h2 id="temas" className="text-xl font-bold">
            Temas para buscar
          </h2>
          <p className="text-sm text-muted">
            Estos botones abren una búsqueda en YouTube. No se incluyen videos específicos para no depender de enlaces que cambian ni
            distribuir contenido ajeno.
          </p>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Categoría de video">
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
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((t) => (
            <li key={t.id} className="card flex flex-col p-4">
              <span className="badge self-start">{t.category}</span>
              <h3 className="mt-2 font-bold">{t.title}</h3>
              <p className="mt-1 flex-1 text-sm text-muted">{t.description}</p>
              <a
                href={youtubeSearchUrl(t.query)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-gold-700 hover:underline"
              >
                Buscar en YouTube <ExternalLink aria-hidden className="size-4" />
                <span className="sr-only"> (se abre en una pestaña nueva)</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
