import { Matrix } from '../../struct/matrix'
import { Morphable } from './morphable'

export class MorphableMatrix
  extends Matrix
  implements Morphable<Matrix.MatrixArray, Matrix.MatrixLike> {
  fromArray(arr: Matrix.MatrixArray) {
    this.a = arr[0]
    this.b = arr[1]
    this.c = arr[2]
    this.d = arr[3]
    this.e = arr[4]
    this.f = arr[5]
    return this
  }
}
