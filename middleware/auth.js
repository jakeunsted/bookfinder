export default defineNuxtRouteMiddleware(async (to, from) => {
  const { jwtDecode } = await import('jwt-decode');
  const { useCookie } = await import('#app');
  const { useAuth } = await import('~/composables/useAuth');

  const accessToken = useCookie('access_token').value;
  const refreshToken = useCookie('refresh_token').value;

  if (!accessToken && !refreshToken) {
    return navigateTo('/login');
  }

  try {
    let decoded = accessToken ? jwtDecode(accessToken) : null;

    if (!decoded || decoded.exp < Date.now() / 1000) {
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const { refreshAccessToken } = useAuth();
      const newAccessToken = await refreshAccessToken();
      decoded = jwtDecode(newAccessToken);
    }
    
    // Token is valid, allow navigation
    return;
  } catch (error) {
    console.error('Error with token:', error);
    return navigateTo('/login');
  }
});