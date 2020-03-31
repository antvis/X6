import { Grid } from '../grid'
import { Registry } from './util'

export const GridRegistry = new Registry<
  Grid.Definition<Grid.Options> | Grid.Definition<Grid.Options>[]
>({
  onError(name) {
    throw new Error(`Grid with name '${name}' already registered.`)
  },
})

GridRegistry.register('dot', Grid.dot, true)
GridRegistry.register('fixedDot', Grid.fixedDot, true)
GridRegistry.register('mesh', Grid.mesh, true)
GridRegistry.register('doubleMesh', Grid.doubleMesh, true)
