'use client'
import { useEffect, useState } from 'react'

const colors = ['#FF7F7F', '#FFD700', '#87CEEB', '#98FB98', '#E6E6FA', '#FF69B4', '#FFA500']

export default function Confetti({ trigger }: { trigger: boolean }) {
  const [pieces, setPieces] = useState<{ id: number; x: number; color: string; delay: number }[]>([])

  useEffect(() => {
    if (!trigger) return
    const newPieces = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.5,
    }))
    setPieces(newPieces)
    const t = setTimeout(() => setPieces([]), 2000)
    return () => clearTimeout(t)
  }, [trigger])

  if (pieces.length === 0) return null

  return (
    <>
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.x}%`,
            top: '50%',
            background: p.color,
            animationDelay: `${p.delay}s`,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
        />
      ))}
    </>
  )
}
