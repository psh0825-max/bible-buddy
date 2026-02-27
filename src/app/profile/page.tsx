'use client'
import { useState, useEffect } from 'react'
import { dbGet, dbPut, dbGetAll, getStreak } from '@/lib/db'
import { stories } from '@/data/stories'
import { verses } from '@/data/verses'

const avatars = ['🐻', '🐰', '🐱', '🐶', '🦊', '🐼']

interface Profile { id: string; name: string; avatar: string; createdAt: string }
interface Badge { badgeId: string; earnedAt: string }

const badgeList = [
  ...stories.map(s => ({ id: `story-${s.id}`, name: `${s.emoji} ${s.title}`, desc: '이야기 완독' })),
  { id: 'all-stories', name: '📚 모든 이야기', desc: '12편 모두 읽기' },
  { id: 'first-verse', name: '🌱 첫 암송', desc: '첫 구절 암송 완료' },
  { id: 'ten-verses', name: '📖 10개 암송', desc: '10구절 암송 완료' },
  { id: 'all-verses', name: '👑 암송왕', desc: '30구절 모두 암송' },
]

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>({ id: 'main', name: '', avatar: '🐻', createdAt: '' })
  const [badges, setBadges] = useState<Badge[]>([])
  const [streak, setStreak] = useState(0)
  const [storiesRead, setStoriesRead] = useState(0)
  const [versesComplete, setVersesComplete] = useState(0)
  const [quizAvg, setQuizAvg] = useState(0)
  const [editing, setEditing] = useState(false)
  const [nameInput, setNameInput] = useState('')

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    const p = await dbGet<Profile>('profile', 'main')
    if (p) { setProfile(p); setNameInput(p.name) }

    const b = await dbGetAll<Badge>('badges')
    setBadges(b)

    const s = await getStreak()
    setStreak(s)

    const sr = await dbGetAll('stories')
    setStoriesRead(sr.length)

    const v = await dbGetAll<{ step: number }>('verses')
    setVersesComplete(v.filter(x => x.step >= 3).length)

    const scores = await dbGetAll<{ score: number; totalQuestions: number }>('quizScores')
    if (scores.length > 0) {
      const avg = scores.reduce((a, s) => a + (s.score / s.totalQuestions) * 100, 0) / scores.length
      setQuizAvg(Math.round(avg))
    }
  }

  const saveProfile = async () => {
    const p = { ...profile, name: nameInput, createdAt: profile.createdAt || new Date().toISOString() }
    await dbPut('profile', p)
    setProfile(p)
    setEditing(false)
  }

  const selectAvatar = async (av: string) => {
    const p = { ...profile, avatar: av }
    await dbPut('profile', p)
    setProfile(p)
  }

  const level = Math.min(10, Math.floor((storiesRead * 2 + versesComplete * 3 + badges.length) / 5) + 1)
  const badgeIds = new Set(badges.map(b => b.badgeId))

  return (
    <div>
      <div className="app-header" style={{ textAlign: 'center' }}>
        {/* Avatar */}
        <div className="animate-float" style={{
          width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto',
          background: 'linear-gradient(135deg, var(--gold) 0%, var(--coral) 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '40px', boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
        }}>
          {profile.avatar}
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, marginTop: '12px' }}>
          {profile.name || '이름을 입력해주세요'}
        </h1>
        <span className="badge badge-gold" style={{ marginTop: '8px' }}>⭐ 레벨 {level}</span>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Name Edit */}
        {editing ? (
          <div className="card" style={{ padding: '20px', marginBottom: '16px' }}>
            <p style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px' }}>이름 변경</p>
            <input
              type="text"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              placeholder="이름을 입력하세요"
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '2px solid var(--sky)', fontSize: '16px', outline: 'none' }}
            />
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={() => setEditing(false)}>취소</button>
              <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={saveProfile}>저장</button>
            </div>
          </div>
        ) : (
          <button className="btn btn-outline btn-block btn-sm" style={{ marginBottom: '16px' }} onClick={() => setEditing(true)}>
            ✏️ 이름 변경
          </button>
        )}

        {/* Avatar Selection */}
        <div className="card" style={{ padding: '20px', marginBottom: '16px' }}>
          <p style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>🎭 아바타 선택</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            {avatars.map(av => (
              <div
                key={av}
                onClick={() => selectAvatar(av)}
                style={{
                  width: '50px', height: '50px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '28px', cursor: 'pointer',
                  background: profile.avatar === av ? 'var(--gold-soft)' : '#f5f5f5',
                  border: profile.avatar === av ? '3px solid var(--gold)' : '2px solid #eee',
                  transition: 'all 0.2s',
                }}
              >
                {av}
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="card" style={{ padding: '20px', marginBottom: '16px' }}>
          <p style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>📊 학습 통계</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--sky)' }}>{storiesRead}/{stories.length}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-light)' }}>📖 읽은 이야기</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--gold)' }}>{quizAvg}%</div>
              <div style={{ fontSize: '13px', color: 'var(--text-light)' }}>🎮 퀴즈 평균</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--purple-soft)' }}>{versesComplete}/{verses.length}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-light)' }}>💎 암송 완료</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--coral)' }}>{streak}일</div>
              <div style={{ fontSize: '13px', color: 'var(--text-light)' }}>🔥 연속 출석</div>
            </div>
          </div>
          {/* Level Progress */}
          <div style={{ marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-light)', marginBottom: '4px' }}>
              <span>레벨 {level}</span>
              <span>레벨 {Math.min(10, level + 1)}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${(level / 10) * 100}%` }} />
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="card" style={{ padding: '20px', marginBottom: '20px' }}>
          <p style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>🏆 뱃지 컬렉션 ({badges.length}/{badgeList.length})</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {badgeList.map(b => {
              const earned = badgeIds.has(b.id)
              return (
                <div
                  key={b.id}
                  style={{
                    textAlign: 'center', padding: '10px 4px',
                    borderRadius: '12px',
                    background: earned ? 'var(--gold-soft)' : '#f5f5f5',
                    opacity: earned ? 1 : 0.4,
                  }}
                >
                  <div style={{ fontSize: '24px' }}>{b.name.split(' ')[0]}</div>
                  <div style={{ fontSize: '10px', fontWeight: 600, marginTop: '4px', color: earned ? 'var(--brown)' : 'var(--text-light)' }}>
                    {b.name.split(' ').slice(1).join(' ')}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', padding: '12px', fontSize: '12px', color: 'var(--text-light)' }}>
          ✝️ 성경친구 v1.0<br />
          LightOn Plus Lab
        </div>
      </div>
    </div>
  )
}
