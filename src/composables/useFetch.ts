import { ref } from 'vue'

interface UseFetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  body?: Record<string, unknown> | string
}

interface UseFetchReturn<T> {
  data: T | null
  error: Error | null
  isLoading: boolean
}

/**
 * Composable useFetch
 *
 */
export async function useFetch<T = unknown>(
  url: string,
  options: UseFetchOptions = {}
): Promise<UseFetchReturn<T>> {
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const isLoading = ref(true)

  try {
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: options.body ? JSON.stringify(options.body) : undefined
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    data.value = result

  } catch (err) {
    error.value = err instanceof Error ? err : new Error('Erreur inconnue')
  } finally {
    isLoading.value = false
  }

  return {
    data: data.value,
    error: error.value,
    isLoading: isLoading.value
  }
}
