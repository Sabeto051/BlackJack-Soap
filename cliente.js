'strict'

const soap = require('soap')
const url = 'https://blackjack-soap-server.herokuapp.com/Library?wsdl'

class Game {
  constructor(name = '') {
    this.name = name
  }
}

let game = new Game('test 2')

soap.createClient(url, { disableCache: true }, function(err, client) {
  if (err) throw err
  console.log(client.describe())
  client.gameStatus({ game }, (err, res) => {
    if (err) throw err

    console.log(res)
  })
})