import { Link } from 'react-router-dom'
import { Instagram, Mail, MessageCircle } from 'lucide-react'
import Logo from './Logo'
import { getWhatsAppNumber } from '../utils/whatsapp'

export default function Footer() {
  const number = getWhatsAppNumber()

  return (
    <footer className="mt-24 border-t border-ink/[0.07] bg-sand">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo size="md" />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted">
            Velas de soja, difusores y brumas elegidas una por una para que tu casa huela a calma.
            Hecho a mano, en pequeños lotes.
          </p>
          <div className="mt-6 flex gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="grid h-9 w-9 place-items-center rounded-full border border-ink/10 text-ink/70 transition hover:border-clay hover:text-clay"
            >
              <Instagram size={16} strokeWidth={1.6} />
            </a>
            <a
              href={`https://wa.me/${number}`}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="grid h-9 w-9 place-items-center rounded-full border border-ink/10 text-ink/70 transition hover:border-clay hover:text-clay"
            >
              <MessageCircle size={16} strokeWidth={1.6} />
            </a>
            <a
              href="mailto:hola@linahomedeco.com"
              aria-label="Email"
              className="grid h-9 w-9 place-items-center rounded-full border border-ink/10 text-ink/70 transition hover:border-clay hover:text-clay"
            >
              <Mail size={16} strokeWidth={1.6} />
            </a>
          </div>
        </div>

        <div>
          <h3 className="eyebrow">Tienda</h3>
          <ul className="mt-5 space-y-3 text-sm text-muted">
            <li>
              <Link to="/catalogo" className="transition hover:text-ink">
                Catálogo completo
              </Link>
            </li>
            <li>
              <Link to="/catalogo?categoria=Velas" className="transition hover:text-ink">
                Velas de soja
              </Link>
            </li>
            <li>
              <Link
                to="/catalogo?categoria=Difusores%20de%20Varillas"
                className="transition hover:text-ink"
              >
                Difusores de varillas
              </Link>
            </li>
            <li>
              <Link to="/catalogo?categoria=Home%20Sprays" className="transition hover:text-ink">
                Home sprays
              </Link>
            </li>
            <li>
              <Link to="/catalogo?categoria=Body%20Splash" className="transition hover:text-ink">
                Body splash
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="eyebrow">Ayuda</h3>
          <ul className="mt-5 space-y-3 text-sm text-muted">
            <li>
              <Link to="/sobre-nosotros" className="transition hover:text-ink">
                Sobre nosotros
              </Link>
            </li>
            <li>
              <a
                href={`https://wa.me/${number}`}
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-ink"
              >
                Consultas por WhatsApp
              </a>
            </li>
            <li>
              <Link to="/admin" className="transition hover:text-ink">
                Acceso administración
              </Link>
            </li>
          </ul>
          <p className="mt-6 text-xs leading-relaxed text-muted/80">
            Envíos a todo el país por Correo Argentino. Retiro sin cargo en el local.
          </p>
        </div>
      </div>

      <div className="border-t border-ink/[0.07]">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-[11px] text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© {new Date().getFullYear()} Lina Home &amp; Deco. Todos los derechos reservados.</p>
          <p className="tracking-[0.14em] uppercase">Buenos Aires, Argentina</p>
        </div>
      </div>
    </footer>
  )
}
