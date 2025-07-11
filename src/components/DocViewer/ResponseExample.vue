<script setup lang="ts">
import { ref } from 'vue'
import ChevronDown from '../icons/ChevronDown.vue'

interface Props {
  example: string
  routeKey: string
}

const props = defineProps<Props>()

const isExpanded = ref(false)

const toggleExpansion = () => {
  isExpanded.value = !isExpanded.value
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-2">
      <h4 class="text-sm font-medium text-gray-200">Exemple de réponse</h4>
      <button
        @click="toggleExpansion"
        class="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-400 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
      >
        <ChevronDown
          :custom-class="isExpanded ? 'w-3 h-3 mr-1 transition-transform rotate-180' : 'w-3 h-3 mr-1 transition-transform'"
        />
        {{ isExpanded ? 'Masquer' : 'Voir l\'exemple' }}
      </button>
    </div>
    <div
      v-if="isExpanded"
      class="bg-gray-900 rounded-md p-4 overflow-x-auto transition-all duration-200"
    >
      <pre class="text-sm text-gray-100 whitespace-pre-wrap">{{ example }}</pre>
    </div>
  </div>
</template>
