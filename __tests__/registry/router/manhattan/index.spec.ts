import { beforeEach, describe, expect, it, vi } from 'vitest'
import { FunctionExt } from '../../../../src/common'
import { manhattan } from '../../../../src/registry/router/manhattan/index'

vi.mock('../../../../src/common', () => ({
  FunctionExt: {
    call: vi.fn(),
  },
}))

describe('manhattan router', () => {
  const mockVertices = [
    { x: 0, y: 0 },
    { x: 100, y: 100 },
  ]
  const mockOptions = { step: 10 }
  const mockEdgeView = { source: 'node1', target: 'node2' }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should call FunctionExt.call with correct parameters', () => {
    manhattan.call({}, mockVertices, mockOptions, mockEdgeView)

    expect(FunctionExt.call).toHaveBeenCalledWith(
      expect.any(Function),
      {},
      mockVertices,
      expect.objectContaining({ step: 10 }),
      mockEdgeView,
    )
  })

  it('should merge default options with provided options', () => {
    const customOptions = { step: 20, excludeEnds: ['source'] }

    manhattan.call({}, mockVertices, customOptions, mockEdgeView)

    const calledWithOptions = (FunctionExt.call as any).mock.calls[0][3]
    expect(calledWithOptions).toMatchObject(customOptions)
    expect(calledWithOptions).toHaveProperty('step', 20)
  })

  it('should return the result from FunctionExt.call', () => {
    const expectedResult = [
      { x: 0, y: 0 },
      { x: 50, y: 50 },
      { x: 100, y: 100 },
    ]
    ;(FunctionExt.call as any).mockReturnValue(expectedResult)

    const result = manhattan.call({}, mockVertices, mockOptions, mockEdgeView)

    expect(result).toEqual(expectedResult)
    expect(FunctionExt.call).toHaveBeenCalledTimes(1)
  })

  it('should handle empty options object', () => {
    manhattan.call({}, mockVertices, {}, mockEdgeView)

    const calledWithOptions = (FunctionExt.call as any).mock.calls[0][3]
    expect(calledWithOptions).toBeDefined()
    expect(typeof calledWithOptions).toBe('object')
  })
})
