'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { dbGetAll, getStreak, recordAttendance } from '@/lib/db'
import { stories } from '@/data/stories'
import { playTap } from '@/lib/sounds'
import { PageTransition, TapCard, SlideIn, Float, PopIn, StaggerItem } from '@/components/MotionWrapper'
import { motion } from 'motion/react'

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
    <PageTransition>
      {/* Header */}
      <div className="app-header">
        <SlideIn from="top">
          <p style={{ fontSize: '16px', opacity: 0.9 }}>{greeting}</p>
          <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '4px 0' }}>✝️ 성경친구</h1>
          <p style={{ fontSize: '14px', opacity: 0.8 }}>오늘도 하나님 말씀과 함께해요!</p>
        </SlideIn>
        {streak > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, delay: 0.3 }}
            style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Float><span style={{ fontSize: '28px' }}>🔥</span></Float>
            <span style={{ fontSize: '16px', fontWeight: 700 }}>{streak}일 연속 출석!</span>
          </motion.div>
        )}
      </div>

      <div style={{ padding: '20px' }}>
        {/* Today's Story */}
        <SlideIn from="bottom" delay={0.1}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>📖 오늘의 이야기</h2>
          <Link href={`/stories/${todayStory.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <TapCard className="card card-story" onClick={() => playTap()} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <Float>
                <div className="emoji-icon-lg" style={{ background: 'linear-gradient(135deg, #FFF3B0, #FFD700)' }}>
                  {todayStory.emoji}
                </div>
              </Float>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 700 }}>{todayStory.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-light)', marginTop: '4px' }}>{todayStory.verseRef}</p>
                <span className="badge badge-gold" style={{ marginTop: '8px' }}>{todayStory.ageRange}</span>
              </div>
            </TapCard>
          </Link>
        </SlideIn>

        {/* Stats */}
        <SlideIn from="bottom" delay={0.2}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '24px 0 12px' }}>📊 내 성적표</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { icon: '📖', value: storiesRead, label: '읽은 이야기', color: 'var(--sky)' },
              { icon: '🎮', value: `${quizAvg}%`, label: '퀴즈 평균', color: 'var(--gold)' },
              { icon: '💎', value: versesMemorized, label: '암송 완료', color: 'var(--purple-soft)' },
              { icon: '🔥', value: `${streak}일`, label: '연속 출석', color: 'var(--coral)' },
            ].map((stat, i) => (
              <PopIn key={stat.label} delay={0.3 + i * 0.1}>
                <div className="card" style={{ textAlign: 'center', padding: '18px' }}>
                  <motion.div
                    animate={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 + i }}
                    style={{ fontSize: '32px' }}
                  >
                    {stat.icon}
                  </motion.div>
                  <div style={{ fontSize: '30px', fontWeight: 800, color: stat.color, marginTop: '4px' }}>{stat.value}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-light)' }}>{stat.label}</div>
                </div>
              </PopIn>
            ))}
          </div>
        </SlideIn>

        {/* Quick Menu */}
        <SlideIn from="bottom" delay={0.4}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '24px 0 12px' }}>🚀 바로가기</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            {[
              { href: '/stories', icon: '📖', label: '이야기', bg: 'var(--gold-soft)' },
              { href: '/quiz', icon: '🎮', label: '퀴즈', bg: 'var(--lavender)' },
              { href: '/memorize', icon: '💎', label: '암송', bg: 'var(--sky-light)' },
              { href: '/coloring', icon: '🎨', label: '색칠', bg: 'var(--mint-soft)' },
              { href: '/chat', icon: '💬', label: 'AI 질문', bg: 'var(--coral-soft)' },
              { href: '/profile', icon: '👤', label: '프로필', bg: '#F3E8FF' },
            ].map((item, i) => (
              <StaggerItem key={item.href} index={i + 6}>
                <Link href={item.href} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <TapCard
                    className="card"
                    onClick={() => playTap()}
                    style={{ textAlign: 'center', padding: '18px', background: item.bg, minHeight: '90px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <div style={{ fontSize: '30px' }}>{item.icon}</div>
                    <div style={{ fontSize: '14px', fontWeight: 600, marginTop: '6px' }}>{item.label}</div>
                  </TapCard>
                </Link>
              </StaggerItem>
            ))}
          </div>
        </SlideIn>

        {/* Today's Verse */}
        <SlideIn from="bottom" delay={0.5}>
          <div style={{ marginTop: '24px', marginBottom: '20px' }}>
            <motion.div
              className="card card-verse"
              style={{ textAlign: 'center', padding: '28px' }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Float><span style={{ fontSize: '28px' }}>✨</span></Float>
              <p style={{ fontSize: '17px', fontWeight: 600, lineHeight: 1.7, marginTop: '8px' }}>"{todayStory.verse}"</p>
              <p style={{ fontSize: '14px', color: 'var(--text-light)', marginTop: '8px' }}>{todayStory.verseRef}</p>
            </motion.div>
          </div>
        </SlideIn>
      </div>
    </PageTransition>
  )
}
