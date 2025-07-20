<script setup lang="ts">
import { computed, ref } from 'vue'
import { useApiStore } from '../stores/apiStore'
import { generateApiRoutes } from '../services/apiGenerator'
import EndpointTester from '../components/EndpointTester.vue'
import { useDoomMode } from '../composables/useDoomMode'

const apiStore = useApiStore()
const { isDoomActive, toggleDoomMode } = useDoomMode()

const routes = computed(() => apiStore.documentation?.routes || [])

// Générer automatiquement des exemples basés sur les données JSON importées
const generateDynamicExamples = () => {
  // Utiliser importedJsonData pour préserver tous les exemples même après chargement
  const importedData = apiStore.importedJsonData
  if (!importedData || typeof importedData !== 'object') {
    return {}
  }
  
  // Créer des exemples basés sur les clés réelles du JSON importé
  const examples: Record<string, any> = {}
  
  Object.keys(importedData).forEach(key => {
    const data = importedData[key]
    if (Array.isArray(data) && data.length > 0) {
      // Prendre les 3 premiers éléments comme exemples
      examples[key] = data.slice(0, 3)
    } else if (typeof data === 'object' && data !== null) {
      // Si c'est un objet, l'utiliser tel quel
      examples[key] = data
    }
  })
  
  return examples
}

// Exemples dynamiques basés sur les données importées
const dynamicExamples = computed(() => generateDynamicExamples())

// Fonctions helper pour le style des exemples
const getExampleColor = (index: number) => {
  const colors = ['text-green-400', 'text-blue-400', 'text-purple-400', 'text-yellow-400', 'text-red-400', 'text-pink-400']
  return colors[index % colors.length]
}

const getExampleButtonColor = (index: number) => {
  const colors = [
    'bg-green-600 hover:bg-green-700',
    'bg-blue-600 hover:bg-blue-700', 
    'bg-purple-600 hover:bg-purple-700',
    'bg-yellow-600 hover:bg-yellow-700',
    'bg-red-600 hover:bg-red-700',
    'bg-pink-600 hover:bg-pink-700'
  ]
  return colors[index % colors.length]
}

