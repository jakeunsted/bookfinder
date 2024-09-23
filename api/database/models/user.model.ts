import {
  Model,
  DataTypes,
  Sequelize,
  Association,
  BelongsToManyAddAssociationMixin,
  HasOneGetAssociationMixin
} from 'sequelize';
import { RefreshToken } from './refreshToken.model.ts';
import { Book } from './Book.model.ts';
import { Models } from '../../types/Models.types.ts';

export class User extends Model {
  public id!: number;
  public username!: string;
  public password!: string;
  public email!: string;
  public role!: string;

  public readonly refreshToken?: RefreshToken;
  public readonly books?: Book[];

  public addUser!: BelongsToManyAddAssociationMixin<Book, number>;
  public getRefreshToken!: HasOneGetAssociationMixin<RefreshToken>;

  public static associations: {
    refreshToken: Association<User, RefreshToken>;
    books: Association<User, Book>;
  };

  static initModel(sequelize: Sequelize): void {
    User.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      sequelize,
      modelName: 'User',
      tableName: 'users',
    });
  }

  static associate(models: Models): void {
    this.hasOne(models.RefreshToken, {
      foreignKey: 'userId',
      as: 'refreshToken',
      onDelete: 'CASCADE'
    });
    this.belongsToMany(models.Book, {
      through: models.UsersBooks,
      as: 'books',
      foreignKey: 'userId'
    });
  }
}