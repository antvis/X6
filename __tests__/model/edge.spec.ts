import type sinon from 'sinon'
import { beforeEach, describe, expect, it } from 'vitest'
import { Edge } from '../../src/model/edge'

describe('Edge', () => {
  let clock: sinon.SinonFakeTimers | null = null

  beforeEach(() => {
    if (clock) {
      clock.restore()
      clock = null
    }
  })

  it('has a toStringTag and isEdge works', () => {
    expect(Edge.toStringTag).toBeDefined()
    expect(Edge.isEdge(null)).toBe(false)

    const e = new Edge()
    expect(Edge.isEdge(e)).toBe(true)
    expect((e as any)[Symbol.toStringTag]).toBe(Edge.toStringTag)
  })

  it('parseStringLabel returns label object with text', () => {
    const label = Edge.parseStringLabel('hello')
    expect(label).toBeDefined()
    expect((label as any).attrs?.label?.text).toBe('hello')
  })

  it('defaultLabel contains markup and attrs defaults', () => {
    const def = Edge.defaultLabel
    expect(def).toBeDefined()
    expect(Array.isArray(def.markup)).toBe(true)
    expect((def.attrs as any)?.text?.fill).toBe('#000')
  })

  it('can set/get/insert/append/remove labels', () => {
    const e = new Edge()
    e.setLabels([], { silent: true })
    e.appendLabel('one')
    e.appendLabel({ attrs: { label: { text: 'two' } } })
    let labels = e.getLabels()
    expect(labels.length).toBe(2)
    expect((labels[0] as any).attrs?.label?.text).toBe('one')
    expect((labels[1] as any).attrs?.label?.text).toBe('two')

    e.insertLabel('inserted', 1)
    labels = e.getLabels()
    expect((labels[1] as any).attrs?.label?.text).toBe('inserted')

    const at1 = e.getLabelAt(1)
    expect((at1 as any).attrs?.label?.text).toBe('inserted')

    const removed = e.removeLabelAt(1)
    expect((removed as any).attrs?.label?.text).toBe('inserted')
    expect(e.getLabels().length).toBe(2)
  })

  it('can set/get/insert/inspect vertices', () => {
    const e = new Edge()
    e.setVertices({ x: 10, y: 20 }, { silent: true })
    let verts = e.getVertices()
    expect(verts.length).toBe(1)
    expect((verts[0] as any).x).toBe(10)
    expect((verts[0] as any).y).toBe(20)

    e.insertVertex({ x: 1, y: 2 }, 0)
    verts = e.getVertices()
    expect((verts[0] as any).x).toBe(1)
    expect((verts[0] as any).y).toBe(2)

    const vAt0 = e.getVertexAt(0)
    expect((vAt0 as any).x).toBe(1)
    expect((vAt0 as any).y).toBe(2)

    e.setVertexAt(0, { x: 5, y: 6 })
    const v0 = e.getVertexAt(0)
    expect((v0 as any).x).toBe(5)
    expect((v0 as any).y).toBe(6)

    const before = e.getVertices().length
    e.removeVertexAt(-1)
    expect(e.getVertices().length).toBe(before - 1)
  })

  it('registry contains the basic.edge definition', () => {
    const reg = (Edge as any).registry
    expect(reg).toBeDefined()
    const def = reg.get('basic.edge')
    expect(def).toBeDefined()
  })
})
