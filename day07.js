/*
--- Day 7: Recursive Circus ---

Wandering further through the circuits of the computer, you come upon a tower of programs that have
gotten themselves into a bit of trouble. A recursive algorithm has gotten out of hand, and now
they're balanced precariously in a large tower.

One program at the bottom supports the entire tower. It's holding a large disc, and on the disc are
balanced several more sub-towers. At the bottom of these sub-towers, standing on the bottom disc,
are other programs, each holding their own disc, and so on. At the very tops of these
sub-sub-sub-...-towers, many programs stand simply keeping the disc below them balanced but with
no disc of their own.

You offer to help, but first you need to understand the structure of these towers. You ask each
program to yell out their name, their weight, and (if they're holding a disc) the names of the
programs immediately above them balancing on that disc. You write this information down
(your puzzle input). Unfortunately, in their panic, they don't do this in an orderly fashion;
by the time you're done, you're not sure which program gave which information.

For example, if your list is the following:

pbga (66)
xhth (57)
ebii (61)
havc (66)
ktlj (57)
fwft (72) -> ktlj, cntj, xhth
qoyq (66)
padx (45) -> pbga, havc, qoyq
tknk (41) -> ugml, padx, fwft
jptl (61)
ugml (68) -> gyxo, ebii, jptl
gyxo (61)
cntj (57)
...then you would be able to recreate the structure of the towers that looks like this:

                gyxo
              /
         ugml - ebii
       /      \
      |         jptl
      |
      |         pbga
     /        /
tknk --- padx - havc
     \        \
      |         qoyq
      |
      |         ktlj
       \      /
         fwft - cntj
              \
                xhth
In this example, tknk is at the bottom of the tower (the bottom program), and is holding up
ugml, padx, and fwft. Those programs are, in turn, holding up other programs; in this example,
none of those programs are holding up any other programs, and are all the tops of their own towers.
(The actual tower balancing in front of you is much larger.)

Before you're ready to help them, you need to make sure your information is correct.
What is the name of the bottom program?
*/

const _ = require('lodash')
const {readLines} = require('./utils')

const test = `pbga (66)
xhth (57)
ebii (61)
havc (66)
ktlj (57)
fwft (72) -> ktlj, cntj, xhth
qoyq (66)
padx (45) -> pbga, havc, qoyq
tknk (41) -> ugml, padx, fwft
jptl (61)
ugml (68) -> gyxo, ebii, jptl
gyxo (61)
cntj (57)`.split('\n').map(s => s.trim())

const input = readLines('./input07.txt')

function getDiscs(rows) {
  const discs = rows.map((row) => {
    const [here, above] = row.split(' -> ')
    const [match, name, weight] = here.match(/(\w+) \((\d+)\)/)
    const children = above ? above.split(', ') : []
    if (!match) throw new Error('Invalid row ' + row)
    return {
      name,
      weight: Number(weight),
      children
    }
  })
  // fill parents
  discs.map(disc => {
    const parent = discs.find(d => d.children.includes(disc.name))
    disc.parent = parent ? parent.name : null
    return disc
  })
  return discs
}

function part1(rows) {
  const discs = getDiscs(rows)
  const root = discs.find(disc => !disc.parent)
  return root.name
}

console.log('Test1', part1(test))
console.log('Part1', part1(input))

/*
--- Part Two ---

The programs explain the situation: they can't get down. Rather, they could get down, if they
weren't expending all of their energy trying to keep the tower balanced. Apparently, one program
has the wrong weight, and until it's fixed, they're stuck here.

For any program holding a disc, each program standing on that disc forms a sub-tower. Each of
those sub-towers are supposed to be the same weight, or the disc itself isn't balanced.
The weight of a tower is the sum of the weights of the programs in that tower.

In the example above, this means that for ugml's disc to be balanced, gyxo, ebii, and jptl
must all have the same weight, and they do: 61.

However, for tknk to be balanced, each of the programs standing on its disc and all programs
above it must each match. This means that the following sums must all be the same:

ugml + (gyxo + ebii + jptl) = 68 + (61 + 61 + 61) = 251
padx + (pbga + havc + qoyq) = 45 + (66 + 66 + 66) = 243
fwft + (ktlj + cntj + xhth) = 72 + (57 + 57 + 57) = 243
As you can see, tknk's disc is unbalanced: ugml's stack is heavier than the other two. Even though
the nodes above ugml are balanced, ugml itself is too heavy: it needs to be 8 units lighter for
its stack to weigh 243 and keep the towers balanced. If this change were made, its weight would
be 60.

Given that exactly one program is the wrong weight, what would its weight need to be to balance
the entire tower?
*/

function part2(rows) {
  const discs = getDiscs(rows)
  const stack = discs.reduce((stack, disc) => {
    stack[disc.name] = disc
    return stack
  }, {})

  const weightOf = _.memoize(discName => {
    const disc = stack[discName]
    return disc.children.reduce((weight, child) => {
      return weight + weightOf(child)
    }, disc.weight)
  })

  const root = discs.find(disc => !disc.parent)

  function findUnbalance(disc, parentSiblingWeight=0) {
    const childWeight = weightOf(disc.name) - disc.weight

    childWeights = _.groupBy(disc.children.map(child => ({child, weight: weightOf(child)})), 'weight')
    const diffWeight = _.findKey(childWeights, arr => arr.length == 1)
    const siblingWeight = _.findKey(childWeights, arr => arr.length > 1)
    if (diffWeight) {
      const child = stack[childWeights[diffWeight][0].child]
      return findUnbalance(child, siblingWeight)
    } else {
      // Unbalaced node should be weight
      return parentSiblingWeight - childWeight
    }
  }

  return findUnbalance(root)
}

console.log('Test2', part2(test))
console.log('Part2', part2(input))
