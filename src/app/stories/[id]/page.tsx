'use client'
import { useState, useEffect, useRef, use } from 'react'
import { useRouter } from 'next/navigation'
import { stories } from '@/data/stories'
import { dbPut, dbGet, awardBadge } from '@/lib/db'
import { speak as cloudSpeak, stop as cloudStop, isSpeaking as cloudIsSpeaking } from '@/lib/tts'
import Confetti from '@/components/Confetti'
import StoryAnimation from '@/components/StoryAnimation'

export default function StoryDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const story = stories.find(s => s.id === id)
  const storyIndex = stories.findIndex(s => s.id === id)
  const [completed, setCompleted] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const speakingRef = useRef(false)
  const [currentParagraph, setCurrentParagraph] = useState(-1)

  useEffect(() => {
    if (!story) return
    dbGet('stories', id).then(r => { if (r) setCompleted(true) })
  }, [id, story])

  if (!story) return <div style={{ padding: '40px', textAlign: 'center' }}>이야기를 찾을 수 없어요 😢</div>

  const handleComplete = async () => {
    await dbPut('stories', { storyId: id, completedAt: new Date().toISOString() })
    setCompleted(true)
    setShowConfetti(true)
    await awardBadge(`story-${id}`)
    // Check all stories badge
    const { dbGetAll } = await import('@/lib/db')
    const all = await dbGetAll('stories')
    if (all.length >= stories.length) await awardBadge('all-stories')
  }

  const speakText = async (text: string, index: number) => {
    if (speakingRef.current) {
      cloudStop()
      speakingRef.current = false
      setSpeaking(false)
      setCurrentParagraph(-1)
      return
    }
    speakingRef.current = true
    setSpeaking(true)
    setCurrentParagraph(index)
    await cloudSpeak(text, () => {
      speakingRef.current = false
      setSpeaking(false)
      setCurrentParagraph(-1)
    })
  }

  const speakAll = async () => {
    if (speakingRef.current) {
      cloudStop()
      speakingRef.current = false
      setSpeaking(false)
      setCurrentParagraph(-1)
      return
    }
    speakingRef.current = true
    setSpeaking(true)
    for (let i = 0; i < story.paragraphs.length; i++) {
      if (!speakingRef.current) break
      setCurrentParagraph(i)
      await new Promise<void>(resolve => {
        cloudSpeak(story.paragraphs[i], resolve)
      })
    }
    speakingRef.current = false
    setSpeaking(false)
    setCurrentParagraph(-1)
  }

  const prevStory = storyIndex > 0 ? stories[storyIndex - 1] : null
  const nextStory = storyIndex < stories.length - 1 ? stories[storyIndex + 1] : null

  return (
    <div>
      <Confetti trigger={showConfetti} />

      {/* Header */}
      <div className="app-header" style={{ textAlign: 'center' }}>
        <div className="animate-float" style={{ fontSize: '48px', marginBottom: '8px' }}>{story.emoji}</div>
        <h1 style={{ fontSize: '26px', fontWeight: 800 }}>{story.title}</h1>
        <p style={{ fontSize: '14px', opacity: 0.8, marginTop: '4px' }}>{story.verseRef}</p>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '12px' }}>
          <span className="badge badge-gold">{story.category}</span>
          <span className="badge badge-sky">{story.ageRange}</span>
          {completed && <span className="badge badge-mint">✅ 완독</span>}
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Story Animation */}
        <StoryAnimation storyId={id} />

        {/* TTS Controls */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={speakAll}>
            {speaking ? '⏸️ 멈추기' : '🔊 읽어주기'}
          </button>
        </div>

        {/* Story Paragraphs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {story.paragraphs.map((p, i) => (
            <div
              key={i}
              className="animate-fadeInUp"
              style={{
                animationDelay: `${i * 0.05}s`,
                opacity: 0,
                padding: '16px',
                borderRadius: '16px',
                background: currentParagraph === i ? 'var(--gold-soft)' : 'white',
                border: currentParagraph === i ? '2px solid var(--gold)' : '1px solid #f0f0f0',
                fontSize: '17px',
                lineHeight: 1.8,
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
              onClick={() => speakText(p, i)}
            >
              {p}
            </div>
          ))}
        </div>

        {/* Verse & Lesson */}
        <div className="card card-verse" style={{ marginTop: '24px', textAlign: 'center', padding: '24px' }}>
          <div style={{ fontSize: '20px', marginBottom: '8px' }}>📜</div>
          <p style={{ fontSize: '16px', fontWeight: 600, lineHeight: 1.7, fontStyle: 'italic' }}>"{story.verse}"</p>
          <p style={{ fontSize: '13px', color: 'var(--text-light)', marginTop: '8px' }}>{story.verseRef}</p>
        </div>

        <div className="card" style={{ marginTop: '12px', padding: '20px', background: 'linear-gradient(135deg, #fff 0%, var(--mint-soft) 100%)' }}>
          <p style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px' }}>💡 오늘의 교훈</p>
          <p style={{ fontSize: '16px', lineHeight: 1.7 }}>{story.lesson}</p>
        </div>

        {/* Complete Button */}
        {!completed && (
          <button className="btn btn-gold btn-block btn-lg" style={{ marginTop: '20px' }} onClick={handleComplete}>
            ✅ 다 읽었어요!
          </button>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px', marginBottom: '20px' }}>
          {prevStory ? (
            <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={() => router.push(`/stories/${prevStory.id}`)}>
              ← {prevStory.title}
            </button>
          ) : <div style={{ flex: 1 }} />}
          {nextStory && (
            <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => router.push(`/stories/${nextStory.id}`)}>
              {nextStory.title} →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
