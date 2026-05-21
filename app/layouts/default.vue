<template>
  <div class="min-h-screen w-full brawl-stripes relative overflow-hidden flex flex-col pb-12 select-none">
    <!-- Starburst Background Glow -->
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,235,59,0.08)_0%,transparent_70%)] pointer-events-none"></div>
    
    <!-- Header -->
    <header class="w-full px-4 py-4 flex items-center justify-between z-20 max-w-5xl mx-auto">
      <!-- Title -->
      <div class="flex items-center space-x-2 cursor-pointer" @click="handleLogoClick">
        <!-- Rotating Star Icon (SVG) -->
        <svg class="w-10 h-10 animate-spin-bouncy text-yellow-400 drop-shadow-[0_3px_0_rgba(0,0,0,1)]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.786 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192z"/>
        </svg>
        <h1 class="text-3xl md:text-4xl brawl-text-outline tracking-wider select-none leading-none pt-2">
          {{ store.t('appTitle') }}
        </h1>
      </div>

      <!-- Controls -->
      <div class="flex items-center space-x-2">
        <!-- Music Toggle Button -->
        <button 
          @click="toggleMusic" 
          class="btn-brawl p-2 md:px-3 md:py-2 flex items-center justify-center space-x-1"
          :class="isMusicPlaying ? 'bg-fuchsia-500 hover:bg-fuchsia-400 text-white' : 'bg-fuchsia-800 hover:bg-fuchsia-700 text-fuchsia-300'"
          aria-label="Toggle Music"
        >
          <span class="text-lg md:text-xl font-bold leading-none">
            {{ isMusicPlaying ? '🎵' : '🎵' }}
          </span>
          <span class="hidden md:inline font-black text-xs pt-0.5">
            {{ isMusicPlaying ? 'ON' : 'OFF' }}
          </span>
        </button>

        <!-- Sound Toggle Button -->
        <button 
          @click="toggleSound" 
          class="btn-brawl bg-sky-400 hover:bg-sky-300 text-black p-2 md:px-3 md:py-2 flex items-center justify-center space-x-1"
          aria-label="Toggle Sound"
        >
          <span class="text-lg md:text-xl font-bold leading-none">
            {{ isMuted ? '🔇' : '🔊' }}
          </span>
          <span class="hidden md:inline font-black text-xs pt-0.5">
            {{ isMuted ? 'OFF' : 'SFX' }}
          </span>
        </button>

        <!-- Language Toggle -->
        <button 
          @click="toggleLanguage" 
          class="btn-brawl bg-yellow-400 hover:bg-yellow-300 text-black px-3 py-2 font-black text-sm md:text-base flex items-center space-x-1.5 pt-2"
        >
          <span>🌐</span>
          <span>{{ store.locale.toUpperCase() }}</span>
        </button>
      </div>
    </header>

    <!-- Main Content Container -->
    <main class="flex-grow flex items-center justify-center px-4 relative z-10 max-w-5xl mx-auto w-full">
      <slot />
    </main>

    <!-- Footer with credit -->
    <footer class="w-full text-center mt-8 z-10 space-y-2">
      <p class="text-xs text-purple-400 font-bold uppercase tracking-widest">★ MADE FOR BRAWLERS ★</p>
      <a 
        href="https://x.com/armutyus" 
        target="_blank" 
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1.5 px-4 py-1.5 bg-black/40 hover:bg-black/60 border-2 border-purple-500/30 hover:border-purple-400/50 rounded-full transition-all duration-200 group"
      >
        <svg class="w-4 h-4 text-purple-300 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        <span class="text-xs font-bold text-purple-300 group-hover:text-white transition-colors">
          @armutyus
        </span>
      </a>
    </footer>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, provide } from 'vue'
import { useBrawlerStore } from '~/stores/brawler'
import { useGameMusic } from '~/composables/useGameMusic'

const store = useBrawlerStore()
const isMuted = ref(false)
const isMusicPlaying = ref(false)
const music = useGameMusic()

// Web Audio API Sound Synthesizer
let audioCtx = null

const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
}

// Retro click sound (synth blip)
const playClickSound = () => {
  if (isMuted.value) return
  try {
    initAudio()
    if (audioCtx.state === 'suspended') {
      audioCtx.resume()
    }
    
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(300, audioCtx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(700, audioCtx.currentTime + 0.1)
    
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12)
    
    osc.connect(gain)
    gain.connect(audioCtx.destination)
    
    osc.start()
    osc.stop(audioCtx.currentTime + 0.12)
  } catch (e) {
    console.warn('Audio synthesis failed', e)
  }
}

// Success Sound (Arpeggio)
const playSuccessSound = () => {
  if (isMuted.value) return
  try {
    initAudio()
    if (audioCtx.state === 'suspended') {
      audioCtx.resume()
    }
    
    const now = audioCtx.currentTime
    const notes = [261.63, 329.63, 392.00, 523.25] // C4, E4, G4, C5
    
    notes.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator()
      const gain = audioCtx.createGain()
      
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + idx * 0.08)
      
      gain.gain.setValueAtTime(0.1, now + idx * 0.08)
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.2)
      
      osc.connect(gain)
      gain.connect(audioCtx.destination)
      
      osc.start(now + idx * 0.08)
      osc.stop(now + idx * 0.08 + 0.2)
    })
  } catch (e) {
    console.warn('Audio synthesis failed', e)
  }
}

// Error sound (synth buzz)
const playErrorSound = () => {
  if (isMuted.value) return
  try {
    initAudio()
    if (audioCtx.state === 'suspended') {
      audioCtx.resume()
    }
    
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(150, audioCtx.currentTime)
    osc.frequency.setValueAtTime(100, audioCtx.currentTime + 0.1)
    
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25)
    
    osc.connect(gain)
    gain.connect(audioCtx.destination)
    
    osc.start()
    osc.stop(audioCtx.currentTime + 0.25)
  } catch (e) {
    console.warn('Audio synthesis failed', e)
  }
}

// Provide sound player globally to other components
provide('playClickSound', playClickSound)
provide('playSuccessSound', playSuccessSound)
provide('playErrorSound', playErrorSound)

const toggleLanguage = () => {
  const nextLang = store.locale === 'en' ? 'tr' : 'en'
  store.setLocale(nextLang)
  playClickSound()
}

const toggleSound = () => {
  isMuted.value = !isMuted.value
  if (!isMuted.value) {
    playClickSound()
  }
}

const toggleMusic = () => {
  playClickSound()
  const playing = music.toggle()
  isMusicPlaying.value = playing
  localStorage.setItem('bb_music', playing ? 'on' : 'off')
}

const handleLogoClick = () => {
  playClickSound()
  store.resetBrawler()
}

onMounted(() => {
  store.loadRateLimiter()
  // Restore audio preferences
  const savedMute = localStorage.getItem('bs_audio_muted')
  if (savedMute !== null) {
    isMuted.value = savedMute === 'true'
  }
  // Music starts off by default — user can opt-in
  const savedMusic = localStorage.getItem('bb_music')
  if (savedMusic === 'on') {
    // Auto-play music if user previously enabled it (requires user gesture first)
    // We'll set the flag but actual play needs a click
    isMusicPlaying.value = false
  }
})

onBeforeUnmount(() => {
  music.destroy()
})

// Watch isMuted to store preference
watch(isMuted, (val) => {
  localStorage.setItem('bs_audio_muted', String(val))
})
</script>
