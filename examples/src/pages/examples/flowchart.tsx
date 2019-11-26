import React from 'react'
import { Graph, DomEvent, Constraint, Point } from '../../../../src'
import './flowchart.less'

export default class FlowChart extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    DomEvent.disableContextMenu(this.container)
    const graph = new Graph(this.container, {
      guide: true,
      rotate: false,
      resize: false,
      folding: false,
      selectionPreview: {
        dashed: false,
        strokeWidth: 2,
      },
      nodeStyle: {
        fill: 'rgba(0,0,0,0)',
        stroke: 'none',
        noLabel: true,
        editable: false,
      },
      edgeStyle: {
        edge: 'elbow',
        elbow: 'vertical',
        labelBackgroundColor: '#f2f4f7',
        movable: false,
      },
      isLabelMovable() { return false },
      getConstraints(cell) {
        if (cell != null && this.model.isNode(cell)) {
          return [
            new Constraint({ point: new Point(0.5, 0) }),
            new Constraint({ point: new Point(0, 0.5) }),
            new Constraint({ point: new Point(1, 0.5) }),
            new Constraint({ point: new Point(0.5, 1) }),
          ]
        }
        return null
      },
      // createCellHandler(state) {
      //   if (this.model.isNode(state.cell)) {
      //     return this.getNativeValue()
      //   }
      //   return null
      // },
    })

    graph.batchUpdate(() => {
      const start = graph.addNode({
        data: '<div class="x6-flow-node start">开始</div>',
        x: 372,
        y: 32,
        width: 56,
        height: 56,
        style: {
          shape: 'html',
          perimeter: 'ellipse',
        }
      })

      const end = graph.addNode({
        data: '<div class="x6-flow-node end">结束</div>',
        x: 372,
        y: 480,
        width: 56,
        height: 56,
        style: {
          shape: 'html',
          perimeter: 'ellipse',
        }
      })

      const container = graph.addNode({
        data: `
        <div class="x6-flow-node group">
          <i class="icon">
            <svg viewBox="64 64 896 896" focusable="false" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M880 184H712v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H384v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H144c-17.7 0-32 14.3-32 32v664c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V216c0-17.7-14.3-32-32-32zm-40 656H184V460h656v380zM184 392V256h128v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h256v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h128v136H184z"></path></svg>
          </i>
        </div>`,
        x: 200,
        y: 200,
        width: 400,
        height: 240,
        style: {
          shape: 'html',
        }
      })

      const batch = graph.addNode({
        data: `
        <div class="x6-flow-node group">
          <i class="icon">
          <svg viewBox="64 64 896 896" focusable="false" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M752 664c-28.5 0-54.8 10-75.4 26.7L469.4 540.8a160.68 160.68 0 0 0 0-57.6l207.2-149.9C697.2 350 723.5 360 752 360c66.2 0 120-53.8 120-120s-53.8-120-120-120-120 53.8-120 120c0 11.6 1.6 22.7 4.7 33.3L439.9 415.8C410.7 377.1 364.3 352 312 352c-88.4 0-160 71.6-160 160s71.6 160 160 160c52.3 0 98.7-25.1 127.9-63.8l196.8 142.5c-3.1 10.6-4.7 21.8-4.7 33.3 0 66.2 53.8 120 120 120s120-53.8 120-120-53.8-120-120-120zm0-476c28.7 0 52 23.3 52 52s-23.3 52-52 52-52-23.3-52-52 23.3-52 52-52zM312 600c-48.5 0-88-39.5-88-88s39.5-88 88-88 88 39.5 88 88-39.5 88-88 88zm440 236c-28.7 0-52-23.3-52-52s23.3-52 52-52 52 23.3 52 52-23.3 52-52 52z"></path></svg>
          </i>
        </div>`,
        x: 80,
        y: 104,
        width: 240,
        height: 106,
        parent: container,
        style: {
          shape: 'html',
        }
      })

      const process1 = graph.addNode({
        data: `
        <div class="x6-flow-node process">
          <i class="icon">
            <svg viewBox="64 64 896 896" focusable="false" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M688 264c0-4.4-3.6-8-8-8H296c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h384c4.4 0 8-3.6 8-8v-48zm-8 136H296c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h384c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zM480 544H296c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zm-48 308H208V148h560v344c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V108c0-17.7-14.3-32-32-32H168c-17.7 0-32 14.3-32 32v784c0 17.7 14.3 32 32 32h264c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm356.8-74.4c29-26.3 47.2-64.3 47.2-106.6 0-79.5-64.5-144-144-144s-144 64.5-144 144c0 42.3 18.2 80.3 47.2 106.6-57 32.5-96.2 92.7-99.2 162.1-.2 4.5 3.5 8.3 8 8.3h48.1c4.2 0 7.7-3.3 8-7.6C564 871.2 621.7 816 692 816s128 55.2 131.9 124.4c.2 4.2 3.7 7.6 8 7.6H880c4.6 0 8.2-3.8 8-8.3-2.9-69.5-42.2-129.6-99.2-162.1zM692 591c44.2 0 80 35.8 80 80s-35.8 80-80 80-80-35.8-80-80 35.8-80 80-80z"></path></svg>
          </i>
          <div class="text">
            一级主管审批
          </div>
        </div>`,
        x: 326,
        y: 120,
        width: 148,
        height: 48,
        style: {
          shape: 'html',
        }
      })

      const process2 = graph.addNode({
        data: `
        <div class="x6-flow-node process">
          <i class="icon">
            <svg viewBox="64 64 896 896" focusable="false" width="1em" height="1em" fill="currentColor" aria-hidden="true">
              <path d="M304 280h56c4.4 0 8-3.6 8-8 0-28.3 5.9-53.2 17.1-73.5 10.6-19.4 26-34.8 45.4-45.4C450.9 142 475.7 136 504 136h16c28.3 0 53.2 5.9 73.5 17.1 19.4 10.6 34.8 26 45.4 45.4C650 218.9 656 243.7 656 272c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8 0-40-8.8-76.7-25.9-108.1a184.31 184.31 0 0 0-74-74C596.7 72.8 560 64 520 64h-16c-40 0-76.7 8.8-108.1 25.9a184.31 184.31 0 0 0-74 74C304.8 195.3 296 232 296 272c0 4.4 3.6 8 8 8z"></path>
              <path d="M940 512H792V412c76.8 0 139-62.2 139-139 0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8a63 63 0 0 1-63 63H232a63 63 0 0 1-63-63c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8 0 76.8 62.2 139 139 139v100H84c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h148v96c0 6.5.2 13 .7 19.3C164.1 728.6 116 796.7 116 876c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8 0-44.2 23.9-82.9 59.6-103.7a273 273 0 0 0 22.7 49c24.3 41.5 59 76.2 100.5 100.5S460.5 960 512 960s99.8-13.9 141.3-38.2a281.38 281.38 0 0 0 123.2-149.5A120 120 0 0 1 836 876c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8 0-79.3-48.1-147.4-116.7-176.7.4-6.4.7-12.8.7-19.3v-96h148c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM716 680c0 36.8-9.7 72-27.8 102.9-17.7 30.3-43 55.6-73.3 73.3C584 874.3 548.8 884 512 884s-72-9.7-102.9-27.8c-30.3-17.7-55.6-43-73.3-73.3A202.75 202.75 0 0 1 308 680V412h408v268z"></path>
            </svg>
          </i>
          <div class="text">
            判断应用状态
          </div>
        </div>`,
        x: 126,
        y: 32,
        width: 148,
        height: 48,
        parent: container,
        style: {
          shape: 'html',
        }
      })

      const process3 = graph.addNode({
        data: `
        <div class="x6-flow-node process">
          <i class="icon">
            <svg viewBox="64 64 896 896" focusable="false" width="1em" height="1em" fill="currentColor" aria-hidden="true">
              <path d="M917.7 148.8l-42.4-42.4c-1.6-1.6-3.6-2.3-5.7-2.3s-4.1.8-5.7 2.3l-76.1 76.1a199.27 199.27 0 0 0-112.1-34.3c-51.2 0-102.4 19.5-141.5 58.6L432.3 308.7a8.03 8.03 0 0 0 0 11.3L704 591.7c1.6 1.6 3.6 2.3 5.7 2.3 2 0 4.1-.8 5.7-2.3l101.9-101.9c68.9-69 77-175.7 24.3-253.5l76.1-76.1c3.1-3.2 3.1-8.3 0-11.4zM769.1 441.7l-59.4 59.4-186.8-186.8 59.4-59.4c24.9-24.9 58.1-38.7 93.4-38.7 35.3 0 68.4 13.7 93.4 38.7 24.9 24.9 38.7 58.1 38.7 93.4 0 35.3-13.8 68.4-38.7 93.4zm-190.2 105a8.03 8.03 0 0 0-11.3 0L501 613.3 410.7 523l66.7-66.7c3.1-3.1 3.1-8.2 0-11.3L441 408.6a8.03 8.03 0 0 0-11.3 0L363 475.3l-43-43a7.85 7.85 0 0 0-5.7-2.3c-2 0-4.1.8-5.7 2.3L206.8 534.2c-68.9 69-77 175.7-24.3 253.5l-76.1 76.1a8.03 8.03 0 0 0 0 11.3l42.4 42.4c1.6 1.6 3.6 2.3 5.7 2.3s4.1-.8 5.7-2.3l76.1-76.1c33.7 22.9 72.9 34.3 112.1 34.3 51.2 0 102.4-19.5 141.5-58.6l101.9-101.9c3.1-3.1 3.1-8.2 0-11.3l-43-43 66.7-66.7c3.1-3.1 3.1-8.2 0-11.3l-36.6-36.2zM441.7 769.1a131.32 131.32 0 0 1-93.4 38.7c-35.3 0-68.4-13.7-93.4-38.7a131.32 131.32 0 0 1-38.7-93.4c0-35.3 13.7-68.4 38.7-93.4l59.4-59.4 186.8 186.8-59.4 59.4z"></path>
            </svg>
          </i>
          <div class="text">
            DRM 推送
          </div>
        </div>`,
        x: 60,
        y: 32,
        width: 120,
        height: 48,
        parent: batch,
        style: {
          shape: 'html',
        }
      })

      graph.addEdge({
        source: start,
        target: process1,
        style: {
          exitX: 0.5,
          exitY: 1,
          entryX: 0.5,
          entryY: 0,
        }
      })

      graph.addEdge({
        data: '同意',
        source: process1,
        target: process2,
        style: {
          exitX: 0.5,
          exitY: 1,
          entryX: 0.5,
          entryY: 0,
        }
      })

      graph.addEdge({
        source: process2,
        target: process3,
        style: {
          exitX: 0.5,
          exitY: 1,
          entryX: 0.5,
          entryY: 0,
        }
      })

      graph.addEdge({
        source: process3,
        target: end,
        style: {
          exitX: 0.5,
          exitY: 1,
          entryX: 0.5,
          entryY: 0,
        }
      })

      graph.addEdge({
        data: '驳回',
        source: process1,
        target: end,
        points: [
          { x: 700, y: 144 },
          { x: 700, y: 508 },
        ],
        style: {
          edge: 'orthogonal',
          exitX: 1,
          exitY: 0.5,
          entryX: 1,
          entryY: 0.5,
        }
      })
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div
        ref={this.refContainer}
        className="graph-container big"
        style={{ background: '#f2f4f7', boxShadow: 'none' }}
      />
    )
  }
}
