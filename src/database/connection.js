
module.exports = async () => {
    const ibmdb = require('ibm_db')
    process.env.DB2CODEPAGE = 1208;

    let connStr = "DATABASE=cisserp;HOSTNAME=192.168.1.135;PORT=50000;PROTOCOL=TCPIP;UID=dba;PWD=overhead";    

    const connect = ibmdb.open(connStr)
    return  connect
}