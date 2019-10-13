const tokenizator = require('crypto')

let jugadores = []

let serverStatus = {
  juegoComenzado: false,
  jugadoresConectados: 0,
  hayGanador: true
}

let casaStatus = {
  cartas: []
}

function conectarJugador(apuesta = 0) {
  let token = tokenizator.randomBytes(20)
  token = token.toString('hex')

  let player = {
    token,
    apuesta,
    numeroCartas: 0,
    cartas: []
  }
  jugadores.push(player)
  // console.log(jugadores)
  return token
}

module.exports = {
  conectarJugador
}
