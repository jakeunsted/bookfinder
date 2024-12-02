export default defineNuxtPlugin(() => {
  if (process.client) {
    document.addEventListener('contextmenu', (event) => {
      event.preventDefault();
    });
  }
});
