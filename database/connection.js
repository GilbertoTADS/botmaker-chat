var ibmdb = require('ibm_db');

var connStr = "DATABASE=name-database;HOSTNAME=999.999.999.999;PORT=00000;PROTOCOL=TCPIP;UID=user-database;PWD=passwd-database";



module.exports = async () => {

    const connect = await ibmdb.open(connStr)

    return connect

}
