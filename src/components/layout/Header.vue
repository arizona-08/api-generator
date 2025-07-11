<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <header class="bg-gray-800 shadow-lg border-b border-gray-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <h1 class="text-xl font-bold text-white">API Generator</h1>
          </div>
        </div>

        <nav class="flex items-center space-x-8">
          <RouterLink
            to="/"
            class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 border-b-2 border-transparent hover:border-gray-500 hover:bg-gray-700"
            active-class="text-white bg-blue-600 border-blue-400 hover:text-white hover:bg-blue-500 hover:border-blue-300 shadow-lg"
          >
            Générateur
          </RouterLink>

          <RouterLink
            to="/doc"
            class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 border-b-2 border-transparent hover:border-gray-500 hover:bg-gray-700"
            active-class="text-white bg-blue-600 border-blue-400 hover:text-white hover:bg-blue-500 hover:border-blue-300 shadow-lg"
          >
            Documentation
          </RouterLink>

          <RouterLink
            to="/test"
            class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 border-b-2 border-transparent hover:border-gray-500 hover:bg-gray-700"
            active-class="text-white bg-blue-600 border-blue-400 hover:text-white hover:bg-blue-500 hover:border-blue-300 shadow-lg"
          >
            Testeur d'API
          </RouterLink>
        </nav>
      </div>
    </div>
  </header>
</template>
