const axios = require("axios"); // Installed from npm and installed
const fs = require("fs"); // Standard library import

// Create an instance with default settings
//    baseURL: This will prefixed before any path
//    auth: Basic Auth username / password
const instance = axios.create({
  baseURL: "https://datausa.io/api",
  // This API doesn't require auth, so it's commented out
  // auth: {
  //   username: 'someuser',
  //   password: 'somepassword'
  // }
});

// An asynchronous function
// The async key word essentially is just syntax sugar for wrapping something in a Promise
// Promises are javascript's implementation of futures
// future - some work will be done and eventually you'll receive a response
//
// Don't get bogged down with terminology, just giving some context
// The important part is that it allows you to use the 'await' keyword
const getStateData = async () => {
  const params = {
    drilldowns: "State",
    measures: "Population",
  };

  // We use the instance specified above
  // The GET request takes in two parameters:
  //    url: The URL will be prefixed to the baseURL above
  //    requestConfig: Object that specifies a bunch of values
  //
  // For the full request config, checkout https://kapeli.com/cheat_sheets/Axios.docset/Contents/Resources/Documents/index
  //
  // The following will make a request to the following url
  //    https://datausa.io/api/data?drilldowns=Nation&measures=Population
  //    <      baseURL       ><url><              params                >

  // Notice the 'await' use
  // This means we're going to wait for the response, as opposed to moving on to the next line
  const response = await instance.get("data", {
    params,
  });

  // The response object above contains a bunch of other response related fields
  // Generally we only really care about the data
  // The JSON response from this endpoint is written to outputs/raw.json
  return response.data;
};

// Take in a javascript object, and convert it to a string, and then write to a file
const writeDataToFile = async (path, data) => {
  // Convert the javascript object into a string
  // The JSON library is available globally
  // Ignore the 'null', and '2', those are just for pretty printing
  const asString = JSON.stringify(data, null, 2);

  // fs is a standard library
  // promises is the Promise variant of the API
  await fs.promises.writeFile(path, asString);
};

// We'll take the raw data, and filter a couple of different ways
const filterRawResponse = (response) => {
  // Lets get only the Virginia state data back
  // Use outputs/raw.json for reference

  // We're first going to define an array that will be were we push Virginia data to
  let onlyVirginia = [];

  // Within the raw json, we see that it has the following structure
  // {
  //   data: [...],
  //   sources: {}
  // }
  // We want to iterate over the data entries, so we first need to select that key from the object
  const stateData = response.data;

  // There are multiple ways to do a for-loop, the below is the most idiomatic approach
  // For each item in the array, assign that item to 'data' and let me do stuff with it

  // On the first run of this loop, data is equal to
  // {
  //   "ID State": "04000US01",
  //   "State": "Alabama",
  //   "ID Year": 2019,
  //   "Year": "2019",
  //   "Population": 4903185,
  //   "Slug State": "alabama"
  // }

  // On the second iteration, the data is equal to
  // {
  //   "ID State": "04000US02",
  //   "State": "Alaska",
  //   "ID Year": 2019,
  //   "Year": "2019",
  //   "Population": 731545,
  //   "Slug State": "alaska"
  // }

  // Etc...
  for (const data of stateData) {
    // We're looking for only Virginia data
    if (data.State === "Virginia") {
      // Arrays allow you to append to the end of the array via push
      onlyVirginia.push(data);
    }
  }

  // onlyVirginia now contains only records that had a 'State' key with a value of 'Virginia'

  // The following code is equivalent to the above, but the way it's more typically done
  // stateData is an array
  // arrays have a couple of very common helper methods, map and filter
  //   filter: allows you to iterate over the array, and select only those that meet the condition
  //
  // The condition comes in the form of a function
  // (data) => data.State === 'Virginia'
  // You'll notice this signature looks the same as the signatures for the functions above
  // (data)                     - the inputs
  //   =>                       - notation for creating a function
  // data.State === "Virginia"  - boolean expression
  // Go to the array-method-help.js for more explanation
  onlyVirginia = stateData.filter((data) => data.State === "Virginia");

  return onlyVirginia;
};

// We'll remap the data to a nested structure to show how to parse it
// We'll make States, to all their state data entries
const mapToNested = (response) => {
  const stateToYearDataObject = {};

  // As the filter example, we'll get the data key
  const stateData = response.data;

  for (const data of stateData) {
    // Assign the entries state to it's own variable
    const state = data.State;

    // Access the entries that have already been assigned, if no entries exist yet, make it an empty array
    let currentStateEntries = stateToYearDataObject[state] || [];

    // Append this entry to the array for that state array
    currentStateEntries.push(data);

    // Assign the array back to the object
    // If the array didn't exist, then it needs reassignment
    // If it did exist, this will do nothing but maintain the reference
    stateToYearDataObject[state] = currentStateEntries;
  }

  // Data is written to outputs/nested-state-data.json
  return stateToYearDataObject;
};

const iteratingOverNestedData = (nestedData) => {
  // To iterate over the keys and values of an object, you have to use Object.entries()
  // Object.entries() returns an array of arrays in the following form
  // [[key1, value1], [key2, value2], ... [key_n, value_n]]

  // The commented version below is the idiomatic way to loop over key values in a dictionary
  // Destructuring allows you to take some input and assign it's structure to some set of variables
  // So here, the 2-length array of [key_n, value_n] is being assigned to the variables 'key' and 'value'
  // The uncommented version is equivalent, and probably more novice friendly
  // For more info on destructuring, see destructing-help.js
  //
  // for (const [key, value] of Object.entries(nestedData)) {
  for (const entry of Object.entries(nestedData)) {
    const key = entry[0]; // This is the name of the state
    const value = entry[1]; // This is the value

    // We are now iterating over all the entries for a given state
    for (const item of value) {
      // This is interpolation
      // The `` allows you to inject values into the string
      // The following would print a string like the following:
      // Alabama - 2019 - 4903185
      const logString = `${key} - ${item.Year} - ${item.Population}`;
      console.log(logString);
    }
  }
};

const main = async () => {
  // Get state data from API and write to file
  const data = await getStateData();
  await writeDataToFile("outputs/raw.json", data);

  // Get the virginia data and write it to file
  const onlyVirginia = filterRawResponse(data);
  await writeDataToFile("outputs/filtered-virginia.json", onlyVirginia);

  // Remap data to nested
  const nestedStateData = mapToNested(data);
  await writeDataToFile("outputs/nested-state-data.json", nestedStateData);

  iteratingOverNestedData(nestedStateData);
};

main();
