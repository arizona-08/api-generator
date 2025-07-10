import { ref } from 'vue'

/**
 * Composable pour la lecture de fichiers JSON
 */
export function useFileReader() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const readJsonFile = (file: File): Promise<any> => {
    return new Promise((resolve, reject) => {
      isLoading.value = true
      error.value = null

      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const result = e.target?.result as string
          const json = JSON.parse(result)
          isLoading.value = false
          resolve(json)
        } catch (err) {
          error.value = 'Le fichier n\'est pas un JSON valide'
          isLoading.value = false
          reject(err)
        }
      }

      reader.onerror = () => {
        error.value = 'Erreur lors de la lecture du fichier'
        isLoading.value = false
        reject(new Error('Erreur de lecture'))
      }

      reader.readAsText(file)
    })
  }

  const validateJson = (jsonString: string): boolean => {
    try {
      JSON.parse(jsonString)
      return true
    } catch {
      return false
    }
  }

  return {
    isLoading,
    error,
    readJsonFile,
    validateJson
  }
}
