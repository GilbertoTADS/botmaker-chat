
module.exports = (app)=>{

    const getClientByCPF = async (conn,cpfcnpj) => {
        
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
                            LIMIT '1'`
    
        const data = await conn.then(async(db) => { return await db.query(strQuery)})
        
        return data
    
    }
    

    const getTenPurchasesThisClient = async (conn,cpfcnpj) => {
    
        let strQuery = `SELECT
                            LOWER(o.NOME) AS NOME, 
                            o.IDORCAMENTO ,
                            Date(o.DTMOVIMENTO) AS  DTMOVIMENTO,
                            op.VALTOTLIQUIDO ,
                            SUM(op.VALTOTLIQUIDO*op.QTDPRODUTO ) AS TOTAL,
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
    return conn.then( async( db ) => { return await db.query(strQuery)} )
    }
    const updateContact = (conn, client, contactId) => {
         for(idx in client[0]){
    
            if(idx == 'FONE1' || idx == 'FONE2' || idx == 'FONECELULAR'){
                strUpdate = `UPDATE 
                                CLIENTE_FORNECEDOR 
                            SET
                                ${idx} = '${contactId}'
                            WHERE
                                CNPJCPF = '${client[0]['CNPJCPF']}'`
    
                switch(client[0][idx]){
                    case null:
                        conn.then( async( db ) => { return await db.query(strUpdate) } )
                    break;
                }
            }
         }
    
    }
    return { getClientByCPF, getTenPurchasesThisClient, updateContact }

}