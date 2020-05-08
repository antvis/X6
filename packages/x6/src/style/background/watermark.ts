import { Background } from './index'
import { Angle } from '../../geometry'

export interface WatermarkOptions extends Background.CommonOptions {
  angle?: number
}

export const watermark: Background.Definition<WatermarkOptions> = function (
  img,
  options,
) {
  const width = img.width
  const height = img.height
  const canvas = document.createElement('canvas')

  canvas.width = width * 3
  canvas.height = height * 3

  const ctx = canvas.getContext('2d')!
  const angle = options.angle != null ? -options.angle : -20
  const radians = Angle.toRad(angle)
  const stepX = canvas.width / 4
  const stepY = canvas.height / 4

  for (let i = 0; i < 4; i += 1) {
    for (let j = 0; j < 4; j += 1) {
      if ((i + j) % 2 > 0) {
        ctx.setTransform(1, 0, 0, 1, (2 * i - 1) * stepX, (2 * j - 1) * stepY)
        ctx.rotate(radians)
        ctx.drawImage(img, -width / 2, -height / 2, width, height)
      }
    }
  }

  return canvas
}
