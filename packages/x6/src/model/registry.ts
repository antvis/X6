import { Registry } from '../common'

export namespace Share {
  let edgeRegistry: Registry<any>
  let nodeRegistry: Registry<any>

  export function exist(name: string, isNode: boolean) {
    return isNode ? edgeRegistry.exist(name) : nodeRegistry.exist(name)
  }

  export function setEdgeRegistry(registry: any) {
    edgeRegistry = registry
  }

  export function setNodeRegistry(registry: any) {
    nodeRegistry = registry
  }
}
