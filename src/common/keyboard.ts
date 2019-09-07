/**
 * An object which represents an abstract keyboard layout.
 */
export interface IKeyboardLayout {
  /**
   * The human readable name of the layout.
   *
   * This value is used primarily for display and debugging purposes.
   */
  readonly name: string

  /**
   * Get an array of all key values supported by the layout.
   *
   * @returns A new array of the supported key values.
   *
   * #### Notes
   * This can be useful for authoring tools and debugging, when it's
   * necessary to know which keys are available for shortcut use.
   */
  keys(): string[]

  /**
   * Test whether the given key is a valid value for the layout.
   *
   * @param key - The user provided key to test for validity.
   *
   * @returns `true` if the key is valid, `false` otherwise.
   */
  isValidKey(key: string): boolean

  /**
   * Get the key for a `'keydown'` event.
   *
   * @param event - The event object for a `'keydown'` event.
   *
   * @returns The associated key value, or an empty string if the event
   *   does not represent a valid primary key.
   */
  keyForKeydownEvent(event: KeyboardEvent): string
}

/**
 * A concrete implementation of [[IKeyboardLayout]] based on keycodes.
 *
 * The `keyCode` property of a `'keydown'` event is a browser and OS
 * specific representation of the physical key (not character) which
 * was pressed on a keyboard. While not the most convenient API, it
 * is currently the only one which works reliably on all browsers.
 *
 * This class accepts a user-defined mapping of keycode to key, which
 * allows for reliable shortcuts tailored to the user's system.
 */
export class KeyboardLayout implements IKeyboardLayout {
  /**
   * The human readable name of the layout.
   */
  readonly name: string
  private keyMap: KeyboardLayout.KeySet
  private codeMap: KeyboardLayout.CodeMap

  /**
   * Construct a new keycode layout.
   *
   * @param name - The human readable name for the layout.
   *
   * @param codes - A mapping of keycode to key value.
   */
  constructor(name: string, codes: KeyboardLayout.CodeMap) {
    this.name = name
    this.codeMap = codes
    this.keyMap = KeyboardLayout.extractKeys(codes)
  }

  /**
   * Get an array of the key values supported by the layout.
   *
   * @returns A new array of the supported key values.
   */
  keys(): string[] {
    return Object.keys(this.keyMap)
  }

  /**
   * Test whether the given key is a valid value for the layout.
   *
   * @param key - The user provided key to test for validity.
   *
   * @returns `true` if the key is valid, `false` otherwise.
   */
  isValidKey(key: string): boolean {
    return key in this.keyMap
  }

  /**
   * Get the key for a `'keydown'` event.
   *
   * @param event - The event object for a `'keydown'` event.
   *
   * @returns The associated key value, or an empty string if
   *   the event does not represent a valid primary key.
   */
  keyForKeydownEvent(event: KeyboardEvent): string {
    return this.codeMap[event.keyCode] || ''
  }
}

/**
 * The namespace for the `KeycodeLayout` class statics.
 */
export namespace KeyboardLayout {
  /**
   * A type alias for a keycode map.
   */
  export type CodeMap = { readonly [code: number]: string }

  /**
   * A type alias for a key set.
   */
  export type KeySet = { readonly [key: string]: boolean }

  /**
   * Extract the set of keys from a code map.
   *
   * @param code - The code map of interest.
   *
   * @returns A set of the keys in the code map.
   */
  export function extractKeys(codes: CodeMap): KeySet {
    const keys: any = Object.create(null)
    for (const c in codes) {
      keys[codes[c]] = true
    }
    return keys as KeySet
  }
}

/**
 * A keycode-based keyboard layout for US English keyboards.
 *
 * This layout is valid for the following OS/Browser combinations.
 *
 * - Windows
 *   - Chrome
 *   - Firefox
 *   - IE
 *
 * - OSX
 *   - Chrome
 *   - Firefox
 *   - Safari
 *
 * - Linux
 *   - Chrome
 *   - Firefox
 *
 * Other combinations may also work, but are untested.
 */
export const EN_US: IKeyboardLayout = new KeyboardLayout('en-us', {
  8: 'Backspace',
  9: 'Tab',
  13: 'Enter',
  19: 'Pause',
  27: 'Escape',
  32: 'Space',
  33: 'PageUp',
  34: 'PageDown',
  35: 'End',
  36: 'Home',
  37: 'ArrowLeft',
  38: 'ArrowUp',
  39: 'ArrowRight',
  40: 'ArrowDown',
  45: 'Insert',
  46: 'Delete',
  48: '0',
  49: '1',
  50: '2',
  51: '3',
  52: '4',
  53: '5',
  54: '6',
  55: '7',
  56: '8',
  57: '9',
  59: ';',  // firefox
  61: '=',  // firefox
  65: 'A',
  66: 'B',
  67: 'C',
  68: 'D',
  69: 'E',
  70: 'F',
  71: 'G',
  72: 'H',
  73: 'I',
  74: 'J',
  75: 'K',
  76: 'L',
  77: 'M',
  78: 'N',
  79: 'O',
  80: 'P',
  81: 'Q',
  82: 'R',
  83: 'S',
  84: 'T',
  85: 'U',
  86: 'V',
  87: 'W',
  88: 'X',
  89: 'Y',
  90: 'Z',
  93: 'ContextMenu',
  96: '0',   // numpad
  97: '1',   // numpad
  98: '2',   // numpad
  99: '3',   // numpad
  100: '4',  // numpad
  101: '5',  // numpad
  102: '6',  // numpad
  103: '7',  // numpad
  104: '8',  // numpad
  105: '9',  // numpad
  106: '*',  // numpad
  107: '+',  // numpad
  109: '-',  // numpad
  110: '.',  // numpad
  111: '/',  // numpad
  112: 'F1',
  113: 'F2',
  114: 'F3',
  115: 'F4',
  116: 'F5',
  117: 'F6',
  118: 'F7',
  119: 'F8',
  120: 'F9',
  121: 'F10',
  122: 'F11',
  123: 'F12',
  173: '-',  // firefox
  186: ';',  // non-firefox
  187: '=',  // non-firefox
  188: ',',
  189: '-',  // non-firefox
  190: '.',
  191: '/',
  192: '`',
  219: '[',
  220: '\\',
  221: ']',
  222: '\'',
})

/**
 * Get the global application keyboard layout instance.
 *
 * @returns The keyboard layout for use by the application.
 *
 * #### Notes
 * The default keyboard layout is US-English.
 */
export function getKeyboardLayout(): IKeyboardLayout {
  return Private.keyboardLayout
}

/**
 * Set the global application keyboard layout instance.
 *
 * @param - The keyboard layout for use by the application.
 *
 * #### Notes
 * The keyboard layout should typically be set on application startup
 * to a layout which is appropriate for the user's system.
 */
export function setKeyboardLayout(layout: IKeyboardLayout): void {
  Private.keyboardLayout = layout
}

namespace Private {
  export let keyboardLayout = EN_US
}
