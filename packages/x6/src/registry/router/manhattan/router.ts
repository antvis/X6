import { KeyValue } from '../../../types'
import { FunctionExt } from '../../../util'
import { Point, Rectangle } from '../../../geometry'
import { EdgeView } from '../../../view'
import { Router } from '../index'
import { SortedSet } from './sorted-set'
import { ObstacleMap } from './obstacle-map'
import * as util from './util'
import {
  resolveOptions,
  ResolvedOptions,
  ManhattanRouterOptions,
} from './options'

/**
 * Finds the route between two points (`from`, `to`).
 */
function findRoute(
  edgeView: EdgeView,
  from: Point | Rectangle,
  to: Point | Rectangle,
  map: ObstacleMap,
  options: ResolvedOptions,
) {
  const precision = options.precision

  let sourceEndpoint
  let targetEndpoint

  if (Rectangle.isRectangle(from)) {
    sourceEndpoint = util.round(
      util.getSourceEndpoint(edgeView, options).clone(),
      precision,
    )
  } else {
    sourceEndpoint = util.round(from.clone(), precision)
  }

  if (Rectangle.isRectangle(to)) {
    targetEndpoint = util.round(
      util.getTargetEndpoint(edgeView, options).clone(),
      precision,
    )
  } else {
    targetEndpoint = util.round(to.clone(), precision)
  }

  // Get grid for this route.
  const grid = util.getGrid(options.step, sourceEndpoint, targetEndpoint)

  // Get pathfinding points.
  // -----------------------

  const startPoint = sourceEndpoint
  const endPoint = targetEndpoint
  let startPoints
  let endPoints

  if (Rectangle.isRectangle(from)) {
    startPoints = util.getRectPoints(
      startPoint,
      from,
      options.startDirections,
      grid,
      options,
    )
  } else {
    startPoints = [startPoint]
  }

  if (Rectangle.isRectangle(to)) {
    endPoints = util.getRectPoints(
      targetEndpoint,
      to,
      options.endDirections,
      grid,
      options,
    )
  } else {
    endPoints = [endPoint]
  }

  // take into account only accessible rect points (those not under obstacles)
  startPoints = startPoints.filter((p) => map.isAccessible(p))
  endPoints = endPoints.filter((p) => map.isAccessible(p))

  // There is an accessible route point on both sides.
  if (startPoints.length > 0 && endPoints.length > 0) {
    const openSet = new SortedSet()
    // Keeps the actual points for given nodes of the open set.
    const points: KeyValue<Point> = {}
    // Keeps the point that is immediate predecessor of given element.
    const parents: KeyValue<Point> = {}
    // Cost from start to a point along best known path.
    const costs: KeyValue<number> = {}

    for (let i = 0, n = startPoints.length; i < n; i += 1) {
      // startPoint is assumed to be aligned already
      const startPoint = startPoints[i]
      const key = util.getKey(startPoint)
      openSet.add(key, util.getCost(startPoint, endPoints))
      points[key] = startPoint
      costs[key] = 0
    }

    const previousRouteDirectionAngle = options.previousDirectionAngle
    // undefined for first route
    const isPathBeginning = previousRouteDirectionAngle === undefined

    // directions
    let direction
    let directionChange
    const directions = util.getGridOffsets(grid, options)
    const numDirections = directions.length
    const endPointsKeys = endPoints.reduce<string[]>((res, endPoint) => {
      const key = util.getKey(endPoint)
      res.push(key)
      return res
    }, [])

    // main route finding loop
    const sameStartEndPoints = Point.equalPoints(startPoints, endPoints)
    let loopsRemaining = options.maxLoopCount
    while (!openSet.isEmpty() && loopsRemaining > 0) {
      // Get the closest item and mark it CLOSED
      const currentKey = openSet.pop()!
      const currentPoint = points[currentKey]
      const currentParent = parents[currentKey]
      const currentCost = costs[currentKey]

      const isStartPoint = currentPoint.equals(startPoint)
      const isRouteBeginning = currentParent == null

      let previousDirectionAngle: number | null | undefined
      if (!isRouteBeginning) {
        previousDirectionAngle = util.getDirectionAngle(
          currentParent,
          currentPoint,
          numDirections,
          grid,
          options,
        )
      } else if (!isPathBeginning) {
        // a vertex on the route
        previousDirectionAngle = previousRouteDirectionAngle
      } else if (!isStartPoint) {
        // beginning of route on the path
        previousDirectionAngle = util.getDirectionAngle(
          startPoint,
          currentPoint,
          numDirections,
          grid,
          options,
        )
      } else {
        previousDirectionAngle = null
      }

      // Check if we reached any endpoint
      const skipEndCheck = isRouteBeginning && sameStartEndPoints
      if (!skipEndCheck && endPointsKeys.indexOf(currentKey) >= 0) {
        options.previousDirectionAngle = previousDirectionAngle
        return util.reconstructRoute(
          parents,
          points,
          currentPoint,
          startPoint,
          endPoint,
        )
      }

      // Go over all possible directions and find neighbors
      for (let i = 0; i < numDirections; i += 1) {
        direction = directions[i]

        const directionAngle = direction.angle!
        directionChange = util.getDirectionChange(
          previousDirectionAngle!,
          directionAngle,
        )

        // Don't use the point changed rapidly.
        if (
          !(isPathBeginning && isStartPoint) &&
          directionChange > options.maxDirectionChange
        ) {
          continue
        }

        const neighborPoint = util.align(
          currentPoint
            .clone()
            .translate(direction.gridOffsetX || 0, direction.gridOffsetY || 0),
          grid,
          precision,
        )
        const neighborKey = util.getKey(neighborPoint)

        // Closed points were already evaluated.
        if (openSet.isClose(neighborKey) || !map.isAccessible(neighborPoint)) {
          continue
        }

        // Neighbor is an end point.
        if (endPointsKeys.indexOf(neighborKey) >= 0) {
          const isEndPoint = neighborPoint.equals(endPoint)
          if (!isEndPoint) {
            const endDirectionAngle = util.getDirectionAngle(
              neighborPoint,
              endPoint,
              numDirections,
              grid,
              options,
            )

            const endDirectionChange = util.getDirectionChange(
              directionAngle,
              endDirectionAngle,
            )

            if (endDirectionChange > options.maxDirectionChange) {
              continue
            }
          }
        }

        // The current direction is ok.
        // ----------------------------

        const neighborCost = direction.cost
        const neighborPenalty = isStartPoint
          ? 0
          : options.penalties[directionChange]
        const costFromStart = currentCost + neighborCost + neighborPenalty

        // Neighbor point has not been processed yet or the cost of
        // the path from start is lower than previously calculated.
        if (
          !openSet.isOpen(neighborKey) ||
          costFromStart < costs[neighborKey]
        ) {
          points[neighborKey] = neighborPoint
          parents[neighborKey] = currentPoint
          costs[neighborKey] = costFromStart
          openSet.add(
            neighborKey,
            costFromStart + util.getCost(neighborPoint, endPoints),
          )
        }
      }

      loopsRemaining -= 1
    }
  }

  if (options.fallbackRoute) {
    return FunctionExt.call(
      options.fallbackRoute,
      this,
      startPoint,
      endPoint,
      options,
    )
  }

  return null
}

