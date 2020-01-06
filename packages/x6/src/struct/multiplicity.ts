import { DomUtil } from '../dom'
import { Cell } from '../core/cell'
import { Graph } from '../graph'

export class Multiplicity {
  constructor(options: Multiplicity.Options) {
    this.isSource = options.isSource
    this.nodeName = options.nodeName
    this.attrName = options.attrName
    this.attrValue = options.attrValue
    this.min = options.min != null ? options.min : 0
    this.max = options.max != null ? options.max : 0
    this.validNeighbors = options.validNeighbors || []
    this.validNeighborsAllowed =
      options.validNeighborsAllowed != null
        ? options.validNeighborsAllowed
        : true
    this.countError = options.countError || null
    this.typeError = options.typeError || null
  }

  /**
   * Boolean that specifies if the rule is applied to the source or target
   * terminal of an edge.
   */
  isSource?: boolean
  nodeName?: string
  attrName?: string
  attrValue?: string

  /**
   * Defines the minimum number of connections for which this rule applies.
   *
   * Default is `0`.
   */
  min: number = 0

  /**
   * Defines the maximum number of connections for which this rule applies.
   *
   * A value of `0` means unlimited times.
   *
   * Default is `0`.
   */
  max: number = 0

  /**
   * Holds an array of strings that specify the nodeName of neighbor for
   * which this rule applies.
   */
  validNeighbors: string[]

  /**
   * Boolean indicating if the list of validNeighbors are those that are
   * allowed for this rule or those that are not allowed for this rule.
   */
  validNeighborsAllowed: boolean

  countError: string | null
  typeError: string | null

  /**
   * Checks the multiplicity for the given arguments and returns the error
   * for the given connection or null if the multiplicity does not apply.
   *
   * @param graph The Graph instance.
   * @param edge The edge to validate.
   * @param source The source terminal.
   * @param target The target terminal.
   * @param sourceOut Number of outgoing edges from the source terminal.
   * @param targetIn Number of incoming edges for the target terminal.
   */
  check(
    graph: Graph,
    edge: Cell | null,
    source: Cell | null,
    target: Cell | null,
    sourceOut: number,
    targetIn: number,
  ) {
    let error = ''

    if (
      (this.isSource && this.checkTerminal(graph, source, edge)) ||
      (!this.isSource && this.checkTerminal(graph, target, edge))
    ) {
      if (this.countError != null) {
        if (
          (this.isSource &&
            ((this.max > 0 && sourceOut > this.max) || sourceOut < this.min)) ||
          (!this.isSource &&
            ((this.max > 0 && targetIn > this.max) || targetIn < this.min))
        ) {
          error += `${this.countError}\n`
        }
      }

      if (
        this.typeError != null &&
        this.validNeighbors != null &&
        this.validNeighbors.length > 0
      ) {
        const isValid = this.checkNeighbors(graph, edge, source, target)
        if (!isValid) {
          error += `${this.typeError}\n`
        }
      }
    }

    return error.length > 0 ? error : null
  }

  protected checkNeighbors(
    graph: Graph,
    edge: Cell | null,
    source: Cell | null,
    target: Cell | null,
  ) {
    const sourceData = graph.model.getData(source)
    const targetData = graph.model.getData(target)
    let isValid = !this.validNeighborsAllowed
    const neighbors = this.validNeighbors

    for (let i = 0, ii = neighbors.length; i < ii; i += 1) {
      if (this.isSource && this.checkType(graph, targetData, neighbors[i])) {
        isValid = this.validNeighborsAllowed
        break
      } else if (
        !this.isSource &&
        this.checkType(graph, sourceData, neighbors[i])
      ) {
        isValid = this.validNeighborsAllowed
        break
      }
    }

    return isValid
  }

  /**
   * Checks the given terminal cell and returns true if this rule applies.
   */
  protected checkTerminal(
    graph: Graph,
    terminal: Cell | null,
    edge: Cell | null,
  ) {
    const data = graph.model.getData(terminal)
    return this.checkType(
      graph,
      data,
      this.nodeName,
      this.attrName,
      this.attrValue,
    )
  }

  /**
   * Checks the type of the given value.
   */
  protected checkType(
    graph: Graph,
    data: any,
    nodeName?: string,
    attrName?: string,
    attrValue?: string,
  ) {
    if (data != null) {
      if (!isNaN(data.nodeType)) {
        return DomUtil.isHtmlElement(data, nodeName, attrName, attrValue)
      }

      return data === nodeName
    }

    return false
  }
}

export namespace Multiplicity {
  export interface Options {
    isSource?: boolean
    nodeName?: string
    attrName?: string
    attrValue?: string
    validNeighbors?: string[]
    validNeighborsAllowed?: boolean
    countError?: string
    typeError?: string
    min?: number
    max?: number
  }
}
