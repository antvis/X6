import { ObjectExt } from '@antv/x6-util'
import { EventEmitter } from '@antv/x6-event-emitter'
import { Disposable } from './disposable'

export class Basecoat<EventArgs = any> extends EventEmitter<EventArgs> {}

export interface Basecoat extends Disposable {}

export namespace Basecoat {
  export const dispose = Disposable.dispose
}

ObjectExt.applyMixins(Basecoat, Disposable)
