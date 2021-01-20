let getClientByCPF = async (conn,cpfcnpj) => {
    let strQuery = `SELECT 
                        cf.IDCLIFOR,
                        cf.NOME,
                        cf.ENDERECO,
                        cf.CNPJCPF,
                        cf.NUMERO,
                        cf.FONE1,
                        cf.FONE2,
                        cf.FONECELULAR, 
                        ci.DESCRCIDADE,
                        ca.DATANASCIMENTO 
                    FROM 
                        CLIENTE_FORNECEDOR AS cf FULL JOIN CIDADES_IBGE AS ci
                            ON ( cf.IDCIDADE = ci.IDCIDADE ) FULL JOIN CLIENTE_AUTORIZADOS AS ca
                            ON( ca.IDCLIFOR = '${cpfcnpj}' )
                           
                    WHERE
                        cf.CNPJCPF = '${cpfcnpj}'      
                        LIMIT 1`



    let data = await conn.then(async(db) => {return await db.query(strQuery)})
    return data

}



let getTenPurchasesThisClient = async (conn,cpfcnpj) => {

    let strQuery = `SELECT
                        LOWER(o.NOME) AS NOME, 
                        o.IDORCAMENTO ,
                        Date(o.DTMOVIMENTO) AS  DTMOVIMENTO,
                        op.VALTOTLIQUIDO ,
                        sum(op.VALTOTLIQUIDO ) AS TOTAL,
                        op.QTDPRODUTO,
                        LOWER(pv.DESCRICAOPRODUTO) AS DESCRICAOPRODUTO 
                    FROM 
                        ORCAMENTO AS o FULL JOIN ORCAMENTO_PROD AS op 
                            ON(o.IDORCAMENTO = op.IDORCAMENTO ) FULL JOIN PRODUTOS_VIEW AS pv
                            ON(op.IDPRODUTO = pv.IDPRODUTO )
                    WHERE 
                        o.cnpjcpf = '${cpfcnpj}'
                        GROUP BY
                        o.NOME, 
                        o.IDORCAMENTO ,
                        o.DTMOVIMENTO ,
                        op.VALTOTLIQUIDO ,
                        op.QTDPRODUTO ,
                        pv.DESCRICAOPRODUTO
                    LIMIT '10'`

    
     let data = await conn.then(async(db) => {return await db.query(strQuery)})
    return data

}
let updateContact = (conn, client, contactId) => {
    console.log('ATUALIZANDO...')
    console.log(client)
     for(idx in client[0]){

        if(idx == 'FONE1' || idx == 'FONE2' || idx == 'FONECELULAR'){
            console.log('index: '+idx)
            console.log('encontrei campos de contato')
            console.log(client[0][idx])
            strUpdate = `UPDATE 
                            CLIENTE_FORNECEDOR 
                        SET
                            ${idx} = '${contactId}'
                        WHERE
                            CNPJCPF = '${client[0]['CNPJCPF']}'`

            switch(client[0][idx]){
                case null:
                    console.log('campo vazio sendo atualizado')
                    return conn.then(async(db) => {return await db.query(strUpdate)})
            }
        }
     }

}

    

module.exports = ()=>{


    return { getClientByCPF, getTenPurchasesThisClient, updateContact }

}