import { NonUndefined } from 'utility-types'
import { Basecoat } from '../../entity'
import { KeyValue, Size } from '../../types'
import { Rectangle, Point } from '../../geometry'
import { ArrayExt, StringExt, ObjectExt } from '../../util'
import { Attr } from '../attr'
import { Store } from './store'
import { Node } from './node'
import { Edge } from './edge'
import { Model } from './model'
import { Graph } from './graph'
import { Markup } from './markup'
import { PortData } from './port-data'
import { CellView } from './cell-view'
import { Transition } from './cell-transition'

export class Cell<
  Properties extends Cell.Properties = Cell.Properties
> extends Basecoat<Cell.EventArgs> {
  // #region static

  protected static defaults: Cell.Defaults = {}
  protected static attrDefinitions: Attr.Definitions = {}

  public static config<T extends Cell.Defaults = Cell.Defaults>(
    presets: T,
    attrDefinitions?: Attr.Definitions,
  ) {
    const { markup, ...others } = presets
    this.defaults = this.mergeDefaults(this.defaults, others)
    if (markup != null) {
      this.defaults.markup = markup
    }

    if (attrDefinitions) {
      this.attrDefinitions = { ...this.attrDefinitions, ...attrDefinitions }
    }
  }

  public static mergeDefaults<T extends Cell.Defaults = Cell.Defaults>(
    target: T,
    source?: T,
  ): T {
    const { view: targetView, ...targetBase } = target
    if (source == null) {
      const defaults = ObjectExt.cloneDeep(targetBase as T)
      if (targetView) {
        defaults.view = targetView
      }
      return defaults
    }

    const { view: sourceView, ...sourceBase } = source
    const defaults = ObjectExt.merge({} as T, targetBase as T, sourceBase as T)
    if (sourceView || targetView) {
      defaults.view = sourceView || targetView
    }
    return defaults
  }

  public static getDefaults<T extends Cell.Defaults = Cell.Defaults>(
    raw?: boolean,
  ): T {
    return (raw ? this.defaults : ObjectExt.cloneDeep(this.defaults)) as T
  }

  public static getAttrDefinition() {
    return this.attrDefinitions
  }

  // #endregion

  public readonly id: string
  protected readonly store: Store<Cell.Properties>
  protected readonly transition: Transition
  protected _model: Model | null // tslint:disable-line
  protected _parent: Cell | null // tslint:disable-line
  protected _children: Cell[] | null // tslint:disable-line
  protected incomings: Edge[] | null
  protected outgoings: Edge[] | null

  constructor(options: Cell.Options = {}) {
    super()
    const props = this.prepare(options)
    this.id = options.id || StringExt.uuid()
    this.store = new Store(props)
    this.transition = new Transition(this)
    this.setup()
    this.init()
  }

  protected prepare(options: Cell.Options): Properties {
    const id = options.id
    const ctor = this.constructor as typeof Cell
    const props = ctor.mergeDefaults<Properties>(
      ctor.getDefaults(true),
      options as Properties,
    )

    if (id == null) {
      props.id = StringExt.uuid()
    }

    return props
  }

  protected setup() {
    this.store.on('mutated', metadata => {
      const key = metadata.key

      this.notify('change:*', {
        key,
        cell: this,
        options: metadata.options,
        current: metadata.current,
        previous: metadata.previous,
      })

      if (key === 'zIndex') {
        this.notify('change:zIndex', this.getChangeEventArgs<number>(metadata))
      } else if (key === 'parent') {
        this.notify('change:parent', this.getChangeEventArgs<string>(metadata))
      } else if (key === 'children') {
        this.notify(
          'change:children',
          this.getChangeEventArgs<string[]>(metadata),
        )
      } else if (key === 'visible') {
        this.notify(
          'change:visible',
          this.getChangeEventArgs<boolean>(metadata),
        )
      } else if (key === 'markup') {
        this.notify('change:markup', this.getChangeEventArgs<Markup>(metadata))
      } else if (key === 'view') {
        this.notify(
          'change:view',
          this.getChangeEventArgs<Cell.ViewType>(metadata),
        )
      } else if (key === 'attrs') {
        this.notify(
          'change:attrs',
          this.getChangeEventArgs<Attr.CellAttrs>(metadata),
        )
      }
    })

    this.store.on('changed', ({ options }) =>
      this.notify('changed', { options, cell: this }),
    )
  }

  protected getChangeEventArgs<T>(
    metadata: Store.EventArgs<any>['mutated'],
  ): Cell.ChangeArgs<T> {
    const { current, previous, options } = metadata
    return {
      options,
      cell: this,
      current: current == null ? undefined : (current as T),
      previous: previous == null ? undefined : (previous as T),
    }
  }

  init() {}

  notify<Key extends keyof Cell.EventArgs>(
    name: Key,
    args: Cell.EventArgs[Key],
  ) {
    this.trigger(name, args)
    const model = this.model
    if (model) {
      model.notify(`cell:${name}` as any, args)
      if (this.isNode()) {
        model.notify(`node:${name}` as any, { ...args, node: this })
      } else if (this.isEdge()) {
        model.notify(`edge:${name}` as any, { ...args, edge: this })
      }
    }
  }

  protected setModel(model: Model | null) {
    if (this._model !== model) {
      this._model = model
      if (model) {
        model.addCell(this)
      }
    }
  }

  protected getModel() {
    return this._model
  }

  get model() {
    return this.getModel()
  }

  set model(model: Model | null) {
    this.setModel(model)
  }

  isNode(): this is Node {
    return false
  }

  isEdge(): this is Edge {
    return false
  }

  isSameStore(cell: Cell) {
    return this.store === cell.store
  }

  get view() {
    return this.store.get('view')
  }

  get type() {
    return this.store.get('type')
  }

  // #region get/set

  getProp(): Properties
  getProp<K extends keyof Properties>(key: K): Properties[K]
  getProp<K extends keyof Properties>(
    key: K,
    defaultValue: Properties[K],
  ): NonUndefined<Properties[K]>
  getProp<T>(key: string): T
  getProp<T>(key: string, defaultValue: T): T
  getProp(key?: string, defaultValue?: any) {
    if (key == null) {
      return this.store.get()
    }

    return this.store.get(key, defaultValue)
  }

  setProp<K extends keyof Properties>(
    key: K,
    value: Properties[K] | null | undefined | void,
    options?: Cell.SetOptions,
  ): this
  setProp(key: string, value: any, options?: Cell.SetOptions): this
  setProp(data: Partial<Properties>, options?: Cell.SetOptions): this
  setProp(
    key: string | Partial<Properties>,
    value?: any,
    options?: Cell.SetOptions,
  ) {
    if (typeof key === 'string') {
      this.store.set(key, value, options)
    } else {
      this.store.set(ObjectExt.merge(this.getProp(), key), value)
    }
    return this
  }

  removeProp<K extends keyof Properties>(
    key: K | K[],
    options?: Cell.SetOptions,
  ): this
  removeProp(key: string | string[], options?: Cell.SetOptions): this
  removeProp(options?: Cell.SetOptions): this
  removeProp(
    key?: string | string[] | Cell.SetOptions,
    options?: Cell.SetOptions,
  ) {
    this.store.remove(key as any, options)
    return this
  }

  hasChanged(): boolean
  hasChanged<K extends keyof Properties>(key: K | null): boolean
  hasChanged(key: string | null): boolean
  hasChanged(key?: string | null) {
    return key == null ? this.store.hasChanged() : this.store.hasChanged(key)
  }

  getPropByPath<T>(path: string | string[]) {
    return this.store.getByPath<T>(path)
  }

  setPropByPath(
    path: string | string[],
    value: any,
    options: Cell.SetByPathOptions = {},
  ) {
    this.store.setByPath(path, value, options)
    return this
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

  prop(): Properties
  prop<K extends keyof Properties>(key: K): Properties[K]
  prop<T>(key: string): T
  prop<T>(path: string[]): T
  prop<K extends keyof Properties>(
    key: K,
    value: Properties[K] | null | undefined | void,
    options?: Cell.SetOptions,
  ): this
  prop(key: string, value: any, options?: Cell.SetOptions): this
  prop(path: string[], value: any, options?: Cell.SetOptions): this
  prop(data: Partial<Properties>, options?: Cell.SetOptions): this
  prop(
    key?: string | string[] | Partial<Properties>,
    value?: any,
    options?: Cell.SetOptions,
  ) {
    if (key == null) {
      return this.getProp()
    }

    if (typeof key === 'string' || Array.isArray(key)) {
      if (arguments.length === 1) {
        return Array.isArray(key) ? this.getPropByPath(key) : this.getProp(key)
      }

      if (value == null) {
        return Array.isArray(key)
          ? this.removePropByPath(key)
          : this.removeProp(key, options || {})
      }
      return Array.isArray(key)
        ? this.setPropByPath(key, value, options || {})
        : this.setProp(key, value, options || {})
    }

    return this.setProp(key, value || {})
  }

  previous<K extends keyof Properties>(name: K): Properties[K] | undefined
  previous<T>(name: string): T | undefined
  previous(name: string) {
    return this.store.getPrevious(name as keyof Cell.Properties)
  }

  // #endregion

  // #region zIndex

  get zIndex() {
    return this.getZIndex()
  }

  set zIndex(z: number | undefined | null) {
    if (z == null) {
      this.removeZIndex()
    } else {
      this.setZIndex(z)
    }
  }

  getZIndex() {
    return this.store.get('zIndex')
  }

  setZIndex(z: number, options: Cell.SetOptions = {}) {
    this.store.set('zIndex', z, options)
    return this
  }

  removeZIndex(options: Cell.SetOptions = {}) {
    this.store.remove('zIndex', options)
    return this
  }

  toFront(options: Cell.ToFrontOptions = {}) {
    const model = this.model
    if (model) {
      let z = model.getMaxZIndex()
      let cells: Cell[]
      if (options.deep) {
        cells = this.getDescendants({ deep: true, breadthFirst: true })
        cells.unshift(this)
      } else {
        cells = [this]
      }

      z = z - cells.length + 1

      const count = model.total()
      let changed = model.indexOf(this) !== count - cells.length
      if (!changed) {
        changed = cells.some((cell, index) => cell.getZIndex() !== z + index)
      }

      if (changed) {
        this.executeBatch('to-front', () => {
          z = z + cells.length
          cells.forEach((cell, index) => {
            cell.setZIndex(z + index, options)
          })
        })
      }
    }

    return this
  }

  toBack(options: Cell.ToBackOptions = {}) {
    const model = this.model
    if (model) {
      let z = model.getMinZIndex()
      let cells: Cell[]

      if (options.deep) {
        cells = this.getDescendants({ deep: true, breadthFirst: true })
        cells.unshift(this)
      } else {
        cells = [this]
      }

      let changed = model.indexOf(this) !== 0
      if (!changed) {
        changed = cells.some((cell, index) => cell.getZIndex() !== z + index)
      }

      if (changed) {
        this.executeBatch('to-back', () => {
          z -= cells.length
          cells.forEach((cell, index) => {
            cell.setZIndex(z + index, options)
          })
        })
      }
    }

    return this
  }

  // #endregion

  // #region markup

  get markup() {
    return this.getMarkup()
  }

  set markup(value: Markup | undefined | null) {
    if (value == null) {
      this.removeMarkup()
    } else {
      this.setMarkup(value)
    }
  }

  getMarkup() {
    return this.store.get('markup', '')
  }

  setMarkup(markup: Markup, options: Cell.SetOptions = {}) {
    this.store.set('markup', markup, options)
    return this
  }

  removeMarkup(options: Cell.SetOptions = {}) {
    this.store.remove('markup', options)
    return this
  }

  // #endregion

  // #region attrs

  get attrs() {
    return this.getAttrs()
  }

  set attrs(value: Attr.CellAttrs | null | undefined) {
    if (value == null) {
      this.removeAttrs()
    } else {
      this.setAttrs(value)
    }
  }

  getAttrs() {
    const result = this.store.get('attrs') as Attr.CellAttrs
    return result ? { ...result } : {}
  }

  setAttrs(attrs: Attr.CellAttrs, options: Cell.SetAttrOptions = {}) {
    const attributes = options.overwrite
      ? attrs
      : ObjectExt.merge({}, this.getAttrs(), attrs)
    this.store.set('attrs', attributes, options)
    return this
  }

  removeAttrs(options: Cell.SetOptions = {}) {
    this.store.remove('attrs', options)
    return this
  }

  getAttrDefinition(attrName: string) {
    const ctor = this.constructor as typeof Cell
    const definitions = ctor.getAttrDefinition() || {}
    let def = definitions[attrName] || Attr.definitions[attrName]
    if (!def) {
      const name = StringExt.camelCase(attrName)
      def = definitions[name] || Attr.definitions[name]
    }

    return def || null
  }

  getAttrByPath(): Attr.CellAttrs
  getAttrByPath<T>(path: string | string[]): T
  getAttrByPath<T>(path?: string | string[]) {
    if (path == null || path === '') {
      return this.getAttrs()
    }
    return this.getPropByPath<T>(this.prefixAttrPath(path))
  }

  setAttrByPath(
    path: string | string[],
    value: Attr.ComplexAttrValue,
    options: Cell.SetOptions = {},
  ) {
    this.setPropByPath(this.prefixAttrPath(path), value, options)
    return this
  }

  removeAttrByPath(path: string | string[], options: Cell.SetOptions = {}) {
    this.removePropByPath(this.prefixAttrPath(path), options)
    return this
  }

  protected prefixAttrPath(path: string | string[]) {
    return Array.isArray(path) ? ['attrs'].concat(path) : `attrs/${path}`
  }

  attr(): Attr.CellAttrs
  attr<T>(path: string | string[]): T
  attr(
    path: string | string[],
    value: Attr.ComplexAttrValue | null,
    options?: Cell.SetOptions,
  ): this
  attr(attrs: Attr.CellAttrs, options?: Cell.SetOptions): this
  attr(
    path?: string | string[] | Attr.CellAttrs,
    value?: Attr.ComplexAttrValue | Cell.SetOptions,
    options?: Cell.SetOptions,
  ) {
    if (path == null) {
      return this.getAttrByPath()
    }

    if (typeof path === 'string' || Array.isArray(path)) {
      if (arguments.length === 1) {
        return this.getAttrByPath(path)
      }
      if (value == null) {
        return this.removeAttrByPath(path, options || {})
      }
      return this.setAttrByPath(
        path,
        value as Attr.ComplexAttrValue,
        options || {},
      )
    }

    return this.setAttrs(path, (value || {}) as Cell.SetOptions)
  }

  // #endregion

  // #region visible

  get visible() {
    return this.isVisible()
  }

  set visible(value: boolean) {
    this.setVisible(value)
  }

  setVisible(visible: boolean, options: Cell.SetOptions = {}) {
    this.store.set('visible', visible, options)
  }

  isVisible() {
    return this.store.get('visible') !== false
  }

  show(options: Cell.SetOptions = {}) {
    if (!this.isVisible()) {
      this.setVisible(true, options)
    }
  }

  hide(options: Cell.SetOptions = {}) {
    if (this.isVisible()) {
      this.setVisible(false, options)
    }
  }

  toggleVisible(options: Cell.SetOptions = {}) {
    if (this.isVisible()) {
      this.hide(options)
    } else {
      this.show(options)
    }
  }

  // #endregion

  // #region parent children

  get parent() {
    return this.getParent()
  }

  get children() {
    return this.getChildren()
  }

  getParent() {
    let parent = this._parent
    if (parent == null) {
      const parentId = this.getParentId()
      if (parentId != null && this.model) {
        parent = this.model.getCell(parentId)
        this._parent = parent
      }
    }
    return parent
  }

  getParentId() {
    return this.store.get('parent')
  }

  getChildren() {
    let children = this._children
    if (children == null) {
      const childrenIds = this.store.get('children')
      if (childrenIds && childrenIds.length && this.model) {
        children = childrenIds
          .map(id => this.model?.getCell(id))
          .filter(cell => cell != null) as Cell[]
        this._children = children
      }
    }
    return children ? [...children] : null
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

  getDescendants(options: Cell.GetDescendantsOptions = {}): Cell[] {
    if (options.deep !== false) {
      // breadth first
      if (options.breadthFirst) {
        const cells = []
        const queue = this.getChildren() || []

        while (queue.length > 0) {
          const parent = queue.shift()!
          const children = parent.getChildren()
          cells.push(parent)
          if (children) {
            queue.push(...children)
          }
        }
        return cells
      }

      // depth first
      {
        const cells = this.getChildren() || []
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

  getCommonAncestor(...cells: (Cell | null | undefined)[]): Cell | null {
    return Cell.getCommonAncestor(this, ...cells)
  }

  setParent(parent: Cell | null, options: Cell.SetOptions = {}) {
    this._parent = parent
    if (parent) {
      this.store.set('parent', parent.id, options)
    } else {
      this.store.remove('parent', options)
    }
  }

  setChildren(children: Cell[] | null, options: Cell.SetOptions = {}) {
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

  unembed(child: Cell, options: Cell.SetOptions = {}) {
    const children = this.children
    if (children != null && child != null) {
      const index = this.getChildIndex(child)
      children.splice(index, 1)
      child.setParent(null, options)
      this.setChildren(children, options)
    }
    return this
  }

  embed(child: Cell, options: Cell.SetOptions = {}) {
    child.addTo(this, options)
    return this
  }

  addTo(model: Model, options?: Cell.SetOptions): this
  // addTo(graph: Graph, options: Cell.SetOptions): this
  addTo(parent: Cell, options?: Cell.SetOptions): this
  addTo(target: Model | Cell, options: Cell.SetOptions = {}) {
    if (target instanceof Model) {
      target.addCell(this, options)
    }
    // else if (target instanceof Graph) {
    //   target.model.addCell(this, options)
    // }
    else if (target instanceof Cell) {
      target.addChild(this, options)
    }
    return this
  }

  insertTo(parent: Cell, index?: number, options: Cell.SetOptions = {}) {
    parent.insertChild(this, index, options)
  }

  addChild(child: Cell | null, options: Cell.SetOptions = {}) {
    return this.insertChild(child, undefined, options)
  }

  insertChild(
    child: Cell | null,
    index?: number,
    options: Cell.SetOptions = {},
  ): this {
    if (child != null && child !== this) {
      const oldParent = child.getParent()
      const changed = this !== oldParent

      let pos = index
      if (pos == null) {
        pos = this.getChildCount()
        if (!changed) {
          pos -= 1
        }
      }

      // remove from old parent
      if (oldParent) {
        const children = oldParent.getChildren()
        if (children) {
          const index = children.indexOf(child)
          if (index >= 0) {
            child.setParent(null, options)
            children.splice(index, 1)
            oldParent.setChildren(children, options)
          }
        }
      }

      let children = this.children
      if (children == null) {
        children = []
        children.push(child)
      } else {
        children.splice(pos, 0, child)
      }

      child.setParent(this, options)
      this.setChildren(children, options)

      if (changed) {
        if (this.incomings) {
          this.incomings.forEach(edge => edge.updateParent(options))
        }
        if (this.outgoings) {
          this.outgoings.forEach(edge => edge.updateParent(options))
        }
      }

      if (this.model) {
        this.model.addCell(child, options)
      }
    }

    return this
  }

  removeFromParent(options: Cell.RemoveOptions = {}) {
    const parent = this.getParent()
    if (parent != null) {
      const index = parent.getChildIndex(this)
      parent.removeChildAt(index, options)
    }
  }

  removeChild(child: Cell, options: Cell.RemoveOptions = {}) {
    const index = this.getChildIndex(child)
    return this.removeChildAt(index, options)
  }

  removeChildAt(index: number, options: Cell.RemoveOptions = {}) {
    const child = this.getChildAt(index)
    const children = this.children

    if (children != null && child != null) {
      this.unembed(child, options)
      child.remove(options)
    }

    return child
  }

  remove(options: Cell.RemoveOptions = {}) {
    const parent = this.getParent()
    if (parent) {
      parent.removeChild(this, options)
    } else {
      this.executeBatch('remove', () => {
        if (options.deep !== false) {
          this.eachChild(child => child.remove(options))
        }
        if (this.model) {
          this.model.removeCell(this, { ...options, dryrun: true })
        }
        this.notify('removed', { options, cell: this })
      })
    }
  }

  // #endregion

  // #region transition

  startTransition<T extends string | number | KeyValue<number>>(
    path: string | string[],
    target: T,
    options: Transition.Options = {},
    delim: string = '/',
  ) {
    this.transition.start(path, target, options, delim)
    return this
  }

  stopTransition(path: string | string[], delim: string = '/') {
    this.transition.stop(path, delim)
    return this
  }

  getTransitions() {
    return this.transition.get()
  }

  // #endregion

  // #region transform

  translate(tx: number, ty: number, options: Cell.TranslateOptions) {
    return this
  }

  scale(
    sx: number,
    sy: number,
    origin?: Point | Point.PointLike,
    options?: Node.SetOptions,
  ) {
    return this
  }

  // #endregion

  // #region common

  getBBox(options?: { deep?: boolean }) {
    return new Rectangle()
  }

  getConnectionPoint(edge: Edge, type: Edge.TerminalType) {
    return new Point()
  }

  toJSON(): this extends Node
    ? Node.Properties
    : this extends Edge
    ? Edge.Properties
    : Properties {
    const ctor = this.constructor as typeof Cell
    const defaults = ctor.getDefaults(true)
    const data = this.store.get()
    const attrs = data.attrs || {}
    const defaultAttrs = defaults.attrs || {}
    const finalAttrs: Attr.CellAttrs = {}

    Object.keys(attrs).forEach(key => {
      const attr = attrs[key]
      const defaultAttr = defaultAttrs[key]

      Object.keys(attr).forEach(name => {
        const value = attr[name] as KeyValue
        const defaultValue = defaultAttr ? defaultAttr[name] : null

        if (typeof value === 'object' && !Array.isArray(value)) {
          Object.keys(value).forEach(subName => {
            const subValue = value[subName]
            if (
              defaultAttr == null ||
              defaultValue == null ||
              !ObjectExt.isObject(defaultValue) ||
              !ObjectExt.isEqual(defaultValue[subName], subValue)
            ) {
              if (finalAttrs[key] == null) {
                finalAttrs[key] = {}
              }
              if (finalAttrs[key][name] == null) {
                finalAttrs[key][name] = {}
              }
              const tmp = finalAttrs[key][name] as KeyValue
              tmp[subName] = subValue
            }
          })
        } else if (
          defaultAttr == null ||
          !ObjectExt.isEqual(defaultValue, value)
        ) {
          // `value` is not an object, default attribute with `key` does not
          // exist or it is different than the attribute value set on the cell.
          if (finalAttrs[key] == null) {
            finalAttrs[key] = {}
          }
          finalAttrs[key][name] = value as any
        }
      })
    })

    return ObjectExt.cloneDeep({
      ...data,
      attrs: finalAttrs,
    }) as any
  }

  clone(
    options: Cell.CloneOptions = {},
  ): this extends Node ? Node : this extends Edge ? Edge : Cell {
    if (!options.deep) {
      const data = this.store.get()
      delete data.id
      delete data.parent
      delete data.children
      const ctor = this.constructor as typeof Cell
      return new ctor(data) as any
    }

    // Deep cloning. Clone the cell itself and all its children.
    const map = Cell.deepClone(this)
    return map[this.id] as any
  }

  findView(graph: Graph): CellView | null {
    return graph.findViewByCell(this)
  }

  // #endregion

  // #region batch

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

  protected executeBatch<T>(
    name: string,
    execute: () => T,
    data?: KeyValue,
  ): T {
    this.startBatch(name, data)
    const result = execute()
    this.stopBatch(name, data)
    return result
  }

  // #endregion

  // #region IDisposable

  @Basecoat.dispose()
  dispose() {
    this.removeFromParent()
    this.store.dispose()
    this.notify('disposed', { cell: this })
  }

  // #endregion
}

export namespace Cell {
  export type ViewType = string | typeof CellView

  export interface Common {
    view?: ViewType
    type?: string
    markup?: Markup
    attrs?: Attr.CellAttrs
    zIndex?: number
    visible?: boolean
  }

  export interface Defaults extends Common {}
  export interface Options extends Common {
    id?: string
  }

  export interface Properties extends Defaults, Options {
    parent?: string
    children?: string[]
  }
}

export namespace Cell {
  export interface SetOptions extends Store.SetOptions {}

  export interface MutateOptions extends Store.MutateOptions {}

  export interface RemoveOptions extends SetOptions {
    deep?: boolean
  }

  export interface SetAttrOptions extends SetOptions {
    overwrite?: boolean
  }

  export interface SetByPathOptions extends Store.SetByPathOptions {}

  export interface ToFrontOptions extends SetOptions {
    deep?: boolean
  }

  export interface ToBackOptions extends ToFrontOptions {}

  export interface TranslateOptions extends SetOptions {
    tx?: number
    ty?: number
    translateBy?: string | number
  }

  export interface GetDescendantsOptions {
    deep?: boolean
    breadthFirst?: boolean
  }

  export interface CloneOptions {
    deep?: boolean
  }
}

export namespace Cell {
  interface ChangeAnyKeyArgs<T extends keyof Properties = keyof Properties> {
    key: T
    current: Properties[T]
    previous: Properties[T]
    options: MutateOptions
    cell: Cell
  }

  export interface EventArgs {
    'transition:begin': TransitionArgs
    'transition:end': TransitionArgs
    // common
    'change:*': ChangeAnyKeyArgs
    'change:attrs': ChangeArgs<Attr.CellAttrs>
    'change:zIndex': ChangeArgs<number>
    'change:markup': ChangeArgs<Markup>
    'change:visible': ChangeArgs<boolean>
    'change:parent': ChangeArgs<string>
    'change:children': ChangeArgs<string[]>
    'change:view': ChangeArgs<ViewType>

    // node
    'change:size': ChangeArgs<Size>
    'change:position': ChangeArgs<Point.PointLike>
    'change:rotation': ChangeArgs<number>
    'change:ports': ChangeArgs<PortData.Port[]>
    'change:portMarkup': ChangeArgs<Markup>
    'change:portLabelMarkup': ChangeArgs<Markup>
    'change:portContainerMarkup': ChangeArgs<Markup>
    'ports:removed': {
      cell: Cell
      node: Node
      removed: PortData.Port[]
    }
    'ports:added': {
      cell: Cell
      node: Node
      added: PortData.Port[]
    }

    // edge
    'change:source': ChangeArgs<Edge.TerminalData>
    'change:target': ChangeArgs<Edge.TerminalData>
    'change:router': ChangeArgs<Edge.RouterData>
    'change:connector': ChangeArgs<Edge.ConnectorData>
    'change:vertices': ChangeArgs<Point.PointLike[]>
    'change:labels': ChangeArgs<Edge.Label[]>
    'change:defaultLabel': ChangeArgs<Edge.Label>
    'change:labelMarkup': ChangeArgs<Markup>
    'change:toolMarkup': ChangeArgs<Markup>
    'change:doubleToolMarkup': ChangeArgs<Markup>
    'change:vertexMarkup': ChangeArgs<Markup>
    'change:arrowheadMarkup': ChangeArgs<Markup>
    'vertexs:added': {
      cell: Cell
      edge: Edge
      added: Point.PointLike[]
    }
    'vertexs:removed': {
      cell: Cell
      edge: Edge
      removed: Point.PointLike[]
    }
    'labels:added': {
      cell: Cell
      edge: Edge
      added: Edge.Label[]
    }
    'labels:removed': {
      cell: Cell
      edge: Edge
      removed: Edge.Label[]
    }

    changed: {
      cell: Cell
      options: MutateOptions
    }

    removed: {
      cell: Cell
      options: Cell.SetOptions
    }

    disposed: {
      cell: Cell
    }
  }

  export interface ChangeArgs<T> {
    cell: Cell
    current?: T
    previous?: T
    options: MutateOptions
  }

  export interface TransitionArgs {
    cell: Cell
    path: string
  }
}

export namespace Cell {
  export function getCommonAncestor(
    ...cells: (Cell | null | undefined)[]
  ): Cell | null {
    const ancestors = cells
      .filter(cell => cell != null)
      .map(cell => cell!.getAncestors())
      .sort((a, b) => {
        return a.length - b.length
      })

    const first = ancestors.shift()!
    return (
      first.find(cell => ancestors.every(item => item.includes(cell))) || null
    )
  }

  export interface GetCellsBBoxOptions {
    deep?: boolean
  }

  export function getCellsBBox(
    cells: Cell[],
    options: GetCellsBBoxOptions = {},
  ) {
    let bbox: Rectangle | null = null

    for (let i = 0, ii = cells.length; i < ii; i += 1) {
      const cell = cells[i]
      let rect = cell.getBBox(options)
      if (rect) {
        if (cell.isNode()) {
          const angle = cell.rotation
          if (angle != null && angle !== 0) {
            rect = rect.bbox(angle)
          }
        }
        bbox = bbox == null ? rect : bbox.union(rect)
      }
    }

    return bbox
  }

  export function deepClone(cell: Cell) {
    const cells = [cell, ...cell.getDescendants({ deep: true })]
    return Cell.cloneCells(cells)
  }

  export function cloneCells(cells: Cell[]) {
    const inputs = ArrayExt.uniq(cells)
    const cloneMap = inputs.reduce<KeyValue<Cell>>((map, cell) => {
      map[cell.id] = cell.clone()
      return map
    }, {})

    inputs.forEach(cell => {
      const clone = cloneMap[cell.id]
      if (clone.isEdge()) {
        const sourceId = clone.getSourceCellId()
        const targetId = clone.getTargetCellId()
        if (sourceId && cloneMap[sourceId]) {
          // Source is a node and the node is among the clones.
          // Then update the source of the cloned edge.
          clone.setSource({
            ...clone.getSource(),
            cellId: cloneMap[sourceId].id,
          })
        }
        if (targetId && cloneMap[targetId]) {
          // Target is a node and the node is among the clones.
          // Then update the target of the cloned edge.
          clone.setTarget({
            ...clone.getTarget(),
            cellId: cloneMap[targetId].id,
          })
        }
      }

      // Find the parent of the original cell
      const parent = cell.getParent()
      if (parent && cloneMap[parent.id]) {
        clone.setParent(cloneMap[parent.id])
      }

      // Find the children of the original cell
      const children = cell.getChildren()
      if (children && children.length) {
        const embeds = children.reduce<Cell[]>((memo, child) => {
          // Embedded cells that are not being cloned can not be carried
          // over with other embedded cells.
          if (cloneMap[child.id]) {
            memo.push(cloneMap[child.id])
          }
          return memo
        }, [])

        if (embeds.length > 0) {
          clone.setChildren(embeds)
        }
      }
    })

    return cloneMap
  }
}

export namespace Cell {
  export type Defintion = typeof Cell

  export interface DefintionOptions extends Defaults, KeyValue {
    /**
     * The class name.
     */
    name?: string
    attrDefinitions?: Attr.Definitions
  }
}
