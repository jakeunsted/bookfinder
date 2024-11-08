import { defineStore } from 'pinia';

export const useBookStore = defineStore('book', {
  state: () => ({
    books: [],
    loading: false,
    error: null,
  }),
  actions: {
    // Bits to do
    /**
     * Need to sort books into:
     * 1. Read (book.dateFinished)
     * 2. Currently reading (book.dateStarted && !book.dateFinished)
     * 3. Want to read (!book.dateStarted && !book.dateFinished)
     * Will then need to have a getter for each of these.
     */

    /**
     * Fetches books for a specific user.
     * @param {string} userId - The ID of the user whose books are to be
     * fetched.
     * @returns {Promise<void>} - A promise that resolves when the books 
     * have been fetched.
     * @throws {Error} - Throws an error if the fetch operation fails.
     */
    async fetchBooks(userId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await useMyFetch(`/users-books/${userId}`);
        this.books = response;
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
  },
  getters: {
    getAllBooks: (state) => { return state.books; },
    getReadBooks: (state) => {
      return state.books.filter(
        (book) => book.dateFinished,
      );
    },
    getCurrentlyReadingBooks: (state) => {
      return state.books.filter(
        (book) => book.dateStarted && !book.dateFinished,
      );
    },
    getWantToReadBooks: (state) => {
      return state.books.filter(
        (book) => !book.dateStarted && !book.dateFinished,
      );
    },
    getBookById: (state) => (id) => {
      const userBook = state.books.find((userBook) => {
        return userBook.id === parseInt(id);
      });
      return userBook;
    },
  },
});