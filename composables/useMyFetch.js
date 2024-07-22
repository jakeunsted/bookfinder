export const useMyFetch = async (path, options = {}, useAuth = true) => {
  // Get JWT token from cookies
  const token = useCookie('jwt_token').value

  const config = useRuntimeConfig()
  const url = `${config.public.baseUrl}${path}`

  // Set up request headers
  const headers = {
    'Content-Type': 'application/json',
    ...(useAuth && token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  }

  // Set up fetch options
  const fetchOptions = {
    method: 'GET',
    headers,
    ...options
  }

  try {
    const response = await fetch(url, fetchOptions)
    console.log('fetch response', response);

    if (response.status === 401) {
      window.location.href = '/login'
      return
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Fetch error:', error)
    return null
  }
}