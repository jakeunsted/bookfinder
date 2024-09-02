import { useAuth } from '~/composables/useAuth';

export const useMyFetch = async (path, options = {}, useAuthHeader = true) => {
  const config = useRuntimeConfig();
  const url = `${config.public.baseUrl}${path}`;
  const { logout, refreshAccessToken } = useAuth();

  const fetchWithToken = async (token) => {
    // add auth headers if useAuthHeader is true
    const headers = {
      'Content-Type': 'application/json',
      ...(useAuthHeader && token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers
    };

    const fetchOptions = {
      method: 'GET',
      headers,
      ...options
    };
    try {
      const response = await fetch(url, fetchOptions);

      if (response.status === 401) {
        logout();
        return navigateTo('/login');
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid content-type, expected application/json');
      }

      return response.json();
    } catch (error) {
      if (error.message === 'Failed to fetch') {
        throw new Error('Network error, please try again later');
      }
      throw error;
    }
  };

  try {
    let token = useCookie('access_token').value;
    return await fetchWithToken(token);
  } catch (error) {
    if (error.message === 'Unauthorized') {
      const token = await refreshAccessToken();
      return await fetchWithToken(token);
    }
    console.error('Fetch error:', error);
    throw error;
  }
};