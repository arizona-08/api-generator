<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from './components/layout/Header.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-900">
    <Header />

    <main class="flex-1">
      <RouterView />
    </main>
  </div>
</template>
