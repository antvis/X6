import { Events } from '../event'
import type { EventArgs } from '../event/types'
import { ObjectExt } from '../object'
import { Disposable, disposable } from './disposable'

export class Basecoat<A extends EventArgs = any>
  extends Events<A>
  implements Disposable
{
  @disposable()
  dispose() {
    this.off()
  }
}

export interface Basecoat extends Disposable {}

ObjectExt.applyMixins(Basecoat, Disposable)
