/*
--- Day 4: High-Entropy Passphrases ---

A new system policy has been put in place that requires all accounts to use a passphrase instead of simply a password. A passphrase consists of a series of words (lowercase letters) separated by spaces.

To ensure security, a valid passphrase must contain no duplicate words.

For example:

aa bb cc dd ee is valid.
aa bb cc dd aa is not valid - the word aa appears more than once.
aa bb cc dd aaa is valid - aa and aaa count as different words.
The system's full passphrase list is available as your puzzle input. How many passphrases are valid?
*/

const {readLines, pairs} = require('./utils')

const test1 = [
  'aa bb cc dd ee',
  'aa bb cc dd aa',
  'aa bb cc dd aaa'
]

const input = readLines('./input04.txt')

function filter1(phrase) {
  const words = phrase.split(/\s+/)
  return !pairs(words).find(([a,b]) => a == b)
}

//console.log('Test1', test1.filter(filter1).length)
console.log('Part1', input.filter(filter1).length)

/*
--- Part Two ---

For added security, yet another system policy has been put in place. Now, a valid passphrase must contain no two words that are anagrams of each other - that is, a passphrase is invalid if any word's letters can be rearranged to form any other word in the passphrase.

For example:

abcde fghij is a valid passphrase.
abcde xyz ecdab is not valid - the letters from the third word can be rearranged to form the first word.
a ab abc abd abf abj is a valid passphrase, because all letters need to be used when forming another word.
iiii oiii ooii oooi oooo is valid.
oiii ioii iioi iiio is not valid - any of these words can be rearranged to form any other word.
Under this new system policy, how many passphrases are valid?
*/

function filter2(phrase) {
  const words = phrase.split(/\s+/)
  return !pairs(words)
    .filter(([a,b]) => a.length == b.length)
    .map(pair => pair.map(word => word.split('').sort().join('')))
    .find(([a,b]) => a == b)
}

console.log('Part2', input.filter(filter2).length)
