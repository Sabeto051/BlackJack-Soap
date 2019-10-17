const tokenizator = require('crypto')

let jugadores = []

let juegoStatus = {
  Comenzado: false,
  jugadoresConectados: 0,
  jugadorEnTurno: null, // posicion en array, casa es jugador -1
  terminado: false
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
    cartas: [],
    perdio: false,
    blackjack: false,
    posicionEnArray: jugadores.length,
    plantado: false
  }
  jugadores.push(player)

  juegoStatus.jugadoresConectados += 1
  juegoStatus.juegoComenzado = true

  // SE empieza el CONTEO

  return token
}

/* 
  Conteo para que empiece el juego
  cuando se acaba, o cancela porque hay 2 jugadores jugando
  llama a empezarJuego()
*/
function conteoJuegoInicio() {}

/* 
  Reparte y crea las cartas de jugadores y casa
*/
function empezarJuego() {}

/* 
  Crea una carta (numero random 1-52)
  server no pinta carta, lo hace el cliente
*/
function newCarta() {}

/* 
  Conteo de cartas
*/
function contarCartas() {}

/* 
  verifica si un jugador está en el turno actual
*/
function verificarJugadorEnTuno(token) {}

/* 
  valida que jugador juega despues, o si la casa juega despues
  puede llama funcion jugarCasa()
*/
function siguienteTurno() {}

/* 
  juega la casa (despues de q todos jugadores jugaron)
  Casa puede pedir mas cartas, se puede pasar en puntos, etc...
*/
function jugarCasa() {}

/* 
  Verifica quien Gana al FINAL y devuelve o se queda con la plata de las apuestas
*/
function verificarQuienGana() {}

/* 
  resetea todo, se envia a clientes si ganaron o perdieron
  Se tiene que esperar 20 segundos mostranso los mensajes de fin
  Luego del tiempo se inicia el proceso otra vez
*/
function terminarJuego() {}

/* 
  PETICION cliente
  Jugador se planta y envia su token de verificacion
  llama a verificarJugadorEnTuno para ver si es su turno
*/
function plantar(token) {}

/* 
  PETICION cliente
  Jugador lo invoca y envia su token de verificacion
  llama a verificarJugadorEnTuno para ver si es su turno
*/
function cartaCartaAdicional(token) {}

/* 
  PETICION GET cliente
  Devuelve solo una carta de la casa, porque la otra es oculta
*/
function casaStatusRequest() {}

/* 
  PETICION GET cliente
  Retorna el jugador en la pos del array requerida
*/
function jugadorStatusRequest(posicionEnArray) {}

/* 
  PETICION POST cliente
  Retorna el server status
*/
function juegoStatusRequest() {}

module.exports = {
  conectarJugador
}
