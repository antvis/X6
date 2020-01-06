import { Rectangle } from '../../geometry'
import { Graph } from '../../graph'
import { Image } from '../../struct'
import { drill, OptionItem } from '../../option'
import { Shape, ImageShape, EllipseShape } from '../../shape'

export interface HandleOptions<
  T extends CreateHandleShapeArgs,
  S extends CreateHandleShapeArgs
> {
  shape: OptionItem<T, string>
  size: OptionItem<S, number>
  image?: OptionItem<T, Image>
}

export interface CreateHandleShapeArgs {
  graph: Graph
}

export function createHandleShape<T extends CreateHandleShapeArgs>(
  args: T,
  options: HandleOptions<T, T>,
): Shape {
  const { graph } = args
  const image = drill(options.image, graph, args)
  if (image) {
    const bounds = new Rectangle(0, 0, image.width, image.height)
    const shape = new ImageShape(bounds, image.src)
    shape.preserveImageAspect = false

    return shape
  }

  const raw = drill(options.shape, graph, args)
  const ctor = Shape.getShape(raw) || EllipseShape
  return new ctor() as Shape
}
