const path = require('path')
const express = require('express')
const request = require('request')
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

app.get('/location1', (req, res) => {
	const url="https://freegeoip.app/json"
	request({ url: url, json: true}, (error, response) => {
		if(error){
		    res.send("Unable to access weather service at this time.")
		} else if (response.body.error) {
		    res.send("unable to location data for given location")
		} else {
			res.send(response.body)
		}
	})
})


app.get('/location', (req, res) => {
	res.sendFile(path.join(__dirname,'location.html'))
})


app.listen(port, '0.0.0.0', () => {
  console.log(`Example app listening at http://0.0.0.0:${port}`)
})
