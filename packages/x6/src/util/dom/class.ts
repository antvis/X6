const rclass = /[\t\r\n\f]/g
const rnotwhite = /\S+/g

const fillSpaces = (str: string) => ` ${str} `

export function getClass(elem: Element) {
  return (elem && elem.getAttribute && elem.getAttribute('class')) || ''
}

export function hasClass(elem: Element | null, selector: string | null) {
  if (elem == null || selector == null) {
    return false
  }

  const classNames = fillSpaces(getClass(elem))
  const className = fillSpaces(selector)

  return elem.nodeType === 1
    ? classNames.replace(rclass, ' ').includes(className)
    : false
}

export function addClass(
  elem: Element | null,
  selector: ((cls: string) => string) | string | null,
): void {
  if (elem == null || selector == null) {
    return
  }

  if (typeof selector === 'function') {
    return addClass(elem, selector(getClass(elem)))
  }

  if (typeof selector === 'string' && elem.nodeType === 1) {
    const classes = selector.match(rnotwhite) || []
    const oldValue = fillSpaces(getClass(elem)).replace(rclass, ' ')
    let newValue = classes.reduce((memo, cls) => {
      if (memo.indexOf(fillSpaces(cls)) < 0) {
        return `${memo}${cls} `
      }
      return memo
    }, oldValue)

    newValue = newValue.trim()

    if (oldValue !== newValue) {
      elem.setAttribute('class', newValue)
    }
  }
}

export function removeClass(
  elem: Element | null,
  selector?: ((cls: string) => string) | string | null,
): void {
  if (elem == null) {
    return
  }

  if (typeof selector === 'function') {
    return removeClass(elem, selector(getClass(elem)))
  }

  if ((!selector || typeof selector === 'string') && elem.nodeType === 1) {
    const classes = (selector || '').match(rnotwhite) || []
    const oldValue = fillSpaces(getClass(elem)).replace(rclass, ' ')
    let newValue = classes.reduce((memo, cls) => {
      const className = fillSpaces(cls)
      if (memo.indexOf(className) > -1) {
        return memo.replace(className, ' ')
      }

      return memo
    }, oldValue)

    newValue = selector ? newValue.trim() : ''

    if (oldValue !== newValue) {
      elem.setAttribute('class', newValue)
    }
  }
}

export function toggleClass(
  elem: Element | null,
  selector: ((cls: string, state?: boolean) => string) | string | null,
  stateVal?: boolean,
): void {
  if (elem == null || selector == null) {
    return
  }

  if (stateVal != null && typeof selector === 'string') {
    stateVal ? addClass(elem, selector) : removeClass(elem, selector)

    return
  }

  if (typeof selector === 'function') {
    return toggleClass(elem, selector(getClass(elem), stateVal), stateVal)
  }

  if (typeof selector === 'string') {
    const metches = selector.match(rnotwhite) || []
    metches.forEach((cls) => {
      hasClass(elem, cls) ? removeClass(elem, cls) : addClass(elem, cls)
    })
  }
}
