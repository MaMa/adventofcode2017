/*
--- Day 8: I Heard You Like Registers ---

You receive a signal directly from the CPU. Because of your recent assistance with jump
instructions, it would like you to compute the result of a series of unusual register instructions.

Each instruction consists of several parts: the register to modify, whether to increase or
decrease that register's value, the amount by which to increase or decrease it, and a condition.
If the condition fails, skip the instruction without modifying the register. The registers all
start at 0. The instructions look like this:

b inc 5 if a > 1
a inc 1 if b < 5
c dec -10 if a >= 1
c inc -20 if c == 10
These instructions would be processed as follows:

Because a starts at 0, it is not greater than 1, and so b is not modified.
a is increased by 1 (to 1) because b is less than 5 (it is 0).
c is decreased by -10 (to 10) because a is now greater than or equal to 1 (it is 1).
c is increased by -20 (to -10) because c is equal to 10.
After this process, the largest value in any register is 1.

You might also encounter <= (less than or equal to) or != (not equal to). However, the CPU doesn't
have the bandwidth to tell you what all the registers are named, and leaves that to you to determine.

What is the largest value in any register after completing the instructions in your puzzle input?
*/

const {readLines} = require('./utils')

const test = `b inc 5 if a > 1
a inc 1 if b < 5
c dec -10 if a >= 1
c inc -20 if c == 10`.split("\n")

const input = readLines('./input08.txt')

const registers = {}
const get = reg => registers[reg] || 0
const inc = (reg, amount) => registers[reg] = get(reg) + amount
const dec = (reg, amount) => registers[reg] = get(reg) - amount

function parse(instruction) {
  const [cmd, cnd] = instruction.split(' if ').map(s => s.split(' '))
  return {cmd, cnd}
}

function check(cnd) {
  const [reg, cmp, amt] = cnd
  const amount = Number(amt)
  switch (cmp) {
    case '!=': return get(reg) != amount
    case '==': return get(reg) == amount
    case '>': return get(reg) > amount
    case '<': return get(reg) < amount
    case '<=': return get(reg) <= amount
    case '>=': return get(reg) >= amount
    default: throw new Error('Invalid condition ' + cnd)
  }
}

function execute(command) {
  const [reg, cmd, amt] = command
  const amount = Number(amt)
  switch (cmd) {
    case 'inc': return inc(reg, amount)
    case 'dec': return dec(reg, amount)
    default: throw new Error('Invalid command ' + command)
  }
}

function findMax(regs) {
  return Object.keys(regs)
    .map((k) => regs[k])
    .reduce((max, val) => val > max ? val : max, 0)
}

function day08(rows) {
  let highest = 0
  rows
    .map(parse)
    .map(row => {
      if (check(row.cnd)) {
        execute(row.cmd)
      }
      let max = findMax(registers)
      if (max > highest) {
        highest = max
      }
    })
  return {
    max: findMax(registers),
    highest
  }
}

console.log('Part1 & 2', day08(input))
