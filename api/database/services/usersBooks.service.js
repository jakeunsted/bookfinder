const UsersBooks = require('../models/UsersBooks.model');
const Book = require('../models/Book.model');
const bookModule = require('../../modules/books');

/**
 * Get all books for a user, joined with Book to get all details
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

    // Fetch detailed book information from Google Books API for each book
    const booksWithDetails = await Promise.all(books.map(async (userBook) => {
      const bookDetails = await bookModule.getFromBookQuickLink(userBook.book.quickLink);
      return {
        ...userBook.toJSON(),
        bookDetails
      };
    }));

    return booksWithDetails;
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * Get a single book with details for a user
 * @param {number} userId
 * @param {number} bookId
 */
async function getBookForUser(userId, bookId) {
  try {
    const book = await UsersBooks.findOne({
      where: {
        userId,
        bookId
      },
      include: [
        {
          model: Book,
          as: 'book'
        }
      ]
    });
    return book;
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * Add a new book to a user
 * @param {number} userId
 * @param {number} bookId
 * @param {number} userRating
 * @param {Date} dateStarted
 * @param {Date} dateFinished
 * @param {string} userNotes
 * @returns {Object} book
 */
async function addBookToUser(userId, bookId, userRating = null, dateStarted = null, dateFinished = null, userNotes = null) {
  if (userRating > 10) {
    throw new Error('User rating must be between 1 and 10');
  }
  if (dateStarted && dateFinished && dateStarted > dateFinished) {
    throw new Error('Date started must be before date finished');
  }
  if (dateStarted && dateStarted > new Date()) {
    throw new Error('Date started must be in the past');
  }
  const bookExists = await Book.findByPk(bookId);
  if (!bookExists) {
    throw new Error('Book does not exist');
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
  getBookForUser,
  addBookToUser
}