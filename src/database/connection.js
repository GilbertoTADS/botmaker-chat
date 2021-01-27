
module.exports = async () => {
    const ibmdb = require('ibm_db')
    process.env.DB2CODEPAGE = 1208;

    let connStr = "DATABASE=database;HOSTNAME=host;PORT=50000;PROTOCOL=TCPIP;UID=user;PWD=pass";    

    const connect = ibmdb.open(connStr)
    return  connect
}
