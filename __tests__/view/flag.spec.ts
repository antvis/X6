import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { CellView } from '../../src/view/cell'
import { FlagManager } from '../../src/view/flag'

describe('FlagManager', () => {
  let mockCellView: CellView
  let mockCell: any

  beforeEach(() => {
    mockCell = {
      hasChanged: vi.fn(),
    }
    mockCellView = {
      cell: mockCell,
    } as any
  })

  describe('constructor', () => {
    it('should create flags from string actions', () => {
      const actions = { attr1: 'render', attr2: 'update' }
      // @ts-expect-error
      const manager = new FlagManager(mockCellView, actions)

      expect(manager.getFlag('render')).toBeGreaterThan(0)
      expect(manager.getFlag('update')).toBeGreaterThan(0)
    })

    it('should create flags from array actions', () => {
      const actions = { attr1: ['render', 'update'] }
      // @ts-expect-error
      const manager = new FlagManager(mockCellView, actions)

      expect(manager.getFlag('render')).toBeGreaterThan(0)
      expect(manager.getFlag('update')).toBeGreaterThan(0)
    })

    it('should handle bootstrap as string', () => {
      const actions = { attr1: 'render' }
      // @ts-expect-error
      const manager = new FlagManager(mockCellView, actions, 'bootstrap')

      expect(manager.getBootstrapFlag()).toBeGreaterThan(0)
    })

    it('should handle bootstrap as array', () => {
      const actions = { attr1: 'render' }
      // @ts-expect-error
      const manager = new FlagManager(mockCellView, actions, [
        'bootstrap1',
        'bootstrap2',
      ])

      expect(manager.getBootstrapFlag()).toBeGreaterThan(0)
    })

    it('should reuse existing flags', () => {
      const actions = { attr1: 'render', attr2: 'render' }
      // @ts-expect-error
      const manager = new FlagManager(mockCellView, actions)

      const renderFlag = manager.getFlag('render')
      expect(renderFlag).toBeGreaterThan(0)
    })

    it('should throw error when maximum flags exceeded', () => {
      const actions: any = {}
      for (let i = 0; i < 26; i++) {
        actions[`attr${i}`] = `action${i}`
      }

      expect(() => new FlagManager(mockCellView, actions)).toThrow(
        'Maximum number of flags exceeded.',
      )
    })
  })

  describe('getFlag', () => {
    it('should return 0 for non-existent flag', () => {
      const manager = new FlagManager(mockCellView, {})
      // @ts-expect-error
      expect(manager.getFlag('nonexistent')).toBe(0)
    })

    it('should return combined flags for array input', () => {
      const actions = { attr1: 'render', attr2: 'update' }
      // @ts-expect-error
      const manager = new FlagManager(mockCellView, actions)

      const renderFlag = manager.getFlag('render')
      const updateFlag = manager.getFlag('update')
      const combinedFlag = manager.getFlag(['render', 'update'])

      expect(combinedFlag).toBe(renderFlag | updateFlag)
    })

    it('should return single flag for string input', () => {
      const actions = { attr1: 'render' }
      // @ts-expect-error
      const manager = new FlagManager(mockCellView, actions)

      const flag = manager.getFlag('render')
      expect(flag).toBeGreaterThan(0)
    })
  })

  describe('hasAction', () => {
    it('should return truthy when flag has action', () => {
      const actions = { attr1: 'render' }
      // @ts-expect-error
      const manager = new FlagManager(mockCellView, actions)

      const renderFlag = manager.getFlag('render')
      expect(manager.hasAction(renderFlag, 'render')).toBeTruthy()
    })

    it('should return falsy when flag does not have action', () => {
      const actions = { attr1: 'render', attr2: 'update' }
      // @ts-expect-error
      const manager = new FlagManager(mockCellView, actions)

      const renderFlag = manager.getFlag('render')
      expect(manager.hasAction(renderFlag, 'update')).toBeFalsy()
    })

    it('should work with array actions', () => {
      const actions = { attr1: ['render', 'update'] }
      // @ts-expect-error
      const manager = new FlagManager(mockCellView, actions)

      const combinedFlag = manager.getFlag(['render', 'update'])
      expect(manager.hasAction(combinedFlag, ['render', 'update'])).toBeTruthy()
    })
  })

  describe('removeAction', () => {
    it('should remove action from flag', () => {
      const actions = { attr1: ['render', 'update'] }
      // @ts-expect-error
      const manager = new FlagManager(mockCellView, actions)

      const combinedFlag = manager.getFlag(['render', 'update'])
      const withoutRender = manager.removeAction(combinedFlag, 'render')

      expect(manager.hasAction(withoutRender, 'render')).toBeFalsy()
      expect(manager.hasAction(withoutRender, 'update')).toBeTruthy()
    })

    it('should work with array actions', () => {
      const actions = { attr1: ['render', 'update', 'resize'] }
      // @ts-expect-error
      const manager = new FlagManager(mockCellView, actions)

      const allFlags = manager.getFlag(['render', 'update', 'resize'])
      const withoutSome = manager.removeAction(allFlags, ['render', 'update'])

      expect(manager.hasAction(withoutSome, 'render')).toBeFalsy()
      expect(manager.hasAction(withoutSome, 'update')).toBeFalsy()
      expect(manager.hasAction(withoutSome, 'resize')).toBeTruthy()
    })
  })

  describe('getBootstrapFlag', () => {
    it('should return bootstrap flag', () => {
      const actions = { attr1: 'render' }
      // @ts-expect-error
      const manager = new FlagManager(mockCellView, actions, 'bootstrap')

      const bootstrapFlag = manager.getBootstrapFlag()
      expect(bootstrapFlag).toBeGreaterThan(0)
    })

    it('should return 0 for empty bootstrap', () => {
      const actions = { attr1: 'render' }
      // @ts-expect-error
      const manager = new FlagManager(mockCellView, actions, [])

      expect(manager.getBootstrapFlag()).toBe(0)
    })
  })

  describe('getChangedFlag', () => {
    it('should return flag for changed attributes', () => {
      mockCell.hasChanged.mockImplementation((attr: string) => attr === 'attr1')

      const actions = { attr1: 'render', attr2: 'update' }
      // @ts-expect-error
      const manager = new FlagManager(mockCellView, actions)

      const changedFlag = manager.getChangedFlag()
      expect(changedFlag).toBe(manager.getFlag('render'))
    })

    it('should return combined flags for multiple changed attributes', () => {
      mockCell.hasChanged.mockImplementation(
        (attr: string) => attr === 'attr1' || attr === 'attr2',
      )

      const actions = { attr1: 'render', attr2: 'update' }
      // @ts-expect-error
      const manager = new FlagManager(mockCellView, actions)

      const changedFlag = manager.getChangedFlag()
      const expectedFlag = manager.getFlag('render') | manager.getFlag('update')
      expect(changedFlag).toBe(expectedFlag)
    })

    it('should return 0 when no attributes changed', () => {
      mockCell.hasChanged.mockReturnValue(false)

      const actions = { attr1: 'render', attr2: 'update' }
      // @ts-expect-error
      const manager = new FlagManager(mockCellView, actions)

      expect(manager.getChangedFlag()).toBe(0)
    })
  })

  describe('cell getter', () => {
    it('should return cell from view', () => {
      const actions = { attr1: 'render' }
      // @ts-expect-error
      const manager = new FlagManager(mockCellView, actions)

      expect((manager as any).cell).toBe(mockCell)
    })
  })
})
