import { useCookie } from '#app';

export const useAuth = () => {
  const login = async (username, password) => {
    try {
      const response = await useMyFetch('/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      }, false);

      useCookie('jwt_token').value = response.token;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    const jwtToken = useCookie('jwt_token');
    jwtToken.value = null;

    // Redirect to login page
    return navigateTo('/login');
  }

  return {
    login,
    logout
  };
};
