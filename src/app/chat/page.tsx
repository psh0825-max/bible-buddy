'use client'
import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'ai'
  text: string
}

const suggestions = [
  '하나님은 왜 무지개를 만들었어?',
  '예수님은 어디서 태어났어?',
  '노아는 왜 방주를 만들었어?',
  '다윗은 어떻게 골리앗을 이겼어?',
  '기도는 왜 해야 해?',
  '천국은 어떤 곳이야?',
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: '안녕! 나는 성경친구야 😊\n성경에 대해 궁금한 것이 있으면 뭐든지 물어봐!' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return
    const userMsg: Message = { role: 'user', text: text.trim() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim(), history: messages.slice(-10) }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'ai', text: data.reply || '미안, 잠시 오류가 났어요. 다시 물어봐 주세요!' }])
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: '인터넷 연결을 확인해 주세요 😅' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh' }}>
      {/* Header */}
      <div className="app-header" style={{ borderRadius: 0, padding: '16px 20px 20px', flexShrink: 0 }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800 }}>💬 AI 성경 선생님</h1>
        <p style={{ fontSize: '13px', opacity: 0.8, marginTop: '2px' }}>성경에 대해 궁금한 건 뭐든 물어봐요!</p>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflow: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{ fontSize: '12px', marginBottom: '4px', color: 'var(--text-light)' }}>
              {msg.role === 'ai' ? '👼 성경친구' : '🧒 나'}
            </div>
            <div className={`chat-bubble ${msg.role === 'ai' ? 'chat-bubble-ai' : 'chat-bubble-user'}`}>
              {msg.text.split('\n').map((line, j) => <p key={j} style={{ marginTop: j > 0 ? '8px' : 0 }}>{line}</p>)}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '12px', marginBottom: '4px', color: 'var(--text-light)' }}>👼 성경친구</div>
            <div className="chat-bubble chat-bubble-ai animate-sparkle">생각하는 중... 🤔</div>
          </div>
        )}
        <div ref={scrollRef} />

        {/* Suggestions */}
        {messages.length <= 2 && (
          <div style={{ marginTop: '8px' }}>
            <p style={{ fontSize: '14px', color: 'var(--text-light)', marginBottom: '8px' }}>💡 이런 것도 물어볼 수 있어요:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {suggestions.map(s => (
                <button key={s} className="btn btn-outline btn-sm" style={{ fontSize: '13px' }} onClick={() => sendMessage(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ padding: '12px 20px 100px', flexShrink: 0, background: 'var(--cream)' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="성경에 대해 물어보세요..."
            onKeyDown={e => { if (e.key === 'Enter') sendMessage(input) }}
            style={{
              flex: 1,
              padding: '14px 18px',
              borderRadius: '20px',
              border: '2px solid #e0e0e0',
              fontSize: '16px',
              outline: 'none',
              background: 'white',
            }}
          />
          <button
            className="btn btn-primary"
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            style={{ borderRadius: '20px', padding: '14px 20px' }}
          >
            전송
          </button>
        </div>
      </div>
    </div>
  )
}
