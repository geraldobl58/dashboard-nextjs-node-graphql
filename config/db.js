const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env' });

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.DB_MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true,
      useCreateIndex: true
    });
    console.log('Database Connected!!!')
  }catch(err) {
    console.log('Whoops');
    console.log(err);
    process.exit(1);
  }
}

module.exports = connectDb;