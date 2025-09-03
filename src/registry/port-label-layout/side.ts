import type {
  PortLabelLayoutCommonOptions,
  PortLabelLayoutDefinition,
} from './index'
import { toResult } from './util'

export interface SideArgs extends PortLabelLayoutCommonOptions {}

export const manual: PortLabelLayoutDefinition<SideArgs> = (
  portPosition,
  elemBBox,
  args,
) => toResult({ position: elemBBox.getTopLeft() }, args)

export const left: PortLabelLayoutDefinition<SideArgs> = (
  portPosition,
  elemBBox,
  args,
) =>
  toResult(
    {
      position: { x: -15, y: 0 },
      attrs: { '.': { y: '.3em', 'text-anchor': 'end' } },
    },
    args,
  )

export const right: PortLabelLayoutDefinition<SideArgs> = (
  portPosition,
  elemBBox,
  args,
) =>
  toResult(
    {
      position: { x: 15, y: 0 },
      attrs: { '.': { y: '.3em', 'text-anchor': 'start' } },
    },
    args,
  )

export const top: PortLabelLayoutDefinition<SideArgs> = (
  portPosition,
  elemBBox,
  args,
) =>
  toResult(
    {
      position: { x: 0, y: -15 },
      attrs: { '.': { 'text-anchor': 'middle' } },
    },
    args,
  )

export const bottom: PortLabelLayoutDefinition<SideArgs> = (
  portPosition,
  elemBBox,
  args,
) =>
  toResult(
    {
      position: { x: 0, y: 15 },
      attrs: { '.': { y: '.6em', 'text-anchor': 'middle' } },
    },
    args,
  )
