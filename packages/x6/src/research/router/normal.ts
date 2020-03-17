import { Router } from './index'

export interface NormalOptions {}

export const normal: Router.Definition<NormalOptions> = vertices => [
  ...vertices,
]
