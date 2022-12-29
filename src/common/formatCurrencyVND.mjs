export default function formatCurrencyVND(vnd) {
  if (!vnd) return ''

  return vnd.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })
}
