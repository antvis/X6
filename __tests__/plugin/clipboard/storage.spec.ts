import * as sinon from 'sinon'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Config } from '../../../src/config'
import { type Cell, Model } from '../../../src/model'
import { clean, fetch, save } from '../../../src/plugin/clipboard/storage'

describe('clipboard storage', () => {
  let localStorageStub: sinon.SinonStub
  let windowStub: sinon.SinonStub
  const LOCAL_STORAGE_KEY = `${Config.prefixCls}.clipboard.cells`

  beforeEach(() => {
    localStorageStub = sinon.stub(Storage.prototype)
    windowStub = sinon.stub(window, 'localStorage').value({
      getItem: localStorageStub.getItem,
      setItem: localStorageStub.setItem,
      removeItem: localStorageStub.removeItem,
    })
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('save', () => {
    it('should save cells to localStorage when localStorage is available', () => {
      const mockCell = {
        toJSON: vi.fn().mockReturnValue({ id: 'cell1', type: 'node' }),
      } as unknown as Cell
      const cells = [mockCell]

      save(cells)

      expect(localStorageStub.setItem.calledOnce).toBe(true)
      expect(
        localStorageStub.setItem.calledWith(
          LOCAL_STORAGE_KEY,
          JSON.stringify([{ id: 'cell1', type: 'node' }]),
        ),
      ).toBe(true)
    })

    it('should not save when localStorage is not available', () => {
      windowStub.value(undefined)

      const mockCell = {
        toJSON: vi.fn().mockReturnValue({ id: 'cell1', type: 'node' }),
      } as unknown as Cell
      const cells = [mockCell]

      save(cells)

      expect(localStorageStub.setItem.called).toBe(false)
    })
  })

  describe('fetch', () => {
    it('should fetch and parse cells from localStorage when data exists', () => {
      const mockData = [{ id: 'cell1', type: 'node' }]
      localStorageStub.getItem.returns(JSON.stringify(mockData))

      const fromJSONSpy = vi
        .spyOn(Model, 'fromJSON')
        .mockReturnValue('parsed cells' as any)

      const result = fetch()

      expect(localStorageStub.getItem.calledOnce).toBe(true)
      expect(localStorageStub.getItem.calledWith(LOCAL_STORAGE_KEY)).toBe(true)
      expect(fromJSONSpy).toHaveBeenCalledWith(mockData)
      expect(result).toBe('parsed cells')
    })

    it('should return Model.fromJSON with empty array when no data in localStorage', () => {
      localStorageStub.getItem.returns(null)

      const fromJSONSpy = vi
        .spyOn(Model, 'fromJSON')
        .mockReturnValue('empty model' as any)

      const result = fetch()

      expect(localStorageStub.getItem.calledOnce).toBe(true)
      expect(fromJSONSpy).toHaveBeenCalledWith([])
      expect(result).toBe('empty model')
    })

    it('should return undefined when localStorage is not available', () => {
      windowStub.value(undefined)

      const result = fetch()

      expect(result).toBeUndefined()
      expect(localStorageStub.getItem.called).toBe(false)
    })
  })

  describe('clean', () => {
    it('should remove data from localStorage when localStorage is available', () => {
      clean()

      expect(localStorageStub.removeItem.calledOnce).toBe(true)
      expect(localStorageStub.removeItem.calledWith(LOCAL_STORAGE_KEY)).toBe(
        true,
      )
    })

    it('should not remove data when localStorage is not available', () => {
      windowStub.value(undefined)

      clean()

      expect(localStorageStub.removeItem.called).toBe(false)
    })
  })
})
