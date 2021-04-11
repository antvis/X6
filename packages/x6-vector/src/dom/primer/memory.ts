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

    const memory = this.memory()
    if (typeof v === 'undefined') {
      return memory[k]
    }

    if (v == null) {
      this.forget(k)
    } else {
      memory[k] = v
    }

    return this
  }

  forget(...keys: string[]) {
    if (keys.length === 0) {
      this.memo = {}
    } else {
      const memory = this.memory()
      keys.forEach((key) => delete memory[key])
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
