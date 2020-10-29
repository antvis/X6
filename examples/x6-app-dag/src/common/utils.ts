export { unescape } from 'lodash-es'

export class Deferred<T> {
  resolve!: (value?: T) => void

  reject!: (err?: any) => void

  promise: Promise<T>

  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }
}

// 解析 JSON 字符串不引起报错
export const safeJson = (jsonStr = '{}', defaultVal = {}) => {
  try {
    return JSON.parse(jsonStr)
  } catch (error) {
    console.warn(`${jsonStr} is not valid json`)
    return defaultVal
  }
}

export class CodeName {
  static parse(codeName = '') {
    return codeName.replace(/_\d+$/, '').toLocaleLowerCase()
  }

  static equal(c1: string, c2: string) {
    return CodeName.parse(c1) === CodeName.parse(c2)
  }

  static some(list: string[], c2: string) {
    return list.some((c1) => CodeName.equal(c1, c2))
  }

  static getFromNode(node: any = {}) {
    const { codeName = '' } = node
    return CodeName.parse(codeName)
  }
}

export const isPromise = (obj: any) =>
  !!obj &&
  (typeof obj === 'object' || typeof obj === 'function') &&
  typeof obj.then === 'function'
