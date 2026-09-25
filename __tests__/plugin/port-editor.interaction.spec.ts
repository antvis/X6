import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Node } from '../../src'
import { type Graph, PortEditor } from '../../src'
import { createTestGraph } from '../utils/graph-helpers'

const BOX = { width: 100, height: 60 }

const identity = () => new DOMMatrix()

/**
 * X6 v3 renders a cell's markup asynchronously (one macrotask after the data change), so
 * anything that inspects the node DOM has to yield first.
 */
const tick = () => new Promise((resolve) => setTimeout(resolve, 24))

/**
 * jsdom implements no SVG geometry at all (`getTotalLength`, `getCTM`, `getScreenCTM`,
 * `elementsFromPoint` are all missing), so the interaction tests below arm the real node
 * view with the same primitives a browser provides. Everything else — event plumbing,
 * hit dispatch, overlays, port bookkeeping — runs for real.
 */
function armNode(node: Node, graph: Graph) {
  const view = node.findView(graph)
  const container = view.container as unknown as SVGGElement
  const svg = container.ownerSVGElement as unknown as SVGSVGElement
  const shape = container.querySelector(
    'rect,circle,ellipse,path,polygon,polyline',
  ) as unknown as SVGGeometryElement

  const perimeter = 2 * (BOX.width + BOX.height)
  const at = (t: number) => {
    const d = ((t % perimeter) + perimeter) % perimeter
    if (d < BOX.width) return { x: d, y: 0 }
    if (d < BOX.width + BOX.height) return { x: BOX.width, y: d - BOX.width }
    if (d < 2 * BOX.width + BOX.height)
      return { x: BOX.width - (d - BOX.width - BOX.height), y: BOX.height }
    return { x: 0, y: BOX.height - (d - 2 * BOX.width - BOX.height) }
  }

  shape.getBoundingClientRect = () =>
    ({
      x: 0,
      y: 0,
      width: BOX.width,
      height: BOX.height,
      top: 0,
      left: 0,
      right: BOX.width,
      bottom: BOX.height,
      toJSON: () => ({}),
    }) as DOMRect
  shape.getTotalLength = () => perimeter
  shape.getPointAtLength = at
  shape.getCTM = () => identity()

  const rect = (el: Element) =>
    ({
      x: 0,
      y: 0,
      width: 20,
      height: 20,
      top: 0,
      left: 0,
      right: 20,
      bottom: 20,
      toJSON: () => ({}),
    }) as DOMRect
  container.getBoundingClientRect = () => rect(container)
  svg.getScreenCTM = () => identity()
  container.getCTM = () => identity()

  // 指针命中：让 elementsFromPoint 返回该节点的视图容器（X6 的 .x6-node）
  const doc = document as Document & {
    elementsFromPoint?: (x: number, y: number) => Element[]
  }
  doc.elementsFromPoint = () => [container]

  return { view, container, shape, svg }
}

const mouse = (type: string, clientX: number, clientY: number, buttons = 0) =>
  new MouseEvent(type, { clientX, clientY, buttons, bubbles: true })

