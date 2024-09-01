const BookRecommendations = require('../models/BookRecommendations.model');

/**
 * Check for book recommendations and return if exists
 */
async function checkForBookRecommendations(bookId) {
  try {
    const bookRecommendations = await BookRecommend
      .findOne({
        where: {
          bookId
        }
      });
    if (!bookRecommendations) {
      return null;
    }
    return bookRecommendations;
  }
  catch (error) {
    throw new Error(error);
  }
};

/**
 * Add new book recommendations to db
 * @param {Number} bookId
 * @param {Array} recommendations
 * @param {Number} userId
 */
async function addBookRecommendations(bookId, recommendations, userId) {
  /**
   * Check if book recommendations already exists first
   */
  const bookRecommendationsExists = await checkForBookRecommendations(bookId);
  if (bookRecommendationsExists) {
    return bookRecommendationsExists;
  }

  try {
    const bookRecommendations = await BookRecommendations.create({
      bookId,
      recommendations,
      createdById: userId
    });
    return bookRecommendations;
  }
  catch (error) {
    throw new Error(error);
  }
}

/**
 * Delete a record of book recommendations if it exists
 * @param {Number} bookId 
 * @returns 
 */
async function deleteBookRecommendations(bookId) {
  try {
    const bookRecommendations = await BookRecommend
      .findOne({
        where: {
          bookId
        }
      });
    if (!bookRecommendations) {
      return null;
    }
    await bookRecommendations.destroy();
  }
  catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  checkForBookRecommendations,
  addBookRecommendations,
  deleteBookRecommendations
};
