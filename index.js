const express = require('express')
const app = express()
const port = 3000

//app.set('domain', '0.0.0.0');

app.get('/', (req, res) => {
  res.send('This is app1')
})

app.get('/ping', (req, res) => {
  res.send('Pong')
})

app.get('/sendemail', (req, res) => {
  res.send('sending email')
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Example app listening at http://0.0.0.0:${port}`)
})