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
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
  </svg>
</template>
