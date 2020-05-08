import { Background } from './index'

export const flipY: Background.Definition = function (img) {
  // d d
  // q q

  const canvas = document.createElement('canvas')
  const width = img.width
  const height = img.height

  canvas.width = width
  canvas.height = height * 2

  const ctx = canvas.getContext('2d')!
  // top image
  ctx.drawImage(img, 0, 0, width, height)
  // flipped bottom image
  ctx.translate(0, 2 * height)
  ctx.scale(1, -1)
  ctx.drawImage(img, 0, 0, width, height)

  return canvas
}
