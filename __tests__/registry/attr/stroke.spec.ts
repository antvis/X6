import { describe, expect, it, vi } from 'vitest'
import type { Graph } from '../../../src/graph/graph'
import { Edge } from '../../../src/model/edge'
import { Node } from '../../../src/model/node'
import { stroke } from '../../../src/registry/attr/stroke'

describe('Stroke attribute', () => {
  const mockGraph = {
    defs: {
      remove: vi.fn(),
    },
    defineGradient: vi.fn().mockReturnValue('gradient-id'),
  } as unknown as Graph

  const mockView = {
    cell: new Node(),
    graph: mockGraph,
  }

  const mockEdgeView = {
    cell: new Edge(),
    graph: mockGraph,
    sourcePoint: { x: 10, y: 20 },
    targetPoint: { x: 30, y: 40 },
  }

  it('should qualify plain object', () => {
    expect(stroke.qualify({})).toBe(true)
    expect(stroke.qualify('string')).toBe(false)
    expect(stroke.qualify(123)).toBe(false)
  })

  it('should handle normal stroke object', () => {
    const result = stroke.set({ color: 'red' }, { view: mockView })
    expect(result).toBe('url(#undefined)')
    expect(mockGraph.defineGradient).toBeCalledWith({ color: 'red' })
  })

  it('should handle edge linearGradient', () => {
    const options = {
      type: 'linearGradient',
      attrs: { offset: '0%' },
    }
    const result = stroke.set(options, { view: mockEdgeView })

    expect(result).toBe('url(#undefined)')
    expect(mockGraph.defs.remove).toBeCalledWith(
      `gradient-linearGradient-${mockEdgeView.cell.id}`,
    )
    expect(mockGraph.defineGradient).toBeCalledWith({
      type: 'linearGradient',
      id: `gradient-linearGradient-${mockEdgeView.cell.id}`,
      attrs: {
        offset: '0%',
        x1: 10,
        y1: 20,
        x2: 30,
        y2: 40,
        gradientUnits: 'userSpaceOnUse',
      },
    })
  })
})
