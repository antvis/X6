import { beforeEach, describe, expect, it } from 'vitest'
import { ShareRegistry } from '../../src/model/registry'
import { Registry } from '../../src/registry/registry'

describe('Registry', () => {
  let edgeRegistry: Registry<any>
  let nodeRegistry: Registry<any>

  beforeEach(() => {
    edgeRegistry = new Registry({})
    nodeRegistry = new Registry({})
    ShareRegistry.setEdgeRegistry(edgeRegistry)
    ShareRegistry.setNodeRegistry(nodeRegistry)
  })

  it('exist should return true if the name exists in the edge registry and isNode is true', () => {
    edgeRegistry.register('testEdge', {})
    expect(ShareRegistry.exist('testEdge', true)).toBe(true)
  })

  it('exist should return false if the name does not exist in the edge registry and isNode is true', () => {
    expect(ShareRegistry.exist('testEdge', true)).toBe(false)
  })

  it('exist should return true if the name exists in the node registry and isNode is false', () => {
    nodeRegistry.register('testNode', {})
    expect(ShareRegistry.exist('testNode', false)).toBe(true)
  })

  it('exist should return false if the name does not exist in the node registry and isNode is false', () => {
    expect(ShareRegistry.exist('testNode', false)).toBe(false)
  })

  it('setEdgeRegistry should set the edge registry', () => {
    const newEdgeRegistry = new Registry({})
    ShareRegistry.setEdgeRegistry(newEdgeRegistry)
    newEdgeRegistry.register('testEdge', {})
    expect(ShareRegistry.exist('testEdge', true)).toBe(true)
  })

  it('setNodeRegistry should set the node registry', () => {
    const newNodeRegistry = new Registry({})
    ShareRegistry.setNodeRegistry(newNodeRegistry)
    newNodeRegistry.register('testNode', {})
    expect(ShareRegistry.exist('testNode', false)).toBe(true)
  })
})
