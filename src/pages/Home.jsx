import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Flame, Leaf, MessageCircle, Truck } from 'lucide-react'
import { fetchProducts } from '../lib/products'
import ProductCard from '../components/ProductCard'
import { ProductGridSkeleton } from '../components/Skeleton'
import { getWhatsAppNumber } from '../utils/whatsapp'
import { container, fadeUp, scaleReveal } from '../lib/motion'

const values = [
  { icon: Leaf, title: 'Cera de soja', text: '100% vegetal, sin parafina.' },
  { icon: Truck, title: 'Envíos a todo el país', text: 'Despachamos en 48 horas.' },
  { icon: Flame, title: 'Hecho a mano', text: 'Pequeños lotes, uno por uno.' },
]

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const prefersReduced = useReducedMotion()
  const { scrollY } = useScroll()
  const heroImageY = useTransform(scrollY, [0, 700], [0, prefersReduced ? 0 : -26])

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
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-10 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pb-24 lg:pt-14">
          <div className="relative z-10">
            <p className="enter-up enter-1 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.26em] text-clay sm:text-[11px]">
              <span className="h-px w-8 bg-clay/45" />
              Aromas &amp; objetos para tu casa
            </p>

            <h1 className="mt-6 font-serif text-[3.05rem] font-light leading-[0.97] tracking-[-0.022em] sm:text-[4.2rem] lg:text-[5.1rem]">
              <span className="enter-up enter-2 block">Rincones que</span>
              <span className="enter-up enter-3 block">se sienten</span>
              <span className="enter-up enter-4 block font-normal italic text-clay">
                como casa
              </span>
            </h1>

            <p className="enter-up enter-4 mt-7 max-w-[27rem] text-[15px] leading-[1.85] text-ink/60 sm:text-base">
              Velas de soja, difusores de varillas y home sprays para transformar lo cotidiano en un
              pequeño ritual de calma.
            </p>

            <div className="enter-up enter-5 mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <Link to="/catalogo" className="btn-primary group w-full sm:w-auto">
                Ver catálogoolo
                <ArrowRight
                  size={15}
                  strokeWidth={1.8}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
              <Link
                to="/sobre-nosotros"
                className="group inline-flex items-center gap-2 border-b border-ink/20 pb-1 text-[10px] font-medium uppercase tracking-[0.2em] text-ink/70 transition hover:border-clay hover:text-ink"
              >
                Nuestra historia
              </Link>
            </div>

            <div className="enter-fade enter-5 mt-11 flex items-center gap-3">
              <span className="h-px w-10 bg-clay/40" />
              <span className="text-[9px] uppercase tracking-[0.24em] text-muted">
                Handmade · Buenos Aires
              </span>
            </div>
          </div>

          <motion.div
            style={{ y: heroImageY }}
            className="enter-fade relative mx-auto w-full max-w-[520px] lg:max-w-none"
          >
            <div className="overflow-hidden rounded-t-[220px] rounded-b-[24px] bg-beige shadow-soft">
              <img
                src="/images/hero.svg"
                alt="Rincón cálido con vela de soja y florero de cerámica"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="enter-up enter-6 absolute -bottom-5 left-2 sm:left-6">
              <motion.div
                initial={false}
                animate={prefersReduced ? undefined : { y: [0, -6, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="flex items-center gap-3 rounded-2xl bg-cream/95 px-4 py-3 shadow-soft backdrop-blur"
              >
                <span className="grid h-9 w-9 place-items-center rounded-full bg-sand text-clay">
                  <Flame size={16} strokeWidth={1.6} />
                </span>
                <div>
                  <p className="text-[8px] uppercase tracking-[0.22em] text-muted">Temporada</p>
                  <p className="mt-0.5 font-serif text-[17px] italic leading-tight text-ink">
                    Ámbar &amp; Vainilla
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Valores */}
      <motion.section
        variants={container(0, 0.1)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="border-y border-ink/[0.07] bg-sand/70"
      >
        <div className="mx-auto grid max-w-7xl gap-7 px-5 py-10 sm:grid-cols-3 sm:gap-8 sm:px-8 sm:py-11">
          {values.map(({ icon: Icon, title, text }) => (
            <motion.div key={title} variants={fadeUp} className="flex items-start gap-3.5">
              <Icon size={19} strokeWidth={1.3} className="mt-1 shrink-0 text-clay" />
              <div>
                <p className="font-serif text-[17px] leading-tight text-ink">{title}</p>
                <p className="mt-1 text-[12px] leading-relaxed text-ink/50">{text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Destacados */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={container(0, 0.08)}
          className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
        >
          <motion.div variants={fadeUp}>
            <p className="eyebrow">Selección de la casa</p>
            <h2 className="mt-3 font-serif text-[2.6rem] font-light leading-[1.02] tracking-[-0.02em] sm:text-[3.2rem]">
              Destacados
            </h2>
            <p className="mt-3 max-w-sm text-[13.5px] leading-relaxed text-ink/55">
              Los aromas que más se repiten en casa: cálidos, limpios y fáciles de regalar.
            </p>
          </motion.div>
          <motion.div variants={fadeUp}>
            <Link
              to="/catalogo"
              className="group inline-flex w-fit items-center gap-2 border-b border-ink/20 pb-1 text-[10px] font-medium uppercase tracking-[0.2em] text-ink/70 transition hover:border-clay hover:text-ink"
            >
              Ver todo
              <ArrowRight
                size={13}
                strokeWidth={1.8}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </motion.div>

        <div className="mt-9 sm:mt-11">
          {loading ? (
            <ProductGridSkeleton count={4} />
          ) : products.length ? (
            <motion.div
              variants={container(0.05, 0.09)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              className="grid grid-cols-2 gap-x-3.5 gap-y-5 sm:gap-x-6 sm:gap-y-7 lg:grid-cols-4"
            >
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          ) : (
            <p className="rounded-2xl border border-dashed border-ink/15 px-6 py-12 text-center text-sm text-muted">
              Estamos preparando nuevos aromas. Volvé pronto.
            </p>
          )}
        </div>
      </section>

      {/* Historia */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-10 rounded-[26px] bg-sand px-6 py-12 sm:px-12 sm:py-14 lg:grid-cols-2 lg:gap-16">
          <motion.div
            variants={container(0, 0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="order-2 lg:order-1"
          >
            <motion.p variants={fadeUp} className="eyebrow">
              Sobre Lina
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="mt-4 max-w-md font-serif text-[2.1rem] font-light leading-[1.1] tracking-[-0.015em] sm:text-[2.6rem]"
            >
              Un proyecto nacido entre cera tibia y{' '}
              <em className="italic text-clay">tardes de domingo</em>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mt-5 max-w-lg text-[13.5px] leading-[1.85] text-ink/60 sm:text-sm"
            >
              Empezamos derritiendo soja en la cocina de casa, buscando ese aroma que abraza al volver
              del trabajo. Hoy cada vela, difusor y bruma sigue pasando por nuestras manos: elegimos
              las fragancias, probamos las mechas y cuidamos el packaging como si fuera un regalo.
            </motion.p>

            <motion.p variants={fadeUp} className="mt-6 font-serif text-2xl italic text-clay/90">
              Lina
            </motion.p>

            <motion.div variants={fadeUp} className="mt-7">
              <Link to="/sobre-nosotros" className="btn-primary">
                Conocer más
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            variants={scaleReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="order-1 overflow-hidden rounded-[22px] lg:order-2"
          >
            <img
              src="/images/about.svg"
              alt="Estante con velas, difusores y objetos de cerámica"
              className="h-full w-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto mt-16 max-w-7xl px-5 sm:mt-20 sm:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="flex flex-col items-start justify-between gap-7 rounded-[26px] bg-ink px-7 py-11 text-cream sm:flex-row sm:items-center sm:px-12 sm:py-12"
        >
          <div>
            <p className="text-[9px] uppercase tracking-[0.26em] text-clay-light">Asesoramiento</p>
            <h2 className="mt-3 max-w-md font-serif text-[1.9rem] font-light leading-[1.15] text-cream sm:text-[2.4rem]">
              ¿Buscás un regalo?{' '}
              <em className="italic text-clay-light">Te ayudamos a elegir</em>
            </h2>
            <p className="mt-3 max-w-md text-[13px] leading-relaxed text-cream/60">
              Contanos para quién es y armamos una combinación de aromas con envoltorio de regalo.
            </p>
          </div>
          <a
            href={`https://wa.me/${getWhatsAppNumber()}`}
            target="_blank"
            rel="noreferrer"
            className="btn shrink-0 bg-cream text-ink transition hover:bg-clay-light hover:text-ink"
          >
            <MessageCircle size={15} strokeWidth={1.8} />
            Escribir por WhatsApp
          </a>
        </motion.div>
      </section>
    </div>
  )
}
