<template>
  <div class="space-y-6">
    <!-- AI Generation Content (Only Option Now) -->
    <div class="space-y-4">
      <div class="space-y-2">
        <div class="flex justify-between items-center">
          <label class="block text-sm font-black tracking-wide text-yellow-300 drop-shadow-[0_1px_0_rgba(0,0,0,1)] uppercase">
            {{ store.t('aiPromptLabel') }}
          </label>
          <span 
            class="text-xs font-black px-2 py-0.5 rounded-lg border-2 border-black uppercase shadow-[1px_1px_0_0_#000]"
            :class="store.canUseAiGen ? 'bg-green-500 text-black' : 'bg-red-500 text-white'"
          >
            {{ store.t('aiLimitStatus', { count: store.remainingAiGens }) }}
          </span>
        </div>
        
        <!-- Textarea with voice input -->
        <div class="relative">
          <textarea 
            v-model="aiPrompt"
            rows="3"
            :placeholder="store.t('aiPromptPlaceholder')"
            class="w-full text-base font-bold bg-purple-950/80 border-4 border-black rounded-2xl px-4 py-3 pr-14 text-white placeholder-purple-300 focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 transition-all"
            :disabled="isGenerating || !store.canUseAiGen"
          ></textarea>
          
          <!-- Voice Input Button (Microphone) -->
          <button
            v-if="speechSupported"
            type="button"
            @click="toggleVoiceInput"
            class="absolute right-3 top-3 w-10 h-10 rounded-full border-2 border-black flex items-center justify-center font-black text-lg transition-all duration-150 shadow-[2px_2px_0_0_#000] active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000]"
            :class="isListening 
              ? 'bg-red-500 text-white animate-pulse-mic border-red-700' 
              : 'bg-sky-400 hover:bg-sky-300 text-black'"
            :disabled="isGenerating || !store.canUseAiGen"
            :title="isListening ? (store.locale === 'tr' ? 'Dinlemeyi Durdur' : 'Stop Listening') : (store.locale === 'tr' ? 'Sesli Tarif Et' : 'Speak Your Description')"
          >
            <span v-if="isListening" class="text-xl">⏹</span>
            <span v-else class="text-xl">🎤</span>
          </button>
        </div>

        <!-- Voice Input Status -->
        <div v-if="isListening" class="flex items-center gap-2 px-3 py-2 bg-red-500/20 border-2 border-red-500/40 rounded-xl">
          <span class="animate-pulse text-red-400 text-lg">●</span>
          <span class="text-sm font-bold text-red-300 uppercase">
            {{ store.locale === 'tr' ? 'DİNLENİYOR... Savaşçını tarif et!' : 'LISTENING... Describe your brawler!' }}
          </span>
        </div>

        <!-- Voice Not Supported Warning -->
        <div v-if="!speechSupported && checkedSpeech" class="flex items-center gap-2 px-3 py-2 bg-amber-950/40 border-2 border-amber-500/20 rounded-xl">
          <span class="text-amber-400 text-sm">⚠</span>
          <span class="text-xs font-bold text-amber-300 uppercase">
            {{ store.locale === 'tr' ? 'Tarayıcın sesli girişi desteklemiyor. Lütfen yazarak tarif et.' : 'Your browser does not support voice input. Please type your description.' }}
          </span>
        </div>
      </div>

      <button 
        type="button"
        @click="generateAiAvatar"
        class="w-full btn-brawl text-black text-xl font-black py-4 uppercase flex items-center justify-center space-x-2"
        :class="(!store.canUseAiGen || isGenerating || !aiPrompt.trim()) ? 'bg-gray-500 text-gray-800 border-gray-700 cursor-not-allowed shadow-[0_2px_0_#000] translate-y-1' : 'bg-yellow-400 hover:bg-yellow-300 text-black'"
        :disabled="!store.canUseAiGen || isGenerating || !aiPrompt.trim()"
      >
        <span v-if="isGenerating" class="animate-spin text-2xl mr-2">⚙</span>
        <span>{{ isGenerating ? store.t('aiBtnGenerating') : store.t('aiBtnGenerate') }}</span>
      </button>

      <p v-if="!store.canUseAiGen" class="text-red-400 font-extrabold text-sm uppercase drop-shadow-[0_1px_0_rgba(0,0,0,1)] text-center">
        ⚠ {{ store.t('aiLimitError') }}
      </p>
    </div>

    <!-- Generating / Loading State -->
    <div v-if="isGenerating" class="flex flex-col items-center justify-center p-8 bg-purple-950/30 rounded-3xl border-4 border-black border-dashed">
      <!-- Rotating Star Pin -->
      <div class="relative w-16 h-16 animate-spin-bouncy text-yellow-400 drop-shadow-[0_4px_0_rgba(0,0,0,1)] mb-4">
        <svg fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.786 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192z"/>
        </svg>
      </div>
      <p class="font-extrabold text-lg text-yellow-300 uppercase tracking-widest text-center animate-pulse">
        {{ loadingMessage }}
      </p>
    </div>

    <!-- Avatar Preview -->
    <div v-if="store.avatarUrl && !isGenerating" class="flex flex-col items-center justify-center p-4 bg-purple-950/30 rounded-3xl border-4 border-black shadow-[4px_4px_0_0_#000]">
      <div class="relative w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden border-4 border-black bg-purple-950/80">
        <img 
          :src="store.avatarUrl" 
          alt="Brawler Avatar Preview" 
          class="w-full h-full object-cover"
        />
        <!-- Close / Reset Preview -->
        <button 
          type="button"
          @click="clearAvatar"
          class="absolute top-2 right-2 bg-red-600 hover:bg-red-500 border-2 border-black text-white w-8 h-8 rounded-full flex items-center justify-center font-black text-sm transition-transform duration-75 hover:scale-110 active:scale-95"
          aria-label="Remove Avatar"
        >
          X
        </button>
      </div>
    </div>

    <!-- Validation Error -->
    <p v-if="validationError" class="text-red-400 font-extrabold text-sm uppercase drop-shadow-[0_1px_0_rgba(0,0,0,1)] text-center">
      ⚠ {{ validationError }}
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, inject } from 'vue'
import { useBrawlerStore } from '~/stores/brawler'

