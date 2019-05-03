//
// solve puzzles
//
// Example:
//
//   puzzle:   "A---> B---< C-<=- D->-="
//   solution: "A=>>> B<=>< C<<=< D<>>="
//

const isGt = (r_idx, c_idx, puzzle) => {
  if (puzzle[r_idx][c_idx] === '>') return true
  if (puzzle[r_idx][c_idx] === '<') return false
}

const isLt = (r_idx, c_idx, puzzle) => {
  if (puzzle[r_idx][c_idx] === '<') return true
  if (puzzle[r_idx][c_idx] === '>') return false
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
// solve for row_idx 0, col_idx 2 because it's still empty after initial pass.
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
const solveVal = (row_idx, col_idx, puzzle) => {
  puzzle[row_idx].forEach((val, col) => {
    if (val === '>') {
      if (isGt(col, col_idx, puzzle)) {
        setVals(row_idx, col_idx, puzzle)
      }
    } else if (val === '<') {
      if (isLt(col, col_idx, puzzle)) {
        setVals(col_idx, row_idx, puzzle)
      }
    }
  })
}

const solve = puzzle => {
  let count = 0
  const score = {}
  let retString = false
  if (typeof puzzle === 'string') {
    retString = true
    puzzle = convert(puzzle)
  }
  puzzle.forEach((row, row_idx) => {
    row.forEach((val, col_idx) => {
      if (val === '>') {
        setVals(row_idx, col_idx, puzzle)
      } else if (val === '<') {
        setVals(col_idx, row_idx, puzzle)
      } else if (!val) {
        solveVal(row_idx, col_idx, puzzle)
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
  str = str.replace(/[^\s+-><=]/g,'')
  str.split(/\s+/).forEach((row, r_idx) => {
    if (typeof ret[r_idx] === 'undefined') {
      ret[r_idx] = []
    }
    row.split('').forEach((val, idx) => {
      if (r_idx === idx) {
        ret[r_idx][idx] = '='
      } else if (valid.indexOf(val) >= 0) {
        ret[r_idx][idx] = val
      } else if (val === empty) {
        ret[r_idx][idx] = ''
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
