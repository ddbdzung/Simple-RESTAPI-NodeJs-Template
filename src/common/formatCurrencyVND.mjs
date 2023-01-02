/**
 * Format VND money
 * @param {string} vnd money
 * @returns formatted vnd: 10000 => 10.000 VND
 */
export default function formatCurrencyVND(vnd) {
  if (!vnd) return ''

  return vnd.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })
}
