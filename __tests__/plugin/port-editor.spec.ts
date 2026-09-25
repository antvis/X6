import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Node } from '../../src'
import { type Graph, PortEditor } from '../../src'
import { findNearestOutlinePoint } from '../../src/plugin/port-editor'
import { createTestGraph } from '../utils/graph-helpers'

const identity = (a = 1, b = 0, c = 0, d = 1, e = 0, f = 0) =>
  new DOMMatrix([a, b, c, d, e, f])

/** Fake SVG geometry element: a 100×100 box walked clockwise from its top-left corner. */
const outlineStub = (ctm: DOMMatrix, size = 100) => {
  const perimeter = size * 4
  const at = (t: number) => {
    const d = ((t % perimeter) + perimeter) % perimeter
    if (d < size) return { x: d, y: 0 }
    if (d < size * 2) return { x: size, y: d - size }
    if (d < size * 3) return { x: size - (d - size * 2), y: size }
    return { x: 0, y: size - (d - size * 3) }
  }
  return {
    getCTM: () => ctm,
    getTotalLength: () => perimeter,
    getPointAtLength: at,
  } as unknown as SVGGeometryElement
}

const containerStub = (
  screenCTM: DOMMatrix | null,
  nodeCTM: DOMMatrix | null,
) =>
  ({
    ownerSVGElement: { getScreenCTM: () => screenCTM },
    getCTM: () => nodeCTM,
  }) as unknown as SVGGraphicsElement