describe('plugin/port-editor > interaction', () => {
  let graph: Graph
  let cleanup: () => void
  let editor: PortEditor
  let node: Node
  let armed: ReturnType<typeof armNode>

  beforeEach(async () => {
    const ctx = createTestGraph()
    graph = ctx.graph
    cleanup = ctx.cleanup
    editor = new PortEditor()
    graph.use(editor)
    node = graph.addNode({ x: 0, y: 0, width: BOX.width, height: BOX.height })
    await tick()
    armed = armNode(node, graph)
  })

  afterEach(() => {
    delete (document as unknown as { elementsFromPoint?: unknown })
      .elementsFromPoint
    cleanup()
  })

  it('keeps its overlay inside the graph container', () => {
    expect(graph.container.querySelector('.x6-pe-overlay')).not.toBeNull()
  })

  it('previews the landing spot while hovering the outline in add-pin mode', () => {
    editor.startAdding()
    graph.container.dispatchEvent(mouse('mousemove', 50, -10))

    const preview = graph.container.querySelector(
      '.x6-pe-preview',
    ) as HTMLElement
    expect(preview).not.toBeNull()
    expect(preview.style.display).not.toBe('none')
    // 落点被投影到轮廓上（y=0），预览用视图坐标（此处与 client 一致）
    expect(Number.parseFloat(preview.style.left)).toBeCloseTo(50, 0)
    expect(Number.parseFloat(preview.style.top)).toBeCloseTo(0, 0)
  })

  it('hides the preview when the pointer leaves the outline', () => {
    editor.startAdding()
    graph.container.dispatchEvent(mouse('mousemove', 50, -10))
    const preview = graph.container.querySelector(
      '.x6-pe-preview',
    ) as HTMLElement
    expect(preview.style.display).not.toBe('none')

    // 远离元件：elementsFromPoint 不再命中任何节点
    ;(
      document as unknown as { elementsFromPoint: () => Element[] }
    ).elementsFromPoint = () => [graph.container]
    graph.container.dispatchEvent(mouse('mousemove', 900, 900))

    expect(preview.style.display).toBe('none')
  })

  it('creates a pin where the pointer is when clicked in add-pin mode', () => {
    editor.startAdding()
    graph.container.dispatchEvent(mouse('click', 50, -10))

    const pins = editor.getPins(node)
    expect(pins).toHaveLength(1)
    expect(pins[0].args).toEqual({ x: 50, y: 0 })
  })

  it('ignores clicks on the canvas outside of a node', () => {
    editor.startAdding()
    ;(
      document as unknown as { elementsFromPoint: () => Element[] }
    ).elementsFromPoint = () => [graph.container]
    graph.container.dispatchEvent(mouse('click', 900, 900))

    expect(editor.getPins(node)).toHaveLength(0)
  })

  it('does not create pins while not in add-pin mode', () => {
    graph.container.dispatchEvent(mouse('click', 50, -10))
    expect(editor.getPins(node)).toHaveLength(0)
  })

  it('shows the delete badge on hover and removes the pin when it is clicked', async () => {
    const portId = editor.addPin(node, { x: 50, y: 0 })
    await tick()
    const portEl = armed.container.querySelector('[port]') as SVGElement
    expect(portEl).not.toBeNull()
    expect(portEl.getAttribute('port')).toBe(portId)

    editor.startAdding()
    portEl.dispatchEvent(mouse('mousemove', 50, 0))

    const badge = graph.container.querySelector('.x6-pe-delete') as HTMLElement
    expect(badge).not.toBeNull()
    expect(badge.style.display).not.toBe('none')

    badge.dispatchEvent(mouse('click', 61, -11))

    expect(node.hasPort(portId as string)).toBe(false)
    expect(badge.style.display).toBe('none')
  })

  it('creates a pin from a Dnd drop of a pin template and rejects the template itself', () => {
    const validateNode = editor.createDndDropValidator()
    const template = graph.addNode({ x: 40, y: -40, width: 20, height: 20 })
    template.setData({ pinTemplate: true })

    expect(validateNode(template)).toBe(false)
    expect(editor.getPins(node)).toHaveLength(1)

    const plain = graph.addNode({ x: 200, y: 200 })
    expect(validateNode(plain)).toBe(true)
    expect(editor.getPins(plain)).toHaveLength(0)
  })

  it('tracks graph transforms while in add-pin mode and stops on dispose', () => {
    editor.startAdding()
    expect(() => graph.scale(1.5)).not.toThrow()
    expect(() => graph.translate(30, 20)).not.toThrow()

    editor.dispose()
    expect(editor.isAdding()).toBe(false)
    expect(graph.container.querySelector('.x6-pe-overlay')).toBeNull()
  })

  it('restores the graph options it touched when the mode ends twice', () => {
    const connecting = () => graph.options.connecting as Record<string, unknown>
    const original = { ...connecting() }

    editor.startAdding()
    editor.stopAdding()
    editor.stopAdding()

    expect({ ...connecting() }).toEqual(original)
    expect(editor.isAdding()).toBe(false)
  })

  it('ignores hover while a mouse button is held', () => {
    editor.startAdding()
    graph.container.dispatchEvent(mouse('mousemove', 50, -10, 1))

    const preview = graph.container.querySelector(
      '.x6-pe-preview',
    ) as HTMLElement
    expect(preview.style.display).toBe('none')
  })

  it('reports the node under a client point and nothing outside', () => {
    expect(editor.findNodeAtClient(10, 10)).toBe(node)
    ;(
      document as unknown as { elementsFromPoint: () => Element[] }
    ).elementsFromPoint = () => []
    expect(editor.findNodeAtClient(900, 900)).toBeNull()
  })

  it('removes the mode listeners so a disposed plugin reacts to nothing', () => {
    const spy = vi.spyOn(editor, 'addPin')
    editor.startAdding()
    editor.dispose()
    graph.container.dispatchEvent(mouse('click', 50, -10))

    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })
})
