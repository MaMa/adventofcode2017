const fs = require('fs')

/**
 * All possible pair combinations from array
 * @param {*} array
 */
function pairs(array) {
  return array.reduce((acc, v, i) =>
    acc.concat(array.slice(i + 1).map(w => [v, w])),
    [])
}

/**
 * Read file and return trimmed rows as array
 */
function readLines(filename) {
  return fs.readFileSync(filename, {encoding: 'UTF8'})
    .split('\n')
    .map(row => row.trim())
    .filter(row => !!row.length)
}

/**
 * Read file and return single row
 */
function readLine(filename) {
  return readLines(filename)[0]
}

module.exports = {
  pairs,
  readLine,
  readLines
}