import { 
  Model,
  DataTypes,
  Sequelize,
  Association,
  HasOneGetAssociationMixin 
} from 'sequelize';
import { User } from './user.model.ts';
import { BookRecommendations } from './BookRecommendations.model.ts';
import { Models } from '../../types/Models.types.ts';
import { GoogleBooksApiResponse } from '../../types/GoogleBooks.types.ts';

export class Book extends Model {
  public id!: number;
  public title!: string;
  public isbn!: string;
  public tags?: string[];
  public quickLink!: string;
  public createdById!: number;
  public bookDetails?: GoogleBooksApiResponse;

  public readonly users?: User[];
  public readonly recommendations?: BookRecommendations;

  public getRecommendations!: HasOneGetAssociationMixin<BookRecommendations>;

  public static associations: {
    users: Association<Book, User>;
    recommendations: Association<Book, BookRecommendations>;
  };

  static initModel(sequelize: Sequelize): void {
    Book.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isbn: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      quickLink: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bookDetails: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      createdById: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }, {
      sequelize,
      modelName: 'Book',
      tableName: 'books',
    });
  }

  static associate(models: Models): void {
    this.belongsToMany(models.User, { 
      through: models.UsersBooks, 
      as: 'users', 
      foreignKey: 'bookId' 
    });
    this.hasOne(models.BookRecommendations, { 
      foreignKey: 'bookId', 
      as: 'recommendations' 
    });
  }
}
