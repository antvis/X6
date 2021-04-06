import { PathArray } from '../../struct/path-array'
import { Text } from './text'
import { Path } from './path'

Text.register('TextPath')
export class TextPath extends Text<SVGTextPathElement> {
  plot(): PathArray
  plot(d: string | Path.Segment[] | PathArray): this
  plot(d?: string | Path.Segment[] | PathArray) {
    const track = this.track()
    if (d == null) {
      return track ? track.plot() : null
    }
    if (track) {
      track.plot(d)
    }

    return this
  }

  track() {
    return this.reference<Path>('href')
  }

  toArray() {
    const track = this.track()
    return track ? track.toArray() : null
  }

  toPathArray() {
    const track = this.track()
    return track ? track.toPathArray() : null
  }
}
