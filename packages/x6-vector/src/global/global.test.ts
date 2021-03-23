import { Global } from './global'

describe('Global', () => {
  describe('registerWindow()', () => {
    it('should set a new window as global', () => {
      Global.saveWindow()
      const win = {} as any
      const doc = {} as any
      Global.registerWindow(win, doc)
      expect(Global.window).toBe(win)
      expect(Global.document).toBe(doc)
      Global.restoreWindow()
    })
  })

  describe('withWindow()', () => {
    it('should run a function in the specified window context', () => {
      const win = { foo: 'bar', document: {} } as any
      const oldWindow = Global.window
      expect(Global.window).not.toBe(win)
      Global.withWindow(win, () => {
        expect(Global.window).toEqual(win)
        expect(Global.document).toEqual(win.document)
      })
      expect(Global.window).toBe(oldWindow)
    })
  })

  describe('getWindow()', () => {
    it('should return the registered window', () => {
      expect(Global.getWindow()).toBe(Global.window)
    })
  })
})
