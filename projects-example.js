// This will be our example project data
const projects = [
  {
    id: 1,
    name: "Project One",
    category: {
      id: 1,
      name: "First Category"
    }
    users: [
      {
        id: 1,
        name: "Abe"
      },
      {
        id: 2,
        name: "George"
      }
    ]
  },
  {
    id: 2,
    name: "Project Two",
    category: {
      id: 2,
      name: "Second Category"
    },
    users: [
      {
        id: 1,
        name: "Abe"
      }
    ]
  },
  {
    id: 3,
    name: "Project Three",
    category: {
      id: 1,
      name: "First Category"
    }
    users: [
      {
        id: 1,
        name: "Abe"
      },
      {
        id: 3,
        name: "Hillary"
      }
    ]
  },
]

// The function's output will be the following
//  [
//    {
//      id: 1,
//      name: "Project One",
//      category: {
//        id: 1,
//        name: "First Category"
//      }
//      users: [
//        {
//          id: 1,
//          name: "Abe"
//        },
//        {
//          id: 2,
//          name: "George"
//        }
//      ]
//    },
//    {
//      id: 3,
//      name: "Project Three",
//      category: {
//        id: 1,
//        name: "First Category"
//      }
//      users: [
//        {
//          id: 1,
//          name: "Abe"
//        },
//        {
//          id: 3,
//          name: "Hillary"
//        }
//      ]
//    },
//  ]
const retrieveCategoryOneItems = (projects) => {
  const filteredProjects = [];

  // To get the data[X].category.id
  // You have to iterate over the array, on each iteration you can then access those nested attributes on 
  for (const project of projects) {
    const category = project.category; // { id: 1, name: "First Category" }

    if (category.id === 1) {
      filteredProjects.push(project);
    }

  }

  return filteredProjects;
}

// Pull out IDs from projects array
const getProjectIds = (projects) => {
  const projectIds = [];

  for (const project of projects) {
    projectIds.push(project.id);
  }
  
  return projectIds;
}

// More idiomatic approach using array function
const getProjectIds2 = (projects) => {
  // Using map function
  const projectIds = projects.map((project) => project.id);

  return projectIds;
}

// Even more idiomatic
const getProjectIds3 = (projects) => {
  // Using map function + destructuring
  const projectIds = projects.map(({ id }) => id);

  return projectIds;
}

// The output will be the following
// {
//    "Project One": 1,
//    "Project Two": 2,
//    "Project Three": 3
// }
const remapToProjectToId = (projects) => {
  // Instantiate an object
  const projectIdMap = {};

  // Iterate over the projects array
  for (const project of projects) {
    const id = project.id;
    const name = project.name;

    // Assign to object
    projectIdMap[name] = id;
  }

  return projectIdMap;
}

// The output will be the following
// {
//    "Project One": ["Abe", "George"],
//    "Project Two": ["Abe"],
//    "Project Three": ["Abe", "Hillary"]
// }
const remapUserMap = (projects) => {
  // Instantiate object
  const projectToUserMap = {};

  for (const project of projects) {
    const projectName = project.name;
    const userArray = project.users;

    // Instantiate array to house usernames
    const usernames = [];
    // Iterate over user objects
    for (const user of userArray) {
      // Push each name of each user object
      usernames.push(user.name);
    }
    
    // Assign project name to usernames array
    projectToUserMap[projectName] = usernames;
  }

  return projectToUserMap;
}

// More nodejs idiomatic approach
// Use array functions to simplify code
// Will have same output as above
const remapUserMap2 = (projects) => {
  const projectToUserMap = {};

  // User destructuring to get fields you want from object
  for (const { name, users } of projects) {
    // Use .map() to create a new array with only the name attribute extracted
    projectToUserMap[name] = users.map((user) => user.name);
  }

  return projectToUserMap;
}
