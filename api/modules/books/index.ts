/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import * as GoogleBooks from '../../types/GoogleBooks.types.ts';

interface Book {
  title: string;
  authors: string[];
  description: string;
  pageCount: number;
  categories: string[];
  image: string;
  quickLink: string;
  isbn?: {
    isbn10: string | null;
    isbn13: string | null;
  };
}

/**
 * Search google api for book by ISBN
 * @param {string} isbn 
 * @returns {Promise<Book>}
 */
export async function getBookByISBN(isbn: string): Promise<Book> {
  if (!isbn) {
    throw new Error('ISBN is required');
  }

  const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;

  try {
    const response = await axios.get(url);
    const book = response.data.items[0];
    const returnBook: Book = {
      title: book.volumeInfo.title,
      authors: book.volumeInfo.authors,
      description: book.volumeInfo.description,
      pageCount: book.volumeInfo.pageCount,
      categories: book.volumeInfo.categories,
      image: book.volumeInfo.imageLinks.thumbnail,
      quickLink: book.selfLink,
    };
    return returnBook;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
}

/**
 * Search for books by name/title
 * @param {string} partialName 
 * @returns {Promise<Book[]>}
 */
export async function searchBooksByTitle(partialName: string): Promise<Book[]> {
  if (!partialName) {
    throw new Error('Partial name is required');
  }

  const url = `https://www.googleapis.com/books/v1/volumes?q=intitle:${partialName}`;
  const seenTitles = new Set<string>();

  try {
    const response = await axios.get(url);
    const books: Book[] = response.data.items
      .map((book: any) => {
        const identifiers = book.volumeInfo.industryIdentifiers || [];
        const isbn10 = identifiers.find(
          (identifier: any) => identifier.type === 'ISBN_10'
        )?.identifier ?? null;
        const isbn13 = identifiers.find(
          (identifier: any) => identifier.type === 'ISBN_13'
        )?.identifier ?? null;

        return {
          title: book.volumeInfo.title,
          authors: book.volumeInfo.authors,
          description: book.volumeInfo.description,
          pageCount: book.volumeInfo.pageCount,
          categories: book.volumeInfo.categories,
          image: book.volumeInfo.imageLinks?.thumbnail ?? 'nothing',
          quickLink: book.selfLink,
          isbn: {
            isbn10,
            isbn13
          }
        };
      })
      .filter((book: Book) => {
        if (seenTitles.has(book.title)) {
          return false;
        }
        seenTitles.add(book.title);
        return true;
      });

    return books;
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
}

/**
 * Get book details from a quick link
 * @param {string} quickLink 
 * @returns {Promise<any>}
 */
export async function getFromBookQuickLink(
  quickLink: string
): Promise<GoogleBooks.GoogleBooksApiResponse | undefined> {
  try {
    const response = await axios.get(quickLink);
    if (response.status === 200) {
      return response.data;
    } else {
      console.error(`Failed to fetch book details: ${response.statusText}`);
    }
  } catch (error) {
    console.error(
      'Error fetching book details from Google API:', (error as Error).message
    );
  }
  return undefined;
}

// export default {
//   getBookByISBN,
//   searchBooksByTitle,
//   getFromBookQuickLink
// }