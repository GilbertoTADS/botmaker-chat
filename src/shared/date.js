const formatDateBRL = (data) => {
  data = data.toString()
  let year  = data.split("-")[0]
  let month  = data.split("-")[1]
  let day  = data.split("-")[2]

  return day + '/' + ("0"+month).slice(-2) + '/' + ("0"+year).slice(-2);
  // Utilizo o .slice(-2) para garantir o formato com 2 digitos.
}
module.exports = ()=>{
	return { formatDateBRL}
}