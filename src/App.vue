<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <h1>API Generator</h1>
    <nav>
      <router-link to="/">Générateur</router-link> |
      <router-link to="/doc">Documentation</router-link> |
      <router-link to="/test">Testeur d'API</router-link>
    </nav>
  </header>
  
  <RouterView />
</template>
