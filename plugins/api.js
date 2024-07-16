export default defineNuxtPlugin((nuxtApp) => {
  const api = $fetch.create({
    baseURL: process.env.API_URL || 'http://localhost:3001',
  })
  return {
    provide: {
      api
    }
  }
});