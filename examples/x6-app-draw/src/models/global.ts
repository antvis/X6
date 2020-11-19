import { useState } from 'react'

export function useGridAttr() {
  const [gridAttrs, setGridAttrs] = useState({
    type: 'mesh',
    size: 10,
    color: '#e5e5e5',
    thickness: 1,
    colorSecond: '#d0d0d0',
    thicknessSecond: 1,
    factor: 4,
    bgColor: '#ffffff',
    showImage: true,
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
