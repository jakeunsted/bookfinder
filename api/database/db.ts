import { Sequelize } from 'sequelize';
import { Book } from './models/Book.model.ts';
import { BookRecommendations } from './models/BookRecommendations.model.ts';
import { UsersBooks } from './models/UsersBooks.model.ts';
import { RefreshToken } from './models/refreshToken.model.ts';
import { User } from './models/user.model.ts';

// Define Models interface
export interface Models {
  Book: typeof Book;
  BookRecommendations: typeof BookRecommendations;
  UsersBooks: typeof UsersBooks;
  RefreshToken: typeof RefreshToken;
  User: typeof User;
}

/**
 * Sequelize and db setup
 */
const sequelize = new Sequelize(
  process.env.DATABASE_NAME as string,
  process.env.DATABASE_USER as string,
  process.env.DATABASE_PASSWORD as string,
  {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT as string, 10),
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
  }
);

/**
 * Initialize and associate models
 * @returns {Promise<void>}
 */
export async function connectToDatabase(): Promise<void> {
  Book.initModel(sequelize);
  BookRecommendations.initModel(sequelize);
  UsersBooks.initModel(sequelize);
  RefreshToken.initModel(sequelize);
  User.initModel(sequelize);

  const models: Models = {
    Book,
    BookRecommendations,
    UsersBooks,
    RefreshToken,
    User,
  };

  Book.associate?.(models);
  BookRecommendations.associate?.(models);
  UsersBooks.associate?.(models);
  RefreshToken.associate?.(models);
  User.associate?.(models);

  await sequelize.sync({ alter: true });
  console.log('Database connected and synchronized');
}
