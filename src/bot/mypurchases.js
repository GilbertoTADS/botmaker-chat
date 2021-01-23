

module.exports = (app) => {

    const { formatDateBRL } = require('../shared/date')()
    const { stringToNumberCurrencyBRLSum } = require('../shared/number')()
    const { convertUTF8 } = require('../shared/text')()
    const { decode,encode } = require ('html-entities')
    const unidecode = require('unidecode')

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

        }else{
            myCache.del(contactId)
            myCache.del(contactId+'action')
            myCache.del(contactId+'data-cpf')

            sendMessage(contactId, answerCPF)
        }
        return runIntent

    }

    const verifyCPF = async ( message, contactId ) => {
        let answerSuccessIdentified = app.talk.intent.myPurchases.successIdentified
        
        if(message == 'a' || message == 'sim'){
            
            let cnpjcpf = myCache.get( contactId+'data-cpf').toString()

            getClientByCPF(db, cnpjcpf)
                .then( client => {
                    updateContact(db,client, contactId)
                })
                .catch( error => console.log(error))


            let data = await getTenPurchasesThisClient(db, cnpjcpf)

            let DTMOVIMENTO = formatDateBRL(data[0].DTMOVIMENTO)
            let TOTAL_SOMATORIA = 0
            
            for(let j = 0; j<=data.length-1; j++){

                TOTAL_SOMATORIA = stringToNumberCurrencyBRLSum(data[j].TOTAL)

            }

            let messageFormated = answerSuccessIdentified
                .replace('nameUser', data[0].NOME)
                .replace('requestNumber', data[0].IDORCAMENTO )
                .replace('dataRequest', DTMOVIMENTO )
                .replace('totalValue', TOTAL_SOMATORIA )


            runIntent = 'mypurchases-successIdentified'

            myCache.set( contactId , contactId+runIntent , myCache.options.stdTTL )

            sendMessage(contactId, messageFormated)
        }else{
            myCache.del(contactId+'action')
            myCache.set( contactId , contactId+runIntent , myCache.options.stdTTL )
            sendMessage(contactId, app.talk.intent.myPurchases.errorIdenfied )
        }


    }

const purchaseDetails = async (message,contactId) => {
    let answerFinishIntent = app.talk.intent.myPurchases.finishIntent
    let answerPurchaseDetails = app.talk.intent.myPurchases.purchaseDetails

    if(message == 'a' || message == 'sim'){

        sendMessage(contactId, answerFinishIntent)

        let cnpjcpf = myCache.get( contactId+'data-cpf')
        let data = await getTenPurchasesThisClient(db, cnpjcpf)

        for(let x = 0; x <= data.length-1 ; x++){

            let messageFormated2 = ''

            for( idx in data[x]){
                data[x][idx] = data[x][idx] == null ? 'não informado' : data[x][idx]

                if(idx == 'DTMOVIMENTO'){
                    data[x][idx] = data[x][idx] == null ? 'não informado' : formatDateBRL(data[x][idx])
                }
               
                messageFormated2 = answerPurchaseDetails
                    .replace('description',unidecode(data[x].DESCRICAOPRODUTO))
                    .replace('value',data[x].VALTOTLIQUIDO)
                    .replace('DatePurchase', data[x].DTMOVIMENTO )
            }
            sendMessage(contactId, messageFormated2)
        }
    }else{
        myCache.del(contactId+'action')
        myCache.set(contactId , contactId+runIntent , myCache.options.stdTTL)
        sendMessage(contactId, answerFinishIntent)
    }

}


    return { introduction, verifyCPF, purchaseDetails }
}