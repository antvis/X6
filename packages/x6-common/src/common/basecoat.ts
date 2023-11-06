import { Events } from '../event'
import { EventArgs } from '../event/types'
import { ObjectExt } from '../object'
import { Disposable } from './disposable'

export class Basecoat<A extends EventArgs = any>
  extends Events<A>
  implements Disposable
{
  @Disposable.dispose()
  dispose() {
    this.off()
  }
}

export interface Basecoat extends Disposable {}

export namespace Basecoat {
  export const dispose = Disposable.dispose
}

ObjectExt.applyMixins(Basecoat, Disposable)
