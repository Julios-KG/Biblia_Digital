import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { EmptyState } from '@/components/ui'

export default function NotFoundPage({ message }: { message?: string }) {
  return (
    <div className="mx-auto max-w-lg py-10">
      <EmptyState icon={<Compass className="size-10" />} title="Página no encontrada">
        <p>{message ?? 'La dirección que buscas no existe.'}</p>
        <div className="mt-4 flex justify-center gap-2">
          <Link to="/" className="btn btn-primary">
            Ir al inicio
          </Link>
          <Link to="/biblia" className="btn btn-outline">
            Ver libros
          </Link>
        </div>
      </EmptyState>
    </div>
  )
}
