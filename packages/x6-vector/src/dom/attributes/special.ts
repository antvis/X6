import { Util } from './util'

export class Special {
  public readonly acceptsBooleans: boolean

  constructor(
    public readonly type: Special.Type,
    public readonly propertyName: string,
    public readonly attributeName: string,
    public readonly attributeNamespace: string | null = null,
    public readonly mustUseProperty: boolean = false,
    public readonly sanitizeURL: boolean = false,
    public readonly removeEmptyString: boolean = false,
  ) {
    this.acceptsBooleans =
      type === Special.Type.BOOLEAN ||
      type === Special.Type.BOOLEANISH_STRING ||
      type === Special.Type.OVERLOADED_BOOLEAN
  }
}

export namespace Special {
  export enum Type {
    /**
     * A simple string attribute.
     *
     * Attributes that aren't in the filter are presumed to have this type.
     */
    STRING,
    /**
     * A string attribute that accepts booleans. In HTML, these are called
     * "enumerated" attributes with "true" and "false" as possible values.
     *
     * When true, it should be set to a "true" string.
     *
     * When false, it should be set to a "false" string.
     */
    BOOLEANISH_STRING,
    /**
     * A real boolean attribute.
     *
     * When true, it should be present (set either to an empty string or its name).
     *
     * When false, it should be omitted.
     */
    BOOLEAN,
    /**
     * An attribute that can be used as a flag as well as with a value.
     *
     * When true, it should be present (set either to an empty string or its name).
     *
     * When false, it should be omitted.
     *
     * For any other value, should be present with that value.
     */
    OVERLOADED_BOOLEAN,

    /**
     * An attribute that must be numeric or parse as a numeric.
     *
     * When falsy, it should be removed.
     */
    NUMERIC,

    /**
     * An attribute that must be positive numeric or parse as a positive numeric.
     *
     * When falsy, it should be removed.
     */
    POSITIVE_NUMERIC,
  }
}

export namespace Special {
  export const specials: Record<string, Special> = {}
  export function get(name: string) {
    return specials[name] || null
  }
}

export namespace Special {
  const arr = [
    'vector:data',
    'aria-activedescendant',
    'aria-atomic',
    'aria-autocomplete',
    'aria-busy',
    'aria-checked',
    'aria-colcount',
    'aria-colindex',
    'aria-colspan',
    'aria-controls',
    'aria-current',
    'aria-describedby',
    'aria-details',
    'aria-disabled',
    'aria-dropeffect',
    'aria-errormessage',
    'aria-expanded',
    'aria-flowto',
    'aria-grabbed',
    'aria-haspopup',
    'aria-hidden',
    'aria-invalid',
    'aria-keyshortcuts',
    'aria-label',
    'aria-labelledby',
    'aria-level',
    'aria-live',
    'aria-modal',
    'aria-multiline',
    'aria-multiselectable',
    'aria-orientation',
    'aria-owns',
    'aria-placeholder',
    'aria-posinset',
    'aria-pressed',
    'aria-readonly',
    'aria-relevant',
    'aria-required',
    'aria-roledescription',
    'aria-rowcount',
    'aria-rowindex',
    'aria-rowspan',
    'aria-selected',
    'aria-setsize',
    'aria-sort',
    'aria-valuemax',
    'aria-valuemin',
    'aria-valuenow',
    'aria-valuetext',
  ]
  arr.forEach((attributeName) => {
    const name = Util.camelCase(attributeName)
    specials[name] = new Special(
      Type.STRING,
      name,
      attributeName,
      null, // attributeNamespace
      false, // mustUseProperty
      false, // sanitizeURL
      false, // removeEmptyString
    )
  })
}

export namespace Special {
  const arr = [
    'accessKey',
    'contextMenu',
    'radioGroup',
    'autoCapitalize',
    'autoCorrect',
    'autoSave',
    'itemProp',
    'itemType',
    'itemID',
    'itemRef',
    'input-modalities',
    'inputMode',
    'referrerPolicy',
    'formEncType',
    'formMethod',
    'formTarget',
    'dateTime',
    'autoComplete',
    'encType',
    'allowTransparency',
    'frameBorder',
    'marginHeight',
    'marginWidth',
    'srcDoc',
    'crossOrigin',
    'srcSet',
    'useMap',
    'enterKeyHint',
    'maxLength',
    'minLength',
    'keyType',
    'keyParams',
    'hrefLang',
    'charSet',
    'controlsList',
    'mediaGroup',
    'classID',
    'cellPadding',
    'cellSpacing',
    'dirName',
    'srcLang',
  ]
  arr.forEach((attributeName) => {
    specials[attributeName] = new Special(
      Type.STRING,
      attributeName,
      attributeName.toLowerCase(), // attributeName
      null, // attributeNamespace
      false, // mustUseProperty
      false, // sanitizeURL
      false, // removeEmptyString
    )
  })
}

