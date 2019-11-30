#!/usr/bin/env node

const fs = require("fs");
const fse = require("fs-extra");
const path = require("path");

const cwd = process.cwd();
const es = path.join(cwd, "es");
const lib = path.join(cwd, "lib");
const src = path.join(cwd, "src");

// Build components in one file: lib/style/components.less
console.log('Build "style/components.less"');
let content = "";
fs.readdir(src, (err, files) => {
  files.forEach(file => {
    const sub = path.join(file, "style", "index.less");
    if (fs.existsSync(path.join(src, sub))) {
      content += `@import "../${sub}";\n`;
    }
  });

  fs.writeFileSync(path.join(es, "style", "components.less"), content);
  fs.writeFileSync(path.join(lib, "style", "components.less"), content);
});

// Copy less files
function readdir(dir) {
  if (fs.existsSync(dir)) {
    fs.readdir(dir, (err, files) => {
      files.forEach(file => {
        const sub = path.join(dir, file);
        const stat = fs.statSync(sub);
        if (stat && stat.isDirectory()) {
          readdir(sub);
        } else {
          const ext = path.extname(file);
          if (ext === ".less" || ext === ".css") {
            fse.copySync(sub, path.join(es, path.relative(src, sub)));
            fse.copySync(sub, path.join(lib, path.relative(src, sub)));
          }
        }
      });
    });
  }
}

console.log("Copy style files to output directory\n");
fs.readdir(src, (err, files) => {
  files.forEach(file => {
    const dir =
      file === "style" // ./src/style
        ? path.join(src, file)
        : path.join(src, file, "style");
    readdir(dir);
  });
});
