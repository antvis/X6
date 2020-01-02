import { State } from '../core/state'

export function isValidColor(color?: string | null) {
  return color != null && color !== 'none'
}

export function getRotation(state: State | null, defaultValue: number = 0) {
  return (state && state.style && state.style.rotation) || defaultValue
}

export function isFlipH(state: State | null) {
  return state != null && state.style != null && state.style.flipH === true
}

export function isFlipV(state: State | null) {
  return state != null && state.style != null && state.style.flipV === true
}
