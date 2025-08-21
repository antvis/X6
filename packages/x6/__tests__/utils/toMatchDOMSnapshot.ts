import * as path from 'path'
import * as fs from 'fs'
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
export async function toMatchDOMSnapshot(
  graph: Graph,
  folder: string,
  name: string,
  options: any = {},
): Promise<{ message: () => string; pass: boolean }> {
  try {
    const dir = path.join(folder, '__snapshots__')
    const namePath = path.join(dir, name)
    const actualPath = path.join(dir, `${name}-actual.svg`)
    const expectedPath = path.join(dir, `${name}.svg`)

    const actual = await toSVG(graph, options)

    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    if (!fs.existsSync(expectedPath)) {
      if (process.env.CI === 'true') {
        throw new Error(`Please generate golden image for ${namePath}`)
      }
      console.warn(`! generate ${namePath}`)
      await fs.writeFileSync(expectedPath, actual as string)
    } else {
      const expected = fs.readFileSync(expectedPath, {
        encoding: 'utf8',
        flag: 'r',
      })
      if (actual === expected) {
        return {
          message: () => `match ${namePath}`,
          pass: true,
        }
      }
      // Perverse actual file.
      if (actual) fs.writeFileSync(actualPath, actual)
      return {
        message: () => `match ${namePath} error`,
        pass: false,
      }
    }
    return {
      message: () => `generate ${namePath}`,
      pass: true,
    }
  } catch (e) {
    return {
      message: () => `${e}`,
      pass: false,
    }
  }
}
