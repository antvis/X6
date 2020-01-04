import { EventEmitter } from '@antv/x6-eventemitter'
import { Disposable } from './disposable'
import { applyMixins } from './util'

export class Basecoat<EventArgs = any> extends EventEmitter<EventArgs> {}

export interface Basecoat extends Disposable {}

export namespace Basecoat {
  export const dispose = Disposable.dispose
}

applyMixins(Basecoat, Disposable)
