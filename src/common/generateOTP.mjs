// eslint-disable-next-line import/prefer-default-export, max-len
export const getRandomArbitrary = (min = 100000, max = 999999) => Math.floor(Math.random() * (max - min) + min).toString()
