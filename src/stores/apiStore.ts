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
  const jsonData = ref<any>(null)
  const apiPrefix = ref<string>('/api/v1')
  const generatedRoutes = ref<Route[]>([])
  const documentation = ref<Documentation | null>(null)

  const setJsonData = (data: any) => {
    jsonData.value = data
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

  const clearDocumentation = () => {
    documentation.value = null
    localStorage.removeItem('api-documentation')
  }

  const hasDocumentation = (): boolean => {
    return !!(documentation.value?.routes && documentation.value.routes.length > 0)
  }

  return {
    jsonData,
    apiPrefix,
    generatedRoutes,
    documentation,
    setJsonData,
    setApiPrefix,
    setGeneratedRoutes,
    saveDocumentation,
    loadDocumentation,
    clearDocumentation,
    hasDocumentation
  }
})
