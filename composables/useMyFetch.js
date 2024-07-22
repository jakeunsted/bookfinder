export const useMyFetch = async (path, options = {}, useAuth = true) => {
  // Get JWT token from cookies
  const token = useCookie('jwt_token').value

  const config = useRuntimeConfig()
  const url = `${config.public.baseUrl}${path}`

  console.log('token', token);
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

    if (response.status === 401 && useAuth) {
      window.location.href = '/login'
      return
    }

    // Check if response content-type is JSON
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Invalid content-type, expected application/json')
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
