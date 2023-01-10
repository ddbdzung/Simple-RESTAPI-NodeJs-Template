/* eslint-disable */
const _findAndRemove = () => {
  Array.prototype.findAndRemove = function (value, key = null) {
    const index = this.findIndex(obj => ((obj[key]) ? obj[key] === value : obj === value));
    return index >= 0 ? [
      ...this.slice(0, index),
      ...this.slice(index + 1),
    ] : this;
  }
}

export default _findAndRemove

// Input:
/*
const list = [
    {id: 1,"name":"anonystick.com"},
    {id: 2,"name":"medium.com"},
    {id: 3,"name":"facebook.com"}
]
console.log(list.findAndRemove(2, "id")); //remove id = 2
*/
// Output:
/*
[{id: 1, name: "anonystick.com"}, {id: 3, name: "facebook.com"}]
*/
