import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[65vh] max-w-lg flex-col items-center justify-center px-5 text-center">
      <p className="rounded-full bg-bone px-4 py-1.5 font-serif text-[13px] text-muted">
        Error 404
      </p>
      <h1 className="mt-4 text-4xl">Esta página no existe</h1>
      <p className="mt-3 text-[14px] leading-relaxed text-muted">
        El enlace puede haber cambiado. Volvé al inicio o mirá el catálogo completo.
      </p>
      <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
        <Link to="/" className="btn-primary">
          <ArrowLeft size={15} strokeWidth={2} />
          Volver al inicio
        </Link>
        <Link to="/catalogo" className="btn-ghost">
          Ver catálogo
        </Link>
      </div>
    </div>
  )
}
