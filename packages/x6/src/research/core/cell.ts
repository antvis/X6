import { v } from '../../v'
import { Basecoat } from '../../entity'
import { KeyValue, Size } from '../../types'
import { Rectangle, Point } from '../../geometry'
import { ArrayExt, StringExt, ObjectExt } from '../../util'
import { Easing, Interpolation } from '../animation'
import { Attr } from '../attr'
import { Node } from './node'
import { Edge } from './edge'
import { Layer } from './layer'
import { Store } from './store'
import { Model } from './model'
import { Markup } from './markup'
import { PortData } from './port-data'
import { CellView } from './cell-view'
import { Graph } from './graph'

export class Cell extends Basecoat<Cell.EventArgs> {
  // #region static

  protected static defaults: Cell.Defaults = {}
  protected static attrDefinitions: Attr.Definitions = {}

  public static config<T extends Cell.Defaults = Cell.Defaults>(
    presets: T,
    attrDefinitions?: Attr.Definitions,
  ) {
    this.defaults = this.mergeDefaults(this.defaults, presets)
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
    raw: boolean = false,
  ): T {
    return (raw ? this.defaults : ObjectExt.cloneDeep(this.defaults)) as T
  }

  public static getAttrDefinition() {
    return this.attrDefinitions
  }

  // #endregion

  public model: Model | null
  public readonly id: string
  public readonly store: Store<Cell.Properties>
  protected _parent: Cell | null // tslint:disable-line
  protected _children: Cell[] | null // tslint:disable-line

  constructor(options: Cell.Options = {}) {
    super()
    this.id = options.id || StringExt.uuid()
    const data = this.getData(options) as Partial<Cell.Properties>
    this.store = new Store(data)
    this.setup()
    this.init()
  }

  init() {}

  protected getData(options: Cell.Options): Cell.Defaults {
    const ctor = this.constructor as typeof Cell
    return ctor.mergeDefaults(ctor.getDefaults(true), options)
  }

  protected setup() {
    this.store.on('mutated', metadata => {
      const key = metadata.key

      if (key === 'zIndex') {
        this.trigger('change:zIndex', this.getChangeEventArgs<number>(metadata))
      } else if (key === 'parent') {
        this.trigger('change:parent', this.getChangeEventArgs<string>(metadata))
      } else if (key === 'children') {
        this.trigger(
          'change:children',
          this.getChangeEventArgs<string[]>(metadata),
        )
      } else if (key === 'visible') {
        this.trigger(
          'change:visible',
          this.getChangeEventArgs<boolean>(metadata),
        )
      } else if (key === 'markup') {
        this.trigger('change:markup', this.getChangeEventArgs<Markup>(metadata))
      } else if (key === 'view') {
        this.trigger(
          'change:view',
          this.getChangeEventArgs<Cell.ViewType>(metadata),
        )
      } else if (key === 'attrs') {
        this.trigger(
          'change:attrs',
          this.getChangeEventArgs<Attr.CellAttrs>(metadata),
        )
      }
    })

    this.store.on('changed', ({ options }) =>
      this.trigger('changed', { options, cell: this }),
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

  isNode(): this is Node {
    return false
  }

  isEdge(): this is Edge {
    return false
  }

  isLayer(): this is Layer {
    return false
  }

  get view() {
    return this.store.get('view')
  }

  // #region get/set by path

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

  toFront() {}

  toBack() {}

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
    return this.getByPath<T>(this.prefixAttrPath(path))
  }

  setAttrByPath(
    path: string | string[],
    value: Attr.ComplexAttrValue,
    options: Cell.SetOptions = {},
  ) {
    this.setByPath(this.prefixAttrPath(path), value, options)
    return this
  }

  removeAttrByPath(path: string | string[], options: Cell.SetOptions = {}) {
    this.removeByPath(this.prefixAttrPath(path), options)
    return this
  }

  protected prefixAttrPath(path: string | string[]) {
    return Array.isArray(path) ? ['attrs'].concat(path) : `attrs/${path}`
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
    return this._parent
  }

  getChildren() {
    return this._children ? [...this._children] : null
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
      // breadth first algorithm
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

      // depth first algorithm
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

  getCommonAncestor(...cells: (Cell | null | undefined)[]) {
    return Cell.getCommonAncestor(this, ...cells)
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
        // TODO: updateEdgeParents
        // this.updateEdgeParents(child)
      }

      if (this.model) {
        this.model.collection.add(child)
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
      children.splice(index, 1)
      child.setParent(null, options)
      this.setChildren(children, options)
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
          this.eachChild(child => child.remove())
        }
        this.trigger('removed', { options, cell: this })
        if (this.model) {
          this.model.collection.remove(this, options)
        }
      })
    }
  }

  // #endregion

  // #region transition

  protected readonly transitionIds: { [path: string]: number } = {}

  transition<T extends string | number | KeyValue<number>>(
    path: string | string[],
    target: T,
    options: Cell.TransitionOptions = {},
    delim: string = '/',
  ) {
    const opts: Cell.TransitionOptions = {
      delay: 10,
      duration: 100,
      easing: 'linear',
      ...options,
    }

    let easing = Easing.linear
    if (opts.easing != null) {
      if (typeof opts.easing === 'string') {
        easing = Easing[opts.easing]
      } else {
        easing = opts.easing
      }
    }

    const current = this.getByPath<T>(path)

    let interpolate: any
    if (typeof target === 'object') {
      interpolate = Interpolation.object(
        current as KeyValue<number>,
        target as KeyValue<number>,
      )
    } else if (typeof target === 'number') {
      interpolate = Interpolation.number(current as number, target)
    } else if (typeof target === 'string') {
      if (target[0] === '#') {
        interpolate = Interpolation.color(current as string, target)
      } else {
        interpolate = Interpolation.unit(current as string, target)
      }
    }

    let startTime = 0

    const pathStr = Array.isArray(path) ? path.join(delim) : path
    const setter = () => {
      let id
      let val

      const now = new Date().getTime()
      if (startTime === 0) {
        startTime = now
      }

      const elaspe = now - startTime
      let progress = elaspe / opts.duration!
      if (progress < 1) {
        this.transitionIds[pathStr] = id = v.requestAnimationFrame(setter)
      } else {
        progress = 1
        delete this.transitionIds[pathStr]
      }

      val = interpolate(easing(progress))
      options.transitionId = id

      this.setByPath(Array.isArray(path) ? path : path.split(delim), val)

      if (id == null) {
        this.trigger('transition:end', { cell: this, path: pathStr })
      }
    }

    const initiator = (transition: FrameRequestCallback) => {
      this.stopTransitions(path, delim)
      this.transitionIds[pathStr] = v.requestAnimationFrame(transition)
      this.trigger('transition:begin', { cell: this, path: pathStr })
    }

    return setTimeout(() => {
      initiator(setter)
    }, options.delay)
  }

  getTransitions() {
    return Object.keys(this.transitionIds)
  }

  stopTransitions(path: string | string[], delim: string = '/') {
    const paths = Array.isArray(path) ? path : path.split(delim)

    Object.keys(this.transitionIds)
      .filter(key =>
        ObjectExt.isEqual(paths, key.split(delim).slice(0, paths.length)),
      )
      .forEach(key => {
        v.cancelAnimationFrame(this.transitionIds[key])
        delete this.transitionIds[key]
        this.trigger('transition:end', { cell: this, path: key })
      })

    return this
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

  getBBox(options?: { deep?: boolean }) {
    return new Rectangle()
  }

  getConnectionPoint(edge: Edge, type: Edge.TerminalType) {
    return new Point()
  }

  toJSON() {}

  clone() {}

  addTo() {}

  findView(graph: Graph) {
    return graph.findViewByCell(this)
  }

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

  @Basecoat.dispose()
  dispose() {
    this.removeFromParent()
    this.store.dispose()
    this.trigger('disposed', { cell: this })
  }
}

