#!/usr/bin/env node

const fs = require('fs')
fs.copyFileSync('../../README.md', './README.md')
