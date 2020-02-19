/* tslint:disable:variable-name */

import { KV } from '../../types'
import { Basecoat } from '../../entity'
import { JSONObject, JSONExt, ArrayExt, ObjectExt } from '../../util'
import {
  IChange,
  ChildChange,
  AttrsChange,
  MarkupChange,
  VisibleChange,
} from '../change'
import { Node } from './node'
import { Model } from '../kernel/model'
import { Easing } from './easing'
import { Rectangle } from '../../geometry'
import { DomUtil } from '../../dom'
import { Interpolation } from './interpolation'

export class Cell extends Basecoat {
  public readonly id: string | number
  public model: Model

  protected _markup: string
  protected _attrs: JSONObject
  protected _parent: Cell | null
  protected _children: Cell[] | null
  protected _visible: boolean

  constructor() {
    super()
    this._visible = true
  }

  isNode(): this is Node {
    return false
  }

  isEdge() {
    return false
  }

  // #region markup

  get markup() {
    return this._markup
  }

  set markup(value: string) {
    this.setMarkup(value)
  }

  setMarkup(markup: string, options: Cell.SetOptions = {}) {
    if (options.force || this.markup !== markup) {
      if (options.silent) {
        this._markup = markup
      } else {
        this.execute(new MarkupChange(this, markup), 'markup', options)
      }
    }
  }

  // #endregion

  // #region attrs

  get arrts() {
    return this._attrs
  }

  set attrs(value: JSONObject) {
    this.setAttrs(value)
  }

  setAttrs(attrs: JSONObject, options: Cell.SetOptions = {}) {
    if (options.force || JSONExt.deepEqual(this.arrts, attrs)) {
      if (options.silent) {
        this._attrs = JSONExt.deepCopy(attrs)
      } else {
        this.execute(new AttrsChange(this, attrs), 'attrs', options)
      }
    }
  }

  // #endregion

  // #region parent & children

  get parent() {
    return this._parent
  }

  get children() {
    return this._children
  }

  hasParent() {
    return this.parent != null
  }

  getParent() {
    return this.parent
  }

  isParentOf(child: Cell | null): boolean {
    return child != null && child.getParent() === this
  }

  isChildOf(parent: Cell | null): boolean {
    return parent != null && this.getParent() === parent
  }

  getChildren() {
    return this.children
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

  setParent(parent: Cell, options: Cell.SetOptions = {}) {
    if (options.force || this.parent !== parent) {
      if (options.silent || parent == null) {
        this._parent = parent
      } else {
        parent.insertChild(this, undefined, options)
      }
    }
  }

  removeFromParent(options: Cell.SetOptions = {}) {
    if (this.parent != null) {
      const index = this.parent.getChildIndex(this)
      this.parent.removeChildAt(index, options)
    }
  }

  insertChild(
    child: Cell | null,
    index?: number,
    options: Cell.SetOptions = {},
  ) {
    if (child != null && child !== this) {
      let pos = index
      if (pos == null) {
        pos = this.getChildCount()
        if (child.getParent() === this) {
          pos -= 1
        }
      }

      const changed = this !== child.getParent()
      if (options.silent) {
        child.removeFromParent(options)
        child.setParent(this, options)
        if (this._children == null) {
          this._children = []
          this._children.push(child)
        } else {
          this._children.splice(pos, 0, child)
        }
      } else {
        this.execute(new ChildChange(this, child, pos), 'add', options)
      }

      if (changed) {
        // this.updateEdgeParents(child)
      }
    }

    return this
  }

  removeChild(child: Cell, options: Cell.SetOptions = {}) {
    const index = this.getChildIndex(child)
    return this.removeChildAt(index, options)
  }

  removeChildAt(index: number, options: Cell.SetOptions = {}) {
    let child = null

    if (this.children != null && index >= 0) {
      child = this.getChildAt(index)
      if (child != null) {
        if (options.silent) {
          child.setParent(null as any, options)
          this.children.splice(index, 1)
        } else {
          this.execute(new ChildChange(null, child, index), 'remove', options)
        }
      }
    }

    return child
  }

  // #endregion

  // #region visible

  get visible() {
    return this._visible
  }

  set visible(value: boolean) {
    this.setVisible(value)
  }

  setVisible(visible: boolean, options: Cell.SetOptions = {}) {
    if (options.force || visible !== this.visible) {
      if (options.silent) {
        this._visible = visible
      } else {
        this.execute(new VisibleChange(this, visible), 'visible', options)
      }
    }
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

  // #region transition

  protected transitionIds: { [path: string]: number }

  transition<T extends string | number | { [key: string]: number }>(
    path: string,
    target: T,
    options: Cell.TransitionOptions = {},
    delim = '/',
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

    const current = ObjectExt.getByPath(this.attrs, path, delim)

    let interpolate: any
    if (typeof target === 'object') {
      interpolate = Interpolation.object(current, target as any)
    } else if (typeof target === 'number') {
      interpolate = Interpolation.number(current, target)
    } else if (typeof target === 'string') {
      if (target[0] === '#') {
        interpolate = Interpolation.color(current, target)
      } else {
        interpolate = Interpolation.unit(current, target)
      }
    }

    let startTime = 0

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
        this.transitionIds[path] = id = DomUtil.requestAnimationFrame(setter)
      } else {
        progress = 1
        delete this.transitionIds[path]
      }

      val = interpolate(easing(progress))
      options.transitionId = id

      this.set(path, val)

      if (id == null) {
        this.trigger('transition:end', this, path)
      }
    }

    const initiator = (transition: FrameRequestCallback) => {
      this.stopTransitions(path, delim)
      this.transitionIds[path] = DomUtil.requestAnimationFrame(transition)
      this.trigger('transition:begin', this, path)
    }

    return setTimeout(() => {
      initiator(setter)
    }, options.delay)
  }

