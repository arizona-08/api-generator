<script setup lang="ts">
import { computed, ref } from 'vue'
import { useApiStore } from '../stores/apiStore'
import { generateApiRoutes } from '../services/apiGenerator'
import EndpointTester from '../components/EndpointTester.vue'

const apiStore = useApiStore()

const routes = computed(() => apiStore.documentation?.routes || [])

// Exemples de données JSON fonctionnelles
const exampleData = {
  users: [
    { id: 1, name: "Alice Dupont", email: "alice@example.com", age: 28 },
    { id: 2, name: "Bob Martin", email: "bob@example.com", age: 35 },
    { id: 3, name: "Claire Leroy", email: "claire@example.com", age: 22 }
  ],
  products: [
    { id: 1, name: "Laptop", price: 999.99, category: "Electronics" },
    { id: 2, name: "Book", price: 19.99, category: "Education" },
    { id: 3, name: "Coffee", price: 4.50, category: "Food" }
  ],
  posts: [
    { id: 1, title: "Hello World", content: "First post!", author: "Alice" },
    { id: 2, title: "Vue.js Tips", content: "Some useful tips", author: "Bob" }
  ]
}

// Fonction pour charger un exemple
const loadExample = (jsonData: Record<string, any>, prefix: string = '/api/v1') => {
  try {
    // Générer les routes à partir des données JSON
    const routes = generateApiRoutes(jsonData, prefix)
    
    // Mettre à jour le store
    apiStore.setJsonData(jsonData)
    apiStore.setApiPrefix(prefix)
    apiStore.setGeneratedRoutes(routes)
    
    // Créer la documentation complète
    const documentation = {
      routes,
      apiPrefix: prefix,
      jsonStructure: extractJsonStructure(jsonData),
      jsonData,
      timestamp: new Date().toISOString()
    }
    
    // Sauvegarder la documentation
    apiStore.saveDocumentation(documentation)
    
    console.log('✅ Exemple chargé avec succès:', documentation.routes.length, 'endpoints générés')
  } catch (error) {
    console.error('❌ Erreur lors du chargement de l\'exemple:', error)
    alert('Erreur lors du chargement de l\'exemple')
  }
}

// Fonction utilitaire pour extraire la structure JSON (simplifiée)
const extractJsonStructure = (data: Record<string, any>): Record<string, any> => {
  const structure: Record<string, any> = {}
  
  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value) && value.length > 0) {
      structure[key] = [extractObjectStructure(value[0])]
    } else if (typeof value === 'object' && value !== null) {
      structure[key] = extractObjectStructure(value)
    } else {
      structure[key] = typeof value
    }
  }
  
  return structure
}

// Fonction utilitaire pour extraire la structure d'un objet
const extractObjectStructure = (obj: Record<string, any>): Record<string, string> => {
  const structure: Record<string, string> = {}
  
  for (const [key, value] of Object.entries(obj)) {
    structure[key] = typeof value
  }
  
  return structure
}

// État d'affichage des exemples
const showExamples = ref(false)
</script>

