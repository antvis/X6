import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import latestVersion from 'latest-version'

const root = path.resolve(__dirname, '../../')
const reserved = 'package.json'
const sections = ['dependencies', 'devDependencies']
const pad = (str: string, max: number) => {
  return str.length < max
    ? `${str}${Array(max - str.length).join(' ')}`
    : `${str.substr(0, max - 4)}...`
}

const pkgs = []
const files = fs.readdirSync(root)
files.forEach((name: string) => {
  const file = path.join(root, name)
  const stat = fs.statSync(file)
  if (stat.isFile() && path.extname(file) === '.json' && name !== reserved) {
    pkgs.push(file)
  }
})

pkgs.unshift(path.resolve(__dirname, '../../../../', reserved))

const moduleNames: string[] = []
pkgs.forEach((file) => {
  const content = fs.readFileSync(file, { encoding: 'utf-8' })
  const pkgJSON = JSON.parse(content)
  sections.forEach((section) => {
    const deps = pkgJSON[section]
    if (deps) {
      moduleNames.push(...Object.keys(deps))
    }
  })
})

const paths = pkgs.map((file) => path.relative(process.cwd(), file))
const maxFileLength = Math.max(...paths.map((item) => item.length)) + 2
const maxNameLength = Math.min(
  Math.max(...moduleNames.map((item) => item.length)) + 2,
  40,
)
const maxSectionLength = Math.max(...sections.map((item) => item.length)) + 2
const log = (
  pkg: string,
  section: string,
  name: string,
  local: string,
  remote: string,
  highlight?: boolean,
) => {
  const line = `${pad(pkg, maxFileLength)}  ${pad(
    section,
    maxSectionLength,
  )}  ${pad(name, maxNameLength)}  ${pad(local, 10)}  ${remote}`
  console.log(highlight ? chalk.gray(line) : line)
}

console.log()
console.log(
  'Comapre packages local version with latest version on npm registry.',
)
console.log()

log('file', 'section', 'name', 'local', 'remote')
console.log(
  Array(maxFileLength + maxSectionLength + maxNameLength + 21).join('-'),
)

pkgs.forEach((file) => {
  const content = fs.readFileSync(file, { encoding: 'utf-8' })
  const pkgJSON = JSON.parse(content)
  const defers: Promise<any>[] = []
  sections.forEach((section) => {
    const deps = pkgJSON[section]
    if (deps) {
      Object.keys(deps).forEach(async (name) => {
        const pkg = path.relative(process.cwd(), file)
        const local = deps[name]
        const defer = latestVersion(name).then((remote) => {
          return {
            pkg,
            section,
            name,
            local,
            remote,
          }
        })
        defers.push(defer)
      })
    }
  })

  Promise.all(defers).then((arr) => {
    arr.forEach(({ pkg, section, name, local, remote }) => {
      const localv = local.replace(/^[\^~]|>=/, '')
      log(pkg, section, name, local, remote, localv !== remote)
    })
  })
})
