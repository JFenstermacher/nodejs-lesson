// Let's explain what's going on with filter and map in more detail

const data = [
  {
    name: "Bill",
    age: 25,
  },
  {
    name: "Mandy",
    age: 25,
  },
  {
    name: "Jackie",
    age: 18,
  },
];

// I want only the 25 year olds

const filterOnly25YearOlds = (item) => {
  return item.age === 25;
};

// Filter takes in a function that resolves to either true or false
// If true, then take
// If false, don't
let only25YearOlds = data.filter(filterOnly25YearOlds);

// Rather than defining it as a function, we can inline it

only25YearOlds = data.filter((item) => {
  return item.age === 25;
});

// When the condition is a single line, you can drop the curly braces altogether
only25YearOlds = data.filter((item) => item.age === 25);
