import { ArrayExt, Basecoat, disposable } from '../common'
import type { Cell, CellBaseEventArgs, CellSetOptions } from './cell'
import type { Edge } from './edge'
import type { Node } from './node'

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

  protected notifyCellEvent<K extends keyof CellBaseEventArgs>(
    name: K,
    args: CellBaseEventArgs[K],
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
  extends CellBaseEventArgs,
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
  'cell:transition:start': CellBaseEventArgs['transition:start']
  'cell:transition:progress': CellBaseEventArgs['transition:progress']
  'cell:transition:complete': CellBaseEventArgs['transition:complete']
  'cell:transition:stop': CellBaseEventArgs['transition:stop']
  'cell:transition:finish': CellBaseEventArgs['transition:finish']

  'cell:changed': CellBaseEventArgs['changed']
  'cell:added': CellBaseEventArgs['added']
  'cell:removed': CellBaseEventArgs['removed']

  'cell:change:*': CellBaseEventArgs['change:*']
  'cell:change:attrs': CellBaseEventArgs['change:attrs']
  'cell:change:zIndex': CellBaseEventArgs['change:zIndex']
  'cell:change:markup': CellBaseEventArgs['change:markup']
  'cell:change:visible': CellBaseEventArgs['change:visible']
  'cell:change:parent': CellBaseEventArgs['change:parent']
  'cell:change:children': CellBaseEventArgs['change:children']
  'cell:change:tools': CellBaseEventArgs['change:tools']
  'cell:change:view': CellBaseEventArgs['change:view']
  'cell:change:data': CellBaseEventArgs['change:data']

  'cell:change:size': CellBaseEventArgs['change:size']
  'cell:change:angle': CellBaseEventArgs['change:angle']
  'cell:change:position': CellBaseEventArgs['change:position']
  'cell:change:ports': CellBaseEventArgs['change:ports']
  'cell:change:portMarkup': CellBaseEventArgs['change:portMarkup']
  'cell:change:portLabelMarkup': CellBaseEventArgs['change:portLabelMarkup']
  'cell:change:portContainerMarkup': CellBaseEventArgs['change:portContainerMarkup']
  'cell:ports:added': CellBaseEventArgs['ports:added']
  'cell:ports:removed': CellBaseEventArgs['ports:removed']

  'cell:change:source': CellBaseEventArgs['change:source']
  'cell:change:target': CellBaseEventArgs['change:target']
  'cell:change:router': CellBaseEventArgs['change:router']
  'cell:change:connector': CellBaseEventArgs['change:connector']
  'cell:change:vertices': CellBaseEventArgs['change:vertices']
  'cell:change:labels': CellBaseEventArgs['change:labels']
  'cell:change:defaultLabel': CellBaseEventArgs['change:defaultLabel']
  'cell:vertexs:added': CellBaseEventArgs['vertexs:added']
  'cell:vertexs:removed': CellBaseEventArgs['vertexs:removed']
  'cell:labels:added': CellBaseEventArgs['labels:added']
  'cell:labels:removed': CellBaseEventArgs['labels:removed']

  'cell:batch:start': CellBaseEventArgs['batch:start']
  'cell:batch:stop': CellBaseEventArgs['batch:stop']
}

export interface NodeEventArgs {
  'node:transition:start': NodeEventCommonArgs &
    CellBaseEventArgs['transition:start']
  'node:transition:progress': NodeEventCommonArgs &
    CellBaseEventArgs['transition:progress']
  'node:transition:complete': NodeEventCommonArgs &
    CellBaseEventArgs['transition:complete']
  'node:transition:stop': NodeEventCommonArgs &
    CellBaseEventArgs['transition:stop']
  'node:transition:finish': NodeEventCommonArgs &
    CellBaseEventArgs['transition:finish']

  'node:changed': NodeEventCommonArgs & CellEventArgs['cell:changed']
  'node:added': NodeEventCommonArgs & CellEventArgs['cell:added']
  'node:removed': NodeEventCommonArgs & CellEventArgs['cell:removed']

  'node:change:*': NodeEventCommonArgs & CellBaseEventArgs['change:*']
  'node:change:attrs': NodeEventCommonArgs & CellBaseEventArgs['change:attrs']
  'node:change:zIndex': NodeEventCommonArgs & CellBaseEventArgs['change:zIndex']
  'node:change:markup': NodeEventCommonArgs & CellBaseEventArgs['change:markup']
  'node:change:visible': NodeEventCommonArgs &
    CellBaseEventArgs['change:visible']
  'node:change:parent': NodeEventCommonArgs & CellBaseEventArgs['change:parent']
  'node:change:children': NodeEventCommonArgs &
    CellBaseEventArgs['change:children']
  'node:change:tools': NodeEventCommonArgs & CellBaseEventArgs['change:tools']
  'node:change:view': NodeEventCommonArgs & CellBaseEventArgs['change:view']
  'node:change:data': NodeEventCommonArgs & CellBaseEventArgs['change:data']

