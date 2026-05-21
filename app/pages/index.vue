<template>
  <div class="w-full flex flex-col items-center py-4 md:py-8 max-w-xl mx-auto">
    <!-- Trophy Road Step Progress Map -->
    <div class="w-full bg-black/40 border-4 border-black p-4 rounded-3xl mb-6 shadow-[4px_4px_0_0_#000] relative overflow-hidden">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none"></div>
      
      <!-- Stepper Header -->
      <div class="text-center mb-4">
        <span class="font-black text-yellow-400 tracking-wider text-xs md:text-sm bg-black/50 px-3 py-1.5 rounded-full border border-yellow-400/30 uppercase">
          {{ store.t('step', { current: store.currentStep, total: 4 }) }}
        </span>
        <h3 class="text-xl md:text-2xl font-black text-white uppercase tracking-wide mt-2 drop-shadow-[0_2px_0_rgba(0,0,0,1)]">
          {{ stepTitle }}
        </h3>
      </div>

      <!-- Road Path -->
      <div class="relative flex items-center justify-between px-2 md:px-6 py-2">
        <!-- Connecting Line Base -->
        <div class="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-2.5 bg-purple-950 border-2 border-black rounded-full z-0"></div>
        <!-- Active Progress Line -->
        <div 
          class="absolute left-6 top-1/2 -translate-y-1/2 h-2.5 bg-yellow-400 border-y-2 border-black transition-all duration-300 ease-out z-0"
          :style="{ width: progressWidth }"
        ></div>

        <!-- Milestones -->
        <button 
          v-for="stepNum in 4" 
          :key="stepNum"
          @click="jumpToStep(stepNum)"
          type="button"
          class="w-10 h-10 md:w-12 md:h-12 rounded-full border-4 border-black flex items-center justify-center font-black text-sm md:text-base relative z-10 transition-all duration-100 active:scale-95 shadow-[0_3px_0_#000]"
          :class="getMilestoneClass(stepNum)"
          :disabled="stepNum > maxAllowedStep"
        >
          <!-- Milestone Emoji Icons -->
          <span v-if="stepNum < store.currentStep" class="text-white text-xs md:text-sm">✔</span>
          <span v-else class="text-xs md:text-sm">{{ getStepEmoji(stepNum) }}</span>
        </button>
      </div>
    </div>

    <!-- Active Step Container (with smooth page transitions) -->
    <div class="w-full bg-purple-900/40 border-4 border-black p-4 md:p-6 rounded-3xl shadow-[6px_6px_0_0_#000] relative min-h-[350px]">
      <transition name="slide-fade" mode="out-in">
        <!-- Step 1: Basic Info -->
        <StepBasicInfo 
          v-if="store.currentStep === 1" 
          ref="step1Ref" 
        />
        
        <!-- Step 2: Stats & Abilities -->
        <StepStatsAbilities 
          v-else-if="store.currentStep === 2" 
          ref="step2Ref" 
        />
        
        <!-- Step 3: Avatar Setup -->
        <StepAvatar 
          v-else-if="store.currentStep === 3" 
          ref="step3Ref" 
        />
        
        <!-- Step 4: Preview Brawler Card -->
        <BrawlerCard 
          v-else-if="store.currentStep === 4" 
        />
      </transition>
    </div>

    <!-- Stepper Navigation Controls -->
    <div v-if="store.currentStep < 4" class="w-full flex justify-between gap-4 mt-6">
      <!-- Back Button -->
      <button 
        v-if="store.currentStep > 1"
        @click="goBack"
        type="button"
        class="flex-1 btn-brawl bg-purple-600 hover:bg-purple-500 text-white text-lg py-4 font-black uppercase shadow-[0_6px_0_0_#000]"
      >
        ◀ {{ store.t('btnBack') }}
      </button>
      <!-- Empty space spacer when no back button -->
      <div v-else class="flex-grow-0"></div>

      <!-- Next Button -->
      <button 
        @click="goNext"
        type="button"
        class="flex-grow btn-brawl bg-yellow-400 hover:bg-yellow-300 text-black text-lg py-4 font-black uppercase shadow-[0_6px_0_0_#000]"
      >
        {{ store.t('btnNext') }} ▶
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { useBrawlerStore } from '~/stores/brawler'

// Import subcomponents
import StepBasicInfo from '~/components/StepBasicInfo.vue'
import StepStatsAbilities from '~/components/StepStatsAbilities.vue'
import StepAvatar from '~/components/StepAvatar.vue'
import BrawlerCard from '~/components/BrawlerCard.vue'

const store = useBrawlerStore()
const playClickSound = inject('playClickSound', () => {})
const playErrorSound = inject('playErrorSound', () => {})

// Refs to component validation triggers
const step1Ref = ref(null)
const step2Ref = ref(null)
const step3Ref = ref(null)

// Step details configuration
const stepTitle = computed(() => {
  const stepTitles = {
    1: store.t('stepBasic'),
    2: store.t('stepStats'),
    3: store.t('stepAvatar'),
    4: store.t('stepPreview')
  }
  return stepTitles[store.currentStep] || ''
})

// Max step the user can jump to based on progress/validation
const maxAllowedStep = ref(1)

const progressWidth = computed(() => {
  const stepWidths = {
    1: '0%',
    2: '33.33%',
    3: '66.66%',
    4: '100%'
  }
  return stepWidths[store.currentStep] || '0%'
})

const getStepEmoji = (stepNum) => {
  const emojis = {
    1: '📝',
    2: '📊',
    3: '🎨',
    4: '🏆'
  }
  return emojis[stepNum] || ''
}

const getMilestoneClass = (stepNum) => {
  if (stepNum === store.currentStep) {
    // Current step
    return 'bg-yellow-400 text-black border-yellow-400 scale-110 shadow-[0_0_15px_#ffeb3b]'
  }
  if (stepNum < store.currentStep) {
    // Completed step
    return 'bg-green-500 text-white border-green-500'
  }
  // Future steps
  if (stepNum <= maxAllowedStep.value) {
    return 'bg-purple-800 text-purple-200 border-purple-950 hover:bg-purple-700'
  }
  return 'bg-purple-950 text-purple-400 border-purple-950 opacity-60 cursor-not-allowed'
}

// Navigation Triggers
const goBack = () => {
  playClickSound()
  store.prevStep()
}

const goNext = () => {
  let isValid = false
  
  if (store.currentStep === 1) {
    isValid = step1Ref.value?.validate()
  } else if (store.currentStep === 2) {
    isValid = step2Ref.value?.validate()
  } else if (store.currentStep === 3) {
    isValid = step3Ref.value?.validate()
  }

  if (isValid) {
    playClickSound()
    store.nextStep()
    if (store.currentStep > maxAllowedStep.value) {
      maxAllowedStep.value = store.currentStep
    }
  } else {
    playErrorSound()
  }
}

const jumpToStep = (stepNum) => {
  if (stepNum <= maxAllowedStep.value) {
    playClickSound()
    store.currentStep = stepNum
  } else {
    playErrorSound()
  }
}

// Watch store brawler resets to restart milestones
watch(() => store.currentStep, (val) => {
  if (val === 1 && store.name === '' && store.avatarUrl === null) {
    maxAllowedStep.value = 1
  }
})
</script>

<style>
/* Dynamic step transitions */
.slide-fade-enter-active {
  transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(0.6, -0.28, 0.735, 0.045);
}
.slide-fade-enter-from {
  transform: translateX(20px) scale(0.98);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateX(-20px) scale(0.98);
  opacity: 0;
}
</style>
