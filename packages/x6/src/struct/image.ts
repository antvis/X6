export class Image {
  constructor(
    /**
     * String that specifies the URL of the image.
     */
    public src: string,

    /**
     * Integer that specifies the width of the image.
     */
    public width: number,

    /**
     * Integer that specifies the height of the image.
     */
    public height: number
  ) {}

  toString() {
    return this.src
  }

  valueOf() {
    return {
      src: this.src,
      width: this.width,
      height: this.height,
    }
  }
}

export namespace Image {
  export interface ImageLike {
    src: string
    width: number
    height: number
  }
}
