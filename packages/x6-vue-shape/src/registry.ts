import { Graph, Node } from '@antv/x6'

export type VueShapeConfig = Node.Properties & {
  shape: string
}

export const shapeMaps: Record<
  string,
  {
    component: any
  }
> = {}

export function register(component: any, config: VueShapeConfig) {
  const { shape, ...others } = config
  if (!shape) {
    throw new Error('should specify shape in config')
  }
  shapeMaps[shape] = {
    component,
  }

  Graph.registerNode(
    shape,
    {
      inherit: 'vue-shape',
      ...others,
    },
    true,
  )
}
