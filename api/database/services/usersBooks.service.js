const UsersBooks = require('../models/UsersBooks.model');
const Book = require('../models/Book.model');

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
      },
      include: [
        {
          model: Book,
          as: 'book'
        }
      ]
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
async function addBookToUser(userId, bookId, userRating = null, dateStarted = null, dateFinished = null, userNotes = null) {
  if (userRating > 10) {
    throw new Error('User rating must be between 1 and 10');
  }
  try {
    const userBook = await UsersBooks.create({
      userId,
      bookId,
      userRating,
      dateStarted,
      dateFinished,
      userNotes
    });

    const bookWithDetails = await UsersBooks.findOne({
      where: { id: userBook.id },
      include: [
        {
          model: Book,
          as: 'book'
        }
      ]
    });

    return bookWithDetails;
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  getBooksForUser,
  addBookToUser
}