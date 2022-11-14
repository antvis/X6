import React from 'react'
import { Graph, Node } from '@antv/x6'

export type ReactShapeConfig = Node.Properties & {
  shape: string
  component: React.ComponentType<{ node: Node; graph: Graph }>
  effect?: (keyof Node.Properties)[]
  inherit?: string
}

export const shapeMaps: Record<
  string,
  {
    component: React.ComponentType<{ node: Node; graph: Graph }>
    effect?: (keyof Node.Properties)[]
  }
> = {}

export function register(config: ReactShapeConfig) {
  const { shape, component, effect, inherit, ...others } = config
  if (!shape) {
    throw new Error('should specify shape in config')
  }
  shapeMaps[shape] = {
    component,
    effect,
  }

  Graph.registerNode(
    shape,
    {
      inherit: inherit || 'react-shape',
      ...others,
    },
    true,
  )
}
