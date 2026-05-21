// Warm & fun game-lobby music using Web Audio API
// Chill but bouncy, with rhythmic energy

export const useGameMusic = () => {
  let audioCtx = null
  let masterGain = null
  let isPlaying = false
  let loopTimer = null
  let activeNodes = []
  const VOLUME = 0.35

  const initAudio = () => {
    if (audioCtx) return
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    masterGain = audioCtx.createGain()
    masterGain.gain.value = VOLUME
    masterGain.connect(audioCtx.destination)
  }

  const playTone = (freq, startTime, duration, type = 'sine', vol = 0.3) => {
    if (!audioCtx || !isPlaying) return

    const osc = audioCtx.createOscillator()
    const env = audioCtx.createGain()

    osc.type = type
    osc.frequency.value = freq

    env.gain.setValueAtTime(0, startTime)
    env.gain.linearRampToValueAtTime(vol, startTime + 0.03)
    env.gain.setValueAtTime(vol * 0.7, startTime + duration * 0.5)
    env.gain.linearRampToValueAtTime(0, startTime + duration)

    osc.connect(env)
    env.connect(masterGain)
    osc.start(startTime)
    osc.stop(startTime + duration + 0.01)

    activeNodes.push({ osc, env })
    osc.onended = () => {
      activeNodes = activeNodes.filter(n => n.osc !== osc)
    }
  }

  const playPad = (freqs, startTime, duration) => {
    for (const freq of freqs) {
      playTone(freq, startTime, duration, 'sine', 0.1)
    }
  }

  // Percussion hit (filtered noise burst)
  const playKick = (startTime) => {
    if (!audioCtx || !isPlaying) return
    const osc = audioCtx.createOscillator()
    const env = audioCtx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(120, startTime)
    osc.frequency.exponentialRampToValueAtTime(40, startTime + 0.12)
    env.gain.setValueAtTime(0.4, startTime)
    env.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15)
    osc.connect(env)
    env.connect(masterGain)
    osc.start(startTime)
    osc.stop(startTime + 0.16)
    activeNodes.push({ osc, env })
    osc.onended = () => { activeNodes = activeNodes.filter(n => n.osc !== osc) }
  }

  const playHihat = (startTime) => {
    if (!audioCtx || !isPlaying) return
    // Two detuned high oscillators = noise-like hihat
    for (const freq of [6000, 8500]) {
      const osc = audioCtx.createOscillator()
      const env = audioCtx.createGain()
      osc.type = 'square'
      osc.frequency.value = freq
      env.gain.setValueAtTime(0.04, startTime)
      env.gain.exponentialRampToValueAtTime(0.001, startTime + 0.05)
      osc.connect(env)
      env.connect(masterGain)
      osc.start(startTime)
      osc.stop(startTime + 0.06)
      activeNodes.push({ osc, env })
      osc.onended = () => { activeNodes = activeNodes.filter(n => n.osc !== osc) }
    }
  }

  const N = {
    C2: 65.41, E2: 82.41, G2: 98.00, A2: 110.00, B2: 123.47,
    C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
    C4: 261.63, D4: 293.66, E4: 329.63, G4: 392.00, A4: 440.00
  }

  const scheduleLoop = () => {
    if (!isPlaying || !audioCtx) return

    const now = audioCtx.currentTime + 0.06
    const BPM = 95
    const beat = 60 / BPM // ~0.63s

    // === PAD (warm background) ===
    playPad([N.C3, N.E3, N.G3], now, beat * 4)
    playPad([N.A2, N.C3, N.E3], now + beat * 4, beat * 4)
    playPad([N.E2, N.G2, N.B2], now + beat * 8, beat * 4)
    playPad([N.G2, N.B2, N.D3], now + beat * 12, beat * 4)

    // === BASS (bouncy triangle wave) ===
    const bass = [
      { n: N.C2, t: 0 }, { n: N.C2, t: 1 }, { n: N.C2, t: 2 }, { n: N.G2, t: 3 },
      { n: N.A2, t: 4 }, { n: N.A2, t: 5 }, { n: N.A2, t: 6 }, { n: N.E2, t: 7 },
      { n: N.E2, t: 8 }, { n: N.E2, t: 9 }, { n: N.G2, t: 10 }, { n: N.G2, t: 11 },
      { n: N.G2, t: 12 }, { n: N.A2, t: 13 }, { n: N.G2, t: 14 }, { n: N.C2, t: 15 },
    ]
    for (const b of bass) {
      playTone(b.n, now + b.t * beat, beat * 0.7, 'triangle', 0.28)
    }

    // === MELODY (bouncy, fun) ===
    const melody = [
      // Phrase 1 (upbeat bounce)
      { n: N.E3, t: 0, d: 0.5 }, { n: N.G3, t: 0.5, d: 0.5 },
      { n: N.A3, t: 1, d: 1 }, { n: N.G3, t: 2, d: 0.5 },
      { n: N.C4, t: 2.5, d: 1.5 },
      // Phrase 2 (response)
      { n: N.A3, t: 4, d: 0.5 }, { n: N.G3, t: 4.5, d: 0.5 },
      { n: N.E3, t: 5, d: 1 }, { n: N.D3, t: 6, d: 0.5 },
      { n: N.E3, t: 6.5, d: 1.5 },
      // Phrase 3 (higher energy climb)
      { n: N.G3, t: 8, d: 0.5 }, { n: N.A3, t: 8.5, d: 0.5 },
      { n: N.C4, t: 9, d: 0.5 }, { n: N.D4, t: 9.5, d: 1 },
      { n: N.C4, t: 10.5, d: 0.5 }, { n: N.A3, t: 11, d: 1 },
      // Phrase 4 (playful resolve)
      { n: N.E4, t: 12, d: 0.75 }, { n: N.D4, t: 12.75, d: 0.75 },
      { n: N.C4, t: 13.5, d: 0.5 }, { n: N.A3, t: 14, d: 0.5 },
      { n: N.G3, t: 14.5, d: 1.5 },
    ]
    for (const m of melody) {
      playTone(m.n, now + m.t * beat, m.d * beat, 'sine', 0.22)
    }

    // === COUNTER MELODY (subtle harmony) ===
    const counter = [
      { n: N.C4, t: 1, d: 1 },
      { n: N.E4, t: 5, d: 1 },
      { n: N.G4, t: 9, d: 0.75 },
      { n: N.A4, t: 13, d: 0.75 },
    ]
    for (const c of counter) {
      playTone(c.n, now + c.t * beat, c.d * beat, 'sine', 0.07)
    }

    // === RHYTHM (kick + hihat pattern) ===
    for (let i = 0; i < 16; i++) {
      // Kick on beats 0, 2, 4, 6...
      if (i % 2 === 0) playKick(now + i * beat)
      // Hihat on every beat
      playHihat(now + i * beat)
      // Extra hihat on off-beats for groove
      if (i % 2 === 1) playHihat(now + (i + 0.5) * beat)
    }

    // Loop = 16 beats
    const loopDuration = beat * 16

    loopTimer = setTimeout(() => {
      if (isPlaying) scheduleLoop()
    }, (loopDuration - 0.15) * 1000)
  }

  const killAllSounds = () => {
    for (const node of activeNodes) {
      try {
        node.osc.stop(0)
        node.osc.disconnect()
        node.env.disconnect()
      } catch (e) { /* already stopped */ }
    }
    activeNodes = []
  }

  const play = () => {
    initAudio()
    if (audioCtx.state === 'suspended') audioCtx.resume()
    killAllSounds() // Prevent overlap
    isPlaying = true
    masterGain.gain.value = VOLUME
    scheduleLoop()
  }

  const pause = () => {
    isPlaying = false
    if (loopTimer) { clearTimeout(loopTimer); loopTimer = null }
    killAllSounds()
    if (masterGain) masterGain.gain.value = 0
  }

  const toggle = () => {
    if (isPlaying) pause()
    else play()
    return isPlaying
  }

  const getIsPlaying = () => isPlaying

  const destroy = () => {
    pause()
    if (audioCtx) { audioCtx.close(); audioCtx = null }
  }

  return { play, pause, toggle, getIsPlaying, destroy }
}
