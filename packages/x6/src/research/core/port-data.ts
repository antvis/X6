import { Size } from '../../types'
import { Attr } from '../attr'
import { JSONObject, JSONExt } from '../../util'
import { Point, Rectangle } from '../../geometry'
import { PortLayout } from './port-layout'
import { PortLabelLayout } from './port-label-layout'

export class PortData {
  ports: PortData.Port[]
  groups: { [name: string]: PortData.Group }

  constructor(data: PortData.Metadata) {
    this.ports = []
    this.groups = {}
    this.init(JSONExt.deepCopy(data as any))
  }

  getPorts() {
    return this.ports
  }

  getGroup(groupName: string): PortData.Group {
    return this.groups[groupName]
  }

  getPortsByGroup(groupName?: string): PortData.Port[] {
    return this.ports.filter(
      port =>
        port.group === groupName || (port.group == null && port.group == null),
    )
  }

  getPortsLayoutByGroup(groupName: string | undefined, elemBBox: Rectangle) {
    const ports = this.getPortsByGroup(groupName)
    const group = groupName ? this.getGroup(groupName) : null

    const groupPosition = group ? group.position : null
    const groupPositionName = groupPosition ? groupPosition.name : null

    const layoutFn =
      (groupPositionName && (PortLayout as any)[groupPositionName]) ||
      PortLayout.left

    const portsArgs = ports.map(
      port => (port && port.position && port.position.args) || {},
    )
    const groupArgs = (groupPosition && groupPosition.args) || {}
    const results: PortLayout.Result[] = layoutFn(
      portsArgs,
      elemBBox,
      groupArgs,
    )

    const accumulator: PortData.ParsedPorts = {
      ports,
      items: [],
    }

    results.reduce((memo, portLayout, index) => {
      const port = memo.ports[index]
      memo.items.push({
        portLayout,
        portId: port.id!,
        portSize: port.size,
        portAttrs: port.attrs,
        labelSize: port.label.size,
        portLabelLayout: this.getPortLabelLayout(
          port,
          Point.create(portLayout),
          elemBBox,
        ),
      })
      return memo
    }, accumulator)

    return accumulator.items
  }

  protected init(data: PortData.Metadata) {
    const { groups, items } = data

    if (groups != null) {
      Object.keys(groups).forEach(key => {
        this.groups[key] = this.evaluateGroup(groups[key])
      })
    }

    if (Array.isArray(items)) {
      items.forEach(item => {
        this.ports.push(this.evaluatePort(item))
      })
    }
  }

  protected evaluateGroup(group: PortData.GroupMetadata) {
    return {
      ...group,
      label: this.getLabel(group, true),
      position: this.getPortPosition(group.position, true),
    } as PortData.Group
  }

  protected evaluatePort(port: PortData.PortMetadata) {
    const result = { ...port } as PortData.Port
    const group = this.getGroup(port.group)

    result.markup = result.markup || group.markup
    result.attrs = { ...group.attrs, ...result.attrs }
    result.position = this.createPosition(group, result)
    result.label = { ...group.label, ...this.getLabel(result) }
    result.zIndex = this.getZIndex(group, result)
    result.size = Object.assign({}, group.size, result.size)

    return result
  }

  protected getZIndex(group: PortData.Group, port: PortData.PortMetadata) {
    if (typeof port.zIndex === 'number') {
      return port.zIndex
    }

    if (typeof group.zIndex === 'number' || group.zIndex === 'auto') {
      return group.zIndex
    }

    return 'auto'
  }

  protected createPosition(group: PortData.Group, port: PortData.PortMetadata) {
    return {
      name: 'left',
      ...group.position,
      args: port.args,
    } as PortData.PortPosition
  }

  protected getPortPosition(
    position?: PortData.PortPositionMetadata,
    setDefault: boolean = false,
  ): PortData.PortPosition {
    if (position == null) {
      if (setDefault) {
        return { name: 'left', args: {} }
      }
    } else {
      if (typeof position === 'string') {
        return {
          name: position,
          args: {},
        }
      }

      if (typeof position === 'function') {
        return {
          name: 'fn',
          args: { fn: position },
        }
      }

      if (Array.isArray(position)) {
        return {
          name: 'absolute',
          args: { x: position[0], y: position[1] },
        }
      }

      if (typeof position === 'object') {
        return position
      }
    }

    return { args: {} }
  }

  protected getPortLabelPosition(
    position?: PortData.PortLabelPositionMetadata,
    setDefault: boolean = false,
  ): PortData.PortLabelPosition {
    if (position == null) {
      if (setDefault) {
        return { name: 'left', args: {} }
      }
    } else {
      if (typeof position === 'string') {
        return {
          name: position,
          args: {},
        }
      }

      if (typeof position === 'object') {
        return position
      }
    }

    return { args: {} }
  }

  protected getLabel(
    item: PortData.GroupMetadata,
    setDefaults: boolean = false,
  ) {
    const label = item.label || {}
    label.position = this.getPortLabelPosition(label.position, setDefaults)
    return label as PortData.Label
  }

  protected getPortLabelLayout(
    port: PortData.Port,
    portPosition: Point,
    elemBBox: Rectangle,
  ) {
    const layoutFn = PortLabelLayout[port.label.position.name || 'left']
    if (layoutFn) {
      return layoutFn(portPosition, elemBBox, port.label.position.args)
    }

    return null
  }
}

export namespace PortData {
  export interface Metadata {
    groups?: { [name: string]: GroupMetadata }
    items: PortMetadata[]
  }

  export interface PortPosition<
    T extends PortLayout.LayoutNames = PortLayout.LayoutNames
  > {
    name?: T
    args: PortLayout.LayoutArgs[T]
  }

  export type PortPositionMetadata =
    | PortLayout.LayoutNames
    | Point.PointData // absolute layout
    | PortPosition
    | PortLayout.CustomLayoutFunction

  export interface PortLabelPosition<
    T extends PortLabelLayout.LayoutNames = PortLabelLayout.LayoutNames
  > {
    name?: T
    args: PortLabelLayout.LayoutArgs[T]
  }

  export type PortLabelPositionMetadata =
    | PortLabelLayout.LayoutNames
    | PortLabelPosition

  export interface LabelMetadata {
    markup?: string
    size?: Size
    position?: PortLabelPositionMetadata
  }

  export interface Label {
    markup: string
    size?: Size
    position: PortLabelPosition
  }

  interface Common {
    markup: string
    attrs: Attr.CellAttrs
    zIndex: number | 'auto'
    size?: Size
  }

  interface PortBase {
    group: string
    /**
     * Arguments for the port layout function.
     */
    args?: JSONObject
  }

  export interface GroupMetadata extends Partial<Common> {
    label?: LabelMetadata
    position?: PortPositionMetadata
  }

  export interface Group extends Partial<Common> {
    label: Label
    position: PortPosition
  }

  export interface PortMetadata extends Partial<Common>, PortBase {
    id?: string
    label?: LabelMetadata
  }

  export interface Port extends Group, PortBase {
    id: string
  }

  export interface LayoutResult {
    portId: string
    portAttrs?: Attr.CellAttrs
    portSize?: Size
    portLayout: PortLayout.Result
    portLabelLayout: PortLabelLayout.Result | null
    labelSize?: Size
  }

  export interface ParsedPorts {
    ports: Port[]
    items: LayoutResult[]
  }
}
