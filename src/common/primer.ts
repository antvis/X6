import { IDisposable, Events, DomEvent, detector } from '../common'

export class Primer extends Events implements IDisposable {
  constructor() {
    super()
    if (detector.IS_IE) {
      DomEvent.addListener(window, 'unload', () => {
        this.dispose()
      })
    }
  }

  private destoryed: boolean = false

  get disposed() {
    return this.destoryed
  }

  dispose() {
    this.destoryed = true
  }
}
