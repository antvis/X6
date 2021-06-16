import svg2js from 'svgo/lib/svgo/svg2js'
import js2svg from 'svgo/lib/svgo/js2svg'
import JSAPI from 'svgo/lib/svgo/jsAPI'
import CSSClassList from 'svgo/lib/svgo/css-class-list'
import CSSStyleDeclaration from 'svgo/lib/svgo/css-style-declaration'
import applyPlugins from 'svgo/lib/svgo/plugins'

import removeDoctype from 'svgo/plugins/removeDoctype'
import removeXMLProcInst from 'svgo/plugins/removeXMLProcInst'
import removeComments from 'svgo/plugins/removeComments'
import removeMetadata from 'svgo/plugins/removeMetadata'
import removeXMLNS from 'svgo/plugins/removeXMLNS'
import removeEditorsNSData from 'svgo/plugins/removeEditorsNSData'
import cleanupAttrs from 'svgo/plugins/cleanupAttrs'
import inlineStyles from 'svgo/plugins/inlineStyles'
import minifyStyles from 'svgo/plugins/minifyStyles'
import convertStyleToAttrs from 'svgo/plugins/convertStyleToAttrs'
import cleanupIDs from 'svgo/plugins/cleanupIDs'
import removeRasterImages from 'svgo/plugins/removeRasterImages'
import removeUselessDefs from 'svgo/plugins/removeUselessDefs'
import cleanupNumericValues from 'svgo/plugins/cleanupNumericValues'
import cleanupListOfValues from 'svgo/plugins/cleanupListOfValues'
import convertColors from 'svgo/plugins/convertColors'
import removeUnknownsAndDefaults from 'svgo/plugins/removeUnknownsAndDefaults'
import removeNonInheritableGroupAttrs from 'svgo/plugins/removeNonInheritableGroupAttrs'
import removeUselessStrokeAndFill from 'svgo/plugins/removeUselessStrokeAndFill'
import removeViewBox from 'svgo/plugins/removeViewBox'
import cleanupEnableBackground from 'svgo/plugins/cleanupEnableBackground'
import removeHiddenElems from 'svgo/plugins/removeHiddenElems'
import removeEmptyText from 'svgo/plugins/removeEmptyText'
import convertShapeToPath from 'svgo/plugins/convertShapeToPath'
import moveElemsAttrsToGroup from 'svgo/plugins/moveElemsAttrsToGroup'
import moveGroupAttrsToElems from 'svgo/plugins/moveGroupAttrsToElems'
import collapseGroups from 'svgo/plugins/collapseGroups'
import convertPathData from 'svgo/plugins/convertPathData'
import convertTransform from 'svgo/plugins/convertTransform'
import convertEllipseToCircle from 'svgo/plugins/convertEllipseToCircle'
import removeEmptyAttrs from 'svgo/plugins/removeEmptyAttrs'
import removeEmptyContainers from 'svgo/plugins/removeEmptyContainers'
import mergePaths from 'svgo/plugins/mergePaths'
import removeUnusedNS from 'svgo/plugins/removeUnusedNS'
// import removeOffCanvasPaths from 'svgo/plugins/removeOffCanvasPaths'
import reusePaths from 'svgo/plugins/reusePaths'
import sortAttrs from 'svgo/plugins/sortAttrs'
import sortDefsChildren from 'svgo/plugins/sortDefsChildren'
import removeTitle from 'svgo/plugins/removeTitle'
import removeDesc from 'svgo/plugins/removeDesc'
import removeDimensions from 'svgo/plugins/removeDimensions'
import removeStyleElement from 'svgo/plugins/removeStyleElement'
import removeScriptElement from 'svgo/plugins/removeScriptElement'

function cloneParsedSvg(svg) {
  const clones = new Map()

  function cloneKeys(target, obj) {
    for (const key of Object.keys(obj)) {
      target[key] = clone(obj[key])
    }
    return target
  }

  function clone(obj) {
    if (typeof obj !== 'object' || obj === null) {
      return obj
    }

    if (clones.has(obj)) {
      return clones.get(obj)
    }

    let objClone

    if (obj.constructor === JSAPI) {
      objClone = new JSAPI({}, obj.parentNode)
      clones.set(obj, objClone)

      if (obj.parentNode) {
        objClone.parentNode = clone(obj.parentNode)
      }
      cloneKeys(objClone, obj)
    } else if (
      obj.constructor === CSSClassList ||
      obj.constructor === CSSStyleDeclaration ||
      obj.constructor === Object ||
      obj.constructor === Array
    ) {
      objClone = new obj.constructor()
      clones.set(obj, objClone)
      cloneKeys(objClone, obj)
    } else if (obj.constructor === Map) {
      objClone = new Map()
      clones.set(obj, objClone)

      for (const [key, val] of obj) {
        objClone.set(clone(key), clone(val))
      }
    } else if (obj.constructor === Set) {
      objClone = new Set()
      clones.set(obj, objClone)

      for (const val of obj) {
        objClone.add(clone(val))
      }
    } else {
      throw Error('unexpected type')
    }

    return objClone
  }

  return clone(svg)
}

