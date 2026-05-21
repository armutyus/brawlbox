<template>
  <div class="space-y-6">
    <!-- Star/Bar Stats Selector -->
    <div class="space-y-4 bg-purple-950/40 p-4 rounded-2xl border-2 border-black/40">
      <!-- Health Stat -->
      <div class="space-y-1">
        <div class="flex justify-between items-center">
          <span class="font-extrabold text-sm md:text-base tracking-wide text-green-300 uppercase flex items-center gap-1.5">
            💚 {{ store.t('healthLabel') }}
          </span>
          <span class="font-black text-sm text-green-400 bg-black/30 px-2 py-0.5 rounded-lg">
            {{ store.health * 2000 }} HP
          </span>
        </div>
        <div class="flex space-x-1.5 h-8">
          <button 
            v-for="i in 5" 
            :key="i"
            @click="setStat('health', i)"
            type="button"
            class="flex-1 rounded-lg border-2 border-black transition-all hover:scale-105 duration-75"
            :class="i <= store.health ? 'bg-emerald-500 shadow-[0_2px_0_#000]' : 'bg-purple-950/60'"
            aria-label="Set Health"
          ></button>
        </div>
      </div>

      <!-- Damage Stat -->
      <div class="space-y-1">
        <div class="flex justify-between items-center">
          <span class="font-extrabold text-sm md:text-base tracking-wide text-red-300 uppercase flex items-center gap-1.5">
            💥 {{ store.t('damageLabel') }}
          </span>
          <span class="font-black text-sm text-red-400 bg-black/30 px-2 py-0.5 rounded-lg">
            {{ store.damage * 450 }} DMG
          </span>
        </div>
        <div class="flex space-x-1.5 h-8">
          <button 
            v-for="i in 5" 
            :key="i"
            @click="setStat('damage', i)"
            type="button"
            class="flex-1 rounded-lg border-2 border-black transition-all hover:scale-105 duration-75"
            :class="i <= store.damage ? 'bg-red-500 shadow-[0_2px_0_#000]' : 'bg-purple-950/60'"
            aria-label="Set Damage"
          ></button>
        </div>
      </div>

      <!-- Speed Stat -->
      <div class="space-y-1">
        <div class="flex justify-between items-center">
          <span class="font-extrabold text-sm md:text-base tracking-wide text-yellow-300 uppercase flex items-center gap-1.5">
            ⚡ {{ store.t('speedLabel') }}
          </span>
          <span class="font-black text-sm text-yellow-400 bg-black/30 px-2 py-0.5 rounded-lg uppercase">
            {{ store.t(`speed_${store.speed}`) }}
          </span>
        </div>
        <div class="flex space-x-1.5 h-8">
          <button 
            v-for="i in 5" 
            :key="i"
            @click="setStat('speed', i)"
            type="button"
            class="flex-1 rounded-lg border-2 border-black transition-all hover:scale-105 duration-75"
            :class="i <= store.speed ? 'bg-yellow-400 shadow-[0_2px_0_#000]' : 'bg-purple-950/60'"
            aria-label="Set Speed"
          ></button>
        </div>
      </div>
    </div>

    <!-- Abilities Text Inputs -->
    <div class="space-y-4">
      <!-- Main Attack -->
      <div class="bg-blue-950/40 p-4 rounded-2xl border-2 border-blue-500/20 space-y-3">
        <h4 class="font-extrabold text-blue-300 uppercase text-sm border-b border-blue-500/20 pb-1 flex items-center gap-1.5">
          ⚔ {{ store.t('attackNameLabel') }}
        </h4>
        <div class="space-y-2">
          <input 
            v-model="attackName"
            type="text" 
            :placeholder="store.t('attackNamePlaceholder')"
            class="w-full text-base font-bold bg-purple-950/80 border-2 border-black rounded-xl px-3 py-2 text-white placeholder-purple-300 focus:outline-none focus:border-blue-400 transition-all uppercase"
            maxlength="20"
            @input="validateForm"
          />
          <textarea 
            v-model="attackDesc"
            rows="2"
            :placeholder="store.t('attackDescPlaceholder')"
            class="w-full text-sm font-bold bg-purple-950/80 border-2 border-black rounded-xl px-3 py-2 text-white placeholder-purple-300 focus:outline-none focus:border-blue-400 transition-all"
            maxlength="100"
            @input="validateForm"
          ></textarea>
        </div>
      </div>

      <!-- Super Ability -->
      <div class="bg-amber-950/40 p-4 rounded-2xl border-2 border-amber-500/20 space-y-3">
        <h4 class="font-extrabold text-amber-300 uppercase text-sm border-b border-amber-500/20 pb-1 flex items-center gap-1.5">
          ⭐ {{ store.t('superNameLabel') }}
        </h4>
        <div class="space-y-2">
          <input 
            v-model="superName"
            type="text" 
            :placeholder="store.t('superNamePlaceholder')"
            class="w-full text-base font-bold bg-purple-950/80 border-2 border-black rounded-xl px-3 py-2 text-white placeholder-purple-300 focus:outline-none focus:border-amber-400 transition-all uppercase"
            maxlength="20"
            @input="validateForm"
          />
          <textarea 
            v-model="superDesc"
            rows="2"
            :placeholder="store.t('superDescPlaceholder')"
            class="w-full text-sm font-bold bg-purple-950/80 border-2 border-black rounded-xl px-3 py-2 text-white placeholder-purple-300 focus:outline-none focus:border-amber-400 transition-all"
            maxlength="100"
            @input="validateForm"
          ></textarea>
        </div>
      </div>
    </div>

    <!-- Error Text -->
    <p v-if="validationError" class="text-red-400 font-extrabold text-sm uppercase drop-shadow-[0_1px_0_rgba(0,0,0,1)]">
      ⚠ {{ validationError }}
    </p>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useBrawlerStore } from '~/stores/brawler'

const store = useBrawlerStore()
const playClickSound = inject('playClickSound', () => {})

const attackName = ref(store.attackName)
const attackDesc = ref(store.attackDesc)
const superName = ref(store.superName)
const superDesc = ref(store.superDesc)

const validationError = ref('')

const setStat = (stat, value) => {
  playClickSound()
  store[stat] = value
}

const validateForm = () => {
  store.attackName = attackName.value.trim()
  store.attackDesc = attackDesc.value.trim()
  store.superName = superName.value.trim()
  store.superDesc = superDesc.value.trim()

  if (!store.attackName) {
    validationError.value = store.t('valAttackEmpty')
    return false
  }
  if (!store.attackDesc) {
    validationError.value = store.t('valAttackDescEmpty')
    return false
  }
  if (!store.superName) {
    validationError.value = store.t('valSuperEmpty')
    return false
  }
  if (!store.superDesc) {
    validationError.value = store.t('valSuperDescEmpty')
    return false
  }
  
  validationError.value = ''
  return true
}

// Expose validation to parent wizard
defineExpose({
  validate: () => {
    return validateForm()
  }
})
</script>
