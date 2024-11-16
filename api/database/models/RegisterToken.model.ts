import { Model, DataTypes, Sequelize } from 'sequelize';

export class RegisterToken extends Model {
  public id!: number;
  public token!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  static initModel(sequelize: Sequelize): void {
    RegisterToken.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }, {
      sequelize,
      modelName: 'RegisterToken',
      tableName: 'register_tokens',
    });
  }
}
