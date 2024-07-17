export default defineNuxtRouteMiddleware(async (to, from) => {
  const { jwtDecode } = await import('jwt-decode');
  const { useCookie } = await import('#app');

  let token = useCookie('jwt_token').value;

  if (typeof window !== 'undefined') {
    token = localStorage.getItem('jwt_token');
    console.log('localStorage Token retrieved:', token);
  }

  console.log('Token retrieved:', token);

  if (!token) {
    console.log('No token found, redirecting to login');
    return navigateTo('/login');
  }

  try {
    const decoded = jwtDecode(token);
    console.log('Decoded token:', decoded);
    // Additional checks like token expiration can be added here
    if (decoded) {
      console.log('Token is valid, allowing access');
      return;
    }
  } catch (error) {
    console.error('Error decoding token:', error);
    return navigateTo('/login');
  }
});