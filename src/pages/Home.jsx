import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Flame, Leaf, MessageCircle, Truck } from 'lucide-react'
import { fetchProducts } from '../lib/products'
import ProductCard from '../components/ProductCard'
import { ProductGridSkeleton } from '../components/Skeleton'
import { getWhatsAppNumber } from '../utils/whatsapp'

const values = [
  { icon: Leaf, title: 'Cera de soja', text: '100% vegetal, sin parafina.' },
  { icon: Truck, title: 'Envíos a todo el país', text: 'Despachamos en 48 horas.' },
  { icon: Flame, title: 'Hecho a mano', text: 'Pequeños lotes, uno por uno.' },
]

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    fetchProducts()
      .then((data) => {
        if (active) setProducts(data.filter((product) => product.in_stock).slice(0, 4))
      })
      .catch(() => {
        if (active) setProducts([])
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-40 top-24 h-96 w-96 rounded-full bg-beige/60 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-12 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pb-24 lg:pt-16">
          <div className="relative z-10">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="eyebrow"
            >
              Aromas &amp; objetos para tu casa
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08 }}
              className="mt-5 font-serif text-[2.9rem] font-light leading-[1.05] tracking-[-0.01em] sm:text-6xl lg:text-[4.4rem]"
            >
              Rincones que
              <br />
              se sienten
              <em className="not-italic text-clay"> como casa</em>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.16 }}
              className="mt-6 max-w-md text-[15px] leading-relaxed text-muted"
            >
              Velas de soja, difusores de varillas y home sprays para transformar lo cotidiano en un
              pequeño ritual de calma.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.24 }}
              className="mt-9 flex flex-col gap-3 sm:flex-row"
            >
              <Link to="/catalogo" className="btn-primary group">
                Ver catálogo
                <ArrowRight
                  size={15}
                  strokeWidth={1.8}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
              <Link to="/sobre-nosotros" className="btn-ghost">
                Nuestra historia
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-10 flex items-center gap-4 text-[11px] text-muted"
            >
              <span className="h-px w-10 bg-clay/40" />
              Handmade · Buenos Aires
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="relative mx-auto w-full max-w-[520px] lg:max-w-none"
          >
            <div className="overflow-hidden rounded-t-[220px] rounded-b-[28px] bg-beige shadow-soft">
              <img
                src="/images/hero.svg"
                alt="Rincón cálido con vela de soja y florero de cerámica"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="absolute -bottom-5 left-2 flex items-center gap-3 rounded-2xl bg-cream/95 px-4 py-3 shadow-soft backdrop-blur sm:left-6">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-sand text-clay">
                <Flame size={16} strokeWidth={1.6} />
              </span>
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-muted">Temporada</p>
                <p className="font-serif text-base leading-tight">Ámbar &amp; Vainilla</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Valores */}
      <section className="border-y border-ink/[0.07] bg-sand/70">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:grid-cols-3 sm:px-8 sm:py-12">
          {values.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-start gap-3.5">
              <Icon size={20} strokeWidth={1.4} className="mt-0.5 shrink-0 text-clay" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink">
                  {title}
                </p>
                <p className="mt-1 text-xs text-muted">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Destacados */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Selección de la casa</p>
            <h2 className="mt-3 font-serif text-4xl font-light sm:text-5xl">Destacados</h2>
          </div>
          <Link
            to="/catalogo"
            className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted transition hover:text-ink"
          >
            Ver todo
            <ArrowRight
              size={14}
              strokeWidth={1.8}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        <div className="mt-10 sm:mt-12">
          {loading ? (
            <ProductGridSkeleton count={4} />
          ) : products.length ? (
            <div className="grid grid-cols-2 gap-x-3.5 gap-y-5 sm:gap-x-6 sm:gap-y-7 lg:grid-cols-4">
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-dashed border-ink/15 px-6 py-12 text-center text-sm text-muted">
              Estamos preparando nuevos aromas. Volvé pronto.
            </p>
          )}
        </div>
      </section>

      {/* Historia */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-10 rounded-[28px] bg-sand px-6 py-12 sm:px-12 sm:py-14 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 lg:order-1">
            <p className="eyebrow">Sobre Lina</p>
            <h2 className="mt-4 font-serif text-4xl font-light leading-tight sm:text-[2.75rem]">
              Un proyecto nacido entre cera tibia y tardes de domingo
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted">
              Empezamos derritiendo soja en la cocina de casa, buscando ese aroma que abraza al
              volver del trabajo.               Hoy cada vela, difusor y bruma sigue pasando por nuestras manos: elegimos las
              fragancias, probamos las mechas y cuidamos el packaging como si fuera un regalo.
            </p>
            <Link to="/sobre-nosotros" className="btn-primary mt-8">
              Conocer más
            </Link>
          </div>

          <div className="order-1 overflow-hidden rounded-[24px] lg:order-2">
            <img
              src="/images/about.svg"
              alt="Estante con velas, difusores y objetos de cerámica"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto mt-20 max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-6 rounded-[28px] bg-ink px-7 py-12 text-cream sm:flex-row sm:items-center sm:px-12">
          <div>
            <p className="text-[10px] uppercase tracking-brand text-clay-light">Asesoramiento</p>
            <h2 className="mt-3 max-w-md font-serif text-3xl font-light leading-tight text-cream sm:text-4xl">
              ¿Buscás un regalo? Te ayudamos a elegir
            </h2>
            <p className="mt-3 max-w-md text-sm text-cream/65">
              Contanos para quién es y armamos una combinación de aromas con envoltorio de regalo.
            </p>
          </div>
          <a
            href={`https://wa.me/${getWhatsAppNumber()}`}
            target="_blank"
            rel="noreferrer"
            className="btn bg-cream text-ink transition hover:bg-clay-light hover:text-ink"
          >
            <MessageCircle size={15} strokeWidth={1.8} />
            Escribir por WhatsApp
          </a>
        </div>
      </section>
    </div>
  )
}
