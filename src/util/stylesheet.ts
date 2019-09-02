import { CellState } from '../core'

export function getArcSize() {

}

export function getRotation(state: CellState | null, defaultValue: number = 0) {
  return state && state.style && state.style.rotation || defaultValue
}
