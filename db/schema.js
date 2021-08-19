const { gql } = require('apollo-server');

const typeDefs = gql`

  type User {
    id: ID
    name: String
    nickname: String
    email: String
    created: String
  }

  type Token {
    token: String
  }

  type Product {
    id: ID
    name: String
    stock: Int
    price: Float
    created: String
  }

  input UserInput {
    name: String!
    nickname: String!
    email: String!
    password: String!
  }

  input AuthenticateInput {
    email: String!
    password: String!
  }

  input ProductInput {
    name: String!
    stock: Int!
    price: Float!
  }

  type Query {
    getUser(token: String!): User
  }

  type Mutation {
    # Users
    newUser(input: UserInput): User
    authenticateUser(input: AuthenticateInput): Token

    # Products
    newProduct(input: ProductInput): Product
  }
`

module.exports = typeDefs;