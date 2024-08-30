const Books = require('../models/book.model');
const { getBookByISBN } = require('../../modules/books');

/**
 * Check for book and return if exists
 * @param {*} isbn 
 * @returns {Object} book
 */
async function checkForBook(isbn) {
  try {
    const book = await Books.findOne({
      where: {
        isbn
      }
    });
    if (!book) {
      return null
    }
    return book;
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * Add new book and recommendations to db
 * @param {String} isbn
 * @param {Array} recommendedBooks
 * @param {Number} userId
 */
async function addBookRecord(isbn, recommendedBooks, userId) {
  const { title } = await getBookByISBN(isbn);

  /**
   * Check if book already exists first
   */
  const bookExists = await checkForBook(isbn);
  if (bookExists) {
    return bookExists;
  }

  try {
    const book = await Books.create({
      title,
      isbn,
      recommendations: recommendedBooks,
      createdById: userId
    });
    return book;
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * Delete a record of a book if it exists
 * @param {*} isbn 
 * @returns 
 */
async function deleteBookRecord(isbn) {
  try {
    const book = await Books.findOne({
      where: {
        isbn
      }
    });
    if (!book) {
      return null
    }
    await book.destroy();
    return book;
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  addBookRecord,
  checkForBook,
  deleteBookRecord
}