import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import * as Common from '../../src/common'
import { Collection } from '../../src/model/collection'

class FakeCell {
  id: string
  zIndex: number
  type: 'node' | 'edge' | null
  private props: Record<string, any>
  private listeners: {
    [event: string]: Array<{ cb: Function; ctx?: any }>
  }
  public removed = false
  private changedKeys = new Set<string>()

  private parent?: FakeCell

  constructor(
    id: string,
    opts: { zIndex?: number; type?: 'node' | 'edge' | null } = {},
    parent?: FakeCell
  ) {
    this.id = id
    this.zIndex = opts.zIndex ?? 0
    this.type = opts.type ?? null
    this.props = {}
    this.listeners = {}
    this.parent = parent
  }

  getParent() {
    if (this.parent) {
      return this.parent
    }
    return null
  }

  toJSON() {
    return { id: this.id, zIndex: this.zIndex, type: this.type }
  }

  getProp() {
    return { ...this.props }
  }

  setProp(props: Record<string, any>, _options?: any) {
    Object.keys(props).forEach((k) => {
      this.props[k] = props[k]
      this.changedKeys.add(k)
    })
  }

  isSameStore(other: any) {
    return this === other
  }

  hasChanged(key?: string | string[]) {
    if (key == null) {
      return this.changedKeys.size > 0
    }
    if (Array.isArray(key)) {
      return key.some((k) => this.changedKeys.has(k))
    }
    return this.changedKeys.has(key)
  }

  on(event: string, cb: Function, ctx?: any) {
    const arr = this.listeners[event] || []
    arr.push({ cb, ctx })
    this.listeners[event] = arr
  }

  off(event: string, cb?: Function, ctx?: any) {
    if (!this.listeners[event]) {
      return
    }
    if (!cb && !ctx) {
      delete this.listeners[event]
      return
    }
    this.listeners[event] = this.listeners[event].filter((entry) => {
      if (cb && ctx) {
        return entry.cb !== cb || entry.ctx !== ctx
      }
      if (cb) {
        return entry.cb !== cb
      }
      if (ctx) {
        return entry.ctx !== ctx
      }
      return true
    })
    if (this.listeners[event].length === 0) {
      delete this.listeners[event]
    }
  }

  notify(name: string, args?: any) {
    const callList = [
      ...(this.listeners[name] ? this.listeners[name].slice() : []),
      ...(this.listeners['*'] ? this.listeners['*'].slice() : []),
    ]
    callList.forEach(({ cb, ctx }) => {
      try {
        cb.call(ctx, name, args || {})
      } catch (e) {
        console.error(e)
      }
    })
  }

  remove() {
    this.removed = true
  }

  isNode() {
    return this.type === 'node'
  }

  isEdge() {
    return this.type === 'edge'
  }
}

function createCell(
  id: string,
  opts: { zIndex?: number; type?: 'node' | 'edge' | null } = {},
) {
  return new FakeCell(id, opts)
}

