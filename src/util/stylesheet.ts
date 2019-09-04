import { State } from '../core'

export function getRotation(state: State | null, defaultValue: number = 0) {
  return state && state.style && state.style.rotation || defaultValue
}

export function isNoneColor(color: string | null) {
  return color == null || color === 'none'
}
