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
    const UserModel = require('./models/user.model');
    const BookModel = require('./models/books.model');
    const RefreshToken = require('./models/refreshToken.model');
    UserModel.init(sequelize);
    BookModel.init(sequelize);
    RefreshToken.init(sequelize);
    
    // Sync models
    await UserModel.sync();
    await BookModel.sync();
    await RefreshToken.sync();

    console.log('Connected to database successfully');
  } catch (error) {
    console.error('Unable to connect to database: ', error);
  }
}

module.exports = {
  connectToDatabase
}
