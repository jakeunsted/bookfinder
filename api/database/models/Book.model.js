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
        allowNull: false
      },
      isbn: {
        type: DataTypes.STRING,
        allowNull: false
      },
      recommendations: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      createdById: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }, {
      sequelize,
      modelName: 'Book',
      tableName: 'books',
    });
  }

  static associate(models) {
    this.belongsToMany(models.User, { through: models.UsersBooks, as: 'users', foreignKey: 'bookId' });
  }
}

module.exports = Book;