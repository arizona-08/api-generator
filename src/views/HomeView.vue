// HomeView.vue

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useApiStore } from '../stores/apiStore'
import { useFileReader } from '../composables/useFileReader'
import { generateApiRoutes } from '../services/apiGenerator'

const router = useRouter()
const apiStore = useApiStore()
const { readJsonFile, validateJson } = useFileReader()

const jsonInput = ref('')
const apiPrefix = ref('/api/v1')

const isValidJson = computed(() => {
  if (jsonInput.value.trim() === '') return false
  return validateJson(jsonInput.value)
})

const importJsonFile = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  try {
    const json = await readJsonFile(file)
    jsonInput.value = JSON.stringify(json, null, 2)
  } catch (error) {
    console.error(error)
    alert("Erreur lors de l'import du fichier JSON. Vérifiez la console pour plus de détails.")
  }
}

const generateApi = () => {
  if (!isValidJson.value) return

  try {
    const jsonData = JSON.parse(jsonInput.value)
    const routes = generateApiRoutes(jsonData, apiPrefix.value)

    apiStore.setJsonData(jsonData)
    apiStore.setApiPrefix(apiPrefix.value)
    apiStore.setGeneratedRoutes(routes)

    const documentation = {
      routes,
      apiPrefix: apiPrefix.value,
      jsonStructure: extractJsonStructure(jsonData),
      jsonData,
      timestamp: new Date().toISOString()
    }

    apiStore.saveDocumentation(documentation)
    router.push('/doc')
  } catch (error) {
    console.error(error)
    alert("Erreur lors de la génération de l'API. Assurez-vous que le format JSON est valide.")
  }
}

const debugStore = () => {
  console.log('=== DEBUG STORE ===')
  console.log('jsonData:', apiStore.jsonData)
  console.log('apiPrefix:', apiStore.apiPrefix)
  console.log('generatedRoutes:', apiStore.generatedRoutes)
  console.log('documentation:', apiStore.documentation)
  console.log('hasDocumentation:', apiStore.hasDocumentation())
  console.log('localStorage:', localStorage.getItem('api-documentation'))
}

function extractJsonStructure(obj: any, depth = 2): any {
  if (depth === 0 || typeof obj !== 'object' || obj === null) return typeof obj
  if (Array.isArray(obj)) {
    return [extractJsonStructure(obj[0], depth - 1)]
  }
  const structure: any = {}
  for (const key in obj) {
    structure[key] = extractJsonStructure(obj[key], depth - 1)
  }
  return structure
}

onMounted(() => {
  apiStore.loadDocumentation()
})
</script>

<template>
  <main class="py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-10">
        <h1 class="text-3xl font-bold text-gray-100 mb-2">Générateur d'API Instantané</h1>
        <p class="text-lg text-gray-400">Collez votre JSON ou importez un fichier pour créer votre documentation.</p>
      </div>

      <div class="bg-gray-800 border border-gray-700 rounded-lg shadow-md">
        <div class="p-6 space-y-8">
          <div>
            <div class="flex items-center mb-4">
              <span class="text-xl mr-3">💻</span>
              <h2 class="text-xl font-semibold text-gray-100">Contenu JSON</h2>
            </div>
            <div class="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
              <textarea
                v-model="jsonInput"
                placeholder="Collez votre JSON ici..."
                rows="12"
                class="w-full bg-transparent text-gray-300 placeholder-gray-500 border-0 focus:ring-0 resize-none font-mono text-sm"
              ></textarea>
              <div class="border-t border-gray-700 pt-3 mt-3 flex justify-end">
                <label
                  for="file-upload"
                  class="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
                >
                  <span>Importer un fichier JSON</span>
                  <input id="file-upload" name="file-upload" type="file" class="sr-only" accept=".json,application/json" @change="importJsonFile" />
                </label>
              </div>
            </div>
          </div>

          <div>
            <div class="flex items-center mb-4">
              <span class="text-xl mr-3">⚙️</span>
              <h2 class="text-xl font-semibold text-gray-100">Configuration</h2>
            </div>
            <div class="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
              <label for="api-prefix" class="block text-sm font-medium text-gray-300">Préfixe des routes de l'API</label>
              <input
                id="api-prefix"
                v-model="apiPrefix"
                placeholder="/api/v1"
                class="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        <div class="px-6 py-4 bg-gray-800/50 border-t border-gray-700 flex justify-end items-center">
          <button
            type="button"
            @click="debugStore"
            class="inline-flex justify-center items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600"
          >
            Debug Store
          </button>
          <button
            type="button"
            @click="generateApi"
            :disabled="!isValidJson"
            class="ml-4 inline-flex justify-center items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Générer la Documentation
          </button>
        </div>
      </div>
    </div>
  </main>
</template>