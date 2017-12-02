/**
 * All possible pair combinations from array
 * @param {*} array
 */
function pairs(array) {
  return array.reduce((acc, v, i) =>
    acc.concat(array.slice(i + 1).map(w => [v, w])),
    [])
}

module.exports = {
  pairs
}