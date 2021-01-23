let aux = 0
const stringToNumberCurrencyBRLSum = ( value ) => {
	value = parseInt(value.replace(/,/g,'.'))
	aux += value

	return `R$ ${aux.toFixed(2).replace('.',',')}`
}

module.exports = () =>{
	return { stringToNumberCurrencyBRLSum }
}