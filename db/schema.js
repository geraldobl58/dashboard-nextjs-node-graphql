const { gql } = require('apollo-server');

const typeDefs = gql`

  type User {
    id: ID
    name: String
    nickname: String
    email: String
    created: String
  }

  type Query {
    getCourses: String
  }

  type Mutation {
    newUser: String
  }
`

module.exports = typeDefs;