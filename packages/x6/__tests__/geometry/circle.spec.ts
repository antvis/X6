import { vi, expect } from 'vitest'
import { createTestGraph } from '../utils'

describe('Geometry: circle', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())
  it('circle path', async () => {
    vi.useRealTimers()
    const { graph, cleanup } = createTestGraph()
    graph.addNode({
      id: 'circle1',
      shape: 'circle',
      x: 40,
      y: 50,
      width: 120,
      height: 120,
      label: 'Hello',
      attrs: {
        body: {
          stroke: '#333',
          fill: 'white',
        },
        label: {
          fill: '#000',
        },
      },
    })
    const circle = graph.getCellById('circle1') as any
    expect(circle).toBeTruthy()
    expect(circle.getPosition()).toEqual({ x: 40, y: 50 })
    expect(circle.getLabel()).toBe('Hello')

    expect(graph).toMatchDOMSnapshot(__dirname, 'circle', { copyStyles: true })

    cleanup()
  })
})
