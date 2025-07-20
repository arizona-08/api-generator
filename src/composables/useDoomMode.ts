import { ref, onUnmounted } from 'vue'

export function useDoomMode() {
  const isDoomActive = ref(false)
  const doomMusic = ref<HTMLAudioElement | null>(null)
  const bloodInterval = ref<number | null>(null)

  // Activer le mode DOOM
  const activateDoomMode = async () => {
    isDoomActive.value = true
    console.log('💀 DOOM MODE ACTIVATED - RIP AND TEAR!')
    
    // Appliquer le filtre noir et blanc
    applyBlackAndWhiteFilter()
    
    // Jouer la musique DOOM
    await playDoomMusic()
    
    // Démarrer l'effet de sang
    startBloodEffect()
  }

  // Désactiver le mode DOOM
  const deactivateDoomMode = () => {
    isDoomActive.value = false
    console.log('🌙 DOOM MODE DEACTIVATED')
    
    // Supprimer le filtre noir et blanc
    removeBlackAndWhiteFilter()
    
    // Arrêter la musique
    stopDoomMusic()
    
    // Arrêter l'effet de sang
    stopBloodEffect()
  }

  // Basculer le mode DOOM
  const toggleDoomMode = () => {
    if (isDoomActive.value) {
      deactivateDoomMode()
    } else {
      activateDoomMode()
    }
  }

  // Appliquer le filtre noir et blanc (en excluant les éléments de sang)
  const applyBlackAndWhiteFilter = () => {
    const grayscaleStyle = document.createElement('style')
    grayscaleStyle.id = 'doom-grayscale'
    grayscaleStyle.textContent = `
      /* Appliquer le filtre à tous les éléments sauf le sang */
      body > *:not(.blood-drop):not(.blood-trail):not(.blood-splatter) {
        filter: grayscale(100%) contrast(1.2) !important;
        transition: filter 1s ease-in-out;
      }
      
      /* S'assurer que les éléments de sang restent colorés et au-dessus */
      .blood-drop,
      .blood-trail,
      .blood-splatter {
        filter: none !important;
        -webkit-filter: none !important;
        position: fixed !important;
        z-index: 999999 !important;
        pointer-events: none !important;
      }
      
      /* Forcer la couleur rouge pour le sang */
      .blood-drop {
        background: linear-gradient(to bottom, #FF0000, #CC0000, #990000) !important;
      }
      
      .blood-trail {
        background: linear-gradient(to bottom, transparent, #CC0000) !important;
      }
      
      .blood-splatter {
        background: linear-gradient(to top, #990000 0%, #CC0000 50%, transparent 100%) !important;
      }
    `
    document.head.appendChild(grayscaleStyle)
  }

  // Supprimer le filtre noir et blanc
  const removeBlackAndWhiteFilter = () => {
    const grayscaleStyle = document.querySelector('#doom-grayscale')
    if (grayscaleStyle) {
      grayscaleStyle.remove()
    }
  }

  // Jouer la musique DOOM
  const playDoomMusic = async () => {
    try {
      doomMusic.value = new Audio('/doom.mp3')
      doomMusic.value.volume = 0.4
      doomMusic.value.loop = true
      await doomMusic.value.play()
      console.log('🎵 DOOM MUSIC IS PLAYING!')
    } catch (error) {
      console.log('🔇 Musique DOOM non trouvée:', error)
    }
  }

  // Arrêter la musique DOOM
  const stopDoomMusic = () => {
    if (doomMusic.value) {
      doomMusic.value.pause()
      doomMusic.value.currentTime = 0
      doomMusic.value = null
      console.log('🔇 DOOM music stopped')
    }
  }

  // Démarrer l'effet de sang qui coule
  const startBloodEffect = () => {
    // Créer le style CSS pour l'effet de sang
    const bloodStyle = document.createElement('style')
    bloodStyle.id = 'doom-blood-effect'
    bloodStyle.textContent = `
      .blood-drop {
        position: fixed;
        width: 6px;
        height: 30px;
        background: linear-gradient(to bottom, #FF0000, #8B0000, #DC143C);
        border-radius: 0 0 50% 50%;
        pointer-events: none;
        z-index: 10000;
        animation: bloodDrop linear infinite;
        box-shadow: 0 0 3px rgba(255, 0, 0, 0.8);
      }
      
      @keyframes bloodDrop {
        0% {
          transform: translateY(-50px);
          opacity: 1;
        }
        50% {
          opacity: 0.9;
        }
        100% {
          transform: translateY(calc(100vh + 50px));
          opacity: 0.2;
        }
      }
      
      .blood-splatter {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 30px;
        background: linear-gradient(to top, #8B0000 0%, #DC143C 50%, transparent 100%);
        pointer-events: none;
        z-index: 9999;
        opacity: 0.8;
        box-shadow: 0 -5px 10px rgba(139, 0, 0, 0.5);
      }
      
      .blood-trail {
        position: fixed;
        width: 2px;
        background: linear-gradient(to bottom, transparent, #8B0000);
        pointer-events: none;
        z-index: 9998;
        animation: bloodTrail 4s linear infinite;
      }
      
      @keyframes bloodTrail {
        0% {
          height: 0;
          top: 0;
        }
        100% {
          height: 100vh;
          top: 0;
        }
      }
    `
    document.head.appendChild(bloodStyle)

    // Créer des gouttes de sang périodiquement
    bloodInterval.value = window.setInterval(() => {
      createBloodDrop()
      // Créer parfois des traînées de sang
      if (Math.random() < 0.3) {
        createBloodTrail()
      }
    }, 150) // Nouvelle goutte toutes les 150ms

    // Créer l'effet d'éclaboussure en bas
    createBloodSplatter()
    
    // Créer quelques gouttes initiales pour un effet immédiat
    for (let i = 0; i < 5; i++) {
      setTimeout(() => createBloodDrop(), i * 100)
    }
  }

  // Créer une goutte de sang
  const createBloodDrop = () => {
    const drop = document.createElement('div')
    drop.className = 'blood-drop'
    
    // Position aléatoire en haut de l'écran
    const leftPosition = Math.random() * 100
    const width = 5 + Math.random() * 3 // Largeur variable
    const height = 30 + Math.random() * 15
    const duration = 1.5 + Math.random() * 2
    
    drop.style.cssText = `
      position: fixed !important;
      left: ${leftPosition}%;
      width: ${width}px;
      height: ${height}px;
      animation-duration: ${duration}s;
      top: -50px;
      z-index: 999999 !important;
      background: linear-gradient(to bottom, #FF0000, #CC0000, #990000) !important;
      border-radius: 0 0 50% 50%;
      box-shadow: 0 0 5px rgba(255, 0, 0, 0.8) !important;
      pointer-events: none !important;
    `
    
    document.body.appendChild(drop)
    
    // Supprimer la goutte après l'animation
    setTimeout(() => {
      if (drop.parentNode) {
        drop.parentNode.removeChild(drop)
      }
    }, duration * 1000)
  }

  // Créer une traînée de sang
  const createBloodTrail = () => {
    const trail = document.createElement('div')
    trail.className = 'blood-trail'
    
    // Position aléatoire
    const leftPosition = Math.random() * 100
    const duration = 3 + Math.random() * 2
    
    trail.style.cssText = `
      left: ${leftPosition}%;
      height: 0;
      animation-duration: ${duration}s;
    `
    
    document.body.appendChild(trail)
    
    // Supprimer la traînée après l'animation
    setTimeout(() => {
      if (trail.parentNode) {
        trail.parentNode.removeChild(trail)
      }
    }, duration * 1000)
  }

  // Créer l'effet d'éclaboussure de sang en bas
  const createBloodSplatter = () => {
    const splatter = document.createElement('div')
    splatter.className = 'blood-splatter'
    splatter.style.cssText = `
      left: 0;
      right: 0;
      width: 100%;
    `
    document.body.appendChild(splatter)
  }

  // Arrêter l'effet de sang
  const stopBloodEffect = () => {
    // Arrêter l'intervalle
    if (bloodInterval.value) {
      clearInterval(bloodInterval.value)
      bloodInterval.value = null
    }
    
    // Supprimer toutes les gouttes de sang
    const bloodDrops = document.querySelectorAll('.blood-drop')
    bloodDrops.forEach(drop => drop.remove())
    
    // Supprimer l'éclaboussure
    const splatter = document.querySelector('.blood-splatter')
    if (splatter) {
      splatter.remove()
    }
    
    // Supprimer le style CSS
    const bloodStyle = document.querySelector('#doom-blood-effect')
    if (bloodStyle) {
      bloodStyle.remove()
    }
  }

  // Nettoyer lors du démontage du composant
  const cleanup = () => {
    deactivateDoomMode()
  }

  // Nettoyer automatiquement
  onUnmounted(() => {
    cleanup()
  })

  return {
    isDoomActive,
    toggleDoomMode,
    activateDoomMode,
    deactivateDoomMode,
    cleanup
  }
}
