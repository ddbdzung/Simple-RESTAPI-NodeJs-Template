/* eslint-disable */
function skip(c) {
  return this.filter((x, i) => {
    if (i > (c - 1)) { return true }
  })
}

const _skip = () => {
  Array.prototype.skip = skip;
}

export default _skip

// Input:
/*
const arr = [
 { id: 1, name: "king" },
 { id: 2, name: "master" },
 { id: 3, name: "lisa" },
 { id: 4, name: "ion" },
 { id: 5, name: "jim" },
 { id: 6, name: "gowtham" },
 { id: 1, name: "jam" },
 { id: 1, name: "lol" },
 { id: 2, name: "kwick" },
 { id: 3, name: "april" },
 { id: 7, name: "sss" },
 { id: 8, name: "brace" },
 { id: 8, name: "peiter" },
 { id: 5, name: "hey" },
 { id: 6, name: "mkl" },
 { id: 9, name: "melast" },
 { id: 9, name: "imlast" },
 { id: 10, name: "glow" }
]
console.log(JSON.stringify(arr.skip(2))) ;//bỏ qua 2 records đầu tiên
*/
// Output:
/*
[
    {"id":3,"name":"lisa"},
    {"id":4,"name":"ion"},
    {"id":5,"name":"jim"},
    {"id":6,"name":"gowtham"},
    {"id":1,"name":"jam"},
    {"id":1,"name":"lol"},
    {"id":2,"name":"kwick"},
    {"id":3,"name":"april"},
    {"id":7,"name":"sss"},
    {"id":8,"name":"brace"},
    {"id":8,"name":"peiter"},
    {"id":5,"name":"hey"},
    {"id":6,"name":"mkl"},
    {"id":9,"name":"melast"},
    {"id":9,"name":"imlast"},
    {"id":10,"name":"glow"}
]
*/
