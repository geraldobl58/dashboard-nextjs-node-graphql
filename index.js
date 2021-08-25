const { ApolloServer } = require('apollo-server');
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' });

const connectDb = require('./config/db');
connectDb();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers['authorization'] || '';

    if (token) {
      try {
        const user = jwt.verify(token.replace('Bearer ', ''), process.env.SECRET);
        console.log(user);
        return {
          user
        }
      }catch (err) {
        console.log(err);
      }
    }
  }
});


server.listen().then(({ url }) => {
  console.log(`Server Running ${url}`)
})