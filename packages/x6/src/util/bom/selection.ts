export const clearSelection = (function() {
  if ((document as any).selection) {
    return function() {
      ;(document as any).selection.empty()
    }
  }

  if (window.getSelection) {
    return function() {
      const selection = window.getSelection()
      if (selection) {
        if (selection.empty) {
          selection.empty()
        } else if (selection.removeAllRanges) {
          selection.removeAllRanges()
        }
      }
    }
  }

  return function() {}
})()
