/* tslint:disable:variable-name */

import { JSONObject, JSONExt, ArrayExt, StringExt } from '../../util'
import { Basecoat } from '../../entity'
import { Rectangle } from '../../geometry'
import { Store } from './store'
import { Model } from './model'
import { Node } from './node'
import { Attribute } from '../attr'
import { KeyValue } from '../../types'

export class Cell extends Basecoat {
  public readonly id: string
  public readonly store: Store<Cell.StoreData>

  public model: Model | null
  private _parent: Cell | null
  private _children: Cell[] | null

  constructor(options: Cell.CreateCellOptions = {}) {
    super()
    this.id = options.id || StringExt.uuid()
    this.store = new Store<Cell.StoreData>({
      ...(this.constructor as any).presets,
      ...JSONExt.deepCopy(options),
      id: this.id,
    })
    this.startListening()
    this.init()
  }

  protected startListening() {
    this.store.on('mutated', ({ key, current, previous }) => {
      if (key === 'zIndex') {
        this.trigger('change:zIndex', {
          current: current as number,
          previous: previous == null ? undefined : (previous as number),
        })
      }
    })

    this.store.on('changed', () => {
      this.trigger('changed')
    })
  }

  protected init() {}

  isNode(): this is Node {
    return false
  }

  isEdge() {
    return false
  }

  // #region

  getPropByPath<T>(path: string | string[]) {
    return this.store.getByPath<T>(path)
  }

  setPropByPath(
    path: string | string[],
    value: any,
    options: Cell.SetPropByPathOptions = {},
  ) {
    this.store.setByPath(path, value, options)
  }

  removePropByPath(path: string | string[], options: Cell.SetOptions = {}) {
    const paths = Array.isArray(path) ? path : path.split('/')
    // Once a property is removed from the `attrs` the CellView will
    // recognize a `dirty` flag and re-render itself in order to remove
    // the attribute from SVGElement.
    if (paths[0] === 'attrs') {
      options.dirty = true
    }
    this.store.removeByPath(paths, options)
    return this
  }

  // #endregion

  // #region zIndex

  get zIndex() {
    return this.store.get<number>('zIndex') || 0
  }

  set zIndex(z: number) {
    this.setZIndex(z)
  }

  setZIndex(z: number, options: Cell.SetOptions = {}) {
    this.store.set('zIndex', z, options)
  }

  toFront() {}

  toBack() {}

  // #endregion

  // #region markup

  get markup() {
    return this.store.get<string>('markup')!
  }

  set markup(value: string) {
    this.setMarkup(value)
  }

  setMarkup(markup: string, options: Cell.SetOptions = {}) {
    this.store.set('markup', markup, options)
  }

  // #endregion

  // #region attrs

  get attrs() {
    const result = this.store.get<Attribute.CellAttributes>('attrs')
    return result ? JSONExt.deepCopy(result) : {}
  }

  set attrs(value: Attribute.CellAttributes) {
    this.setAttrs(value)
  }

  setAttrs(attrs: Attribute.CellAttributes, options: Cell.SetOptions = {}) {
    this.store.set('attrs', attrs, options)
  }

  getAttributeDefinition(attrName: string) {
    return Attribute.definitions[attrName] || null
  }

  getAttrByPath(): Attribute.CellAttributes
  getAttrByPath<T>(path: string | string[]): T
  getAttrByPath<T>(path?: string | string[]) {
    if (path == null || path === '') {
      return this.attrs
    }
    return this.getPropByPath<T>(this.prependAttrsPath(path))
  }

  setAttrByPath(
    path: string | string[],
    value: Attribute.ComplexAttributeValue,
    options: Cell.SetOptions = {},
  ) {
    this.setPropByPath(this.prependAttrsPath(path), value, options)
    return this
  }

  removeAttrByPath(path: string | string[], options: Cell.SetOptions = {}) {
    this.removePropByPath(this.prependAttrsPath(path), options)
    return this
  }

