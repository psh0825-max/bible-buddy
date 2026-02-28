'use client'
import { useEffect, useState } from 'react'

// Each story gets a unique animated background scene
const ANIMATIONS: Record<string, { bg: string; elements: { emoji: string; style: React.CSSProperties; animation: string }[] }> = {
  creation: {
    bg: 'linear-gradient(180deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    elements: [
      { emoji: '⭐', style: { top: '5%', left: '10%', fontSize: '14px' }, animation: 'twinkle 2s infinite' },
      { emoji: '⭐', style: { top: '12%', right: '15%', fontSize: '10px' }, animation: 'twinkle 3s infinite 0.5s' },
      { emoji: '⭐', style: { top: '8%', left: '50%', fontSize: '12px' }, animation: 'twinkle 2.5s infinite 1s' },
      { emoji: '🌍', style: { top: '15%', left: '50%', transform: 'translateX(-50%)', fontSize: '40px' }, animation: 'float 4s ease-in-out infinite' },
      { emoji: '☀️', style: { top: '5%', right: '10%', fontSize: '28px' }, animation: 'pulse-glow 3s ease-in-out infinite' },
      { emoji: '🌙', style: { top: '5%', left: '8%', fontSize: '24px' }, animation: 'float 5s ease-in-out infinite 1s' },
    ],
  },
  noah: {
    bg: 'linear-gradient(180deg, #4a6fa1 0%, #6b8cae 40%, #3a7bd5 100%)',
    elements: [
      { emoji: '🌧️', style: { top: '2%', left: '15%', fontSize: '20px' }, animation: 'rain-drop 1.5s infinite' },
      { emoji: '🌧️', style: { top: '0%', left: '45%', fontSize: '16px' }, animation: 'rain-drop 1.8s infinite 0.3s' },
      { emoji: '🌧️', style: { top: '3%', right: '20%', fontSize: '18px' }, animation: 'rain-drop 1.6s infinite 0.7s' },
      { emoji: '🚢', style: { bottom: '8%', left: '50%', transform: 'translateX(-50%)', fontSize: '36px' }, animation: 'boat-rock 3s ease-in-out infinite' },
      { emoji: '🌊', style: { bottom: '0%', left: '10%', fontSize: '24px' }, animation: 'wave 2s ease-in-out infinite' },
      { emoji: '🌊', style: { bottom: '0%', right: '10%', fontSize: '24px' }, animation: 'wave 2s ease-in-out infinite 1s' },
      { emoji: '🕊️', style: { top: '20%', right: '15%', fontSize: '22px' }, animation: 'fly 4s ease-in-out infinite' },
    ],
  },
  abraham: {
    bg: 'linear-gradient(180deg, #0f0c29 0%, #1a1a4e 50%, #302b63 100%)',
    elements: [
      { emoji: '⭐', style: { top: '5%', left: '10%', fontSize: '10px' }, animation: 'twinkle 2s infinite' },
      { emoji: '⭐', style: { top: '8%', left: '25%', fontSize: '8px' }, animation: 'twinkle 2.5s infinite 0.3s' },
      { emoji: '⭐', style: { top: '3%', left: '40%', fontSize: '12px' }, animation: 'twinkle 1.8s infinite 0.6s' },
      { emoji: '⭐', style: { top: '10%', left: '55%', fontSize: '9px' }, animation: 'twinkle 3s infinite 0.9s' },
      { emoji: '⭐', style: { top: '6%', left: '70%', fontSize: '11px' }, animation: 'twinkle 2.2s infinite 1.2s' },
      { emoji: '⭐', style: { top: '4%', right: '10%', fontSize: '14px' }, animation: 'twinkle 2s infinite 0.4s' },
      { emoji: '🏕️', style: { bottom: '5%', left: '50%', transform: 'translateX(-50%)', fontSize: '32px' }, animation: 'float 5s ease-in-out infinite' },
    ],
  },
  moses: {
    bg: 'linear-gradient(180deg, #f5af19 0%, #f12711 50%, #8B4513 100%)',
    elements: [
      { emoji: '🔥', style: { top: '10%', left: '50%', transform: 'translateX(-50%)', fontSize: '36px' }, animation: 'flame 0.8s infinite alternate' },
      { emoji: '🌿', style: { top: '18%', left: '48%', fontSize: '24px' }, animation: 'none' },
      { emoji: '🏔️', style: { bottom: '5%', left: '20%', fontSize: '28px' }, animation: 'none' },
      { emoji: '🏔️', style: { bottom: '5%', right: '20%', fontSize: '32px' }, animation: 'none' },
      { emoji: '✨', style: { top: '5%', left: '30%', fontSize: '14px' }, animation: 'twinkle 1.5s infinite' },
      { emoji: '✨', style: { top: '8%', right: '25%', fontSize: '12px' }, animation: 'twinkle 2s infinite 0.5s' },
    ],
  },
  daniel: {
    bg: 'linear-gradient(180deg, #2c1810 0%, #3d2914 50%, #1a0f0a 100%)',
    elements: [
      { emoji: '🦁', style: { bottom: '8%', left: '15%', fontSize: '32px' }, animation: 'breathe 3s ease-in-out infinite' },
      { emoji: '🦁', style: { bottom: '8%', right: '15%', fontSize: '28px' }, animation: 'breathe 3s ease-in-out infinite 1s' },
      { emoji: '🦁', style: { bottom: '12%', left: '50%', transform: 'translateX(-50%)', fontSize: '36px' }, animation: 'breathe 3s ease-in-out infinite 0.5s' },
      { emoji: '🙏', style: { top: '10%', left: '50%', transform: 'translateX(-50%)', fontSize: '30px' }, animation: 'float 4s ease-in-out infinite' },
      { emoji: '✨', style: { top: '5%', left: '30%', fontSize: '16px' }, animation: 'twinkle 2s infinite' },
      { emoji: '✨', style: { top: '8%', right: '30%', fontSize: '14px' }, animation: 'twinkle 2.5s infinite 0.7s' },
    ],
  },
  jonah: {
    bg: 'linear-gradient(180deg, #006994 0%, #003d5b 50%, #001f3f 100%)',
    elements: [
      { emoji: '🐋', style: { bottom: '10%', left: '50%', transform: 'translateX(-50%)', fontSize: '44px' }, animation: 'whale-swim 5s ease-in-out infinite' },
      { emoji: '🌊', style: { bottom: '0%', left: '5%', fontSize: '24px' }, animation: 'wave 2s ease-in-out infinite' },
      { emoji: '🌊', style: { bottom: '2%', left: '35%', fontSize: '20px' }, animation: 'wave 2.5s ease-in-out infinite 0.5s' },
      { emoji: '🌊', style: { bottom: '0%', right: '5%', fontSize: '22px' }, animation: 'wave 2s ease-in-out infinite 1s' },
      { emoji: '🐟', style: { bottom: '15%', left: '20%', fontSize: '16px' }, animation: 'fish-swim 4s ease-in-out infinite' },
      { emoji: '🐟', style: { bottom: '20%', right: '25%', fontSize: '14px' }, animation: 'fish-swim 3.5s ease-in-out infinite 1s' },
    ],
  },
  david: {
    bg: 'linear-gradient(180deg, #87CEEB 0%, #90EE90 60%, #228B22 100%)',
    elements: [
      { emoji: '🐑', style: { bottom: '8%', left: '15%', fontSize: '24px' }, animation: 'float 3s ease-in-out infinite' },
      { emoji: '🐑', style: { bottom: '10%', left: '35%', fontSize: '20px' }, animation: 'float 3.5s ease-in-out infinite 0.5s' },
      { emoji: '🐑', style: { bottom: '6%', right: '20%', fontSize: '22px' }, animation: 'float 4s ease-in-out infinite 1s' },
      { emoji: '🎵', style: { top: '10%', left: '20%', fontSize: '18px' }, animation: 'music-float 3s ease-in-out infinite' },
      { emoji: '🎵', style: { top: '15%', right: '25%', fontSize: '16px' }, animation: 'music-float 3.5s ease-in-out infinite 0.5s' },
      { emoji: '☁️', style: { top: '5%', left: '10%', fontSize: '28px' }, animation: 'cloud-drift 8s linear infinite' },
      { emoji: '☁️', style: { top: '8%', right: '5%', fontSize: '22px' }, animation: 'cloud-drift 10s linear infinite 3s' },
    ],
  },
  'baby-jesus': {
    bg: 'linear-gradient(180deg, #0f0c29 0%, #1a1a4e 40%, #2c1810 100%)',
    elements: [
      { emoji: '⭐', style: { top: '3%', left: '50%', transform: 'translateX(-50%)', fontSize: '36px' }, animation: 'pulse-glow 2s ease-in-out infinite' },
      { emoji: '✨', style: { top: '10%', left: '30%', fontSize: '12px' }, animation: 'twinkle 2s infinite 0.3s' },
      { emoji: '✨', style: { top: '8%', right: '30%', fontSize: '14px' }, animation: 'twinkle 2.5s infinite 0.6s' },
      { emoji: '👶', style: { bottom: '10%', left: '50%', transform: 'translateX(-50%)', fontSize: '32px' }, animation: 'float 4s ease-in-out infinite' },
      { emoji: '🐑', style: { bottom: '8%', left: '20%', fontSize: '20px' }, animation: 'breathe 3s ease-in-out infinite' },
      { emoji: '🐑', style: { bottom: '8%', right: '20%', fontSize: '18px' }, animation: 'breathe 3s ease-in-out infinite 1s' },
    ],
  },
  'lost-sheep': {
    bg: 'linear-gradient(180deg, #f093fb 0%, #f5576c 50%, #4facfe 100%)',
    elements: [
      { emoji: '🐑', style: { top: '15%', right: '10%', fontSize: '28px' }, animation: 'lost-wander 5s ease-in-out infinite' },
      { emoji: '🐑', style: { bottom: '10%', left: '15%', fontSize: '18px' }, animation: 'float 3s ease-in-out infinite' },
      { emoji: '🐑', style: { bottom: '12%', left: '35%', fontSize: '16px' }, animation: 'float 3.5s ease-in-out infinite 0.5s' },
      { emoji: '❤️', style: { top: '8%', left: '50%', transform: 'translateX(-50%)', fontSize: '24px' }, animation: 'heartbeat 1.5s ease-in-out infinite' },
    ],
  },
  'five-loaves': {
    bg: 'linear-gradient(180deg, #87CEEB 0%, #98FB98 60%, #DEB887 100%)',
    elements: [
      { emoji: '🍞', style: { top: '10%', left: '20%', fontSize: '24px' }, animation: 'multiply 3s ease-in-out infinite' },
      { emoji: '🐟', style: { top: '10%', right: '20%', fontSize: '22px' }, animation: 'multiply 3s ease-in-out infinite 0.5s' },
      { emoji: '🍞', style: { top: '18%', left: '40%', fontSize: '18px' }, animation: 'multiply 3.5s ease-in-out infinite 1s' },
      { emoji: '🐟', style: { top: '18%', right: '35%', fontSize: '16px' }, animation: 'multiply 3.5s ease-in-out infinite 1.5s' },
      { emoji: '👦', style: { bottom: '8%', left: '50%', transform: 'translateX(-50%)', fontSize: '30px' }, animation: 'float 4s ease-in-out infinite' },
    ],
  },
  storm: {
    bg: 'linear-gradient(180deg, #2c3e50 0%, #4a6fa1 50%, #2c3e50 100%)',
    elements: [
      { emoji: '⛈️', style: { top: '3%', left: '30%', fontSize: '28px' }, animation: 'shake 0.5s infinite' },
      { emoji: '⚡', style: { top: '8%', right: '25%', fontSize: '22px' }, animation: 'lightning 3s infinite' },
      { emoji: '🌊', style: { bottom: '0%', left: '5%', fontSize: '26px' }, animation: 'big-wave 1.5s ease-in-out infinite' },
      { emoji: '🌊', style: { bottom: '2%', right: '5%', fontSize: '24px' }, animation: 'big-wave 1.5s ease-in-out infinite 0.5s' },
      { emoji: '⛵', style: { bottom: '10%', left: '50%', transform: 'translateX(-50%)', fontSize: '32px' }, animation: 'boat-rock 1.5s ease-in-out infinite' },
      { emoji: '✋', style: { top: '20%', left: '50%', transform: 'translateX(-50%)', fontSize: '28px' }, animation: 'pulse-glow 2s ease-in-out infinite' },
    ],
  },
  resurrection: {
    bg: 'linear-gradient(180deg, #ffecd2 0%, #fcb69f 30%, #ffecd2 60%, #fff9c4 100%)',
    elements: [
      { emoji: '✝️', style: { top: '8%', left: '50%', transform: 'translateX(-50%)', fontSize: '36px' }, animation: 'rise-up 4s ease-in-out infinite' },
      { emoji: '☀️', style: { top: '3%', right: '15%', fontSize: '32px' }, animation: 'pulse-glow 3s ease-in-out infinite' },
      { emoji: '🌸', style: { bottom: '5%', left: '15%', fontSize: '18px' }, animation: 'float 3s ease-in-out infinite' },
      { emoji: '🌸', style: { bottom: '8%', right: '20%', fontSize: '16px' }, animation: 'float 3.5s ease-in-out infinite 0.5s' },
      { emoji: '🦋', style: { top: '20%', left: '20%', fontSize: '20px' }, animation: 'fly 5s ease-in-out infinite' },
      { emoji: '🦋', style: { top: '25%', right: '15%', fontSize: '18px' }, animation: 'fly 6s ease-in-out infinite 1s' },
      { emoji: '✨', style: { top: '12%', left: '35%', fontSize: '14px' }, animation: 'twinkle 1.5s infinite' },
      { emoji: '✨', style: { top: '10%', right: '30%', fontSize: '12px' }, animation: 'twinkle 2s infinite 0.5s' },
    ],
  },
}

