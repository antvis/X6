import { Background } from './index'

export const flipX: Background.Definition = function (img) {
  // d b
  // d b

  const canvas = document.createElement('canvas')
  const width = img.width
  const height = img.height

  canvas.width = width * 2
  canvas.height = height

  const ctx = canvas.getContext('2d')!
  // left image
  ctx.drawImage(img, 0, 0, width, height)
  // flipped right image
  ctx.translate(2 * width, 0)
  ctx.scale(-1, 1)
  ctx.drawImage(img, 0, 0, width, height)

  return canvas
}
