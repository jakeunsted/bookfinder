import { BookRecommendations } from "../models/BookRecommendations.model.ts";

/**
 * Check for book recommendations and return if exists
 * @param {number} bookId
 * @returns {Promise<BookRecommendations | null>}
 */
export async function checkForBookRecommendations(
  bookId: number
): Promise<BookRecommendations | null> {
  try {
    const bookRecommendations = await BookRecommendations.findOne({
      where: {
        bookId,
      },
    });
    if (!bookRecommendations) {
      return null;
    }
    return bookRecommendations;
  }
  catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
}

/**
 * Add new book recommendations to db
 * @param {number} bookId
 * @param {Array<object>} recommendations
 * @returns {Promise<BookRecommendations>}
 */
export async function addBookRecommendations(
  bookId: number,
  recommendations: object[]
): Promise<BookRecommendations> {
  /**
   * Check if book recommendations already exists
   */
  const bookRecommendationsExists = await checkForBookRecommendations(bookId);
  if (bookRecommendationsExists) {
    return bookRecommendationsExists;
  }

  try {
    const bookRecommendations = await BookRecommendations.create({
      bookId,
      recommendations,
    });
    return bookRecommendations;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
}

/**
 * Delete a record of book recommendations if it exists
 * @param {number} bookId
 * @returns {Promise<object>}
 */
export async function deleteBookRecommendations(
  bookId: number
): Promise<object> {
  try {
    const bookRecommendations = await BookRecommendations
    .destroy({
        where: {
          bookId,
        },
      });
    if (!bookRecommendations) {
      return { deleted: false }
    }
    return { deleted: true }
  }
  catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
}

