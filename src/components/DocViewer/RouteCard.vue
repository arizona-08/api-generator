<script setup lang="ts">
import { computed } from 'vue'
import RouteParameters from './RouteParameters.vue'
import ResponseExample from './ResponseExample.vue'
import CopyButton from './CopyButton.vue'

interface Route {
  method: string
  url: string
  description: string
  params?: any[]
  responseExample?: string
}

interface Props {
  route: Route
}

const props = defineProps<Props>()

const getMethodBadgeClass = (method: string): string => {
  switch (method.toUpperCase()) {
    case 'GET':
      return 'bg-green-800 text-green-200'
    case 'POST':
      return 'bg-blue-800 text-blue-200'
    case 'PUT':
      return 'bg-yellow-800 text-yellow-200'
    case 'DELETE':
      return 'bg-red-800 text-red-200'
    default:
      return 'bg-gray-600 text-gray-200'
  }
}

const routeKey = computed(() => `${props.route.url}${props.route.method}`)

const copyText = computed(() => `${props.route.method} ${props.route.url}`)
</script>

<template>
  <div class="bg-gray-800 rounded-lg shadow-md border border-gray-700 overflow-hidden">
    <div class="px-6 py-4 border-b border-gray-700">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <span :class="getMethodBadgeClass(route.method)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
            {{ route.method }}
          </span>
          <code class="text-sm font-mono text-gray-100 bg-gray-700 px-2 py-1 rounded">{{ route.url }}</code>
        </div>

        <CopyButton
          :text-to-copy="copyText"
          label="Copier"
        />
      </div>
      <p class="mt-2 text-sm text-gray-300">{{ route.description }}</p>
    </div>

    <div class="px-6 py-4">
      <RouteParameters
        v-if="route.params && route.params.length > 0"
        :params="route.params"
        class="mb-4"
      />

      <ResponseExample
        v-if="route.responseExample"
        :example="route.responseExample"
        :route-key="routeKey"
        class="mb-4"
      />
    </div>
  </div>
</template>
