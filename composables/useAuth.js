import { useCookie } from '#app';

export const useAuth = () => {
  const login = async (username, password) => {
    const config = useRuntimeConfig();
    console.log('username', username);
    try {
      const response = await fetch(`${config.public.baseUrl}/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        // Handle specific error cases based on response status
        if (response.status === 401) {
          throw new Error('Invalid credentials');
        } else if (response.status === 400) {
          throw new Error('Bad request');
        } else {
          throw new Error('Login failed');
        }
      }

      const data = await response.json();
      const { token } = data;

      if (!token) {
        throw new Error('No token received');
      }

      useCookie('jwt_token').value = token;
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
