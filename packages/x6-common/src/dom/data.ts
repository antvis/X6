import { StringExt } from '../string'

export function getData(dataset: Record<string, any>, name: string) {
  const value = dataset[name] || dataset[StringExt.camelCase(name)]
  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}

export function setData(
  dataset: Record<string, any>,
  name: string,
  value: any,
) {
  let val = value
  try {
    val = JSON.stringify(val)
  } catch (e) {
    // paas
  }
  dataset[StringExt.camelCase(name)] = val
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
    const dataset = (elem as any).dataset
    // eslint-disable-next-line
    for (const key in dataset) {
      datas[key] = getData(dataset, key)
    }
    return datas
  }

  if (typeof name === 'string') {
    const dataset = (elem as any).dataset
    if (value === undefined) {
      return getData(dataset, name)
    }
    setData(dataset, name, value)

    return
  }

  // eslint-disable-next-line
  for (const key in name) {
    data(elem, key, name[key])
  }
}
