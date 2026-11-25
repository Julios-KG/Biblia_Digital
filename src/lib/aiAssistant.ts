/**
 * Interfaz preparada para un futuro asistente bíblico con IA.
 *
 * IMPORTANTE:
 * - Hoy NO hay ningún asistente conectado ni se llama a ninguna API.
 * - Una app que se publica solo en el navegador no puede guardar claves privadas
 *   de forma segura. Para activar un asistente real hará falta un servicio propio
 *   (backend/proxy) que guarde la clave. Ese servicio no forma parte de este proyecto.
 *
 * Para conectar uno más adelante, implementa `AIProvider` y reemplaza `activeProvider`.
 */

export interface AssistantContext {
  bookId?: string
  chapter?: number
  verse?: number
  /** Texto del pasaje, solo si la persona lo tiene cargado localmente. */
  passageText?: string
}

export interface AssistantRequest {
  question: string
  context?: AssistantContext
}

export type AssistantResponse =
  | { status: 'ok'; answer: string }
  | { status: 'not-configured'; message: string }
  | { status: 'error'; message: string }

export interface AIProvider {
  id: string
  name: string
  isConfigured(): boolean
  ask(request: AssistantRequest): Promise<AssistantResponse>
}

export const notConfiguredProvider: AIProvider = {
  id: 'none',
  name: 'Sin asistente conectado',
  isConfigured: () => false,
  async ask() {
    return {
      status: 'not-configured',
      message:
        'El asistente de IA aún no está conectado. Esta pantalla es la interfaz preparada para cuando se configure un servicio propio.',
    }
  },
}

export let activeProvider: AIProvider = notConfiguredProvider

export function setAssistantProvider(provider: AIProvider): void {
  activeProvider = provider
}

export const SUGGESTED_QUESTIONS: string[] = [
  '¿Cuál es el contexto histórico de este pasaje?',
  '¿Qué tipo de texto (género literario) es este?',
  '¿Qué otros pasajes se relacionan con este tema?',
  'Ayúdame a hacer preguntas de reflexión sobre este capítulo.',
  'Explícame las palabras o costumbres difíciles de este texto.',
]
