const { ApolloServer } = require('apollo-server');
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');

const connectDb = require('./config/db');
connectDb();

const server = new ApolloServer({
  typeDefs,
  resolvers
});


server.listen().then(({ url }) => {
  console.log(`Server Running ${url}`)
})