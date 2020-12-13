const express = require('express')
const app = express()
const port = 3000

//app.set('domain', '0.0.0.0');

app.get('/', (req, res) => {
  res.send('This is app1')
})

app.get('/app1', (req, res) => {
  res.send('This is NodeJS app1')
})

app.get('/ping', (req, res) => {
  res.send('Pong')
})


app.listen(port, '0.0.0.0', () => {
  console.log(`Example app listening at http://0.0.0.0:${port}`)
})