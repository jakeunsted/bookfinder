const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');

/**
 * Sequelize and db setup
 */
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

/**
 * Loads and initializes models from the specified directory.
 * @returns {Object} - An object containing the loaded models.
 */
function loadModels() {
  const models = {};

  fs.readdirSync(path.join(__dirname, 'models')).forEach((file) => {
    if (file.endsWith('.js')) { 
      const model = require(path.join(__dirname, 'models', file));
      if (model.init) {
        model.init(sequelize);
        models[model.name] = model;
      }
    }
  });

  return models;
}

/**
 * Connects to the database and loads the models.
 * @returns {Promise<void>} A promise that resolves when the connection is established and models are loaded.
 */
async function connectToDatabase() {
  try {
    await sequelize.authenticate();
    const models = loadModels();

    Object.values(models).forEach((model) => {
      if (model.associate) {
        model.associate(models);
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
