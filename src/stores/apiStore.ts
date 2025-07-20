import { defineStore } from 'pinia'
import { ref } from 'vue'

interface Route {
  method: string
  url: string
  description: string
  params?: any[]
  responseExample?: string
}

interface Documentation {
  routes: Route[]
  apiPrefix: string
  jsonStructure: any
  jsonData?: any
  timestamp?: string
}

export const useApiStore = defineStore('api', () => {
  const jsonData = ref<any>(null) // Exemple actuellement chargé
  const importedJsonData = ref<any>(null) // Données JSON complètes importées
  const apiPrefix = ref<string>('/api/v1')
  const generatedRoutes = ref<Route[]>([])
  const documentation = ref<Documentation | null>(null)

  

  const setJsonData = (data: any) => {
    jsonData.value = data
  }

  const setImportedJsonData = (data: any) => {
    importedJsonData.value = data
  }

  const setApiPrefix = (prefix: string) => {
    apiPrefix.value = prefix
  }

  const setGeneratedRoutes = (routes: Route[]) => {
    generatedRoutes.value = routes
  }

  const saveDocumentation = (docs: Documentation) => {
    documentation.value = docs
    localStorage.setItem('api-documentation', JSON.stringify(docs))
  }

  const loadDocumentation = () => {
    const saved = localStorage.getItem('api-documentation')
    if (saved) {
      documentation.value = JSON.parse(saved) as Documentation
    }
  }

  const updateJsonData = (newData: any) => {
    if (documentation.value) {
      const updatedDocs = {
        ...documentation.value,
        jsonData: newData
      };
      // On utilise saveDocumentation pour mettre à jour à la fois le state et le localStorage
      saveDocumentation(updatedDocs);
    }
  };

  const clearDocumentation = () => {
    documentation.value = null
    localStorage.removeItem('api-documentation')
  }

  const hasDocumentation = (): boolean => {
    return !!(documentation.value?.routes && documentation.value.routes.length > 0)
  }

  return {
    jsonData,
    importedJsonData,
    apiPrefix,
    generatedRoutes,
    documentation,
    setJsonData,
    setImportedJsonData,
    setApiPrefix,
    setGeneratedRoutes,
    saveDocumentation,
    loadDocumentation,
    updateJsonData,
    clearDocumentation,
    hasDocumentation
  }
})
