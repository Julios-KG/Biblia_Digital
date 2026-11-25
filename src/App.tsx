import { Route, Routes } from 'react-router-dom'
import Layout from '@/components/Layout'
import HomePage from '@/pages/HomePage'
import BooksPage from '@/pages/BooksPage'
import BookPage from '@/pages/BookPage'
import ReaderPage from '@/pages/ReaderPage'
import ContextPage from '@/pages/ContextPage'
import { ExplanationDetailPage, ExplanationsPage } from '@/pages/ExplanationsPage'
import TimelinePage from '@/pages/TimelinePage'
import EncyclopediaPage from '@/pages/EncyclopediaPage'
import VideosPage from '@/pages/VideosPage'
import NotesPage from '@/pages/NotesPage'
import FavoritesPage from '@/pages/FavoritesPage'
import ProgressPage from '@/pages/ProgressPage'
import AssistantPage from '@/pages/AssistantPage'
import SettingsPage from '@/pages/SettingsPage'
import NotFoundPage from '@/pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="biblia" element={<BooksPage scope="ALL" />} />
        <Route path="antiguo-testamento" element={<BooksPage scope="AT" />} />
        <Route path="nuevo-testamento" element={<BooksPage scope="NT" />} />
        <Route path="libro/:bookId" element={<BookPage />} />
        <Route path="leer/:bookId/:chapter" element={<ReaderPage />} />
        <Route path="contexto" element={<ContextPage />} />
        <Route path="explicaciones" element={<ExplanationsPage />} />
        <Route path="explicaciones/:id" element={<ExplanationDetailPage />} />
        <Route path="cronologia" element={<TimelinePage />} />
        <Route path="enciclopedia" element={<EncyclopediaPage />} />
        <Route path="videos" element={<VideosPage />} />
        <Route path="apuntes" element={<NotesPage />} />
        <Route path="favoritos" element={<FavoritesPage />} />
        <Route path="progreso" element={<ProgressPage />} />
        <Route path="asistente" element={<AssistantPage />} />
        <Route path="ajustes" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