export namespace Special {
  // A few string attributes have a different name.
  const arr = ['accept-charset', 'http-equiv']
  arr.forEach((attributeName) => {
    const name = Util.camelCase(attributeName)
    specials[name] = new Special(
      Type.STRING,
      name,
      attributeName, // attributeName
      null, // attributeNamespace
      false, // mustUseProperty
      false, // sanitizeURL
      false, // removeEmptyString
    )
  })
}

export namespace Special {
  // These are HTML boolean attributes.
  const arr = [
    'allowFullScreen',
    'async',
    // Note: there is a special case that prevents it from being written to the DOM
    // on the client side because the browsers are inconsistent. Instead we call focus().
    'autoFocus',
    'autoPlay',
    'controls',
    'default',
    'defer',
    'disabled',
    'disablePictureInPicture',
    'disableRemotePlayback',
    'formNoValidate',
    'hidden',
    'loop',
    'noModule',
    'noValidate',
    'open',
    'playsInline',
    'readOnly',
    'required',
    'reversed',
    'scoped',
    'seamless',
    'itemScope',
  ]
  arr.forEach((name) => {
    specials[name] = new Special(
      Type.BOOLEAN,
      name,
      name.toLowerCase(), // attributeName
      null, // attributeNamespace
      false, // mustUseProperty
      false, // sanitizeURL
      false, // removeEmptyString
    )
  })
}

export namespace Special {
  // These are "enumerated" HTML attributes that accept "true" and "false".
  // We can pass `true` and `false` even though technically ese aren't
  // boolean attributes (they are coerced to strings).
  const arr = ['contentEditable', 'draggable', 'spellCheck', 'value']
  arr.forEach((name) => {
    specials[name] = new Special(
      Type.BOOLEANISH_STRING,
      name,
      name.toLowerCase(), // attributeName
      null, // attributeNamespace
      false, // mustUseProperty
      false, // sanitizeURL
      false, // removeEmptyString
    )
  })
}

export namespace Special {
  // These are "enumerated" SVG attributes that accept "true" and "false".
  // We can pass `true` and `false` even though technically these aren't
  // boolean attributes (they are coerced to strings).
  // Since these are SVG attributes, their attribute names are case-sensitive.
  const arr = [
    'autoReverse',
    'externalResourcesRequired',
    'focusable',
    'preserveAlpha',
  ]

  arr.forEach((name) => {
    specials[name] = new Special(
      Type.BOOLEANISH_STRING,
      name,
      name, // attributeName
      null, // attributeNamespace
      false, // mustUseProperty
      false, // sanitizeURL
      false, // removeEmptyString
    )
  })
}

export namespace Special {
  // These are the few props that we set as DOM properties
  // rather than attributes. These are all booleans.
  const arr = [
    'checked',
    // Note: `option.selected` is not updated if `select.multiple` is
    // disabled with `removeAttribute`. We have special logic for handling this.
    'multiple',
    'muted',
    'selected',
  ]
  arr.forEach((name) => {
    specials[name] = new Special(
      Type.BOOLEAN,
      name,
      name.toLowerCase(), // attributeName
      null, // attributeNamespace
      true, // mustUseProperty
      false, // sanitizeURL
      false, // removeEmptyString
    )
  })
}

export namespace Special {
  // These are HTML attributes that are "overloaded booleans": they behave like
  // booleans, but can also accept a string value.
  const arr = ['capture', 'download']
  arr.forEach((name) => {
    specials[name] = new Special(
      Type.OVERLOADED_BOOLEAN,
      name,
      name.toLowerCase(), // attributeName
      null, // attributeNamespace
      false, // mustUseProperty
      false, // sanitizeURL
      false, // removeEmptyString
    )
  })
}

export namespace Special {
  // These are HTML attributes that must be positive numbers.
  const arr = ['cols', 'rows', 'size', 'span']
  arr.forEach((name) => {
    specials[name] = new Special(
      Type.POSITIVE_NUMERIC,
      name,
      name.toLowerCase(), // attributeName
      null, // attributeNamespace
      false, // mustUseProperty
      false, // sanitizeURL
      false, // removeEmptyString
    )
  })
}

