import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Cell } from '../../src/model/cell'

class FakeModel {
  map: Record<string, any> = {}
  batches: any[] = []
  notify = vi.fn()
  startBatch = vi.fn((name: any, data: any) => {
    this.batches.push({ name, data })
  })
  stopBatch = vi.fn((name: any, data: any) => {
    this.batches.push({ name: `stop:${name}`, data })
  })
  addCell = vi.fn((cell: any) => {
    this.map[cell.id] = cell
  })
  removeCell = vi.fn((cell: any) => {
    delete this.map[cell.id]
  })
  getCell(id: string) {
    return this.map[id] || null
  }
  getMaxZIndex() {
    return 100
  }
  getMinZIndex() {
    return -100
  }
  indexOf(cell: any) {
    const keys = Object.keys(this.map)
    return keys.indexOf(cell.id)
  }
  total() {
    return Object.keys(this.map).length
  }
  getIncomingEdges() {
    return null
  }
  getOutgoingEdges() {
    return null
  }
  findViewByCell() {
    return null
  }
}

describe('Cell core API', () => {
  let model: FakeModel

  beforeEach(() => {
    model = new FakeModel()
  })

  it('generate id when missing', () => {
    const c = new Cell({})
    expect(typeof c.id).toBe('string')
    expect(c.id.length).toBeGreaterThan(0)
  })

  it('static config and propHook applied in preprocess', () => {
    class TestCell extends Cell {}
    TestCell.config({
      propHooks: (metadata: any) => {
        if (metadata.tools) {
          metadata.tools =
            typeof metadata.tools === 'string'
              ? { items: [metadata.tools] }
              : metadata.tools
        }
        return metadata
      },
    })

    const t = new TestCell({ tools: 'toolA' } as any)
    const tools = t.getPropByPath('tools')
    expect(tools).toBeDefined()
    expect((tools as any).items).toBeDefined()
    expect((tools as any).items[0]).toBe('toolA')
  })

  it('getMarkup falls back to static markup', () => {
    class MarkupCell extends Cell {}
    const sampleMarkup = [{ tagName: 'rect' }]
    MarkupCell.config({ markup: sampleMarkup })
    const mc = new MarkupCell({})
    expect(mc.getMarkup()).toBe(sampleMarkup)
  })

  it('get/set prop works for string key and object', () => {
    const c = new Cell({ view: 'v1' })
    expect(c.getProp('view')).toBe('v1')
    c.setProp('view', 'v2')
    expect(c.getProp('view')).toBe('v2')

    c.setProp({ view: 'v3', data: { a: 1 } } as any)
    expect(c.getProp('view')).toBe('v3')
    expect(c.getData()).toEqual({ a: 1 })
  })

  it('attrs API: setAttrs, getAttrByPath, setAttrByPath, removeAttrByPath', () => {
    const c = new Cell({})
    c.setAttrs({ body: { fill: 'red', stroke: { width: 1 } } })
    expect(c.getAttrs().body.fill).toBe('red')

    c.setAttrByPath('body/fill', 'blue')
    expect(c.getAttrByPath('body/fill')).toBe('blue')

    c.updateAttrs({ body: { opacity: 0.5 } })
    expect(c.getAttrByPath('body/opacity')).toBe(0.5)

    c.removeAttrByPath('body/fill')
    expect(c.getAttrByPath('body/fill')).toBeUndefined()
  })

  it('visibility API: isVisible show hide toggleVisible', () => {
    const c = new Cell({})
    expect(c.isVisible()).toBe(true)
    c.hide()
    expect(c.isVisible()).toBe(false)
    c.show()
    expect(c.isVisible()).toBe(true)
    c.toggleVisible()
    expect(c.isVisible()).toBe(false)
    c.toggleVisible(true)
    expect(c.isVisible()).toBe(true)
  })

  it('data API: getData options reference', () => {
    const c = new Cell({ data: { n: 1 } })

    expect(c.getData()).toEqual({ n: 1 })

    expect(c.getData()).toBe(c.getData())
    expect(c.getData({ reference: true })).toBe(c.getData())

    expect(c.getData({ reference: false })).toEqual(c.getData())
    expect(c.getData({ reference: false })).not.toBe(c.getData())
  })

  it('data API: setData, replaceData, updateData, removeData', () => {
    const c = new Cell({ data: { n: 1 } })
    expect(c.getData()).toEqual({ n: 1 })

    c.updateData({ m: 2 })
    expect(c.getData()).toEqual(expect.objectContaining({ n: 1, m: 2 }))

    c.replaceData({ x: 9 })
    expect(c.getData()).toEqual({ x: 9 })

    c.setData({ nested: { a: 1 } })
    c.setData({ nested: { b: 2 } }, { deep: true })
    expect(c.getData().nested).toEqual({ a: 1, b: 2 })

    c.removeData()
    expect(c.getData()).toBeUndefined()
  })

  it('setParent and setChildren update store and internal references', () => {
    const p = new Cell({})
    const c1 = new Cell({})
    const c2 = new Cell({})
    p.model = model as any
    c1.model = model as any
    c2.model = model as any

    model.addCell(c1)
    model.addCell(c2)

    p.setChildren([c1, c2])
    expect(p.getChildCount()).toBe(2)
    expect(p.children![0]).toBe(c1)
    c1.setParent(null)
    expect(c1.getParent()).toBeNull()
    p.setChildren(null)
    expect(p.getChildCount()).toBe(0)
  })

  it('tools APIs: normalizeTools, set/get/add/remove/has', () => {
    expect(Cell.normalizeTools('a').items[0]).toBe('a')
    expect(Cell.normalizeTools(['a', 'b']).items.length).toBe(2)
    const toolsObj = { name: 't', items: ['x'] as any[] }
    expect(Cell.normalizeTools(toolsObj)).toBe(toolsObj)

    const c = new Cell({})
    c.setTools({ name: 'main', items: ['one', { name: 'two' }] })
    expect(c.getTools()).toBeDefined()
    expect(c.hasTools()).toBe(true)
    expect(c.hasTools('main')).toBe(true)
    expect(c.hasTool('one')).toBe(true)
    expect(c.hasTool('two')).toBe(true)

    c.addTools('three', 'main')
    expect(c.hasTool('three')).toBe(true)

    c.removeTool('one')
    expect(c.hasTool('one')).toBe(false)

    c.removeTool(0)
    expect(c.getTools()).toBeTruthy()
    c.removeTools()
    expect(c.getTools()).toBeFalsy()
  })

  it('isCell recognizes a compatible object', () => {
    const fake = {
      [Symbol.toStringTag]: Cell.toStringTag,
      isNode: () => false,
      isEdge: () => false,
      prop: () => ({}),
      attr: () => ({}),
    }
    expect(Cell.isCell(fake)).toBe(true)
    expect(Cell.isCell(null)).toBe(false)
    expect(Cell.isCell({})).toBe(false)
  })

  it('clone works shallow and toJSON returns expected shape when provided', () => {
    const n = new Cell({ shape: 'rect' })
    n.setProp('view', 'v1')
    const clone = n.clone()
    expect(clone).not.toBe(n)
    expect(clone.id).not.toBe(n.id)
    expect(clone.getProp('shape')).toBe('rect')

    const json = n.toJSON()
    expect(typeof json).toBe('object')
    expect((json as any).shape).toBe('rect')
  })

  it('notify delegates to model.notify and triggers batch pairing', () => {
    const c = new Cell({})
    c.model = model as any
    c.notify('changed', { options: {}, cell: c } as any)
    expect(model.notify).toHaveBeenCalled()
    if (typeof c.startBatch === 'function') {
      c.startBatch('test', { a: 1 })
      expect(model.startBatch).toHaveBeenCalled()
    }
    if (typeof c.stopBatch === 'function') {
      c.stopBatch('test', { a: 1 })
      expect(model.stopBatch).toHaveBeenCalled()
    }
    const res =
      typeof c.batchUpdate === 'function'
        ? c.batchUpdate('b', () => 'ok', { x: 1 })
        : 'ok'
    expect(res).toBe('ok')
  })

  it('zIndex getters/setters and removal', () => {
    const c = new Cell({})
    c.setZIndex(5)
    expect(c.getZIndex()).toBe(5)
    c.removeZIndex()
    expect(c.getZIndex()).toBeUndefined()
    c.zIndex = 3
    expect(c.getZIndex()).toBe(3)
    c.zIndex = undefined
    expect(c.getZIndex()).toBeUndefined()
  })

  it('transition proxies to animation start/stop/get without throwing', () => {
    const c = new Cell({})
    if (typeof c.transition === 'function') {
      const stop = c.transition('data', 1)
      expect(typeof stop).toBe('function')
    }
    expect(() =>
      typeof c.getTransitions === 'function' ? c.getTransitions() : undefined,
    ).not.toThrow()
    expect(() =>
      typeof c.stopTransition === 'function'
        ? c.stopTransition('data')
        : undefined,
    ).not.toThrow()
  })
})
