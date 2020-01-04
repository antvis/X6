import { Events } from '@antv/x6-events'
import { Disposable } from './disposable'
import { applyMixins } from './util'

export class Basecoat<EventArgs = any> extends Events<EventArgs> {}

export interface Basecoat extends Disposable {}

export namespace Basecoat {
  export const dispose = Disposable.dispose
}

applyMixins(Basecoat, Disposable)
