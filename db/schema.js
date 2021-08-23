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

  type Client {
    id: ID
    name: String
    nickname: String
    company: String
    email: String
    phone: String
    seller: ID
  }

  type Order {
    id: ID
    order: [OrderGroup]
    total: Float
    client: ID
    seller: ID
    close: String
    status: StatusOrder
  }

  type OrderGroup {
    id: ID
    quantity: Int
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

  input ClientInput {
    name: String!
    nickname: String!
    company: String!
    email: String!
    phone: String!
  }

  input OrderProductInput {
    id: ID
    quantity: Int
  }

  input OrderInput {
    order: [OrderProductInput]
    total: Float!
    client: ID!
    status: StatusOrder
  }

  enum StatusOrder {
    PENDENTE
    COMPLETO
    CANCELADO
  }

  type Query {
    # Users
    getUser(token: String!): User

    #Products
    getProducts: [Product]
    getProduct(id: ID!): Product

    # Clients
    getClients: [Client]
    getClientsSeller: [Client]
    getClient(id: ID!): Client

    # Orders
    getOrders: [Order]
  }

  type Mutation {
    # Users
    newUser(input: UserInput): User
    authenticateUser(input: AuthenticateInput): Token

    # Products
    newProduct(input: ProductInput): Product
    updateProduct(id: ID!, input: ProductInput): Product
    deleteProduct(id: ID!): String

    # Clients
    newClient(input: ClientInput): Client
    updateClient(id: ID!, input: ClientInput): Client
    deleteClient(id: ID!): String

    # Orders
    newOrder(input: OrderInput): Order
  }
`

module.exports = typeDefs;