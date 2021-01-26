const  { app }  = require('./src/app')()
const middlewares = require('./src/config/middlewares')(app)
const server = require('./server')(app)

app.get('/',(req, res) => {

    res.send('estamos em manutenção').end()

})


app.post('/',  async ( req, res ) => {
    const menu = app.bot.menu
    const introduction = app.bot.mypurchases.introduction
    const verifyCPF = app.bot.mypurchases.verifyCPF
    const purchaseDetails = app.bot.mypurchases.purchaseDetails
    let result;

    let { chatPlatform, contactId, message, customerId, fromName } = req.body

    message = message ? message.replace(/ /g,'').toLowerCase() : undefined
    message = message.normalize('NFD').replace(/[\u0300-\u036f]/g, "")

    console.log(message)
        if(app.myCache.get(contactId+'action')){

            switch(app.myCache.get(contactId)){

                case contactId+'mypurchases':
                    result = await introduction(message,contactId)
                    res.status(200).json(result)
                break;

                case contactId+'mypurchases-identified':
                    result = await verifyCPF( message, contactId )
                    res.status(200).json(result)
                break;

                case contactId+'mypurchases-successIdentified':
                    result = await purchaseDetails(message,contactId)
                    res.status(200).json(result)
                break; 

            }
        }

    result = await menu(contactId,message)
    res.status(200).json(result)

    })