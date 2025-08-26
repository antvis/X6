import { describe, expect, it } from "vitest";
import { Export } from '../../src'
import { createTestGraph } from '../utils/graph-helpers'
import { sleep } from "../utils/sleep";
import { promisify } from "util";
import { P } from "vitest/dist/chunks/environment.d.cL3nLXbE.js";

describe('plugin/export', () => {
  it('graph api of export', async () => {
    const { graph, cleanup } = createTestGraph()
    graph.use(new Export())

    const n = graph.addNode({
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

    const toSVG = promisify(graph.toSVG)

    async function toSVGAsync(): Promise<string> {
      return new Promise((resolve) => {
        graph.toSVG(resolve)
      })
    }

    expect(await graph.toSVGAsync()).toBe('<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" xmlns:xlink="http://www.w3.org/1999/xlink" class="x6-graph-svg" viewBox="60 60 80 40"><defs/><g class="x6-graph-svg-viewport"><g class="x6-graph-svg-primer"/><g class="x6-graph-svg-stage"/><g class="x6-graph-svg-decorator"/><g class="x6-graph-svg-overlay"/></g></svg>');
    // TODO: 依赖于 DOM Image 标签
    // expect(await graph.toJPEGAsync()).toBe('')
    // expect(await graph.toPNGAsync()).toBe('')

    cleanup()
  })
})