describe('plugin/port-editor', () => {
  let graph: Graph
  let cleanup: () => void
  let editor: PortEditor
  let node: Node
  let modes: boolean[]

  beforeEach(() => {
    const ctx = createTestGraph()
    graph = ctx.graph
    cleanup = ctx.cleanup
    modes = []
    editor = new PortEditor({ onModeChange: (adding) => modes.push(adding) })
    graph.use(editor)
    node = graph.addNode({ x: 0, y: 0, width: 100, height: 100 })
  })

  afterEach(() => {
    cleanup()
  })

  it('registers itself as a graph plugin', () => {
    expect(editor.name).toBe('port-editor')
    expect(graph.getPlugin('port-editor')).toBe(editor)
    expect(editor.isAdding()).toBe(false)
  })

  describe('addPin', () => {
    it('places a pin in node-local coordinates and creates the port group', () => {
      const id = editor.addPin(node, { x: 30, y: 44.5 })

      expect(id).toBe('pin-1')
      expect(node.prop('ports/groups/pin')).toBeTruthy()
      expect(node.getPorts()).toEqual([
        { id: 'pin-1', group: 'pin', args: { x: 30, y: 44.5 } },
      ])
    })

    it('keeps generated ids unique and honours idPrefix', () => {
      const custom = graph.addNode({ x: 0, y: 0 })
      const other = new PortEditor({ idPrefix: 'T' })
      graph.use(other)

      expect(other.addPin(custom, { x: 10, y: 10 })).toBe('T-1')
      expect(other.addPin(custom, { x: 20, y: 20 })).toBe('T-2')
      expect(editor.addPin(node, { x: 10, y: 10 })).toBe('pin-1')
      expect(editor.addPin(node, { x: 20, y: 20 })).toBe('pin-2')
    })

    it('keeps coordinates out of the (0, 1) window X6 reads as a percentage', () => {
      editor.addPin(node, { x: 0.2, y: 0.5 })
      const port = node.getPorts()[0]

      // 0.2 → 0, 0.5 → 1: a bare number strictly between 0 and 1 would be treated as a
      // fraction of the node size by X6's normalizePercentage.
      expect(port.args).toEqual({ x: 0, y: 1 })
    })

    it('rounds local coordinates to 2 decimals', () => {
      editor.addPin(node, { x: 120.456, y: -3.14159 })

      expect(node.getPorts()[0].args).toEqual({ x: 120.46, y: -3.14 })
    })

    it('stores percentages when positionUnit is percent', () => {
      const ctx = createTestGraph()
      const percentEditor = new PortEditor({ positionUnit: 'percent' })
      ctx.graph.use(percentEditor)
      const target = ctx.graph.addNode({ x: 0, y: 0, width: 200, height: 80 })

      percentEditor.addPin(target, { x: 50, y: 20 })

      expect(target.getPorts()[0].args).toEqual({ x: '25.000%', y: '25.000%' })
      ctx.cleanup()
    })

    it('uses an existing port group instead of overwriting it', () => {
      const groups = { terminal: { position: 'absolute', attrs: {} } }
      node.prop('ports/groups', groups)
      const custom = new PortEditor({ group: 'terminal' })
      graph.use(custom)

      custom.addPin(node, { x: 5, y: 5 })

      expect(node.getPorts()[0].group).toBe('terminal')
      expect(node.prop('ports/groups/terminal')).toEqual(groups.terminal)
    })

    it('warns and skips the group when autoCreateGroup is disabled', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const strict = new PortEditor({ autoCreateGroup: false })
      graph.use(strict)

      strict.addPin(node, { x: 5, y: 5 })

      expect(node.prop('ports/groups/pin')).toBeFalsy()
      expect(warn).toHaveBeenCalledTimes(1)
      // the pin itself is still written — the group only affects rendering
      expect(node.getPorts()).toHaveLength(1)
      warn.mockRestore()
    })
  })

  describe('pins bookkeeping', () => {
    it('reports and clears only the pins of its own group', () => {
      node.addPort({ id: 't-1', group: 'terminal' })
      editor.addPin(node, { x: 10, y: 10 })
      editor.addPin(node, { x: 20, y: 20 })

      expect(editor.getPins(node).map((port) => port.id)).toEqual([
        'pin-2',
        'pin-3',
      ])
      // ids follow the node's total port count (here one terminal port already exists),
      // which is what keeps them unique when several groups share a node

      editor.clearPins(node)

      expect(editor.getPins(node)).toHaveLength(0)
      expect(node.hasPort('t-1')).toBe(true)
    })

    it('removes a single pin and notifies the host', () => {
      const added: string[] = []
      const removed: string[] = []
      const ctx = createTestGraph()
      const loud = new PortEditor({
        onPortAdded: ({ portId }) => added.push(portId),
        onPortRemoved: ({ portId }) => removed.push(portId),
      })
      ctx.graph.use(loud)
      const target = ctx.graph.addNode({ x: 0, y: 0 })

      const id = loud.addPin(target, { x: 1, y: 1 })
      loud.removePin(target, id)

      expect(added).toEqual(['pin-1'])
      expect(removed).toEqual(['pin-1'])
      expect(target.hasPort('pin-1')).toBe(false)
      ctx.cleanup()
    })
  })

  describe('add-pin mode', () => {
    it('toggles the state, the container class and the host callback', () => {
      editor.startAdding()
      expect(editor.isAdding()).toBe(true)
      expect(modes).toEqual([true])
      expect(graph.container.classList.contains('x6-pe-adding')).toBe(true)

      editor.startAdding()
      expect(modes).toEqual([true])

      editor.stopAdding()
      expect(editor.isAdding()).toBe(false)
      expect(modes).toEqual([true, false])
      expect(graph.container.classList.contains('x6-pe-adding')).toBe(false)
    })

    it('leaves add-pin mode on Escape', () => {
      editor.startAdding()
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))

      expect(editor.isAdding()).toBe(false)
    })

    it('lets a pin magnet start a wire but blocks the node body', () => {
      editor.startAdding()
      const validateMagnet = (graph.options.connecting as Record<string, any>)
        .validateMagnet as (args: { magnet?: Element }) => boolean

      const body = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'rect',
      )
      expect(validateMagnet({ magnet: body })).toBe(false)

      const port = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      port.setAttribute('class', 'x6-port')
      const magnet = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'circle',
      )
      port.appendChild(magnet)
      expect(validateMagnet({ magnet })).toBe(true)
    })

    it('blocks node move and canvas panning, then restores both', () => {
      const connecting = graph.options.connecting as Record<string, any>
      const hadValidateMagnet = 'validateMagnet' in connecting
      const originalInteracting = graph.options.interacting
      expect(graph.isPannable()).toBe(true)

      editor.startAdding()
      expect(graph.isPannable()).toBe(false)
      expect(
        (graph.options as Record<string, any>).interacting({}).nodeMovable,
      ).toBe(false)

      editor.stopAdding()
      expect(graph.isPannable()).toBe(true)
      expect(graph.options.interacting).toEqual(originalInteracting)
      expect('validateMagnet' in connecting).toBe(hadValidateMagnet)
    })

    it('can be disabled through the block* options', () => {
      const ctx = createTestGraph()
      const passive = new PortEditor({
        blockNodeMove: false,
        blockPanning: false,
      })
      ctx.graph.use(passive)
      const originalInteracting = ctx.graph.options.interacting

      passive.startAdding()

      expect(ctx.graph.isPannable()).toBe(true)
      expect(ctx.graph.options.interacting).toEqual(originalInteracting)
      passive.stopAdding()
      ctx.cleanup()
    })
  })

  describe('findNearestOutlinePoint', () => {
    it('projects a client point onto the nearest point of the outline', () => {
      const hit = findNearestOutlinePoint(
        containerStub(identity(), identity()),
        [outlineStub(identity())],
        50,
        -10,
      )

      expect(hit).not.toBeNull()
      expect(hit!.local.x).toBeCloseTo(50, 3)
      expect(hit!.local.y).toBeCloseTo(0, 3)
      expect(hit!.client).toMatchObject({ x: 50, y: 0 })
      expect(hit!.distance).toBeCloseTo(10, 3)
    })

    it('maps the hit back into node-local space through the node CTM', () => {
      const hit = findNearestOutlinePoint(
        containerStub(identity(), identity(1, 0, 0, 1, -10, -20)),
        [outlineStub(identity())],
        50,
        -10,
      )

      expect(hit!.local.x).toBeCloseTo(60, 3)
      expect(hit!.local.y).toBeCloseTo(20, 3)
    })

    it('accounts for the element transform and the viewport transform', () => {
      const hit = findNearestOutlinePoint(
        containerStub(identity(), identity()),
        [outlineStub(identity(1, 0, 0, 1, 10, 10))],
        50,
        -10,
      )

      // the box now spans 10..110, so the closest point is (50, 10) — 20px away
      expect(hit!.local.x).toBeCloseTo(50, 3)
      expect(hit!.local.y).toBeCloseTo(10, 3)
      expect(hit!.distance).toBeCloseTo(20, 3)
    })

    it('returns null instead of throwing when the engine exposes no geometry', () => {
      const broken = {
        getCTM: () => identity(),
        getTotalLength: () => {
          throw new Error('not implemented')
        },
        getBBox: () => {
          throw new Error('not implemented')
        },
      } as unknown as SVGGeometryElement

      expect(
        findNearestOutlinePoint(
          containerStub(identity(), identity()),
          [broken],
          10,
          10,
        ),
      ).toBeNull()
    })

    it('returns null without an SVG root or without elements', () => {
      expect(
        findNearestOutlinePoint(
          containerStub(identity(), identity()),
          [],
          1,
          1,
        ),
      ).toBeNull()
      expect(
        findNearestOutlinePoint(
          containerStub(null, identity()),
          [outlineStub(identity())],
          1,
          1,
        ),
      ).toBeNull()
    })
  })
})
