let getClientByCPF = async (conn,cpfcnpj) => {
    let strQuery = `SELECT 
                        cf.IDCLIFOR,
                        cf.NOME,
                        cf.ENDERECO,
                        cf.CNPJCPF,
                        cf.NUMERO, 
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
    console.log('CPF: ->',cpfcnpj)

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

    

module.exports = ()=>{

    return { getClientByCPF, getTenPurchasesThisClient }

}