'use client'
import { motion } from 'motion/react'
import Link from 'next/link'

const SECTIONS = [
  {
    emoji: '📚',
    title: '성경 이야기 읽기',
    desc: '12개의 핵심 성경 이야기를 쉽고 재미있게 읽을 수 있어요. 아이가 직접 터치하며 읽어요.',
    steps: ['홈 화면에서 "이야기" 탭을 누르세요', '읽고 싶은 이야기를 선택하세요', '그림과 함께 이야기를 읽어보세요'],
  },
  {
    emoji: '🧩',
    title: '퀴즈 풀기',
    desc: '성경 이야기를 얼마나 기억하는지 퀴즈로 확인해요! O/X, 선택, 빈칸채우기 등 다양한 형식.',
    steps: ['"퀴즈" 탭을 누르세요', '이야기를 선택하면 퀴즈가 시작돼요', '정답을 맞추면 포인트를 받아요! 🎉'],
  },
  {
    emoji: '💬',
    title: 'AI 캐릭터 대화',
    desc: '성경 속 인물들과 대화할 수 있어요! 모세, 다윗, 예수님 등에게 궁금한 걸 물어보세요.',
    steps: ['"대화" 탭을 누르세요', '대화하고 싶은 인물을 선택하세요', '메시지를 입력하면 AI가 대답해줘요'],
  },
  {
    emoji: '📝',
    title: '말씀 암송',
    desc: '30개의 핵심 성경 구절을 암송할 수 있어요. 반복하면서 자연스럽게 외워져요.',
    steps: ['"암송" 탭을 누르세요', '오늘의 암송 구절을 확인하세요', '빈칸을 채우며 암송해보세요'],
  },
  {
    emoji: '🎨',
    title: '컬러링',
    desc: '성경 장면을 색칠할 수 있어요. 터치로 쉽게 칠할 수 있어요.',
    steps: ['이야기를 읽은 후 "컬러링" 버튼을 누르세요', '원하는 색을 선택하세요', '손가락으로 터치하며 칠해보세요'],
  },
  {
    emoji: '🏆',
    title: '배지와 포인트',
    desc: '퀴즈를 풀고, 이야기를 읽으면 포인트와 배지를 받아요!',
    steps: ['프로필 탭에서 내 배지를 확인하세요', '퀴즈 정답 → 포인트 획득', '특별한 조건을 달성하면 배지를 받아요'],
  },
  {
    emoji: '👨‍👩‍👧‍👦',
    title: '부모님 안내',
    desc: '성경친구는 어린이의 성경 학습을 돕기 위한 앱입니다. 안전하게 사용할 수 있어요.',
    steps: ['모든 데이터는 기기에만 저장됩니다', '회원가입이 필요 없어요', 'AI 대화는 성경 내용만 다룹니다'],
  },
]

export default function GuidePage() {
  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px 16px' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '28px' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#9CA3AF', fontSize: '14px', marginBottom: '16px', textDecoration: 'none' }}>
          ← 홈으로
        </Link>
        <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#F59E0B' }}>
          📖 사용 가이드
        </h1>
        <p style={{ color: '#9CA3AF', fontSize: '15px', marginTop: '8px', lineHeight: 1.6 }}>
          성경친구의 모든 기능을 알려드려요
        </p>
      </motion.div>

      {/* Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {SECTIONS.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            style={{ background: '#FFF8F0', borderRadius: '20px', padding: '20px', border: '2px solid #FDE68A' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
                {s.emoji}
              </div>
              <div style={{ fontSize: '17px', fontWeight: 800, color: '#92400E' }}>{s.title}</div>
            </div>
            <p style={{ color: '#78716C', fontSize: '14px', lineHeight: 1.7, marginBottom: '12px' }}>{s.desc}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {s.steps.map((step, j) => (
                <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#F59E0B', color: 'white', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>{j + 1}</span>
                  <span style={{ fontSize: '14px', color: '#57534E', lineHeight: 1.6 }}>{step}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '32px 0', fontSize: '13px', color: '#9CA3AF' }}>
        <p>성경친구 by LightOn+ Lab</p>
        <p style={{ marginTop: '4px', opacity: 0.6 }}>문의: psh0825@gmail.com</p>
      </div>
    </div>
  )
}
