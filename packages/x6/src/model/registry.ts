import { Registry } from '../registry'

export namespace ShareRegistry {
  let edgeRegistry: Registry<any>
  let nodeRegistry: Registry<any>

  export function exist(name: string, isNode: boolean) {
    return isNode
      ? edgeRegistry != null && edgeRegistry.exist(name)
      : nodeRegistry != null && nodeRegistry.exist(name)
  }

  export function setEdgeRegistry(registry: any) {
    edgeRegistry = registry
  }

  export function setNodeRegistry(registry: any) {
    nodeRegistry = registry
  }
}
