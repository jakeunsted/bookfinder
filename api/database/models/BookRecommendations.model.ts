import { 
  Model,
  DataTypes,
  Sequelize,
  Association,
  BelongsToGetAssociationMixin 
} from 'sequelize';
import { Book } from './Book.model.ts';
import { Models } from '../db.ts';

export class BookRecommendations extends Model {
  public id!: number;
  public bookId!: number;
  public recommendations?: object;
  public createdById!: number;

  public getBook!: BelongsToGetAssociationMixin<Book>;

  public static associations: {
    book: Association<BookRecommendations, Book>;
  };

  static initModel(sequelize: Sequelize): void {
    BookRecommendations.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      bookId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      recommendations: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      createdById: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }, {
      sequelize,
      modelName: 'BookRecommendations',
      tableName: 'book_recommendations',
    });
  }

  static associate(models: Models): void {
    this.belongsTo(models.Book, { foreignKey: 'bookId', as: 'book' });
  }
}
