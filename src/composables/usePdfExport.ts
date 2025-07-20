import { ref } from 'vue'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export function usePdfExport() {
  const isExporting = ref(false)
  const exportError = ref<string | null>(null)

  // Fonction pour exporter la documentation en PDF
  const exportDocumentationToPdf = async (elementId: string = 'documentation-content', filename: string = 'api-documentation.pdf') => {
    isExporting.value = true
    exportError.value = null

    try {
      // Trouver l'élément à exporter
      const element = document.getElementById(elementId)
      if (!element) {
        throw new Error(`Élément avec l'ID "${elementId}" non trouvé`)
      }

      // Capturer l'élément en tant qu'image
      const canvas = await html2canvas(element, {
        scale: 2, // Haute résolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#1f2937', // Couleur de fond sombre
        width: element.scrollWidth,
        height: element.scrollHeight
      })

      // Créer le PDF
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      // Calculer les dimensions pour s'adapter à la page A4
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = 0

      // Ajouter l'image au PDF
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)

      // Ajouter des métadonnées
      pdf.setProperties({
        title: 'Documentation API',
        subject: 'Documentation générée automatiquement',
        author: 'API Generator',
        creator: 'Vue.js API Generator'
      })

      // Télécharger le PDF
      pdf.save(filename)

      console.log('✅ PDF exporté avec succès:', filename)

    } catch (error) {
      console.error('❌ Erreur lors de l\'export PDF:', error)
      exportError.value = error instanceof Error ? error.message : 'Erreur inconnue lors de l\'export PDF'
    } finally {
      isExporting.value = false
    }
  }

  // Fonction pour exporter PDF avec musique DOOM (sans folklore visuel)
  const exportPdfWithDoomMusic = async (elementId: string = 'documentation-content', filename: string = 'api-documentation.pdf') => {
    // Jouer la musique DOOM pendant l'export
    let doomMusic: HTMLAudioElement | null = null
    try {
      doomMusic = new Audio('/doom-music.mp3')
      doomMusic.volume = 0.7
      doomMusic.loop = true
      await doomMusic.play()
      console.log('🎵 DOOM music playing during PDF export')
    } catch {
      console.log('🔇 Musique DOOM non trouvée, export PDF normal')
    }

    // Export PDF normal avec createStructuredPdf pour éviter les problèmes oklch
    const element = document.getElementById(elementId)
    if (!element) {
      throw new Error(`Élément avec l'ID "${elementId}" non trouvé`)
    }
    
    // Utiliser createStructuredPdf au lieu de exportDocumentationToPdf pour éviter html2canvas
    const apiStore = (await import('../stores/apiStore')).useApiStore()
    createStructuredPdf(apiStore.documentation, filename)

    // Arrêter la musique après 3 secondes
    setTimeout(() => {
      if (doomMusic) {
        doomMusic.pause()
        doomMusic.currentTime = 0
        console.log('🔇 DOOM music stopped')
      }
    }, 3000)
  }

  // Fonction pour créer un PDF personnalisé avec du contenu structuré
  const createStructuredPdf = (documentation: any, filename: string = 'api-documentation-structured.pdf') => {
    isExporting.value = true
    exportError.value = null

    try {
      const pdf = new jsPDF()
      let yPosition = 20

      // Titre principal
      pdf.setFontSize(20)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Documentation API', 20, yPosition)
      yPosition += 15

      // Informations générales
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'normal')
      pdf.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 20, yPosition)
      yPosition += 10
      pdf.text(`Préfixe API: ${documentation.apiPrefix || '/api/v1'}`, 20, yPosition)
      yPosition += 15

      // Routes
      if (documentation.routes && documentation.routes.length > 0) {
        pdf.setFontSize(16)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Endpoints disponibles:', 20, yPosition)
        yPosition += 10

        documentation.routes.forEach((route: any, index: number) => {
          // Vérifier si on a besoin d'une nouvelle page
          if (yPosition > 250) {
            pdf.addPage()
            yPosition = 20
          }

          pdf.setFontSize(12)
          pdf.setFont('helvetica', 'bold')
          pdf.text(`${route.method} ${route.url}`, 20, yPosition)
          yPosition += 7

          pdf.setFont('helvetica', 'normal')
          pdf.text(route.description || 'Aucune description', 25, yPosition)
          yPosition += 10

          // Exemple de réponse (tronqué si trop long)
          if (route.responseExample) {
            pdf.setFontSize(10)
            pdf.text('Exemple de réponse:', 25, yPosition)
            yPosition += 5
            
            const responseLines = route.responseExample.split('\n').slice(0, 5) // Limiter à 5 lignes
            responseLines.forEach((line: string) => {
              if (yPosition > 280) return // Éviter le débordement
              pdf.text(line.substring(0, 80), 30, yPosition) // Limiter la largeur
              yPosition += 4
            })
          }
          
          yPosition += 5
        })
      }

      // Métadonnées
      pdf.setProperties({
        title: 'Documentation API',
        subject: 'Documentation générée automatiquement',
        author: 'API Generator',
        creator: 'Vue.js API Generator'
      })

      // Télécharger
      pdf.save(filename)
      console.log('✅ PDF structuré exporté avec succès:', filename)

    } catch (error) {
      console.error('❌ Erreur lors de l\'export PDF structuré:', error)
      exportError.value = error instanceof Error ? error.message : 'Erreur inconnue lors de l\'export PDF'
    } finally {
      isExporting.value = false
    }
  }

  return {
    isExporting,
    exportError,
    exportDocumentationToPdf,
    exportPdfWithDoomMusic,
    createStructuredPdf
  }
}
