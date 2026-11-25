export interface Note {
  id: string
  title: string
  body: string
  bookId?: string
  chapter?: number
  verse?: number
  tags: string[]
  createdAt: number
  updatedAt: number
}

export interface FavoriteVerse {
  /** `${bookId}.${chapter}.${verse}` */
  id: string
  bookId: string
  chapter: number
  verse: number
  /** Copia local del texto, solo si estaba cargado al guardar. */
  text?: string
  createdAt: number
}

export interface Bookmark {
  /** `${bookId}.${chapter}` */
  id: string
  bookId: string
  chapter: number
  label?: string
  createdAt: number
}

export type FontSize = 'sm' | 'md' | 'lg' | 'xl'

export interface Settings {
  fontSize: FontSize
  serif: boolean
  /** Versión de texto bíblico seleccionada (si hay alguna disponible). */
  versionId: string | null
}

export interface LastRead {
  bookId: string
  chapter: number
  at: number
}

export interface CustomVideo {
  id: string
  title: string
  youtubeId: string
  note?: string
  createdAt: number
}
