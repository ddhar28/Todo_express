const express = require('express')
const router = require('./routes.js')

const app = express()

app.use(express.static('public'))
app.use('/', router)

app.listen(5433)
console.log('server listening...')
