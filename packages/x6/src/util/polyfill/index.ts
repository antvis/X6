import JQuery from 'jquery'
import 'jquery-mousewheel'
import { Platform } from '../platform'

if (Platform.SUPPORT_PASSIVE) {
  JQuery.event.special.touchstart = {
    setup(data, ns, handle) {
      this.addEventListener('touchstart', handle as any, {
        passive: true,
      })
    },
  }

  const hook = JQuery.event.special.mousewheel as any
  const setup = hook.setup

  hook.setup = function (this: EventTarget) {
    const addEventListener = this.addEventListener
    this.addEventListener = (name: string, handler: any) => {
      addEventListener.call(this, name, handler, { passive: true })
    }
    setup.call(this)
    this.addEventListener = addEventListener
  }
}
