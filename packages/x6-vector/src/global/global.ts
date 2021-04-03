const win = window
const doc = document

export namespace Global {
  export type WindowType = typeof win
  export type DocumentType = typeof doc

  export let window = win // eslint-disable-line
  export let document = doc // eslint-disable-line

  let saved: {
    window: WindowType
    document: DocumentType
  }

  export function registerWindow(
    win: WindowType,
    doc: DocumentType = win.document,
  ) {
    window = win
    document = doc
  }

  export function getWindow() {
    return window
  }

  export function saveWindow() {
    saved = {
      window,
      document,
    }
  }

  export function restoreWindow() {
    if (saved) {
      window = saved.window
      document = saved.document
    }
  }

  export function withWindow(
    w: WindowType,
    callback: (win: WindowType, doc: DocumentType) => any,
  ) {
    saveWindow()
    registerWindow(w, w.document)
    callback(w, w.document)
    restoreWindow()
  }
}
