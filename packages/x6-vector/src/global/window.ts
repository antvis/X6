const win = window
const doc = document

export namespace Global {
  type WindowType = typeof win
  type DocumentType = typeof doc

  export let window = win // eslint-disable-line
  export let document = doc // eslint-disable-line

  let saved: {
    window: WindowType
    document: DocumentType
  }

  export function setWindow(win: WindowType, doc: DocumentType = win.document) {
    window = win
    document = doc
  }

  export function getWindow() {
    return window
  }

  export function save() {
    saved = {
      window,
      document,
    }
  }

  export function restore() {
    if (saved) {
      window = saved.window
      document = saved.document
    }
  }

  export function withWindow(
    w: WindowType,
    callback: (win: WindowType, doc: DocumentType) => any,
  ) {
    save()
    setWindow(w, w.document)
    callback(w, w.document)
    restore()
  }
}
