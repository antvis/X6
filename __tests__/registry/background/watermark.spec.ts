import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Angle } from '../../../src/geometry'
import { watermark } from '../../../src/registry/background/watermark'

// Mock HTMLCanvasElement 和 Image
const mockDrawImage = vi.fn()
const mockSetTransform = vi.fn()
const mockRotate = vi.fn()
const mockGetContext = vi.fn(() => ({
  drawImage: mockDrawImage,
  setTransform: mockSetTransform,
  rotate: mockRotate,
  resetTransform: vi.fn(),
  clearRect: vi.fn(),
}))

// Mock document.createElement
const mockCreateElement = vi.fn(() => ({
  width: 0,
  height: 0,
  getContext: mockGetContext,
}))

// Mock Image constructor
class MockImage {
  width = 100
  height = 50
  constructor() {}
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.stubGlobal('document', { createElement: mockCreateElement })
  vi.stubGlobal('Image', MockImage as any)
})

describe('watermark', () => {
  it('应该创建一个 3 倍大小的 canvas', () => {
    const img = new Image()
    const result = watermark(img, {})

    expect(mockCreateElement).toHaveBeenCalledWith('canvas')
    expect(result.width).toBe(img.width * 3)
    expect(result.height).toBe(img.height * 3)
  })

  it('应该使用默认角度 -20 度', () => {
    const img = new Image()
    watermark(img, {})

    // 验证旋转角度计算正确
    const expectedRadians = Angle.toRad(-20)
    expect(mockRotate).toHaveBeenCalledWith(expectedRadians)
  })

  it('应该使用自定义角度', () => {
    const img = new Image()
    const customAngle = 45
    watermark(img, { angle: customAngle })

    const expectedRadians = Angle.toRad(-customAngle)
    expect(mockRotate).toHaveBeenCalledWith(expectedRadians)
  })

  it('应该在正确的位置绘制水印', () => {
    const img = new Image()
    watermark(img, {})
    // 验证在 4x4 网格的特定位置绘制
    // 应该调用 8 次 drawImage（因为 (i+j)%2 > 0 的条件）
    expect(mockDrawImage).toHaveBeenCalledTimes(8)

    // 验证每次调用的参数
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if ((i + j) % 2 > 0) {
          expect(mockSetTransform).toHaveBeenCalledWith(
            1,
            0,
            0,
            1,
            (2 * i - 1) * ((img.width * 3) / 4),
            (2 * j - 1) * ((img.height * 3) / 4),
          )
        }
      }
    }
  })

  it('应该返回 canvas 对象', () => {
    const img = new Image()
    const result = watermark(img, {})

    expect(result).toBeDefined()
    expect(result.getContext).toBeDefined()
  })
})

describe('Angle utility', () => {
  it('应该正确转换角度到弧度', () => {
    expect(Angle.toRad(0)).toBe(0)
    expect(Angle.toRad(180)).toBeCloseTo(Math.PI, 10)
  })
})
