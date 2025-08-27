import { describe, expect, it } from 'vitest'
import { Export } from '../../src'
import { createTestGraph } from '../utils/graph-helpers'
import { sleep } from '../utils/sleep'

describe('plugin/export', () => {
  it('graph api of export', async () => {
    const { graph, cleanup } = createTestGraph()
    graph.use(new Export())

    graph.addNode({
      id: 'n1',
      x: 60,
      y: 60,
      width: 80,
      height: 40,
      ports: {
        groups: { r: { position: 'right' } },
        items: [{ id: 'p1', group: 'r' }],
      },
    })

    const instance = graph.getPlugin('export') as Export
    expect(instance).toBeInstanceOf(Export)

    await sleep(300)

    expect(await graph.toSVGAsync()).toBe(
      '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" xmlns:xlink="http://www.w3.org/1999/xlink" class="x6-graph-svg" viewBox="60 60 80 40"><defs/><g class="x6-graph-svg-viewport"><g class="x6-graph-svg-primer"/><g class="x6-graph-svg-stage"><g data-cell-id="n1" data-shape="rect" class="x6-cell x6-node" transform="translate(60,60)"><rect fill="#ffffff" stroke="#333333" stroke-width="2" width="80" height="40"/><text font-size="14" fill="#000000" text-anchor="middle" text-vertical-anchor="middle" font-family="Arial, helvetica, sans-serif" transform="matrix(1,0,0,1,40,20)"/><g class="x6-port x6-port-r" transform="matrix(1,0,0,1,80,20)"><circle r="10" fill="#FFFFFF" stroke="#000000" port="p1" port-group="r" class="x6-port-body"/></g></g><!--z-index:2--></g><g class="x6-graph-svg-decorator"/><g class="x6-graph-svg-overlay"/></g></svg>',
    )
    // TODO: 依赖于 DOM Image 标签
    // expect(await graph.toJPEGAsync()).toBe('')
    // expect(await graph.toPNGAsync()).toBe('')

    cleanup()
  })
})
