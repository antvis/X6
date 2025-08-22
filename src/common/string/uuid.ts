/* eslint-disable no-bitwise */
export function uuid(): string {
  // credit: http://stackoverflow.com/posts/2117523/revisions
  // return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
  //   const r = (Math.random() * 16) | 0
  //   const v = c === 'x' ? r : (r & 0x3) | 0x8
  //   return v.toString(16)
  // })

  let res = ''
  const template = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'

  for (let i = 0, len = template.length; i < len; i += 1) {
    const s = template[i]
    const r = (Math.random() * 16) | 0
    const v = s === 'x' ? r : s === 'y' ? (r & 0x3) | 0x8 : s
    res += v.toString(16)
  }
  return res
}
