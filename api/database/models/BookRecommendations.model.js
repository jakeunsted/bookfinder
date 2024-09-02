const { Model, DataTypes } = require('sequelize');

class BookRecommendations extends Model {
  static init(sequelize) {
    super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      bookId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      recommendations: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      createdById: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }, {
      sequelize,
      modelName: 'BookRecommendations',
      tableName: 'book_recommendations',
    });
  }

  static associate(models) {
    this.belongsTo(models.Book , { foreignKey: 'bookId', as: 'book' });
  }
}

module.exports = BookRecommendations;