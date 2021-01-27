

module.exports = () => {
    const app = require('express')()
    const consign = require('consign')
    const rp = require('request-promise')
    const api = require('./config/api.json')
    const talk = require('./config/talk.json')
    const NodeCache =  require('node-cache')
    const db = require('./database/connection')()

    const myCache = new NodeCache( { stdTTL: 100, checkperiod: 7200 } )
    app.myCache = myCache

    app.api = api
    app.talk = talk
    app.rp = rp
    app.db = db

    consign({cwd:'src', verbose:false})
        .then('./database')
        .then('./config')
        .then('./shared')
        .then('./actions')
        .then('./bot')
        .into(app)
       
    return { app }

}
