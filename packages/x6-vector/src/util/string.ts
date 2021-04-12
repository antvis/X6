export const ucfirst = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
export const lcfirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1)

export function camelCase(str: string) {
  return str.replace(/-([a-z])/g, (input) => input[1].toUpperCase())
}
