import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircle, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { formatARS } from '../utils/format'
import { DELIVERY_OPTIONS, buildWhatsAppLink, getWhatsAppNumber } from '../utils/whatsapp'

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, subtotal } = useCart()
  const [customerName, setCustomerName] = useState('')
  const [delivery, setDelivery] = useState('retiro')
  const [error, setError] = useState('')
  const [opened, setOpened] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeCart()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, closeCart])

  useEffect(() => {
    setOpened(false)
    setError('')
  }, [isOpen])

  const savedName = useMemo(() => {
    try {
      return localStorage.getItem('lina:customer-name') ?? ''
    } catch {
      return ''
    }
  }, [])

  useEffect(() => {
    if (savedName && !customerName) setCustomerName(savedName)
  }, [savedName, customerName])

  const handleCheckout = (event) => {
    event.preventDefault()

    if (!items.length) return
    if (!customerName.trim()) {
      setError('Contanos tu nombre para preparar el pedido.')
      return
    }
    if (!getWhatsAppNumber()) {
      setError('Falta configurar el número de WhatsApp (VITE_WHATSAPP_NUMBER).')
      return
    }

    const link = buildWhatsAppLink({
      items,
      subtotal,
      customerName: customerName.trim(),
      delivery,
    })

    try {
      localStorage.setItem('lina:customer-name', customerName.trim())
    } catch {
      /* almacenamiento no disponible */
    }

    setError('')
    setOpened(true)
    window.open(link, '_blank', 'noopener,noreferrer')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            className="absolute inset-0 bg-ink/35 backdrop-blur-[2px]"
            aria-hidden="true"
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Carrito de compras"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34, mass: 0.9 }}
            className="absolute right-0 top-0 flex h-full w-full max-w-[440px] flex-col bg-cream shadow-2xl"
          >
            <header className="flex items-center justify-between border-b border-ink/[0.07] px-6 py-5">
              <div>
                <p className="eyebrow">Tu pedido</p>
                <h2 className="mt-1 font-serif text-2xl">Carrito</h2>
              </div>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Cerrar carrito"
                className="grid h-9 w-9 place-items-center rounded-full border border-ink/10 text-ink transition hover:border-ink/30"
              >
                <X size={17} strokeWidth={1.6} />
              </button>
            </header>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-sand text-clay">
                  <ShoppingBag size={24} strokeWidth={1.4} />
                </span>
                <div>
                  <h3 className="font-serif text-xl">Tu carrito está vacío</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    Sumá una vela o un difusor y empezá a crear tu rincón favorito.
                  </p>
                </div>
                <Link to="/catalogo" onClick={closeCart} className="btn-primary">
                  Ver catálogo
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-5">
                  <ul className="space-y-5">
                    <AnimatePresence initial={false}>
                      {items.map((item) => (
                        <motion.li
                          key={item.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: 28 }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                          className="flex gap-4"
                        >
                          <div className="h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-beige">
                            <img
                              src={item.image_url || '/images/product-vela.svg'}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>

                          <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="text-[9px] uppercase tracking-[0.18em] text-clay">
                                  {item.category}
                                </p>
                                <h3 className="mt-1 truncate font-serif text-base leading-snug">
                                  {item.name}
                                </h3>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeItem(item.id)}
                                aria-label={`Eliminar ${item.name}`}
                                className="mt-1 text-muted/70 transition hover:text-ink"
                              >
                                <Trash2 size={15} strokeWidth={1.6} />
                              </button>
                            </div>

                            <div className="flex items-end justify-between">
                              <div className="flex items-center rounded-full border border-ink/10 bg-white/70">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  aria-label="Restar unidad"
                                  className="grid h-8 w-8 place-items-center text-ink disabled:opacity-30"
                                >
                                  <Minus size={13} strokeWidth={2} />
                                </button>
                                <span className="w-6 text-center text-xs font-medium">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  aria-label="Sumar unidad"
                                  className="grid h-8 w-8 place-items-center text-ink"
                                >
                                  <Plus size={13} strokeWidth={2} />
                                </button>
                              </div>
                              <p className="text-sm font-medium">
                                {formatARS(item.price * item.quantity)}
                              </p>
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                </div>

                <form
                  onSubmit={handleCheckout}
                  className="border-t border-ink/[0.07] bg-sand/60 px-6 pb-6 pt-5"
                >
                  <div className="flex items-baseline justify-between">
                    <span className="text-[10px] uppercase tracking-[0.18em] text-muted">
                      Subtotal
                    </span>
                    <span className="font-serif text-2xl">{formatARS(subtotal)}</span>
                  </div>
                  <p className="mt-1 text-[11px] text-muted/80">
                    El envío se coordina por WhatsApp según tu zona.
                  </p>

                  <div className="mt-4">
                    <label className="label" htmlFor="customer-name">
                      Tu nombre
                    </label>
                    <input
                      id="customer-name"
                      value={customerName}
                      onChange={(event) => {
                        setCustomerName(event.target.value)
                        setError('')
                      }}
                      placeholder="Nombre y apellido"
                      className="field"
                      autoComplete="name"
                    />
                  </div>

                  <fieldset className="mt-4">
                    <legend className="label">Método de entrega</legend>
                    <div className="grid grid-cols-2 gap-2">
                      {DELIVERY_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setDelivery(option.value)}
                          aria-pressed={delivery === option.value}
                          className={`rounded-xl border px-3 py-2.5 text-[11px] font-medium transition ${
                            delivery === option.value
                              ? 'border-clay bg-white text-ink shadow-sm'
                              : 'border-ink/10 bg-white/50 text-muted hover:border-ink/25'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  {error && (
                    <p role="alert" className="mt-3 text-xs text-red-700">
                      {error}
                    </p>
                  )}

                  {opened && !error && (
                    <p className="mt-3 text-xs text-clay-dark">
                      Abrimos WhatsApp con el detalle de tu pedido. ¡Gracias por elegirnos!
                    </p>
                  )}

                  <button type="submit" className="btn-clay mt-5 w-full py-4">
                    <MessageCircle size={16} strokeWidth={2} />
                    Finalizar pedido por WhatsApp
                  </button>
                </form>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}
