'use client'
import { useState, useEffect } from 'react'
import { verses, Verse } from '@/data/verses'
import { dbPut, dbGet, dbGetAll, awardBadge } from '@/lib/db'
import Confetti from '@/components/Confetti'

type Phase = 'list' | 'step1' | 'step2' | 'step3' | 'done'
const categories = ['전체', '사랑', '믿음', '용기', '감사', '기도'] as const
const catColors: Record<string, string> = { 사랑: 'var(--coral-soft)', 믿음: 'var(--sky-light)', 용기: 'var(--gold-soft)', 감사: 'var(--mint-soft)', 기도: 'var(--lavender)' }

interface Progress { verseId: string; step: number; completedAt: string; nextReviewDate: string }

export default function MemorizePage() {
  const [phase, setPhase] = useState<Phase>('list')
  const [selectedCat, setSelectedCat] = useState<string>('전체')
  const [currentVerse, setCurrentVerse] = useState<Verse | null>(null)
  const [progress, setProgress] = useState<Record<string, Progress>>({})
  const [showConfetti, setShowConfetti] = useState(false)
  // Step 2 state
  const [blanks, setBlanks] = useState<{ word: string; index: number; filled: boolean; userWord: string }[]>([])
  const [wordOptions, setWordOptions] = useState<string[]>([])
  const [currentBlankIdx, setCurrentBlankIdx] = useState(0)
  // Step 3 state
  const [shuffledWords, setShuffledWords] = useState<string[]>([])
  const [selectedWords, setSelectedWords] = useState<string[]>([])
  const [correctOrder, setCorrectOrder] = useState<string[]>([])
  const [step3Wrong, setStep3Wrong] = useState(false)

  useEffect(() => {
    dbGetAll<Progress>('verses').then(items => {
      const map: Record<string, Progress> = {}
      items.forEach(i => { map[i.verseId] = i })
      setProgress(map)
    })
  }, [])

  const filtered = selectedCat === '전체' ? verses : verses.filter(v => v.category === selectedCat)

  const startVerse = (verse: Verse) => {
    setCurrentVerse(verse)
    const p = progress[verse.id]
    const step = p ? Math.min(p.step + 1, 3) : 1
    if (step === 1) setPhase('step1')
    else if (step === 2) setupStep2(verse)
    else setupStep3(verse)
  }

  const setupStep2 = (verse: Verse) => {
    const words = verse.text.split(' ')
    // Pick 2-4 random words to blank out
    const numBlanks = Math.min(Math.max(2, Math.floor(words.length * 0.3)), 4)
    const indices = Array.from({ length: words.length }, (_, i) => i)
      .sort(() => Math.random() - 0.5)
      .slice(0, numBlanks)
      .sort((a, b) => a - b)
    const blankData = indices.map(i => ({ word: words[i], index: i, filled: false, userWord: '' }))
    const options = [...blankData.map(b => b.word)].sort(() => Math.random() - 0.5)
    setBlanks(blankData)
    setWordOptions(options)
    setCurrentBlankIdx(0)
    setCurrentVerse(verse)
    setPhase('step2')
  }

  const setupStep3 = (verse: Verse) => {
    const words = verse.text.split(' ')
    setCorrectOrder(words)
    setShuffledWords([...words].sort(() => Math.random() - 0.5))
    setSelectedWords([])
    setStep3Wrong(false)
    setCurrentVerse(verse)
    setPhase('step3')
  }

  const handleStep2Select = (word: string) => {
    const nextBlank = blanks.findIndex(b => !b.filled)
    if (nextBlank === -1) return
    const newBlanks = [...blanks]
    newBlanks[nextBlank] = { ...newBlanks[nextBlank], filled: true, userWord: word }
    setBlanks(newBlanks)
    setWordOptions(prev => { const i = prev.indexOf(word); const n = [...prev]; n.splice(i, 1); return n })
  }

  const checkStep2 = () => {
    const allCorrect = blanks.every(b => b.userWord === b.word)
    if (allCorrect) completeStep(2)
  }

  const handleStep3Select = (word: string, idx: number) => {
    const nextIdx = selectedWords.length
    if (word !== correctOrder[nextIdx]) {
      setStep3Wrong(true)
      setTimeout(() => setStep3Wrong(false), 500)
      return
    }
    const newSelected = [...selectedWords, word]
    setSelectedWords(newSelected)
    const newShuffled = [...shuffledWords]
    newShuffled.splice(idx, 1)
    setShuffledWords(newShuffled)
    if (newSelected.length === correctOrder.length) completeStep(3)
  }

  const completeStep = async (step: number) => {
    if (!currentVerse) return
    const nextReview = new Date()
    if (step === 1) nextReview.setDate(nextReview.getDate() + 1)
    else if (step === 2) nextReview.setDate(nextReview.getDate() + 3)
    else nextReview.setDate(nextReview.getDate() + 7)

    await dbPut('verses', {
      verseId: currentVerse.id,
      step,
      completedAt: new Date().toISOString(),
      nextReviewDate: nextReview.toISOString().split('T')[0],
    })
    setProgress(prev => ({ ...prev, [currentVerse.id]: { verseId: currentVerse.id, step, completedAt: new Date().toISOString(), nextReviewDate: nextReview.toISOString().split('T')[0] } }))

    if (step === 3) {
      setShowConfetti(true)
      await awardBadge(`verse-${currentVerse.id}`)
      const allVerses = await dbGetAll<Progress>('verses')
      const completed = allVerses.filter(v => v.step >= 3).length
      if (completed >= 1) await awardBadge('first-verse')
      if (completed >= 10) await awardBadge('ten-verses')
      if (completed >= 30) await awardBadge('all-verses')
    }
    setPhase('done')
  }

  const speakVerse = () => {
    if (!currentVerse) return
    const utter = new SpeechSynthesisUtterance(currentVerse.text)
    utter.lang = 'ko-KR'
    utter.rate = 0.8
    utter.pitch = 1.1
    speechSynthesis.speak(utter)
  }

  // === LIST ===
  if (phase === 'list') {
    const totalCompleted = Object.values(progress).filter(p => p.step >= 3).length
    return (
      <div>
        <div className="app-header">
          <h1 style={{ fontSize: '26px', fontWeight: 800 }}>💎 성경 암송</h1>
          <p style={{ fontSize: '14px', opacity: 0.8, marginTop: '4px' }}>{totalCompleted}/{verses.length}구절 암송 완료!</p>
          <div className="progress-bar" style={{ marginTop: '12px' }}>
            <div className="progress-fill" style={{ width: `${(totalCompleted / verses.length) * 100}%` }} />
          </div>
        </div>
        <div style={{ padding: '16px 20px 0' }}>
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '8px' }}>
            {categories.map(c => (
              <button
                key={c}
                className={`btn btn-sm ${selectedCat === c ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setSelectedCat(c)}
                style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div style={{ padding: '12px 20px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.map((verse, i) => {
            const p = progress[verse.id]
            const step = p?.step || 0
            return (
              <div
                key={verse.id}
                className="card card-verse animate-fadeInUp"
                style={{ cursor: 'pointer', animationDelay: `${i * 0.03}s`, opacity: 0 }}
                onClick={() => startVerse(verse)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '15px', lineHeight: 1.6, fontWeight: 500 }}>"{verse.text}"</p>
                    <p style={{ fontSize: '13px', color: 'var(--text-light)', marginTop: '6px' }}>{verse.reference}</p>
                  </div>
                  <span className="badge" style={{ background: catColors[verse.category] || '#eee', flexShrink: 0, marginLeft: '8px' }}>
                    {verse.category}
                  </span>
                </div>
                <div className="stars" style={{ marginTop: '8px' }}>
                  {[1, 2, 3].map(n => <span key={n} className={`star ${step >= n ? 'filled' : 'empty'}`} style={{ fontSize: '18px' }}>★</span>)}
                  <span style={{ fontSize: '12px', color: 'var(--text-light)', marginLeft: '6px' }}>
                    {step === 0 ? '시작하기' : step === 1 ? '따라읽기 완료' : step === 2 ? '빈칸채우기 완료' : '암송 완료! 🎉'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (!currentVerse) return null

  // === STEP 1: 따라 읽기 ===
  if (phase === 'step1') {
    return (
      <div>
        <div className="app-header" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '14px', opacity: 0.8 }}>1단계</p>
          <h1 style={{ fontSize: '24px', fontWeight: 800 }}>👀 따라 읽기</h1>
        </div>
        <div style={{ padding: '20px' }}>
          <div className="card card-verse" style={{ padding: '32px', textAlign: 'center' }}>
            <p style={{ fontSize: '22px', fontWeight: 700, lineHeight: 1.8 }}>"{currentVerse.text}"</p>
            <p style={{ fontSize: '14px', color: 'var(--text-light)', marginTop: '12px' }}>{currentVerse.reference}</p>
          </div>
          <button className="btn btn-primary btn-block" style={{ marginTop: '16px' }} onClick={speakVerse}>
            🔊 들어보기
          </button>
          <p style={{ textAlign: 'center', fontSize: '15px', color: 'var(--text-light)', marginTop: '16px', lineHeight: 1.6 }}>
            구절을 듣고 소리 내어 따라 읽어보세요!<br />준비되면 아래 버튼을 눌러주세요.
          </p>
          <button className="btn btn-gold btn-block btn-lg" style={{ marginTop: '20px' }} onClick={() => completeStep(1)}>
            ✅ 다 읽었어요!
          </button>
          <button className="btn btn-outline btn-block btn-sm" style={{ marginTop: '10px' }} onClick={() => setPhase('list')}>
            ← 돌아가기
          </button>
        </div>
      </div>
    )
  }

  // === STEP 2: 빈칸 채우기 ===
  if (phase === 'step2') {
    const words = currentVerse.text.split(' ')
    const allFilled = blanks.every(b => b.filled)
    return (
      <div>
        <div className="app-header" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '14px', opacity: 0.8 }}>2단계</p>
          <h1 style={{ fontSize: '24px', fontWeight: 800 }}>🧩 빈칸 채우기</h1>
        </div>
        <div style={{ padding: '20px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', lineHeight: 2.2 }}>
              {words.map((w, i) => {
                const blank = blanks.find(b => b.index === i)
                if (blank) {
                  return (
                    <span key={i} className={`verse-word verse-word-blank ${blank.filled ? (blank.userWord === blank.word ? 'verse-word-correct' : 'verse-word-wrong') : ''}`}>
                      {blank.filled ? blank.userWord : '___'}
                    </span>
                  )
                }
                return <span key={i} style={{ fontSize: '16px' }}>{w}</span>
              })}
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-light)', marginTop: '12px', textAlign: 'center' }}>{currentVerse.reference}</p>
          </div>

          {wordOptions.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px', justifyContent: 'center' }}>
              {wordOptions.map((w, i) => (
                <button key={i} className="verse-word verse-word-option" onClick={() => handleStep2Select(w)}>{w}</button>
              ))}
            </div>
          )}

          {allFilled && (
            <button className="btn btn-gold btn-block btn-lg" style={{ marginTop: '20px' }} onClick={checkStep2}>
              확인하기!
            </button>
          )}
          <button className="btn btn-outline btn-block btn-sm" style={{ marginTop: '10px' }} onClick={() => { speakVerse() }}>
            🔊 힌트 듣기
          </button>
        </div>
      </div>
    )
  }

  // === STEP 3: 전체 암송 ===
  if (phase === 'step3') {
    return (
      <div>
        <div className="app-header" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '14px', opacity: 0.8 }}>3단계</p>
          <h1 style={{ fontSize: '24px', fontWeight: 800 }}>🌟 전체 암송</h1>
        </div>
        <div style={{ padding: '20px' }}>
          <div className="card" style={{ padding: '24px', minHeight: '100px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', lineHeight: 2.2 }}>
              {selectedWords.map((w, i) => (
                <span key={i} className="verse-word" style={{ background: 'var(--mint-soft)', border: '2px solid var(--mint)', color: '#27ae60' }}>{w}</span>
              ))}
              {selectedWords.length < correctOrder.length && (
                <span className="verse-word verse-word-blank animate-sparkle">?</span>
              )}
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-light)', marginTop: '12px', textAlign: 'center' }}>{currentVerse.reference}</p>
          </div>

          <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-light)', marginTop: '12px' }}>
            단어를 순서대로 눌러주세요!
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px', justifyContent: 'center' }}>
            {shuffledWords.map((w, i) => (
              <button
                key={`${w}-${i}`}
                className={`verse-word verse-word-option ${step3Wrong ? 'animate-wiggle' : ''}`}
                onClick={() => handleStep3Select(w, i)}
              >
                {w}
              </button>
            ))}
          </div>

          <button className="btn btn-outline btn-block btn-sm" style={{ marginTop: '16px' }} onClick={speakVerse}>
            🔊 힌트 듣기
          </button>
        </div>
      </div>
    )
  }

  // === DONE ===
  return (
    <div>
      <Confetti trigger={showConfetti} />
      <div className="app-header" style={{ textAlign: 'center' }}>
        <div className="animate-bounce" style={{ fontSize: '64px' }}>
          {(progress[currentVerse.id]?.step || 0) >= 3 ? '👑' : '⭐'}
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, marginTop: '8px' }}>
          {(progress[currentVerse.id]?.step || 0) >= 3 ? '암송 완료!' : '단계 완료!'}
        </h1>
      </div>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div className="card card-verse" style={{ padding: '24px' }}>
          <p style={{ fontSize: '18px', fontWeight: 600, lineHeight: 1.7 }}>"{currentVerse.text}"</p>
          <p style={{ fontSize: '14px', color: 'var(--text-light)', marginTop: '8px' }}>{currentVerse.reference}</p>
          <div className="stars" style={{ justifyContent: 'center', marginTop: '12px' }}>
            {[1, 2, 3].map(n => (
              <span key={n} className={`star ${(progress[currentVerse.id]?.step || 0) >= n ? 'filled' : 'empty'}`} style={{ fontSize: '32px' }}>★</span>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => { setShowConfetti(false); setPhase('list') }}>목록으로</button>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => startVerse(currentVerse)}>다음 단계</button>
        </div>
      </div>
    </div>
  )
}
