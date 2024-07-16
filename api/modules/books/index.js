const axios = require('axios');

/**
 * Search google api for book by ISBN
 * @param {String} isbn 
 * @returns 
 */
async function getBookByISBN(isbn) {
  if (!isbn) {
    throw new Error('ISBN is required');
  }

  let url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;

  try {
    const response = await axios.get(url);
    const book = response.data.items[0];
    const returnBook = {
      title: book.volumeInfo.title,
      authors: book.volumeInfo.authors,
      description: book.volumeInfo.description,
      pageCount: book.volumeInfo.pageCount,
      categories: book.volumeInfo.categories,
      image: book.volumeInfo.imageLinks.thumbnail
    };
    console.log('returnBook', returnBook);
    return returnBook;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
}

/**
 * Search for books by name/title
 * @param {String} partialName 
 * @returns 
 */
async function searchBooksByTitle(partialName) {
  if (!partialName) {
    throw new Error('Partial name is required');
  }

  let url = `https://www.googleapis.com/books/v1/volumes?q=intitle:${partialName}`;
  const seenTitles = new Set();

  try {
    const response = await axios.get(url);
    const books = response.data.items
      .map(book => ({
        title: book.volumeInfo.title,
        authors: book.volumeInfo.authors,
        description: book.volumeInfo.description,
        pageCount: book.volumeInfo.pageCount,
        categories: book.volumeInfo.categories,
        image: book.volumeInfo.imageLinks?.thumbnail ?? 'nothing'
      }))
      .filter(book => {
        if (seenTitles.has(book.title)) {
          return false;
        }
        seenTitles.add(book.title);
        return true;
      });
    console.log('books', books);
    return books;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
}

module.exports = {
  getBookByISBN,
  searchBooksByTitle
}
