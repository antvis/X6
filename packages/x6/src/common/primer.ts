import { detector } from './detector'
import { DomEvent } from './dom-event'
import { Events } from './events'
import { IDisposable } from './disposable'

export abstract class Primer<EventArgs = any> extends Events<EventArgs>
  implements IDisposable {
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
