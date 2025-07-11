<script setup lang="ts">
import Search from '../icons/Search.vue'
import XMark from '../icons/XMark.vue'

interface Props {
  modelValue: string
  placeholder?: string
  totalRoutes?: number
  filteredRoutes?: number
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Rechercher des routes...',
  totalRoutes: 0,
  filteredRoutes: 0
})

const emit = defineEmits<Emits>()

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const clearSearch = () => {
  emit('update:modelValue', '')
}
</script>

<template>
  <div class="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-4 mb-6">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-sm font-medium text-gray-200">Rechercher dans la documentation</h3>
      <div v-if="totalRoutes > 0" class="text-xs text-gray-400">
        {{ filteredRoutes }} / {{ totalRoutes }} routes
      </div>
    </div>

    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search custom-class="h-5 w-5 text-gray-500" />
      </div>

      <input
        :value="modelValue"
        @input="updateValue"
        type="text"
        class="block w-full pl-10 pr-10 py-2 border border-gray-600 rounded-md leading-5 bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:placeholder-gray-500 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        :placeholder="placeholder"
        aria-label="Rechercher des routes API"
      />

      <div v-if="modelValue" class="absolute inset-y-0 right-0 pr-3 flex items-center">
        <button
          @click="clearSearch"
          class="p-1 text-gray-500 hover:text-gray-400 focus:outline-none focus:text-gray-400 transition-colors"
          aria-label="Effacer la recherche"
        >
          <XMark />
        </button>
      </div>
    </div>

    <div v-if="modelValue && filteredRoutes === 0 && totalRoutes > 0" class="mt-3 text-sm text-gray-400 text-center">
      Aucune route trouvée pour "{{ modelValue }}"
    </div>
  </div>
</template>
