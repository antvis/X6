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

  private _disposed: boolean = false // tslint:disable-line:variable-name

  get disposed() {
    return this._disposed
  }

  dispose() {
    this._disposed = true
  }
}
