export default function(name, url, options = null) {
  const { $api } = useNuxtApp()
  return useAsyncData(name, () => $api(url, options))
}