
module.exports = (app) => {

    const cors = require('cors')
    const bodyParser = require('body-parser')



    app.use(bodyParser.json())
    app.use(cors())

    return { app }
}
