const  { app }  = require('./src/app')()
const middlewares = require('./src/config/middlewares')(app)
const server = require('./server')(app)

app.delete('/',(req, res) => {
    app.shared.cache.resetCacheAll()
    res.send('estamos em manutenção').end()

})


app.post('/',  async ( req, res ) => {
    
    const menu = app.bot.menu
    let result;

    let { chatPlatform, contactId, message, customerId, fromName } = req.body
    
    message = app.shared.text.OnlyCharacterLower(message)
   
    const client = { customerId, fromName, contactId, chatPlatform, message }

        if(app.myCache.get(contactId+'action')){

            const action = app.myCache.get(contactId+'action')
            const dialogs = app.bot.talks.dialogs[action]
            return await dialogs(req, res, client)
            
        }

    result = await menu(contactId,message)
    res.status(200).json(result)

    })