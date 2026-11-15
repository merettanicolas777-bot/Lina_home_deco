import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
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
    <div className="mx-auto max-w-7xl px-5 pb-10 pt-14 sm:px-8 sm:pt-20">
      <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="eyebrow">Sobre nosotros</p>
          <h1 className="mt-4 font-serif text-[2.75rem] font-light leading-[1.05] sm:text-6xl">
            Hacemos cosas
            <br />
            que huelen a casa
          </h1>
          <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-muted">
            Lina Home &amp; Deco nació en 2021, en una cocina de Buenos Aires, con una olla de cera
            de soja y la idea de que los objetos cotidianos pueden cambiar el ánimo de un ambiente.
          </p>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted">
            Empezamos con tres velas para regalar a amigas. Hoy diseñamos una colección completa de
            aromas para el hogar —velas, difusores de varillas, home sprays— junto a piezas
            decorativas de cerámica y madera que elegimos en talleres locales.
          </p>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted">
            Seguimos siendo un equipo chico: cada pedido lo preparamos nosotros, con papel de seda,
            una tarjeta escrita a mano y la misma atención que le pondríamos a un regalo propio.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="overflow-hidden rounded-t-[200px] rounded-b-[24px] bg-beige"
        >
          <img
            src="/images/hero.svg"
            alt="Ambiente cálido con vela encendida y flores secas"
            className="h-full w-full object-cover"
          />
        </motion.div>
      </div>

      <div className="mt-20 grid gap-10 border-t border-ink/[0.08] pt-12 sm:grid-cols-3 sm:gap-8">
        {pillars.map(({ icon: Icon, title, text }, index) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
          >
            <span className="grid h-11 w-11 place-items-center rounded-full bg-sand text-clay">
              <Icon size={18} strokeWidth={1.4} />
            </span>
            <h2 className="mt-5 font-serif text-2xl font-normal">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-20 rounded-[28px] bg-sand px-6 py-14 text-center sm:px-10">
        <p className="font-serif text-2xl font-light leading-snug text-ink sm:text-3xl">
          “La casa no es un lugar: es el aroma que te recibe cuando abrís la puerta.”
        </p>
        <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-clay">Lina · fundadora</p>
        <Link to="/catalogo" className="btn-primary group mt-8">
          Explorar el catálogo
          <ArrowRight
            size={15}
            strokeWidth={1.8}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>
    </div>
  )
}
