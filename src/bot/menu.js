
module.exports = ( app ) => {

    const answer = app.talk.intent.myPurchases.introduction

    const inited = ( contactId,message ) => {
        const intents = {
            "mypurchases" : async ( ) => {
                runIntent = 'mypurchases'
                app.myCache.set( contactId , contactId+runIntent , app.myCache.options.stdTTL )
                app.myCache.set( contactId+'action' , contactId , app.myCache.options.stdTTL )
                return await app.actions.messages.sendMessage(contactId, answer)
            }
        } 
        
        let action = intents[message]
        if(typeof action === 'function') return action()

    }

    
    
    return inited 
}
