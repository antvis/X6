import { Base } from '../common/base'

export class Memory<TElement extends Element> extends Base<TElement> {
  private memo: Record<string, any>

  remember(obj: Record<string, any>): this
  remember<T>(key: string): T
  remember<T>(key: string, v: T): this
  remember<T>(k: Record<string, any> | string, v?: T) {
    if (typeof k === 'object') {
      Object.keys(k).forEach((key) => this.remember(key, k[key]))
      return this
    }

    if (arguments.length === 1) {
      return this.memory()[k]
    }

    this.memory()[k] = v
    return this
  }

  forget(...keys: string[]) {
    if (keys.length === 0) {
      this.memo = {}
    } else {
      keys.forEach((key) => delete this.memory()[key])
    }
    return this
  }

  memory() {
    if (this.memo == null) {
      this.memo = {}
    }
    return this.memo
  }
}
