import React, { useState, useRef } from 'react'
import X6Editor from '@/x6Editor'

interface ClientRect {
  width: number,
  height: number,
  left: number,
  top: number,
}

export function useElementMove() {
  const [activeType, setActiveType] = useState('')
  const shadow = useRef<HTMLDivElement>(null)
  const [clientRect, setClientRect] = useState<ClientRect>({
    width: 0,
    height: 0,
    left: 0,
    top: 0,
  })

  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as any
    if (target.tagName === 'svg') {
      return;
    }
    const { width, height, type } = target.dataset
    const iWidhth = parseInt(width, 10)
    const iHeight = parseInt(height, 10)
    setActiveType(type)
    setClientRect({
      width: iWidhth,
      height: iHeight,
      left: e.clientX - iWidhth / 2,
      top: e.clientY - iHeight / 2,
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e
    setClientRect(c => ({
      ...c,
      left: clientX - c.width / 2,
      top: clientY - c.height / 2,
    }))
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    X6Editor.getInstance().addShape({
      type: activeType,
      clientX: e.clientX,
      clientY: e.clientY,
    })
    setActiveType('')
  }

  return {
    activeType,
    clientRect,
    shadow,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  }
}