module.exports = (api, rp) => {
    const options = {
        method: 'POST',
        uri: 'https://go.botmaker.com/api/v1.0/message/v3',
        headers:{
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'access-token': api.key['refresh-token']
         },
         body:{
                "chatPlatform": "whatsapp",
                "chatChannelNumber": api.key.chatChannelNumber
              },
            json:true
        }
    
    let sendMessage = async ( contactId, message ) => {
        options.body.messageText = message
        options.body.platformContactId = contactId
        result = await rp(options)
        delete options.body.messageText
        return result
    }
    return { sendMessage }
}
