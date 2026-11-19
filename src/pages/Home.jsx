import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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
      <section className="mx-auto max-w-6xl px-4 pb-2 pt-5 sm:px-6 sm:pt-8">
        <div className="grid items-center gap-7 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12">
          <div>
            <p className="enter-up enter-1 inline-flex items-center gap-2 rounded-full border border-line bg-shell/70 px-3 py-1.5 text-[11.5px] font-medium text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-amber" />
              Velas, difusores y brumas
            </p>

            <h1 className="enter-up enter-2 mt-4 text-[2.3rem] leading-[1.04] sm:mt-5 sm:text-[3.6rem] lg:text-[4.1rem]">
              La casa empieza
              <br />
              por el aroma
            </h1>

            <p className="enter-up enter-3 mt-4 max-w-[30rem] text-[14.5px] leading-[1.7] text-muted sm:text-base">
              Cera de soja, aceites de autor y recipientes que se quedan. Objetos para perfumar los
              rincones donde pasa tu día.
            </p>

            <div className="enter-up enter-4 mt-6 flex flex-col gap-2.5 sm:flex-row sm:items-center">
              <Link to="/catalogo" className="btn-primary group w-full sm:w-auto">
                Ver catálogo
                <ArrowRight
                  size={16}
                  strokeWidth={2}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
              <Link to="/sobre-nosotros" className="btn-ghost w-full sm:w-auto">
                Nuestra historia
                <ArrowRight size={14} strokeWidth={2} />
              </Link>
            </div>

            <div className="enter-fade enter-5 mt-6 flex items-center gap-2 text-[12px] text-muted sm:mt-7">
              <span className="h-1.5 w-1.5 rounded-full bg-moss-light" />
              Hecho a mano en Buenos Aires
            </div>
          </div>

          <div className="enter-fade relative">
            <div className="overflow-hidden rounded-2xl bg-bone">
              <img
                src="/images/hero.svg"
                alt="Rincón cálido con una vela de soja encendida y un florero de cerámica"
                className="aspect-[4/5] w-full object-cover sm:aspect-[5/6]"
              />
            </div>

            <div className="enter-up enter-5 absolute bottom-2.5 left-2.5 right-2.5 rounded-lg border border-line/70 bg-chalk/95 p-3 shadow-card backdrop-blur sm:bottom-4 sm:left-4 sm:right-auto sm:w-[250px] sm:p-3.5">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-moss text-chalk">
                  <Flame size={15} strokeWidth={1.8} />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-muted">Temporada</p>
                  <p className="mt-0.5 truncate font-serif text-[17px] leading-tight">
                    Ámbar &amp; Vainilla
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="mx-auto mt-8 max-w-6xl px-4 sm:mt-14 sm:px-6">
        <div className="divide-y divide-line/70 overflow-hidden rounded-xl border border-line/80 bg-shell/70 sm:grid sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {values.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-start gap-3.5 p-4 sm:p-5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-bone text-moss">
                <Icon size={16} strokeWidth={1.7} />
              </span>
              <div>
                <p className="text-[13.5px] font-semibold leading-tight text-ink">{title}</p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-muted">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Destacados */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Selección de la casa</p>
            <h2 className="mt-2 text-[1.9rem] leading-[1.08] sm:text-[2.7rem]">Destacados</h2>
            <p className="mt-2 max-w-sm text-[13.5px] leading-relaxed text-muted">
              Los aromas que más se repiten en casa: cálidos, limpios y fáciles de regalar.
            </p>
          </div>
          <Link to="/catalogo" className="link-quiet group w-fit">
            Ver todo
            <ArrowRight
              size={14}
              strokeWidth={2}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        <div className="mt-6 sm:mt-9">
          {loading ? (
            <ProductGridSkeleton count={4} columns={4} />
          ) : products.length ? (
            <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:gap-x-5 sm:gap-y-6 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-dashed border-line px-6 py-12 text-center text-sm text-muted">
              Estamos preparando nuevos aromas. Volvé pronto.
            </p>
          )}
        </div>
      </section>

      {/* Historia */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-7 rounded-2xl bg-bone p-4 pb-6 sm:p-8 lg:grid-cols-2 lg:gap-12 lg:p-10">
          <div className="order-2 lg:order-1 lg:pl-2">
            <p className="eyebrow">Sobre Lina</p>
            <h2 className="mt-2 text-[1.7rem] leading-[1.14] sm:text-[2.4rem]">
              Un proyecto nacido entre cera tibia y tardes de domingo
            </h2>
            <p className="mt-4 max-w-lg text-[14px] leading-[1.75] text-muted">
              Empezamos derritiendo soja en la cocina de casa, buscando ese aroma que abraza al
              volver del trabajo. Hoy cada vela, difusor y bruma sigue pasando por nuestras manos:
              elegimos las fragancias, probamos las mechas y cuidamos el packaging como si fuera un
              regalo.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <img
                src="/images/logo.png"
                alt=""
                aria-hidden="true"
                className="h-10 w-10 rounded-full bg-shell object-contain p-1"
              />
              <div>
                <p className="font-serif text-lg leading-none">Lina</p>
                <p className="mt-1 text-[11px] text-muted">Fundadora</p>
              </div>
            </div>

            <Link to="/sobre-nosotros" className="btn-ghost mt-6">
              Conocer más
            </Link>
          </div>

          <div className="order-1 overflow-hidden rounded-xl bg-chalk lg:order-2">
            <img
              src="/images/about.svg"
              alt="Estante con velas de soja, difusores de varillas y objetos de cerámica"
              className="aspect-[4/3] w-full object-cover lg:aspect-[5/4]"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto mt-12 max-w-6xl px-4 sm:mt-16 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-ink px-5 py-7 text-chalk sm:flex-row sm:items-center sm:px-10 sm:py-10">
          <div>
            <p className="text-[12px] font-medium text-chalk/65">Asesoramiento</p>
            <h2 className="mt-2 max-w-md text-[1.55rem] leading-[1.18] text-chalk sm:text-[2.1rem]">
              ¿Buscás un regalo? Te ayudamos a elegir
            </h2>
            <p className="mt-2 max-w-md text-[13px] leading-relaxed text-chalk/70">
              Contanos para quién es y armamos una combinación de aromas con envoltorio de regalo.
            </p>
          </div>
          <a
            href={`https://wa.me/${getWhatsAppNumber()}`}
            target="_blank"
            rel="noreferrer"
            className="btn w-full shrink-0 bg-chalk text-ink hover:bg-shell sm:w-auto"
          >
            <MessageCircle size={16} strokeWidth={1.9} />
            Escribir por WhatsApp
          </a>
        </div>
      </section>
    </div>
  )
}
