/* eslint-disable no-underscore-dangle */
/** biome-ignore-all lint/complexity/noThisInStatic: <存量的问题biome修了运行的实际效果就变了，所以先忽略> */
import type { NonUndefined } from 'utility-types'
import {
  Animation as Animation2,
  type EffectTiming,
  KeyframeEffect,
} from '../animation'
import {
  ArrayExt,
  Basecoat,
  disposable,
  FunctionExt,
  type KeyValue,
  ObjectExt,
  type Size,
  StringExt,
} from '../common'
import { Point, Rectangle, PointLike } from '../geometry'
import type { Graph } from '../graph'
import {
  type AttrDefinitions,
  attrRegistry,
  type CellAttrs,
  type ComplexAttrValue,
} from '../registry'
import type { CellView } from '../view'
import type { MarkupType } from '../view/markup'
import {
  Animation,
  type AnimationCallbackArgs,
  type AnimationProgressArgs,
  type AnimationStartOptions,
  type AnimationStopArgs,
  type AnimationStopOptions,
  type AnimationTargetValue,
} from './animation'
import type {
  ConnectorData,
  Edge,
  EdgeLabel,
  EdgeProperties,
  RouterData,
  TerminalData,
  TerminalType,
} from './edge'
import type { Model, BatchName } from './model'
import type { Node, NodeProperties, NodeSetOptions } from './node'
import type { Port } from './port'
import { Store } from './store'
import type {
  StoreMutateOptions,
  StoreSetByPathOptions,
  StoreSetOptions,
} from './store'

export class Cell<
  Properties extends CellProperties = CellProperties,
