import { defineStore } from 'pinia'

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
      console.log('this.user', this.user);
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
        this.user = response.user;
      } catch (error) {
        this.user = null;
        navigateTo('/login');
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
    }
  },
})
