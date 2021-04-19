import { Env } from '../../global/env'
import { Special } from './special'
import { Hook } from './hook'
import { Util } from './util'

export namespace Core {
  const ATTRIBUTE_NAME_START_CHAR = `:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD`
  const ATTRIBUTE_NAME_CHAR = `${ATTRIBUTE_NAME_START_CHAR}\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040`
  // eslint-disable-next-line
  const VALID_ATTRIBUTE_NAME_REGEX = new RegExp(
    `^[${ATTRIBUTE_NAME_START_CHAR}][${ATTRIBUTE_NAME_CHAR}]*$`,
  )

  const illegalNames: { [key: string]: true } = {}
  const validedNames: { [key: string]: true } = {}

  export function isAttributeNameSafe(attributeName: string): boolean {
    if (attributeName in validedNames) {
      return true
    }
    if (attributeName in illegalNames) {
      return false
    }

    if (VALID_ATTRIBUTE_NAME_REGEX.test(attributeName)) {
      validedNames[attributeName] = true
      return true
    }

    illegalNames[attributeName] = true

    if (Env.isDev) {
      console.error('Invalid attribute name: `%s`', attributeName)
    }

    return false
  }
}

export namespace Core {
  export function shouldRemoveAttribute(name: string, value: any): boolean {
    const special = Special.get(name)
    if (special !== null) {
      if (special.mustUseProperty) {
        return false
      }
    }

    if (value === null) {
      return true
    }

    if (
      special == null &&
      (typeof value === 'function' || typeof value === 'symbol')
    ) {
      return true
    }

    if (typeof value === 'boolean') {
      if (special !== null) {
        if (!special.acceptsBooleans) {
          return true
        }
      }
    }

    if (special !== null) {
      if (special.removeEmptyString && value === '') {
        if (Env.isDev) {
          if (name === 'src' || name === 'href' || name === 'xlinkHref') {
            console.error(
              'An empty string ("") was passed to the %s attribute. ' +
                'This may cause the browser to download the whole page again over the network. ' +
                'To fix this, either do not render the element at all ' +
                'or pass null to %s instead of an empty string.',
              name,
              name,
            )
          } else {
            console.error(
              'An empty string ("") was passed to the %s attribute. ' +
                'To fix this, either do not render the element at all ' +
                'or pass null to %s instead of an empty string.',
              name,
              name,
            )
          }
          return true
        }
      }

      switch (special.type) {
        case Special.Type.BOOLEAN:
          return !(value === true || value === 'true')
        case Special.Type.OVERLOADED_BOOLEAN:
          return value === false
        case Special.Type.NUMERIC:
          return Number.isNaN(value)
        case Special.Type.POSITIVE_NUMERIC:
          return Number.isNaN(value) || value < 1
        default:
          return false
      }
    }

    return false
  }
}

export namespace Core {
  export function getAttributeNameInElement(name: string) {
    const special = Special.get(name)
    return special ? special.attributeName : name
  }

  export function getAttributeNameInResult(name: string) {
    const special = Special.get(name)
    const ret = special ? special.propertyName : name
    return ret === name ? Util.camelCase(name) : ret
  }

  export function getAttribute<TElement extends Element>(
    node: TElement,
    name: string,
    value: string | undefined,
  ) {
    const hook = Hook.get(name)
    if (hook && hook.get) {
      const result = hook.get(node)
      if (typeof result !== 'undefined') {
        return result
      }
    }

    const special = Special.get(name)
    if (special) {
      if (special.mustUseProperty) {
        const el = node as any
        value = el[special.propertyName] // eslint-disable-line
      }

      if (
        special.type === Special.Type.BOOLEAN ||
        special.type === Special.Type.OVERLOADED_BOOLEAN
      ) {
        if (typeof value === 'string') {
          const cased = value.toLowerCase()
          if (cased === 'true') {
            return true
          }

          if (cased === 'false') {
            return false
          }
        }

        if (special.mustUseProperty) {
          return value
        }

        return value == null ? node.hasAttribute(name) : value
      }

      if (special.type === Special.Type.BOOLEANISH_STRING) {
        if (typeof value === 'string') {
          const cased = value.toLowerCase()
          if (cased === 'true') {
            return true
          }

          if (cased === 'false') {
            return false
          }
        }

        return false
      }

      if (
        special.type === Special.Type.NUMERIC ||
        special.type === Special.Type.POSITIVE_NUMERIC
      ) {
        const num = Util.tryConvertToNumber(value)
        return typeof num === 'number' && Number.isFinite(num) ? num : undefined
      }
    }

    if (value === 'true') {
      return true
    }

    if (value === 'false') {
      return false
    }

    return Util.tryConvertToNumber(value)
  }

  export function setAttribute<TElement extends Element>(
    node: TElement,
    name: string,
    value: any,
  ) {
    const hook = Hook.get(name)
    if (hook && hook.set) {
      const ret = hook.set(node, value)
      if (ret === false) {
        return
      }
      value = ret // eslint-disable-line
    }

    const special = Special.get(name)
    if (special == null) {
      if (isAttributeNameSafe(name)) {
        node.setAttribute(name, value)
      }
    } else {
      const { mustUseProperty, propertyName } = special
      if (mustUseProperty) {
        const el = node as any
        if (value === null) {
          el[propertyName] = special.type === Special.Type.BOOLEAN ? false : ''
        } else {
          el[propertyName] = value
        }
        return
      }

      const { attributeName } = special

      let attributeValue: string | undefined

      if (
        (special.type === Special.Type.BOOLEAN ||
          special.type === Special.Type.OVERLOADED_BOOLEAN) &&
        (value === true || value === 'true')
      ) {
        attributeValue = ''
      } else {
        attributeValue = `${value}`
        if (special.sanitizeURL) {
          Util.sanitizeURL(attributeName, attributeValue)
        }
      }

      if (special.attributeNamespace) {
        node.setAttributeNS(
          special.attributeNamespace,
          attributeName,
          attributeValue,
        )
      } else {
        node.setAttribute(attributeName, attributeValue)
      }
    }
  }
}
