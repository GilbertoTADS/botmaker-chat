

module.exports = (app) => {

    const { formatDateBRL } = require('../shared/date')()
    const { formatReal, SumReal } = require('../shared/number')()
    
    const sendMessage = app.actions.messages.sendMessage
    const db = app.database.connection
    const updateContact = app.database.query.updateContact
    const getTenPurchasesThisClient = app.database.query.getTenPurchasesThisClient
    const getClientByCPF = app.database.query.getClientByCPF
    const myCache = app.myCache

    let runIntent = ''

    const introduction = async (message,contactId) => {
        const answeridentfied = app.talk.intent.myPurchases.identfied
        const answerCPF = app.talk.intent.myPurchases.errorCPF

        const cnpjCpf = message.replace(/[^\d]+/g,'')

        const data = await getClientByCPF(db, cnpjCpf)

        myCache.set( contactId+'data-cpf' , cnpjCpf , myCache.options.stdTTL )

        if(data.length != 0 ){

            runIntent = 'mypurchases-identified'

            myCache.set( contactId , contactId+runIntent , myCache.options.stdTTL )

            for( idx in data[0] ){
                data[0][idx] = data[0][idx] == null ? 'não informado' : data[0][idx]
                
            }

            let messageFormated = answeridentfied
                .replace('nameUser', data[0].NOME )
                .replace('addressUser', `${ data[0].ENDERECO}, ${data[0].NUMERO} - ${data[0].DESCRCIDADE }` )
                .replace('dateOfBirth',`${ data[0].DATANASCIMENTO }`)
            sendMessage(contactId, messageFormated )
            return data[0]
        }else{
            myCache.del(contactId)
            myCache.del(contactId+'action')
            myCache.del(contactId+'data-cpf')
            const res = await sendMessage(contactId, answerCPF)
            res.answer = answerCPF
            return res
        }

    }

    const verifyCPF = async ( message, contactId ) => {
        let answerSuccessIdentified = app.talk.intent.myPurchases.successIdentified
        
        if(message == 'a' || message == 'sim'){
            
            let cnpjcpf = myCache.get( contactId+'data-cpf').toString()

            getClientByCPF(db, cnpjcpf)
                .then( client => {
                    updateContact(db,client, contactId)
                })
                .catch( error =>  error )


            let data = await getTenPurchasesThisClient(db, cnpjcpf)

            let DTMOVIMENTO = formatDateBRL(data[0].DTMOVIMENTO)
            let TOTAL_SOMATORIA = 0
            
            for(let j = 0; j<=data.length-1; j++){
                TOTAL_SOMATORIA = SumReal(data[j].TOTAL)
            }

            let messageFormated = answerSuccessIdentified
                .replace('nameUser', data[0].NOME)
                .replace('requestNumber', data[0].IDORCAMENTO )
                .replace('dataRequest', DTMOVIMENTO )
                .replace('totalValue', TOTAL_SOMATORIA )
            runIntent = 'mypurchases-successIdentified'

            myCache.set( contactId , contactId+runIntent , myCache.options.stdTTL )
            const res = await sendMessage(contactId, messageFormated)
            res.answer = app.talk.intent.myPurchases.successIdentified
            return res
        }
        if(message == 'b' || message == 'nao'){
            myCache.del(contactId+'action')
            myCache.del(contactId+'data-cpf')
            myCache.set( contactId , contactId+runIntent , myCache.options.stdTTL )
            const res = await sendMessage(contactId, app.talk.intent.myPurchases.errorIdenfied )
            res.answer = app.talk.intent.myPurchases.errorIdenfied
            return res
        }
        if(message != 'a' && message != 'b' && message != 'sim' && message != 'nao'){
            const res = await sendMessage(contactId, app.talk.intent.myPurchases.messageInvalidToCPF )
            res.answer = app.talk.intent.myPurchases.messageInvalidToCPF
            return res

        }
    }

const purchaseDetails = async (message,contactId) => {
    let answerFinishIntent = app.talk.intent.myPurchases.finishIntent
    let answerPurchaseDetails = app.talk.intent.myPurchases.purchaseDetails

    if(message == 'a' || message == 'sim'){

        sendMessage(contactId, answerFinishIntent)

        let cnpjcpf = myCache.get( contactId+'data-cpf')
        let data = await getTenPurchasesThisClient(db, cnpjcpf)
        
        let res;
        for(let x = 0; x <= data.length-1 ; x++){

            let messageFormated2 = ''

            for( idx in data[x]){
                data[x][idx] = data[x][idx] == null ? 'não informado' : data[x][idx]

                if(idx == 'DTMOVIMENTO'){
                    data[x][idx] = data[x][idx] == null ? 'não informado' : formatDateBRL(data[x][idx])
                }
               
                messageFormated2 = answerPurchaseDetails
                    .replace('description', data[x].DESCRICAOPRODUTO)
                    .replace('value',formatReal(data[x].VALTOTLIQUIDO))
                    .replace('qttForProduct',data[x].QTDPRODUTO )
                    .replace('DatePurchase', data[x].DTMOVIMENTO )
            }
            res = await sendMessage(contactId, messageFormated2)
        }
        res.answer = app.talk.intent.myPurchases.purchaseDetails
        return res
    }
    if(message == 'b' || message == 'nao'){
        myCache.del(contactId+'action')
        myCache.del(contactId+'data-cpf')
        myCache.set(contactId , contactId+runIntent , myCache.options.stdTTL)
        sendMessage(contactId, answerFinishIntent)
    }

}


    return { introduction, verifyCPF, purchaseDetails }
}