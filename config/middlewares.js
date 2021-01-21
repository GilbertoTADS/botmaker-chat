const NodeCache =  require('node-cache')

module.exports = (app) => {

    const myCache = new NodeCache( { stdTTL: 100, checkperiod: 7200 } )

    return { myCache }
}
