import { Point, Rectangle } from '../geometry'
import { globals } from '../option'
import { State } from '../core/state'
import { DirectionMask } from '../enum'
import { segment } from './segment'

const orthBuffer = 10
const orthPointsFallback = true

const dirVectors = [
  [-1, 0],
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
  [1, 0],
]

const wayPoints1 = [
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
]

const routePatterns = [
  [
    [513, 2308, 2081, 2562],
    [513, 1090, 514, 2184, 2114, 2561],
    [513, 1090, 514, 2564, 2184, 2562],
    [513, 2308, 2561, 1090, 514, 2568, 2308],
  ],
  [
    [514, 1057, 513, 2308, 2081, 2562],
    [514, 2184, 2114, 2561],
    [514, 2184, 2562, 1057, 513, 2564, 2184],
    [514, 1057, 513, 2568, 2308, 2561],
  ],
  [
    [1090, 514, 1057, 513, 2308, 2081, 2562],
    [2114, 2561],
    [1090, 2562, 1057, 513, 2564, 2184],
    [1090, 514, 1057, 513, 2308, 2561, 2568],
  ],
  [
    [2081, 2562],
    [1057, 513, 1090, 514, 2184, 2114, 2561],
    [1057, 513, 1090, 514, 2184, 2562, 2564],
    [1057, 2561, 1090, 514, 2568, 2308],
  ],
]

// const inlineRoutePatterns = [
//   [null, [2114, 2568], null, null],
//   [null, [514, 2081, 2114, 2568], null, null],
//   [null, [2114, 2561], null, null],
//   [[2081, 2562], [1057, 2114, 2568], [2184, 2562], null],
// ]

const vertexSeperations: number[] = []

const limits = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
]

// const LEFT_MASK = 32
// const TOP_MASK = 64
// const RIGHT_MASK = 128
// const BOTTOM_MASK = 256
const SIDE_MASK = 480

// const LEFT = 1
// const TOP = 2
// const RIGHT = 4
// const BOTTOM = 8

const CENTER_MASK = 512
const SOURCE_MASK = 1024
const TARGET_MASK = 2048
// const VERTEX_MASK = 3072

function getJettySize(
  edgeState: State,
  sourceState: State | null,
  targetState: State | null,
  points: Point[],
  isSource?: boolean,
) {
  let value =
    (isSource
      ? edgeState.style.sourceJettySize
      : edgeState.style.targetJettySize) ||
    edgeState.style.jettySize ||
    orthBuffer

  if ((value as any) === 'auto') {
    // Computes the automatic jetty size
    const type =
      (isSource ? edgeState.style.startArrow : edgeState.style.endArrow) ||
      'none'

    if (type !== 'none') {
      const size =
        (isSource ? edgeState.style.startSize : edgeState.style.endSize) ||
        globals.defaultMarkerSize

      value =
        Math.max(2, Math.ceil((size + orthBuffer) / orthBuffer)) * orthBuffer
    } else {
      value = 2 * orthBuffer
    }
  }

  return value
}

/**
 * Implements a local orthogonal router between the given
 * cells.
 *
 * Parameters:
 *
 * state - `State` that represents the edge to be updated.
 * source - `State` that represents the source terminal.
 * target - `State` that represents the target terminal.
 * points - List of relative control points.
 * result - Array of <Points> that represent the actual points of the
 * edge.
 *
 */
