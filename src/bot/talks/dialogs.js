module.exports = (app) => {
    const introduction = app.bot.mypurchases.introduction
    const verifyCPF = app.bot.mypurchases.verifyCPF
    const purchaseDetails = app.bot.mypurchases.purchaseDetails

    const dialog = {
        "mypurchases": async (req, res, client) => {
            console.log(client)
            const contactId = client.contactId
            const message = client.message

            switch(app.myCache.get(contactId)){
    
                case contactId+'mypurchases':
                    result = await introduction(client.message,contactId)
                    res.status(200).json(result)
                break;
    
                case contactId+'mypurchases-identified':
                    result = await verifyCPF( message, contactId )
                    console.log(result)
                    res.status(200).json(result)
                break;
    
                case contactId+'mypurchases-successIdentified':
                    result = await purchaseDetails(message,contactId)
                    console.log(result)
                    res.status(200).json(result)
                break; 
            }
        }
    }
    return dialog 
}
