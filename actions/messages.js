module.exports = (app) => {
    
    const options = {

        method: 'POST',

        uri: 'https://go.botmaker.com/api/v1.0/message/v3',

        headers:{

            'Content-Type': 'application/json',

            'Accept': 'application/json',

            'access-token': app.api.key[3]['refresh-token']

         },

         body:{

                "chatPlatform": "whatsapp",

              "chatChannelNumber": app.api.key[5].chatChannelNumber

              },

            json:true

        }


    const sendMessage = async ( contactId, message ) => {

        options.body.messageText = message

        options.body.platformContactId = contactId

        result = await app.rp(options)

        delete options.body.messageText

        return result

    }

    return { sendMessage }
}

