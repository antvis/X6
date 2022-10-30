import { Disposable, CssLoader } from '@antv/x6-common'
import { Graph, EventArgs } from '@antv/x6'
import { SnaplineImpl } from './snapline'
import { content } from './style/raw'

export class Snapline extends Disposable {
  private snaplineImpl: SnaplineImpl
  public name = 'snapline'

  constructor(public readonly options: Snapline.Options) {
    super()
  }

  public init(graph: Graph) {
    CssLoader.ensure(this.name, content)
    this.snaplineImpl = new SnaplineImpl({
      ...this.options,
      graph,
    })
  }

  // #region api

  isSnaplineEnabled() {
    return !this.snaplineImpl.disabled
  }

  enableSnapline() {
    this.snaplineImpl.enable()
    return this
  }

  disableSnapline() {
    this.snaplineImpl.disable()
    return this
  }

  toggleSnapline(enabled?: boolean) {
    if (enabled != null) {
      if (enabled !== this.isSnaplineEnabled()) {
        if (enabled) {
          this.enableSnapline()
        } else {
          this.disableSnapline()
        }
      }
    } else {
      if (this.isSnaplineEnabled()) {
        this.disableSnapline()
      } else {
        this.enableSnapline()
      }
      return this
    }
  }

  hideSnapline() {
    this.snaplineImpl.hide()
    return this
  }

  setSnaplineFilter(filter?: SnaplineImpl.Filter) {
    this.snaplineImpl.setFilter(filter)
    return this
  }

  isSnaplineOnResizingEnabled() {
    return this.snaplineImpl.options.resizing === true
  }

  enableSnaplineOnResizing() {
    this.snaplineImpl.options.resizing = true
    return this
  }

  disableSnaplineOnResizing() {
    this.snaplineImpl.options.resizing = false
    return this
  }

  toggleSnaplineOnResizing(enableOnResizing?: boolean) {
    if (enableOnResizing != null) {
      if (enableOnResizing !== this.isSnaplineOnResizingEnabled()) {
        if (enableOnResizing) {
          this.enableSnaplineOnResizing()
        } else {
          this.disableSnaplineOnResizing()
        }
      }
    } else if (this.isSnaplineOnResizingEnabled()) {
      this.disableSnaplineOnResizing()
    } else {
      this.enableSnaplineOnResizing()
    }
    return this
  }

  isSharpSnapline() {
    return this.snaplineImpl.options.sharp === true
  }

  enableSharpSnapline() {
    this.snaplineImpl.options.sharp = true
    return this
  }

  disableSharpSnapline() {
    this.snaplineImpl.options.sharp = false
    return this
  }

  toggleSharpSnapline(sharp?: boolean) {
    if (sharp != null) {
      if (sharp !== this.isSharpSnapline()) {
        if (sharp) {
          this.enableSharpSnapline()
        } else {
          this.disableSharpSnapline()
        }
      }
    } else if (this.isSharpSnapline()) {
      this.disableSharpSnapline()
    } else {
      this.enableSharpSnapline()
    }
    return this
  }

  getSnaplineTolerance() {
    return this.snaplineImpl.options.tolerance
  }

  setSnaplineTolerance(tolerance: number) {
    this.snaplineImpl.options.tolerance = tolerance
    return this
  }

  captureCursorOffset(e: EventArgs['node:mousedown']) {
    this.snaplineImpl.captureCursorOffset(e)
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
}
