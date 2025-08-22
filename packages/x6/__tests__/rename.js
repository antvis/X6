// 将指定文件夹下面的 *.test.ts 文件重命名为 *.spec.ts
const fs = require('fs')
const path = require('path')
const glob = require('glob')

const testDir = path.join(__dirname, 'common')
const testFiles = glob.sync('**/*.test.ts', { cwd: testDir })

testFiles.forEach((file) => {
  const filename = path.basename(file)
  const newFile = file.replace(/\.test\.ts$/, '.spec.ts')
  const dir = path.dirname(file)
  const newFilename = path.basename(newFile)

  fs.renameSync(
    path.join(testDir, dir, filename),
    path.join(testDir, dir, newFilename),
  )
})

console.log('Renamed test files successfully.')
