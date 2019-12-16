export const events = {
  refresh: 'refresh',
  root: 'root',

  addCells: 'addCells',
  cellsAdded: 'cellsAdded',
  removeCells: 'removeCells',
  cellsRemoved: 'cellsRemoved',
  removeCellsFromParent: 'removeCellsFromParent',
  connectCell: 'connectCell',
  cellConnected: 'cellConnected',
  groupCells: 'groupCells',
  ungroupCells: 'ungroupCells',
  splitEdge: 'splitEdge',
  updateCellSize: 'updateCellSize',
  resizeCells: 'resizeCells',
  cellsResized: 'cellsResized',
  addOverlay: 'addOverlay',
  removeOverlay: 'removeOverlay',
  removeOverlays: 'removeOverlays',
  foldCells: 'foldCells',
  cellsFolded: 'cellsFolded',
  orderCells: 'orderCells',
  cellsOrdered: 'cellsOrdered',
  toggleCells: 'toggleCells',
  flipEdge: 'flipEdge',
  alignCells: 'alignCells',
  moveCells: 'moveCells',
  cellsMoved: 'cellsMoved',

  startEditing: 'startEditing',
  editingStarted: 'editingStarted',
  editingStopped: 'editingStopped',
  size: 'size',

  click: 'click',
  dblclick: 'dblclick',
  tapAndHold: 'tapAndHold',
  escape: 'escape',

  gesture: 'gesture',
  fireMouseEvent: 'fireMouseEvent',
  selectionChanged: 'selectionChanged',
}

export interface EventArgs {
  pan: {
    panX: number
    panY: number
  }

  [key: string]: any
}
