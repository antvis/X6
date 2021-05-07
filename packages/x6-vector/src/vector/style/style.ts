import { Vector } from '../vector/vector'

@Style.register('Style')
export class Style extends Vector<SVGStyleElement> {
  addText(content = '') {
    this.node.textContent += content
    return this
  }

  addFont(
    name: string,
    source: string,
    parameters: Record<string, string | number> = {},
  ) {
    return this.addRule('@font-face', {
      fontFamily: name,
      src: source,
      ...parameters,
    })
  }

  addRule(
    selector?: string,
    object?: Record<string | number, string | number>,
  ) {
    return this.addText(Style.cssRule(selector, object))
  }
}

export namespace Style {
  const unCamelCase = (s: string) => {
    return s.replace(/([A-Z])/g, (m, g) => `-${g.toLowerCase()}`)
  }

  export function cssRule(
    selector?: string,
    rule?: Record<string | number, string | number>,
  ) {
    if (!selector) {
      return ''
    }

    if (!rule) {
      return selector
    }

    let ret = `${selector} {`

    Object.keys(rule).forEach((key) => {
      ret += `${unCamelCase(key)}: ${rule[key]};`
    })

    ret += '}'

    return ret
  }
}
