const request = require('supertest')
const NodeCache =  require('node-cache')
const myCache = new NodeCache( { stdTTL: 100, checkperiod: 7200 } )
const talk  = require('./../../src/config/talk.json')

const API = 'http://localhost:3000'
beforeEach(() => {
    return request(`${API}`).delete('/')
})
test('Deve iniciar dialogo ao receber a mensagem MY PURCHASES sem diferenciar maiuscula de minuscula e ignorando espaços e acentos', () => {
    const USER = { chatPlatform:"whatsapp", fromName:"Gilberto Carlos", contactId:"5538992392297",message:"mY PURC haSES"}
    return request(`${API}`).post('/')
        .send(USER)
        .then( answer => {
            expect(answer.status).toBe(200)
            expect(answer.body).toHaveProperty("id")
            expect( answer.body ).toHaveProperty("problems",null )
        })
})

test('Deve buscar o usuario a partir do cpf ou cnpj AINDA QUE COM caracteres especiais', async () => {
    const USER = { chatPlatform:"whatsapp", fromName:"Gilberto Carlos", contactId:"5538992392297",message:"MYPURCHASES"}
    const init = await request(`${API}`).post('/').send(USER)
    USER.message = '(0,5.6#4$0%04=3+0@0-01{5]5;'
    return request(`${API}`).post('/')
        .send(USER)
        .then( answer => {
            expect(answer.status).toBe(200)
            expect(answer.body).toHaveProperty("NOME")
            expect(answer.body).toHaveProperty("CNPJCPF")
            expect(answer.body).toHaveProperty("DATANASCIMENTO")
            expect(answer.body).toHaveProperty("ENDERECO")
            expect(answer.body.response).toHaveProperty("id")
            expect(answer.body.response).toHaveProperty("problems",null)
        })
})

test('Deve encerrar o dialogo com o usuário caso ele não reconheça os dados pessoais apresentados', async () => {
    const USER = { chatPlatform:"whatsapp", fromName:"Gilberto Carlos", contactId:"5538992392297",message:"MYPURCHASES"}
    const init = await request(`${API}`).post('/').send(USER)
    USER.message = '(0,5.6#4$0%04=3+0@0-01{5]5;'
    const indenfied = await request(`${API}`).post('/').send(USER)
    USER.message = "não"
    return request(`${API}`).post('/')
        .send(USER)
        .then( answer => {    
            expect( answer.status ).toBe(200)
            expect( answer.body ).toHaveProperty("id")
            expect( answer.body ).toHaveProperty("problems",null)
            expect( answer.body ).toHaveProperty("answer",talk.intent.myPurchases.errorIdenfied)
        })
})
test('Deve informar que não há cadastro para o cpf informado caso nada seja encontrado', async () => {
    const USER = { chatPlatform:"whatsapp", fromName:"Gilberto Carlos", contactId:"5538992392297",message:"my purchases"}
    const res = await request(`${API}`).post('/').send(USER)

    USER.message = '938448035022'
    const res3 = await request(`${API}`).post('/').send(USER)
        .then( answer => {
            expect( answer.status ).toBe(200)
            expect( answer.body ).toHaveProperty("id")
            expect( answer.body ).toHaveProperty("problems",null)
            expect( answer.body ).toHaveProperty("answer",talk.intent.myPurchases.errorCPF)
        })
})

test('Deve apresentar o resumo da compra ao cliente caso reconheça os dados pessoais apresentados', async() => {
    const USER = { chatPlatform:"whatsapp", fromName:"Gilberto Carlos", contactId:"5538992392297",message:"my purchases"}
    const res = await request(`${API}`).post('/').send(USER)
    USER.message = '01785``62\\9000157'
    const res2 = await request(`${API}`).post('/').send(USER)
    USER.message = 'sim'
    const res3 = await request(`${API}`).post('/').send(USER)
        .then( answer => {
            expect( answer.status ).toBe(200)
            expect( answer.body ).toHaveProperty("id")
            expect( answer.body ).toHaveProperty("problems",null)
            expect( answer.body ).toHaveProperty("answer",talk.intent.myPurchases.successIdentified)
        })
})
test('Deve solicitar recursivamente uma resposta válida quanto aos dados obtidos via CPF', async () => {
    const USER = { chatPlatform:"whatsapp", fromName:"Gilberto Carlos", contactId:"5538992392297",message:"my purchases"}
    const res = await request(`${API}`).post('/').send(USER)
    USER.message = '734$298.5+66{0]4'
    const res2 = await request(`${API}`).post('/').send(USER)
    USER.message = 'resposta não esperada'
    
    for(let i=0; i<=2;i++){
        const res3 = await request(`${API}`).post('/').send(USER)
            .then( invalidRes => {
                expect( invalidRes.body ).toHaveProperty("answer",talk.intent.myPurchases.messageInvalidToCPF)
            })
    }

    USER.message = 'NÃO'
    const res4 = await request(`${API}`).post('/').send(USER)
        .then( answer => {
            expect( answer.status ).toBe(200)
            expect( answer.body ).toHaveProperty("id")
            expect( answer.body ).toHaveProperty("problems",null)
            expect( answer.body ).toHaveProperty("answer",talk.intent.myPurchases.errorIdenfied)
        })
})
test('Deve listar os detalhes das últimas 10 compras do usuário identificado', async () => {
    const USER = { chatPlatform:"whatsapp", fromName:"Gilberto Carlos", contactId:"5538992392297",message:"my purchases"}
    const res = await request(`${API}`).post('/').send(USER)
    USER.message = '01785``62\\9000157'
    const res2 = await request(`${API}`).post('/').send(USER)
    USER.message = 'sim'
    const res3 = await request(`${API}`).post('/').send(USER)
    const res4 = await request(`${API}`).post('/').send(USER)
        .then( answer => {
            expect( answer.status ).toBe(200)
            expect( answer.body ).toHaveProperty("id")
            expect( answer.body ).toHaveProperty("problems",null)
            expect( answer.body ).toHaveProperty("answer",talk.intent.myPurchases.purchaseDetails)
        })
})