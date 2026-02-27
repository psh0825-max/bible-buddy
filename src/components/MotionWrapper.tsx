'use client'
import { motion, AnimatePresence } from 'motion/react'
import { ReactNode } from 'react'

// Staggered list items
export function StaggerItem({ children, index = 0, className = '' }: { children: ReactNode; index?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Tappable card with spring feedback
export function TapCard({ children, onClick, className = '', style = {} }: { children: ReactNode; onClick?: () => void; className?: string; style?: React.CSSProperties }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      onClick={onClick}
      className={className}
      style={{ cursor: onClick ? 'pointer' : 'default', ...style }}
    >
      {children}
    </motion.div>
  )
}

// Bouncy button
export function BounceButton({ children, onClick, className = '', disabled = false, style = {} }: { children: ReactNode; onClick?: () => void; className?: string; disabled?: boolean; style?: React.CSSProperties }) {
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.04 }}
      whileTap={disabled ? {} : { scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 500, damping: 15 }}
      onClick={onClick}
      className={className}
      disabled={disabled}
      style={style}
    >
      {children}
    </motion.button>
  )
}

// Pop-in animation (for badges, stars, etc.)
export function PopIn({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -10 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 12, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Shake animation (for wrong answers)
export function Shake({ trigger, children, className = '' }: { trigger: boolean; children: ReactNode; className?: string }) {
  return (
    <motion.div
      animate={trigger ? { x: [0, -12, 12, -8, 8, -4, 4, 0] } : { x: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Float animation (for mascot/decorative elements)
export function Float({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Slide in from direction
export function SlideIn({ children, from = 'bottom', delay = 0, className = '' }: { children: ReactNode; from?: 'left' | 'right' | 'top' | 'bottom'; delay?: number; className?: string }) {
  const dirs = { left: { x: -50, y: 0 }, right: { x: 50, y: 0 }, top: { x: 0, y: -50 }, bottom: { x: 0, y: 50 } }
  return (
    <motion.div
      initial={{ opacity: 0, ...dirs[from] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Page transition wrapper
export function PageTransition({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Celebration burst (for quiz complete, badge earn)
export function CelebrationBurst({ show }: { show: boolean }) {
  if (!show) return null
  const emojis = ['⭐', '🌟', '✨', '💫', '🎉', '🎊', '💎', '👑']
  return (
    <AnimatePresence>
      {show && (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1000 }}>
          {emojis.map((emoji, i) => (
            <motion.div
              key={i}
              initial={{
                opacity: 1,
                x: '50vw',
                y: '50vh',
                scale: 0,
              }}
              animate={{
                opacity: 0,
                x: `${20 + Math.random() * 60}vw`,
                y: `${10 + Math.random() * 40}vh`,
                scale: 1.5 + Math.random(),
                rotate: Math.random() * 360,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 + Math.random() * 0.5, delay: i * 0.05 }}
              style={{ position: 'absolute', fontSize: '32px' }}
            >
              {emoji}
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  )
}

export { motion, AnimatePresence }
