<template>
  <div class="space-y-6 flex flex-col items-center w-full">
    <!-- The Exportable Brawler Card Container -->
    <div 
      ref="cardNode" 
      class="w-full max-w-sm brawl-card overflow-hidden p-4 pt-5 pb-3.5 relative flex flex-col select-none aspect-[3/4]"
      :class="rarityGradient"
    >
      <!-- Background Grid Overlay for that game UI texture -->
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
      
      <!-- Top Badge: Rarity -->
      <div class="flex justify-between items-start z-10">
        <div 
          class="px-4 py-1.5 border-4 border-black text-black font-black uppercase text-xs tracking-wider transform -skew-x-12 shadow-[2px_2px_0_0_#000]"
          :style="{ backgroundColor: store.rarityColor }"
        >
          {{ store.rarityText }}
        </div>
        
        <!-- Class Badge -->
        <div class="px-3 py-1 border-4 border-black bg-black text-yellow-400 font-black uppercase text-[10px] tracking-wider transform -skew-x-12 flex items-center gap-1 shadow-[2px_2px_0_0_#000]">
          <span>{{ classEmoji }}</span>
          <span>{{ store.classText }}</span>
        </div>
      </div>

      <!-- Avatar & Stats Grid -->
      <div class="grid grid-cols-5 gap-3 mt-3 flex-grow z-10 items-stretch">
        <!-- Left Side: Power Stats -->
        <div class="col-span-2 flex flex-col justify-between py-1 space-y-3">
          <!-- Health Block -->
          <div class="space-y-1 bg-black/40 p-2 border-2 border-black rounded-xl flex-grow flex flex-col justify-center">
            <span class="text-[10px] font-black text-green-300 block uppercase leading-none">
              💚 {{ store.t('healthLabel') }}
            </span>
            <span class="text-xs font-black text-white leading-none pt-0.5">{{ store.health * 2000 }} HP</span>
            <div class="flex gap-0.5 mt-1">
              <div 
                v-for="i in 5" 
                :key="i" 
                class="h-2 flex-grow rounded border border-black"
                :class="i <= store.health ? 'bg-green-500' : 'bg-purple-950/50'"
              ></div>
            </div>
          </div>

          <!-- Damage Block -->
          <div class="space-y-1 bg-black/40 p-2 border-2 border-black rounded-xl flex-grow flex flex-col justify-center">
            <span class="text-[10px] font-black text-red-300 block uppercase leading-none">
              ⚔ {{ store.t('damageLabel') }}
            </span>
            <span class="text-xs font-black text-white leading-none pt-0.5">{{ store.damage * 450 }} DMG</span>
            <div class="flex gap-0.5 mt-1">
              <div 
                v-for="i in 5" 
                :key="i" 
                class="h-2 flex-grow rounded border border-black"
                :class="i <= store.damage ? 'bg-red-500' : 'bg-purple-950/50'"
              ></div>
            </div>
          </div>

          <!-- Speed Block -->
          <div class="space-y-1 bg-black/40 p-2 border-2 border-black rounded-xl flex-grow flex flex-col justify-center">
            <span class="text-[10px] font-black text-yellow-300 block uppercase leading-none">
              ⚡ {{ store.t('speedLabel') }}
            </span>
            <span class="text-xs font-black text-white leading-none pt-0.5 uppercase truncate">{{ store.t(`speed_${store.speed}`) }}</span>
            <div class="flex gap-0.5 mt-1">
              <div 
                v-for="i in 5" 
                :key="i" 
                class="h-2 flex-grow rounded border border-black"
                :class="i <= store.speed ? 'bg-yellow-400' : 'bg-purple-950/50'"
              ></div>
            </div>
          </div>
        </div>

        <!-- Right Side: Big Avatar View -->
        <div class="col-span-3 border-4 border-black rounded-2xl overflow-hidden bg-purple-950/80 shadow-[3px_3px_0_0_#000] relative">
          <img 
            v-if="store.avatarUrl" 
            :src="store.avatarUrl" 
            alt="Brawler Avatar" 
            :crossorigin="store.avatarUrl && store.avatarUrl.startsWith('data:') ? undefined : 'anonymous'"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center text-4xl">
            👤
          </div>
          <!-- Power Star Badge Overlay -->
          <div class="absolute bottom-1 right-1 bg-yellow-400 border-2 border-black text-black font-black text-[10px] px-1.5 rounded-md leading-none py-0.5 shadow-[1px_1px_0_#000]">
            ⚡ Lvl 11
          </div>
        </div>
      </div>

      <!-- Brawler Title Block -->
      <div class="mt-2.5 z-10 text-center transform -rotate-2 select-none">
        <h2 class="text-4xl md:text-5xl font-black text-yellow-400 brawl-text-outline uppercase leading-none truncate py-0.5">
          {{ store.name }}
        </h2>
      </div>

      <!-- Abilities Description Section -->
      <div class="mt-2.5 space-y-1.5 flex-grow flex flex-col justify-end z-10 pb-4">
        <!-- Attack details -->
        <div class="bg-black/50 p-2 border-2 border-black rounded-xl">
          <h4 class="font-extrabold text-[11px] text-blue-300 uppercase leading-none flex items-center gap-1">
            ⚔ {{ store.attackName }}
          </h4>
          <p class="text-[10px] text-purple-100 leading-tight mt-0.5">
            {{ store.attackDesc }}
          </p>
        </div>

        <!-- Super details -->
        <div class="bg-black/50 p-2 border-2 border-black rounded-xl">
          <h4 class="font-extrabold text-[11px] text-amber-300 uppercase leading-none flex items-center gap-1">
            ⭐ {{ store.superName }}
          </h4>
          <p class="text-[10px] text-purple-100 leading-tight mt-0.5">
            {{ store.superDesc }}
          </p>
        </div>
      </div>

      <!-- Watermark for Creator App -->
      <div class="absolute bottom-1 left-0 right-0 text-center text-[7.5px] text-white/30 font-black uppercase select-none z-20 tracking-widest">
        ★ BRAWLBOX ★ @ARMUTYUS
      </div>
    </div>

    <!-- Actions Panel -->
    <div class="w-full max-w-sm space-y-3">
      <!-- Download Button -->
      <button 
        type="button"
        @click="downloadCard"
        :disabled="isDownloading"
        class="w-full btn-brawl bg-yellow-400 text-black text-lg py-4 font-black uppercase shadow-[0_6px_0_0_#000] hover:bg-yellow-300"
      >
        <span v-if="isDownloading" class="animate-spin text-xl mr-2">⚙</span>
        <span>{{ isDownloading ? store.t('downloadingBtn') : store.t('downloadBtn') }}</span>
      </button>

      <!-- Reset / Start New Brawler Button -->
      <button 
        type="button"
        @click="createNew"
        class="w-full btn-brawl bg-purple-600 hover:bg-purple-500 text-white text-base py-3 font-black uppercase shadow-[0_6px_0_0_#000]"
      >
        🔄 {{ store.t('createNewBtn') }}
      </button>
    </div>

    <!-- Save Card Helper Modal (For mobile or fallback) -->
    <div 
      v-if="showSaveModal" 
      class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      @click.self="closeSaveModal"
    >
      <div class="bg-purple-900 border-4 border-black p-5 rounded-3xl max-w-sm w-full text-center relative shadow-[6px_6px_0_0_#000] animate-bounce-in">
        <!-- Close button in upper right -->
        <button 
          @click="closeSaveModal" 
          class="absolute -top-3 -right-3 bg-red-600 hover:bg-red-500 text-white border-4 border-black w-10 h-10 rounded-full flex items-center justify-center font-black text-lg shadow-[2px_2px_0_0_#000] active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000] transition-all"
        >
          ✕
        </button>
        
        <h3 class="text-2xl font-black text-yellow-400 brawl-text-outline uppercase tracking-wider mb-3">
          {{ store.t('saveModalTitle') }}
        </h3>
        
        <!-- Generated Image Preview -->
        <div class="border-4 border-black rounded-2xl overflow-hidden bg-purple-950/80 mb-4 shadow-[4px_4px_0_0_#000]">
          <img 
            :src="modalImageData" 
            alt="Saved Brawler Card" 
            class="w-full h-auto object-contain aspect-[3/4]"
          />
        </div>
        
        <p class="text-xs font-bold text-white uppercase leading-normal px-2">
          {{ store.t('saveModalDesc') }}
        </p>

        <button 
          @click="closeSaveModal" 
          class="mt-4 px-6 py-2 bg-yellow-400 hover:bg-yellow-300 border-4 border-black text-black font-black uppercase text-sm rounded-xl shadow-[2px_2px_0_0_#000] active:translate-y-0.5"
        >
          {{ store.t('closeBtn') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { useBrawlerStore } from '~/stores/brawler'

const store = useBrawlerStore()
const playClickSound = inject('playClickSound', () => {})
const playSuccessSound = inject('playSuccessSound', () => {})
const playErrorSound = inject('playErrorSound', () => {})

const cardNode = ref(null)
const isDownloading = ref(false)
const showSaveModal = ref(false)
const modalImageData = ref('')

const closeSaveModal = () => {
  playClickSound()
  showSaveModal.value = false
}

const classEmoji = computed(() => {
  const emojis = {
    damage_dealer: '💥',
    tank: '🛡️',
    assassin: '🗡️',
    support: '❤️',
    controller: '🌀',
    marksman: '🎯'
  }
  return emojis[store.brawlerClass] || '👾'
})

const rarityGradient = computed(() => {
  const gradients = {
    trophy_road: 'bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600 border-cyan-400',
    rare: 'bg-gradient-to-br from-blue-500 via-indigo-600 to-indigo-850 border-blue-600',
    super_rare: 'bg-gradient-to-br from-emerald-400 via-teal-600 to-green-700 border-emerald-500',
    epic: 'bg-gradient-to-br from-fuchsia-500 via-purple-600 to-indigo-900 border-fuchsia-500',
    mythic: 'bg-gradient-to-br from-rose-500 via-red-600 to-red-900 border-red-500',
    legendary: 'bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-700 border-yellow-400',
    chromatic: 'bg-gradient-to-tr from-pink-500 via-purple-600 to-amber-400 border-pink-400'
  }
  return gradients[store.rarity] || 'bg-gradient-to-br from-purple-800 to-indigo-950'
})

// ================ CANVAS 2D MANUAL CARD RENDERER ================
// Draws the card from store data directly — zero CSS dependency.

const loadImage = (src) => new Promise((resolve) => {
  if (!src) return resolve(null)
  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.onload = () => resolve(img)
  img.onerror = () => resolve(null)
  img.src = src
})

const roundRect = (ctx, x, y, w, h, r) => {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

const wrapText = (ctx, text, x, y, maxW, lineH, maxLines = 3) => {
  const words = (text || '').split(' ')
  let line = '', curY = y, count = 0
  for (const word of words) {
    const test = line + word + ' '
    if (ctx.measureText(test).width > maxW && line !== '') {
      ctx.fillText(line.trim(), x, curY)
      line = word + ' '
      curY += lineH
      if (++count >= maxLines) return curY
    } else {
      line = test
    }
  }
  ctx.fillText(line.trim(), x, curY)
  return curY + lineH
}

const renderCardToCanvas = async () => {
  // Wait for Google Fonts to finish loading
  await document.fonts.ready

  const S = 2
  const W = 384, H = 512
  const canvas = document.createElement('canvas')
  canvas.width = W * S
  canvas.height = H * S
  const ctx = canvas.getContext('2d')
  ctx.scale(S, S)

  // Rarity hex colors for gradient
  const gMap = {
    trophy_road: ['#22d3ee', '#0ea5e9', '#2563eb'],
    rare: ['#3b82f6', '#4f46e5', '#1e1b4b'],
    super_rare: ['#34d399', '#0d9488', '#15803d'],
    epic: ['#d946ef', '#9333ea', '#312e81'],
    mythic: ['#f43f5e', '#dc2626', '#7f1d1d'],
    legendary: ['#fbbf24', '#eab308', '#b45309'],
    chromatic: ['#ec4899', '#9333ea', '#fbbf24']
  }
  const gc = gMap[store.rarity] || gMap.trophy_road

  // --- BACKGROUND ---
  const grad = ctx.createLinearGradient(0, 0, W, H)
  grad.addColorStop(0, gc[0]); grad.addColorStop(0.5, gc[1]); grad.addColorStop(1, gc[2])
  ctx.fillStyle = grad
  roundRect(ctx, 0, 0, W, H, 24)
  ctx.fill()

  // Dot pattern
  ctx.fillStyle = 'rgba(255,255,255,0.12)'
  for (let gx = 8; gx < W; gx += 16)
    for (let gy = 8; gy < H; gy += 16) {
      ctx.beginPath(); ctx.arc(gx, gy, 1, 0, Math.PI * 2); ctx.fill()
    }

  // Card border
  ctx.strokeStyle = '#000'; ctx.lineWidth = 4
  roundRect(ctx, 2, 2, W - 4, H - 4, 22); ctx.stroke()

  const PX = 16, PT = 20, CW = W - PX * 2

  // --- RARITY BADGE (top-left, skewed) ---
  const rLabel = (store.rarityText || '').toUpperCase()
  ctx.save()
  ctx.font = '900 11px "Outfit", "Helvetica Neue", sans-serif'
  const rbW = ctx.measureText(rLabel).width + 28
  ctx.transform(1, 0, -0.21, 1, PX, PT)
  ctx.fillStyle = store.rarityColor || '#22d3ee'
  roundRect(ctx, 0, 0, rbW, 26, 4); ctx.fill()
  ctx.strokeStyle = '#000'; ctx.lineWidth = 3
  roundRect(ctx, 0, 0, rbW, 26, 4); ctx.stroke()
  ctx.fillStyle = '#000'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.fillText(rLabel, rbW / 2, 14)
  ctx.restore()

  // --- CLASS BADGE (top-right, skewed) ---
  const cLabel = (classEmoji.value + ' ' + (store.classText || '')).toUpperCase()
  ctx.save()
  ctx.font = '900 10px "Outfit", "Helvetica Neue", sans-serif'
  const cbW = ctx.measureText(cLabel).width + 22
  ctx.transform(1, 0, -0.21, 1, W - PX - cbW, PT)
  ctx.fillStyle = '#000'
  roundRect(ctx, 0, 0, cbW, 24, 4); ctx.fill()
  ctx.strokeStyle = '#000'; ctx.lineWidth = 3
  roundRect(ctx, 0, 0, cbW, 24, 4); ctx.stroke()
  ctx.fillStyle = '#facc15'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.fillText(cLabel, cbW / 2, 13)
  ctx.restore()

  // --- STATS + AVATAR AREA ---
  const areaY = PT + 40
  const statsW = Math.floor(CW * 0.38)
  const avatarX = PX + statsW + 12
  const avatarW = CW - statsW - 12
  const avatarH = 210

  // Stat box helper
  const drawStat = (y, h, emoji, label, value, count, color, lightColor) => {
    ctx.fillStyle = 'rgba(0,0,0,0.4)'
    roundRect(ctx, PX, y, statsW, h, 10); ctx.fill()
    ctx.strokeStyle = '#000'; ctx.lineWidth = 2
    roundRect(ctx, PX, y, statsW, h, 10); ctx.stroke()
    ctx.textAlign = 'left'; ctx.textBaseline = 'top'
    ctx.font = '900 9px "Outfit", sans-serif'
    ctx.fillStyle = lightColor
    ctx.fillText(emoji + ' ' + label.toUpperCase(), PX + 8, y + 7)
    ctx.font = '900 11px "Outfit", sans-serif'
    ctx.fillStyle = '#fff'
    ctx.fillText(value, PX + 8, y + 22)
    const bw = (statsW - 24) / 5
    for (let i = 0; i < 5; i++) {
      const bx = PX + 8 + i * (bw + 2)
      ctx.fillStyle = i < count ? color : 'rgba(30,0,60,0.5)'
      roundRect(ctx, bx, y + h - 16, bw - 2, 8, 3); ctx.fill()
      ctx.strokeStyle = '#000'; ctx.lineWidth = 1
      roundRect(ctx, bx, y + h - 16, bw - 2, 8, 3); ctx.stroke()
    }
  }

  const bH = Math.floor((avatarH - 16) / 3)
  drawStat(areaY, bH, '💚', store.t('healthLabel'), store.health * 2000 + ' HP', store.health, '#22c55e', '#86efac')
  drawStat(areaY + bH + 8, bH, '⚔', store.t('damageLabel'), store.damage * 450 + ' DMG', store.damage, '#ef4444', '#fca5a5')
  drawStat(areaY + (bH + 8) * 2, bH, '⚡', store.t('speedLabel'), store.t('speed_' + store.speed), store.speed, '#facc15', '#fde047')

  // --- AVATAR IMAGE ---
  ctx.fillStyle = 'rgba(30,0,60,0.8)'
  roundRect(ctx, avatarX, areaY, avatarW, avatarH, 14); ctx.fill()
  ctx.strokeStyle = '#000'; ctx.lineWidth = 4
  roundRect(ctx, avatarX, areaY, avatarW, avatarH, 14); ctx.stroke()

  const avImg = await loadImage(store.avatarUrl)
  if (avImg) {
    ctx.save()
    roundRect(ctx, avatarX + 2, areaY + 2, avatarW - 4, avatarH - 4, 12)
    ctx.clip()
    const ir = avImg.width / avImg.height, br = (avatarW - 4) / (avatarH - 4)
    let dw, dh, dx, dy
    if (ir > br) { dh = avatarH - 4; dw = dh * ir; dx = avatarX + 2 + ((avatarW - 4) - dw) / 2; dy = areaY + 2 }
    else { dw = avatarW - 4; dh = dw / ir; dx = avatarX + 2; dy = areaY + 2 + ((avatarH - 4) - dh) / 2 }
    ctx.drawImage(avImg, dx, dy, dw, dh)
    ctx.restore()
  } else {
    ctx.font = '48px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.fillStyle = '#fff'
    ctx.fillText('👤', avatarX + avatarW / 2, areaY + avatarH / 2)
  }

  // Lvl badge
  ctx.font = '900 9px "Outfit", sans-serif'
  const lvl = '⚡ Lvl 11', lvlW = ctx.measureText(lvl).width + 10
  ctx.fillStyle = '#facc15'
  roundRect(ctx, avatarX + avatarW - lvlW - 8, areaY + avatarH - 22, lvlW, 16, 4); ctx.fill()
  ctx.strokeStyle = '#000'; ctx.lineWidth = 2
  roundRect(ctx, avatarX + avatarW - lvlW - 8, areaY + avatarH - 22, lvlW, 16, 4); ctx.stroke()
  ctx.fillStyle = '#000'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.fillText(lvl, avatarX + avatarW - lvlW / 2 - 8, areaY + avatarH - 14)

  // --- LAYOUT: centered name between stats and abilities ---
  const abH = 44, pad = 8
  const statsEnd = areaY + avatarH // bottom of stats/avatar area
  // Position abilities so super box ends at H-54 (balanced bottom gap)
  const spY = H - 54 - abH  // super top
  const abY = spY - 8 - abH  // attack top
  // Name centered between stats bottom and attack top
  const nameY = Math.round((statsEnd + abY) / 2)

  // --- BRAWLER NAME ---
  ctx.save()
  ctx.translate(W / 2, nameY)
  ctx.rotate(-2 * Math.PI / 180)
  ctx.font = '900 42px "Bangers", cursive'
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  const nm = (store.name || '').toUpperCase()
  ctx.strokeStyle = '#000'; ctx.lineWidth = 8; ctx.lineJoin = 'round'
  ctx.strokeText(nm, 0, 0)
  ctx.fillStyle = '#000'; ctx.fillText(nm, 2, 3)
  ctx.fillStyle = '#facc15'; ctx.fillText(nm, 0, 0)
  ctx.restore()

  // --- ATTACK BOX ---
  ctx.fillStyle = 'rgba(0,0,0,0.5)'
  roundRect(ctx, PX, abY, CW, abH, 12); ctx.fill()
  ctx.strokeStyle = '#000'; ctx.lineWidth = 2
  roundRect(ctx, PX, abY, CW, abH, 12); ctx.stroke()
  ctx.font = '800 12px "Outfit", sans-serif'; ctx.fillStyle = '#93c5fd'
  ctx.textAlign = 'left'; ctx.textBaseline = 'top'
  ctx.fillText('⚔ ' + (store.attackName || '').toUpperCase(), PX + pad, abY + 6)
  ctx.font = '500 11px "Outfit", sans-serif'; ctx.fillStyle = '#e9d5ff'
  wrapText(ctx, store.attackDesc || '', PX + pad, abY + 20, CW - pad * 2, 12, 2)

  // --- SUPER BOX ---
  ctx.fillStyle = 'rgba(0,0,0,0.5)'
  roundRect(ctx, PX, spY, CW, abH, 12); ctx.fill()
  ctx.strokeStyle = '#000'; ctx.lineWidth = 2
  roundRect(ctx, PX, spY, CW, abH, 12); ctx.stroke()
  ctx.font = '800 12px "Outfit", sans-serif'; ctx.fillStyle = '#fcd34d'
  ctx.textAlign = 'left'; ctx.textBaseline = 'top'
  ctx.fillText('⭐ ' + (store.superName || '').toUpperCase(), PX + pad, spY + 6)
  ctx.font = '500 11px "Outfit", sans-serif'; ctx.fillStyle = '#e9d5ff'
  wrapText(ctx, store.superDesc || '', PX + pad, spY + 20, CW - pad * 2, 12, 2)

  // --- WATERMARK ---
  ctx.font = '900 7px "Outfit", sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.25)'
  ctx.textAlign = 'center'; ctx.textBaseline = 'bottom'
  ctx.fillText('★ BRAWLBOX ★ @ARMUTYUS', W / 2, H - 6)

  return canvas
}

// ================ DOWNLOAD HANDLER ================
const downloadCard = async () => {
  if (isDownloading.value) return
  playClickSound()
  isDownloading.value = true

  try {
    const canvas = await renderCardToCanvas()

    // Convert to Blob
    const blob = await new Promise((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/png', 1.0)
    })
    if (!blob) throw new Error('toBlob failed')

    const blobUrl = URL.createObjectURL(blob)
    const fileName = `${(store.name || 'brawler').replace(/\s+/g, '_')}_brawler_card.png`

    // Programmatic download via anchor click
    const a = document.createElement('a')
    a.href = blobUrl
    a.download = fileName
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    setTimeout(() => {
      document.body.removeChild(a)
      URL.revokeObjectURL(blobUrl)
    }, 500)

    playSuccessSound()

  } catch (err) {
    console.error('Card download failed:', err)
    playErrorSound()
  }

  isDownloading.value = false
}

const createNew = () => {
  playClickSound()
  store.resetBrawler()
}
</script>

<style scoped>
@keyframes bounceIn {
  0% { transform: scale(0.9); opacity: 0; }
  70% { transform: scale(1.05); opacity: 0.9; }
  100% { transform: scale(1); opacity: 1; }
}
.animate-bounce-in {
  animation: bounceIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}
</style>
