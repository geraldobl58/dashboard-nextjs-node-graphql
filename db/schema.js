const { gql } = require('apollo-server');

const typeDefs = gql`
  type Course {
    title: String
  }

  type Tecnology {
    tecnology: String
  }

  input CourseInput {
    tecnology: String
  }

  type Query {
    getCourses(input: CourseInput!): [Course]
    getTecnology: [Tecnology]
  }
`

module.exports = typeDefs;