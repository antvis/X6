import { PortLabelLayout } from './index'
import { toResult } from './util'

export type SideArgs = Partial<PortLabelLayout.Result>

export const manual: PortLabelLayout.Definition<SideArgs> = (
  portPosition,
  elemBBox,
  args,
) => toResult(elemBBox, args)

export const left: PortLabelLayout.Definition<SideArgs> = (
  portPosition,
  elemBBox,
  args,
) =>
  toResult(
    {
      x: -15,
      attrs: { '.': { y: '.3em', 'text-anchor': 'end' } },
    },
    args,
  )

export const right: PortLabelLayout.Definition<SideArgs> = (
  portPosition,
  elemBBox,
  args,
) =>
  toResult(
    {
      x: 15,
      attrs: { '.': { y: '.3em', 'text-anchor': 'start' } },
    },
    args,
  )

export const top: PortLabelLayout.Definition<SideArgs> = (
  portPosition,
  elemBBox,
  args,
) =>
  toResult(
    {
      y: -15,
      attrs: { '.': { 'text-anchor': 'middle' } },
    },
    args,
  )

export const bottom: PortLabelLayout.Definition<SideArgs> = (
  portPosition,
  elemBBox,
  args,
) =>
  toResult(
    {
      y: 15,
      attrs: { '.': { y: '.6em', 'text-anchor': 'middle' } },
    },
    args,
  )
