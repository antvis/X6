export const sleep = (ms = 100): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
