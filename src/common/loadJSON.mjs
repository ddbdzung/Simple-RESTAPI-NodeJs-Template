import fs from 'fs'
// eslint-disable-next-line security/detect-non-literal-fs-filename, import/prefer-default-export
export const loadJSON = path => JSON.parse(fs.readFileSync(new URL(path, import.meta.url)))
