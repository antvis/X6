import { detector } from './detector'
import { IDisposable } from './disposable'
import { Events } from './events'
import { DomEvent } from './domevent'

export abstract class Primer extends Events implements IDisposable {
  constructor() {
    super()
    if (detector.IS_IE) {
      DomEvent.addListener(window, 'unload', () => {
        this.dispose()
      })
    }
  }

  private isDisposed: boolean = false

  get disposed() {
    return this.isDisposed
  }

  public dispose() {
    this.isDisposed = true
  }
}
