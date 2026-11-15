import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertTriangle,
  Check,
  ExternalLink,
  LogOut,
  Package,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react'
import Logo from '../components/Logo'
import ProductForm from '../components/admin/ProductForm'
import { PageLoader, Skeleton } from '../components/Skeleton'
import { useAuth } from '../context/AuthContext'
import { isSupabaseConfigured } from '../lib/supabase'
import {
  createProduct,
  deleteProduct,
  fetchProducts,
  setProductStock,
  updateProduct,
} from '../lib/products'
import { formatARS } from '../utils/format'

export default function Admin() {
  const { user, signOut } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [term, setTerm] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState(null)

  const loadProducts = () => {
    setLoading(true)
    setError('')
    fetchProducts()
      .then(setProducts)
      .catch((err) => setError(err.message || 'No pudimos cargar los productos.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    if (!toast) return
    const timeout = window.setTimeout(() => setToast(null), 3000)
    return () => window.clearTimeout(timeout)
  }, [toast])

  const stats = useMemo(
    () => ({
      total: products.length,
      active: products.filter((product) => product.in_stock).length,
      paused: products.filter((product) => !product.in_stock).length,
    }),
    [products],
  )

  const filtered = useMemo(() => {
    const normalized = term.trim().toLowerCase()
    if (!normalized) return products
    return products.filter(
      (product) =>
        product.name?.toLowerCase().includes(normalized) ||
        product.category?.toLowerCase().includes(normalized),
    )
  }, [products, term])

  const handleSubmit = async (values, file) => {
    if (editing) {
      const updated = await updateProduct(editing.id, values, file)
      setProducts((current) =>
        current.map((product) => (product.id === editing.id ? { ...product, ...updated } : product)),
      )
      setToast({ type: 'success', message: 'Producto actualizado.' })
    } else {
      const created = await createProduct(values, file)
      setProducts((current) => [created, ...current])
      setToast({ type: 'success', message: 'Producto creado.' })
    }
  }

  const handleToggleStock = async (product) => {
    const nextValue = !product.in_stock
    setProducts((current) =>
      current.map((item) => (item.id === product.id ? { ...item, in_stock: nextValue } : item)),
    )
    try {
      await setProductStock(product.id, nextValue)
      setToast({
        type: 'success',
        message: nextValue ? 'Producto activado.' : 'Producto pausado.',
      })
    } catch (err) {
      setProducts((current) =>
        current.map((item) =>
          item.id === product.id ? { ...item, in_stock: product.in_stock } : item,
        ),
      )
      setToast({ type: 'error', message: err.message || 'No pudimos actualizar el producto.' })
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteProduct(deleteTarget.id)
      setProducts((current) => current.filter((product) => product.id !== deleteTarget.id))
      setToast({ type: 'success', message: 'Producto eliminado.' })
      setDeleteTarget(null)
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'No pudimos eliminar el producto.' })
    } finally {
      setDeleting(false)
    }
  }

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (product) => {
    setEditing(product)
    setFormOpen(true)
  }

  return (
    <div className="min-h-screen bg-sand/50">
      <header className="border-b border-ink/[0.07] bg-cream">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-4">
            <Link to="/" aria-label="Ir a la tienda">
              <Logo size="sm" />
            </Link>
            <span className="hidden h-8 w-px bg-ink/10 sm:block" />
            <span className="hidden text-[10px] uppercase tracking-[0.2em] text-muted sm:block">
              Panel
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-muted transition hover:text-ink"
            >
              Ver tienda
              <ExternalLink size={12} strokeWidth={1.8} />
            </Link>
            <span className="hidden max-w-[160px] truncate text-[11px] text-muted sm:block">
              {user?.email}
            </span>
            <button
              type="button"
              onClick={signOut}
              className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 px-3.5 py-2 text-[10px] uppercase tracking-[0.14em] text-ink transition hover:border-ink/30"
            >
              <LogOut size={12} strokeWidth={1.8} />
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-12">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Administración</p>
            <h1 className="mt-2 font-serif text-3xl font-light sm:text-4xl">Productos</h1>
            <p className="mt-2 text-sm text-muted">
              Gestioná el catálogo, el stock y las imágenes de la tienda.
            </p>
          </div>
          <button type="button" onClick={openCreate} className="btn-primary w-full sm:w-auto">
            <Plus size={15} strokeWidth={2} />
            Nuevo producto
          </button>
        </div>

        {!isSupabaseConfigured && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-clay/25 bg-clay/5 px-4 py-3.5">
            <AlertTriangle size={16} strokeWidth={1.6} className="mt-0.5 shrink-0 text-clay" />
            <p className="text-[11px] leading-relaxed text-muted">
              Estás viendo datos de demostración guardados en este navegador. Agregá{' '}
              <code className="text-clay-dark">VITE_SUPABASE_URL</code> y{' '}
              <code className="text-clay-dark">VITE_SUPABASE_ANON_KEY</code> en el archivo{' '}
              <code className="text-clay-dark">.env</code> para conectar la base real.
            </p>
          </div>
        )}

        <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
          {[
            { label: 'Productos', value: stats.total },
            { label: 'Activos', value: stats.active },
            { label: 'Sin stock', value: stats.paused },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-ink/[0.07] bg-white/80 px-4 py-4 sm:px-5"
            >
              <p className="font-serif text-3xl font-light leading-none sm:text-4xl">{stat.value}</p>
              <p className="mt-2 text-[9px] uppercase tracking-[0.18em] text-muted">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-[22px] border border-ink/[0.07] bg-white/60">
          <div className="flex flex-col gap-3 border-b border-ink/[0.07] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="relative w-full sm:max-w-xs">
              <Search
                size={15}
                strokeWidth={1.8}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                value={term}
                onChange={(event) => setTerm(event.target.value)}
                placeholder="Buscar producto..."
                aria-label="Buscar producto"
                className="w-full rounded-full border border-ink/10 bg-cream py-2.5 pl-9 pr-4 text-xs text-ink placeholder:text-muted/70 focus:border-clay/60 focus:outline-none"
              />
            </div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-muted">
              {filtered.length} de {products.length}
            </p>
          </div>

          <div className="hidden grid-cols-[minmax(0,1fr)_120px_110px_110px_150px] gap-4 border-b border-ink/[0.07] px-5 py-3 text-[9px] uppercase tracking-[0.16em] text-muted md:grid">
            <span>Producto</span>
            <span>Categoría</span>
            <span>Precio</span>
            <span>Estado</span>
            <span className="text-right">Acciones</span>
          </div>

          {loading ? (
            <div className="space-y-3 p-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-[74px] w-full rounded-xl" />
              ))}
            </div>
          ) : error ? (
            <div className="px-5 py-14 text-center">
              <p className="text-sm text-red-700">{error}</p>
              <button type="button" onClick={loadProducts} className="btn-ghost mt-4">
                Reintentar
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-5 py-16 text-center">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-sand text-clay">
                <Package size={20} strokeWidth={1.4} />
              </span>
              <p className="font-serif text-xl">
                {products.length ? 'Sin resultados' : 'Todavía no hay productos'}
              </p>
              <p className="max-w-xs text-xs leading-relaxed text-muted">
                {products.length
                  ? 'Probá con otro nombre o categoría.'
                  : 'Creá el primer producto para que aparezca en la tienda.'}
              </p>
              {!products.length && (
                <button type="button" onClick={openCreate} className="btn-primary mt-2">
                  <Plus size={14} strokeWidth={2} />
                  Nuevo producto
                </button>
              )}
            </div>
          ) : (
            <ul className="divide-y divide-ink/[0.06]">
              {filtered.map((product) => (
                <li
                  key={product.id}
                  className="grid gap-3 px-4 py-3.5 transition hover:bg-cream/60 sm:px-5 md:grid-cols-[minmax(0,1fr)_120px_110px_110px_150px] md:items-center md:gap-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="h-14 w-12 shrink-0 overflow-hidden rounded-lg bg-beige">
                      <img
                        src={product.image_url || '/images/product-vela.svg'}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">{product.name}</p>
                      <p className="mt-0.5 text-[10px] text-muted md:hidden">
                        {product.category} · {formatARS(product.price)}
                      </p>
                      <p className="mt-0.5 hidden text-[10px] text-muted md:block">
                        Stock {product.in_stock ? 'disponible' : 'agotado'}
                      </p>
                    </div>
                  </div>

                  <p className="hidden truncate text-xs text-muted md:block">{product.category}</p>
                  <p className="hidden text-xs font-medium md:block">{formatARS(product.price)}</p>

                  <div className="hidden md:block">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] uppercase tracking-[0.12em] ${
                        product.in_stock
                          ? 'bg-clay/10 text-clay-dark'
                          : 'bg-ink/8 text-muted'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          product.in_stock ? 'bg-clay' : 'bg-muted/60'
                        }`}
                      />
                      {product.in_stock ? 'Activo' : 'Pausado'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 md:justify-end">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={product.in_stock}
                      aria-label={`${product.in_stock ? 'Pausar' : 'Activar'} ${product.name}`}
                      onClick={() => handleToggleStock(product)}
                      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                        product.in_stock ? 'bg-clay' : 'bg-ink/15'
                      }`}
                    >
                      <span
                        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all ${
                          product.in_stock ? 'left-6' : 'left-1'
                        }`}
                      />
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(product)}
                        aria-label={`Editar ${product.name}`}
                        className="grid h-9 w-9 place-items-center rounded-full text-muted transition hover:bg-sand hover:text-ink"
                      >
                        <Pencil size={15} strokeWidth={1.6} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(product)}
                        aria-label={`Eliminar ${product.name}`}
                        className="grid h-9 w-9 place-items-center rounded-full text-muted transition hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 size={15} strokeWidth={1.6} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      <ProductForm
        open={formOpen}
        product={editing}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />

      <AnimatePresence>
        {deleteTarget && (
          <div className="fixed inset-0 z-50 grid place-items-center px-5">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !deleting && setDeleteTarget(null)}
              className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              className="relative w-full max-w-sm rounded-[22px] bg-cream p-6 shadow-2xl"
            >
              <div className="flex items-start justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-red-50 text-red-700">
                  <Trash2 size={18} strokeWidth={1.5} />
                </span>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  aria-label="Cerrar"
                  className="text-muted transition hover:text-ink"
                >
                  <X size={17} strokeWidth={1.6} />
                </button>
              </div>
              <h2 className="mt-5 font-serif text-2xl">¿Eliminar producto?</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Vas a borrar <span className="text-ink">{deleteTarget.name}</span>. Esta acción no se
                puede deshacer.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="btn-ghost flex-1"
                  disabled={deleting}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="btn flex-1 bg-red-700 text-white hover:bg-red-800"
                >
                  {deleting ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2.5 rounded-full bg-ink px-5 py-3 text-xs text-cream shadow-soft"
          >
            {toast.type === 'success' ? (
              <Check size={14} strokeWidth={2} className="text-clay-light" />
            ) : (
              <AlertTriangle size={14} strokeWidth={2} className="text-red-300" />
            )}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
