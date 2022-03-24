import { EventHook } from './hook'

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
