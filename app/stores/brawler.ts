import { defineStore } from 'pinia'

export type RarityType = 'trophy_road' | 'rare' | 'super_rare' | 'epic' | 'mythic' | 'legendary' | 'chromatic'
export type ClassType = 'damage_dealer' | 'tank' | 'assassin' | 'support' | 'controller' | 'marksman'

export interface BrawlerState {
  currentStep: number
  locale: 'en' | 'tr'
  
  // Brawler Attributes
  name: string
  rarity: RarityType
  brawlerClass: ClassType
  
  health: number // 1 to 5 stars
  damage: number // 1 to 5 stars
  speed: number  // 1 to 5 stars
  
  attackName: string
  attackDesc: string
  superName: string
  superDesc: string
  
  avatarUrl: string | null
  
  // Rate Limiting
  aiGenerationsCount: number // how many used today
  lastAiResetDate: string | null // YYYY-MM-DD
}

const TRANSLATIONS = {
  en: {
    appTitle: "BRAWLBOX",
    appSubtitle: "Design your ultimate Brawl Stars champion!",
    step: "STEP {current} OF {total}",
    stepBasic: "BASIC INFO",
    stepStats: "STATS & ABILITIES",
    stepAvatar: "BRAWLER AVATAR",
    stepPreview: "FINAL CARD",
    
    // Navigation
    btnBack: "BACK",
    btnNext: "NEXT",
    
    // Step 1: Basic Info
    nameLabel: "BRAWLER NAME",
    namePlaceholder: "e.g., Colt, Shelly, Spike...",
    rarityLabel: "SELECT RARITY",
    classLabel: "SELECT CLASS",
    
    // Step 2: Stats & Abilities
    healthLabel: "HEALTH",
    damageLabel: "DAMAGE",
    speedLabel: "SPEED",
    attackNameLabel: "MAIN ATTACK NAME",
    attackNamePlaceholder: "e.g., Laser Blasters",
    attackDescLabel: "MAIN ATTACK DESCRIPTION",
    attackDescPlaceholder: "Describe how the attack behaves...",
    superNameLabel: "SUPER ABILITY NAME",
    superNamePlaceholder: "e.g., Bullet Storm",
    superDescLabel: "SUPER ABILITY DESCRIPTION",
    superDescPlaceholder: "Describe what the super ability does...",

    // Step 3: Avatar Setup
    aiPromptLabel: "DESCRIBE YOUR BRAWLER",
    aiPromptPlaceholder: "e.g., A cool ninja cat with cybernetic armor, brawl stars style... or tap 🎤 to speak!",
    aiBtnGenerate: "CREATE BRAWLER",
    aiBtnGenerating: "SUMMONING AI...",
    aiLimitStatus: "AI Generations remaining today: {count} / 20",
    aiLimitError: "Daily AI generation limit reached! Try again tomorrow.",
    promptRequiredError: "Please describe your brawler avatar first!",

    // Step 4: Preview & Download
    downloadBtn: "DOWNLOAD CARD",
    downloadingBtn: "SAVING CARD...",
    createNewBtn: "CREATE NEW BRAWLER",
    saveModalTitle: "SAVE YOUR CARD!",
    saveModalDesc: "Press and hold the card above to save it to your photos, or right-click to copy/save!",
    closeBtn: "CLOSE",
    
    // Classes
    class_damage_dealer: "Damage Dealer",
    class_damage_dealer_desc: "Deals heavy damage to enemies",
    class_tank: "Tank",
    class_tank_desc: "Has high health to absorb damage",
    class_assassin: "Assassin",
    class_assassin_desc: "Fast and deadly at close range",
    class_support: "Support",
    class_support_desc: "Heals or buffs teammates",
    class_controller: "Controller",
    class_controller_desc: "Controls areas and zones",
    class_marksman: "Marksman",
    class_marksman_desc: "Long-range sniper, high precision",

    // Rarities
    rarity_trophy_road: "Trophy Road",
    rarity_rare: "Rare",
    rarity_super_rare: "Super Rare",
    rarity_epic: "Epic",
    rarity_mythic: "Mythic",
    rarity_legendary: "Legendary",
    rarity_chromatic: "Chromatic",

    // Validation & Errors
    valNameEmpty: "Brawler name is required!",
    valNameLength: "Name must be 15 characters or less!",
    valAttackEmpty: "Attack name is required!",
    valAttackDescEmpty: "Attack description is required!",
    valSuperEmpty: "Super name is required!",
    valSuperDescEmpty: "Super description is required!",
    valAvatarEmpty: "Please upload or generate an avatar first!",
    
    // Speed levels
    speed_1: "Very Slow",
    speed_2: "Slow",
    speed_3: "Normal",
    speed_4: "Fast",
    speed_5: "Very Fast",
  },
  tr: {
    appTitle: "BRAWLBOX",
    appSubtitle: "Kendi Brawl Stars şampiyonunu tasarla!",
    step: "ADIM {current} / {total}",
    stepBasic: "TEMEL BİLGİLER",
    stepStats: "İSTATİSTİKLER & YETENEKLER",
    stepAvatar: "SAVAŞÇI PORTRESİ",
    stepPreview: "FİNAL KARTI",
    
    // Navigation
    btnBack: "GERİ",
    btnNext: "İLERİ",
    
    // Step 1: Basic Info
    nameLabel: "SAVAŞÇI ADI",
    namePlaceholder: "Örn: Colt, Shelly, Spike...",
    rarityLabel: "ENDERLİK SEÇİN",
    classLabel: "SINIF SEÇİN",
    
    // Step 2: Stats & Abilities
    healthLabel: "SAĞLIK",
    damageLabel: "HASAR",
    speedLabel: "HIZ",
    attackNameLabel: "ANA SALDIRI ADI",
    attackNamePlaceholder: "Örn: Lazer Tabancaları",
    attackDescLabel: "ANA SALDIRI AÇIKLAMASI",
    attackDescPlaceholder: "Saldırının nasıl çalıştığını açıkla...",
    superNameLabel: "SÜPER GÜÇ ADI",
    superNamePlaceholder: "Örn: Mermi Fırtınası",
    superDescLabel: "SÜPER GÜÇ AÇIKLAMASI",
    superDescPlaceholder: "Süper gücün ne yaptığını açıkla...",

    // Step 3: Avatar Setup
    aiPromptLabel: "SAVAŞÇINI TARİF ET",
    aiPromptPlaceholder: "Örn: Havalı sibernetik zırhlı ninja kedisi, brawl stars tarzı... veya 🎤 ile konuş!",
    aiBtnGenerate: "SAVAŞÇINI OLUŞTUR",
    aiBtnGenerating: "YAPAY ZEKA ÇAĞRILIYOR...",
    aiLimitStatus: "Kalan Yapay Zeka Hakkı: {count} / 20",
    aiLimitError: "Günlük yapay zeka limitine ulaşıldı! Yarın tekrar deneyin.",
    promptRequiredError: "Lütfen önce savaşçı portresini tarif edin!",

    // Step 4: Preview & Download
    downloadBtn: "KARTI İNDİR",
    downloadingBtn: "KAYDEDİLİYOR...",
    createNewBtn: "YENİ SAVAŞÇI OLUŞTUR",
    saveModalTitle: "KARTINI KAYDET!",
    saveModalDesc: "Fotoğraflarına kaydetmek için yukarıdaki karta basılı tut, ya da sağ tıklayıp kaydet!",
    closeBtn: "KAPAT",
    
    // Classes
    class_damage_dealer: "Hasar Verici",
    class_damage_dealer_desc: "Düşmanlara ağır hasar verir",
    class_tank: "Tank",
    class_tank_desc: "Hasarı emmek için yüksek sağlığa sahiptir",
    class_assassin: "Suikastçı",
    class_assassin_desc: "Yakın mesafede hızlı ve ölümcüldür",
    class_support: "Destek",
    class_support_desc: "Takım arkadaşlarını iyileştirir veya güçlendirir",
    class_controller: "Kontrolcü",
    class_controller_desc: "Bölgeleri kontrol eder ve yönlendirir",
    class_marksman: "Keskin Nişancı",
    class_marksman_desc: "Uzun menzilli nişancı, yüksek isabet",

    // Rarities
    rarity_trophy_road: "Kupa Yolu",
    rarity_rare: "Ender",
    rarity_super_rare: "Süper Ender",
    rarity_epic: "Destansı",
    rarity_mythic: "Gizemli",
    rarity_legendary: "Efsanevi",
    rarity_chromatic: "Kromatik",

    // Validation & Errors
    valNameEmpty: "Savaşçı adı girmelisin!",
    valNameLength: "İsim en fazla 15 karakter olmalı!",
    valAttackEmpty: "Saldırı adı zorunludur!",
    valAttackDescEmpty: "Saldırı açıklaması zorunludur!",
    valSuperEmpty: "Süper güç adı zorunludur!",
    valSuperDescEmpty: "Süper güç açıklaması zorunludur!",
    valAvatarEmpty: "Lütfen önce bir portre yükleyin veya oluşturun!",
    
    // Speed levels
    speed_1: "Çok Yavaş",
    speed_2: "Yavaş",
    speed_3: "Normal",
    speed_4: "Hızlı",
    speed_5: "Çok Hızlı",
  }
}

