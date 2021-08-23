const User = require('../models/User');
const Product = require('../models/Product');
const Client = require('../models/Client');
const Order = require('../models/Order');
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
    },
    getClients: async () => {
      try {
        const clients = await Client.find({});
        return clients;
      }catch (err) {
        console.log(err);
      }
    },
    getClientsSeller: async (_, {}, ctx) => {
      try {
        const clients = await Client.find({ seller: ctx.user.id.toString() });
        return clients;
      }catch (err) {
        console.log(err);
      }
    },
    getClient: async (_, { id }, ctx) => {
      const client = await Client.findById(id);

      if (!client) {
        throw new Error('Whoops: Not found!');
      }

      if (client.seller.toString() !== ctx.user.id) {
        throw new Error('You dont have credentials!');
      }

      return client;
    },
    getOrders: async () => {
      try {
        const orders = await Order.find({});

        return orders;
      }catch (err) {
        console.log(err);
      }
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
    },
    newClient: async (_, { input }, ctx) => {
      const { email } = input;

      const client = await Client.findOne({ email });

      if (client) {
        throw new Error('Whoops: Client already registered!');
      }

      const newClient = new Client(input);

      newClient.seller = ctx.user.id;

      try {

        const result = await newClient.save();
  
        return result;
      }catch (err) {
        console.log(err);
      }
    },
    updateClient: async (_, { id, input }, ctx) => {
      let client = await Client.findById(id);

      if (!client) {
        throw new Error('Whoops: Not found!');
      }

      if (client.seller.toString() !== ctx.user.id) {
        throw new Error('Whoops: You dont have credentials!');
      }

      client = await Client.findOneAndUpdate({ _id, id }, input, { new: true });

      return client;
    },
    deleteClient: async (_, { id }, ctx) => {
      let client = await Client.findById(id);

      if (!client) {
        throw new Error('Whoops: Not found!');
      }

      if (client.seller.toString() !== ctx.user.id) {
        throw new Error('Whoops: You dont have credentials!');
      }

      await Client.findOneAndDelete({ _id: id });

      return "Client deleted successfully!"
    },
    newOrder: async (_, { input }, ctx) => {
      const { client } = input;

      let clientExists = await Client.findById(client);

      if (!clientExists) {
        throw new Error('Whoops: Not found!');
      }

      if (clientExists.seller.toString() !== ctx.user.id) {
        throw new Error('Whoops: You dont have credentials!');
      }

      for await (const order of input.order) {
        const { id } = order;

        const product = await Product.findById(id);

        if (order.quantity > product.stock) {
          throw new Error(`Whoops: ${product.name} there is no amount available!`);
        } else {
          product.stock = product.stock - order.quantity;

          await product.save();
        }
      };

      const newOrder = new Order(input);

      newOrder.seller = ctx.user.id;

      const result = await newOrder.save();

      return result;
    }
  }
}

module.exports = resolvers;
