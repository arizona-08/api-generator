<script setup lang="ts">
interface Props {
  customClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  customClass: 'h-5 w-5'
})
</script>

<template>
  <svg :class="customClass" viewBox="0 0 20 20" fill="currentColor">
    <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
  </svg>
</template>
