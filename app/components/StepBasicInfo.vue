<template>
  <div class="space-y-6">
    <!-- Name Input -->
    <div class="space-y-2">
      <label class="block text-lg font-black tracking-wide text-yellow-300 drop-shadow-[0_2px_0_rgba(0,0,0,1)] uppercase">
        {{ store.t('nameLabel') }}
      </label>
      <div class="relative">
        <input 
          v-model="nameInput"
          type="text" 
          :placeholder="store.t('namePlaceholder')"
          class="w-full text-xl font-bold bg-purple-950/80 border-4 border-black rounded-2xl px-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 transition-all uppercase"
          maxlength="15"
          @input="validateName"
        />
        <div class="absolute right-4 top-1/2 -translate-y-1/2 font-black text-xs text-purple-300">
          {{ nameInput.length }}/15
        </div>
      </div>
      <p v-if="nameError" class="text-red-400 font-extrabold text-sm uppercase drop-shadow-[0_1px_0_rgba(0,0,0,1)]">
        ⚠ {{ nameError }}
      </p>
    </div>

    <!-- Rarity Select -->
    <div class="space-y-2">
      <label class="block text-lg font-black tracking-wide text-yellow-300 drop-shadow-[0_2px_0_rgba(0,0,0,1)] uppercase">
        {{ store.t('rarityLabel') }}
      </label>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button 
          v-for="rarity in rarities" 
          :key="rarity.id"
          @click="selectRarity(rarity.id)"
          type="button"
          class="brawl-card p-3 font-black text-sm uppercase transition-all duration-75 relative overflow-hidden flex flex-col items-center justify-center text-center select-none"
          :style="{
            backgroundColor: rarity.color,
            color: '#000',
            borderColor: store.rarity === rarity.id ? '#ffeb3b' : '#000000',
            borderWidth: store.rarity === rarity.id ? '6px' : '4px',
            transform: store.rarity === rarity.id ? 'scale(1.05) skewX(-4deg)' : 'skewX(-4deg)',
            boxShadow: store.rarity === rarity.id ? '0px 0px 15px #ffeb3b, 4px 4px 0px #000' : '4px 4px 0px #000'
          }"
        >
          <!-- Star Accent for legendary/chromatic/epic -->
          <div v-if="['legendary', 'chromatic', 'mythic'].includes(rarity.id)" class="absolute -right-2 -top-2 w-8 h-8 opacity-20">
            ★
          </div>
          <span class="text-xl mb-1">{{ rarity.emoji }}</span>
          <span class="text-xs md:text-sm tracking-wide leading-none pt-1 select-none">
            {{ store.t(`rarity_${rarity.id}`) }}
          </span>
        </button>
      </div>
    </div>

    <!-- Class Select -->
    <div class="space-y-2">
      <label class="block text-lg font-black tracking-wide text-yellow-300 drop-shadow-[0_2px_0_rgba(0,0,0,1)] uppercase">
        {{ store.t('classLabel') }}
      </label>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
        <button 
          v-for="cls in classes" 
          :key="cls.id"
          @click="selectClass(cls.id)"
          type="button"
          class="p-3 font-bold rounded-2xl border-4 bg-purple-900/60 hover:bg-purple-900/90 text-left transition-all duration-75 flex items-start space-x-3"
          :class="store.brawlerClass === cls.id ? 'border-yellow-400 ring-4 ring-yellow-400/20 bg-purple-800' : 'border-black'"
          :style="{
            transform: store.brawlerClass === cls.id ? 'translateY(-2px)' : 'none'
          }"
        >
          <div class="text-2xl mt-1 p-1 bg-black/30 rounded-lg flex-shrink-0">
            {{ cls.emoji }}
          </div>
          <div class="min-w-0">
            <h4 class="font-extrabold text-sm md:text-base leading-none text-yellow-300 uppercase truncate">
              {{ store.t(`class_${cls.id}`) }}
            </h4>
            <p class="text-[10px] text-purple-200 leading-tight mt-1 line-clamp-2">
              {{ store.t(`class_${cls.id}_desc`) }}
            </p>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, inject } from 'vue'
import { useBrawlerStore } from '~/stores/brawler'

const store = useBrawlerStore()
const playClickSound = inject('playClickSound', () => {})

const nameInput = ref(store.name)
const nameError = ref('')

const rarities = [
  { id: 'trophy_road', color: '#00c2ff', emoji: '🏆' },
  { id: 'rare', color: '#2a62ff', emoji: '⭐' },
  { id: 'super_rare', color: '#00df2b', emoji: '💎' },
  { id: 'epic', color: '#d600ff', emoji: '👑' },
  { id: 'mythic', color: '#ff2e2e', emoji: '🔥' },
  { id: 'legendary', color: '#ffc700', emoji: '⚡' },
  { id: 'chromatic', color: '#ff5b89', emoji: '🌈' }
]

const classes = [
  { id: 'damage_dealer', emoji: '💥' },
  { id: 'tank', emoji: '🛡️' },
  { id: 'assassin', emoji: '🗡️' },
  { id: 'support', emoji: '❤️' },
  { id: 'controller', emoji: '🌀' },
  { id: 'marksman', emoji: '🎯' }
]

const validateName = () => {
  store.name = nameInput.value.trim()
  if (!store.name) {
    nameError.value = store.t('valNameEmpty')
    return false
  }
  if (store.name.length > 15) {
    nameError.value = store.t('valNameLength')
    return false
  }
  nameError.value = ''
  return true
}

const selectRarity = (rarityId) => {
  playClickSound()
  store.rarity = rarityId
}

const selectClass = (classId) => {
  playClickSound()
  store.brawlerClass = classId
}

// Expose validation function to parent
defineExpose({
  validate: () => {
    return validateName()
  }
})
</script>