> extends Basecoat<TransitionEventArgs> {
  static toStringTag = `X6.cell`
  static isCell(instance: any): instance is Cell {
    if (instance == null) {
      return false
    }

    if (instance instanceof Cell) {
      return true
    }

    const tag = instance[Symbol.toStringTag]
    const cell = instance as Cell

    if (
      (tag == null || tag === Cell.toStringTag) &&
      typeof cell.isNode === 'function' &&
      typeof cell.isEdge === 'function' &&
      typeof cell.prop === 'function' &&
      typeof cell.attr === 'function'
    ) {
      return true
    }

    return false
  }
  static normalizeTools(raw: ToolsLoose): Tools {
    if (typeof raw === 'string') {
      return { items: [raw] }
    }

    if (Array.isArray(raw)) {
      return { items: raw }
    }

    if ((raw as Tools).items) {
      return raw as Tools
    }

    if (Reflect.has(raw, 'local')) {
      const { local, ...resetItem } = raw as Tools
      return {
        local,
        items: [resetItem as ToolItem],
      }
    }

    return {
      items: [raw as ToolItem],
    }
  }
  static getCommonAncestor(...cells: (Cell | null | undefined)[]): Cell | null {
    const ancestors = cells
      .filter((cell) => cell != null)
      .map((cell) => cell!.getAncestors())
      .sort((a, b) => {
        return a.length - b.length
      })

    const first = ancestors.shift()!
    return (
      first.find((cell) => ancestors.every((item) => item.includes(cell))) ||
      null
    )
  }
  static getCellsBBox(cells: Cell[], options: CellGetCellsBBoxOptions = {}) {
    let bbox: Rectangle | null = null

    for (let i = 0, ii = cells.length; i < ii; i += 1) {
      const cell = cells[i]
      let rect = cell.getBBox(options)
      if (rect) {
        if (cell.isNode()) {
          const angle = cell.getAngle()
          if (angle != null && angle !== 0) {
            rect = rect.bbox(angle)
          }
        }
        bbox = bbox == null ? rect : bbox.union(rect)
      }
    }

    return bbox
  }

  static deepClone(cell: Cell) {
    const cells = [cell, ...cell.getDescendants({ deep: true })]
    return Cell.cloneCells(cells)
  }

  static cloneCells(cells: Cell[]) {
    const inputs = ArrayExt.uniq(cells)
    const cloneMap = inputs.reduce<KeyValue<Cell>>(
      (map: KeyValue<Cell>, cell: Cell) => {
        map[cell.id] = cell.clone()
        return map
      },
      {},
    )

    inputs.forEach((cell: Cell) => {
      const clone = cloneMap[cell.id]
      if (clone.isEdge()) {
        const sourceId = clone.getSourceCellId()
        const targetId = clone.getTargetCellId()
        if (sourceId && cloneMap[sourceId]) {
          // Source is a node and the node is among the clones.
          // Then update the source of the cloned edge.
          clone.setSource({
            ...clone.getSource(),
            cell: cloneMap[sourceId].id,
          })
        }
        if (targetId && cloneMap[targetId]) {
          // Target is a node and the node is among the clones.
          // Then update the target of the cloned edge.
          clone.setTarget({
            ...clone.getTarget(),
            cell: cloneMap[targetId].id,
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
        const embeds = children.reduce<Cell[]>((memo: Cell[], child: Cell) => {
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
  // #region static

  protected static markup: MarkupType
  protected static defaults: CellDefaults = {}
  protected static attrHooks: AttrDefinitions = {}
  protected static propHooks: CellPropHook[] = []

  public static config<C extends CellConfig = CellConfig>(presets: C) {
    const { markup, propHooks, attrHooks, ...others } = presets

    if (markup != null) {
      this.markup = markup
    }

    if (propHooks) {
      this.propHooks = this.propHooks.slice()
      if (Array.isArray(propHooks)) {
        this.propHooks.push(...propHooks)
      } else if (typeof propHooks === 'function') {
        this.propHooks.push(propHooks)
      } else {
        Object.values(propHooks).forEach((hook) => {
          if (typeof hook === 'function') {
            this.propHooks.push(hook)
          }
        })
      }
    }

    if (attrHooks) {
      this.attrHooks = { ...this.attrHooks, ...attrHooks }
    }

    this.defaults = ObjectExt.merge({}, this.defaults, others)
  }

  public static getMarkup() {
    return this.markup
  }

  public static getDefaults<T extends CellDefaults = CellDefaults>(
    raw?: boolean,
  ): T {
    return (raw ? this.defaults : ObjectExt.cloneDeep(this.defaults)) as T
  }

  public static getAttrHooks() {
    return this.attrHooks
  }

  public static applyPropHooks(
    cell: Cell,
    metadata: CellMetadata,
  ): CellMetadata {
    return this.propHooks.reduce((memo, hook) => {
      return hook ? FunctionExt.call(hook, cell, memo) : memo
    }, metadata)
  }

  // eslint-disable-next-line
  public static generateId(metadata: CellMetadata = {}) {
    return StringExt.uuid()
  }

  // #endregion

  protected get [Symbol.toStringTag]() {
    return Cell.toStringTag
  }

  public readonly id: string
  protected readonly store: Store<CellProperties>
  protected readonly animation: Animation
  protected _model: Model | null // eslint-disable-line
  protected _parent: Cell | null // eslint-disable-line
  protected _children: Cell[] | null // eslint-disable-line

  constructor(metadata: CellMetadata = {}) {
    super()

    const ctor = this.constructor as typeof Cell
    const defaults = ctor.getDefaults(true)
    const props = ObjectExt.merge(
      {},
      this.preprocess(defaults),
      this.preprocess(metadata),
    )

    this.id = props.id || Cell.generateId(metadata)
    this.store = new Store(props)
    this.animation = new Animation(this)
    this.setup()
    this.init()
    this.postprocess(metadata)
  }

  init() {}

  // #region model

  get model() {
    return this._model
  }

  set model(model: Model | null) {
    if (this._model !== model) {
      this._model = model
    }
  }

  // #endregion

  protected preprocess(
    metadata: CellMetadata,
    ignoreIdCheck?: boolean,
  ): Properties {
    const id = metadata.id
    const ctor = this.constructor as typeof Cell
    const props = ctor.applyPropHooks(this, metadata)

    if (id == null && ignoreIdCheck !== true) {
      props.id = Cell.generateId(metadata)
    }

    return props as Properties
  }

  protected postprocess(metadata: CellMetadata) {} // eslint-disable-line

  protected setup() {
    this.store.on('change:*', (metadata) => {
      const { key, current, previous, options } = metadata

      this.notify('change:*', {
        key,
        options,
        current,
        previous,
        cell: this,
      })

      this.notify(`change:${key}` as keyof TransitionEventArgs, {
        options,
        current,
        previous,
        cell: this,
      })

      const type = key as TerminalType
      if (type === 'source' || type === 'target') {
        this.notify(`change:terminal`, {
          type,
          current,
          previous,
          options,
          cell: this,
        })
      }
    })

    this.store.on('changed', ({ options }) =>
      this.notify('changed', { options, cell: this }),
    )

    this.on('added', ({ cell }) => {
      const transition = this.store.get('transition')
      if (!ObjectExt.isEmpty(transition)) {
        transition.forEach((t) => {
          cell.transition(...t)
        })
      }
    })
  }

  notify<Key extends keyof TransitionEventArgs>(
    name: Key,
    args: TransitionEventArgs[Key],
  ): this
  notify(name: Exclude<string, keyof TransitionEventArgs>, args: any): this
  notify<Key extends keyof TransitionEventArgs>(
    name: Key,
    args: TransitionEventArgs[Key],
  ) {
    this.trigger(name, args)
    const model = this.model
    if (model) {
      model.notify(`cell:${name}`, args)
      if (this.isNode()) {
        model.notify(`node:${name}`, { ...args, node: this })
      } else if (this.isEdge()) {
        model.notify(`edge:${name}`, { ...args, edge: this })
      }
    }
    return this
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

  get shape() {
    return this.store.get('shape', '')
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
    options?: CellSetOptions,
  ): this
  setProp(key: string, value: any, options?: CellSetOptions): this
  setProp(props: Partial<Properties>, options?: CellSetOptions): this
  setProp(
    key: string | Partial<Properties>,
    value?: any,
    options?: CellSetOptions,
  ) {
    if (typeof key === 'string') {
      this.store.set(key, value, options)
    } else {
      const props = this.preprocess(key, true)
      this.store.set(ObjectExt.merge({}, this.getProp(), props), value)
      this.postprocess(key)
    }
    return this
  }

  removeProp<K extends keyof Properties>(
    key: K | K[],
    options?: CellSetOptions,
  ): this
  removeProp(key: string | string[], options?: CellSetOptions): this
  removeProp(options?: CellSetOptions): this
  removeProp(
    key?: string | string[] | CellSetOptions,
    options?: CellSetOptions,
  ) {
    if (typeof key === 'string' || Array.isArray(key)) {
      this.store.removeByPath(key, options)
    } else {
      this.store.remove(options)
    }
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
    options: SetByPathOptions = {},
  ) {
    if (this.model) {
      // update inner reference
      if (path === 'children') {
        this._children = value
          ? value
              .map((id: string) => this.model!.getCell(id))
              .filter((child: Cell) => child != null)
          : null
      } else if (path === 'parent') {
        this._parent = value ? this.model.getCell(value) : null
      }
    }

    this.store.setByPath(path, value, options)
    return this
  }

  removePropByPath(path: string | string[], options: CellSetOptions = {}) {
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
    options?: CellSetOptions,
  ): this
  prop(key: string, value: any, options?: CellSetOptions): this
  prop(path: string[], value: any, options?: CellSetOptions): this
  prop(props: Partial<Properties>, options?: CellSetOptions): this
  prop(
    key?: string | string[] | Partial<Properties>,
    value?: any,
    options?: CellSetOptions,
  ) {
    if (key == null) {
      return this.getProp()
    }

    if (typeof key === 'string' || Array.isArray(key)) {
      if (arguments.length === 1) {
        return this.getPropByPath(key)
      }

      if (value == null) {
        return this.removePropByPath(key, options || {})
      }

      return this.setPropByPath(key, value, options || {})
    }

    return this.setProp(key, value || {})
  }

  previous<K extends keyof Properties>(name: K): Properties[K] | undefined
  previous<T>(name: string): T | undefined
  previous(name: string) {
    return this.store.getPrevious(name as keyof CellProperties)
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

  setZIndex(z: number, options: CellSetOptions = {}) {
    this.store.set('zIndex', z, options)
    return this
  }

  removeZIndex(options: CellSetOptions = {}) {
    this.store.remove('zIndex', options)
    return this
  }

  toFront(options: ToFrontOptions = {}) {
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
        this.batchUpdate('to-front', () => {
          z += cells.length
          cells.forEach((cell, index) => {
            cell.setZIndex(z + index, options)
          })
        })
      }
    }

    return this
  }

  toBack(options: ToBackOptions = {}) {
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
        this.batchUpdate('to-back', () => {
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

  set markup(value: MarkupType | undefined | null) {
    if (value == null) {
      this.removeMarkup()
    } else {
      this.setMarkup(value)
    }
  }

  getMarkup() {
    let markup = this.store.get('markup')
    if (markup == null) {
      const ctor = this.constructor as typeof Cell
      markup = ctor.getMarkup()
    }
    return markup
  }

  setMarkup(markup: MarkupType, options: CellSetOptions = {}) {
    this.store.set('markup', markup, options)
    return this
  }

  removeMarkup(options: CellSetOptions = {}) {
    this.store.remove('markup', options)
    return this
  }

  // #endregion

  // #region attrs

  get attrs() {
    return this.getAttrs()
  }

  set attrs(value: CellAttrs | null | undefined) {
    if (value == null) {
      this.removeAttrs()
    } else {
      this.setAttrs(value)
    }
  }

  getAttrs() {
    const result = this.store.get('attrs')
    return result ? { ...result } : {}
  }

  setAttrs(attrs: CellAttrs | null | undefined, options: SetAttrOptions = {}) {
    if (attrs == null) {
      this.removeAttrs(options)
    } else {
      const set = (attrs: CellAttrs) => this.store.set('attrs', attrs, options)

      if (options.overwrite === true) {
        set(attrs)
      } else {
        const prev = this.getAttrs()
        if (options.deep === false) {
          set({ ...prev, ...attrs })
        } else {
          set(ObjectExt.merge({}, prev, attrs))
        }
      }
    }

    return this
  }

  replaceAttrs(attrs: CellAttrs, options: CellSetOptions = {}) {
    return this.setAttrs(attrs, { ...options, overwrite: true })
  }

  updateAttrs(attrs: CellAttrs, options: CellSetOptions = {}) {
    return this.setAttrs(attrs, { ...options, deep: false })
  }

  removeAttrs(options: CellSetOptions = {}) {
    this.store.remove('attrs', options)
    return this
  }

  getAttrDefinition(attrName: string) {
    if (!attrName) {
      return null
    }

    const ctor = this.constructor as typeof Cell
    const hooks = ctor.getAttrHooks() || {}
    let definition = hooks[attrName] || attrRegistry.get(attrName)
    if (!definition) {
      const name = StringExt.camelCase(attrName)
      definition = hooks[name] || attrRegistry.get(name)
    }

    return definition || null
  }

  getAttrByPath(): CellAttrs
  getAttrByPath<T>(path: string | string[]): T
  getAttrByPath<T>(path?: string | string[]) {
    if (path == null || path === '') {
      return this.getAttrs()
    }
    return this.getPropByPath<T>(this.prefixAttrPath(path))
  }

  setAttrByPath(
    path: string | string[],
    value: ComplexAttrValue,
    options: CellSetOptions = {},
  ) {
    this.setPropByPath(this.prefixAttrPath(path), value, options)
    return this
  }

  removeAttrByPath(path: string | string[], options: CellSetOptions = {}) {
    this.removePropByPath(this.prefixAttrPath(path), options)
    return this
  }

  protected prefixAttrPath(path: string | string[]) {
    return Array.isArray(path) ? ['attrs'].concat(path) : `attrs/${path}`
  }

  attr(): CellAttrs
  attr<T>(path: string | string[]): T
  attr(
    path: string | string[],
    value: ComplexAttrValue | null,
    options?: CellSetOptions,
  ): this
  attr(attrs: CellAttrs, options?: SetAttrOptions): this
  attr(
    path?: string | string[] | CellAttrs,
    value?: ComplexAttrValue | CellSetOptions,
    options?: CellSetOptions,
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
      return this.setAttrByPath(path, value as ComplexAttrValue, options || {})
    }

    return this.setAttrs(path, (value || {}) as CellSetOptions)
  }

  // #endregion

  // #region visible

  get visible() {
    return this.isVisible()
  }

  set visible(value: boolean) {
    this.setVisible(value)
  }

  setVisible(visible: boolean, options: CellSetOptions = {}) {
    this.store.set('visible', visible, options)
    return this
  }

  isVisible() {
    return this.store.get('visible') !== false
  }

  show(options: CellSetOptions = {}) {
    if (!this.isVisible()) {
      this.setVisible(true, options)
    }
    return this
  }

  hide(options: CellSetOptions = {}) {
    if (this.isVisible()) {
      this.setVisible(false, options)
    }
    return this
  }

  toggleVisible(visible: boolean, options?: CellSetOptions): this
  toggleVisible(options?: CellSetOptions): this
  toggleVisible(
    isVisible?: boolean | CellSetOptions,
    options: CellSetOptions = {},
  ) {
    const visible =
      typeof isVisible === 'boolean' ? isVisible : !this.isVisible()
    const localOptions = typeof isVisible === 'boolean' ? options : isVisible
    if (visible) {
      this.show(localOptions)
    } else {
      this.hide(localOptions)
    }
    return this
  }

  // #endregion

  // #region data

  get data(): Properties['data'] {
    return this.getData()
  }

  set data(val: Properties['data']) {
    this.setData(val)
  }

  getData<T = Properties['data']>(): T {
    return this.store.get<T>('data')
  }

  setData<T = Properties['data']>(data: T, options: SetDataOptions = {}) {
    if (data == null) {
      this.removeData(options)
    } else {
      const set = (data: T) => this.store.set('data', data, options)

      if (options.overwrite === true) {
        set(data)
      } else {
        const prev = this.getData<Record<string, any>>()
        if (options.deep === false) {
          set(typeof data === 'object' ? { ...prev, ...data } : data)
        } else {
          set(ObjectExt.merge({}, prev, data))
        }
      }
    }

    return this
  }

  replaceData<T = Properties['data']>(data: T, options: CellSetOptions = {}) {
    return this.setData(data, { ...options, overwrite: true })
  }

  updateData<T = Properties['data']>(data: T, options: CellSetOptions = {}) {
    return this.setData(data, { ...options, deep: false })
  }

  removeData(options: CellSetOptions = {}) {
    this.store.remove('data', options)
    return this
  }

  // #endregion

  // #region parent children

  get parent(): Cell | null {
    return this.getParent()
  }

  get children() {
    return this.getChildren()
  }

  getParentId() {
    return this.store.get('parent')
  }

  getParent<T extends Cell = Cell>(): T | null {
    const parentId = this.getParentId()
    if (parentId && this.model) {
      const parent = this.model.getCell<T>(parentId)
      this._parent = parent
      return parent
    }
    return null
  }

  getChildren() {
    const childrenIds = this.store.get('children')
    if (childrenIds && childrenIds.length && this.model) {
      const children = childrenIds
        .map((id) => this.model?.getCell(id))
        .filter((cell) => cell != null) as Cell[]
      this._children = children
      return [...children]
    }
    return null
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
    if (this.children) {
      this.children.forEach(iterator, context)
    }
    return this
  }

  filterChild(
    filter: (cell: Cell, index: number, arr: Cell[]) => boolean,
    context?: any,
  ): Cell[] {
    return this.children ? this.children.filter(filter, context) : []
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

  getAncestors(options: { deep?: boolean } = {}): Cell[] {
    const ancestors: Cell[] = []
    let parent = this.getParent()
    while (parent) {
      ancestors.push(parent)
      parent = options.deep !== false ? parent.getParent() : null
    }
    return ancestors
  }

  getDescendants(options: CellGetDescendantsOptions = {}): Cell[] {
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
        cells.forEach((cell) => {
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

  setParent(parent: Cell | null, options: CellSetOptions = {}) {
    this._parent = parent
    if (parent) {
      this.store.set('parent', parent.id, options)
    } else {
      this.store.remove('parent', options)
    }
    return this
  }

  setChildren(children: Cell[] | null, options: CellSetOptions = {}) {
    this._children = children
    if (children != null) {
      this.store.set(
        'children',
        children.map((child) => child.id),
        options,
      )
    } else {
      this.store.remove('children', options)
    }
    return this
  }

  unembed(child: Cell, options: CellSetOptions = {}) {
    const children = this.children
    if (children != null && child != null) {
      const index = this.getChildIndex(child)
      if (index !== -1) {
        children.splice(index, 1)
        child.setParent(null, options)
        this.setChildren(children, options)
      }
    }
    return this
  }

  embed(child: Cell, options: CellSetOptions = {}) {
    child.addTo(this, options)
    return this
  }

  addTo(model: Model, options?: CellSetOptions): this
  addTo(graph: Graph, options?: CellSetOptions): this
  addTo(parent: Cell, options?: CellSetOptions): this
  addTo(target: Model | Graph | Cell, options: CellSetOptions = {}) {
    if (Cell.isCell(target)) {
      target.addChild(this, options)
    } else {
      target.addCell(this, options)
    }
    return this
  }

  insertTo(parent: Cell, index?: number, options: CellSetOptions = {}) {
    parent.insertChild(this, index, options)
    return this
  }

  addChild(child: Cell | null, options: CellSetOptions = {}) {
    return this.insertChild(child, undefined, options)
  }

  insertChild(
    child: Cell | null,
    index?: number,
    options: CellSetOptions = {},
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

      if (changed && this.model) {
        const incomings = this.model.getIncomingEdges(this)
        const outgoings = this.model.getOutgoingEdges(this)

        if (incomings) {
          incomings.forEach((edge) => edge.updateParent(options))
        }

        if (outgoings) {
          outgoings.forEach((edge) => edge.updateParent(options))
        }
      }

      if (this.model) {
        this.model.addCell(child, options)
      }
    }

    return this
  }

  removeFromParent(options: CellRemoveOptions = {}) {
    const parent = this.getParent()
    if (parent != null) {
      const index = parent.getChildIndex(this)
      parent.removeChildAt(index, options)
    }
    return this
  }

  removeChild(child: Cell, options: CellRemoveOptions = {}) {
    const index = this.getChildIndex(child)
    return this.removeChildAt(index, options)
  }

  removeChildAt(index: number, options: CellRemoveOptions = {}) {
    const child = this.getChildAt(index)
    const children = this.children

    if (children != null && child != null) {
      this.unembed(child, options)
      child.remove(options)
    }

    return child
  }

  remove(options: CellRemoveOptions = {}) {
    this.batchUpdate('remove', () => {
      const parent = this.getParent()
      if (parent) {
        parent.removeChild(this, options)
      }

      if (options.deep !== false) {
        this.eachChild((child) => child.remove(options))
      }

      if (this.model) {
        this.model.removeCell(this, options)
      }
    })
    return this
  }

  // #endregion

  // #region animation
  // TODO: 移除旧的 animation
  animate(
    keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
    options?: number | EffectTiming,
  ) {
    const effect = new KeyframeEffect(this, keyframes, options)
    const animation = new Animation2(effect)
    animation.play()
    return animation
  }

  transition<K extends keyof Properties>(
    path: K,
    target: Properties[K],
    options?: AnimationStartOptions<Properties[K]>,
    delim?: string,
  ): () => void
  transition<T extends AnimationTargetValue>(
    path: string | string[],
    target: T,
    options?: AnimationStartOptions<T>,
    delim?: string,
  ): () => void
  transition<T extends AnimationTargetValue>(
    path: string | string[],
    target: T,
    options: AnimationStartOptions<T> = {},
    delim = '/',
  ) {
    return this.animation.start(
      path,
      target,
      {
        fill: 'forwards',
        ...options,
      },
      delim,
    )
  }

  stopTransition<T extends AnimationTargetValue>(
    path: string | string[],
    options?: AnimationStopOptions<T>,
    delim = '/',
  ) {
    this.animation.stop(path, options, delim)
    return this
  }

  getTransitions() {
    return this.animation.get()
  }

  // #endregion

  // #region transform

  // eslint-disable-next-line
  translate(tx: number, ty: number, options?: CellTranslateOptions) {
    return this
  }

  scale(
    sx: number, // eslint-disable-line
    sy: number, // eslint-disable-line
    origin?: Point | PointLike, // eslint-disable-line
    options?: NodeSetOptions, // eslint-disable-line
  ) {
    return this
  }

  // #endregion

  // #region tools

  addTools(items: ToolItem | ToolItem[], options?: AddToolOptions): void
  addTools(
    items: ToolItem | ToolItem[],
    name: string,
    options?: AddToolOptions,
  ): void
  addTools(
    items: ToolItem | ToolItem[],
    obj?: string | AddToolOptions,
    options?: AddToolOptions,
  ) {
    const toolItems = Array.isArray(items) ? items : [items]
    const name = typeof obj === 'string' ? obj : null
    const config =
      typeof obj === 'object' ? obj : typeof options === 'object' ? options : {}

    if (config.reset) {
      return this.setTools(
        { name, items: toolItems, local: config.local },
        config,
      )
    }
    let tools = ObjectExt.cloneDeep(this.getTools())
    if (tools == null || name == null || tools.name === name) {
      if (tools == null) {
        tools = {} as Tools
      }

      if (!tools.items) {
        tools.items = []
      }

      tools.name = name
      tools.items = [...tools.items, ...toolItems]

      return this.setTools({ ...tools }, config)
    }
  }

  setTools(tools?: ToolsLoose | null, options: CellSetOptions = {}) {
    if (tools == null) {
      this.removeTools()
    } else {
      this.store.set('tools', Cell.normalizeTools(tools), options)
    }
    return this
  }

  getTools(): Tools | null {
    return this.store.get<Tools>('tools')
  }

  removeTools(options: CellSetOptions = {}) {
    this.store.remove('tools', options)
    return this
  }

  hasTools(name?: string) {
    const tools = this.getTools()
    if (tools == null) {
      return false
    }

    if (name == null) {
      return true
    }

    return tools.name === name
  }

  hasTool(name: string) {
    const tools = this.getTools()
    if (tools == null) {
      return false
    }
    return tools.items.some((item) =>
      typeof item === 'string' ? item === name : item.name === name,
    )
  }

  removeTool(name: string, options?: CellSetOptions): this
  removeTool(index: number, options?: CellSetOptions): this
  removeTool(nameOrIndex: string | number, options: CellSetOptions = {}) {
    const tools = ObjectExt.cloneDeep(this.getTools())
    if (tools) {
      let updated = false
      const items = tools.items.slice()
      const remove = (index: number) => {
        items.splice(index, 1)
        updated = true
      }

      if (typeof nameOrIndex === 'number') {
        remove(nameOrIndex)
      } else {
        for (let i = items.length - 1; i >= 0; i -= 1) {
          const item = items[i]
          const exist =
            typeof item === 'string'
              ? item === nameOrIndex
              : item.name === nameOrIndex
          if (exist) {
            remove(i)
          }
        }
      }

      if (updated) {
        tools.items = items
        this.setTools(tools, options)
      }
    }
    return this
  }

  // #endregion

  // #region common

  // eslint-disable-next-line
  getBBox(options?: { deep?: boolean }) {
    return new Rectangle()
  }

  // eslint-disable-next-line
  getConnectionPoint(edge: Edge, type: TerminalType) {
    return new Point()
  }

  toJSON(
    options: CellToJSONOptions = {},
  ): this extends Node
    ? NodeProperties
    : this extends Edge
    ? EdgeProperties
    : Properties {
    const props = { ...this.store.get() }
    const toString = Object.prototype.toString
    const cellType = this.isNode() ? 'node' : this.isEdge() ? 'edge' : 'cell'

    if (!props.shape) {
      const ctor = this.constructor
      throw new Error(
        `Unable to serialize ${cellType} missing "shape" prop, check the ${cellType} "${
          ctor.name || toString.call(ctor)
        }"`,
      )
    }

    const ctor = this.constructor as typeof Cell
    const diff = options.diff === true
    const attrs = props.attrs || {}
    const presets = ctor.getDefaults(true) as Properties
    // When `options.diff` is `true`, we should process the custom options,
    // such as `width`, `height` etc. to ensure the comparing work correctly.
    const defaults = diff ? this.preprocess(presets, true) : presets
    const defaultAttrs = defaults.attrs || {}
    const finalAttrs: CellAttrs = {}

    Object.entries(props).forEach(([key, val]) => {
      if (
        val != null &&
        !Array.isArray(val) &&
        typeof val === 'object' &&
        !ObjectExt.isPlainObject(val)
      ) {
        throw new Error(
          `Can only serialize ${cellType} with plain-object props, but got a "${toString.call(
            val,
          )}" type of key "${key}" on ${cellType} "${this.id}"`,
        )
      }

      if (key !== 'attrs' && key !== 'shape' && diff) {
        const preset = defaults[key]
        if (ObjectExt.isEqual(val, preset)) {
          delete props[key]
        }
      }
    })

    Object.keys(attrs).forEach((key) => {
      const attr = attrs[key]
      const defaultAttr = defaultAttrs[key]

      Object.keys(attr).forEach((name) => {
        const value = attr[name] as KeyValue
        const defaultValue = defaultAttr ? defaultAttr[name] : null

        if (
          value != null &&
          typeof value === 'object' &&
          !Array.isArray(value)
        ) {
          Object.keys(value).forEach((subName) => {
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

    const finalProps = {
      ...props,
      attrs: ObjectExt.isEmpty(finalAttrs) ? undefined : finalAttrs,
    }

    if (finalProps.attrs == null) {
      delete finalProps.attrs
    }

    const ret = finalProps as any
    if (ret.angle === 0) {
      delete ret.angle
    }

    return ObjectExt.cloneDeep(ret)
  }

  clone(
    options: CloneOptions = {},
  ): this extends Node ? Node : this extends Edge ? Edge : Cell {
    if (!options.deep) {
      const data = { ...this.store.get() }
      if (!options.keepId) {
        delete data.id
      }
      delete data.parent
      delete data.children
      const ctor = this.constructor as typeof Cell
      return new ctor(data) as any // eslint-disable-line new-cap
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

  startBatch(
    name: BatchName,
    data: KeyValue = {},
    model: Model | null = this.model,
  ) {
    this.notify('batch:start', { name, data, cell: this })

    if (model) {
      model.startBatch(name, { ...data, cell: this })
    }

    return this
  }

  stopBatch(
    name: BatchName,
    data: KeyValue = {},
    model: Model | null = this.model,
  ) {
    if (model) {
      model.stopBatch(name, { ...data, cell: this })
    }

    this.notify('batch:stop', { name, data, cell: this })
    return this
  }

  batchUpdate<T>(name: BatchName, execute: () => T, data?: KeyValue): T {
    // The model is null after cell was removed(remove batch).
    // So we should temp save model to trigger pairing batch event.
    const model = this.model
    this.startBatch(name, data, model)
    const result = execute()
    this.stopBatch(name, data, model)
    return result
  }

  // #endregion

  // #region IDisposable

  @disposable()
  dispose() {
    this.removeFromParent()
    this.store.dispose()
  }

  // #endregion
}

export interface CellCommon {
  view?: string
  shape?: string
  markup?: MarkupType
  attrs?: CellAttrs
  zIndex?: number
  visible?: boolean
  data?: any
  transition?: TransitionParams[]
}

export interface CellDefaults extends CellCommon {}

export interface CellMetadata extends CellCommon, KeyValue {
  id?: string
  tools?: ToolsLoose
}

export interface CellProperties extends CellDefaults, CellMetadata {
  parent?: string
  children?: string[]
  tools?: Tools
}

type ToolItem =
  | string
  | {
      name: string
      args?: any
    }

export interface Tools {
  name?: string | null
  local?: boolean
  items: ToolItem[]
}

export type ToolsLoose = ToolItem | ToolItem[] | Tools

export interface CellSetOptions extends StoreSetOptions {}

export interface CellMutateOptions extends StoreMutateOptions {}

export interface CellRemoveOptions extends CellSetOptions {
  deep?: boolean
}

export interface SetAttrOptions extends CellSetOptions {
  deep?: boolean
  overwrite?: boolean
}

export interface SetDataOptions extends CellSetOptions {
  deep?: boolean
  overwrite?: boolean
}

export interface SetByPathOptions extends StoreSetByPathOptions {}

export interface ToFrontOptions extends CellSetOptions {
  deep?: boolean
}

export interface ToBackOptions extends ToFrontOptions {}

export interface CellTranslateOptions extends CellSetOptions {
  tx?: number
  ty?: number
  translateBy?: string | number
}

export interface AddToolOptions extends CellSetOptions {
  reset?: boolean
  local?: boolean
}

export interface CellGetDescendantsOptions {
  deep?: boolean
  breadthFirst?: boolean
}

export interface CellToJSONOptions {
  diff?: boolean
}

export interface CloneOptions {
  deep?: boolean
  keepId?: boolean
}

export type TransitionParams = Parameters<
  InstanceType<typeof Cell>['transition']
>

export interface TransitionEventArgs {
  'transition:start': AnimationCallbackArgs<AnimationTargetValue>
  'transition:progress': AnimationProgressArgs<AnimationTargetValue>
  'transition:complete': AnimationCallbackArgs<AnimationTargetValue>
  'transition:stop': AnimationStopArgs<AnimationTargetValue>
  'transition:finish': AnimationCallbackArgs<AnimationTargetValue>

  // common
  'change:*': ChangeAnyKeyArgs
  'change:attrs': CellChangeArgs<CellAttrs>
  'change:zIndex': CellChangeArgs<number>
  'change:markup': CellChangeArgs<MarkupType>
  'change:visible': CellChangeArgs<boolean>
  'change:parent': CellChangeArgs<string>
  'change:children': CellChangeArgs<string[]>
  'change:tools': CellChangeArgs<Tools>
  'change:view': CellChangeArgs<string>
  'change:data': CellChangeArgs<any>

  // node
  'change:size': NodeChangeArgs<Size>
  'change:angle': NodeChangeArgs<number>
  'change:position': NodeChangeArgs<PointLike>
  'change:ports': NodeChangeArgs<Port[]>
  'change:portMarkup': NodeChangeArgs<MarkupType>
  'change:portLabelMarkup': NodeChangeArgs<MarkupType>
  'change:portContainerMarkup': NodeChangeArgs<MarkupType>
  'ports:removed': {
    cell: Cell
    node: Node
    removed: Port[]
  }
  'ports:added': {
    cell: Cell
    node: Node
    added: Port[]
  }

  // edge
  'change:source': EdgeChangeArgs<TerminalData>
  'change:target': EdgeChangeArgs<TerminalData>
  'change:terminal': EdgeChangeArgs<TerminalData> & {
    type: TerminalType
  }
  'change:router': EdgeChangeArgs<RouterData>
  'change:connector': EdgeChangeArgs<ConnectorData>
  'change:vertices': EdgeChangeArgs<PointLike[]>
  'change:labels': EdgeChangeArgs<EdgeLabel[]>
  'change:defaultLabel': EdgeChangeArgs<EdgeLabel>
  'vertexs:added': {
    cell: Cell
    edge: Edge
    added: PointLike[]
  }
  'vertexs:removed': {
    cell: Cell
    edge: Edge
    removed: PointLike[]
  }
  'labels:added': {
    cell: Cell
    edge: Edge
    added: EdgeLabel[]
  }
  'labels:removed': {
    cell: Cell
    edge: Edge
    removed: EdgeLabel[]
  }

  'batch:start': {
    name: BatchName
    data: KeyValue
    cell: Cell
  }

  'batch:stop': {
    name: BatchName
    data: KeyValue
    cell: Cell
  }

  changed: {
    cell: Cell
    options: CellMutateOptions
  }

  added: {
    cell: Cell
    index: number
    options: CellSetOptions
  }

  removed: {
    cell: Cell
    index: number
    options: CellRemoveOptions
  }
}

interface ChangeAnyKeyArgs<
  T extends keyof CellProperties = keyof CellProperties,
> {
  key: T
  current: CellProperties[T]
  previous: CellProperties[T]
  options: CellMutateOptions
  cell: Cell
}

export interface CellChangeArgs<T> {
  cell: Cell
  current?: T
  previous?: T
  options: CellMutateOptions
}

interface NodeChangeArgs<T> extends CellChangeArgs<T> {
  node: Node
}

interface EdgeChangeArgs<T> extends CellChangeArgs<T> {
  edge: Edge
}

export interface CellGetCellsBBoxOptions {
  deep?: boolean
}

export type CellDefinition = typeof Cell

export type CellPropHook<
  M extends CellMetadata = CellMetadata,
  C extends Cell = Cell,
> = (this: C, metadata: M) => M

export type PropHooks<
  M extends CellMetadata = CellMetadata,
  C extends Cell = Cell,
> = KeyValue<CellPropHook<M, C>> | CellPropHook<M, C> | CellPropHook<M, C>[]

export interface CellConfig<
  M extends CellMetadata = CellMetadata,
  C extends Cell = Cell,
> extends CellDefaults,
    KeyValue {
  constructorName?: string
  overwrite?: boolean
  propHooks?: PropHooks<M, C>
  attrHooks?: AttrDefinitions
}

Cell.config({
  propHooks({ tools, ...metadata }) {
    if (tools) {
      metadata.tools = Cell.normalizeTools(tools)
    }
    return metadata
  },
})