const store = useBrawlerStore()
const playClickSound = inject('playClickSound', () => {})
const playSuccessSound = inject('playSuccessSound', () => {})
const playErrorSound = inject('playErrorSound', () => {})

const isGenerating = ref(false)
const aiPrompt = ref('')
const validationError = ref('')

// Voice input state
const speechSupported = ref(false)
const checkedSpeech = ref(false)
const isListening = ref(false)
let recognition = null

const loadingMessage = ref('')
const loadingQuotes = {
  en: [
    "SPAWNING BRAWLER...",
    "CHARGING SUPER ABILITY...",
    "UPGRADING TO POWER 11...",
    "FINDING A SHOWDOWN MATCH...",
    "SUMMONING SHADOWS...",
    "TINKERING WITH LASERS..."
  ],
  tr: [
    "SAVAŞÇI OLUŞTURULUYOR...",
    "SÜPER GÜÇ DOLDURULUYOR...",
    "SEVİYE 11'E YÜKSELTİLİYOR...",
    "HESAPLAŞMA MAÇI ARANIYOR...",
    "GÖLGELER ÇAĞRILIYOR...",
    "LAZERLER AYARLANIYOR..."
  ]
}

let quoteInterval = null

const clearAvatar = () => {
  playClickSound()
  store.setAvatar(null)
  validationError.value = ''
}

