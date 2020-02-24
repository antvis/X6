import sortBy from 'lodash/sortBy'
import { Basecoat } from '../../entity'
import { Cell } from './cell'
import { KeyValue } from '../../types'

export class Collection extends Basecoat<EventArgs> {
  public length: number = 0
  private cells: Cell[]
  private map: { [id: string]: Cell }
  private readonly comparator: Collection.Comparator | null

  constructor(cells: Cell | Cell[], options: Collection.Options = {}) {
    super()
    this.comparator = options.comparator || null
    this.clean()
    if (cells) {
      this.reset(cells, { silent: true })
    }
  }

  toJSON() {
    return this.cells.map(cell => cell.toJSON())
  }

  add(cells: Cell | Cell[], options?: AddOptions): this
  add(cells: Cell | Cell[], index: number, options?: AddOptions): this
  add(cells: Cell | Cell[], index?: number | AddOptions, options?: AddOptions) {
    let at: number
    let opts: AddOptions

    if (typeof index === 'number') {
      at = index
      opts = { merge: false, ...options }
    } else {
      at = this.length
      opts = { merge: false, ...index }
    }

    if (at > this.length) {
      at = this.length
    }
    if (at < 0) {
      at += this.length + 1
    }

    const entities = Array.isArray(cells) ? cells : [cells]
    const sortable = this.comparator && index == null && opts.sort !== false
    const sortAttr = this.comparator || null

    let sort = false
    const added: Cell[] = []
    const merged: Cell[] = []

    entities.forEach(cell => {
      const existing = this.get(cell)
      if (existing) {
        if (opts.merge && cell.store !== existing.store) {
          existing.store.set(cell.store.get(), options) // merge
          merged.push(existing)
          if (sortable && !sort) {
            sort = existing.store.hasChanged(sortAttr as any)
          }
        }
      } else {
        added.push(cell)
        this.reference(cell)
      }
    })

    if (added.length) {
      if (sortable) {
        sort = true
      }
      this.cells.splice(at, 0, ...added)
      this.length = this.cells.length
    }

    if (sort) {
      this.sort({ silent: true })
    }

    if (!opts.silent) {
      added.forEach((cell, i) => {
        this.trigger('add', { cell, index: at + i, options: opts })
      })

      if (sort) {
        this.trigger('sort')
      }

      if (added.length || merged.length) {
        this.trigger('update', {
          added,
          merged,
          removed: [],
          options: opts,
        })
      }
    }

    return this
  }

  remove(cell: Cell, options?: Options): Cell
  remove(cells: Cell[], options?: Options): Cell[]
  remove(cells: Cell | Cell[], options: Options = {}) {
    const entities = Array.isArray(cells) ? cells : [cells]
    const removed = this.removeCells(entities, options)
    if (!options.silent && removed.length > 0) {
      this.trigger('update', {
        options,
        removed,
        added: [],
        merged: [],
      })
    }
    return Array.isArray(cells) ? removed : removed[0]
  }

  reset(cells: Cell | Cell[], options: Options = {}) {
    const previous = this.cells.slice()
    previous.forEach(cell => this.unreference(cell))
    this.clean()
    this.add(cells, { silent: true, ...options })
    if (!options.silent) {
      this.trigger('reset', {
        options,
        previous,
        current: this.cells.slice(),
      })
    }

    return this
  }

  push(cell: Cell, options?: Options) {
    return this.add(cell, this.length, options)
  }

  pop(options?: Options) {
    const cell = this.at(this.length - 1)!
    return this.remove(cell, options)
  }

  unshift(cell: Cell, options?: Options) {
    return this.add(cell, 0, options)
  }

  shift(options?: Options) {
    const cell = this.at(0)!
    return this.remove(cell, options)
  }

  get(id: string): Cell | null
  get(cell: Cell): Cell | null
  get(obj: string | Cell): Cell | null {
    if (obj == null) {
      return null
    }

    const id = typeof obj === 'string' ? obj : obj.id
    return this.map[id] || null
  }

  has(id: string): boolean
  has(cell: Cell): boolean
  has(obj: string | Cell): boolean {
    return this.get(obj as any) != null
  }

  at(index: number): Cell | null {
    if (index < 0) {
      index += this.length // tslint:disable-line
    }
    return this.cells[index] || null
  }

  first() {
    return this.at(0)
  }

  last() {
    return this.at(-1)
  }

  toArray() {
    return this.cells.slice()
  }

  sort(options: Options = {}) {
    if (this.comparator != null) {
      if (typeof this.comparator === 'function') {
        this.cells.sort(this.comparator)
      } else {
        this.cells = sortBy(this.cells, this.comparator)
      }

      if (!options.silent) {
        this.trigger('sort')
      }
    }

    return this
  }

  clone() {
    const constructor = this.constructor as any
    return new constructor(this.cells.slice(), {
      comparator: this.comparator,
    }) as Collection
  }

  protected removeCells(cells: Cell[], options: Options) {
    const removed = []

    for (let i = 0; i < cells.length; i += 1) {
      const cell = this.get(cells[i])
      if (cell == null) {
        continue
      }

      const index = this.cells.indexOf(cell)
      this.cells.splice(index, 1)
      this.length -= 1

      delete this.map[cell.id]

      if (!options.silent) {
        cell.trigger('remove', {
          cell,
          index,
          options,
        })
      }

      this.unreference(cell)
      removed.push(cell)
    }

    return removed
  }

  protected reference(cell: Cell) {
    this.map[cell.id] = cell
    cell.on('dispose', this.onCellDisposed, this)
  }

  protected unreference(cell: Cell) {
    cell.off('dispose', this.onCellDisposed, this)
    delete this.map[cell.id]
  }

  protected onCellDisposed({ cell }: { cell: Cell }) {
    if (cell) {
      this.remove(cell)
    }
  }

  protected clean() {
    this.length = 0
    this.cells = []
    this.map = {}
  }
}

interface Options extends KeyValue {
  silent?: boolean
}

interface AddOptions extends Options {
  sort?: boolean
  merge?: boolean
}

interface EventArgs {
  sort?: null
  add: {
    cell: Cell
    index: number
    options: Options
  }
  remove: {
    cell: Cell
    index: number
    options: Options
  }
  update: {
    added: Cell[]
    merged: Cell[]
    removed: Cell[]
    options: Options
  }
  reset: {
    current: Cell[]
    previous: Cell[]
    options: Options
  }
}

export namespace Collection {
  export type Comparator = string | string[] | ((a: Cell, b: Cell) => number)

  export interface Options {
    comparator?: Comparator
  }
}
