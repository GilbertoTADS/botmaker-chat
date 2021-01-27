module.exports = (app) =>{
    const OnlyCharacterLower = (str) => {

        str = str ? str.replace(/ /g,'').toLowerCase() : undefined
        str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
        return str
    }
    return { OnlyCharacterLower }
}
    