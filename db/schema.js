const { gql } = require('apollo-server');

const typeDefs = gql`

  type User {
    id: ID
    name: String
    nickname: String
    email: String
    created: String
  }

  input UserInput {
    name: String!
    nickname: String!
    email: String!
    password: String!
  }

  type Query {
    getCourses: String
  }

  type Mutation {
    newUser(input: UserInput): String
  }
`

module.exports = typeDefs;