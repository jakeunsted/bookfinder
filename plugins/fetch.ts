export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('fetchWithBase', (url: string, options: any = {}) => {
    options.baseURL = 'http://localhost:3001';
    return $fetch(url, options);
  });
});