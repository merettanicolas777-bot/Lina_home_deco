import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, X } from 'lucide-react'
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
    <div className="mx-auto max-w-6xl px-4 pb-6 pt-8 sm:px-6 sm:pt-14">
      <header className="max-w-2xl">
        <p className="eyebrow">Tienda</p>
        <h1 className="mt-2 text-[2.3rem] leading-[1.04] sm:text-[3.4rem]">Catálogo</h1>
        <p className="mt-3 max-w-lg text-[13.5px] leading-relaxed text-muted sm:text-[14px]">
          Aromas para cada rincón: desde una vela para la mesa de luz hasta el difusor del auto.
        </p>
      </header>

      <div className="sticky top-[68px] z-30 mt-6 rounded-xl border border-line/80 bg-chalk/95 px-2 py-2 shadow-soft backdrop-blur-lg sm:top-[80px] sm:mt-8 sm:px-2.5">
        <div className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 py-0.5 sm:gap-2">
          {FILTERS.map((category) => {
            const isActive = activeCategory === category
            return (
              <button
                key={category}
                type="button"
                onClick={() => updateParam('categoria', category)}
                aria-pressed={isActive}
                className={`whitespace-nowrap rounded-full border px-3.5 py-2 text-[11.5px] transition sm:py-1.5 sm:text-[12px] ${
                  isActive
                    ? 'border-moss bg-moss font-medium text-chalk'
                    : 'border-line bg-shell/70 font-medium text-muted hover:border-ink/25 hover:text-ink'
                }`}
              >
                {category}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <form
          onSubmit={(event) => {
            event.preventDefault()
            updateParam('q', term.trim())
          }}
          className="relative w-full sm:max-w-[280px]"
        >
          <Search
            size={15}
            strokeWidth={1.9}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            maxLength={60}
            type="search"
            enterKeyHint="search"
            placeholder="Buscar por nombre…"
            aria-label="Buscar productos por nombre"
            className="w-full rounded-full border border-line bg-shell py-2.5 pl-9 pr-9 text-[12.5px] text-ink placeholder:text-muted/70 focus:border-moss/50 focus:outline-none sm:py-2"
          />
          {term && (
            <button
              type="button"
              aria-label="Limpiar búsqueda"
              onClick={() => {
                setTerm('')
                updateParam('q', '')
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition hover:text-ink"
            >
              <X size={14} strokeWidth={2} />
            </button>
          )}
        </form>

        <div className="flex items-center justify-between gap-3 text-[11.5px] text-muted sm:text-[12px]">
          <p>
            {loading
              ? 'Cargando…'
              : `${filtered.length} producto${filtered.length === 1 ? '' : 's'}`}
          </p>
          {(query || activeCategory !== 'Todos') && (
            <button
              type="button"
              onClick={() => setSearchParams({}, { replace: true })}
              className="rounded-full px-2 py-1 font-medium text-moss transition hover:text-moss-dark"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 sm:mt-5">
        {loading ? (
          <ProductGridSkeleton count={6} />
        ) : error ? (
          <div className="rounded-xl border border-line bg-shell px-6 py-12 text-center">
            <p className="text-sm text-ink">{error}</p>
            <button type="button" onClick={loadProducts} className="btn-ghost mt-5">
              Reintentar
            </button>
          </div>
        ) : filtered.length ? (
          <div
            key={`${activeCategory}-${query}`}
            className="grid animate-fade-in grid-cols-2 gap-x-3 gap-y-4 sm:gap-x-5 sm:gap-y-6 lg:grid-cols-3"
          >
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-line px-6 py-16 text-center">
            <p className="font-serif text-2xl">Sin resultados</p>
            <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-muted">
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
