// Web Audio API sound effects - no external files needed
let audioCtx: AudioContext | null = null

function getCtx() {
  if (!audioCtx) audioCtx = new AudioContext()
  return audioCtx
}

function playTone(freq: number, duration: number, type: OscillatorType = 'sine', vol = 0.3) {
  try {
    const ctx = getCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.value = freq
    gain.gain.value = vol
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + duration)
  } catch {}
}

export function playCorrect() {
  playTone(523, 0.1, 'sine', 0.4) // C5
  setTimeout(() => playTone(659, 0.1, 'sine', 0.4), 100) // E5
  setTimeout(() => playTone(784, 0.15, 'sine', 0.4), 200) // G5
}

export function playWrong() {
  playTone(200, 0.15, 'sawtooth', 0.2)
  setTimeout(() => playTone(180, 0.2, 'sawtooth', 0.2), 150)
}

export function playTap() {
  playTone(800, 0.05, 'sine', 0.15)
}

export function playComplete() {
  // Fanfare
  playTone(523, 0.15, 'sine', 0.3) // C
  setTimeout(() => playTone(659, 0.15, 'sine', 0.3), 150) // E
  setTimeout(() => playTone(784, 0.15, 'sine', 0.3), 300) // G
  setTimeout(() => playTone(1047, 0.3, 'sine', 0.4), 450) // C6
}

export function playLevelUp() {
  const notes = [523, 587, 659, 698, 784, 880, 988, 1047]
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.08, 'sine', 0.25), i * 60)
  })
}

export function playBadge() {
  playTone(880, 0.1, 'triangle', 0.3)
  setTimeout(() => playTone(1109, 0.1, 'triangle', 0.3), 100)
  setTimeout(() => playTone(1319, 0.2, 'triangle', 0.4), 200)
}

export function playStar() {
  playTone(1200, 0.08, 'sine', 0.2)
}
