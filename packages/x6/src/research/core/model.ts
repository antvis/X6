import { Cell } from './cell'
import { Collection } from './collection'
import { Basecoat } from '../../entity'
import { KeyValue } from '../../types'

export class Model extends Basecoat {
  public readonly cells: Collection

  protected readonly _batches: { [name: string]: number } = {} // tslint:disable-line
  _in = {} // tslint:disable-line
  _out = {} // tslint:disable-line
  _nodes: { [id: string]: boolean } = {} // tslint:disable-line
  _edges = {} // tslint:disable-line

  constructor(cells: Cell[] = []) {
    super()

    this.cells = new Collection(cells, {
      comparator: (a, b) => a.zIndex - b.zIndex,
    })

    this.cells.on('add', ({ cell }) => this.restructureOnAdd(cell))
    this.cells.on('remove', ({ cell }) => this.restructureOnRemove(cell))
    this.cells.on('reset', ({ current }) => this.restructureOnReset(current))
    // this.cells.on('remove')
    // this.cells.on('change:source')
    // this.cells.on('change:target')
  }

  protected restructureOnAdd(cell: Cell) {
    if (cell.isEdge()) {
    } else {
      this._nodes[cell.id] = true
    }
  }

  protected restructureOnRemove(cell: Cell) {
    if (cell.isEdge()) {
    } else {
      delete this._nodes[cell.id]
    }
  }

  protected restructureOnReset(cells: Cell[]) {
    this._out = {}
    this._in = {}
    this._nodes = {}
    this._edges = {}
    cells.forEach(cell => this.restructureOnAdd(cell))
  }

  protected restructureOnChangeSource() {}

  protected restructureOnChangeTarget() {}

  addCell(cell: Cell) {
    this.cells.add(cell)
  }

  getCell(id: string) {
    return this.cells.get(id)
  }

  getCells() {
    this.cells.toArray()
  }

  startBatch(name: string, data: KeyValue = {}) {
    this._batches[name] = (this._batches[name] || 0) + 1
    return this.trigger('batch:start', { ...data, batchName: name })
  }

  stopBatch(name: string, data: KeyValue = {}) {
    this._batches[name] = (this._batches[name] || 0) - 1
    return this.trigger('batch:stop', { ...data, batchName: name })
  }

  hasActiveBatch(name: string | string[]) {
    const batches = this._batches
    let names

    if (arguments.length === 0) {
      names = Object.keys(batches)
    } else if (Array.isArray(name)) {
      names = name
    } else {
      names = [name]
    }

    return names.some(batch => batches[batch] > 0)
  }
}

export namespace Model {}
