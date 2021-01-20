const { formatDateBRL } = require('./../shared/date')()
const { stringToNumberCurrencyBRLSum } = require('./../shared/number')()
const utf8 = require('utf8')
const { removeCharacterSpecial } = require('./../shared/text')()

let runIntent = ''

const introduction = async (message, getClientByCPF, myCache, funcMessage, db,contactId, talk) => {

    let cnpjCpf = message.replace(/[^\d]+/g,'')

    let data = await getClientByCPF(db, cnpjCpf)

    myCache.set( contactId+'data-cpf' , cnpjCpf , myCache.options.stdTTL )

    if(data.length != 0 ){

        runIntent = 'mypurchases-identified'

        myCache.set( contactId , contactId+runIntent , myCache.options.stdTTL )

        for( idx in data[0] ){
            data[0][idx] = data[0][idx] == null ? 'não informado' : data[0][idx]
             
        }

        let messageFormated = talk.intent.myPurchases.identfied
            .replace('nameUser', data[0].NOME )
            .replace('addressUser', `${ data[0].ENDERECO}, ${data[0].NUMERO} - ${data[0].DESCRCIDADE }` )
            .replace('dateOfBirth',`${ data[0].DATANASCIMENTO }`)
        funcMessage.sendMessage(contactId, messageFormated )

    }else{
        myCache.del(contactId)
        myCache.del(contactId+'action')
        myCache.del(contactId+'data-cpf')

        funcMessage.sendMessage(contactId, talk.intent.myPurchases.errorCPF)
    }
    return runIntent

}

const errorCPF = async (message, contactId, myCache, getTenPurchasesThisClient, talk, db,funcMessage) => {
    
    if(message == 'a' || message == 'sim'){
        
        let cnpjcpf = myCache.get( contactId+'data-cpf').toString()

        let data = await getTenPurchasesThisClient(db, cnpjcpf)

        let DTMOVIMENTO = formatDateBRL(data[0].DTMOVIMENTO)
        let TOTAL_SOMATORIA = 0
        
        for(let j = 0; j<=data.length-1; j++){

            TOTAL_SOMATORIA = stringToNumberCurrencyBRLSum(data[j].TOTAL)

        }

        let messageFormated = talk.intent.myPurchases.successIdentified
            .replace('nameUser', data[0].NOME)
            .replace('requestNumber', data[0].IDORCAMENTO )
            .replace('dataRequest', DTMOVIMENTO )
            .replace('totalValue', TOTAL_SOMATORIA )


        runIntent = 'mypurchases-successIdentified'

        myCache.set( contactId , contactId+runIntent , myCache.options.stdTTL )

        funcMessage.sendMessage(contactId, messageFormated)
    }else{
        myCache.del(contactId+'action')
        myCache.set( contactId , contactId+runIntent , myCache.options.stdTTL )
        funcMessage.sendMessage(contactId, talk.intent.myPurchases.errorIdenfied )
    }


}

const purchaseDetails = async (message,contactId,talk,db,funcMessage,myCache,getTenPurchasesThisClient) => {


    if(message == 'a' || message == 'sim'){

        funcMessage.sendMessage(contactId, talk.intent.myPurchases.finishIntent)

        let cnpjcpf = myCache.get( contactId+'data-cpf').toString()
        let data = await getTenPurchasesThisClient(db, cnpjcpf)

        for(let x = 0; x <= data.length-1 ; x++){

            let messageFormated2 = ''

            for( idx in data[x]){
                data[x][idx] = data[x][idx] == null ? 'não informado' : data[x][idx]

                if(idx == 'DTMOVIMENTO'){
                    data[x][idx] = data[x][idx] == null ? 'não informado' : formatDateBRL(data[x][idx])
                }
               
                messageFormated2 = talk.intent.myPurchases.purchaseDetails
                    .replace('description',data[x].DESCRICAOPRODUTO)
                    .replace('value',data[x].VALTOTLIQUIDO)
                    .replace('DatePurchase', data[x].DTMOVIMENTO )
            }
            funcMessage.sendMessage(contactId, messageFormated2)
        }
    }else{
        myCache.del(contactId+'action')
        myCache.set(contactId , contactId+runIntent , myCache.options.stdTTL)
        funcMessage.sendMessage(contactId, talk.intent.myPurchases.finishIntent)
    }

}

module.exports = () => {
    return { introduction, errorCPF, purchaseDetails }
}