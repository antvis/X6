// import React from 'react'
// import { Graph } from '@antv/x6-next'
// import { Path } from '@antv/x6-geometry'
// import data from './data'
// import './index.less'
// import { register } from '@antv/x6-react-shape'

// Graph.registerConnector(
//   'algo-connector',
//   (s, e) => {
//     const offset = 4
//     const deltaY = Math.abs(e.y - s.y)
//     const control = Math.floor((deltaY / 3) * 2)

//     const v1 = { x: s.x, y: s.y + offset + control }
//     const v2 = { x: e.x, y: e.y - offset - control }

//     return Path.normalize(
//       `M ${s.x} ${s.y}
//        L ${s.x} ${s.y + offset}
//        C ${v1.x} ${v1.y} ${v2.x} ${v2.y} ${e.x} ${e.y - offset}
//        L ${e.x} ${e.y}
//       `,
//     )
//   },
//   true,
// )

// const NodeComponent = () => {
//   return (
//     <div className="react-node">
//       <img
//         src="https://gw.alipayobjects.com/zos/bmw-prod/d9f3b597-3a2e-49c3-8469-64a1168ed779.svg"
//         alt=""
//       />
//       <span>深度学习</span>
//     </div>
//   )
// }

// register(NodeComponent, {
//   shape: 'perf-node',
//   width: 144,
//   height: 28,
//   effect: ['width'],
// })

// export default class Canvas extends React.Component {
//   private container: HTMLDivElement
//   private graph: Graph

//   componentDidMount() {
//     const graph = new Graph({
//       container: this.container,
//       width: 800,
//       height: 600,
//       grid: false,
//       connecting: {
//         connector: 'algo-connector',
//         connectionPoint: 'anchor',
//         anchor: 'center',
//       },
//     })
//     this.graph = graph
//     document.getElementById('add-btn')?.addEventListener('click', () => {
//       this.add()
//     })
//   }

//   add = () => {
//     data.nodes.forEach((node: any, i) => {
//       node.ports = {
//         groups: {
//           top: {
//             position: 'top',
//             attrs: {
//               circle: {
//                 r: 4,
//                 magnet: true,
//                 stroke: 'gray',
//                 strokeWidth: 1,
//                 fill: '#fff',
//               },
//             },
//           },
//           right: {
//             position: 'right',
//             attrs: {
//               circle: {
//                 r: 4,
//                 magnet: true,
//                 stroke: 'gray',
//                 strokeWidth: 1,
//                 fill: '#fff',
//               },
//             },
//           },
//           bottom: {
//             position: 'bottom',
//             attrs: {
//               circle: {
//                 r: 4,
//                 magnet: true,
//                 stroke: 'gray',
//                 strokeWidth: 1,
//                 fill: '#fff',
//               },
//             },
//           },
//           left: {
//             position: 'left',
//             attrs: {
//               circle: {
//                 r: 4,
//                 magnet: true,
//                 stroke: 'gray',
//                 strokeWidth: 1,
//                 fill: '#fff',
//               },
//             },
//           },
//         },
//         items: [
//           {
//             group: 'top',
//             id: i + `_port_top`,
//           },
//           {
//             group: 'right',
//             id: i + `_port_right`,
//           },
//           {
//             group: 'bottom',
//             id: i + `_port_bottom`,
//           },
//           {
//             group: 'left',
//             id: i + `_port_left`,
//           },
//         ],
//       }
//     })
//     data.edges.forEach((edge: any) => {
//       edge.attrs = {
//         line: {
//           stroke: '#c5c5c5',
//           strokeWidth: 1,
//         },
//       }
//     })
//     this.graph.fromJSON(data)
//   }

//   refContainer = (container: HTMLDivElement) => {
//     this.container = container
//   }

//   render() {
//     return (
//       <div className="x6-graph-wrap">
//         <div ref={this.refContainer} className="x6-graph" />
//         <button id="add-btn">add</button>
//       </div>
//     )
//   }
// }
