import { Config } from '../../config'
import { type Cell, Model } from '../../model'

const LOCAL_STORAGE_KEY = `${Config.prefixCls}.clipboard.cells`

export function save(cells: Cell[]) {
  if (window.localStorage) {
    const data = cells.map((cell) => cell.toJSON())
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data))
  }
}

export function fetch() {
  if (window.localStorage) {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    const cells = raw ? JSON.parse(raw) : []
    if (cells) {
      return Model.fromJSON(cells)
    }
  }
}

export function clean() {
  if (window.localStorage) {
    localStorage.removeItem(LOCAL_STORAGE_KEY)
  }
}
