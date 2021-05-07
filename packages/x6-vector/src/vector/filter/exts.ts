import { Decorator } from '../common/decorator'
import { Base } from '../common/base'
import { Filter } from './filter'
import { SVGFilterAttributes } from './types'

export class ContainerExtension<
  TSVGElement extends SVGElement
> extends Base<TSVGElement> {
  @Decorator.checkDefs
  filter<Attributes extends SVGFilterAttributes>(attrs?: Attributes | null) {
    return this.defs()!.filter(attrs)
  }
}

export class DefsExtension<
  TSVGElement extends SVGElement
> extends Base<TSVGElement> {
  filter<Attributes extends SVGFilterAttributes>(attrs?: Attributes | null) {
    return Filter.create(attrs).appendTo(this)
  }
}

export class ElementExtension<
  TSVGElement extends SVGElement
> extends Base<TSVGElement> {
  filterRef() {
    return this.reference<Filter>('filter')
  }

  filterWith(filter?: Filter | null) {
    if (filter) {
      this.attr('filter', filter.url())
    } else {
      this.unfilter()
    }

    return this
  }

  unfilter() {
    return this.attr('filter', null)
  }
}
