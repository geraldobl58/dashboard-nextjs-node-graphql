const resolvers = {
  Query: {
    getCourses: () => "Hello"
  },
  Mutation: {
    newUser: () => "Creating..."
  }
}

module.exports = resolvers;
