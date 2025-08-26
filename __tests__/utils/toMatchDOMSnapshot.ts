import * as path from 'path'
import * as fs from 'fs'
import { optimize } from 'svgo';
import { Graph } from '../../src'
import { sleep } from './sleep'

async function toSVG(
  graph: Graph,
  options: object = {},
): Promise<string | null> {
  await sleep()
  return new Promise((resolve) => {
    graph.toSVG(resolve, options)
  })
}

const format = (svg: string | null) => {
  return optimize(svg || 'null', {
    js2svg: {
      pretty: true,
      indent: 2,
    },
    plugins: [
      'cleanupIds',
      'cleanupAttrs',
      'sortAttrs',
      'sortDefsChildren',
      'removeUselessDefs',
      {
        name: 'removeAttrs',
        params: {
          attrs: ['data-cell-id'],
        },
      },
      {
        name: 'convertPathData',
        params: {
          floatPrecision: 4,
          forceAbsolutePath: true,

          applyTransforms: false,
          applyTransformsStroked: false,
          straightCurves: false,
          convertToQ: false,
          lineShorthands: false,
          convertToZ: false,
          curveSmoothShorthands: false,
          smartArcRounding: false,
          removeUseless: false,
          collapseRepeated: false,
          utilizeAbsolute: false,
          negativeExtraSpace: false,
        },
      },
      {
        name: 'convertTransform',
        params: {
          floatPrecision: 4,

          convertToShorts: false,
          matrixToTransform: false,
          shortTranslate: false,
          shortScale: false,
          shortRotate: false,
          removeUseless: false,
          collapseIntoOne: false,
        },
      },
      {
        name: 'cleanupNumericValues',
        params: {
          floatPrecision: 4,
        },
      },
    ],
  }).data;
};

export async function toMatchDOMSnapshot(
  graph: Graph,
  folder: string,
  name: string,
  options: any = {},
): Promise<{ message: () => string; pass: boolean }> {
  try {
    const dir = path.join(folder, '__snapshots__')
    const actualPath = path.join(dir, `${name}-actual.svg`)
    const expectedPath = path.join(dir, `${name}.svg`)

    const actual = format(await toSVG(graph, options))

    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    if (!fs.existsSync(expectedPath)) {
      if (process.env.CI === 'true') {
        throw new Error(`Please generate golden image for ${expectedPath}`)
      }
      console.warn(`generate ${expectedPath}`)
      await fs.writeFileSync(expectedPath, actual as string)
    } else {
      const expected = fs.readFileSync(expectedPath, {
        encoding: 'utf8',
        flag: 'r',
      })
      if (actual === expected) {
        return {
          message: () => `match ${expectedPath}`,
          pass: true,
        }
      }
      // Perverse actual file.
      if (actual) fs.writeFileSync(actualPath, actual)
      return {
        message: () => `match ${expectedPath} error`,
        pass: false,
      }
    }
    return {
      message: () => `generate ${expectedPath}`,
      pass: true,
    }
  } catch (e) {
    return {
      message: () => `${e}`,
      pass: false,
    }
  }
}
