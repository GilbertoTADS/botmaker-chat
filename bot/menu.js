


module.exports = ( contactId,message, myCache, talk, funcMessage ) => {
    //DESIGN PATTERS: OBJECT LITERALS

    const intents = {
        "mypurchases" : ( ) => {
            runIntent = 'mypurchases'
            myCache.set( contactId , contactId+runIntent , myCache.options.stdTTL )
            myCache.set( contactId+'action' , contactId , myCache.options.stdTTL )
            funcMessage.sendMessage(contactId, talk.intent.myPurchases.introduction)
        }
    } 

    let action = intents[message]

    if(typeof action === 'function') action()
    //END DESIGN PATTERS: OBJECT LITERALS
}
