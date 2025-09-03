import { describe, expect, it } from 'vitest'
import {
  type AttrDefinition,
  attrRegistry,
  isValidDefinition,
} from '../../../src/registry/attr'

describe('Connection attribute', () => {
  it('should register and get attribute definitions', () => {
    const mockDefinition: AttrDefinition = {
      set: () => 'test-value',
      qualify: () => true,
    }

    attrRegistry.register('test-attr', mockDefinition)
    const result = attrRegistry.get('test-attr')

    expect(result).toEqual(mockDefinition)
  })

  it('should check if definition is valid', () => {
    const validStringDef: AttrDefinition = 'test'
    const validObjectDef: AttrDefinition = {
      set: () => {},
      qualify: () => true,
    }
    const invalidDef = null

    expect(isValidDefinition.call({}, validStringDef, null, {} as any)).toBe(
      true,
    )
    expect(isValidDefinition.call({}, validObjectDef, null, {} as any)).toBe(
      true,
    )
    expect(isValidDefinition.call({}, invalidDef, null, {} as any)).toBe(false)
  })

  it('should handle qualify function in definitions', () => {
    const withQualify: AttrDefinition = {
      set: () => {},
      qualify: () => false,
    }

    expect(isValidDefinition.call({}, withQualify, null, {} as any)).toBe(false)
  })
})
