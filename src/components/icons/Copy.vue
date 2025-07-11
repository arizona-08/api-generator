<script setup lang="ts">
interface Props {
  customClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  customClass: 'w-3 h-3'
})
</script>

<template>
  <svg :class="customClass" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
</template>
