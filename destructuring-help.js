const someObjData = {
  a: 1,
  b: [1, 2],
  c: [{ d: 1 }, { d: 2 }],
};

const someArrData = ["a", "b", "c"];

// Destructuring allows you to take a structure and unpack it into other variables

const { a, b, c } = someObjData;

// Rather than indexing into the object, you can access them at toplevel once you destructure
// a = 1
// b = [1, 2]
// c = [{ d: 1 }, { d: 2 }]

// a === someObjData.a

// For arrays, you can reassign the indexes to variables outside the array
const [index0, index1, index2] = someArrData;

// index0 = someArrData[0];
// index1 = someArrData[1];
// index2 = someArrData[2];

// Where this is most useful is when iterating over objects
const entries = Object.entries(someObjData);

// entries = [['a', 1], ['b', [1, 2]], ['c', [{ d: 1 }, { d: 2 }]]]

for (const [key, value] of entries) {
  console.log(key);
  console.log(value);
}

// The above would output
// a
// 1
// b
// [1,2]
// c
// [{ d: 1 }, { d: 2 }]
