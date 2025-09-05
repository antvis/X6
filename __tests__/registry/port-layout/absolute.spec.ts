import { describe, expect, it } from 'vitest'
import { absolute } from '../../../src/registry/port-layout/absolute'

describe('absolute port layout', () => {
  const elemBBox = {
    x: 100,
    y: 100,
    width: 200,
    height: 100,
  }

  it('should handle numeric coordinates', () => {
    const portsPositionArgs = [
      { x: 50, y: 60, angle: 30 },
      { x: 150, y: 80, angle: 45 },
    ]

    const result = absolute(portsPositionArgs, elemBBox)

    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({
      angle: 30,
      position: {
        x: 50,
        y: 60,
      },
    })
    expect(result[1]).toEqual({ position: { x: 150, y: 80 }, angle: 45 })
  })

  it('should handle string coordinates with percentage', () => {
    const portsPositionArgs = [
      { x: '50%', y: '60%', angle: 90 },
      { x: '25%', y: '75%', angle: 180 },
    ]

    const result = absolute(portsPositionArgs, elemBBox)

    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({
      angle: 90,
      position: { x: 100, y: 60 },
    })

    expect(result[1]).toEqual({ position: { x: 50, y: 75 }, angle: 180 })
  })

  it('should handle mixed numeric and string coordinates', () => {
    const portsPositionArgs = [
      { x: 50, y: '50%', angle: 0 },
      { x: '25%', y: 75, angle: 270 },
    ]

    const result = absolute(portsPositionArgs, elemBBox)

    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({ position: { x: 50, y: 50 }, angle: 0 })
    expect(result[1]).toEqual({ position: { x: 50, y: 75 }, angle: 270 })
  })

  it('should handle missing angle parameter', () => {
    const portsPositionArgs = [
      { x: 50, y: 60 },
      { x: 150, y: 80, angle: 45 },
    ]

    const result = absolute(portsPositionArgs, elemBBox)

    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({
      angle: 0,
      position: { x: 50, y: 60 },
    })
    expect(result[1]).toEqual({ position: { x: 150, y: 80 }, angle: 45 })
  })

  it('should handle empty ports array', () => {
    const result = absolute([], elemBBox)
    expect(result).toEqual([])
  })

  it('should handle edge cases for percentage calculations', () => {
    const portsPositionArgs = [
      { x: '0%', y: '0%', angle: 0 },
      { x: '100%', y: '100%', angle: 0 },
    ]

    const result = absolute(portsPositionArgs, elemBBox)

    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({
      position: { x: 0, y: 0 },
      angle: 0,
    })
    expect(result[1]).toEqual({ angle: 0, position: { x: 200, y: 100 } })
  })
})
