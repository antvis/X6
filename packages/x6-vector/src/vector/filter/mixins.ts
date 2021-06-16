import { applyMixins } from '../../util/mixin'
import { FilterExtension as BlendExtension } from '../fe-blend/exts'
import { FilterExtension as ColorMatrixExtension } from '../fe-color-matrix/exts'
import { FilterExtension as ComponentTransferExtension } from '../fe-component-transfer/exts'
import { FilterExtension as CompositeExtension } from '../fe-composite/exts'
import { FilterExtension as ConvolveMatrixExtension } from '../fe-convolve-matrix/exts'
import { FilterExtension as DiffuseLightingExtension } from '../fe-diffuse-lighting/exts'
import { FilterExtension as DisplacementMapExtension } from '../fe-displacement-map/exts'
import { FilterExtension as FloodExtension } from '../fe-flood/exts'
import { FilterExtension as GaussianBlurExtension } from '../fe-gaussian-blur/exts'
import { FilterExtension as ImageExtension } from '../fe-image/exts'
import { FilterExtension as MergeExtension } from '../fe-merge/exts'
import { FilterExtension as MorphologyExtension } from '../fe-morphology/exts'
import { FilterExtension as OffsetExtension } from '../fe-offset/exts'
import { FilterExtension as SpecularLightingExtension } from '../fe-specular-lighting/exts'
import { FilterExtension as TileExtension } from '../fe-tile/exts'
import { FilterExtension as TurbulenceExtension } from '../fe-turbulence/exts'
import { Filter } from './filter'

declare module './filter' {
  interface Filter
    extends BlendExtension,
      ColorMatrixExtension,
      ComponentTransferExtension,
      CompositeExtension,
      ConvolveMatrixExtension,
      DiffuseLightingExtension,
      DisplacementMapExtension,
      FloodExtension,
      GaussianBlurExtension,
      ImageExtension,
      MergeExtension,
      MorphologyExtension,
      OffsetExtension,
      SpecularLightingExtension,
      TileExtension,
      TurbulenceExtension {}
}

applyMixins(
  Filter,
  BlendExtension,
  ColorMatrixExtension,
  ComponentTransferExtension,
  CompositeExtension,
  ConvolveMatrixExtension,
  DiffuseLightingExtension,
  DisplacementMapExtension,
  FloodExtension,
  GaussianBlurExtension,
  ImageExtension,
  MergeExtension,
  MorphologyExtension,
  OffsetExtension,
  SpecularLightingExtension,
  TileExtension,
  TurbulenceExtension,
)
