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
      .map(book => {
        const identifiers = book.volumeInfo.industryIdentifiers || [];
        const isbn10 = identifiers.find(identifier => identifier.type === 'ISBN_10')?.identifier ?? null;
        const isbn13 = identifiers.find(identifier => identifier.type === 'ISBN_13')?.identifier ?? null;

        return {
          title: book.volumeInfo.title,
          authors: book.volumeInfo.authors,
          description: book.volumeInfo.description,
          pageCount: book.volumeInfo.pageCount,
          categories: book.volumeInfo.categories,
          image: book.volumeInfo.imageLinks?.thumbnail ?? 'nothing',
          isbn: {
            isbn10,
            isbn13
          }
        };
      })
      .filter(book => {
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

async function getFromBookQuickLink(quickLink) {
  try {
    const response = await axios.get(quickLink);
    if (response.status === 200) {
      return response.data;
    } else {
      console.error(`Failed to fetch book details: ${response.statusText}`);
      return {};
    }
  } catch (error) {
    console.error('Error fetching book details from Google API:', error.message);
    return {};
  }
}

module.exports = {
  getBookByISBN,
  searchBooksByTitle,
  getFromBookQuickLink
}
