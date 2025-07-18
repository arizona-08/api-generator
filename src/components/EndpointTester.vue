// src/components/ApiTester/EndpointTester.vue

<script setup lang="ts">
import { ref, computed } from 'vue'
import apiSimulator from '../services/apiSimulator'

interface Route {
  method: string
  url: string
  description: string
  params?: { name: string; type: string; description: string }[]
}

const props = defineProps<{
  route: Route
}>()

const paramValues = ref<Record<string, string>>({})
const requestBody = ref('') // Pour le corps des requêtes POST/PUT
const response = ref<any>(null)
const error = ref<any>(null)
const isLoading = ref(false)

// Initialise les valeurs des paramètres à partir des props (simplifié)
if (props.route.params) {
  props.route.params.forEach(param => {
    paramValues.value[param.name] = ''
  })
}

// if (props.route.method === 'POST' || props.route.method === 'PUT') {
//     requestBody.value = JSON.stringify({
//         "name": "Nouveau Nom",
//         "email": "nouveau@example.com",
//         "role": "nouveau_role"
//     }, null, 2);
// }

// Construit l'URL complète en remplaçant les placeholders par les valeurs
// Cette logique reste la même
const finalUrl = computed(() => {
  let url = props.route.url
  // L'URL de la route contient déjà le préfixe, on a juste à remplacer les params
  for (const key in paramValues.value) {
    // Remplace :id par la valeur, ou le laisse si la valeur est vide
    url = url.replace(`{${key}}`, encodeURIComponent(paramValues.value[key] || `{${key}}`))
  }
  // console.log(url);
  return url
})

// La logique des couleurs reste la même
const methodColorClass = computed(() => {
  switch (props.route.method.toUpperCase()) {
    case 'GET': return 'bg-green-600 text-green-100'
    case 'POST': return 'bg-blue-600 text-blue-100'
    case 'PUT': return 'bg-yellow-600 text-yellow-100'
    case 'DELETE': return 'bg-red-600 text-red-100'
    default: return 'bg-gray-600 text-gray-100'
  }
})

const statusColorClass = computed(() => {
  if (!response.value) return 'bg-gray-500'
  const status = response.value.status
  if (status >= 200 && status < 300) return 'bg-green-500'
  if (status >= 400 && status < 500) return 'bg-yellow-500'
  if (status >= 500) return 'bg-red-500'
  return 'bg-gray-500'
})


/**
 * 2. Exécute la requête via le simulateur
 */
const executeRequest = async () => {
  isLoading.value = true
  response.value = null
  error.value = null

  // Ajout d'un délai pour simuler une latence réseau
  await new Promise(resolve => setTimeout(resolve, 400));

  try {

    console.log(paramValues.value)
    console.log(props.route.url)
    let parsedBody = null;

    // Si c'est POST ou PUT, on parse le contenu de la textarea
    if ((props.route.method === 'POST' || props.route.method === 'PUT') && requestBody.value) {
      try {
        parsedBody = JSON.parse(requestBody.value);
      } catch (e) {
        // Si le JSON est mal formé, on arrête tout et on affiche une erreur claire
        throw new Error('Le format du Body JSON est invalide.');
      }
    }

    // Appel direct au simulateur
    const simulatedResponse = apiSimulator.request(
      props.route,
      paramValues.value,
      parsedBody // Passe le body ici
    );

    // Formater la réponse pour qu'elle corresponde à ce que le template attend
    response.value = {
      ok: simulatedResponse.status >= 200 && simulatedResponse.status < 300,
      status: simulatedResponse.status,
      statusText: `Simulated Response`, // Texte générique
      data: simulatedResponse.data,
    }
    
    // Si le simulateur retourne un statut d'erreur (4xx, 5xx), on le traite
    if (!response.value.ok) {
        throw new Error(JSON.stringify(response.value.data));
    }

  } catch (e: any) {
    error.value = e
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
    <div class="p-4 bg-gray-900/50 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <span
          class="text-sm font-bold px-3 py-1 rounded-md"
          :class="methodColorClass"
        >
          {{ route.method }}
        </span>
        <span class="font-mono text-gray-300">{{ route.url }}</span>
      </div>
      <button
        @click="executeRequest"
        :disabled="isLoading"
        class="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400/50 disabled:cursor-wait text-white font-bold py-2 px-4 rounded transition-colors"
      >
        {{ isLoading ? 'En cours...' : 'Exécuter' }}
      </button>
    </div>

    <div class="p-4 space-y-4">
      <div v-if="route.params && route.params.length > 0">
        <h3 class="font-semibold text-gray-200 mb-2">Paramètres</h3>
        <div class="space-y-2">
          <div v-for="param in route.params" :key="param.name" class="flex items-center gap-4">
            <label :for="`${route.url}-${param.name}`" class="w-1/4 text-right font-mono text-sm text-gray-400">{{ param.name }}:</label>
            <input
              v-model="paramValues[param.name]"
              :id="`${route.url}-${param.name}`"
              type="text"
              :placeholder="param.type"
              class="flex-grow bg-gray-700 border border-gray-600 rounded-md shadow-sm py-1 px-2 text-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      <div v-if="isLoading || response || error">
        <h3 class="font-semibold text-gray-200 mb-2">Réponse</h3>
        <div v-if="isLoading" class="text-gray-400">Chargement...</div>
        
        <div v-if="error" class="bg-red-900/50 border border-red-700 p-3 rounded-md">
          <p class="font-bold text-red-300">Erreur</p>
          <pre class="text-red-400 text-sm whitespace-pre-wrap">{{ error.message }}</pre>
        </div>

        <div v-if="response" class="border border-gray-700 rounded-md">
          <div class="p-2 bg-gray-900/20 flex items-center gap-2">
            <span class="text-xs font-bold px-2 py-0.5 rounded" :class="statusColorClass">
              Status: {{ response.status }}
            </span>
            <span class="text-sm text-gray-300">{{ response.statusText }}</span>
          </div>
          <pre class="p-3 bg-gray-900/50 text-sm text-green-300 overflow-x-auto"><code>{{ JSON.stringify(response.data, null, 2) }}</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>