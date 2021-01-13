export type Listener = (element: Element) => void

export interface Sensor {
  element: Element
  bind: (listener: Listener) => void
  unbind: (listener: Listener) => void
  destroy: () => void
}
