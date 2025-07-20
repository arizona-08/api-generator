import { ref } from 'vue'

interface PostmanRequest {
  name: string
  request: {
    method: string
    header: any[]
    url: {
      raw: string
      host: string[]
      path: string[]
    }
    body?: {
      mode: string
      raw: string
      options: {
        raw: {
          language: string
        }
      }
    }
  }
  response: any[]
}

interface PostmanCollection {
  info: {
    name: string
    description: string
    schema: string
    _postman_id: string
  }
  item: PostmanRequest[]
  variable: any[]
}

export function usePostmanExport() {
  const isExporting = ref(false)
  const exportError = ref<string | null>(null)

  // Fonction pour générer un UUID simple
  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0
      const v = c == 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  // Fonction pour convertir une URL en composants Postman
  const parseUrl = (url: string, baseUrl: string = 'localhost:3000') => {
    const fullUrl = url.startsWith('http') ? url : `http://${baseUrl}${url}`
    const urlObj = new URL(fullUrl)
    
    return {
      raw: fullUrl,
      host: urlObj.hostname.split('.'),
      path: urlObj.pathname.split('/').filter(p => p !== '')
    }
  }

  // Fonction pour générer une collection Postman
  const generatePostmanCollection = (documentation: any, collectionName: string = 'API Documentation') => {
    isExporting.value = true
    exportError.value = null

    try {
      const collection: PostmanCollection = {
        info: {
          name: collectionName,
          description: `Collection générée automatiquement à partir de la documentation API\nGénéré le: ${new Date().toISOString()}`,
          schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
          _postman_id: generateUUID()
        },
        item: [],
        variable: [
          {
            key: 'baseUrl',
            value: 'localhost:3000',
            type: 'string'
          }
        ]
      }

      // Convertir chaque route en requête Postman
      if (documentation.routes && documentation.routes.length > 0) {
        documentation.routes.forEach((route: any) => {
          const postmanRequest: PostmanRequest = {
            name: `${route.method} ${route.url}`,
            request: {
              method: route.method,
              header: [
                {
                  key: 'Content-Type',
                  value: 'application/json',
                  type: 'text'
                }
              ],
              url: parseUrl(route.url, '{{baseUrl}}')
            },
            response: []
          }

          // Ajouter le body pour les requêtes POST/PUT
          if ((route.method === 'POST' || route.method === 'PUT') && route.requestExample) {
            postmanRequest.request.body = {
              mode: 'raw',
              raw: route.requestExample,
              options: {
                raw: {
                  language: 'json'
                }
              }
            }
          }

          // Ajouter un exemple de réponse si disponible
          if (route.responseExample) {
            postmanRequest.response = [{
              name: 'Exemple de réponse',
              originalRequest: postmanRequest.request,
              status: 'OK',
              code: 200,
              _postman_previewlanguage: 'json',
              header: [
                {
                  key: 'Content-Type',
                  value: 'application/json'
                }
              ],
              cookie: [],
              body: route.responseExample
            }]
          }

          collection.item.push(postmanRequest)
        })
      }

      return collection

    } catch (error) {
      console.error('❌ Erreur lors de la génération de la collection Postman:', error)
      exportError.value = error instanceof Error ? error.message : 'Erreur inconnue lors de la génération Postman'
      return null
    } finally {
      isExporting.value = false
    }
  }

  // Fonction pour télécharger la collection Postman
  const downloadPostmanCollection = (documentation: any, filename: string = 'api-collection.postman_collection.json') => {
    const collection = generatePostmanCollection(documentation)
    
    if (!collection) {
      return false
    }

    try {
      // Créer le blob et télécharger
      const jsonString = JSON.stringify(collection, null, 2)
      const blob = new Blob([jsonString], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      URL.revokeObjectURL(url)
      
      console.log('✅ Collection Postman téléchargée avec succès:', filename)
      return true

    } catch (error) {
      console.error('❌ Erreur lors du téléchargement:', error)
      exportError.value = error instanceof Error ? error.message : 'Erreur lors du téléchargement'
      return false
    }
  }

  // Fonction pour générer une collection avec des variables d'environnement
  const generatePostmanEnvironment = (baseUrl: string = 'localhost:3000', environmentName: string = 'API Environment') => {
    return {
      id: generateUUID(),
      name: environmentName,
      values: [
        {
          key: 'baseUrl',
          value: baseUrl,
          type: 'default',
          enabled: true
        },
        {
          key: 'apiKey',
          value: '',
          type: 'secret',
          enabled: true
        }
      ],
      _postman_variable_scope: 'environment',
      _postman_exported_at: new Date().toISOString(),
      _postman_exported_using: 'Vue.js API Generator'
    }
  }

  // Fonction pour télécharger l'environnement Postman
  const downloadPostmanEnvironment = (baseUrl: string = 'localhost:3000', filename: string = 'api-environment.postman_environment.json') => {
    try {
      const environment = generatePostmanEnvironment(baseUrl)
      const jsonString = JSON.stringify(environment, null, 2)
      const blob = new Blob([jsonString], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      URL.revokeObjectURL(url)
      
      console.log('✅ Environnement Postman téléchargé avec succès:', filename)
      return true

    } catch (error) {
      console.error('❌ Erreur lors du téléchargement de l\'environnement:', error)
      exportError.value = error instanceof Error ? error.message : 'Erreur lors du téléchargement'
      return false
    }
  }

  return {
    isExporting,
    exportError,
    generatePostmanCollection,
    downloadPostmanCollection,
    generatePostmanEnvironment,
    downloadPostmanEnvironment
  }
}
