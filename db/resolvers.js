const User = require('../models/User');
const Product = require('../models/Product');
const Client = require('../models/Client');
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
    },
    getProducts: async () => {
      try {
        const products = await Product.find({});

        return products;
      }catch (err) {
        console.log(err);
      }
    },
    getProduct: async (_, { id }) => {
      const product = await Product.findById(id);

      if (!product) {
        throw new Error('Whoops: Not found!');
      }

      return product;
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
    },
    newProduct: async (_, { input }) => {
      try {
        const product = new Product(input);

        const result = await product.save();

        return result;
      }catch(err) {
        console.log(err);
      }
    },
    updateProduct: async (_, { id, input }) => {
        let product = await Product.findById(id);

        if (!product) {
          throw new Error('Whoops: Not found!');
        }

        product = await Product.findOneAndUpdate({ _id: id }, input, { new: true });
      
        return product;
    },
    deleteProduct: async (_, { id }) => {
      let product = await Product.findById(id);

      if (!product) {
        throw new Error('Whoops: Not found!');
      }

      await Product.findOneAndDelete({ _id: id });

      return "Product deleted successfully!";
    }
  }
}

module.exports = resolvers;
