var ibmdb = require('ibm_db');

var connStr = "DATABASE=cisserp;HOSTNAME=192.168.1.135;PORT=50000;PROTOCOL=TCPIP;UID=dba;PWD=overhead";



module.exports = async () => {

    const connect = await ibmdb.open(connStr)

    return connect

}