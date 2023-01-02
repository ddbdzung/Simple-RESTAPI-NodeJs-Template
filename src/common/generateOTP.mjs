/**
 * Get random number with specific number length
 * @param {number} min
 * @param {number} max
 * @returns random number with specific number length
 */
// eslint-disable-next-line max-len
export const getRandomArbitrary = (min = 100000, max = 999999) => Math.floor(Math.random() * (max - min) + min).toString()
