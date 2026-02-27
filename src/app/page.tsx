'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { dbGetAll, getStreak, recordAttendance } from '@/lib/db'
import { stories } from '@/data/stories'

export default function Home() {
  const [greeting, setGreeting] = useState('')
  const [streak, setStreak] = useState(0)
  const [storiesRead, setStoriesRead] = useState(0)
  const [quizAvg, setQuizAvg] = useState(0)
  const [versesMemorized, setVersesMemorized] = useState(0)
  const [todayStory, setTodayStory] = useState(stories[0])

  useEffect(() => {
    const h = new Date().getHours()
    if (h < 6) setGreeting('좋은 밤이에요 🌙')
    else if (h < 12) setGreeting('좋은 아침이에요 ☀️')
    else if (h < 18) setGreeting('좋은 오후예요 🌤️')
    else setGreeting('좋은 저녁이에요 🌇')

    // Pick story of the day based on date
    const dayIndex = new Date().getDate() % stories.length
    setTodayStory(stories[dayIndex])

    recordAttendance()
    loadStats()
  }, [])

  async function loadStats() {
    const s = await getStreak()
    setStreak(s)
    const read = await dbGetAll<{ storyId: string }>('stories')
    setStoriesRead(read.length)
    const scores = await dbGetAll<{ score: number; totalQuestions: number }>('quizScores')
    if (scores.length > 0) {
      const avg = scores.reduce((a, s) => a + (s.score / s.totalQuestions) * 100, 0) / scores.length
      setQuizAvg(Math.round(avg))
    }
    const verses = await dbGetAll<{ step: number }>('verses')
    setVersesMemorized(verses.filter(v => v.step >= 3).length)
  }

  return (
    <div>
      {/* Header */}
      <div className="app-header">
        <div className="animate-fadeInUp">
          <p style={{ fontSize: '16px', opacity: 0.9 }}>{greeting}</p>
          <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '4px 0' }}>✝️ 성경친구</h1>
          <p style={{ fontSize: '14px', opacity: 0.8 }}>오늘도 하나님 말씀과 함께해요!</p>
        </div>
        {/* Streak */}
        {streak > 0 && (
          <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="animate-bounce" style={{ fontSize: '24px' }}>🔥</span>
            <span style={{ fontSize: '15px', fontWeight: 700 }}>{streak}일 연속 출석!</span>
          </div>
        )}
      </div>

      <div style={{ padding: '20px' }}>
        {/* Today's Story Card */}
        <div className="animate-fadeInUp" style={{ animationDelay: '0.1s', opacity: 0 }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>📖 오늘의 이야기</h2>
          <Link href={`/stories/${todayStory.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="card card-story" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div className="emoji-icon-lg" style={{ background: 'linear-gradient(135deg, #FFF3B0, #FFD700)', flexShrink: 0 }}>
                {todayStory.emoji}
              </div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 700 }}>{todayStory.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-light)', marginTop: '4px' }}>{todayStory.verseRef}</p>
                <span className="badge badge-gold" style={{ marginTop: '8px' }}>{todayStory.ageRange}</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Stats */}
        <div className="animate-fadeInUp" style={{ animationDelay: '0.2s', opacity: 0, marginTop: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>📊 내 성적표</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="card" style={{ textAlign: 'center', padding: '16px' }}>
              <div style={{ fontSize: '32px' }}>📖</div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--sky)' }}>{storiesRead}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-light)' }}>읽은 이야기</div>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '16px' }}>
              <div style={{ fontSize: '32px' }}>🎮</div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--gold)' }}>{quizAvg}%</div>
              <div style={{ fontSize: '13px', color: 'var(--text-light)' }}>퀴즈 평균</div>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '16px' }}>
              <div style={{ fontSize: '32px' }}>💎</div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--purple-soft)' }}>{versesMemorized}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-light)' }}>암송 완료</div>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '16px' }}>
              <div style={{ fontSize: '32px' }}>🔥</div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--coral)' }}>{streak}일</div>
              <div style={{ fontSize: '13px', color: 'var(--text-light)' }}>연속 출석</div>
            </div>
          </div>
        </div>

        {/* Quick Menu */}
        <div className="animate-fadeInUp" style={{ animationDelay: '0.3s', opacity: 0, marginTop: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>🚀 바로가기</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            {[
              { href: '/stories', icon: '📖', label: '이야기', bg: 'var(--gold-soft)' },
              { href: '/quiz', icon: '🎮', label: '퀴즈', bg: 'var(--lavender)' },
              { href: '/memorize', icon: '💎', label: '암송', bg: 'var(--sky-light)' },
              { href: '/coloring', icon: '🎨', label: '색칠', bg: 'var(--mint-soft)' },
              { href: '/chat', icon: '💬', label: 'AI 질문', bg: 'var(--coral-soft)' },
              { href: '/profile', icon: '👤', label: '프로필', bg: '#F3E8FF' },
            ].map(item => (
              <Link key={item.href} href={item.href} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="card" style={{ textAlign: 'center', padding: '16px', background: item.bg }}>
                  <div style={{ fontSize: '28px' }}>{item.icon}</div>
                  <div style={{ fontSize: '14px', fontWeight: 600, marginTop: '4px' }}>{item.label}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Today's Verse */}
        <div className="animate-fadeInUp" style={{ animationDelay: '0.4s', opacity: 0, marginTop: '24px', marginBottom: '20px' }}>
          <div className="card card-verse" style={{ textAlign: 'center', padding: '24px' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>✨</div>
            <p style={{ fontSize: '17px', fontWeight: 600, lineHeight: 1.7 }}>"{todayStory.verse}"</p>
            <p style={{ fontSize: '14px', color: 'var(--text-light)', marginTop: '8px' }}>{todayStory.verseRef}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
