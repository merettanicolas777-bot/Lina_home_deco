import { Link } from 'react-router-dom'
import { ArrowRight, Heart, Leaf, Sparkles } from 'lucide-react'

const pillars = [
  {
    icon: Leaf,
    title: 'Materiales honestos',
    text: 'Cera de soja, mechas de algodón, vidrio reutilizable y maderas nobles. Nada que no pondríamos en nuestra propia casa.',
  },
  {
    icon: Heart,
    title: 'Hecho a mano, de verdad',
    text: 'Cada lote se prepara de a 20 unidades. Controlamos el aroma, el encendido y el acabado uno por uno.',
  },
  {
    icon: Sparkles,
    title: 'Aromas que acompañan',
    text: 'Fragancias suaves y envolventes, pensadas para convivir con tu casa y no taparla.',
  },
]

export default function About() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-6 pt-6 sm:px-6 sm:pt-12">
      <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        <div>
          <p className="eyebrow">Sobre nosotros</p>
          <h1 className="mt-2 text-[2.2rem] leading-[1.06] sm:text-[3.2rem]">
            Hacemos cosas que huelen a casa
          </h1>
          <p className="mt-4 max-w-lg text-[14.5px] leading-relaxed text-muted sm:mt-5 sm:text-[15px]">
            Lina Home &amp; Deco nació en 2021, en una cocina de Buenos Aires, con una olla de cera
            de soja y la idea de que los objetos cotidianos pueden cambiar el ánimo de un ambiente.
          </p>
          <p className="mt-3.5 max-w-lg text-[14px] leading-relaxed text-muted">
            Empezamos con tres velas para regalar a amigas. Hoy diseñamos una colección completa de
            aromas para el hogar y para llevar: velas, difusores de varillas y de auto, home sprays,
            body splash y perfumes de cartera.
          </p>
          <p className="mt-3.5 max-w-lg text-[14px] leading-relaxed text-muted">
            Seguimos siendo un equipo chico: cada pedido lo preparamos nosotros, con papel de seda,
            una tarjeta escrita a mano y la misma atención que le pondríamos a un regalo propio.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl bg-bone">
          <img
            src="/images/hero.svg"
            alt="Ambiente cálido con una vela de soja encendida y flores secas"
            className="aspect-[4/5] w-full object-cover sm:aspect-[5/6]"
          />
        </div>
      </div>

      <div className="mt-12 grid gap-3 sm:mt-16 sm:grid-cols-3 sm:gap-4">
        {pillars.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-xl border border-line/80 bg-shell p-4 sm:p-5">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-bone text-moss">
              <Icon size={17} strokeWidth={1.7} />
            </span>
            <h2 className="mt-4 text-xl leading-snug">{title}</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">{text}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-bone px-5 py-8 text-center sm:mt-14 sm:px-10 sm:py-12">
        <p className="mx-auto max-w-2xl font-serif text-[1.35rem] leading-[1.35] text-ink sm:text-[1.9rem]">
          “La casa no es un lugar: es el aroma que te recibe cuando abrís la puerta.”
        </p>
        <p className="mt-4 text-[12px] font-medium text-muted">Lina, fundadora</p>
        <Link to="/catalogo" className="btn-primary group mt-7">
          Explorar el catálogo
          <ArrowRight
            size={16}
            strokeWidth={2}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>
    </div>
  )
}
