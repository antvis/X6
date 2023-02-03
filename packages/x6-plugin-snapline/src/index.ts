import { Disposable, CssLoader, Graph, EventArgs } from '@antv/x6'
import { SnaplineImpl } from './snapline'
import { content } from './style/raw'
import './api'

export class Snapline extends Disposable {
  private snaplineImpl: SnaplineImpl
  public options: Snapline.Options
  public name = 'snapline'

  constructor(options: Snapline.Options) {
    super()
    this.options = { tolerance: 10, ...options }
    CssLoader.ensure(this.name, content)
  }

  public init(graph: Graph) {
    this.snaplineImpl = new SnaplineImpl({
      ...this.options,
      graph,
    })
  }

  // #region api

  isEnabled() {
    return !this.snaplineImpl.disabled
  }

  enable() {
    this.snaplineImpl.enable()
  }

  disable() {
    this.snaplineImpl.disable()
  }

  toggleEnabled(enabled?: boolean) {
    if (enabled != null) {
      if (enabled !== this.isEnabled()) {
        if (enabled) {
          this.enable()
        } else {
          this.disable()
        }
      }
    } else {
      if (this.isEnabled()) {
        this.disable()
      } else {
        this.enable()
      }
      return this
    }
  }

  hide() {
    this.snaplineImpl.hide()
    return this
  }

  setFilter(filter?: SnaplineImpl.Filter) {
    this.snaplineImpl.setFilter(filter)
    return this
  }

  isOnResizingEnabled() {
    return this.snaplineImpl.options.resizing === true
  }

  enableOnResizing() {
    this.snaplineImpl.options.resizing = true
    return this
  }

  disableOnResizing() {
    this.snaplineImpl.options.resizing = false
    return this
  }

  toggleOnResizing(enableOnResizing?: boolean) {
    if (enableOnResizing != null) {
      if (enableOnResizing !== this.isOnResizingEnabled()) {
        if (enableOnResizing) {
          this.enableOnResizing()
        } else {
          this.disableOnResizing()
        }
      }
    } else if (this.isOnResizingEnabled()) {
      this.disableOnResizing()
    } else {
      this.enableOnResizing()
    }
    return this
  }

  isSharp() {
    return this.snaplineImpl.options.sharp === true
  }

  enableSharp() {
    this.snaplineImpl.options.sharp = true
    return this
  }

  disableSharp() {
    this.snaplineImpl.options.sharp = false
    return this
  }

  toggleSharp(sharp?: boolean) {
    if (sharp != null) {
      if (sharp !== this.isSharp()) {
        if (sharp) {
          this.enableSharp()
        } else {
          this.disableSharp()
        }
      }
    } else if (this.isSharp()) {
      this.disableSharp()
    } else {
      this.enableSharp()
    }
    return this
  }

  getTolerance() {
    return this.snaplineImpl.options.tolerance
  }

  setTolerance(tolerance: number) {
    this.snaplineImpl.options.tolerance = tolerance
    return this
  }

  captureCursorOffset(e: EventArgs['node:mousedown']) {
    this.snaplineImpl.captureCursorOffset(e)
  }

  snapOnMoving(args: EventArgs['node:mousemove']) {
    this.snaplineImpl.snapOnMoving(args)
  }

  // #endregion

  @Disposable.dispose()
  dispose() {
    this.snaplineImpl.dispose()
    CssLoader.clean(this.name)
  }
}

export namespace Snapline {
  export interface Options extends SnaplineImpl.Options {}
  export type Filter = SnaplineImpl.Filter
}
