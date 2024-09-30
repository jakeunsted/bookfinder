import { defineStore } from 'pinia';

export const useBookStore = defineStore('book', {
  state: () => ({
    books: [],
    loading: false,
    error: null,
  }),
  actions: {
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
    getBookById: (state) => (id) => {
      const userBook = state.books.find((userBook) => {
        return userBook.id === parseInt(id);
      });
      return userBook;
    },
  },
});