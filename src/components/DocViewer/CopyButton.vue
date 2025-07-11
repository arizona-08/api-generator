<script setup lang="ts">
import { ref } from 'vue'
import Copy from '../icons/Copy.vue'
import Check from '../icons/Check.vue'

interface Props {
  textToCopy: string
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Copier'
})

const isCopied = ref(false)
const isLoading = ref(false)

const copyToClipboard = async () => {
  if (isLoading.value) return

  try {
    isLoading.value = true
    await navigator.clipboard.writeText(props.textToCopy)

    isCopied.value = true

    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  } catch (err) {
    fallbackCopyTextToClipboard(props.textToCopy)
  } finally {
    isLoading.value = false
  }
}

const fallbackCopyTextToClipboard = (text: string) => {
  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.style.position = 'fixed'
  textArea.style.left = '-999999px'
  textArea.style.top = '-999999px'
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    document.execCommand('copy')
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('Erreur lors de la copie avec fallback:', err)
  } finally {
    document.body.removeChild(textArea)
  }
}
</script>

<template>
  <button
    @click="copyToClipboard"
    :disabled="isLoading"
    class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-gray-800"
    :class="[
      isCopied
        ? 'text-green-200 bg-green-800 border border-green-600'
        : 'text-gray-400 bg-gray-700 border border-gray-600 hover:bg-gray-600 hover:text-gray-300'
    ]"
    :title="isCopied ? 'Copié !' : `Copier ${textToCopy}`"
  >
    <Copy v-if="!isCopied" custom-class="w-3 h-3 mr-1" />

    <Check v-else custom-class="w-3 h-3 mr-1" />

    <span>{{ isCopied ? 'Copié !' : label }}</span>
  </button>
</template>
