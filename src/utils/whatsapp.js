import { formatARS } from './format'

export const DELIVERY_OPTIONS = [
  { value: 'retiro', label: 'Retiro en local' },
  { value: 'envio', label: 'Envío a domicilio' },
]

export function getWhatsAppNumber() {
  return String(import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/\D/g, '')
}

export function buildOrderMessage({ items, subtotal, customerName, delivery }) {
  const deliveryLabel =
    DELIVERY_OPTIONS.find((option) => option.value === delivery)?.label ?? 'A coordinar'

  const lines = [
    '¡Hola Lina Home & Deco! 🤍',
    'Quiero hacer el siguiente pedido:',
    '',
    ...items.map(
      (item) =>
        `• ${item.quantity} x ${item.name} — ${formatARS(item.price)} c/u (${formatARS(
          item.price * item.quantity,
        )})`,
    ),
    '',
    `Subtotal: ${formatARS(subtotal)}`,
    '',
    `Nombre: ${customerName}`,
    `Entrega: ${deliveryLabel}`,
    '',
    '¡Gracias!',
  ]

  return lines.join('\n')
}

export function buildWhatsAppLink({ items, subtotal, customerName, delivery }) {
  const number = getWhatsAppNumber()
  const text = encodeURIComponent(buildOrderMessage({ items, subtotal, customerName, delivery }))
  return `https://wa.me/${number}?text=${text}`
}
