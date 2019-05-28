const express = require('express')
// const path = require('path')
const bodyParser = require('body-parser')
// const router = require('./routes.js')

const app = express()
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const { Client } = require('pg')
var conString = 'postgres://postgres:@localhost:5432/todo'

app.get('/getTasks', async function (req, res) {
  const client = new Client(conString)
  await client.connect()

  const sql = 'SELECT * FROM TODOS;'
  const result = await client.query(sql)

  res.send(result.rows)
})

app.post('/add', async function (req, res) {
  const client = new Client(conString)
  await client.connect()

  const sql = 'INSERT INTO TODOS(taskname, state, note) VALUES($1,$2,$3) RETURNING task_id;'
  const param = [req.body.taskname, req.body.state, req.body.note]
  let result = await client.query(sql, param)
  // console.log(result.rows[0])
  res.send(result.rows[0])
})

app.post('/delete', async function (req, res) {
  console.log('deleting...', req.body)
  const client = new Client(conString)
  await client.connect()

  const param = req.body.id
  const sql = 'DELETE FROM TODOS WHERE task_id=' + param + ';'
  await client.query(sql)

  res.end('ok')
})

app.post('/state', async function (req, res) {
  const client = new Client(conString)
  await client.connect()

  const sql = 'UPDATE TODOS SET state = $1 WHERE task_id = $2;'
  const param = [req.body.state, req.body.id]
  await client.query(sql, param)

  res.end('ok')
})

app.post('/edit', async function (req, res) {
  const client = new Client(conString)
  await client.connect()

  const sql = 'UPDATE TODOS SET taskname = $1 WHERE task_id = $2;'
  const param = [req.body.name, req.body.id]
  await client.query(sql, param)

  res.end('ok')
})

app.post('/note', async function (req, res) {
  const client = new Client(conString)
  await client.connect()

  const sql = 'UPDATE TODOS SET note = $1 WHERE task_id = $2;'
  const param = [req.body.note, req.body.id]
  await client.query(sql, param)

  res.end('ok')
})

app.listen(5433)
console.log('server listening at port 5433...')
