import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Gift,
  Minus,
  Package,
  Plus,
  Truck,
} from 'lucide-react'
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
  const [active, setActive] = useState(0)

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
        setActive(0)
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

  const images = (product.images?.length ? product.images : [product.image_url]).filter(Boolean)
  const gallery = images.length ? images : ['/images/product-vela.svg']
  const goTo = (index) =>
    setActive(((index % gallery.length) + gallery.length) % gallery.length)

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
          className="relative min-w-0"
        >
          <div className="relative overflow-hidden rounded-[24px] bg-beige">
            <div className="aspect-[4/5] w-full overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={active}
                  src={gallery[active]}
                  alt={`${product.name} — foto ${active + 1} de ${gallery.length}`}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  drag={gallery.length > 1 ? 'x' : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.12}
                  onDragEnd={(_event, info) => {
                    if (info.offset.x < -60) goTo(active + 1)
                    else if (info.offset.x > 60) goTo(active - 1)
                  }}
                  className={`h-full w-full object-cover ${
                    gallery.length > 1 ? 'cursor-grab active:cursor-grabbing' : ''
                  }`}
                />
              </AnimatePresence>
            </div>

            {gallery.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => goTo(active - 1)}
                  aria-label="Foto anterior"
                  className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-cream/85 text-ink shadow-soft backdrop-blur transition hover:bg-cream"
                >
                  <ChevronLeft size={17} strokeWidth={1.6} />
                </button>
                <button
                  type="button"
                  onClick={() => goTo(active + 1)}
                  aria-label="Foto siguiente"
                  className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-cream/85 text-ink shadow-soft backdrop-blur transition hover:bg-cream"
                >
                  <ChevronRight size={17} strokeWidth={1.6} />
                </button>
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
                  {gallery.map((image, index) => (
                    <button
                      key={image + index}
                      type="button"
                      onClick={() => goTo(index)}
                      aria-label={`Ir a la foto ${index + 1}`}
                      aria-current={index === active}
                      className={`h-1.5 rounded-full transition-all ${
                        index === active ? 'w-6 bg-cream' : 'w-1.5 bg-cream/60 hover:bg-cream/80'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {gallery.length > 1 && (
            <div className="no-scrollbar mt-3 flex min-w-0 gap-2.5 overflow-x-auto pb-1">
              {gallery.map((image, index) => (
                <button
                  key={image + index}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`Ver foto ${index + 1}`}
                  aria-current={index === active}
                  className={`relative h-20 w-16 shrink-0 overflow-hidden rounded-lg border transition ${
                    index === active
                      ? 'border-clay opacity-100'
                      : 'border-transparent opacity-65 hover:opacity-100'
                  }`}
                >
                  <img src={image} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { icon: Gift, label: 'Para regalar' },
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
          className="min-w-0 lg:pt-4"
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
