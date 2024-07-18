export default defineNuxtRouteMiddleware(async (to, from) => {
  const { jwtDecode } = await import('jwt-decode');
  const { useCookie } = await import('#app');

  let token = useCookie('jwt_token').value;

  if (typeof window !== 'undefined') {
    token = localStorage.getItem('jwt_token');
  }

  if (!token) {
    console.log('No token found, redirecting to login');
    return navigateTo('/login');
  }

  try {
    const decoded = jwtDecode(token);
    console.log('Decoded token:', decoded);
    console.log('account id from token:', decoded.id);
    if (decoded) {
      return;
    }
  } catch (error) {
    console.error('Error decoding token:', error);
    return navigateTo('/login');
  }
});