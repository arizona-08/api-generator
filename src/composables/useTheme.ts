import { ref, watch } from 'vue'

/**
 * Composable pour basculer le MODE FUN ! 🌈
 * Permet d'activer/désactiver le fond arc-en-ciel animé
 */
export function useFunMode() {
  // État du mode fun (récupéré depuis localStorage)
  const getInitialFunMode = (): boolean => {
    const saved = localStorage.getItem('funMode')
    return saved === 'true' // Par défaut false (mode normal)
  }

  const isFunMode = ref(getInitialFunMode())

  // Appliquer le mode fun au document
  const applyFunMode = (enabled: boolean) => {
    console.log(enabled ? '🌈 Activating FUN MODE! 🎉' : '🎯 Switching to normal mode')
    const html = document.documentElement
    
    if (enabled) {
      html.classList.add('fun')
      console.log('Fun mode activated!')
    } else {
      html.classList.remove('fun')
      console.log('Normal mode activated!')
    }
  }

  // Basculer le mode fun
  const toggleFunMode = () => {
    console.log('🎯 Toggle button clicked! Current state:', isFunMode.value)
    isFunMode.value = !isFunMode.value
    console.log('🎯 New state:', isFunMode.value)
    console.log('🎯 HTML classes after toggle:', document.documentElement.className)
  }

  // Activer/désactiver explicitement
  const setFunMode = (enabled: boolean) => {
    isFunMode.value = enabled
  }

  // Watcher pour appliquer les changements et sauvegarder
  watch(isFunMode, (enabled) => {
    applyFunMode(enabled)
    localStorage.setItem('funMode', enabled.toString())
  }, { immediate: true })

  return {
    isFunMode,
    toggleFunMode,
    setFunMode
  }
}