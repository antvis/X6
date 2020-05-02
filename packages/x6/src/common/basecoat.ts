import { ObjectExt } from '../util'
import { Events } from './events'
import { Disposable } from './disposable'

export class Basecoat<EventArgs = any> extends Events<EventArgs> {}

export interface Basecoat extends Disposable {}

export namespace Basecoat {
  export const dispose = Disposable.dispose
}

ObjectExt.applyMixins(Basecoat, Disposable)
