const soap = require('soap')
const express = require('express')
const path = require('path')
const tokenizator = require('crypto')

class Game {
  constructor(name = '', status = 0) {
    this.name = name
    this.status = status
  }
}

let jugadores = []

let myService = {
  BlackJack: {
    GameBlackJack: {
      gameStatus: args => {
        let game = args.game
        games = [
          new Game('test 1', 1),
          new Game('test 2', 2),
          new Game('test 3', 3)
        ]

        findGame = gamee => {
          return gamee.name == game.name
        }

        return { status: games.find(findGame).status, test: 'Hola' }
      },

      conectarJugador: async args => {
        let token = await tokenizator.randomBytes(20)
        token = token.toString('hex')

        return { token: token }
      }
    }
  }
}

var xml = require('fs').readFileSync('Library.wsdl', 'utf8')

var app = express()

app.set('port', process.env.PORT || 3000)

app.use(express.json())

app.use(express.static(path.join(__dirname, 'public')))

app.listen(app.get('port'), function() {
  soap.listen(app, '/Library', myService, xml, function() {
    console.log(`server initialized on port ${app.get('port')}`)
    console.log('Lindo Hermoso')
  })
})
