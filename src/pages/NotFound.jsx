import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[65vh] max-w-lg flex-col items-center justify-center px-5 text-center">
      <p className="font-serif text-[5rem] font-light leading-none text-clay/40">404</p>
      <h1 className="mt-4 font-serif text-3xl font-light">Esta página no existe</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        El enlace puede haber cambiado. Volvé al inicio o mirá el catálogo completo.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link to="/" className="btn-primary">
          <ArrowLeft size={15} strokeWidth={1.8} />
          Inicio
        </Link>
        <Link to="/catalogo" className="btn-ghost">
          Ver catálogo
        </Link>
      </div>
    </div>
  )
}
