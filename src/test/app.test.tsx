import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import App from '@/App'
import { getStored, STORAGE_KEYS } from '@/lib/storage'
import { clearAllData } from '@/lib/storage'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

// Texto ficticio de prueba. NO es texto bíblico: solo valida la mecánica del lector.
const FAKE_CHAPTER = ['Versículo de prueba uno', 'Versículo de prueba dos', 'Versículo de prueba tres']

function mockFetch(withText: boolean) {
  const json = (body: unknown) =>
    Promise.resolve({ ok: true, headers: new Headers({ 'content-type': 'application/json' }), json: () => Promise.resolve(body) })
  const notFound = Promise.resolve({ ok: false, headers: new Headers(), json: () => Promise.resolve({}) })
  vi.stubGlobal(
    'fetch',
    vi.fn((url: string) => {
      if (!withText) return notFound
      if (url.endsWith('/biblia/index.json')) return json({ versions: [{ id: 'prueba', name: 'Texto de prueba', license: 'Solo pruebas' }] })
      if (url.includes('/biblia/prueba/RUT.json')) return json({ '1': FAKE_CHAPTER })
      return notFound
    }),
  )
}

beforeEach(() => {
  mockFetch(false)
  window.scrollTo = vi.fn() as unknown as typeof window.scrollTo
  Element.prototype.scrollIntoView = vi.fn()
})

afterEach(() => {
  vi.unstubAllGlobals()
  clearAllData()
})

