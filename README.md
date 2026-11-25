# Mi Biblia Digital

Plataforma web gratuita, moderna y multiplataforma para leer, estudiar y comprender la Biblia.
Es un sitio **100 % estático**: no hay backend, no hay base de datos, no hay claves de API y no usa servicios de pago.

- **Stack:** React 19 · TypeScript · Vite · Tailwind CSS 4 · React Router · Lucide React · PWA (vite-plugin-pwa)
- **Datos públicos:** archivos TypeScript (`src/data/`)
- **Datos personales:** `localStorage` del navegador (apuntes, favoritos, marcadores, progreso, ajustes)

## Requisitos

- Node.js 20.19 o superior (se probó con Node 22)
- npm

## Inicio rápido

```bash
npm install
npm run dev        # servidor de desarrollo (http://localhost:5173)
npm test           # pruebas
npm run build      # compilación de producción en dist/
npm run preview    # sirve dist/ para probar la compilación
```

## Qué incluye

| Módulo | Ruta | Descripción |
| --- | --- | --- |
| Inicio | `/` | Resumen, continuar lectura, accesos |
| Biblia digital | `/biblia` | Los 66 libros, búsqueda y filtro por testamento |
| Antiguo / Nuevo Testamento | `/antiguo-testamento`, `/nuevo-testamento` | Libros por sección |
| Información del libro | `/libro/:id` | Autor, fecha, género, contexto, temas, capítulos |
| Lector | `/leer/:libro/:capítulo` | Navegación libro → capítulo → versículo, marcador, favoritos, apuntes |
| Contexto histórico | `/contexto` | Contexto de los 66 libros con búsqueda |
| Explicaciones | `/explicaciones` | Guías para leer y estudiar |
| Cronología | `/cronologia` | 9 épocas, de los orígenes a la iglesia primitiva |
| Personajes y lugares | `/enciclopedia` | Enciclopedia con fichas y enlaces a libros |
| Videos | `/videos` | Temas de búsqueda y biblioteca propia de enlaces de YouTube |
| Cuaderno de apuntes | `/apuntes` | Crear, editar, etiquetar, buscar y exportar a Markdown |
| Favoritos y marcadores | `/favoritos` | Versículos favoritos y capítulos marcados |
| Progreso de lectura | `/progreso` | Por libro, total, racha de días y libros completos |
| Asistente IA | `/asistente` | **Solo interfaz** (ver más abajo) |
| Ajustes | `/ajustes` | Tamaño de texto, carga de versiones, copia de seguridad |

Además, el buscador de la barra superior entiende referencias como `Juan 3`, `1 Co 13`, `Sal 23:1` o `Gn 1`.

## Texto bíblico: léelo antes de publicar

**Este proyecto no incluye ningún texto bíblico.** No se inventan versículos ni se distribuye contenido protegido.
Sin texto cargado, el lector lo indica claramente y sigue permitiendo marcador, progreso y apuntes.

La información de libros, cronología, personajes, lugares y explicaciones es contenido educativo propio y breve.
Las fechas y autorías son aproximadas y, cuando se discuten, se indica.

Hay dos formas de tener texto, ambas bajo tu responsabilidad:

1. **Publicarlo tú** (si es de dominio público o tienes autorización): coloca los archivos en `public/biblia/`
   siguiendo [`public/biblia/LEEME.md`](public/biblia/LEEME.md) y registra la versión en `public/biblia/index.json`.
2. **Que cada persona lo cargue** en **Ajustes → Textos bíblicos → Importar archivo JSON**.
   Se guarda solo en su navegador (IndexedDB) y exige indicar la licencia o el permiso.

Formato de un archivo importable:

```json
{
  "meta": { "id": "mi-version", "name": "Nombre", "license": "Dominio público / permiso de …" },
  "books": { "GEN": { "1": ["Versículo 1", "Versículo 2"] } }
}
```

Antes de cargar cualquier traducción, verifica su licencia: muchas traducciones modernas en español
(por ejemplo NVI, RVR1960 o DHH) tienen derechos reservados y requieren autorización de la editorial.

## Asistente de IA (no conectado)

La pantalla `/asistente` es solo la interfaz. **No hay ninguna IA conectada ni se llama a ninguna API.**
Para activar un asistente real hace falta un servicio propio (por ejemplo una función serverless) que guarde la clave de forma
segura: una app que corre solo en el navegador no puede proteger una clave. Ese servicio **no forma parte de este proyecto**
y su uso puede generar costos del proveedor.

Para conectarlo después, implementa `AIProvider` en `src/lib/aiAssistant.ts` y registra tu proveedor con `setAssistantProvider`.
Nunca pongas claves privadas en el código del frontend.

## Videos

La biblioteca incluye **temas de búsqueda** que abren YouTube, no videos concretos, para no depender de enlaces que cambian ni
distribuir contenido ajeno. Cada persona puede guardar sus propios enlaces, que se reproducen con el reproductor oficial
(`youtube-nocookie.com`) y se guardan solo en su navegador.

## Privacidad y copias de seguridad

Todo lo personal vive en el navegador de cada persona y no se envía a ningún servidor. Eso implica que:

- Cambiar de navegador o dispositivo no traslada los datos: usa **Ajustes → Copia de seguridad**.
- Borrar los datos del sitio en el navegador elimina apuntes, favoritos y progreso.

## Despliegue en Netlify

El proyecto ya incluye `netlify.toml` (comando `npm run build`, carpeta `dist`, Node 22 y la redirección para que
funcionen las rutas de React Router al recargar la página).

1. Sube el proyecto a un repositorio de GitHub.
2. En Netlify: **Add new site → Import an existing project** y elige el repositorio.
3. Netlify detectará la configuración de `netlify.toml`. Pulsa **Deploy**.

También puedes arrastrar la carpeta `dist/` (tras `npm run build`) a Netlify Drop.

## PWA

La app se puede instalar desde el navegador y funciona sin conexión para lo ya visitado (service worker generado con Workbox).
Los íconos están en `public/icons/`; puedes reemplazarlos por los tuyos manteniendo los nombres.

## Estructura

```
src/
  components/   Layout, UI reutilizable, editor de apuntes, listas de libros
  data/         Libros, información, cronología, enciclopedia, explicaciones, videos
  lib/          Almacenamiento local, progreso, referencias, texto bíblico, asistente
  pages/        Una página por módulo
  store/        Hooks de apuntes, favoritos, marcadores, progreso y ajustes
  test/         Pruebas de datos, lógica e integración de la interfaz
public/
  biblia/       Textos opcionales (vacío por defecto)
  icons/        Íconos de la PWA
```

## Ampliar el contenido

Edita los archivos de `src/data/`: los tipos están definidos arriba de cada archivo y las pruebas (`npm test`) verifican que los
identificadores de libros y épocas sean válidos.

## Licencia del código

Define aquí la licencia que prefieras para el código (por ejemplo MIT). Esto no cubre ningún texto bíblico.
