import { 
  Model, 
  DataTypes, 
  Sequelize, 
  BelongsToGetAssociationMixin, 
  Association 
} from 'sequelize';
import { User } from './user.model.ts';
import { Models } from '../db.ts';

export class RefreshToken extends Model {
  public token!: string;
  public userId!: number;
  public expiresAt!: Date;

  public getUser!: BelongsToGetAssociationMixin<User>;

  public static associations: {
    user: Association<RefreshToken, User>;
  };

  static initModel(sequelize: Sequelize): void {
    RefreshToken.init({
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    }, {
      sequelize,
      modelName: 'RefreshToken',
      tableName: 'refresh_tokens',
    });
  }

  static associate(models: Models): void {
    this.belongsTo(models.User, { 
      foreignKey: 'userId', 
      as: 'user', 
      onDelete: 'CASCADE' 
    });
  }
}
