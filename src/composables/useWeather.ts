import { ref, computed } from 'vue'

interface WeatherData {
  location: string
  temperature: number
  description: string
  humidity: number
  windSpeed: number
  icon: string
}

interface WeatherError {
  message: string
  code?: number
}

export function useWeather() {
  const weatherData = ref<WeatherData | null>(null)
  const isLoading = ref(false)
  const error = ref<WeatherError | null>(null)

  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY

  // Computed pour vérifier si l'API key est configurée
  const isApiKeyConfigured = computed(() => {
    return apiKey && apiKey !== 'your_api_key_here'
  })



  // Fonction principale pour récupérer la météo (API Weather 2.5 - gratuite)
  const fetchWeather = async (city: string = 'Paris') => {
    if (!isApiKeyConfigured.value) {
      error.value = {
        message: 'Clef API OpenWeather non configurée. Ajoutez VITE_OPENWEATHER_API_KEY dans votre fichier .env',
        code: 401
      }
      return
    }

    isLoading.value = true
    error.value = null
    weatherData.value = null

    try {
      // Utiliser l'API Weather 2.5 (gratuite) au lieu de One Call 3.0
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=fr`
      
      const weatherResponse = await fetch(weatherUrl)
      if (!weatherResponse.ok) {
        throw new Error(`Weather API error: ${weatherResponse.status}`)
      }
      
      const weatherJson = await weatherResponse.json()
      
      // 3. Formater les données
      weatherData.value = {
        location: `${weatherJson.name}, ${weatherJson.sys.country}`,
        temperature: Math.round(weatherJson.main.temp),
        description: weatherJson.weather[0].description,
        humidity: weatherJson.main.humidity,
        windSpeed: Math.round(weatherJson.wind.speed * 3.6), // Conversion m/s vers km/h
        icon: weatherJson.weather[0].icon
      }

    } catch (err) {
      console.error('Erreur API Weather:', err)
      
      // Gestion d'erreur simple sans mode démo
      if (err instanceof Error && err.message.includes('401')) {
        error.value = {
          message: '🔑 Clé API OpenWeather invalide. Vérifiez votre clé sur https://openweathermap.org/api et remplacez-la dans le fichier .env',
          code: 401
        }
      } else {
        error.value = {
          message: err instanceof Error ? err.message : 'Erreur inconnue lors de la récupération des données météo',
          code: 500
        }
      }
    } finally {
      isLoading.value = false
    }
  }



  // Fonction pour obtenir l'URL de l'icône météo
  const getWeatherIconUrl = (icon: string) => {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`
  }

  // Fonction pour générer des données d'exemple d'API météo
  const generateWeatherApiExample = () => {
    return {
      weather: {
        current: {
          location: "Paris, FR",
          temperature: 22,
          description: "partiellement nuageux",
          humidity: 65,
          wind_speed: 12,
          icon: "02d"
        },
        forecast: [
          {
            date: "2025-01-20",
            temp_min: 18,
            temp_max: 25,
            description: "ensoleillé",
            icon: "01d"
          },
          {
            date: "2025-01-21", 
            temp_min: 16,
            temp_max: 23,
            description: "nuageux",
            icon: "03d"
          }
        ]
      }
    }
  }

  return {
    weatherData,
    isLoading,
    error,
    isApiKeyConfigured,
    fetchWeather,
    getWeatherIconUrl,
    generateWeatherApiExample
  }
}
