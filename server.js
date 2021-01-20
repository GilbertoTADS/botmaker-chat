const app = require('express')()

const rp = require('request-promise')

const cors = require('cors')

const bodyParser = require('body-parser')

const NodeCache =  require('node-cache')

const myCache = new NodeCache( { stdTTL: 100, checkperiod: 7200 } )

app.use(bodyParser.json())

app.use(cors())

app.listen(3000,() => console.log('server started'))

module.exports = { app,rp, myCache }