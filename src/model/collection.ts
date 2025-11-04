import { ArrayExt, Basecoat, disposable } from '../common'
import type { Edge } from './edge'
import type { Node } from './node'
import type { Cell, CellSetOptions, TransitionEventArgs } from './cell'

export class Collection extends Basecoat<CollectionEventArgs> {
  public length = 0
  public comparator: Comparator | null
  private cells: Cell[]
  private map: { [id: string]: Cell }

  constructor(cells: Cell | Cell[], options: Options = {}) {
    super()
    this.comparator = options.comparator || 'zIndex'
    this.clean()
    if (cells) {
      this.reset(cells, { silent: true })
    }
  }

  toJSON() {
    return this.cells.map((cell) => cell.toJSON())
  }

  add(cells: Cell | Cell[], options?: CollectionAddOptions): this
  add(cells: Cell | Cell[], index: number, options?: CollectionAddOptions): this
  add(
    cells: Cell | Cell[],
    index?: number | CollectionAddOptions,
    options?: CollectionAddOptions,
  ) {
    let localIndex: number
    let localOptions: CollectionAddOptions

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
      this.comparator &&
      typeof index !== 'number' &&
      localOptions.sort !== false
    const sortAttr = this.comparator || null

    let sort = false
    const added: Cell[] = []
    const merged: Cell[] = []

    entities.forEach((cell) => {
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
              sort = sortAttr.some((key) => existing.hasChanged(key))
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
        const args = {
          cell,
          index: localIndex + i,
          options: localOptions,
        }
        this.trigger('added', args)
        if (!localOptions.dryrun) {
          cell.notify('added', { ...args })
        }
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

  remove(cell: Cell, options?: CollectionRemoveOptions): Cell
  remove(cells: Cell[], options?: CollectionRemoveOptions): Cell[]
  remove(cells: Cell | Cell[], options: CollectionRemoveOptions = {}) {
    const arr = Array.isArray(cells) ? cells : [cells]
    const removed = this.removeCells(arr, options)
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

  protected removeCells(cells: Cell[], options: CollectionRemoveOptions) {
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

      if (!options.dryrun) {
        cell.remove()
      }

      if (!options.silent) {
        this.trigger('removed', { cell, index, options })

        if (!options.dryrun) {
          cell.notify('removed', { cell, index, options })
        }
      }
    }

    return removed
  }

  reset(cells: Cell | Cell[], options: CollectionSetOptions = {}) {
    const previous = this.cells.slice()
    if (!options.diff) {
      previous.forEach((cell) => this.unreference(cell))
      this.clean()
    }
    this.add(cells, { silent: true, ...options })
    if (!options.silent) {
      const current = this.cells.slice()
      this.trigger('reseted', {
        options,
        previous,
        current,
      })

      const added: Cell[] = []
      const removed: Cell[] = []

      current.forEach((a) => {
        const exist = previous.some((b) => b.id === a.id)
        if (!exist) {
          added.push(a)
        }
      })

      previous.forEach((a) => {
        const exist = current.some((b) => b.id === a.id)
        if (!exist) {
          removed.push(a)
        }
      })

      this.trigger('updated', { options, added, removed, merged: [] })
    }

    return this
  }

  push(cell: Cell, options?: CollectionSetOptions) {
    return this.add(cell, this.length, options)
  }

  pop(options?: CollectionSetOptions) {
    const cell = this.at(this.length - 1)!
    return this.remove(cell, options)
  }

  unshift(cell: Cell, options?: CollectionSetOptions) {
    return this.add(cell, 0, options)
  }

  shift(options?: CollectionSetOptions) {
    const cell = this.at(0)!
    return this.remove(cell, options)
  }

  get(cell?: string | number | Cell | null): Cell | null {
    if (cell == null) {
      return null
    }

    const id =
      typeof cell === 'string' || typeof cell === 'number' ? cell : cell.id
    return this.map[id] || null
  }

  has(cell: string | Cell): boolean {
    return this.get(cell as any) != null
  }

  at(index: number): Cell | null {
    if (index < 0) {
      index += this.length // eslint-disable-line
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

  sort(options: CollectionSetOptions = {}) {
    if (this.comparator != null) {
      this.cells = ArrayExt.sortBy(this.cells, this.comparator)
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
    cell.on('*', this.notifyCellEvent, this)
  }

  protected unreference(cell: Cell) {
    cell.off('*', this.notifyCellEvent, this)
    delete this.map[cell.id]
  }

  protected notifyCellEvent<K extends keyof TransitionEventArgs>(
    name: K,
    args: TransitionEventArgs[K],
  ) {
    const cell = args.cell
    this.trigger(`cell:${name}`, args)
    if (cell) {
      if (cell.isNode()) {
        this.trigger(`node:${name}`, { ...args, node: cell })
      } else if (cell.isEdge()) {
        this.trigger(`edge:${name}`, { ...args, edge: cell })
      }
    }
  }

  protected clean() {
    this.length = 0
    this.cells = []
    this.map = {}
  }

  @disposable()
  dispose() {
    this.reset([])
  }
}

export type Comparator = string | string[] | ((cell: Cell) => number)

interface Options {
  comparator?: Comparator
}

export interface CollectionSetOptions extends CellSetOptions {}

export interface CollectionRemoveOptions extends CellSetOptions {
  /**
   * The default is to remove all the associated links.
   * Set `disconnectEdges` option to `true` to disconnect edges
   * when a cell is removed.
   */
  disconnectEdges?: boolean

  dryrun?: boolean
}

export interface CollectionAddOptions extends CollectionSetOptions {
  sort?: boolean
  merge?: boolean
  dryrun?: boolean
}

export interface CollectionEventArgs
  extends TransitionEventArgs,
    NodeEventArgs,
    EdgeEventArgs {
  sorted?: null
  reseted: {
    current: Cell[]
    previous: Cell[]
    options: CollectionSetOptions
  }
  updated: {
    added: Cell[]
    merged: Cell[]
    removed: Cell[]
    options: CollectionSetOptions
  }
  added: {
    cell: Cell
    index: number
    options: CollectionAddOptions
  }
  removed: {
    cell: Cell
    index: number
    options: CollectionRemoveOptions
  }
}

interface NodeEventCommonArgs {
  node: Node
}

interface EdgeEventCommonArgs {
  edge: Edge
}

export interface CellEventArgs {
  'cell:transition:start': TransitionEventArgs['transition:start']
  'cell:transition:progress': TransitionEventArgs['transition:progress']
  'cell:transition:complete': TransitionEventArgs['transition:complete']
  'cell:transition:stop': TransitionEventArgs['transition:stop']
  'cell:transition:finish': TransitionEventArgs['transition:finish']

  'cell:changed': TransitionEventArgs['changed']
  'cell:added': TransitionEventArgs['added']
  'cell:removed': TransitionEventArgs['removed']

  'cell:change:*': TransitionEventArgs['change:*']
  'cell:change:attrs': TransitionEventArgs['change:attrs']
  'cell:change:zIndex': TransitionEventArgs['change:zIndex']
  'cell:change:markup': TransitionEventArgs['change:markup']
  'cell:change:visible': TransitionEventArgs['change:visible']
  'cell:change:parent': TransitionEventArgs['change:parent']
  'cell:change:children': TransitionEventArgs['change:children']
  'cell:change:tools': TransitionEventArgs['change:tools']
  'cell:change:view': TransitionEventArgs['change:view']
  'cell:change:data': TransitionEventArgs['change:data']

  'cell:change:size': TransitionEventArgs['change:size']
  'cell:change:angle': TransitionEventArgs['change:angle']
  'cell:change:position': TransitionEventArgs['change:position']
  'cell:change:ports': TransitionEventArgs['change:ports']
  'cell:change:portMarkup': TransitionEventArgs['change:portMarkup']
  'cell:change:portLabelMarkup': TransitionEventArgs['change:portLabelMarkup']
  'cell:change:portContainerMarkup': TransitionEventArgs['change:portContainerMarkup']
  'cell:ports:added': TransitionEventArgs['ports:added']
  'cell:ports:removed': TransitionEventArgs['ports:removed']

  'cell:change:source': TransitionEventArgs['change:source']
  'cell:change:target': TransitionEventArgs['change:target']
  'cell:change:router': TransitionEventArgs['change:router']
  'cell:change:connector': TransitionEventArgs['change:connector']
  'cell:change:vertices': TransitionEventArgs['change:vertices']
  'cell:change:labels': TransitionEventArgs['change:labels']
  'cell:change:defaultLabel': TransitionEventArgs['change:defaultLabel']
  'cell:vertexs:added': TransitionEventArgs['vertexs:added']
  'cell:vertexs:removed': TransitionEventArgs['vertexs:removed']
  'cell:labels:added': TransitionEventArgs['labels:added']
  'cell:labels:removed': TransitionEventArgs['labels:removed']

  'cell:batch:start': TransitionEventArgs['batch:start']
  'cell:batch:stop': TransitionEventArgs['batch:stop']
}

export interface NodeEventArgs {
  'node:transition:start': NodeEventCommonArgs &
    TransitionEventArgs['transition:start']
  'node:transition:progress': NodeEventCommonArgs &
    TransitionEventArgs['transition:progress']
  'node:transition:complete': NodeEventCommonArgs &
    TransitionEventArgs['transition:complete']
  'node:transition:stop': NodeEventCommonArgs &
    TransitionEventArgs['transition:stop']
  'node:transition:finish': NodeEventCommonArgs &
    TransitionEventArgs['transition:finish']

  'node:changed': NodeEventCommonArgs & CellEventArgs['cell:changed']
  'node:added': NodeEventCommonArgs & CellEventArgs['cell:added']
  'node:removed': NodeEventCommonArgs & CellEventArgs['cell:removed']

  'node:change:*': NodeEventCommonArgs & TransitionEventArgs['change:*']
  'node:change:attrs': NodeEventCommonArgs & TransitionEventArgs['change:attrs']
  'node:change:zIndex': NodeEventCommonArgs &
    TransitionEventArgs['change:zIndex']
  'node:change:markup': NodeEventCommonArgs &
    TransitionEventArgs['change:markup']
  'node:change:visible': NodeEventCommonArgs &
    TransitionEventArgs['change:visible']
  'node:change:parent': NodeEventCommonArgs &
    TransitionEventArgs['change:parent']
  'node:change:children': NodeEventCommonArgs &
    TransitionEventArgs['change:children']
  'node:change:tools': NodeEventCommonArgs & TransitionEventArgs['change:tools']
  'node:change:view': NodeEventCommonArgs & TransitionEventArgs['change:view']
  'node:change:data': NodeEventCommonArgs & TransitionEventArgs['change:data']

  'node:change:size': NodeEventCommonArgs & TransitionEventArgs['change:size']
  'node:change:position': NodeEventCommonArgs &
    TransitionEventArgs['change:position']
  'node:change:angle': NodeEventCommonArgs & TransitionEventArgs['change:angle']
  'node:change:ports': NodeEventCommonArgs & TransitionEventArgs['change:ports']
  'node:change:portMarkup': NodeEventCommonArgs &
    TransitionEventArgs['change:portMarkup']
  'node:change:portLabelMarkup': NodeEventCommonArgs &
    TransitionEventArgs['change:portLabelMarkup']
  'node:change:portContainerMarkup': NodeEventCommonArgs &
    TransitionEventArgs['change:portContainerMarkup']
  'node:ports:added': NodeEventCommonArgs & TransitionEventArgs['ports:added']
  'node:ports:removed': NodeEventCommonArgs &
    TransitionEventArgs['ports:removed']

  'node:batch:start': NodeEventCommonArgs & TransitionEventArgs['batch:start']
  'node:batch:stop': NodeEventCommonArgs & TransitionEventArgs['batch:stop']

  // 'node:translate': NodeEventCommonArgs
  // 'node:translating': NodeEventCommonArgs
  // 'node:translated': NodeEventCommonArgs
  // 'node:resize': NodeEventCommonArgs
  // 'node:resizing': NodeEventCommonArgs
  // 'node:resized': NodeEventCommonArgs
  // 'node:rotate': NodeEventCommonArgs
  // 'node:rotating': NodeEventCommonArgs
  // 'node:rotated': NodeEventCommonArgs
}

export interface EdgeEventArgs {
  'edge:transition:start': EdgeEventCommonArgs &
    TransitionEventArgs['transition:start']
  'edge:transition:progress': EdgeEventCommonArgs &
    TransitionEventArgs['transition:progress']
  'edge:transition:complete': EdgeEventCommonArgs &
    TransitionEventArgs['transition:complete']
  'edge:transition:stop': EdgeEventCommonArgs &
    TransitionEventArgs['transition:stop']
  'edge:transition:finish': EdgeEventCommonArgs &
    TransitionEventArgs['transition:finish']

  'edge:changed': EdgeEventCommonArgs & CellEventArgs['cell:changed']
  'edge:added': EdgeEventCommonArgs & CellEventArgs['cell:added']
  'edge:removed': EdgeEventCommonArgs & CellEventArgs['cell:removed']

  'edge:change:*': EdgeEventCommonArgs & TransitionEventArgs['change:*']
  'edge:change:attrs': EdgeEventCommonArgs & TransitionEventArgs['change:attrs']
  'edge:change:zIndex': EdgeEventCommonArgs &
    TransitionEventArgs['change:zIndex']
  'edge:change:markup': EdgeEventCommonArgs &
    TransitionEventArgs['change:markup']
  'edge:change:visible': EdgeEventCommonArgs &
    TransitionEventArgs['change:visible']
  'edge:change:parent': EdgeEventCommonArgs &
    TransitionEventArgs['change:parent']
  'edge:change:children': EdgeEventCommonArgs &
    TransitionEventArgs['change:children']
  'edge:change:tools': EdgeEventCommonArgs & TransitionEventArgs['change:tools']
  'edge:change:data': EdgeEventCommonArgs & TransitionEventArgs['change:data']

  'edge:change:source': EdgeEventCommonArgs &
    TransitionEventArgs['change:source']
  'edge:change:target': EdgeEventCommonArgs &
    TransitionEventArgs['change:target']
  'edge:change:router': EdgeEventCommonArgs &
    TransitionEventArgs['change:router']
  'edge:change:connector': EdgeEventCommonArgs &
    TransitionEventArgs['change:connector']
  'edge:change:vertices': EdgeEventCommonArgs &
    TransitionEventArgs['change:vertices']
  'edge:change:labels': EdgeEventCommonArgs &
    TransitionEventArgs['change:labels']
  'edge:change:defaultLabel': EdgeEventCommonArgs &
    TransitionEventArgs['change:defaultLabel']
  'edge:vertexs:added': EdgeEventCommonArgs &
    TransitionEventArgs['vertexs:added']
  'edge:vertexs:removed': EdgeEventCommonArgs &
    TransitionEventArgs['vertexs:removed']
  'edge:labels:added': EdgeEventCommonArgs & TransitionEventArgs['labels:added']
  'edge:labels:removed': EdgeEventCommonArgs &
    TransitionEventArgs['labels:removed']

  'edge:batch:start': EdgeEventCommonArgs & TransitionEventArgs['batch:start']
  'edge:batch:stop': EdgeEventCommonArgs & TransitionEventArgs['batch:stop']
}