<template>
  <main class="py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-10">
        <h1 class="text-3xl font-bold text-gray-100 mb-2">Testeur d'API Live ⚡</h1>
        <p class="text-lg text-gray-400">Testez en direct tous les endpoints de l'API générée.</p>
      </div>

      <!-- Section des exemples de requêtes -->
      <div class="mb-8 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div class="p-4 bg-gray-900/50 flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold text-gray-200">📋 Exemples de requêtes fonctionnelles</h2>
            <p class="text-sm text-gray-400 mt-1">Chargez des données d'exemple pour tester rapidement l'API</p>
          </div>
          <button
            @click="showExamples = !showExamples"
            class="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded transition-colors"
          >
            <svg 
              class="w-4 h-4 transition-transform duration-200" 
              :class="{ 'rotate-180': showExamples }"
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
            {{ showExamples ? 'Masquer' : 'Afficher' }}
          </button>
        </div>
        
        <div 
          class="overflow-hidden transition-all duration-300 ease-in-out"
          :class="showExamples ? 'max-h-96 overflow-y-auto' : 'max-h-0'"
        >
          <div class="p-4 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Exemple Users -->
              <div class="bg-gray-900/30 p-4 rounded-lg border border-gray-600">
                <h3 class="font-semibold text-green-400 mb-2">👥 API Utilisateurs</h3>
                <p class="text-sm text-gray-400 mb-3">Endpoints pour gérer des utilisateurs</p>
                <ul class="text-xs text-gray-500 mb-4 space-y-1">
                  <li>• GET /api/v1/users</li>
                  <li>• GET /api/v1/users/{id}</li>
                  <li>• POST /api/v1/users</li>
                  <li>• PUT /api/v1/users/{id}</li>
                  <li>• DELETE /api/v1/users/{id}</li>
                </ul>
                <button
                  @click="loadExample(exampleData)"
                  class="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors"
                >
                  Charger cet exemple
                </button>
              </div>
              
              <!-- Exemple Products -->
              <div class="bg-gray-900/30 p-4 rounded-lg border border-gray-600">
                <h3 class="font-semibold text-blue-400 mb-2">🛍️ API Produits</h3>
                <p class="text-sm text-gray-400 mb-3">Endpoints pour un e-commerce</p>
                <ul class="text-xs text-gray-500 mb-4 space-y-1">
                  <li>• GET /api/v1/products</li>
                  <li>• GET /api/v1/products/{id}</li>
                  <li>• POST /api/v1/products</li>
                  <li>• PUT /api/v1/products/{id}</li>
                  <li>• DELETE /api/v1/products/{id}</li>
                </ul>
                <button
                  @click="loadExample({ products: exampleData.products })"
                  class="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors"
                >
                  Charger cet exemple
                </button>
              </div>
              
              <!-- Exemple Posts -->
              <div class="bg-gray-900/30 p-4 rounded-lg border border-gray-600">
                <h3 class="font-semibold text-purple-400 mb-2">📝 API Blog</h3>
                <p class="text-sm text-gray-400 mb-3">Endpoints pour un blog</p>
                <ul class="text-xs text-gray-500 mb-4 space-y-1">
                  <li>• GET /api/v1/posts</li>
                  <li>• GET /api/v1/posts/{id}</li>
                  <li>• POST /api/v1/posts</li>
                  <li>• PUT /api/v1/posts/{id}</li>
                  <li>• DELETE /api/v1/posts/{id}</li>
                </ul>
                <button
                  @click="loadExample({ posts: exampleData.posts })"
                  class="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors"
                >
                  Charger cet exemple
                </button>
              </div>
            </div>
            
            <!-- Exemple complet -->
            <div class="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 p-4 rounded-lg border border-indigo-600/30">
              <h3 class="font-semibold text-indigo-300 mb-2">🚀 API Complète (Recommandé)</h3>
              <p class="text-sm text-gray-400 mb-3">Tous les endpoints : utilisateurs, produits et posts</p>
              <button
                @click="loadExample(exampleData)"
                class="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded transition-all transform hover:scale-105"
              >
                ✨ Charger l'exemple complet
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Endpoints générés -->
      <div v-if="routes.length > 0" class="space-y-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-200">⚡ Endpoints disponibles</h2>
          <span class="text-sm text-gray-400">{{ routes.length }} endpoint(s) trouvé(s)</span>
        </div>
        <EndpointTester 
          v-for="route in routes" 
          :key="`${route.method}-${route.url}`" 
          :route="route" 
        />
      </div>

      <div v-else class="text-center bg-gray-800 p-12 rounded-lg border border-gray-700">
        <h2 class="text-xl font-semibold text-gray-300">Aucun endpoint à tester</h2>
        <p class="mt-2 text-gray-500">
          Utilisez les <span class="text-indigo-400 font-medium">exemples ci-dessus</span> ou 
          <router-link to="/" class="text-indigo-400 hover:underline">générez une API</router-link> pour voir les endpoints ici.
        </p>
      </div>
    </div>
  </main>
</template>