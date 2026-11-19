import { Link } from 'react-router-dom'
import { Instagram, Mail, MessageCircle } from 'lucide-react'
import { getWhatsAppNumber } from '../utils/whatsapp'

export default function Footer() {
  const number = getWhatsAppNumber()

  return (
    <footer className="mt-16 px-3 pb-3 sm:mt-20 sm:px-5 sm:pb-5">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl bg-ink px-5 pb-5 pt-9 text-chalk sm:px-10 sm:pb-6 sm:pt-14">
        <div className="grid gap-8 sm:gap-10 md:grid-cols-[1.5fr_1fr_1fr] md:gap-12">
          <div>
            <p className="font-serif text-3xl leading-none">Lina</p>
            <p className="mt-1.5 text-[11px] font-medium tracking-brand text-chalk/60">
              HOME &amp; DECO
            </p>
            <p className="mt-5 max-w-xs text-[13px] leading-relaxed text-chalk/70">
              Velas de soja, difusores y brumas elegidas una por una para que tu casa huela a calma.
              Hecho a mano, en pequeños lotes.
            </p>
            <div className="mt-6 flex gap-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="grid h-10 w-10 place-items-center rounded-full border border-chalk/20 text-chalk/80 transition hover:border-chalk/50 hover:text-chalk"
              >
                <Instagram size={15} strokeWidth={1.7} />
              </a>
              <a
                href={`https://wa.me/${number}`}
                target="_blank"
                rel="noreferrer"
                aria-label="Escribir por WhatsApp"
                className="grid h-10 w-10 place-items-center rounded-full border border-chalk/20 text-chalk/80 transition hover:border-chalk/50 hover:text-chalk"
              >
                <MessageCircle size={15} strokeWidth={1.7} />
              </a>
              <a
                href="mailto:hola@linahomedeco.com"
                aria-label="Email"
                className="grid h-10 w-10 place-items-center rounded-full border border-chalk/20 text-chalk/80 transition hover:border-chalk/50 hover:text-chalk"
              >
                <Mail size={15} strokeWidth={1.7} />
              </a>
            </div>
          </div>

          <div>
            <h2 className="text-[12px] font-semibold text-chalk/60">Tienda</h2>
            <ul className="mt-4 space-y-2.5 text-[13px] text-chalk/75">
              <li>
                <Link to="/catalogo" className="transition hover:text-chalk">
                  Catálogo completo
                </Link>
              </li>
              <li>
                <Link to="/catalogo?categoria=Velas" className="transition hover:text-chalk">
                  Velas de soja
                </Link>
              </li>
              <li>
                <Link
                  to="/catalogo?categoria=Difusores%20de%20Varillas"
                  className="transition hover:text-chalk"
                >
                  Difusores de varillas
                </Link>
              </li>
              <li>
                <Link
                  to="/catalogo?categoria=Home%20Sprays"
                  className="transition hover:text-chalk"
                >
                  Home sprays
                </Link>
              </li>
              <li>
                <Link to="/catalogo?categoria=Body%20Splash" className="transition hover:text-chalk">
                  Body splash
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-[12px] font-semibold text-chalk/60">Ayuda</h2>
            <ul className="mt-4 space-y-2.5 text-[13px] text-chalk/75">
              <li>
                <Link to="/sobre-nosotros" className="transition hover:text-chalk">
                  Sobre nosotros
                </Link>
              </li>
              <li>
                <a
                  href={`https://wa.me/${number}`}
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-chalk"
                >
                  Consultas por WhatsApp
                </a>
              </li>
            </ul>
            <p className="mt-5 text-[12px] leading-relaxed text-chalk/60">
              Envíos a todo el país por Correo Argentino. Retiro sin cargo en el local.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-chalk/15 pt-5 text-[11px] text-chalk/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Lina Home &amp; Deco. Todos los derechos reservados.</p>
          <p>Buenos Aires, Argentina</p>
        </div>
      </div>
    </footer>
  )
}
