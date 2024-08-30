/**
 * Sequelize and db setup
 */
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false
})

async function connectToDatabase() {
  try {
    await sequelize.authenticate();
    // init models
    const User = require('./models/user.model');
    const Book = require('./models/book.model');
    const UsersBooks = require('./models/usersBooks.model');
    const refreshToken = require('./models/refreshToken.model');

    const models = { User, Book, UsersBooks, refreshToken };
    Object.values(models).forEach(model => {
      if (model.init) {
        model.init(sequelize);
      }
    });
    
    await sequelize.sync({ alter: true });

    console.log('Connected to database successfully');
  } catch (error) {
    console.error('Unable to connect to database: ', error);
  }
}

module.exports = {
  connectToDatabase
}
