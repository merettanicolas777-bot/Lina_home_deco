import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { formatARS } from '../utils/format'

const TONES = {
  Velas: 'bg-amber',
  'Home Sprays': 'bg-moss-light',
  'Difusores de Varillas': 'bg-moss',
  'Difusores de Auto': 'bg-muted',
  'Body Splash': 'bg-amber/70',
  'Perfumes de Cartera': 'bg-moss-light',
}

export default function ProductCard({ product }) {
  return (
    <article className="h-full">
      <Link
        to={`/producto/${product.id}`}
        className="group flex h-full flex-col rounded-xl border border-line/70 bg-shell p-1.5 transition-all duration-500 hover:-translate-y-1 hover:border-line hover:shadow-lift sm:p-2.5"
      >
        <div className="relative overflow-hidden rounded-lg bg-bone">
          <div className="aspect-[4/5] w-full">
            <img
              src={product.image_url || '/images/product-vela.svg'}
              alt={product.name}
              className={`h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035] ${
                product.in_stock ? '' : 'opacity-60 saturate-[0.65]'
              }`}
            />
          </div>

          {!product.in_stock && (
            <span className="absolute inset-x-2 bottom-2 rounded-full bg-ink/80 py-1.5 text-center text-[11px] font-medium text-chalk backdrop-blur-sm">
              Sin stock
            </span>
          )}

          <span className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-chalk/90 text-ink opacity-0 backdrop-blur transition-all duration-300 group-hover:opacity-100">
            <ArrowUpRight size={15} strokeWidth={1.8} />
          </span>
        </div>

        <div className="flex flex-1 flex-col px-1.5 pb-1 pt-3 sm:px-2 sm:pb-1 sm:pt-3.5">
          <p className="flex items-center gap-1.5 text-[10.5px] font-medium text-muted sm:text-[11px]">
            <span className={`h-1.5 w-1.5 rounded-full ${TONES[product.category] ?? 'bg-moss'}`} />
            {product.category}
          </p>

          <h3 className="mt-1.5 line-clamp-2 min-h-[2.5em] font-serif text-[15px] leading-snug text-ink sm:min-h-[2.6em] sm:text-[17px]">
            {product.name}
          </h3>

          <div className="mt-auto pt-2.5 sm:pt-3">
            <p className="tabular text-[13.5px] font-semibold text-ink sm:text-[15px]">
              {formatARS(product.price)}
            </p>
          </div>
        </div>
      </Link>
    </article>
  )
}
