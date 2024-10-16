import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
  }),
  actions: {
    /**
     * Get the current user from store
     * @returns {Object} User
     */
    getUser() {
      return this.user;
    },

    /**
     * Set the current user in store
     * @param {Object} user
     */
    setUser(user) {
      this.user = user;
    },

    /**
     * Function to verify jwt and set user
     * @async
     * @returns {Promise<void>}
     */
    async verify() {
      try {
        const response = await useMyFetch('/auth/check-status');
        if (response) {
          this.user = response.user;
        } else {
          this.user = null;
        }
      } catch (error) {
        this.user = null;
        console.error('Error with token:', error);
        if (process.client) {
          navigateTo('/login');
        }
      }
    },

    /**
     * Initialize the store
     * @async
     * @returns {Promise<void>}
     */
    async initialise() {
      await this.verify();
    },

    /**
     * Login
     * @param {Object} user
     */
    saveUserData(user) {
      this.user = user;
    },
  },
});
