const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
  type Course {
    title: String
    tecnology: String
  }

  type Query {
    getCourses: [Course]
  }
`

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
    getCourses: () => courses
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
});


server.listen().then(({ url }) => {
  console.log(`Server Running ${url}`)
})