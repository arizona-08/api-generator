<script setup lang="ts">
interface Param {
  name: string
  type: string
  description: string
  required?: boolean
}

interface Props {
  params: Param[]
}

const props = defineProps<Props>()
</script>

<template>
  <div>
    <h4 class="text-sm font-medium text-gray-200 mb-2">Paramètres</h4>
    <div class="bg-gray-700 rounded-md p-3">
      <ul class="space-y-2">
        <li v-for="param in params" :key="param.name" class="flex items-start space-x-3">
          <span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-800 text-blue-200">
            {{ param.type }}
          </span>
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-200">{{ param.name }}</p>
            <p class="text-sm text-gray-400">{{ param.description }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