export namespace Special {
  // These are HTML attributes that must be numbers.
  const arr = ['tabIndex', 'rowSpan', 'colSpan', 'start']
  arr.forEach((name) => {
    specials[name] = new Special(
      Type.NUMERIC,
      name,
      name.toLowerCase(), // attributeName
      null, // attributeNamespace
      false, // mustUseProperty
      false, // sanitizeURL
      false, // removeEmptyString
    )
  })
}

export namespace Special {
  // This is a list of all SVG attributes that need special casing, namespacing,
  // or boolean value assignment. Regular attributes that just accept strings
  // and have the same names are omitted, just like in the HTML attribute filter.
  // Some of these attributes can be hard to find. This list was created by
  // scraping the MDN documentation.
  const arr1 = [
    'accent-height',
    'alignment-baseline',
    'arabic-form',
    'baseline-shift',
    'cap-height',
    'clip-path',
    'clip-rule',
    'color-interpolation',
    'color-interpolation-filters',
    'color-profile',
    'color-rendering',
    'dominant-baseline',
    'enable-background',
    'fill-opacity',
    'fill-rule',
    'flood-color',
    'flood-opacity',
    'font-family',
    'font-size',
    'font-size-adjust',
    'font-stretch',
    'font-style',
    'font-variant',
    'font-weight',
    'glyph-name',
    'glyph-orientation-horizontal',
    'glyph-orientation-vertical',
    'horiz-adv-x',
    'horiz-origin-x',
    'image-rendering',
    'letter-spacing',
    'lighting-color',
    'marker-end',
    'marker-mid',
    'marker-start',
    'overline-position',
    'overline-thickness',
    'paint-order',
    'panose-1',
    'pointer-events',
    'rendering-intent',
    'shape-rendering',
    'stop-color',
    'stop-opacity',
    'strikethrough-position',
    'strikethrough-thickness',
    'stroke-dasharray',
    'stroke-dashoffset',
    'stroke-linecap',
    'stroke-linejoin',
    'stroke-miterlimit',
    'stroke-opacity',
    'stroke-width',
    'text-anchor',
    'text-decoration',
    'text-rendering',
    'underline-position',
    'underline-thickness',
    'unicode-bidi',
    'unicode-range',
    'units-per-em',
    'v-alphabetic',
    'v-hanging',
    'v-ideographic',
    'v-mathematical',
    'vector-effect',
    'vert-adv-y',
    'vert-origin-x',
    'vert-origin-y',
    'word-spacing',
    'writing-mode',
    'xmlns:xlink',
    'x-height',
  ]

  arr1.forEach((attributeName) => {
    const name = Util.camelCase(attributeName)
    specials[name] = new Special(
      Type.STRING,
      name,
      attributeName,
      null, // attributeNamespace
      false, // mustUseProperty
      false, // sanitizeURL
      false, // removeEmptyString
    )
  })

  // String SVG attributes with the xlink namespace.
  const arr2 = [
    'xlink:actuate',
    'xlink:arcrole',
    'xlink:role',
    'xlink:show',
    'xlink:title',
    'xlink:type',
  ]
  arr2.forEach((attributeName) => {
    const name = Util.camelCase(attributeName)
    specials[attributeName] = specials[name] = new Special(
      Type.STRING,
      name,
      attributeName,
      'http://www.w3.org/1999/xlink',
      false, // mustUseProperty
      false, // sanitizeURL
      false, // removeEmptyString
    )
  })

  // String SVG attributes with the xml namespace.
  const arr3 = ['xml:base', 'xml:lang', 'xml:space']
  arr3.forEach((attributeName) => {
    const name = Util.camelCase(attributeName)
    specials[attributeName] = specials[name] = new Special(
      Type.STRING,
      name,
      attributeName,
      'http://www.w3.org/XML/1998/namespace', // attributeNamespace
      false, // mustUseProperty
      false, // sanitizeURL
      false, // removeEmptyString
    )
  })
}

export namespace Special {
  // These attributes accept URLs. These must not allow javascript: URLS.
  // These will also need to accept Trusted Types object in the future.
  const arr = ['xlinkHref', 'xlink:href']
  arr.forEach((name) => {
    specials[name] = new Special(
      Type.STRING,
      name,
      'xlink:href',
      'http://www.w3.org/1999/xlink',
      false, // mustUseProperty
      true, // sanitizeURL
      true, // removeEmptyString
    )
  })
}

export namespace Special {
  const arr = ['src', 'href', 'action', 'formAction']
  arr.forEach((attributeName) => {
    specials[attributeName] = new Special(
      Type.STRING,
      attributeName,
      attributeName.toLowerCase(), // attributeName
      null, // attributeNamespace
      false, // mustUseProperty
      true, // sanitizeURL
      true, // removeEmptyString
    )
  })
}