export const useBrawlerStore = defineStore('brawler', {
  state: (): BrawlerState => ({
    currentStep: 1,
    locale: 'en',
    
    // Initial Brawler values
    name: '',
    rarity: 'trophy_road',
    brawlerClass: 'damage_dealer',
    
    health: 3,
    damage: 3,
    speed: 3,
    
    attackName: '',
    attackDesc: '',
    superName: '',
    superDesc: '',
    
    avatarUrl: null,
    
    // AI limit tracking
    aiGenerationsCount: 0,
    lastAiResetDate: null
  }),
  
  getters: {
    // Translate text strings
    t: (state) => {
      return (key: string, replacements?: Record<string, string | number>) => {
        const dict = TRANSLATIONS[state.locale] || TRANSLATIONS.en
        let translation = (dict as any)[key] || key
        
        if (replacements) {
          Object.entries(replacements).forEach(([k, val]) => {
            translation = translation.replace(`{${k}}`, String(val))
          })
        }
        return translation
      }
    },
    
    // Get rarity-specific background color
    rarityColor: (state) => {
      const colors: Record<RarityType, string> = {
        trophy_road: '#00c2ff',
        rare: '#2a62ff',
        super_rare: '#00df2b',
        epic: '#d600ff',
        mythic: '#ff2e2e',
        legendary: '#ffc700',
        chromatic: '#ff5b89'
      }
      return colors[state.rarity] || '#00c2ff'
    },
    
    rarityText: (state) => {
      return (state.t(`rarity_${state.rarity}`))
    },
    
    classText: (state) => {
      return (state.t(`class_${state.brawlerClass}`))
    },
    
    classDesc: (state) => {
      return (state.t(`class_${state.brawlerClass}_desc`))
    },
    
    canUseAiGen: (state) => {
      return state.aiGenerationsCount < 20
    },
    
    remainingAiGens: (state) => {
      return Math.max(0, 20 - state.aiGenerationsCount)
    }
  },
  
  actions: {
    setLocale(lang: 'en' | 'tr') {
      this.locale = lang
    },
    
    nextStep() {
      if (this.currentStep < 4) {
        this.currentStep++
      }
    },
    
    prevStep() {
      if (this.currentStep > 1) {
        this.currentStep--
      }
    },
    
    setAvatar(url: string | null) {
      this.avatarUrl = url
    },
    
    loadRateLimiter() {
      if (process.client) {
        const today = new Date().toISOString().split('T')[0]
        const savedDate = localStorage.getItem('bs_ai_date')
        const savedCount = localStorage.getItem('bs_ai_count')
        
        if (savedDate === today) {
          this.aiGenerationsCount = savedCount ? parseInt(savedCount, 10) : 0
          this.lastAiResetDate = today
        } else {
          // New day, reset counter
          this.aiGenerationsCount = 0
          this.lastAiResetDate = today
          localStorage.setItem('bs_ai_date', today)
          localStorage.setItem('bs_ai_count', '0')
        }
      }
    },
    
    incrementAiCount() {
      if (process.client) {
        const today = new Date().toISOString().split('T')[0]
        this.loadRateLimiter()
        
        this.aiGenerationsCount++
        this.lastAiResetDate = today
        localStorage.setItem('bs_ai_date', today)
        localStorage.setItem('bs_ai_count', String(this.aiGenerationsCount))
      }
    },
    
    resetBrawler() {
      this.currentStep = 1
      this.name = ''
      this.rarity = 'trophy_road'
      this.brawlerClass = 'damage_dealer'
      this.health = 3
      this.damage = 3
      this.speed = 3
      this.attackName = ''
      this.attackDesc = ''
      this.superName = ''
      this.superDesc = ''
      this.avatarUrl = null
    }
  }
})
