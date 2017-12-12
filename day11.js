/*
--- Day 11: Hex Ed ---

Crossing the bridge, you've barely reached the other side of the stream when a program comes up to you, clearly in distress. "It's my child process," she says, "he's gotten lost in an infinite grid!"

Fortunately for her, you have plenty of experience with infinite grids.

Unfortunately for you, it's a hex grid.

The hexagons ("hexes") in this grid are aligned such that adjacent hexes can be found to the north, northeast, southeast, south, southwest, and northwest:

  \ n  /
nw +--+ ne
  /    \
-+      +-
  \    /
sw +--+ se
  / s  \
You have the path the child process took. Starting where he started, you need to determine the fewest number of steps required to reach him. (A "step" means to move from the hex you are in to any adjacent hex.)

For example:

ne,ne,ne is 3 steps away.
ne,ne,sw,sw is 0 steps away (back where you started).
ne,ne,s,s is 2 steps away (se,se).
se,sw,se,sw,sw is 3 steps away (s,s,sw).
*/

const assert = require('assert');
const { readLine } = require('./utils')

const input = readLine('./input11.txt')

function step([x, y], dir) {
  switch (dir) {
    case 'n': return [x, y-1]
    case 'ne': return [x+1, y-1]
    case 'nw': return [x-1, y]
    case 's': return [x, y+1]
    case 'se': return [x+1, y]
    case 'sw': return [x-1, y+1]
    default: throw new Error(`Invalid direction ${dir}`)
  }
}

function walk(path) {
  const steps = path.split(',')
  return steps.reduce(step, [0, 0])
}

function dist(coords) {
  const [x, y] = coords
  const z = -x-y

  return Math.max(
    Math.abs(x),
    Math.abs(y),
    Math.abs(z)
  )
}

function part1(path) {
  const coords = walk(path)
  return dist(coords)
}

assert.equal(part1('se,n'), 1)
assert.equal(part1('se,se,n,n'), 2)
assert.equal(part1('ne,ne,ne'), 3)
assert.equal(part1('ne,ne,sw,sw'), 0)
assert.equal(part1('ne,ne,s,s'), 2)
assert.equal(part1('se,sw,se,sw,sw'), 3)
assert.equal(part1('n,nw,sw,s,se,ne'), 0)
assert.equal(part1('n,n,nw,nw,sw,sw,s,s,se,se,ne,ne'), 0)
assert.equal(part1('nw,nw,n,n,n'), 5)

console.log('Part1', part1(input))
