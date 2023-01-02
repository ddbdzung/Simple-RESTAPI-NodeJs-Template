/**
 * Convert from date's string to Date type
 * @param {string} strDate string type of date
 * @returns {object<Date>} Date converted from strDate
 */
// eslint-disable-next-line import/prefer-default-export
export const stringToDate = strDate => new Date(+strDate)