export function orth(
  edgeState: State,
  sourceState: State,
  targetState: State,
  points: Point[],
  result: Point[],
) {
  const graph = edgeState.view.graph
  const sourceEdge =
    sourceState == null ? false : graph.getModel().isEdge(sourceState.cell)
  const targetEdge =
    targetState == null ? false : graph.getModel().isEdge(targetState.cell)

  const pts = edgeState.absolutePoints
  const p0 = pts[0]!
  const pe = pts[pts.length - 1]!

  let sourceX = sourceState != null ? sourceState.bounds.x : p0.x
  let sourceY = sourceState != null ? sourceState.bounds.y : p0.y
  let sourceWidth = sourceState != null ? sourceState.bounds.width : 0
  let sourceHeight = sourceState != null ? sourceState.bounds.height : 0

  let targetX = targetState != null ? targetState.bounds.x : pe.x
  let targetY = targetState != null ? targetState.bounds.y : pe.y
  let targetWidth = targetState != null ? targetState.bounds.width : 0
  let targetHeight = targetState != null ? targetState.bounds.height : 0

  let scaledSourceBuffer =
    edgeState.view.scale *
    (getJettySize(edgeState, sourceState, targetState, points, true) as number)

  let scaledTargetBuffer =
    edgeState.view.scale *
    (getJettySize(edgeState, sourceState, targetState, points, false) as number)

  // Workaround for loop routing within buffer zone
  if (sourceState != null && targetState === sourceState) {
    scaledTargetBuffer = Math.max(scaledSourceBuffer, scaledTargetBuffer)
    scaledSourceBuffer = scaledTargetBuffer
  }

  const totalBuffer = scaledTargetBuffer + scaledSourceBuffer
  let tooShort = false

  // Checks minimum distance for fixed points and falls back to segment connector
  if (p0 != null && pe != null) {
    const dx = pe.x - p0.x
    const dy = pe.y - p0.y

    tooShort = dx * dx + dy * dy < totalBuffer * totalBuffer
  }

  if (
    tooShort ||
    (orthPointsFallback && points != null && points.length > 0) ||
    sourceEdge ||
    targetEdge
  ) {
    segment(edgeState, sourceState, targetState, points, result)
    return
  }

  // Determine the side(s) of the source and target vertices
  // that the edge may connect to
  // portAnchor [source, target]
  const portDir = [DirectionMask.all, DirectionMask.all]
  let rotation = 0

  if (sourceState != null) {
    portDir[0] = State.getPortConstraints(
      sourceState,
      edgeState,
      true,
      DirectionMask.all,
    )
    rotation = sourceState.style.rotation || 0
    if (rotation !== 0) {
      const newRect = new Rectangle(sourceX, sourceY, sourceWidth, sourceHeight)
      newRect.rotate(rotation)
      sourceX = newRect.x
      sourceY = newRect.y
      sourceWidth = newRect.width
      sourceHeight = newRect.height
    }
  }

  if (targetState != null) {
    portDir[1] = State.getPortConstraints(
      targetState,
      edgeState,
      false,
      DirectionMask.all,
    )
    rotation = targetState.style.rotation || 0
    if (rotation !== 0) {
      const newRect = new Rectangle(targetX, targetY, targetWidth, targetHeight)
      newRect.rotate(rotation)
      targetX = newRect.x
      targetY = newRect.y
      targetWidth = newRect.width
      targetHeight = newRect.height
    }
  }

  // Avoids floating point number errors
  sourceX = Math.round(sourceX * 10) / 10
  sourceY = Math.round(sourceY * 10) / 10
  sourceWidth = Math.round(sourceWidth * 10) / 10
  sourceHeight = Math.round(sourceHeight * 10) / 10

  targetX = Math.round(targetX * 10) / 10
  targetY = Math.round(targetY * 10) / 10
  targetWidth = Math.round(targetWidth * 10) / 10
  targetHeight = Math.round(targetHeight * 10) / 10

  const dir = [0, 0]

  // Work out which faces of the vertices present against each other
  // in a way that would allow a 3-segment connection if port anchors
  // permitted.
  // geo -> [source, target] [x, y, width, height]
  const geo = [
    [sourceX, sourceY, sourceWidth, sourceHeight],
    [targetX, targetY, targetWidth, targetHeight],
  ]
  const buffer = [scaledSourceBuffer, scaledTargetBuffer]

  for (let i = 0; i < 2; i += 1) {
    limits[i][1] = geo[i][0] - buffer[i]
    limits[i][2] = geo[i][1] - buffer[i]
    limits[i][4] = geo[i][0] + geo[i][2] + buffer[i]
    limits[i][8] = geo[i][1] + geo[i][3] + buffer[i]
  }

  // Work out which quad the target is in
  const sourceCenX = geo[0][0] + geo[0][2] / 2.0
  const sourceCenY = geo[0][1] + geo[0][3] / 2.0
  const targetCenX = geo[1][0] + geo[1][2] / 2.0
  const targetCenY = geo[1][1] + geo[1][3] / 2.0

  const dx = sourceCenX - targetCenX
  const dy = sourceCenY - targetCenY

  let quad = 0

  if (dx < 0) {
    if (dy < 0) {
      quad = 2
    } else {
      quad = 1
    }
  } else {
    if (dy <= 0) {
      quad = 3

      // Special case on x = 0 and negative y
      if (dx === 0) {
        quad = 2
      }
    }
  }

  // Check for connection anchors
  let currentTerm = null

  if (sourceState != null) {
    currentTerm = p0
  }

  const anchor = [
    [0.5, 0.5],
    [0.5, 0.5],
  ]

  for (let i = 0; i < 2; i += 1) {
    if (currentTerm != null) {
      anchor[i][0] = (currentTerm.x - geo[i][0]) / geo[i][2]

      if (Math.abs(currentTerm.x - geo[i][0]) <= 1) {
        dir[i] = DirectionMask.west
      } else if (Math.abs(currentTerm.x - geo[i][0] - geo[i][2]) <= 1) {
        dir[i] = DirectionMask.east
      }

      anchor[i][1] = (currentTerm.y - geo[i][1]) / geo[i][3]

      if (Math.abs(currentTerm.y - geo[i][1]) <= 1) {
        dir[i] = DirectionMask.north
      } else if (Math.abs(currentTerm.y - geo[i][1] - geo[i][3]) <= 1) {
        dir[i] = DirectionMask.south
      }
    }

    currentTerm = null

    if (targetState != null) {
      currentTerm = pe
    }
  }

  const sourceTopDist = geo[0][1] - (geo[1][1] + geo[1][3])
  const sourceLeftDist = geo[0][0] - (geo[1][0] + geo[1][2])
  const sourceBottomDist = geo[1][1] - (geo[0][1] + geo[0][3])
  const sourceRightDist = geo[1][0] - (geo[0][0] + geo[0][2])

  vertexSeperations[1] = Math.max(sourceLeftDist - totalBuffer, 0)
  vertexSeperations[2] = Math.max(sourceTopDist - totalBuffer, 0)
  vertexSeperations[4] = Math.max(sourceBottomDist - totalBuffer, 0)
  vertexSeperations[3] = Math.max(sourceRightDist - totalBuffer, 0)

  // ==============================================================
  // Start of source and target direction determination

  // Work through the preferred orientations by relative positioning
  // of the vertices and list them in preferred and available order

  const dirPref = []
  const horPref = []
  const vertPref = []

  horPref[0] =
    sourceLeftDist >= sourceRightDist ? DirectionMask.west : DirectionMask.east
  vertPref[0] =
    sourceTopDist >= sourceBottomDist
      ? DirectionMask.north
      : DirectionMask.south

  horPref[1] = State.reversePortConstraints(horPref[0])
  vertPref[1] = State.reversePortConstraints(vertPref[0])

  const preferredHorizDist =
    sourceLeftDist >= sourceRightDist ? sourceLeftDist : sourceRightDist
  const preferredVertDist =
    sourceTopDist >= sourceBottomDist ? sourceTopDist : sourceBottomDist

  const prefOrdering = [
    [0, 0],
    [0, 0],
  ]
  let preferredOrderSet = false

  // If the preferred port isn't available, switch it
  for (let i = 0; i < 2; i += 1) {
    if (dir[i] !== 0x0) {
      continue
    }

    if ((horPref[i] & portDir[i]) === 0) {
      horPref[i] = State.reversePortConstraints(horPref[i])
    }

    if ((vertPref[i] & portDir[i]) === 0) {
      vertPref[i] = State.reversePortConstraints(vertPref[i])
    }

    prefOrdering[i][0] = vertPref[i]
    prefOrdering[i][1] = horPref[i]
  }

  if (preferredVertDist > 0 && preferredHorizDist > 0) {
    // Possibility of two segment edge connection
    if ((horPref[0] & portDir[0]) > 0 && (vertPref[1] & portDir[1]) > 0) {
      prefOrdering[0][0] = horPref[0]
      prefOrdering[0][1] = vertPref[0]
      prefOrdering[1][0] = vertPref[1]
      prefOrdering[1][1] = horPref[1]
      preferredOrderSet = true
    } else if (
      (vertPref[0] & portDir[0]) > 0 &&
      (horPref[1] & portDir[1]) > 0
    ) {
      prefOrdering[0][0] = vertPref[0]
      prefOrdering[0][1] = horPref[0]
      prefOrdering[1][0] = horPref[1]
      prefOrdering[1][1] = vertPref[1]
      preferredOrderSet = true
    }
  }

  if (preferredVertDist > 0 && !preferredOrderSet) {
    prefOrdering[0][0] = vertPref[0]
    prefOrdering[0][1] = horPref[0]
    prefOrdering[1][0] = vertPref[1]
    prefOrdering[1][1] = horPref[1]
    preferredOrderSet = true
  }

  if (preferredHorizDist > 0 && !preferredOrderSet) {
    prefOrdering[0][0] = horPref[0]
    prefOrdering[0][1] = vertPref[0]
    prefOrdering[1][0] = horPref[1]
    prefOrdering[1][1] = vertPref[1]
    // preferredOrderSet not used any more
    // preferredOrderSet = true
  }

  // The source and target prefs are now an ordered list of
  // the preferred port selections
  // It the list can contain gaps, compact it

  for (let i = 0; i < 2; i += 1) {
    if (dir[i] !== 0x0) {
      continue
    }

    if ((prefOrdering[i][0] & portDir[i]) === 0) {
      prefOrdering[i][0] = prefOrdering[i][1]
    }

    dirPref[i] = prefOrdering[i][0] & portDir[i]
    dirPref[i] |= (prefOrdering[i][1] & portDir[i]) << 8
    dirPref[i] |= (prefOrdering[1 - i][i] & portDir[i]) << 16
    dirPref[i] |= (prefOrdering[1 - i][1 - i] & portDir[i]) << 24

    if ((dirPref[i] & 0xf) === 0) {
      dirPref[i] = dirPref[i] << 8
    }

    if ((dirPref[i] & 0xf00) === 0) {
      dirPref[i] = (dirPref[i] & 0xf) | (dirPref[i] >> 8)
    }

    if ((dirPref[i] & 0xf0000) === 0) {
      dirPref[i] = (dirPref[i] & 0xffff) | ((dirPref[i] & 0xf000000) >> 8)
    }

    dir[i] = dirPref[i] & 0xf

    if (
      portDir[i] === DirectionMask.west ||
      portDir[i] === DirectionMask.north ||
      portDir[i] === DirectionMask.east ||
      portDir[i] === DirectionMask.south
    ) {
      dir[i] = portDir[i]
    }
  }

  // ==============================================================
  // End of source and target direction determination

  let sourceIndex = dir[0] === DirectionMask.east ? 3 : dir[0]
  let targetIndex = dir[1] === DirectionMask.east ? 3 : dir[1]

  sourceIndex -= quad
  targetIndex -= quad

  if (sourceIndex < 1) {
    sourceIndex += 4
  }

  if (targetIndex < 1) {
    targetIndex += 4
  }

  const routePattern = routePatterns[sourceIndex - 1][targetIndex - 1]

  wayPoints1[0][0] = geo[0][0]
  wayPoints1[0][1] = geo[0][1]

  switch (dir[0]) {
    case DirectionMask.west:
      wayPoints1[0][0] -= scaledSourceBuffer
      wayPoints1[0][1] += anchor[0][1] * geo[0][3]
      break
    case DirectionMask.south:
      wayPoints1[0][0] += anchor[0][0] * geo[0][2]
      wayPoints1[0][1] += geo[0][3] + scaledSourceBuffer
      break
    case DirectionMask.east:
      wayPoints1[0][0] += geo[0][2] + scaledSourceBuffer
      wayPoints1[0][1] += anchor[0][1] * geo[0][3]
      break
    case DirectionMask.north:
      wayPoints1[0][0] += anchor[0][0] * geo[0][2]
      wayPoints1[0][1] -= scaledSourceBuffer
      break
  }

  let currentIndex = 0

  // Orientation, 0 horizontal, 1 vertical
  let lastOrientation =
    (dir[0] & (DirectionMask.east | DirectionMask.west)) > 0 ? 0 : 1
  const initialOrientation = lastOrientation
  let currentOrientation = 0

  for (let i = 0; i < routePattern.length; i += 1) {
    const nextDirection = routePattern[i] & 0xf

    // Rotate the index of this direction by the quad
    // to get the real direction
    let directionIndex =
      nextDirection === DirectionMask.east ? 3 : nextDirection

    directionIndex += quad

    if (directionIndex > 4) {
      directionIndex -= 4
    }

    const direction = dirVectors[directionIndex - 1]

    currentOrientation = directionIndex % 2 > 0 ? 0 : 1
    // Only update the current index if the point moved
    // in the direction of the current segment move,
    // otherwise the same point is moved until there is
    // a segment direction change
    if (currentOrientation !== lastOrientation) {
      currentIndex += 1
      // Copy the previous way point into the new one
      // We can't base the new position on index - 1
      // because sometime elbows turn out not to exist,
      // then we'd have to rewind.
      wayPoints1[currentIndex][0] = wayPoints1[currentIndex - 1][0]
      wayPoints1[currentIndex][1] = wayPoints1[currentIndex - 1][1]
    }

    const tar = (routePattern[i] & TARGET_MASK) > 0
    const sou = (routePattern[i] & SOURCE_MASK) > 0
    let side = (routePattern[i] & SIDE_MASK) >> 5
    side = side << quad

    if (side > 0xf) {
      side = side >> 4
    }

    const center = (routePattern[i] & CENTER_MASK) > 0

    if ((sou || tar) && side < 9) {
      let limit = 0
      const souTar = sou ? 0 : 1

      if (center && currentOrientation === 0) {
        limit = geo[souTar][0] + anchor[souTar][0] * geo[souTar][2]
      } else if (center) {
        limit = geo[souTar][1] + anchor[souTar][1] * geo[souTar][3]
      } else {
        limit = limits[souTar][side]
      }

      if (currentOrientation === 0) {
        const lastX = wayPoints1[currentIndex][0]
        const deltaX = (limit - lastX) * direction[0]

        if (deltaX > 0) {
          wayPoints1[currentIndex][0] += direction[0] * deltaX
        }
      } else {
        const lastY = wayPoints1[currentIndex][1]
        const deltaY = (limit - lastY) * direction[1]

        if (deltaY > 0) {
          wayPoints1[currentIndex][1] += direction[1] * deltaY
        }
      }
    } else if (center) {
      // Which center we're travelling to depend on the current direction
      wayPoints1[currentIndex][0] +=
        direction[0] * Math.abs(vertexSeperations[directionIndex] / 2)
      wayPoints1[currentIndex][1] +=
        direction[1] * Math.abs(vertexSeperations[directionIndex] / 2)
    }

    if (
      currentIndex > 0 &&
      wayPoints1[currentIndex][currentOrientation] ===
        wayPoints1[currentIndex - 1][currentOrientation]
    ) {
      currentIndex -= 1
    } else {
      lastOrientation = currentOrientation
    }
  }

  for (let i = 0; i <= currentIndex; i += 1) {
    if (i === currentIndex) {
      // Last point can cause last segment to be in
      // same direction as jetty/approach. If so,
      // check the number of points is consistent
      // with the relative orientation of source and target
      // jx. Same orientation requires an even
      // number of turns (points), different requires
      // odd.
      const targetOrientation =
        (dir[1] & (DirectionMask.east | DirectionMask.west)) > 0 ? 0 : 1

      const sameOrient = targetOrientation === initialOrientation ? 0 : 1

      // (currentIndex + 1) % 2 is 0 for even number of points,
      // 1 for odd
      if (sameOrient !== (currentIndex + 1) % 2) {
        // The last point isn't required
        break
      }
    }

    result.push(
      new Point(Math.round(wayPoints1[i][0]), Math.round(wayPoints1[i][1])),
    )
  }

  // Removes duplicates
  let index = 1

  while (index < result.length) {
    if (
      result[index - 1] == null ||
      result[index] == null ||
      result[index - 1].x !== result[index].x ||
      result[index - 1].y !== result[index].y
    ) {
      index += 1
    } else {
      result.splice(index, 1)
    }
  }
}
