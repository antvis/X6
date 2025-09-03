import { describe, expect, it } from 'vitest'
import { Clipboard, type Node } from '../../../src'
import { createTestGraph } from '../../utils/graph-helpers'

describe('plugin/clipboard', () => {
  it('method and options', () => {
    const { graph, cleanup } = createTestGraph()
    graph.use(
      new Clipboard({
        enabled: false,
      }),
    )

    const clipboard = graph.getPlugin('clipboard') as Clipboard

    expect(clipboard.options).toEqual({ enabled: false })
    expect(clipboard.name).toBe('clipboard')
    expect(clipboard.disabled).toBe(true)
    expect(clipboard.cells).toEqual([])

    clipboard.enable()
    expect(clipboard.isEnabled()).toBe(true)

    clipboard.disable()
    expect(clipboard.isEnabled()).toBe(false)

    clipboard.toggleEnabled()
    expect(clipboard.isEnabled()).toBe(true)

    expect(clipboard.isEmpty()).toBe(true)

    expect(clipboard.getCellsInClipboard()).toEqual([])

    expect(clipboard.clean()).toBe(clipboard)

    cleanup()
  })

  it('copy / cut / paste keep the bbox and ports', async () => {
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

    graph.cut([n])
    const pasted1 = graph.paste({ offset: 100 })
    expect(pasted1.length).toBe(1)

    const pn1 = pasted1[0] as Node
    expect(pn1.getBBox()).toMatchObject({ x: 120, y: 120 })
    expect(pn1.getPorts()?.length).toBe(1)

    cleanup()
  })

  it('graph api of clipboard', () => {
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

    expect(graph.isClipboardEmpty()).toBe(true)

    graph.copy([n])
    expect(graph.isClipboardEmpty()).toBe(false)

    graph.paste({ offset: 10 })
    expect(graph.isClipboardEmpty()).toBe(false)

    graph.cut([n])
    expect(graph.isClipboardEmpty()).toBe(false)

    expect(graph.isClipboardEnabled()).toBe(true)
    graph.enableClipboard()
    expect(graph.isClipboardEnabled()).toBe(true)
    graph.disableClipboard()
    expect(graph.isClipboardEnabled()).toBe(false)

    graph.toggleClipboard(true)
    expect(graph.isClipboardEnabled()).toBe(true)
    graph.toggleClipboard(false)
    expect(graph.isClipboardEnabled()).toBe(false)

    expect(graph.getCellsInClipboard().length).toBe(1)
    graph.cleanClipboard()
    expect(graph.getCellsInClipboard().length).toBe(1)
    graph.toggleClipboard()
    expect(graph.isClipboardEnabled()).toBe(true)
    graph.cleanClipboard()
    expect(graph.getCellsInClipboard().length).toBe(0)

    cleanup()
  })

  it('graph api of clipboard, when there is no clipboard plugin', () => {
    const { graph, cleanup } = createTestGraph()

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

    expect(graph.isClipboardEnabled()).toBe(false)
    expect(() => graph.isClipboardEmpty()).not.toThrow()
    expect(() => graph.copy([n])).not.toThrow()
    expect(() => graph.paste({ offset: 10 })).not.toThrow()
    expect(() => graph.cut([n])).not.toThrow()
    expect(() => graph.enableClipboard()).not.toThrow()
    expect(() => graph.disableClipboard()).not.toThrow()
    expect(() => graph.toggleClipboard()).not.toThrow()
    expect(() => graph.getCellsInClipboard()).not.toThrow()

    cleanup()
  })
})
