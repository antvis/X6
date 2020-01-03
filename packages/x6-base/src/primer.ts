import { detector } from '@antv/x6-detector'
import { Events } from '@antv/x6-events'
import { IDisposable } from '@antv/x6-disposable'
import { addListener } from '@antv/x6-dom-event'

export abstract class Primer<EventArgs = any> extends Events<EventArgs>
  implements IDisposable {
  constructor() {
    super()
    if (detector.IS_IE) {
      addListener(window, 'unload', () => {
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
