import { useCallback, useEffect, useRef, useState } from 'react'
import { Database, Download, FileUp, Trash2, Upload } from 'lucide-react'
import { PageHeader } from '@/components/ui'
import { useSettings } from '@/store/hooks'
import {
  deleteImportedBible,
  describeFormat,
  listVersions,
  saveImportedBible,
  validateBible,
  type VersionInfo,
} from '@/lib/bibleText'
import { clearAllData, exportAllData, importAllData } from '@/lib/storage'
import { downloadText, readFileAsText } from '@/lib/download'
import type { FontSize } from '@/types'

type Status = { kind: 'ok' | 'error'; text: string } | null

function StatusLine({ status }: { status: Status }) {
  if (!status) return null
  return (
    <p role={status.kind === 'error' ? 'alert' : 'status'} className={`text-sm font-medium ${status.kind === 'error' ? 'text-red-700' : 'text-green-800'}`}>
      {status.text}
    </p>
  )
}

export default function SettingsPage() {
  const { settings, update } = useSettings()
  const [versions, setVersions] = useState<VersionInfo[]>([])
  const [textStatus, setTextStatus] = useState<Status>(null)
  const [backupStatus, setBackupStatus] = useState<Status>(null)
  const [confirmClear, setConfirmClear] = useState(false)
  const [license, setLicense] = useState('')
  const textInput = useRef<HTMLInputElement>(null)
  const backupInput = useRef<HTMLInputElement>(null)

  const refresh = useCallback(() => {
    listVersions().then(setVersions)
  }, [])
  useEffect(refresh, [refresh])

  async function onTextFile(file: File | undefined) {
    if (!file) return
    setTextStatus(null)
    try {
      const json: unknown = JSON.parse(await readFileAsText(file))
      const result = validateBible(json)
      if (!result.ok) {
        setTextStatus({ kind: 'error', text: result.error })
        return
      }
      const bible = result.bible
      if (license.trim()) bible.meta.license = license.trim()
      await saveImportedBible(bible)
      update({ versionId: bible.meta.id })
      setTextStatus({ kind: 'ok', text: `Se guardó “${bible.meta.name}” en este navegador.` })
      refresh()
    } catch (e) {
      setTextStatus({
        kind: 'error',
        text: e instanceof SyntaxError ? 'El archivo no es un JSON válido.' : e instanceof Error ? e.message : 'No se pudo importar el archivo.',
      })
    } finally {
      if (textInput.current) textInput.current.value = ''
    }
  }

  async function removeVersion(id: string) {
    await deleteImportedBible(id)
    if (settings.versionId === id) update({ versionId: null })
    refresh()
  }

  async function onBackupFile(file: File | undefined) {
    if (!file) return
    try {
      const result = importAllData(JSON.parse(await readFileAsText(file)))
      setBackupStatus(
        result.ok ? { kind: 'ok', text: `Copia restaurada (${result.keys} secciones).` } : { kind: 'error', text: result.error },
      )
    } catch {
      setBackupStatus({ kind: 'error', text: 'El archivo no es un JSON válido.' })
    } finally {
      if (backupInput.current) backupInput.current.value = ''
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader eyebrow="Más" title="Ajustes" subtitle="Lectura, textos bíblicos y copia de seguridad de tus datos." />

      <section aria-labelledby="lectura" className="card space-y-4 p-5">
        <h2 id="lectura" className="text-lg font-bold">
          Lectura
        </h2>
        <div>
          <label htmlFor="font-size" className="mb-1 block text-sm font-semibold text-navy">
            Tamaño del texto
          </label>
          <select id="font-size" className="input max-w-xs" value={settings.fontSize} onChange={(e) => update({ fontSize: e.target.value as FontSize })}>
            <option value="sm">Pequeño</option>
            <option value="md">Mediano</option>
            <option value="lg">Grande</option>
            <option value="xl">Muy grande</option>
          </select>
        </div>
        <label className="flex items-center gap-3 text-sm font-medium">
          <input type="checkbox" className="size-5 accent-navy" checked={settings.serif} onChange={(e) => update({ serif: e.target.checked })} />
          Usar tipografía con serifa en la lectura
        </label>
      </section>

      <section aria-labelledby="textos" className="card space-y-4 p-5">
        <h2 id="textos" className="flex items-center gap-2 text-lg font-bold">
          <Database aria-hidden className="size-5 text-gold-700" /> Textos bíblicos
        </h2>
        <p className="text-sm text-ink/90">
          Mi Biblia Digital no trae ninguna traducción incluida. Puedes cargar una versión que sea de dominio público o que tengas
          autorizada. Se guarda solo en este navegador y no se envía a ningún servidor.
        </p>

        {versions.length === 0 ? (
          <p className="rounded-lg bg-navy/5 p-3 text-sm text-muted">Todavía no hay versiones cargadas.</p>
        ) : (
          <ul className="divide-y divide-line rounded-lg border border-line">
            {versions.map((v) => (
              <li key={v.id} className="flex flex-wrap items-center justify-between gap-2 p-3">
                <div className="min-w-0">
                  <p className="font-semibold">{v.name}</p>
                  <p className="text-xs text-muted">
                    Licencia: {v.license} · {v.origin === 'imported' ? 'Importada en este navegador' : 'Incluida por quien publica la app'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className={`btn !min-h-9 ${settings.versionId === v.id ? 'btn-gold' : 'btn-outline'}`}
                    aria-pressed={settings.versionId === v.id}
                    onClick={() => update({ versionId: v.id })}
                  >
                    {settings.versionId === v.id ? 'En uso' : 'Usar'}
                  </button>
                  {v.origin === 'imported' && (
                    <button type="button" className="btn btn-danger !min-h-9 !px-3" aria-label={`Quitar ${v.name}`} onClick={() => removeVersion(v.id)}>
                      <Trash2 aria-hidden className="size-4" />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="space-y-3 rounded-lg border border-dashed border-navy/30 p-4">
          <div>
            <label htmlFor="license" className="mb-1 block text-sm font-semibold text-navy">
              Licencia o permiso (opcional si ya está en el archivo)
            </label>
            <input id="license" className="input" placeholder="Ej.: Dominio público / Permiso de la editorial" value={license} onChange={(e) => setLicense(e.target.value)} />
          </div>
          <input
            ref={textInput}
            id="text-file"
            type="file"
            accept="application/json,.json"
            className="sr-only"
            onChange={(e) => void onTextFile(e.target.files?.[0])}
          />
          <label htmlFor="text-file" className="btn btn-primary cursor-pointer">
            <FileUp aria-hidden className="size-4" /> Importar archivo JSON
          </label>
          <StatusLine status={textStatus} />
          <details className="text-sm">
            <summary className="cursor-pointer font-semibold text-gold-700">Formato esperado</summary>
            <pre className="mt-2 overflow-x-auto rounded-lg bg-navy p-3 text-xs text-white">{describeFormat()}</pre>
            <p className="mt-2 text-muted">
              Usa códigos de libro como GEN, EXO, PSA, MAT o REV. Cada capítulo es un arreglo de versículos. Quien publica la app también
              puede dejar archivos en <code>public/biblia/</code> (ver README).
            </p>
          </details>
        </div>
      </section>

      <section aria-labelledby="copia" className="card space-y-4 p-5">
        <h2 id="copia" className="text-lg font-bold">
          Copia de seguridad
        </h2>
        <p className="text-sm text-ink/90">
          Tus apuntes, favoritos, marcadores y progreso viven solo en este navegador. Descarga una copia para guardarla o llevarla a otro
          dispositivo.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => downloadText(`mi-biblia-digital-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(exportAllData(), null, 2), 'application/json')}
          >
            <Download aria-hidden className="size-4" /> Descargar copia
          </button>
          <input ref={backupInput} id="backup-file" type="file" accept="application/json,.json" className="sr-only" onChange={(e) => void onBackupFile(e.target.files?.[0])} />
          <label htmlFor="backup-file" className="btn btn-outline cursor-pointer">
            <Upload aria-hidden className="size-4" /> Restaurar copia
          </label>
        </div>
        <StatusLine status={backupStatus} />
        <p className="text-xs text-muted">Restaurar reemplaza las secciones incluidas en el archivo.</p>
      </section>

      <section aria-labelledby="borrar" className="card space-y-3 border-red-200 p-5">
        <h2 id="borrar" className="text-lg font-bold">
          Borrar mis datos
        </h2>
        <p className="text-sm text-ink/90">Elimina apuntes, favoritos, marcadores, progreso, videos y preferencias de este navegador. No se puede deshacer.</p>
        {confirmClear ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-red-700">¿Seguro que quieres borrar todo?</span>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => {
                clearAllData()
                setConfirmClear(false)
                setBackupStatus({ kind: 'ok', text: 'Se borraron tus datos locales.' })
              }}
            >
              Sí, borrar todo
            </button>
            <button type="button" className="btn btn-outline" onClick={() => setConfirmClear(false)}>
              Cancelar
            </button>
          </div>
        ) : (
          <button type="button" className="btn btn-danger" onClick={() => setConfirmClear(true)}>
            Borrar mis datos
          </button>
        )}
      </section>
    </div>
  )
}
