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
    alert('Erreur lors de l\'import du fichier')
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

    alert(`API générée avec succès ! ${routes.length} routes créées.`)


    router.push('/doc')
  } catch (error) {
    alert('Erreur lors de la génération')
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
  if (depth === 0 || typeof obj !== 'object' || obj === null) return typeof obj;
  if (Array.isArray(obj)) {
    return [extractJsonStructure(obj[0], depth - 1)];
  }
  const structure: any = {};
  for (const key in obj) {
    structure[key] = extractJsonStructure(obj[key], depth - 1);
  }
  return structure;
}

onMounted(() => {

  apiStore.loadDocumentation()

  console.log('Store initial:', {
    jsonData: apiStore.jsonData,
    apiPrefix: apiStore.apiPrefix,
    documentation: apiStore.documentation
  })
})
</script>

<template>
  <main>
    <h1>Générateur d'API</h1>
    <p>Importez un fichier JSON pour générer automatiquement la documentation d'une API.</p>

    <div>
      <h2>Fichier JSON</h2>
      <input
        type="file"
        accept=".json,application/json"
        @change="importJsonFile"
      />
      <textarea
        v-model="jsonInput"
        placeholder="Collez votre JSON ici..."
        rows="15"
        cols="80"
      ></textarea>

      <div>
        <label>
          Préfixe des routes:
          <input v-model="apiPrefix" placeholder="/api/v1" />
        </label>
      </div>

      <button
        @click="generateApi"
        :disabled="!isValidJson"
      >
        Générer l'API
      </button>

      <!-- DEBUG - à supprimer après -->
      <button @click="debugStore">Debug Store</button>
    </div>
  </main>
</template>
