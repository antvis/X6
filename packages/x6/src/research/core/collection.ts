import { ArrayExt } from '../../util'
import { Basecoat } from '../../entity'
import { Cell } from './cell'
import { Edge } from './edge'

export class Collection extends Basecoat<Collection.EventArgs> {
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

  add(cells: Cell | Cell[], options?: Collection.AddOptions): this
  add(
    cells: Cell | Cell[],
    index: number,
    options?: Collection.AddOptions,
  ): this
  add(
    cells: Cell | Cell[],
    index?: number | Collection.AddOptions,
    options?: Collection.AddOptions,
  ) {
    let localIndex: number
    let localOptions: Collection.AddOptions

    if (typeof index === 'number') {
      localIndex = index
      localOptions = { merge: false, ...options }
    } else {
      localIndex = this.length
      localOptions = { merge: false, ...index }
    }

    if (localIndex > this.length) {
      localIndex = this.length
    }
    if (localIndex < 0) {
      localIndex += this.length + 1
    }

    const entities = Array.isArray(cells) ? cells : [cells]
    const sortable =
      this.comparator && index == null && localOptions.sort !== false
    const sortAttr = this.comparator || null

    let sort = false
    const added: Cell[] = []
    const merged: Cell[] = []

    entities.forEach(cell => {
      const existing = this.get(cell)
      if (existing) {
        if (localOptions.merge && !cell.isSameStore(existing)) {
          existing.setProp(cell.getProp(), options) // merge
          merged.push(existing)
          if (sortable && !sort) {
            if (sortAttr == null || typeof sortAttr === 'function') {
              sort = existing.hasChanged()
            } else if (typeof sortAttr === 'string') {
              sort = existing.hasChanged(sortAttr)
            } else {
              sort = sortAttr.some(key => existing.hasChanged(key))
            }
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
      this.cells.splice(localIndex, 0, ...added)
      this.length = this.cells.length
    }

    if (sort) {
      this.sort({ silent: true })
    }

    if (!localOptions.silent) {
      added.forEach((cell, i) => {
        this.trigger('added', {
          cell,
          index: localIndex + i,
          options: localOptions,
        })
      })

      if (sort) {
        this.trigger('sorted')
      }

      if (added.length || merged.length) {
        this.trigger('updated', {
          added,
          merged,
          removed: [],
          options: localOptions,
        })
      }
    }

    return this
  }

  remove(cell: Cell, options?: Collection.RemoveOptions): Cell
  remove(cells: Cell[], options?: Collection.RemoveOptions): Cell[]
  remove(cells: Cell | Cell[], options: Collection.RemoveOptions = {}) {
    const entities = Array.isArray(cells) ? cells : [cells]
    const removed = this.removeCells(entities, options)
    if (!options.silent && removed.length > 0) {
      this.trigger('updated', {
        options,
        removed,
        added: [],
        merged: [],
      })
    }
    return Array.isArray(cells) ? removed : removed[0]
  }

  protected removeCells(cells: Cell[], options: Collection.RemoveOptions) {
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
      removed.push(cell)
      this.unreference(cell)
      if (!options.silent) {
        this.trigger('removed', { cell, index, options })
      }
    }

    return removed
  }

  reset(cells: Cell | Cell[], options: Collection.SetOptions = {}) {
    const previous = this.cells.slice()
    previous.forEach(cell => this.unreference(cell))
    this.clean()
    this.add(cells, { silent: true, ...options })
    if (!options.silent) {
      this.trigger('reseted', {
        options,
        previous,
        current: this.cells.slice(),
      })
    }

    return this
  }

  push(cell: Cell, options?: Collection.SetOptions) {
    return this.add(cell, this.length, options)
  }

  pop(options?: Collection.SetOptions) {
    const cell = this.at(this.length - 1)!
    return this.remove(cell, options)
  }

  unshift(cell: Cell, options?: Collection.SetOptions) {
    return this.add(cell, 0, options)
  }

  shift(options?: Collection.SetOptions) {
    const cell = this.at(0)!
    return this.remove(cell, options)
  }

  get(cell: string | Cell): Cell | null {
    if (cell == null) {
      return null
    }

    const id = typeof cell === 'string' ? cell : cell.id
    return this.map[id] || null
  }

  has(cell: string | Cell): boolean {
    return this.get(cell as any) != null
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

  indexOf(cell: Cell) {
    return this.cells.indexOf(cell)
  }

  toArray() {
    return this.cells.slice()
  }

  sort(options: Collection.SetOptions = {}) {
    if (this.comparator != null) {
      if (typeof this.comparator === 'function') {
        this.cells.sort(this.comparator)
      } else {
        this.cells = ArrayExt.sortBy(this.cells, this.comparator)
      }

      if (!options.silent) {
        this.trigger('sorted')
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

  protected reference(cell: Cell) {
    this.map[cell.id] = cell
    cell.on('disposed', this.onCellDisposed, this)
    cell.on('change:zIndex', this.onCellZIndexChanged, this)
    if (cell.isEdge()) {
      cell.on('change:source', this.onEdgeSourceChanged, this)
      cell.on('change:target', this.onEdgeTargetChanged, this)
    }
  }

  protected unreference(cell: Cell) {
    cell.off('disposed', this.onCellDisposed, this)
    cell.off('change:zIndex', this.onCellZIndexChanged, this)
    if (cell.isEdge()) {
      cell.off('change:source', this.onEdgeSourceChanged, this)
      cell.off('change:target', this.onEdgeTargetChanged, this)
    }
    delete this.map[cell.id]
  }

  protected onEdgeSourceChanged(args: Cell.ChangeArgs<Edge.TerminalData>) {
    this.onEdgeTerminalChanged('source', args)
  }

  protected onEdgeTargetChanged(args: Cell.ChangeArgs<Edge.TerminalData>) {
    this.onEdgeTerminalChanged('target', args)
  }

  protected onEdgeTerminalChanged(
    type: Edge.TerminalType,
    args: Cell.ChangeArgs<Edge.TerminalData>,
  ) {
    this.trigger('change:terminal', {
      type,
      edge: args.cell as Edge,
      current: args.current,
      previous: args.previous,
    })
  }

  protected onCellZIndexChanged(args: Cell.EventArgs['change:zIndex']) {
    this.sort(args.options)
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

export namespace Collection {
  export type Comparator = string | string[] | ((a: Cell, b: Cell) => number)

  export interface Options {
    comparator?: Comparator
  }

  export interface SetOptions extends Cell.SetOptions {}

  export interface RemoveOptions extends Cell.SetOptions {
    /**
     * The default is to remove all the associated links.
     * Set `disconnectEdges` option to `true` to disconnect edges
     * when a cell is removed.
     */
    disconnectEdges?: boolean
  }

  export interface AddOptions extends SetOptions {
    sort?: boolean
    merge?: boolean
  }

  export interface EventArgs {
    sorted?: null
    reseted: {
      current: Cell[]
      previous: Cell[]
      options: SetOptions
    }
    updated: {
      added: Cell[]
      merged: Cell[]
      removed: Cell[]
      options: SetOptions
    }
    added: {
      cell: Cell
      index: number
      options: AddOptions
    }
    removed: {
      cell: Cell
      index: number
      options: RemoveOptions
    }
    'change:terminal': {
      edge: Edge
      type: Edge.TerminalType
      current?: Edge.TerminalData
      previous?: Edge.TerminalData
    }
  }
}