export namespace Cell {
  export type ViewType = string | typeof CellView

  export interface Common {
    view?: ViewType
    attrs?: Attr.CellAttrs
    zIndex?: number
    visible?: boolean
  }

  export interface Defaults extends Common {
    markup?: Markup
  }

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

  export interface TranslateOptions extends SetOptions {
    tx?: number
    ty?: number
    translateBy?: string | number
  }

  export interface TransitionOptions extends KeyValue {
    delay?: number
    duration?: number
    easing?: Easing.Names | Easing.Definition
  }
}

export namespace Cell {
  export interface EventArgs {
    // common
    'change:attrs': ChangeArgs<Attr.CellAttrs>
    'change:zIndex': ChangeArgs<number>
    'change:markup': ChangeArgs<Markup>
    'change:visible': ChangeArgs<boolean>
    'change:parent': ChangeArgs<string>
    'change:children': ChangeArgs<string[]>
    'change:view': ChangeArgs<ViewType>
    'transition:begin': TransitionArgs
    'transition:end': TransitionArgs

    // node
    'change:size': ChangeArgs<Size>
    'change:position': ChangeArgs<Point.PointLike>
    'change:rotation': ChangeArgs<number>
    'change:ports': ChangeArgs<PortData.Port[]>
    'change:portMarkup': ChangeArgs<Markup>
    'change:portLabelMarkup': ChangeArgs<Markup>
    'change:portContainerMarkup': ChangeArgs<Markup>
    'ports:removed': {
      node: Node
      removed: PortData.Port[]
    }
    'ports:added': {
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
      edge: Edge
      added: Point.PointLike[]
    }
    'vertexs:removed': {
      edge: Edge
      removed: Point.PointLike[]
    }
    'labels:added': {
      edge: Edge
      added: Edge.Label[]
    }
    'labels:removed': {
      edge: Edge
      removed: Edge.Label[]
    }

    removed: {
      cell: Cell
      options: Cell.SetOptions
    }

    changed: {
      cell: Cell
      options: MutateOptions
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
  export function getCommonAncestor(...cells: (Cell | null | undefined)[]) {
    const ancestors = cells
      .filter(cell => cell != null)
      .map(cell => cell!.getAncestors())
      .sort((a, b) => {
        return a.length - b.length
      })

    return ancestors
      .shift()!
      .find(cell => ancestors.every(item => item.includes(cell)))
  }

  export interface GetCellsBBoxOptions {
    deep?: boolean
  }

  export function getCellsBBox(
    cells: Cell[],
    options: GetCellsBBoxOptions = {},
  ) {
    if (cells.length) {
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

    return null
  }
}

export namespace Cell {
  export type Defintion = typeof Cell

  export interface DefintionOptions extends Defaults {
    /**
     * The class name.
     */
    name?: string
    attrDefinitions?: Attr.Definitions
  }
}
