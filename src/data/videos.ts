export interface VideoTopic {
  id: string
  title: string
  category: string
  description: string
  /** Consulta de búsqueda en YouTube. No se enlazan videos concretos para no depender de URLs que cambian. */
  query: string
}

/**
 * La biblioteca incluye temas de búsqueda, no videos específicos: así no se
 * promete contenido que no se ha verificado ni se distribuyen videos ajenos.
 * El usuario puede agregar sus propios enlaces de YouTube (se guardan en su navegador).
 */
export const VIDEO_TOPICS: VideoTopic[] = [
  { id: 'panorama', title: 'Panorama general de la Biblia', category: 'Introducción', description: 'Videos que resumen la estructura y el hilo narrativo de toda la Biblia.', query: 'panorama de la Biblia resumen en español' },
  { id: 'at', title: 'Introducción al Antiguo Testamento', category: 'Introducción', description: 'Visión general de la historia, los géneros y los temas del Antiguo Testamento.', query: 'introducción al Antiguo Testamento en español' },
  { id: 'nt', title: 'Introducción al Nuevo Testamento', category: 'Introducción', description: 'El mundo del Nuevo Testamento, los evangelios y las cartas.', query: 'introducción al Nuevo Testamento en español' },
  { id: 'genesis', title: 'Resumen del libro de Génesis', category: 'Libros', description: 'Resúmenes animados o explicativos del libro de Génesis.', query: 'resumen libro de Génesis en español' },
  { id: 'salmos', title: 'Cómo leer los Salmos', category: 'Libros', description: 'Explicaciones sobre poesía hebrea y estructura del libro de los Salmos.', query: 'cómo leer los Salmos poesía hebrea' },
  { id: 'evangelios', title: 'Introducción a los evangelios', category: 'Libros', description: 'Qué son los evangelios y cómo se relacionan entre sí.', query: 'introducción a los evangelios en español' },
  { id: 'romanos', title: 'Resumen de la carta a los Romanos', category: 'Libros', description: 'Explicaciones del argumento de Romanos.', query: 'resumen carta a los Romanos en español' },
  { id: 'apocalipsis', title: 'Introducción al Apocalipsis', category: 'Libros', description: 'Cómo leer el género apocalíptico y las visiones de Juan.', query: 'introducción al libro de Apocalipsis cómo leerlo' },
  { id: 'historia', title: 'Historia y arqueología bíblica', category: 'Contexto', description: 'Contexto histórico y hallazgos arqueológicos relacionados con la Biblia.', query: 'arqueología bíblica documental en español' },
  { id: 'geografia', title: 'Geografía de la Tierra Santa', category: 'Contexto', description: 'Mapas y recorridos por los lugares de la Biblia.', query: 'geografía de la Biblia mapas Tierra Santa' },
  { id: 'metodo', title: 'Cómo estudiar la Biblia', category: 'Estudio', description: 'Métodos prácticos de lectura y estudio personal.', query: 'cómo estudiar la Biblia método de estudio' },
]

export function youtubeSearchUrl(query: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
}

/** Extrae el ID de un enlace de YouTube (watch, youtu.be, embed o shorts). */
export function parseYouTubeId(input: string): string | null {
  const value = input.trim()
  if (!value) return null
  try {
    const url = new URL(value)
    const host = url.hostname.replace(/^www\./, '')
    let id: string | null = null
    if (host === 'youtu.be') id = url.pathname.slice(1).split('/')[0] || null
    else if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
      if (url.pathname === '/watch') id = url.searchParams.get('v')
      else {
        const m = url.pathname.match(/^\/(embed|shorts|live)\/([^/?#]+)/)
        if (m) id = m[2]
      }
    }
    return id && /^[\w-]{11}$/.test(id) ? id : null
  } catch {
    return null
  }
}
