import { applyMixins } from './mixins'

describe('Ojbect', () => {
  describe('applyMixins', () => {
    class Disposable {
      isDisposed: boolean

      dispose() {
        this.isDisposed = true
      }
    }

    class Activatable {
      isActive: boolean

      activate() {
        this.isActive = true
      }

      deactivate() {
        this.isActive = false
      }
    }

    class SmartObject {
      interact() {
        this.activate()
        this.dispose()
      }
    }

    interface SmartObject extends Disposable, Activatable {}
    applyMixins(SmartObject, Disposable, Activatable)

    it('should do the mixing', () => {
      const smartObj = new SmartObject()
      expect(smartObj.isDisposed).toBeUndefined()
      expect(smartObj.isActive).toBeUndefined()
      smartObj.interact()
      expect(smartObj.isDisposed).toBeTruthy()
      expect(smartObj.isActive).toBeTruthy()
    })
  })
})
