export {
  // kebabCase,
  // startCase,
  // snakeCase,
  // lowerCase,
  // upperCase,
  // capitalize,
  lowerFirst,
  upperFirst,
  camelCase,
} from 'lodash-es'

import {
  camelCase,
  startCase,
  upperCase,
  lowerCase,
  upperFirst,
} from 'lodash-es'

// @see: https://medium.com/@robertsavian/javascript-case-converters-using-lodash-4f2f964091cc

export function pascalCase(str?: string) {
  return startCase(camelCase(str)).replace(/ /g, '')
}

export function constantCase(str?: string) {
  return upperCase(str).replace(/ /g, '_')
}

export function dotCase(str?: string) {
  return lowerCase(str).replace(/ /g, '.')
}

export function pathCase(str?: string) {
  return lowerCase(str).replace(/ /g, '/')
}

export function sentenceCase(str?: string) {
  return upperFirst(lowerCase(str))
}

export function titleCase(str?: string) {
  return startCase(camelCase(str))
}
