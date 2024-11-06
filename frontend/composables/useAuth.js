import { Preferences } from '@capacitor/preferences';

export const useAuth = () => {
  const login = async (username, password) => {
    const config = useRuntimeConfig();

    if (!username || !password) {
      throw new Error('Username and password are required');
    }

    try {
      const response = await fetch(`${config.public.baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid credentials');
        } else if (response.status === 400) {
          throw new Error('Bad request');
        } else {
          throw new Error('Login failed');
        }
      }

      const data = await response.json();
      const { accessToken, refreshToken, user } = data;

      if (!accessToken || !refreshToken) {
        throw new Error('No tokens received');
      }

      if (!user) {
        throw new Error('No user data');
      }

      await Preferences.set({ key: 'access_token', value: accessToken });
      await Preferences.set({ key: 'refresh_token', value: refreshToken });
      reloadNuxtApp({ path: '/' });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    const config = useRuntimeConfig();
    const refreshToken = (
      await Preferences.get({ key: 'refresh_token' })
    ).value;

    try {
      await fetch(`${config.public.baseUrl}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
    } catch (error) {
      console.error('Logout error:', error);
    }

    await Preferences.remove({ key: 'access_token' });
    await Preferences.remove({ key: 'refresh_token' });

    // Redirect to login page
    return navigateTo('/login');
  };

  const refreshAccessToken = async () => {
    const config = useRuntimeConfig();
    const refreshToken = (
      await Preferences.get({ key: 'refresh_token' })
    ).value;

    if (!refreshToken) {
      logout();
      throw new Error('No refresh token available');
    }

    try {
      const response = await fetch(
        `${config.public.baseUrl}/auth/refresh-token`,
        {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${refreshToken}`,
          },
        });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      const { accessToken } = data;

      if (!accessToken) {
        throw new Error('No access token received');
      }

      await Preferences.set({ key: 'access_token', value: accessToken });
      return accessToken;
    } catch (error) {
      console.error('Refresh token error:', error);
      logout();
      throw error;
    }
  };

  return {
    login,
    logout,
    refreshAccessToken,
  };
};
