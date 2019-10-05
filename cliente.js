'strict'

const soap = require('soap')
const url = 'https://blackjack-soap-server.herokuapp.com/Library?wsdls'

let myclient = null
async function getCliente() {
  if (myclient === null) {
    try {
      myclient = await soap.createClientAsync(url, { disableCache: true })
    } catch (error) {
      console.error(error)
    }
  }
  return myclient
}

module.exports = {
  getCliente: async () => await getCliente()
}
