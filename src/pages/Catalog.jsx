import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { fetchProducts } from '../lib/products'
import { CATEGORIES } from '../lib/demoData'
import ProductCard from '../components/ProductCard'
import { ProductGridSkeleton } from '../components/Skeleton'

const FILTERS = ['Todos', ...CATEGORIES]

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [term, setTerm] = useState(searchParams.get('q') ?? '')

  const activeCategory = searchParams.get('categoria') ?? 'Todos'
  const query = searchParams.get('q') ?? ''

  const loadProducts = () => {
    setLoading(true)
    setError('')
    fetchProducts()
      .then(setProducts)
      .catch((err) => setError(err.message || 'No pudimos cargar el catálogo.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    setTerm(query)
  }, [query])

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (!value || value === 'Todos') next.delete(key)
    else next.set(key, value)
    setSearchParams(next, { replace: true })
  }

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return products.filter((product) => {
      const matchesCategory =
        activeCategory === 'Todos' ||
        product.category?.toLowerCase() === activeCategory.toLowerCase()
      const matchesQuery =
        !normalized ||
        product.name?.toLowerCase().includes(normalized) ||
        product.description?.toLowerCase().includes(normalized)
      return matchesCategory && matchesQuery
    })
  }, [products, activeCategory, query])

  return (
    <div className="mx-auto max-w-7xl px-5 pb-10 pt-14 sm:px-8 sm:pt-20">
      <motion.header
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl"
      >
        <p className="eyebrow">Tienda</p>
        <h1 className="mt-4 font-serif text-[2.75rem] font-light leading-[1.08] sm:text-6xl">
          Catálogo
        </h1>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted">
          Aromas para cada rincón: desde una vela para la mesa de luz hasta el difusor del auto.
        </p>
      </motion.header>

      <div className="sticky top-[72px] z-30 -mx-5 mt-10 border-y border-ink/[0.07] bg-cream/95 px-5 py-4 backdrop-blur-md sm:-mx-8 sm:px-8 lg:top-[86px]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {FILTERS.map((category) => {
              const isActive = activeCategory === category
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => updateParam('categoria', category)}
                  className={`whitespace-nowrap rounded-full border px-4 py-2 text-[10px] font-medium uppercase tracking-[0.14em] transition ${
                    isActive
                      ? 'border-ink bg-ink text-cream'
                      : 'border-ink/12 bg-transparent text-muted hover:border-ink/30 hover:text-ink'
                  }`}
                >
                  {category}
                </button>
              )
            })}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault()
              updateParam('q', term.trim())
            }}
            className="relative w-full lg:w-[280px]"
          >
            <Search
              size={15}
              strokeWidth={1.8}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              placeholder="Buscar por nombre..."
              aria-label="Buscar productos por nombre"
              className="w-full rounded-full border border-ink/12 bg-white/70 py-2.5 pl-10 pr-10 text-xs text-ink placeholder:text-muted/70 focus:border-clay/60 focus:bg-white focus:outline-none"
            />
            {term && (
              <button
                type="button"
                aria-label="Limpiar búsqueda"
                onClick={() => {
                  setTerm('')
                  updateParam('q', '')
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
              >
                <X size={14} strokeWidth={1.8} />
              </button>
            )}
          </form>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between text-[11px] text-muted">
        <p className="flex items-center gap-2">
          <SlidersHorizontal size={13} strokeWidth={1.8} />
          {loading ? 'Cargando...' : `${filtered.length} producto${filtered.length === 1 ? '' : 's'}`}
        </p>
        {(query || activeCategory !== 'Todos') && (
          <button
            type="button"
            onClick={() => setSearchParams({}, { replace: true })}
            className="underline decoration-clay/40 underline-offset-4 transition hover:text-ink"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="mt-8">
        {loading ? (
          <ProductGridSkeleton count={6} />
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50/60 px-6 py-12 text-center">
            <p className="text-sm text-red-800">{error}</p>
            <button type="button" onClick={loadProducts} className="btn-ghost mt-5">
              Reintentar
            </button>
          </div>
        ) : filtered.length ? (
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-8 lg:grid-cols-3 lg:gap-y-14">
            {filtered.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-ink/15 px-6 py-20 text-center">
            <p className="font-serif text-2xl">Sin resultados</p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
              No encontramos productos con ese filtro. Probá con otra palabra o mirá todo el
              catálogo.
            </p>
            <button
              type="button"
              onClick={() => setSearchParams({}, { replace: true })}
              className="btn-ghost mt-6"
            >
              Ver todo
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
