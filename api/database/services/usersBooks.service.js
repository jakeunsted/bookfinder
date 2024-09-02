const UsersBooks = require('../models/UsersBooks.model');

/**
 * Get all books for a user
 * @param {number} userId
 * @returns {Array} books
 */
async function getBooksForUser(userId) {
  try {
    const books = await UsersBooks.findAll({
      where: {
        userId
      }
    });
    return books;
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * Add a new book to a user
 * @param {number} userId
 * @param {number} bookId
 * @returns {Object} book
 */
async function addBookToUser(userId, bookId) {
  try {
    const book = await UsersBooks.create({
      userId,
      bookId
    });
    return book;
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  getBooksForUser,
  addBookToUser
}