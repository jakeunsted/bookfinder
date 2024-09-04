const Book = require('../models/Book.model');
const { getBookByISBN } = require('../../modules/books');

/**
 * Get book by book id
 * @param {Number} bookId
 */
async function getBookById(bookId) {
  try {
    const book = await Book.findByPk(bookId);
    return book;
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * Check for book and return if exists
 * @param {*} isbn 
 * @returns {Object} book
 */
async function checkForBook(isbn) {
  try {
    const book = await Book.findOne({
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
 * Add new book to db
 * @param {String} isbn
 * @param {Array} tags
 * @param {Number} userId
 */
async function addBookRecord(title, isbn, tags = [], userId, quickLink) {
  /**
   * Check if book already exists first
   */
  const bookExists = await checkForBook(isbn);
  if (bookExists) {
    return bookExists;
  }

  // future: need to add quick google link to get data

  try {
    const book = await Book.create({
      title,
      isbn,
      tags,
      createdById: userId,
      quickLink
    });
    return book;
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * Delete a record of a book if it exists
 * @param {string} isbn 
 * @returns 
 */
async function deleteBookRecord(isbn) {
  try {
    const book = await Book.findOne({
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
  getBookById,
  addBookRecord,
  checkForBook,
  deleteBookRecord
}