import { describe, expect, it, vi } from 'vitest'
import { flipXY } from '../../../src/registry/background/flip-xy'

// 模拟 Image 对象
class MockImage {
  width = 100
  height = 80
  src = ''
  onload?: () => void
  constructor() {}
}

// 模拟 Canvas 和 Context
const mockCtx = {
  drawImage: vi.fn(),
  setTransform: vi.fn(),
}

const mockCanvas = {
  width: 0,
  height: 0,
  getContext: vi.fn(() => mockCtx),
}

// 设置全局模拟
vi.stubGlobal('document', {
  createElement: vi.fn((tag) => {
    if (tag === 'canvas') return mockCanvas
    if (tag === 'img') return new MockImage()
    return null
  }),
})

describe('flipXY', () => {
  beforeEach(() => {
    // 重置所有模拟
    vi.clearAllMocks()
    mockCanvas.width = 0
    mockCanvas.height = 0
  })

  it('应该创建一个 2x2 图像拼接的 canvas', () => {
    const img = new MockImage()
    const result = flipXY(img as unknown as HTMLImageElement)

    expect(result).toBe(mockCanvas)
    expect(mockCanvas.width).toBe(2 * img.width)
    expect(mockCanvas.height).toBe(2 * img.height)
  })

  it('应该正确调用 drawImage 和 setTransform 进行图像翻转', () => {
    const img = new MockImage()
    flipXY(img as unknown as HTMLImageElement)

    // 验证 getContext 调用
    expect(mockCanvas.getContext).toHaveBeenCalledWith('2d')

    // 验证四个象限的绘制
    const calls = mockCtx.setTransform.mock.calls

    // 第一个 transform 应该是 xy 翻转
    expect(calls[0]).toEqual([
      -1,
      0,
      0,
      -1,
      mockCanvas.width,
      mockCanvas.height,
    ])

    // 第二个 transform 应该是 x 翻转
    expect(calls[1]).toEqual([-1, 0, 0, 1, mockCanvas.width, 0])

    // 第三个 transform 应该是 y 翻转
    expect(calls[2]).toEqual([1, 0, 0, -1, 0, mockCanvas.height])

    // 验证 drawImage 被调用了4次
    expect(mockCtx.drawImage).toHaveBeenCalledTimes(4)
    mockCtx.drawImage.mock.calls.forEach((call) => {
      expect(call[0]).toBe(img)
      expect(call[1]).toBe(0)
      expect(call[2]).toBe(0)
      expect(call[3]).toBe(img.width)
      expect(call[4]).toBe(img.height)
    })
  })
})
