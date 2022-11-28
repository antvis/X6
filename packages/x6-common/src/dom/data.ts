import { StringExt } from '../string'

const dataset: WeakMap<Element, Record<string, any>> = new WeakMap()

export function getData(elem: Element, name: string) {
  const key = StringExt.camelCase(name)
  const cache = dataset.get(elem)
  if (cache) {
    return cache[key]
  }
}

export function setData(elem: Element, name: string, value: any) {
  const key = StringExt.camelCase(name)
  const cache = dataset.get(elem)
  if (cache) {
    cache[key] = value
  } else {
    dataset.set(elem, {
      [key]: value,
    })
  }
}

export function data(elem: Element): Record<string, any> | undefined
export function data(elem: Element, name: string): any
export function data(elem: Element, name: string, value: any): void
export function data(elem: Element, name: Record<string, any>): void
export function data(
  elem: Element,
  name?: string | Record<string, any>,
  value?: any,
) {
  if (!name) {
    const datas: Record<string, any> = {}
    Object.keys(dataset).forEach((key) => {
      datas[key] = getData(elem, key)
    })
    return datas
  }

  if (typeof name === 'string') {
    if (value === undefined) {
      return getData(elem, name)
    }
    setData(elem, name, value)

    return
  }

  // eslint-disable-next-line
  for (const key in name) {
    data(elem, key, name[key])
  }
}
