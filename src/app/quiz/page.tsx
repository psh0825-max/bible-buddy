'use client'
import { useState, useEffect } from 'react'
import { stories } from '@/data/stories'
import { quizzes, Quiz } from '@/data/quizzes'
import { dbPut, dbGetAll } from '@/lib/db'
import Confetti from '@/components/Confetti'

type Phase = 'select' | 'playing' | 'result'

export default function QuizPage() {
  const [phase, setPhase] = useState<Phase>('select')
  const [selectedStory, setSelectedStory] = useState('')
  const [currentQuizzes, setCurrentQuizzes] = useState<Quiz[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | boolean | null>(null)
  const [blankInput, setBlankInput] = useState('')
  const [showConfetti, setShowConfetti] = useState(false)
  const [scores, setScores] = useState<Record<string, { score: number; total: number }>>({})

  useEffect(() => {
    dbGetAll<{ storyId: string; score: number; totalQuestions: number }>('quizScores').then(items => {
      const map: Record<string, { score: number; total: number }> = {}
      items.forEach(i => { map[i.storyId] = { score: i.score, total: i.totalQuestions } })
      setScores(map)
    })
  }, [])

  const startQuiz = (storyId: string) => {
    const qs = quizzes.filter(q => q.storyId === storyId).sort(() => Math.random() - 0.5)
    setSelectedStory(storyId)
    setCurrentQuizzes(qs)
    setCurrentIndex(0)
    setScore(0)
    setAnswered(false)
    setSelectedAnswer(null)
    setBlankInput('')
    setPhase('playing')
  }

  const checkAnswer = (answer: string | boolean) => {
    if (answered) return
    setAnswered(true)
    setSelectedAnswer(answer)
    const q = currentQuizzes[currentIndex]
    if (q.type === 'blank') {
      if (blankInput.trim() === q.answer) setScore(s => s + 1)
    } else {
      if (answer === q.answer) setScore(s => s + 1)
    }
  }

  const nextQuestion = () => {
    if (currentIndex + 1 >= currentQuizzes.length) {
      const finalScore = score
      dbPut('quizScores', { storyId: selectedStory, score: finalScore, totalQuestions: currentQuizzes.length, completedAt: new Date().toISOString() })
      if (finalScore === currentQuizzes.length) setShowConfetti(true)
      setPhase('result')
      return
    }
    setCurrentIndex(i => i + 1)
    setAnswered(false)
    setSelectedAnswer(null)
    setBlankInput('')
  }

  const q = currentQuizzes[currentIndex]
  const isCorrect = q && (q.type === 'blank' ? blankInput.trim() === q.answer : selectedAnswer === q.answer)
  const starCount = currentQuizzes.length > 0 ? (score / currentQuizzes.length >= 1 ? 3 : score / currentQuizzes.length >= 0.6 ? 2 : score > 0 ? 1 : 0) : 0

  if (phase === 'select') {
    return (
      <div>
        <div className="app-header">
          <h1 style={{ fontSize: '26px', fontWeight: 800 }}>🎮 퀴즈</h1>
          <p style={{ fontSize: '14px', opacity: 0.8, marginTop: '4px' }}>이야기를 골라 퀴즈에 도전해요!</p>
        </div>
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {stories.map((story, i) => {
            const s = scores[story.id]
            return (
              <div
                key={story.id}
                className="card card-quiz animate-fadeInUp"
                style={{ display: 'flex', gap: '14px', alignItems: 'center', cursor: 'pointer', animationDelay: `${i * 0.05}s`, opacity: 0 }}
                onClick={() => startQuiz(story.id)}
              >
                <div className="emoji-icon" style={{ background: 'var(--lavender)', flexShrink: 0 }}>{story.emoji}</div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '17px', fontWeight: 700 }}>{story.title}</h3>
                  {s && (
                    <div className="stars" style={{ marginTop: '4px' }}>
                      {[1, 2, 3].map(n => (
                        <span key={n} className={`star ${(s.score / s.total >= 1 ? 3 : s.score / s.total >= 0.6 ? 2 : 1) >= n ? 'filled' : 'empty'}`}>★</span>
                      ))}
                      <span style={{ fontSize: '13px', color: 'var(--text-light)', marginLeft: '4px' }}>{s.score}/{s.total}</span>
                    </div>
                  )}
                </div>
                <span style={{ fontSize: '24px' }}>▶️</span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (phase === 'result') {
    return (
      <div>
        <Confetti trigger={showConfetti} />
        <div className="app-header" style={{ textAlign: 'center' }}>
          <div className="animate-bounce" style={{ fontSize: '64px' }}>{starCount === 3 ? '🏆' : starCount === 2 ? '🌟' : '👍'}</div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, marginTop: '8px' }}>퀴즈 완료!</h1>
        </div>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <div className="card" style={{ padding: '32px' }}>
            <div className="stars" style={{ justifyContent: 'center', marginBottom: '16px' }}>
              {[1, 2, 3].map(n => (
                <span key={n} className={`star ${starCount >= n ? 'filled' : 'empty'}`} style={{ fontSize: '40px' }}>★</span>
              ))}
            </div>
            <p style={{ fontSize: '24px', fontWeight: 800 }}>{score} / {currentQuizzes.length}</p>
            <p style={{ fontSize: '16px', color: 'var(--text-light)', marginTop: '8px' }}>
              {starCount === 3 ? '완벽해요! 대단해! 🎉' : starCount === 2 ? '잘했어요! 조금만 더! 💪' : '괜찮아요! 다시 도전해봐요! 🤗'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setPhase('select')}>다른 퀴즈</button>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => startQuiz(selectedStory)}>다시 도전!</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="app-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 800 }}>문제 {currentIndex + 1}/{currentQuizzes.length}</h1>
          <span className="badge badge-gold">점수: {score}</span>
        </div>
        <div className="progress-bar" style={{ marginTop: '12px' }}>
          <div className="progress-fill" style={{ width: `${((currentIndex + 1) / currentQuizzes.length) * 100}%` }} />
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        <div className="card animate-fadeInUp" style={{ padding: '24px', marginBottom: '20px' }}>
          <p style={{ fontSize: '20px', fontWeight: 700, lineHeight: 1.6, textAlign: 'center' }}>{q.question}</p>
          {q.type === 'ox' && <p style={{ fontSize: '14px', color: 'var(--text-light)', textAlign: 'center', marginTop: '8px' }}>⭕ 맞으면 O, ❌ 틀리면 X</p>}
        </div>

        {/* OX */}
        {q.type === 'ox' && (
          <div style={{ display: 'flex', gap: '12px' }}>
            {[true, false].map(val => (
              <button
                key={String(val)}
                className={`btn btn-block btn-lg ${answered ? (val === q.answer ? 'btn-mint' : selectedAnswer === val ? 'btn-coral' : 'btn-outline') : 'btn-outline'}`}
                style={{ flex: 1, fontSize: '32px' }}
                onClick={() => checkAnswer(val)}
              >
                {val ? '⭕' : '❌'}
              </button>
            ))}
          </div>
        )}

        {/* Multiple Choice */}
        {q.type === 'multiple' && q.options && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {q.options.map(opt => (
              <button
                key={opt}
                className={`btn btn-block ${answered ? (opt === q.answer ? 'btn-mint' : selectedAnswer === opt ? 'btn-coral' : 'btn-outline') : 'btn-outline'}`}
                style={{ justifyContent: 'flex-start', fontSize: '17px' }}
                onClick={() => checkAnswer(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* Blank */}
        {q.type === 'blank' && (
          <div>
            <input
              type="text"
              value={blankInput}
              onChange={e => setBlankInput(e.target.value)}
              placeholder="정답을 입력하세요"
              disabled={answered}
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '20px',
                borderRadius: '16px',
                border: answered ? (isCorrect ? '3px solid var(--mint)' : '3px solid var(--coral)') : '2px solid #ddd',
                textAlign: 'center',
                fontWeight: 700,
                outline: 'none',
                background: answered ? (isCorrect ? 'var(--mint-soft)' : 'var(--coral-soft)') : 'white',
              }}
              onKeyDown={e => { if (e.key === 'Enter' && !answered) checkAnswer(blankInput.trim()) }}
            />
            {!answered && (
              <button className="btn btn-primary btn-block" style={{ marginTop: '12px' }} onClick={() => checkAnswer(blankInput.trim())}>
                확인!
              </button>
            )}
          </div>
        )}

        {/* Feedback */}
        {answered && (
          <div className="animate-pop" style={{ marginTop: '16px', textAlign: 'center' }}>
            <p style={{ fontSize: '20px', fontWeight: 700 }}>
              {isCorrect ? '🎉 정답이에요!' : `😅 아쉬워요! 정답: ${q.answer}`}
            </p>
            <button className="btn btn-primary btn-block" style={{ marginTop: '16px' }} onClick={nextQuestion}>
              {currentIndex + 1 >= currentQuizzes.length ? '결과 보기 →' : '다음 문제 →'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
