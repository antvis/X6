import { EventHook } from './hook'
import { Util } from './util'

// Prevent triggered image.load events from bubbling to window.load
export namespace Special {
  EventHook.register('load', {
    noBubble: true,
  })
}

// Support: Chrome <=73+
// Chrome doesn't alert on `event.preventDefault()`
// as the standard mandates.
export namespace Special {
  EventHook.register('beforeunload', {
    postDispatch(elem, event) {
      if (event.result !== undefined && event.originalEvent) {
        event.originalEvent.returnValue = event.result
      }
    },
  })
}

// For mouseenter/leave call the handler if related is outside the target.
// NB: No relatedTarget if the mouse left/entered the browser window
export namespace Special {
  EventHook.register('mouseenter', {
    delegateType: 'mouseover',
    bindType: 'mouseover',
    handle(target, event) {
      let ret
      const related = event.relatedTarget
      const handleObj = event.handleObj
      if (!related || (related !== target && !Util.contains(target, related))) {
        event.type = handleObj.originType
        ret = handleObj.handler.call(target, event)
        event.type = 'mouseover'
      }
      return ret
    },
  })
  EventHook.register('mouseleave', {
    delegateType: 'mouseout',
    bindType: 'mouseout',
    handle(target, event) {
      let ret
      const related = event.relatedTarget
      const handleObj = event.handleObj
      if (!related || (related !== target && !Util.contains(target, related))) {
        event.type = handleObj.originType
        ret = handleObj.handler.call(target, event)
        event.type = 'mouseout'
      }
      return ret
    },
  })
}
