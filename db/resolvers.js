const User = require('../models/User');
const bcryptjs = require('bcryptjs');

const resolvers = {
  Query: {
    getCourses: () => "Hello"
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


    }
  }
}

module.exports = resolvers;
