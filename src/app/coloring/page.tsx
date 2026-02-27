'use client'
import { useState, useRef, useEffect } from 'react'

const colors = [
  '#FF6B6B', '#FF9F43', '#FFD93D', '#6BCB77', '#4D96FF',
  '#9B59B6', '#FF69B4', '#1ABC9C', '#E74C3C', '#8B4513',
  '#FFFFFF', '#2C3E50',
]

const scenes = [
  { id: 'rainbow', name: '🌈 무지개와 노아', emoji: '🌈' },
  { id: 'star', name: '⭐ 베들레헴 별', emoji: '⭐' },
  { id: 'fish', name: '🐋 요나와 물고기', emoji: '🐋' },
  { id: 'lion', name: '🦁 다니엘과 사자', emoji: '🦁' },
  { id: 'sheep', name: '🐑 양과 목자', emoji: '🐑' },
  { id: 'dove', name: '🕊️ 비둘기와 올리브', emoji: '🕊️' },
]

export default function ColoringPage() {
  const [selectedScene, setSelectedScene] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState(colors[0])
  const [brushSize, setBrushSize] = useState(8)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [drawing, setDrawing] = useState(false)
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)

  useEffect(() => {
    if (!selectedScene || !canvasRef.current) return
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    if (!context) return
    canvas.width = 380
    canvas.height = 500
    context.fillStyle = '#FFFFFF'
    context.fillRect(0, 0, canvas.width, canvas.height)
    // Draw scene outline
    drawScene(context, selectedScene)
    setCtx(context)
  }, [selectedScene])

  const drawScene = (context: CanvasRenderingContext2D, scene: string) => {
    context.strokeStyle = '#333'
    context.lineWidth = 2
    context.lineCap = 'round'
    context.lineJoin = 'round'

    switch (scene) {
      case 'rainbow':
        // Ground
        context.fillStyle = '#E8F5E9'
        context.fillRect(0, 380, 380, 120)
        // Ark
        context.beginPath()
        context.moveTo(100, 380); context.lineTo(100, 320); context.lineTo(280, 320); context.lineTo(280, 380)
        context.moveTo(120, 320); context.lineTo(120, 280); context.lineTo(260, 280); context.lineTo(260, 320)
        context.stroke()
        // Rainbow arcs
        const rainbowY = 180
        for (let i = 0; i < 7; i++) {
          context.beginPath()
          context.arc(190, rainbowY, 140 - i * 15, Math.PI, 0)
          context.stroke()
        }
        // Clouds
        drawCloud(context, 40, 100, 60)
        drawCloud(context, 280, 80, 50)
        // Noah figure
        context.beginPath()
        context.arc(190, 360, 12, 0, Math.PI * 2)
        context.stroke()
        context.moveTo(190, 372); context.lineTo(190, 400)
        context.moveTo(175, 385); context.lineTo(205, 385)
        context.stroke()
        break

      case 'star':
        // Sky
        context.fillStyle = '#E3F2FD'
        context.fillRect(0, 0, 380, 300)
        // Ground
        context.fillStyle = '#FFF8E1'
        context.fillRect(0, 300, 380, 200)
        // Stable
        context.beginPath()
        context.moveTo(100, 300); context.lineTo(190, 220); context.lineTo(280, 300)
        context.moveTo(120, 300); context.lineTo(120, 380); context.lineTo(260, 380); context.lineTo(260, 300)
        context.stroke()
        // Star
        drawStar(context, 190, 100, 30, 15, 5)
        // Rays
        for (let i = 0; i < 8; i++) {
          const angle = (i * Math.PI * 2) / 8
          context.beginPath()
          context.moveTo(190 + Math.cos(angle) * 40, 100 + Math.sin(angle) * 40)
          context.lineTo(190 + Math.cos(angle) * 60, 100 + Math.sin(angle) * 60)
          context.stroke()
        }
        // Manger
        context.beginPath()
        context.moveTo(170, 370); context.lineTo(210, 370)
        context.moveTo(170, 370); context.lineTo(165, 390)
        context.moveTo(210, 370); context.lineTo(215, 390)
        context.stroke()
        // Baby
        context.beginPath()
        context.ellipse(190, 360, 15, 8, 0, 0, Math.PI * 2)
        context.stroke()
        break

      case 'fish':
        // Water
        context.fillStyle = '#E3F2FD'
        context.fillRect(0, 200, 380, 300)
        // Big fish
        context.beginPath()
        context.ellipse(190, 350, 120, 70, 0, 0, Math.PI * 2)
        context.stroke()
        // Fish eye
        context.beginPath()
        context.arc(250, 330, 10, 0, Math.PI * 2)
        context.stroke()
        // Fish tail
        context.beginPath()
        context.moveTo(70, 350); context.lineTo(30, 310); context.lineTo(30, 390); context.closePath()
        context.stroke()
        // Jonah inside
        context.beginPath()
        context.arc(190, 350, 15, 0, Math.PI * 2)
        context.stroke()
        // Waves
        for (let x = 0; x < 380; x += 40) {
          context.beginPath()
          context.moveTo(x, 200)
          context.quadraticCurveTo(x + 20, 185, x + 40, 200)
          context.stroke()
        }
        // Sun
        context.beginPath()
        context.arc(320, 60, 30, 0, Math.PI * 2)
        context.stroke()
        break

      case 'lion':
        // Floor
        context.fillStyle = '#FFF8E1'
        context.fillRect(0, 350, 380, 150)
        // Cave walls
        context.beginPath()
        context.moveTo(0, 120); context.quadraticCurveTo(190, 0, 380, 120)
        context.moveTo(0, 120); context.lineTo(0, 500)
        context.moveTo(380, 120); context.lineTo(380, 500)
        context.stroke()
        // Lion 1
        drawLion(context, 80, 370)
        // Lion 2
        drawLion(context, 260, 370)
        // Daniel
        context.beginPath()
        context.arc(190, 280, 18, 0, Math.PI * 2) // head
        context.stroke()
        context.moveTo(190, 298); context.lineTo(190, 360) // body
        context.moveTo(170, 320); context.lineTo(210, 320) // arms (praying)
        context.moveTo(190, 360); context.lineTo(170, 400) // legs
        context.moveTo(190, 360); context.lineTo(210, 400)
        context.stroke()
        // Praying hands
        context.beginPath()
        context.moveTo(185, 310); context.lineTo(190, 300); context.lineTo(195, 310)
        context.stroke()
        break

      case 'sheep':
        // Sky
        context.fillStyle = '#E8F5E9'
        context.fillRect(0, 0, 380, 250)
        // Ground/hills
        context.fillStyle = '#C8E6C9'
        context.beginPath()
        context.moveTo(0, 350)
        context.quadraticCurveTo(100, 280, 190, 320)
        context.quadraticCurveTo(280, 360, 380, 300)
        context.lineTo(380, 500); context.lineTo(0, 500)
        context.fill()
        context.stroke()
        // Shepherd
        context.beginPath()
        context.arc(190, 250, 18, 0, Math.PI * 2)
        context.stroke()
        context.moveTo(190, 268); context.lineTo(190, 340)
        context.moveTo(165, 300); context.lineTo(215, 300)
        context.moveTo(190, 340); context.lineTo(170, 400)
        context.moveTo(190, 340); context.lineTo(210, 400)
        // Staff
        context.moveTo(215, 300); context.lineTo(230, 220)
        context.quadraticCurveTo(240, 200, 230, 200)
        context.stroke()
        // Sheep
        drawSheep(context, 80, 380)
        drawSheep(context, 140, 400)
        drawSheep(context, 280, 370)
        drawSheep(context, 310, 410)
        // Sun
        context.beginPath()
        context.arc(50, 60, 30, 0, Math.PI * 2)
        context.stroke()
        break

      case 'dove':
        // Sky
        context.fillStyle = '#E3F2FD'
        context.fillRect(0, 0, 380, 500)
        // Dove body
        context.beginPath()
        context.ellipse(190, 200, 40, 25, -0.2, 0, Math.PI * 2)
        context.stroke()
        // Dove head
        context.beginPath()
        context.arc(225, 180, 15, 0, Math.PI * 2)
        context.stroke()
        // Beak
        context.beginPath()
        context.moveTo(238, 178); context.lineTo(255, 182); context.lineTo(238, 185)
        context.stroke()
        // Eye
        context.beginPath()
        context.arc(230, 177, 3, 0, Math.PI * 2)
        context.fill()
        // Wings
        context.beginPath()
        context.moveTo(170, 190)
        context.quadraticCurveTo(120, 140, 100, 170)
        context.quadraticCurveTo(130, 160, 160, 195)
        context.stroke()
        context.beginPath()
        context.moveTo(200, 190)
        context.quadraticCurveTo(240, 130, 270, 150)
        context.quadraticCurveTo(245, 155, 210, 195)
        context.stroke()
        // Tail
        context.beginPath()
        context.moveTo(150, 205)
        context.lineTo(120, 220); context.lineTo(130, 200); context.lineTo(110, 210)
        context.stroke()
        // Olive branch in beak
        context.beginPath()
        context.moveTo(255, 182); context.lineTo(290, 175)
        context.moveTo(270, 178); context.lineTo(275, 168)
        context.moveTo(280, 176); context.lineTo(288, 168)
        context.stroke()
        // Clouds
        drawCloud(context, 50, 350, 50)
        drawCloud(context, 250, 380, 60)
        drawCloud(context, 150, 420, 40)
        break
    }
  }

  function drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number, w: number) {
    ctx.beginPath()
    ctx.arc(x, y, w * 0.3, 0, Math.PI * 2)
    ctx.arc(x + w * 0.3, y - w * 0.15, w * 0.35, 0, Math.PI * 2)
    ctx.arc(x + w * 0.6, y, w * 0.3, 0, Math.PI * 2)
    ctx.stroke()
  }

  function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, or: number, ir: number, n: number) {
    ctx.beginPath()
    for (let i = 0; i < n * 2; i++) {
      const r = i % 2 === 0 ? or : ir
      const a = (i * Math.PI) / n - Math.PI / 2
      if (i === 0) ctx.moveTo(cx + r * Math.cos(a), cy + r * Math.sin(a))
      else ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a))
    }
    ctx.closePath()
    ctx.stroke()
  }

  function drawLion(ctx: CanvasRenderingContext2D, x: number, y: number) {
    // Mane
    ctx.beginPath()
    ctx.arc(x, y - 25, 25, 0, Math.PI * 2)
    ctx.stroke()
    // Face
    ctx.beginPath()
    ctx.arc(x, y - 25, 15, 0, Math.PI * 2)
    ctx.stroke()
    // Eyes
    ctx.beginPath()
    ctx.arc(x - 5, y - 28, 2, 0, Math.PI * 2)
    ctx.arc(x + 5, y - 28, 2, 0, Math.PI * 2)
    ctx.fill()
    // Body
    ctx.beginPath()
    ctx.ellipse(x, y + 10, 25, 15, 0, 0, Math.PI * 2)
    ctx.stroke()
  }

  function drawSheep(ctx: CanvasRenderingContext2D, x: number, y: number) {
    // Fluffy body
    ctx.beginPath()
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI * 2) / 8
      ctx.arc(x + Math.cos(a) * 12, y + Math.sin(a) * 8, 10, 0, Math.PI * 2)
    }
    ctx.stroke()
    // Head
    ctx.beginPath()
    ctx.arc(x + 20, y - 5, 8, 0, Math.PI * 2)
    ctx.stroke()
    // Legs
    ctx.beginPath()
    ctx.moveTo(x - 8, y + 12); ctx.lineTo(x - 8, y + 30)
    ctx.moveTo(x + 8, y + 12); ctx.lineTo(x + 8, y + 30)
    ctx.stroke()
  }

  const getPos = (e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    if ('touches' in e) {
      return { x: (e.touches[0].clientX - rect.left) * scaleX, y: (e.touches[0].clientY - rect.top) * scaleY }
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY }
  }

  const startDraw = (e: React.TouchEvent | React.MouseEvent) => {
    if (!ctx) return
    e.preventDefault()
    setDrawing(true)
    const { x, y } = getPos(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.TouchEvent | React.MouseEvent) => {
    if (!drawing || !ctx) return
    e.preventDefault()
    const { x, y } = getPos(e)
    ctx.strokeStyle = selectedColor
    ctx.lineWidth = brushSize
    ctx.lineCap = 'round'
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const endDraw = () => setDrawing(false)

  const saveImage = () => {
    if (!canvasRef.current) return
    const link = document.createElement('a')
    link.download = `bible-coloring-${selectedScene}.png`
    link.href = canvasRef.current.toDataURL()
    link.click()
  }

  if (!selectedScene) {
    return (
      <div>
        <div className="app-header">
          <h1 style={{ fontSize: '26px', fontWeight: 800 }}>🎨 색칠하기</h1>
          <p style={{ fontSize: '14px', opacity: 0.8, marginTop: '4px' }}>성경 장면을 예쁘게 색칠해요!</p>
        </div>
        <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {scenes.map((scene, i) => (
            <div
              key={scene.id}
              className="card animate-fadeInUp"
              style={{ textAlign: 'center', padding: '24px 16px', cursor: 'pointer', animationDelay: `${i * 0.05}s`, opacity: 0 }}
              onClick={() => setSelectedScene(scene.id)}
            >
              <div style={{ fontSize: '48px' }}>{scene.emoji}</div>
              <p style={{ fontSize: '15px', fontWeight: 600, marginTop: '8px' }}>{scene.name}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'white', borderBottom: '1px solid #eee' }}>
        <button className="btn btn-outline btn-sm" onClick={() => setSelectedScene(null)}>← 뒤로</button>
        <span style={{ fontWeight: 700 }}>{scenes.find(s => s.id === selectedScene)?.name}</span>
        <button className="btn btn-primary btn-sm" onClick={saveImage}>💾 저장</button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', padding: '12px', background: '#f9f9f9' }}>
        <canvas
          ref={canvasRef}
          style={{ width: '100%', maxWidth: '380px', borderRadius: '16px', border: '2px solid #ddd', background: 'white', touchAction: 'none' }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />
      </div>

      {/* Color Palette */}
      <div style={{ padding: '12px 20px', display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {colors.map(c => (
          <div
            key={c}
            className={`color-swatch ${selectedColor === c ? 'active' : ''}`}
            style={{ background: c, border: c === '#FFFFFF' ? '2px solid #ddd' : undefined }}
            onClick={() => setSelectedColor(c)}
          />
        ))}
      </div>

      {/* Brush Size */}
      <div style={{ padding: '0 20px 100px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
        {[4, 8, 16, 24].map(s => (
          <button
            key={s}
            className={`btn btn-sm ${brushSize === s ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setBrushSize(s)}
          >
            <span style={{ display: 'inline-block', width: s, height: s, borderRadius: '50%', background: brushSize === s ? 'white' : 'var(--text)' }} />
          </button>
        ))}
      </div>
    </div>
  )
}
