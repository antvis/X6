import { getString, getNumber } from './util'

export interface DropShadowArgs {
  dx?: number
  dy?: number
  color?: string
  blur?: number
  opacity?: number
}

export function dropShadow(args: DropShadowArgs = {}) {
  const dx = getNumber(args.dx, 0)
  const dy = getNumber(args.dy, 0)
  const color = getString(args.color, 'black')
  const blur = getNumber(args.blur, 4)
  const opacity = getNumber(args.opacity, 1)

  return 'SVGFEDropShadowElement' in window
    ? `<filter>
         <feDropShadow stdDeviation="${blur}" dx="${dx}" dy="${dy}" flood-color="${color}" flood-opacity="${opacity}" />
       </filter>`.trim()
    : `<filter>
         <feGaussianBlur in="SourceAlpha" stdDeviation="${blur}" />
         <feOffset dx="${dx}" dy="${dy}" result="offsetblur" />
         <feFlood flood-color="${color}" />
         <feComposite in2="offsetblur" operator="in" />
         <feComponentTransfer>
           <feFuncA type="linear" slope="${opacity}" />
         </feComponentTransfer>
         <feMerge>
           <feMergeNode/>
           <feMergeNode in="SourceGraphic"/>
         </feMerge>
       </filter>`.trim()
}
