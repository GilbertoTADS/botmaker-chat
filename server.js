
module.exports = (app) => {

    app.listen(3000,() => console.log('server started'))
    
    return {app}
}