import { DomUtil } from '../../util/dom'
import { Str } from '../../util/str'
import { Primer } from './primer'

export class Data<TNode extends Node> extends Primer<TNode> {
  data(): Record<string, any>
  data<T>(key: string): T
  data(keys: string[]): Record<string, any>
  data<T>(key: string, value: T, raw?: boolean): this
  data(
    key?: string | string[] | Record<string, any>,
    val?: any,
    raw?: boolean,
  ) {
    // Get all data
    if (key == null) {
      const elem = DomUtil.toElement(this.node)
      const attrs = elem.attributes
      const keys: string[] = []
      for (let i = 0, l = attrs.length; i < l; i += 1) {
        const item = attrs.item(i)
        if (item && item.nodeName.indexOf('data-')) {
          keys.push(item.nodeName.slice(5))
        }
      }
      return this.data(keys)
    }

    // Get specified data with keys
    if (Array.isArray(key)) {
      const data: Record<string, any> = {}
      key.forEach((k) => {
        // Return the camelCased key
        data[Str.camelCase(k)] = this.data(k)
      })
      return data
    }

    // Set with data object
    if (typeof key === 'object') {
      Object.keys(key).forEach((k) => this.data(k, key[k]))
      return this
    }

    const dataKey = Data.parseKey(key)

    // Get by key
    if (typeof val === 'undefined') {
      const value = this.attr(dataKey)
      return Data.parseValue(value)
    }

    // Set with key-value
    {
      const dataValue =
        val === null
          ? null
          : raw === true || typeof val === 'string' || typeof val === 'number'
          ? val
          : JSON.stringify(val)
      return this.attr(dataKey, dataValue)
    }
  }
}

export namespace Data {
  const rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/

  export function parseKey(key: string) {
    return `data-${key.replace(/[A-Z]/g, '-$&').toLowerCase()}`
  }

  export function parseValue(val: string | number | null) {
    if (val && typeof val === 'string') {
      if (val === 'true') {
        return true
      }

      if (val === 'false') {
        return false
      }

      if (val === 'null') {
        return null
      }

      // Only convert to a number if it doesn't change the string
      if (val === `${+val}`) {
        return +val
      }

      if (rbrace.test(val)) {
        try {
          return JSON.parse(val)
        } catch {
          // pass
        }
      }
    }

    return val
  }
}
