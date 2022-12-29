/**
 * Return sanitized object document returned from mongoose
 * @param {object} doc
 * @param {boolean} underscoreId true: {object} _id | false: {string} id
 * @returns {object} sanitized document
 */
const sanitize = (doc, underscoreId = true) => {
  const { _doc } = doc
  const {
    password,
    createdAt,
    updatedAt,
    __v,
    _id,
    ...sanitizedDocument
  } = _doc

  return !underscoreId
    ? { id: _id.toString(), ...sanitizedDocument }
    : { _id: _id.toString(), ...sanitizedDocument }
}

export default sanitize
