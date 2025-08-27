type CreateDivElementResult = {
  div: HTMLDivElement
  destroy: () => void
}

/**
 * Create a div element and append it to the specified container.
 * @param container The container to append the div to.
 * @returns The created div element and a function to remove it.
 */
export function createDivElement(
  container: HTMLElement = document.body,
): CreateDivElementResult {
  const div = document.createElement('div')
  container.appendChild(div)
  return {
    div,
    destroy: () => {
      container.removeChild(div)
    },
  }
}