  'node:change:size': NodeEventCommonArgs & CellBaseEventArgs['change:size']
  'node:change:position': NodeEventCommonArgs &
    CellBaseEventArgs['change:position']
  'node:change:angle': NodeEventCommonArgs & CellBaseEventArgs['change:angle']
  'node:change:ports': NodeEventCommonArgs & CellBaseEventArgs['change:ports']
  'node:change:portMarkup': NodeEventCommonArgs &
    CellBaseEventArgs['change:portMarkup']
  'node:change:portLabelMarkup': NodeEventCommonArgs &
    CellBaseEventArgs['change:portLabelMarkup']
  'node:change:portContainerMarkup': NodeEventCommonArgs &
    CellBaseEventArgs['change:portContainerMarkup']
  'node:ports:added': NodeEventCommonArgs & CellBaseEventArgs['ports:added']
  'node:ports:removed': NodeEventCommonArgs & CellBaseEventArgs['ports:removed']

  'node:batch:start': NodeEventCommonArgs & CellBaseEventArgs['batch:start']
  'node:batch:stop': NodeEventCommonArgs & CellBaseEventArgs['batch:stop']

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
    CellBaseEventArgs['transition:start']
  'edge:transition:progress': EdgeEventCommonArgs &
    CellBaseEventArgs['transition:progress']
  'edge:transition:complete': EdgeEventCommonArgs &
    CellBaseEventArgs['transition:complete']
  'edge:transition:stop': EdgeEventCommonArgs &
    CellBaseEventArgs['transition:stop']
  'edge:transition:finish': EdgeEventCommonArgs &
    CellBaseEventArgs['transition:finish']

  'edge:changed': EdgeEventCommonArgs & CellEventArgs['cell:changed']
  'edge:added': EdgeEventCommonArgs & CellEventArgs['cell:added']
  'edge:removed': EdgeEventCommonArgs & CellEventArgs['cell:removed']

  'edge:change:*': EdgeEventCommonArgs & CellBaseEventArgs['change:*']
  'edge:change:attrs': EdgeEventCommonArgs & CellBaseEventArgs['change:attrs']
  'edge:change:zIndex': EdgeEventCommonArgs & CellBaseEventArgs['change:zIndex']
  'edge:change:markup': EdgeEventCommonArgs & CellBaseEventArgs['change:markup']
  'edge:change:visible': EdgeEventCommonArgs &
    CellBaseEventArgs['change:visible']
  'edge:change:parent': EdgeEventCommonArgs & CellBaseEventArgs['change:parent']
  'edge:change:children': EdgeEventCommonArgs &
    CellBaseEventArgs['change:children']
  'edge:change:tools': EdgeEventCommonArgs & CellBaseEventArgs['change:tools']
  'edge:change:data': EdgeEventCommonArgs & CellBaseEventArgs['change:data']

  'edge:change:source': EdgeEventCommonArgs & CellBaseEventArgs['change:source']
  'edge:change:target': EdgeEventCommonArgs & CellBaseEventArgs['change:target']
  'edge:change:router': EdgeEventCommonArgs & CellBaseEventArgs['change:router']
  'edge:change:connector': EdgeEventCommonArgs &
    CellBaseEventArgs['change:connector']
  'edge:change:vertices': EdgeEventCommonArgs &
    CellBaseEventArgs['change:vertices']
  'edge:change:labels': EdgeEventCommonArgs & CellBaseEventArgs['change:labels']
  'edge:change:defaultLabel': EdgeEventCommonArgs &
    CellBaseEventArgs['change:defaultLabel']
  'edge:vertexs:added': EdgeEventCommonArgs & CellBaseEventArgs['vertexs:added']
  'edge:vertexs:removed': EdgeEventCommonArgs &
    CellBaseEventArgs['vertexs:removed']
  'edge:labels:added': EdgeEventCommonArgs & CellBaseEventArgs['labels:added']
  'edge:labels:removed': EdgeEventCommonArgs &
    CellBaseEventArgs['labels:removed']

  'edge:batch:start': EdgeEventCommonArgs & CellBaseEventArgs['batch:start']
  'edge:batch:stop': EdgeEventCommonArgs & CellBaseEventArgs['batch:stop']
}
