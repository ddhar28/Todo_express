const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
// const router = require('./routes.js')

const app = express()
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const { Client } = require('pg')
var conString = 'postgres://postgres:@localhost:5432/todo'

app.get('/getTasks', function (req, res) {
  const client = new Client(conString)
  client.connect()
    .then(() => {
      const sql = 'SELECT * FROM TODOS;'
      return client.query(sql)
    })
    .then((result) => {
      // console.log(res.Client)
      // res.set('Content-Type', 'application/json')
      res.send(result.rows)
    })
    .catch((err) => {
      console.log(err)
    })
})

app.post('/', (req, res) => {
  const client = new Client(conString)
  client.connect()
    .then(() => {
      const sql = 'INSERT INTO TODOS(taskname, state, note) VALUES($1,$2,$3);'
      const param = [(req.body)[0], 'active', null]
      return client.query(sql, param)
      // console.log(req.body)
    })
    .then(() => {
      res.redirect('/')
    })
    .catch((err) => console.log(err))
})

app.listen(5433)
console.log('server listening at port 5433...')
