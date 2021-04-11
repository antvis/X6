export namespace ID {
  let seed = 0

  export function generate() {
    seed += 1
    return `vector-${seed}`
  }

  export function overwrite<TElement extends Element>(
    node: TElement,
    deep = true,
  ) {
    if (deep) {
      const children = node.children
      for (let i = children.length - 1; i >= 0; i -= 1) {
        overwrite(children[i], true)
      }
    }

    if (node.id) {
      node.id = generate()
    }
  }
}