  getTransitions() {
    return Object.keys(this.transitionIds)
  }

  stopTransitions(path: string, delim: string = '/') {
    const arr = path && path.split(delim)

    Object.keys(this.transitionIds)
      .filter(key =>
        JSONExt.deepEqual(arr, key.split(delim).slice(0, arr.length)),
      )
      .forEach(key => {
        DomUtil.cancelAnimationFrame(this.transitionIds[key])
        delete this.transitionIds[key]
        this.trigger('transition:end', this, key)
      })

    return this
  }

  protected set(path: string, val: any) {}

  // #endregion

  toJSON() {}

  clone() {}

  getBBox(options: { deep?: boolean } = {}) {
    return new Rectangle(0, 0, 0, 0)
  }

  protected execute(change: IChange, name: string, data?: KV) {
    this.trigger('change', change)
    if (this.model) {
      this.model.execute(change, name, data)
    } else {
      change.execute()
    }
    this.trigger('changed', change)
  }

  protected batchUpdate<T>(name: string, update: () => T, data: KV = {}) {
    if (this.model) {
      return this.model.batchUpdate(name, update, data)
    }

    return update()
  }
}

export namespace Cell {
  export interface SetOptions extends KV {
    force?: boolean
    silent?: boolean
  }

  export interface TransitionOptions extends KV {
    delay?: number
    duration?: number
    easing?: Easing.Names | Easing.Func
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
        const rotation = (cell as Node).rotation
        if (rotation != null) {
          rect = rect.bbox(rotation)
        }

        bbox.union(rect)
      }
    })

    return bbox
  }
}

export namespace Cell {
  const options = { force: true, silent: true }

  export function executeChildChange(
    child: Cell,
    parent: Cell | null,
    index?: number,
  ) {
    const previous = child.getParent()
    if (parent != null) {
      if (parent !== previous || previous.getChildIndex(child) !== index) {
        parent.insertChild(child, index, { ...options })
      }
    } else if (previous != null) {
      previous.removeChild(child, { ...options })
    }

    return previous
  }

  export function executeMarkupChange(cell: Cell, markup: string) {
    const previous = cell.markup
    this.setMarkup(markup, { ...options })
    return previous
  }

  export function executeAttrsChange(cell: Cell, attrs: JSONObject) {
    const previous = cell.attrs
    this.setAttrs(attrs, { ...options })
    return previous
  }

  export function executeVisibleChange(cell: Cell, visible: boolean) {
    const previous = cell.visible
    this.setVisible(visible, { ...options })
    return previous
  }
}
