import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ImagePlus, Plus, Upload, X } from 'lucide-react'
import { CATEGORIES } from '../../lib/demoData'
import { Spinner } from '../Skeleton'

const EMPTY = {
  name: '',
  description: '',
  price: '',
  category: CATEGORIES[0],
  in_stock: true,
}

export default function ProductForm({ open, product, onClose, onSubmit }) {
  const [values, setValues] = useState(EMPTY)
  const [entries, setEntries] = useState([])
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const fileRef = useRef(null)
  const objectUrls = useRef([])

  useEffect(() => {
    if (!open) return

    setValues(
      product
        ? {
            name: product.name ?? '',
            description: product.description ?? '',
            price: String(product.price ?? ''),
            category: product.category ?? CATEGORIES[0],
            in_stock: product.in_stock ?? true,
          }
        : EMPTY,
    )

    const savedImages = product
      ? product.images?.length
        ? product.images
        : [product.image_url].filter(Boolean)
      : []

    setEntries(savedImages.map((url, index) => ({ key: `saved-${index}-${url}`, url })))
    setErrors({})
    setSaving(false)
  }, [open, product])

  // Libera los objetos temporales al cerrar el formulario.
  useEffect(() => {
    if (open) return
    objectUrls.current.forEach((url) => URL.revokeObjectURL(url))
    objectUrls.current = []
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  // Mantiene visible una categoría antigua al editar productos ya cargados.
  const categoryOptions = CATEGORIES.includes(values.category)
    ? CATEGORIES
    : [values.category, ...CATEGORIES]

  const handleFiles = (event) => {
    const selected = Array.from(event.target.files ?? [])
    if (!selected.length) return

    const next = selected.map((file) => {
      const url = URL.createObjectURL(file)
      objectUrls.current.push(url)
      return { key: `new-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, url, file }
    })

    setEntries((current) => [...current, ...next])
    event.target.value = ''
  }

  const removeEntry = (key) => {
    setEntries((current) => {
      const target = current.find((entry) => entry.key === key)
      if (target?.file) URL.revokeObjectURL(target.url)
      return current.filter((entry) => entry.key !== key)
    })
  }

  const makeCover = (key) => {
    setEntries((current) => {
      const target = current.find((entry) => entry.key === key)
      if (!target) return current
      return [target, ...current.filter((entry) => entry.key !== key)]
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const nextErrors = {}
    if (!values.name.trim()) nextErrors.name = 'Ingresá un nombre.'
    if (values.price === '' || Number(values.price) < 0) nextErrors.price = 'Ingresá un precio válido.'
    if (!values.category) nextErrors.category = 'Elegí una categoría.'

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }

    setSaving(true)
    try {
      await onSubmit(values, entries)
      onClose()
    } catch (error) {
      setErrors({ form: error.message || 'No pudimos guardar el producto.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
            aria-hidden="true"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={product ? 'Editar producto' : 'Nuevo producto'}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-xl bg-chalk shadow-lift sm:rounded-xl"
          >
            <header className="flex items-start justify-between border-b border-ink/[0.07] px-6 py-5">
              <div>
                <p className="eyebrow">{product ? 'Editar' : 'Nuevo'}</p>
                <h2 className="mt-1 font-serif text-2xl">
                  {product ? product.name : 'Producto'}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                className="grid h-9 w-9 place-items-center rounded-full border border-ink/10 transition hover:border-ink/30"
              >
                <X size={17} strokeWidth={1.6} />
              </button>
            </header>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6">
              <div className="grid gap-5">
                <div>
                  <label className="label" htmlFor="product-name">
                    Nombre
                  </label>
                  <input
                    id="product-name"
                    value={values.name}
                    onChange={(event) =>
                      setValues((current) => ({ ...current, name: event.target.value }))
                    }
                    placeholder="Vela de soja Ámbar & Vainilla"
                    className="field"
                  />
                  {errors.name && <p className="mt-1.5 text-xs text-red-700">{errors.name}</p>}
                </div>

                <div>
                  <label className="label" htmlFor="product-description">
                    Descripción
                  </label>
                  <textarea
                    id="product-description"
                    rows={5}
                    value={values.description}
                    onChange={(event) =>
                      setValues((current) => ({ ...current, description: event.target.value }))
                    }
                    placeholder="Notas aromáticas, materiales, medidas, cuidados..."
                    className="field resize-none"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor="product-price">
                      Precio (ARS)
                    </label>
                    <input
                      id="product-price"
                      type="number"
                      min="0"
                      step="any"
                      inputMode="decimal"
                      value={values.price}
                      onChange={(event) =>
                        setValues((current) => ({ ...current, price: event.target.value }))
                      }
                      placeholder="18400"
                      className="field"
                    />
                    {errors.price && <p className="mt-1.5 text-xs text-red-700">{errors.price}</p>}
                  </div>

                  <div>
                    <label className="label" htmlFor="product-category">
                      Categoría
                    </label>
                    <select
                      id="product-category"
                      value={values.category}
                      onChange={(event) =>
                        setValues((current) => ({ ...current, category: event.target.value }))
                      }
                      className="field appearance-none"
                    >
                      {categoryOptions.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline justify-between">
                    <span className="label mb-0">Fotos del producto</span>
                    <span className="text-[10px] text-muted">
                      {entries.length ? `${entries.length} foto${entries.length === 1 ? '' : 's'}` : 'sin fotos'}
                    </span>
                  </div>

                  <div className="mt-2 rounded-lg border border-dashed border-line bg-shell/70 p-4">
                    {entries.length ? (
                      <div className="flex flex-wrap gap-3">
                        {entries.map((entry, index) => (
                          <div
                            key={entry.key}
                            className="group relative h-24 w-20 overflow-hidden rounded-lg bg-beige ring-1 ring-ink/5"
                          >
                            <img src={entry.url} alt="" className="h-full w-full object-cover" />

                            {index === 0 && (
                              <span className="absolute inset-x-0 bottom-0 bg-clay/90 py-1 text-center text-[8px] font-medium uppercase tracking-[0.14em] text-white">
                                Portada
                              </span>
                            )}

                            {index > 0 && (
                              <button
                                type="button"
                                onClick={() => makeCover(entry.key)}
                                className="absolute inset-x-0 bottom-0 bg-ink/75 py-1 text-[8px] uppercase tracking-[0.1em] text-cream opacity-100 transition hover:bg-ink sm:opacity-0 sm:group-hover:opacity-100"
                              >
                                Hacer portada
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => removeEntry(entry.key)}
                              aria-label="Quitar foto"
                              className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-ink/70 text-cream transition hover:bg-ink"
                            >
                              <X size={11} strokeWidth={2} />
                            </button>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => fileRef.current?.click()}
                          aria-label="Agregar más fotos"
                          className="grid h-24 w-20 place-items-center rounded-lg border border-dashed border-ink/20 text-muted transition hover:border-clay hover:text-clay"
                        >
                          <Plus size={18} strokeWidth={1.6} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <div className="grid h-20 w-16 shrink-0 place-items-center rounded-lg bg-beige text-muted/60">
                          <ImagePlus size={20} strokeWidth={1.4} />
                        </div>
                        <div className="flex-1">
                          <button
                            type="button"
                            onClick={() => fileRef.current?.click()}
                            className="btn-ghost px-4 py-2.5 text-[10px]"
                          >
                            <Upload size={14} strokeWidth={1.8} />
                            Subir fotos
                          </button>
                          <p className="mt-2 text-[11px] text-muted/80">
                            Podés subir varias a la vez.
                          </p>
                        </div>
                      </div>
                    )}

                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFiles}
                      className="hidden"
                    />

                    <p className="mt-3 text-[11px] leading-relaxed text-muted/80">
                      La primera foto es la portada en el catálogo y en el inicio. Las demás se ven
                      en el carrusel del producto. Se guardan en el bucket público{' '}
                      <span className="text-clay">product-images</span>.
                    </p>
                  </div>
                </div>

                                  <div className="flex items-center justify-between rounded-lg border border-line bg-shell px-4 py-3.5">
                  <div>
                    <p className="text-xs font-medium text-ink">Disponible para la venta</p>
                    <p className="mt-0.5 text-[11px] text-muted">
                      Si lo desactivás, se muestra como “Sin stock”.
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={values.in_stock}
                    aria-label="Disponibilidad"
                    onClick={() =>
                      setValues((current) => ({ ...current, in_stock: !current.in_stock }))
                    }
                    className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
                      values.in_stock ? 'bg-clay' : 'bg-ink/15'
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
                        values.in_stock ? 'left-6' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                {errors.form && (
                  <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-xs text-red-700">
                    {errors.form}
                  </p>
                )}
              </div>

              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button type="button" onClick={onClose} className="btn-ghost">
                  Cancelar
                </button>
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving && <Spinner className="h-3.5 w-3.5" />}
                  {product ? 'Guardar cambios' : 'Crear producto'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
