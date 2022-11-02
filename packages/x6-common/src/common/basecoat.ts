import { Events } from '../event'
import { EventArgs } from '../event/types'
import { ObjectExt } from '../object'
import { Disposable } from './disposable'

export class Basecoat<A extends EventArgs = any> extends Events<A> {}

export interface Basecoat extends Disposable {}

export namespace Basecoat {
  export const dispose = Disposable.dispose
}

ObjectExt.applyMixins(Basecoat, Disposable)
