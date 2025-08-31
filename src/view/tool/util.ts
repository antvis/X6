import { StringExt } from '../../common'

let counter = 0
export function getClassName(name?: string) {
  if (name) {
    return StringExt.pascalCase(name)
  }
  counter += 1
  return `CustomTool${counter}`
}
