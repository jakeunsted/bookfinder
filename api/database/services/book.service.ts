import { Book } from '../models/Book.model.ts';
// import { getBookByISBN } from '../../modules/books';

/**
 * Get book by book id
 * @param {number} bookId
 * @returns {Promise<Book | null>}
 */
export async function getBookById(bookId: number): Promise<Book | null> {
  try {
    const book = await Book.findByPk(bookId);
    return book;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
}

/**
 * Check for book and return if exists
 * @param {string} isbn 
 * @returns {Promise<Book | null>}
 */
export async function checkForBook(isbn: string): Promise<Book | null> {
  try {
    const book = await Book.findOne({
      where: {
        isbn,
      },
    });
    if (!book) {
      return null;
    }
    return book;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
}

/**
 * Add new book to db
 * @param {string} title
 * @param {string} isbn
 * @param {Array<string>} tags
 * @param {number} userId
 * @param {string} quickLink
 * @returns {Promise<Book>}
 */
export async function addBookRecord(
  title: string,
  isbn: string,
  tags: string[] = [],
  userId: number,
  quickLink: string
): Promise<Book> {
  // Check if book already exists
  const bookExists = await checkForBook(isbn);
  if (bookExists) {
    return bookExists;
  }

  // Add new book
  try {
    const book = await Book.create({
      title,
      isbn,
      tags,
      createdById: userId,
      quickLink,
    });
    return book;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
}

/**
 * Delete a record of a book if it exists
 * @param {string} isbn 
 * @returns {Promise<Book | null>}
 */
export async function deleteBookRecord(isbn: string): Promise<Book | null> {
  try {
    const book = await Book.findOne({
      where: {
        isbn,
      },
    });
    if (!book) {
      return null;
    }
    await book.destroy();
    return book;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
}
