
let totalSumReal = 0
const getMoney = ( str ) => {
		str = parseInt( str.toString().replace(/[^\d]+/g,''))
		return str
}
const formatReal = ( num ) => {
	num = parseFloat(num.toString().replace(',',''))
	return num.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}
const SumReal = (value) =>{
	value = value.toString().replace(',','')
	totalSumReal += parseFloat(value.toString().replace(',',''))
	let result = formatReal(totalSumReal)

	return result
}
module.exports = () =>{
	return { formatReal, SumReal, getMoney }
}