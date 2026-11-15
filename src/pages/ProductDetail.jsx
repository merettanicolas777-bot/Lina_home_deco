import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Check, Leaf, Minus, Package, Plus, Truck } from 'lucide-react'
import { fetchProduct } from '../lib/products'
import { useCart } from '../context/CartContext'
import { formatARS } from '../utils/format'
import { Skeleton } from '../components/Skeleton'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem, openCart } = useCart()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    setQuantity(1)

    fetchProduct(id)
      .then((data) => {
        if (!active) return
        if (!data) setError('No encontramos este producto.')
        setProduct(data)
      })
      .catch((err) => active && setError(err.message || 'No pudimos cargar el producto.'))
      .finally(() => active && setLoading(false))

    return () => {
      active = false
    }
  }, [id])

  const handleAdd = () => {
    if (!product?.in_stock) return
    addItem(product, quantity)
    setAdded(true)
    openCart()
    window.setTimeout(() => setAdded(false), 2200)
  }

  if (loading) {
    return (
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <Skeleton className="aspect-[4/5] w-full rounded-[24px]" />
        <div className="space-y-4 pt-4">
          <Skeleton className="h-3 w-20 rounded-full" />
          <Skeleton className="h-10 w-3/4 rounded-full" />
          <Skeleton className="h-5 w-28 rounded-full" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-12 w-52 rounded-full" />
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-5 text-center">
        <p className="eyebrow">Ups</p>
        <h1 className="mt-4 font-serif text-4xl">{error || 'Producto no encontrado'}</h1>
        <p className="mt-3 text-sm text-muted">
          Puede que ya no esté disponible o que el enlace haya cambiado.
        </p>
        <button type="button" onClick={() => navigate('/catalogo')} className="btn-primary mt-8">
          Volver al catálogo
        </button>
      </div>
    )
  }

  const paragraphs = (product.description || '').split('\n').filter(Boolean)

  return (
    <div className="mx-auto max-w-7xl px-5 pb-10 pt-8 sm:px-8 sm:pt-12">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="group inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted transition hover:text-ink"
      >
        <ArrowLeft size={14} strokeWidth={1.8} className="transition-transform group-hover:-translate-x-1" />
        Volver
      </button>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative"
        >
          <div className="overflow-hidden rounded-[24px] bg-beige">
            <img
              src={product.image_url || '/images/product-vela.svg'}
              alt={product.name}
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { icon: Leaf, label: 'Cera de soja' },
              { icon: Package, label: 'Hecho a mano' },
              { icon: Truck, label: 'Envíos' },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-2 rounded-2xl bg-sand px-2 py-4 text-center"
              >
                <Icon size={16} strokeWidth={1.4} className="text-clay" />
                <span className="text-[9px] uppercase tracking-[0.14em] text-muted">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:pt-4"
        >
          <Link
            to={`/catalogo?categoria=${encodeURIComponent(product.category)}`}
            className="text-[10px] uppercase tracking-[0.2em] text-clay transition hover:text-clay-dark"
          >
            {product.category}
          </Link>

          <h1 className="mt-4 font-serif text-4xl font-light leading-[1.1] sm:text-5xl">
            {product.name}
          </h1>

          <div className="mt-5 flex items-center gap-3">
            <p className="text-2xl font-medium">{formatARS(product.price)}</p>
            {product.in_stock ? (
              <span className="rounded-full px-2.5 py-1 text-[9px] uppercase tracking-[0.16em] text-clay-dark ring-1 ring-clay/30">
                Disponible
              </span>
            ) : (
              <span className="rounded-full bg-ink/85 px-2.5 py-1 text-[9px] uppercase tracking-[0.16em] text-cream">
                Sin stock
              </span>
            )}
          </div>

          <div className="mt-7 space-y-3.5 border-t border-ink/[0.08] pt-7">
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="text-sm leading-relaxed text-muted">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center justify-between rounded-full border border-ink/12 bg-white/60 px-2 py-1.5 sm:w-36">
              <button
                type="button"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                disabled={quantity <= 1}
                aria-label="Restar unidad"
                className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-sand disabled:opacity-30"
              >
                <Minus size={14} strokeWidth={2} />
              </button>
              <span className="w-8 text-center text-sm font-medium">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((value) => Math.min(99, value + 1))}
                aria-label="Sumar unidad"
                className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-sand"
              >
                <Plus size={14} strokeWidth={2} />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              disabled={!product.in_stock}
              className="btn-primary flex-1 py-4"
            >
              {added ? (
                <>
                  <Check size={16} strokeWidth={2} />
                  Agregado al carrito
                </>
              ) : product.in_stock ? (
                'Agregar al carrito'
              ) : (
                'Sin stock'
              )}
            </button>
          </div>

          <p className="mt-5 text-xs leading-relaxed text-muted/80">
            El pedido se confirma por WhatsApp. Retiro sin cargo en el local o envío a domicilio a
            coordinar según tu zona.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
