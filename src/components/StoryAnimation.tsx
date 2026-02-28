'use client'
import { useState } from 'react'
import Image from 'next/image'

const STORY_IDS = [
  'creation', 'noah', 'abraham', 'moses', 'daniel', 'jonah',
  'david', 'baby-jesus', 'lost-sheep', 'five-loaves', 'storm', 'resurrection',
]

export default function StoryAnimation({ storyId }: { storyId: string }) {
  const [loaded, setLoaded] = useState(false)

  if (!STORY_IDS.includes(storyId)) return null

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      borderRadius: '20px',
      overflow: 'hidden',
      marginBottom: '16px',
      aspectRatio: '1/1',
      background: '#f0f0f0',
    }}>
      <Image
        src={`/images/stories/${storyId}.png`}
        alt=""
        fill
        style={{ objectFit: 'cover', opacity: loaded ? 1 : 0, transition: 'opacity 0.5s ease' }}
        onLoad={() => setLoaded(true)}
        priority
      />
      {!loaded && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontSize: '40px', animation: 'pulse-glow 2s ease-in-out infinite',
        }}>
          ✨
        </div>
      )}
      <style>{`
        @keyframes pulse-glow { 0%,100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.1); } }
      `}</style>
    </div>
  )
}
