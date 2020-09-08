import { useState } from 'react'

export function useGridAttr() {
  const [gridAttrs, setGridAttrs] = useState({
    type: 'doubleMesh',
    size: 10,
    color: '#e6e6e6',
    thickness: 1,
    colorSecond: '#d0d0d0',
    thicknessSecond: 1,
    factor: 4,
    bgColor: '#ffffff',
    showImage: false,
    repeat: 'no-repeat',
    angle: 0,
    position: 'center',
    bgSize: 'auto auto',
    opacity: 1,
  })
  const setGridAttr = (key: string, value: any) => {
    setGridAttrs((prev) => ({
      ...prev,
      [key]: value,
    }))
  }
  return {
    gridAttrs,
    setGridAttr,
  }
}
