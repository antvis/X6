/**
 * Returns true if the event has been consumed.
 */
export function isConsumed(e: Event) {
  return (e as any).isConsumed === true
}

export function consume(
  e: Event,
  preventDefault: boolean = true,
  stopPropagation: boolean = true,
) {
  if (preventDefault) {
    if (e.preventDefault) {
      if (stopPropagation) {
        e.stopPropagation()
      }

      e.preventDefault()
    } else if (stopPropagation) {
      e.cancelBubble = true
    }
  }

  const o = e as any
  o.isConsumed = true

  if (!e.preventDefault) {
    e.returnValue = false
  }
}
