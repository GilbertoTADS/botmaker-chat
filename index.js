const api = require('./config/api.json')

const { app, rp, myCache } = require('./server')

const funcMessage = require('./actions/messages')( api, rp )

const talk = require('./config/talk.json')

const db = require('./database/connection')()

const { getClientByCPF, getTenPurchasesThisClient, updateContact } = require('./database/query')()

const menu = require('./bot/menu.js')
const { introduction, errorCPF, purchaseDetails } = require('./bot/mypurchases')()

app.get('/',(req, res) => {

    res.send('estamos em manutenção').end()

})

app.post('/',  async ( req, res ) => {

    let { chatPlatform, contactId, message, customerId, fromName } = req.body

    message = message ? message.replace(/ /g,'').toLowerCase() : undefined

        if(myCache.get(contactId+'action')){

            switch(myCache.get(contactId)){

                case contactId+'mypurchases':
                    introduction(message, getClientByCPF, myCache, funcMessage, db,contactId, talk)
                break;

                case contactId+'mypurchases-identified':
                    errorCPF(message, contactId, myCache, getTenPurchasesThisClient,getClientByCPF,updateContact, talk,db,funcMessage)
                break;

                case contactId+'mypurchases-successIdentified':
                    purchaseDetails(message,contactId,talk,db,funcMessage,myCache,getTenPurchasesThisClient)
                break; 

            }
        }

    menu(contactId, message, myCache, talk, funcMessage)
    
    res.status(200).send('pagina encontrada').end()

    })