import { formatReference } from '@/lib/reference'
import type { Note } from '@/types'

export function notesToMarkdown(notes: Note[]): string {
  const lines: string[] = ['# Mi cuaderno de apuntes', '']
  for (const n of notes) {
    lines.push(`## ${n.title}`)
    const meta: string[] = []
    if (n.bookId && n.chapter) meta.push(formatReference(n.bookId, n.chapter, n.verse))
    if (n.tags.length) meta.push(n.tags.map((t) => `#${t.replace(/\s+/g, '-')}`).join(' '))
    meta.push(new Date(n.updatedAt).toLocaleDateString('es'))
    lines.push(`_${meta.join(' · ')}_`, '', n.body, '')
  }
  return lines.join('\n')
}