export default function StoryAnimation({ storyId }: { storyId: string }) {
  const config = ANIMATIONS[storyId]
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!config || !mounted) return null

  return (
    <>
      <style>{`
        @keyframes twinkle { 0%,100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes pulse-glow { 0%,100% { opacity: 0.7; transform: scale(1); } 50% { opacity: 1; transform: scale(1.15); filter: brightness(1.3); } }
        @keyframes rain-drop { 0% { transform: translateY(-10px); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateY(30px); opacity: 0; } }
        @keyframes wave { 0%,100% { transform: translateX(0) translateY(0); } 25% { transform: translateX(8px) translateY(-5px); } 75% { transform: translateX(-8px) translateY(-3px); } }
        @keyframes big-wave { 0%,100% { transform: translateX(0) translateY(0) scale(1); } 50% { transform: translateX(12px) translateY(-8px) scale(1.1); } }
        @keyframes boat-rock { 0%,100% { transform: translateX(-50%) rotate(0deg); } 25% { transform: translateX(-50%) rotate(8deg); } 75% { transform: translateX(-50%) rotate(-8deg); } }
        @keyframes flame { 0% { transform: translateX(-50%) scale(1) rotate(-2deg); } 100% { transform: translateX(-50%) scale(1.1) rotate(2deg); } }
        @keyframes breathe { 0%,100% { transform: scale(1); } 50% { transform: scale(1.08); } }
        @keyframes whale-swim { 0%,100% { transform: translateX(-50%) translateY(0); } 25% { transform: translateX(-40%) translateY(-8px); } 75% { transform: translateX(-60%) translateY(-5px); } }
        @keyframes fish-swim { 0%,100% { transform: translateX(0); } 50% { transform: translateX(20px); } }
        @keyframes fly { 0%,100% { transform: translateX(0) translateY(0); } 25% { transform: translateX(15px) translateY(-10px); } 50% { transform: translateX(30px) translateY(-5px); } 75% { transform: translateX(15px) translateY(-12px); } }
        @keyframes cloud-drift { 0% { transform: translateX(-100px); } 100% { transform: translateX(calc(100vw + 100px)); } }
        @keyframes music-float { 0%,100% { transform: translateY(0) rotate(0deg); opacity: 0.7; } 50% { transform: translateY(-15px) rotate(10deg); opacity: 1; } }
        @keyframes heartbeat { 0%,100% { transform: translateX(-50%) scale(1); } 50% { transform: translateX(-50%) scale(1.3); } }
        @keyframes multiply { 0%,100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.2); opacity: 1; } }
        @keyframes shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-3px); } 75% { transform: translateX(3px); } }
        @keyframes lightning { 0%,90%,100% { opacity: 0; } 92%,96% { opacity: 1; } }
        @keyframes lost-wander { 0%,100% { transform: translateX(0) translateY(0); } 25% { transform: translateX(-15px) translateY(5px); } 50% { transform: translateX(10px) translateY(-8px); } 75% { transform: translateX(-8px) translateY(3px); } }
        @keyframes rise-up { 0%,100% { transform: translateX(-50%) translateY(0); opacity: 0.8; } 50% { transform: translateX(-50%) translateY(-15px); opacity: 1; filter: brightness(1.3); } }
      `}</style>
      <div style={{
        position: 'relative',
        width: '100%',
        height: '180px',
        borderRadius: '20px',
        background: config.bg,
        overflow: 'hidden',
        marginBottom: '16px',
      }}>
        {config.elements.map((el, i) => (
          <div key={i} style={{
            position: 'absolute',
            ...el.style,
            animation: el.animation,
            pointerEvents: 'none',
          }}>
            {el.emoji}
          </div>
        ))}
      </div>
    </>
  )
}
