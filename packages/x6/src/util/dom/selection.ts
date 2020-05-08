export const clearSelection = (function () {
  const doc = document as any
  if (doc.selection) {
    return function () {
      doc.selection.empty()
    }
  }

  if (window.getSelection) {
    return function () {
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

  return function () {}
})()
