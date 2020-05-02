import { Size, KeyValue } from '../types'
import { Point, Rectangle } from '../geometry'
import { JSONObject, ObjectExt } from '../util'
import { Attr } from '../attr'
import { PortLayout } from '../port/port-layout'
import { PortLabelLayout } from '../port/port-label-layout'
import { PortLayoutRegistry, PortLabelLayoutRegistry } from '../registry'
import { Markup } from './markup'

export class PortData {
  ports: PortData.Port[]
  groups: { [name: string]: PortData.Group }

  constructor(data: PortData.Metadata) {
    this.ports = []
    this.groups = {}
    this.init(ObjectExt.cloneDeep(data))
  }

  getPorts() {
    return this.ports
  }

  getGroup(groupName?: string | null) {
    return groupName != null ? this.groups[groupName] : null
  }

  getPortsByGroup(groupName?: string): PortData.Port[] {
    return this.ports.filter(
      p => p.group === groupName || (p.group == null && groupName == null),
    )
  }

  getPortsLayoutByGroup(groupName: string | undefined, elemBBox: Rectangle) {
    const ports = this.getPortsByGroup(groupName)
    const group = groupName ? this.getGroup(groupName) : null
    const groupPosition = group ? group.position : null
    const groupPositionName = groupPosition ? groupPosition.name : null

    let layoutFn: PortLayout.Definition<any>

    if (groupPositionName != null) {
      const fn = PortLayoutRegistry.get(groupPositionName)
      if (fn == null) {
        return PortLayoutRegistry.onNotFound(groupPositionName)
      }
      layoutFn = fn
    } else {
      layoutFn = PortLayout.presets.left
    }

    const portsArgs = ports.map(
      port => (port && port.position && port.position.args) || {},
    )
    const groupArgs = (groupPosition && groupPosition.args) || {}
    const layouts = layoutFn(portsArgs, elemBBox, groupArgs)
    return layouts.map<PortData.LayoutResult>((portLayout, index) => {
      const port = ports[index]
      return {
        portLayout,
        portId: port.id!,
        portSize: port.size,
        portAttrs: port.attrs,
        labelSize: port.label.size,
        labelLayout: this.getPortLabelLayout(
          port,
          Point.create(portLayout.position),
          elemBBox,
        ),
      }
    })
  }

  protected init(data: PortData.Metadata) {
    const { groups, items } = data

    if (groups != null) {
      Object.keys(groups).forEach(key => {
        this.groups[key] = this.parseGroup(groups[key])
      })
    }

    if (Array.isArray(items)) {
      items.forEach(item => {
        this.ports.push(this.parsePort(item))
      })
    }
  }

  protected parseGroup(group: PortData.GroupMetadata) {
    return {
      ...group,
      label: this.getLabel(group, true),
      position: this.getPortPosition(group.position, true),
    } as PortData.Group
  }

  protected parsePort(port: PortData.PortMetadata) {
    const result = { ...port } as PortData.Port
    const group = this.getGroup(port.group) || ({} as PortData.Group)

    result.markup = result.markup || group.markup
    result.attrs = ObjectExt.merge({}, group.attrs, result.attrs)
    result.position = this.createPosition(group, result)
    result.label = ObjectExt.merge({}, group.label, this.getLabel(result))
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
    return ObjectExt.merge(
      {
        name: 'left',
        args: {},
      },
      group.position,
      { args: port.args },
    ) as PortData.PortPosition
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
    const name = port.label.position.name || 'left'
    const args = port.label.position.args || {}
    const layoutFn =
      PortLabelLayoutRegistry.get(name) || PortLabelLayout.presets.left
    if (layoutFn) {
      return layoutFn(portPosition, elemBBox, args)
    }

    return null
  }
}

export namespace PortData {
  export interface Metadata {
    groups?: { [name: string]: GroupMetadata }
    items: PortMetadata[]
  }

  export type PortPosition =
    | Partial<PortLayout.NativeItem>
    | Partial<PortLayout.ManaualItem>

  export type PortPositionMetadata =
    | PortLayout.NativeNames
    | Exclude<string, PortLayout.NativeNames>
    | Point.PointData // absolute layout
    | PortPosition

  export type PortLabelPosition =
    | Partial<PortLabelLayout.NativeItem>
    | Partial<PortLabelLayout.ManaualItem>

  export type PortLabelPositionMetadata =
    | PortLabelLayout.NativeNames
    | Exclude<string, PortLabelLayout.NativeNames>
    | PortLabelPosition

  export interface LabelMetadata {
    markup?: Markup
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

  export interface GroupMetadata extends Partial<Common>, KeyValue {
    label?: LabelMetadata
    position?: PortPositionMetadata
  }

  export interface Group extends Partial<Common> {
    label: Label
    position: PortPosition
  }

  interface PortBase {
    group?: string
    /**
     * Arguments for the port layout function.
     */
    args?: JSONObject
  }

  export interface PortMetadata extends Partial<Common>, PortBase, KeyValue {
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
    labelSize?: Size
    labelLayout: PortLabelLayout.Result | null
  }
}
