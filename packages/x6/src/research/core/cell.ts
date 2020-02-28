/* tslint:disable:variable-name */
import { ArrayExt, StringExt, ObjectExt } from '../../util'
import { KeyValue } from '../../types'
import { Basecoat } from '../../entity'
import { Rectangle } from '../../geometry'
import { Store } from './store'
import { Model } from './model'
import { Node } from './node'
import { View } from './view'
import { Attr } from '../attr'

export class Cell<D extends Cell.Data = Cell.Data> extends Basecoat {
  // #region static

  protected static defaults: Cell.Defaults = {}

  public static mergeDefaults<T extends Cell.Defaults = Cell.Defaults>(
    target: T,
    source?: T,
  ): T {
    if (source == null) {
      return ObjectExt.cloneDeep(target)
    }
    return ObjectExt.merge({}, target, source)
  }

  public static setDefaults<T extends Cell.Defaults = Cell.Defaults>(
    presets: T,
  ) {
    this.defaults = this.mergeDefaults(this.defaults, presets)
  }

  public static getDefaults<T extends Cell.Defaults = Cell.Defaults>(
    raw: boolean = false,
  ): T {
    return (raw ? this.defaults : this.mergeDefaults(this.defaults)) as T
  }

  // #endregion

  public readonly id: string
  public readonly store: Store<D>

  public model: Model | null
  protected _parent: Cell | null
  protected _children: Cell[] | null

  constructor(options: Cell.Options = {}) {
    super()
    this.id = options.id || StringExt.uuid()
    const data = this.getDefaults(options) as Partial<D>
    this.store = new Store<D>(data)
    this.startListening()
    this.init()
  }

  protected init() {}

  protected getDefaults(options: Cell.Options): Cell.Defaults {
    const ctor = this.constructor as typeof Cell
    return ctor.mergeDefaults(ctor.getDefaults(true), options)
  }

  protected startListening() {
    this.store.on('mutated', ({ key, current, previous }) => {
      if (key === 'zIndex') {
        this.trigger(
          'change:zIndex',
          this.getChangeArgs<number>(current, previous),
        )
      }
    })

    this.store.on('changed', ({ options }) =>
      this.trigger('changed', { options, cell: this }),
    )
  }

  protected getChangeArgs<T>(
    current: any,
    previous: any,
  ): { cell: Cell; current: T; previous?: T } {
    return {
      cell: this,
      current: current as T,
      previous: previous == null ? undefined : (previous as T),
    }
  }

  isNode(): this is Node {
    return false
  }

  isEdge() {
    return false
  }

  // #region

  getByPath<T>(path: string | string[]) {
    return this.store.getByPath<T>(path)
  }

  setByPath(
    path: string | string[],
    value: any,
    options: Cell.SetByPathOptions = {},
  ) {
    this.store.setByPath(path, value, options)
  }

  removeByPath(path: string | string[], options: Cell.SetOptions = {}) {
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
    return this.store.get('zIndex', 0)
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
    return this.store.get('markup', '')
  }

  set markup(value: View.Markup) {
    this.setMarkup(value)
  }

  setMarkup(markup: View.Markup, options: Cell.SetOptions = {}) {
    this.store.set('markup', markup, options)
  }

  // #endregion

  // #region attrs

  get attrs() {
    const result = this.store.get('attrs') as Attr.CellAttrs
    return result ? ObjectExt.cloneDeep(result) : {}
  }

  set attrs(value: Attr.CellAttrs) {
    this.setAttrs(value)
  }

  setAttrs(attrs: Attr.CellAttrs, options: Cell.SetOptions = {}) {
    this.store.set('attrs', attrs, options)
  }

  getAttrDefinition(attrName: string) {
    return Attr.definitions[attrName] || null
  }

  getAttrByPath(): Attr.CellAttrs
  getAttrByPath<T>(path: string | string[]): T
  getAttrByPath<T>(path?: string | string[]) {
    if (path == null || path === '') {
      return this.attrs
    }
    return this.getByPath<T>(this.prepareAttrPath(path))
  }

  setAttrByPath(
    path: string | string[],
    value: Attr.ComplexAttrValue,
    options: Cell.SetOptions = {},
  ) {
    this.setByPath(this.prepareAttrPath(path), value, options)
    return this
  }

  removeAttrByPath(path: string | string[], options: Cell.SetOptions = {}) {
    this.removeByPath(this.prepareAttrPath(path), options)
    return this
  }

  protected prepareAttrPath(path: string | string[]) {
    return Array.isArray(path) ? ['attrs'].concat(path) : `attrs/${path}`
  }

  // #endregion

  // #region visible

  get visible() {
    return this.store.get('visible') !== false
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
  export interface Common {
    attrs?: Attr.CellAttrs
    visible?: boolean
    zIndex?: number
  }

  export interface Defaults extends Common {
    markup?: View.Markup
  }

  export interface Options extends Common {
    id?: string
  }

  export interface Data extends Defaults, Options {
    parent?: string
    children?: string[]
  }
}

export namespace Cell {
  export interface SetOptions extends Store.SetOptions {}
  export interface SetByPathOptions extends Store.SetByPathOptions {}
}

// export namespace Cell {
//   interface CommonArgs {
//     cell: Cell
//   }

//   type ChangeAttrArgs<T> = Assign<
//     {
//       current: T
//       previous?: T
//     },
//     CommonArgs
//   >

//   export interface EventArgs {
//     'change:zIndex': ChangeAttrArgs<number>
//     changed: CommonArgs
//     disposed: CommonArgs
//   }
// }

export namespace Cell {
  export function getCellsBBox(
    cells: Cell[],
    options: { deep?: boolean } = {},
  ) {
    const bbox = new Rectangle()

    cells.forEach(cell => {
      let rect = cell.getBBox(options)
      if (rect) {
        if (cell.isNode()) {
          const angle = cell.rotation
          if (angle != null) {
            rect = rect.bbox(angle)
          }
        }
        bbox.union(rect)
      }
    })

    return bbox
  }
}
