const { Model, DataTypes } = require('sequelize');

class RefreshToken extends Model {
  static init(sequelize) {
    super.init({
      token: {
        type: DataTypes.STRING,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    }, {
      sequelize,
      modelName: 'RefreshToken',
      tableName: 'refresh_tokens',
    });
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  }
}

module.exports = RefreshToken;