export const router: Router.Definition<ManhattanRouterOptions> = function (
  vertices,
  optionsRaw,
  edgeView,
) {
  const options = resolveOptions(optionsRaw)
  const sourceBBox = util.getSourceBBox(edgeView, options)
  const targetBBox = util.getTargetBBox(edgeView, options)
  const sourceEndpoint = util.getSourceEndpoint(edgeView, options)

  // pathfinding
  const map = new ObstacleMap(options).build(
    edgeView.graph.model,
    edgeView.cell,
  )

  const oldVertices = vertices.map((p) => Point.create(p))
  const newVertices: Point[] = []

  // The origin of first route's grid, does not need snapping
  let tailPoint = sourceEndpoint

  let from
  let to

  for (let i = 0, len = oldVertices.length; i <= len; i += 1) {
    let partialRoute: Point[] | null = null

    from = to || sourceBBox
    to = oldVertices[i]

    // This is the last iteration
    if (to == null) {
      to = targetBBox

      // If the target is a point, we should use dragging route
      // instead of main routing method if it has been provided.
      const edge = edgeView.cell
      const isEndingAtPoint =
        edge.getSourceCellId() == null || edge.getTargetCellId() == null

      if (isEndingAtPoint && typeof options.draggingRouter === 'function') {
        const dragFrom = from === sourceBBox ? sourceEndpoint : from
        const dragTo = to.getOrigin()
        partialRoute = FunctionExt.call(
          options.draggingRouter,
          edgeView,
          dragFrom,
          dragTo,
          options,
        )
      }
    }

    // Find the partial route
    if (partialRoute == null) {
      partialRoute = findRoute(edgeView, from, to, map, options)
    }

    // Cannot found the partial route.
    if (partialRoute === null) {
      return FunctionExt.call(
        options.fallbackRouter,
        this,
        vertices,
        options,
        edgeView,
      )
    }

    // Remove the first point if the previous partial route has
    // the same point as last.
    const leadPoint = partialRoute[0]
    if (leadPoint && leadPoint.equals(tailPoint)) {
      partialRoute.shift()
    }

    // Save tailPoint for next iteration
    tailPoint = partialRoute[partialRoute.length - 1] || tailPoint
    newVertices.push(...partialRoute)
  }

  return newVertices
}
