const { Model, DataTypes } = require('sequelize');

class Book extends Model {
  static init(sequelize) {
    super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
      createdById: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }
    }, {
      sequelize,
      modelName: 'Book',
      tableName: 'books',
    });
  }

  static associate(models) {
    this.belongsToMany(models.User, { through: models.UsersBooks, as: 'users', foreignKey: 'bookId' });
    this.hasOne(models.BookRecommendations, { foreignKey: 'bookId', as: 'recommendations' });
  }
}

module.exports = Book;