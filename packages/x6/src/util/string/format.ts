import {
  camelCase,
  startCase,
  upperCase,
  lowerCase,
  upperFirst,
} from 'lodash-es'

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

// @see: https://medium.com/@robertsavian/javascript-case-converters-using-lodash-4f2f964091cc

const cacheStringFunction = <T extends (str: string) => string>(fn: T): T => {
  const cache: Record<string, string> = Object.create(null)
  return ((str: string) => {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  }) as any
}

export const kebabCase = cacheStringFunction((s: string) =>
  s.replace(/\B([A-Z])/g, '-$1').toLowerCase(),
)

export const pascalCase = cacheStringFunction((s: string) =>
  startCase(camelCase(s)).replace(/ /g, ''),
)

export const constantCase = cacheStringFunction((s: string) =>
  upperCase(s).replace(/ /g, '_'),
)

export const dotCase = cacheStringFunction((s: string) =>
  lowerCase(s).replace(/ /g, '.'),
)

export const pathCase = cacheStringFunction((s: string) =>
  lowerCase(s).replace(/ /g, '/'),
)

export const sentenceCase = cacheStringFunction((s: string) =>
  upperFirst(lowerCase(s)),
)

export const titleCase = cacheStringFunction((s: string) =>
  startCase(camelCase(s)),
)
