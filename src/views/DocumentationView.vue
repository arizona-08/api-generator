<script setup lang="ts">
import { computed, ref } from 'vue'
import { useApiStore } from '../stores/apiStore'
import { usePdfExport } from '../composables/usePdfExport'
import { usePostmanExport } from '../composables/usePostmanExport'

import RouteCard from '../components/DocViewer/RouteCard.vue'
import RouteSearch from '../components/DocViewer/RouteSearch.vue'
import CheckCircle from '../components/icons/CheckCircle.vue'
import DocumentText from '../components/icons/DocumentText.vue'

const apiStore = useApiStore()
const searchQuery = ref('')

// Composables pour les exports
const { exportDocumentationToPdf, isExporting: isPdfExporting, exportError: pdfError, createStructuredPdf } = usePdfExport()
const { isExporting: isPostmanExporting, exportError: postmanError, downloadPostmanCollection, downloadPostmanEnvironment } = usePostmanExport()


const hasDocumentation = computed(() => {
  return apiStore.documentation !== null
})

const allRoutes = computed(() => {
  return apiStore.documentation?.routes || []
})

const filteredRoutes = computed(() => {
  if (!searchQuery.value.trim()) {
    return allRoutes.value
  }

  const query = searchQuery.value.toLowerCase().trim()
  const queryWords = query.split(/\s+/)

  return allRoutes.value.filter(route => {
    const searchableText = [
      route.method,
      route.url,
      route.description,
      ...(route.params?.map(p => `${p.name} ${p.type} ${p.description}`) || [])
    ].join(' ').toLowerCase()

    return queryWords.every(word => searchableText.includes(word))
  })
})
</script>

<template>
    <div class="py-8">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-8">
                <h1 class="text-3xl font-bold text-gray-100 mb-2">Documentation API</h1>
                <p class="text-lg text-gray-400">Documentation générée automatiquement à partir du JSON importé</p>
                
                <!-- Boutons d'export -->
                <div v-if="hasDocumentation" class="mt-6 flex flex-wrap justify-center gap-3">
                    <!-- Export PDF -->
                    <button
                        @click="createStructuredPdf(apiStore.documentation, 'api-documentation.pdf')"
                        :disabled="isPdfExporting"
                        class="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                        {{ isPdfExporting ? 'Export en cours...' : 'Export PDF' }}
                    </button>
                    


                    <!-- Export Postman -->
                    <button
                        @click="downloadPostmanCollection(apiStore.documentation, 'api-collection.postman_collection.json')"
                        :disabled="isPostmanExporting"
                        class="inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-800 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                        {{ isPostmanExporting ? 'Export en cours...' : 'Config Postman' }}
                    </button>
                    

                </div>
                
                <!-- Affichage des erreurs -->
                <div v-if="pdfError" class="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-300 text-sm">
                     Erreur PDF: {{ pdfError }}
                </div>
                <div v-if="postmanError" class="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-300 text-sm">
                     Erreur Postman: {{ postmanError }}
                </div>
                

            </div>

            <div id="documentation-content" class="space-y-6">
                <div v-if="hasDocumentation">
                    <div class="bg-green-900 border border-green-700 rounded-lg p-4 mb-6">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <CheckCircle custom-class="h-5 w-5 text-green-400" />
                            </div>
                            <div class="ml-3">
                                <h3 class="text-sm font-medium text-green-100">Documentation disponible</h3>
                                <p class="text-sm text-green-300">{{ allRoutes.length }} route(s) générée(s)</p>
                            </div>
                        </div>
                    </div>

                    <RouteSearch
                        v-model="searchQuery"
                        :total-routes="allRoutes.length"
                        :filtered-routes="filteredRoutes.length"
                        placeholder="Rechercher par méthode, URL, description..."
                    />

                    <div class="space-y-4">
                        <RouteCard
                            v-for="route in filteredRoutes"
                            :key="route.url + route.method"
                            :route="route"
                        />
                    </div>
                </div>

                <div v-else class="text-center py-12">
                    <DocumentText custom-class="mx-auto h-12 w-12 text-gray-500" />
                    <h3 class="mt-2 text-sm font-medium text-gray-300">Aucune documentation disponible</h3>
                    <p class="mt-1 text-sm text-gray-500">Commencez par générer une API depuis la page d'accueil.</p>
                </div>
            </div>
        </div>
    </div>
</template>
