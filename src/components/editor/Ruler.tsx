import { useRef, useEffect, useState } from 'react'
import { useEditorStore } from '@/editor/useEditorStore'

export default function Ruler() {
  const marginLeft = useEditorStore(state => state.marginLeft)
  const marginRight = useEditorStore(state => state.marginRight)
  const setMargins = useEditorStore(state => state.setMargins)

  const rulerRef = useRef<HTMLDivElement>(null)
  const [isDraggingLeft, setIsDraggingLeft] = useState(false)
  const [isDraggingRight, setIsDraggingRight] = useState(false)

  // 21 cm ticks for A4 width
  const ticks = Array.from({ length: 22 }, (_, i) => i)

  const handleMouseDownLeft = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDraggingLeft(true)
  }

  const handleMouseDownRight = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDraggingRight(true)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!rulerRef.current) return
      const rect = rulerRef.current.getBoundingClientRect()
      const ratio = rect.width / 210
      const relativeX = e.clientX - rect.left
      const valueMm = relativeX / ratio

      if (isDraggingLeft) {
        setMargins({ left: Math.round(Math.min(Math.max(5, valueMm), 60)) })
      } else if (isDraggingRight) {
        setMargins({ right: Math.round(Math.min(Math.max(5, 210 - valueMm), 60)) })
      }
    }

    const handleMouseUp = () => {
      setIsDraggingLeft(false)
      setIsDraggingRight(false)
    }

    if (isDraggingLeft || isDraggingRight) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = 'none'
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = ''
    }
  }, [isDraggingLeft, isDraggingRight, setMargins])

  return (
    <div
      ref={rulerRef}
      className="ruler-container"
      style={{
        width: '210mm',
        height: '28px',
        borderRadius: '6px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        userSelect: 'none',
        flexShrink: 0,
        backgroundColor: 'var(--color-bg-tertiary)',
        borderColor: 'var(--color-border)',
        borderWidth: '1px',
        borderStyle: 'solid',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      {/* Tick marks */}
      {ticks.map(cm => (
        <div
          key={cm}
          style={{
            position: 'absolute',
            left: `${(cm / 21) * 100}%`,
            top: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            pointerEvents: 'none',
          }}
        >
          <span style={{
            fontSize: '9px',
            color: 'var(--color-text-tertiary)',
            fontFamily: 'monospace',
            lineHeight: 1,
            marginTop: '2px',
          }}>{cm}</span>
          <div style={{
            width: '1px',
            height: cm % 5 === 0 ? '8px' : '4px',
            background: cm % 5 === 0 ? 'var(--color-primary)' : 'var(--color-border-light)',
            marginBottom: '2px',
          }} />
        </div>
      ))}

      {/* Left margin overlay */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: `${(marginLeft / 210) * 100}%`,
        background: 'var(--color-bg-secondary)',
        opacity: 0.5,
        borderRight: '2px solid var(--color-primary)',
      }} />

      {/* Right margin overlay */}
      <div style={{
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: `${(marginRight / 210) * 100}%`,
        background: 'var(--color-bg-secondary)',
        opacity: 0.5,
        borderLeft: '2px solid var(--color-primary)',
      }} />

      {/* Left drag handle */}
      <div
        onMouseDown={handleMouseDownLeft}
        style={{
          position: 'absolute',
          left: `${(marginLeft / 210) * 100}%`,
          top: 0,
          bottom: 0,
          width: '20px',
          marginLeft: '-10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'ew-resize',
          zIndex: 10,
        }}
      >
        <div style={{
          width: '10px',
          height: '18px',
          background: isDraggingLeft ? 'var(--color-primary-light)' : 'var(--color-primary)',
          borderRadius: '3px',
          boxShadow: isDraggingLeft ? '0 0 8px var(--color-primary)' : 'var(--shadow-sm)',
          transition: 'background 0.15s',
        }} />
      </div>

      {/* Right drag handle */}
      <div
        onMouseDown={handleMouseDownRight}
        style={{
          position: 'absolute',
          right: `${(marginRight / 210) * 100}%`,
          top: 0,
          bottom: 0,
          width: '20px',
          marginRight: '-10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'ew-resize',
          zIndex: 10,
        }}
      >
        <div style={{
          width: '10px',
          height: '18px',
          background: isDraggingRight ? 'var(--color-primary-light)' : 'var(--color-primary)',
          borderRadius: '3px',
          boxShadow: isDraggingRight ? '0 0 8px var(--color-primary)' : 'var(--shadow-sm)',
          transition: 'background 0.15s',
        }} />
      </div>
    </div>
  )
}
