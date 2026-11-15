import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Search, ShoppingBag, X } from 'lucide-react'
import Logo from './Logo'
import { useCart } from '../context/CartContext'

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/sobre-nosotros', label: 'Sobre Nosotros' },
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
    const onScroll = () => setScrolled(window.scrollY > 12)
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

  const submitSearch = (event) => {
    event.preventDefault()
    const value = term.trim()
    navigate(value ? `/catalogo?q=${encodeURIComponent(value)}` : '/catalogo')
    setSearchOpen(false)
    setTerm('')
  }

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'border-b border-ink/[0.07] bg-cream/90 backdrop-blur-xl'
          : 'border-b border-transparent bg-cream/70 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:h-[86px]">
        <Link to="/" aria-label="Lina Home & Deco — inicio" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `relative text-[11px] font-medium uppercase tracking-[0.16em] transition-colors ${
                  isActive ? 'text-ink' : 'text-muted hover:text-ink'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-1.5 left-0 h-px w-full bg-clay"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <div className="hidden items-center lg:flex">
            <AnimatePresence initial={false}>
              {searchOpen && (
                <motion.form
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 200, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  onSubmit={submitSearch}
                  className="overflow-hidden"
                >
                  <input
                    ref={inputRef}
                    value={term}
                    onChange={(event) => setTerm(event.target.value)}
                    placeholder="Buscar velas, difusores..."
                    aria-label="Buscar productos"
                    className="w-[200px] rounded-full border border-ink/10 bg-white/70 px-4 py-2 text-xs text-ink placeholder:text-muted/70 focus:border-clay/60 focus:outline-none"
                  />
                </motion.form>
              )}
            </AnimatePresence>
            <button
              type="button"
              onClick={() => setSearchOpen((open) => !open)}
              aria-label="Buscar"
              className="grid h-10 w-10 place-items-center rounded-full text-ink transition hover:bg-beige/70"
            >
              <Search size={18} strokeWidth={1.6} />
            </button>
          </div>

          <button
            type="button"
            onClick={openCart}
            aria-label={`Abrir carrito (${count} productos)`}
            className="relative grid h-10 w-10 place-items-center rounded-full text-ink transition hover:bg-beige/70"
          >
            <ShoppingBag size={18} strokeWidth={1.6} />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-clay px-1 text-[10px] font-semibold text-white"
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
            className="grid h-10 w-10 place-items-center rounded-full text-ink transition hover:bg-beige/70 md:hidden"
          >
            <Menu size={20} strokeWidth={1.6} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-cream md:hidden"
          >
            <div className="flex h-[72px] items-center justify-between px-5">
              <Logo size="sm" />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Cerrar menú"
                className="grid h-10 w-10 place-items-center rounded-full border border-ink/10"
              >
                <X size={18} strokeWidth={1.6} />
              </button>
            </div>

            <motion.nav
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } }}
              className="mt-10 flex flex-col gap-2 px-7"
            >
              {links.map((link) => (
                <motion.div
                  key={link.to}
                  variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}
                >
                  <Link
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className="block border-b border-ink/[0.07] py-4 font-serif text-3xl font-light"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </motion.nav>

            <div className="mt-10 px-7">
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className="text-[10px] uppercase tracking-[0.2em] text-muted"
              >
                Panel de administración
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
