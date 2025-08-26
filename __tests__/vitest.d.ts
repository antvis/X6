import 'vitest'

interface CustomMatchers<R = unknown> {
  toMatchDOMSnapshot: (dir: string, name: string, options?: object) => R
}

declare module 'vitest' {
  interface Matchers<T = any> extends CustomMatchers<T> {}
}

declare global {
  namespace Vitest {
    interface Assertion extends CustomMatchers {}
  }
}