const removeCharacterSpecial = (value) => {
	value = value.toString()
	value = value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\-]+/g, '-');
	//value = value.replace(/[^a-zA-Zs]/g, "")
	return value
}
module.exports = () => {
	return { removeCharacterSpecial }
}