  protected prependAttrsPath(path: string | string[]) {
    return Array.isArray(path) ? ['attrs'].concat(path) : `attrs/${path}`
  }

  // #endregion

  // #region visible

  get visible() {
    return this.store.get<boolean>('visible') !== false
  }

  set visible(value: boolean) {
    this.setVisible(value)
  }

  setVisible(visible: boolean, options: Cell.SetOptions = {}) {
    this.store.set('visible', visible, options)
  }

  isVisible() {
    return this.visible
  }

  show(options: Cell.SetOptions = {}) {
    if (!this.visible) {
      this.setVisible(true, options)
    }
  }

  hide(options: Cell.SetOptions = {}) {
    if (this.visible) {
      this.setVisible(false, options)
    }
  }

  toggleVisible(options: Cell.SetOptions = {}) {
    if (this.visible) {
      this.hide(options)
    } else {
      this.show(options)
    }
  }

  // #endregion

  // #region parent children

  get parent() {
    return this._parent
  }

  get children() {
    return this._children ? [...this._children] : null
  }

  getParent() {
    return this.parent
  }

  getChildren() {
    return this.children
  }

  hasParent() {
    return this.parent != null
  }

  isParentOf(child: Cell | null): boolean {
    return child != null && child.getParent() === this
  }

  isChildOf(parent: Cell | null): boolean {
    return parent != null && this.getParent() === parent
  }

  eachChild(
    iterator: (child: Cell, index: number, children: Cell[]) => void,
    context?: any,
  ) {
    ArrayExt.forEach(this.children, iterator, context)
    return this
  }

  filterChild(
    filter: (cell: Cell, index: number, arr: Cell[]) => boolean,
    thisArg?: any,
  ): Cell[] {
    return ArrayExt.filter(this.children, filter, thisArg)
  }

  getChildCount() {
    return this.children == null ? 0 : this.children.length
  }

  getChildIndex(child: Cell) {
    return this.children == null ? -1 : this.children.indexOf(child)
  }

  getChildAt(index: number) {
    return this.children != null && index >= 0 ? this.children[index] : null
  }

  getAncestors(options: { deep?: boolean } = {}) {
    const ancestors = []
    let parent = this.getParent()
    while (parent) {
      ancestors.push(parent)
      parent = options.deep !== false ? parent.getParent() : null
    }
    return ancestors
  }

  getDescendants(
    options: {
      deep?: boolean
      breadthFirst?: boolean
    } = {},
  ): Cell[] {
    if (options.deep !== false) {
      // breadthFirst algorithm
      if (options.breadthFirst) {
        const cells = []
        const queue = this.getDescendants()

        while (queue.length > 0) {
          const parent = queue.shift()!
          cells.push(parent)
          queue.push(...parent.getDescendants())
        }
        return cells
      }

      // depthFirst algorithm
      {
        const cells = this.getDescendants()
        cells.forEach(cell => {
          cells.push(...cell.getDescendants(options))
        })
        return cells
      }
    }

    return this.getChildren() || []
  }

  isDescendantOf(
    ancestor: Cell | null,
    options: { deep?: boolean } = {},
  ): boolean {
    if (ancestor == null) {
      return false
    }

    if (options.deep !== false) {
      let current = this.getParent()
      while (current) {
        if (current === ancestor) {
          return true
        }
        current = current.getParent()
      }

      return false
    }

    return this.isChildOf(ancestor)
  }

  isAncestorOf(
    descendant: Cell | null,
    options: { deep?: boolean } = {},
  ): boolean {
    if (descendant == null) {
      return false
    }

    return descendant.isDescendantOf(this, options)
  }

  contains(cell: Cell | null) {
    return this.isAncestorOf(cell)
  }

  protected setParent(parent: Cell | null, options: Cell.SetOptions = {}) {
    this._parent = parent
    if (parent) {
      this.store.set('parent', parent.id, options)
    } else {
      this.store.remove('parent', options)
    }
  }

