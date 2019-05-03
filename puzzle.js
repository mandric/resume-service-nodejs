//
// solve puzzles
//
// Example:
//
//   puzzle:   "A---> B---< C-<=- D->-="
//   solution: "A=>>> B<=>< C<<=< D<>>="
//

const isGt = (ridx, cidx, puzzle) => {
  if (puzzle[ridx][cidx] === '>') return true
  if (puzzle[ridx][cidx] === '<') return false
}

const isLt = (ridx, cidx, puzzle) => {
  if (puzzle[ridx][cidx] === '<') return true
  if (puzzle[ridx][cidx] === '>') return false
}

const setVals = (posGt, posLt, puzzle) => {
  puzzle[posLt][posGt] = '<'
  puzzle[posGt][posLt] = '>'
}

//
// solveVal
//
// Look through values in other rows to solve through transitive property.
//
// Example:
//
// solve for ridx 0, cidx 2 because it's still empty after initial pass.
//
// is 0 > 1 ?
//   is 1 > 2 ?
//     then setVals 0 > 2
//     continue to next empty val
//
// is 0 < 1 ?
//   is 1 < 2 ?
//     then setVals 0 < 2
//     continue to next empty val
//
const solveVal = (ridx, cidx, puzzle) => {
  puzzle[ridx].forEach((val, col) => {
    if (val === '>') {
      if (isGt(col, cidx, puzzle)) {
        setVals(ridx, cidx, puzzle)
      }
    } else if (val === '<') {
      if (isLt(col, cidx, puzzle)) {
        setVals(cidx, ridx, puzzle)
      }
    }
  })
}

const solve = puzzle => {
  let retString = false
  if (typeof puzzle === 'string') {
    retString = true
    puzzle = convert(puzzle)
  }
  puzzle.forEach((row, ridx) => {
    row.forEach((val, cidx) => {
      if (val === '>') {
        setVals(ridx, cidx, puzzle)
      } else if (val === '<') {
        setVals(cidx, ridx, puzzle)
      } else if (!val) {
        solveVal(ridx, cidx, puzzle)
      }
    })
  })
  // return same type as input
  return retString ? convert(puzzle) : puzzle
}

//  Convert string to matrix
//
//  From:
//  "A---> B---< C-<=- D->-="
//
//  To:
//      A   B   C    D
//  A ['=', '', '', '>'],
//  B ['', '=', '', '<'],
//  C ['', '<', '=', ''],
//  D ['', '>', '', '=']
//
const convertStr = str => {
  const valid = ['<', '>']
  const empty = '-'
  const ret = []
  // remove extra characters
  str = str.replace(/[^\s+-><=]/g, '')
  str.split(/\s+/).forEach((row, ridx) => {
    if (typeof ret[ridx] === 'undefined') {
      ret[ridx] = []
    }
    row.split('').forEach((val, idx) => {
      if (ridx === idx) {
        ret[ridx][idx] = '='
      } else if (valid.indexOf(val) >= 0) {
        ret[ridx][idx] = val
      } else if (val === empty) {
        ret[ridx][idx] = ''
      }
    })
  })
  return ret
}

const convertArr = puzzle => {
  let ret = []
  const startChar = 65 // A
  puzzle.forEach((row, idx) => {
    ret.push(
      String.fromCharCode(startChar + idx) + row.join('')
    )
  })
  return ret.join(' ')
}

const convert = obj => {
  if (typeof obj === 'string') {
    return convertStr(obj)
  } else if (obj.constructor === Array) {
    return convertArr(obj)
  }
}

// return string formatted as table
const format = puzzle => {
  let header = ''
  puzzle.split(/\s+/).forEach(part => {
    header += part.charAt(0)
  })
  return ` ${header}\n${puzzle.replace(/\s+/g, '\n')}`
}

exports.solve = solve
exports.format = format
exports._convert = convert
