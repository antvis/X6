import { expect, vi } from 'vitest'
import { createTestGraph, toSVG } from '../utils'

describe('Geometry: circle', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())
  it('circle path', async () => {
    const { graph, cleanup } = createTestGraph()
    graph.addNode({
      id: 'circle1',
      shape: 'circle',
      x: 40,
      y: 50,
      width: 120,
      height: 120,
      label: 'Hello',
      attrs: { body: { stroke: '#333' } },
    })

    const dir = `${__dirname}/__snapshots__`
    const circle = graph.getCellById('circle1') as any
    expect(circle).toBeTruthy()
    expect(circle.getPosition()).toEqual({ x: 40, y: 50 })
    expect(circle.getLabel()).toBe('Hello')
    vi.useRealTimers()
    const svg = await toSVG(graph)
    expect(svg).toMatchFileSnapshot(`${dir}/circle.svg`)

    cleanup()
  })
})
