import { Background } from './index'

export const flipXY: Background.Definition = function (img) {
  // d b
  // q p

  const canvas = document.createElement('canvas')
  const width = img.width
  const height = img.height

  canvas.width = 2 * width
  canvas.height = 2 * height

  const ctx = canvas.getContext('2d')!
  // top-left image
  ctx.drawImage(img, 0, 0, width, height)
  // xy-flipped bottom-right image
  ctx.setTransform(-1, 0, 0, -1, canvas.width, canvas.height)
  ctx.drawImage(img, 0, 0, width, height)
  // x-flipped top-right image
  ctx.setTransform(-1, 0, 0, 1, canvas.width, 0)
  ctx.drawImage(img, 0, 0, width, height)
  // y-flipped bottom-left image
  ctx.setTransform(1, 0, 0, -1, 0, canvas.height)
  ctx.drawImage(img, 0, 0, width, height)

  return canvas
}
