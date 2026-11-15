const formatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})

/** 18400 → "$ 18.400" */
export function formatARS(value) {
  const amount = Number(value)
  if (Number.isNaN(amount)) return '$ 0'
  return formatter.format(amount).replace(/\s/g, ' ')
}

export function formatDate(value) {
  if (!value) return ''
  return new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: 'short', year: 'numeric' }).format(
    new Date(value),
  )
}
