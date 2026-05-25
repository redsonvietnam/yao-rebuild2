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
      style={{
        width: '210mm',
        height: '28px',
        background: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '6px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        userSelect: 'none',
        flexShrink: 0,
        boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
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
            color: '#94a3b8',
            fontFamily: 'monospace',
            lineHeight: 1,
            marginTop: '2px',
          }}>{cm}</span>
          <div style={{
            width: '1px',
            height: cm % 5 === 0 ? '8px' : '4px',
            background: cm % 5 === 0 ? '#6366f1' : '#475569',
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
        background: 'rgba(15, 23, 42, 0.5)',
        borderRight: '2px solid rgba(99, 102, 241, 0.6)',
      }} />

      {/* Right margin overlay */}
      <div style={{
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: `${(marginRight / 210) * 100}%`,
        background: 'rgba(15, 23, 42, 0.5)',
        borderLeft: '2px solid rgba(99, 102, 241, 0.6)',
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
          background: isDraggingLeft ? '#a5b4fc' : '#6366f1',
          borderRadius: '3px',
          boxShadow: isDraggingLeft ? '0 0 8px rgba(99,102,241,0.8)' : '0 2px 4px rgba(0,0,0,0.4)',
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
          background: isDraggingRight ? '#a5b4fc' : '#6366f1',
          borderRadius: '3px',
          boxShadow: isDraggingRight ? '0 0 8px rgba(99,102,241,0.8)' : '0 2px 4px rgba(0,0,0,0.4)',
          transition: 'background 0.15s',
        }} />
      </div>
    </div>
  )
}
