<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useFunMode } from '@/composables/useTheme'

// Utiliser le composable de mode fun
const { isFunMode, toggleFunMode } = useFunMode()

// Définir le nom du composant pour ESLint
defineOptions({
  name: 'AppHeader'
})
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
          
          <!-- Bouton de basculement Mode Fun -->
          <button
            @click="toggleFunMode"
            class="ml-4 p-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="{
              'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white': !isFunMode,
              'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white shadow-lg transform hover:scale-105 animate-pulse': isFunMode
            }"
            :title="isFunMode ? 'Désactiver le mode FUN 🎯' : 'Activer le mode FUN! 🌈'"
          >
            <!-- Icône normale pour mode sobre -->
            <svg v-if="!isFunMode" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
            <!-- Icône arc-en-ciel pour mode fun -->
            <div v-else class="w-5 h-5 text-xl">
              🌈
            </div>
          </button>
        </nav>
      </div>
    </div>
  </header>
</template>
