'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { href: '/', icon: '🏠', label: '홈' },
  { href: '/stories', icon: '📖', label: '이야기' },
  { href: '/quiz', icon: '🎮', label: '퀴즈' },
  { href: '/memorize', icon: '💎', label: '암송' },
  { href: '/coloring', icon: '🎨', label: '색칠' },
  { href: '/profile', icon: '👤', label: '프로필' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-inner">
        {tabs.map(tab => {
          const active = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href)
          return (
            <Link key={tab.href} href={tab.href} className={`nav-item ${active ? 'active' : ''}`}>
              <span className="nav-icon">{tab.icon}</span>
              <span>{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
