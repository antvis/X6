type Modifiers = 'alt' | 'ctrl' | 'meta'

export interface MouseWheelOptions {
  enabled: boolean
  modifiers: Modifiers | Modifiers[] | null
}
