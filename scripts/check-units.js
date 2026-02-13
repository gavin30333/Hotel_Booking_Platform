/* eslint-disable import/no-commonjs */
const fs = require('fs')
const path = require('path')

const SRC_DIR = path.join(__dirname, '../src')
// Removed '%' as it is often necessary for transforms and gradients, and doesn't violate "px-based" design if parents are px.
const FORBIDDEN_UNITS = ['rem', 'em', 'vh', 'vw']
const REGEX = new RegExp(`\\d+(\\.\\d+)?(${FORBIDDEN_UNITS.join('|')})`, 'g')

function scanDirectory(dir) {
  const files = fs.readdirSync(dir)
  let hasErrors = false

  files.forEach((file) => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      if (scanDirectory(filePath)) {
        hasErrors = true
      }
    } else if (file.endsWith('.less')) {
      const content = fs.readFileSync(filePath, 'utf8')
      const lines = content.split('\n')

      lines.forEach((line, index) => {
        if (line.trim().startsWith('//')) return

        let match
        REGEX.lastIndex = 0
        while ((match = REGEX.exec(line)) !== null) {
          console.error(
            `Error in ${filePath}:${index + 1} - Forbidden unit found: "${match[0]}"`
          )
          hasErrors = true
        }
      })
    }
  })

  return hasErrors
}

console.log('Scanning for forbidden units...')
const hasErrors = scanDirectory(SRC_DIR)

if (hasErrors) {
  console.error('FAILED: Forbidden units found. Please use px only.')
  process.exit(1)
} else {
  console.log('PASSED: All units are valid.')
}
