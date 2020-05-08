// import { Size } from '../../types'
// import { Rectangle, Polyline } from '../../geometry'
// import { Node } from '../core/node'
// import { Edge } from '../core/edge'
// import { Model } from '../core/model'
// import { Graph } from '../core/graph'

// export namespace Directed {
//   export function layout(graphOrCells, options) {
//     let model

//     if (graphOrCells instanceof Graph) {
//       model = graphOrCells
//     } else {
//       // Reset cells in dry mode so the graph reference is not stored on the cells.
//       // `sort: false` to prevent elements to change their order based on the z-index
//       model = new Model().resetCells(graphOrCells, { dry: true, sort: false })
//     }

//     // This is not needed anymore.
//     graphOrCells = null

//     options = util.defaults(options || {}, {
//       resizeClusters: true,
//       clusterPadding: 10,
//       exportElement: this.exportElement,
//       exportLink: this.exportLink,
//     })

//     /* global dagre: true */
//     const dagreUtil =
//       options.dagre || (typeof dagre !== 'undefined' ? dagre : undefined)
//     /* global dagre: false */

//     if (dagreUtil === undefined) {
//       throw new Error('The the "dagre" utility is a mandatory dependency.')
//     }

//     // create a graphlib.Graph that represents the joint.dia.Graph
//     // var glGraph = graph.toGraphLib({
//     const glGraph = DirectedGraph.toGraphLib(model, {
//       graphlib: options.graphlib,
//       directed: true,
//       // We are about to use edge naming feature.
//       multigraph: true,
//       // We are able to layout graphs with embeds.
//       compound: true,
//       setNodeLabel: options.exportElement,
//       setEdgeLabel: options.exportLink,
//       setEdgeName(link) {
//         // Graphlib edges have no ids. We use edge name property
//         // to store and retrieve ids instead.
//         return link.id
//       },
//     })

//     const glLabel = {}
//     const marginX = options.marginX || 0
//     const marginY = options.marginY || 0

//     // Dagre layout accepts options as lower case.
//     // Direction for rank nodes. Can be TB, BT, LR, or RL
//     if (options.rankDir) {
//       glLabel.rankdir = options.rankDir
//     }

//     // Alignment for rank nodes. Can be UL, UR, DL, or DR
//     if (options.align) {
//       glLabel.align = options.align
//     }

//     // Number of pixels that separate nodes horizontally in the layout.
//     if (options.nodeSep) {
//       glLabel.nodesep = options.nodeSep
//     }

//     // Number of pixels that separate edges horizontally in the layout.
//     if (options.edgeSep) {
//       glLabel.edgesep = options.edgeSep
//     }

//     // Number of pixels between each rank in the layout.
//     if (options.rankSep) {
//       glLabel.ranksep = options.rankSep
//     }

//     // Type of algorithm to assign a rank to each node in the input graph.
//     // Possible values: network-simplex, tight-tree or longest-path
//     if (options.ranker) {
//       glLabel.ranker = options.ranker
//     }

//     // Number of pixels to use as a margin around the left and right of the graph.
//     if (marginX) {
//       glLabel.marginx = marginX
//     }
//     // Number of pixels to use as a margin around the top and bottom of the graph.
//     if (marginY) {
//       glLabel.marginy = marginY
//     }

//     // Set the option object for the graph label.
//     glGraph.setGraph(glLabel)

//     // Executes the layout.
//     dagreUtil.layout(glGraph, { debugTiming: !!options.debugTiming })

//     // Wrap all graph changes into a batch.
//     model.startBatch('layout')

//     DirectedGraph.fromGraphLib(glGraph, {
//       importNode: this.importElement.bind(model, options),
//       importEdge: this.importLink.bind(model, options),
//     })

//     // // Update the graph.
//     // graph.fromGraphLib(glGraph, {
//     //     importNode: this.importElement.bind(graph, opt),
//     //     importEdge: this.importLink.bind(graph, opt)
//     // });

//     if (options.resizeClusters) {
//       // Resize and reposition cluster elements (parents of other elements)
//       // to fit their children.
//       // 1. filter clusters only
//       // 2. map id on cells
//       // 3. sort cells by their depth (the deepest first)
//       // 4. resize cell to fit their direct children only.
//       const clusters = glGraph
//         .nodes()
//         .filter(v => glGraph.children(v).length > 0)
//         .map(model.getCell.bind(model))
//         .sort((a, b) => b.getAncestors().length - a.getAncestors().length)

//       util.invoke(clusters, 'fitEmbeds', { padding: options.clusterPadding })
//     }

//     model.stopBatch('layout')

//     // Width and height of the graph extended by margins.
//     const glSize = glGraph.graph()

//     // Return the bounding box of the graph after the layout.
//     return new Rectangle(
//       marginX,
//       marginY,
//       Math.abs(glSize.width - 2 * marginX),
//       Math.abs(glSize.height - 2 * marginY),
//     )
//   }

//   export function fromGraphLib(glGraph, opt = {}) {
//     const importNode = opt.importNode || util.noop
//     const importEdge = opt.importEdge || util.noop
//     const graph = this instanceof Graph ? this : new Graph()

//     // Import all nodes.
//     glGraph.nodes().forEach(function(node) {
//       importNode.call(graph, node, glGraph, graph, opt)
//     })

