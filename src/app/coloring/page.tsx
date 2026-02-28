'use client'
import { useState, useRef, useEffect } from 'react'

const colors = [
  '#FF6B6B', '#FF9F43', '#FFD93D', '#6BCB77', '#4D96FF',
  '#9B59B6', '#FF69B4', '#1ABC9C', '#E74C3C', '#8B4513',
  '#F5DEB3', '#87CEEB', '#DDA0DD', '#90EE90', '#FFB6C1',
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

// SVG scene outlines - much better quality than Canvas drawing
const SVG_SCENES: Record<string, string> = {
  rainbow: `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
    <!-- Sky -->
    <rect x="0" y="0" width="400" height="300" fill="#f0f8ff" stroke="none"/>
    <!-- Rainbow arcs -->
    <path d="M50 280 Q200 50 350 280" fill="none" stroke="#ccc" stroke-width="12" opacity="0.3"/>
    <path d="M70 280 Q200 70 330 280" fill="none" stroke="#ccc" stroke-width="12" opacity="0.3"/>
    <path d="M90 280 Q200 90 310 280" fill="none" stroke="#ccc" stroke-width="12" opacity="0.3"/>
    <path d="M110 280 Q200 110 290 280" fill="none" stroke="#ccc" stroke-width="12" opacity="0.3"/>
    <!-- Ground -->
    <path d="M0 350 Q100 310 200 340 Q300 370 400 330 L400 500 L0 500 Z" fill="#e8f5e9" stroke="#999" stroke-width="1.5"/>
    <!-- Ark -->
    <path d="M130 380 L130 340 Q130 320 150 320 L250 320 Q270 320 270 340 L270 380 Z" fill="none" stroke="#333" stroke-width="2.5"/>
    <path d="M140 320 L140 300 Q140 290 155 290 L245 290 Q260 290 260 300 L260 320" fill="none" stroke="#333" stroke-width="2"/>
    <line x1="150" y1="320" x2="150" y2="290" stroke="#333" stroke-width="1.5"/>
    <line x1="200" y1="320" x2="200" y2="290" stroke="#333" stroke-width="1.5"/>
    <line x1="250" y1="320" x2="250" y2="290" stroke="#333" stroke-width="1.5"/>
    <!-- Clouds -->
    <circle cx="60" cy="100" r="25" fill="none" stroke="#333" stroke-width="2"/>
    <circle cx="85" cy="85" r="30" fill="none" stroke="#333" stroke-width="2"/>
    <circle cx="115" cy="100" r="25" fill="none" stroke="#333" stroke-width="2"/>
    <circle cx="300" cy="80" r="20" fill="none" stroke="#333" stroke-width="2"/>
    <circle cx="325" cy="70" r="25" fill="none" stroke="#333" stroke-width="2"/>
    <circle cx="345" cy="80" r="20" fill="none" stroke="#333" stroke-width="2"/>
    <!-- Noah (cute style) -->
    <circle cx="200" cy="355" r="14" fill="none" stroke="#333" stroke-width="2.5"/>
    <ellipse cx="200" cy="385" rx="16" ry="20" fill="none" stroke="#333" stroke-width="2.5"/>
    <circle cx="195" cy="352" r="2" fill="#333"/>
    <circle cx="205" cy="352" r="2" fill="#333"/>
    <path d="M197 360 Q200 363 203 360" fill="none" stroke="#333" stroke-width="1.5"/>
    <!-- Birds -->
    <path d="M320 140 Q325 130 330 140" fill="none" stroke="#333" stroke-width="1.5"/>
    <path d="M335 155 Q340 145 345 155" fill="none" stroke="#333" stroke-width="1.5"/>
  </svg>`,

  star: `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
    <!-- Night sky -->
    <rect x="0" y="0" width="400" height="320" fill="#e8eaf6" stroke="none"/>
    <!-- Ground -->
    <rect x="0" y="320" width="400" height="180" fill="#fff3e0" stroke="none"/>
    <!-- Big star -->
    <polygon points="200,40 215,85 260,85 225,115 235,160 200,135 165,160 175,115 140,85 185,85" fill="none" stroke="#333" stroke-width="2.5"/>
    <!-- Star rays -->
    <line x1="200" y1="20" x2="200" y2="5" stroke="#333" stroke-width="1.5" stroke-dasharray="3,3"/>
    <line x1="270" y1="60" x2="285" y2="50" stroke="#333" stroke-width="1.5" stroke-dasharray="3,3"/>
    <line x1="130" y1="60" x2="115" y2="50" stroke="#333" stroke-width="1.5" stroke-dasharray="3,3"/>
    <!-- Stable -->
    <path d="M120 320 L200 240 L280 320" fill="none" stroke="#333" stroke-width="2.5"/>
    <rect x="140" y="320" width="120" height="80" fill="none" stroke="#333" stroke-width="2.5"/>
    <line x1="140" y1="360" x2="260" y2="360" stroke="#333" stroke-width="1.5"/>
    <!-- Manger -->
    <path d="M175 375 L225 375 L230 395 L170 395 Z" fill="none" stroke="#333" stroke-width="2"/>
    <line x1="180" y1="395" x2="175" y2="410" stroke="#333" stroke-width="2"/>
    <line x1="220" y1="395" x2="225" y2="410" stroke="#333" stroke-width="2"/>
    <!-- Baby in manger -->
    <ellipse cx="200" cy="370" rx="18" ry="10" fill="none" stroke="#333" stroke-width="2"/>
    <circle cx="210" cy="363" r="7" fill="none" stroke="#333" stroke-width="2"/>
    <!-- Small stars -->
    <circle cx="50" cy="50" r="3" fill="none" stroke="#333" stroke-width="1.5"/>
    <circle cx="100" cy="80" r="2" fill="none" stroke="#333" stroke-width="1.5"/>
    <circle cx="330" cy="45" r="3" fill="none" stroke="#333" stroke-width="1.5"/>
    <circle cx="360" cy="100" r="2" fill="none" stroke="#333" stroke-width="1.5"/>
    <!-- Mary & Joseph (cute) -->
    <circle cx="130" cy="345" r="12" fill="none" stroke="#333" stroke-width="2"/>
    <ellipse cx="130" cy="375" rx="14" ry="18" fill="none" stroke="#333" stroke-width="2"/>
    <circle cx="270" cy="345" r="12" fill="none" stroke="#333" stroke-width="2"/>
    <ellipse cx="270" cy="375" rx="14" ry="18" fill="none" stroke="#333" stroke-width="2"/>
  </svg>`,

  fish: `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
    <!-- Sky -->
    <rect x="0" y="0" width="400" height="180" fill="#e3f2fd" stroke="none"/>
    <!-- Sea -->
    <rect x="0" y="180" width="400" height="320" fill="#bbdefb" stroke="none"/>
    <!-- Waves -->
    <path d="M0 180 Q25 165 50 180 Q75 195 100 180 Q125 165 150 180 Q175 195 200 180 Q225 165 250 180 Q275 195 300 180 Q325 165 350 180 Q375 195 400 180" fill="none" stroke="#333" stroke-width="2"/>
    <!-- Big whale -->
    <ellipse cx="200" cy="330" rx="130" ry="75" fill="none" stroke="#333" stroke-width="3"/>
    <!-- Whale eye -->
    <circle cx="280" cy="310" r="12" fill="none" stroke="#333" stroke-width="2"/>
    <circle cx="283" cy="308" r="5" fill="#333"/>
    <!-- Whale mouth -->
    <path d="M290 340 Q310 350 300 360" fill="none" stroke="#333" stroke-width="2"/>
    <!-- Whale tail -->
    <path d="M70 330 L20 280 Q15 275 20 280 L30 310" fill="none" stroke="#333" stroke-width="2.5"/>
    <path d="M70 330 L20 380 Q15 385 20 380 L30 350" fill="none" stroke="#333" stroke-width="2.5"/>
    <!-- Whale belly lines -->
    <path d="M130 360 Q200 380 270 360" fill="none" stroke="#333" stroke-width="1.5"/>
    <path d="M150 375 Q200 390 250 375" fill="none" stroke="#333" stroke-width="1.5"/>
    <!-- Jonah in whale (visible through outline) -->
    <circle cx="200" cy="320" r="12" fill="none" stroke="#333" stroke-width="2"/>
    <ellipse cx="200" cy="345" rx="10" ry="14" fill="none" stroke="#333" stroke-width="2"/>
    <!-- Water spout -->
    <path d="M260 255 Q265 230 255 210 M260 255 Q270 225 275 210" fill="none" stroke="#333" stroke-width="2"/>
    <!-- Small fish -->
    <ellipse cx="330" cy="430" rx="18" ry="10" fill="none" stroke="#333" stroke-width="1.5"/>
    <path d="M310 430 L300 420 L300 440 Z" fill="none" stroke="#333" stroke-width="1.5"/>
    <ellipse cx="80" cy="450" rx="15" ry="8" fill="none" stroke="#333" stroke-width="1.5"/>
    <path d="M63 450 L55 443 L55 457 Z" fill="none" stroke="#333" stroke-width="1.5"/>
    <!-- Sun -->
    <circle cx="340" cy="60" r="35" fill="none" stroke="#333" stroke-width="2"/>
    <!-- Sun rays -->
    <line x1="340" y1="15" x2="340" y2="5" stroke="#333" stroke-width="1.5"/>
    <line x1="375" y1="60" x2="385" y2="60" stroke="#333" stroke-width="1.5"/>
    <line x1="365" y1="30" x2="373" y2="23" stroke="#333" stroke-width="1.5"/>
    <!-- Bubbles -->
    <circle cx="320" cy="270" r="5" fill="none" stroke="#333" stroke-width="1"/>
    <circle cx="330" cy="250" r="3" fill="none" stroke="#333" stroke-width="1"/>
    <circle cx="310" cy="240" r="4" fill="none" stroke="#333" stroke-width="1"/>
  </svg>`,

  lion: `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
    <!-- Cave -->
    <path d="M0 80 Q200 -20 400 80 L400 500 L0 500 Z" fill="#fff8e1" stroke="#333" stroke-width="2"/>
    <path d="M10 90 Q200 0 390 90" fill="none" stroke="#333" stroke-width="3"/>
    <!-- Cave interior darker area -->
    <rect x="0" y="380" width="400" height="120" fill="#f5f0e0" stroke="none"/>
    <!-- Daniel kneeling/praying -->
    <circle cx="200" cy="200" r="18" fill="none" stroke="#333" stroke-width="2.5"/>
    <circle cx="195" cy="197" r="2.5" fill="#333"/>
    <circle cx="205" cy="197" r="2.5" fill="#333"/>
    <path d="M196 206 Q200 210 204 206" fill="none" stroke="#333" stroke-width="1.5"/>
    <ellipse cx="200" cy="240" rx="18" ry="22" fill="none" stroke="#333" stroke-width="2.5"/>
    <!-- Praying hands -->
    <path d="M188 225 L195 215 L200 225" fill="none" stroke="#333" stroke-width="2"/>
    <path d="M212 225 L205 215 L200 225" fill="none" stroke="#333" stroke-width="2"/>
    <!-- Lion left -->
    <circle cx="90" cy="370" r="30" fill="none" stroke="#333" stroke-width="2.5"/>
    <circle cx="90" cy="370" r="18" fill="none" stroke="#333" stroke-width="2"/>
    <circle cx="84" cy="366" r="3" fill="#333"/>
    <circle cx="96" cy="366" r="3" fill="#333"/>
    <ellipse cx="90" cy="377" rx="8" ry="5" fill="none" stroke="#333" stroke-width="1.5"/>
    <ellipse cx="90" cy="415" rx="28" ry="18" fill="none" stroke="#333" stroke-width="2.5"/>
    <line x1="70" y1="430" x2="70" y2="455" stroke="#333" stroke-width="3"/>
    <line x1="110" y1="430" x2="110" y2="455" stroke="#333" stroke-width="3"/>
    <path d="M60 435 Q50 445 55 455" fill="none" stroke="#333" stroke-width="2.5"/>
    <!-- Lion right -->
    <circle cx="310" cy="370" r="30" fill="none" stroke="#333" stroke-width="2.5"/>
    <circle cx="310" cy="370" r="18" fill="none" stroke="#333" stroke-width="2"/>
    <circle cx="304" cy="366" r="3" fill="#333"/>
    <circle cx="316" cy="366" r="3" fill="#333"/>
    <ellipse cx="310" cy="377" rx="8" ry="5" fill="none" stroke="#333" stroke-width="1.5"/>
    <ellipse cx="310" cy="415" rx="28" ry="18" fill="none" stroke="#333" stroke-width="2.5"/>
    <line x1="290" y1="430" x2="290" y2="455" stroke="#333" stroke-width="3"/>
    <line x1="330" y1="430" x2="330" y2="455" stroke="#333" stroke-width="3"/>
    <path d="M340 435 Q350 445 345 455" fill="none" stroke="#333" stroke-width="2.5"/>
    <!-- Light from above -->
    <line x1="185" y1="100" x2="175" y2="170" stroke="#333" stroke-width="1" stroke-dasharray="4,4" opacity="0.4"/>
    <line x1="200" y1="95" x2="200" y2="170" stroke="#333" stroke-width="1" stroke-dasharray="4,4" opacity="0.4"/>
    <line x1="215" y1="100" x2="225" y2="170" stroke="#333" stroke-width="1" stroke-dasharray="4,4" opacity="0.4"/>
  </svg>`,

  sheep: `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
    <!-- Sky -->
    <rect x="0" y="0" width="400" height="250" fill="#e8f5e9" stroke="none"/>
    <!-- Hills -->
    <path d="M0 300 Q80 240 160 280 Q240 320 320 270 Q360 250 400 280 L400 500 L0 500 Z" fill="#c8e6c9" stroke="#999" stroke-width="1.5"/>
    <path d="M0 360 Q100 320 200 350 Q300 380 400 340 L400 500 L0 500 Z" fill="#a5d6a7" stroke="#999" stroke-width="1.5"/>
    <!-- Sun -->
    <circle cx="340" cy="60" r="35" fill="none" stroke="#333" stroke-width="2"/>
    <!-- Clouds -->
    <circle cx="80" cy="60" r="18" fill="none" stroke="#333" stroke-width="1.5"/>
    <circle cx="100" cy="50" r="22" fill="none" stroke="#333" stroke-width="1.5"/>
    <circle cx="125" cy="60" r="18" fill="none" stroke="#333" stroke-width="1.5"/>
    <!-- Shepherd (cute chibi style) -->
    <circle cx="200" cy="215" r="18" fill="none" stroke="#333" stroke-width="2.5"/>
    <circle cx="194" cy="212" r="2.5" fill="#333"/>
    <circle cx="206" cy="212" r="2.5" fill="#333"/>
    <path d="M196 222 Q200 226 204 222" fill="none" stroke="#333" stroke-width="1.5"/>
    <ellipse cx="200" cy="258" rx="20" ry="24" fill="none" stroke="#333" stroke-width="2.5"/>
    <line x1="200" y1="282" x2="190" y2="310" stroke="#333" stroke-width="2.5"/>
    <line x1="200" y1="282" x2="210" y2="310" stroke="#333" stroke-width="2.5"/>
    <!-- Staff -->
    <line x1="228" y1="200" x2="235" y2="310" stroke="#333" stroke-width="2.5"/>
    <path d="M228 200 Q225 185 215 190" fill="none" stroke="#333" stroke-width="2.5"/>
    <!-- Sheep 1 (cute round) -->
    <ellipse cx="80" cy="370" rx="28" ry="20" fill="none" stroke="#333" stroke-width="2.5"/>
    <circle cx="80" cy="365" r="22" fill="none" stroke="#333" stroke-width="2" stroke-dasharray="5,3"/>
    <circle cx="105" cy="360" r="10" fill="none" stroke="#333" stroke-width="2"/>
    <circle cx="108" cy="358" r="2" fill="#333"/>
    <line x1="65" y1="388" x2="65" y2="405" stroke="#333" stroke-width="2"/>
    <line x1="95" y1="388" x2="95" y2="405" stroke="#333" stroke-width="2"/>
    <!-- Sheep 2 -->
    <ellipse cx="310" cy="350" rx="25" ry="18" fill="none" stroke="#333" stroke-width="2.5"/>
    <circle cx="310" cy="345" r="20" fill="none" stroke="#333" stroke-width="2" stroke-dasharray="5,3"/>
    <circle cx="332" cy="340" r="9" fill="none" stroke="#333" stroke-width="2"/>
    <circle cx="335" cy="338" r="2" fill="#333"/>
    <line x1="295" y1="366" x2="295" y2="382" stroke="#333" stroke-width="2"/>
    <line x1="322" y1="366" x2="322" y2="382" stroke="#333" stroke-width="2"/>
    <!-- Sheep 3 (small, far) -->
    <ellipse cx="160" cy="400" rx="20" ry="14" fill="none" stroke="#333" stroke-width="2"/>
    <circle cx="160" cy="396" r="16" fill="none" stroke="#333" stroke-width="1.5" stroke-dasharray="4,3"/>
    <circle cx="178" cy="392" r="7" fill="none" stroke="#333" stroke-width="1.5"/>
    <circle cx="180" cy="391" r="1.5" fill="#333"/>
    <!-- Flowers -->
    <circle cx="120" cy="420" r="5" fill="none" stroke="#333" stroke-width="1"/>
    <circle cx="260" cy="400" r="5" fill="none" stroke="#333" stroke-width="1"/>
    <circle cx="350" cy="430" r="4" fill="none" stroke="#333" stroke-width="1"/>
    <line x1="120" y1="425" x2="120" y2="440" stroke="#333" stroke-width="1"/>
    <line x1="260" y1="405" x2="260" y2="420" stroke="#333" stroke-width="1"/>
    <line x1="350" y1="434" x2="350" y2="448" stroke="#333" stroke-width="1"/>
  </svg>`,

  dove: `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
    <!-- Sky -->
    <rect x="0" y="0" width="400" height="500" fill="#e3f2fd" stroke="none"/>
    <!-- Clouds -->
    <ellipse cx="60" cy="380" rx="45" ry="20" fill="none" stroke="#333" stroke-width="1.5"/>
    <ellipse cx="340" cy="400" rx="50" ry="22" fill="none" stroke="#333" stroke-width="1.5"/>
    <ellipse cx="180" cy="430" rx="40" ry="18" fill="none" stroke="#333" stroke-width="1.5"/>
    <!-- Dove body -->
    <ellipse cx="200" cy="210" rx="50" ry="30" fill="none" stroke="#333" stroke-width="2.5"/>
    <!-- Dove head -->
    <circle cx="245" cy="185" r="20" fill="none" stroke="#333" stroke-width="2.5"/>
    <!-- Eye -->
    <circle cx="252" cy="180" r="4" fill="none" stroke="#333" stroke-width="2"/>
    <circle cx="253" cy="179" r="1.5" fill="#333"/>
    <!-- Beak -->
    <path d="M263 188 L285 192 L263 196" fill="none" stroke="#333" stroke-width="2"/>
    <!-- Left wing (spread) -->
    <path d="M165 200 Q120 140 80 160 Q100 155 120 170 Q105 145 75 150 Q110 140 135 165 Q120 135 100 135 Q140 140 155 195" fill="none" stroke="#333" stroke-width="2.5"/>
    <!-- Right wing (spread) -->
    <path d="M220 195 Q260 130 300 145 Q280 140 265 155 Q285 130 310 135 Q275 135 255 160 Q280 125 300 120 Q260 135 235 190" fill="none" stroke="#333" stroke-width="2.5"/>
    <!-- Tail feathers -->
    <path d="M150 215 L115 240 L125 215 L100 235 L120 210" fill="none" stroke="#333" stroke-width="2"/>
    <!-- Olive branch in beak -->
    <path d="M285 192 Q310 185 325 180" fill="none" stroke="#333" stroke-width="2"/>
    <ellipse cx="305" cy="178" rx="8" ry="5" transform="rotate(-15 305 178)" fill="none" stroke="#333" stroke-width="1.5"/>
    <ellipse cx="318" cy="174" rx="7" ry="4" transform="rotate(-10 318 174)" fill="none" stroke="#333" stroke-width="1.5"/>
    <ellipse cx="328" cy="176" rx="6" ry="4" transform="rotate(-5 328 176)" fill="none" stroke="#333" stroke-width="1.5"/>
    <!-- Light rays from above -->
    <line x1="170" y1="50" x2="180" y2="120" stroke="#333" stroke-width="1" stroke-dasharray="5,5" opacity="0.3"/>
    <line x1="200" y1="40" x2="200" y2="120" stroke="#333" stroke-width="1" stroke-dasharray="5,5" opacity="0.3"/>
    <line x1="230" y1="50" x2="220" y2="120" stroke="#333" stroke-width="1" stroke-dasharray="5,5" opacity="0.3"/>
    <!-- Small hearts -->
    <path d="M320 260 Q325 250 330 260 Q335 250 340 260 Q330 275 320 260" fill="none" stroke="#333" stroke-width="1.5"/>
    <path d="M70 280 Q73 273 76 280 Q79 273 82 280 Q76 290 70 280" fill="none" stroke="#333" stroke-width="1.5"/>
  </svg>`,
}

export default function ColoringPage() {
  const [selectedScene, setSelectedScene] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState(colors[0])
  const [brushSize, setBrushSize] = useState(12)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayRef = useRef<HTMLCanvasElement>(null)
  const [drawing, setDrawing] = useState(false)
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)

  useEffect(() => {
    if (!selectedScene || !overlayRef.current) return
    const canvas = overlayRef.current
    const context = canvas.getContext('2d')
    if (!context) return
    canvas.width = 400
    canvas.height = 500
    context.clearRect(0, 0, 400, 500)
    setCtx(context)
  }, [selectedScene])

  const getPos = (e: React.TouchEvent | React.MouseEvent) => {
    const canvas = overlayRef.current!
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
    ctx.lineJoin = 'round'
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const endDraw = () => setDrawing(false)

  const clearCanvas = () => {
    if (!ctx || !overlayRef.current) return
    ctx.clearRect(0, 0, overlayRef.current.width, overlayRef.current.height)
  }

  const saveImage = () => {
    if (!overlayRef.current) return
    // Merge SVG background + canvas drawing
    const mergeCanvas = document.createElement('canvas')
    mergeCanvas.width = 400
    mergeCanvas.height = 500
    const mergeCtx = mergeCanvas.getContext('2d')!

    // Draw white bg
    mergeCtx.fillStyle = 'white'
    mergeCtx.fillRect(0, 0, 400, 500)

    // Draw the user's coloring
    mergeCtx.drawImage(overlayRef.current, 0, 0)

    // Draw SVG on top (outlines)
    const svgStr = SVG_SCENES[selectedScene!]
    const img = new Image()
    const blob = new Blob([svgStr], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    img.onload = () => {
      mergeCtx.drawImage(img, 0, 0, 400, 500)
      URL.revokeObjectURL(url)
      const link = document.createElement('a')
      link.download = `bible-coloring-${selectedScene}.png`
      link.href = mergeCanvas.toDataURL()
      link.click()
    }
    img.src = url
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
        <button className="btn btn-outline btn-sm" onClick={() => { setSelectedScene(null); setCtx(null) }}>← 뒤로</button>
        <span style={{ fontWeight: 700, fontSize: '15px' }}>{scenes.find(s => s.id === selectedScene)?.name}</span>
        <button className="btn btn-primary btn-sm" onClick={saveImage}>💾 저장</button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', padding: '12px', background: '#f5f5f5' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '400px', aspectRatio: '400/500', borderRadius: '16px', overflow: 'hidden', border: '2px solid #ddd', background: 'white' }}>
          {/* SVG background (outlines) */}
          <div
            style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }}
            dangerouslySetInnerHTML={{ __html: SVG_SCENES[selectedScene] || '' }}
          />
          {/* Drawing canvas (below outlines) */}
          <canvas
            ref={overlayRef}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1, touchAction: 'none' }}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={endDraw}
            onMouseLeave={endDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={endDraw}
          />
        </div>
      </div>

      {/* Color Palette */}
      <div style={{ padding: '12px 16px', display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {colors.map(c => (
          <div
            key={c}
            onClick={() => setSelectedColor(c)}
            style={{
              width: '36px', height: '36px', borderRadius: '50%', background: c,
              border: selectedColor === c ? '3px solid #333' : c === '#FFFFFF' ? '2px solid #ddd' : '2px solid transparent',
              cursor: 'pointer', transition: 'transform 0.15s',
              transform: selectedColor === c ? 'scale(1.2)' : 'scale(1)',
              boxShadow: selectedColor === c ? '0 2px 8px rgba(0,0,0,0.2)' : 'none',
            }}
          />
        ))}
      </div>

      {/* Brush Size + Clear */}
      <div style={{ padding: '8px 20px 100px', display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
        {[6, 12, 20, 30].map(s => (
          <button
            key={s}
            className={`btn btn-sm ${brushSize === s ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setBrushSize(s)}
            style={{ width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <span style={{ display: 'inline-block', width: Math.min(s, 24), height: Math.min(s, 24), borderRadius: '50%', background: brushSize === s ? 'white' : 'var(--text)' }} />
          </button>
        ))}
        <button className="btn btn-sm btn-outline" onClick={clearCanvas} style={{ marginLeft: '8px' }}>
          🔄 지우기
        </button>
      </div>
    </div>
  )
}
