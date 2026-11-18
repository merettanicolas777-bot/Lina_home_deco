import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Download, Smartphone, X } from 'lucide-react'

/**
 * Mientras se está en /login o /admin, el navegador ofrece instalar
 * "Lina Panel" (abre directo el panel) en lugar de la tienda.
 */
export function usePanelManifest(active = true) {
  useEffect(() => {
    if (!active) return
    const link = document.querySelector('link[rel="manifest"]')
    if (!link) return

    const original = link.getAttribute('href')
    link.setAttribute('href', '/panel.webmanifest')

    return () => {
      if (original) link.setAttribute('href', original)
    }
  }, [active])
}

export default function InstallApp({ compact = false }) {
  const [promptEvent, setPromptEvent] = useState(null)
  const [installed, setInstalled] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)

  useEffect(() => {
    const onPrompt = (event) => {
      event.preventDefault()
      setPromptEvent(event)
    }
    const onInstalled = () => {
      setInstalled(true)
      setPromptEvent(null)
    }

    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)

    const standalone =
      window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone
    if (standalone) setInstalled(true)

    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent)

  const handleInstall = async () => {
    if (promptEvent) {
      promptEvent.prompt()
      await promptEvent.userChoice
      setPromptEvent(null)
      return
    }
    setHelpOpen(true)
  }

  if (installed) {
    return (
      <p className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-clay-dark">
        <Check size={12} strokeWidth={2} />
        App instalada
      </p>
    )
  }

  return (
    <div className={compact ? 'inline-flex' : 'w-full'}>
      <button
        type="button"
        onClick={handleInstall}
        className={
          compact
            ? 'inline-flex items-center gap-1.5 rounded-full border border-ink/10 px-3.5 py-2 text-[10px] uppercase tracking-[0.14em] text-ink transition hover:border-ink/30'
            : 'btn-ghost w-full'
        }
      >
        <Download size={13} strokeWidth={1.8} />
        Instalar app
      </button>

      <AnimatePresence>
        {helpOpen && (
          <div className="fixed inset-0 z-[70] grid place-items-center px-5">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setHelpOpen(false)}
              className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="relative w-full max-w-sm rounded-[22px] bg-cream p-6 shadow-2xl"
            >
              <div className="flex items-start justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-sand text-clay">
                  <Smartphone size={18} strokeWidth={1.5} />
                </span>
                <button
                  type="button"
                  onClick={() => setHelpOpen(false)}
                  aria-label="Cerrar"
                  className="text-muted transition hover:text-ink"
                >
                  <X size={17} strokeWidth={1.6} />
                </button>
              </div>

              <h2 className="mt-5 font-serif text-2xl">Instalar Lina Panel</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {isIos
                  ? 'En iPhone o iPad, tocá el botón Compartir en Safari y elegí “Agregar a pantalla de inicio”.'
                  : 'Abrí el menú del navegador (los tres puntos) y elegí “Instalar aplicación” o “Agregar a pantalla principal”.'}
              </p>
              <p className="mt-3 text-[11px] leading-relaxed text-muted/80">
                La app se abre en pantalla completa y guarda el panel de administración como acceso
                directo. Siempre pide tu cuenta autorizada.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
