const request = require('request')
const test = require('tape')

const base_url = 'http://127.0.0.1:5000'
const puzzle = require('./puzzle')
const data = require('./data')

test('web service responds to requests', t => {
  t.plan(3)
  request(base_url, (error, response, body) => {
    t.false(error)
    // has a status code and body
    t.ok(response.statusCode)
    // Assert content checks
    t.ok(body)
  })
})

test('web service responds with 501 by default', t => {
  t.plan(2)
  request(base_url, (error, response, body) => {
    t.equal(response.statusCode, 501)
    t.equal(body, 'Not Implemented')
  })
})

test('web service responds with correct data for named params', t => {
  t.plan(22)
  Object.keys(data).forEach(key => {
    // skip tests data
    if (key === '_tests') return
    request(`${base_url}?q=${encodeURIComponent(key)}`, (error, response, body) => {
      t.equal(response.statusCode, 200)
      t.equal(body, data[key])
    })
  })
})

test('web service ignores case for named params', t => {
  t.plan(2)
  request(`${base_url}?q=pInG`, (error, response, body) => {
    t.equal(response.statusCode, 200)
    t.equal(body, 'OK')
  })
})

test('web service returns puzzle solved and table formatted', t => {
  t.plan(2)
  const puzzle = encodeURIComponent('\n ABCD\nA=--<\nB<---\nC--->\nD>---')
  const data = `solve+this%3A${puzzle}`
  const solution = ' ABCD\nA=><<\nB<=<<\nC>>=>\nD>><='
  request(`${base_url}?q=puzzle&d=${data}`, (error, response, body) => {
    t.equal(response.statusCode, 200)
    t.equal(body, solution)
  })
})

test('puzzle lib converts puzzle strings', t => {
  t.plan(1)
  const str = "A---> B---< C-<=- D->-="
  const arr = [
    ['=', '', '', '>'], 
    ['', '=', '', '<'], 
    ['', '<', '=', ''], 
    ['', '>', '', '=']  
  ]
  t.deepEqual(puzzle._convert(str), arr)
})

test('puzzle lib solves puzzles from test data', t => {
  t.plan(6)
  data._tests.puzzles.forEach(p => {
    const puz = p[0]
    const sol = p[1]
    t.equal(puzzle.solve(puz), sol)
  })
})

