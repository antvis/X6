import { Snapline } from '../addon/snapline'
import { Base } from './base'

export class SnaplineManager extends Base {
  public readonly widget: Snapline = this.graph.hook.createSnapline()
}

export namespace SnaplineManager {
  export type Filter = Snapline.Filter

  export interface Options extends Snapline.Options {}
}
