import { describe, expect, it } from 'vitest'
import { MiniMap, Scroller, Transform } from '../../src'
import { createDivElement } from '../utils/dom'
import { createTestGraph } from '../utils/graph-helpers'
import { sleep } from '../utils/sleep'

describe('plugin/minimap', () => {
  it('graph api of minimap', async () => {
    const { div, destroy } = createDivElement()
    const { graph, cleanup } = createTestGraph()

    graph.use(
      new MiniMap({
        container: div,
      }),
    )

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

    await sleep(300)

    const instance = graph.getPlugin('minimap') as MiniMap
    expect(instance).toBeInstanceOf(MiniMap)

    await expect(div).toMatchFileSnapshot('./__snapshots__/minimap-1.html')

    instance.addClass('test-class')
    await expect(div).toMatchFileSnapshot('./__snapshots__/minimap-2.html')

    instance.removeClass('test-class')
    await expect(div).toMatchFileSnapshot('./__snapshots__/minimap-1.html')

    cleanup()
    destroy()
  })

  it('graph api of minimap with scroller', async () => {
    const { div, destroy } = createDivElement()
    const { graph, cleanup } = createTestGraph()

    graph.use(new Transform())
    graph.use(new Scroller())

    graph.use(
      new MiniMap({
        container: div,
      }),
    )

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

    await sleep(300)
    graph.setScrollbarPosition(100, 100)
    graph.translate(100, 100)
    graph.scale(0.1, 0.2)
    await sleep(300)

    await expect(div).toMatchFileSnapshot(
      './__snapshots__/minimap-scroller.html',
    )

    cleanup()
    destroy()
  })

  it('graph api of minimap with only transform', async () => {
    const { div, destroy } = createDivElement()
    const { graph, cleanup } = createTestGraph()

    graph.use(new Transform())

    graph.use(
      new MiniMap({
        container: div,
      }),
    )

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

    await sleep(300)
    graph.translate(100, 100)
    graph.scale(0.1, 0.2)
    await sleep(300)

    await expect(div).toMatchFileSnapshot(
      './__snapshots__/minimap-transform.html',
    )

    cleanup()
    destroy()
  })
})
