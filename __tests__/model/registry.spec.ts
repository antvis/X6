import { beforeEach, describe, expect, it } from 'vitest'
import {
  setEdgeRegistry,
  setNodeRegistry,
  exist,
} from '../../src/model/registry'
import { Registry } from '../../src/registry/registry'

describe('Registry', () => {
  let edgeRegistry: Registry<any>
  let nodeRegistry: Registry<any>

  beforeEach(() => {
    edgeRegistry = new Registry({} as any)
    nodeRegistry = new Registry({} as any)
    setEdgeRegistry(edgeRegistry)
    setNodeRegistry(nodeRegistry)
  })

  it('exist should return true if the name exists in the edge registry and isNode is true', () => {
    edgeRegistry.register('testEdge', {})
    expect(exist('testEdge', true)).toBe(true)
  })

  it('exist should return false if the name does not exist in the edge registry and isNode is true', () => {
    expect(exist('testEdge', true)).toBe(false)
  })

  it('exist should return true if the name exists in the node registry and isNode is false', () => {
    nodeRegistry.register('testNode', {})
    expect(exist('testNode', false)).toBe(true)
  })

  it('exist should return false if the name does not exist in the node registry and isNode is false', () => {
    expect(exist('testNode', false)).toBe(false)
  })

  it('setEdgeRegistry should set the edge registry', () => {
    const newEdgeRegistry = new Registry({} as any)
    setEdgeRegistry(newEdgeRegistry)
    newEdgeRegistry.register('testEdge', {})
    expect(exist('testEdge', true)).toBe(true)
  })

  it('setNodeRegistry should set the node registry', () => {
    const newNodeRegistry = new Registry({} as any)
    setNodeRegistry(newNodeRegistry)
    newNodeRegistry.register('testNode', {})
    expect(exist('testNode', false)).toBe(true)
  })
})
