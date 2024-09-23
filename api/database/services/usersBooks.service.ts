import { FindOptions } from 'sequelize';
import { UsersBooks } from '../models/UsersBooks.model.ts';
import { Book } from '../models/Book.model.ts';
import * as bookModule from '../../modules/books/index.ts';

/**
 * interface for BookDetails
 */
interface BookDetails {
  title: string;
  authors: string[];
  publisher: string;
  publishedDate: string;
  description: string;
  pageCount: number;
  averageRating: number;
  imageLinks: {
    thumbnail: string;
  };
}

/**
 * interface for UserBookDetails
 */
interface UserBookDetails {
  book: BookDetails;
  userId: number;
  bookId: number;
  userRating?: number;
  dateStarted?: Date;
  dateFinished?: Date;
  userNotes?: string;
}

/**
 * interface for UsersBooks with Book
 */
interface UsersBooksType extends UsersBooks {
  book: Book;
}

/**
 * Get all books for a user, joined with Book to get all details
 * @param {number} userId
 * @returns {Promise<UserBookDetails[]>} books
 */
async function getBooksForUser(userId: number): Promise<UserBookDetails[]> {
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
    } as FindOptions);

    // Fetch detailed book information from Google Books API for each book
    const booksWithDetails = await Promise.all(
      (books as UsersBooksType[]).map(async (userBook: UsersBooksType) => {
      const bookDetails = await bookModule.getFromBookQuickLink(
        userBook.book.quickLink
      );
      return {
        ...userBook.toJSON(),
        book: {
        ...userBook.book.toJSON(),
        bookDetails
        }
      } as UserBookDetails;
      })
    );

    return booksWithDetails;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}

/**
 * Get a single book with details for a user
 * @param {number} userId
 * @param {number} bookId
 * @returns {Promise<UsersBooksType | null>} book
 */
async function getBookForUser(
  userId: number, bookId: number
): Promise<UsersBooks | null> {
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
    } as FindOptions);
    return book;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}

/**
 * Add a new book to a user
 * @param {number} userId
 * @param {number} bookId
 * @param {number | null} userRating
 * @param {Date | null} dateStarted
 * @param {Date | null} dateFinished
 * @param {string | null} userNotes
 * @returns {Promise<UsersBooksType>} book
 */
async function addBookToUser(
  userId: number,
  bookId: number,
  userRating: number | null = null,
  dateStarted: Date | null = null,
  dateFinished: Date | null = null,
  userNotes: string | null = null
): Promise<UsersBooks> {
  if (userRating !== null && userRating > 10) {
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
    } as FindOptions);

    return bookWithDetails!;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}

export {
  getBooksForUser,
  getBookForUser,
  addBookToUser
};