function optimizePluginsArray(plugins) {
  return plugins
    .map((item) => [item])
    .reduce((arr, item) => {
      const last = arr[arr.length - 1]

      if (last && item[0].type === last[0].type) {
        last.push(item[0])
      } else {
        arr.push(item)
      }
      return arr
    }, [])
}

function getDimensions(parsedSvg) {
  const svg = parsedSvg.content.filter((el) => el.isElem('svg'))[0]

  if (!svg) {
    return {}
  }

  if (svg.hasAttr('width') && svg.hasAttr('height')) {
    return {
      width: parseFloat(svg.attr('width').value),
      height: parseFloat(svg.attr('height').value),
    }
  }

  if (svg.hasAttr('viewBox')) {
    const viewBox = svg.attr('viewBox').value.split(/(?:,\s*|\s+)/)

    return {
      width: parseFloat(viewBox[2]),
      height: parseFloat(viewBox[3]),
    }
  }

  return {}
}

export function optimize(svgText, settings) {
  let parsedSvg
  svg2js(svgText, (p) => (parsedSvg = p))
  if (parsedSvg.error) {
    throw Error(parsedSvg.error)
  }

  const pluginsData = {
    removeDoctype,
    removeXMLProcInst,
    removeComments,
    removeMetadata,
    removeXMLNS,
    removeEditorsNSData,
    cleanupAttrs,
    inlineStyles,
    minifyStyles,
    convertStyleToAttrs,
    cleanupIDs,
    // prefixIds,
    removeRasterImages,
    removeUselessDefs,
    cleanupNumericValues,
    cleanupListOfValues,
    convertColors,
    removeUnknownsAndDefaults,
    removeNonInheritableGroupAttrs,
    removeUselessStrokeAndFill,
    removeViewBox,
    cleanupEnableBackground,
    removeHiddenElems,
    removeEmptyText,
    convertShapeToPath,
    moveElemsAttrsToGroup,
    moveGroupAttrsToElems,
    collapseGroups,
    convertPathData,
    convertTransform,
    convertEllipseToCircle,
    removeEmptyAttrs,
    removeEmptyContainers,
    mergePaths,
    removeUnusedNS,
    // This currently throws an error
    // removeOffCanvasPaths,
    reusePaths,
    sortAttrs,
    sortDefsChildren,
    removeTitle,
    removeDesc,
    removeDimensions,
    // removeAttrs,
    // removeElementsByAttr,
    // removeAttributesBySelector,
    // addClassesToSVGElement,
    removeStyleElement,
    removeScriptElement,
    // addAttributesToSVGElement,
  }

  // activate/deactivate plugins
  Object.keys(settings.plugins).forEach((name) => {
    if (pluginsData[name]) {
      pluginsData[name].active = settings.plugins[name]
    }
  })

  // Set floatPrecision across all the plugins
  const floatPrecision = Number(settings.floatPrecision)

  for (const plugin of Object.values(pluginsData)) {
    if (plugin.params && 'floatPrecision' in plugin.params) {
      if (plugin === pluginsData.cleanupNumericValues && floatPrecision === 0) {
        // 0 almost always breaks images when used on this plugin.
        // Better to allow 0 for everything else, but switch to 1 for this plugin.
        plugin.params.floatPrecision = 1
      } else {
        plugin.params.floatPrecision = floatPrecision
      }
    }
  }

  const svg = cloneParsedSvg(parsedSvg)
  const plugins = optimizePluginsArray(Object.values(pluginsData))

  applyPlugins(svg, { input: 'string' }, plugins)

  return {
    data: js2svg(svg, {
      indent: '  ',
      pretty: settings.pretty,
    }).data,
    size: getDimensions(svg),
  }
}
