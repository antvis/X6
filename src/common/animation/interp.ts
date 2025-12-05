/**
 * @file 插值函数
 * 提供数字、对象、单位、颜色、transform的插值函数。
 */
import { unitReg } from './util'

export type Definition<T> = (from: T, to: T) => (time: number) => T

export const number: Definition<number> = (a, b) => {
  const d = b - a
  return (t: number) => {
    return a + d * t
  }
}

export const object: Definition<{ [key: string]: number }> = (a, b) => {
  const keys = Object.keys(a)
  return (t) => {
    const ret: { [key: string]: number } = {}
    for (let i = keys.length - 1; i !== -1; i -= 1) {
      const key = keys[i]
      ret[key] = a[key] + (b[key] - a[key]) * t
    }
    return ret
  }
}

export const unit: Definition<string> = (a, b) => {
  const reg = unitReg
  const ma = reg.exec(a)
  const mb = reg.exec(b)

  const pb = mb ? mb[1] : ''
  const aa = ma ? +ma[1] : 0
  const bb = mb ? +mb[1] : 0

  const index = pb.indexOf('.')
  const precision = index > 0 ? pb[1].length - index - 1 : 0

  const d = bb - aa
  const u = ma ? ma[2] : ''

  return (t) => {
    return (aa + d * t).toFixed(precision) + u
  }
}

export const color: Definition<string> = (a, b) => {
  const ca = parseInt(a.slice(1), 16)
  const cb = parseInt(b.slice(1), 16)
  const ra = ca & 0x0000ff
  const rd = (cb & 0x0000ff) - ra
  const ga = ca & 0x00ff00
  const gd = (cb & 0x00ff00) - ga
  const ba = ca & 0xff0000
  const bd = (cb & 0xff0000) - ba

  return (t) => {
    const r = (ra + rd * t) & 0x000000ff
    const g = (ga + gd * t) & 0x0000ff00
    const b = (ba + bd * t) & 0x00ff0000
    return `#${((1 << 24) | r | g | b).toString(16).slice(1)}`
  }
}

export const transform: Definition<string> = (a, b) => {
  // 解析 transform 字符串中的函数和参数
  const parseTransform = (str: string) => {
    const result: Array<{ name: string; values: string[] }> = []
    if (!str) return result

    const regex = /(\w+)\(([^)]+)\)/g
    let match: RegExpExecArray | null = regex.exec(str)
    while (match !== null) {
      if (match[1] && match[2]) {
        result.push({
          name: match[1],
          values: match[2].split(/\s*,\s*/).filter(Boolean),
        })
      }
      match = regex.exec(str)
    }
    return result
  }

  const from = parseTransform(a)
  const to = parseTransform(b)
  if (from.length === 0 || to.length === 0) {
    return () => a // 如果无法解析，返回初始值
  }

  return (t: number) => {
    const transforms: string[] = []

    // 对每个 transform 函数进行插值
    for (let i = 0; i < Math.min(from.length, to.length); i++) {
      const fromFunc = from[i]
      const toFunc = to[i]
      if (!fromFunc || !toFunc) continue

      if (
        fromFunc.name === toFunc.name &&
        fromFunc.values.length > 0 &&
        fromFunc.values.length === toFunc.values.length
      ) {
        const values: string[] = []

        // 对每个参数进行插值
        for (let j = 0; j < fromFunc.values.length; j++) {
          const fromVal = fromFunc.values[j]
          const toVal = toFunc.values[j]
          if (fromVal === undefined || toVal === undefined) continue

          // 检查是否是带单位的值
          if (unitReg.test(fromVal) || unitReg.test(toVal)) {
            // 使用 unit 插值函数处理带单位的值
            const interpolate = unit(fromVal, toVal)
            values.push(interpolate(t))
          } else if (
            !Number.isNaN(parseFloat(fromVal)) &&
            !Number.isNaN(parseFloat(toVal))
          ) {
            // 使用 number 插值函数处理纯数字
            const interpolate = number(parseFloat(fromVal), parseFloat(toVal))
            values.push(interpolate(t).toString())
          } else {
            // 无法解析的值保持原样
            values.push(fromVal)
          }
        }

        if (values.length > 0) {
          transforms.push(`${fromFunc.name}(${values.join(', ')})`)
        }
      }
    }

    return transforms.length > 0 ? transforms.join(' ') : a
  }
}
