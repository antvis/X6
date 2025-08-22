import { Node, Clipboard } from '../../src/'
import { createTestGraph } from '../utils/graph-helpers'

describe('Plugin: Clipboard', () => {
  it('copy / paste 保持几何与端口', () => {
    const { graph, cleanup } = createTestGraph()
    graph.use(new Clipboard())

    const n = graph.addNode({
      id: 'n1',
      x: 20,
      y: 20,
      width: 80,
      height: 40,
      ports: {
        groups: { r: { position: 'right' } },
        items: [{ id: 'p1', group: 'r' }],
      },
    })

    graph.copy([n])
    const pasted = graph.paste({ offset: 10 })
    expect(pasted.length).toBe(1)

    const pn = pasted[0] as Node
    expect(pn.getBBox()).toMatchObject({ x: 30, y: 30 })
    expect(pn.getPorts()?.length).toBe(1)

    cleanup()
  })
})
