const express = require('express')

const PORT = process.env.PORT || 5000
const puzzle = require('./puzzle')
const data = require('./data')

const index = (req, res) => {
//  console.log(req.method)
//  console.log(req.headers)
//  console.log(req.query)
//  console.log(req.body)
  const q = typeof req.query.q !== 'undefined' ? req.query.q.toLowerCase() : ''
  const val = data[q]
  if (val) {
    return res.send(val)
  }
  if (q === 'puzzle' && req.query.d) {
    let puz = req.query.d.split('\n').filter(
      el => el.match(/[a-zA-Z][-<>=]+/)
    ).join(' ')
    return res.send(puzzle.format(
      puzzle.solve(puz)
    ))
  }
  res.status(501).send('Not Implemented')
}

express()
  .use((req, res, next) => {
    let data = ''
    req.setEncoding('utf8')
    req.on('data', chunk => {
      data += chunk
    })
    req.on('end', () => {
      req.body = data
      next()
    })
  })
  .get('/', index)
  // .post('/', index)
  .listen(PORT, () => console.log(`Listening on ${PORT}`))
