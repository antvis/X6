import { Graph, Edge } from '@antv/x6'
import { ReactShapeView } from '@antv/x6-react-shape'
import { generateData, parsePorts } from './data'

export class TableNodeView extends ReactShapeView {
  private getPort(id: string) {
    const ports = parsePorts(
      this.cell.getData<ReturnType<typeof generateData>>(),
    )
    return ports.find((port) => port.id === id)
  }

  // 获取链接桩元素，将链接到隐藏链接桩的边 链接到指定的根链接桩。
  getMagnetFromEdgeTerminal(terminal: Edge.TerminalData) {
    const portId = (terminal as Edge.TerminalCellData).port
    let magnet = super.getMagnetFromEdgeTerminal(terminal)
    if (magnet == null && portId != null) {
      const port = this.getPort(portId)
      if (port) {
        const id = port.group === 'in' ? 'port-in-root' : 'port-out-root'
        magnet = super.getMagnetFromEdgeTerminal({ ...terminal, port: id })
      }
    }
    return magnet
  }
}

Graph.registerView('table-node-view', TableNodeView, true)
