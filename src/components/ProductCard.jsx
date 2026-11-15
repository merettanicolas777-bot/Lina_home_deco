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
      className="group"
    >
      <Link to={`/producto/${product.id}`} className="block">
        <div className="relative overflow-hidden rounded-[20px] bg-beige">
          <div className="aspect-[4/5] w-full overflow-hidden">
            <img
              src={product.image_url || '/images/product-vela.svg'}
              alt={product.name}
              loading="lazy"
              className={`h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04] ${
                product.in_stock ? '' : 'opacity-70'
              }`}
            />
          </div>

          {!product.in_stock && (
            <span className="absolute left-4 top-4 rounded-full bg-ink/85 px-3 py-1 text-[9px] font-medium uppercase tracking-[0.16em] text-cream backdrop-blur">
              Sin stock
            </span>
          )}

          <span className="pointer-events-none absolute inset-x-4 bottom-4 translate-y-3 rounded-full bg-cream/95 py-2.5 text-center text-[10px] font-medium uppercase tracking-[0.18em] text-ink opacity-0 shadow-soft backdrop-blur transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            Ver producto
          </span>
        </div>

        <div className="mt-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-clay">{product.category}</p>
            <h3 className="mt-1.5 font-serif text-lg font-normal leading-snug text-ink sm:text-xl">
              {product.name}
            </h3>
          </div>
          <p className="shrink-0 pt-4 text-sm font-medium text-ink">{formatARS(product.price)}</p>
        </div>
      </Link>
    </motion.article>
  )
}
