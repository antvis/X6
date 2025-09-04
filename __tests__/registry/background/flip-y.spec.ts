import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { flipY } from '../../../src/registry/background/flip-y'

describe('flipY', () => {
  // 保存原始 document
  const originalDocument = globalThis.document

  // 模拟 Image 对象
  class MockImage {
    width = 100
    height = 50
  }

  // 模拟 canvas 上下文
  const mockContext = {
    drawImage: vi.fn(),
    translate: vi.fn(),
    scale: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
  }

  // 模拟 canvas 元素
  class MockCanvas {
    width = 0
    height = 0
    getContext() {
      return mockContext
    }
  }

  beforeEach(() => {
    // 完全实现 Document 接口的最小实现
    globalThis.document = {
      createElement(tagName: string) {
        if (tagName === 'canvas') {
          return new MockCanvas()
        }
        throw new Error(`Unsupported element: ${tagName}`)
      },
      // 必须实现 Document 的基本属性
      documentElement: {},
      head: {},
      body: {},
      // 类型断言确保满足 Document 接口
    } as unknown as Document

    // 重置所有 mock
    vi.clearAllMocks()
  })

  afterAll(() => {
    // 恢复原始 document
    globalThis.document = originalDocument
  })

  it('应该创建一个高度翻倍的画布', () => {
    const img = new MockImage()
    const result = flipY(img as unknown as HTMLImageElement)

    expect(result.width).toBe(img.width)
    expect(result.height).toBe(img.height * 2)
  })

  it('应该在画布上绘制原始图像和翻转图像', () => {
    const img = new MockImage()
    flipY(img as unknown as HTMLImageElement)

    expect(mockContext.drawImage).toHaveBeenCalledTimes(2)
    expect(mockContext.drawImage).toHaveBeenNthCalledWith(
      1,
      img,
      0,
      0,
      img.width,
      img.height,
    )
    expect(mockContext.translate).toHaveBeenCalledWith(0, 2 * img.height)
    expect(mockContext.scale).toHaveBeenCalledWith(1, -1)
    expect(mockContext.drawImage).toHaveBeenNthCalledWith(
      2,
      img,
      0,
      0,
      img.width,
      img.height,
    )
  })

  it('应该返回 canvas 元素', () => {
    const img = new MockImage()
    const result = flipY(img as unknown as HTMLImageElement)

    expect(result).toBeInstanceOf(MockCanvas)
  })
})
