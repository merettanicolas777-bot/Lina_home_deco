import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import Logo from '../components/Logo'
import { Spinner } from '../components/Skeleton'
import { useAuth } from '../context/AuthContext'
import { isSupabaseConfigured } from '../lib/supabase'

export default function Login() {
  const { signIn, isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const redirectTo = location.state?.from ?? '/admin'

  useEffect(() => {
    if (!loading && isAuthenticated) navigate(redirectTo, { replace: true })
  }, [loading, isAuthenticated, navigate, redirectTo])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('Ingresá tu email y contraseña.')
      return
    }

    setSubmitting(true)
    const { error: authError } = await signIn(email.trim(), password)
    setSubmitting(false)

    if (authError) {
      setError(
        authError === 'Invalid login credentials'
          ? 'Email o contraseña incorrectos.'
          : authError,
      )
      return
    }

    navigate(redirectTo, { replace: true })
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-6 sm:px-8">
        <Link to="/" aria-label="Volver al inicio">
          <Logo size="sm" />
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted transition hover:text-ink"
        >
          <ArrowLeft size={13} strokeWidth={1.8} />
          Volver a la tienda
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-center px-5 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md rounded-[24px] border border-ink/[0.07] bg-white/70 p-7 shadow-soft sm:p-9"
        >
          <span className="grid h-11 w-11 place-items-center rounded-full bg-sand text-clay">
            <ShieldCheck size={19} strokeWidth={1.4} />
          </span>

          <h1 className="mt-6 font-serif text-3xl font-light">Panel de administración</h1>
          <p className="mt-2 text-sm text-muted">
            Ingresá con la cuenta de la tienda para gestionar productos.
          </p>

          {!isSupabaseConfigured && (
            <p className="mt-5 rounded-xl bg-sand px-4 py-3 text-[11px] leading-relaxed text-muted">
              Modo demo activo: todavía no hay credenciales de Supabase. Podés ingresar con
              cualquier email y contraseña para explorar el panel.
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <label className="label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="hola@linahomedeco.com"
                className="field"
              />
            </div>

            <div>
              <label className="label" htmlFor="password">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="field pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition hover:text-ink"
                >
                  {showPassword ? <EyeOff size={16} strokeWidth={1.6} /> : <Eye size={16} strokeWidth={1.6} />}
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-xs text-red-700">
                {error}
              </p>
            )}

            <button type="submit" disabled={submitting} className="btn-primary w-full py-4">
              {submitting && <Spinner className="h-3.5 w-3.5" />}
              {submitting ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          <p className="mt-6 text-center text-[11px] leading-relaxed text-muted/80">
            Acceso exclusivo para la administración de Lina Home &amp; Deco.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
