import {
  Model,
  DataTypes,
  Sequelize,
  Association,
  BelongsToGetAssociationMixin
} from 'sequelize';
import { User } from './user.model.ts';
import { Book } from './Book.model.ts';
import { Models } from '../../types/Models.types.ts';

export class UsersBooks extends Model {
  public id!: number;
  public userId!: number;
  public bookId!: number;
  public userRating?: number;
  public dateStarted?: Date;
  public dateFinished?: Date;
  public userNotes?: string;

  public getUser!: BelongsToGetAssociationMixin<User>;
  public getBook!: BelongsToGetAssociationMixin<Book>;

  public static associations: {
    user: Association<UsersBooks, User>;
    book: Association<UsersBooks, Book>;
  };

  static initModel(sequelize: Sequelize): void {
    UsersBooks.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      bookId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'books',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      userRating: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 1,
          max: 10,
        },
      },
      dateStarted: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      dateFinished: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      userNotes: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: [1, 1000],
        },
      },
    }, {
      sequelize,
      modelName: 'UsersBooks',
      tableName: 'users_books',
    });
  }

  static associate(models: Models): void {
    this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    this.belongsTo(models.Book, { foreignKey: 'bookId', as: 'book' });
  }
}