describe('Collection', () => {
  let sortSpy: any

  beforeEach(() => {
    sortSpy = vi
      .spyOn(Common.ArrayExt, 'sortBy')
      .mockImplementation((arr: any[], comparator: any) => {
        if (typeof comparator === 'function') {
          return arr.slice().sort((a, b) => {
            return comparator(a) - comparator(b)
          })
        }
        if (typeof comparator === 'string') {
          return arr.slice().sort((a, b) => {
            const va = (a as any)[comparator]
            const vb = (b as any)[comparator]
            return (va === undefined ? 0 : va) - (vb === undefined ? 0 : vb)
          })
        }
        return arr.slice()
      })
  })

  afterEach(() => {
    sortSpy.mockRestore()
  })

  it('adds a single cell and exposes basic accessors, events and toJSON', () => {
    const coll = new Collection([], { comparator: null })
    const c = createCell('a', { zIndex: 5, type: 'node' })
    const addedSpy = vi.fn()
    const updatedSpy = vi.fn()
    coll.on('added', addedSpy)
    coll.on('updated', updatedSpy)

    coll.add(c)

    expect(coll.length).toBe(1)
    expect(coll.get('a')).toBe(c)
    expect(coll.has('a')).toBe(true)
    expect(coll.at(0)).toBe(c)
    expect(coll.first()).toBe(c)
    expect(coll.last()).toBe(c)
    expect(coll.indexOf(c)).toBe(0)
    expect(coll.toArray()).toEqual([c])
    expect(coll.toJSON()).toEqual([{ id: 'a', zIndex: 5, type: 'node' }])
    expect(addedSpy).toHaveBeenCalledTimes(1)
    expect(updatedSpy).toHaveBeenCalledTimes(1)
  })

  it('push/pop/unshift/shift maintain order and return correct cells', () => {
    const coll = new Collection([], { comparator: null })
    const a = createCell('a')
    const b = createCell('b')
    const c = createCell('c')

    coll.push(a)
    coll.push(b)
    expect(coll.toArray().map((x) => x.id)).toEqual(['a', 'b'])

    coll.unshift(c)
    expect(coll.toArray().map((x) => x.id)).toEqual(['c', 'a', 'b'])

    const popped = coll.pop()
    expect((popped as any).id).toBe('b')
    expect(coll.length).toBe(2)

    const shifted = coll.shift()
    expect((shifted as any).id).toBe('c')
    expect(coll.toArray().map((x) => x.id)).toEqual(['a'])
  })

  it('remove respects dryrun and triggers events', () => {
    const coll = new Collection([], { comparator: null })
    const a = createCell('a')
    coll.add(a)
    expect(coll.has('a')).toBe(true)
    const removedSpy = vi.fn()
    const updatedSpy = vi.fn()
    coll.on('removed', removedSpy)
    coll.on('updated', updatedSpy)

    coll.remove(a, { dryrun: true })
    expect(a.removed).toBe(false)
    expect(coll.has('a')).toBe(false)
    expect(removedSpy).toHaveBeenCalled()
    expect(updatedSpy).toHaveBeenCalled()
    coll.add(a)
    coll.remove(a)
    expect(a.removed).toBe(true)
  })

  it('reset triggers reseted and updated with correct payloads', () => {
    const coll = new Collection([], { comparator: null })
    const a = createCell('a')
    const b = createCell('b')
    const c = createCell('c')
    coll.add([a, b])
    const resetedSpy = vi.fn()
    const updatedSpy = vi.fn()
    coll.on('reseted', resetedSpy)
    coll.on('updated', updatedSpy)
    coll.reset([b, c])
    expect(resetedSpy).toHaveBeenCalledTimes(1)
    expect(updatedSpy).toHaveBeenCalledTimes(1)

    const resetArgs = resetedSpy.mock.calls[0][0]
    expect(Array.isArray(resetArgs.previous)).toBe(true)
    expect(Array.isArray(resetArgs.current)).toBe(true)
    const updatedArgs =
      updatedSpy.mock.calls[updatedSpy.mock.calls.length - 1][0]
    expect(updatedArgs.added.map((x: any) => x.id)).toContain('c')
    expect(updatedArgs.removed.map((x: any) => x.id)).toContain('a')
  })

  it('sort uses ArrayExt.sortBy and triggers sorted event', () => {
    const coll = new Collection([], {})
    const a = createCell('a', { zIndex: 3 })
    const b = createCell('b', { zIndex: 1 })
    const c = createCell('c', { zIndex: 2 })
    const sortedSpy = vi.fn()
    coll.on('sorted', sortedSpy)

    coll.add([a, b, c])
    expect(sortedSpy).toHaveBeenCalled()
    expect(coll.toArray().map((x) => x.id)).toEqual(['b', 'c', 'a'])
  })

  it('forwards cell events to collection as cell:*, node:* and edge:*', () => {
    const coll = new Collection([], { comparator: null })
    const node = createCell('node1', { type: 'node' })
    const edge = createCell('edge1', { type: 'edge' })
    const cellAddedSpy = vi.fn()
    const nodeAddedSpy = vi.fn()
    const edgeAddedSpy = vi.fn()

    coll.on('cell:added', cellAddedSpy)
    coll.on('node:added', nodeAddedSpy)
    coll.on('edge:added', edgeAddedSpy)

    coll.add(node)
    coll.add(edge)

    node.notify('added', { cell: node })
    edge.notify('added', { cell: edge })

    expect(cellAddedSpy).toHaveBeenCalled()
    expect(nodeAddedSpy).toHaveBeenCalled()
    expect(edgeAddedSpy).toHaveBeenCalled()

    const nodeCall = nodeAddedSpy.mock.calls[0][0]
    expect(nodeCall.node).toBe(node)

    const edgeCall = edgeAddedSpy.mock.calls[0][0]
    expect(edgeCall.edge).toBe(edge)
  })
})
