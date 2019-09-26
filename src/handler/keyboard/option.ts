export interface KeyboardOptions {
  enabled: boolean

  /**
   * Specifies if keyboard event should bind on docuemnt or on container.
   *
   * Default is `false` that will bind keyboard event on the container.
   */
  global: boolean

  /**
   * Specifies if handle escape key press.
   *
   * Default is `true`.
   */
  escape: boolean
}
