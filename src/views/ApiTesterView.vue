<script setup lang="ts">
import { computed } from 'vue'
import { useApiStore } from '../stores/apiStore'
import EndpointTester from '../components/EndpointTester.vue'

const apiStore = useApiStore()

const routes = computed(() => apiStore.documentation?.routes || [])
</script>

<template>
  <main class="py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-10">
        <h1 class="text-3xl font-bold text-gray-100 mb-2">Testeur d'API Live ⚡</h1>
        <p class="text-lg text-gray-400">Testez en direct tous les endpoints de l'API générée.</p>
      </div>

      <div v-if="routes.length > 0" class="space-y-6">
        <EndpointTester 
          v-for="route in routes" 
          :key="`${route.method}-${route.url}`" 
          :route="route" 
        />
      </div>

      <div v-else class="text-center bg-gray-800 p-12 rounded-lg border border-gray-700">
        <h2 class="text-xl font-semibold text-gray-300">Aucun endpoint à tester</h2>
        <p class="mt-2 text-gray-500">
          Veuillez d'abord <router-link to="/" class="text-indigo-400 hover:underline">générer une API</router-link> pour voir les endpoints ici.
        </p>
      </div>
    </div>
  </main>
</template>