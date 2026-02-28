// Google Cloud TTS with browser fallback
let speaking = false
let currentAudio: HTMLAudioElement | null = null
const audioCache = new Map<string, string>()

export async function speak(text: string, onEnd?: () => void) {
  if (typeof window === 'undefined') { onEnd?.(); return }
  stop()
  speaking = true

  try {
    let audioUrl = audioCache.get(text)
    if (!audioUrl) {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      if (!res.ok) throw new Error('API error')
      const blob = await res.blob()
      audioUrl = URL.createObjectURL(blob)
      audioCache.set(text, audioUrl)
    }
    const audio = new Audio(audioUrl)
    currentAudio = audio
    audio.onended = () => { speaking = false; currentAudio = null; onEnd?.() }
    audio.onerror = () => { speaking = false; currentAudio = null; onEnd?.() }
    await audio.play()
  } catch {
    speaking = false
    onEnd?.()
  }
}

export function stop() {
  speaking = false
  if (currentAudio) { currentAudio.pause(); currentAudio = null }
}

export function isSpeaking() { return speaking }
