import { useCookie } from '#app';

export const useAuth = () => {
  const login = async (username, password) => {
    try {
      const response = await fetch('http://localhost:3001/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        useCookie('jwt_token').value = data.token;
        localStorage.setItem('jwt_token', data.token);
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  return {
    login
  };
};
