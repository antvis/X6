import { describe, expect, it } from 'vitest'
import type { Node } from '../../src/model/node'
import { createTestGraph } from '../utils'

describe('Geometry: circle', () => {
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
    const circle = graph.getCellById('circle1') as Node
    expect(circle).toBeTruthy()
    expect(circle.getPosition()).toEqual({ x: 40, y: 50 })
    expect(circle.getLabel()).toBe('Hello')

    await expect(graph).toMatchDOMSnapshot(__dirname, 'circle', {
      copyStyles: false,
    })

    cleanup()
  })
})