  protected setChildren(
    children: Cell[] | null,
    options: Cell.SetOptions = {},
  ) {
    this._children = children
    if (children != null) {
      this.store.set(
        'children',
        children.map(child => child.id),
        options,
      )
    } else {
      this.store.remove('children', options)
    }
  }

  insertTo(parent: Cell, index?: number, options: Cell.SetOptions = {}) {
    parent.insertChild(this, index, options)
  }

  insertChild(
    child: Cell | null,
    index?: number,
    options: Cell.SetOptions = {},
  ): this {
    if (child != null && child !== this) {
      let pos = index
      if (pos == null) {
        pos = this.getChildCount()
        if (child.getParent() === this) {
          pos -= 1
        }
      }

      const changed = this !== child.getParent()

      child.removeFromParent(options)
      this.setParent(this, options)

      let children = this.children
      if (children == null) {
        children = []
        children.push(child)
      } else {
        children.splice(pos, 0, child)
      }

      this.setChildren(children, options)

      if (changed) {
        // this.updateEdgeParents(child)
      }
    }

    return this
  }

  removeFromParent(options: Cell.SetOptions = {}) {
    if (this.parent != null) {
      const index = this.parent.getChildIndex(this)
      this.parent.removeChildAt(index, options)
    }
  }

  removeChild(child: Cell, options: Cell.SetOptions = {}) {
    const index = this.getChildIndex(child)
    return this.removeChildAt(index, options)
  }

  removeChildAt(index: number, options: Cell.SetOptions = {}) {
    const child = this.getChildAt(index)
    const children = this.children

    if (children != null && child != null) {
      children.splice(index, 1)
      child.setParent(null)
      this.setChildren(children)
    }

    return child
  }

  // #endregion

  toJSON() {}

  clone() {}

  addTo() {}

  findView() {}

  processPorts() {}

  getBBox(options: { deep?: boolean } = {}) {
    return new Rectangle(0, 0, 0, 0)
  }

  getChangeFlag(flags: { [attr: string]: number }) {
    let flag = 0

    if (!flags) {
      return flag
    }

    Object.keys(flags).forEach(attr => {
      if (this.store.hasChanged(attr)) {
        flag |= flags[attr]
      }
    })

    return flag
  }

  protected startBatch(name: string, data: KeyValue = {}) {
    if (this.model) {
      this.model.startBatch(name, { ...data, cell: this })
    }
  }

  protected stopBatch(name: string, data: KeyValue = {}) {
    if (this.model) {
      this.model.stopBatch(name, { ...data, cell: this })
    }
  }

  protected batchUpdate<T>(name: string, update: () => T, data?: KeyValue): T {
    this.startBatch(name, data)
    const result = update()
    this.stopBatch(name, data)
    return result
  }

  @Basecoat.dispose()
  dispose() {
    this.removeFromParent()
    this.store.dispose()
    this.trigger('disposed', { cell: this })
  }
}

export namespace Cell {
  export interface SetOptions extends Store.SetOptions {}

  export interface SetPropByPathOptions extends Store.SetByPathOptions {}

  export interface CreateCellOptions extends JSONObject {
    id?: string
    markup?: string
    attrs?: JSONObject
    visible?: boolean
    zIndex?: number
  }

  export interface StoreData extends CreateCellOptions {
    parent: string
    children: string[]
  }
}

export namespace Cell {
  export function getCellsBBox(
    cells: Cell[],
    options: { deep?: boolean } = {},
  ) {
    const bbox = new Rectangle(0, 0, 0, 0)
    cells.forEach(cell => {
      let rect = cell.getBBox(options)
      if (rect) {
        if (cell.isNode()) {
          const rotation = cell.rotation
          if (rotation != null) {
            rect = rect.bbox(rotation)
          }
        }
        bbox.union(rect)
      }
    })

    return bbox
  }
}

export namespace Cell {
  export const presets = {}
  export function config(presets?: JSONObject) {
    this.presets = {
      ...JSONExt.deepCopy(this.presets),
      ...JSONExt.deepCopy(presets),
    }
  }
}
