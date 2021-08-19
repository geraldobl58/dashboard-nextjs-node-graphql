const resolvers = {
  Query: {
    getCourses: () => "Hello"
  },
  Mutation: {
    newUser: (_, input) => {
      console.log(input);

      return "Creating..."
    }
  }
}

module.exports = resolvers;
