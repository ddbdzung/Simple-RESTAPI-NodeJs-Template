import fs from 'fs'

/**
 * Convert a path of JSON file to key-value type
 * @param {string} path Path field of a json file
 * @returns {object} key-value model: {key: value}
 */
// eslint-disable-next-line security/detect-non-literal-fs-filename, import/prefer-default-export
export const loadJSON = path => JSON.parse(fs.readFileSync(new URL(path, import.meta.url)))
