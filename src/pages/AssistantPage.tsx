import { useState, type FormEvent } from 'react'
import { Bot, Info, Send, Sparkles } from 'lucide-react'
import { activeProvider, SUGGESTED_QUESTIONS, type AssistantResponse } from '@/lib/aiAssistant'
import { PageHeader } from '@/components/ui'
import { useProgress } from '@/store/hooks'
import { formatReference } from '@/lib/reference'

interface Message {
  role: 'user' | 'assistant'
  text: string
}

export default function AssistantPage() {
  const { lastRead } = useProgress()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [useContext, setUseContext] = useState(true)
  const configured = activeProvider.isConfigured()

  async function ask(question: string) {
    const q = question.trim()
    if (!q) return
    setMessages((m) => [...m, { role: 'user', text: q }])
    setInput('')
    const response: AssistantResponse = await activeProvider.ask({
      question: q,
      context: useContext && lastRead ? { bookId: lastRead.bookId, chapter: lastRead.chapter } : undefined,
    })
    const text = response.status === 'ok' ? response.answer : response.message
    setMessages((m) => [...m, { role: 'assistant', text }])
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    void ask(input)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader eyebrow="Más" title="Asistente bíblico con IA" subtitle="Interfaz preparada para una futura integración." />

      <div role="note" className="card flex gap-3 border-gold/60 bg-gold/10 p-4 text-sm">
        <Info aria-hidden className="mt-0.5 size-5 shrink-0 text-gold-700" />
        <div className="space-y-1">
          <p className="font-semibold text-navy">El asistente todavía no está conectado.</p>
          <p>
            No se envía ninguna información a servicios externos y esta app no incluye claves de API. Para activar un asistente real se
            necesita un servicio propio que guarde la clave de forma segura; consulta el README para ver cómo preparar la conexión.
          </p>
        </div>
      </div>

      <section aria-labelledby="conversacion" className="card flex min-h-80 flex-col">
        <h2 id="conversacion" className="sr-only">
          Conversación
        </h2>
        <div className="flex-1 space-y-3 p-4" aria-live="polite">
          {messages.length === 0 ? (
            <div className="grid h-full place-items-center py-8 text-center text-muted">
              <div>
                <Bot aria-hidden className="mx-auto mb-2 size-10 text-gold-700" />
                <p className="text-sm">Aquí aparecerá la conversación.</p>
              </div>
            </div>
          ) : (
            messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <p className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${m.role === 'user' ? 'bg-navy text-white' : 'bg-navy/8 text-ink'}`}>{m.text}</p>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-line p-3">
          <label className="mb-2 flex items-center gap-2 text-xs text-muted">
            <input type="checkbox" checked={useContext} onChange={(e) => setUseContext(e.target.checked)} className="size-4 accent-navy" />
            Usar mi último pasaje como contexto
            {lastRead && <span className="font-semibold text-navy">({formatReference(lastRead.bookId, lastRead.chapter)})</span>}
          </label>
          <form onSubmit={onSubmit} className="flex gap-2">
            <label htmlFor="assistant-input" className="sr-only">
              Escribe tu pregunta
            </label>
            <input
              id="assistant-input"
              className="input"
              placeholder="Escribe tu pregunta…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" disabled={!input.trim()}>
              <Send aria-hidden className="size-4" /> Enviar
            </button>
          </form>
          {!configured && <p className="mt-2 text-xs text-muted">Al enviar, verás un aviso de que el asistente no está configurado.</p>}
        </div>
      </section>

      <section aria-labelledby="sugeridas">
        <h2 id="sugeridas" className="mb-3 flex items-center gap-2 text-lg font-bold">
          <Sparkles aria-hidden className="size-5 text-gold-700" /> Preguntas sugeridas
        </h2>
        <ul className="flex flex-wrap gap-2">
          {SUGGESTED_QUESTIONS.map((q) => (
            <li key={q}>
              <button type="button" className="rounded-full border border-line bg-white px-3 py-2 text-left text-sm hover:border-gold" onClick={() => void ask(q)}>
                {q}
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
