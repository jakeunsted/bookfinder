export function useBookFunctions() {
  const deleteBook = async (userId, bookId) => {
    console.log('deleting book', userId, bookId);
    const response = await useMyFetch(`/users-books/${userId}/${bookId}`, {
      method: 'DELETE',
    });
    console.log('delete response', response);
    return response;
  };

  return {
    deleteBook,
  };
}