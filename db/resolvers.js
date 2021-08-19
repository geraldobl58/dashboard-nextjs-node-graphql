const User = require('../models/User');
const Product = require('../models/Product');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config({ path: 'variables.env' });

const createToken = (user, secret, expiresIn) => {
  const { id, email, name, nickname } = user;

  return jwt.sign({ id, email, name, nickname }, secret, { expiresIn });
}

const resolvers = {
  Query: {
    getUser: async (_, { token }) => {
      const userId = await jwt.verify(token, process.env.SECRET);

      return userId;
    }
  },
  Mutation: {
    newUser: async (_, { input }) => {
      const { email, password } = input;

      const userExists = await User.findOne({ email });
      
      if (userExists) {
        throw new Error('Whoops: User already registered')
      }

      const salt = await bcryptjs.genSalt(10);
      input.password = await bcryptjs.hash(password, salt);

      try {
        const user = new User(input);
        
        user.save();

        return user;
      }catch (err) {
        console.log(err);
      }
    },

    authenticateUser: async (_, { input }) => {
      const { email, password } = input;

      const userExists = await User.findOne({ email });

      if (!userExists) {
        throw new Error('Whoops: User does not exist')
      }

      const passwordCorrectly = await bcryptjs.compare(password, userExists.password);
    
      if (!passwordCorrectly) {
        throw new Error('Whoops: Incorrect login or password');
      }

      return {
        token: createToken(userExists, process.env.SECRET, '24h')
      }
    }
  }
}

module.exports = resolvers;
