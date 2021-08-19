const courses = [
  {
    title: "Javascript Moderno",
    tecnology: "ES6",
  },
  {
    title: "Reactjs",
    tecnology: "Library Javascript",
  },
  {
    title: "Nodejs",
    tecnology: "Librabry Backend",
  },
  {
    title: "Nextjs",
    tecnology: "Librabry for websites and seo",
  }
]

const resolvers = {
  Query: {
    getCourses: () => courses,
    getTecnology: () => courses
  }
}

module.exports = resolvers;