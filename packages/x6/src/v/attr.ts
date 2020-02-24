import { ns } from './elem'
import { isObject, isString, isUndefined } from './util'

export type Attributes = { [key: string]: string | number }

export function getAttribute(elem: Element, name: string) {
  return elem.getAttribute(name)
}

export function removeAttribute(elem: Element, name: string) {
  const qualified = qualifyAttr(name)
  if (qualified.ns) {
    if (elem.hasAttributeNS(qualified.ns, qualified.local)) {
      elem.removeAttributeNS(qualified.ns, qualified.local)
    }
  } else if (elem.hasAttribute(name)) {
    elem.removeAttribute(name)
  }
}

export function setAttribute(
  elem: Element,
  name: string,
  value?: string | number | null,
) {
  if (value == null) {
    return removeAttribute(elem, name)
  }

  const qualified = qualifyAttr(name)
  if (qualified.ns && isString(value)) {
    elem.setAttributeNS(qualified.ns, name, value)
  } else if (name === 'id') {
    elem.id = `${value}`
  } else {
    elem.setAttribute(name, `${value}`)
  }
}

export function setAttributes(
  elem: Element,
  attrs: { [attr: string]: string | number | null | undefined },
) {
  Object.keys(attrs).forEach(name => {
    setAttribute(elem, name, attrs[name])
  })
}

export function attr(elem: Element): { [attr: string]: string }
export function attr(elem: Element, name: string): string
export function attr(
  elem: Element,
  attrs: { [attr: string]: string | number | null | undefined },
): void
export function attr(
  elem: Element,
  name: string,
  value: string | number | null | undefined,
): void
export function attr(
  elem: Element,
  name?: string | { [attr: string]: string | number | null | undefined },
  value?: string | number | null | undefined,
) {
  if (name == null) {
    const attrs = elem.attributes
    const ret: { [name: string]: string } = {}
    for (let i = 0; i < attrs.length; i += 1) {
      ret[attrs[i].name] = attrs[i].value
    }
    return ret
  }

  if (isString(name) && isUndefined(value)) {
    return elem.getAttribute(name)
  }

  if (typeof name === 'object') {
    setAttributes(elem, name)
  } else {
    setAttribute(elem, name as string, value)
  }
}

export function qualifyAttr(name: string) {
  if (name.indexOf(':') !== -1) {
    const combinedKey = name.split(':')
    return {
      ns: (ns as any)[combinedKey[0]],
      local: combinedKey[1],
    }
  }

  return {
    ns: null,
    local: name,
  }
}

export function styleToObject(styleString: string) {
  const ret: { [name: string]: string } = {}
  const styles = styleString.split(';')
  styles.forEach(item => {
    const section = item.trim()
    if (section) {
      const pair = section.split('=')
      if (pair.length) {
        ret[pair[0].trim()] = pair[1] ? pair[1].trim() : ''
      }
    }
  })
  return ret
}

export function mergeAttrs(
  target: { [attr: string]: any },
  source: { [attr: string]: any },
) {
  Object.keys(source).forEach(attr => {
    if (attr === 'class') {
      target[attr] = target[attr]
        ? `${target[attr]} ${source[attr]}`
        : source[attr]
    } else if (attr === 'style') {
      const to = isObject(target[attr])
      const so = isObject(source[attr])

      let tt
      let ss

      if (to && so) {
        tt = target[attr]
        ss = source[attr]
      } else if (to) {
        tt = target[attr]
        ss = styleToObject(source[attr])
      } else if (so) {
        tt = styleToObject(target[attr])
        ss = source[attr]
      } else {
        tt = styleToObject(target[attr])
        ss = styleToObject(source[attr])
      }

      target[attr] = mergeAttrs(tt, ss)
    } else {
      target[attr] = source[attr]
    }
  })

  return target
}
