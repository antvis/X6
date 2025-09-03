import type { Edge, Node } from '../../model'

export interface ClipboardImplOptions {
  useLocalStorage?: boolean
}

export interface ClipboardImplCopyOptions extends ClipboardImplOptions {
  deep?: boolean
}

export interface ClipboardImplPasteOptions extends ClipboardImplOptions {
  /**
   * Set of properties to be set on each copied node on every `paste()` call.
   * It is defined as an object. e.g. `{ zIndex: 1 }`.
   */
  nodeProps?: Node.Properties
  /**
   * Set of properties to be set on each copied edge on every `paste()` call.
   * It is defined as an object. e.g. `{ zIndex: 1 }`.
   */
  edgeProps?: Edge.Properties

  /**
   * An increment that is added to the pasted cells position on every
   * `paste()` call. It can be either a number or an object with `dx`
   * and `dy` attributes. It defaults to `{ dx: 20, dy: 20 }`.
   */
  offset?: number | { dx: number; dy: number }
}
