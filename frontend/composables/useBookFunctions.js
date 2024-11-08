export function useBookFunctions() {
  const deleteBook = async (userId, bookId) => {
    const response = await useMyFetch(`/users-books/${userId}/${bookId}`, {
      method: 'DELETE',
    });
    console.log('delete response', response);
    return response;
  };

  const markAsRead = async (userId, bookId) => {
    const response = await useMyFetch(`/users-books/${userId}/${bookId}`, {
      method: 'PATCH',
      body: {
        dateFinished: new Date().toISOString(),
      },
    });
    return response;
  };

  const startReading = async (userId, bookId) => {
    const response = await useMyFetch(`/users-books/${userId}/${bookId}`, {
      method: 'PATCH',
      body: {
        dateStarted: new Date().toISOString(),
      },
    });
    return response;
  };

  return {
    deleteBook,
    markAsRead,
    startReading,
  };
}