const { gql } = require('apollo-server');

const typeDefs = gql`
  type Course {
    title: String
  }

  type Tecnology {
    tecnology: String
  }

  type Query {
    getCourses: [Course]
    getTecnology: [Tecnology]
  }
`

module.exports = typeDefs;