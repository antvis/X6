import { describe, expect, it, vi } from 'vitest'
import { nodeCenter } from '../../../src/registry/node-anchor/node-center'

describe('nodeCenter', () => {
  const mockView = {
    cell: {
      getConnectionPoint: vi.fn(),
    },
  }

  const mockMagnet = {}
  const mockRef = {}
  const endType = 'target'

  it('应该返回节点的连接点', () => {
    const mockPoint = { x: 100, y: 50, translate: vi.fn() }
    mockView.cell.getConnectionPoint.mockReturnValue(mockPoint)

    const result = nodeCenter.call(
      { cell: {} },
      mockView,
      mockMagnet,
      mockRef,
      {},
      endType,
    )

    expect(mockView.cell.getConnectionPoint).toHaveBeenCalledWith({}, endType)
    expect(result).toBe(mockPoint)
  })

  it('应该应用 dx 偏移量', () => {
    const mockPoint = { x: 100, y: 50, translate: vi.fn() }
    mockView.cell.getConnectionPoint.mockReturnValue(mockPoint)

    const options = { dx: 10 }
    nodeCenter.call(
      { cell: {} },
      mockView,
      mockMagnet,
      mockRef,
      options,
      endType,
    )

    expect(mockPoint.translate).toHaveBeenCalledWith(10, 0)
  })

  it('应该应用 dy 偏移量', () => {
    const mockPoint = { x: 100, y: 50, translate: vi.fn() }
    mockView.cell.getConnectionPoint.mockReturnValue(mockPoint)

    const options = { dy: -5 }
    nodeCenter.call(
      { cell: {} },
      mockView,
      mockMagnet,
      mockRef,
      options,
      endType,
    )

    expect(mockPoint.translate).toHaveBeenCalledWith(0, -5)
  })

  it('应该同时应用 dx 和 dy 偏移量', () => {
    const mockPoint = { x: 100, y: 50, translate: vi.fn() }
    mockView.cell.getConnectionPoint.mockReturnValue(mockPoint)

    const options = { dx: 15, dy: 20 }
    nodeCenter.call(
      { cell: {} },
      mockView,
      mockMagnet,
      mockRef,
      options,
      endType,
    )

    expect(mockPoint.translate).toHaveBeenCalledWith(15, 20)
  })
})
