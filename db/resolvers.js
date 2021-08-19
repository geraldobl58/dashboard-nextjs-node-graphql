const User = require('../models/User');

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

      try {
        const user = new User(input);
        
        user.save();

        return user;
      }catch (err) {
        console.log(err);
      }
    }
  }
}

module.exports = resolvers;
