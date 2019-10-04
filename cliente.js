'strict'

const soap = require('soap')
const url = 'https://blackjack-soap-server.herokuapp.com/Library?wsdl'

class Book {
  constructor(name = '', year = 0) {
    this.name = name
    this.year = year
  }
}

let book = new Book('test 2')

let clienteInstagram = null

async function getClienteInsta() {
  if (clienteInstagram === null) {
    try {
      clienteInstagram = await soap.createClientAsync(url, {
        disableCache: true
      })

      clienteInstagram.bookYear({ book }, async (err, res) => {
        if (err) throw err
        console.log(res)
      })
    } catch (error) {
      console.error(error)
    }
  }
  return clienteInstagram
}

let aa = getClienteInsta()

// aa.bookYear({ book }, async (err, res) => {
//   if (err) throw err
//   console.log(res)
// })

// module.exports = {
//   getCliente: getClienteInsta()
// }