//     // Import all edges.
//     glGraph.edges().forEach(function(edge) {
//       importEdge.call(graph, edge, glGraph, graph, opt)
//     })

//     return graph
//   }

//   function exportElement(node: Node) {
//     return node.size()
//   }

//   function exportLink(edge: Edge) {
//     const labelSize = edge.prop<Size>('labelSize') || {}
//     return {
//       /**
//        * The number of ranks to keep between the source and target of the edge.
//        */
//       minLen: edge.prop<number>('minLen') || 1,

//       /**
//        * The weight to assign edges. Higher weight edges are generally
//        * made shorter and straighter than lower weight edges.
//        */
//       weight: edge.prop<number>('weight') || 1,

//       /**
//        * Where to place the label relative to the edge.
//        */
//       labelpos: edge.prop<string>('labelPosition') || 'center',

//       /**
//        * How many pixels to move the label away from the edge.
//        * Applies only when labelpos is `left` or `right`.
//        */
//       labeloffset: edge.prop<number>('labelOffset') || 0,

//       /**
//        * The width of the edge label in pixels.
//        */
//       width: labelSize.width || 0,

//       /**
//        * The height of the edge label in pixels.
//        */
//       height: labelSize.height || 0,
//     }
//   }

//   function importElement(opt, v, gl) {
//     const element = this.getCell(v)
//     const glNode = gl.node(v)

//     if (opt.setPosition) {
//       opt.setPosition(element, glNode)
//     } else {
//       element.set('position', {
//         x: glNode.x - glNode.width / 2,
//         y: glNode.y - glNode.height / 2,
//       })
//     }
//   }

//   function importLink(opt, edgeObj, gl) {
//     const SIMPLIFY_THRESHOLD = 0.001

//     const link = this.getCell(edgeObj.name)
//     const glEdge = gl.edge(edgeObj)
//     const points = glEdge.points || []
//     const polyline = new Polyline(points)

//     // check the `setLinkVertices` here for backwards compatibility
//     if (opt.setVertices || opt.setLinkVertices) {
//       if (util.isFunction(opt.setVertices)) {
//         opt.setVertices(link, points)
//       } else {
//         // simplify the `points` polyline
//         polyline.simplify({ threshold: SIMPLIFY_THRESHOLD })
//         const polylinePoints = polyline.points.map(point => point.toJSON()) // JSON of points after simplification
//         const numPolylinePoints = polylinePoints.length // number of points after simplification
//         // set simplified polyline points as link vertices
//         // remove first and last polyline points (= source/target sonnectionPoints)
//         link.set('vertices', polylinePoints.slice(1, numPolylinePoints - 1))
//       }
//     }

//     if (opt.setLabels && 'x' in glEdge && 'y' in glEdge) {
//       const labelPosition = { x: glEdge.x, y: glEdge.y }
//       if (util.isFunction(opt.setLabels)) {
//         opt.setLabels(link, labelPosition, points)
//       } else {
//         // convert the absolute label position to a relative position
//         // towards the closest point on the edge
//         const length = polyline.closestPointLength(labelPosition)
//         const closestPoint = polyline.pointAtLength(length)
//         const distance = length / polyline.length()
//         const offset = new g.Point(labelPosition)
//           .difference(closestPoint)
//           .toJSON()
//         link.label(0, {
//           position: {
//             distance,
//             offset,
//           },
//         })
//       }
//     }
//   }

//   function toGraphLib(graph, opt = {}) {
//     /* global graphlib: true */
//     const graphlibUtil =
//       opt.graphlib || (typeof graphlib !== 'undefined' ? graphlib : undefined)
//     /* global graphlib: false */

//     if (graphlibUtil === undefined) {
//       throw new Error('The the "graphlib" utility is a mandatory dependency.')
//     }

//     const glGraphType = util.pick(opt, 'directed', 'compound', 'multigraph')
//     const glGraph = new graphlibUtil.Graph(glGraphType)
//     const setNodeLabel = opt.setNodeLabel || util.noop
//     const setEdgeLabel = opt.setEdgeLabel || util.noop
//     const setEdgeName = opt.setEdgeName || util.noop
//     const collection = graph.get('cells')

//     for (let i = 0, n = collection.length; i < n; i++) {
//       const cell = collection.at(i)
//       if (cell.isLink()) {
//         const source = cell.get('source')
//         const target = cell.get('target')

//         // Links that end at a point are ignored.
//         if (!source.id || !target.id) break

//         // Note that if we are creating a multigraph we can name the edges. If
//         // we try to name edges on a non-multigraph an exception is thrown.
//         glGraph.setEdge(
//           source.id,
//           target.id,
//           setEdgeLabel(cell),
//           setEdgeName(cell),
//         )
//       } else {
//         glGraph.setNode(cell.id, setNodeLabel(cell))

//         // For the compound graphs we have to take embeds into account.
//         if (glGraph.isCompound() && cell.has('parent')) {
//           const parentId = cell.get('parent')
//           if (collection.has(parentId)) {
//             // Make sure the parent cell is included in the graph (this can
//             // happen when the layout is run on part of the graph only).
//             glGraph.setParent(cell.id, parentId)
//           }
//         }
//       }
//     }

//     return glGraph
//   }
// }
