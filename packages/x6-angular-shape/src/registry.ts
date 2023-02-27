import { Injector, TemplateRef, Type } from '@angular/core'
import { Graph, Node } from '@antv/x6'

export type Content = TemplateRef<any> | Type<any>

export type AngularShapeConfig = Node.Properties & {
  shape: string
  injector: Injector
  content: Content
}

export const registerInfo: Map<
  string,
  {
    injector: Injector
    content: Content
  }
> = new Map()

export function register(config: AngularShapeConfig) {
  const { shape, injector, content, ...others } = config
  registerInfo.set(shape, { injector, content })

  Graph.registerNode(
    shape,
    {
      inherit: 'angular-shape',
      ...others,
    },
    true,
  )
}
