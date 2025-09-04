import { describe, expect, it, vi } from 'vitest'
import { flipX } from '../../../src/registry/background/flip-x'

describe('flipX', () => {
  it('应该正确翻转并拼接图片', () => {
    // 创建模拟的上下文方法
    const mockCtx = {
      drawImage: vi.fn(),
      translate: vi.fn(),
      scale: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
    }

    // 创建模拟的canvas对象
    const mockCanvas = {
      width: 0,
      height: 0,
      getContext: vi.fn().mockReturnValue(mockCtx),
    }

    // 替换全局document对象
    vi.stubGlobal('document', {
      createElement: vi.fn().mockReturnValue(mockCanvas),
    })

    // 模拟图片对象
    const mockImage = {
      width: 100,
      height: 50,
    }

    // 执行测试
    const result = flipX(mockImage as unknown as HTMLImageElement)

    // 验证canvas创建和设置
    expect(document.createElement).toHaveBeenCalledWith('canvas')
    expect(mockCanvas.width).toBe(200)
    expect(mockCanvas.height).toBe(50)

    // 验证getContext调用
    expect(mockCanvas.getContext).toHaveBeenCalledWith('2d')
    // 验证绘图操作
    expect(mockCtx.drawImage).toHaveBeenCalledTimes(2)
    expect(mockCtx.drawImage).toHaveBeenNthCalledWith(
      1,
      mockImage,
      0,
      0,
      100,
      50,
    )
    expect(mockCtx.translate).toHaveBeenCalledWith(200, 0)
    expect(mockCtx.scale).toHaveBeenCalledWith(-1, 1)
    expect(mockCtx.drawImage).toHaveBeenNthCalledWith(
      2,
      mockImage,
      0,
      0,
      100,
      50,
    )

    // 验证返回值
    expect(result).toBe(mockCanvas)

    // 清理模拟
    vi.unstubAllGlobals()
  })
})
