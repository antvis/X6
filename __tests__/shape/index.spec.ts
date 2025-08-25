import { describe, expect, it } from 'vitest'
import * as ShapeExports from '../../src/shape/index'

describe('shape', () => {
  it('should export all expected modules', () => {
    expect(typeof ShapeExports).toBe('object')
  })

  it('should have all required exports', () => {
    const exportKeys = Object.keys(ShapeExports)
    expect(exportKeys.length).toBe(10)

    expect(exportKeys).toEqual([
      'Circle',
      'Edge',
      'Ellipse',
      'HTML',
      'Image',
      'Path',
      'Polygon',
      'Polyline',
      'Rect',
      'TextBlock',
    ])
  })
})