const getExampleIcon = (key: string) => {
  const keyLower = key.toLowerCase()
  
  // Map exact pour les correspondances directes
  const exactMap: Record<string, string> = {
    users: '👥',
    products: '🛍️',
    posts: '📝',
    articles: '📰',
    orders: '📦',
    customers: '👤',
    books: '📚',
    movies: '🎬',
    music: '🎵',
    photos: '📸',
    videos: '🎥',
    events: '📅',
    tasks: '✅',
    projects: '🚀',
    companies: '🏢',
    categories: '📂',
    tags: '🏷️',
    comments: '💬',
    reviews: '⭐',
    ratings: '📊'
  }
  
  // Vérification exacte d'abord
  if (exactMap[keyLower]) {
    return exactMap[keyLower]
  }
  
  // Détection par regex pour plus de flexibilité
  const regexPatterns = [
    { pattern: /user|person|people|member|account|profile/i, emoji: '👥' },
    { pattern: /product|item|good|merchandise|catalog/i, emoji: '🛍️' },
    { pattern: /post|blog|article|news|content/i, emoji: '📝' },
    { pattern: /order|purchase|transaction|sale|invoice/i, emoji: '📦' },
    { pattern: /customer|client|buyer/i, emoji: '👤' },
    { pattern: /book|library|literature/i, emoji: '📚' },
    { pattern: /movie|film|cinema|video/i, emoji: '🎬' },
    { pattern: /music|song|audio|sound/i, emoji: '🎵' },
    { pattern: /photo|image|picture|gallery/i, emoji: '📸' },
    { pattern: /event|meeting|appointment|schedule/i, emoji: '📅' },
    { pattern: /task|todo|job|work/i, emoji: '✅' },
    { pattern: /project|initiative|plan/i, emoji: '🚀' },
    { pattern: /company|business|organization|firm/i, emoji: '🏢' },
    { pattern: /category|group|section|type/i, emoji: '📂' },
    { pattern: /tag|label|keyword/i, emoji: '🏷️' },
    { pattern: /comment|feedback|note/i, emoji: '💬' },
    { pattern: /review|rating|score|evaluation/i, emoji: '⭐' },
    { pattern: /data|info|information|record/i, emoji: '📊' },
    { pattern: /message|mail|email|notification/i, emoji: '📧' },
    { pattern: /game|gaming|play/i, emoji: '🎮' },
    { pattern: /food|restaurant|recipe|meal/i, emoji: '🍽️' },
    { pattern: /location|place|address|map/i, emoji: '📍' },
    { pattern: /document|file|report/i, emoji: '📄' },
    { pattern: /payment|money|finance|wallet/i, emoji: '💰' },
    { pattern: /setting|config|preference/i, emoji: '⚙️' }
  ]
  
  // Recherche par pattern regex
  for (const { pattern, emoji } of regexPatterns) {
    if (pattern.test(keyLower)) {
      return emoji
    }
  }
  
  // Emoji par défaut
  return '📋'
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

// Fonction pour réinitialiser l'API tester (préserve les données JSON importées)
const resetApiTester = () => {
  try {
    // Réinitialiser seulement les routes générées et la documentation
    // MAIS préserver les données JSON importées pour pouvoir choisir un autre exemple
    apiStore.setGeneratedRoutes([])
    apiStore.clearDocumentation()
    
    console.log('🔄 API Tester réinitialisé avec succès - Vous pouvez maintenant choisir un autre exemple')
  } catch (error) {
    console.error('❌ Erreur lors de la réinitialisation:', error)
    alert('Erreur lors de la réinitialisation')
  }
}

// Fonction pour vérifier si un exemple est actuellement chargé
const isCurrentExample = (key: string): boolean => {
  if (!apiStore.jsonData || Object.keys(apiStore.jsonData).length === 0) {
    return false
  }
  
  // Vérifier si la clé existe dans les données actuellement chargées
  // et si des routes sont générées pour cette clé
  return key in apiStore.jsonData && apiStore.generatedRoutes.length > 0
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
        <!-- Titre avec éclair cliquable pour activer le mode DOOM (Easter Egg) -->
        <h1 
          class="text-3xl font-bold text-gray-100 mb-2 select-none transition-all duration-300"
          :class="{
            'text-red-400 animate-pulse': isDoomActive
          }"
        >
          Testeur d'API Live 
          <span 
            @click="toggleDoomMode"
            class="inline-block transition-all duration-300 cursor-pointer"
            :class="{
              'animate-bounce text-red-500': isDoomActive,
              'hover:animate-pulse hover:text-yellow-400': !isDoomActive
            }"
            :title="isDoomActive ? 'Mode DOOM activé ! Clique pour désactiver' : 'Easter Egg: Clique sur l\'\u00e9clair pour activer le mode DOOM...'"
          >⚡</span>
        </h1>
        
        <p class="text-lg text-gray-400">Testez en direct tous les endpoints de l'API générée.</p>
        
        <!-- Message DOOM Mode actif -->
        <p v-if="isDoomActive" class="text-sm text-red-400 mt-2 animate-pulse">
          💀 RIP AND TEAR THROUGH THE API ENDPOINTS! 💀
        </p>
      </div>

      <!-- Section des exemples de requêtes -->
      <div class="mb-8 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div class="p-4 bg-gray-900/50 flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold text-gray-200">📋 Exemples de requêtes fonctionnelles</h2>
            <p class="text-sm text-gray-400 mt-1">Chargez des données d'exemple pour tester rapidement l'API</p>
          </div>
          <div class="flex items-center gap-2">
            <!-- Bouton de réinitialisation -->
            <button
              v-if="apiStore.generatedRoutes.length > 0"
              @click="resetApiTester"
              class="flex items-center gap-1 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors"
              title="Réinitialiser pour changer d'exemple"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
              </svg>
              Réinitialiser
            </button>
            <!-- Bouton d'affichage/masquage -->
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
        </div>
        
        <div 
          class="overflow-hidden transition-all duration-300 ease-in-out"
          :class="showExamples ? 'max-h-96 overflow-y-auto' : 'max-h-0'"
        >
          <div class="p-4 space-y-4">
            <!-- Exemples dynamiques basés sur les données importées -->
            <div v-if="Object.keys(dynamicExamples).length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div 
                v-for="(data, key, index) in dynamicExamples" 
                :key="key"
                class="bg-gray-900/30 p-4 rounded-lg border border-gray-600"
              >
                <h3 class="font-semibold mb-2 capitalize" :class="getExampleColor(index)">
                  {{ getExampleIcon(key) }} API {{ key }}
                </h3>
                <p class="text-sm text-gray-400 mb-3">
                  Endpoints pour gérer {{ key.toLowerCase() }}
                </p>
                <ul class="text-xs text-gray-500 mb-4 space-y-1">
                  <li>• GET {{ apiStore.apiPrefix }}/{{ key }}</li>
                  <li>• GET {{ apiStore.apiPrefix }}/{{ key }}/{id}</li>
                  <li>• POST {{ apiStore.apiPrefix }}/{{ key }}</li>
                  <li>• PUT {{ apiStore.apiPrefix }}/{{ key }}/{id}</li>
                  <li>• DELETE {{ apiStore.apiPrefix }}/{{ key }}/{id}</li>
                </ul>
                <div class="text-xs text-gray-600 mb-3 p-2 bg-gray-800/50 rounded border-l-2 border-gray-600">
                  <strong>Exemple de donnée :</strong>
                  <pre class="mt-1 text-xs">{{ JSON.stringify(Array.isArray(data) ? data[0] : data, null, 2).slice(0, 100) }}{{ JSON.stringify(Array.isArray(data) ? data[0] : data, null, 2).length > 100 ? '...' : '' }}</pre>
                </div>
                <button
                  @click="loadExample({ [key]: data })"
                  class="w-full text-white text-sm font-medium py-2 px-3 rounded transition-colors"
                  :class="getExampleButtonColor(index)"
                >
                  {{ isCurrentExample(key) ? '✓ Exemple actuel' : 'Charger cet exemple' }}
                </button>
              </div>
            </div>
            
            <!-- Message si aucune donnée importée -->
            <div v-else class="text-center py-8">
              <div class="text-gray-500 mb-4">
                <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clip-rule="evenodd" />
                </svg>
                <p class="text-lg font-medium text-gray-400 mb-2">Aucun exemple disponible</p>
                <p class="text-sm text-gray-500">
                  Importez d'abord un fichier JSON depuis la page d'accueil pour voir des exemples personnalisés ici.
                </p>
              </div>
              <router-link 
                to="/" 
                class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
                </svg>
                Retour à l'import JSON
              </router-link>
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