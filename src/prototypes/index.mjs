import _findAndRemove from './findAndRemove.mjs'
import _distinct from './distinct.mjs'
import _getIndexes from './getIndexes.mjs'
import _limit from './limit.mjs'
import _skip from './skip.mjs'

const implementPrototypes = () => {
  _findAndRemove()
  _distinct()
  _getIndexes()
  _limit()
  _skip()
}

export default implementPrototypes
