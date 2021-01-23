//const utf8 = require('utf8')
const { Buffer } = require('buffer');
const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf8');


const convertUTF8 = (value) =>{
	value = value.toString()
	const str = Buffer.from(value)
		y
	console.log(decoder.end(str))
	return str
	
}


module.exports = () => {
	return { convertUTF8 }
}
