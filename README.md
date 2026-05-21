# 🎁 BrawlBox

**Create your own Brawl Stars character, bring it to life with AI, and download it as a card!**

BrawlBox is an interactive character creator web app designed for kids and Brawl Stars fans. Users can design their brawler step by step, generate an AI-powered avatar, and download the result as a professional-looking brawler card.

## ✨ Features

- 🎨 **4-Step Character Creator** — Name, rarity, class, stats, abilities, and avatar
- 🤖 **AI Avatar Generation** — Describe your brawler via voice or text to generate an AI character
- 🎤 **Voice Input** — Describe your brawler using your microphone (Web Speech API)
- 📥 **Card Download** — Download your brawler card as PNG rendered via Canvas 2D API
- 🎵 **Background Music** — Ambient game music generated with Web Audio API
- 🔊 **Sound Effects** — Click, success, and error sound feedback
- 🌐 **Multilingual** — Turkish and English language support
- 📱 **Responsive Design** — Mobile and desktop friendly
- 🎮 **Brawl Stars Theme** — Premium UI faithful to the game's aesthetics

## 🛠️ Tech Stack

| Technology | Usage |
|-----------|----------|
| [Nuxt 3](https://nuxt.com) | Full-stack framework |
| [Vue 3](https://vuejs.org) | Reactive UI |
| [Tailwind CSS v4](https://tailwindcss.com) | Styling |
| [Pinia](https://pinia.vuejs.org) | State management |
| [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) | Music & sound effects |
| [Canvas 2D API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) | Card rendering & download |
| [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) | Voice input |
| [Pollinations AI](https://pollinations.ai) | Free AI image generation |

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm run dev

# Production build
npm run build
```

## 🏗️ Project Structure

```
brawler-creator/
├── app/
│   ├── components/        # Vue components
│   │   ├── BrawlerCard.vue        # Card preview & Canvas download
│   │   ├── StepAvatar.vue         # AI avatar generation
│   │   ├── StepBasicInfo.vue      # Name, rarity, class selection
│   │   └── StepStatsAbilities.vue # Stats & abilities
│   ├── composables/       # Vue composables
│   │   └── useGameMusic.js        # Web Audio music system
│   ├── layouts/           # Page layouts
│   ├── pages/             # Pages
│   └── stores/            # Pinia stores
│       └── brawler.ts             # Main app state & translations
├── server/
│   └── api/               # Server-side API routes
│       ├── generate-avatar.post.ts    # AI image generation
│       └── transform-avatar.post.ts   # Image transformation
└── nuxt.config.ts
```

## 👨‍💻 Developer

Design & development: **[@armutyus](https://x.com/armutyus)**

## 🤖 Built with AI

This project was developed through pair programming with **[Antigravity](https://deepmind.google)** — Google DeepMind's agentic AI coding assistant.

## 📄 License

This project is for personal use. Brawl Stars is a registered trademark of Supercell.
