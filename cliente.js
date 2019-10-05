'strict'

const soap = require('soap')
const url = 'http://localhost:3000/Library?wsdl'

// class Game {
//   constructor(name = '') {
//     this.name = name
//   }
// }

// let game = new Game('test 1')

// soap.createClient(url, { disableCache: true }, function(err, client) {
//   if (err) throw err
//   // console.log(client.describe())
//   client.gameStatus({ game }, (err, res) => {
//     if (err) throw err

//     console.log(res)
//   })
// })

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

// getCliente().then(c => {
//   c.gameStatus({ game }, (err, res) => {
//     if (err) throw err

//     console.log(res)
//   })
// })

module.exports = {
  getCliente: async () => await getCliente()
}
