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

async function pedirCarta() {
  if (myclient != null) {
    try {
      myclient.newCarta({ token: myclient.token }).then(result => {
        console.log(result.result)
      })
    } catch {
      console.error
    }
  } else {
    alert("ERROR: no hay cliente")
  }
}

async function plantar() {
  if (myclient != null) {
    try {
      myclient.plantar({ token: myclient.token }).then(result => {
        console.log(result.result)
      })
    } catch {
      console.error
    }
  } else {
    alert("ERROR: no hay cliente")
  }
}


module.exports = {
  getCliente: async () => await getCliente()
}
