import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Search, ShoppingBag, X } from 'lucide-react'
import Logo from './Logo'
import { useCart } from '../context/CartContext'

const EASE_OUT = [0.16, 1, 0.3, 1]

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/sobre-nosotros', label: 'Sobre nosotros' },
]

export default function Navbar() {
  const { count, openCart } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [term, setTerm] = useState('')
  const inputRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setSearchOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus()
  }, [searchOpen])

  useEffect(() => {
    if (!mobileOpen) return
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [mobileOpen])

  const submitSearch = (event) => {
    event.preventDefault()
    const value = term.trim()
    navigate(value ? `/catalogo?q=${encodeURIComponent(value)}` : '/catalogo')
    setSearchOpen(false)
    setTerm('')
  }

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-5 sm:pt-4">
      <div
        className={`mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 rounded-xl border px-2 py-1.5 transition-all duration-500 sm:h-16 sm:px-3 sm:py-2 ${
          scrolled
            ? 'border-line bg-chalk/95 shadow-soft backdrop-blur-xl'
            : 'border-line/60 bg-chalk/70 backdrop-blur-md'
        }`}
      >
        <Link to="/" aria-label="Lina Home & Deco — inicio" className="shrink-0 pl-1">
          <Logo size="sm" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-full px-3.5 py-2 text-[13px] transition-colors ${
                  isActive
                    ? 'bg-moss text-chalk'
                    : 'font-medium text-muted hover:bg-bone/80 hover:text-ink'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <div className="hidden items-center lg:flex">
            <AnimatePresence initial={false}>
              {searchOpen && (
                <motion.form
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 208, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: EASE_OUT }}
                  onSubmit={submitSearch}
                  className="overflow-hidden"
                >
                  <input
                    ref={inputRef}
                    value={term}
                    onChange={(event) => setTerm(event.target.value)}
                    placeholder="Buscar velas, difusores..."
                    aria-label="Buscar productos"
                    className="mr-1 w-[208px] rounded-full border border-line bg-shell px-4 py-2.5 text-[12px] text-ink placeholder:text-muted/70 focus:border-moss/50 focus:outline-none"
                  />
                </motion.form>
              )}
            </AnimatePresence>
            <button
              type="button"
              onClick={() => setSearchOpen((open) => !open)}
              aria-label="Buscar"
              className="grid h-10 w-10 place-items-center rounded-full text-ink transition hover:bg-bone/80"
            >
              <Search size={17} strokeWidth={1.7} />
            </button>
          </div>

          <button
            type="button"
            onClick={openCart}
            aria-label={`Abrir carrito (${count} productos)`}
            className="relative grid h-10 w-10 place-items-center rounded-full border border-line bg-shell text-ink transition hover:border-ink/20"
          >
            <ShoppingBag size={16} strokeWidth={1.7} />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -right-1 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-amber px-1 text-[10px] font-bold text-ink"
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menú"
            className="grid h-10 w-10 place-items-center rounded-full border border-line bg-shell text-ink transition hover:border-ink/20 md:hidden"
          >
            <Menu size={18} strokeWidth={1.7} />
          </button>
        </div>
      </div>

      {mobileOpen &&
        createPortal(
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
            className="fixed inset-0 z-[60] flex flex-col overflow-y-auto overscroll-contain bg-chalk md:hidden"
          >
            <div className="flex h-[68px] shrink-0 items-center justify-between px-5">
              <Link to="/" onClick={() => setMobileOpen(false)} aria-label="Lina Home & Deco">
                <Logo size="sm" />
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Cerrar menú"
                className="grid h-10 w-10 place-items-center rounded-full border border-line bg-shell text-ink"
              >
                <X size={18} strokeWidth={1.7} />
              </button>
            </div>

            <nav className="mt-4 flex flex-col gap-2.5 px-5">
              {links.map((link, index) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * index + 0.05, duration: 0.4, ease: EASE_OUT }}
                >
                  <Link
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded-lg border border-line/80 bg-shell px-5 py-4 font-serif text-2xl"
                  >
                    {link.label}
                    <span className="h-1.5 w-1.5 rounded-full bg-moss/50" />
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="mt-auto px-5 pb-safe pt-10">
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false)
                  openCart()
                }}
                className="btn-primary w-full"
              >
                <ShoppingBag size={16} strokeWidth={1.8} />
                Ver carrito{count > 0 ? ` (${count})` : ''}
              </button>
            </div>
          </motion.div>,
          document.body,
        )}
    </header>
  )
}