describe('navegación y módulos', () => {
  it('muestra la página de inicio con los módulos', () => {
    renderAt('/')
    expect(screen.getByRole('heading', { level: 1, name: 'Mi Biblia Digital' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Comenzar por Génesis 1/ })).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /Cronología/ }).length).toBeGreaterThan(0)
  })

  it('lista los 66 libros y filtra por testamento', async () => {
    const user = userEvent.setup()
    renderAt('/biblia')
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(66)
    await user.click(screen.getByRole('tab', { name: /Nuevo/ }))
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(27)
    await user.type(screen.getByRole('searchbox', { name: 'Buscar libro' }), 'apoc')
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 3, name: 'Apocalipsis' })).toBeInTheDocument()
  })

  it('muestra el Antiguo y el Nuevo Testamento por separado', () => {
    const { unmount } = renderAt('/antiguo-testamento')
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(39)
    unmount()
    renderAt('/nuevo-testamento')
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(27)
  })

  it('muestra información, contexto y capítulos de un libro', () => {
    renderAt('/libro/rut')
    expect(screen.getByRole('heading', { level: 1, name: 'Rut' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Contexto histórico' })).toBeInTheDocument()
    expect(screen.getByRole('list', { name: 'Capítulos de Rut' }).querySelectorAll('li')).toHaveLength(4)
  })

  it('responde con 404 amable a libros y capítulos inexistentes', () => {
    const { unmount } = renderAt('/libro/zzz')
    expect(screen.getByText('No encontré ese libro.')).toBeInTheDocument()
    unmount()
    renderAt('/leer/rut/9')
    expect(screen.getByText(/Ese capítulo no existe/)).toBeInTheDocument()
  })

  it('el buscador de referencias lleva al lector', async () => {
    const user = userEvent.setup()
    renderAt('/')
    await user.type(screen.getByLabelText('Ir a una referencia bíblica'), 'Rut 2{Enter}')
    expect(await screen.findByRole('heading', { level: 1, name: 'Rut 2' })).toBeInTheDocument()
  })

  it('avisa cuando la referencia no se reconoce', async () => {
    const user = userEvent.setup()
    renderAt('/')
    await user.type(screen.getByLabelText('Ir a una referencia bíblica'), 'Inventado 99{Enter}')
    expect(await screen.findByRole('alert')).toHaveTextContent(/No reconocí/)
  })
})

describe('módulos de estudio', () => {
  it('contexto histórico: busca por tema', async () => {
    const user = userEvent.setup()
    renderAt('/contexto')
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(66)
    await user.type(screen.getByRole('searchbox'), 'exilio')
    expect(screen.getAllByRole('heading', { level: 2 }).length).toBeLessThan(66)
  })

  it('explicaciones: lista, abre el detalle y navega', async () => {
    const user = userEvent.setup()
    renderAt('/explicaciones')
    await user.click(screen.getByRole('link', { name: /Cómo está organizada la Biblia/ }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Cómo está organizada la Biblia' })).toBeInTheDocument()
    expect(screen.getByText('Dos testamentos')).toBeInTheDocument()
  })

  it('cronología: filtra por época', async () => {
    const user = userEvent.setup()
    renderAt('/cronologia')
    expect(screen.getByRole('heading', { name: 'Orígenes' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Vida de Jesús' }))
    expect(screen.queryByRole('heading', { name: 'Orígenes' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Ministerio de Jesús' })).toBeInTheDocument()
  })

  it('enciclopedia: filtra y abre una ficha con enlaces a libros', async () => {
    const user = userEvent.setup()
    renderAt('/enciclopedia')
    await user.click(screen.getByRole('tab', { name: /Lugares/ }))
    await user.click(screen.getByRole('heading', { level: 2, name: 'Jerusalén' }))
    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByText(/Capital de David/)).toBeInTheDocument()
    expect(within(dialog).getByRole('link', { name: 'Mateo' })).toBeInTheDocument()
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('videos: guarda un enlace propio, lo reproduce y lo elimina', async () => {
    const user = userEvent.setup()
    renderAt('/videos')
    await user.type(screen.getByLabelText('Enlace de YouTube'), 'esto no es un enlace')
    await user.click(screen.getByRole('button', { name: /Guardar video/ }))
    expect(screen.getByRole('alert')).toHaveTextContent(/enlace de YouTube válido/)

    await user.clear(screen.getByLabelText('Enlace de YouTube'))
    await user.type(screen.getByLabelText('Enlace de YouTube'), 'https://youtu.be/dQw4w9WgXcQ')
    await user.type(screen.getByLabelText('Título'), 'Mi video')
    await user.click(screen.getByRole('button', { name: /Guardar video/ }))
    const frame = await screen.findByTitle('Mi video')
    expect(frame).toHaveAttribute('src', 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ')
    expect(getStored(STORAGE_KEYS.customVideos, [])).toHaveLength(1)

    await user.click(screen.getByRole('button', { name: 'Quitar Mi video' }))
    expect(screen.queryByTitle('Mi video')).not.toBeInTheDocument()
  })

  it('los enlaces de búsqueda de videos abren en pestaña nueva de forma segura', () => {
    renderAt('/videos')
    const link = screen.getAllByRole('link', { name: /Buscar en YouTube/ })[0]
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
  })
})

describe('lector sin texto cargado', () => {
  it('explica que no hay texto y no inventa versículos', async () => {
    renderAt('/leer/rut/1')
    expect(await screen.findByText(/no está cargado/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Cargar texto en Ajustes/ })).toBeInTheDocument()
    expect(screen.queryByRole('list', { name: /Texto de/ })).not.toBeInTheDocument()
  })

  it('permite marcador y progreso sin texto, y se reflejan en otras pantallas', async () => {
    const user = userEvent.setup()
    renderAt('/leer/rut/1')
    await screen.findByText(/no está cargado/)

    await user.click(screen.getByRole('button', { name: /Poner marcador/ }))
    await user.click(screen.getByRole('button', { name: /Marcar como leído/ }))
    expect(screen.getByRole('button', { name: /Leído/ })).toHaveAttribute('aria-pressed', 'true')
    expect(getStored(STORAGE_KEYS.bookmarks, [])).toHaveLength(1)
    expect(getStored(STORAGE_KEYS.progress, {})).toHaveProperty('RUT.1')
    expect(getStored(STORAGE_KEYS.lastRead, null)).toMatchObject({ bookId: 'RUT', chapter: 1 })
  })

  it('los datos guardados aparecen en Favoritos, Progreso e Inicio', async () => {
    const user = userEvent.setup()
    const first = renderAt('/leer/rut/1')
    await screen.findByText(/no está cargado/)
    await user.click(screen.getByRole('button', { name: /Poner marcador/ }))
    await user.click(screen.getByRole('button', { name: /Marcar como leído/ }))
    first.unmount()

    const fav = renderAt('/favoritos')
    await user.click(screen.getByRole('tab', { name: /Marcadores/ }))
    expect(screen.getByRole('link', { name: 'Rut 1' })).toHaveAttribute('href', '/leer/rut/1')
    fav.unmount()

    const prog = renderAt('/progreso')
    expect(screen.getByRole('progressbar', { name: 'Progreso en Rut' })).toHaveAttribute('aria-valuenow', '25')
    prog.unmount()

    renderAt('/')
    expect(screen.getByRole('link', { name: /Continuar en Rut 1/ })).toBeInTheDocument()
  })

  it('"Marcar leído y seguir" avanza al siguiente capítulo', async () => {
    const user = userEvent.setup()
    renderAt('/leer/rut/1')
    await screen.findByText(/no está cargado/)
    await user.click(screen.getByRole('button', { name: /Marcar leído y seguir a Rut 2/ }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Rut 2' })).toBeInTheDocument()
    expect(getStored(STORAGE_KEYS.progress, {})).toHaveProperty('RUT.1')
  })

  it('el selector de capítulo cambia de página', async () => {
    const user = userEvent.setup()
    renderAt('/leer/rut/1')
    await user.selectOptions(screen.getByLabelText('Capítulo'), '3')
    expect(await screen.findByRole('heading', { level: 1, name: 'Rut 3' })).toBeInTheDocument()
  })
})

describe('lector con texto cargado', () => {
  beforeEach(() => mockFetch(true))

  it('muestra los versículos y permite favorito, apunte y copiar', async () => {
    const user = userEvent.setup()
    renderAt('/leer/rut/1')
    const verse2 = await screen.findByRole('button', { name: 'Versículo 2' })
    expect(verse2).toHaveTextContent('Versículo de prueba dos')

    await user.click(verse2)
    const toolbar = screen.getByRole('toolbar', { name: /Rut 1:2/ })
    await user.click(within(toolbar).getByRole('button', { name: /Favorito/ }))
    expect(getStored(STORAGE_KEYS.favorites, [])).toMatchObject([{ id: 'RUT.1.2', text: 'Versículo de prueba dos' }])
    expect(screen.getByRole('button', { name: 'Versículo 2, favorito' })).toBeInTheDocument()

    await user.click(within(toolbar).getByRole('button', { name: /Apunte/ }))
    const dialog = await screen.findByRole('dialog', { name: 'Nuevo apunte' })
    expect(within(dialog).getByLabelText('Libro')).toHaveValue('RUT')
    expect(within(dialog).getByLabelText('Versículo')).toHaveValue('2')
    await user.type(within(dialog).getByLabelText('Título'), 'Lealtad')
    await user.click(within(dialog).getByRole('button', { name: 'Guardar apunte' }))
    expect(getStored(STORAGE_KEYS.notes, [])).toMatchObject([{ title: 'Lealtad', bookId: 'RUT', chapter: 1, verse: 2 }])
    expect(await screen.findByText('Lealtad')).toBeInTheDocument()
  })

  it('el favorito guardado se ve en la página de Favoritos con su texto', async () => {
    const user = userEvent.setup()
    const first = renderAt('/leer/rut/1')
    await user.click(await screen.findByRole('button', { name: 'Versículo 3' }))
    await user.click(within(screen.getByRole('toolbar')).getByRole('button', { name: /Favorito/ }))
    first.unmount()

    renderAt('/favoritos')
    expect(screen.getByText('Versículo de prueba tres')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Rut 1:3' })).toHaveAttribute('href', '/leer/rut/1?v=3')
    await user.click(screen.getByRole('button', { name: /Quitar/ }))
    expect(screen.getByText(/Aún no tienes versículos favoritos/)).toBeInTheDocument()
  })

  it('"ir al versículo" valida el rango', async () => {
    const user = userEvent.setup()
    renderAt('/leer/rut/1')
    await screen.findByRole('button', { name: 'Versículo 1' })
    await user.type(screen.getByLabelText('Ir al versículo'), '3')
    await user.click(screen.getByRole('button', { name: 'Ir' }))
    expect(screen.getByRole('button', { name: 'Versículo 3' })).toHaveAttribute('aria-pressed', 'true')
  })
})

describe('cuaderno de apuntes', () => {
  it('crea, busca, edita, exporta y elimina apuntes', async () => {
    const user = userEvent.setup()
    renderAt('/apuntes')
    expect(screen.getByText('Tu cuaderno está vacío')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Exportar/ })).toBeDisabled()

    await user.click(screen.getByRole('button', { name: /Nuevo apunte/ }))
    let dialog = await screen.findByRole('dialog', { name: 'Nuevo apunte' })
    await user.click(within(dialog).getByRole('button', { name: 'Guardar apunte' }))
    expect(within(dialog).getByRole('alert')).toHaveTextContent(/Escribe un título/)

    await user.type(within(dialog).getByLabelText('Título'), 'Paciencia')
    await user.type(within(dialog).getByLabelText('Apunte'), 'Notas sobre la espera')
    await user.selectOptions(within(dialog).getByLabelText('Libro'), 'JAS')
    await user.type(within(dialog).getByLabelText('Capítulo'), '5')
    await user.type(within(dialog).getByLabelText('Etiquetas'), 'espera, fe')
    await user.click(within(dialog).getByRole('button', { name: 'Guardar apunte' }))

    expect(await screen.findByRole('heading', { name: 'Paciencia' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Santiago 5' })).toHaveAttribute('href', '/leer/jas/5')

    await user.type(screen.getByRole('searchbox'), 'inexistente')
    expect(screen.getByText('Sin resultados')).toBeInTheDocument()
    await user.clear(screen.getByRole('searchbox'))

    await user.click(screen.getByRole('button', { name: '#fe' }))
    expect(screen.getByRole('heading', { name: 'Paciencia' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Editar Paciencia' }))
    dialog = await screen.findByRole('dialog', { name: 'Editar apunte' })
    expect(within(dialog).getByLabelText('Título')).toHaveValue('Paciencia')
    await user.clear(within(dialog).getByLabelText('Título'))
    await user.type(within(dialog).getByLabelText('Título'), 'Paciencia activa')
    await user.click(within(dialog).getByRole('button', { name: 'Guardar apunte' }))
    expect(await screen.findByRole('heading', { name: 'Paciencia activa' })).toBeInTheDocument()
    expect(getStored(STORAGE_KEYS.notes, [])).toHaveLength(1)

    await user.click(screen.getByRole('button', { name: 'Eliminar Paciencia activa' }))
    await user.click(screen.getByRole('button', { name: 'Sí, eliminar' }))
    expect(screen.getByText('Tu cuaderno está vacío')).toBeInTheDocument()
  })

  it('valida el capítulo según el libro', async () => {
    const user = userEvent.setup()
    renderAt('/apuntes')
    await user.click(screen.getByRole('button', { name: /Nuevo apunte/ }))
    const dialog = await screen.findByRole('dialog')
    await user.type(within(dialog).getByLabelText('Título'), 'X')
    await user.selectOptions(within(dialog).getByLabelText('Libro'), 'RUT')
    await user.type(within(dialog).getByLabelText('Capítulo'), '9')
    await user.click(within(dialog).getByRole('button', { name: 'Guardar apunte' }))
    expect(within(dialog).getByRole('alert')).toHaveTextContent('entre 1 y 4')
  })
})

describe('progreso, ajustes y asistente', () => {
  it('reinicia el progreso con confirmación', async () => {
    const user = userEvent.setup()
    localStorage.setItem('mbd:progress', JSON.stringify({ 'GEN.1': Date.now(), 'GEN.2': Date.now() }))
    renderAt('/progreso')
    expect(screen.getByText('2 de 1189 capítulos')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Reiniciar progreso' }))
    await user.click(screen.getByRole('button', { name: 'Sí, reiniciar' }))
    expect(screen.getByText('0 de 1189 capítulos')).toBeInTheDocument()
  })

  it('ajustes: cambia el tamaño de texto y lo conserva', async () => {
    const user = userEvent.setup()
    renderAt('/ajustes')
    await user.selectOptions(screen.getByLabelText('Tamaño del texto'), 'xl')
    expect(getStored(STORAGE_KEYS.settings, null)).toMatchObject({ fontSize: 'xl' })
  })

  it('ajustes: rechaza un JSON sin licencia', async () => {
    const user = userEvent.setup()
    renderAt('/ajustes')
    const file = new File([JSON.stringify({ meta: { id: 'x', name: 'X' }, books: { RUT: { '1': ['a'] } } })], 'b.json', { type: 'application/json' })
    await user.upload(document.getElementById('text-file') as HTMLInputElement, file)
    expect(await screen.findByRole('alert')).toHaveTextContent(/meta\.license/)
  })

  it('ajustes: borra todos los datos tras confirmar', async () => {
    const user = userEvent.setup()
    localStorage.setItem('mbd:notes', JSON.stringify([{ id: '1', title: 'a', body: '', tags: [], createdAt: 1, updatedAt: 1 }]))
    renderAt('/ajustes')
    await user.click(screen.getByRole('button', { name: 'Borrar mis datos' }))
    await user.click(screen.getByRole('button', { name: 'Sí, borrar todo' }))
    expect(localStorage.getItem('mbd:notes')).toBeNull()
  })

  it('el asistente muestra que no está conectado y no hace llamadas de red', async () => {
    const user = userEvent.setup()
    renderAt('/asistente')
    const fetchSpy = vi.mocked(fetch)
    const before = fetchSpy.mock.calls.length
    expect(screen.getByText(/todavía no está conectado/)).toBeInTheDocument()
    await user.type(screen.getByLabelText('Escribe tu pregunta'), '¿Quién fue Rut?')
    await user.click(screen.getByRole('button', { name: /Enviar/ }))
    expect(await screen.findByText(/aún no está conectado/)).toBeInTheDocument()
    expect(fetchSpy.mock.calls.length).toBe(before)
  })
})
