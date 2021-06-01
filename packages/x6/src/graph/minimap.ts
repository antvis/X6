import { Base } from './base'
import { MiniMap } from '../addon/minimap'

export class MiniMapManager extends Base {
  public widget: MiniMap | null

  protected get widgetOptions() {
    return this.options.minimap
  }

  protected init() {
    this.widget = this.graph.hook.createMiniMap()
  }

  @Base.dispose()
  dispose() {
    if (this.widget) {
      this.widget.dispose()
    }
  }
}

export namespace MiniMapManager {
  export interface Options
    extends Omit<MiniMap.Options, 'graph' | 'container'> {
    enabled: boolean
    container: HTMLElement
  }
}
