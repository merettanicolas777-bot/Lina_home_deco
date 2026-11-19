import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
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

  const images = (product?.images?.length ? product.images : [product?.image_url]).filter(Boolean)

  const handleAdd = () => {
    if (!product?.in_stock) return
    addItem(product, quantity)
    setAdded(true)
    openCart()
    window.setTimeout(() => setAdded(false), 2200)
  }

  if (loading) {
    return (
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:gap-12">
        <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
        <div className="space-y-4 pt-2">
          <Skeleton className="h-3 w-24 rounded-full" />
          <Skeleton className="h-9 w-3/4 rounded-md" />
          <Skeleton className="h-6 w-32 rounded-full" />
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-12 w-56 rounded-full" />
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-5 text-center">
        <p className="eyebrow">Producto</p>
        <h1 className="mt-3 text-4xl">{error || 'Producto no encontrado'}</h1>
        <p className="mt-3 text-sm text-muted">
          Puede que ya no esté disponible o que el enlace haya cambiado.
        </p>
        <button type="button" onClick={() => navigate('/catalogo')} className="btn-primary mt-7">
          Volver al catálogo
        </button>
      </div>
    )
  }

  const gallery = images.length ? images : ['/images/product-vela.svg']
  const goTo = (index) => setActive(((index % gallery.length) + gallery.length) % gallery.length)

  const paragraphs = (product.description || '').split('\n').filter(Boolean)

  return (
    <div className="mx-auto max-w-6xl px-4 pb-6 pt-5 sm:px-6 sm:pt-9">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="group inline-flex items-center gap-2 rounded-full border border-line bg-shell/60 px-3.5 py-2 text-[12.5px] font-medium text-muted transition hover:text-ink"
      >
        <ArrowLeft size={14} strokeWidth={2} className="transition-transform group-hover:-translate-x-0.5" />
        Volver
      </button>

      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="min-w-0"
        >
          <div className="relative overflow-hidden rounded-2xl bg-bone">
            <div className="aspect-[4/5] w-full overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={active}
                  src={gallery[active]}
                  alt={product.name}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
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
                  className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-line/60 bg-chalk/90 text-ink shadow-soft backdrop-blur transition hover:bg-chalk"
                >
                  <ChevronLeft size={17} strokeWidth={1.8} />
                </button>
                <button
                  type="button"
                  onClick={() => goTo(active + 1)}
                  aria-label="Foto siguiente"
                  className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-line/60 bg-chalk/90 text-ink shadow-soft backdrop-blur transition hover:bg-chalk"
                >
                  <ChevronRight size={17} strokeWidth={1.8} />
                </button>
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-ink/25 px-2 py-1.5 backdrop-blur">
                  {gallery.map((image, index) => (
                    <button
                      key={image + index}
                      type="button"
                      onClick={() => goTo(index)}
                      aria-label={`Ir a la foto ${index + 1}`}
                      aria-current={index === active}
                      className={`h-1.5 rounded-full transition-all ${
                        index === active ? 'w-5 bg-chalk' : 'w-1.5 bg-chalk/60 hover:bg-chalk/80'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {gallery.length > 1 && (
            <div className="no-scrollbar mt-3 flex min-w-0 gap-2 overflow-x-auto pb-1">
              {gallery.map((image, index) => (
                <button
                  key={image + index}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`Ver foto ${index + 1}`}
                  aria-current={index === active}
                  className={`relative h-[68px] w-14 shrink-0 overflow-hidden rounded-md border-2 transition sm:h-20 sm:w-16 ${
                    index === active
                      ? 'border-moss opacity-100'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="min-w-0 lg:pt-1"
        >
          <Link
            to={`/catalogo?categoria=${encodeURIComponent(product.category)}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-bone px-3 py-1 text-[11.5px] font-medium text-moss transition hover:bg-bone/70"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-moss" />
            {product.category}
          </Link>

          <h1 className="mt-3.5 text-[1.95rem] leading-[1.1] sm:mt-4 sm:text-[2.7rem]">
            {product.name}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <p className="tabular text-[1.5rem] font-semibold leading-none sm:text-[1.6rem]">
              {formatARS(product.price)}
            </p>
            {product.in_stock ? (
              <span className="pill border-moss/20 bg-moss/8 text-moss">
                <span className="h-1.5 w-1.5 rounded-full bg-moss" />
                Disponible
              </span>
            ) : (
              <span className="pill border-transparent bg-ink text-chalk">Sin stock</span>
            )}
          </div>

          <div className="mt-5 space-y-3 rounded-xl bg-shell/70 p-4 text-[13px] leading-relaxed text-muted ring-1 ring-line/60 sm:mt-6 sm:p-5 sm:text-[13.5px]">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-2.5">
            <div className="flex w-[118px] shrink-0 items-center justify-between rounded-full border border-line bg-shell px-1 py-1 sm:w-[136px] sm:px-1.5 sm:py-1.5">
              <button
                type="button"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                disabled={quantity <= 1}
                aria-label="Restar unidad"
                className="grid h-9 w-9 place-items-center rounded-full text-ink transition hover:bg-bone disabled:opacity-30"
              >
                <Minus size={14} strokeWidth={2.2} />
              </button>
              <span className="tabular w-7 text-center text-[13px] font-semibold">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((value) => Math.min(99, value + 1))}
                aria-label="Sumar unidad"
                className="grid h-9 w-9 place-items-center rounded-full text-ink transition hover:bg-bone"
              >
                <Plus size={14} strokeWidth={2.2} />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              disabled={!product.in_stock}
              className="btn-primary flex-1 px-3 py-3.5 text-[12.5px] sm:px-6 sm:text-[13px]"
            >
              {added ? (
                <>
                  <Check size={16} strokeWidth={2.4} />
                  Agregado al carrito
                </>
              ) : product.in_stock ? (
                'Agregar al carrito'
              ) : (
                'Sin stock'
              )}
            </button>
          </div>

          <p className="mt-4 rounded-lg bg-bone/60 px-4 py-3 text-[12px] leading-relaxed text-muted">
            El pedido se confirma por WhatsApp. Retiro sin cargo en el local o envío a domicilio a
            coordinar según tu zona.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
