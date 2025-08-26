/**
 * 将回调函数变成 promise
 * @param fn 
 * @returns 
 */
export function promisify<T>(fn: (callback: (result: T) => void) => void): Promise<T> {
  return new Promise<T>((resolve) => {
    fn((result) => {
      resolve(result)
    })
  })
}
