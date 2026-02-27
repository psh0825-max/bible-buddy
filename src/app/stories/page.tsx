'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { stories } from '@/data/stories'
import { dbGetAll } from '@/lib/db'

export default function StoriesPage() {
  const [readIds, setReadIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    dbGetAll<{ storyId: string }>('stories').then(items => {
      setReadIds(new Set(items.map(i => i.storyId)))
    })
  }, [])

  const otStories = stories.filter(s => s.category === '구약')
  const ntStories = stories.filter(s => s.category === '신약')

  return (
    <div>
      <div className="app-header">
        <h1 style={{ fontSize: '26px', fontWeight: 800 }}>📖 성경 이야기</h1>
        <p style={{ fontSize: '14px', opacity: 0.8, marginTop: '4px' }}>
          {readIds.size}/{stories.length}편 읽었어요!
        </p>
        <div className="progress-bar" style={{ marginTop: '12px' }}>
          <div className="progress-fill" style={{ width: `${(readIds.size / stories.length) * 100}%` }} />
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>🏛️ 구약성경</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {otStories.map((story, i) => (
            <Link key={story.id} href={`/stories/${story.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div
                className={`card card-story ${readIds.has(story.id) ? 'completed' : ''} animate-fadeInUp`}
                style={{ display: 'flex', gap: '14px', alignItems: 'center', animationDelay: `${i * 0.05}s`, opacity: 0 }}
              >
                <div className="emoji-icon" style={{ background: readIds.has(story.id) ? 'var(--mint-soft)' : 'var(--gold-soft)', flexShrink: 0 }}>
                  {readIds.has(story.id) ? '✅' : story.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '17px', fontWeight: 700 }}>{story.title}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-light)', marginTop: '2px' }}>{story.verseRef}</p>
                </div>
                <span className="badge badge-gold">{story.ageRange}</span>
              </div>
            </Link>
          ))}
        </div>

        <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '24px 0 12px' }}>⛪ 신약성경</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          {ntStories.map((story, i) => (
            <Link key={story.id} href={`/stories/${story.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div
                className={`card card-story ${readIds.has(story.id) ? 'completed' : ''} animate-fadeInUp`}
                style={{ display: 'flex', gap: '14px', alignItems: 'center', animationDelay: `${(i + otStories.length) * 0.05}s`, opacity: 0 }}
              >
                <div className="emoji-icon" style={{ background: readIds.has(story.id) ? 'var(--mint-soft)' : 'var(--gold-soft)', flexShrink: 0 }}>
                  {readIds.has(story.id) ? '✅' : story.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '17px', fontWeight: 700 }}>{story.title}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-light)', marginTop: '2px' }}>{story.verseRef}</p>
                </div>
                <span className="badge badge-sky">{story.ageRange}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
