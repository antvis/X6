import { Vector } from '../vector/vector'
import { Referent } from '../container/referent'
import { FilterUnits, PrimitiveUnits, SVGFilterAttributes } from './types'

@Filter.register('Filter')
export class Filter extends Referent<SVGFilterElement> {
  units(): FilterUnits
  units(units: FilterUnits | null): this
  units(units?: FilterUnits | null) {
    return this.attr('filterUnits', units)
  }

  primitiveUnits(): PrimitiveUnits
  primitiveUnits(units: PrimitiveUnits | null): this
  primitiveUnits(units?: PrimitiveUnits | null) {
    return this.attr('primitiveUnits', units)
  }

  update(handler: Filter.Update) {
    this.clear()

    if (typeof handler === 'function') {
      handler.call(this, this)
    }

    return this
  }

  remove() {
    this.targets().forEach((target) => target.unfilter())
    return super.remove()
  }

  targets<TVector extends Vector>() {
    return this.findTargets<TVector>(`filter`)
  }
}

export namespace Filter {
  export type Update = (this: Filter, filter: Filter) => void

  export function create<Attributes extends SVGFilterAttributes>(
    attrs?: Attributes | null,
  ) {
    const filter = new Filter()
    if (attrs) {
      filter.attr(attrs)
    }
    return filter
  }
}
