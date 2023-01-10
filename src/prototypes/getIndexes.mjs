/* eslint-disable */
const _getIndexes = () => {
  Array.prototype.getIndexes = function (test) {
    if (typeof (test) === 'function') {
      return this.reduce((indices, element, index) => {
        if (test(element)) indices.push(index)
        return indices
      }, [])
    }
    return this.reduce((indices, element, index) => {
      if (element === test) indices.push(index)
      return indices
    }, [])
  }
}

export default _getIndexes

// Input:
/*
const findIndex = [1,2,3,4,3,6,8,3]
console.log(findIndex.getIndexes(3))
*/
// Output:
/*
[2, 4, 7]
*/
