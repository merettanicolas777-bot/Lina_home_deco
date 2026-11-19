import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import Logo from '../components/Logo'
import InstallApp, { usePanelManifest } from '../components/InstallApp'
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

  usePanelManifest(true)

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
    <div className="flex min-h-screen flex-col bg-chalk">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Link to="/" aria-label="Volver al inicio">
          <Logo size="sm" />
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-line bg-shell/60 px-3.5 py-2 text-[12px] font-medium text-muted transition hover:text-ink"
        >
          <ArrowLeft size={13} strokeWidth={2} />
          Volver a la tienda
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 pb-14">
        <div className="w-full max-w-md rounded-2xl border border-line/80 bg-shell p-5 shadow-card sm:p-8">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-bone text-moss">
            <ShieldCheck size={19} strokeWidth={1.6} />
          </span>

          <h1 className="mt-4 text-[1.75rem] leading-tight sm:mt-5 sm:text-[1.9rem]">
            Panel de administración
          </h1>
          <p className="mt-2 text-[13.5px] text-muted">
            Ingresá con la cuenta de la tienda para gestionar productos.
          </p>

          {!isSupabaseConfigured && (
            <p className="mt-5 rounded-lg bg-bone/70 px-4 py-3 text-[12px] leading-relaxed text-muted">
              Modo demo activo: todavía no hay credenciales de Supabase. Podés ingresar con
              cualquier email y contraseña para explorar el panel.
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
                  {showPassword ? (
                    <EyeOff size={16} strokeWidth={1.8} />
                  ) : (
                    <Eye size={16} strokeWidth={1.8} />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-[12px] text-red-700">
                {error}
              </p>
            )}

            <button type="submit" disabled={submitting} className="btn-primary w-full py-3.5">
              {submitting && <Spinner className="h-3.5 w-3.5" />}
              {submitting ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          <p className="mt-5 text-center text-[12px] leading-relaxed text-muted">
            Acceso exclusivo para la administración de Lina Home &amp; Deco.
          </p>

          <div className="mt-5 border-t border-line pt-4">
            <p className="text-[12px] leading-relaxed text-muted">
              ¿Gestionás la tienda desde el celular? Instalá el panel como app y abrilo desde el
              ícono, en pantalla completa.
            </p>
            <div className="mt-3">
              <InstallApp />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
