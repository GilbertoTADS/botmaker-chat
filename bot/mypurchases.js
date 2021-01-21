const { formatDateBRL } = require('./../shared/date')()
const { stringToNumberCurrencyBRLSum } = require('./../shared/number')()
const { convertUTF8 } = require('./../shared/text')()
const { decode,encode } = require ('html-entities')


module.exports = (app) => {

let runIntent = ''

const introduction = async (message,contactId) => {

    const cnpjCpf = message.replace(/[^\d]+/g,'')

    const data = await app.database.query.getClientByCPF(app.database.connection, cnpjCpf)

    app.myCache.set( contactId+'data-cpf' , cnpjCpf , app.myCache.options.stdTTL )

    if(data.length != 0 ){

        runIntent = 'mypurchases-identified'

        app.myCache.set( contactId , contactId+runIntent , app.myCache.options.stdTTL )

        for( idx in data[0] ){
            data[0][idx] = data[0][idx] == null ? 'não informado' : data[0][idx]
             
        }

        let messageFormated = app.talk.intent.myPurchases.identfied
            .replace('nameUser', data[0].NOME )
            .replace('addressUser', `${ data[0].ENDERECO}, ${data[0].NUMERO} - ${data[0].DESCRCIDADE }` )
            .replace('dateOfBirth',`${ data[0].DATANASCIMENTO }`)
        app.actions.messages.sendMessage(contactId, messageFormated )

    }else{
        app.myCache.del(contactId)
        app.myCache.del(contactId+'action')
        app.myCache.del(contactId+'data-cpf')

        app.actions.messages.sendMessage(contactId, app.talk.intent.myPurchases.errorCPF)
    }
    return runIntent

}

const errorCPF = async ( message, contactId ) => {
    
    if(message == 'a' || message == 'sim'){
        
        let cnpjcpf = app.myCache.get( contactId+'data-cpf').toString()

        app.database.query.getClientByCPF(app.database.connection, cnpjcpf)
            .then( client => {
                app.database.query.updateContact(app.database.connection,client, contactId)
            })
            .catch( error => console.log(error))


        let data = await app.database.query.getTenPurchasesThisClient(app.database.connection, cnpjcpf)

        let DTMOVIMENTO = formatDateBRL(data[0].DTMOVIMENTO)
        let TOTAL_SOMATORIA = 0
        
        for(let j = 0; j<=data.length-1; j++){

            TOTAL_SOMATORIA = stringToNumberCurrencyBRLSum(data[j].TOTAL)

        }

        let messageFormated = app.talk.intent.myPurchases.successIdentified
            .replace('nameUser', data[0].NOME)
            .replace('requestNumber', data[0].IDORCAMENTO )
            .replace('dataRequest', DTMOVIMENTO )
            .replace('totalValue', TOTAL_SOMATORIA )


        runIntent = 'mypurchases-successIdentified'

        app.myCache.set( contactId , contactId+runIntent , app.myCache.options.stdTTL )

        app.actions.messages.sendMessage(contactId, messageFormated)
    }else{
        app.myCache.del(contactId+'action')
        app.myCache.set( contactId , contactId+runIntent , app.myCache.options.stdTTL )
        app.actions.messages.sendMessage(contactId, app.talk.intent.myPurchases.errorIdenfied )
    }


}

const purchaseDetails = async (message,contactId) => {


    if(message == 'a' || message == 'sim'){

        app.actions.messages.sendMessage(contactId, app.talk.intent.myPurchases.finishIntent)

        let cnpjcpf = app.myCache.get( contactId+'data-cpf').toString()
        let data = await app.database.query.getTenPurchasesThisClient(app.database.connection, cnpjcpf)

        for(let x = 0; x <= data.length-1 ; x++){

            let messageFormated2 = ''

            for( idx in data[x]){
                data[x][idx] = data[x][idx] == null ? 'não informado' : data[x][idx]

                if(idx == 'DTMOVIMENTO'){
                    data[x][idx] = data[x][idx] == null ? 'não informado' : formatDateBRL(data[x][idx])
                }
               
                messageFormated2 = app.talk.intent.myPurchases.purchaseDetails
                    .replace('description',encode(data[x].DESCRICAOPRODUTO))
                    .replace('value',data[x].VALTOTLIQUIDO)
                    .replace('DatePurchase', data[x].DTMOVIMENTO )
            }
            app.actions.messages.sendMessage(contactId, messageFormated2)
        }
    }else{
        app.myCache.del(contactId+'action')
        app.myCache.set(contactId , contactId+runIntent , app.myCache.options.stdTTL)
        app.actions.messages.sendMessage(contactId, app.talk.intent.myPurchases.finishIntent)
    }

}


    return { introduction, errorCPF, purchaseDetails }
}