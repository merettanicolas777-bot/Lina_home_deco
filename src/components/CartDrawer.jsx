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
        <div className="fixed inset-0 z-50 sm:p-3">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
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
            className="absolute right-0 top-0 flex h-full w-full max-w-[440px] flex-col overflow-hidden overscroll-contain bg-chalk shadow-lift sm:right-3 sm:top-3 sm:h-[calc(100%-1.5rem)] sm:rounded-2xl"
          >
            <header className="flex items-center justify-between px-5 pb-3 pt-5">
              <div>
                <p className="eyebrow">Tu pedido</p>
                <h2 className="mt-0.5 text-2xl">Carrito</h2>
              </div>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Cerrar carrito"
                className="grid h-9 w-9 place-items-center rounded-full border border-line bg-shell text-ink transition hover:border-ink/25"
              >
                <X size={17} strokeWidth={1.8} />
              </button>
            </header>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-bone text-moss">
                  <ShoppingBag size={24} strokeWidth={1.5} />
                </span>
                <div>
                  <h3 className="text-xl">Tu carrito está vacío</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
                    Sumá una vela o un difusor y empezá a crear tu rincón favorito.
                  </p>
                </div>
                <Link to="/catalogo" onClick={closeCart} className="btn-primary">
                  Ver catálogo
                </Link>
              </div>
            ) : (
              <>
                <div className="min-h-0 flex-1 overflow-y-auto px-4 py-2">
                  <ul className="space-y-2.5">
                    <AnimatePresence initial={false}>
                      {items.map((item) => (
                        <motion.li
                          key={item.id}
                          layout
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: 24 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className="flex gap-3 rounded-lg border border-line/70 bg-shell p-2.5"
                        >
                          <div className="h-[88px] w-[72px] shrink-0 overflow-hidden rounded-md bg-bone">
                            <img
                              src={item.image_url || '/images/product-vela.svg'}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>

                          <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="text-[11px] font-medium text-muted">
                                  {item.category}
                                </p>
                                <h3 className="mt-0.5 truncate font-serif text-[15px] leading-snug">
                                  {item.name}
                                </h3>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeItem(item.id)}
                                aria-label={`Eliminar ${item.name}`}
                                className="mt-0.5 text-muted/70 transition hover:text-ink"
                              >
                                <Trash2 size={15} strokeWidth={1.7} />
                              </button>
                            </div>

                            <div className="flex items-end justify-between">
                              <div className="flex items-center rounded-full border border-line bg-chalk/60">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  aria-label="Restar unidad"
                                  className="grid h-7 w-7 place-items-center rounded-full text-ink disabled:opacity-30"
                                >
                                  <Minus size={12} strokeWidth={2.2} />
                                </button>
                                <span className="tabular w-5 text-center text-[12px] font-semibold">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  aria-label="Sumar unidad"
                                  className="grid h-7 w-7 place-items-center rounded-full text-ink"
                                >
                                  <Plus size={12} strokeWidth={2.2} />
                                </button>
                              </div>
                              <p className="tabular text-[13px] font-semibold">
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
                  className="border-t border-line bg-bone/40 px-5 pb-safe pt-4"
                >
                  <div className="flex items-baseline justify-between">
                    <span className="text-[12px] font-medium text-muted">Subtotal</span>
                    <span className="tabular font-serif text-2xl">{formatARS(subtotal)}</span>
                  </div>
                  <p className="mt-1 text-[12px] text-muted">
                    El envío se coordina por WhatsApp según tu zona.
                  </p>

                  <div className="mt-3.5">
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
                      className="field bg-shell"
                      autoComplete="name"
                    />
                  </div>

                  <fieldset className="mt-3.5">
                    <legend className="label">Método de entrega</legend>
                    <div className="grid grid-cols-2 gap-2">
                      {DELIVERY_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setDelivery(option.value)}
                          aria-pressed={delivery === option.value}
                          className={`rounded-md border px-3 py-2.5 text-[12px] font-medium transition ${
                            delivery === option.value
                              ? 'border-moss bg-shell text-ink'
                              : 'border-line bg-shell/50 text-muted hover:border-ink/25'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  {error && (
                    <p role="alert" className="mt-3 text-[12px] text-red-700">
                      {error}
                    </p>
                  )}

                  {opened && !error && (
                    <p className="mt-3 text-[12px] text-moss">
                      Abrimos WhatsApp con el detalle de tu pedido. ¡Gracias por elegirnos!
                    </p>
                  )}

                  <button type="submit" className="btn-primary mt-4 w-full py-3.5">
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
