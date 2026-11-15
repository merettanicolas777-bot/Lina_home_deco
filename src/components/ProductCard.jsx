import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { formatARS } from '../utils/format'

export default function ProductCard({ product, index = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.3), ease: 'easeOut' }}
      className="h-full"
    >
      <Link
        to={`/producto/${product.id}`}
        className="group flex h-full flex-col rounded-[18px] border border-ink/[0.07] bg-white/70 p-2.5 transition duration-300 hover:-translate-y-0.5 hover:border-clay/35 hover:bg-white hover:shadow-card sm:p-3"
      >
        <div className="relative overflow-hidden rounded-[12px] bg-beige">
          <div className="aspect-[4/5] w-full">
            <img
              src={product.image_url || '/images/product-vela.svg'}
              alt={product.name}
              loading="lazy"
              className={`h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.03] ${
                product.in_stock ? '' : 'opacity-60 saturate-[0.7]'
              }`}
            />
          </div>

          {!product.in_stock && (
            <span className="absolute inset-x-0 bottom-0 bg-ink/80 py-1.5 text-center text-[8px] font-medium uppercase tracking-[0.18em] text-cream backdrop-blur-sm sm:text-[9px]">
              Sin stock
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col px-1 pt-3">
          <p className="text-[8px] uppercase tracking-[0.18em] text-clay sm:text-[9px]">
            {product.category}
          </p>

          <h3 className="mt-1.5 line-clamp-2 min-h-[2.5em] font-serif text-[15px] font-normal leading-snug text-ink sm:text-[17px]">
            {product.name}
          </h3>

          <div className="mt-auto flex items-end justify-between gap-2 pt-2.5">
            <p className="text-[13px] font-semibold tracking-tight text-ink sm:text-sm">
              {formatARS(product.price)}
            </p>
            <span className="mb-0.5 hidden shrink-0 text-[9px] uppercase tracking-[0.14em] text-muted transition-colors group-hover:text-clay sm:inline">
              Ver
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