// ---- Web Speech API: Voice Input ----
const initSpeechRecognition = () => {
  if (typeof window === 'undefined') return

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  checkedSpeech.value = true

  if (!SpeechRecognition) {
    speechSupported.value = false
    return
  }

  speechSupported.value = true
  recognition = new SpeechRecognition()
  recognition.continuous = true
  recognition.interimResults = true
  recognition.lang = store.locale === 'tr' ? 'tr-TR' : 'en-US'

  let finalTranscript = ''

  recognition.onresult = (event) => {
    let interimTranscript = ''
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript
      if (event.results[i].isFinal) {
        finalTranscript += transcript + ' '
      } else {
        interimTranscript = transcript
      }
    }
    // Update textarea with final + interim results
    aiPrompt.value = (finalTranscript + interimTranscript).trim()
  }

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error)
    if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
      validationError.value = store.locale === 'tr'
        ? 'MİKROFON ERİŞİMİ REDDEDİLDİ. LÜTFEN TARAYICI AYARLARINDAN İZİN VERİN.'
        : 'MICROPHONE ACCESS DENIED. PLEASE ALLOW IN BROWSER SETTINGS.'
    }
    isListening.value = false
  }

  recognition.onend = () => {
    isListening.value = false
    finalTranscript = ''
  }
}

const toggleVoiceInput = () => {
  if (!recognition) return
  playClickSound()

  if (isListening.value) {
    recognition.stop()
    isListening.value = false
  } else {
    // Update language before starting
    recognition.lang = store.locale === 'tr' ? 'tr-TR' : 'en-US'
    try {
      recognition.start()
      isListening.value = true
      validationError.value = ''
    } catch (e) {
      console.error('Failed to start speech recognition:', e)
      isListening.value = false
    }
  }
}

// ---- AI Generation ----
const generateAiAvatar = async () => {
  if (!aiPrompt.value.trim()) {
    playErrorSound()
    validationError.value = store.t('promptRequiredError')
    return
  }
  
  // Stop listening if active
  if (isListening.value && recognition) {
    recognition.stop()
    isListening.value = false
  }

  store.loadRateLimiter()
  if (!store.canUseAiGen) {
    playErrorSound()
    return
  }

  playClickSound()
  isGenerating.value = true
  validationError.value = ''
  
  // Set random loading quotes
  const quotes = loadingQuotes[store.locale] || loadingQuotes.en
  loadingMessage.value = quotes[Math.floor(Math.random() * quotes.length)]
  
  quoteInterval = setInterval(() => {
    loadingMessage.value = quotes[Math.floor(Math.random() * quotes.length)]
  }, 2000)

  try {
    const res = await $fetch('/api/generate-avatar', {
      method: 'POST',
      body: { prompt: aiPrompt.value.trim() }
    })
    
    if (!res.success) {
      throw new Error(res.error || 'Server failed to generate image')
    }

    store.setAvatar(res.image)
    store.incrementAiCount()
    isGenerating.value = false
    clearInterval(quoteInterval)
    playSuccessSound()
    
  } catch (error) {
    console.error('Image generation error:', error)
    playErrorSound()
    validationError.value = store.locale === 'tr' 
      ? 'YAPAY ZEKA PORTRESİ OLUŞTURULAMADI. LÜTFEN TEKRAR DENEYİN!' 
      : 'COULD NOT GENERATE AI AVATAR. PLEASE TRY AGAIN!'
    isGenerating.value = false
    clearInterval(quoteInterval)
  }
}

const validateStep = () => {
  if (!store.avatarUrl) {
    validationError.value = store.t('valAvatarEmpty')
    return false
  }
  validationError.value = ''
  return true
}

onMounted(() => {
  store.loadRateLimiter()
  initSpeechRecognition()
})

onBeforeUnmount(() => {
  if (recognition && isListening.value) {
    recognition.stop()
  }
  if (quoteInterval) {
    clearInterval(quoteInterval)
  }
})

defineExpose({
  validate: () => {
    return validateStep()
  }
})
</script>

<style scoped>
@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
.animate-bounce-slow {
  animation: bounce-slow 2s infinite ease-in-out;
}

@keyframes pulse-mic {
  0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.6); }
  50% { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
}
.animate-pulse-mic {
  animation: pulse-mic 1.2s infinite ease-in-out;
}
</style>
