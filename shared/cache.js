module.exports = (app) => {

    const resetCacheAll = () => {
        console.log('resetado')
        app.myCache.flushAll()
        app.myCache.flushStats()
    } 

    return { resetCacheAll }
}